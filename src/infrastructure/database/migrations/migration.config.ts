import { dbUrl } from "./database_url";

export default {
 migrationTable: 'migrations',
 dir: 'src/infrastructure/database/migrations',
 databaseUrl: dbUrl,
 verbose: true
}