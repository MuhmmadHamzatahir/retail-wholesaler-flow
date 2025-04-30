
import { supabase } from "@/integrations/supabase/client";
import { Quotation, QuotationItem } from "@/types";
import { toast } from "@/components/ui/use-toast";

export async function getQuotations(): Promise<Quotation[]> {
  try {
    const { data: quotationsData, error: quotationsError } = await supabase
      .from('quotations')
      .select(`
        id,
        quotation_number,
        customer_id,
        customers (name),
        subtotal,
        tax,
        discount,
        total,
        notes,
        expiry_date,
        status,
        created_at,
        updated_at
      `);

    if (quotationsError) throw quotationsError;

    // Fetch all quotation items
    const quotations = await Promise.all(quotationsData.map(async (quotation) => {
      const { data: itemsData, error: itemsError } = await supabase
        .from('quotation_items')
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
        .eq('quotation_id', quotation.id);

      if (itemsError) throw itemsError;

      const items: QuotationItem[] = itemsData.map(item => ({
        productId: item.product_id,
        productName: item.products.name,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unit_price),
        discount: parseFloat(item.discount),
        tax: parseFloat(item.tax),
        total: parseFloat(item.total)
      }));

      return {
        id: quotation.id,
        customerId: quotation.customer_id,
        customerName: quotation.customers.name,
        items,
        subtotal: parseFloat(quotation.subtotal),
        tax: parseFloat(quotation.tax),
        discount: parseFloat(quotation.discount),
        total: parseFloat(quotation.total),
        notes: quotation.notes,
        expiryDate: new Date(quotation.expiry_date),
        status: quotation.status as "draft" | "sent" | "accepted" | "expired" | "converted",
        createdAt: new Date(quotation.created_at),
        updatedAt: new Date(quotation.updated_at)
      };
    }));

    return quotations;
  } catch (error: any) {
    console.error('Error fetching quotations:', error);
    toast({
      title: "Error fetching quotations",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function createQuotation(quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Insert quotation - We don't need to provide quotation_number as the trigger will generate it
    const { data: newQuotation, error: quotationError } = await supabase
      .from('quotations')
      .insert({
        customer_id: quotation.customerId,
        subtotal: quotation.subtotal.toString(),
        tax: quotation.tax.toString(),
        discount: quotation.discount.toString(),
        total: quotation.total.toString(),
        notes: quotation.notes,
        expiry_date: quotation.expiryDate.toISOString(),
        status: quotation.status
      })
      .select()
      .single();

    if (quotationError) throw quotationError;

    // Insert quotation items
    const quotationItems = quotation.items.map(item => ({
      quotation_id: newQuotation.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice.toString(),
      discount: item.discount.toString(),
      tax: item.tax.toString(),
      total: item.total.toString()
    }));

    const { error: itemsError } = await supabase
      .from('quotation_items')
      .insert(quotationItems);

    if (itemsError) throw itemsError;

    toast({
      title: "Quotation created",
      description: `Quotation ${newQuotation.quotation_number} has been created successfully.`
    });

    return newQuotation.id;
  } catch (error: any) {
    console.error('Error creating quotation:', error);
    toast({
      title: "Error creating quotation",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}

export async function updateQuotation(id: string, quotation: Partial<Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    // Update quotation
    const updateData: any = {};
    
    if (quotation.customerId) updateData.customer_id = quotation.customerId;
    if (quotation.subtotal !== undefined) updateData.subtotal = quotation.subtotal.toString();
    if (quotation.tax !== undefined) updateData.tax = quotation.tax.toString();
    if (quotation.discount !== undefined) updateData.discount = quotation.discount.toString();
    if (quotation.total !== undefined) updateData.total = quotation.total.toString();
    if (quotation.notes !== undefined) updateData.notes = quotation.notes;
    if (quotation.expiryDate) updateData.expiry_date = quotation.expiryDate.toISOString();
    if (quotation.status) updateData.status = quotation.status;
    updateData.updated_at = new Date().toISOString();
    
    const { error: quotationError } = await supabase
      .from('quotations')
      .update(updateData)
      .eq('id', id);

    if (quotationError) throw quotationError;

    // If items are provided, delete existing items and insert new ones
    if (quotation.items) {
      // First delete existing items
      const { error: deleteError } = await supabase
        .from('quotation_items')
        .delete()
        .eq('quotation_id', id);

      if (deleteError) throw deleteError;

      // Then insert new items
      const quotationItems = quotation.items.map(item => ({
        quotation_id: id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice.toString(),
        discount: item.discount.toString(),
        tax: item.tax.toString(),
        total: item.total.toString()
      }));

      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(quotationItems);

      if (itemsError) throw itemsError;
    }

    toast({
      title: "Quotation updated",
      description: "Quotation has been updated successfully."
    });
  } catch (error: any) {
    console.error('Error updating quotation:', error);
    toast({
      title: "Error updating quotation",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}

export async function deleteQuotation(id: string) {
  try {
    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Quotation deleted",
      description: "The quotation has been deleted successfully."
    });
  } catch (error: any) {
    console.error('Error deleting quotation:', error);
    toast({
      title: "Error deleting quotation",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}

export async function convertQuotationToInvoice(quotation: Quotation) {
  try {
    // Create invoice from quotation
    const { data: newInvoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        customer_id: quotation.customerId,
        quotation_id: quotation.id,
        subtotal: quotation.subtotal.toString(),
        tax: quotation.tax.toString(),
        discount: quotation.discount.toString(),
        total: quotation.total.toString(),
        notes: quotation.notes,
        payment_terms: "Net 30", // Default payment terms
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: "sent"
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Copy quotation items to invoice items
    const invoiceItems = quotation.items.map(item => ({
      invoice_id: newInvoice.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice.toString(),
      discount: item.discount.toString(),
      tax: item.tax.toString(),
      total: item.total.toString()
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) throw itemsError;

    // Update quotation status to converted
    const { error: updateError } = await supabase
      .from('quotations')
      .update({
        status: "converted",
        updated_at: new Date().toISOString()
      })
      .eq('id', quotation.id);

    if (updateError) throw updateError;

    toast({
      title: "Quotation converted",
      description: `Quotation has been converted to invoice ${newInvoice.invoice_number}.`
    });

    return newInvoice.id;
  } catch (error: any) {
    console.error('Error converting quotation to invoice:', error);
    toast({
      title: "Error converting quotation",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}
