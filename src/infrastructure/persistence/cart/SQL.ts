export const SQL = {
  updateCart: 'UPDATE carts SET status = $1 WHERE id = $2 RETURNING *',
  findUserCart:
    'SELECT id, user_id AS "userId", status, created_at AS "createdAt" FROM carts WHERE "user_id" = $1',
  create: `WITH inserted AS
        (
         INSERT INTO carts (user_id) VALUES ($1)
         ON CONFLICT DO NOTHING
         RETURNING *
        )
       SELECT * 
       FROM inserted
       UNION ALL
       SELECT * FROM 
       carts 
       WHERE user_id = $1`,
  deleteQuery: `DELETE FROM carts WHERE id = $1 RETURNING *`,
  findByIdQuery: `SELECT * FROM carts WHERE id = $1`,
};
