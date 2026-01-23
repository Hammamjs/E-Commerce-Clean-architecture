import { MigrationBuilder } from "node-pg-migrate"

export const up = (pgm: MigrationBuilder) => {
 pgm.addColumn('users', {
  refresh_token: {
   type: 'TEXT',
   notNull: false,
   default: null
  }
 })
}