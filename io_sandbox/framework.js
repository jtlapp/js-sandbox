'use strict';

var inputs = {}
var outputs = {}

$(document).ready(function() {
  $("form").on("submit", function(event) {
    event.preventDefault()
    _submitInputs()
  })
  initialize()
})

function addTextInput(id, title, defaultText="") {
  _addInputID(id)
  _verifyInputTitle(title)
  if (typeof defaultText != "string") {
    throw Error(`Invalid default text for input ID "${id}". String required.`)
  }

  _addInput(title, `<input ${_getInputIDAtts(id)} type='text' value='` +
      _escapeAttr(defaultText) + "' />")
}

function addListInput(id, title, options, defaultOption="") {
  _addInputID(id)
  _verifyInputTitle(title)
  if (!Array.isArray(options)) {
    throw Error(`Invalid options for input ID "${id}". Array of strings required.`)
  }
  if (options.length == 0) {
    throw Error(`Option list for input ID "${id}" is empty.`)
  }
  for (let i = 0; i < options.length; ++i) {
    if (typeof options[i] != "string") {
      throw Error(`The input ID "${id}" option at index $i is not a string.`)
    }
  }

  let html = $(`<select ${_getInputIDAtts(id)} />`)
  $.each(options, function(index, option) {
    const optionElem = $("<option/>").attr("value", option)
    if (option == defaultOption) {
      optionElem.attr("selected", true)
    }
    html.append(optionElem.text(option))
  })
  _addInput(title, html)
}

function getInput(id) {
  if (inputs[id] == undefined) {
    throw Error(`Input ID "${id}" not found`)
  }
  return inputs[id]
}

function setOutputHTML(id, html) {
  _getOutputElement(id).html(html)
}

function setOutputText(id, text) {
  _getOutputElement(id).text(text)
}

function _addInputID(id) {
  _verifyInputID(id)
  if (inputs[id] != undefined) {
    throw Error(`Input ID ${id} already in use`)
  }
  inputs[id] = null
}

function _addInput(title, html) {
  $("#inputs").append("<h1>" + _escapeHTML(title) + "</h1>")
  $("#inputs").append(html)
}

function _getInputIDAtts(id) {
  return `name="input_${id}" id="input_${id}"`;
}

function _getOutputElement(id) {
  const outputElem = $(`#${id}`)
  if (outputElem.length == 0) {
    throw Error(`Output element ID "${id}" not found`)
  }
  return outputElem
}

function _submitInputs() {
  Object.keys(inputs).forEach((key, value) => {
    inputs[key] = $(`#input_${key}`).val()
  })
  run()
  if (typeof outputs != "object") {
    alert("'outputs' is no longer an object")
  }
  for (let key of Object.keys(outputs)) {
    setOutputText(key, outputs[key])
  }
}
 
function _escapeAttr(value) {
  return value.replace(/\"/g, "\\\"").replace(/\'/g, "\\\'")
}

function _escapeHTML(html) {
  return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
}

function _verifyInputID(id) {
  if (typeof id != "string") {
    throw Error("Invalid input ID. String required.")
  }
  if (!/^[a-zA-Z0-9_]+$/.test(id)) {
    throw Error(`Invalid input ID "${id}". Must contain only letters, numbers, and underscores`)
  }
}

function _verifyInputTitle(title) {
  if (typeof title != "string") {
    throw Error("Invalid input title. String required.")
  }
  if (title.length == 0) {
    throw Error("Input title string is empty.")
  }
}
