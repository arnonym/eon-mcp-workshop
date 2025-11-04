# Simple Tool Call

## Prerequisites

- Node.js (version 22 or higher)
- npm package manager

## Setup

### 1. Environment Configuration

Copy the example .env file and fill out the EON_API_GW_KEY environment variables.

### 2. Simple tool call

Runs a standalone LangGraph ReAct agent that can interact with the SQLite database:

```bash
npm start
```

This script:
- Connects to Azure OpenAI
- Initializes the SQLite database connection
- Creates a ReAct agent with SQL query tools
- Demonstrates interactive database querying
