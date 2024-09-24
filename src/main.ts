import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectDB } from "./drizzle/db";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  connectDB();
  await app.listen(process.env.NODE_PORT);
}
bootstrap();
