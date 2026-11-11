// Cloudflare Pages Functions - /api/upload
// Supports uploading images to Cloudflare R2 bucket.

interface Env {
  BUCKET?: any;
  PASSWORD?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const authHeader = request.headers.get("x-admin-password") || "";
    const expectedPassword = env.PASSWORD || "123456";

    if (authHeader !== expectedPassword) {
      return new Response(
        JSON.stringify({ ok: false, error: "Unauthorized: Invalid password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!env.BUCKET) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "R2 BUCKET is not bound. Please bind BUCKET in Cloudflare Pages Settings.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    // 1. JSON payload with base64 data URL
    if (contentType.includes("application/json")) {
      const { dataUrl, filename } = await request.json() as {
        dataUrl: string;
        filename?: string;
      };

      if (!dataUrl || !dataUrl.startsWith("data:")) {
        return new Response(
          JSON.stringify({ ok: false, error: "Invalid dataUrl format" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return new Response(
          JSON.stringify({ ok: false, error: "Unable to parse base64 data" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const mimeType = match[1];
      const base64Data = match[2];
      const binaryStr = atob(base64Data);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const ext = mimeType.split("/")[1] || "png";
      const key = `uploads/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

      await env.BUCKET.put(key, bytes, {
        httpMetadata: { contentType: mimeType },
      });

      return new Response(
        JSON.stringify({
          ok: true,
          key,
          url: `/api/upload?key=${encodeURIComponent(key)}`,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: false, error: "Unsupported content-type" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    if (!key || !env.BUCKET) {
      return new Response("Not found or R2 not bound", { status: 404 });
    }

    const object = await env.BUCKET.get(key);
    if (!object) {
      return new Response("Object not found in R2", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(object.body, { headers });
  } catch (err: any) {
    return new Response("Error fetching object: " + err?.message, { status: 500 });
  }
};
