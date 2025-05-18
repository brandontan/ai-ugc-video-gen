# AI UGC Video Generation Platform

A security-first, production-ready platform for AI-powered UGC video generation.

## 🚀 Features

- Secure authentication and authorization
- Video generation and processing
- Modern, responsive UI
- Production-grade security measures

## 🛠 Technical Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- OAuth2 Authentication
- Secure API endpoints

## 🔒 Security Features

- OAuth2 authentication
- Input validation and sanitization
- HTTPS with HSTS headers
- Secure secrets management
- Audit logging
- Dependency hygiene
- Strict CORS policy
- Content Security Policy (CSP)

## 🏗 Architecture

- Stateless backend design
- Job queue for video processing
- Redis caching layer
- Optimized database queries
- Rate limiting and request throttling

## 🚦 Getting Started

1. Clone the repository
```bash
git clone https://github.com/brandontan/ai-ugc-video-gen.git
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

   Create a `.env.local` file in the root directory and add your Hugging Face API key:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` and replace `your_api_key_here` with your actual Hugging Face API key from [Hugging Face settings](https://huggingface.co/settings/tokens).

   > **Note:** The `.env.local` file is gitignored for security. Never commit your API keys to version control.

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🖼 Image Generation

The application includes AI-powered image generation using Hugging Face's Stable Diffusion model. To use this feature:

1. Make sure you've set up your Hugging Face API key in `.env.local`
2. Navigate to the "Product Photo" panel
3. Click on the "Generate Image" tab
4. Enter a description of the product image you want to generate
5. Click "Generate Image"

The generated image will appear in the preview area, and you can use it in your video generation.

### Troubleshooting

- If you see an error about the API key, make sure you've set it in `.env.local`
- If the image generation fails, check the browser console for detailed error messages
- For rate limiting issues, consider upgrading your Hugging Face account or implementing client-side caching
```bash
cp .env.example .env
```

4. Run the development server
```bash
npm run dev
```

## 📝 Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Maintain security-first approach
- Keep dependencies updated
- Follow semantic versioning

## 🔄 CI/CD

- Automated testing
- Security scanning
- Dependency updates
- Production deployment

## 📄 License

MIT License - See LICENSE file for details
