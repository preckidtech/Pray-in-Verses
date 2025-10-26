import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CuratedPrayersModule } from './modules/curated-prayers/curated-prayers.module';
import { SavedPrayersModule } from './modules/saved-prayers/saved-prayers.module';
import { JournalsModule } from './modules/journals/journals.module';
import { AdminModule } from './modules/admin/admin.module';
import { AdminCuratedModule } from './modules/admin-curated/admin-curated.module';
import { BibleModule } from './modules/bible/bible.module';
import { PrayerWallModule } from './modules/prayer-wall/prayer-wall.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CuratedPrayersModule,
    SavedPrayersModule,
    JournalsModule,
    AdminModule,
    AdminCuratedModule,
    BibleModule,
    PrayerWallModule
  ],
})
export class AppModule {}
