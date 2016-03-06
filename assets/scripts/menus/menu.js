/*
 *  Menu (class)
 *
 *  Generic class instance of menu
 *
 */
/* global _infoBubble, _getElAbsolutePos, _loseAnyFocus */
'use strict'

var _ = require('lodash')
var statusMessage = require('../app/status_message')

var Menu = function (name, opts) {
  opts = opts || {}
  this.name = name
  this.alignment = opts.alignment || 'left' // Set to 'right' if menu should be aligned to right of window
  this.onInitCallback = opts.init || _.noop // Function to execute at menu init
  this.onShowCallback = opts.onShow || _.noop // Function to execute after menu open
  this.el = null // Placeholder
}

Menu.prototype.init = function () {
  var menuButton = '#' + this.name + '-menu-button'
  var menuButtonEl = document.querySelector(menuButton)
  this.manager = require('./menu_manager')

  // Save a reference to its DOM element
  this.el = document.querySelector('#' + this.name + '-menu')

  if (menuButtonEl) {
    // Firefox sometimes disables some buttons… unsure why
    menuButtonEl.disabled = false

    // Bind event listeners to the menu button
    menuButtonEl.addEventListener('pointerdown', this.onClick.bind(this))
  }

  // Callback
  this.onInitCallback()
}

Menu.prototype.onClick = function (event) {
  if (!this.el.classList.contains('visible')) {
    this.show(event)
  } else {
    this.hide(event)
  }
}

Menu.prototype.show = function (event) {
  // Hide other UI
  _infoBubble.hide()
  statusMessage.hide()
  this.manager.hideAll()

  // Determine positioning
  if (this.alignment === 'right') {
    // Note: this aligns to right edge of menu bar,
    // instead of the right side of the menu item.
    this.el.classList.add('align-right')
  } else {
    // Aligns menu to the left side of the menu item.
    var pos = _getElAbsolutePos(document.querySelector('#' + this.name + '-menu-item'))
    this.el.style.left = pos[0] + 'px'
  }

  // Show menu
  this.el.classList.add('visible')

  // Send event to callback
  this.onShowCallback(event)
}

Menu.prototype.hide = function () {
  _loseAnyFocus()
  this.el.classList.remove('visible')
}

module.exports = Menu