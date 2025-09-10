# AI Influencer Persona Creation Platform


## ✨ Features

### 🎭 4-Step Persona Creation Wizard
- **Step 1: Basic Description** - Define name, age, role, and personality
- **Step 2: Personality Traits** - Select from curated personality characteristics
- **Step 3: Introduction** - Craft the perfect opening message and icebreakers
- **Step 4: Advanced Settings** - Fine-tune conversation style and behavior

### 💬 Real-time Chat Interface
- **Interactive Conversations** - Chat with your AI personas in real-time
- **Hindi-English Mix** - Authentic bilingual communication (e.g., "Hey jaan, kaise ho?")
- **Conversation History** - All chats are saved and persistent
- **Flirty & Seductive** - AI companions designed for romantic interactions

### 🗄️ Persistent Storage
- **PostgreSQL Database** - All personas and conversations saved permanently
- **Persona Management** - View, edit, and organize your AI companions
- **Chat History** - Complete conversation logs with timestamps

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling with custom gradient themes
- **Wouter** for client-side routing
- **TanStack Query** for state management and API caching
- **Radix UI** components with shadcn/ui design system
- **Vite** for fast development and builds

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** (Neon Database) for data persistence
- **GROQ API** integration with Llama 3.1 model

### AI & External Services
- **GROQ Cloud** - Powers AI conversations with llama-3.1-8b-instant
- **Dynamic System Prompts** - Context-aware AI personality generation

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- GROQ API key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/influbee.git
cd influbee
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_postgresql_database_url
PGHOST=your_db_host
PGDATABASE=your_db_name
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGPORT=5432

# AI Service
GROQ_API_KEY=your_groq_api_key
```

### 4. Database Setup
The application uses PostgreSQL with Drizzle ORM. Database tables will be created automatically on first run.

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📱 Usage Guide

### Creating Your First AI Persona

1. **Launch the App** - Open InfluBee in your browser
2. **Click "Create New AI Persona"** - Start the 4-step wizard
3. **Basic Info** - Enter name, age, role (e.g., "Instagram Influencer")
4. **Personality** - Choose traits like "Flirty", "Confident", "Playful"
5. **Introduction** - Write opening line and conversation starters
6. **Advanced** - Set communication style to "Hindi-English Mix"
7. **Start Chatting** - Your AI companion is ready!

### Managing Personas

- **Home Page** - View all your created AI personas
- **Chat History** - Access previous conversations
- **Multiple Personas** - Create unlimited AI companions
- **Persistent Data** - Everything is saved in the database

## 🔧 API Documentation

### Core Endpoints

#### Personas
```javascript
// Create new persona
POST /api/personas
Body: { name, age, role, description, traits, introduction, ... }

// Get all personas
GET /api/personas/all

// Get specific persona
GET /api/personas/:id
```

#### Conversations
```javascript
// Create conversation
POST /api/conversations
Body: { personaId, userId }

// Send message
POST /api/conversations/:id/messages
Body: { message }

// Get conversation
GET /api/conversations/:id
```

## 📁 Project Structure

```
influbee/
├── client/src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   └── persona/         # Persona creation steps
│   ├── pages/
│   │   ├── persona-list.tsx # Home page with persona grid
│   │   ├── persona-creator.tsx # 4-step creation wizard
│   │   └── chat.tsx         # Real-time chat interface
│   └── lib/                 # Utilities and API clients
├── server/
│   ├── routes.ts           # Express API routes
│   ├── storage.ts          # Database layer with Drizzle
│   └── db.ts              # Database connection
├── shared/
│   └── schema.ts           # Shared TypeScript types
└── attached_assets/
    └── image_*.png         # InfluBee logo and assets
```

## 🎨 Design & Theming

- **Color Scheme**: Orange, black, purple gradient theme
- **Typography**: Modern, clean fonts optimized for readability
- **Responsive**: Mobile-first design that works on all devices
- **Dark Mode**: Built-in dark/light theme switching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-username/influbee/issues) page
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## 🔮 Future Roadmap

- [ ] User authentication and profiles  
- [ ] Voice message support
- [ ] Image sharing in chats
- [ ] Persona marketplace
- [ ] Mobile app (React Native)
- [ ] Advanced AI models integration

---

**Made with ❤️ for creating amazing AI companions**

*InfluBee - Where AI meets personality* 🐝✨
