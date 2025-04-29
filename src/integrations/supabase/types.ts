export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          city: string | null
          company: string | null
          country: string | null
          created_at: string | null
          credit_limit: number | null
          current_balance: number | null
          email: string | null
          id: string
          name: string
          phone: string | null
          state: string | null
          street: string | null
          type: string
          zip: string | null
        }
        Insert: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          current_balance?: number | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          state?: string | null
          street?: string | null
          type: string
          zip?: string | null
        }
        Update: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          current_balance?: number | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string | null
          street?: string | null
          type?: string
          zip?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          id: string
          location: string
          product_id: string | null
          quantity: number
          updated_at: string | null
        }
        Insert: {
          id?: string
          location?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          location?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          discount: number
          id: string
          invoice_id: string | null
          product_id: string | null
          quantity: number
          tax: number
          total: number
          unit_price: number
        }
        Insert: {
          discount?: number
          id?: string
          invoice_id?: string | null
          product_id?: string | null
          quantity: number
          tax: number
          total: number
          unit_price: number
        }
        Update: {
          discount?: number
          id?: string
          invoice_id?: string | null
          product_id?: string | null
          quantity?: number
          tax?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string | null
          customer_id: string | null
          discount: number
          due_date: string
          id: string
          invoice_number: string
          notes: string | null
          payment_terms: string | null
          quotation_id: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          discount?: number
          due_date: string
          id?: string
          invoice_number: string
          notes?: string | null
          payment_terms?: string | null
          quotation_id?: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          discount?: number
          due_date?: string
          id?: string
          invoice_number?: string
          notes?: string | null
          payment_terms?: string | null
          quotation_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          cost: number
          created_at: string | null
          id: string
          name: string
          price: number
          product_id: string | null
          sku: string
          updated_at: string | null
        }
        Insert: {
          attributes?: Json
          cost: number
          created_at?: string | null
          id?: string
          name: string
          price: number
          product_id?: string | null
          sku: string
          updated_at?: string | null
        }
        Update: {
          attributes?: Json
          cost?: number
          created_at?: string | null
          id?: string
          name?: string
          price?: number
          product_id?: string | null
          sku?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category: string | null
          cost: number
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          min_stock_level: number | null
          name: string
          retail_price: number
          tax_rate: number
          updated_at: string | null
          wholesale_price: number
        }
        Insert: {
          barcode?: string | null
          category?: string | null
          cost: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          min_stock_level?: number | null
          name: string
          retail_price: number
          tax_rate?: number
          updated_at?: string | null
          wholesale_price: number
        }
        Update: {
          barcode?: string | null
          category?: string | null
          cost?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          min_stock_level?: number | null
          name?: string
          retail_price?: number
          tax_rate?: number
          updated_at?: string | null
          wholesale_price?: number
        }
        Relationships: []
      }
      quotation_items: {
        Row: {
          discount: number
          id: string
          product_id: string | null
          quantity: number
          quotation_id: string | null
          tax: number
          total: number
          unit_price: number
        }
        Insert: {
          discount?: number
          id?: string
          product_id?: string | null
          quantity: number
          quotation_id?: string | null
          tax: number
          total: number
          unit_price: number
        }
        Update: {
          discount?: number
          id?: string
          product_id?: string | null
          quantity?: number
          quotation_id?: string | null
          tax?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          created_at: string | null
          customer_id: string | null
          discount: number
          expiry_date: string
          id: string
          notes: string | null
          quotation_number: string
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          discount?: number
          expiry_date: string
          id?: string
          notes?: string | null
          quotation_number: string
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          discount?: number
          expiry_date?: string
          id?: string
          notes?: string | null
          quotation_number?: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string | null
          from_location: string | null
          id: string
          notes: string | null
          product_id: string | null
          quantity: number
          reference: string | null
          to_location: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          from_location?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          quantity: number
          reference?: string | null
          to_location?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          from_location?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          quantity?: number
          reference?: string | null
          to_location?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_sequential_number: {
        Args: { prefix: string }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
