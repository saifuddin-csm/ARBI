"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { assetPath } from "@/lib/utils/assetPath";

type HeroVideoProps = { mp4?: string; webm?: string; poster: string };

/** Muted looping background video with a pause control; paused for reduced-motion users. */
export function HeroVideo({ mp4, webm, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) video.pause();
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        poster={assetPath(poster)}
        aria-hidden
      >
        {webm && <source src={assetPath(webm)} type="video/webm" />}
        {mp4 && <source src={assetPath(mp4)} type="video/mp4" />}
      </video>
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 bottom-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
        aria-label={playing ? "Pause background video" : "Play background video"}
      >
        {playing ? (
          <Pause className="size-4" aria-hidden />
        ) : (
          <Play className="size-4" aria-hidden />
        )}
      </button>
    </>
  );
}
