(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SpriteRenderer_1 = require("./SpriteRenderer");
SupEngine.registerComponentClass("SpriteRenderer", SpriteRenderer_1.default);

},{"./SpriteRenderer":4}],2:[function(require,module,exports){
(function (process){
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
/*jshint onevar: false, indent:4 */
/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    var _each = function (arr, iterator) {
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(done) );
        });
        function done(err) {
          if (err) {
              callback(err);
              callback = function () {};
          }
          else {
              completed += 1;
              if (completed >= arr.length) {
                  callback();
              }
          }
        }
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        if (!callback) {
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err) {
                    callback(err);
                });
            });
        } else {
            var results = [];
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        var remainingTasks = keys.length
        if (!remainingTasks) {
            return callback();
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            remainingTasks--
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (!remainingTasks) {
                var theCallback = callback;
                // prevent final callback from calling itself if it errors
                callback = function () {};

                theCallback(null, results);
            }
        });

        _each(keys, function (k) {
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        // Use defaults if times not passed
        if (typeof times === 'function') {
            callback = task;
            task = times;
            times = DEFAULT_TIMES;
        }
        // Make sure times is a number
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function(wrappedCallback, wrappedResults) {
            var retryAttempt = function(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            };
            while (times) {
                attempts.push(retryAttempt(task, !(times-=1)));
            }
            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || callback)(data.err, data.result);
            });
        }
        // If a callback is passed, run this as a controll flow
        return callback ? wrappedTask() : wrappedTask
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (test.apply(null, args)) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (!test.apply(null, args)) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            started: false,
            paused: false,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            kill: function () {
              q.drain = null;
              q.tasks = [];
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (!q.paused && workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                if (q.paused === true) { return; }
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= q.concurrency; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
          return a.priority - b.priority;
        };

        function _binarySearch(sequence, item, compare) {
          var beg = -1,
              end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + ((end - beg + 1) >>> 1);
            if (compare(item, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }

        function _insert(q, data, priority, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  priority: priority,
                  callback: typeof callback === 'function' ? callback : null
              };

              q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
          _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            drained: true,
            push: function (data, callback) {
                if (!_isArray(data)) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    cargo.drained = false;
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain && !cargo.drained) cargo.drain();
                    cargo.drained = true;
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0, tasks.length);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                async.nextTick(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    async.compose = function (/* functions... */) {
      return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE = SupEngine.THREE;
var SpriteRendererUpdater_1 = require("./SpriteRendererUpdater");
var SpriteRenderer = (function (_super) {
    __extends(SpriteRenderer, _super);
    function SpriteRenderer(actor) {
        _super.call(this, actor, "SpriteRenderer");
        this.color = { r: 1, g: 1, b: 1 };
        this.hasFrameBeenUpdated = false;
        this.materialType = "basic";
        this.horizontalFlip = false;
        this.verticalFlip = false;
        this.castShadow = false;
        this.receiveShadow = false;
        this.playbackSpeed = 1;
    }
    SpriteRenderer.prototype.setSprite = function (asset, materialType, customShader) {
        this._clearMesh();
        this.asset = asset;
        if (materialType != null)
            this.materialType = materialType;
        this.animationName = null;
        this.animationsByName = {};
        if (this.asset == null || this.asset.textures[this.asset.mapSlots["map"]] == null)
            return;
        this.updateAnimationsByName();
        this.geometry = new THREE.PlaneBufferGeometry(this.asset.grid.width, this.asset.grid.height);
        if (this.materialType === "shader") {
            this.material = SupEngine.componentClasses["Shader"].createShaderMaterial(customShader, this.asset.textures, this.geometry);
            this.material.map = this.asset.textures[this.asset.mapSlots["map"]];
        }
        else {
            var material;
            if (this.materialType === "basic")
                material = new THREE.MeshBasicMaterial();
            else if (this.materialType === "phong") {
                material = new THREE.MeshPhongMaterial();
                material.lightMap = this.asset.textures[this.asset.mapSlots["light"]];
            }
            material.map = this.asset.textures[this.asset.mapSlots["map"]];
            material.specularMap = this.asset.textures[this.asset.mapSlots["specular"]];
            material.alphaMap = this.asset.textures[this.asset.mapSlots["alpha"]];
            if (this.materialType === "phong")
                material.normalMap = this.asset.textures[this.asset.mapSlots["normal"]];
            material.alphaTest = this.asset.alphaTest;
            material.color.setRGB(this.color.r, this.color.g, this.color.b);
            this.material = material;
            this.setOpacity(this.opacity);
        }
        this.material.side = THREE.DoubleSide;
        this.threeMesh = new THREE.Mesh(this.geometry, this.material);
        this.setCastShadow(this.castShadow);
        this.threeMesh.receiveShadow = this.receiveShadow;
        this.setFrame(0);
        this.actor.threeObject.add(this.threeMesh);
        this.updateShape();
    };
    SpriteRenderer.prototype.updateShape = function () {
        if (this.threeMesh == null)
            return;
        var scaleRatio = 1 / this.asset.pixelsPerUnit;
        this.threeMesh.scale.set(scaleRatio, scaleRatio, scaleRatio);
        var x;
        if (this.horizontalFlip)
            x = this.asset.origin.x - 0.5;
        else
            x = 0.5 - this.asset.origin.x;
        var y;
        if (this.verticalFlip)
            y = this.asset.origin.y - 0.5;
        else
            y = 0.5 - this.asset.origin.y;
        this.threeMesh.position.setX(x * this.asset.grid.width * scaleRatio);
        this.threeMesh.position.setY(y * this.asset.grid.height * scaleRatio);
        this.threeMesh.updateMatrixWorld(false);
    };
    SpriteRenderer.prototype.setOpacity = function (opacity) {
        this.opacity = opacity;
        if (this.material == null)
            return;
        if (this.opacity != null) {
            this.material.transparent = true;
            this.material.opacity = this.opacity;
        }
        else {
            this.material.transparent = false;
            this.material.opacity = 1;
        }
        this.material.needsUpdate = true;
    };
    SpriteRenderer.prototype.setHorizontalFlip = function (horizontalFlip) {
        this.horizontalFlip = horizontalFlip;
        if (this.asset == null)
            return;
        this.updateShape();
        if (this.animationName == null)
            this.setFrame(0);
        else
            this.updateFrame(false);
    };
    SpriteRenderer.prototype.setVerticalFlip = function (verticalFlip) {
        this.verticalFlip = verticalFlip;
        if (this.asset == null)
            return;
        this.updateShape();
        if (this.animationName == null)
            this.setFrame(0);
        else
            this.updateFrame(false);
    };
    SpriteRenderer.prototype.updateAnimationsByName = function () {
        this.animationsByName = {};
        for (var _i = 0, _a = this.asset.animations; _i < _a.length; _i++) {
            var animation = _a[_i];
            this.animationsByName[animation.name] = animation;
        }
    };
    SpriteRenderer.prototype._clearMesh = function () {
        if (this.threeMesh == null)
            return;
        this.actor.threeObject.remove(this.threeMesh);
        this.threeMesh.geometry.dispose();
        this.threeMesh.material.dispose();
        this.threeMesh = null;
        this.material = null;
    };
    SpriteRenderer.prototype.setCastShadow = function (castShadow) {
        this.castShadow = castShadow;
        this.threeMesh.castShadow = castShadow;
        if (!castShadow)
            return;
        this.actor.gameInstance.threeScene.traverse(function (object) {
            var material = object.material;
            if (material != null)
                material.needsUpdate = true;
        });
    };
    SpriteRenderer.prototype._destroy = function () {
        this._clearMesh();
        this.asset = null;
        _super.prototype._destroy.call(this);
    };
    SpriteRenderer.prototype.setFrame = function (frame) {
        var map = this.material.map;
        var frameX, frameY;
        if (this.asset.frameOrder === "rows") {
            var framesPerRow = Math.floor(map.size.width / this.asset.grid.width);
            frameX = frame % framesPerRow;
            frameY = Math.floor(frame / framesPerRow);
        }
        else {
            var framesPerColumn = Math.floor(map.size.height / this.asset.grid.height);
            frameX = Math.floor(frame / framesPerColumn);
            frameY = frame % framesPerColumn;
        }
        var left = (frameX * this.asset.grid.width) / map.size.width;
        var right = ((frameX + 1) * this.asset.grid.width) / map.size.width;
        var bottom = (map.size.height - (frameY + 1) * this.asset.grid.height) / map.size.height;
        var top = (map.size.height - frameY * this.asset.grid.height) / map.size.height;
        var tmp;
        if (this.horizontalFlip) {
            tmp = left;
            left = right;
            right = tmp;
        }
        if (this.verticalFlip) {
            tmp = top;
            top = bottom;
            bottom = tmp;
        }
        var uvs = this.geometry.getAttribute("uv");
        uvs.needsUpdate = true;
        uvs.array[0] = left;
        uvs.array[1] = top;
        uvs.array[2] = right;
        uvs.array[3] = top;
        uvs.array[4] = left;
        uvs.array[5] = bottom;
        uvs.array[6] = right;
        uvs.array[7] = bottom;
    };
    SpriteRenderer.prototype.setAnimation = function (newAnimationName, newAnimationLooping) {
        if (newAnimationLooping === void 0) { newAnimationLooping = true; }
        if (newAnimationName != null) {
            var animation = this.animationsByName[newAnimationName];
            if (animation == null)
                throw new Error("Animation " + newAnimationName + " doesn't exist");
            this.animationLooping = newAnimationLooping;
            if (newAnimationName === this.animationName && this.isAnimationPlaying)
                return;
            this.animation = animation;
            this.animationName = newAnimationName;
            this.animationTimer = 0;
            this.isAnimationPlaying = true;
            this.updateFrame();
        }
        else {
            this.animation = null;
            this.animationName = null;
            this.setFrame(0);
        }
    };
    SpriteRenderer.prototype.getAnimation = function () { return this.animationName; };
    SpriteRenderer.prototype.setAnimationFrameTime = function (frameTime) {
        if (this.animationName == null)
            return;
        if (frameTime < 0 || frameTime > this.getAnimationFrameCount())
            throw new Error("Frame time must be >= 0 and < " + this.getAnimationFrameCount());
        this.animationTimer = Math.ceil(frameTime * this.actor.gameInstance.framesPerSecond / this.asset.framesPerSecond);
        this.updateFrame();
    };
    SpriteRenderer.prototype.getAnimationFrameTime = function () {
        if (this.animationName == null)
            return 0;
        return this.computeAbsoluteFrameTime() - this.animation.startFrameIndex;
    };
    SpriteRenderer.prototype.getAnimationFrameIndex = function () {
        if (this.animationName == null)
            return 0;
        return this.computeAbsoluteFrameIndex() - this.animation.startFrameIndex;
    };
    SpriteRenderer.prototype.getAnimationFrameCount = function () {
        if (this.animationName == null)
            return 0;
        return this.animation.endFrameIndex - this.animation.startFrameIndex + 1;
    };
    SpriteRenderer.prototype.playAnimation = function (animationLooping) {
        if (animationLooping === void 0) { animationLooping = true; }
        this.animationLooping = animationLooping;
        this.isAnimationPlaying = true;
        if (!this.animationLooping && this.getAnimationFrameIndex() === this.getAnimationFrameCount() - 1)
            this.animationTimer = 0;
    };
    SpriteRenderer.prototype.pauseAnimation = function () { this.isAnimationPlaying = false; };
    SpriteRenderer.prototype.stopAnimation = function () {
        if (this.animationName == null)
            return;
        this.isAnimationPlaying = false;
        this.animationTimer = 0;
        this.updateFrame();
    };
    SpriteRenderer.prototype.computeAbsoluteFrameTime = function () {
        var frame;
        if (this.playbackSpeed * this.animation.speed >= 0) {
            frame = this.animation.startFrameIndex;
            frame += this.animationTimer * this.playbackSpeed * this.animation.speed / this.actor.gameInstance.framesPerSecond * this.asset.framesPerSecond;
        }
        else {
            frame = this.animation.endFrameIndex;
            frame -= this.animationTimer * Math.abs(this.playbackSpeed * this.animation.speed) / this.actor.gameInstance.framesPerSecond * this.asset.framesPerSecond;
        }
        return frame;
    };
    SpriteRenderer.prototype.computeAbsoluteFrameIndex = function () {
        var frame;
        if (this.playbackSpeed * this.animation.speed >= 0) {
            frame = this.animation.startFrameIndex;
            frame += Math.floor(this.animationTimer * this.playbackSpeed * this.animation.speed / this.actor.gameInstance.framesPerSecond * this.asset.framesPerSecond);
        }
        else {
            frame = this.animation.endFrameIndex;
            frame -= Math.floor(this.animationTimer * Math.abs(this.playbackSpeed * this.animation.speed) / this.actor.gameInstance.framesPerSecond * this.asset.framesPerSecond);
        }
        return frame;
    };
    SpriteRenderer.prototype.updateFrame = function (flagFrameUpdated) {
        if (flagFrameUpdated === void 0) { flagFrameUpdated = true; }
        if (flagFrameUpdated)
            this.hasFrameBeenUpdated = true;
        var frame = this.computeAbsoluteFrameIndex();
        if (frame > this.animation.endFrameIndex) {
            if (this.animationLooping) {
                frame = this.animation.startFrameIndex;
                this.animationTimer = 1;
            }
            else {
                frame = this.animation.endFrameIndex;
                this.animationTimer -= 1;
                this.isAnimationPlaying = false;
            }
        }
        else if (frame < this.animation.startFrameIndex) {
            if (this.animationLooping) {
                frame = this.animation.endFrameIndex;
                this.animationTimer = 1;
            }
            else {
                frame = this.animation.startFrameIndex;
                this.animationTimer -= 1;
                this.isAnimationPlaying = false;
            }
        }
        this.setFrame(frame);
    };
    SpriteRenderer.prototype.update = function () {
        if (this.material != null) {
            var uniforms = this.material.uniforms;
            if (uniforms != null)
                uniforms.time.value += 1 / this.actor.gameInstance.framesPerSecond;
        }
        if (this.hasFrameBeenUpdated) {
            this.hasFrameBeenUpdated = false;
            return;
        }
        this._tickAnimation();
        this.hasFrameBeenUpdated = false;
    };
    SpriteRenderer.prototype._tickAnimation = function () {
        if (this.animationName == null || !this.isAnimationPlaying)
            return;
        this.animationTimer += 1;
        this.updateFrame();
    };
    SpriteRenderer.prototype.setIsLayerActive = function (active) { if (this.threeMesh != null)
        this.threeMesh.visible = active; };
    SpriteRenderer.Updater = SpriteRendererUpdater_1.default;
    return SpriteRenderer;
})(SupEngine.ActorComponent);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SpriteRenderer;

},{"./SpriteRendererUpdater":5}],5:[function(require,module,exports){
var async = require("async");
var THREE = SupEngine.THREE;
var SpriteRendererUpdater = (function () {
    function SpriteRendererUpdater(client, spriteRenderer, config, receiveAssetCallbacks, editAssetCallbacks) {
        this.looping = true;
        this.overrideOpacity = false;
        this.mapObjectURLs = {};
        this.spriteSubscriber = {
            onAssetReceived: this._onSpriteAssetReceived.bind(this),
            onAssetEdited: this._onSpriteAssetEdited.bind(this),
            onAssetTrashed: this._onSpriteAssetTrashed.bind(this)
        };
        this.shaderSubscriber = {
            onAssetReceived: this._onShaderAssetReceived.bind(this),
            onAssetEdited: this._onShaderAssetEdited.bind(this),
            onAssetTrashed: this._onShaderAssetTrashed.bind(this)
        };
        this.client = client;
        this.spriteRenderer = spriteRenderer;
        this.receiveAssetCallbacks = receiveAssetCallbacks;
        this.editAssetCallbacks = editAssetCallbacks;
        this.spriteAssetId = config.spriteAssetId;
        this.animationId = config.animationId;
        this.materialType = config.materialType;
        this.shaderAssetId = config.shaderAssetId;
        if (config.overrideOpacity != null)
            this.overrideOpacity = config.overrideOpacity;
        this.spriteAsset = null;
        this.spriteRenderer.horizontalFlip = config.horizontalFlip;
        this.spriteRenderer.verticalFlip = config.verticalFlip;
        this.spriteRenderer.castShadow = config.castShadow;
        this.spriteRenderer.receiveShadow = config.receiveShadow;
        if (config.overrideOpacity)
            this.spriteRenderer.opacity = config.opacity;
        if (config.color != null) {
            var hex = parseInt(config.color, 16);
            this.spriteRenderer.color.r = (hex >> 16 & 255) / 255;
            this.spriteRenderer.color.g = (hex >> 8 & 255) / 255;
            this.spriteRenderer.color.b = (hex & 255) / 255;
        }
        if (this.spriteAssetId != null)
            this.client.subAsset(this.spriteAssetId, "sprite", this.spriteSubscriber);
        if (this.shaderAssetId != null)
            this.client.subAsset(this.shaderAssetId, "shader", this.shaderSubscriber);
    }
    SpriteRendererUpdater.prototype.destroy = function () {
        if (this.spriteAssetId != null)
            this.client.unsubAsset(this.spriteAssetId, this.spriteSubscriber);
        if (this.shaderAssetId != null)
            this.client.unsubAsset(this.shaderAssetId, this.shaderSubscriber);
    };
    SpriteRendererUpdater.prototype._onSpriteAssetReceived = function (assetId, asset) {
        var _this = this;
        if (this.spriteRenderer.opacity == null)
            this.spriteRenderer.opacity = asset.pub.opacity;
        this.spriteAsset = asset;
        this._prepareMaps(function () {
            _this._setSprite();
            if (_this.receiveAssetCallbacks != null)
                _this.receiveAssetCallbacks.sprite();
        });
    };
    SpriteRendererUpdater.prototype._prepareMaps = function (callback) {
        var _this = this;
        this.spriteAsset.pub.textures = {};
        for (var key in this.mapObjectURLs) {
            URL.revokeObjectURL(this.mapObjectURLs[key]);
            delete this.mapObjectURLs[key];
        }
        async.each(Object.keys(this.spriteAsset.pub.maps), function (key, cb) {
            var buffer = _this.spriteAsset.pub.maps[key];
            if (buffer == null || buffer.byteLength === 0) {
                cb();
                return;
            }
            var texture = _this.spriteAsset.pub.textures[key];
            var image = (texture != null) ? texture.image : null;
            if (image == null) {
                image = new Image;
                texture = _this.spriteAsset.pub.textures[key] = new THREE.Texture(image);
                texture.size = { width: 0, height: 0 };
                if (_this.spriteAsset.pub.filtering === "pixelated") {
                    texture.magFilter = SupEngine.THREE.NearestFilter;
                    texture.minFilter = SupEngine.THREE.NearestFilter;
                }
                var typedArray = new Uint8Array(buffer);
                var blob = new Blob([typedArray], { type: "image/*" });
                image.src = _this.mapObjectURLs[key] = URL.createObjectURL(blob);
            }
            if (!image.complete) {
                image.addEventListener("load", function () {
                    // Three.js might resize our texture to make its dimensions power-of-twos
                    // because of WebGL limitations (see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL#Non_power-of-two_textures)
                    // so we store its original, non-power-of-two size for later use
                    texture.size = { width: image.width, height: image.height };
                    texture.needsUpdate = true;
                    cb();
                    return;
                });
            }
            else
                cb();
        }, callback);
    };
    SpriteRendererUpdater.prototype._setSprite = function () {
        if (this.spriteAsset == null || (this.materialType === "shader" && this.shaderPub == null)) {
            this.spriteRenderer.setSprite(null);
            return;
        }
        this.spriteRenderer.setSprite(this.spriteAsset.pub, this.materialType, this.shaderPub);
        if (this.animationId != null)
            this._playAnimation();
    };
    SpriteRendererUpdater.prototype._playAnimation = function () {
        var animation = this.spriteAsset.animations.byId[this.animationId];
        if (animation == null)
            return;
        this.spriteRenderer.setAnimation(animation.name, this.looping);
    };
    SpriteRendererUpdater.prototype._onSpriteAssetEdited = function (id, command) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var callEditCallback = true;
        var commandFunction = this[("_onEditCommand_" + command)];
        if (commandFunction != null) {
            if (commandFunction.apply(this, args) === false)
                callEditCallback = false;
        }
        if (callEditCallback && this.editAssetCallbacks != null) {
            var editCallback = this.editAssetCallbacks.sprite[command];
            if (editCallback != null)
                editCallback.apply(null, args);
        }
    };
    SpriteRendererUpdater.prototype._onEditCommand_setMaps = function (maps) {
        var _this = this;
        // TODO: Only update the maps that changed, don't recreate the whole model
        this._prepareMaps(function () {
            _this._setSprite();
            var editCallback = (_this.editAssetCallbacks != null) ? _this.editAssetCallbacks.sprite["setMaps"] : null;
            if (editCallback != null)
                editCallback();
        });
        return false;
    };
    SpriteRendererUpdater.prototype._onEditCommand_setMapSlot = function (slot, name) { this._setSprite(); };
    SpriteRendererUpdater.prototype._onEditCommand_deleteMap = function (name) { this._setSprite(); };
    SpriteRendererUpdater.prototype._onEditCommand_setProperty = function (path, value) {
        switch (path) {
            case "filtering":
                for (var textureName in this.spriteAsset.pub.textures) {
                    var texture = this.spriteAsset.pub.textures[textureName];
                    if (this.spriteAsset.pub.filtering === "pixelated") {
                        texture.magFilter = THREE.NearestFilter;
                        texture.minFilter = THREE.NearestFilter;
                    }
                    else {
                        texture.magFilter = THREE.LinearFilter;
                        texture.minFilter = THREE.LinearMipMapLinearFilter;
                    }
                    texture.needsUpdate = true;
                }
                break;
            case "opacity":
                if (!this.overrideOpacity)
                    this.spriteRenderer.setOpacity(value);
                break;
            case "alphaTest":
                this.spriteRenderer.material.alphaTest = value;
                this.spriteRenderer.material.needsUpdate = true;
                break;
            case "pixelsPerUnit":
            case "origin.x":
            case "origin.y":
                this.spriteRenderer.updateShape();
                break;
            default:
                this._setSprite();
                break;
        }
    };
    SpriteRendererUpdater.prototype._onEditCommand_newAnimation = function () {
        this.spriteRenderer.updateAnimationsByName();
        this._playAnimation();
    };
    SpriteRendererUpdater.prototype._onEditCommand_deleteAnimation = function () {
        this.spriteRenderer.updateAnimationsByName();
        this._playAnimation();
    };
    SpriteRendererUpdater.prototype._onEditCommand_setAnimationProperty = function () {
        this.spriteRenderer.updateAnimationsByName();
        this._playAnimation();
    };
    SpriteRendererUpdater.prototype._onSpriteAssetTrashed = function () {
        this.spriteAsset = null;
        this.spriteRenderer.setSprite(null);
        // FIXME: the updater shouldn't be dealing with SupClient.onAssetTrashed directly
        if (this.editAssetCallbacks != null)
            SupClient.onAssetTrashed();
    };
    SpriteRendererUpdater.prototype._onShaderAssetReceived = function (assetId, asset) {
        this.shaderPub = asset.pub;
        this._setSprite();
    };
    SpriteRendererUpdater.prototype._onShaderAssetEdited = function (id, command) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (command !== "editVertexShader" && command !== "editFragmentShader")
            this._setSprite();
    };
    SpriteRendererUpdater.prototype._onShaderAssetTrashed = function () {
        this.shaderPub = null;
        this._setSprite();
    };
    SpriteRendererUpdater.prototype.config_setProperty = function (path, value) {
        switch (path) {
            case "spriteAssetId":
                if (this.spriteAssetId != null)
                    this.client.unsubAsset(this.spriteAssetId, this.spriteSubscriber);
                this.spriteAssetId = value;
                this.spriteAsset = null;
                this.spriteRenderer.setSprite(null);
                if (this.spriteAssetId != null)
                    this.client.subAsset(this.spriteAssetId, "sprite", this.spriteSubscriber);
                break;
            case "animationId":
                this.animationId = value;
                this._setSprite();
                break;
            case "looping":
                this.looping = value;
                if (this.animationId != null)
                    this._playAnimation();
                break;
            case "horizontalFlip":
                this.spriteRenderer.setHorizontalFlip(value);
                break;
            case "verticalFlip":
                this.spriteRenderer.setVerticalFlip(value);
                break;
            case "castShadow":
                this.spriteRenderer.setCastShadow(value);
                break;
            case "receiveShadow":
                this.spriteRenderer.receiveShadow = value;
                this.spriteRenderer.threeMesh.receiveShadow = value;
                this.spriteRenderer.threeMesh.material.needsUpdate = true;
                break;
            case "color":
                var hex = parseInt(value, 16);
                this.spriteRenderer.color.r = (hex >> 16 & 255) / 255;
                this.spriteRenderer.color.g = (hex >> 8 & 255) / 255;
                this.spriteRenderer.color.b = (hex & 255) / 255;
                var material = this.spriteRenderer.threeMesh.material;
                material.color.setRGB(this.spriteRenderer.color.r, this.spriteRenderer.color.g, this.spriteRenderer.color.b);
                material.needsUpdate = true;
                break;
            case "overrideOpacity":
                this.overrideOpacity = value;
                this.spriteRenderer.setOpacity(value ? null : this.spriteAsset.pub.opacity);
                break;
            case "opacity":
                this.spriteRenderer.setOpacity(value);
                break;
            case "materialType":
                this.materialType = value;
                this._setSprite();
                break;
            case "shaderAssetId":
                if (this.shaderAssetId != null)
                    this.client.unsubAsset(this.shaderAssetId, this.shaderSubscriber);
                this.shaderAssetId = value;
                this.shaderPub = null;
                this.spriteRenderer.setSprite(null);
                if (this.shaderAssetId != null)
                    this.client.subAsset(this.shaderAssetId, "shader", this.shaderSubscriber);
                break;
        }
    };
    return SpriteRendererUpdater;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SpriteRendererUpdater;

},{"async":2}]},{},[1]);
