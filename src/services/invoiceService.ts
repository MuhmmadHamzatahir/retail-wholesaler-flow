
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem } from "@/types";
import { toast } from "@/components/ui/use-toast";

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const { data: invoicesData, error: invoicesError } = await supabase
      .from('invoices')
      .select(`
        id,
        invoice_number,
        customer_id,
        customers (name),
        quotation_id,
        subtotal,
        tax,
        discount,
        total,
        notes,
        payment_terms,
        due_date,
        status,
        created_at,
        updated_at
      `);

    if (invoicesError) throw invoicesError;

    // Fetch all invoice items
    const invoices = await Promise.all(invoicesData.map(async (invoice) => {
      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select(`
          id,
          product_id,
          products (name),
          quantity,
          unit_price,
          discount,
          tax,
          total
        `)
        .eq('invoice_id', invoice.id);

      if (itemsError) throw itemsError;

      const items: InvoiceItem[] = itemsData.map(item => ({
        productId: item.product_id,
        productName: item.products.name,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unit_price),
        discount: parseFloat(item.discount),
        tax: parseFloat(item.tax),
        total: parseFloat(item.total)
      }));

      return {
        id: invoice.id,
        customerId: invoice.customer_id,
        customerName: invoice.customers.name,
        quotationId: invoice.quotation_id,
        items,
        subtotal: parseFloat(invoice.subtotal),
        tax: parseFloat(invoice.tax),
        discount: parseFloat(invoice.discount),
        total: parseFloat(invoice.total),
        notes: invoice.notes,
        paymentTerms: invoice.payment_terms || "",
        dueDate: new Date(invoice.due_date),
        status: invoice.status as "draft" | "sent" | "partial" | "paid" | "overdue" | "void",
        createdAt: new Date(invoice.created_at),
        updatedAt: new Date(invoice.updated_at)
      };
    }));

    return invoices;
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    toast({
      title: "Error fetching invoices",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Insert invoice - Note: We don't need to provide invoice_number as the trigger will generate it
    const { data: newInvoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        customer_id: invoice.customerId,
        quotation_id: invoice.quotationId,
        subtotal: invoice.subtotal.toString(), // Convert to string
        tax: invoice.tax.toString(), // Convert to string
        discount: invoice.discount.toString(), // Convert to string
        total: invoice.total.toString(), // Convert to string
        notes: invoice.notes,
        payment_terms: invoice.paymentTerms,
        due_date: invoice.dueDate.toISOString(),
        status: invoice.status
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Insert invoice items
    const invoiceItems = invoice.items.map(item => ({
      invoice_id: newInvoice.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice.toString(), // Convert to string
      discount: item.discount.toString(), // Convert to string
      tax: item.tax.toString(), // Convert to string
      total: item.total.toString() // Convert to string
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) throw itemsError;

    // If this is not a draft, create stock movements for the products
    if (invoice.status !== 'draft') {
      const stockMovements = invoice.items.map(item => ({
        product_id: item.productId,
        type: 'out',
        quantity: item.quantity,
        from_location: 'Main Warehouse',
        reference: newInvoice.invoice_number,
        notes: `Invoice ${newInvoice.invoice_number}`
      }));

      const { error: stockError } = await supabase
        .from('stock_movements')
        .insert(stockMovements);

      if (stockError) throw stockError;

      // Update inventory
      for (const item of invoice.items) {
        // Get current inventory
        const { data: inventoryData, error: inventoryFetchError } = await supabase
          .from('inventory')
          .select('quantity')
          .eq('product_id', item.productId)
          .eq('location', 'Main Warehouse')
          .single();

        if (inventoryFetchError) throw inventoryFetchError;

        // Update inventory
        const { error: inventoryUpdateError } = await supabase
          .from('inventory')
          .update({
            quantity: Math.max(0, inventoryData.quantity - item.quantity),
            updated_at: new Date().toISOString()
          })
          .eq('product_id', item.productId)
          .eq('location', 'Main Warehouse');

        if (inventoryUpdateError) throw inventoryUpdateError;
      }
    }

    // Update customer balance
    if (invoice.status !== 'draft' && invoice.status !== 'void') {
      const { data: customerData, error: customerFetchError } = await supabase
        .from('customers')
        .select('current_balance')
        .eq('id', invoice.customerId)
        .single();

      if (customerFetchError) throw customerFetchError;

      const { error: customerUpdateError } = await supabase
        .from('customers')
        .update({
          current_balance: parseFloat(customerData.current_balance) + invoice.total
        })
        .eq('id', invoice.customerId);

      if (customerUpdateError) throw customerUpdateError;
    }

    toast({
      title: "Invoice created",
      description: `Invoice ${newInvoice.invoice_number} has been created successfully.`
    });

    return newInvoice.id;
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    toast({
      title: "Error creating invoice",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}

export async function updateInvoice(id: string, invoice: Partial<Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    // Get the original invoice to check status change
    const { data: originalInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('status, total, customer_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Update invoice
    const updateData: any = {};
    
    if (invoice.customerId) updateData.customer_id = invoice.customerId;
    if (invoice.quotationId) updateData.quotation_id = invoice.quotationId;
    if (invoice.subtotal !== undefined) updateData.subtotal = invoice.subtotal.toString();
    if (invoice.tax !== undefined) updateData.tax = invoice.tax.toString();
    if (invoice.discount !== undefined) updateData.discount = invoice.discount.toString();
    if (invoice.total !== undefined) updateData.total = invoice.total.toString();
    if (invoice.notes !== undefined) updateData.notes = invoice.notes;
    if (invoice.paymentTerms !== undefined) updateData.payment_terms = invoice.paymentTerms;
    if (invoice.dueDate) updateData.due_date = invoice.dueDate.toISOString();
    if (invoice.status) updateData.status = invoice.status;
    updateData.updated_at = new Date().toISOString();
    
    const { error: invoiceError } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id);

    if (invoiceError) throw invoiceError;

    // Handle status changes that affect customer balance
    if (invoice.status && originalInvoice.status !== invoice.status) {
      // If changing from draft/void to active status, increase customer balance
      if ((originalInvoice.status === 'draft' || originalInvoice.status === 'void') && 
          (invoice.status === 'sent' || invoice.status === 'partial' || invoice.status === 'paid' || invoice.status === 'overdue')) {
        
        const { data: customerData, error: customerFetchError } = await supabase
          .from('customers')
          .select('current_balance')
          .eq('id', invoice.customerId || originalInvoice.customer_id)
          .single();

        if (customerFetchError) throw customerFetchError;

        const currentBalance = parseFloat(customerData.current_balance) || 0;
        const invoiceTotal = invoice.total || parseFloat(originalInvoice.total);
        
        const { error: customerUpdateError } = await supabase
          .from('customers')
          .update({
            current_balance: (currentBalance + invoiceTotal).toString()
          })
          .eq('id', invoice.customerId || originalInvoice.customer_id);

        if (customerUpdateError) throw customerUpdateError;
      }

      // If changing to void or paid from another status, adjust customer balance
      if ((invoice.status === 'void' || invoice.status === 'paid') && 
          (originalInvoice.status !== 'void' && originalInvoice.status !== 'draft')) {
        
        const { data: customerData, error: customerFetchError } = await supabase
          .from('customers')
          .select('current_balance')
          .eq('id', invoice.customerId || originalInvoice.customer_id)
          .single();

        if (customerFetchError) throw customerFetchError;

        const currentBalance = parseFloat(customerData.current_balance) || 0;
        const invoiceTotal = invoice.total || parseFloat(originalInvoice.total);
        
        const { error: customerUpdateError } = await supabase
          .from('customers')
          .update({
            current_balance: Math.max(0, currentBalance - invoiceTotal).toString()
          })
          .eq('id', invoice.customerId || originalInvoice.customer_id);

        if (customerUpdateError) throw customerUpdateError;
      }
    }

    toast({
      title: "Invoice updated",
      description: "Invoice has been updated successfully."
    });
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    toast({
      title: "Error updating invoice",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}

export async function deleteInvoice(id: string) {
  try {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Invoice deleted",
      description: "The invoice has been deleted successfully."
    });
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    toast({
      title: "Error deleting invoice",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}
