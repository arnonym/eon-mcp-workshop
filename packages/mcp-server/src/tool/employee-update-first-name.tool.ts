import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { pool } from '../db';
import { z } from 'zod';
import { Employee, EmployeeSchema } from '../schema';
import { withLogging } from '../utils/logging';

export function registerUpdateEmployeeFirstNameTool(server: McpServer): void {
  server.registerTool(
    'updateEmployeeFirstName',
    {
      title: 'Update first name of employee',
      description: 'Update first name of employee',
      inputSchema: z.object({
        firstName: z.string().max(100),
        id: z.number().int(),
      }).shape,
      outputSchema: EmployeeSchema.shape,
    },
    withLogging('updateEmployeeFirstName', async (content) => {
      const result = await pool.query(
        'UPDATE employees SET first_name = $1 WHERE id = $2 RETURNING *',
        [content.firstName, content.id],
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
