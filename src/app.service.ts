import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) { }

  async latency(): Promise<string> {
    const startTime = new Date().getTime();
    const requestTime = await this.httpService.axiosRef('https://www.google.com/')
      .then(() => { return new Date().getTime() - startTime });
    return requestTime + ' ms';
  }
}