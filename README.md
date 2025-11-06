# AI Telegram Bot with OpenAI Assistant

Telegram bot that connects to OpenAI Assistant API and provides an admin panel for editing system prompts.

## Features

- Telegram bot using Grammy framework
- OpenAI Assistant API integration with thread management
- Admin panel (Express + EJS + Bootstrap) for editing system prompts
- Basic Auth protection for admin panel
- Docker Compose deployment
- System prompt stored in file (no database required)

## Setup

1. Clone the repository

2. Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` file with your credentials:
   - `TELEGRAM_BOT_TOKEN` - Get from [@BotFather](https://t.me/botfather)
   - `OPENAI_API_KEY` - Get from [OpenAI Platform](https://platform.openai.com/)
   - `OPENAI_ASSISTANT_ID` - (Optional) Use existing assistant ID
   - `ADMIN_USERNAME` - Username for admin panel
   - `ADMIN_PASSWORD` - Password for admin panel
   - `PORT` - Port for admin server (default: 3000)

## Running with Docker

```bash
docker-compose up -d
```

The bot and admin panel will start automatically.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build TypeScript:
   ```bash
   npm run build
   ```

3. Start the application:
   ```bash
   npm start
   ```

## Usage

1. **Telegram Bot**: Send messages to your bot, and it will respond using OpenAI Assistant.

2. **Admin Panel**: Visit `http://localhost:3000` (or your configured port) to edit the system prompt. Use the Basic Auth credentials from `.env`.

## Project Structure

```
/
├── src/
│   ├── bot/              # Grammy bot implementation
│   ├── openai/           # OpenAI Assistant client
│   ├── server/           # Express server and routes
│   ├── admin/            # EJS admin panel views
│   ├── utils/            # Utility functions
│   └── index.ts          # Main entry point
├── prompts/              # System prompt storage
├── docker-compose.yml    # Docker configuration
└── Dockerfile            # Docker image definition
```

## Notes

- Each user has their own conversation thread in OpenAI
- System prompt is stored in `prompts/system-prompt.txt`
- When you update the prompt in admin panel, the assistant instructions are updated automatically
- If `OPENAI_ASSISTANT_ID` is not provided, a new assistant will be created on first use


