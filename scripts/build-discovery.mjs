import { readFile, writeFile } from 'node:fs/promises';

// / note: The visible homepage is the source of truth; no separate hidden FAQ copy or runtime request.
const root = new URL('../', import.meta.url);
const pageUrl = new URL('index.html', root);
let home = await readFile(pageUrl, 'utf8');
const faq = home.match(/<section id="help"[\s\S]*?<\/section>/)?.[0];
if (!faq) throw new Error('Homepage FAQ section is missing');
const text = (html) => html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const questions = [...faq.matchAll(/<details\b[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)]
  .map(([, question, answer]) => ({ '@type': 'Question', name: text(question),
    acceptedAnswer: { '@type': 'Answer', text: text(answer) } }));
// / note: Fail the build on unsupported answer markup rather than silently publishing incomplete schema.
if (!questions.length || questions.length !== (faq.match(/<details\b/g) || []).length) {
  throw new Error('Every FAQ must contain one summary and one answer paragraph');
}
const description = home.match(/<meta name="description" content="([^"]+)"/)?.[1];
if (!description) throw new Error('Homepage description is missing');
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://myvendora.co.ke/#website', name: 'Vendora',
      url: 'https://myvendora.co.ke/', description, inLanguage: 'en-KE' },
    { '@type': 'SoftwareApplication', '@id': 'https://myvendora.co.ke/#app', name: 'Vendora',
      url: 'https://myvendora.co.ke/', operatingSystem: 'Android', applicationCategory: 'BusinessApplication',
      description, image: 'https://myvendora.co.ke/assets/vendora-app-logo.png' },
    { '@type': 'FAQPage', '@id': 'https://myvendora.co.ke/#help', url: 'https://myvendora.co.ke/#help',
      isPartOf: { '@id': 'https://myvendora.co.ke/#website' }, inLanguage: 'en-KE', mainEntity: questions },
  ],
};
// / note: Escape script delimiters even though all inputs are repository-owned static text.
const json = JSON.stringify(schema, null, 2).replace(/</g, '\\u003c');
const marked = /<!-- discovery:start -->[\s\S]*?<!-- discovery:end -->/;
if (!marked.test(home)) throw new Error('Homepage structured-data markers are missing');
home = home.replace(marked, `<!-- discovery:start -->\n  <!-- / note: Generated from visible FAQ by npm run build:discovery; no invented ratings or prices. -->\n  <script type="application/ld+json">\n${json}\n  </script>\n  <!-- discovery:end -->`);
await writeFile(pageUrl, home);

// / note: Reuse the exact approved 192px launcher image. ICO only wraps PNG bytes; artwork is unchanged.
const png = await readFile(new URL('assets/favicon.png', root));
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width !== 192 || height !== 192) throw new Error('Approved favicon must remain square at 192px');
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); // ICO file type.
header.writeUInt16LE(1, 4); // One embedded PNG image.
header[6] = width;
header[7] = height;
header.writeUInt16LE(1, 10); // Color planes.
header.writeUInt16LE(32, 12); // RGBA pixels.
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18); // Image offset after directory entry.
await writeFile(new URL('favicon.png', root), png);
await writeFile(new URL('favicon.ico', root), Buffer.concat([header, png]));
console.log(`Prepared favicon files and structured data for ${questions.length} visible FAQs.`);
