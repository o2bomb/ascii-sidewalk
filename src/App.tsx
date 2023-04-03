import { useCallback, useEffect, useRef, useState } from "react";
import "rvfc-polyfill";

const FONT_SIZE = 9;

const VIDEO_URLS = ["/video.mp4", "/video2.mp4", "/video3.mp4", "video4.mp4"];

const App = () => {
  const [videoIndex, setVideoIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const asciiRef = useRef<HTMLCanvasElement>(null);

  const onFrame = useCallback(() => {
    requestAnimationFrame(onFrame);

    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;
    if (!videoEl) return;
    if (!canvasEl) return;

    const ctx = canvasEl.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvasEl.width, canvasEl.height);

    // [r, g, b, a, r1, g1, b1, a1, ...]
    const frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
    const frameData = frame.data;
    let text = "";
    let textIndex = 0;
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

      text += l > 140 ? TEXT2.value[textIndex] : TEXT2.whitespace;

      if ((i / 4) % frame.width === frame.width - 1) {
        text += "\n";
      }
      textIndex = (textIndex + 1) % TEXT2.value.length;
    }

    const asciiEl = asciiRef.current;
    if (!asciiEl) return;
    const aCtx = asciiEl.getContext("2d");
    if (!aCtx) return;
    aCtx.fillStyle = "#ffffff";
    aCtx.font = `${FONT_SIZE}px monospace`;
    aCtx.textAlign = "center";
    aCtx.clearRect(0, 0, asciiEl.width, asciiEl.height);
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      aCtx.fillText(lines[i], asciiEl.width / 2, FONT_SIZE + i * FONT_SIZE);
    }
  }, []);
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const frameId = requestAnimationFrame(onFrame);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [onFrame]);

  // Initialise ascii canvas
  useEffect(() => {
    const asciiEl = asciiRef.current;
    if (!asciiEl) return;
    asciiEl.width = window.innerWidth;
    asciiEl.height = window.innerHeight;

    const handleWindowResize = () => {
      asciiEl.width = window.innerWidth;
      asciiEl.height = window.innerHeight;
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <>
      <div id="container">
        <canvas
          ref={asciiRef}
          id="ascii"
          onClick={() =>
            setVideoIndex((prev) => (prev + 1) % VIDEO_URLS.length)
          }
          onTouchStart={() =>
            setVideoIndex((prev) => (prev + 1) % VIDEO_URLS.length)
          }
        />
      </div>
      <div id="hidden">
        <div>
          <video
            ref={videoRef}
            id="video"
            src={VIDEO_URLS[videoIndex]}
            autoPlay
            muted
            controls
            loop
          />
        </div>
        <div id="previews">
          <canvas height={150} width={270} ref={canvasRef} id="c1" />
        </div>
      </div>
    </>
  );
};

export default App;

interface Text {
  value: string;
  whitespace: string;
}

const TEXT: Text = {
  value: `Amidst⠀the⠀swirling⠀cosmos,⠀Amidst⠀the⠀stars⠀that⠀gleam,⠀Amidst⠀the⠀endless⠀voids⠀of⠀space,⠀A⠀precious⠀thing⠀doth⠀teem.⠀The⠀planet⠀Earth,⠀a⠀tiny⠀speck,⠀A⠀beacon⠀in⠀the⠀night,⠀And⠀upon⠀its⠀surface⠀doth⠀exist,⠀A⠀wondrous,⠀living⠀sight.⠀For⠀here⠀upon⠀this⠀little⠀world,⠀Amidst⠀the⠀oceans⠀blue,⠀The⠀mountains⠀high,⠀the⠀forests⠀green,⠀The⠀humans⠀do⠀pursue.⠀A⠀species⠀unlike⠀any⠀other,⠀With⠀curious,⠀seeking⠀minds,⠀With⠀hearts⠀that⠀beat⠀with⠀passion⠀strong,⠀And⠀souls⠀that⠀seek⠀to⠀find.⠀They've⠀conquered⠀lands,⠀they've⠀built⠀great⠀cities,⠀They've⠀flown⠀across⠀the⠀sky,⠀They've⠀charted⠀every⠀inch⠀of⠀space,⠀And⠀yet,⠀they⠀wonder⠀why.⠀For⠀deep⠀within⠀the⠀human⠀heart,⠀There⠀lies⠀a⠀restless⠀fire,⠀A⠀hunger⠀for⠀the⠀unknown,⠀A⠀thirst⠀for⠀something⠀higher.⠀They⠀strive⠀for⠀love,⠀they⠀strive⠀for⠀truth,⠀They⠀yearn⠀for⠀understanding,⠀They⠀seek⠀to⠀touch⠀the⠀face⠀of⠀God,⠀To⠀reach⠀for⠀something⠀grand.⠀And⠀though⠀they⠀oftentimes⠀fall⠀short,⠀And⠀make⠀mistakes⠀along⠀the⠀way,⠀The⠀humans⠀are⠀a⠀remarkable⠀breed,⠀That⠀grow⠀and⠀learn⠀each⠀day.⠀So⠀let⠀us⠀honor⠀all⠀these⠀humans,⠀With⠀their⠀laughter⠀and⠀their⠀tears,⠀For⠀they⠀are⠀a⠀precious⠀gift,⠀That⠀brightens⠀up⠀the⠀years.`,
  whitespace: "⠀",
};

const TEXT2: Text = {
  value: `人間についての深い詩　宇宙の渦巻く中で　星が輝く間に　無限の空虚の中で　尊いものが息づいている　地球という小さな点に　夜に輝く灯台　そしてその表面には　驚くべき生命が存在する　独特な種族がいる　探究心あふれる心を持ち　情熱的な鼓動がする心臓と　見つけ出そうとする魂を持って　彼らは地を征服し、偉大な都市を築き　空を飛び、宇宙のあらゆるものをチャートし　それでも、なぜか彼らは疑問を持ち続ける　人間の心の奥深くには　落ち着かない炎が燃えている　未知のものに対する飢えと　何か大きなものを求める渇望がある　彼らは愛を求め、真実を求め　理解を求め、神に触れようとする　何か素晴らしいものに届こうとする　時には失敗するかもしれない　道を踏み外すかもしれない　だが人間は、驚くべき生き物である　それぞれが成長して学んでいく　人間たちを讃えよう　彼らの笑いと涙を　それらは尊い贈り物であり、　年月を彩っていく　彼らは芸術と音楽を作り出し、　心と魂を揺さぶる　橋とつながりを作り出し、　分断を取り払う　彼らは愛し合い、支え合い　喜びと苦難の時に　お互いを高め合い、乗り越える　生命の苦難の中でも　彼らは神話や伝説を作り出し、　人生の謎を解明しようとする　深く自分自身に立ち入り、　真実を見出そうとする　彼らは道具や機械を発明し、　生活を楽にする　しかし、同時に彼らは限界を超え、　膨大なフロンティアを探検しようとする　彼らは癒しと治療を学び、　慰めと平安を与える　必要とする人々の苦痛と苦悩を　和らげるために　人間たちを称えよう　彼らの`,
  whitespace: "　",
};
