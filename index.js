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
 *   @option {Number} [options] `chars` `chars` Array of bullets, numbers, letters or other characters to use for each list item. Default `['-', '*', '+', '~']`
 * @param {Function} `fn` pass a function to modify the bullet for an item as it's generated. See the examples
 * @api public
 */

function listitem(opts, fn) {
  if (typeof opts === 'function') {
    fn = opts; opts = null;
  }

  opts = opts || {};
  opts.chars = opts.chars || ['-', '*', '+', '~'];
  console.log(opts.chars)

  return function(lvl, str) {
    if (lvl == null) {
      throw new Error('listitem: invalid arguments.');
    }

    lvl = isNumber(lvl) ? +lvl : 0;

    var indent = typeof opts.indent !== 'string'
      ? (lvl > 0 ? '  ' : '')
      : opts.indent;

    var ch = !opts.nobullet
      ? bullet(lvl, opts, fn) + ' '
      : '';

    var res = '';
    res += repeat(indent, lvl);
    res += ch;
    res += str;
    return res;
  };
};

function bullet(i, opts, fn) {
  var ch = opts.chars;
  if (typeof ch === 'string') {
    opts = Object.create(opts || {});
    ch = expand(ch, opts, fn);
  }
  return ch[i % ch.length];
}
