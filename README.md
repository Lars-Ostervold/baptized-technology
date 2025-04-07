# Helping Out

If you have UI/UX improvements, RAG stack optimizations, etc. Go for it! I'm a data scientist by training, so I'm sure there is lots of optimization to be had.

## Wondering why audio sources are missing for a particular chatbot?

There's a good chance that I haven't processed all the podcasts, videos, sermons, etc. for a chatbot you see. Processing audio files is ~$0.50/hr of content. Which sounds inexpensive, then you start doing some math and realize it adds up pretty quickly. I allocate some money every month to processing audio, but, if you ever want to fund audio processing for a particular source, shoot me a message (through the site contact form) and we'll get it worked out.

## Want to see a new chatbot?

I'm always looking to expand the suite of chatbots! If you have a favorite organization or author you want make a chatbot for, let's do it! It's fairly trivial to add a new interface for a chatbot, so the biggest timesink is scraping content. 

The trickiest part is scraping your content into the right form for our databases. To help with this, I recommend forking one of the scrapers I built, then adjusting the code for your use case. I've tried to be clear what metadata is required for each source in the scraping code. If you've got questions, feel free to reach out!

# Processes
Things I don't want to lose and might be helpful for the open-source journey 🙂

### Adding a new chatbot
- Need to first create a new row in the 'chatbots' table in Supabase
- Copy down the uuid for that new row in the 'chatbots' table
- Perform all the scraping using the uuid above as the 'chatbot_id' variable when uploading content to the 'chatbot_sources' SQL table in Supabase
- Create a new chatbot config in this project under @/lib/chatbot/config.ts and put the uuid down under the vectorNameSpace variable.
- New chatbot shouldbe up and ready to go 🙂


--- Below is the AI-generated readme for now while I'm still refining the alpha 🙂 I won't leave it as AI-generated slop forever. I promise 😉 --------

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
