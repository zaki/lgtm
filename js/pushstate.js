$(document).on("pjax:end", function() {
  window.postMessage({ action: "lgtm:refresh" }, "*");
});

