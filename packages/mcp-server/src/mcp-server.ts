import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGetEmployeesTool } from './tool/employee-list.tool';

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
  return mcpServer;
}
