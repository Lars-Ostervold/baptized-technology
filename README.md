AI generated readme for now while I'm still refining the alpha 🙂

# Baptized Technology

A modern web application built with Next.js, featuring authentication, AI integration, and a beautiful UI powered by Tailwind CSS.

## Features

- 🔐 Authentication with Supabase
  - Email/Password login
  - Magic link authentication
  - OAuth providers (GitHub, Google, Apple)
- 🤖 AI Integration with OpenAI
- 🎨 Modern UI with Tailwind CSS and Radix UI
- 🌙 Dark mode support
- 📱 Responsive design
- 🔍 SEO optimized
- 🚀 Built with Next.js 14

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Authentication:** Supabase
- **AI:** OpenAI
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/baptized_technology.git
cd baptized_technology
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
baptized_technology/
├── app/                 # Next.js app directory
├── components/         # React components
├── lib/               # Utility functions and shared logic
├── public/            # Static assets
├── utils/             # Helper functions
└── styles/            # Global styles
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
