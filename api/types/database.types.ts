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
      album_members: {
        Row: {
          album_id: string
          selected: boolean | null
          user_email: string
        }
        Insert: {
          album_id: string
          selected?: boolean | null
          user_email: string
        }
        Update: {
          album_id?: string
          selected?: boolean | null
          user_email?: string
        }
        Relationships: [
        {
          foreignKeyName: "album_members_album_id_fkey"
          columns: ["album_id"]
          referencedRelation: "albums"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "album_members_user_email_fkey"
          columns: ["user_email"]
          referencedRelation: "users"
          referencedColumns: ["email"]
        }
      ]
      }
      albums: {
        Row: {
          album_type_id: string | null
          created_at: string | null
          delete: boolean | null
          id: string
          name: string | null
          owner: string | null
          stickers: Json | null
        }
        Insert: {
          album_type_id?: string | null
          created_at?: string | null
          delete?: boolean | null
          id?: string
          name?: string | null
          owner?: string | null
          stickers?: Json | null
        }
        Update: {
          album_type_id?: string | null
          created_at?: string | null
          delete?: boolean | null
          id?: string
          name?: string | null
          owner?: string | null
          stickers?: Json | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
        }
        Relationships: []
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
