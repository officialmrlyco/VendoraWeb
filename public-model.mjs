// The public site reads only catalog documents and official stable release metadata.
export const RELEASES_URL = 'https://api.github.com/repos/officialmrlyco/VendoraWeb/releases?per_page=10';
export function firestoreValue(value) {
  if (!value || typeof value !== 'object') return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value || 'doubleValue' in value) return Number(value.integerValue ?? value.doubleValue);
  if ('booleanValue' in value) return value.booleanValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(firestoreValue);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key,item]) => [key,firestoreValue(item)]));
  return null;
}
export function documentData(document) { return firestoreValue({mapValue:{fields:document?.fields || {}}}); }
export function validPlans(data) {
  if (!Array.isArray(data?.plans)) return [];
  return data.plans.slice(0,50).filter(p => typeof p.label === 'string' && p.label.trim() && Number.isFinite(p.amount) && p.amount > 0 && ['RUNS','TIME'].includes(p.type)).map(p => ({label:p.label.slice(0,120),amount:p.amount,type:p.type,runs:Math.max(0,Number(p.runs)||0),duration:Math.max(0,Number(p.duration ?? p.durationHours)||0)}));
}
export function validSubscription(data) {
  if (!Number.isSafeInteger(data?.price) || data.price < 1 || !Number.isInteger(data?.limit) || data.limit < 1 || typeof data.active !== 'boolean') return null;
  return {price:data.price,limit:data.limit,active:data.active};
}
export function officialRelease(releases) {
  if (!Array.isArray(releases)) throw new Error('Release information is invalid.');
  // Ignore previews, drafts and debug builds; untrusted release URLs never enter href.
  const releasesSorted = releases.filter(r => !r.draft && !r.prerelease && Number.isFinite(Date.parse(r.published_at))).sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at));
  for (const release of releasesSorted) {
    const asset = (Array.isArray(release.assets) ? release.assets : []).find(a => {
      if (typeof a.name !== 'string' || !/\.apk$/i.test(a.name) || /debug/i.test(a.name)) return false;
      try { const url = new URL(a.browser_download_url); return url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password && url.pathname.startsWith('/officialmrlyco/VendoraWeb/releases/download/'); } catch { return false; }
    });
    if (asset) return {name:String(release.name || release.tag_name).slice(0,120),tag:String(release.tag_name || '').slice(0,60),date:release.published_at,url:asset.browser_download_url,size:Number(asset.size)||0};
  }
  return null;
}
