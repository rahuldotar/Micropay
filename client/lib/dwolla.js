var dwolla =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var __VERSION__ = '1.3.0';
	var __BUILD_TAG__ = '1';
	
	window.dwolla = {
	  config: __webpack_require__(1),
	  configure: __webpack_require__(2),
	  iav: __webpack_require__(3),
	  fundingSources: __webpack_require__(8),
	  version: __VERSION__,
	  buildTag: __BUILD_TAG__
	};
	
	exports['default'] = window.dwolla;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = {
	
	  dwollaUrl: 'https://www.dwolla.com',
	
	  apiUrl: 'https://api.dwolla.com'
	
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _config = __webpack_require__(1);
	
	var _config2 = _interopRequireDefault(_config);
	
	function configure(fn) {
	  if (fn === 'sandbox') fn = 'uat';
	  if (typeof fn === 'string') configure.CONFIGS[fn.toLowerCase()](_config2['default']);else fn(_config2['default']);
	}
	
	configure.CONFIGS = {
	  uat: function uat(cfg) {
	    cfg.dwollaUrl = 'https://sandbox.dwolla.com';
	    cfg.apiUrl = 'https://api-sandbox.dwolla.com';
	  },
	
	  prod: function prod(cfg) {
	    cfg.dwollaUrl = 'https://www.dwolla.com';
	    cfg.apiUrl = 'https://api.dwolla.com';
	  }
	};
	
	exports['default'] = configure;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _dwollaConfig = __webpack_require__(1);
	
	var _dwollaConfig2 = _interopRequireDefault(_dwollaConfig);
	
	var _lodashEndswith = __webpack_require__(4);
	
	var _lodashEndswith2 = _interopRequireDefault(_lodashEndswith);
	
	var HEARTBEAT_EXPIRED_ERROR = {
	  code: 'UnexpectedPage',
	  message: 'IAV navigated to an unexpected page and was cancelled.'
	};
	
	var iOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
	
	var iav = {
	
	  _HEARTBEAT_TTL: iOS ? 10000 : 1000,
	
	  _iframe: null,
	
	  _iframeHeight: null,
	
	  _callback: null,
	
	  _subscriber: null,
	
	  _heartbeatTimeoutId: null,
	
	  start: function start(token, opts, callback) {
	    if (typeof opts !== 'object') {
	      var containerId = token;
	      token = opts;
	      opts = { container: containerId };
	    }
	
	    var container = getContainerOrThrow(opts.container);
	    ensureValidTokenOrThrow(token);
	    ensureValidCallbackOrThrow(callback);
	
	    iav._iframe = document.createElement('iframe');
	    iav._iframe.onload = iav._onLoad;
	    iav._iframe.src = getIframeUrl(token, opts);
	    iav._iframe.style.visibility = 'hidden';
	    iav._iframe.style.overflow = 'hidden';
	    iav._iframe.frameBorder = '0';
	    iav._iframe.width = '100%';
	    iav._iframe.scrolling = 'no';
	    container.appendChild(iav._iframe);
	
	    iav._iframeHeight = null;
	
	    iav._callback = callback;
	    iav._subscriber = opts.subscriber;
	
	    window.addEventListener('message', iav._onMessage);
	  },
	
	  _onLoad: function _onLoad() {
	    iav._heartbeatTimeoutId = window.setTimeout(iav._onHeartbeatExpired, iav._HEARTBEAT_TTL, null);
	
	    iav._iframe.contentWindow.postMessage({
	      topic: 'iav.heartbeat'
	    }, iav._iframeDomain());
	  },
	
	  _onMessage: function _onMessage(message) {
	    if (!messageFromDwolla(message)) return;
	
	    if (messageTopicIs(message, 'heartbeat')) {
	      window.clearTimeout(iav._heartbeatTimeoutId);
	      iav._iframe.style.visibility = 'visible';
	    }
	
	    if (messageTopicIs(message, 'response')) iav._callback.apply(null, message.data.payload);
	
	    if (messageTopicIs(message, 'height') && message.data.payload !== iav._iframeHeight) iav._iframe.style.height = message.data.payload + 'px';
	
	    if (messageTopicIs(message, 'state') && 'function' === typeof iav._subscriber) iav._subscriber.apply(null, message.data.payload);
	  },
	
	  _onHeartbeatExpired: function _onHeartbeatExpired() {
	    iav._callback(HEARTBEAT_EXPIRED_ERROR);
	    iav._iframe.style.visibility = 'hidden';
	  },
	
	  _iframeDomain: function _iframeDomain() {
	    return iav._iframe.src.split('/').slice(0, 3).join('/');
	  }
	
	};
	
	function getContainerOrThrow(containerId) {
	  var container = document.getElementById(containerId);
	  if (container) return container;else throw new Error('[dwolla.iav.start] Element not found with id: ' + containerId);
	}
	
	function ensureValidTokenOrThrow(token) {
	  if (typeof token !== 'string') throw new Error('[dwolla.iav.start] Invalid token: ' + token);
	}
	
	function ensureValidCallbackOrThrow(callback) {
	  if (typeof callback !== 'function') throw new Error('[dwolla.iav.start] Invalid callback: ' + callback);
	}
	
	function messageFromDwolla(message) {
	  return message.origin === _dwollaConfig2['default'].dwollaUrl;
	}
	
	function messageTopicIs(message, topic) {
	  return message.data.topic === 'iav.' + topic;
	}
	
	function getIframeUrl(token, opts) {
	  var url = _dwollaConfig2['default'].dwollaUrl + '/fi/token/' + token + '?' + getIframeQuery(opts);
	  return (0, _lodashEndswith2['default'])(url, '?') || (0, _lodashEndswith2['default'])(url, '&') ? url.slice(0, -1) : url;
	}
	
	function getIframeQuery(opts) {
	  return getQuery({
	    stylesheets: typeof opts.stylesheets === 'object' ? opts.stylesheets : null,
	    microDeposits: opts.microDeposits,
	    fallbackToMicroDeposits: opts.fallbackToMicroDeposits || opts.fallbackToMicrodeposits,
	    backButton: opts.backButton
	  });
	}
	
	function getQuery(params) {
	  var query = '';
	  for (var j in params) {
	    if (params[j]) {
	      if (typeof params[j] === 'object') {
	        query += j + '=' + params[j].map(encodeURIComponent).join('&' + j + '=') + '&';
	      } else {
	        query += j + '=' + encodeURIComponent(params[j]) + '&';
	      }
	    }
	  }
	  return query;
	}
	
	exports['default'] = iav;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	'use strict';
	
	var baseToString = __webpack_require__(5),
	    toString = __webpack_require__(7);
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_INTEGER = 1.7976931348623157e+308,
	    NAN = 0 / 0;
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    symbolTag = '[object Symbol]';
	
	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;
	
	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	
	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;
	
	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;
	
	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * The base implementation of `_.clamp` which doesn't coerce arguments to numbers.
	 *
	 * @private
	 * @param {number} number The number to clamp.
	 * @param {number} [lower] The lower bound.
	 * @param {number} upper The upper bound.
	 * @returns {number} Returns the clamped number.
	 */
	function baseClamp(number, lower, upper) {
	  if (number === number) {
	    if (upper !== undefined) {
	      number = number <= upper ? number : upper;
	    }
	    if (lower !== undefined) {
	      number = number >= lower ? number : lower;
	    }
	  }
	  return number;
	}
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}
	
	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
	}
	
	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = value < 0 ? -1 : 1;
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}
	
	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This function is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite(value),
	      remainder = result % 1;
	
	  return result === result ? remainder ? result - remainder : result : 0;
	}
	
	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = isFunction(value.valueOf) ? value.valueOf() : value;
	    value = isObject(other) ? other + '' : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
	}
	
	/**
	 * Checks if `string` ends with the given target string.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category String
	 * @param {string} [string=''] The string to search.
	 * @param {string} [target] The string to search for.
	 * @param {number} [position=string.length] The position to search from.
	 * @returns {boolean} Returns `true` if `string` ends with `target`,
	 *  else `false`.
	 * @example
	 *
	 * _.endsWith('abc', 'c');
	 * // => true
	 *
	 * _.endsWith('abc', 'b');
	 * // => false
	 *
	 * _.endsWith('abc', 'b', 2);
	 * // => true
	 */
	function endsWith(string, target, position) {
	  string = toString(string);
	  target = baseToString(target);
	
	  var length = string.length;
	  position = position === undefined ? length : baseClamp(toInteger(position), 0, length);
	
	  position -= target.length;
	  return position >= 0 && string.indexOf(target, position) == position;
	}
	
	module.exports = endsWith;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	
	/** Used as references for various `Number` constants. */
	'use strict';
	
	var INFINITY = 1 / 0;
	
	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';
	
	/** Used to determine if values are of the language type `Object`. */
	var objectTypes = {
	  'function': true,
	  'object': true
	};
	
	/** Detect free variable `exports`. */
	var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType ? exports : undefined;
	
	/** Detect free variable `module`. */
	var freeModule = objectTypes[typeof module] && module && !module.nodeType ? module : undefined;
	
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);
	
	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	
	/** Detect free variable `window`. */
	var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	
	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(objectTypes[typeof undefined] && undefined);
	
	/**
	 * Used as a reference to the global object.
	 *
	 * The `this` value is used if it's the global object to avoid Greasemonkey's
	 * restricted `window` object, otherwise the `window` object is used.
	 */
	var root = freeGlobal || freeWindow !== (thisGlobal && thisGlobal.window) && freeWindow || freeSelf || thisGlobal || Function('return this')();
	
	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return value && value.Object === Object ? value : null;
	}
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Built-in value references. */
	var Symbol = root.Symbol;
	
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;
	
	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = value + '';
	  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
	}
	
	module.exports = baseToString;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module), (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	
	/** Used as references for various `Number` constants. */
	'use strict';
	
	var INFINITY = 1 / 0;
	
	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';
	
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
	
	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Built-in value references. */
	var Symbol = root.Symbol;
	
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;
	
	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = value + '';
	  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
	}
	
	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}
	
	module.exports = toString;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _fundingSourcesValidator = __webpack_require__(9);
	
	var _fundingSourcesValidator2 = _interopRequireDefault(_fundingSourcesValidator);
	
	var _api = __webpack_require__(10);
	
	var _api2 = _interopRequireDefault(_api);
	
	var fundingSources = {
	
	  create: function create(token, params, callback) {
	    var errors = _fundingSourcesValidator2['default'].validate(token, params, callback);
	    if (errors) return callback(errors);
	
	    _api2['default'].post(token, '/funding-sources', params, callback);
	  }
	
	};
	
	exports['default'] = fundingSources;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var ROUTING_NUMBER_REGEX = /^[0-9]{9}$/,
	    ACCOUNT_NUMBER_REGEX = /^[0-9]+$/;
	
	var validator = {
	  validate: function validate(token, params, callback) {
	    var errors = [];
	
	    if (invalidToken(token)) errors.push(buildValidationError('Token invalid.', '/token'));
	
	    if (invalidRoutingNumber(params.routingNumber)) errors.push(buildValidationError('Routing number invalid.', '/routingNumber'));
	
	    if (invalidAccountNumber(params.accountNumber)) errors.push(buildValidationError('Account number invalid.', '/accountNumber'));
	
	    if (invalidType(params.type)) errors.push(buildValidationError('Type invalid.', '/type'));
	
	    if (invalidName(params.name)) errors.push(buildValidationError('Name invalid.', '/name'));
	
	    if (invalidCallback(callback)) errors.push(buildValidationError('Callback invalid.', '/callback'));
	
	    return errors.length > 0 ? validationErrors(errors) : null;
	  }
	};
	
	function buildValidationError(message, path) {
	  return {
	    code: 'Invalid',
	    message: message,
	    path: path
	  };
	}
	
	function validationErrors(errors) {
	  return {
	    code: 'ValidationError',
	    message: 'Validation error(s) present. See embedded errors list for more details.',
	    _embedded: {
	      errors: errors
	    }
	  };
	}
	
	function invalidToken(token) {
	  return typeof token !== 'string';
	}
	
	function invalidRoutingNumber(routingNumber) {
	  return typeof routingNumber !== 'string' || !ROUTING_NUMBER_REGEX.test(routingNumber) || !validABA(routingNumber);
	}
	
	function invalidAccountNumber(accountNumber) {
	  return typeof accountNumber !== 'string' || !ACCOUNT_NUMBER_REGEX.test(accountNumber);
	}
	
	function invalidType(type) {
	  return typeof type !== 'string' || ['checking', 'savings'].indexOf(type.toLowerCase()) === -1;
	}
	
	function invalidName(name) {
	  return typeof name !== 'string';
	}
	
	function invalidCallback(callback) {
	  return typeof callback !== 'function';
	}
	
	// http://www.brainjar.com/js/validation/
	function validABA(s) {
	  if (s.length !== 9) return false;
	
	  var n = 0;
	  for (var i = 0; i < s.length; i += 3) {
	    n += pInt(s.charAt(i)) * 3 + pInt(s.charAt(i + 1)) * 7 + pInt(s.charAt(i + 2));
	  }
	
	  return n !== 0 && n % 10 === 0;
	}
	
	function pInt(int) {
	  return parseInt(int, 10);
	}
	
	exports['default'] = validator;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _xhr = __webpack_require__(11);
	
	var _xhr2 = _interopRequireDefault(_xhr);
	
	var _config = __webpack_require__(1);
	
	var _config2 = _interopRequireDefault(_config);
	
	var DWOLLA_CONTENT_TYPE = 'application/vnd.dwolla.v1.hal+json',
	    UNKNOWN_ERROR = {
	  code: 'UnknownError',
	  message: 'Could not connect to server.'
	};
	
	var api = {
	  post: function post(token, url, body, callback) {
	    var fullUrl = _config2['default'].apiUrl + url,
	        options = {
	      headers: {
	        Authorization: 'Bearer ' + token,
	        Accept: DWOLLA_CONTENT_TYPE,
	        'Content-Type': DWOLLA_CONTENT_TYPE
	      },
	      body: JSON.stringify(body),
	      useXDR: true
	    };
	
	    _xhr2['default'].post(fullUrl, options, responseHandler(callback));
	  }
	};
	
	function responseHandler(callback) {
	  return function (err, res, body) {
	    body = tryParseJson(body);
	
	    if (res.statusCode >= 400) callback(body);else if (res.statusCode === 201) callback(null, transformCreated(res));else if (res.statusCode >= 200) callback(null, body);else callback(UNKNOWN_ERROR);
	  };
	}
	
	function transformCreated(res) {
	  return {
	    _links: {
	      'funding-source': { href: res.headers.location }
	    }
	  };
	}
	
	function tryParseJson(body) {
	  try {
	    body = JSON.parse(body);
	  } catch (e) {
	    if (true) console.warn('Could not parse json: ' + body);
	  }
	
	  return body;
	}
	
	exports['default'] = api;
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var window = __webpack_require__(12);
	var once = __webpack_require__(13);
	var isFunction = __webpack_require__(14);
	var parseHeaders = __webpack_require__(15);
	var xtend = __webpack_require__(18);
	
	module.exports = createXHR;
	createXHR.XMLHttpRequest = window.XMLHttpRequest || noop;
	createXHR.XDomainRequest = "withCredentials" in new createXHR.XMLHttpRequest() ? createXHR.XMLHttpRequest : window.XDomainRequest;
	
	forEachArray(["get", "put", "post", "patch", "head", "delete"], function (method) {
	    createXHR[method === "delete" ? "del" : method] = function (uri, options, callback) {
	        options = initParams(uri, options, callback);
	        options.method = method.toUpperCase();
	        return _createXHR(options);
	    };
	});
	
	function forEachArray(array, iterator) {
	    for (var i = 0; i < array.length; i++) {
	        iterator(array[i]);
	    }
	}
	
	function isEmpty(obj) {
	    for (var i in obj) {
	        if (obj.hasOwnProperty(i)) return false;
	    }
	    return true;
	}
	
	function initParams(uri, options, callback) {
	    var params = uri;
	
	    if (isFunction(options)) {
	        callback = options;
	        if (typeof uri === "string") {
	            params = { uri: uri };
	        }
	    } else {
	        params = xtend(options, { uri: uri });
	    }
	
	    params.callback = callback;
	    return params;
	}
	
	function createXHR(uri, options, callback) {
	    options = initParams(uri, options, callback);
	    return _createXHR(options);
	}
	
	function _createXHR(options) {
	    var callback = options.callback;
	    if (typeof callback === "undefined") {
	        throw new Error("callback argument missing");
	    }
	    callback = once(callback);
	
	    function readystatechange() {
	        if (xhr.readyState === 4) {
	            loadFunc();
	        }
	    }
	
	    function getBody() {
	        // Chrome with requestType=blob throws errors arround when even testing access to responseText
	        var body = undefined;
	
	        if (xhr.response) {
	            body = xhr.response;
	        } else if (xhr.responseType === "text" || !xhr.responseType) {
	            body = xhr.responseText || xhr.responseXML;
	        }
	
	        if (isJson) {
	            try {
	                body = JSON.parse(body);
	            } catch (e) {}
	        }
	
	        return body;
	    }
	
	    var failureResponse = {
	        body: undefined,
	        headers: {},
	        statusCode: 0,
	        method: method,
	        url: uri,
	        rawRequest: xhr
	    };
	
	    function errorFunc(evt) {
	        clearTimeout(timeoutTimer);
	        if (!(evt instanceof Error)) {
	            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error"));
	        }
	        evt.statusCode = 0;
	        callback(evt, failureResponse);
	    }
	
	    // will load the data & process the response in a special response object
	    function loadFunc() {
	        if (aborted) return;
	        var status;
	        clearTimeout(timeoutTimer);
	        if (options.useXDR && xhr.status === undefined) {
	            //IE8 CORS GET successful response doesn't have a status field, but body is fine
	            status = 200;
	        } else {
	            status = xhr.status === 1223 ? 204 : xhr.status;
	        }
	        var response = failureResponse;
	        var err = null;
	
	        if (status !== 0) {
	            response = {
	                body: getBody(),
	                statusCode: status,
	                method: method,
	                headers: {},
	                url: uri,
	                rawRequest: xhr
	            };
	            if (xhr.getAllResponseHeaders) {
	                //remember xhr can in fact be XDR for CORS in IE
	                response.headers = parseHeaders(xhr.getAllResponseHeaders());
	            }
	        } else {
	            err = new Error("Internal XMLHttpRequest Error");
	        }
	        callback(err, response, response.body);
	    }
	
	    var xhr = options.xhr || null;
	
	    if (!xhr) {
	        if (options.cors || options.useXDR) {
	            xhr = new createXHR.XDomainRequest();
	        } else {
	            xhr = new createXHR.XMLHttpRequest();
	        }
	    }
	
	    var key;
	    var aborted;
	    var uri = xhr.url = options.uri || options.url;
	    var method = xhr.method = options.method || "GET";
	    var body = options.body || options.data || null;
	    var headers = xhr.headers = options.headers || {};
	    var sync = !!options.sync;
	    var isJson = false;
	    var timeoutTimer;
	
	    if ("json" in options) {
	        isJson = true;
	        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json"); //Don't override existing accept header declared by user
	        if (method !== "GET" && method !== "HEAD") {
	            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json"); //Don't override existing accept header declared by user
	            body = JSON.stringify(options.json);
	        }
	    }
	
	    xhr.onreadystatechange = readystatechange;
	    xhr.onload = loadFunc;
	    xhr.onerror = errorFunc;
	    // IE9 must have onprogress be set to a unique function.
	    xhr.onprogress = function () {
	        // IE must die
	    };
	    xhr.ontimeout = errorFunc;
	    xhr.open(method, uri, !sync, options.username, options.password);
	    //has to be after open
	    if (!sync) {
	        xhr.withCredentials = !!options.withCredentials;
	    }
	    // Cannot set timeout with sync request
	    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
	    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
	    if (!sync && options.timeout > 0) {
	        timeoutTimer = setTimeout(function () {
	            aborted = true; //IE9 may still call readystatechange
	            xhr.abort("timeout");
	            var e = new Error("XMLHttpRequest timeout");
	            e.code = "ETIMEDOUT";
	            errorFunc(e);
	        }, options.timeout);
	    }
	
	    if (xhr.setRequestHeader) {
	        for (key in headers) {
	            if (headers.hasOwnProperty(key)) {
	                xhr.setRequestHeader(key, headers[key]);
	            }
	        }
	    } else if (options.headers && !isEmpty(options.headers)) {
	        throw new Error("Headers cannot be set on an XDomainRequest object");
	    }
	
	    if ("responseType" in options) {
	        xhr.responseType = options.responseType;
	    }
	
	    if ("beforeSend" in options && typeof options.beforeSend === "function") {
	        options.beforeSend(xhr);
	    }
	
	    xhr.send(body);
	
	    return xhr;
	}
	
	function noop() {}

/***/ },
/* 12 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	var win;
	
	if (typeof window !== "undefined") {
	    win = window;
	} else if (typeof global !== "undefined") {
	    win = global;
	} else if (typeof self !== "undefined") {
	    win = self;
	} else {
	    win = {};
	}
	
	module.exports = win;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = once;
	
	once.proto = once(function () {
	  Object.defineProperty(Function.prototype, 'once', {
	    value: function value() {
	      return once(this);
	    },
	    configurable: true
	  });
	});
	
	function once(fn) {
	  var called = false;
	  return function () {
	    if (called) return;
	    called = true;
	    return fn.apply(this, arguments);
	  };
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = isFunction;
	
	var toString = Object.prototype.toString;
	
	function isFunction(fn) {
	  var string = toString.call(fn);
	  return string === '[object Function]' || typeof fn === 'function' && string !== '[object RegExp]' || typeof window !== 'undefined' && (
	  // IE8 and below
	  fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt);
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var trim = __webpack_require__(16),
	    forEach = __webpack_require__(17),
	    isArray = function isArray(arg) {
	  return Object.prototype.toString.call(arg) === '[object Array]';
	};
	
	module.exports = function (headers) {
	  if (!headers) return {};
	
	  var result = {};
	
	  forEach(trim(headers).split('\n'), function (row) {
	    var index = row.indexOf(':'),
	        key = trim(row.slice(0, index)).toLowerCase(),
	        value = trim(row.slice(index + 1));
	
	    if (typeof result[key] === 'undefined') {
	      result[key] = value;
	    } else if (isArray(result[key])) {
	      result[key].push(value);
	    } else {
	      result[key] = [result[key], value];
	    }
	  });
	
	  return result;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	exports = module.exports = trim;
	
	function trim(str) {
	  return str.replace(/^\s*|\s*$/g, '');
	}
	
	exports.left = function (str) {
	  return str.replace(/^\s*/, '');
	};
	
	exports.right = function (str) {
	  return str.replace(/\s*$/, '');
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isFunction = __webpack_require__(14);
	
	module.exports = forEach;
	
	var toString = Object.prototype.toString;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	function forEach(list, iterator, context) {
	    if (!isFunction(iterator)) {
	        throw new TypeError('iterator must be a function');
	    }
	
	    if (arguments.length < 3) {
	        context = this;
	    }
	
	    if (toString.call(list) === '[object Array]') forEachArray(list, iterator, context);else if (typeof list === 'string') forEachString(list, iterator, context);else forEachObject(list, iterator, context);
	}
	
	function forEachArray(array, iterator, context) {
	    for (var i = 0, len = array.length; i < len; i++) {
	        if (hasOwnProperty.call(array, i)) {
	            iterator.call(context, array[i], i, array);
	        }
	    }
	}
	
	function forEachString(string, iterator, context) {
	    for (var i = 0, len = string.length; i < len; i++) {
	        // no such thing as a sparse string.
	        iterator.call(context, string.charAt(i), i, string);
	    }
	}
	
	function forEachObject(object, iterator, context) {
	    for (var k in object) {
	        if (hasOwnProperty.call(object, k)) {
	            iterator.call(context, object[k], k, object);
	        }
	    }
	}

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = extend;
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	function extend() {
	    var target = {};
	
	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i];
	
	        for (var key in source) {
	            if (hasOwnProperty.call(source, key)) {
	                target[key] = source[key];
	            }
	        }
	    }
	
	    return target;
	}

/***/ }
/******/ ]);
//# sourceMappingURL=dwolla.js.map