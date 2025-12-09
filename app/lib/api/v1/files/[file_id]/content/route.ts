import { NextRequest, NextResponse } from 'next/server'
import { SkillsAPIClient } from '@/lib/api/skills-api'

interface RouteParams {
  params: {
    file_id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const content = await SkillsAPIClient.downloadFile(params.file_id)
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${params.file_id}"`,
      },
    })
  } catch (error) {
    console.error('Error downloading file:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        )
      }
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