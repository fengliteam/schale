import { LoadScript } from "@/utils/index";
// 初始化视频播放器
declare const DPlayer: any;
declare const Hls: any;
// 初始化视频播放器
export default async (videoList: any[]) => {
  const videoDOM: any = document.querySelectorAll(".vh-node.vh-vhVideo");
  if (videoDOM.length === 0) return;
  // 载入依赖
  if (typeof Hls === "undefined") await LoadScript("https://registry.npmmirror.com/hls.js/1.5.20/files/dist/hls.min.js");
  await LoadScript("https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/dplayer/1.26.0/DPlayer.min.js");
  videoDOM.forEach((i: any) => {
    const dp = new DPlayer({
      container: i,
      logo: "/assets/images/logo.png",
      volume: 0.7,
      mutex: true,
      video: {
        url: i.getAttribute("data-url"),
        type: "auto",
        pic: i.getAttribute("data-poster") || '',
        customType: {
          hls: (video: any) => {
            if (Hls.isSupported()) {
              dp.hls = new Hls({ enableWorker: true, autoStartLoad: true, capLevelToPlayerSize: true });
              dp.hls.loadSource(video.src);
              dp.hls.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
              video.src = i.getAttribute("data-url");
            }
          }
        }
      }
    });
    videoList.push(dp);
  });
};