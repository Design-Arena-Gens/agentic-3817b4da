'use client'

import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  const handleAuth = async () => {
    try {
      const response = await fetch('/api/auth')
      const data = await response.json()

      if (data.authUrl) {
        window.open(data.authUrl, '_blank')
        setMessage('Please complete authentication in the new window')
      }
    } catch (error) {
      setMessage('Error initiating authentication')
    }
  }

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/status')
      const data = await response.json()
      setAuthenticated(data.authenticated)
      setMessage(data.authenticated ? 'Authenticated successfully!' : 'Not authenticated')
    } catch (error) {
      setMessage('Error checking authentication status')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setMessage('Please select a video file')
      return
    }

    setUploading(true)
    setMessage('Uploading...')

    try {
      const formData = new FormData()
      formData.append('video', file)
      formData.append('title', title)
      formData.append('description', description)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Video uploaded successfully! Video ID: ${data.videoId}`)
        setFile(null)
        setTitle('')
        setDescription('')
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage('Error uploading video')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          YouTube Auto Uploader
        </h1>

        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Setup Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Create a Google Cloud Project at <a href="https://console.cloud.google.com" className="text-blue-600 hover:underline" target="_blank">console.cloud.google.com</a></li>
            <li>Enable YouTube Data API v3</li>
            <li>Create OAuth 2.0 credentials (Desktop app type)</li>
            <li>Download the credentials as JSON</li>
            <li>Save the file as <code className="bg-gray-200 px-2 py-1 rounded">credentials.json</code> in the project root</li>
            <li>Click "Authenticate with YouTube" below</li>
          </ol>
        </div>

        <div className="mb-6 space-y-4">
          <button
            onClick={handleAuth}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Authenticate with YouTube
          </button>

          <button
            onClick={checkAuth}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Check Authentication Status
          </button>
        </div>

        {authenticated && (
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter video title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-32"
                placeholder="Enter video description"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload to YouTube'}
            </button>
          </form>
        )}

        {message && (
          <div className={`mt-6 p-4 rounded-lg ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </main>
  )
}
