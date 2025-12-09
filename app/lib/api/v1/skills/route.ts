import { NextRequest, NextResponse } from 'next/server'
import { SkillsAPIClient } from '@/lib/api/skills-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params = {
      source: searchParams.get('source') as 'provider' | 'custom' | null,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      cursor: searchParams.get('cursor') || undefined,
    }
    
    const response = await SkillsAPIClient.listSkills(params)
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error listing skills:', error)
    
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Validate required fields
    const displayTitle = formData.get('display_title') as string
    if (!displayTitle) {
      return NextResponse.json(
        { error: 'Missing required field: display_title' },
        { status: 400 }
      )
    }
    
    // Extract files from formData
    const files: File[] = []
    const filesField = formData.getAll('files') as File[]
    
    if (filesField.length === 0) {
      return NextResponse.json(
        { error: 'At least one file is required' },
        { status: 400 }
      )
    }
    
    files.push(...filesField)
    
    const skill = await SkillsAPIClient.uploadSkill(
      { display_title: displayTitle },
      files
    )
    
    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error('Error creating skill:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}