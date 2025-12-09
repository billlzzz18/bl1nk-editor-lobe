import { NextRequest, NextResponse } from 'next/server'
import { SkillsAPIClient } from '@/lib/api/skills-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      cursor: searchParams.get('cursor') || undefined,
    }
    
    const response = await SkillsAPIClient.listFiles(params)
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error listing files:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}