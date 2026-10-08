import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {officialRelease} from './public-model.mjs';

const release=(url,name='vendora.apk',extra={})=>({name:'Vendora',published_at:'2026-10-07T10:00:00Z',assets:[{name,browser_download_url:url,size:123}],...extra});
test('APK links must belong to the exact official repo and be stable signed releases',()=>{
  const url='https://github.com/officialmrlyco/VendoraWeb/releases/download/v1/vendora.apk';
  assert.equal(officialRelease([release(url)]).url,url);
  for(const r of [release('javascript:alert(1)'),release('https://github.com/another/repo/releases/download/v1/a.apk'),release(url,'app-debug.apk'),release(url,'vendora.apk',{prerelease:true}),release(url,'vendora.apk',{draft:true})])assert.equal(officialRelease([r]),null);
  assert.equal(officialRelease([]),null);
  assert.throws(()=>officialRelease({}));
});

test('public pages keep prices private and preserve the requested structure and legal disclosures',async()=>{
  const [app,home,readme,terms,policy,legacy,styles]=await Promise.all(['app.mjs','index.html','README.md','terms/index.html','policy/index.html','privacy.html','styles.css'].map(path=>readFile(new URL(path,import.meta.url),'utf8')));
  assert.doesNotMatch(app,/firestore\.googleapis\.com|vendora_prices|validPlans|validSubscription/);
  assert.doesNotMatch(home,/\bKES\s*\d|id="pricing"|id="unit-packages"|id="website-price"/);
  assert.doesNotMatch(readme,/Public package prices are read|vendora_prices/);
  assert.doesNotMatch(home,/hero-visual|workflow-card|orbit-one/);
  const quickLinks=home.match(/<nav class="quick-links"[\s\S]*?<\/nav>/)?.[0]||'';
  assert.equal((quickLinks.match(/<a href=/g)||[]).length,6);
  for(const destination of ['#how-it-works','#features','#help','#download','#contact','/policy'])assert.ok(quickLinks.includes(`href="${destination}"`));
  assert.match(quickLinks,/Getting started[\s\S]*Features[\s\S]*FAQ[\s\S]*Downloads[\s\S]*Support[\s\S]*Privacy/);
  assert.match(styles,/\.quick-links a\{[^}]*border-radius:13px/);
  assert.match(styles,/\.feature-grid\{[^}]*grid-template-columns:repeat\(3/);
  assert.match(styles,/@media\(max-width:1000px\)[\s\S]*\.feature-grid\{grid-template-columns:repeat\(2/);
  assert.match(styles,/@media\(max-width:700px\)[\s\S]*\.feature-grid\{grid-template-columns:1fr/);
  for(const page of [home,terms,policy]) {
    assert.match(page,/©[\s\S]*Vendora/);
    assert.match(page,/href="https:\/\/lycotechnologies\.co\.ke"[^>]*>Lyco Technologies/);
  }
  assert.match(policy,/installation identifier[\s\S]*session version[\s\S]*build number/);
  // Different disclosure wording must still identify both payer and recipient.
  assert.match(policy,/payer phone[\s\S]*recipient/);
  assert.match(policy,/server-only records[\s\S]*eTop production adapter is currently disabled/);
  assert.match(policy,/Firebase(?:\/Google| and Google)[\s\S]*Cloudflare[\s\S]*Safaricom[\s\S]*Daraja/);
  // Accept a deployment revision while requiring the legacy page to retain its stylesheet and redirect.
  assert.match(legacy,/stylesheet" href="\.\/styles\.css(?:\?v=\d+)?"[\s\S]*location\.replace\('\/policy\/?'\)/);
});
