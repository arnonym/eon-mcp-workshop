import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TicketToolOutputSchema } from '../schema';
import { pool } from '../db';
import { withLogging } from '../utils/logging';

export function registerGetTicketsTool(server: McpServer): void {
  server.registerTool(
    'getTickets',
    {
      title: 'Get Tickets',
      description: 'Gets tickets',
      inputSchema: {},
      outputSchema: TicketToolOutputSchema.shape,
    },
    withLogging('getTickets', async () => {
      const result = await pool.query('SELECT * FROM tickets');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              tickets: result.rows,
              count: result.rows.length,
            }),
          },
        ],
        structuredContent: {
          tickets: result.rows,
          count: result.rows.length,
        },
      };
    }),
  );
}
