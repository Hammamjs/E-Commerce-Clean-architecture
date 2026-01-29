import { runner } from 'node-pg-migrate'
import config from './src/infrastructure/database/migration.config';

async function run() {
 console.log("🚀 Starting migrations...")
 try {
  await runner({
   ...config,
   databaseUrl: config.databaseUrl,
   direction: 'up',
   migrationsTable: 'migrations',
   verbose: true,
   checkOrder: false,
  })
  console.log("✅ Migrations completed successfully")
 } catch (error) {
  console.error("❌ Error running migrations:", error)
  process.exit(1)
 }
}

run()