import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGetTicketsTool } from './tool/ticket.tool';
import { registerGetEmployeesTool } from './tool/employee-list.tool';
import { registerUpdateEmployeeLastNameTool } from './tool/employee-update-last-name.tool';
import { registerUpdateEmployeeFirstNameTool } from './tool/employee-update-first-name.tool';
import { registerExecuteSqlTool } from './tool/execute-sql';

export function createMcpServer(): McpServer {
  const mcpServer = new McpServer(
    {
      name: 'example-mcp-server',
      version: '0.0.1',
    },
    {
      capabilities: {
        logging: {
          enabled: true,
        },
      },
    },
  );

  registerGetEmployeesTool(mcpServer);
  registerUpdateEmployeeLastNameTool(mcpServer);
  registerUpdateEmployeeFirstNameTool(mcpServer);
  registerGetTicketsTool(mcpServer);
  registerExecuteSqlTool(mcpServer);
  return mcpServer;
}
