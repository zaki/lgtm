$(function() {
  var defaultOptions = {
    "positive-keywords": ":+1:\nlgtm\n:thumbsup:",
    "negative-keywords": ":-1:\n:thumbsdown:",

    "disable-merge": false,
    "disable-merge-threshold": 2,

    "disable-wip": false,
    "disable-wip-keywords": "wip\ndo not merge",

    "change-favicon": true
  }

  function loadOptions() {
    chrome.storage.sync.get(null, function(items) {
      for (var property in defaultOptions) {
          if (items[property] == null) { items[property] = defaultOptions[property]; }
      }

      $("#positive-keywords").val(items["positive-keywords"]);
      $("#negative-keywords").val(items["negative-keywords"]);
      $("#disable-merge-threshold").val(items["disable-merge-threshold"]);
      $("#disable-merge").prop("checked", items["disable-merge"]);

      $("#disable-wip").prop("checked", items["disable-wip"]);
      $("#disable-wip-keywords").val(items["disable-wip-keywords"]);

      $("#change-favicon").prop("checked", items["change-favicon"]);
    });
  }

  function saveOptions() {
    chrome.storage.sync.set({
      "positive-keywords": $("#positive-keywords").val(),
      "negative-keywords": $("#negative-keywords").val(),

      "disable-merge": $("#disable-merge").prop("checked"),
      "disable-merge-threshold": $("#disable-merge-threshold").val(),

      "disable-wip": $("#disable-wip").prop("checked"),
      "disable-wip-keywords": $("#disable-wip-keywords").val(),

      "change-favicon": $("#change-favicon").prop("checked")
    });
  }

  function resetOptions() {
    chrome.storage.sync.set(defaultOptions);
    loadOptions();
  }

  function localize(selector, property, message) {
    document.querySelector(selector)[property] = chrome.i18n.getMessage(message);
  }

  function loadI18N() {
    localize("title", "innerText", "optionsTitle");
    localize("#lgtm-options", "innerText", "optionsTitle");
    localize("#keywords-tab", "innerText", "keywordsTab");
    localize("#merge-tab", "innerText", "mergeTab");
    localize("#extras-tab", "innerText", "extrasTab");
    localize("#about-tab", "innerText", "aboutTab");

    localize("#positive-keywords-label", "innerText", "positiveKeywords");
    localize("#positive-keywords-help", "innerHTML", "positiveKeywordsHelp");

    localize("#negative-keywords-label", "innerText", "negativeKeywords");
    localize("#negative-keywords-help", "innerHTML", "negativeKeywordsHelp");

    localize("#disable-merge-label", "innerText", "disableMerge");
    localize("#disable-merge-help", "innerHTML", "disableMergeHelp");

    localize("#disable-merge-threshold-label", "innerText", "disableMergeThreshold");
    localize("#disable-merge-threshold-help", "innerHTML", "disableMergeThresholdHelp");

    localize("#disable-wip-label", "innerText", "disableWip");
    localize("#disable-wip-help", "innerHTML", "disableWipHelp");
    localize("#disable-wip-keywords-label", "innerText", "disableWipKeywords");
    localize("#disable-wip-keywords-help", "innerHTML", "disableWipKeywordsHelp");


    localize("#dynamic-favicon", "innerText", "dynamicFavicon");
    localize("#dynamic-favicon-help", "innerHTML", "dynamicFaviconHelp");

    localize("#submit-save", "innerText", "save");
    localize("#submit-default", "innerText", "reset");
  }

  loadOptions();
  loadI18N();
  $("#submit-save").click(saveOptions);
  $("#submit-default").click(resetOptions);
});
