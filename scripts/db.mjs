import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool;

export async function connectDatabase() {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
  }
  return pool;
}

export async function execute(statement, params = {}) {
  const connection = await connectDatabase();
  const request = connection.request();
  Object.entries(params).forEach(([name, value]) => request.input(name, value));
  return request.query(statement);
}

export async function closeDatabase() {
  if (pool) {
    await pool.close();
    pool = undefined;
  }
}
