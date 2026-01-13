export const SQL = {
  findByOrdersId: `
           SELECT
             id, 
             order_id AS "orderId", 
             product_id AS "productId", 
             unit_price AS "unitPrice", 
             created_at AS "createdAt",
             status
           FROM order_items
             WHERE order_id = ANY($1)`,
  update: `UPDATE
       order_items 
       SET status = $1
        WHERE id = $2
         RETURNING *`,

  createItemsFromCart: `
        INSERT INTO order_items (order_id, product_id, unit_price, quantity)
        SELECT $1, product_id, unit_price, quantity
        FROM cart_items
        WHERE cart_id = $2
        RETURNING id,
         product_id AS "productId",
         order_id AS "orderId",
         unit_price AS "unitPrice",
         quantity, status,
         created_at AS createAt
      `,

  findById: 'SELECT * FROM order_items WHERE id = $1',
};
