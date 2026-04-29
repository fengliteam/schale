/*
 * @Author: Han
 * @Date: 2025-04-07 11:31:34
 * @LastEditors: Han
 * @LastEditTime: 2025-04-21 14:32:19
 * @Description: 
 * 
 */
import SITE_INFO from "@/config";
import { LoadScript } from "@/utils/index";
declare const twikoo: any;

// Twikoo 评论
const TwikooFn = async (commentDOM: string) => {
  document.querySelector(commentDOM)!.innerHTML = '<section class="vh-space-loading"><span></span><span></span><span></span></section>'
  await LoadScript("https://registry.npmmirror.com/twikoo/1.6.41/files/dist/twikoo.all.min.js");
  twikoo.init({ envId: SITE_INFO.Comment.Twikoo.envId, el: commentDOM, onCommentLoaded: () => setTimeout(() => document.querySelectorAll('.vh-comment a[href="#"]').forEach(link => link.removeAttribute('href'))) })
}

// Waline 评论
const WalineFn = async (commentDOM: string, walineInit: any) => {
  import('@waline/client/waline.css');
  import('@waline/client/waline-meta.css');
  const { init } = await import('@waline/client');
  walineInit = init({
    el: commentDOM, path: window.location.pathname.replace(/\/$/, ''), serverURL: SITE_INFO.Comment.Waline.serverURL,
    emoji: ['https://registry.npmmirror.com/@waline/emojis/1.3.0/files/alus', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/bilibili', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/bmoji', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/qq', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/weibo', 'https://registry.npmmirror.com/@waline/emojis/1.3.0/files/soul-emoji'],
    reaction: [
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_agree.png",
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_look_down.png",
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_sunglasses.png",
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_pick_nose.png",
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_awkward.png",
      "https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_sleep.png",
    ],
    requiredMeta: ['nick', 'mail'],
    imageUploader: async (file: any) => {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch("https://wp-cdn.4ce.cn/upload", { method: "POST", body });
      const resJson = await res.json();
      return resJson.data.link.replace('i.imgur.com', 'wp-cdn.4ce.cn/v2');
    }
  });
}

// 检查是否开启评论
const checkComment = () => {
  const CommentARR: any = Object.keys(SITE_INFO.Comment);
  const CommentItem = CommentARR.find((i: keyof typeof SITE_INFO.Comment) => SITE_INFO.Comment[i].enable);
  return CommentItem;
}

// 初始化评论插件
const commentInit = async (key: string, walineInit: any) => {
  // 评论 DOM 
  const commentDOM = '.vh-comment>section'
  if (!document.querySelector(commentDOM)) return;
  // 评论列表
  const CommentList: any = { TwikooFn, WalineFn };
  // 初始化评论
  CommentList[`${key}Fn`](commentDOM, walineInit);
}

export { checkComment, commentInit }