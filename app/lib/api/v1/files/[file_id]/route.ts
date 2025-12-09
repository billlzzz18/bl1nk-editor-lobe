import { NextRequest, NextResponse } from 'next/server'
import { SkillsAPIClient } from '@/lib/api/skills-api'

interface RouteParams {
  params: {
    file_id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const fileMetadata = await SkillsAPIClient.getFileMetadata(params.file_id)
    
    return NextResponse.json(fileMetadata, { status: 200 })
  } catch (error) {
    console.error('Error getting file metadata:', error)
    
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await SkillsAPIClient.deleteFile(params.file_id)
    
    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting file:', error)
    
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