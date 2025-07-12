// Transaction service for handling transactions
import { getSupabaseClient } from "../config/supabase.js";
import { Transaction } from "../models/Transaction.js";

export class TransactionService {
  constructor() {
    this.supabase = getSupabaseClient();
    this.transactionCache = [];
    this.lastFetch = null;
    this.cacheTimeout = 2 * 60 * 1000; // 2 minutes cache for transactions
  }

  // Check if cache is valid
  isCacheValid() {
    return this.lastFetch && (Date.now() - this.lastFetch) < this.cacheTimeout;
  }

  // Save transaction to Supabase with retry mechanism
  async saveTransaction(transactionData) {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        if (this.supabase) {
          // Prepare transaction data for Supabase
          const transactionPayload = {
            items: JSON.stringify(transactionData.items),
            subtotal: transactionData.subtotal,
            tax: transactionData.tax,
            total: transactionData.total,
            payment_method: transactionData.paymentMethod,
            timestamp: transactionData.timestamp || new Date().toISOString(),
            created_at: new Date().toISOString()
          };

          const { data, error } = await this.supabase
            .from('transactions')
            .insert(transactionPayload)
            .select()
            .single();

          if (error) throw error;

          // Add to cache
          this.transactionCache.unshift(data);
          
          console.log("Transaction saved to Supabase:", data.id);
          return { success: true, id: data.id, data };
        } else {
          // Fallback: save to localStorage when Supabase is not available
          const transaction = {
            id: Date.now(),
            ...transactionData,
            timestamp: transactionData.timestamp || new Date().toISOString()
          };
          
          const existingTransactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
          existingTransactions.unshift(transaction);
          
          // Keep only last 100 transactions in localStorage
          if (existingTransactions.length > 100) {
            existingTransactions.splice(100);
          }
          
          localStorage.setItem('pos_transactions', JSON.stringify(existingTransactions));
          
          console.log("Transaction saved to localStorage:", transaction.id);
          return { success: true, id: transaction.id, data: transaction };
        }
      } catch (error) {
        retryCount++;
        console.error(`Error saving transaction (attempt ${retryCount}):`, error);
        
        if (retryCount >= maxRetries) {
          // Final fallback: save to localStorage
          try {
            const transaction = {
              id: Date.now(),
              ...transactionData,
              timestamp: transactionData.timestamp || new Date().toISOString(),
              sync_status: 'pending' // Mark for later sync
            };
            
            const existingTransactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
            existingTransactions.unshift(transaction);
            localStorage.setItem('pos_transactions', JSON.stringify(existingTransactions));
            
            console.log("Transaction saved to localStorage as fallback:", transaction.id);
            return { success: true, id: transaction.id, data: transaction, fallback: true };
          } catch (fallbackError) {
            console.error("Failed to save transaction to localStorage:", fallbackError);
            return { success: false, error: fallbackError.message };
          }
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  }

  // Get transaction history with caching
  async getTransactionHistory(limit = 50, offset = 0) {
    try {
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('transactions')
          .select('*')
          .order('timestamp', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;

        // Update cache
        if (offset === 0) {
          this.transactionCache = data;
          this.lastFetch = Date.now();
        }

        return data;
      } else {
        // Fallback: get from localStorage
        const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
        return transactions.slice(offset, offset + limit);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      
      // Return cached data if available
      if (this.transactionCache.length > 0) {
        console.log("Returning cached transaction data");
        return this.transactionCache.slice(offset, offset + limit);
      }
      
      // Final fallback: localStorage
      const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
      return transactions.slice(offset, offset + limit);
    }
  }

  // Get transaction by ID
  async getTransactionById(id) {
    try {
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('transactions')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      } else {
        const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
        return transactions.find(t => t.id === id);
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return null;
    }
  }

  // Get sales analytics
  async getSalesAnalytics(startDate, endDate) {
    try {
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('transactions')
          .select('total, timestamp, payment_method')
          .gte('timestamp', startDate)
          .lte('timestamp', endDate)
          .order('timestamp', { ascending: false });

        if (error) throw error;

        // Calculate analytics
        const totalSales = data.reduce((sum, t) => sum + t.total, 0);
        const transactionCount = data.length;
        const averageTransaction = transactionCount > 0 ? totalSales / transactionCount : 0;
        
        const paymentMethods = data.reduce((acc, t) => {
          acc[t.payment_method] = (acc[t.payment_method] || 0) + 1;
          return acc;
        }, {});

        return {
          totalSales,
          transactionCount,
          averageTransaction,
          paymentMethods,
          transactions: data
        };
      } else {
        // Fallback analytics from localStorage
        const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
        const filtered = transactions.filter(t => {
          const date = new Date(t.timestamp);
          return date >= new Date(startDate) && date <= new Date(endDate);
        });

        const totalSales = filtered.reduce((sum, t) => sum + t.total, 0);
        const transactionCount = filtered.length;
        const averageTransaction = transactionCount > 0 ? totalSales / transactionCount : 0;
        
        const paymentMethods = filtered.reduce((acc, t) => {
          acc[t.payment_method] = (acc[t.payment_method] || 0) + 1;
          return acc;
        }, {});

        return {
          totalSales,
          transactionCount,
          averageTransaction,
          paymentMethods,
          transactions: filtered
        };
      }
    } catch (error) {
      console.error("Error fetching sales analytics:", error);
      return {
        totalSales: 0,
        transactionCount: 0,
        averageTransaction: 0,
        paymentMethods: {},
        transactions: []
      };
    }
  }

  // Sync pending transactions (for offline support)
  async syncPendingTransactions() {
    if (!this.supabase) return { success: false, message: "Supabase not available" };

    try {
      const transactions = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
      const pendingTransactions = transactions.filter(t => t.sync_status === 'pending');

      if (pendingTransactions.length === 0) {
        return { success: true, synced: 0 };
      }

      let syncedCount = 0;
      const errors = [];

      for (const transaction of pendingTransactions) {
        try {
          const { sync_status, ...transactionData } = transaction;
          const result = await this.saveTransaction(transactionData);
          
          if (result.success) {
            // Remove from localStorage or mark as synced
            transaction.sync_status = 'synced';
            syncedCount++;
          }
        } catch (error) {
          errors.push({ transaction: transaction.id, error: error.message });
        }
      }

      // Update localStorage
      localStorage.setItem('pos_transactions', JSON.stringify(transactions));

      return {
        success: true,
        synced: syncedCount,
        errors: errors.length > 0 ? errors : null
      };
    } catch (error) {
      console.error("Error syncing transactions:", error);
      return { success: false, error: error.message };
    }
  }

  // Clear cache
  clearCache() {
    this.transactionCache = [];
    this.lastFetch = null;
  }
}
