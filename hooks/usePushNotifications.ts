import { useEffect } from 'react'
import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'

export function usePushNotifications(userId: string | null) {
  useEffect(() => {
    if (!userId || !Capacitor.isNativePlatform()) return

    const register = async () => {
      const permission = await PushNotifications.requestPermissions()
      if (permission.receive !== 'granted') return

      await PushNotifications.register()
    }

    PushNotifications.addListener('registration', async (token) => {
      // Guardar token en Supabase
      const { createClient } = await import('../utils/supabase/client')
      const supabase = createClient()
      await supabase
        .from('profiles')
        .update({ push_token: token.value })
        .eq('id', userId)
    })

    PushNotifications.addListener('registrationError', (err) => {
      console.error('Push registration error:', err)
    })

    register()

    return () => {
      PushNotifications.removeAllListeners()
    }
  }, [userId])
}
