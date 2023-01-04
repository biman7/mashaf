export interface Word {
  char_type_name: 'word' | 'end';
  line_number: number;
  position: number;
  text_imlaei: string;
  verse_id: number;
  verse: Verse;
  chapter: Chapter;
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  chapter_id: number;
  page_number: number;
  juz_number: number;
  words: Word[];
}

export interface Chapter {
  id: number;
  verses: Verse[];
  name: string;
  bismillah_pre: boolean;
}

export interface QuranPage {
  id: number;
  chapters: Chapter[];
}

export interface VersesSelection {
  from?: {
    chapter: Chapter;
    verse: Verse;
  } | null;
  to: {
    chapter: Chapter;
    verse: Verse;
  } | null;
}

export interface Line {
  type: 'chapter_header' | 'chapter_basmalah' | 'chapter_verses';
  chapterName?: string;
  words?: Word[];
  isCentered?: boolean;
}
