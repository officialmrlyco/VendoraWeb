import {RELEASES_URL,documentData,validPlans,validSubscription,officialRelease} from './public-model.mjs';
const money = new Intl.NumberFormat('en-KE',{maximumFractionDigits:0});
const el = (id) => document.getElementById(id);
const node = (tag,text,className) => { const item = document.createElement(tag); item.textContent=text; if(className)item.className=className; return item; };
async function json(url) { const response=await fetch(url,{signal:AbortSignal.timeout(8000)}); if(!response.ok)throw new Error('Information is unavailable.'); return response.json(); }
// Each catalog section fails independently, so one unavailable document does not hide the other.
async function loadPackages() {
  const base='https://firestore.googleapis.com/v1/projects/vendora-lyco/databases/(default)/documents/vendora_prices/';
  await Promise.allSettled([
    (async()=>{ try { const plans=validPlans(documentData(await json(base+'units'))); if(!plans.length)throw new Error(); const cards=plans.map(p=>{ const card=node('article','','package-card'); card.append(node('h3',p.label),node('strong','KES '+money.format(p.amount),'package-amount'),node('p',p.type==='RUNS'?`${money.format(p.runs)} runs`:p.duration===0?'Unlimited time package':`${money.format(p.duration)} hours`),node('p','Purchase in the Vendora app')); return card; }); el('unit-packages').replaceChildren(...cards); } catch { el('unit-packages').replaceChildren(node('p','Current packages could not be loaded. Open Vendora for available packages.','quiet')); } })(),
    (async()=>{ try { const plan=validSubscription(documentData(await json(base+'online_subs'))); if(!plan)throw new Error(); const group=node('div',''); group.append(node('h3','Monthly website service'),node('p',plan.active?`Available in the app · Hold up to ${plan.limit} subscription months`:'Subscriptions are not open for purchase yet'),node('p','Domain renewal remains with you.')); el('website-price').replaceChildren(group,node('strong',`KES ${money.format(plan.price)} / month`)); } catch { el('website-price').replaceChildren(node('h3','Monthly website service'),node('p','Availability could not be checked. Contact support for website setup.')); } })(),
  ]);
}
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
loadPackages();loadRelease();
