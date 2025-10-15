// api/src/app.module.ts
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CuratedPrayersModule } from './modules/curated-prayers/curated-prayers.module';
import { SavedPrayersModule } from './modules/saved-prayers/saved-prayers.module';
import { JournalsModule } from './modules/journals/journals.module';
import { OptionalAuthMiddleware } from './modules/auth/optional-auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({}), AuthModule, CuratedPrayersModule, SavedPrayersModule, JournalsModule],
})
export class AppModule {
  constructor(private readonly jwt: JwtService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OptionalAuthMiddleware).forRoutes('*');
  }
}
