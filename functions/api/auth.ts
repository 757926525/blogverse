// Cloudflare Pages Functions - /api/auth
// Validates administrator login against the environment PASSWORD.

interface Env {
  PASSWORD?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const { password } = await request.json() as { password?: string };
    const expected = env.PASSWORD || "123456";

    if (password === expected) {
      return new Response(
        JSON.stringify({ ok: true, message: "Authentication successful" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: false, error: "密码错误" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
