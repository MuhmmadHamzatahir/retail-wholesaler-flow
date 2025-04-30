import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant } from "@/types";
import { toast } from "@/components/ui/use-toast";

export async function getProducts(): Promise<Product[]> {
  try {
    // Fetch products from Supabase
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) throw productsError;

    // Fetch variants for each product
    const products = await Promise.all(productsData.map(async (product) => {
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', product.id);

      if (variantsError) throw variantsError;

      // Fetch inventory for this product
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('product_id', product.id)
        .single();

      const inStock = inventoryData?.quantity || 0;

      // Map database model to application model
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        category: product.category || '',
        barcode: product.barcode || '',
        image: product.image_url,
        retailPrice: parseFloat(product.retail_price),
        wholesalePrice: parseFloat(product.wholesale_price),
        cost: parseFloat(product.cost),
        taxRate: parseFloat(product.tax_rate),
        inStock: inStock,
        minStockLevel: product.min_stock_level || 10,
        variants: variantsData.map(variant => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: parseFloat(variant.price),
          cost: parseFloat(variant.cost),
          attributes: variant.attributes as Record<string, string>
        })),
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at)
      };
    }));

    return products;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    toast({
      title: "Error fetching products",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Insert product
    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        category: product.category,
        barcode: product.barcode,
        image_url: product.image,
        retail_price: product.retailPrice.toString(), // Convert to string
        wholesale_price: product.wholesalePrice.toString(), // Convert to string
        cost: product.cost.toString(), // Convert to string
        tax_rate: product.taxRate.toString(), // Convert to string
        min_stock_level: product.minStockLevel
      })
      .select()
      .single();

    if (productError) throw productError;

    // Insert variants if any
    if (product.variants && product.variants.length > 0) {
      const variants = product.variants.map(variant => ({
        product_id: newProduct.id,
        name: variant.name,
        sku: variant.sku,
        price: variant.price.toString(), // Convert to string
        cost: variant.cost.toString(), // Convert to string
        attributes: variant.attributes
      }));

      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(variants);

      if (variantsError) throw variantsError;
    }

    // Create initial inventory record
    const { error: inventoryError } = await supabase
      .from('inventory')
      .insert({
        product_id: newProduct.id,
        quantity: product.inStock
      });

    if (inventoryError) throw inventoryError;

    toast({
      title: "Product created",
      description: `${product.name} has been created successfully.`
    });

    return newProduct.id;
  } catch (error: any) {
    console.error('Error creating product:', error);
    toast({
      title: "Error creating product",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}

export async function updateProduct(id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    // Update product
    const updateData: any = {};
    
    if (product.name) updateData.name = product.name;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.category !== undefined) updateData.category = product.category;
    if (product.barcode !== undefined) updateData.barcode = product.barcode;
    if (product.image !== undefined) updateData.image_url = product.image;
    if (product.retailPrice !== undefined) updateData.retail_price = product.retailPrice.toString();
    if (product.wholesalePrice !== undefined) updateData.wholesale_price = product.wholesalePrice.toString();
    if (product.cost !== undefined) updateData.cost = product.cost.toString();
    if (product.taxRate !== undefined) updateData.tax_rate = product.taxRate.toString();
    if (product.minStockLevel !== undefined) updateData.min_stock_level = product.minStockLevel;
    updateData.updated_at = new Date().toISOString();
    
    const { error: productError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (productError) throw productError;

    // Update inventory if inStock is provided
    if (product.inStock !== undefined) {
      const { error: inventoryError } = await supabase
        .from('inventory')
        .update({ quantity: product.inStock })
        .eq('product_id', id);

      if (inventoryError) throw inventoryError;
    }

    toast({
      title: "Product updated",
      description: `${product.name || 'Product'} has been updated successfully.`
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    toast({
      title: "Error updating product",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully."
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    toast({
      title: "Error deleting product",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
}
