import { useEffect } from "preact/hooks";

function sync() {
  const now = Date.now(); // number (ms since epoch)
  const lastSyncRaw = localStorage.getItem("last_full_sync");

  const ONE_HOUR_MS = 60 * 60 * 1000;

  const shouldSync =
    lastSyncRaw === null || now - Number(lastSyncRaw) > ONE_HOUR_MS;

  if (shouldSync) {
    console.log("Sync");
    fetch("/api/sync-all").catch((err) => {
      console.error("Sync failed:", err);
    });

    localStorage.setItem("last_full_sync", String(now));
  } else {
    const minutes = (now - Number(lastSyncRaw)) / (60 * 1000);
    console.log(`${minutes} minutes since last sync`);
  }
}
/**
 * Kicks off full sync.
 * Uses local storage to know if we have done so within the last hour.
 */
export default function () {
  useEffect(() => {
    sync();
  }, []);
  return null;
}
