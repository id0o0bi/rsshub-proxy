// src/index.js

export default {
  async fetch(request, env, ctx) {
    // 1. Choose the upstream RSSHub instance
    const UPSTREAM_URL = "https://rsshub.app"; // change this if you use a different instance

    // 2. Build the target URL: keep the path & query from the original request
    const incomingUrl = new URL(request.url);
    const targetUrl = new URL(incomingUrl.pathname + incomingUrl.search, UPSTREAM_URL);

    // 3. Forward the request
    const upstreamResponse = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      redirect: "follow",
    });

    // 4. Optional: add CORS header so RSS readers/web apps can fetch from anywhere
    const headers = new Headers(upstreamResponse.headers);
    headers.set("Access-Control-Allow-Origin", "*");

    // 5. Return the upstream response
    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers,
    });
  },
};