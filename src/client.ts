import "../assets/styles.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").then(() => {
    console.log("Service worker registered");
  });
} else {
  console.error("Client doesn't support Service Workers!");
}
