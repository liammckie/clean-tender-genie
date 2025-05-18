
import { supabase } from '@/integrations/supabase/client';

export interface RftTask {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  rftFileId?: string;
  outputFileId?: string;
  dueDate?: string;
}

export const rftTaskService = {
  async listTasks(): Promise<RftTask[]> {
    try {
      const { data, error } = await supabase
        .from('rft_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (
        data?.map((row: any) => ({
          id: row.id,
          name: row.name,
          status: row.status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          rftFileId: row.rft_file_id ?? undefined,
          outputFileId: row.output_file_id ?? undefined,
          dueDate: row.due_date ?? undefined,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  async getTask(taskId: string): Promise<RftTask | null> {
    try {
      const { data, error } = await supabase
        .from('rft_tasks')
        .select('*')
        .eq('id', taskId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        rftFileId: data.rft_file_id ?? undefined,
        outputFileId: data.output_file_id ?? undefined,
        dueDate: data.due_date ?? undefined,
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      throw error;
    }
  },
};
