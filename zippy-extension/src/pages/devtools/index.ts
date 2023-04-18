try {
  chrome.devtools.panels.create(
    "Dev Tools",
    "icon.png",
    "src/pages/panel/index.html"
  );
} catch (e) {
  console.error(e);
}
