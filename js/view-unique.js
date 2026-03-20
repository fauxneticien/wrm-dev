window.registerView("js/view-unique.js", function (content, targetDiv) {
  "use strict";

  var lines = content.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  var seen = {};
  var duplicateSet = {};

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (seen[line] !== undefined) {
      if (!duplicateSet[line]) {
        duplicateSet[line] = [seen[line], i + 1];
      } else {
        duplicateSet[line].push(i + 1);
      }
    } else {
      seen[line] = i + 1;
    }
  }

  var keys = Object.keys(duplicateSet);

  if (keys.length === 0) {
    targetDiv.innerHTML = '<p style="color:green;">All ' + lines.length +
      " items are unique.</p>";
    return;
  }

  var html = '<p style="color:red;">Found ' + keys.length +
    " duplicate value(s):</p><ul>";
  for (var j = 0; j < keys.length; j++) {
    var val = keys[j];
    var nums = duplicateSet[val];
    html += "<li><strong>" + escapeHtml(val) + "</strong> — lines " +
      nums.join(", ") + "</li>";
  }
  html += "</ul><p>Total lines: " + lines.length + "</p>";
  targetDiv.innerHTML = html;
});

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
