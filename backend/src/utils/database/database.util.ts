// src/common/utils/database.util.ts
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { logEvents } from '../error-handeling/log-error.handeler.middleware';

export class DatabaseUtil {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      user: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
    });
  }

  async query(queryText: string, params: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(queryText, params);
      return res;
    } catch (error) {
      await logEvents(`Database query error: ${error.message}`, 'errLog.log');
      throw error;
    } finally {
      client.release();
    }
  }
}
