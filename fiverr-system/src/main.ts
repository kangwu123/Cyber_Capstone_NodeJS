import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptors/response-success.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/interceptors/http-exception.filter';
import { setupSwagger } from './common/constants/app.swagger';
import { PORT } from './common/constants/app.constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TokenCybersoftGuard } from './common/guards/token-cybersoft.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Enable CORS
  app.enableCors();
    // Set global prefix
  app.setGlobalPrefix('api');
  // Khai báo Global Interceptor để log tất cả request và response
  app.useGlobalInterceptors(new LoggingInterceptor());
  // Khai báo Global Interceptor để tự động lọc dữ liệu dựa trên DTO (@Exclude, @Expose)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ResponseSuccessInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  // Require Cybersoft token header on all API requests
  app.useGlobalGuards(new TokenCybersoftGuard());
  // Add validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,     // Loại bỏ các field không khai báo trong DTO
    forbidNonWhitelisted: true, // Ném lỗi nếu có field không khai báo trong DTO
    transform: true,     // KÍCH HOẠT TRANSFORM: Biến String thành Date Object
    transformOptions: {
      enableImplicitConversion: true, // Tự động chuyển kiểu nếu có thể
    },
  }));

  // Set Swagger API documentation
  setupSwagger(app);

  await app.listen(Number(PORT));
  console.log(`Server Application is running on: http://localhost:${PORT}`);
  console.log(`Swagger Docs available at: http://localhost:${PORT}/api/docs`);
}
bootstrap();
