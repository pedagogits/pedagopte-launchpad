export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      mock_test_sessions_2025_12_01_12_35: {
        Row: {
          completed_at: string | null
          id: string
          overall_score: number | null
          section_scores: Json | null
          started_at: string | null
          status: string | null
          test_type: string
          time_taken: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          overall_score?: number | null
          section_scores?: Json | null
          started_at?: string | null
          status?: string | null
          test_type: string
          time_taken?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          overall_score?: number | null
          section_scores?: Json | null
          started_at?: string | null
          status?: string | null
          test_type?: string
          time_taken?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mock_test_sessions_2025_12_01_12_35_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_2025_12_01_12_35"
            referencedColumns: ["id"]
          },
        ]
      }
      pte_questions_2025_12_01_12_35: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string | null
          difficulty_level: string | null
          id: string
          image_url: string | null
          instructions: string | null
          question_type: string
          section_id: string | null
          time_limit: number
          title: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          question_type: string
          section_id?: string | null
          time_limit: number
          title: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          question_type?: string
          section_id?: string | null
          time_limit?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "pte_questions_2025_12_01_12_35_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "pte_sections_2025_12_01_12_35"
            referencedColumns: ["id"]
          },
        ]
      }
      pte_sections_2025_12_01_12_35: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          section_type: string
          time_limit: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          section_type: string
          time_limit: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          section_type?: string
          time_limit?: number
        }
        Relationships: []
      }
      purchase_history: {
        Row: {
          amount: number
          created_at: string
          credits_purchased: number
          id: string
          payment_method: string | null
          status: string
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          credits_purchased: number
          id?: string
          payment_method?: string | null
          status?: string
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          credits_purchased?: number
          id?: string
          payment_method?: string | null
          status?: string
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      question_types_2025_11_29_02_00: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          scoring_criteria: Json | null
          section_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          scoring_criteria?: Json | null
          section_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          scoring_criteria?: Json | null
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_types_2025_11_29_02_00_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "test_sections_2025_11_29_02_00"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_2025_11_29_02_00: {
        Row: {
          content: Json
          created_at: string | null
          difficulty_level: string | null
          id: string
          question_type_id: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          question_type_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          question_type_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_2025_11_29_02_00_question_type_id_fkey"
            columns: ["question_type_id"]
            isOneToOne: false
            referencedRelation: "question_types_2025_11_29_02_00"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts_2025_11_29_02_00: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          section_id: string | null
          section_scores: Json | null
          started_at: string | null
          status: string | null
          test_type: string
          total_score: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          section_id?: string | null
          section_scores?: Json | null
          started_at?: string | null
          status?: string | null
          test_type: string
          total_score?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          section_id?: string | null
          section_scores?: Json | null
          started_at?: string | null
          status?: string | null
          test_type?: string
          total_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_2025_11_29_02_00_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "test_sections_2025_11_29_02_00"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_attempts_2025_11_29_02_00_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_2025_11_29_02_00"
            referencedColumns: ["id"]
          },
        ]
      }
      test_sections_2025_11_29_02_00: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          time_limit: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          time_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          time_limit?: number | null
        }
        Relationships: []
      }
      user_attempts_2025_12_01_12_35: {
        Row: {
          created_at: string | null
          detailed_feedback: Json | null
          id: string
          question_id: string | null
          response_audio_url: string | null
          response_text: string | null
          score: number | null
          time_taken: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          detailed_feedback?: Json | null
          id?: string
          question_id?: string | null
          response_audio_url?: string | null
          response_text?: string | null
          score?: number | null
          time_taken?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          detailed_feedback?: Json | null
          id?: string
          question_id?: string | null
          response_audio_url?: string | null
          response_text?: string | null
          score?: number | null
          time_taken?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_attempts_2025_12_01_12_35_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "pte_questions_2025_12_01_12_35"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempts_2025_12_01_12_35_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_2025_12_01_12_35"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string
          id: string
          subscription_expires_at: string | null
          subscription_tier: string
          total_credits: number
          updated_at: string
          used_credits: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          subscription_expires_at?: string | null
          subscription_tier?: string
          total_credits?: number
          updated_at?: string
          used_credits?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          subscription_expires_at?: string | null
          subscription_tier?: string
          total_credits?: number
          updated_at?: string
          used_credits?: number
          user_id?: string
        }
        Relationships: []
      }
      user_profiles_2025_11_29_02_00: {
        Row: {
          created_at: string | null
          current_level: string | null
          email: string | null
          full_name: string | null
          id: string
          target_score: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_level?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          target_score?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_level?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          target_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles_2025_12_01_12_35: {
        Row: {
          best_overall_score: number | null
          created_at: string | null
          current_level: string | null
          email: string
          full_name: string | null
          id: string
          target_score: number | null
          total_tests_taken: number | null
          updated_at: string | null
        }
        Insert: {
          best_overall_score?: number | null
          created_at?: string | null
          current_level?: string | null
          email: string
          full_name?: string | null
          id: string
          target_score?: number | null
          total_tests_taken?: number | null
          updated_at?: string | null
        }
        Update: {
          best_overall_score?: number | null
          created_at?: string | null
          current_level?: string | null
          email?: string
          full_name?: string | null
          id?: string
          target_score?: number | null
          total_tests_taken?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_progress_2025_12_01_12_35: {
        Row: {
          average_score: number | null
          best_score: number | null
          created_at: string | null
          id: string
          last_attempt_date: string | null
          section_id: string | null
          total_attempts: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          average_score?: number | null
          best_score?: number | null
          created_at?: string | null
          id?: string
          last_attempt_date?: string | null
          section_id?: string | null
          total_attempts?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          average_score?: number | null
          best_score?: number | null
          created_at?: string | null
          id?: string
          last_attempt_date?: string | null
          section_id?: string | null
          total_attempts?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_2025_12_01_12_35_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "pte_sections_2025_12_01_12_35"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_2025_12_01_12_35_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_2025_12_01_12_35"
            referencedColumns: ["id"]
          },
        ]
      }
      user_responses_2025_11_29_02_00: {
        Row: {
          ai_feedback: Json | null
          ai_score: number | null
          attempt_id: string | null
          created_at: string | null
          id: string
          question_id: string | null
          response_data: Json
          time_taken: number | null
          user_id: string | null
        }
        Insert: {
          ai_feedback?: Json | null
          ai_score?: number | null
          attempt_id?: string | null
          created_at?: string | null
          id?: string
          question_id?: string | null
          response_data: Json
          time_taken?: number | null
          user_id?: string | null
        }
        Update: {
          ai_feedback?: Json | null
          ai_score?: number | null
          attempt_id?: string | null
          created_at?: string | null
          id?: string
          question_id?: string | null
          response_data?: Json
          time_taken?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_responses_2025_11_29_02_00_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts_2025_11_29_02_00"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_responses_2025_11_29_02_00_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions_2025_11_29_02_00"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_responses_2025_11_29_02_00_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_2025_11_29_02_00"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
