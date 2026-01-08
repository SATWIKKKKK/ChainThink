# ChainThink

Chat with multiple AI models in one place. Access GPT-4, Claude, Gemini, Llama, and more through OpenRouter.

## Features

- 🤖 **Multiple AI Models** - Switch between GPT-4, Claude, Gemini, Llama, Mistral, and more
- 💬 **Chat History** - All conversations saved and organized
- 🎨 **Dark Theme** - Beautiful Vercel-inspired dark UI
- 🔐 **Google Auth** - Secure authentication with Google
- ⚡ **Fast Streaming** - Real-time streaming responses

## Tech Stack

- **Framework**: Next.js 16 with Turbopack
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 7
- **Auth**: NextAuth.js v5
- **AI**: OpenRouter API
- **Styling**: Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Push database schema: `npx prisma db push`
5. Run development server: `npm run dev`

## Environment Variables

```env
DATABASE_URL="your-postgresql-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
OPENROUTER_API_KEY="your-openrouter-api-key"
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
