import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '../../../utils/supabase/server'

export async function POST() {
  const supabase = await createServerClient()
  const { data: userData, error: authError } = await supabase.auth.getUser()

  if (authError || !userData.user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const userId = userData.user.id

  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabaseAdmin.from('videos').delete().eq('jugador_id', userId)
  await supabaseAdmin.from('trayectoria').delete().eq('jugador_id', userId)
  await supabaseAdmin.from('mensajes').delete().eq('de', userId)
  await supabaseAdmin.from('mensajes').delete().eq('para', userId)
  await supabaseAdmin.from('profiles').delete().eq('id', userId)

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (deleteError) {
    return NextResponse.json({ error: 'Error eliminando la cuenta' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
