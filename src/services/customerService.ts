
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types";
import { toast } from "@/components/ui/use-toast";

export async function getCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*');

    if (error) throw error;

    return data.map(customer => ({
      id: customer.id,
      type: customer.type as "retail" | "wholesale" | "vip",
      name: customer.name,
      company: customer.company || undefined,
      email: customer.email || "",
      phone: customer.phone || "",
      address: {
        street: customer.street || "",
        city: customer.city || "",
        state: customer.state || "",
        zip: customer.zip || "",
        country: customer.country || ""
      },
      creditLimit: customer.credit_limit,
      currentBalance: parseFloat(customer.current_balance) || 0,
      createdAt: new Date(customer.created_at)
    }));
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    toast({
      title: "Error fetching customers",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        type: customer.type,
        name: customer.name,
        company: customer.company,
        email: customer.email,
        phone: customer.phone,
        street: customer.address.street,
        city: customer.address.city,
        state: customer.address.state,
        zip: customer.address.zip,
        country: customer.address.country,
        credit_limit: customer.creditLimit,
        current_balance: customer.currentBalance
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Customer created",
      description: `${customer.name} has been created successfully.`
    });

    return data.id;
  } catch (error: any) {
    console.error('Error creating customer:', error);
    toast({
      title: "Error creating customer",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}

export async function updateCustomer(id: string, customer: Partial<Omit<Customer, 'id' | 'createdAt'>>) {
  try {
    const { error } = await supabase
      .from('customers')
      .update({
        type: customer.type,
        name: customer.name,
        company: customer.company,
        email: customer.email,
        phone: customer.phone,
        street: customer.address?.street,
        city: customer.address?.city,
        state: customer.address?.state,
        zip: customer.address?.zip,
        country: customer.address?.country,
        credit_limit: customer.creditLimit,
        current_balance: customer.currentBalance
      })
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Customer updated",
      description: `${customer.name} has been updated successfully.`
    });
  } catch (error: any) {
    console.error('Error updating customer:', error);
    toast({
      title: "Error updating customer",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}

export async function deleteCustomer(id: string) {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Customer deleted",
      description: "The customer has been deleted successfully."
    });
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    toast({
      title: "Error deleting customer",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}
