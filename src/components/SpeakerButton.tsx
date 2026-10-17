import React, { useRef, useState } from 'react';
import { Volume2, Loader2, CircleStop } from 'lucide-react';

interface SpeakerButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({ text, className = '', label }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = async () => {
    if (status === 'playing') {
      audioRef.current?.pause();
      setStatus('idle');
      return;
    }
    if (status === 'loading' || !text) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/agent/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error('TTS request failed');
      const data = await res.json();

      const audio = new Audio(`data:${data.mimeType};base64,${data.audioBase64}`);
      audioRef.current = audio;
      audio.onended = () => setStatus('idle');
      audio.onerror = () => setStatus('error');
      await audio.play();
      setStatus('playing');
    } catch (e) {
      console.warn('Speaker playback failed:', e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === 'loading'}
      title="Listen to this in your language"
      className={`inline-flex items-center gap-1 shrink-0 cursor-pointer transition ${className}`}
    >
      {status === 'loading' ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : status === 'playing' ? (
        <CircleStop className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
      {label && <span>{label}</span>}
    </button>
  );
};
