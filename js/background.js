chrome.runtime.onMessage.addListener(function (request, sender, response) {
  if (request.message == "lgtm:update-favicon") {
    var count = request.count;

    var canvas = document.createElement("canvas");
    canvas.width  = 16;
    canvas.height = 16;

    var ctx = canvas.getContext("2d");
    var img = new Image();

    img.onload = function() {
      var fontColor = count > 0 ? "#6f6" : "#ff6";
      ctx.drawImage(img, 0, 0, 16, 16);
      ctx.fillStyle   = fontColor;
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "end";
      var sign = count > 0 ? "+" : "";
      ctx.fillText(sign + count.toString(), 15, 15);
      response({dataurl: canvas.toDataURL()});
    };
    img.src = chrome.extension.getURL("res/favicon.png");
    return true;
  }
});
