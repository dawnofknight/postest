// Transaction service for handling transactions
import { initSupabase } from "../config/supabase.js";

export class TransactionService {
  constructor() {
    this.supabase = initSupabase();
  }

  // Save transaction to Supabase
  async saveTransaction(transaction) {
    try {
      // When Supabase is implemented:
      // const { data, error } = await this.supabase
      //   .from('transactions')
      //   .insert(transaction.toJSON());
      //
      // if (error) throw error;
      // return data;

      // For now, just log the transaction
      console.log("Transaction saved:", transaction.toJSON());
      return { success: true, id: Date.now() };
    } catch (error) {
      console.error("Error saving transaction:", error);
      return { success: false, error };
    }
  }

  // Get transaction history
  async getTransactionHistory() {
    try {
      // When Supabase is implemented:
      // const { data, error } = await this.supabase
      //   .from('transactions')
      //   .select('*')
      //   .order('timestamp', { ascending: false });
      //
      // if (error) throw error;
      // return data;

      // For now, return empty array
      return [];
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      return [];
    }
  }
}
