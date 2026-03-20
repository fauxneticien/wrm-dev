(function () {
  "use strict";

  window.VIEW_REGISTRY = {};

  window.registerView = function (filename, renderFn) {
    window.VIEW_REGISTRY[filename] = renderFn;
  };

  var views = {
    "Check all items are unique": "js/view-unique.js"
  };

  var currentView = null;
  var currentFileContent = null;

  function runCurrentView() {
    var leftPane = document.getElementById("left-pane");
    if (!currentView || currentFileContent === null) return;

    var renderFn = window.VIEW_REGISTRY[currentView];
    if (!renderFn) {
      leftPane.innerHTML = "<p>View not loaded: " + currentView + "</p>";
      return;
    }

    var savedScroll = leftPane.scrollTop;
    leftPane.innerHTML = "";
    renderFn(currentFileContent, leftPane);
    leftPane.scrollTop = savedScroll;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var viewButtons = document.getElementById("view-buttons");
    var dropZone = document.getElementById("drop-zone");

    // Generate view buttons
    Object.keys(views).forEach(function (name) {
      var btn = document.createElement("button");
      btn.textContent = name;
      btn.addEventListener("click", function () {
        currentView = views[name];
        // Update active state
        var all = viewButtons.querySelectorAll("button");
        for (var i = 0; i < all.length; i++) all[i].classList.remove("active");
        btn.classList.add("active");
        runCurrentView();
      });
      viewButtons.appendChild(btn);
    });

    // Prevent browser from opening dropped files
    document.body.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    document.body.addEventListener("drop", function (e) {
      e.preventDefault();
    });

    // Drop zone events
    dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    dropZone.addEventListener("dragenter", function (e) {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", function () {
      dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("drag-over");

      var file = e.dataTransfer.files[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function (ev) {
        currentFileContent = ev.target.result;
        runCurrentView();
      };
      reader.readAsText(file);
    });
  });
})();
