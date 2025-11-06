import { Bot } from 'grammy';
import { sendMessage } from '../openai/assistant';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set');
}

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('message:text', async (ctx) => {
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;

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


