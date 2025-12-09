import { NextRequest, NextResponse } from 'next/server';
import { NotionSyncService, IndexManager } from '@/lib/notion-sync';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, agents, config } = body;

    if (!action || !agents || !config) {
      return NextResponse.json(
        { error: 'Missing required fields: action, agents, config' },
        { status: 400 }
      );
    }

    const notionService = new NotionSyncService(config);
    const indexManager = new IndexManager();

    switch (action) {
      case 'sync':
        await notionService.syncAgentIndex(agents);
        return NextResponse.json({
          success: true,
          message: `Successfully synced ${agents.length} agents to Notion`
        });

      case 'create-store':
        const storePageId = await notionService.createStorePage('Agent Skills Store', agents);
        return NextResponse.json({
          success: true,
          message: 'Store page created successfully',
          pageId: storePageId
        });

      case 'update-index':
        // Update local index.json file
        for (const agent of agents) {
          await indexManager.addAgent(agent);
        }
        return NextResponse.json({
          success: true,
          message: 'Index updated successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: sync, create-store, or update-index' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Notion sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Notion', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const config = {
      token: process.env.NOTION_TOKEN,
      databaseId: process.env.NOTION_DB_ID
    };

    if (!config.token || !config.databaseId) {
      return NextResponse.json(
        { error: 'Notion configuration missing. Please set NOTION_TOKEN and NOTION_DB_ID' },
        { status: 400 }
      );
    }

    const notionService = new NotionSyncService(config);

    switch (action) {
      case 'get-agents':
        const agents = await notionService.getAllAgents();
        return NextResponse.json({
          success: true,
          agents
        });

      case 'load-index':
        const indexManager = new IndexManager();
        const index = await indexManager.loadIndex();
        return NextResponse.json({
          success: true,
          index
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: get-agents or load-index' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Notion sync GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Notion', details: error.message },
      { status: 500 }
    );
  }
}