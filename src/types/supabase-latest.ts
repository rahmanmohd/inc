export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      // Core User Management
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          company: string | null
          bio: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          company?: string | null
          bio?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          company?: string | null
          bio?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // Application Tables
      hackathon_registrations: {
        Row: {
          id: string
          user_id: string
          hackathon_id: string | null
          full_name: string
          email: string
          phone: string | null
          age: string | null
          city: string | null
          college: string | null
          graduation: string | null
          programming_languages: string | null
          experience: string | null
          frameworks: string | null
          specialization: string | null
          github_profile: string | null
          portfolio: string | null
          agreements: boolean
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hackathon_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          age?: string | null
          city?: string | null
          college?: string | null
          graduation?: string | null
          programming_languages?: string | null
          experience?: string | null
          frameworks?: string | null
          specialization?: string | null
          github_profile?: string | null
          portfolio?: string | null
          agreements?: boolean
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hackathon_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          age?: string | null
          city?: string | null
          college?: string | null
          graduation?: string | null
          programming_languages?: string | null
          experience?: string | null
          frameworks?: string | null
          specialization?: string | null
          github_profile?: string | null
          portfolio?: string | null
          agreements?: boolean
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      incubation_applications: {
        Row: {
          id: string
          user_id: string | null
          applicant_id: string
          founder_name: string | null
          startup_name: string | null
          email: string
          phone: string | null
          industry: string | null
          stage: string | null
          description: string | null
          mission: string | null
          vision: string | null
          website: string | null
          linkedin_profile: string | null
          status: string
          admin_notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          applicant_id: string
          founder_name?: string | null
          startup_name?: string | null
          email: string
          phone?: string | null
          industry?: string | null
          stage?: string | null
          description?: string | null
          mission?: string | null
          vision?: string | null
          website?: string | null
          linkedin_profile?: string | null
          status?: string
          admin_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          applicant_id?: string
          founder_name?: string | null
          startup_name?: string | null
          email?: string
          phone?: string | null
          industry?: string | null
          stage?: string | null
          description?: string | null
          mission?: string | null
          vision?: string | null
          website?: string | null
          linkedin_profile?: string | null
          status?: string
          admin_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // Admin Tables
      admin_notifications: {
        Row: {
          id: string
          type: string
          application_id: string | null
          application_type: string | null
          applicant_name: string | null
          startup_name: string | null
          message: string
          is_read: boolean | null
          priority: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          type: string
          application_id?: string | null
          application_type?: string | null
          applicant_name?: string | null
          startup_name?: string | null
          message: string
          is_read?: boolean | null
          priority?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          type?: string
          application_id?: string | null
          application_type?: string | null
          applicant_name?: string | null
          startup_name?: string | null
          message?: string
          is_read?: boolean | null
          priority?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }

      admin_activity_log: {
        Row: {
          id: string
          action: string
          admin_id: string
          application_id: string | null
          application_type: string | null
          created_at: string | null
          new_status: string | null
          notes: string | null
          old_status: string | null
        }
        Insert: {
          id?: string
          action: string
          admin_id: string
          application_id?: string | null
          application_type?: string | null
          created_at?: string | null
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
        }
        Update: {
          id?: string
          action?: string
          admin_id?: string
          application_id?: string | null
          application_type?: string | null
          created_at?: string | null
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
        }
        Relationships: []
      }

      // Startup Management
      startups: {
        Row: {
          id: string
          name: string
          description: string | null
          industry: string | null
          stage: string | null
          website: string | null
          location: string | null
          team_size: number | null
          founded_year: number | null
          logo_url: string | null
          metrics: Json | null
          published: boolean
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          industry?: string | null
          stage?: string | null
          website?: string | null
          location?: string | null
          team_size?: number | null
          founded_year?: number | null
          logo_url?: string | null
          metrics?: Json | null
          published?: boolean
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          industry?: string | null
          stage?: string | null
          website?: string | null
          location?: string | null
          team_size?: number | null
          founded_year?: number | null
          logo_url?: string | null
          metrics?: Json | null
          published?: boolean
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // Hackathon Management
      hackathons: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string | null
          start_date: string | null
          end_date: string | null
          registration_open_date: string | null
          registration_close_date: string | null
          location: string | null
          prize_pool: string | null
          expected_participants: number | null
          tags: string[] | null
          cover_image_url: string | null
          status: string | null
          published: boolean | null
          registration_count: number | null
          is_default: boolean | null
          registration_form_id: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          registration_open_date?: string | null
          registration_close_date?: string | null
          location?: string | null
          prize_pool?: string | null
          expected_participants?: number | null
          tags?: string[] | null
          cover_image_url?: string | null
          status?: string | null
          published?: boolean | null
          registration_count?: number | null
          is_default?: boolean | null
          registration_form_id?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          registration_open_date?: string | null
          registration_close_date?: string | null
          location?: string | null
          prize_pool?: string | null
          expected_participants?: number | null
          tags?: string[] | null
          cover_image_url?: string | null
          status?: string | null
          published?: boolean | null
          registration_count?: number | null
          is_default?: boolean | null
          registration_form_id?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }

      // Incubation Programs Management
      incubation_programs: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string | null
          start_date: string | null
          end_date: string | null
          application_open_date: string | null
          application_close_date: string | null
          location: string | null
          duration: string | null
          equity_requirement: string | null
          funding_amount: string | null
          expected_startups: number | null
          tags: string[] | null
          cover_image_url: string | null
          status: string | null
          published: boolean | null
          application_count: number | null
          is_default: boolean | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          application_open_date?: string | null
          application_close_date?: string | null
          location?: string | null
          duration?: string | null
          equity_requirement?: string | null
          funding_amount?: string | null
          expected_startups?: number | null
          tags?: string[] | null
          cover_image_url?: string | null
          status?: string | null
          published?: boolean | null
          application_count?: number | null
          is_default?: boolean | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          application_open_date?: string | null
          application_close_date?: string | null
          location?: string | null
          duration?: string | null
          equity_requirement?: string | null
          funding_amount?: string | null
          expected_startups?: number | null
          tags?: string[] | null
          cover_image_url?: string | null
          status?: string | null
          published?: boolean | null
          application_count?: number | null
          is_default?: boolean | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }

      // Incubation Applications
      incubation_applications_new: {
        Row: {
          id: string
          user_id: string
          program_id: string
          founder_name: string
          cofounder_name: string | null
          email: string
          phone: string | null
          linkedin_profile: string | null
          education: string | null
          experience: string | null
          startup_name: string
          website: string | null
          stage: string
          industry: string
          description: string
          mission: string | null
          vision: string | null
          problem_statement: string
          solution_description: string
          target_market: string
          business_model: string | null
          revenue_model: string | null
          current_traction: string | null
          funding_requirements: string | null
          team_size: number | null
          pitch_deck_url: string | null
          financials_url: string | null
          status: string
          admin_notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          decision_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          program_id: string
          founder_name: string
          cofounder_name?: string | null
          email: string
          phone?: string | null
          linkedin_profile?: string | null
          education?: string | null
          experience?: string | null
          startup_name: string
          website?: string | null
          stage: string
          industry: string
          description: string
          mission?: string | null
          vision?: string | null
          problem_statement: string
          solution_description: string
          target_market: string
          business_model?: string | null
          revenue_model?: string | null
          current_traction?: string | null
          funding_requirements?: string | null
          team_size?: number | null
          pitch_deck_url?: string | null
          financials_url?: string | null
          status?: string
          admin_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          decision_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          program_id?: string
          founder_name?: string
          cofounder_name?: string | null
          email?: string
          phone?: string | null
          linkedin_profile?: string | null
          education?: string | null
          experience?: string | null
          startup_name?: string
          website?: string | null
          stage?: string
          industry?: string
          description?: string
          mission?: string | null
          vision?: string | null
          problem_statement?: string
          solution_description?: string
          target_market?: string
          business_model?: string | null
          revenue_model?: string | null
          current_traction?: string | null
          funding_requirements?: string | null
          team_size?: number | null
          pitch_deck_url?: string | null
          financials_url?: string | null
          status?: string
          admin_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          decision_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // Email Logs
      email_logs: {
        Row: {
          id: string
          recipient: string
          type: string
          subject: string
          status: string
          error_message: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipient: string
          type: string
          subject: string
          status: string
          error_message?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipient?: string
          type?: string
          subject?: string
          status?: string
          error_message?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Relationships: []
      }

    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "startup" | "investor" | "entrepreneur" | "mentor" | "user"
      event_type: "hackathon" | "meetup" | "workshop" | "webinar" | "demo_day" | "other"
      resource_type: "guide" | "template" | "video" | "external_link" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Export types for convenience
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
