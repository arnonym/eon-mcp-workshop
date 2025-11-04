import 'dotenv/config';
import {z} from 'zod';
import {ChatOpenAI} from '@langchain/openai';
import {tool} from '@langchain/core/tools';
import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {SqlDatabase} from 'langchain/sql_db';
import {createReactAgent} from '@langchain/langgraph/prebuilt';
import path from "node:path";
import dotenv from 'dotenv';

dotenv.config({ quiet: true, path: path.join(__dirname, '../../../.env') });

let llm: ChatOpenAI;
try {
    llm = new ChatOpenAI({
        model: 'gpt-5-mini',
        temperature: 0.7,
        configuration: {
            baseURL: 'https://genai-api.eon.com/genai/llmgw/central',
            apiKey: process.env.EON_API_GW_KEY!,
        },
    });

    console.log('✓ LLM configured (AzureChatOpenAI using chat-completions via instance name)');
} catch (e: any) {
    console.error(`⚠️  LLM configuration failed: ${e?.message || e}`);
    process.exit(1);
}

const dbPath = path.join(__dirname, '/../data/synthetic_data.db');
const appDataSource = new DataSource({type: 'sqlite', database: dbPath});

let db: SqlDatabase;

async function initDb() {
    await appDataSource.initialize();
    db = await SqlDatabase.fromDataSourceParams({appDataSource});
    console.log('✓ SQLite connected:', dbPath);
}

const queryDatabase = tool(
    async ({query}: { query: string }) => {
        try {
            const result = await db.run(query);
            return `Query executed successfully:\n${result}`;
        } catch (err: any) {
            return `Error executing query: ${err?.message || String(err)}`;
        }
    },
    {
        name: 'query_database',
        description:
            `Execute a SQL query against the tickets and employees SQLite DB.\n\n` +
            `Available tables:\n` +
            `- employees: id, first_name, last_name, team, line_manager\n` +
            `- tickets: id, title, description, status, assignee, sprint, created_at, updated_at`,
        schema: z.object({query: z.string().describe('A valid SQL query to execute')}),
    }
);

const getDatabaseSchema = tool(
    async () => {
        try {
            const info = await db.getTableInfo();
            return `Database schema:\n${info}`;
        } catch (err: any) {
            return `Error getting schema: ${err?.message || String(err)}`;
        }
    },
    {
        name: 'get_database_schema',
        description: 'Get schema information for all tables in the database.',
        schema: z.object({}),
    }
);

const getSampleData = tool(
    async () => {
        try {
            const employees = await db.run('SELECT * FROM employees LIMIT 3');
            const tickets = await db.run('SELECT * FROM tickets LIMIT 3');
            return `Sample data:\n\nEMPLOYEES (first 3 rows):\n${employees}\n\nTICKETS (first 3 rows):\n${tickets}`;
        } catch (err: any) {
            return `Error getting sample data: ${err?.message || String(err)}`;
        }
    },
    {
        name: 'get_sample_data',
        description: 'Return first 3 rows from employees and tickets for orientation.',
        schema: z.object({}),
    }
);

const tools = [getDatabaseSchema, getSampleData, queryDatabase];

const systemPrompt = 'You are a helpful database analyst assistant.';
const agent = createReactAgent({
    llm,
    tools,
    prompt: systemPrompt,
});

export async function askAgent(question: string, verbose = true): Promise<string> {
    if (verbose) {
        console.log(`🤔 User: ${question}`);
        console.log('🤖 Agent is thinking...');
    }
    try {
        const result = await agent.invoke({messages: [{role: 'user', content: question}]});
        const last = result.messages?.[result.messages.length - 1];
        const content = typeof last?.content === 'string' ? last.content : JSON.stringify(last?.content);
        if (verbose) console.log(`💬 Agent: ${content}`);
        return content ?? '';
    } catch (e: any) {
        const msg = `I apologize, but I encountered an error: ${e?.message || String(e)}`;
        if (verbose) console.log(`❌ Error: ${msg}`);
        return msg;
    }
}

async function main() {
    await initDb();
    console.log('============================================================');
    console.log('TEST 1: Database Overview');
    console.log('============================================================');
    await askAgent('Can you tell me what data is available in this database?');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
