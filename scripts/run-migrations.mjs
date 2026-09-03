import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sql from 'mssql';
import { closeDatabase, connectDatabase } from './db.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(scriptDirectory, '../src/lib/migrations');

async function run() {
  const files = (await readdir(migrationsDirectory))
    .filter((file) => /^\d+.*\.sql$/i.test(file))
    .sort((left, right) => left.localeCompare(right));

  const connection = await connectDatabase();
  await connection.request().batch(`
    IF OBJECT_ID(N'dbo.SchemaMigrations', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.SchemaMigrations (
        MigrationName NVARCHAR(255) NOT NULL PRIMARY KEY,
        AppliedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END
  `);

  const appliedResult = await connection.request().query('SELECT MigrationName FROM dbo.SchemaMigrations');
  const applied = new Set(appliedResult.recordset.map((row) => row.MigrationName));

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`Skipped ${file} (already applied)`);
      continue;
    }

    const source = await readFile(path.join(migrationsDirectory, file), 'utf8');
    const transaction = new sql.Transaction(connection);
    await transaction.begin();

    try {
      await new sql.Request(transaction).batch(source);
      await new sql.Request(transaction)
        .input('MigrationName', sql.NVarChar(255), file)
        .query('INSERT INTO dbo.SchemaMigrations (MigrationName) VALUES (@MigrationName)');
      await transaction.commit();
      console.log(`Applied ${file}`);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

try {
  await run();
  console.log('Database migrations completed.');
} catch (error) {
  console.error('Database migration failed:', error);
  process.exitCode = 1;
} finally {
  await closeDatabase();
}
