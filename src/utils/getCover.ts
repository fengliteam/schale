import path from 'path';
import _fs from 'fs';
const fs = _fs.promises;
import { fileURLToPath } from 'url';
import SITE_INFO from '@/config';
// 获取当前模块的目录路径
const __filename = fileURLToPath(import.meta.url); // 当前文件的绝对路径
const __dirname = path.dirname(__filename); // 当前文件所在的目录

// 支持的图片扩展名
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']);

/**
 * 获取目录中的所有图片文件
 * @param {string} dir - 图片目录路径
 * @returns {Promise<string[]>} - 图片文件名数组
 */
async function getImageFiles(dir: string) {
  try {
    const files = await fs.readdir(dir);
    return files.filter(file => SUPPORTED_EXTENSIONS.has(path.extname(file).toLowerCase()));
  } catch (error) {
    console.error(`无法读取目录 ${dir}:`, error);
    return [];
  }
}

/**
 * 随机打乱数组（Fisher-Yates 洗牌算法）
 * @param {any[]} array - 需要打乱的数组
 * @returns {any[]} - 打乱后的数组
 */
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * 创建一个图片名称的无限迭代器
 * @param {string} dir - 图片目录路径
 * @returns {AsyncGenerator<string>} - 异步生成器
 */
async function* createImageIterator(dir: string) {
  let images = await getImageFiles(dir);
  if (images.length === 0) {
    throw new Error(`目录 ${dir} 中没有图片文件`);
  }

  while (true) {
    images = shuffleArray([...images]); // 打乱顺序
    for (const image of images) {
      yield image;
    }
  }
}

const targetDir = path.resolve(__dirname, '../../public/assets/images/banner/'); // 目标目录
const fileIter = createImageIterator(targetDir);
export default async (filename: string | null | undefined) => {
  if (filename) return filename;
  const { value } = await fileIter.next();
  return SITE_INFO.Site + `/assets/images/banner/${value}`
}