// src/lib/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          long_description: string | null
          instructor_name: string
          instructor_bio: string | null
          price: number
          original_price: number | null
          image_url: string
          category: string
          duration: string
          students_count: number
          rating: number
          reviews_count: number
          created_at: string
          updated_at: string
          status: 'active' | 'draft' | 'archived'
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          long_description?: string | null
          instructor_name: string
          instructor_bio?: string | null
          price: number
          original_price?: number | null
          image_url: string
          category: string
          duration: string
          students_count?: number
          rating?: number
          reviews_count?: number
          created_at?: string
          updated_at?: string
          status?: 'active' | 'draft' | 'archived'
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          long_description?: string | null
          instructor_name?: string
          instructor_bio?: string | null
          price?: number
          original_price?: number | null
          image_url?: string
          category?: string
          duration?: string
          students_count?: number
          rating?: number
          reviews_count?: number
          created_at?: string
          updated_at?: string
          status?: 'active' | 'draft' | 'archived'
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          payment_method: string | null
          transaction_id: string | null
          payment_proof_url: string | null
          amount: number | null
          status: 'pending' | 'approved' | 'rejected'
          progress: number
          last_accessed: string | null
          enrolled_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          payment_method?: string | null
          transaction_id?: string | null
          payment_proof_url?: string | null
          amount?: number | null
          status?: 'pending' | 'approved' | 'rejected'
          progress?: number
          last_accessed?: string | null
          enrolled_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          payment_method?: string | null
          transaction_id?: string | null
          payment_proof_url?: string | null
          amount?: number | null
          status?: 'pending' | 'approved' | 'rejected'
          progress?: number
          last_accessed?: string | null
          enrolled_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}