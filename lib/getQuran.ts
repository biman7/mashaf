import { readFileSync } from 'fs';
import { join } from 'path';
import { QuranPage } from '@types';

const quranPagesMetadata = JSON.parse(
  readFileSync(join(process.cwd(), 'data/quran/pages.json')).toString('utf-8'),
) as QuranPage[];

export const getQuranPage = (pageId: number) =>
  quranPagesMetadata.find((page) => page.id === pageId);
