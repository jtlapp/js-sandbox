'use strict';

$(document).ready(function() {
  var inputs = {}

  $("form").on("submit", function(event) {
    event.preventDefault()
    _submitInputs()
  })

  showInputs()
})

function addTextInput(id, title, defaultText="") {
  _addInputID(id)
  _verifyInputTitle(title)
  if (typeof defaultText != "string") {
    throw Error(`Invalid default text for input ID "${id}". String required.`)
  }

  _addInput(title, `<input ${_getInputIDAtts()} type='text' value='` +
      _escapeAttr(defaultText) + "' />")
}

function addListInput(id, title, options) {
  _addInputID(id)
  _verifyInputTitle(title)
  if (!Array.isArray(options)) {
    throw Error(`Invalid options for input ID "${id}". Array of strings required.`)
  }
  for (let i = 0; i < options.length; ++i) {
    if (typeof options[i] != "string") {
      throw Error(`The input Id "${id}" option at index $i is not a string.`)
    }
  }

  let html = $(`<select ${_getInputIDAtts()} />`)
  $.each(options, function(index, option) {
    html.append($("<option/>").attr("value", option).text(option))
  })
  _addInput(title, html)
}

function getInput(id) {
  if (inputs[id] == undefined) {
    throw Error(`Input id "${id}" not found`)
  }
  return inputs[id]
}

function setOutputHTML(id, html) {
  $(`#output_$id`).html(html)
}

function setOutputText(id, text) {
  $(`#output_$id`).text(text)
}

function _addInputID(id) {
  _verifyInputID(id)
  if (inputs[id] != undefined) {
    throw Error(`Input ID ${id} already in use`)
  }
  inputs[id] = null
  alert("add input length = "+ Object.keys(inputs).length)
}

function _addInput(title, html) {
  $("#inputs").append("<h1>" + _escapeHtml(title) + "</h1>")
  $("#inputs").append(html)
}

function _getInputIDAtts(id) {
  return `name="input_${id} id="input_${id}`;
}

function _submitInputs() {
  // Object.keys(inputs).forEach((key, value) => {
  //   inputs[key] = $(`#input_${key}`).value
  //   alert("inputs[key] = "+ $(`#input_${key}`).value)
  // })
  $("form :input").each(function() {
    inputs[this.name] = $(this).val()
  })
  showOutputs()
}

function _escapeAttr(value) {
  return value.replace(/\"/g, "\\\"").replace(/\'/g, "\\\'")
}

function _escapeHtml(html) {
  return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
}
