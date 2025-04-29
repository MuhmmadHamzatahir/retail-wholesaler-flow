
import { supabase } from "@/integrations/supabase/client";
import { InventoryItem, StockMovement } from "@/types";
import { toast } from "@/components/ui/use-toast";

export async function getInventory(): Promise<InventoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        id,
        product_id,
        location,
        quantity,
        updated_at,
        products (name)
      `);

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      productId: item.product_id,
      productName: item.products.name,
      location: item.location,
      quantity: item.quantity,
      lastUpdated: new Date(item.updated_at)
    }));
  } catch (error: any) {
    console.error('Error fetching inventory:', error);
    toast({
      title: "Error fetching inventory",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function getStockMovements(): Promise<StockMovement[]> {
  try {
    const { data, error } = await supabase
      .from('stock_movements')
      .select(`
        id,
        product_id,
        type,
        quantity,
        from_location,
        to_location,
        reference,
        notes,
        created_at,
        products (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(movement => ({
      id: movement.id,
      productId: movement.product_id,
      type: movement.type as "in" | "out" | "transfer" | "adjustment",
      quantity: movement.quantity,
      fromLocation: movement.from_location,
      toLocation: movement.to_location,
      reference: movement.reference || "",
      notes: movement.notes,
      date: new Date(movement.created_at)
    }));
  } catch (error: any) {
    console.error('Error fetching stock movements:', error);
    toast({
      title: "Error fetching stock movements",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function createStockMovement(movement: Omit<StockMovement, 'id' | 'date'>) {
  try {
    // Begin a transaction
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('product_id', movement.productId)
      .eq('location', movement.type === 'in' ? movement.toLocation : movement.fromLocation)
      .single();

    if (inventoryError && inventoryError.code !== 'PGRST116') throw inventoryError;

    // Create the stock movement record
    const { data: newMovement, error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        product_id: movement.productId,
        type: movement.type,
        quantity: movement.quantity,
        from_location: movement.fromLocation,
        to_location: movement.toLocation,
        reference: movement.reference,
        notes: movement.notes
      })
      .select()
      .single();

    if (movementError) throw movementError;

    // Update inventory based on movement type
    if (movement.type === 'in') {
      // If this is first inventory record for this product & location, create it
      if (inventoryError && inventoryError.code === 'PGRST116') {
        const { error } = await supabase
          .from('inventory')
          .insert({
            product_id: movement.productId,
            location: movement.toLocation || 'Main Warehouse',
            quantity: movement.quantity
          });

        if (error) throw error;
      } else {
        // Update existing inventory
        const { error } = await supabase
          .from('inventory')
          .update({ 
            quantity: inventoryData!.quantity + movement.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('product_id', movement.productId)
          .eq('location', movement.toLocation || 'Main Warehouse');

        if (error) throw error;
      }
    } else if (movement.type === 'out') {
      if (!inventoryData) throw new Error('No inventory found for this product and location');

      // Ensure there's enough stock
      if (inventoryData.quantity < movement.quantity) {
        throw new Error('Not enough stock available');
      }

      // Update inventory
      const { error } = await supabase
        .from('inventory')
        .update({ 
          quantity: inventoryData.quantity - movement.quantity,
          updated_at: new Date().toISOString()
        })
        .eq('product_id', movement.productId)
        .eq('location', movement.fromLocation || 'Main Warehouse');

      if (error) throw error;
    }

    toast({
      title: "Stock movement created",
      description: `${movement.type.charAt(0).toUpperCase() + movement.type.slice(1)} movement recorded successfully.`
    });

    return newMovement.id;
  } catch (error: any) {
    console.error('Error creating stock movement:', error);
    toast({
      title: "Error creating stock movement",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}
