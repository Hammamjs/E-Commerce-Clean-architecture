import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
 pgm.alterColumn('users', 'refresh_token', {
  type: 'TEXT',
  notNull: false,
  default: null
 })
}