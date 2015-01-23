var util = require('util');
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var chalk = require('chalk');
var constants = require('./optimizer/constants');


function extend(target, src) {
  for(var k in src) {
    target[k] = src[k];
  }
}

/**
 * 判断是否目录
 * @param {String} path
 * @returns {Boolean}
 */
function isDirectory(path) {
  if (!fs.existsSync(path)) {
    console.log(
      chalk.bgYellow.bold('utils.isDirectory() could not resolve the path:\n  '
        + path)
    );
    return false;
  }
  var stat = fs.lstatSync(path);
  return stat.isDirectory();
}

/**
 * 判断是否文件
 * @param {String} path
 * @returns {Boolean}
 */
function isFile(path) {
  if (!fs.existsSync(path)) {
    console.log(
      chalk.bgYellow.bold('utils.isFile() could not resolve the path:\n  '
        + path)
    );
    return false;
  }
  var stat = fs.lstatSync(path);
  return stat.isFile();
}

/**
 * 判断是否数组
 * @param {*} o
 * @returns {Boolean}
 */
function isArray(o) {
  return util.isArray(o);
}

/**
 * 判断是否原生对象
 * @param {*} o
 * @returns {Boolean}
 */
function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

/**
 * 数组去重
 * @param {Array} arr
 */
function unique(arr) {
  var seen = {},
      cursorInsert = 0,
      cursorRead = 0;

  while (cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = (typeof current).charAt(0) + current;

    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      arr[cursorInsert++] = current;
    }
  }
  arr.length = cursorInsert;
  return arr;
}

/**
 * 取文件内容hash值
 * @param {String} path
 * @param {?String} encoding
 * @returns {{content: *, hex: string}}
 */
function getFileHash(path, encoding) {
  var shasum1 = crypto.createHash('sha1');
  var ctn = fs.readFileSync(path,
    {
      encoding: encoding ? encoding : ''
    });

  shasum1.update(ctn);
  return {
    content: ctn,
    hex: shasum1.digest('hex').substr(0, Math.min(SOI_CONFIG.sha1_length || 8, 40))
  }
}

/**
 * 获取内容的hash值
 * @param {String} str
 * @returns {{content: *, hex: string}}
 */
function getStringHash(str) {
  var shasum1 = crypto.createHash('sha1');
  shasum1.update(str);
  return {
    content: str,
    hex: shasum1.digest('hex').substr(0, Math.min(SOI_CONFIG.sha1_length || 8, 40))
  }
}

/**
 * Read file content.
 * @param {String} path
 * @param {Object} option
 * @returns {*}
 */
function readFile(path, option) {
  try {
    var code = fs.readFileSync(path, {
      encoding: option && option.encoding || ''
    });
  } catch (ex) {
    console.error(
      chalk.bgRed.bold('When trying to read content of file located: \n  ' +
      path + ' error occurred!\n  ' + ex.message));
    process.exit(1);
  }

  return code;
}

/**
 * Write content to file.
 * @param {String} path
 * @param {String|Buffer} data
 * @param {Object} option
 */
function writeFile(path, data, option) {
  try {
    fs.writeFileSync(path, data, {
      encoding: option && option.encoding || ''
    });
  } catch (ex) {
    console.error(
      chalk.bgRed.bold('When trying to write content to file located: \n  ' +
      path + ' error occurred!\n  ' + ex.message));
    process.exit(1);
  }
}

/**
 * 判断给定路径是否网络绝对路径, 即http(s)://开头的路径
 * @param {String} url
 * @returns {Boolean}
 */
function isAbsUrl(url) {
  return /:\//.test(url);
}

/**
 * Normalize windows path `\\` to *unix `/`;
 * @param {String} p
 * @returns {*|XML|string|void}
 */
function normalizeSysPath(p) {
  return path.normalize(p).replace(/\\/g, '/');
}

/**
 * Make directory.
 * @param {String} filepath
 */
function mkdir(filepath) {
  var dir = normalizeSysPath(filepath);
  if (fs.existsSync(dir)) {
    return;
  }

  if (SOI_CONFIG.debug) {
    console.log(chalk.blue(
      'Make directory at: ' + dir + '\n'
    ));
  }

  if (/\/$/.test(dir)) {
    dir = dir.slice(0, -1);
  }
  var dirs = dir.split('/');
  dirs = dirs.reverse();

  var index = 0;
  while(!fs.existsSync(dir)) {
    dir = path.dirname(dir);
    index++;
  }
  for (var i = index - 1; i >= 0; i--) {
    dir += '/' + dirs[i];
    var p = dir + '/';
    try {
      fs.mkdirSync(p);
    } catch (ex) {
      console.log(chalk.bgRed.bold('When trying to mkdir: \n' +
        p + ' error occurred!\n  ' + ex.message));
      process.exit(1);
    }
  }
}

/**
 * 生成代码替换打包模块
 * @param {String} id
 * @param {String} depsCode
 * @param {String} factoryCode
 */
function compose(id, depsCode, factoryCode) {
  // 这里不使用String.prototype.replace是因为对于一些可能出现在代码里的
  // 特殊表示如$$ $'之类的会被js引擎错误解析, 见es62 String部分.
  var tpl, parts;
  if (id.indexOf('@') === 0) {
    tpl = constants.REQUIRE;
    parts = tpl.split('%a');
    tpl = parts[0] + depsCode + parts[1];
    parts = tpl.split('%f');
    tpl = parts[0] + factoryCode + parts[1];
  } else {
    tpl = constants.DEFINE;
    parts = tpl.split('%s');
    tpl = parts[0] + id + parts[1];
    parts = tpl.split('%a');
    tpl = parts[0] + depsCode + parts[1];
    parts = tpl.split('%f');
    tpl = parts[0] + factoryCode + parts[1];
  }
  return tpl;
}

exports.extend = extend;
exports.isArray = util.isArray;
exports.isObject = isObject;
exports.inherits = util.inherits;
exports.unique = unique;
exports.isDirectory = isDirectory;
exports.isFile = isFile;
exports.getFileHash = getFileHash;
exports.getStringHash = getStringHash;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.isAbsUrl = isAbsUrl;
exports.normalizeSysPath = normalizeSysPath;
exports.mkdir = mkdir;
exports.compose = compose;