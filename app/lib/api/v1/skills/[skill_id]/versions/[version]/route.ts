import { NextRequest, NextResponse } from 'next/server'
import { SkillsAPIClient } from '@/lib/api/skills-api'

interface RouteParams {
  params: {
    skill_id: string
    version: string
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await SkillsAPIClient.deleteSkillVersion(params.skill_id, params.version)
    
    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting skill version:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Version or Skill not found' },
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