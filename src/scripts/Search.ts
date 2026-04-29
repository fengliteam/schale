import { $GET } from '@/utils/index'

// 更新数据
let searchJson: any[] = [];
const getSearchJson = async () => (searchJson = await $GET('/vh-search.json'))

// 搜索
const searchFn = async (value: string) => {
  if (!searchJson.length) await getSearchJson();
  // 渲染页面
  renderSearch(findAndModifyElements(searchJson, value))
}

// 关键词匹配
const findAndModifyElements = (arr: any[], keyword: string) => {
  if ((keyword || '') == '') return []
  return arr
    .filter(item => item.content.includes(keyword))
    .map(item => {
      const content = item.content;
      const keywordIndex = content.indexOf(keyword);
      const start = Math.max(0, keywordIndex - 50);
      const end = Math.min(content.length, keywordIndex + keyword.length + 50);
      let newContent = content.substring(start, end);
      newContent = newContent.replace(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g"), `<span>${keyword}</span>`);
      return { ...item, content: newContent };
    });
}

// 渲染页面
let searchHTML = '';
const renderSearch = (arr: any[]) => {
  searchHTML = !arr.length ? '<em></em>' : arr.map(i => `<a class="vh-search-item" href="${i.url}"><span class="vh-ellipsis">${i.title}</span><p class="vh-ellipsis line-3">${i.content}</p></a>`).join('');
  document.querySelector('.vh-header>.main>.vh-search>main>.vh-search-list')!.innerHTML = searchHTML;
}

// 截流
let fnTimer: any = null;
const searchInputChange = (v: any) => {
  const value = v.target.value;
  if (fnTimer) clearTimeout(fnTimer);
  fnTimer = setTimeout(() => searchFn(value), 266);
}

// 初始化搜索框
const vhSearchInit = () => {
  const searchDOM: any = document.querySelector(".vh-header>.main>nav>span.search-btn");
  const searchMainDOM: any = document.querySelector(".vh-header>.main>.vh-search>main");
  const searchListDOM: any = document.querySelector(".vh-header>.main>.vh-search");
  const addActive = () => setTimeout(() => {
    searchListDOM.classList.add("active");
    searchListDOM.querySelector(".search-input>input").focus();
  });
  const removeActive = () => setTimeout(() => searchListDOM.classList.remove("active"));
  // 禁止默认事件
  searchMainDOM.addEventListener("click", (e: Event) => e.stopPropagation());
  searchDOM.addEventListener("click", addActive);
  searchListDOM.addEventListener("click", removeActive);
  // 搜索框初内容变化
  searchListDOM.querySelector(".search-input>input").addEventListener("input", searchInputChange);
};

export { searchFn, searchInputChange, vhSearchInit };