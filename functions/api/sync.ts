// Cloudflare Pages Functions - /api/sync
// Supports synchronizing articles and settings using D1 database (priority) or KV storage.

interface Env {
  DB?: any;
  KV?: any;
  PASSWORD?: string;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;

  try {
    // 1. Try Cloudflare D1
    if (env.DB) {
      const articlesRes = await env.DB.prepare(
        "SELECT id, title, topic, excerpt, data_json as dataJson FROM articles ORDER BY updated_at DESC"
      ).all();

      const articles: any[] = [];
      for (const row of articlesRes.results || []) {
        try {
          const parsed = JSON.parse(row.dataJson);
          articles.push({
            ...parsed,
            id: row.id,
            title: row.title,
            topic: row.topic,
            excerpt: row.excerpt,
          });
        } catch {
          // Fallback if dataJson is corrupted
          articles.push({
            id: row.id,
            title: row.title,
            topic: row.topic,
            excerpt: row.excerpt,
            published: "刚刚",
            duration: "3 分钟",
            readMinutes: 3,
            likes: 0,
            coverIndex: "01",
            author: { name: "作者", role: "作者", initials: "作" },
            accent: "#18212F",
            accentSoft: "#EAECEF",
            sections: [{ heading: "正文", paragraphs: [row.excerpt] }],
          });
        }
      }

      const configRes = await env.DB.prepare(
        "SELECT key, value FROM site_config"
      ).all();

      const config: Record<string, any> = {};
      for (const row of configRes.results || []) {
        try {
          config[row.key] = JSON.parse(row.value);
        } catch {
          config[row.key] = row.value;
        }
      }

      return new Response(
        JSON.stringify({ ok: true, source: "d1", articles, config }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Try Cloudflare KV fallback
    if (env.KV) {
      const storedArticles = await env.KV.get("blog:articles", "json");
      const storedConfig = await env.KV.get("blog:config", "json");

      return new Response(
        JSON.stringify({
          ok: true,
          source: "kv",
          articles: storedArticles || null,
          config: storedConfig || null,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Neither bound
    return new Response(
      JSON.stringify({
        ok: true,
        source: "local",
        message: "D1 or KV is not bound yet in Cloudflare Pages dashboard.",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

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

    const payload = (await request.json()) as {
      articles?: any[];
      config?: Record<string, any>;
    };

    const now = Date.now();

    // 1. Sync to D1
    if (env.DB) {
      if (Array.isArray(payload.articles)) {
        for (const art of payload.articles) {
          const id = art.id || `article-${now}`;
          const title = art.title || "无标题";
          const topic = art.topic || "生活";
          const excerpt = art.excerpt || "";
          const dataJson = JSON.stringify(art);

          await env.DB.prepare(
            `INSERT INTO articles (id, title, topic, excerpt, data_json, updated_at)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               title=excluded.title,
               topic=excluded.topic,
               excerpt=excluded.excerpt,
               data_json=excluded.data_json,
               updated_at=excluded.updated_at`
          )
            .bind(id, title, topic, excerpt, dataJson, now)
            .run();
        }
      }

      if (payload.config) {
        for (const [k, v] of Object.entries(payload.config)) {
          await env.DB.prepare(
            `INSERT INTO site_config (key, value, updated_at)
             VALUES (?, ?, ?)
             ON CONFLICT(key) DO UPDATE SET
               value=excluded.value,
               updated_at=excluded.updated_at`
          )
            .bind(k, JSON.stringify(v), now)
            .run();
        }
      }

      return new Response(
        JSON.stringify({ ok: true, syncedTo: "d1", timestamp: now }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Sync to KV
    if (env.KV) {
      if (payload.articles) {
        await env.KV.put("blog:articles", JSON.stringify(payload.articles));
      }
      if (payload.config) {
        await env.KV.put("blog:config", JSON.stringify(payload.config));
      }
      return new Response(
        JSON.stringify({ ok: true, syncedTo: "kv", timestamp: now }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: false,
        error: "No D1 or KV storage bound. Please bind DB or KV in Cloudflare Pages Settings.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
