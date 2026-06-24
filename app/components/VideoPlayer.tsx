'use client'

export default function VideoPlayer({ url }: { url: string }) {
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be')
  const isDailymotion = url.includes('dailymotion.com')
  const isR2 = url.includes('r2.dev')

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match?.[1]
  }

  const getDailymotionId = (url: string) => {
    const match = url.match(/dailymotion\.com\/video\/([^_]+)/)
    return match?.[1]
  }

  if (isYoutube) {
    const id = getYoutubeId(url)
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${id}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (isDailymotion) {
    const id = getDailymotionId(url)
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src={`https://www.dailymotion.com/embed/video/${id}`}
          allowFullScreen
        />
      </div>
    )
  }

  if (isR2) {
    return (
      <video
        src={url}
        controls
        className="w-full rounded-lg"
        style={{ maxHeight: '300px' }}
      />
    )
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-sm underline">
      Ver vídeo →
    </a>
  )
}