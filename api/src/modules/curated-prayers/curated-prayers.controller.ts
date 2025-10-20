import { Controller, Get, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { CuratedPrayersService } from './curated-prayers.service';
import { JwtCookieAuthGuard } from '../auth/jwt.guard';
import type { Request } from 'express';

@UseGuards(JwtCookieAuthGuard) // login required for all routes
@Controller('browse')
export class CuratedPrayersController {
  constructor(private service: CuratedPrayersService) {}

  @Get('books')
  async books() {
    const data = await this.service.listBooks();
    return { data };
  }

  @Get('books/:book/chapters')
  async chapters(@Param('book') book: string) {
    const data = await this.service.listChapters(book);
    return { data };
  }

  @Get('books/:book/chapters/:chapter/verses')
  async verses(@Param('book') book: string, @Param('chapter', ParseIntPipe) chapter: number) {
    const data = await this.service.listVerses(book, chapter);
    return { data };
  }

  @Get('verse/:book/:chapter/:verse')
  async verseContent(
    @Req() req: Request,
    @Param('book') book: string,
    @Param('chapter', ParseIntPipe) chapter: number,
    @Param('verse', ParseIntPipe) verse: number,
  ) {
    // @ts-ignore
    const userId = req.user.id as string;
    const data = await this.service.getByRef(book, chapter, verse, userId);
    return { data };
  }
}
