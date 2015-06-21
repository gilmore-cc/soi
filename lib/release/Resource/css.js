/**
 * @fileoverview 样式表资源类
 */

'use strict';

var path = require('path');
var fs = require('fs');
var util = require('util');

var utils = require('../utils');
var Resource = require('./resource');
var compiler = require('../Compiler/cssCompiler');


/**
 * 单个样式表文件资源.
 * @constructor
 */
function CssResource(config) {
  Resource.call(this, config);
}


util.inherits(CssResource, Resource);


/**
 * 生成目标文件
 */
CssResource.prototype.create = function() {
  var ret = utils.getFileHash(this.original, null);
  var ext = path.extname(this.original);
  // var fname = path.basename(this.original, ext);

  // make directory
  soi.fs.mkdir(this.dist);

  var p = this.dist + '/' + ret.base64 + ext;
  soi.log.info('Create static resource file located at:\n  ' + p);
  soi.fs.writeFile(p, ret.content);
};


CssResource.prototype.compile = function() {
  compiler.compile(this);
};


// 导出
module.exports = CssResource;