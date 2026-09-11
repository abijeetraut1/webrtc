import { useNavigate } from 'react-router'
import Header from '../components/Header'

const liveStreams = [
  {
    id: 1,
    thumbnail: 'https://picsum.photos/seed/v1/640/360',
    title: 'Building a Real-Time Live Streaming App with React & WebRTC',
    channel: 'Tech With Alex',
    channelAvatar: 'https://picsum.photos/seed/c1/40/40',
    viewers: '12K watching',
  },
  {
    id: 4,
    thumbnail: 'https://picsum.photos/seed/v4/640/360',
    title: 'Building a Full Stack E-Commerce App with Next.js & Stripe',
    channel: 'Full Stack Journey',
    channelAvatar: 'https://picsum.photos/seed/c4/40/40',
    viewers: '8.9K watching',
  },
  {
    id: 7,
    thumbnail: 'https://picsum.photos/seed/v7/640/360',
    title: 'Live Coding: AI Chatbot with OpenAI API',
    channel: 'AI Dev Hub',
    channelAvatar: 'https://picsum.photos/seed/c7/40/40',
    viewers: '5.2K watching',
  },
  {
    id: 8,
    thumbnail: 'https://picsum.photos/seed/v8/640/360',
    title: 'Streaming My Game Dev Journey - Day 45',
    channel: 'Indie Dev Live',
    channelAvatar: 'https://picsum.photos/seed/c8/40/40',
    viewers: '3.1K watching',
  },
]

function VideoCard({ stream }: { stream: typeof liveStreams[0] }) {
  const navigate = useNavigate()

  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/live/${stream.id}`)}
    >
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <span className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5">
          LIVE
        </span>
      </div>

      <div className="flex gap-3 mt-3">
        <img
          src={stream.channelAvatar}
          alt={stream.channel}
          className="w-9 h-9 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {stream.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {stream.channel}
          </p>
          <p className="text-xs text-muted-foreground">
            {stream.viewers}
          </p>
        </div>
      </div>
    </div>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {liveStreams.map((stream) => (
            <VideoCard key={stream.id} stream={stream} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
