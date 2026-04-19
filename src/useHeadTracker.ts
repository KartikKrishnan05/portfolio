import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export interface HeadPosition {
  x: number; // -1 (left) to 1 (right)
  y: number; // -1 (top) to 1 (bottom)
  detected: boolean;
}

export type TrackingStatus =
  | 'loading-model'
  | 'requesting-camera'
  | 'tracking'
  | 'paused'
  | 'error';

const MODEL_URL = `${import.meta.env.BASE_URL}weights`;
let modelLoaded = false; // module-level cache so we only fetch once

function stopVideo(vid: HTMLVideoElement | null) {
  if (!vid) return;
  cancelAnimationFrame(0); // noop, caller handles RAF
  if (vid.srcObject) {
    (vid.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    vid.srcObject = null;
  }
}

export function useHeadTracker(enabled: boolean) {
  const videoRef      = useRef<HTMLVideoElement | null>(null);
  const animFrameRef  = useRef<number>(0);
  const smoothedPos   = useRef({ x: 0, y: 0 });

  const [position, setPosition] = useState<HeadPosition>({ x: 0, y: 0, detected: false });
  const [status,   setStatus]   = useState<TrackingStatus>('loading-model');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Teardown helper ──────────────────────────────────────────────────────
  const stop = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    stopVideo(videoRef.current);
    videoRef.current = null;
    // Smoothly drift back to centre
    smoothedPos.current = { x: 0, y: 0 };
    setPosition({ x: 0, y: 0, detected: false });
  }, []);

  // ── Start helper ─────────────────────────────────────────────────────────
  const start = useCallback(async () => {
    try {
      if (!modelLoaded) {
        setStatus('loading-model');
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        modelLoaded = true;
      }

      setStatus('requesting-camera');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('autoplay', 'true');
      videoRef.current = video;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => video.play().then(resolve).catch(reject);
        video.onerror = () => reject(new Error('Video element error'));
        setTimeout(() => reject(new Error('Video ready timeout')), 10_000);
      });

      setStatus('tracking');

      const detect = async () => {
        const vid = videoRef.current;
        if (!vid || vid.paused || vid.videoWidth === 0) {
          animFrameRef.current = requestAnimationFrame(detect);
          return;
        }
        try {
          const det = await faceapi.detectSingleFace(
            vid,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 })
          );
          if (det) {
            const cx = det.box.x + det.box.width  / 2;
            const cy = det.box.y + det.box.height / 2;
            const rawX = -((cx / vid.videoWidth)  * 2 - 1);
            const rawY =   (cy / vid.videoHeight) * 2 - 1;
            const a = 0.12;
            smoothedPos.current.x += (rawX - smoothedPos.current.x) * a;
            smoothedPos.current.y += (rawY - smoothedPos.current.y) * a;
            setPosition({ x: smoothedPos.current.x, y: smoothedPos.current.y, detected: true });
          } else {
            smoothedPos.current.x *= 0.95;
            smoothedPos.current.y *= 0.95;
            setPosition({ x: smoothedPos.current.x, y: smoothedPos.current.y, detected: false });
          }
        } catch { /* skip frame */ }
        animFrameRef.current = requestAnimationFrame(detect);
      };

      animFrameRef.current = requestAnimationFrame(detect);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  }, []);

  // ── React to enabled toggle ───────────────────────────────────────────────
  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
      setStatus('paused');
    }
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      stopVideo(videoRef.current);
      videoRef.current = null;
    };
  }, [enabled, start, stop]);

  return { position, status, errorMsg };
}
