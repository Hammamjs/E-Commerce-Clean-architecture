export const SQL = {
  findAll:
    'SELECT id, full_name AS "fullName", email, created_at AS "createdAt" FROM users',
  findByEmail:
    'SELECT id, full_name AS "fullName", email, created_at AS "createdAt" FROM users WHERE email = $1',
  findById:
    'SELECT id, full_name AS "fullName", email, created_at AS "createdAt" FROM users WHERE id = $1',
  create: (fields: string, fieldsCount: string) =>
    `INSERT INTO users (${fields}) VALUES (${fieldsCount}) RETURNING full_name AS "fullName", email, id, created_at "createdAt"`,
  update: (fieldsToUpdate: string, length: number) =>
    `UPDATE users SET ${fieldsToUpdate} WHERE id = $${length + 1} RETURNING full_name AS "fullName", email, id `,
  delete:
    'DELETE FROM users WHERE id = $1 RETURNING full_name AS "fullName", email, id ',
};
