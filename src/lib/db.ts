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

export async function execute(q: string, params: Record<string, any>) {
  const db = await connectDB();
  const request = db.request();
  Object.entries(params).forEach(([name, value]) => {
    request.input(name, value);
  });
  return request.query(q);
}
