import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// 关键：正确解析用户主目录
const wondersDirectory = path.join(process.env.HOME || '', 'clawd/memory/daily-wonders');

export interface Wonder {
  slug: string;
  date: string;
  title?: string;
  contentHtml: string;
  [key: string]: any; // 允许 frontmatter 中有其他字段
}

// 获取所有 Wonders 并按日期排序
export async function getAllWonders(): Promise<Wonder[]> {
  try {
    const fileNames = fs.readdirSync(wondersDirectory).filter(file => file.endsWith('.md') && file !== 'README.md');
    const allWondersData = await Promise.all(
      fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        return getWonderBySlug(slug);
      })
    );

    // 按日期降序排序 (最新的在最前面)
    return allWondersData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error("Could not read wonders directory:", wondersDirectory, error);
    return []; // 如果目录不存在或无法读取，返回空数组
  }
}

// 根据 slug 获取单个 Wonder 的数据
export async function getWonderBySlug(slug: string): Promise<Wonder> {
  const fullPath = path.join(wondersDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // 使用 gray-matter 解析 frontmatter
  const matterResult = matter(fileContents);

  // 使用 remark 将 markdown 转换为 HTML
  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  // 提取日期作为 slug 的一部分
  const date = slug;
  
  // 尝试从内容第一行提取标题
  const titleMatch = matterResult.content.match(/^#\s+(.+)/m);
  const title = matterResult.data.title || (titleMatch ? titleMatch[1] : undefined);

  return {
    slug,
    date,
    title,
    contentHtml,
    ...matterResult.data,
  };
}
