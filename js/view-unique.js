window.registerView("js/view-unique.js", function (content, targetDiv) {
  "use strict";

  var lines = content.split(/\r\n|\r|\n/);
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  var seen = {};
  var duplicateSet = {};
  var lxCount = 0;

  for (var i = 0; i < lines.length; i++) {
    var match = lines[i].match(/^\\lx\s+(.+)/);
    if (!match) continue;
    lxCount++;
    var val = match[1];
    if (seen[val] !== undefined) {
      if (!duplicateSet[val]) {
        duplicateSet[val] = [seen[val], i + 1];
      } else {
        duplicateSet[val].push(i + 1);
      }
    } else {
      seen[val] = i + 1;
    }
  }

  var keys = Object.keys(duplicateSet);

  if (keys.length === 0) {
    targetDiv.innerHTML = '<p style="color:green;">All ' + lxCount +
      " \\lx entries are unique.</p>";
    return;
  }

  var html = '<p style="color:red;">Found ' + keys.length +
    " duplicate \\lx value(s):</p><ul>";
  for (var j = 0; j < keys.length; j++) {
    var val = keys[j];
    var nums = duplicateSet[val];
    html += "<li><strong>" + escapeHtml(val) + "</strong> — lines " +
      nums.join(", ") + "</li>";
  }
  html += "</ul><p>Total \\lx entries: " + lxCount + "</p>";
  targetDiv.innerHTML = html;
});

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
