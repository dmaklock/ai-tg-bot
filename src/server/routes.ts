import { Router, Request, Response } from 'express';
import { readSystemPrompt, writeSystemPrompt } from '../utils/prompt';
import { getThreadTTLMinutes, setThreadTTLMinutes } from '../utils/ttl';
import { updateAssistantInstructions } from '../openai/assistant';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const prompt = readSystemPrompt();
  const ttlMinutes = getThreadTTLMinutes();
  res.render('index', { prompt, ttl: ttlMinutes });
});

router.post('/api/prompt', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Промпт должен быть строкой' });
    }

    writeSystemPrompt(prompt);
    
    // Update assistant instructions
    await updateAssistantInstructions();
    
    res.json({ success: true, message: 'Промпт успешно обновлен' });
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json({ error: 'Не удалось обновить промпт' });
  }
});

router.get('/api/prompt', (req: Request, res: Response) => {
  const prompt = readSystemPrompt();
  res.json({ prompt });
});

router.post('/api/ttl', (req: Request, res: Response) => {
  try {
    const { ttl } = req.body;
    
    if (typeof ttl !== 'number' && typeof ttl !== 'string') {
      return res.status(400).json({ error: 'TTL должен быть числом' });
    }

    const ttlMinutes = typeof ttl === 'string' ? parseInt(ttl, 10) : ttl;
    
    if (isNaN(ttlMinutes) || ttlMinutes <= 0) {
      return res.status(400).json({ error: 'TTL должен быть положительным числом' });
    }

    setThreadTTLMinutes(ttlMinutes);
    
    res.json({ success: true, message: 'TTL успешно обновлен', ttl: ttlMinutes });
  } catch (error) {
    console.error('Error updating TTL:', error);
    res.status(500).json({ error: 'Не удалось обновить TTL' });
  }
});

router.get('/api/ttl', (req: Request, res: Response) => {
  const ttlMinutes = getThreadTTLMinutes();
  res.json({ ttl: ttlMinutes });
});

export default router;
