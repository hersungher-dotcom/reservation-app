import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return NextResponse.json({ url: url?.slice(0,30) + '...', anon_len: anon?.length, anon_preview: anon?.slice(0,10) })
}
