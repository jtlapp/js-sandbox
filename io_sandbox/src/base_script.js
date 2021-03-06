'use strict';

var inputs = {};
var outputs = {};
var errorAlerts = true;

$(document).ready(function () {
  $("form").on("submit", function(event) {
    event.preventDefault();
    _submitInputs();
  })
  initialize();
})

function makeTextInput(id, title, defaultText="") {
  _addInputID(id);
  _verifyInputTitle(title);
  if (typeof defaultText != "string") {
    _error(`Invalid default text for input ID "${id}". String required.`);
  }

  _addInput(title, `<input ${_getInputIDAtts(id)} type='text' value='` +
      _escapeAttr(defaultText) + "' />");
}

function makeListInput(id, title, options, defaultOption="") {
  _addInputID(id);
  _verifyInputTitle(title);
  if (!Array.isArray(options)) {
    _error(`Invalid options for input ID "${id}". Array of strings required.`);
  }
  if (options.length == 0) {
    _error(`Option list for input ID "${id}" is empty.`);
  }
  for (let i = 0; i < options.length; ++i) {
    if (typeof options[i] != "string") {
      _error(`The input ID "${id}" option at index $i is not a string.`);
    }
  }

  let html = $(`<select ${_getInputIDAtts(id)} />`)
  $.each(options, function(index, option) {
    const optionElem = $("<option/>").attr("value", option);
    if (option == defaultOption) {
      optionElem.attr("selected", true);
    }
    html.append(optionElem.text(option));
  })
  _addInput(title, html);
}

function appendHTML(id, html) {
  const output = _toOutputString(id, html);
  _getOutputElement(id).append(output);
}

function appendLineHTML(id, html) {
  appendHTML(id, "<br />\n");
  appendHTML(id, html);
}

function appendLine(id, text) {
  appendHTML(id, "<br />\n");
  appendText(id, text);
}

function appendParagraphHTML(id, html) {
  const output = _toOutputString(id, html);
  appendHTML(id, `<p>${output}</p>\n`);
}

function appendParagraph(id, text) {
  const output = _toOutputString(id, text);
  appendParagraphHTML(id, _escapeHTML(output));
}

function appendText(id, text) {
  const output = _toOutputString(id, text);
  appendHTML(id, _escapeHTML(output));
}

function getBoolean(id) {
  _verifyInput(id);
  switch (inputs[id].toLowerCase()) {
    case "true":
    case "yes":
    case "on":
      return true;
    case "false":
    case "no":
    case "off":
      return false;
    default:
      _error(`Input ID "${id}" does not contain a boolean value`);
  }
}

function getNumber(id) {
  _verifyInput(id);
  if (isNaN(inputs[id])) {
    _error(`Input ID "${id}" does not contain a number`);
  }
  return Number(inputs[id]);
}

function getString(id) {
  _verifyInput(id);
  return inputs[id];
}

function setHTML(id, html) {
  const output = _toOutputString(id, html);
  _getOutputElement(id).html(output);
}

function setText(id, text) {
  const output = _toOutputString(id, text);
  setHTML(id, _escapeHTML(output));
}

function _addInputID(id) {
  _verifyInputID(id);
  if (inputs[id] != undefined) {
    _error(`Input ID "${id}" already in use`);
  }
  inputs[id] = null;
}

function _addInput(title, html) {
  $("#inputs").append("<h1>" + _escapeHTML(title) + "</h1>");
  $("#inputs").append(html);
}

function _getInputIDAtts(id) {
  // Precede IDs with 'input_' to prevent name clashes with output IDs,
  // which therefore need not have a common prefix.
  return `name="input_${id}" id="input_${id}"`;
}

function _getOutputElement(id) {
  const outputElem = $(`#${id}`);
  if (outputElem.length == 0) {
    _error(`Output element ID "${id}" not found`);
  }
  return outputElem;
}

function _submitInputs() {
  Object.keys(inputs).forEach((key, value) => {
    inputs[key] = $(`#input_${key}`).val();
  })
  compute()
  if (typeof outputs != "object") {
    alert("'outputs' is no longer an object");
  }
  for (let key of Object.keys(outputs)) {
    setText(key, outputs[key]);
  }
}
 
function _escapeAttr(value) {
  return value.replace(/\"/g, "\\\"").replace(/\'/g, "\\\'");
}

function _escapeHTML(html) {
  return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function _verifyInput(id) {
  _verifyInputID(id);
  if (inputs[id] == undefined) {
    _error(`Input ID "${id}" not found`);
  }
}

function _verifyInputID(id) {
  if (typeof id != "string") {
    _error("Invalid input ID. String required.");
  }
  if (!/^[a-zA-Z0-9_]+$/.test(id)) {
    _error(`Invalid input ID "${id}".` +
        "Must contain only letters, numbers, and underscores");
  }
}

function _verifyInputTitle(title) {
  if (typeof title != "string") {
    _error("Invalid input title. String required.");
  }
  if (title.length == 0) {
    _error("Input title string is empty.");
  }
}

function _toOutputString(id, output) {
  const outputType = typeof output;
  if (outputType != "string" && outputType != "boolean" && isNaN(output)) {
    _error(`Output for ID "${id}" is not a string, a number, or a boolean`);
  }
  return ("" + output); // convert to a string
}

function _error(message) {
  if (errorAlerts) {
    alert("ERROR: " + message);
  }
  throw Error(message);
}
