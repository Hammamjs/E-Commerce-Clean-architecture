export const SQL = {
  findAllOrdersPerUser:
    'SELECT id, total, status, created_at AS "createdAt" FROM orders WHERE user_id = $1',
  findById: `
    SELECT * FROM orders WHERE id = $1 
    `,
  updateStatus: `
    UPDATE orders SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *
    `,
  create: `
      INSERT INTO orders (user_id, total)
      SELECT user_id, $2
      FROM carts
      WHERE user_id = $1
      RETURNING *
    `,
  delete: `
    DELETE FROM orders WHERE id = $1 RETURNING *
    `,
};
