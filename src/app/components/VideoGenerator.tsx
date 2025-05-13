"use client";
import React, { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import FileUpload from './FileUpload'
import VoiceSelector from './VoiceSelector'
import PromptInput from './PromptInput'
import Image from 'next/image'
import { X } from 'lucide-react'
import Modal from 'react-modal';

interface GenerationOptions {
  productImage: File | null
  voiceId: string
  prompt: string
}

const productSamples = [
  '/sample1.png',
  '/sample2.png',
  '/sample3.png',
  '/sample4.png',
];
const aiInfluencers = [
  '/ai1.png',
  '/ai2.png',
  '/ai3.png',
  '/ai4.png',
];

export default function VideoGenerator() {
  const { user } = useAuth()
  const [options, setOptions] = useState<GenerationOptions>({
    productImage: null,
    voiceId: '',
    prompt: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [productImage, setProductImage] = useState<string | null>(null);
  const [aiInfluencer, setAiInfluencer] = useState<string | null>(null);
  const [videoDescription, setVideoDescription] = useState('');
  const [script, setScript] = useState('');
  const [voiceNarration, setVoiceNarration] = useState(true);
  const [duration, setDuration] = useState('5 seconds');
  const [quality, setQuality] = useState('Standard');
  const [output, setOutput] = useState<string | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'prompt'>('upload');
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [aiTab, setAiTab] = useState<'upload' | 'prompt'>('upload');
  const [aiInfluencerPreview, setAiInfluencerPreview] = useState<string | null>(null);
  const aiFileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [productTab, setProductTab] = useState<'upload' | 'prompt'>('upload');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleGenerate = async () => {
    if (!options.productImage || !options.voiceId || !options.prompt) {
      setError('Please fill in all fields')
      return
    }

    try {
      setIsGenerating(true)
      setError(null)

      const response = await fetch('/api/runway/generate-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      })

      if (!response.ok) throw new Error('Failed to generate video')
      const data = await response.json()
      setVideoUrl(data.videoUrl)
    } catch (err) {
      setError('Failed to generate video')
    } finally {
      setIsGenerating(false)
    }
  }

  // Handler for Choose Image button
  const handleChooseImageClick = () => {
    fileInputRef.current?.click();
  };

  // Handler for file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setProductImagePreview(URL.createObjectURL(file));
      setProductImage(file.name);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    setProductImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181828] to-[#23233a] text-white p-8 flex flex-col items-center">
      {/* Top panels */}
      <div className="w-full max-w-6xl flex gap-8 mb-10">
        {/* Product photo */}
        <div className="flex-1 bg-[#23233a] rounded-2xl p-6 border-2 border-dashed border-[#35354d] flex flex-col shadow-lg">
          <div className="flex items-center mb-4">
            <div className="font-semibold text-lg flex-1">Product photo</div>
          </div>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setProductTab('upload')} className={`px-4 py-2 rounded-t-lg font-semibold ${productTab === 'upload' ? 'bg-[#35354d]' : 'bg-[#23233a]'} transition`}>Upload</button>
            <button onClick={() => setProductTab('prompt')} className={`px-4 py-2 rounded-t-lg font-semibold ${productTab === 'prompt' ? 'bg-[#35354d]' : 'bg-[#23233a]'} transition`}>Prompt</button>
          </div>
          {productTab === 'upload' && (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 mb-4">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Product preview"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-sm text-gray-500">No image selected</span>
                </div>
              )}
              {previewUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                  <button
                    onClick={handleClearImage}
                    className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          )}
          {productTab === 'prompt' && (
            <div>
              <input
                type="text"
                className="w-full border border-[#35354d] rounded-lg px-3 py-2 mb-2 bg-[#23233a] text-white"
                placeholder="Describe your product (e.g. 3D render of a water bottle)"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
              <button className="w-full h-12 bg-[#6c47ff] text-white rounded-lg font-semibold shadow-sm">Generate with Recraft/MJ (placeholder)</button>
            </div>
          )}
          <div className="flex items-center mt-auto pt-2 relative">
            <input type="checkbox" id="no-product-photo" className="mr-2 accent-[#6c47ff]" />
            <label htmlFor="no-product-photo" className="text-xs text-[#b0b0c3]">No need for product photo</label>
            <button onClick={() => setIsSettingsOpen(true)} className="absolute right-0 p-2 hover:bg-[#29294a] rounded-full transition-colors ml-2"><span role="img" aria-label="settings">⚙️</span></button>
          </div>
          <Modal
            isOpen={isSettingsOpen}
            onRequestClose={() => setIsSettingsOpen(false)}
            ariaHideApp={false}
            className="bg-[#23233a] rounded-2xl p-8 w-full max-w-lg shadow-xl mx-auto my-auto outline-none flex flex-col"
            overlayClassName="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold">Additional Settings</div>
              <button onClick={() => setIsSettingsOpen(false)} className="text-2xl">&times;</button>
            </div>
            {/* Modal body placeholder */}
          </Modal>
        </div>
        {/* AI influencer */}
        <div className="flex-1 bg-[#23233a] rounded-2xl p-6 border-2 border-dashed border-[#35354d] flex flex-col shadow-lg">
          <div className="font-semibold mb-4 text-lg">AI influencer</div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center mb-2">
              <button className="w-full h-14 bg-[#23233a] border border-[#35354d] rounded-lg mb-2 hover:border-[#6c47ff] transition-colors font-medium shadow-sm">Choose Image</button>
              <span className="text-xs text-[#b0b0c3] mb-2">or select from the AI influencers below</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {aiInfluencers.map((src, i) => (
                  <img key={i} src={src} alt="ai influencer" className="w-16 h-16 rounded-lg object-cover border border-[#35354d] cursor-pointer hover:border-[#6c47ff] hover:scale-105 transition-all shadow-sm" />
                ))}
                <span className="text-xs text-[#b0b0c3] ml-2">1/3 →</span>
              </div>
              <button className="w-full h-10 bg-[#23233a] border border-[#35354d] rounded-lg hover:border-[#6c47ff] transition-colors font-medium shadow-sm mt-2">Show more AI influencers</button>
            </div>
          </div>
        </div>
        {/* Final output */}
        <div className="flex-1 bg-[#23233a] rounded-2xl p-6 border-2 border-dashed border-[#35354d] flex flex-col items-center justify-center shadow-lg">
          <div className="font-semibold mb-4 text-lg w-full text-left">Final output</div>
          <div className="flex-1 flex flex-col items-center justify-center w-full h-full">
            <div className="text-[#b0b0c3] text-center text-2xl">Output will appear here<br /><span className="text-lg">After processing</span></div>
          </div>
        </div>
      </div>
      {/* Bottom row */}
      <div className="w-full max-w-6xl grid grid-cols-6 gap-8 mb-6">
        {/* Video description */}
        <div className="col-span-2 flex flex-col bg-[#23233a] rounded-2xl p-6 border-2 border-dashed border-[#35354d] shadow-lg">
          <div className="font-semibold mb-2">Video description</div>
          <textarea className="bg-[#23233a] border border-[#35354d] rounded-lg p-3 text-sm mb-2 resize-none h-20 focus:border-[#6c47ff] transition-colors" placeholder="a user talking in front of a camera. ugc style..." value={videoDescription} onChange={e => setVideoDescription(e.target.value)} />
        </div>
        {/* Script */}
        <div className="col-span-2 flex flex-col bg-[#23233a] rounded-2xl p-6 border-2 border-dashed border-[#35354d] shadow-lg">
          <div className="font-semibold mb-2">Script</div>
          <textarea className="bg-[#23233a] border border-[#35354d] rounded-lg p-3 text-sm mb-2 resize-none h-20 focus:border-[#6c47ff] transition-colors" placeholder="Enter the script for what the AI influencer will say in the video..." value={script} onChange={e => setScript(e.target.value)} />
          <div className="flex gap-2 items-center mt-1">
            <button className={`px-3 py-1 rounded-full text-xs transition-colors ${!voiceNarration ? 'bg-[#35354d] text-white' : 'bg-[#6c47ff] text-white shadow'}`} onClick={() => setVoiceNarration(false)}>Choose voice</button>
            <button className={`px-3 py-1 rounded-full text-xs transition-colors ${voiceNarration ? 'bg-[#35354d] text-white' : 'bg-[#6c47ff] text-white shadow'}`} onClick={() => setVoiceNarration(true)}>Voice narration</button>
          </div>
        </div>
        {/* Duration */}
        <div className="col-span-1 flex flex-col bg-[#23233a] rounded-2xl p-6 border-2 border-dashed border-[#35354d] shadow-lg">
          <div className="font-semibold mb-2">Duration</div>
          <select className="bg-[#23233a] border border-[#35354d] rounded-lg p-2 text-base font-medium w-full min-w-[120px] focus:border-[#6c47ff] transition-colors" value={duration} onChange={e => setDuration(e.target.value)}>
            <option>5 seconds</option>
            <option>10 seconds</option>
            <option>15 seconds</option>
          </select>
        </div>
        {/* Quality */}
        <div className="col-span-1 flex flex-col bg-[#23233a] rounded-2xl p-6 border-2 border-dashed border-[#35354d] shadow-lg">
          <div className="font-semibold mb-2">Quality</div>
          <select className="bg-[#23233a] border border-[#35354d] rounded-lg p-2 text-base font-medium w-full min-w-[120px] focus:border-[#6c47ff] transition-colors" value={quality} onChange={e => setQuality(e.target.value)}>
            <option>Standard</option>
            <option>High</option>
          </select>
        </div>
        {/* Generate button row */}
        <div className="col-start-5 col-span-2 flex items-center justify-center mt-0">
          <button className="w-full bg-gradient-to-r from-[#a084fa] to-[#6c47ff] text-white font-semibold px-10 py-4 rounded-xl text-lg shadow-xl hover:scale-105 transition-transform" onClick={handleGenerate}>
            Generate (50 credits)
          </button>
        </div>
      </div>
    </div>
  )
} 