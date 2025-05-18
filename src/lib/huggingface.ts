// Use a simpler approach with a more reliable model
// and better error handling

// Debug: Log environment variables
console.log('Environment variables:', {
  hasApiKey: !!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY,
  nodeEnv: process.env.NODE_ENV,
  publicUrl: process.env.NEXT_PUBLIC_URL
});

type HuggingFaceResponse = Array<{ url: string }>;

export async function generateImage(prompt: string): Promise<string> {
  try {
    console.log('Starting image generation with prompt:', prompt);
    
    // Using a more reliable model endpoint
    const API_URL = 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4';
    
    console.log('Making API request to:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        options: {
          use_cache: true,
          wait_for_model: true,
        },
      }),
    });

    console.log('API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    // Check if we got an image
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('image/')) {
      const errorText = await response.text();
      console.error('Unexpected response content type:', { contentType, response: errorText });
      throw new Error('Unexpected response format from API');
    }

    const imageBlob = await response.blob();
    if (!imageBlob || imageBlob.size === 0) {
      throw new Error('Received empty image data from API');
    }

    console.log('Successfully generated image');
    return URL.createObjectURL(imageBlob);
    
  } catch (error) {
    console.error('Error in generateImage:', error);
    
    // Provide more user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('Invalid API key. Please check your Hugging Face token.');
      } else if (error.message.includes('429')) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (error.message.includes('model is loading')) {
        throw new Error('The AI model is still loading. Please try again in 30 seconds.');
      }
    }
    
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
