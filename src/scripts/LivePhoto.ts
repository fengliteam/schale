// SmoothScroll 滚动优化
import { LoadScript } from "@/utils/index";
declare const LivePhotosKit: any;
export default async () => {
  const livePhotoList = document.querySelectorAll('.vh-node.vh-vhLivePhoto');
  if (!livePhotoList.length) return;
  await LoadScript("/assets/js/livephotoskit.js");
  livePhotoList.forEach((i: any) => {
    const { photo, video } = i.dataset;
    i.innerHTML = `<div class="live-raw"></div>`
    const player = LivePhotosKit.Player(i.querySelector('.live-raw'));
    player.photoSrc = photo;
    player.videoSrc = video;
  })
};