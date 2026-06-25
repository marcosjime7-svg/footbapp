import { useEffect, useState } from 'react'
import { createClient } from './supabase/client'

export function useClubs() {
  const [clubs, setClubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClubs = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('clubs')
        .select('id, nombre, escudo_url')
        .order('nombre', { ascending: true })
      setClubs(data || [])
      setLoading(false)
    }
    fetchClubs()
  }, [])

  return { clubs, loading }
}