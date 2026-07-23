'use client';

import { Pause, Play, RotateCcw, RotateCw } from 'lucide-react';
import { useCallback, useRef, useState, type CSSProperties } from 'react';

const playbackRates = [0.75, 1, 1.25, 1.5, 2] as const;

function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';

  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function PostAudioPlayer({
  src,
  isChinese,
}: {
  src: string;
  isChinese: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasError, setHasError] = useState(false);

  const setAudioElement = useCallback((audio: HTMLAudioElement | null) => {
    audioRef.current = audio;
    if (!audio || !Number.isFinite(audio.duration)) return;

    setDuration(audio.duration);
    setCurrentTime(audio.currentTime);
    setPlaybackRate(audio.playbackRate);
  }, []);

  const seekTo = (nextTime: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration)) return;

    const boundedTime = Math.min(Math.max(nextTime, 0), duration);
    audio.currentTime = boundedTime;
    setCurrentTime(boundedTime);
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setHasError(true);
      }
    } else {
      audio.pause();
    }
  };

  const updatePlaybackRate = (nextRate: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressStyle = { '--audio-progress': `${progress}%` } as CSSProperties;
  const labels = isChinese
    ? {
        section: '文章音频',
        player: '文章音频播放器',
        play: '播放',
        pause: '暂停',
        back: '后退 15 秒',
        forward: '前进 15 秒',
        timeline: '播放进度',
        speed: '语速',
        error: '音频暂时无法播放。',
      }
    : {
        section: 'ARTICLE AUDIO',
        player: 'Article audio player',
        play: 'Play',
        pause: 'Pause',
        back: 'Back 15 seconds',
        forward: 'Forward 15 seconds',
        timeline: 'Playback progress',
        speed: 'Speed',
        error: 'Audio is temporarily unavailable.',
      };

  return (
    <section className="post-audio-player" aria-label={labels.player}>
      <div className="audio-player-heading">
        <span>{labels.section}</span>
      </div>

      <div className="audio-player-controls">
        <div className="audio-transport">
          <button
            type="button"
            className="audio-control-button"
            onClick={() => seekTo(currentTime - 15)}
            aria-label={labels.back}
            title={labels.back}
            disabled={hasError || duration === 0}
          >
            <RotateCcw size={16} aria-hidden="true" />
            <span>15</span>
          </button>
          <button
            type="button"
            className="audio-control-button audio-play-button"
            onClick={() => void togglePlayback()}
            aria-label={isPlaying ? labels.pause : labels.play}
            title={isPlaying ? labels.pause : labels.play}
            disabled={hasError}
          >
            {isPlaying
              ? <Pause size={17} fill="currentColor" aria-hidden="true" />
              : <Play size={17} fill="currentColor" aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="audio-control-button"
            onClick={() => seekTo(currentTime + 15)}
            aria-label={labels.forward}
            title={labels.forward}
            disabled={hasError || duration === 0}
          >
            <RotateCw size={16} aria-hidden="true" />
            <span>15</span>
          </button>
        </div>

        <div className="audio-timeline">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seekTo(Number(event.target.value))}
            aria-label={labels.timeline}
            aria-valuetext={`${formatAudioTime(currentTime)} / ${formatAudioTime(duration)}`}
            disabled={hasError || duration === 0}
            style={progressStyle}
          />
          <div className="audio-time" aria-hidden="true">
            <time>{formatAudioTime(currentTime)}</time>
            <span>/</span>
            <time>{formatAudioTime(duration)}</time>
          </div>
        </div>

        <label className="audio-speed-control">
          <span>{labels.speed}</span>
          <select
            value={playbackRate}
            onChange={(event) => updatePlaybackRate(Number(event.target.value))}
            disabled={hasError}
          >
            {playbackRates.map((rate) => (
              <option key={rate} value={rate}>{rate}×</option>
            ))}
          </select>
        </label>
      </div>

      {hasError ? <p className="audio-error" role="alert">{labels.error}</p> : null}
      <audio
        ref={setAudioElement}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => {
          setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0);
          setHasError(false);
        }}
        onDurationChange={(event) => {
          if (Number.isFinite(event.currentTarget.duration)) setDuration(event.currentTarget.duration);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
      />
    </section>
  );
}
