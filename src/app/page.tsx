import VideoGenerator from './components/VideoGenerator'
// import VideoUpload from './components/VideoUpload'
import { useAuth } from './contexts/AuthContext'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI UGC Video Generation
          </h1>
          <p className="text-xl text-gray-600">
            Transform your videos with AI-powered enhancements
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <VideoGenerator />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl mb-4">🎥</div>
            <h3 className="text-lg font-semibold mb-2">Upload</h3>
            <p className="text-gray-600">
              Upload your video in MP4, MOV, or AVI format
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI Processing</h3>
            <p className="text-gray-600">
              Our AI enhances your video with advanced features
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl mb-4">✨</div>
            <h3 className="text-lg font-semibold mb-2">Download</h3>
            <p className="text-gray-600">
              Get your enhanced video ready for sharing
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
