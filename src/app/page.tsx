/* eslint-disable @next/next/no-img-element */
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
    textAlign: 'center' as 'center',
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
    resize: 'none' as 'none',
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
    objectFit: 'cover' as 'cover',
  },
  outputContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
  },
  centeredText: {
    textAlign: 'center' as 'center',
    color: '#9ca3af',
  },
};

export default function Home() {
  // Product Photo State
  const [productPhotoFile, setProductPhotoFile] = useState<File | null>(null);
  const [productPhotoUrl, setProductPhotoUrl] = useState<string | null>(null);
  const [productPhotoPrompt, setProductPhotoPrompt] = useState<string>('');
  const [productPhotoTab, setProductPhotoTab] = useState<'upload' | 'generate'>('upload');
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [noProductPhoto, setNoProductPhoto] = useState(false);
  const [generatingProductImage, setGeneratingProductImage] = useState(false);
  const [hoverProductImage, setHoverProductImage] = useState(false);

  // AI Influencer State
  const [aiInfluencerFile, setAiInfluencerFile] = useState<File | null>(null);
  const [aiInfluencerUrl, setAiInfluencerUrl] = useState<string | null>(null);
  const [aiInfluencerPrompt, setAiInfluencerPrompt] = useState<string>('');
  const [aiInfluencerTab, setAiInfluencerTab] = useState<'upload' | 'generate'>('upload');
  const [currentInfluencerIndex, setCurrentInfluencerIndex] = useState(0);
  const [generatingAiInfluencer, setGeneratingAiInfluencer] = useState(false);
  const [hoverAiInfluencerImage, setHoverAiInfluencerImage] = useState(false);

  // Video & Script State
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [voiceoverScript, setVoiceoverScript] = useState<string>('');

  // Controls State
  const [duration, setDuration] = useState<string>(DURATIONS[0]);
  const [quality, setQuality] = useState<string>(QUALITIES[0]);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void, setUrl: (url: string | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      // Clear previous object URL to avoid memory leaks
      if (setUrl === setProductPhotoUrl && productPhotoUrl && productPhotoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(productPhotoUrl);
      } else if (setUrl === setAiInfluencerUrl && aiInfluencerUrl && aiInfluencerUrl.startsWith('blob:')) {
        URL.revokeObjectURL(aiInfluencerUrl);
      }
      
      const file = e.target.files[0];
      setFile(file);
      // Create a URL for the image preview
      const url = URL.createObjectURL(file);
      setUrl(url);
      
      // Reset the file input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const checkImage = () => {
    if (productPhotoFile || productPhotoUrl) {
      return true;
    }
    if (aiInfluencerFile || aiInfluencerUrl) {
      return true;
    }
    if (noProductPhoto) {
      return true;
    }
    return false;
  };

  const handleGenerateProductImage = async () => {
    if (!productPhotoPrompt.trim() || generatingProductImage) return;
    setGeneratingProductImage(true);
    console.log('Generating product image from prompt:', productPhotoPrompt);
    
    try {
      // Get the API key from environment variables
      const apiKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
      
      if (!apiKey) {
        console.error('Hugging Face API key is not set. Please set NEXT_PUBLIC_HUGGING_FACE_API_KEY in your .env.local file');
        alert('API key not configured. Please check the console for more information.');
        return;
      }
      
      // Call the Hugging Face API for image generation
      // Using a more recent and capable model
      const response = await fetch(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'image/png'  // Request PNG format for better quality
          },
          body: JSON.stringify({
            inputs: productPhotoPrompt,
            parameters: {
              num_inference_steps: 30,  // Higher for better quality, but slower
              guidance_scale: 7.5,      // Controls how closely to follow the prompt
              width: 1024,              // Higher resolution
              height: 1024
            }
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error from Hugging Face API:', errorData);
        throw new Error(`Failed to generate image: ${response.status} ${response.statusText}`);
      }
      
      // Convert the response to a blob and create an object URL
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      
      // Clean up previous image URL if it exists
      if (productPhotoUrl && productPhotoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(productPhotoUrl);
      }
      
      // Update the state with the new image
      setProductPhotoUrl(imageUrl);
      setProductPhotoFile(null);
      
      console.log('Image generated successfully');
      
    } catch (error) {
      console.error('Error generating image:', error);
      // Show a user-friendly error message
      alert(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback to demo images in case of error (for demo purposes only)
      console.log('Falling back to demo images');
      const randomIndex = Math.floor(Math.random() * PRODUCT_SAMPLES.length);
      setProductPhotoUrl(PRODUCT_SAMPLES[randomIndex]);
      setProductPhotoFile(null);
    } finally {
      setGeneratingProductImage(false);
    }
  };
  
  const handleGenerateAiInfluencer = async () => {
    if (!aiInfluencerPrompt.trim() || generatingAiInfluencer) return;
    
    setGeneratingAiInfluencer(true);
    console.log('Generating AI influencer from prompt:', aiInfluencerPrompt);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll just use a random influencer image
      const randomIndex = Math.floor(Math.random() * AI_INFLUENCERS.length);
      setAiInfluencerUrl(AI_INFLUENCERS[randomIndex].img);
      setAiInfluencerFile(null);
      
      // In a real implementation, we would call the Hugging Face API with model optimized for faces/people
    } catch (error) {
      console.error('Error generating AI influencer image:', error);
    } finally {
      setGeneratingAiInfluencer(false);
    }
  };

  const handleGenerate = () => {
    console.log('Generating video with:', {
      productPhoto: noProductPhoto ? 'None' : (productPhotoUrl ? productPhotoUrl : productPhotoFile?.name),
      aiInfluencer: aiInfluencerUrl ? aiInfluencerUrl : aiInfluencerFile?.name,
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
          
          {/* Tabs for Upload/Generate */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #374151',
            marginBottom: '16px'
          }}>
            <button 
              onClick={() => setProductPhotoTab('upload')}
              style={{
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                borderBottom: productPhotoTab === 'upload' ? '2px solid #8b5cf6' : '2px solid transparent',
                color: productPhotoTab === 'upload' ? 'white' : '#9ca3af',
                fontWeight: productPhotoTab === 'upload' ? '500' : 'normal',
                cursor: 'pointer',
                marginRight: '16px'
              }}
            >
              Upload Image
            </button>
            <button
              onClick={() => setProductPhotoTab('generate')}
              style={{
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                borderBottom: productPhotoTab === 'generate' ? '2px solid #8b5cf6' : '2px solid transparent',
                color: productPhotoTab === 'generate' ? 'white' : '#9ca3af',
                fontWeight: productPhotoTab === 'generate' ? '500' : 'normal',
                cursor: 'pointer'
              }}
            >
              Generate Image
            </button>
          </div>
          
          {/* Content based on selected tab */}
          {productPhotoTab === 'upload' ? (
            <>
              {!productPhotoUrl ? (
                <>
                  <button 
                    onClick={() => {
                      // Create a temporary file input
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.files && target.files[0]) {
                          // Clear previous object URL if exists
                          if (productPhotoUrl && productPhotoUrl.startsWith('blob:')) {
                            URL.revokeObjectURL(productPhotoUrl);
                          }
                          
                          const file = target.files[0];
                          setProductPhotoFile(file);
                          
                          // Create a URL for the image preview
                          const url = URL.createObjectURL(file);
                          setProductPhotoUrl(url);
                        }
                      };
                      input.click();
                    }}
                    style={{
                      backgroundColor: '#2d3748',
                      width: '100%',
                      maxWidth: '100%',
                      textAlign: 'center' as 'center',
                      fontSize: '18px',
                      padding: '16px',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: '500',
                      cursor: 'pointer',
                      border: 'none',
                      display: 'block',
                      marginBottom: '16px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Choose Image
                  </button>
                </>
              ) : (
                <div 
                  style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '350px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#1a202c',
                    border: '1px solid #4b5563',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={() => setHoverProductImage(true)}
                  onMouseLeave={() => setHoverProductImage(false)}
                >
                  <img 
                    src={productPhotoUrl} 
                    alt="Selected product" 
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      padding: '8px',
                      boxSizing: 'border-box' as 'border-box',
                    }} 
                  />
                  
                  {/* Overlay buttons on hover */}
                  {hoverProductImage && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      gap: '16px',
                      padding: '16px',
                      boxSizing: 'border-box' as 'border-box',
                      transition: 'all 0.2s ease-in-out',
                      animation: 'fadeIn 0.2s ease-in-out',
                      zIndex: 10,
                    }}>
                      <button 
                        onClick={() => {
                          // Create a temporary file input
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.files && target.files[0]) {
                              // Clear previous object URL
                              if (productPhotoUrl && productPhotoUrl.startsWith('blob:')) {
                                URL.revokeObjectURL(productPhotoUrl);
                              }
                              
                              const file = target.files[0];
                              setProductPhotoFile(file);
                              
                              // Create a URL for the image preview
                              const url = URL.createObjectURL(file);
                              setProductPhotoUrl(url);
                            }
                          };
                          input.click();
                        }}
                        style={{
                          backgroundColor: '#2d3748',
                          width: '80%',
                          maxWidth: '300px',
                          textAlign: 'center' as 'center',
                          fontSize: '18px',
                          padding: '16px',
                          borderRadius: '8px',
                          color: 'white',
                          fontWeight: '500',
                          cursor: 'pointer',
                          border: 'none',
                          display: 'block',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        Choose Image
                      </button>
                      
                      <button 
                        onClick={() => {
                          setProductPhotoUrl(null);
                          setProductPhotoFile(null);
                        }}
                        style={{
                          backgroundColor: '#e53e3e',
                          width: '80%',
                          maxWidth: '300px',
                          textAlign: 'center' as 'center',
                          fontSize: '18px',
                          padding: '16px',
                          borderRadius: '8px',
                          color: 'white',
                          fontWeight: '500',
                          cursor: 'pointer',
                          border: 'none',
                          display: 'block',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        Clear Image
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* File input is now handled programmatically */}
            </>
          ) : (
            <div>
              <textarea
                value={productPhotoPrompt}
                onChange={(e) => setProductPhotoPrompt(e.target.value)}
                placeholder="Describe the product image you want to generate..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'none' as 'none',
                  marginBottom: '12px'
                }}
              />
              <button 
                onClick={() => handleGenerateProductImage()}
                disabled={!productPhotoPrompt.trim() || generatingProductImage}
                style={{
                  ...styles.chooseButton,
                  backgroundColor: !productPhotoPrompt.trim() || generatingProductImage ? '#4b5563' : '#8b5cf6',
                  cursor: !productPhotoPrompt.trim() || generatingProductImage ? 'not-allowed' : 'pointer',
                }}
              >
                {generatingProductImage ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          )}
        
          {/* No need for product photo checkbox at bottom of panel */}
          <div style={{ 
            marginTop: '16px', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none' as 'none',
            }}>
              <input
                type="checkbox"
                checked={noProductPhoto}
                onChange={(e) => {
                  setNoProductPhoto(e.target.checked);
                  // If checked, clear any selected image
                  if (e.target.checked) {
                    setProductPhotoUrl(null);
                    setProductPhotoFile(null);
                  }
                }}
                style={{
                  accentColor: '#8b5cf6',
                  width: '18px',
                  height: '18px',
                }}
              />
              <span style={{fontSize: '14px', marginLeft: '8px', color: '#e5e7eb'}}>No need for product photo</span>
            </label>
            <div style={{fontSize: '20px', cursor: 'pointer'}} title="Settings">
              ⚙️
            </div>
          </div>
        </div>

        {/* AI Influencer Panel */}
        <div style={styles.panel}>
          <h2 style={styles.panelHeader}>AI influencer</h2>
          
          {/* Tabs for Upload/Generate */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #374151',
            marginBottom: '16px'
          }}>
            <button 
              onClick={() => setAiInfluencerTab('upload')}
              style={{
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                borderBottom: aiInfluencerTab === 'upload' ? '2px solid #8b5cf6' : '2px solid transparent',
                color: aiInfluencerTab === 'upload' ? 'white' : '#9ca3af',
                fontWeight: aiInfluencerTab === 'upload' ? '500' : 'normal',
                cursor: 'pointer',
                marginRight: '16px'
              }}
            >
              Upload Image
            </button>
            <button
              onClick={() => setAiInfluencerTab('generate')}
              style={{
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                borderBottom: aiInfluencerTab === 'generate' ? '2px solid #8b5cf6' : '2px solid transparent',
                color: aiInfluencerTab === 'generate' ? 'white' : '#9ca3af',
                fontWeight: aiInfluencerTab === 'generate' ? '500' : 'normal',
                cursor: 'pointer'
              }}
            >
              Generate Image
            </button>
          </div>
          
          {/* Content based on selected tab */}
          {aiInfluencerTab === 'upload' ? (
            <>
              {!aiInfluencerUrl ? (
                <>
                  <label htmlFor="aiInfluencerUpload" style={{
                    ...styles.chooseButton,
                    backgroundColor: '#2d3748',
                    marginBottom: '12px'
                  }}>
                    Choose Image
                  </label>
                  <input 
                    type="file" 
                    id="aiInfluencerUpload" 
                    style={{display: 'none'}} 
                    onChange={(e) => handleFileChange(e, setAiInfluencerFile, setAiInfluencerUrl)} 
                    accept="image/*" 
                  />
                </>
              ) : (
                <div 
                  style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '350px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#1a202c',
                    border: '1px solid #4b5563',
                  }}
                  onMouseEnter={() => setHoverAiInfluencerImage(true)}
                  onMouseLeave={() => setHoverAiInfluencerImage(false)}
                >
                  <img 
                    src={aiInfluencerUrl} 
                    alt="Selected AI influencer" 
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }} 
                  />
                  
                  {/* Overlay buttons on hover */}
                  {hoverAiInfluencerImage && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      gap: '16px',
                      padding: '16px',
                      boxSizing: 'border-box' as 'border-box',
                    }}>
                      <label htmlFor="aiInfluencerUploadHover" style={{
                        ...styles.chooseButton,
                        backgroundColor: '#2d3748',
                        width: '80%',
                        maxWidth: '300px',
                        textAlign: 'center' as 'center',
                        fontSize: '18px',
                        padding: '16px',
                      }}>
                        Choose Image
                      </label>
                      <input 
                        type="file" 
                        id="aiInfluencerUploadHover" 
                        style={{display: 'none'}} 
                        onChange={(e) => handleFileChange(e, setAiInfluencerFile, setAiInfluencerUrl)} 
                        accept="image/*" 
                      />
                      
                      <button 
                        onClick={() => {
                          setAiInfluencerUrl(null);
                          setAiInfluencerFile(null);
                        }}
                        style={{
                          ...styles.chooseButton,
                          backgroundColor: '#e53e3e',
                          width: '80%',
                          maxWidth: '300px',
                          textAlign: 'center' as 'center',
                          fontSize: '18px',
                          padding: '16px',
                        }}
                      >
                        Clear Image
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <input 
                type="file" 
                id="aiInfluencerUpload" 
                style={{display: 'none'}} 
                onChange={(e) => handleFileChange(e, setAiInfluencerFile, setAiInfluencerUrl)} 
                accept="image/*" 
              />
            </>
          ) : (
            <div>
              <textarea
                value={aiInfluencerPrompt}
                onChange={(e) => setAiInfluencerPrompt(e.target.value)}
                placeholder="Describe the AI influencer you want to generate..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'none' as 'none',
                  marginBottom: '12px'
                }}
              />
              <button 
                onClick={() => handleGenerateAiInfluencer()}
                disabled={!aiInfluencerPrompt.trim() || generatingAiInfluencer}
                style={{
                  ...styles.chooseButton,
                  backgroundColor: !aiInfluencerPrompt.trim() || generatingAiInfluencer ? '#4b5563' : '#8b5cf6',
                  cursor: !aiInfluencerPrompt.trim() || generatingAiInfluencer ? 'not-allowed' : 'pointer',
                }}
              >
                {generatingAiInfluencer ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          )}
          
          {/* AI influencer preview is now handled in the upload tab */}
        </div>

        {/* Final Output Panel */}
        <div style={{
          ...styles.panel, 
          backgroundColor: '#1f2937',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px' // Match the height of other panels
        }}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>Fluxi</div>
            <div style={{fontSize: '14px', color: '#9ca3af'}}>AI Video Generator</div>
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
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={handleGenerate}
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                fontWeight: '500',
                padding: '14px',
                borderRadius: '8px',
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: 'auto'
              }}
            >
              Generate (50 credits)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}