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

  loadOptions();
  $("#submit-save").click(saveOptions);
  $("#submit-default").click(resetOptions);
});
