// 扩展 Window 接口以包含 swup 属性
declare global {
  interface Window {
    swup: { hooks: { on: (event: string, handler: EventHandler) => void } };
  }
}
type EventHandler = (event: Event) => void;

//  进入页面时触发
const inRouter = (handler: EventHandler) => {
  const setup = () => window.swup.hooks.on("page:view", handler);
  window.swup ? setup() : document.addEventListener("swup:enable", setup);
};
// 离开当前页面时触发
const outRouter = (handler: EventHandler) => window.swup ? window.swup.hooks.on("visit:start", handler) : document.addEventListener("swup:enable", () => outRouter(handler));

export { inRouter, outRouter };