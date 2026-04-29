import { getCollection } from "astro:content";
const posts = (await getCollection("blog")).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
// 获取文章分类
const getCategories = () => {
  const categoriesList = posts.reduce((acc: any, i: any) => {
    acc[i.data.categories] = (acc[i.data.categories] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(categoriesList).map(([title, count]) => ({ title, count }));
}

// 获取统计数据
const getCountInfo = () => {
  return { ArticleCount: posts.length, CategoryCount: getCategories().length, TagCount: getTags().length }
}

// 获取文章标签
const getTags = () => {
  const tagList = posts.reduce((acc: any, i: any) => {
    (i.data.tags || []).forEach((tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});
  return Object.entries(tagList).sort((a: any, b: any) => b[1] - a[1]);
}

// 获取推荐文章 (给文章添加 recommend: true 字段)
const getRecommendArticles = () => {
  const recommendList = posts.filter(i => i.data.recommend);
  return (recommendList.length ? recommendList : posts.slice(0, 6)).map(i => ({ title: i.data.title, date: i.data.date, id: i.data.id }))
};

export { getCategories, getTags, getRecommendArticles, getCountInfo };