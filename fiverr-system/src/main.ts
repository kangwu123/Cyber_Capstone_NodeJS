import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptors/response-success.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/interceptors/http-exception.filter';
import { setupSwagger } from './common/constants/app.swagger';
import { ConfigService } from '@nestjs/config';
import {PORT} from './common/constants/app.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new LoggingInterceptor());
  // Khai báo Global Interceptor để tự động lọc dữ liệu dựa trên DTO (@Exclude, @Expose)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ResponseSuccessInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,     // Loại bỏ các field không khai báo trong DTO
    transform: true,     // KÍCH HOẠT TRANSFORM: Biến String thành Date Object
    transformOptions: {
      enableImplicitConversion: true, // Tự động chuyển kiểu nếu có thể
    },
  }));
  // Set Swagger API documentation
  setupSwagger(app);
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/',(req, res) => {
    res.redirect('/api/docs');
  });

  await app.listen(Number(PORT));
  console.log(`Application is running on: http://localhost:${PORT}/api/v1`);
  console.log(`Swagger Docs available at: http://localhost:${PORT}/api/docs`);
}
bootstrap();

