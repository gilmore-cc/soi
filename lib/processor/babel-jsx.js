/**
 * The MIT License (MIT)
 * Copyright (c) 2016 Saber-Team
 *
 * @file babel-react预处理器编译成javascript, 后续由js插件处理.
 * @author AceMood
 */

'use strict';

const babel = require('babel-core');

let defaultOptions = {
  presets: ['react'],
  comments: true,
  moduleIds: false
};

/**
 * compile js source code
 * @param {JS} js
 * @param {?object=} opt
 * @returns {*}
 */
const processor = function(js, opt) {
  let sourceCode = js.getContent();
  let path = js.path;
  if (!sourceCode) {
    return sourceCode;
  }

  opt = opt || {};
  let options = soi.util.merge({}, defaultOptions, opt);
  let ignore = options.ignore || soi.fn.FALSE;
  let ret;

  if (/\.jsx$/.test(js.path) && !ignore(js.path)) {
    try {
      ret = babel.transform(sourceCode, options);
    } catch (err) {
      soi.log.error(
        `Babel-react parse file [${path}], [${err.message}]`
      );
      process.exit(0);
    }

    js.setContent(ret.code);
    return ret.code;
  }

  return sourceCode;
};

module.exports = processor;