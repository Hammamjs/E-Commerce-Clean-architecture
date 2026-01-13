export const SQL = {
  findAllItemsInCartQuery: `
         SELECT 
           id,
           cart_id AS "cartId",
           product_id AS "productId",
           total, quantity,
           unit_price AS "unitPrice",
           created_at AS "createdAt"
         FROM cart_items
           WHERE cart_id = $1`,
  insertItemQuery: `
               INSERT INTO cart_items (cart_id, product_id,quantity, unit_price, total)
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (cart_id, product_id)
               DO UPDATE SET
                quantity = cart_items.quantity + EXCLUDED.quantity,
                unit_price = EXCLUDED.unit_price,
                total = EXCLUDED.unit_price * (cart_items.quantity + EXCLUDED.quantity)
                RETURNING id, cart_id AS "cartId", unit_price AS "unitPrice", total, created_at AS "createdAt", quantity, total
               `,

  removeItemQuery: `
                       UPDATE cart_items
                       SET 
                        quantity = quantity - $3,
                        total = unit_price * (quantity - $3)
                       WHERE cart_id = $1
                        AND product_id = $2
                        AND quantity >= $3
                        RETURNING id, cart_id AS "cartId",
                        product_id AS "productId",
                        quantity, total, 
                        unit_price AS "unitPrice",
                        created_at AS "createdAt"
                       `,
  updateStatusQuery: `UPDATE order_items SET status = $1 WHERE id = $2 RETURNING`,
};
