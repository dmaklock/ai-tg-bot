import { Router, Request, Response } from 'express';
import { readSystemPrompt, writeSystemPrompt } from '../utils/prompt';
import { updateAssistantInstructions } from '../openai/assistant';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const prompt = readSystemPrompt();
  res.render('index', { prompt });
});

router.post('/api/prompt', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt must be a string' });
    }

    writeSystemPrompt(prompt);
    
    // Update assistant instructions
    await updateAssistantInstructions();
    
    res.json({ success: true, message: 'Prompt updated successfully' });
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

router.get('/api/prompt', (req: Request, res: Response) => {
  const prompt = readSystemPrompt();
  res.json({ prompt });
});

export default router;


