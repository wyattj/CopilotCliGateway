import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { homedir } from "node:os";

export interface McpServerEntry {
  name: string;
  type: string;
  command: string;
  tools?: string[];
}

interface McpConfigFile {
  mcpServers?: Record<
    string,
    {
      type?: string;
      command?: string;
      tools?: string[];
      [key: string]: unknown;
    }
  >;
}

/**
 * Reads the Copilot CLI MCP config from ~/.copilot/mcp-config.json
 * and returns a list of configured MCP server names + metadata.
 */
export async function loadMcpServers(): Promise<McpServerEntry[]> {
  const configPath = resolve(homedir(), ".copilot", "mcp-config.json");

  try {
    const raw = await readFile(configPath, "utf-8");
    // Strip trailing commas (common in hand-edited JSON)
    const cleaned = raw.replace(/,\s*([\]}])/g, "$1");
    const parsed = JSON.parse(cleaned) as McpConfigFile;

    if (!parsed.mcpServers) return [];

    return Object.entries(parsed.mcpServers).map(([name, entry]) => ({
      name,
      type: entry.type ?? "unknown",
      command: entry.command ?? "unknown",
      tools: entry.tools,
    }));
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.log(`[MCP] No MCP config found at ${configPath}`);
    } else {
      console.warn(`[MCP] Failed to read MCP config: ${err}`);
    }
    return [];
  }
}
