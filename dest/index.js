(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],5:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":3,"./encode":4}],6:[function(require,module,exports){
let bind = require('./src/_bind')
let exec = require('./src/_exec')
let factory = require('./src/_factory')

/**
 * bind accepts an object, in this case the factory function, and
 * applies exec to the Slack API methods as defined in api.json
 */
module.exports = bind(factory, exec)

},{"./src/_bind":7,"./src/_exec":8,"./src/_factory":10}],7:[function(require,module,exports){
var api = require('./api.json')

/**
 * reads api.json and generates a matching javascript object
 * the leaf nodes bind the method name to the passed in exec function
 */
module.exports = function _bind(ns, exec) {

  // walks the generated api.json keys dynamically constructing the client
  Object.keys(api).forEach(key=> {

    // each key is namespaced so we break up into an array to work with 
    // example: api.test --> ['api', 'test']
    var parts = key.split('.')

    // then we get the root part of the namespace
    // example: 'api'
    var root = parts.shift() 
  
    // initialize the root namespace object if it wasn't already
    var init = typeof ns[root] === 'undefined'
    if (init) {
      ns[root] = {} 
    }

    // walks the remaining namespace parts assigning the _exec function at the end
    ;(function _iterator(o) {
      var bit = parts.shift()
      var last = parts.length === 0
      if (last) {
        o[bit] = exec.bind({}, key)
      }
      else {
        var init = typeof o[bit] === 'undefined'
        if (init) {
          o[bit] = {}
        }
        // keep iterating
        _iterator(o[bit])
      }
    })(ns[root])
  })

  return ns
}

},{"./api.json":14}],8:[function(require,module,exports){
let validate = require('./_validate')
let origin = require('./_origin')
let encode = encodeURIComponent
let serialize = o=> Object.keys(o).map(k=> encode(k) + '=' + encode(o[k])).join('&')

/**
 * returns a promise if callback isn't defined; _exec is the actual impl
 */
module.exports = function exec(url, params, callback) {
  if (!callback) {
    return new Promise(function(resolve, reject) {
      _exec(url, params, function __exec(err, res) {
        if (err) {
          reject(err)
        }
        else { 
          resolve(res)
        }
      })
    })
  }
  else {
    _exec(url, params, callback)
  }
}

async function _exec(url, params, callback) {
  try {
    // validates the params against api.json
    var err = validate(url, params)
    if (err) throw err

    // stringify any objects under keys since form 
    // is posted as application/x-www-form-urlencoded
    Object.keys(params).forEach(function (key) {
      if (typeof params[key] === 'object') {
        params[key] = JSON.stringify(params[key])
      }
    })

    var opts = {
      method: 'POST', 
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: serialize(params)
    }

    var res = await fetch(`${origin}/api/${url}`, opts)
    var json = await res.json()

    if (json.error) {
      var e = Error(json.error)
      if (json.response_metadata && json.response_metadata.messages) {
        e.messages = json.response_metadata.messages
      }
      callback(e)
    }
    else if (res.status === 429) {
      var e = Error('ratelimited')
      e.retry = res.headers.get('retry-after')
      callback(e)
    }
    else {
      callback(null, json)
    }
  }
  catch(e) {
    callback(e)
  }
}

},{"./_origin":11,"./_validate":13}],9:[function(require,module,exports){
var qs = require('querystring')
var url = require('url')
var validate = require('./_validate')
var promisify = require('./_promisify')
var origin = require('./_origin')

/**
 * returns a promise if callback isn't defined; _exec is the actual impl
 */
module.exports = function electronFactory(options) {
  var exec = _execFactory(options)
  return function _execElectron(url, form, callback) {
    if (!callback) {
      var pfy = promisify(exec)
      return pfy(url, form)
    }
    else {
      exec(url, form, callback)
    }
  }
}

/**
 * performs the http request to the Slack Web API
 */
function _execFactory(options) {
  // returns an exec function with options.username and options.password passed in
  return function __exec(url, form, callback) {
    var err = validate(url, form)
    if (err) {
      callback(err)
    }
    else {
      // stringify any objects under keys since form is posted as application/x-www-form-urlencoded
      Object.keys(form).forEach(function (key) {
        if (typeof form[key] === 'object') {
          form[key] = JSON.stringify(form[key])
        }
      })
      // setup post params
      var params = {
        url: `${origin}/api/${url}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: form
      }
      // add optionals
      if (options) {
        params = Object.assign({}, params, options) 
      }
      _post(params, function _res(err, res) {
        if (err) {
          callback(err)
        }
        else if (res.statusCode === 429) {
          var e = Error('ratelimited')
          e.retry = res.headers['retry-after']
          callback(e)
        }
        else if (res.body && res.body.error) {
          var e = Error(res.body.error)
          if (res.body.response_metadata && res.body.response_metadata.messages) {
            e.messages = res.body.response_metadata.messages
          }
          callback(e)
        }
        else {
          callback(null, res.body)
        }
      })
    }
  }
}

/**
 * this method uses electron.net or electron.remote.net
 * it also does not fire the 'end' if it is registered after 'data' 
 */
function _post(options, callback) {
  // parse out the options from options.url
  var opts = url.parse(options.url)
  opts.method = 'POST'
  opts.rejectUnauthorized = false
  opts.headers = options.headers || {}
  opts.headers['User-Agent'] = 'tiny-http'

  var req = options.useElectronNet.request(opts) 
  var raw = []

  req.on('response', function _req(response) {
    // these are order dependent??
    response.on('abort', callback)
    response.on('error', callback)
    response.on('login', function _login(auth, login) {
      // if the dev passes in a login function delegate to that
      if (options.login) {
        options.login(auth, login)
      }
      else {
        // otherwise fallback to ctor params if they exist
        // if these are undefined abort gets called
        login(options.username, options.password)
      }
    })
    response.on('end', function _end() {
      var body = JSON.parse(raw.join(''))
      callback(null, {body})
    })
    response.on('data', chunk=> raw.push(chunk))
  })
  req.write(qs.stringify(options.data))
  req.end()
}

},{"./_origin":11,"./_promisify":12,"./_validate":13,"querystring":5,"url":15}],10:[function(require,module,exports){
var bind = require('./_bind')
var exec = require('./_exec')
var electronExec = require('./_exec-electron')

/** 
 * factory returns a new instance of Slack
 * 
 * things to understand:
 *
 * - this function is the root object exported 
 * - can be a constuctor for creating oo style instances of Slack 
 * - requires named params to allow for future flexability in the function sig
 * - all methods have token pre applied
 * - all methods either accept a callback or return a promise
 */
module.exports = function factory(xxx) {
  
  // allow for empty params
  if (!xxx) xxx = {}

  // override exec to use electron.net via explicit opt-in
  if (xxx.useElectronNet) {
    exec = electronExec(xxx)
  }

  // Slack instance applies the token param to all the api methods
  class Slack {
    constructor() {
      function _execWithToken(method, params={}, callback) {
        params.token = params && params.token || xxx.token
        return exec(method, params, callback)
      }
      // bind applies the above method to this obj
      // bind also returns all methods promisified
      bind(this, _execWithToken)
    }
  }

  return new Slack
}

},{"./_bind":7,"./_exec":8,"./_exec-electron":9}],11:[function(require,module,exports){
(function (process){
var origin = 'https://slack.com'

// allow configuring the url if steno is running on a non-standard port/host
if (process.env.STENO_URL) {
  origin = process.env.STENO_URL
}

module.exports = origin

}).call(this,require('_process'))
},{"_process":1}],12:[function(require,module,exports){
module.exports = function _promisify(orig) {
  return function(...args) {
    return new Promise(function(resolve, reject) {
      function errback(err, result) {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      }
      args.push(errback)
      orig.apply({}, args)
    })
  }
}

},{}],13:[function(require,module,exports){
var api = require('./api.json')

module.exports = function validate(method, params) {
  // get all the requried params for this method
  let required = api[method]
  // collect any missing params
  let missing = required.filter(param=> typeof params[param] === 'undefined')
  // optimistic: assume the best but have a plan for the worst
  return missing.length? Error(`${method} missing params: ${missing.join(', ')}`) : false
}

},{"./api.json":14}],14:[function(require,module,exports){
module.exports={
  "api.test": [],
  "apps.permissions.info": [
    "token"
  ],
  "apps.permissions.request": [
    "token",
    "scopes",
    "trigger_id"
  ],
  "auth.revoke": [
    "token"
  ],
  "auth.test": [
    "token"
  ],
  "bots.info": [
    "token"
  ],
  "channels.archive": [
    "token",
    "channel"
  ],
  "channels.create": [
    "token",
    "name"
  ],
  "channels.history": [
    "token",
    "channel"
  ],
  "channels.info": [
    "token",
    "channel"
  ],
  "channels.invite": [
    "token",
    "channel",
    "user"
  ],
  "channels.join": [
    "token",
    "name"
  ],
  "channels.kick": [
    "token",
    "channel",
    "user"
  ],
  "channels.leave": [
    "token",
    "channel"
  ],
  "channels.list": [
    "token"
  ],
  "channels.mark": [
    "token",
    "channel",
    "ts"
  ],
  "channels.rename": [
    "token",
    "channel",
    "name"
  ],
  "channels.replies": [
    "token",
    "channel",
    "thread_ts"
  ],
  "channels.setPurpose": [
    "token",
    "channel",
    "purpose"
  ],
  "channels.setTopic": [
    "token",
    "channel",
    "topic"
  ],
  "channels.unarchive": [
    "token",
    "channel"
  ],
  "chat.delete": [
    "token",
    "channel",
    "ts"
  ],
  "chat.getPermalink": [
    "token",
    "channel",
    "message_ts"
  ],
  "chat.meMessage": [
    "token",
    "channel",
    "text"
  ],
  "chat.postEphemeral": [
    "token",
    "channel",
    "text",
    "user"
  ],
  "chat.postMessage": [
    "token",
    "channel",
    "text"
  ],
  "chat.unfurl": [
    "token",
    "channel",
    "ts",
    "unfurls"
  ],
  "chat.update": [
    "token",
    "channel",
    "text",
    "ts"
  ],
  "conversations.archive": [
    "token",
    "channel"
  ],
  "conversations.close": [
    "token",
    "channel"
  ],
  "conversations.create": [
    "token",
    "name"
  ],
  "conversations.history": [
    "token",
    "channel"
  ],
  "conversations.info": [
    "token",
    "channel"
  ],
  "conversations.invite": [
    "token",
    "channel",
    "users"
  ],
  "conversations.join": [
    "token",
    "channel"
  ],
  "conversations.kick": [
    "token",
    "channel",
    "user"
  ],
  "conversations.leave": [
    "token",
    "channel"
  ],
  "conversations.list": [
    "token"
  ],
  "conversations.members": [
    "token",
    "channel"
  ],
  "conversations.open": [
    "token"
  ],
  "conversations.rename": [
    "token",
    "channel",
    "name"
  ],
  "conversations.replies": [
    "token",
    "channel",
    "ts"
  ],
  "conversations.setPurpose": [
    "token",
    "channel",
    "purpose"
  ],
  "conversations.setTopic": [
    "token",
    "channel",
    "topic"
  ],
  "conversations.unarchive": [
    "token",
    "channel"
  ],
  "dialog.open": [
    "token",
    "dialog",
    "trigger_id"
  ],
  "dnd.endDnd": [
    "token"
  ],
  "dnd.endSnooze": [
    "token"
  ],
  "dnd.info": [
    "token"
  ],
  "dnd.setSnooze": [
    "token",
    "num_minutes"
  ],
  "dnd.teamInfo": [
    "token"
  ],
  "emoji.list": [
    "token"
  ],
  "files.comments.add": [
    "token",
    "comment",
    "file"
  ],
  "files.comments.delete": [
    "token",
    "file",
    "id"
  ],
  "files.comments.edit": [
    "token",
    "comment",
    "file",
    "id"
  ],
  "files.delete": [
    "token",
    "file"
  ],
  "files.info": [
    "token",
    "file"
  ],
  "files.list": [
    "token"
  ],
  "files.revokePublicURL": [
    "token",
    "file"
  ],
  "files.sharedPublicURL": [
    "token",
    "file"
  ],
  "files.upload": [
    "token"
  ],
  "groups.archive": [
    "token",
    "channel"
  ],
  "groups.create": [
    "token",
    "name"
  ],
  "groups.createChild": [
    "token",
    "channel"
  ],
  "groups.history": [
    "token",
    "channel"
  ],
  "groups.info": [
    "token",
    "channel"
  ],
  "groups.invite": [
    "token",
    "channel",
    "user"
  ],
  "groups.kick": [
    "token",
    "channel",
    "user"
  ],
  "groups.leave": [
    "token",
    "channel"
  ],
  "groups.list": [
    "token"
  ],
  "groups.mark": [
    "token",
    "channel",
    "ts"
  ],
  "groups.open": [
    "token",
    "channel"
  ],
  "groups.rename": [
    "token",
    "channel",
    "name"
  ],
  "groups.replies": [
    "token",
    "channel",
    "thread_ts"
  ],
  "groups.setPurpose": [
    "token",
    "channel",
    "purpose"
  ],
  "groups.setTopic": [
    "token",
    "channel",
    "topic"
  ],
  "groups.unarchive": [
    "token",
    "channel"
  ],
  "im.close": [
    "token",
    "channel"
  ],
  "im.history": [
    "token",
    "channel"
  ],
  "im.list": [
    "token"
  ],
  "im.mark": [
    "token",
    "channel",
    "ts"
  ],
  "im.open": [
    "token",
    "user"
  ],
  "im.replies": [
    "token",
    "channel",
    "thread_ts"
  ],
  "migration.exchange": [
    "token",
    "users"
  ],
  "mpim.close": [
    "token",
    "channel"
  ],
  "mpim.history": [
    "token",
    "channel"
  ],
  "mpim.list": [
    "token"
  ],
  "mpim.mark": [
    "token",
    "channel",
    "ts"
  ],
  "mpim.open": [
    "token",
    "users"
  ],
  "mpim.replies": [
    "token",
    "channel",
    "thread_ts"
  ],
  "oauth.access": [
    "client_id",
    "client_secret",
    "code"
  ],
  "oauth.token": [
    "client_id",
    "client_secret",
    "code"
  ],
  "pins.add": [
    "token",
    "channel"
  ],
  "pins.list": [
    "token",
    "channel"
  ],
  "pins.remove": [
    "token",
    "channel"
  ],
  "reactions.add": [
    "token",
    "name"
  ],
  "reactions.get": [
    "token"
  ],
  "reactions.list": [
    "token"
  ],
  "reactions.remove": [
    "token",
    "name"
  ],
  "reminders.add": [
    "token",
    "text",
    "time"
  ],
  "reminders.complete": [
    "token",
    "reminder"
  ],
  "reminders.delete": [
    "token",
    "reminder"
  ],
  "reminders.info": [
    "token",
    "reminder"
  ],
  "reminders.list": [
    "token"
  ],
  "rtm.connect": [
    "token"
  ],
  "rtm.start": [
    "token"
  ],
  "search.all": [
    "token",
    "query"
  ],
  "search.files": [
    "token",
    "query"
  ],
  "search.messages": [
    "token",
    "query"
  ],
  "stars.add": [
    "token"
  ],
  "stars.list": [
    "token"
  ],
  "stars.remove": [
    "token"
  ],
  "team.accessLogs": [
    "token"
  ],
  "team.billableInfo": [
    "token"
  ],
  "team.info": [
    "token"
  ],
  "team.integrationLogs": [
    "token"
  ],
  "team.profile.get": [
    "token"
  ],
  "usergroups.create": [
    "token",
    "name"
  ],
  "usergroups.disable": [
    "token",
    "usergroup"
  ],
  "usergroups.enable": [
    "token",
    "usergroup"
  ],
  "usergroups.list": [
    "token"
  ],
  "usergroups.update": [
    "token",
    "usergroup"
  ],
  "usergroups.users.list": [
    "token",
    "usergroup"
  ],
  "usergroups.users.update": [
    "token",
    "usergroup",
    "users"
  ],
  "users.deletePhoto": [
    "token"
  ],
  "users.getPresence": [
    "token",
    "user"
  ],
  "users.identity": [
    "token"
  ],
  "users.info": [
    "token",
    "user"
  ],
  "users.list": [
    "token"
  ],
  "users.lookupByEmail": [
    "token",
    "email"
  ],
  "users.setActive": [
    "token"
  ],
  "users.setPhoto": [
    "token",
    "image"
  ],
  "users.setPresence": [
    "token",
    "presence"
  ],
  "users.profile.get": [
    "token"
  ],
  "users.profile.set": [
    "token"
  ]
}

},{}],15:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":16,"punycode":2,"querystring":5}],16:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],17:[function(require,module,exports){
'use strict';

//星座定義
var ZODIAC_SIGN = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座'];

},{}],18:[function(require,module,exports){
'use strict';

var PARROTS = [':angel_parrot:', ':angry_parrot:', ':aussie_parrot:', ':aussieconga_parrot:', ':aussiereverseconga_parrot:', ':banana_parrot:', ':beer_parrot:', ':beret_parrot:', ':birthdayparty_parrot:', ':blondesassy_parrot:', ':bluesclues_parrot:', ':blunt_parrot:', ':bored_parrot:', ':bunny_parrot:', ':ceiling_parrot:', ':chill_parrot:', ':christmas_parrot:', ':coffee_parrot:', ':confused_parrot:', ':conga_parrot:', ':conga_party_parrot:', ':cop_parrot:', ':crypto_parrot:', ':dad_parrot:', ':darkbeer_parrot:', ':deal_withit_parrot:', ':disco_parrot:', ':donut_parrot:', ':dreidel_parrot:', ':evil_parrot:', ':explody_parrot:', ':fast_parrot:', ':fidget_parrot:', ':fiesta_parrot:', ':flying_money_parrot:', ':gentleman_parrot:', ':goth_parrot:', ':halal_parrot:', ':hamburger_parrot:', ':hard_hat_parrot:', ':harrypotter_parrot:', ':icecream_parrot:', ':invisible_parrot:', ':jedi_parrot:', ':love_parrot:', ':lucky_parrot:', ':mardigras_parrot:', ':margarita_parrot:', ':matrix_parrot:', ':middle_parrot:', ':moonwalking_parrot:', ':mustache_parrot:', ':norwegianblue_parrot:', ':oldtimey_parrot:', ':papal_parrot:', ':parrot:', ':parrot_pizza:', ':party_parrot:', ':pirate_parrot:', ':popcorn_parrot:', ':portal_parrot:', ':portalblue_parrot:', ':portalorange_parrot:', ':pride_parrot:', ':pumpkin_parrot:', ':reverseconga_parrot:', ':revolution_parrot:', ':right_parrot:', ':rotating_parrot:', ':ryangosling_parrot:', ':sad_parrot:', ':sassy_parrot:', ':science_parrot:', ':shipit_parrot:', ':shuffle_parrot:', ':shufflefurther_parrot:', ':shuffleparty_parrot:', ':sint_parrot:', ':sith_parrot:', ':ski_parrot:', ':sleep_parrot:', ':slomo_parrot:', ':slow_parrot:', ':sovjet_parrot:', ':stable_parrot:', ':stalker_parrot:', ':sushi_parrot:', ':taco_parrot:', ':thumbsup_parrot:', ':triplets_parrot:', ':twins_parrot:', ':ultra_fast_parrot:', ':upvoteparty_parrot:', ':wave1_parrot:', ':wave2_parrot:', ':wave3_parrot:', ':wave4_parrot:', ':wave5_parrot:', ':wave6_parrot:', ':wave7_parrot:', ':wendy_parrot:'];

},{}],19:[function(require,module,exports){
'use strict';

// Bot Token
var BOT_TOKEN = 'xoxb-271269027749-378628507698-7iTEQK6JWYo8FWzo1YjlMPFT';

// Channel list
var CHANNEL = {
  PARROT_BOT: 'CB43901DX'
};

},{}],20:[function(require,module,exports){
'use strict';

var _slack = require('slack');

var _slack2 = _interopRequireDefault(_slack);

var _slack3 = require('./consts/slack');

var _slack4 = require('./util/slack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Instances
var slack = new _slack2.default();

//オウム投下
slack.chat.postMessage({
    token: _slack3.BOT_TOKEN, // ※Bot token
    channel: _slack3.CHANNEL.PARROT_BOT,
    text: (0, _slack4.getHoroscope)()
}).then(console.log('Message posted')).catch(function (err) {
    console.log(err.error);
});

},{"./consts/slack":19,"./util/slack":22,"slack":6}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLuckParrot = exports.getRandomParrot = undefined;

var _parrot = require('../consts/parrot');

var getRandomParrot = exports.getRandomParrot = function getRandomParrot() {
  return _parrot.PARROTS[Math.floor(Math.random() * parrots.length)];
};

var getLuckParrot = exports.getLuckParrot = function getLuckParrot(parrot) {
  switch (parrot) {
    case ':dad_parrot:':
      return parrot + '\u3042\u30FC\u3053\u308C\u306F\u3072\u3069\u3044\u308F';

    case ':ultra_fast_parrot:':
      return parrot + '<\uFF77\uFF80\uFF70\uFF70\uFF70\uFF70!! \uFF77\uFF6E\uFF73\uFF8A\uFF82\uFF72\uFF83\uFF99!!';

    default:
      return parrot;
  }
};

},{"../consts/parrot":18}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHoroscope = undefined;

var _parrot = require('./parrot');

var _constellation = require('../consts/constellation');

var getHoroscope = exports.getHoroscope = function getHoroscope() {
  //最初のコメント
  var postMsg = 'おはようございます！今日のラッキーオウムを発表しまーす！！\r\n';

  //占い用のコメント
  postMsg += '--------------------------------\n\r';

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _constellation.ZODIAC_SIGN[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      constellation = _step.value;

      postMsg += constellation + ' \u306E\u4ECA\u65E5\u306E\u30E9\u30C3\u30AD\u30FC\u30AA\u30A6\u30E0\u306F ' + (0, _parrot.getLuckParrot)((0, _parrot.getRandomParrot)()) + '\n\r';
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  postMsg += '--------------------------------\n\r';

  //〆のコメント
  postMsg += 'それでは今日も張り切っていきましょオウム！\n\r';

  for (var i = 0; i < _constellation.ZODIAC_SIGN.length; i++) {
    postMsg += (0, _parrot.getRandomParrot)();
  }

  postMsg += '\n\r';

  return postMsg;
};

},{"../consts/constellation":17,"./parrot":21}]},{},[20]);
