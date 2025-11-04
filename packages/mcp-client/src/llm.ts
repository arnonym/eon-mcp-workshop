import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { Connection, MultiServerMCPClient } from '@langchain/mcp-adapters';
import dotenv from 'dotenv';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { pool } from './db';
import path from 'node:path';

dotenv.config({ quiet: true, path: path.join(__dirname, '../../../.env') });

const MCP_SERVER_LIST: Record<string, Connection> = {
  'local-mcp-server': {
    transport: 'http',
    url: 'http://localhost:3001/mcp',
  },
};

const PROMPT =
  'You are a crazy database-analyst agent. Start every response with "Yes, sir!"';

async function getMcpClientAndToolsForAllServers() {
  const mcpClient = new MultiServerMCPClient(MCP_SERVER_LIST);
  const tools = await mcpClient.getTools();
  console.log(`Got ${tools.length} tools from all servers.`);
  return { mcpClient: mcpClient, tools: tools };
}

export async function connectToLlm() {
  /* ChatGPT */
  // const llm = new ChatOpenAI({
  //   openAIApiKey: process.env.OPENAI_API_KEY!,
  //   model: 'gpt-4o',
  //   temperature: 0.7,
  // });
  /* EON GEN-AI Gateway */
  const llm = new ChatOpenAI({
    model: 'gpt-5-mini',
    temperature: 0.7,
    configuration: {
      baseURL: 'https://genai-api.eon.com/genai/llmgw/central',
      apiKey: process.env.EON_API_GW_KEY!,
    },
  });
  /* Gemini */
  // const llm = new ChatGoogleGenerativeAI({
  //   apiKey: process.env.GEMINI_API_KEY!,
  //   model: 'gemini-2.5-flash',
  //   temperature: 0.7,
  // });
  /* Azure */
  // const llm = new AzureChatOpenAI({
  //   azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY!,
  //   azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME!,
  //   azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME!,
  //   azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION!,
  //   temperature: 0.7,
  // });
  const { mcpClient, tools } = await getMcpClientAndToolsForAllServers();
  const checkPointer = new PostgresSaver(pool);
  await checkPointer.setup();
  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: checkPointer,
    prompt: PROMPT,
  });

  return {
    llm,
    mcpClient,
    tools,
    agent,
    ask: async (question: string, threadId: string): Promise<string> => {
      const message = { role: 'user', content: question };
      const res = await agent.invoke(
        {
          messages: [message],
        },
        { configurable: { thread_id: threadId } },
      );
      const response = res.messages.at(-1);
      return typeof response?.content === 'string'
        ? response?.content
        : JSON.stringify(response?.content);
    },
  };
}
