import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("produces a Vercel-ready static build", async () => {
  await access(new URL("../dist/index.html", import.meta.url));
  await access(new URL("../dist/assets/", import.meta.url));
  await access(new URL("../dist/og.png", import.meta.url));

  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>MD to PDF - Tulis, lihat, simpan<\/title>/i);
  assert.match(html, /<div id="root"><\/div>/i);
  assert.match(html, /og\.png/i);
  assert.doesNotMatch(html, /chatgpt\.site|codex-preview|vinext/i);
});

test("keeps document processing local-first", async () => {
  const source = await readFile(
    new URL("../src/MarkdownWorkspace.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /window\.localStorage/);
  assert.match(source, /file\.text\(\)/);
  assert.match(source, /window\.print\(\)/);
  assert.match(source, /accept="\.md,\.markdown,text\/markdown,text\/plain"/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
});
