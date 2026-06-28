import { NextRequest, NextResponse } from 'next/server'
import { getUploadUrl } from '../../../utils/r2'

const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const TIPOS_VIDEO = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/avi']

const MAX_AVATAR = 5 * 1024 * 1024   // 5MB
const MAX_VIDEO = 100 * 1024 * 1024  // 100MB

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType, tipo, fileSize } = await request.json()

    // Validar tipo de archivo
    if (tipo === 'avatar' && !TIPOS_IMAGEN.includes(contentType)) {
      return NextResponse.json({ error: 'Solo se permiten imágenes (JPG, PNG, WebP)' }, { status: 400 })
    }
    if (tipo === 'video' && !TIPOS_VIDEO.includes(contentType)) {
      return NextResponse.json({ error: 'Solo se permiten vídeos (MP4, MOV, AVI, WebM)' }, { status: 400 })
    }

    // Validar tamaño
    if (tipo === 'avatar' && fileSize > MAX_AVATAR) {
      return NextResponse.json({ error: 'La imagen no puede superar 5MB' }, { status: 400 })
    }
    if (tipo === 'video' && fileSize > MAX_VIDEO) {
      return NextResponse.json({ error: 'El vídeo no puede superar 100MB' }, { status: 400 })
    }

    // Sanitizar nombre de archivo
    const nombreLimpio = filename.replace(/[^a-zA-Z0-9._-]/g, '_')

    const carpeta = tipo === 'avatar' ? 'avatars' : 'videos'
    const key = `${carpeta}/${Date.now()}-${nombreLimpio}`
    const uploadUrl = await getUploadUrl(key, contentType)
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`

    return NextResponse.json({ uploadUrl, publicUrl, key })
  } catch (error) {
    return NextResponse.json({ error: 'Error generando URL' }, { status: 500 })
  }
}