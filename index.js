/*!
 * list-item <https://github.com/jonschlinkert/list-item>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

const isNumber = require('is-number');
const fill = require('fill-range');

/**
 * Returns a function to generate a plain-text/markdown list-item,
 * allowing options to be cached for subsequent calls.
 *
 * ```js
 * const li = listitem(options);
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
 * @param  {Object} `options` pass options to customize list item characters, indentation, etc.
 * @param {Boolean} `options.nobullet` Pass true if you only want the list iten and identation, but no bullets.
 * @param {String} `options.indent` The amount of leading indentation to use. default is `  `.
 * @param {String|Array} `options.chars` If a string is passed, [fill-range][] will be used to generate an array of bullets (visit [fill-range][] to see all options.) Or directly pass an array of bullets, numbers, letters or other characters to use for each list item. Default `['-', '*', '+']`
 * @param {Function} `fn` pass a function [fill-range][] to modify the bullet for an item as it's generated. See the [examples](#examples).
 * @return {String} returns a formatted list item
 * @api public
 */

function listitem(options = {}, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  let chars = character(options);
  let index = 0;

  return (lvl, suffix) => {
    if (!isNumber(lvl)) {
      throw new Error('expected level to be a number');
    }

    // cast to number
    lvl = +lvl;
    index++;

    let bullet = chars ? chars[lvl % chars.length] : '';
    let indent = typeof options.indent !== 'string'
      ? (lvl > 0 ? '  ' : '')
      : options.indent;

    let prefix = !options.nobullet
      ? bullet + ' '
      : '';

    if (typeof fn === 'function') {
      return fn(indent.repeat(lvl), bullet, index);
    }

    let res = '';
    res += indent.repeat(lvl);
    res += prefix;
    res += suffix;
    return res;
  };
}

/**
 * Create the array of characters to use as bullets.
 *
 * - http://spec.commonmark.org/0.19/#list-items
 * - https://daringfireball.net/projects/markdown/syntax#list
 * - https://help.github.com/articles/markdown-basics/#lists
 *
 * @param  {Object} `opts` Options to pass to [fill-range][]
 * @return {Array}
 */

function character(options = {}) {
  let chars = options.chars || ['-', '*', '+'];

  if (typeof chars === 'string') {
    return fill(...chars.split('..'), options);
  }

  return chars;
}

/**
 * Expose `listitem`
 */

module.exports = listitem;
