import express from 'express';
import cors from 'cors';
import { connectToLlm } from './llm';
import { AskSchema } from './schema';

async function run(): Promise<void> {
  const app = express();
  const llmClient = await connectToLlm();

  app.use(cors());
  app.use(express.json());

  app.post('/ask', async (req, res) => {
    const payload = AskSchema.safeParse(req.body);
    if (payload.error) {
      console.error('Invalid request body:', payload.error);
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }
    const answer = await llmClient.ask(
      payload.data.question,
      payload.data.threadId,
    );
    res.status(200).json({ answer });
  });

  app.use((req, res) => {
    console.error(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Not Found' });
  });

  const port = Number.parseInt(process.env.PORT || '3000');
  app
    .listen(port, () => {
      console.log(
        `Demo Web Server with MCP Client running on http://localhost:${port}/mcp`,
      );
    })
    .on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });
}

run().catch((error) => {
  console.error(error);
});
