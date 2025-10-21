import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CuratedPrayersModule } from './modules/curated-prayers/curated-prayers.module';
import { SavedPrayersModule } from './modules/saved-prayers/saved-prayers.module';
import { JournalsModule } from './modules/journals/journals.module';
import { AdminModule } from './modules/admin/admin.module';
import { AdminCuratedModule } from './modules/admin-curated/admin-curated.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CuratedPrayersModule,
    SavedPrayersModule,
    JournalsModule,
    AdminModule,
    AdminCuratedModule
  ],
})
export class AppModule {}
