import { spawn } from 'child_process'
import { join } from 'path'
import { promises as fs } from 'fs'

interface AIServiceConfig {
  apiKey: string
  modelEndpoint: string
  speechEndpoint: string
}

interface SubtitleSegment {
  start: number
  end: number
  text: string
}

export class AIService {
  private readonly config: AIServiceConfig
  private readonly tempDir: string

  constructor() {
    this.config = {
      apiKey: process.env.AI_SERVICE_API_KEY || '',
      modelEndpoint: process.env.AI_SERVICE_ENDPOINT || 'https://api.ai-service.com/v1',
      speechEndpoint: process.env.SPEECH_SERVICE_ENDPOINT || 'https://api.speech-service.com/v1'
    }
    this.tempDir = join(process.cwd(), 'temp')
  }

  async removeBackground(inputPath: string): Promise<string> {
    // Ensure temp directory exists
    await fs.mkdir(this.tempDir, { recursive: true })

    // Extract frames from video
    const framesDir = join(this.tempDir, 'frames')
    await fs.mkdir(framesDir, { recursive: true })

    // Extract frames using FFmpeg
    await this.extractFrames(inputPath, framesDir)

    // Process each frame with AI
    const processedFramesDir = join(this.tempDir, 'processed-frames')
    await fs.mkdir(processedFramesDir, { recursive: true })

    const frames = await fs.readdir(framesDir)
    for (const frame of frames) {
      if (frame.endsWith('.jpg')) {
        await this.processFrame(
          join(framesDir, frame),
          join(processedFramesDir, frame)
        )
      }
    }

    // Combine processed frames back into video
    const outputPath = join(this.tempDir, 'output.mp4')
    await this.combineFrames(processedFramesDir, outputPath)

    // Cleanup
    await this.cleanup(framesDir, processedFramesDir)

    return outputPath
  }

  async generateSubtitles(videoPath: string): Promise<string> {
    // Extract audio from video
    const audioPath = join(this.tempDir, 'audio.wav')
    await this.extractAudio(videoPath, audioPath)

    // Convert audio to text
    const segments = await this.transcribeAudio(audioPath)

    // Generate SRT file
    const srtPath = join(this.tempDir, 'subtitles.srt')
    await this.generateSRT(segments, srtPath)

    // Cleanup
    await fs.unlink(audioPath).catch(() => {})

    return srtPath
  }

  private async extractFrames(inputPath: string, outputDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', inputPath,
        '-vf', 'fps=30',
        '-q:v', '2',
        join(outputDir, 'frame-%d.jpg')
      ])

      ffmpeg.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`FFmpeg process exited with code ${code}`))
      })

      ffmpeg.on('error', reject)
    })
  }

  private async processFrame(inputPath: string, outputPath: string): Promise<void> {
    try {
      const response = await fetch(`${this.config.modelEndpoint}/remove-background`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: await this.imageToBase64(inputPath)
        })
      })

      if (!response.ok) {
        throw new Error('AI service request failed')
      }

      const result = await response.json()
      await this.base64ToImage(result.image, outputPath)
    } catch (error) {
      console.error('Frame processing error:', error)
      // Fallback to original frame if processing fails
      await fs.copyFile(inputPath, outputPath)
    }
  }

  private async combineFrames(framesDir: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-framerate', '30',
        '-i', join(framesDir, 'frame-%d.jpg'),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        outputPath
      ])

      ffmpeg.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`FFmpeg process exited with code ${code}`))
      })

      ffmpeg.on('error', reject)
    })
  }

  private async cleanup(...dirs: string[]): Promise<void> {
    for (const dir of dirs) {
      await fs.rm(dir, { recursive: true, force: true })
    }
  }

  private async imageToBase64(imagePath: string): Promise<string> {
    const imageBuffer = await fs.readFile(imagePath)
    return imageBuffer.toString('base64')
  }

  private async base64ToImage(base64: string, outputPath: string): Promise<void> {
    const imageBuffer = Buffer.from(base64, 'base64')
    await fs.writeFile(outputPath, imageBuffer)
  }

  private async extractAudio(videoPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', videoPath,
        '-vn', // No video
        '-acodec', 'pcm_s16le', // PCM 16-bit
        '-ar', '16000', // 16kHz sample rate
        '-ac', '1', // Mono
        outputPath
      ])

      ffmpeg.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`FFmpeg process exited with code ${code}`))
      })

      ffmpeg.on('error', reject)
    })
  }

  private async transcribeAudio(audioPath: string): Promise<SubtitleSegment[]> {
    try {
      const audioBuffer = await fs.readFile(audioPath)
      const base64Audio = audioBuffer.toString('base64')

      const response = await fetch(`${this.config.speechEndpoint}/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio: base64Audio,
          format: 'wav',
          language: 'en-US',
          model: 'whisper-1'
        })
      })

      if (!response.ok) {
        throw new Error('Speech-to-text service request failed')
      }

      const result = await response.json()
      return result.segments.map((segment: any) => ({
        start: segment.start,
        end: segment.end,
        text: segment.text.trim()
      }))
    } catch (error) {
      console.error('Transcription error:', error)
      throw error
    }
  }

  private async generateSRT(segments: SubtitleSegment[], outputPath: string): Promise<void> {
    const srtContent = segments.map((segment, index) => {
      const startTime = this.formatTime(segment.start)
      const endTime = this.formatTime(segment.end)
      return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`
    }).join('\n')

    await fs.writeFile(outputPath, srtContent)
  }

  private formatTime(seconds: number): string {
    const date = new Date(seconds * 1000)
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')
    const secs = date.getUTCSeconds().toString().padStart(2, '0')
    const ms = date.getUTCMilliseconds().toString().padStart(3, '0')
    return `${hours}:${minutes}:${secs},${ms}`
  }
} 