# Code Library

Welcome to the **Code Library**! This repository contains categorized examples and snippets for various programming and scripting languages. Each section is designed to provide practical, real-world examples to help you learn and apply concepts effectively.

## Table of Contents

- [Python](#python)
  - [Basic Examples](Python/basic-examples.md)
  - [Advanced Examples](Python/advanced-examples.md)
- [Shell Scripting](#shell-scripting)
  - [Basic Examples](Shell%20Scripting/basic-examples.md)
  - [Advanced Examples](Shell%20Scripting/advanced-examples.md)
- [SQL](#sql)
  - [Basic Examples](SQL/basic-examples.md)
  - [Advanced Examples](SQL/advanced-examples.md)
- [Rust](#rust)
  - [Basic Examples](Rust/basic-examples.md)
  - [Advanced Examples](Rust/advanced-examples.md)
- [Node (JS)](#node-js)
  - [Basic Examples](Node%20(JS)/basic-examples.md)
  - [Advanced Examples](Node%20(JS)/advanced-examples.md)
- [Prerequisites & Environment](#prerequisites--environment)
- [How to Use This Repository](#how-to-use-this-repository)
- [LLM / Tooling Integration](#llm--tooling-integration)
- [Using as an MCP Server](#using-as-an-mcp-server)
- [Contributing](#contributing)

---

## Python

Explore Python examples ranging from beginner-friendly snippets to advanced use cases. Assumes Python 3.

- **[Basic Examples](Python/basic-examples.md):** Foundational concepts like file I/O, JSON handling, environment variables, basic logging, and argument parsing.
- **[Advanced Examples](Python/advanced-examples.md):** Concurrency (`multiprocessing`, `asyncio`), performance (Parquet, memory profiling), scientific computing (`scipy` interpolation, optimization), ML utilities (`sklearn` scaling, splitting, persistence, metrics), and robust utilities (YAML, SQLAlchemy Core, regex).

## Shell Scripting

Master shell scripting with examples covering file management, text processing, and robust scripting practices. Primarily uses `bash`.

- **[Basic Examples](Shell%20Scripting/basic-examples.md):** Robust script templates (`set -euo pipefail`, `trap`), argument parsing (`getopts`), `find`/`xargs` usage, text processing (`awk`, `sed`, `join`), and basic `curl`/`jq` interaction.
- **[Advanced Examples](Shell%20Scripting/advanced-examples.md):** Advanced `parallel` usage, database interaction (`psql`), cloud CLI scripting (AWS example), file locking (`flock`), checkpointing/resuming, and advanced parameter expansion.

## SQL

Learn SQL concepts with examples demonstrating querying, data manipulation, and analysis patterns. Examples aim for ANSI SQL but note dialect differences.

- **[Basic Examples](SQL/basic-examples.md):** Core DML/DDL (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE`), filtering (`WHERE`), joins (`INNER`, `LEFT`), aggregation (`GROUP BY`, `HAVING`), subqueries, CTEs (`WITH`), basic window functions (ranking, `LAG`/`LEAD`), `CASE WHEN`, and `NULL` handling.
- **[Advanced Examples](SQL/advanced-examples.md):** Recursive CTEs, pivoting/unpivoting, sessionization, cohort analysis, querying complex types (JSON, arrays), and statistical functions.

## Rust

Examples demonstrating common tasks and advanced features in Rust. Requires the Rust toolchain (`cargo`).

- **[Basic Examples](Rust/basic-examples.md):** Core I/O (file reading/writing), JSON handling (`serde_json`), command-line parsing (`clap`), logging (`env_logger`), and basic web requests (`reqwest`).
- **[Advanced Examples](Rust/advanced-examples.md):** Concurrency (`tokio` tasks, `mpsc` channels), advanced error handling (`thiserror`), custom derive macros, WebSockets (`tokio-tungstenite`), advanced pattern matching, parallelism (`rayon`), and structured logging (`tracing`).

## Node (JS)

Leverage Node.js for backend development and scripting with these examples.

- **[Basic Examples](Node%20(JS)/basic-examples.md):** Covers core JavaScript data structures and manipulation (Strings, Arrays, Objects, Types) alongside fundamental Node.js modules like `fs` (async/sync file I/O, JSON), `path`, basic `http` server creation, Promises, and utilities (`console`, timers).
- **[Advanced Examples](Node%20(JS)/advanced-examples.md):** Explores advanced concepts including Streams (reading large files, piping), concurrency/parallelism (`worker_threads`, `child_process`), web development with `express` (middleware, routing, error handling), database interaction (`pg` for PostgreSQL), real-time communication with `ws` (WebSockets), and configuration management (`dotenv`).

---

## Prerequisites & Environment

- Examples are generally tested on macOS/Linux environments.
- **Python:** Assumes Python 3. Specific libraries needed are usually imported within the snippets.
- **Shell Scripting:** Primarily targets `bash` (v4.0+ recommended for features like associative arrays). Relies on common utilities (`grep`, `sed`, `awk`, `find`, `xargs`, `curl`). Advanced examples may require specific tools like `jq`, `parallel`, `psql`, or cloud CLIs (`aws`).
- **SQL:** Examples aim for ANSI SQL, but syntax for specific functions (dates, JSON, arrays, window functions) varies significantly between databases. Always test against your target system (PostgreSQL, MySQL, SQL Server, etc.).
- **Rust:** Requires the Rust compiler and `cargo` (the package manager) installed. Dependencies are listed in comments or would typically be in a `Cargo.toml` file.

---

## How to Use This Repository

1. Navigate to the relevant section based on the language or topic you are interested in.
2. Open the linked Markdown files for detailed examples and explanations.
3. Copy and adapt the code snippets to your own projects as needed.

---

## LLM / Tooling Integration

An index file (`llm.json`) is provided at the root of the repository. This file contains metadata about each example set, including language, level, keywords, and paths to associated standalone snippet files. It is designed to help language models or automated tools efficiently navigate the code library and locate relevant examples based on specific queries.

---

## Using as an MCP Server

This repository can be integrated as an MCP (Multi-Code Provider) server in various development environments using the `gitmcp.io` service. This allows AI assistants within these tools to directly access and reference the code snippets from this library.

Below are the configuration instructions for common tools:

**Cursor:**
Update your `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "code-library Docs": {
      "url": "https://gitmcp.io/dperussina/code-library"
    }
  }
}
```

**Claude Desktop:**
Update your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "code-library Docs": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://gitmcp.io/dperussina/code-library"
      ]
    }
  }
}
```

**Windsurf:**
Update your `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "code-library Docs": {
      "serverUrl": "https://gitmcp.io/dperussina/code-library"
    }
  }
}
```

**VSCode:**
Update your `.vscode/mcp.json` (within your workspace):
```json
{
  "servers": {
    "code-library Docs": {
      "type": "sse",
      "url": "https://gitmcp.io/dperussina/code-library"
    }
  }
}
```

**Cline:**
Update your `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`:
```json
{
  "mcpServers": {
    "code-library Docs": {
      "url": "https://gitmcp.io/dperussina/code-library",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

---

## Contributing

Contributions are welcome! If you have additional examples or improvements, feel free to submit a pull request.

---

Happy coding!