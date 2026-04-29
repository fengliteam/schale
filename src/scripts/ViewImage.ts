
import { LoadScript } from "@/utils/index";
// 图片灯箱
declare const ViewImage: any;
const ViewImgList: string[] = [
  // 文章内图片
  "article.vh-article-main img.vh-article-img",
  // 动态页面图片
  "main.talking-main>article>.main img",
  // Twikoo 评论区图片
  ".vh-comment>.twikoo>.tk-comments img:not(.tk-avatar-img,.OwO-item img,.tk-owo-emotion)",
  // Waline 评论区图片
  ".vh-comment div[data-waline] img:not(.wl-user-avatar,.wl-avatar img,.wl-reaction-list img,.wl-panel img,.tk-owo-emotion,.wl-emoji)"
];
// 初始化
export default async () => {
  try {
    ViewImage.init(ViewImgList.join(","));
  } catch (error) {
    await LoadScript("/assets/js/view-image.min.js");
    ViewImage.init(ViewImgList.join(","));
  }
}
