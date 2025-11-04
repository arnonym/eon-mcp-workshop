import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp-server';

const app = express();
const mcpServer = createMcpServer();

app.use(express.json());

app.post('/mcp', async (req, res) => {
  console.log(`Request on ${req.path}`);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on('close', () => {
    transport.close();
  });
  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.use((req, res) => {
  console.error(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not Found' });
});

const port = Number.parseInt(process.env.PORT || '3001');
app
  .listen(port, () => {
    console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
  })
  .on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
