/*!
 * list-item <https://github.com/jonschlinkert/list-item>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isNumber = require('is-number');
var expand = require('expand-range');
var repeat = require('repeat-string');

/**
 * Expose `listitem`
 */

module.exports = listitem;

/**
 * Returns a function to generate a plain-text/markdown list-item,
 * allowing options to be cached for subsequent calls.
 *
 * ```js
 * var li = listitem(options);
 *
 * li(0, 'Level 0 list item');
 * //=> '- Level 0 list item'
 *
 * li(1, 'Level 1 list item');
 * //=> '  * Level 1 list item'
 *
 * li(2, 'Level 2 list item');
 * //=> '    + Level 2 list item'
 * ```
 *
 * @param  {String} `options`
 *   @option {Boolean} [options] `nobullet` Pass true if you only want the list iten and identation, but no bullets.
 *   @option {String} [options] `indent` The amount of leading indentation to use. default is `  `.
 *   @option {String|Array} [options] `chars` If a string is passed, [expand-range] will be used to generate an array of bullets (visit [expand-range] to see all options.) Or directly pass an array of bullets, numbers, letters or other characters to use for each list item. Default `['-', '*', '+', '~']`
 * @param {Function} `fn` pass a function [expand-range] to modify the bullet for an item as it's generated. See the [examples].
 * @api public
 */

function listitem(opts, fn) {
  if (typeof opts === 'function') {
    fn = opts; opts = null;
  }

  opts = opts || {};
  var chars = character(opts, fn);

  return function(lvl, str, sublvl) {
    if (lvl == null) {
      throw new Error('[listitem]: invalid arguments.');
    }

    lvl = isNumber(lvl) ? +lvl : 0;
    var ch = chars(sublvl);

    var bullet = ch && ch[lvl % ch.length];
    var indent = typeof opts.indent !== 'string'
      ? (lvl > 0 ? '  ' : '')
      : opts.indent;

    var prefix = !opts.nobullet
      ? bullet + ' '
      : '';

    var res = '';
    res += repeat(indent, lvl);
    res += prefix;
    res += str;
    return res;
  };
};

/**
 * Generate and cache the array of characters to use as
 * bullets.
 *
 * TODO: split this out into simpler functions.
 *
 * @param  {Object} `opts` Options to pass to [expand-range]
 * @param  {Function} `fn`
 * @return {Array}
 */

function character(opts, fn) {
  var chars = opts.chars || ['-', '*', '+', '~'];
  if (typeof chars === 'string') {
    opts = Object.create(opts || {});
    return function (sublvl) {
      return expand(chars, opts, function(ch) {
        return fn ? fn(ch, sublvl) : ch;
      });
    }
  }
  if (typeof fn === 'function') {
    return wrap(fn, chars);
  }
  return function () {
    return chars;
  }
}

function wrap (fn, chars) {
  return function (sublvl) {
    var args = [].slice.call(arguments);
    return chars.map(function (ch) {
      var ctx = args.concat.apply([], arguments);
      return fn.apply(fn, ctx);
    });
  }
}
