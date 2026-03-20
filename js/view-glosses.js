window.registerView("js/view-glosses.js", function (content, targetDiv) {
  "use strict";

  var lines = content.split(/\r\n|\r|\n/);
  var entries = [];
  var current = null;

  for (var i = 0; i < lines.length; i++) {
    var lxMatch = lines[i].match(/^\\lx\s+(.*)/);
    if (lxMatch) {
      if (current) entries.push(current);
      current = { lx: lxMatch[1], glosses: [] };
      continue;
    }
    var geMatch = lines[i].match(/^\s*\\ge\s+(.*)/);
    if (geMatch && current) {
      current.glosses.push(geMatch[1]);
    }
  }
  if (current) entries.push(current);

  var html = "<table><thead><tr><th>lx</th><th>ge</th></tr></thead><tbody>";
  for (var j = 0; j < entries.length; j++) {
    var e = entries[j];
    var ge;
    if (e.glosses.length > 0) {
      var joined = e.glosses.join(", ");
      ge = escapeHtml(joined);
      if (joined.indexOf("?") !== -1) {
        ge += " \u26A0\uFE0F";
      }
    } else {
      ge = "\u274C";
    }
    html += "<tr><td>" + escapeHtml(e.lx) + "</td><td>" + ge + "</td></tr>";
  }
  html += "</tbody></table>";
  targetDiv.innerHTML = html;
});

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
