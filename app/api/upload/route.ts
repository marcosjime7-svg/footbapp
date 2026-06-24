import { NextRequest, NextResponse } from 'next/server'
import { getUploadUrl } from '../../../utils/r2'

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType, tipo } = await request.json()
    
    const carpeta = tipo === 'avatar' ? 'avatars' : 'videos'
    const key = `${carpeta}/${Date.now()}-${filename}`
    const uploadUrl = await getUploadUrl(key, contentType)
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`

    return NextResponse.json({ uploadUrl, publicUrl, key })
  } catch (error) {
    return NextResponse.json({ error: 'Error generando URL' }, { status: 500 })
  }
}