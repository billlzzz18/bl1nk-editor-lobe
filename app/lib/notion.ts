/**
 * Notion Integration
 * ดึงข้อมูลจาก Notion Database
 */

export interface NotionPage {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  properties: Record<string, any>;
}

/**
 * Fetch pages from Notion database
 */
export async function fetchNotionPages(): Promise<NotionPage[]> {
  const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page_size: 100,
    }),
  });

  const data = await response.json();
  
  return data.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Name?.title[0]?.plain_text || 'Untitled',
    content: '', // Need to fetch page content separately
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
    properties: page.properties,
  }));
}

/**
 * Fetch page content from Notion
 */
export async function fetchNotionPageContent(pageId: string): Promise<string> {
  const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
    },
  });

  const data = await response.json();
  
  // Extract text content from blocks
  let content = '';
  for (const block of data.results) {
    if (block.type === 'paragraph' && block.paragraph?.rich_text) {
      content += block.paragraph.rich_text.map((t: any) => t.plain_text).join('') + '\n';
    } else if (block.type === 'heading_1' && block.heading_1?.rich_text) {
      content += '# ' + block.heading_1.rich_text.map((t: any) => t.plain_text).join('') + '\n';
    } else if (block.type === 'heading_2' && block.heading_2?.rich_text) {
      content += '## ' + block.heading_2.rich_text.map((t: any) => t.plain_text).join('') + '\n';
    } else if (block.type === 'heading_3' && block.heading_3?.rich_text) {
      content += '### ' + block.heading_3.rich_text.map((t: any) => t.plain_text).join('') + '\n';
    } else if (block.type === 'bulleted_list_item' && block.bulleted_list_item?.rich_text) {
      content += '- ' + block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join('') + '\n';
    } else if (block.type === 'numbered_list_item' && block.numbered_list_item?.rich_text) {
      content += '1. ' + block.numbered_list_item.rich_text.map((t: any) => t.plain_text).join('') + '\n';
    } else if (block.type === 'code' && block.code?.rich_text) {
      content += '```\n' + block.code.rich_text.map((t: any) => t.plain_text).join('') + '\n```\n';
    }
  }
  
  return content;
}

/**
 * Sync Notion pages to vector store
 */
export async function syncNotionToVectorStore() {
  const { vectorIndex } = await import('./upstash');
  const { generateEmbedding } = await import('./embedding');
  
  const pages = await fetchNotionPages();
  
  for (const page of pages) {
    const content = await fetchNotionPageContent(page.id);
    const embedding = await generateEmbedding(content);
    
    await vectorIndex.upsert({
      id: page.id,
      vector: embedding,
      metadata: {
        title: page.title,
        content,
        source: 'notion',
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      },
    });
  }
  
  return pages.length;
}

