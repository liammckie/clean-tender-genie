
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
      // This would normally query Supabase, but for now we'll return mock data
      return [
        {
          id: 'task-001',
          name: 'Commercial Cleaning Services RFT',
          status: 'completed',
          createdAt: '2025-05-16T10:00:00Z',
          updatedAt: '2025-05-16T12:30:00Z',
          rftFileId: '1ULtJBBqNdJXHadeW0RfBpvYqRvV2VOTi',
          outputFileId: '1VLtYBBqJdJaHadeC0RfByvYqMvV2VOFj',
          dueDate: '2025-05-25T23:59:59Z'
        },
        {
          id: 'task-002',
          name: 'Office Maintenance RFT',
          status: 'processing',
          createdAt: '2025-05-17T08:15:00Z',
          updatedAt: '2025-05-17T08:20:00Z',
          rftFileId: '2XYtJBBqNdKLHadeW0RfBpvSqBvV2VOPl',
          dueDate: '2025-05-30T23:59:59Z'
        },
        {
          id: 'task-003',
          name: 'Hospital Cleaning Contract',
          status: 'pending',
          createdAt: '2025-05-17T09:45:00Z',
          updatedAt: '2025-05-17T09:45:00Z',
          rftFileId: '3ZUtJBBsNdLMHadeW0RfBpvQqCvV2VOMn',
          dueDate: '2025-06-10T23:59:59Z'
        }
      ];

      // In a real implementation, this would be:
      // const { data, error } = await supabase
      //   .from('rft_tasks')
      //   .select('*')
      //   .order('createdAt', { ascending: false });
      
      // if (error) throw error;
      // return data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  async getTask(taskId: string): Promise<RftTask | null> {
    try {
      // This would normally query Supabase, but for now we'll return mock data
      const tasks = await this.listTasks();
      return tasks.find(task => task.id === taskId) || null;

      // In a real implementation, this would be:
      // const { data, error } = await supabase
      //   .from('rft_tasks')
      //   .select('*')
      //   .eq('id', taskId)
      //   .single();
      
      // if (error) throw error;
      // return data;
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      throw error;
    }
  }
};
