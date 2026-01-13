export const SQL = {
  findAllOrdersPerUserQuery:
    'SELECT id, total, status, created_at AS "createdAt" FROM orders WHERE user_id = $1',
  findByIdQuery: `
    SELECT * FROM orders WHERE id = $1 
    `,
  updateStatusQuery: `
    UPDATE orders SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *
    `,
  createQuery: `
      INSERT INTO orders (user_id, total)
      SELECT user_id, $2
      FROM carts
      WHERE user_id = $1
      RETURNING *
    `,
  deleteQuery: `
    DELETE FROM orders WHERE id = $1 RETURNING *
    `,
};
