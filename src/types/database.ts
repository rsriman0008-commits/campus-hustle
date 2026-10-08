export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      campuses: {
        Row: {
          id: string;
          name: string;
          status: 'active' | 'inactive' | 'pilot';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          status?: 'active' | 'inactive' | 'pilot';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          status?: 'active' | 'inactive' | 'pilot';
          created_at?: string;
        };
      };
      approved_email_domains: {
        Row: {
          id: string;
          campus_id: string;
          domain: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          campus_id: string;
          domain: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          campus_id?: string;
          domain?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          campus_id: string;
          name: string;
          slug: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          campus_id: string;
          name: string;
          slug: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          campus_id?: string;
          name?: string;
          slug?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          slug: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          slug: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          slug?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      programmes: {
        Row: {
          id: string;
          department_id: string;
          name: string;
          level: 'UG' | 'PG' | 'Integrated' | 'M.Phil' | 'Ph.D' | 'Diploma';
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          department_id: string;
          name: string;
          level: 'UG' | 'PG' | 'Integrated' | 'M.Phil' | 'Ph.D' | 'Diploma';
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          department_id?: string;
          name?: string;
          level?: 'UG' | 'PG' | 'Integrated' | 'M.Phil' | 'Ph.D' | 'Diploma';
          is_active?: boolean;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          campus_id: string;
          display_name: string;
          username: string | null;
          avatar_path: string | null;
          bio: string | null;
          school_id: string | null;
          department_id: string | null;
          programme_id: string | null;
          year_of_study: number | null;
          expected_graduation_year: number | null;
          verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
          account_status: 'active' | 'suspended' | 'deactivated';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          campus_id: string;
          display_name: string;
          username?: string | null;
          avatar_path?: string | null;
          bio?: string | null;
          school_id?: string | null;
          department_id?: string | null;
          programme_id?: string | null;
          year_of_study?: number | null;
          expected_graduation_year?: number | null;
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
          account_status?: 'active' | 'suspended' | 'deactivated';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campus_id?: string;
          display_name?: string;
          username?: string | null;
          avatar_path?: string | null;
          bio?: string | null;
          school_id?: string | null;
          department_id?: string | null;
          programme_id?: string | null;
          year_of_study?: number | null;
          expected_graduation_year?: number | null;
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
          account_status?: 'active' | 'suspended' | 'deactivated';
          created_at?: string;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          user_id: string;
          role: 'student_user' | 'moderator' | 'campus_admin' | 'platform_admin';
          created_at: string;
        };
        Insert: {
          user_id: string;
          role: 'student_user' | 'moderator' | 'campus_admin' | 'platform_admin';
          created_at?: string;
        };
        Update: {
          user_id?: string;
          role?: 'student_user' | 'moderator' | 'campus_admin' | 'platform_admin';
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          is_prohibited: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          is_prohibited?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          is_prohibited?: boolean;
          created_at?: string;
        };
      };
      pickup_zones: {
        Row: {
          id: string;
          campus_id: string;
          name: string;
          description: string | null;
          is_safe_zone: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          campus_id: string;
          name: string;
          description?: string | null;
          is_safe_zone?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          campus_id?: string;
          name?: string;
          description?: string | null;
          is_safe_zone?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          owner_id: string;
          campus_id: string;
          listing_type: 'item' | 'service' | 'rental';
          category_id: string;
          title: string;
          description: string;
          price: number;
          currency: string;
          pricing_model: 'fixed' | 'negotiable' | 'hourly' | 'contact_for_price';
          condition: 'new' | 'like_new' | 'good' | 'fair' | null;
          status: 'draft' | 'active' | 'reserved' | 'sold' | 'paused' | 'expired';
          pickup_zone_id: string | null;
          available_until: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          campus_id: string;
          listing_type: 'item' | 'service' | 'rental';
          category_id: string;
          title: string;
          description: string;
          price: number;
          currency?: string;
          pricing_model?: 'fixed' | 'negotiable' | 'hourly' | 'contact_for_price';
          condition?: 'new' | 'like_new' | 'good' | 'fair' | null;
          status?: 'draft' | 'active' | 'reserved' | 'sold' | 'paused' | 'expired';
          pickup_zone_id?: string | null;
          available_until?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string;
          campus_id?: string;
          listing_type?: 'item' | 'service' | 'rental';
          category_id?: string;
          title?: string;
          description?: string;
          price?: number;
          currency?: string;
          pricing_model?: 'fixed' | 'negotiable' | 'hourly' | 'contact_for_price';
          condition?: 'new' | 'like_new' | 'good' | 'fair' | null;
          status?: 'draft' | 'active' | 'reserved' | 'sold' | 'paused' | 'expired';
          pickup_zone_id?: string | null;
          available_until?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
    };
  };
}
