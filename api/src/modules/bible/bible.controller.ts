import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BibleService } from './bible.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtCookieAuthGuard, RolesGuard)
@Roles(Role.EDITOR, Role.MODERATOR, Role.SUPER_ADMIN)
@Controller('admin/bible')
export class BibleController {
  constructor(private readonly bible: BibleService) {}

  @Get('books')
  getBooks() {
    return this.bible.getBooks();
  }

  @Get('books/:book/chapters')
  getChapters(@Param('book') book: string) {
    return this.bible.getChapters(book);
  }

  @Get('books/:book/chapters/:chapter/verses')
  getVerses(
    @Param('book') book: string,
    @Param('chapter', ParseIntPipe) chapter: number,
  ) {
    return this.bible.getVerses(book, chapter);
  }
}
