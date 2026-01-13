export const SQL = {
  findAll:
    'SELECT id, full_name AS "fullName", email, created_at AS "createdAt" FROM users',
  findById:
    'SELECT id, full_name AS "fullName", email, created_at AS "createdAt" FROM users WHERE id = $1',
  create: (toUpdate: string, toUpdateSignature: string) =>
    `INSERT INTO users (${toUpdate}) VALUES (${toUpdateSignature}) RETURNING full_name AS "fullName", email, id, created_at "createdAt"`,
  update: (toUpdate: string, idIndx: number) =>
    `UPDATE users SET ${toUpdate} WHERE id = $${idIndx} RETURNING full_name AS "fullName", email, id `,
  findByEmail:
    'SELECT id, full_name AS "fullName", email, created_at AS "createdAt" FROM users WHERE email = $1',
  delete:
    'DELETE FROM users WHERE id = $1 RETURNING full_name AS "fullName", email, id',
};
