import { useEffect, useRef } from "react";
import { Icon } from "./SharedIot";

const HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";

// Load hls.js from a CDN only when a browser can't play .m3u8 natively (Chrome, Firefox, Edge)
const loadHls = () =>
  new Promise((resolve, reject) => {
    if (window.Hls) return resolve(window.Hls);
    const tag = document.createElement("script");
    tag.src = HLS_CDN;
    tag.onload = () => resolve(window.Hls);
    tag.onerror = reject;
    document.head.appendChild(tag);
  });

function HlsVideo({ src }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    let hls;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src; // Safari / iOS
    } else {
      loadHls()
        .then((Hls) => {
          if (!Hls?.isSupported()) return;
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        })
        .catch(() => {});
    }
    return () => hls?.destroy();
  }, [src]);

  return <video ref={ref} autoPlay muted playsInline controls />;
}

function LiveView({ camera }) {
  const url = camera.streamUrl;
  if (!camera.online) return <span>Camera offline</span>;
  if (!url) return <span>No live view URL</span>;
  if (/\.m3u8(\?|$)/i.test(url)) return <HlsVideo src={url} />;
  if (/\.(mp4|webm)(\?|$)/i.test(url)) return <video src={url} autoPlay muted playsInline controls />;
  return <iframe src={url} title={camera.name} allow="autoplay; fullscreen" />; // WebRTC page (go2rtc, MediaMTX…)
}

/**
 * Live camera viewer modal.
 *  camera  – { name, zone, address, online, streamUrl }
 *  onClose – () => void
 */
export default function CameraViewModal({ camera, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="iot-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="iot-modal iot-modal--md" role="dialog" aria-modal="true" aria-labelledby="iot-cam-title">
        <div className="iot-modal-head">
          <span id="iot-cam-title">{camera.name} · {camera.zone}</span>
          <button className="iot-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="iot-cam iot-cam--flush">
          <b>{camera.name}</b>
          <LiveView camera={camera} />
        </div>

        {camera.online && !camera.streamUrl && (
          <div className="iot-note iot-note--spaced">
            Browsers cannot play RTSP. Run a small gateway (for example go2rtc or MediaMTX) on the restaurant network
            to convert {camera.address} to HLS or WebRTC, then paste that URL in Edit.
          </div>
        )}

        <div className="iot-modal-foot">
          <button className="iot-btn" onClick={onClose}><Icon name="close" />Close</button>
        </div>
      </div>
    </div>
  );
}
