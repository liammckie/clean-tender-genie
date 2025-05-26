
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
  description?: string;
  requirements?: any;
  progress?: {
    parsing: boolean;
    analysis: boolean;
    drafting: boolean;
    validation: boolean;
    formatting: boolean;
  };
  filePath?: string;
  responsePath?: string;
  userId?: string;
}

type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface TaskProgress {
  parsing: boolean;
  analysis: boolean;
  drafting: boolean;
  validation: boolean;
  formatting: boolean;
}

// Type guard to check if data is valid TaskProgress
function isValidTaskProgress(data: any): data is TaskProgress {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.parsing === 'boolean' &&
    typeof data.analysis === 'boolean' &&
    typeof data.drafting === 'boolean' &&
    typeof data.validation === 'boolean' &&
    typeof data.formatting === 'boolean'
  );
}

// Default progress object
const defaultProgress: TaskProgress = {
  parsing: false,
  analysis: false,
  drafting: false,
  validation: false,
  formatting: false
};

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
          status: row.status as TaskStatus,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          rftFileId: row.rft_file_id ?? undefined,
          outputFileId: row.output_file_id ?? undefined,
          dueDate: row.due_date ?? undefined,
          description: row.description ?? undefined,
          requirements: row.requirements ?? undefined,
          progress: isValidTaskProgress(row.progress) ? row.progress : defaultProgress,
          filePath: row.file_path ?? undefined,
          responsePath: row.response_path ?? undefined,
          userId: row.user_id ?? undefined,
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
        status: data.status as TaskStatus,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        rftFileId: data.rft_file_id ?? undefined,
        outputFileId: data.output_file_id ?? undefined,
        dueDate: data.due_date ?? undefined,
        description: data.description ?? undefined,
        requirements: data.requirements ?? undefined,
        progress: isValidTaskProgress(data.progress) ? data.progress : defaultProgress,
        filePath: data.file_path ?? undefined,
        responsePath: data.response_path ?? undefined,
        userId: data.user_id ?? undefined,
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      throw error;
    }
  },

  async createTask(task: Partial<RftTask>): Promise<RftTask> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!task.name) throw new Error('Task name is required');

      const { data, error } = await supabase
        .from('rft_tasks')
        .insert({
          name: task.name,
          description: task.description,
          due_date: task.dueDate,
          status: task.status || 'pending',
          user_id: user.id,
          rft_file_id: task.rftFileId,
          file_path: task.filePath,
          progress: task.progress || defaultProgress
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        status: data.status as TaskStatus,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        rftFileId: data.rft_file_id ?? undefined,
        outputFileId: data.output_file_id ?? undefined,
        dueDate: data.due_date ?? undefined,
        description: data.description ?? undefined,
        requirements: data.requirements ?? undefined,
        progress: isValidTaskProgress(data.progress) ? data.progress : defaultProgress,
        filePath: data.file_path ?? undefined,
        responsePath: data.response_path ?? undefined,
        userId: data.user_id ?? undefined,
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTask(taskId: string, updates: Partial<RftTask>): Promise<RftTask> {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.rftFileId !== undefined) updateData.rft_file_id = updates.rftFileId;
      if (updates.outputFileId !== undefined) updateData.output_file_id = updates.outputFileId;
      if (updates.filePath !== undefined) updateData.file_path = updates.filePath;
      if (updates.responsePath !== undefined) updateData.response_path = updates.responsePath;
      if (updates.requirements !== undefined) updateData.requirements = updates.requirements;
      if (updates.progress !== undefined) updateData.progress = updates.progress;

      const { data, error } = await supabase
        .from('rft_tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        status: data.status as TaskStatus,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        rftFileId: data.rft_file_id ?? undefined,
        outputFileId: data.output_file_id ?? undefined,
        dueDate: data.due_date ?? undefined,
        description: data.description ?? undefined,
        requirements: data.requirements ?? undefined,
        progress: isValidTaskProgress(data.progress) ? data.progress : defaultProgress,
        filePath: data.file_path ?? undefined,
        responsePath: data.response_path ?? undefined,
        userId: data.user_id ?? undefined,
      };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },
};
