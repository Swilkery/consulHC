export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          name: string;
          color: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          doctor_name: string;
          room_id: string;
          date: string;
          start_time: string;
          end_time: string;
          is_recurring: boolean;
          recurring_days: number[];
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          doctor_name: string;
          room_id: string;
          date: string;
          start_time: string;
          end_time: string;
          is_recurring?: boolean;
          recurring_days?: number[];
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          doctor_name?: string;
          room_id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          is_recurring?: boolean;
          recurring_days?: number[];
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}