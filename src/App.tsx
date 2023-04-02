import { useCallback, useEffect, useRef } from "react";
import "rvfc-polyfill";

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processedRef = useRef<HTMLCanvasElement>(null);
  const asciiRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(() => {
    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;
    if (!videoEl) return;
    if (!canvasEl) return;

    const ctx = canvasEl.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvasEl.width, canvasEl.width);

    videoRef.current.requestVideoFrameCallback(onFrame);

    const processedEl = processedRef.current;
    const asciiEl = asciiRef.current;
    if (!processedEl) return;
    if (!asciiEl) return;

    const pCtx = processedEl.getContext("2d", {
      willReadFrequently: true,
    });
    if (!pCtx) return;

    // [r, g, b, a, r1, g1, b1, a1, ...]
    const frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
    const frameData = frame.data;
    let text = "";
    for (let i = 0; i < frameData.length; i += 4) {
      let r = frameData[i];
      let g = frameData[i + 1];
      let b = frameData[i + 2];
      // const a = frameData[i+3]

      // Use luminance to convert rgb to grayscale value
      // https://en.wikipedia.org/wiki/Grayscale
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      // Then convert to either black or white depending on luminance value
      frameData[i] = frameData[i + 1] = frameData[i + 2] = l > 140 ? 255 : 0;

      text += l > 140 ? "0" : "⠀";
      if ((i / 4) % frame.width === frame.width - 1) {
        text += "\n";
      }
    }
    asciiEl.innerHTML = text;

    pCtx.putImageData(frame, 0, 0);
  }, []);
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const frameId = videoEl.requestVideoFrameCallback(onFrame);

    return () => {
      videoEl.cancelVideoFrameCallback(frameId);
    };
  }, [onFrame]);

  return (
    <>
      <div id="container">
        <div ref={asciiRef} id="ascii"></div>
      </div>
      <div id="hidden">
        <div>
          <video
            ref={videoRef}
            id="video"
            src="/video.mp4"
            autoPlay
            muted
            controls
            loop
          />
        </div>
        <div id="previews">
          <canvas ref={canvasRef} id="c1" />
          <canvas ref={processedRef} id="c2" />
        </div>
      </div>
    </>
  );
};

export default App;
