// 初始化侧边栏
export default () => {
  const menuDOM: any = document.querySelector(".vh-header>.main>nav>span.menu-btn");
  const mobileSidebarDOM: any = document.querySelector("body>.vh-mobilesidebar");
  const addActive = () => setTimeout(() => mobileSidebarDOM.classList.add("active"));
  const removeActive = () => setTimeout(() => mobileSidebarDOM.classList.remove("active"));
  menuDOM.addEventListener("click", addActive);
  mobileSidebarDOM.addEventListener("click", removeActive);
};