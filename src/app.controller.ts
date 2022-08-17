import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('home')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('latency')
  latency(): Promise<string> {
    return this.appService.latency();
  }
}
