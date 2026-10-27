import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { handleAssistantChat, handleGenerateImage } from "./lib/gemini-server";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/chat" && request.method === "POST") {
        try {
          const body = (await request.json()) as {
            messages?: { role: "user" | "assistant"; content: string }[];
            contextPath?: string;
          };
          const messages = body.messages || [];
          const result = await handleAssistantChat(messages, body.contextPath);
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        } catch (apiErr) {
          console.error("API /api/chat error:", apiErr);
          return new Response(JSON.stringify({ error: "Failed to process chat message" }), {
            status: 500,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }
      }

      if (url.pathname === "/api/generate-image" && request.method === "POST") {
        try {
          const body = (await request.json()) as {
            prompt?: string;
            negativePrompt?: string;
            style?: string;
            styleDescriptor?: string;
            aspectRatio?: string;
            lighting?: string;
            seed?: number;
          };
          const result = await handleGenerateImage({
            prompt: body.prompt || "Futuristic neon concept art",
            negativePrompt: body.negativePrompt,
            style: body.style,
            styleDescriptor: body.styleDescriptor,
            aspectRatio: body.aspectRatio,
            lighting: body.lighting,
            seed: body.seed,
          });
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        } catch (imgErr) {
          console.error("API /api/generate-image error:", imgErr);
          return new Response(JSON.stringify({ error: "Failed to generate image" }), {
            status: 500,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
