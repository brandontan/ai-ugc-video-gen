import { spawn } from 'child_process'
import { join } from 'path'
import { promises as fs } from 'fs'
import { AIService } from './aiService'

interface ProcessingOptions {
  enhanceQuality?: boolean
  removeBackground?: boolean
  addSubtitles?: boolean
  targetDuration?: number
}

export class VideoProcessor {
  private readonly uploadDir: string
  private readonly outputDir: string
  private readonly aiService: AIService

  constructor() {
    this.uploadDir = join(process.cwd(), 'uploads')
    this.outputDir = join(process.cwd(), 'processed')
    this.aiService = new AIService()
  }

  async processVideo(filename: string, options: ProcessingOptions = {}) {
    const inputPath = join(this.uploadDir, filename)
    let currentPath = inputPath
    let srtPath: string | undefined

    // Process background removal if requested
    if (options.removeBackground) {
      try {
        currentPath = await this.aiService.removeBackground(currentPath)
      } catch (error) {
        console.error('Background removal failed:', error)
        // Continue with original video if background removal fails
      }
    }

    // Generate subtitles if requested
    if (options.addSubtitles) {
      try {
        srtPath = await this.aiService.generateSubtitles(currentPath)
      } catch (error) {
        console.error('Subtitle generation failed:', error)
        // Continue without subtitles if generation fails
      }
    }

    const outputFilename = `processed-${filename}`
    const outputPath = join(this.outputDir, outputFilename)

    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true })

    // Build FFmpeg command based on options
    const ffmpegArgs = ['-i', currentPath]

    if (options.enhanceQuality) {
      ffmpegArgs.push(
        '-vf', 'scale=1920:1080',
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', '18'
      )
    }

    if (srtPath) {
      ffmpegArgs.push(
        '-vf', `subtitles=${srtPath}:force_style='FontName=Arial,FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=1'`
      )
    }

    if (options.targetDuration) {
      ffmpegArgs.push(
        '-t', options.targetDuration.toString()
      )
    }

    // Add output path
    ffmpegArgs.push(outputPath)

    return new Promise<string>((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs)

      ffmpeg.stderr.on('data', (data) => {
        console.log(`FFmpeg: ${data}`)
      })

      ffmpeg.on('close', async (code) => {
        // Cleanup SRT file if it exists
        if (srtPath) {
          await fs.unlink(srtPath).catch(() => {})
        }

        if (code === 0) {
          resolve(outputFilename)
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`))
        }
      })

      ffmpeg.on('error', (err) => {
        reject(err)
      })
    })
  }

  async getVideoMetadata(filename: string) {
    const inputPath = join(this.uploadDir, filename)
    
    return new Promise<any>((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        inputPath
      ])

      let output = ''

      ffprobe.stdout.on('data', (data) => {
        output += data
      })

      ffprobe.on('close', (code) => {
        if (code === 0) {
          try {
            const metadata = JSON.parse(output)
            resolve(metadata)
          } catch (err) {
            reject(new Error('Failed to parse video metadata'))
          }
        } else {
          reject(new Error(`FFprobe process exited with code ${code}`))
        }
      })

      ffprobe.on('error', (err) => {
        reject(err)
      })
    })
  }
} 