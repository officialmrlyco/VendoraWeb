// Match the HTML asset revision so a cached old module cannot reintroduce public price reads.
import {RELEASES_URL,officialRelease} from './public-model.mjs?v=20261007';
const el = (id) => document.getElementById(id);
async function json(url) { const response=await fetch(url,{signal:AbortSignal.timeout(8000)}); if(!response.ok)throw new Error('Information is unavailable.'); return response.json(); }
// A release failure keeps a useful support/release link, never a guessed or debug APK.
async function loadRelease() {
  el('retry-release').hidden=true; el('apk-download').hidden=true; el('release-size').textContent='';
  el('release-label').textContent='Checking official releases…';
  try {
    const release=officialRelease(await json(RELEASES_URL));
    if(!release){el('release-label').textContent='Release download coming soon';el('release-detail').textContent='The download section is ready. A signed Vendora APK will appear here when an official release is published.';return;}
    el('release-label').textContent=release.name;
    el('release-detail').textContent='Official release published '+new Date(release.date).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'})+'.';
    el('apk-download').href=release.url;el('apk-download').hidden=false;
    el('release-size').textContent=release.size>0?`${(release.size/1024/1024).toFixed(1)} MB · Android APK`: 'Android APK';
  } catch {el('release-label').textContent='Release check unavailable';el('release-detail').textContent='We could not check releases right now. Try again or open the official release page below.';el('retry-release').hidden=false;}
}
el('year').textContent=String(new Date().getFullYear());
el('retry-release').addEventListener('click',loadRelease);
// Keep the public site independent of private merchant and package configuration.
loadRelease();
