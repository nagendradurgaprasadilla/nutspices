import { db } from "@/db";
import { products, productVariations, orderItems, orders } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Try finding by slug first, or by numeric ID if slug happens to be an integer
    const isNumeric = /^\d+$/.test(slug);
    const productIdNum = isNumeric ? parseInt(slug, 10) : null;

    let productRows;
    if (productIdNum !== null) {
      productRows = await db
        .select()
        .from(products)
        .where(or(eq(products.slug, slug), eq(products.id, productIdNum)))
        .limit(1);
    } else {
      productRows = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1);
    }

    if (!productRows.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = productRows[0];
    const productId = product.id;

    const variations = await db
      .select()
      .from(productVariations)
      .where(eq(productVariations.productId, productId));

    const productOrderItems = await db
      .select({
        variationId: orderItems.variationId,
        quantity: orderItems.quantity,
        size: orderItems.size,
        status: orders.status,
      })
      .from(orderItems)
      .leftJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orderItems.productId, productId));

    const variationsWithRealStock = variations.map(v => {
      const vOrders = productOrderItems.filter(item => 
        item.variationId === v.id || item.size === v.size
      );

      const itemsSoldOrPending = vOrders
        .filter(item => 
          item.status && 
          ["order placed", "processing", "shipped", "in transit", "out for delivery", "delivered"].includes(item.status.toLowerCase())
        )
        .reduce((sum, item) => sum + (item.quantity || 0), 0);

      return {
        ...v,
        stock: Math.max(0, v.stock - itemsSoldOrPending)
      };
    });

    return NextResponse.json({
      ...product,
      variations: variationsWithRealStock,
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
