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
  public: {
    Tables: {
      audit_log: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_tenant_id_fkey1"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log_202603: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202604: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202605: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202606: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202607: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202608: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202609: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202610: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202611: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202612: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202701: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202702: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202703: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_202704: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log_default: {
        Row: {
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json
          resource_id: string | null
          resource_type: string | null
          severity: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          body_html: string
          body_text: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          scope: string
          subject: string
          trigger_type: string
          updated_at: string
          variables: Json
        }
        Insert: {
          body_html: string
          body_text?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          scope?: string
          subject: string
          trigger_type: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          body_html?: string
          body_text?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          scope?: string
          subject?: string
          trigger_type?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: []
      }
      payment_gateway_countries: {
        Row: {
          country_code: string
          created_at: string
          gateway_id: string
          id: string
        }
        Insert: {
          country_code: string
          created_at?: string
          gateway_id: string
          id?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          gateway_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_gateway_countries_gateway_id_fkey"
            columns: ["gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateway_secrets: {
        Row: {
          created_at: string
          gateway_id: string
          id: string
          secret_name: string
          updated_at: string
          vault_secret_id: string
        }
        Insert: {
          created_at?: string
          gateway_id: string
          id?: string
          secret_name: string
          updated_at?: string
          vault_secret_id: string
        }
        Update: {
          created_at?: string
          gateway_id?: string
          id?: string
          secret_name?: string
          updated_at?: string
          vault_secret_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_gateway_secrets_gateway_id_fkey"
            columns: ["gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateways: {
        Row: {
          country_scope: Database["public"]["Enums"]["gateway_country_scope"]
          created_at: string
          created_by: string | null
          display_name: string
          environment: Database["public"]["Enums"]["payment_environment"]
          id: string
          is_active: boolean
          last_verified_at: string | null
          notes: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          publishable_key: string | null
          updated_at: string
          verify_error: string | null
          verify_status: Database["public"]["Enums"]["gateway_verify_status"]
        }
        Insert: {
          country_scope?: Database["public"]["Enums"]["gateway_country_scope"]
          created_at?: string
          created_by?: string | null
          display_name: string
          environment?: Database["public"]["Enums"]["payment_environment"]
          id?: string
          is_active?: boolean
          last_verified_at?: string | null
          notes?: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          publishable_key?: string | null
          updated_at?: string
          verify_error?: string | null
          verify_status?: Database["public"]["Enums"]["gateway_verify_status"]
        }
        Update: {
          country_scope?: Database["public"]["Enums"]["gateway_country_scope"]
          created_at?: string
          created_by?: string | null
          display_name?: string
          environment?: Database["public"]["Enums"]["payment_environment"]
          id?: string
          is_active?: boolean
          last_verified_at?: string | null
          notes?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          publishable_key?: string | null
          updated_at?: string
          verify_error?: string | null
          verify_status?: Database["public"]["Enums"]["gateway_verify_status"]
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          is_destructive: boolean
          key: string
          label: string
          sort_order: number
          tier_scope: Database["public"]["Enums"]["permission_tier_scope"]
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          is_destructive?: boolean
          key: string
          label: string
          sort_order?: number
          tier_scope?: Database["public"]["Enums"]["permission_tier_scope"]
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          is_destructive?: boolean
          key?: string
          label?: string
          sort_order?: number
          tier_scope?: Database["public"]["Enums"]["permission_tier_scope"]
        }
        Relationships: []
      }
      plan_entitlements: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_hard_cap: boolean
          key: string
          limit_value: number
          plan_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_hard_cap?: boolean
          key: string
          limit_value: number
          plan_id: string
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_hard_cap?: boolean
          key?: string
          limit_value?: number
          plan_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_entitlements_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          code: string
          created_at: string
          currency: string
          description: string | null
          feature_flags: Json
          id: string
          is_active: boolean
          name: string
          price_monthly: number | null
          price_yearly: number | null
          sort_order: number
          trial_days: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          description?: string | null
          feature_flags?: Json
          id?: string
          is_active?: boolean
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          sort_order?: number
          trial_days?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          description?: string | null
          feature_flags?: Json
          id?: string
          is_active?: boolean
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          sort_order?: number
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_custom_roles: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_archived: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_invitations: {
        Row: {
          accepted_at: string | null
          country_code: string | null
          created_at: string
          email: string
          email_error: string | null
          email_status: string
          expires_at: string
          first_name: string | null
          id: string
          invited_by: string | null
          last_name: string | null
          phone: string | null
          role_kind: Database["public"]["Enums"]["role_kind"]
          role_ref: string
          sent_at: string | null
          status: string
          token: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          country_code?: string | null
          created_at?: string
          email: string
          email_error?: string | null
          email_status?: string
          expires_at: string
          first_name?: string | null
          id?: string
          invited_by?: string | null
          last_name?: string | null
          phone?: string | null
          role_kind: Database["public"]["Enums"]["role_kind"]
          role_ref: string
          sent_at?: string | null
          status?: string
          token: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          country_code?: string | null
          created_at?: string
          email?: string
          email_error?: string | null
          email_status?: string
          expires_at?: string
          first_name?: string | null
          id?: string
          invited_by?: string | null
          last_name?: string | null
          phone?: string | null
          role_kind?: Database["public"]["Enums"]["role_kind"]
          role_ref?: string
          sent_at?: string | null
          status?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          locale: string
          phone: string | null
          status: Database["public"]["Enums"]["user_status"]
          timezone: string
          updated_at: string
          user_id: string
          user_tier: Database["public"]["Enums"]["user_tier"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          locale?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          timezone?: string
          updated_at?: string
          user_id: string
          user_tier?: Database["public"]["Enums"]["user_tier"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          locale?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          timezone?: string
          updated_at?: string
          user_id?: string
          user_tier?: Database["public"]["Enums"]["user_tier"]
        }
        Relationships: []
      }
      role_permission_denies: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          permission_key: string
          reason: string | null
          role_kind: Database["public"]["Enums"]["role_kind"]
          role_ref: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          permission_key: string
          reason?: string | null
          role_kind: Database["public"]["Enums"]["role_kind"]
          role_ref: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          permission_key?: string
          reason?: string | null
          role_kind?: Database["public"]["Enums"]["role_kind"]
          role_ref?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permission_denies_permission_key_fkey"
            columns: ["permission_key"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["key"]
          },
        ]
      }
      role_permissions: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          permission_key: string
          role_kind: Database["public"]["Enums"]["role_kind"]
          role_ref: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission_key: string
          role_kind: Database["public"]["Enums"]["role_kind"]
          role_ref: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission_key?: string
          role_kind?: Database["public"]["Enums"]["role_kind"]
          role_ref?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_key_fkey"
            columns: ["permission_key"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["key"]
          },
        ]
      }
      scheduled_plan_changes: {
        Row: {
          applied_at: string | null
          canceled_at: string | null
          created_at: string
          created_by: string | null
          effective_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["scheduled_change_status"]
          subscription_id: string
          target_plan_id: string
        }
        Insert: {
          applied_at?: string | null
          canceled_at?: string | null
          created_at?: string
          created_by?: string | null
          effective_at: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["scheduled_change_status"]
          subscription_id: string
          target_plan_id: string
        }
        Update: {
          applied_at?: string | null
          canceled_at?: string | null
          created_at?: string
          created_by?: string | null
          effective_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["scheduled_change_status"]
          subscription_id?: string
          target_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_plan_changes_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_plan_changes_target_plan_id_fkey"
            columns: ["target_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          event_type: string
          from_plan_id: string | null
          from_status: Database["public"]["Enums"]["subscription_status"] | null
          id: string
          metadata: Json
          provider: Database["public"]["Enums"]["payment_provider"] | null
          provider_event_id: string | null
          source: Database["public"]["Enums"]["subscription_event_source"]
          subscription_id: string
          tenant_id: string
          to_plan_id: string | null
          to_status: Database["public"]["Enums"]["subscription_status"] | null
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          from_plan_id?: string | null
          from_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          id?: string
          metadata?: Json
          provider?: Database["public"]["Enums"]["payment_provider"] | null
          provider_event_id?: string | null
          source?: Database["public"]["Enums"]["subscription_event_source"]
          subscription_id: string
          tenant_id: string
          to_plan_id?: string | null
          to_status?: Database["public"]["Enums"]["subscription_status"] | null
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          from_plan_id?: string | null
          from_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          id?: string
          metadata?: Json
          provider?: Database["public"]["Enums"]["payment_provider"] | null
          provider_event_id?: string | null
          source?: Database["public"]["Enums"]["subscription_event_source"]
          subscription_id?: string
          tenant_id?: string
          to_plan_id?: string | null
          to_status?: Database["public"]["Enums"]["subscription_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_from_plan_id_fkey"
            columns: ["from_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_events_to_plan_id_fkey"
            columns: ["to_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string
          gateway_id: string | null
          grace_days: number
          id: string
          past_due_since: string | null
          plan_id: string
          provider: Database["public"]["Enums"]["payment_provider"] | null
          provider_customer_id: string | null
          provider_subscription_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          tenant_id: string
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          gateway_id?: string | null
          grace_days?: number
          id?: string
          past_due_since?: string | null
          plan_id: string
          provider?: Database["public"]["Enums"]["payment_provider"] | null
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tenant_id: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          gateway_id?: string | null
          grace_days?: number
          id?: string
          past_due_since?: string | null
          plan_id?: string
          provider?: Database["public"]["Enums"]["payment_provider"] | null
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tenant_id?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_gateway_id_fkey"
            columns: ["gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_custom_roles: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_archived: boolean
          name: string
          origin: Database["public"]["Enums"]["tenant_role_origin"]
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean
          name: string
          origin: Database["public"]["Enums"]["tenant_role_origin"]
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean
          name?: string
          origin?: Database["public"]["Enums"]["tenant_role_origin"]
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_custom_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_members: {
        Row: {
          id: string
          is_primary: boolean
          joined_at: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_primary?: boolean
          joined_at?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_primary?: boolean
          joined_at?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          branding: Json
          code: string
          contact_email: string | null
          contract_ends_at: string | null
          contract_starts_at: string | null
          created_at: string
          custom_domain: string | null
          id: string
          name: string
          plan_id: string | null
          status: Database["public"]["Enums"]["tenant_status"]
          updated_at: string
        }
        Insert: {
          branding?: Json
          code: string
          contact_email?: string | null
          contract_ends_at?: string | null
          contract_starts_at?: string | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          name: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["tenant_status"]
          updated_at?: string
        }
        Update: {
          branding?: Json
          code?: string
          contact_email?: string | null
          contract_ends_at?: string | null
          contract_starts_at?: string | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          name?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["tenant_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_scheduled_plan_changes: { Args: never; Returns: number }
      ensure_audit_log_partition: {
        Args: { _month: string }
        Returns: undefined
      }
      expire_trials_and_past_due: {
        Args: never
        Returns: {
          action: string
          subscription_id: string
        }[]
      }
      gateway_covered_countries: {
        Args: { _gateway_id: string }
        Returns: {
          country_code: string
        }[]
      }
      get_payment_gateway_secret: {
        Args: { _gateway_id: string; _secret_name: string }
        Returns: string
      }
      get_user_tier: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_tier"]
      }
      has_permission: {
        Args: { _key: string; _tenant_id?: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_tenant_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _tenant_id: string
          _user_id: string
        }
        Returns: boolean
      }
      is_tenant_member: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
      maintain_audit_log_partitions: { Args: never; Returns: undefined }
      prune_audit_log_partitions: {
        Args: { _retain_months?: number }
        Returns: number
      }
      set_payment_gateway_secret: {
        Args: { _gateway_id: string; _secret_name: string; _value: string }
        Returns: string
      }
      tenant_active_subscription: {
        Args: { _tenant_id: string }
        Returns: string
      }
      tenant_entitlement: {
        Args: { _key: string; _tenant_id: string }
        Returns: number
      }
      tenant_has_feature: {
        Args: { _flag: string; _tenant_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "consultant"
        | "hr_admin"
        | "employee"
        | "auditor"
      gateway_country_scope: "all" | "selected"
      gateway_verify_status: "unverified" | "ok" | "failed"
      payment_environment: "test" | "live"
      payment_provider: "stripe" | "razorpay"
      permission_tier_scope: "platform" | "tenant" | "both"
      role_kind: "system" | "platform_custom" | "tenant_custom"
      scheduled_change_status: "pending" | "applied" | "canceled"
      subscription_event_source: "admin" | "webhook" | "system" | "tenant"
      subscription_status:
        | "trial"
        | "active"
        | "past_due"
        | "canceled"
        | "expired"
      tenant_role_origin: "platform_default" | "tenant_custom"
      tenant_status: "trial" | "active" | "suspended" | "archived"
      user_status: "available" | "away" | "busy" | "dnd" | "offline"
      user_tier: "platform" | "tenant"
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
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "consultant",
        "hr_admin",
        "employee",
        "auditor",
      ],
      gateway_country_scope: ["all", "selected"],
      gateway_verify_status: ["unverified", "ok", "failed"],
      payment_environment: ["test", "live"],
      payment_provider: ["stripe", "razorpay"],
      permission_tier_scope: ["platform", "tenant", "both"],
      role_kind: ["system", "platform_custom", "tenant_custom"],
      scheduled_change_status: ["pending", "applied", "canceled"],
      subscription_event_source: ["admin", "webhook", "system", "tenant"],
      subscription_status: [
        "trial",
        "active",
        "past_due",
        "canceled",
        "expired",
      ],
      tenant_role_origin: ["platform_default", "tenant_custom"],
      tenant_status: ["trial", "active", "suspended", "archived"],
      user_status: ["available", "away", "busy", "dnd", "offline"],
      user_tier: ["platform", "tenant"],
    },
  },
} as const
