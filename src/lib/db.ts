import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function saveTdcData(deviceId: string, value: number) {
  await pool.query(
    'INSERT INTO tdc_data (device_id, value) VALUES ($1, $2)',
    [deviceId, value]
  );
}

export async function getTdcData(limit = 50) {
  const result = await pool.query(
    'SELECT * FROM tdc_data ORDER BY timestamp DESC LIMIT $1',
    [limit]
  );
  return result.rows;
}
