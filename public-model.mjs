// Public release metadata is the only remote product data shown on this site.
export const RELEASES_URL = 'https://api.github.com/repos/officialmrlyco/VendoraWeb/releases?per_page=10';

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
