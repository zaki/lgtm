$(document).on("pjax:end", function() {
  window.postMessage({ action: "lgtm:refresh" }, "*");
});

$( document ).ajaxComplete(function() {
    window.postMessage({ action: "lgtm:refresh" }, "*");
})