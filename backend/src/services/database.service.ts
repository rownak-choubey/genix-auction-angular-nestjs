import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseUtil } from '../utils/database/database.util';
import { logEvents } from '../utils/error-handeling/log-error.handeler.middleware';

@Injectable()
export class DatabaseService {
  private dbUtil: DatabaseUtil;

  constructor(private configService: ConfigService) {
    this.dbUtil = new DatabaseUtil(this.configService);
  }

  async execute(queryText: string, params: any[]): Promise<any> {
    try {
      const result = await this.dbUtil.query(queryText, params);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        await logEvents(
          `Error executing query: ${error.message}`,
          'errLog.log',
        );
        throw error;
      } else {
        await logEvents(`Unknown error executing query`, 'errLog.log');
        throw new Error('Unknown error executing query');
      }
    }
  }
}
