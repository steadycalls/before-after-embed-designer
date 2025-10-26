# Before/After Embed Designer

An interactive web application that enables designers and marketers to create stunning before/after comparison embeds for case study pages. The application automatically extracts colors and fonts from your website to ensure brand consistency.

![Before/After Embed Designer](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- **🎨 Auto Brand Matching**: Simply enter your website URL and the app automatically extracts your brand colors and fonts
- **⚡ Interactive Toggle**: Create embeds with smooth, engaging before/after toggles
- **📝 Easy Embedding**: Get clean, optimized code that works anywhere - just copy and paste
- **🖼️ Image Upload**: Drag-and-drop interface for uploading before and after images
- **💾 Save & Manage**: Store your embeds and access them anytime from your dashboard
- **🔐 User Authentication**: Secure login with Manus OAuth

## Demo

Visit the live application: [Before/After Embed Designer](https://3000-iv3xq12cuxfeyi33tlc0a-5efa1c49.manusvm.computer)

## How It Works

1. **Upload Your Images**: Upload your before and after images showing the transformation
2. **Extract Your Brand Style**: Enter your website URL to automatically extract colors and fonts
3. **Get Your Embed Code**: Copy the generated code and paste it anywhere on your website

## Tech Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS 4
- tRPC for type-safe API calls
- React Dropzone for image uploads
- Wouter for routing

### Backend
- Node.js with Express
- tRPC for API layer
- Puppeteer for website scraping
- MySQL/TiDB database with Drizzle ORM
- S3 for file storage

## Installation

### Prerequisites
- Node.js 22.x or higher
- pnpm package manager
- MySQL database

### Setup

1. Clone the repository:
```bash
git clone https://github.com/steadycalls/before-after-embed-designer.git
cd before-after-embed-designer
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - DATABASE_URL
# - JWT_SECRET
# - OAUTH_SERVER_URL
# - VITE_OAUTH_PORTAL_URL
# - S3 credentials
```

4. Push database schema:
```bash
pnpm db:push
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Usage

### Creating an Embed

1. Sign in to the application
2. Click "Create Embed" or "Start Creating"
3. Enter a name for your embed
4. Upload before and after images
5. Enter your website URL and click "Extract" to pull colors and fonts
6. Adjust dimensions if needed (default: 600x400px)
7. Click "Create Embed"

### Getting the Embed Code

1. Navigate to your Dashboard
2. Click "Get Code" on any embed
3. Copy the generated HTML/CSS/JavaScript code
4. Paste it into your website where you want the embed to appear

### Example Embed Code

The generated code is self-contained and includes:
- Responsive container
- Interactive toggle button
- Smooth transitions
- Your brand colors and fonts

```html
<!-- Before/After Embed -->
<div id="before-after-embed-1"></div>
<script>
// Self-contained embed code with your styling
</script>
```

## Project Structure

```
before-after-embed-designer/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # tRPC client setup
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── routers.ts         # tRPC routers and procedures
│   ├── db.ts              # Database helpers
│   ├── websiteScraper.ts  # Puppeteer scraping logic
│   └── storage.ts         # S3 storage helpers
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Database tables
└── shared/                # Shared types and constants
```

## API Endpoints

### Scraper
- `POST /api/trpc/scraper.scrapeWebsite` - Extract colors and fonts from a URL

### Embeds
- `POST /api/trpc/embeds.create` - Create a new embed
- `GET /api/trpc/embeds.list` - List user's embeds
- `GET /api/trpc/embeds.get` - Get a specific embed
- `PATCH /api/trpc/embeds.update` - Update an embed
- `DELETE /api/trpc/embeds.delete` - Delete an embed
- `GET /api/trpc/embeds.getEmbedCode` - Get embed code for a specific embed

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Database Migrations
```bash
# Generate migration
pnpm db:generate

# Apply migration
pnpm db:migrate
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Manus](https://manus.im) platform
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ for designers and marketers

