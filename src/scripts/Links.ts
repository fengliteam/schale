import vh from 'vh-plugin'
import { $GET } from '@/utils/index'
// 图片懒加载
import vhLzImgInit from "@/scripts/vhLazyImg";
// 渲染
const LinksInit = async (data: any) => {
  const linksDOM = document.querySelector('.main-inner-content>.vh-tools-main>main.links-main')
  if (!linksDOM) return;
  try {
    let res = data;
    if (typeof data === 'string') {
      res = await $GET(data);
    }
    linksDOM.innerHTML = res.map((i: any) => `<a href="${i.link}" target="_blank"><img class="avatar" src="${i.avatar}" /><section class="link-info"><span>${i.name}</span><p class="vh-ellipsis line-2">${i.descr}</p></section></a>`).join('');
    // 图片懒加载
    vhLzImgInit();
  } catch {
    vh.Toast('获取数据失败')
  }
}

// 友情链接初始化
import LINKS_DATA from "@/page_data/Link";
const { api, data } = LINKS_DATA;
export default () => LinksInit(api || data)