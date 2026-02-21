import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      sectors: {
        Row: {
          id: string
          name: string
          situation: string
          constraint: string
          password: string
          created_at: string
        }
        Insert: Omit<
          Database["public"]["Tables"]["sectors"]["Row"],
          "id" | "created_at"
        >
      }
      channels: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: Omit<
          Database["public"]["Tables"]["channels"]["Row"],
          "id" | "created_at"
        >
      }
      team_sessions: {
        Row: {
          id: string
          team_name: string
          current_round: number
          round1_sector: string | null
          round1_company: string | null
          round2_image_link: string | null
          round3_allocations: Record<string, number> | null
          round3_sector: string | null
          round3_choice: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database["public"]["Tables"]["team_sessions"]["Row"],
          "id" | "created_at" | "updated_at"
        >
      }
      submissions: {
        Row: {
          id: string
          team_name: string
          round: number
          data: Record<string, any>
          created_at: string
        }
        Insert: Omit<
          Database["public"]["Tables"]["submissions"]["Row"],
          "id" | "created_at"
        >
      }
    }
  }
}
