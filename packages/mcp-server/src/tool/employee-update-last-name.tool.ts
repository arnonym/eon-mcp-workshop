import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { pool } from '../db';
import { z } from 'zod';
import { Employee, EmployeeSchema } from '../schema';
import { withLogging } from '../utils/logging';

export function registerUpdateEmployeeLastNameTool(server: McpServer): void {
  server.registerTool(
    'updateEmployeeLastName',
    {
      title: 'Update last name of employee',
      description: 'Update last name of employee',
      inputSchema: z.object({
        lastName: z.string().max(100),
        id: z.number().int(),
      }).shape,
      outputSchema: EmployeeSchema.shape,
    },
    withLogging('updateEmployeeLastName', async (content) => {
      const result = await pool.query(
        'UPDATE employees SET last_name = $1 WHERE id = $2 RETURNING *',
        [content.lastName, content.id],
      );
      const employee = result.rows[0] as Employee;
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(employee),
          },
        ],
        structuredContent: employee,
      };
    }),
  );
}
