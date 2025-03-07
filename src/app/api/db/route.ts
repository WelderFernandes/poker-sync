import { NextResponse } from 'next/server'
import { initializeStorage } from '@/lib/db'

// This route is used to initialize the storage
export async function GET() {
  try {
    await initializeStorage()
    return NextResponse.json({
      success: true,
      message: 'Storage initialized successfully',
    })
  } catch (error) {
    console.error('Error initializing storage:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize storage' },
      { status: 500 },
    )
  }
}
