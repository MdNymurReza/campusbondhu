// src/services/database.ts
import { supabase } from '../lib/supabase';

export const databaseService = {
  // Course operations
  getCourses: async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    return { data, error };
  },

  getCourseById: async (id: string) => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  createCourse: async (courseData: any) => {
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();
    return { data, error };
  },

  // Enrollment operations
  enrollInCourse: async (courseId: string, userId: string) => {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        course_id: courseId,
        user_id: userId,
        progress: 0,
      });
    return { data, error };
  },

  getUserEnrollments: async (userId: string) => {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  // Storage operations
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  getFileUrl: (bucket: string, path: string) => {
    return supabase
      .storage
      .from(bucket)
      .getPublicUrl(path).data.publicUrl;
  },
};