import pg from 'pg';

export default class PGClient {
  pool: pg.Pool;

  constructor() {
    this.pool = new pg.Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'postgres',
      password: process.env.DB_PASSWORD || 'mysecretpassword',
      port: parseInt(process.env.DB_PORT || '5432'),
    })

  }

  async beginTransaction() {
    this.pool.connect();
    await this.pool.query('BEGIN')
  }

  async executeQuery(query: string) {
    try {
      return await this.pool.query(query);
    } catch (error) {
      await this.pool.end();
      console.error(`Error while executing query: ${error}`)
      throw error;
    }
  }

  async commit() {
    await this.pool.query('COMMIT')
  }

  async rollback() {
    await this.pool.query('ROLLBACK')
  }
}