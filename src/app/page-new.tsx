'use client'

import React, { useState, ChangeEvent } from 'react';
import { FiSettings, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Sample data
const PRODUCT_SAMPLES = [
  '/samples/sample-product-1.png',
  '/samples/sample-product-2.png',
  '/samples/sample-product-3.png',
  '/samples/sample-product-4.png',
];

const AI_INFLUENCERS = [
  { id: 1, name: 'Influencer 1', img: '/influencers/influencer-1.png' },
  { id: 2, name: 'Influencer 2', img: '/influencers/influencer-2.png' },
  { id: 3, name: 'Influencer 3', img: '/influencers/influencer-3.png' },
  { id: 4, name: 'Influencer 4', img: '/influencers/influencer-4.png' },
];

const DURATIONS = ['5 seconds', '10 seconds'];
const QUALITIES = ['Standard', 'UHD'];

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#111827',
    color: 'white',
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  panelRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '16px',
  },
  panel: {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  panelHeader: {
    fontSize: '18px',
    fontWeight: '500',
    marginBottom: '16px',
  },
  chooseButton: {
    display: 'block',
    width: '100%',
    backgroundColor: '#374151',
    color: 'white',
    padding: '12px',
    textAlign: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    marginBottom: '16px',
    border: 'none',
  },
  helperText: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '16px',
  },
  navigationBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  sampleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  },
  sampleItem: {
    aspectRatio: '1/1',
    backgroundColor: '#374151',
    borderRadius: '6px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  navControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
  },
  navText: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#9ca3af',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
  },
  settingsButton: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '8px',
    color: 'white',
    padding: '12px',
    height: '120px',
    resize: 'none',
  },
  selectInput: {
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '8px',
    color: 'white',
    padding: '8px 12px',
    width: '100%',
  },
  controlsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  controlsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  generateButton: {
    backgroundColor: '#8b5cf6',
    color: 'white',
    fontWeight: '500',
    padding: '14px',
    borderRadius: '8px',
    width: '100%',
    border: 'none',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  outputContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
  },
  centeredText: {
    textAlign: 'center',
    color: '#9ca3af',
  },
};

export default function Home() {
  // Product Photo State
  const [productPhotoFile, setProductPhotoFile] = useState<File | null>(null);
  const [productPhotoUrl, setProductPhotoUrl] = useState<string | null>(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [noProductPhoto, setNoProductPhoto] = useState(false);

  // AI Influencer State
  const [aiInfluencerFile, setAiInfluencerFile] = useState<File | null>(null);
  const [aiInfluencerUrl, setAiInfluencerUrl] = useState<string | null>(null);
  const [currentInfluencerIndex, setCurrentInfluencerIndex] = useState(0);

  // Video & Script State
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [voiceoverScript, setVoiceoverScript] = useState<string>('');

  // Controls State
  const [duration, setDuration] = useState<string>(DURATIONS[0]);
  const [quality, setQuality] = useState<string>(QUALITIES[0]);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
    }
  };

  // Handle generate button click
  const handleGenerate = () => {
    console.log('Generating video with:', {
      productPhoto: noProductPhoto ? 'None' : (productPhotoUrl || 'Not selected'),
      aiInfluencer: aiInfluencerUrl || 'Not selected',
      videoDescription,
      voiceoverScript,
      duration,
      quality,
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>UGC Video Generator</h1>
      
      {/* Top row - 3 panels */}
      <div style={styles.panelRow}>
        {/* Product Photo Panel */}
        <div style={styles.panel}>
          <h2 style={styles.panelHeader}>Product photo</h2>
          
          <label htmlFor="productPhotoUpload" style={styles.chooseButton}>
            Choose Image
          </label>
          <input 
            type="file" 
            id="productPhotoUpload" 
            style={{display: 'none'}} 
            onChange={(e) => handleFileChange(e, setProductPhotoFile)} 
            accept="image/*" 
          />
          
          <p style={styles.helperText}>or select from the sample product photos below</p>
          
          <div>
            <div style={styles.navigationBar}>
              <span style={{fontSize: '14px', fontWeight: '500'}}>Product samples</span>
              <div style={styles.navControls}>
                <button 
                  onClick={() => setCurrentProductIndex(Math.max(0, currentProductIndex - 4))} 
                  style={styles.navButton}
                >
                  <FiChevronLeft />
                </button>
                <span style={styles.navText}>1/3</span>
                <button 
                  onClick={() => setCurrentProductIndex(Math.min(PRODUCT_SAMPLES.length - 4, currentProductIndex + 4))} 
                  style={styles.navButton}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
            <div style={styles.sampleGrid}>
              {PRODUCT_SAMPLES.map((sample, index) => (
                <div key={index} style={styles.sampleItem}>
                  <img 
                    src={sample}
                    alt={`Product sample ${index + 1}`}
                    style={styles.image}
                    onClick={() => {
                      setProductPhotoUrl(sample);
                      setProductPhotoFile(null);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.flexBetween}>
            <label style={styles.checkboxContainer}>
              <input 
                type="checkbox" 
                checked={noProductPhoto} 
                onChange={(e) => setNoProductPhoto(e.target.checked)} 
                style={styles.checkbox}
              />
              No need for product photo
            </label>
            <button style={styles.settingsButton}>
              <FiSettings size={18} />
            </button>
          </div>
        </div>

        {/* AI Influencer Panel */}
        <div style={styles.panel}>
          <h2 style={styles.panelHeader}>AI influencer</h2>
          
          <label htmlFor="aiInfluencerUpload" style={styles.chooseButton}>
            Choose Image
          </label>
          <input 
            type="file" 
            id="aiInfluencerUpload" 
            style={{display: 'none'}} 
            onChange={(e) => handleFileChange(e, setAiInfluencerFile)} 
            accept="image/*" 
          />
          
          <p style={styles.helperText}>or select from the AI influencers below</p>
          
          <div>
            <div style={styles.navigationBar}>
              <span style={{fontSize: '14px', fontWeight: '500'}}>AI influencers</span>
              <div style={styles.navControls}>
                <button 
                  onClick={() => setCurrentInfluencerIndex(Math.max(0, currentInfluencerIndex - 4))} 
                  style={styles.navButton}
                >
                  <FiChevronLeft />
                </button>
                <span style={styles.navText}>1/3</span>
                <button 
                  onClick={() => setCurrentInfluencerIndex(Math.min(AI_INFLUENCERS.length - 4, currentInfluencerIndex + 4))} 
                  style={styles.navButton}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
            <div style={styles.sampleGrid}>
              {AI_INFLUENCERS.map((influencer) => (
                <div key={influencer.id} style={styles.sampleItem}>
                  <img 
                    src={influencer.img}
                    alt={influencer.name}
                    style={styles.image}
                    onClick={() => {
                      setAiInfluencerUrl(influencer.img);
                      setAiInfluencerFile(null);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <button style={styles.chooseButton}>
            Show more AI influencers
          </button>
        </div>

        {/* Final Output Panel */}
        <div style={styles.panel}>
          <h2 style={styles.panelHeader}>Final output</h2>
          <div style={styles.outputContainer}>
            <div style={styles.centeredText}>
              <p>Output will appear here</p>
              <p>After processing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row - Video description, Script, and Controls */}
      <div style={styles.panelRow}>
        {/* Video Description */}
        <div style={styles.panel}>
          <h2 style={styles.panelHeader}>Video description</h2>
          <textarea
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            placeholder="E.g., A vibrant video showcasing the product in use, with dynamic transitions and engaging visuals..."
            style={styles.textInput}
          />
        </div>

        {/* Script */}
        <div style={styles.panel}>
          <h2 style={styles.panelHeader}>Script</h2>
          <textarea
            value={voiceoverScript}
            onChange={(e) => setVoiceoverScript(e.target.value)}
            placeholder="Enter the script for what the AI influencer will say in the video..."
            style={styles.textInput}
          />
        </div>

        {/* Controls and Generate */}
        <div style={styles.panel}>
          <div>
            <div style={styles.controlsHeader}>
              <h3 style={{fontWeight: '500'}}>Duration</h3>
              <h3 style={{fontWeight: '500'}}>Quality</h3>
            </div>
            
            <div style={styles.controlsGrid}>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={styles.selectInput}
              >
                {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                style={styles.selectInput}
              >
                {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            style={styles.generateButton}
          >
            Generate (50 credits)
          </button>
        </div>
      </div>
    </div>
  );
}
