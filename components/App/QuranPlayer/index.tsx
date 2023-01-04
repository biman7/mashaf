import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const QuranPlayer = ({ versesSelection }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState({
    isPlaying: false,
    currentTrack: '',
  });
  const [tracks, setTracks] = useState<string[]>([]);

  useEffect(() => {
    let from = versesSelection.from?.verse?.id || -1;
    let to = versesSelection.to?.verse?.id || -1;

    let newTracks: string[] = [];

    for (let i = from; i > -1 && i <= to; i++) {
      newTracks.push(
        `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${i}.mp3`,
      );
    }

    setTracks(newTracks);
    setState({
      ...state,
      currentTrack: newTracks[0] || '',
    });
  }, [versesSelection]);

  useLayoutEffect(() => {
    if (audioRef.current) {
      if (state.isPlaying) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [state]);

  function handleTrackEnd() {
    let currentIndex = tracks.indexOf(state.currentTrack);
    let next = tracks[currentIndex + 1];

    if (next) {
      setState({
        ...state,
        currentTrack: next,
      });
    }
  }

  function play() {
    setState({
      ...state,
      isPlaying: true,
    });
  }

  return (
    <div className="bg-white shadow rounded overflow-hidden border-t-8 border-gray-300 p-2">
      <p className="text-gray-500 text-right pb-4">الإستماع</p>
      <div className="flex flex-col gap-4">
        <div className="flex justify-around">
          <div className="flex flex-col gap-2">
            <p className="text-gray-900 font-bold">من</p>
            {versesSelection.from ? (
              <p className="text-blue-600">{`${versesSelection.from.chapter.name} الآية ${versesSelection.from.verse.verse_number}`}</p>
            ) : (
              <p className="text-gray-400">غير محدد</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-900 font-bold">إلى</p>
            {versesSelection.to ? (
              <p className="text-blue-600">{`${versesSelection.to.chapter.name} الآية ${versesSelection.to.verse.verse_number}`}</p>
            ) : (
              <p className="text-gray-400">غير محدد</p>
            )}
          </div>
        </div>
        <hr className="border-gray-300" />
        <div className="flex justify-center items-center">
          {state.currentTrack && (
            <audio
              src={state.currentTrack}
              onEnded={handleTrackEnd}
              ref={audioRef}
            ></audio>
          )}
          <button
            className={`w-full h-10 text-center px-3 inline-flex justify-center gap-2 items-center text-white ${
              tracks.length ? 'bg-green-400' : 'bg-gray-400 pointer-events-none'
            } shadow rounded`}
            onClick={play}
          >
            <FontAwesomeIcon icon={faPlay} />
            <span>تشغيل</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuranPlayer;
