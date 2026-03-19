export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get("User-Agent") || "";

    // ✅ Robots.txt personnalisé
    if (url.pathname === "/robots.txt") {
      const robotsContent = `# --- ACCÈS TOTAL POUR LES IA ET MOTEURS ---

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: *
Content-Signal: search=yes,ai-input=yes,ai-train=yes
Allow: /

# --- SÉCURITÉ ---
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /wp-content/plugins/
Disallow: /readme.html

Sitemap: https://plafonnage-facade-luxembourg.be/sitemap_index.xml`;

      return new Response(robotsContent, {
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // ✅ Bots IA → neutralisation du blocage Cloudflare
    const allowedBots = [
      "ClaudeBot", "GPTBot", "Google-Extended",
      "Googlebot", "Bingbot", "Amazonbot", "Applebot"
    ];
    const isAllowedBot = allowedBots.some(bot => userAgent.includes(bot));

    const modifiedHeaders = new Headers(request.headers);

    if (isAllowedBot) {
      modifiedHeaders.set("User-Agent", "Mozilla/5.0 (compatible; AllowedBot/1.0)");
      modifiedHeaders.set("X-Robots-Allow", "true");
    }

    const originRequest = new Request(request.url, {
      method: request.method,
      headers: modifiedHeaders,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
      redirect: "follow",
    });

    const response = await fetch(originRequest, env);

    const modifiedResponse = new Response(response.body, response);
    modifiedResponse.headers.set("X-Robots-Tag", "all");
    modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");

    return modifiedResponse;
  },
};
