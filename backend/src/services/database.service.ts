import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseUtil } from 'src/utils/database/database.util';
import { logEvents } from 'src/utils/error-handeling/log-error.handeler.middleware';

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
      await logEvents(`Error executing query: ${error.message}`, 'errLog.log');
      throw error;
    }
  }
}
