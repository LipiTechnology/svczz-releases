const RELEASE_API = "https://api.github.com/repos/LipiTechnology/svczz-releases/releases/latest";
const RELEASES_URL = "https://github.com/LipiTechnology/svczz-releases/releases/latest";

const downloadButton = document.querySelector("#download-button");
const downloadStatus = document.querySelector("#download-status");
const releaseDetails = document.querySelector("#release-details");
const releaseVersion = document.querySelector("#release-version");
const releaseDate = document.querySelector("#release-date");
const apkSize = document.querySelector("#apk-size");
const releaseNotes = document.querySelector("#release-notes");
const apkShaRow = document.querySelector("#apk-sha-row");
const apkSha = document.querySelector("#apk-sha");

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "—";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

function hashPattern() {
  return "(?:[a-f0-9]{64}|(?:[a-f0-9]{2}[:-]){31}[a-f0-9]{2})";
}

function normalizeHash(value) {
  return value.replace(/[:-]/g, "").toUpperCase();
}

function findApkSha256(body, shaAsset) {
  const pattern = hashPattern();
  const labeledHash = new RegExp(
    `(?:apk[\\s_-]*)?(?:sha[\\s-]*256|checksum)[^\\n\\r]*?(${pattern})`,
    "i",
  );
  const notesMatch = labeledHash.exec(body);

  if (notesMatch) {
    return normalizeHash(notesMatch[1]);
  }

  const assetName = shaAsset && typeof shaAsset.name === "string" ? shaAsset.name : "";
  const assetMatch = new RegExp(pattern, "i").exec(assetName);

  return assetMatch ? normalizeHash(assetMatch[0]) : "";
}

function setStatus(message, isError = false) {
  downloadStatus.textContent = message;
  downloadStatus.classList.toggle("is-error", isError);
}

async function loadLatestRelease() {
  try {
    const response = await fetch(RELEASE_API, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const release = await response.json();
    const assets = Array.isArray(release.assets) ? release.assets : [];
    const apkAsset = assets.find(
      (asset) => typeof asset.name === "string" && asset.name.toLowerCase().endsWith(".apk"),
    );

    if (!apkAsset || typeof apkAsset.browser_download_url !== "string") {
      throw new Error("Latest release has no APK asset");
    }

    const shaAsset = assets.find(
      (asset) => typeof asset.name === "string" && asset.name.toLowerCase().endsWith(".sha256"),
    );
    const version = release.tag_name || release.name || "Latest release";
    const notes = typeof release.body === "string" && release.body.trim()
      ? release.body
      : "No release notes for this version.";

    downloadButton.href = apkAsset.browser_download_url;
    releaseVersion.textContent = version;
    releaseDate.textContent = formatDate(release.published_at || release.created_at);
    apkSize.textContent = formatBytes(apkAsset.size);
    releaseNotes.textContent = notes;
    releaseDetails.hidden = false;

    const sha = findApkSha256(notes, shaAsset);
    if (sha) {
      apkSha.textContent = sha;
      apkShaRow.hidden = false;
    }

    setStatus(`Ready: ${apkAsset.name}`);
  } catch (error) {
    downloadButton.href = RELEASES_URL;
    setStatus("Release details could not load. The button still opens the latest GitHub release.", true);
  }
}

loadLatestRelease();
