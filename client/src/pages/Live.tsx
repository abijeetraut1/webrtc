import { useParams, useNavigate } from 'react-router'
import Header from '../components/Header'

const mockStreams: Record<string, { title: string; channel: string; viewers: string }> = {
  '1': { title: 'Building a Real-Time Live Streaming App with React & WebRTC', channel: 'Tech With Alex', viewers: '12,345' },
  '4': { title: 'Building a Full Stack E-Commerce App with Next.js & Stripe', channel: 'Full Stack Journey', viewers: '8,921' },
}

function Live() {
  const { liveId } = useParams()
  const navigate = useNavigate()
  const stream = mockStreams[liveId ?? '']

  if (!stream) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Stream not found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium text-sm transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="aspect-video bg-black w-full relative">
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-red-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <p className="text-lg font-medium">Live Stream</p>
              <p className="text-sm text-gray-400 mt-1">{stream.viewers} watching</p>
            </div>
          </div>
          <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-0.5">
            LIVE
          </span>
        </div>

        <div className="mt-4">
          <h1 className="text-lg font-bold">{stream.title}</h1>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary" />
              <div>
                <p className="font-medium text-sm">{stream.channel}</p>
                <p className="text-xs text-muted-foreground">{stream.viewers} viewers</p>
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium text-sm transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Live
