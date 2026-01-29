import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
 pgm.addColumn('users', {
  role: {
   type: 'TEXT',
   notNull: true,
   default: 'USER',
   check: "role IN ('USER', 'ADMIN')"
  }
 })
}

export const down = (pgm: MigrationBuilder) => {
 pgm.dropColumn('users', 'role');
}