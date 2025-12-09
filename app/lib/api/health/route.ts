import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Basic health check
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
    }
    
    return NextResponse.json(healthStatus, { status: 200 })
  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json(
      { 
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}