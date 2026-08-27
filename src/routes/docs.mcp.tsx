import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/docs/mcp")({
  head: () => ({
    meta: [
      { title: "MCP Server Docs — BactoAI" },
      {
        name: "description",
        content:
          "Connect Claude, ChatGPT, Cursor or any MCP client to BactoAI: endpoint, OAuth consent flow, tool schemas and example JSON-RPC requests.",
      },
      { property: "og:title", content: "BactoAI MCP Server Documentation" },
      {
        property: "og:description",
        content:
          "Endpoint, OAuth 2.1 consent flow, tool schemas and example requests for external AI assistants.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BactoAI MCP Server Documentation" },
      {
        name: "twitter:description",
        content: "Connect any MCP client to BactoAI: OAuth flow, tool schemas, example requests.",
      },
    ],
  }),
  component: McpDocsPage,
});

const MCP_URL = "https://genome-guardian-ai.lovable.app/mcp";

function Code({ children, label }: { children: string; label?: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
      {label && (
        <div className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4 text-xs leading-relaxed text-foreground">
        <code className="font-mono">{children}</code>
      </pre>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-28">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

const tools = [
  {
    name: "list_contact_submissions",
    title: "List contact submissions",
    access: "Admin role required",
    description:
      "Lists website submissions (demo requests, partner inquiries, newsletter signups, general contact). Rows are returned through row-level security as the signed-in user, so non-admin accounts see none.",
    schema: `{
  "type": "object",
  "properties": {
    "form_type": {
      "type": "string",
      "enum": ["demo", "partner", "newsletter", "contact"],
      "description": "Filter by submission type."
    },
    "limit": {
      "type": "integer",
      "description": "Max rows to return (default 25, max 100)."
    }
  }
}`,
    example: `{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "list_contact_submissions",
    "arguments": { "form_type": "demo", "limit": 10 }
  }
}`,
  },
  {
    name: "submission_stats",
    title: "Submission stats",
    access: "Admin role required",
    description:
      "Summarises submissions by form type and returns the most recent submission timestamp. Takes no arguments.",
    schema: `{
  "type": "object",
  "properties": {}
}`,
    example: `{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": { "name": "submission_stats", "arguments": {} }
}`,
  },
  {
    name: "list_articles",
    title: "List articles",
    access: "Any signed-in account",
    description:
      "Lists published BactoAI blog and resource articles with title, excerpt, category, publication date and reading time. Optionally filtered by category.",
    schema: `{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "enum": ["Research", "Clinical", "Public Health", "Product"],
      "description": "Filter articles by category."
    }
  }
}`,
    example: `{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "list_articles",
    "arguments": { "category": "Clinical" }
  }
}`,
  },
];

function McpDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary">
            Developer docs
          </div>
          <h1 className="mt-3 text-4xl font-bold text-foreground">BactoAI MCP server</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            BactoAI exposes a Model Context Protocol (MCP) server so external AI assistants —
            Claude, ChatGPT, Cursor, Codex or any MCP-compatible client — can read BactoAI content
            and, for authorised internal users, review website submissions. Every call is
            authenticated with OAuth 2.1 and executes under the same row-level security rules as the
            web app.
          </p>

          <Section id="endpoint" title="Endpoint">
            <p>
              The server speaks MCP over Streamable HTTP. Point your client at the URL below; it
              handles discovery, authorization and JSON-RPC on the same path.
            </p>
            <Code label="Server URL">{MCP_URL}</Code>
            <p>
              Protected-resource metadata is published at{" "}
              <code className="font-mono text-foreground">
                /.well-known/oauth-protected-resource
              </code>
              , which clients fetch automatically to discover the authorization server.
            </p>
          </Section>

          <Section id="auth" title="OAuth 2.1 &amp; consent flow">
            <p>
              The MCP server is a resource server: it only verifies bearer tokens. Authorization is
              handled by BactoAI's managed auth service, with dynamic client registration enabled so
              clients self-register — no manual client ID or secret to copy.
            </p>
            <ol className="ml-5 list-decimal space-y-2">
              <li>
                You add the server URL in your MCP client and start the connection. The client reads{" "}
                <code className="font-mono text-foreground">
                  /.well-known/oauth-protected-resource
                </code>{" "}
                and the authorization server's discovery document.
              </li>
              <li>
                The client registers itself dynamically (RFC 7591) and opens the authorize URL in
                your browser with PKCE.
              </li>
              <li>
                If you are not signed in you land on{" "}
                <code className="font-mono text-foreground">/auth</code>. Sign in (or create an
                account) with the same email you use for the BactoAI console; the consent URL is
                preserved and you are returned to it afterwards.
              </li>
              <li>
                The consent screen at{" "}
                <code className="font-mono text-foreground">
                  /.lovable/oauth/consent?authorization_id=…
                </code>{" "}
                names the requesting client and explains that it will act as you. Choose{" "}
                <strong className="text-foreground">Approve</strong> or{" "}
                <strong className="text-foreground">Deny</strong>.
              </li>
              <li>
                On approval you are redirected back to the client, which exchanges the code for an
                access token and calls the MCP endpoint with{" "}
                <code className="font-mono text-foreground">
                  Authorization: Bearer &lt;token&gt;
                </code>
                . Already-approved clients skip the consent screen on reconnect.
              </li>
            </ol>
            <p>
              Tokens are issued only through this OAuth flow. Pasting an app session token will not
              work — the server requires a token that carries an OAuth{" "}
              <code className="font-mono text-foreground">client_id</code> claim.
            </p>
            <p>
              <strong className="text-foreground">Permissions.</strong> The token identifies you,
              and database access runs as your account.{" "}
              <code className="font-mono text-foreground">list_articles</code> works for any
              signed-in user. The submission tools return rows only if your account holds the{" "}
              <code className="font-mono text-foreground">admin</code> role; otherwise they return
              an empty result rather than an error.
            </p>
          </Section>

          <Section id="requests" title="Transport &amp; request format">
            <p>
              All calls are JSON-RPC 2.0 over HTTP POST. Streamable HTTP requires both content types
              in the <code className="font-mono text-foreground">Accept</code> header — omitting
              either returns <code className="font-mono text-foreground">406 Not Acceptable</code>.
            </p>
            <Code label="Required headers">{`POST ${MCP_URL}
Content-Type: application/json
Accept: application/json, text/event-stream
Authorization: Bearer <access_token>`}</Code>
            <Code label="Initialize">{`{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {},
    "clientInfo": { "name": "my-assistant", "version": "1.0.0" }
  }
}`}</Code>
            <Code label="List tools">{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}`}</Code>
            <Code label="curl example">{`curl -X POST ${MCP_URL} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -H "Authorization: Bearer $BACTOAI_MCP_TOKEN" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'`}</Code>
          </Section>

          <Section id="clients" title="Client configuration">
            <p>
              Most clients only need the URL. For editors that use a JSON config file, use a remote
              HTTP server entry:
            </p>
            <Code label="mcp.json">{`{
  "mcpServers": {
    "bactoai": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`}</Code>
            <p>
              In Claude or ChatGPT, add BactoAI as a custom connector using the same URL and
              complete the browser sign-in when prompted.
            </p>
          </Section>

          <Section id="tools" title="Tool reference">
            <p>
              Three tools are advertised. All are read-only and idempotent — nothing in this server
              mutates or deletes data.
            </p>
            <div className="mt-6 space-y-8">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-2xl border border-border bg-card/50 p-6 shadow-elegant"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <code className="font-mono text-base font-semibold text-foreground">
                      {tool.name}
                    </code>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {tool.access}
                    </span>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                      read-only
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                  <Code label="Input schema">{tool.schema}</Code>
                  <Code label="Example request">{tool.example}</Code>
                </div>
              ))}
            </div>
          </Section>

          <Section id="responses" title="Responses &amp; errors">
            <p>
              Every tool returns MCP content: a human-readable{" "}
              <code className="font-mono text-foreground">text</code> block containing JSON, plus{" "}
              <code className="font-mono text-foreground">structuredContent</code> for programmatic
              use.
            </p>
            <Code label="Example result">{`{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      { "type": "text", "text": "{\\"total\\": 42, \\"by_form_type\\": {\\"demo\\": 18, \\"newsletter\\": 21, \\"partner\\": 3}, \\"latest\\": \\"2026-08-11T09:14:02.331Z\\"}" }
    ],
    "structuredContent": {
      "total": 42,
      "by_form_type": { "demo": 18, "newsletter": 21, "partner": 3 },
      "latest": "2026-08-11T09:14:02.331Z"
    }
  }
}`}</Code>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <code className="font-mono text-foreground">401 Unauthorized</code> — missing,
                expired or non-OAuth token. Re-run the connection flow; the response includes a{" "}
                <code className="font-mono text-foreground">WWW-Authenticate</code> header pointing
                at the metadata document.
              </li>
              <li>
                <code className="font-mono text-foreground">406 Not Acceptable</code> — the{" "}
                <code className="font-mono text-foreground">Accept</code> header is missing{" "}
                <code className="font-mono text-foreground">application/json</code> or{" "}
                <code className="font-mono text-foreground">text/event-stream</code>.
              </li>
              <li>
                Tool-level failures come back as a normal result with{" "}
                <code className="font-mono text-foreground">isError: true</code> and a message — for
                example &quot;Not authenticated&quot;, or a note that no submissions are visible
                because the account lacks the admin role.
              </li>
            </ul>
          </Section>

          <Section id="support" title="Access &amp; support">
            <p>
              Admin access to submission data is granted manually by the BactoAI team. Sign up at{" "}
              <code className="font-mono text-foreground">/auth</code>, then email{" "}
              <a
                href="mailto:bactoai01@gmail.com?subject=BactoAI%20MCP%20admin%20access"
                className="font-semibold text-primary hover:underline"
              >
                bactoai01@gmail.com
              </a>{" "}
              with the address you registered and we will attach the admin role.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
