import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

export default async (posts: any[]) => {
  const searchIndex = posts.map(i => {
    const $ = cheerio.load(`<body>${i.rendered.html}</body>`);
    return {
      title: i.data.title,
      url: `/article/${i.data.id}`,
      content: `${i.data.title} - ` + $('body').text().replace(/\n/g, '').replace(/<[^>]+>/g, '')
    };
  });

  try {
    await fs.writeFile(
      path.join(process.cwd(), 'dist', 'vh-search.json'),
      JSON.stringify(searchIndex)
    );
    await fs.writeFile(
      path.join(process.cwd(), 'public', 'vh-search.json'),
      JSON.stringify(searchIndex)
    );
    console.log('\x1b[32m%s\x1b[0m', '搜索文件vh-search文件已生成 successfully');
  } catch (error) {
    console.error('Error writing search index file:', error);
  }
};