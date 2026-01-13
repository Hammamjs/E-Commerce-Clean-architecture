export const SQL = {
  findAllQuery: `
        SELECT
          id, name,
          price, in_stock AS "inStock", 
          created_at AS "createdAt" 
        FROM products
        `,
  findOneQuery: `
        SELECT
          id, name,
          price, in_stock AS "inStock", 
          created_at AS "createdAt" 
        FROM products
        WHERE id = $1
        `,
  dcreaseStockQuery: `UPDATE products
    SET in_stock = in_stock - $2
    WHERE id = $1 AND in_stock >= $2
    RETURNING in_stock
    `,
  createQuery: (fields: string, fieldsCount: string) => `
     INSERT INTO products (${fields}) VALUES (${fieldsCount}) RETURNING id, name, price, in_stock AS "inStock", created_at "createdAt"
     `,
  increaseStockQuery: `UPDATE products SET in_stock = in_stock + $2 WHERE id = $1 RETURNING in_stock AS "inStock"`,
  deleteOneQuery: `DELETE FROM products WHERE id = $1 RETURNING *`,
};
