import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { EmployeeToolOutputSchema } from '../schema';
import { pool } from '../db';
import { withLogging } from '../utils/logging';

export function registerGetEmployeesTool(server: McpServer): void {
  server.registerTool(
    'getEmployees',
    {
      title: 'Get Employees',
      description: 'Gets employees',
      inputSchema: {},
      outputSchema: EmployeeToolOutputSchema.shape,
    },
    withLogging('getEmployees', async () => {
      const result = await pool.query('SELECT * FROM employees');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              employees: result.rows,
              count: result.rows.length,
            }),
          },
        ],
        structuredContent: {
          employees: result.rows,
          count: result.rows.length,
        },
      };
    }),
  );
}
