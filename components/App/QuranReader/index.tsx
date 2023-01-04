import { ComponentType, useLayoutEffect, useState } from 'react';
import { Line, QuranPage, VersesSelection, Word } from '@types';

interface Props {
  page: QuranPage;
  onSelectionChange: (versesSelection: VersesSelection) => any;
}

const QuranReader: ComponentType<Props> = ({ page, onSelectionChange }) => {
  const lines = getPageLines(page);
  const [versesSelection, setVersesSelection] = useState<VersesSelection>({
    to: null,
    from: null,
  });
  const [hoveredVerse, setHoveredVerse] = useState<number>(0);

  function handleWordHover(word: Word) {
    setHoveredVerse(word.verse_id);
  }

  function handleWordClick({ chapter, verse }: Word) {
    let fromVerseId = versesSelection.from?.verse?.id || -1;
    let toVerseId = versesSelection.to?.verse?.id || -1;

    let newVersesSelection = {
      ...versesSelection,
    };

    if (fromVerseId * toVerseId <= 1) {
      newVersesSelection.from = {
        chapter,
        verse,
      };
      newVersesSelection.to = {
        chapter,
        verse,
      };
    } else if (verse.id >= fromVerseId && verse.id <= toVerseId) {
      newVersesSelection.from = null;
      newVersesSelection.to = null;
    } else if (verse.id > toVerseId) {
      newVersesSelection.to = {
        chapter,
        verse,
      };
    } else if (verse.id < fromVerseId) {
      newVersesSelection.from = {
        chapter,
        verse,
      };
    }

    setVersesSelection(newVersesSelection);
  }

  useLayoutEffect(() => {
    onSelectionChange(versesSelection);
  }, [versesSelection]);

  return (
    <div className="flex w-[480px] h-[560px] items-center justify-center text-[22px] font-uthmanic-hafs">
      <div className="flex flex-col gap-2">
        {lines.map((line, index) => {
          return line.type == 'chapter_verses' ? (
            <div
              className={`flex-initial w-full h-[26px] flex z-20`}
              key={index}
            >
              <AyatLine
                line={line}
                hoveredVerse={hoveredVerse}
                versesSelection={versesSelection}
                onWordHover={handleWordHover}
                onWordClick={handleWordClick}
              />
            </div>
          ) : line.type == 'chapter_header' ? (
            <div
              className="z-20 relative w-full h-[26px] flex justify-center items-center"
              key={index}
            >
              {
                <p className="absolute left-1/2 -translate-x-1/2">
                  {line.chapterName}
                </p>
              }
            </div>
          ) : line.type == 'chapter_basmalah' ? (
            <p className="z-20 flex justify-center items-center">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          ) : null;
        })}
      </div>
    </div>
  );
};

const AyatLine = ({
  line,
  hoveredVerse,
  versesSelection,
  onWordClick,
  onWordHover,
}) => (
  <div
    className={`flex items-center ${
      line.isCentered ? 'w-full justify-center' : 'w-full'
    }`}
  >
    {line.words.map((w, wordIndex) => {
      let fromVerseId = versesSelection.from?.verse?.id || -1;
      let toVerseId = versesSelection.to?.verse?.id || -1;
      let isWithinSelection =
        w.verse.id >= fromVerseId && w.verse.id <= toVerseId;

      return (
        <span
          className={`cursor-pointer ${
            isWithinSelection ? 'bg-green-100' : ''
          } ${
            line.isCentered ? 'px-1' : 'flex-auto inline-flex justify-center'
          } text-black ${hoveredVerse == w.verse_id ? 'bg-blue-100' : ''}`}
          onMouseMove={() => onWordHover(w)}
          onMouseLeave={() => onWordHover({ verse_id: null })}
          onClick={() => onWordClick(w)}
          key={wordIndex}
        >
          {w.text_imlaei}
        </span>
      );
    })}
  </div>
);

const pagesCenteredLines = {
  // some pages have lines that are are not taking full width, instead they are centered on the page like page of surah al fatihah
  // note that chapter's header takes 1 line, basmalah takes 1 line
  1: [2, 3, 4, 5, 6, 7, 8],
  2: [3, 4, 5, 6, 7, 8],
  255: [2],
  528: [9],
  534: [6],
  545: [6],
  593: [2],
  594: [5],
  600: [10],
  602: [5, 15],
  603: [10, 15],
  604: [4, 9, 14, 15],
};

function getPageLines(page) {
  const centeredLines = pagesCenteredLines[page.id] || [];
  const lines: Line[] = [];
  let currentLine = 0;

  page.chapters.forEach((c) => {
    c.verses.forEach((v) => {
      v.words.forEach((w) => {
        w = {
          ...w,
          verse: v,
          chapter: c,
        };
        if (w.line_number != currentLine) {
          let diff = w.line_number - currentLine;
          currentLine = currentLine + diff;

          if (diff >= 2) {
            lines.push({
              type: 'chapter_header',
              chapterName: c.name,
            });
          }

          if (diff >= 3) {
            lines.push({
              type: 'chapter_basmalah',
            });
          }

          lines.push({
            type: 'chapter_verses',
            words: [w],
            isCentered: centeredLines.includes(w.line_number),
          });
        } else {
          lines[lines.length - 1].words?.push(w);
        }
      });
    });
  });

  return lines;
}

export default QuranReader;
