// / note: Match the HTML revision so cached pages use the same validated release model.
import {RELEASES_URL,availableRelease,officialRelease} from './public-model.mjs?v=2026101002';
// / note: This published snapshot is verified against the signed APK; refresh it after a release replacement.
import {PUBLISHED_RELEASES} from './release-info.mjs?v=2026101002';

const el = (id) => document.getElementById(id);
async function json(url) {
  const response = await fetch(url, {signal: AbortSignal.timeout(8000)});
  if (!response.ok) throw new Error('Information is unavailable.');
  return response.json();
}

// / note: Render only validator-approved APKs and keep the button visible while an update check runs.
function renderRelease(release, detail) {
  if (!release) {
    el('release-label').textContent = 'Release download coming soon';
    el('release-detail').textContent = detail;
    el('apk-download').hidden = true;
    el('release-size').textContent = '';
    return;
  }
  el('release-label').textContent = release.name;
  el('release-detail').textContent = detail;
  el('apk-download').href = release.url;
  el('apk-download').hidden = false;
  el('release-size').textContent = release.size > 0 ? `${(release.size / 1024 / 1024).toFixed(1)} MB · Android APK` : 'Android APK';
}

function publishedDetail(release) {
  const date = new Date(release.date).toLocaleDateString('en-KE', {day: 'numeric', month: 'long', year: 'numeric'});
  return `Official release published ${date}.`;
}

// / note: A validated local snapshot is immediately usable while GitHub's bounded request runs.
const fallbackRelease = officialRelease(PUBLISHED_RELEASES);
let currentRelease = fallbackRelease;
renderRelease(currentRelease, currentRelease ? `${publishedDetail(currentRelease)} Checking for a newer release…` : 'Checking availability of the signed Vendora APK.');
el('retry-release').hidden = !currentRelease;

async function loadRelease() {
  el('retry-release').hidden = !currentRelease;
  if (currentRelease) renderRelease(currentRelease, `${publishedDetail(currentRelease)} Checking for a newer release…`);
  else renderRelease(null, 'Checking availability of the signed Vendora APK.');
  try {
    const release = availableRelease(await json(RELEASES_URL), PUBLISHED_RELEASES);
    if (!release) {
      currentRelease = null;
      renderRelease(null, 'The download section is ready. A signed Vendora APK will appear here when an official stable release is published.');
      // / note: Keep manual retry available when GitHub has no qualifying stable release.
      el('retry-release').hidden = false;
      return;
    }
    currentRelease = release;
    renderRelease(release, publishedDetail(release));
    el('retry-release').hidden = false;
  } catch {
    if (currentRelease) {
      renderRelease(currentRelease, `${publishedDetail(currentRelease)} We could not check whether a newer release is available. Try again later.`);
      el('retry-release').hidden = false;
    } else {
      // / note: Recovery stays on Vendora; never direct customers to a repository or release page.
      renderRelease(null, 'We could not check the download right now. Try again or contact support.');
      el('retry-release').hidden = false;
    }
  }
}

el('year').textContent = String(new Date().getFullYear());
el('retry-release').addEventListener('click', loadRelease);
// / note: The public site reads release metadata only; merchant and package configuration remain private.
loadRelease();
