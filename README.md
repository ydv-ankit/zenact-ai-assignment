# Script AI

A chat app powered by Google's Gemini AI. Built with Next.js, it handles user authentication, saves your chat history. Plus, it has dark mode because who doesn't love that?

## What It Does

- 🤖 **Chat with AI**
- 🔐 **Login System**
- 💬 **Saves Chat History**
- 🌙 **Dark Mode**
- 🎤 **Voice Input**

## Tech Stack

- **Next.js 16** - The React framework we're using
- **TypeScript** - For type safety
- **Supabase** - Handles users and stores chat data
- **LangChain** - Connects to Google Gemini AI
- **React Query** - Manages data fetching and caching
- **Tailwind CSS** - Styling everything

## Key Libraries & What They Do

- **LangChain** (`@langchain/google-genai`, `@langchain/core`, `langchain`) - Connects to Google Gemini and handles the conversation flow
- **Supabase** (`@supabase/ssr`) - Handles authentication and database
- **React Query** (`@tanstack/react-query`) - Keeps data in sync with the server
- **React Form** (`@tanstack/react-form`) - Handles form inputs
- **Shadcn UI** - Accessible components (dialogs, dropdowns, tooltips, etc.)
- **Tailwind CSS** - Used to design components with inline CSS
- **Lucide React** - Icons
- **next-themes** - Theme switching
- **react-hot-toast** - Toast notifications
- **react-speech-recognition** - Speech-to-text

## Getting Started

### What You Need

- Node.js 20 or newer
- A Supabase account
- A Google Gemini API key

### Setup Steps

1. **Clone and install**:

```bash
git clone https://github.com/ydv-ankit/zenact-ai-assignment
cd zenact-ai-assignment
npm install
```

2. **Create `.env.local`** in the root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

3. **Set up the database** in Supabase:

Run this SQL in the Supabase SQL editor:

```sql
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_chat_id ON chats(chat_id);
```

4. **Start the dev server**:

```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000)

Done! 🚀
