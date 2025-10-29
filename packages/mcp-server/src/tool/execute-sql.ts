import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { pool } from '../db';
import { z } from 'zod';
import { withLogging } from '../utils/logging';

export function registerExecuteSqlTool(server: McpServer): void {
  server.registerTool(
    'executeSql',
    {
      title: 'Execute SQL Query',
      description: 'Execute SQL Query',
      inputSchema: z.object({
        sqlQuery: z.string(),
      }).shape,
      outputSchema: z.object({
        queryResult: z.string(),
      }).shape,
    },
    withLogging('executeSql', async (content) => {
      const result = await pool.query(content.sqlQuery);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result),
          },
        ],
        structuredContent: { queryResult: JSON.stringify(result) },
      };
    }),
  );
}
