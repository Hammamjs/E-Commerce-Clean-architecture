export const SQL = {
  findAll: `
        SELECT
          id, name,
          price, in_stock AS "inStock", 
          created_at AS "createdAt" 
        FROM products
        `,
  findById: `
        SELECT
          id, name,
          price, in_stock AS "inStock", 
          created_at AS "createdAt" 
        FROM products
        WHERE id = $1
        `,
  create: (toUpdate: string, toUpdateSignature: string) => `
     INSERT INTO products (${toUpdate}) VALUES (${toUpdateSignature}) RETURNING id, name, price, in_stock AS "inStock", created_at "createdAt"
     `,
  update: (toUpdate: string, idIndx: number) => `
     UPDATE products SET ${toUpdate} WHERE id = $${idIndx} RETURNING id, name, price, in_stock AS "inStock", created_at AS "createdAt"
     `,
};
