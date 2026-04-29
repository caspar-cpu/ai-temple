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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_tool_uses: {
        Row: {
          id: string
          ai_tool_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          id?: string
          ai_tool_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          id?: string
          ai_tool_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_tool_uses_ai_tool_id_fkey"
            columns: ["ai_tool_id"]
            isOneToOne: false
            referencedRelation: "ai_tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_tool_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_tool_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tools: {
        Row: {
          body_md: string
          category_order: number
          category_slug: string
          created_at: string
          display_order: number
          founded: string | null
          id: string
          slug: string
          summary: string
          title: string
          url: string
        }
        Insert: {
          body_md: string
          category_order: number
          category_slug: string
          created_at?: string
          display_order?: number
          founded?: string | null
          id?: string
          slug: string
          summary: string
          title: string
          url: string
        }
        Update: {
          body_md?: string
          category_order?: number
          category_slug?: string
          created_at?: string
          display_order?: number
          founded?: string | null
          id?: string
          slug?: string
          summary?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      article_reads: {
        Row: {
          article_id: string
          id: string
          read_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          id?: string
          read_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_reads_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author: string | null
          contributor_id: string | null
          created_at: string
          description: string | null
          id: string
          source: string | null
          team: string | null
          team_order: number | null
          title: string
          url: string
        }
        Insert: {
          author?: string | null
          contributor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          source?: string | null
          team?: string | null
          team_order?: number | null
          title: string
          url: string
        }
        Update: {
          author?: string | null
          contributor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          source?: string | null
          team?: string | null
          team_order?: number | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_questions: {
        Row: {
          content_key: string
          content_type: string
          correct_index: number
          created_at: string
          created_by: string | null
          id: string
          options: string[]
          question: string
        }
        Insert: {
          content_key: string
          content_type: string
          correct_index: number
          created_at?: string
          created_by?: string | null
          id?: string
          options: string[]
          question: string
        }
        Update: {
          content_key?: string
          content_type?: string
          correct_index?: number
          created_at?: string
          created_by?: string | null
          id?: string
          options?: string[]
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_completions: {
        Row: {
          completed_at: string
          course_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          course_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed_at?: string
          course_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_completions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          contributor_id: string | null
          created_at: string
          description: string | null
          estimated_hours: number | null
          id: string
          provider: string | null
          team: string | null
          team_order: number | null
          title: string
          url: string
        }
        Insert: {
          contributor_id?: string | null
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          provider?: string | null
          team?: string | null
          team_order?: number | null
          title: string
          url: string
        }
        Update: {
          contributor_id?: string | null
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          provider?: string | null
          team?: string | null
          team_order?: number | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_step_completions: {
        Row: {
          completed_at: string
          id: string
          step_key: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          step_key: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          step_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_step_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_step_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plugin_uses: {
        Row: {
          id: string
          plugin_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          id?: string
          plugin_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          id?: string
          plugin_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plugin_uses_plugin_id_fkey"
            columns: ["plugin_id"]
            isOneToOne: false
            referencedRelation: "plugins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plugin_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plugin_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plugins: {
        Row: {
          contributor_id: string | null
          created_at: string
          department: string | null
          description: string
          example_search: string | null
          github_url: string | null
          id: string
          install_command: string
          invocation_prompt: string
          name: string
          slug: string
        }
        Insert: {
          contributor_id?: string | null
          created_at?: string
          department?: string | null
          description: string
          example_search?: string | null
          github_url?: string | null
          id?: string
          install_command: string
          invocation_prompt: string
          name: string
          slug: string
        }
        Update: {
          contributor_id?: string | null
          created_at?: string
          department?: string | null
          description?: string
          example_search?: string | null
          github_url?: string | null
          id?: string
          install_command?: string
          invocation_prompt?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "plugins_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plugins_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          is_admin: boolean
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id: string
          is_admin?: boolean
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          is_admin?: boolean
          username?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          attempted_at: string
          content_key: string
          content_type: string
          correct: boolean
          id: string
          user_id: string
        }
        Insert: {
          attempted_at?: string
          content_key: string
          content_type: string
          correct: boolean
          id?: string
          user_id: string
        }
        Update: {
          attempted_at?: string
          content_key?: string
          content_type?: string
          correct?: boolean
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_uses: {
        Row: {
          id: string
          skill_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          id?: string
          skill_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          id?: string
          skill_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_uses_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          contributor_id: string | null
          created_at: string
          department: string | null
          description: string
          id: string
          publisher: string | null
          slug: string
          title: string
          url: string
        }
        Insert: {
          category?: string | null
          contributor_id?: string | null
          created_at?: string
          department?: string | null
          description: string
          id?: string
          publisher?: string | null
          slug: string
          title: string
          url: string
        }
        Update: {
          category?: string | null
          contributor_id?: string | null
          created_at?: string
          department?: string | null
          description?: string
          id?: string
          publisher?: string | null
          slug?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skills_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trophies: {
        Row: {
          earned_at: string
          id: string
          kind: string
          points: number
          ref_id: string | null
          ref_type: string | null
          user_id: string
        }
        Insert: {
          earned_at?: string
          id?: string
          kind: string
          points: number
          ref_id?: string | null
          ref_type?: string | null
          user_id: string
        }
        Update: {
          earned_at?: string
          id?: string
          kind?: string
          points?: number
          ref_id?: string | null
          ref_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_trophies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_trophies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          avatar_url: string | null
          department: string | null
          email: string | null
          full_name: string | null
          id: string | null
          total_points: number | null
          trophy_count: number | null
          username: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_trophy: {
        Args: {
          p_kind: string
          p_points: number
          p_ref_id?: string
          p_ref_type?: string
          p_user_id: string
        }
        Returns: undefined
      }
      leaderboard_in_range: {
        Args: { p_end: string; p_start: string }
        Returns: {
          avatar_url: string
          department: string
          full_name: string
          id: string
          total_points: number
          trophy_count: number
          username: string
        }[]
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
