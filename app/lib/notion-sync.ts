import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { promises as fs } from 'fs';
import path from 'path';

export interface NotionConfig {
  token: string;
  databaseId: string;
  apiUrl?: string;
}

export interface AgentIndex {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  language: string;
  tools: string[];
  endpoint: string;
  status: 'active' | 'beta' | 'deprecated';
  lastUpdated: string;
  createdAt: string;
  author: string;
  tags: string[];
  documentation?: string;
  examples?: any[];
  metadata?: Record<string, any>;
}

export class NotionSyncService {
  private notion: Client;
  private n2m: NotionToMarkdown;
  private config: NotionConfig;

  constructor(config: NotionConfig) {
    this.config = config;
    this.notion = new Client({
      auth: config.token,
      apiUrl: config.apiUrl || 'https://api.notion.com/v1'
    });
    this.n2m = new NotionToMarkdown({ notionClient: this.notion });
  }

  /**
   * Sync agent index to Notion database
   */
  async syncAgentIndex(agents: AgentIndex[]): Promise<void> {
    try {
      console.log(`Starting sync of ${agents.length} agents to Notion...`);
      
      for (const agent of agents) {
        await this.upsertAgent(agent);
        console.log(`Synced agent: ${agent.name}`);
      }
      
      console.log('Notion sync completed successfully');
    } catch (error) {
      console.error('Notion sync failed:', error);
      throw error;
    }
  }

  /**
   * Create or update agent in Notion database
   */
  private async upsertAgent(agent: AgentIndex): Promise<void> {
    // Check if agent already exists
    const existingAgent = await this.findAgentById(agent.id);
    
    if (existingAgent) {
      await this.updateAgent(existingAgent.id, agent);
    } else {
      await this.createAgent(agent);
    }
  }

  /**
   * Create new agent in Notion
   */
  private async createAgent(agent: AgentIndex): Promise<void> {
    const properties = {
      'Name': {
        title: [
          {
            text: {
              content: agent.name
            }
          }
        ]
      },
      'Agent ID': {
        rich_text: [
          {
            text: {
              content: agent.id
            }
          }
        ]
      },
      'Version': {
        rich_text: [
          {
            text: {
              content: agent.version
            }
          }
        ]
      },
      'Description': {
        rich_text: [
          {
            text: {
              content: agent.description
            }
          }
        ]
      },
      'Category': {
        select: {
          name: agent.category
        }
      },
      'Language': {
        select: {
          name: agent.language
        }
      },
      'Status': {
        select: {
          name: agent.status
        }
      },
      'Tools': {
        multi_select: agent.tools.map(tool => ({ name: tool }))
      },
      'Tags': {
        multi_select: agent.tags.map(tag => ({ name: tag }))
      },
      'Endpoint': {
        url: agent.endpoint
      },
      'Author': {
        rich_text: [
          {
            text: {
              content: agent.author
            }
          }
        ]
      },
      'Last Updated': {
        date: {
          start: agent.lastUpdated
        }
      },
      'Created': {
        date: {
          start: agent.createdAt
        }
      }
    };

    await this.notion.pages.create({
      parent: {
        database_id: this.config.databaseId
      },
      properties: properties
    });
  }

  /**
   * Update existing agent in Notion
   */
  private async updateAgent(pageId: string, agent: AgentIndex): Promise<void> {
    const properties = {
      'Name': {
        title: [
          {
            text: {
              content: agent.name
            }
          }
        ]
      },
      'Version': {
        rich_text: [
          {
            text: {
              content: agent.version
            }
          }
        ]
      },
      'Description': {
        rich_text: [
          {
            text: {
              content: agent.description
            }
          }
        ]
      },
      'Category': {
        select: {
          name: agent.category
        }
      },
      'Language': {
        select: {
          name: agent.language
        }
      },
      'Status': {
        select: {
          name: agent.status
        }
      },
      'Tools': {
        multi_select: agent.tools.map(tool => ({ name: tool }))
      },
      'Tags': {
        multi_select: agent.tags.map(tag => ({ name: tag }))
      },
      'Endpoint': {
        url: agent.endpoint
      },
      'Author': {
        rich_text: [
          {
            text: {
              content: agent.author
            }
          }
        ]
      },
      'Last Updated': {
        date: {
          start: agent.lastUpdated
        }
      }
    };

    await this.notion.pages.update({
      page_id: pageId,
      properties: properties
    });
  }

  /**
   * Find agent by ID in Notion database
   */
  private async findAgentById(agentId: string): Promise<string | null> {
    const response = await this.notion.databases.query({
      database_id: this.config.databaseId,
      filter: {
        property: 'Agent ID',
        rich_text: {
          equals: agentId
        }
      }
    });

    return response.results.length > 0 ? response.results[0].id : null;
  }

  /**
   * Get all agents from Notion database
   */
  async getAllAgents(): Promise<AgentIndex[]> {
    const response = await this.notion.databases.query({
      database_id: this.config.databaseId
    });

    return response.results.map(page => this.pageToAgent(page));
  }

  /**
   * Convert Notion page to AgentIndex
   */
  private pageToAgent(page: any): AgentIndex {
    const properties = page.properties;
    
    return {
      id: properties['Agent ID']?.rich_text?.[0]?.text?.content || '',
      name: properties['Name']?.title?.[0]?.text?.content || '',
      version: properties['Version']?.rich_text?.[0]?.text?.content || '',
      description: properties['Description']?.rich_text?.[0]?.text?.content || '',
      category: properties['Category']?.select?.name || '',
      language: properties['Language']?.select?.name || '',
      status: properties['Status']?.select?.name as 'active' | 'beta' | 'deprecated' || 'active',
      tools: properties['Tools']?.multi_select?.map((tool: any) => tool.name) || [],
      tags: properties['Tags']?.multi_select?.map((tag: any) => tag.name) || [],
      endpoint: properties['Endpoint']?.url || '',
      author: properties['Author']?.rich_text?.[0]?.text?.content || '',
      lastUpdated: properties['Last Updated']?.date?.start || new Date().toISOString(),
      createdAt: properties['Created']?.date?.start || new Date().toISOString()
    };
  }

  /**
   * Generate markdown documentation for agent
   */
  async generateDocumentation(agent: AgentIndex): Promise<string> {
    let markdown = `# ${agent.name}\n\n`;
    markdown += `**Version:** ${agent.version}\n\n`;
    markdown += `**Category:** ${agent.category}\n\n`;
    markdown += `**Language:** ${agent.language}\n\n`;
    markdown += `**Status:** ${agent.status}\n\n`;
    markdown += `**Author:** ${agent.author}\n\n`;
    
    markdown += `## Description\n\n${agent.description}\n\n`;
    
    markdown += `## Tools\n\n`;
    agent.tools.forEach(tool => {
      markdown += `- ${tool}\n`;
    });
    markdown += '\n';
    
    markdown += `## Tags\n\n`;
    agent.tags.forEach(tag => {
      markdown += `- ${tag}\n`;
    });
    markdown += '\n';
    
    markdown += `## Endpoint\n\n\`${agent.endpoint}\`\n\n`;
    
    if (agent.examples && agent.examples.length > 0) {
      markdown += `## Examples\n\n`;
      agent.examples.forEach((example, index) => {
        markdown += `### Example ${index + 1}\n\n`;
        if (example.input) {
          markdown += `**Input:**\n\`\`\`json\n${JSON.stringify(example.input, null, 2)}\n\`\`\`\n\n`;
        }
        if (example.output) {
          markdown += `**Output:**\n\`\`\`json\n${JSON.stringify(example.output, null, 2)}\n\`\`\`\n\n`;
        }
      });
    }
    
    return markdown;
  }

  /**
   * Create a public store page in Notion
   */
  async createStorePage(title: string, agents: AgentIndex[]): Promise<string> {
    const markdown = await this.generateStorePageMarkdown(agents);
    
    // Convert markdown to Notion blocks
    const blocks = await this.n2m.pageToMarkdownBlocks(markdown);
    const notionBlocks = this.n2m.toNotionBlocks(blocks);
    
    // Create page in a parent page (you'll need to set up a parent page ID)
    const parentPageId = process.env.NOTION_PARENT_PAGE_ID;
    if (!parentPageId) {
      throw new Error('NOTION_PARENT_PAGE_ID environment variable is required');
    }
    
    const page = await this.notion.pages.create({
      parent: {
        page_id: parentPageId
      },
      properties: {
        title: [
          {
            text: {
              content: title
            }
          }
        ]
      },
      children: notionBlocks
    });
    
    return page.id;
  }

  /**
   * Generate markdown for the store page
   */
  private async generateStorePageMarkdown(agents: AgentIndex[]): Promise<string> {
    let markdown = `# Agent Skills Store\n\n`;
    markdown += `Welcome to our Agent Skills Store! Here you'll find a collection of powerful AI agents ready to enhance your applications.\n\n`;
    markdown += `## Available Agents (${agents.length})\n\n`;
    
    // Group agents by category
    const agentsByCategory = agents.reduce((acc, agent) => {
      if (!acc[agent.category]) {
        acc[agent.category] = [];
      }
      acc[agent.category].push(agent);
      return acc;
    }, {} as Record<string, AgentIndex[]>);
    
    Object.entries(agentsByCategory).forEach(([category, categoryAgents]) => {
      markdown += `### ${category}\n\n`;
      categoryAgents.forEach(agent => {
        markdown += `#### ${agent.name}\n\n`;
        markdown += `${agent.description}\n\n`;
        markdown += `**Version:** ${agent.version} | **Status:** ${agent.status} | **Language:** ${agent.language}\n\n`;
        markdown += `**Tools:** ${agent.tools.join(', ')}\n\n`;
        markdown += `**Tags:** ${agent.tags.map(tag => `#${tag}`).join(' ')}\n\n`;
        markdown += `---\n\n`;
      });
    });
    
    return markdown;
  }
}

// Utility functions for index.json management
export class IndexManager {
  private indexPath: string;

  constructor(indexPath: string = './index.json') {
    this.indexPath = indexPath;
  }

  async loadIndex(): Promise<AgentIndex[]> {
    try {
      const data = await fs.readFile(this.indexPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log('Index file not found, creating new one...');
      return [];
    }
  }

  async saveIndex(agents: AgentIndex[]): Promise<void> {
    const data = JSON.stringify(agents, null, 2);
    await fs.writeFile(this.indexPath, data, 'utf-8');
  }

  async addAgent(agent: AgentIndex): Promise<void> {
    const agents = await this.loadIndex();
    const existingIndex = agents.findIndex(a => a.id === agent.id);
    
    if (existingIndex >= 0) {
      agents[existingIndex] = agent;
    } else {
      agents.push(agent);
    }
    
    await this.saveIndex(agents);
  }

  async removeAgent(agentId: string): Promise<void> {
    const agents = await this.loadIndex();
    const filtered = agents.filter(a => a.id !== agentId);
    await this.saveIndex(filtered);
  }
}