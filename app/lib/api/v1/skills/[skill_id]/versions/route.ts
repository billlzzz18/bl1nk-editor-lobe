import { NextRequest, NextResponse } from 'next/server'
import { SkillsAPIClient } from '@/lib/api/skills-api'

interface RouteParams {
  params: {
    skill_id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const versions = await SkillsAPIClient.listSkillVersions(params.skill_id)
    
    return NextResponse.json(versions, { status: 200 })
  } catch (error) {
    console.error('Error listing skill versions:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Skill not found' },
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

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const formData = await request.formData()
    
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
    
    const version = await SkillsAPIClient.createSkillVersion(
      params.skill_id,
      files
    )
    
    return NextResponse.json(version, { status: 201 })
  } catch (error) {
    console.error('Error creating skill version:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Skill not found' },
          { status: 404 }
        )
      }
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