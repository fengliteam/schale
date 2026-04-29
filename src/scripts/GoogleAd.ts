
// 声明全局变量 adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
import SITE_INFO from '@/config'
const { GoogleAds } = SITE_INFO
export default () => {
  const asideAD: any = document.querySelector('.vh-aside-ad')
  const articleAD: any = document.querySelector('.vh-article-ad')
  if (!asideAD && !articleAD) return;
  // 初始化侧边栏广告
  if (asideAD) {
    asideAD.innerHTML = GoogleAds.asideAD_Slot;
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }
  // 初始化文章页广告
  if (articleAD) {
    articleAD.innerHTML = GoogleAds.articleAD_Slot;
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }
}