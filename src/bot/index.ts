import { Bot } from 'grammy';
import { sendMessage } from '../openai/assistant';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set');
}

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// Handle /start command - translate to "привет"
bot.command('start', async (ctx) => {
  if (!ctx.from) return;
  
  const userId = ctx.from.id;

  try {
    // Send "typing..." indicator
    await ctx.api.sendChatAction(ctx.chat.id, 'typing');

    // Send "привет" to OpenAI assistant
    const response = await sendMessage(userId, 'привет');

    // Send response back to user
    await ctx.reply(response);
  } catch (error) {
    console.error('Error processing /start command:', error);
    await ctx.reply('Sorry, I encountered an error processing your message. Please try again later.');
  }
});

// Handle other commands - ignore them
bot.on('message:entities:bot_command', async (ctx) => {
  // Ignore all commands except /start (which is handled above)
  // This ensures commands like /help, /settings, etc. are not sent to the assistant
});

// Handle regular text messages
bot.on('message:text', async (ctx) => {
  if (!ctx.from) return;
  
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;

  // Skip if message starts with / (it's a command)
  if (userMessage.startsWith('/')) {
    return;
  }

  try {
    // Send "typing..." indicator
    await ctx.api.sendChatAction(ctx.chat.id, 'typing');

    // Get response from OpenAI
    const response = await sendMessage(userId, userMessage);

    // Send response back to user
    await ctx.reply(response);
  } catch (error) {
    console.error('Error processing message:', error);
    await ctx.reply('Sorry, I encountered an error processing your message. Please try again later.');
  }
});

bot.catch((err) => {
  console.error('Bot error:', err);
});

export async function startBot() {
  await bot.start();
  console.log('Bot started successfully');
}

if (require.main === module) {
  startBot().catch(console.error);
}


