import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Markdown workspace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>MD to PDF - Tulis, lihat, simpan<\/title>/i);
  assert.match(html, /Editor Markdown/);
  assert.match(html, /Unduh PDF/);
  assert.match(html, /Pengaturan/);
  assert.match(html, /Semua isi diproses di browser Anda/);
  assert.doesNotMatch(html, /codex-preview/);
  assert.doesNotMatch(html, /react-loading-skeleton/);
});

test("renders accessible and local-first defaults", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /accept="\.md,\.markdown,text\/markdown,text\/plain"/);
  assert.match(html, /aria-label="Editor Markdown"/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /Tersimpan di perangkat/);
  assert.doesNotMatch(html, /javascript:/i);
});
