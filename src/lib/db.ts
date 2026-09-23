import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PWD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function connectDB() {
  if (pool) return pool;
  try {
    pool = await new sql.ConnectionPool(config).connect();
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
}

export async function query(q: string) {
  const db = await connectDB();
  return db.request().query(q);
}

type SqlParameter = string | number | boolean | Date | Buffer | null | undefined;

export async function execute(q: string, params: Record<string, SqlParameter>) {
  const db = await connectDB();
  const request = db.request();
  Object.entries(params).forEach(([name, value]) => {
    request.input(name, value);
  });
  return request.query(q);
}

export async function executeTransaction(statements: Array<{ sql: string; params: Record<string, SqlParameter> }>) {
  const transaction = new sql.Transaction(await connectDB());
  await transaction.begin();
  try {
    for (const statement of statements) {
      const request = new sql.Request(transaction);
      Object.entries(statement.params).forEach(([name, value]) => request.input(name, value));
      await request.query(statement.sql);
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
