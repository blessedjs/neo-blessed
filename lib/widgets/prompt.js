/**
 * prompt.js - prompt element for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

/**
 * Modules
 */

var Node = require('./node');
var Box = require('./box');
var Button = require('./button');
var Textbox = require('./textbox');

/**
 * Prompt
 */

function Prompt(options) {
  if (!(this instanceof Node)) {
    return new Prompt(options);
  }

  options = options || {};

  options.hidden = true;

  Box.call(this, options);

  const _bg = options.style && options.style.input && options.style.input.bg || 'black';
  const _fg = options.style && options.style.input && options.style.input.fg || 'white';
  this._.input = new Textbox({
    parent: this,
    top: 3,
    height: 1,
    left: 2,
    right: 2,
    bg: _bg,
    fg: _fg
  });

  const _style = options.style && options.style.okay || {};
  this._.okay = new Button({
    parent: this,
    top: 5,
    height: 1,
    left: 2,
    width: 6,
    content: options.ok || 'OK',
    align: 'center',
    bg: 'black',
    hoverBg: 'blue',
    autoFocus: false,
    mouse: true,
    style: _style
  });

  const _cancelStyle = options.style && options.style.cancelStyle || {};
  this._.cancel = new Button({
    parent: this,
    top: 5,
    height: 1,
    shrink: true,
    left: 10,
    width: 8,
    content: options.cancel || 'CANCEL',
    align: 'center',
    bg: 'black',
    hoverBg: 'blue',
    autoFocus: false,
    mouse: true,
    style: _cancelStyle
  });
}

Prompt.prototype.__proto__ = Box.prototype;

Prompt.prototype.type = 'prompt';

Prompt.prototype.input =
Prompt.prototype.setInput =
Prompt.prototype.readInput = function(text, value, callback) {
  var self = this;
  var okay, cancel;

  if (!callback) {
    callback = value;
    value = '';
  }

  // Keep above:
  // var parent = this.parent;
  // this.detach();
  // parent.append(this);

  this.show();
  this.setContent(' ' + text);

  this._.input.value = value;

  this.screen.saveFocus();

  this._.okay.on('press', okay = function() {
    self._.input.submit();
  });

  this._.cancel.on('press', cancel = function() {
    self._.input.cancel();
  });

  this._.input.readInput(function(err, data) {
    self.hide();
    self.screen.restoreFocus();
    self._.okay.removeListener('press', okay);
    self._.cancel.removeListener('press', cancel);
    return callback(err, data);
  });

  this.screen.render();
};

/**
 * Expose
 */

module.exports = Prompt;
