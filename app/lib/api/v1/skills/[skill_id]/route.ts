import { NextRequest, NextResponse } from 'next/server'
import { SkillsAPIClient } from '@/lib/api/skills-api'

interface RouteParams {
  params: {
    skill_id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const skill = await SkillsAPIClient.getSkill(params.skill_id)
    
    return NextResponse.json(skill, { status: 200 })
  } catch (error) {
    console.error('Error getting skill:', error)
    
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await SkillsAPIClient.deleteSkill(params.skill_id)
    
    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting skill:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Skill not found' },
          { status: 404 }
        )
      }
      if (error.message.includes('still has versions')) {
        return NextResponse.json(
          { error: 'Skill still has versions, cannot delete' },
          { status: 400 }
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