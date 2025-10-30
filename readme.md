# E.ON MCP Workshop

This mono-repo contains the following packages:

### mcp-server

The MCP Server providing custom tools for the LLM.

### mcp-client

The MCP Client and also the web server for the Angular UI

### ui

A simple Angular UI connecting to the web server.

## Required software
- node / npm
- docker with compose plugin
- @angular/cli


## Running the whole stack

```bash
docker compose up --build
```

```bash
npm run start:mcp-server
```

```bash
npm run start:mcp-client
```

```bash
npm run start:ui
```

## Some links

- https://modelcontextprotocol.io/

- https://mcpservers.org/

- https://github.com/modelcontextprotocol/inspector

- https://aistudio.google.com/

- https://www.langchain.com/
