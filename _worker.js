export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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

    // ✅ Sert les assets statiques normalement
    return env.ASSETS.fetch(request);
  },
};
