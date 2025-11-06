import OpenAI from 'openai';
import { readSystemPrompt } from '../utils/prompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let assistantId: string | null = null;
const userThreads = new Map<number, string>(); // userId -> threadId

export async function getOrCreateAssistant(): Promise<string> {
  if (assistantId) {
    return assistantId;
  }

  const existingAssistantId = process.env.OPENAI_ASSISTANT_ID;
  if (existingAssistantId) {
    assistantId = existingAssistantId;
    return assistantId;
  }

  const systemPrompt = readSystemPrompt();
  
  const assistant = await openai.beta.assistants.create({
    name: 'Telegram Bot Assistant',
    instructions: systemPrompt || 'You are a helpful AI assistant.',
    model: 'gpt-4-turbo-preview',
  });

  assistantId = assistant.id;
  return assistantId;
}

export async function getOrCreateThread(userId: number): Promise<string> {
  if (userThreads.has(userId)) {
    return userThreads.get(userId)!;
  }

  const thread = await openai.beta.threads.create();
  userThreads.set(userId, thread.id);
  return thread.id;
}

export async function sendMessage(userId: number, message: string): Promise<string> {
  const assistantId = await getOrCreateAssistant();
  const threadId = await getOrCreateThread(userId);

  // Add message to thread
  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message,
  });

  // Run the assistant
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  // Wait for completion
  let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: threadId });
  
  while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: threadId });
  }

  if (runStatus.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
    
    if (assistantMessage && assistantMessage.content.length > 0) {
      const content = assistantMessage.content[0];
      if (content.type === 'text') {
        return content.text.value;
      }
    }
    throw new Error('No text response from assistant');
  }

  if (runStatus.status === 'failed') {
    const error = (runStatus as any).last_error;
    throw new Error(`Assistant run failed: ${error?.message || 'Unknown error'}`);
  }

  throw new Error(`Run failed with status: ${runStatus.status}`);
}

export async function updateAssistantInstructions(): Promise<void> {
  const systemPrompt = readSystemPrompt();
  
  // If assistant doesn't exist yet, it will be created with new prompt on next message
  if (!assistantId) {
    // Reset assistantId so it gets recreated with new prompt
    assistantId = null;
    return;
  }

  await openai.beta.assistants.update(assistantId, {
    instructions: systemPrompt || 'You are a helpful AI assistant.',
  });
}

