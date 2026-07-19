(function () {
  "use strict";

  var PRESETS_KEY = "promptToolkitPresets";

  /** state.selects: { groupId: optionKey }  |  state.checks: { groupId: [optionKey,...] } */
  var state = {
    selects: {},
    checks: {},
    topic: "",
    notes: "",
  };

  // ---------- lookups ----------

  function findGroup(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function findOption(group, key) {
    if (!group || !key) return null;
    for (var i = 0; i < group.options.length; i++) {
      if (group.options[i].key === key) return group.options[i];
    }
    return null;
  }

  // ---------- rendering: static structure ----------

  function renderHeader() {
    document.getElementById("page-title").textContent = PROMPT_DATA.meta.title;
    document.title = PROMPT_DATA.meta.title;
    document.getElementById("page-subtitle").textContent = PROMPT_DATA.meta.subtitle;
  }

  function renderSelectGroups() {
    var container = document.getElementById("select-groups");
    container.innerHTML = "";

    PROMPT_DATA.selectGroups.forEach(function (group) {
      state.selects[group.id] = "";

      var wrap = document.createElement("div");
      wrap.className = "select-group";

      var heading = document.createElement("h3");
      heading.textContent = group.label;
      wrap.appendChild(heading);

      var help = document.createElement("p");
      help.className = "help-text";
      help.textContent = group.help;
      wrap.appendChild(help);

      var select = document.createElement("select");
      select.id = "select-" + group.id;
      select.dataset.groupId = group.id;

      var placeholderOpt = document.createElement("option");
      placeholderOpt.value = "";
      placeholderOpt.textContent = group.placeholder;
      select.appendChild(placeholderOpt);

      group.options.forEach(function (opt) {
        var o = document.createElement("option");
        o.value = opt.key;
        o.textContent = opt.label;
        select.appendChild(o);
      });

      var preview = document.createElement("div");
      preview.className = "preview-snippet";
      preview.id = "preview-" + group.id;
      preview.textContent = "";

      select.addEventListener("change", function () {
        state.selects[group.id] = select.value;
        var opt = findOption(group, select.value);
        preview.textContent = opt ? opt.text : "";
        updateOutput();
      });

      wrap.appendChild(select);
      wrap.appendChild(preview);
      container.appendChild(wrap);
    });
  }

  function renderCheckGroups() {
    var card = document.getElementById("constraints-card");
    card.innerHTML = "";

    PROMPT_DATA.checkGroups.forEach(function (group) {
      state.checks[group.id] = [];

      var heading = document.createElement("h2");
      heading.textContent = group.label;
      card.appendChild(heading);

      var help = document.createElement("p");
      help.className = "help-text";
      help.textContent = group.help;
      card.appendChild(help);

      var list = document.createElement("div");
      list.className = "checkbox-list";
      list.id = "checklist-" + group.id;

      group.options.forEach(function (opt) {
        var item = document.createElement("label");
        item.className = "checkbox-item";

        var input = document.createElement("input");
        input.type = "checkbox";
        input.value = opt.key;
        input.dataset.groupId = group.id;

        input.addEventListener("change", function () {
          var arr = state.checks[group.id];
          var idx = arr.indexOf(opt.key);
          if (input.checked && idx === -1) arr.push(opt.key);
          if (!input.checked && idx !== -1) arr.splice(idx, 1);
          updateOutput();
        });

        var span = document.createElement("span");
        span.textContent = opt.label;

        item.appendChild(input);
        item.appendChild(span);
        list.appendChild(item);
      });

      card.appendChild(list);
    });
  }

  // ---------- prompt assembly (the rule engine) ----------

  function buildPrompt() {
    var lines = [];

    var roleGroup = findGroup(PROMPT_DATA.selectGroups, "role");
    var roleOpt = findOption(roleGroup, state.selects.role);
    if (roleOpt) lines.push(roleOpt.text);

    var taskGroup = findGroup(PROMPT_DATA.selectGroups, "task");
    var taskOpt = findOption(taskGroup, state.selects.task);
    if (taskOpt) {
      lines.push("Your task: " + taskOpt.label + ". " + taskOpt.text);
    }

    if (state.topic && state.topic.trim()) {
      lines.push("Topic / context: " + state.topic.trim());
    }

    var styleSentences = [];
    ["audience", "tone", "format", "length"].forEach(function (id) {
      var group = findGroup(PROMPT_DATA.selectGroups, id);
      var opt = findOption(group, state.selects[id]);
      if (opt) styleSentences.push(opt.text);
    });
    if (styleSentences.length) lines.push(styleSentences.join(" "));

    var constraintKeys = state.checks.constraints || [];
    if (constraintKeys.length) {
      var constraintsGroup = findGroup(PROMPT_DATA.checkGroups, "constraints");
      var reqLines = constraintKeys
        .map(function (key) {
          var opt = findOption(constraintsGroup, key);
          return opt ? "- " + opt.text : null;
        })
        .filter(Boolean);
      lines.push("Additional requirements:\n" + reqLines.join("\n"));
    }

    if (state.notes && state.notes.trim()) {
      lines.push(state.notes.trim());
    }

    return lines.join("\n\n");
  }

  function updateOutput() {
    var text = buildPrompt();
    var output = document.getElementById("output");
    output.value = text;

    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById("word-count").textContent =
      words + (words === 1 ? " word" : " words");
  }

  // ---------- free text inputs ----------

  function wireTextInputs() {
    var topicInput = document.getElementById("topic-input");
    var notesInput = document.getElementById("notes-input");

    topicInput.addEventListener("input", function () {
      state.topic = topicInput.value;
      updateOutput();
    });

    notesInput.addEventListener("input", function () {
      state.notes = notesInput.value;
      updateOutput();
    });
  }

  // ---------- UI sync (used by randomize / reset / load preset) ----------

  function syncUiFromState() {
    document.getElementById("topic-input").value = state.topic || "";
    document.getElementById("notes-input").value = state.notes || "";

    PROMPT_DATA.selectGroups.forEach(function (group) {
      var select = document.getElementById("select-" + group.id);
      var key = state.selects[group.id] || "";
      select.value = key;
      var preview = document.getElementById("preview-" + group.id);
      var opt = findOption(group, key);
      preview.textContent = opt ? opt.text : "";
    });

    PROMPT_DATA.checkGroups.forEach(function (group) {
      var selectedKeys = state.checks[group.id] || [];
      var list = document.getElementById("checklist-" + group.id);
      var inputs = list.querySelectorAll("input[type=checkbox]");
      inputs.forEach(function (input) {
        input.checked = selectedKeys.indexOf(input.value) !== -1;
      });
    });

    updateOutput();
  }

  // ---------- actions ----------

  function randomize() {
    PROMPT_DATA.selectGroups.forEach(function (group) {
      var includeChance = 0.85;
      if (Math.random() < includeChance) {
        var opt = group.options[Math.floor(Math.random() * group.options.length)];
        state.selects[group.id] = opt.key;
      } else {
        state.selects[group.id] = "";
      }
    });

    PROMPT_DATA.checkGroups.forEach(function (group) {
      var count = Math.floor(Math.random() * 4); // 0-3 constraints
      var pool = group.options.slice();
      var picked = [];
      for (var i = 0; i < count && pool.length; i++) {
        var idx = Math.floor(Math.random() * pool.length);
        picked.push(pool.splice(idx, 1)[0].key);
      }
      state.checks[group.id] = picked;
    });

    syncUiFromState();
  }

  function resetAll() {
    state.topic = "";
    state.notes = "";
    PROMPT_DATA.selectGroups.forEach(function (group) {
      state.selects[group.id] = "";
    });
    PROMPT_DATA.checkGroups.forEach(function (group) {
      state.checks[group.id] = [];
    });
    syncUiFromState();
  }

  function showFeedback(message) {
    var el = document.getElementById("copy-feedback");
    el.textContent = message;
    window.clearTimeout(showFeedback._t);
    showFeedback._t = window.setTimeout(function () {
      el.textContent = "";
    }, 2200);
  }

  function copyOutput() {
    var output = document.getElementById("output");
    var text = output.value;
    if (!text) {
      showFeedback("Nothing to copy yet — make a selection first.");
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          showFeedback("Copied to clipboard!");
        },
        function () {
          fallbackCopy(output);
        }
      );
    } else {
      fallbackCopy(output);
    }
  }

  function fallbackCopy(textarea) {
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      showFeedback("Copied to clipboard!");
    } catch (e) {
      showFeedback("Copy failed — select the text manually.");
    }
  }

  function downloadOutput() {
    var text = document.getElementById("output").value;
    if (!text) {
      showFeedback("Nothing to download yet — make a selection first.");
      return;
    }
    var blob = new Blob([text], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ---------- presets (localStorage) ----------

  function loadPresetStore() {
    try {
      return JSON.parse(window.localStorage.getItem(PRESETS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function savePresetStore(store) {
    window.localStorage.setItem(PRESETS_KEY, JSON.stringify(store));
  }

  function refreshPresetSelect() {
    var select = document.getElementById("preset-select");
    var store = loadPresetStore();
    var names = Object.keys(store).sort();

    select.innerHTML = "";
    var placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = names.length
      ? "— Load a saved preset —"
      : "— No saved presets yet —";
    select.appendChild(placeholder);

    names.forEach(function (name) {
      var o = document.createElement("option");
      o.value = name;
      o.textContent = name;
      select.appendChild(o);
    });
  }

  function savePreset() {
    var nameInput = document.getElementById("preset-name");
    var name = nameInput.value.trim();
    if (!name) {
      showFeedback("Give your preset a name first.");
      return;
    }
    var store = loadPresetStore();
    store[name] = JSON.parse(JSON.stringify(state));
    savePresetStore(store);
    refreshPresetSelect();
    document.getElementById("preset-select").value = name;
    nameInput.value = "";
    showFeedback('Preset "' + name + '" saved.');
  }

  function loadPreset() {
    var select = document.getElementById("preset-select");
    var name = select.value;
    if (!name) {
      showFeedback("Pick a preset to load.");
      return;
    }
    var store = loadPresetStore();
    var saved = store[name];
    if (!saved) return;

    state.topic = saved.topic || "";
    state.notes = saved.notes || "";
    state.selects = Object.assign({}, saved.selects);
    state.checks = {};
    Object.keys(saved.checks || {}).forEach(function (id) {
      state.checks[id] = (saved.checks[id] || []).slice();
    });

    syncUiFromState();
    showFeedback('Preset "' + name + '" loaded.');
  }

  function deletePreset() {
    var select = document.getElementById("preset-select");
    var name = select.value;
    if (!name) {
      showFeedback("Pick a preset to delete.");
      return;
    }
    var store = loadPresetStore();
    delete store[name];
    savePresetStore(store);
    refreshPresetSelect();
    showFeedback('Preset "' + name + '" deleted.');
  }

  // ---------- init ----------

  function init() {
    renderHeader();
    renderSelectGroups();
    renderCheckGroups();
    wireTextInputs();
    refreshPresetSelect();
    updateOutput();

    document.getElementById("randomize-btn").addEventListener("click", randomize);
    document.getElementById("reset-btn").addEventListener("click", resetAll);
    document.getElementById("copy-btn").addEventListener("click", copyOutput);
    document.getElementById("download-btn").addEventListener("click", downloadOutput);
    document.getElementById("save-preset-btn").addEventListener("click", savePreset);
    document.getElementById("load-preset-btn").addEventListener("click", loadPreset);
    document.getElementById("delete-preset-btn").addEventListener("click", deletePreset);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
