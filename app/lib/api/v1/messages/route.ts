import { NextRequest, NextResponse } from 'next/server'
import { SkillsAPIClient } from '@/lib/api/skills-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.model || !body.messages) {
      return NextResponse.json(
        { error: 'Missing required fields: model, messages' },
        { status: 400 }
      )
    }

    // Call the underlying API
    const response = await SkillsAPIClient.createMessage(body)
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error creating message:', error)
    
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