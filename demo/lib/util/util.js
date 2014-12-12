/** Oslo JavaScript Framework. */
define("@util",[],function(){"use strict";var a="oslo_uid_"+(1e9*Math.random()>>>0),b=0,c=Array.prototype,d=Object.prototype;function e(a){return a.call.apply(a.bind,arguments)}function f(a,b){if(!a)throw new Error;if(arguments.length>2){var d=c.slice.call(arguments,2);return function(){var e=c.slice.call(arguments);return c.unshift.apply(e,d),a.apply(b,e)}}return function(){return a.apply(b,arguments)}}function g(a){return"[object Array]"===d.toString.call(a)}function h(a){if(!a)return!1;var b=typeof a;return g(a)||"object"===b&&"number"==typeof a.length}function i(a){var b=typeof a;return"object"===b&&null!==a||"function"===b}function j(a){var b=c.slice.call(arguments,1);return function(){var d=c.slice.call(arguments);return d.unshift.apply(d,b),a.apply(this,d)}}var k=function(){var a;return a=Function.prototype.bind&&-1!==Function.prototype.bind.toString().indexOf("native code")?e:f,a}(),l=null,m=function(a){if(window.execScript)window.execScript(a,"JavaScript");else{if(!("eval"in window))throw Error("Oslo.util.globalEval not available");if(null===l&&(window.eval("var _et_ = 1;"),"undefined"!=typeof window._et_?(delete window._et_,l=!0):l=!1),l)window.eval(a);else{var b=window.document,c=b.createElement("script");c.type="text/javascript",c.defer=!1,c.appendChild(b.createTextNode(a)),b.body.appendChild(c),b.body.removeChild(c)}}};return{bind:function(){return k.apply(null,arguments)},DEBUG:!0,partial:j,globalEval:m,mixin:function(a,b){for(var c in b)a[c]=b[c];return a},isArray:g,isArrayLike:h,isFunction:function(a){return"function"==typeof a},isNumber:function(a){return"number"==typeof a},isString:function(a){return"string"==typeof a},isObject:i,isNull:function(a){return void 0===a||null===a},isDef:function(a){return void 0!==a},getUid:function(c){if(null===c)throw new Error("Can not get uid from null");return c[a]||(c[a]=++b)},removeUid:function(b){if(null===b)throw new Error("Can not remove a uid from null");"removeAttribute"in b&&b.removeAttribute(a);try{delete b[a]}catch(c){}},inherits:function(a,b){function c(){}c.prototype=b.prototype,a.superClass_=b.prototype,a.prototype=new c,a.prototype.constructor=a},dispose:function(a){a&&"function"==typeof a.dispose&&a.dispose()},nullFunction:function(){},abstractMethod:function(){throw Error("unimplemented abstract method")},global:this,now:Date.now||function(){return+new Date}}});