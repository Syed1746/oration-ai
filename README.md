title: "Oration AI"
description: "Oration AI is a web-based chat application with AI integration that allows users to interact with an AI-powered assistant. The app uses Next.js, tRPC, TanStack Query, and Prisma with Supabase for database management."

table_of_contents:
  - Features
  - Tech_Stack
  - Setup_Installation
  - Environment_Variables
  - Database
  - Running_Locally
  - Deployment
  - License

features:
  - "AI-powered chat functionality"
  - "Persistent chat sessions using Prisma and Supabase"
  - "Real-time interaction with optimized queries via tRPC and TanStack Query"
  - "Responsive and user-friendly interface"

tech_stack:
  frontend: "Next.js, TypeScript, Tailwind CSS"
  backend: "tRPC, Next.js API routes"
  database: "PostgreSQL (Supabase) with Prisma ORM"
  api_integration: "OpenRouter / OpenAI for AI chat"

setup_installation:
  steps:
    - "Clone the repository: git clone https://github.com/Syed1746/oration-ai.git && cd oration-ai"
    - "Install dependencies: npm install"
    - "Set up environment variables: DATABASE_URL='postgresql://postgres:YOUR_PASSWORD_REPLACE_AT_SYMBOL@db.jbhotypvniivsyjstvjc.supabase.co:5432/postgres' OPENROUTER_API_KEY=sk-your-api-key"
    - "Generate Prisma Client: npx prisma generate"
    - "Run database migrations (if needed): npx prisma migrate dev"

environment_variables:
  DATABASE_URL: "Supabase PostgreSQL connection string"
  OPENROUTER_API_KEY: "API key for AI integration"
  note: "⚠️ Remember to URL encode any special characters in your database password (e.g., @ → %40)."

database:
  description: "Prisma is used to define the database schema in prisma/schema.prisma."
  tables:
    - "User (optional for authentication)"
    - "Session – stores chat sessions"
    - "Message – stores messages per session"

running_locally:
  description: "Start the development server"
  command: "npm run dev"
  url: "http://localhost:3000"

deployment:
  platform: "Vercel"
  note: "Add your .env variables in Vercel project settings for deployment to work."

notes:
  - "Authentication is not implemented (optional bonus points)."
  - "Prisma ORM is used for database management."
  - "Performance is optimized via Next.js and tRPC caching strategies."
