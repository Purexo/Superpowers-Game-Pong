(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ModelRenderer_1 = require("./ModelRenderer");
SupEngine.registerComponentClass("ModelRenderer", ModelRenderer_1.default);

},{"./ModelRenderer":4}],2:[function(require,module,exports){
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
var tmpBoneMatrix = new THREE.Matrix4;
var tmpVec = new THREE.Vector3;
var tmpQuat = new THREE.Quaternion;
var ModelRendererUpdater_1 = require("./ModelRendererUpdater");
function getInterpolationData(keyFrames, time) {
    var prevKeyFrame = keyFrames[keyFrames.length - 1];
    // TODO: Use a cache to maintain most recently used key frames for each bone
    // and profit from temporal contiguity
    var nextKeyFrame;
    for (var _i = 0; _i < keyFrames.length; _i++) {
        var keyFrame = keyFrames[_i];
        nextKeyFrame = keyFrame;
        if (keyFrame.time > time)
            break;
        prevKeyFrame = keyFrame;
    }
    if (prevKeyFrame === nextKeyFrame)
        nextKeyFrame = keyFrames[0];
    var timeSpan = nextKeyFrame.time - prevKeyFrame.time;
    var timeProgress = time - prevKeyFrame.time;
    var t = (timeSpan > 0) ? timeProgress / timeSpan : 0;
    return { prevKeyFrame: prevKeyFrame, nextKeyFrame: nextKeyFrame, t: t };
}
var ModelRenderer = (function (_super) {
    __extends(ModelRenderer, _super);
    function ModelRenderer(actor) {
        _super.call(this, actor, "ModelRenderer");
        this.color = { r: 1, g: 1, b: 1 };
        this.hasPoseBeenUpdated = false;
        this.materialType = "basic";
        this.castShadow = false;
        this.receiveShadow = false;
    }
    ModelRenderer.prototype._clearMesh = function () {
        if (this.skeletonHelper != null) {
            this.actor.threeObject.remove(this.skeletonHelper);
            this.skeletonHelper = null;
        }
        this.actor.threeObject.remove(this.threeMesh);
        this.threeMesh.traverse(function (obj) { if (obj.dispose != null)
            obj.dispose(); });
        this.threeMesh = null;
        this.material.dispose();
        this.material = null;
    };
    ModelRenderer.prototype._destroy = function () {
        if (this.asset != null)
            this._clearMesh();
        this.asset = null;
        _super.prototype._destroy.call(this);
    };
    ModelRenderer.prototype.setModel = function (asset, materialType, customShader) {
        if (this.asset != null)
            this._clearMesh();
        this.animation = null;
        if (asset == null || asset.attributes["position"] == null)
            return;
        this.asset = asset;
        if (materialType != null)
            this.materialType = materialType;
        this.updateAnimationsByName();
        var geometry = new THREE.BufferGeometry;
        if (this.asset.attributes["position"] != null) {
            var buffer = new Float32Array(this.asset.attributes["position"]);
            geometry.addAttribute("position", new THREE.BufferAttribute(buffer, 3));
        }
        if (this.asset.attributes["index"] != null) {
            var buffer = new Uint16Array(this.asset.attributes["index"]);
            geometry.setIndex(new THREE.BufferAttribute(buffer, 1));
        }
        if (this.asset.attributes["uv"] != null) {
            var buffer = new Float32Array(this.asset.attributes["uv"]);
            geometry.addAttribute("uv", new THREE.BufferAttribute(buffer, 2));
        }
        if (this.asset.attributes["normal"] != null) {
            var buffer = new Float32Array(this.asset.attributes["normal"]);
            geometry.addAttribute("normal", new THREE.BufferAttribute(buffer, 3));
        }
        if (this.asset.attributes["color"] != null) {
            var buffer = new Float32Array(this.asset.attributes["color"]);
            geometry.addAttribute("color", new THREE.BufferAttribute(buffer, 3));
        }
        if (this.asset.attributes["skinIndex"] != null) {
            var buffer = new Float32Array(this.asset.attributes["skinIndex"]);
            geometry.addAttribute("skinIndex", new THREE.BufferAttribute(buffer, 4));
        }
        if (this.asset.attributes["skinWeight"] != null) {
            var buffer = new Float32Array(this.asset.attributes["skinWeight"]);
            geometry.addAttribute("skinWeight", new THREE.BufferAttribute(buffer, 4));
        }
        if (this.materialType === "shader") {
            this.material = SupEngine.componentClasses["Shader"].createShaderMaterial(customShader, this.asset.textures, geometry);
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
            material.alphaTest = 0.1;
            this.material = material;
        }
        this.setColor(this.color.r, this.color.g, this.color.b);
        this.setOpacity(this.opacity);
        if (this.asset.bones != null) {
            this.threeMesh = new THREE.SkinnedMesh(geometry, this.material);
            if (this.asset.upAxisMatrix != null) {
                var upAxisMatrix = new THREE.Matrix4().fromArray(this.asset.upAxisMatrix);
                this.threeMesh.applyMatrix(upAxisMatrix);
            }
            var bones = [];
            this.bonesByName = {};
            for (var _i = 0, _a = this.asset.bones; _i < _a.length; _i++) {
                var boneInfo = _a[_i];
                var bone = new THREE.Bone(this.threeMesh);
                bone.name = boneInfo.name;
                this.bonesByName[bone.name] = bone;
                bone.applyMatrix(tmpBoneMatrix.fromArray(boneInfo.matrix));
                bones.push(bone);
            }
            for (var i = 0; i < this.asset.bones.length; i++) {
                var boneInfo = this.asset.bones[i];
                if (boneInfo.parentIndex != null)
                    bones[boneInfo.parentIndex].add(bones[i]);
                else
                    this.threeMesh.add(bones[i]);
            }
            this.threeMesh.updateMatrixWorld(true);
            var useVertexTexture = false;
            this.threeMesh.bind(new THREE.Skeleton(bones, undefined, useVertexTexture));
            this.material.skinning = true;
        }
        else
            this.threeMesh = new THREE.Mesh(geometry, this.material);
        this.setUnitRatio(asset.unitRatio);
        this.setCastShadow(this.castShadow);
        this.threeMesh.receiveShadow = this.receiveShadow;
        this.actor.threeObject.add(this.threeMesh);
        if (geometry.getAttribute("normal") == null) {
            this.threeMesh.geometry.computeVertexNormals();
            this.threeMesh.geometry.computeFaceNormals();
        }
        this.threeMesh.updateMatrixWorld(false);
    };
    ModelRenderer.prototype.setCastShadow = function (castShadow) {
        this.castShadow = castShadow;
        this.threeMesh.castShadow = castShadow;
    };
    ModelRenderer.prototype.setOpacity = function (opacity) {
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
    ModelRenderer.prototype.setColor = function (r, g, b) {
        this.color.r = r;
        this.color.g = g;
        this.color.b = b;
        if (this.material instanceof THREE.ShaderMaterial) {
            var uniforms = this.material.uniforms;
            if (uniforms.color != null)
                uniforms.color.value.setRGB(r, g, b);
        }
        else
            this.material.color.setRGB(r, g, b);
    };
    ModelRenderer.prototype.setUnitRatio = function (unitRatio) {
        if (this.threeMesh == null)
            return;
        var ratio = 1 / unitRatio;
        this.threeMesh.scale.set(ratio, ratio, ratio);
        this.threeMesh.updateMatrixWorld(false);
    };
    ModelRenderer.prototype.setShowSkeleton = function (show) {
        if (show == (this.skeletonHelper != null))
            return;
        if (show) {
            this.skeletonHelper = new THREE.SkeletonHelper(this.threeMesh);
            if (this.asset.upAxisMatrix != null) {
                var upAxisMatrix = new THREE.Matrix4().fromArray(this.asset.upAxisMatrix);
                this.skeletonHelper.root = this.skeletonHelper;
                this.skeletonHelper.applyMatrix(upAxisMatrix);
                this.skeletonHelper.update();
            }
            this.skeletonHelper.material.linewidth = 3;
            this.actor.threeObject.add(this.skeletonHelper);
        }
        else {
            this.actor.threeObject.remove(this.skeletonHelper);
            this.skeletonHelper = null;
        }
        if (this.threeMesh != null)
            this.threeMesh.updateMatrixWorld(true);
    };
    ModelRenderer.prototype.updateAnimationsByName = function () {
        this.animationsByName = {};
        for (var _i = 0, _a = this.asset.animations; _i < _a.length; _i++) {
            var animation = _a[_i];
            this.animationsByName[animation.name] = animation;
        }
    };
    ModelRenderer.prototype.setAnimation = function (newAnimationName, newAnimationLooping) {
        if (newAnimationLooping === void 0) { newAnimationLooping = true; }
        if (newAnimationName != null) {
            var newAnimation = this.animationsByName[newAnimationName];
            if (newAnimation == null)
                throw new Error("Animation " + newAnimationName + " doesn't exist");
            if (newAnimation === this.animation && this.isAnimationPlaying)
                return;
            this.animation = newAnimation;
            this.animationLooping = newAnimationLooping;
            this.animationTimer = 0;
            this.isAnimationPlaying = true;
        }
        else {
            this.animation = null;
            this.clearPose();
        }
        return;
    };
    ModelRenderer.prototype.getAnimation = function () { return (this.animation != null) ? this.animation.name : null; };
    ModelRenderer.prototype.setAnimationTime = function (time) {
        if (typeof time !== "number" || time < 0 || time > this.getAnimationDuration())
            throw new Error("Invalid time");
        this.animationTimer = time * this.actor.gameInstance.framesPerSecond;
        this.updatePose();
    };
    ModelRenderer.prototype.getAnimationTime = function () { return (this.animation != null) ? this.animationTimer / this.actor.gameInstance.framesPerSecond : 0; };
    ModelRenderer.prototype.getAnimationDuration = function () {
        if (this.animation == null || this.animation.duration == null)
            return 0;
        return this.animation.duration;
    };
    ModelRenderer.prototype.playAnimation = function (animationLooping) {
        if (animationLooping === void 0) { animationLooping = true; }
        this.animationLooping = animationLooping;
        this.isAnimationPlaying = true;
    };
    ModelRenderer.prototype.pauseAnimation = function () { this.isAnimationPlaying = false; };
    ModelRenderer.prototype.stopAnimation = function () {
        if (this.animation == null)
            return;
        this.isAnimationPlaying = false;
        this.animationTimer = 0;
        this.updatePose();
    };
    ModelRenderer.prototype.clearPose = function () {
        if (this.threeMesh == null)
            return;
        for (var i = 0; i < this.threeMesh.skeleton.bones.length; i++) {
            var bone = this.threeMesh.skeleton.bones[i];
            bone.matrix.fromArray(this.asset.bones[i].matrix);
            bone.matrix.decompose(bone.position, bone.quaternion, bone.scale);
        }
        this.threeMesh.updateMatrixWorld(false);
        if (this.skeletonHelper != null)
            this.skeletonHelper.update();
    };
    ModelRenderer.prototype.getBoneTransform = function (name) {
        if (!this.hasPoseBeenUpdated)
            this._tickAnimation();
        var position = new THREE.Vector3;
        var orientation = new THREE.Quaternion;
        var scale = new THREE.Vector3;
        if (this.bonesByName == null || this.bonesByName[name] == null)
            return null;
        this.bonesByName[name].matrixWorld.decompose(position, orientation, scale);
        return { position: position, orientation: orientation, scale: scale };
    };
    ModelRenderer.prototype.updatePose = function () {
        this.hasPoseBeenUpdated = true;
        // TODO: this.asset.speedMultiplier
        var speedMultiplier = 1;
        var time = this.animationTimer * speedMultiplier / this.actor.gameInstance.framesPerSecond;
        if (time > this.animation.duration) {
            if (this.animationLooping) {
                this.animationTimer -= this.animation.duration * this.actor.gameInstance.framesPerSecond / speedMultiplier;
                time -= this.animation.duration;
            }
            else {
                time = this.animation.duration;
                this.isAnimationPlaying = false;
            }
        }
        for (var i = 0; i < this.threeMesh.skeleton.bones.length; i++) {
            var bone = this.threeMesh.skeleton.bones[i];
            var boneKeyFrames = this.animation.keyFrames[bone.name];
            if (boneKeyFrames == null)
                continue;
            if (boneKeyFrames.translation != null) {
                var _a = getInterpolationData(boneKeyFrames.translation, time), prevKeyFrame = _a.prevKeyFrame, nextKeyFrame = _a.nextKeyFrame, t = _a.t;
                bone.position.fromArray(prevKeyFrame.value);
                bone.position.lerp(tmpVec.fromArray(nextKeyFrame.value), t);
            }
            if (boneKeyFrames.rotation != null) {
                var _b = getInterpolationData(boneKeyFrames.rotation, time), prevKeyFrame = _b.prevKeyFrame, nextKeyFrame = _b.nextKeyFrame, t = _b.t;
                bone.quaternion.fromArray(prevKeyFrame.value);
                bone.quaternion.slerp(tmpQuat.fromArray(nextKeyFrame.value), t);
            }
            if (boneKeyFrames.scale != null) {
                var _c = getInterpolationData(boneKeyFrames.scale, time), prevKeyFrame = _c.prevKeyFrame, nextKeyFrame = _c.nextKeyFrame, t = _c.t;
                bone.scale.fromArray(prevKeyFrame.value);
                bone.scale.lerp(tmpVec.fromArray(nextKeyFrame.value), t);
            }
        }
        this.threeMesh.updateMatrixWorld(false);
        if (this.skeletonHelper != null)
            this.skeletonHelper.update();
    };
    ModelRenderer.prototype.update = function () {
        if (this.material != null) {
            var uniforms = this.material.uniforms;
            if (uniforms != null)
                uniforms.time.value += 1 / this.actor.gameInstance.framesPerSecond;
        }
        if (this.hasPoseBeenUpdated) {
            this.hasPoseBeenUpdated = false;
            return;
        }
        this._tickAnimation();
        this.hasPoseBeenUpdated = false;
    };
    ModelRenderer.prototype._tickAnimation = function () {
        if (this.threeMesh == null || this.threeMesh.skeleton == null)
            return;
        if (this.animation == null || this.animation.duration === 0 || !this.isAnimationPlaying)
            return;
        this.animationTimer += 1;
        this.updatePose();
    };
    ModelRenderer.prototype.setIsLayerActive = function (active) { if (this.threeMesh != null)
        this.threeMesh.visible = active; };
    ModelRenderer.Updater = ModelRendererUpdater_1.default;
    return ModelRenderer;
})(SupEngine.ActorComponent);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelRenderer;

},{"./ModelRendererUpdater":5}],5:[function(require,module,exports){
var async = require("async");
var THREE = SupEngine.THREE;
var ModelRendererUpdater = (function () {
    function ModelRendererUpdater(client, modelRenderer, config, receiveAssetCallbacks, editAssetCallbacks) {
        this.overrideOpacity = false;
        this.modelAsset = null;
        this.mapObjectURLs = {};
        this.modelSubscriber = {
            onAssetReceived: this._onModelAssetReceived.bind(this),
            onAssetEdited: this._onModelAssetEdited.bind(this),
            onAssetTrashed: this._onModelAssetTrashed.bind(this)
        };
        this.shaderSubscriber = {
            onAssetReceived: this._onShaderAssetReceived.bind(this),
            onAssetEdited: this._onShaderAssetEdited.bind(this),
            onAssetTrashed: this._onShaderAssetTrashed.bind(this)
        };
        this.client = client;
        this.modelRenderer = modelRenderer;
        this.receiveAssetCallbacks = receiveAssetCallbacks;
        this.editAssetCallbacks = editAssetCallbacks;
        this.modelAssetId = config.modelAssetId;
        this.animationId = config.animationId;
        this.materialType = config.materialType;
        this.shaderAssetId = config.shaderAssetId;
        if (config.overrideOpacity != null)
            this.overrideOpacity = config.overrideOpacity;
        this.modelRenderer.castShadow = config.castShadow;
        this.modelRenderer.receiveShadow = config.receiveShadow;
        if (config.overrideOpacity)
            this.modelRenderer.opacity = config.opacity;
        if (config.color != null) {
            var hex = parseInt(config.color, 16);
            this.modelRenderer.color.r = (hex >> 16 & 255) / 255;
            this.modelRenderer.color.g = (hex >> 8 & 255) / 255;
            this.modelRenderer.color.b = (hex & 255) / 255;
        }
        if (this.modelAssetId != null)
            this.client.subAsset(this.modelAssetId, "model", this.modelSubscriber);
        if (this.shaderAssetId != null)
            this.client.subAsset(this.shaderAssetId, "shader", this.shaderSubscriber);
    }
    ModelRendererUpdater.prototype.destroy = function () {
        if (this.modelAssetId != null)
            this.client.unsubAsset(this.modelAssetId, this.modelSubscriber);
        if (this.shaderAssetId != null)
            this.client.unsubAsset(this.shaderAssetId, this.shaderSubscriber);
    };
    ModelRendererUpdater.prototype._onModelAssetReceived = function (assetId, asset) {
        var _this = this;
        if (this.modelRenderer.opacity == null)
            this.modelRenderer.opacity = asset.pub.opacity;
        this.modelAsset = asset;
        this._prepareMaps(function () {
            _this._setModel();
            if (_this.receiveAssetCallbacks != null)
                _this.receiveAssetCallbacks.model();
        });
    };
    ModelRendererUpdater.prototype._prepareMaps = function (callback) {
        var _this = this;
        this.modelAsset.pub.textures = {};
        for (var key in this.mapObjectURLs) {
            URL.revokeObjectURL(this.mapObjectURLs[key]);
            delete this.mapObjectURLs[key];
        }
        async.each(Object.keys(this.modelAsset.pub.maps), function (key, cb) {
            var buffer = _this.modelAsset.pub.maps[key];
            if (buffer == null || buffer.byteLength === 0) {
                cb();
                return;
            }
            var texture = _this.modelAsset.pub.textures[key];
            var image = (texture != null) ? texture.image : null;
            if (image == null) {
                image = new Image;
                texture = _this.modelAsset.pub.textures[key] = new THREE.Texture(image);
                if (_this.modelAsset.pub.filtering === "pixelated") {
                    texture.magFilter = SupEngine.THREE.NearestFilter;
                    texture.minFilter = SupEngine.THREE.NearestFilter;
                }
                if (_this.modelAsset.pub.wrapping === "repeat") {
                    texture.wrapS = SupEngine.THREE.RepeatWrapping;
                    texture.wrapT = SupEngine.THREE.RepeatWrapping;
                }
                else if (_this.modelAsset.pub.wrapping === "mirroredRepeat") {
                    texture.wrapS = SupEngine.THREE.MirroredRepeatWrapping;
                    texture.wrapT = SupEngine.THREE.MirroredRepeatWrapping;
                }
                var typedArray = new Uint8Array(buffer);
                var blob = new Blob([typedArray], { type: "image/*" });
                image.src = _this.mapObjectURLs[key] = URL.createObjectURL(blob);
            }
            if (!image.complete) {
                image.addEventListener("load", function () { texture.needsUpdate = true; cb(); return; });
            }
            else
                cb();
        }, callback);
    };
    ModelRendererUpdater.prototype._setModel = function () {
        if (this.modelAsset == null || (this.materialType === "shader" && this.shaderPub == null)) {
            this.modelRenderer.setModel(null);
            return;
        }
        this.modelRenderer.setModel(this.modelAsset.pub, this.materialType, this.shaderPub);
        if (this.animationId != null)
            this._playAnimation();
    };
    ModelRendererUpdater.prototype._playAnimation = function () {
        var animation = this.modelAsset.animations.byId[this.animationId];
        this.modelRenderer.setAnimation((animation != null) ? animation.name : null);
    };
    ModelRendererUpdater.prototype._onModelAssetEdited = function (id, command) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var commandCallback = this[("_onEditCommand_" + command)];
        if (commandCallback != null)
            commandCallback.apply(this, args);
        if (this.editAssetCallbacks != null) {
            var editCallback = this.editAssetCallbacks.model[command];
            if (editCallback != null)
                editCallback.apply(null, args);
        }
    };
    ModelRendererUpdater.prototype._onEditCommand_setModel = function () {
        this._setModel();
    };
    ModelRendererUpdater.prototype._onEditCommand_setMaps = function (maps) {
        var _this = this;
        // TODO: Only update the maps that changed, don't recreate the whole model
        this._prepareMaps(function () {
            _this._setModel();
        });
    };
    ModelRendererUpdater.prototype._onEditCommand_newAnimation = function (animation, index) {
        this.modelRenderer.updateAnimationsByName();
        this._playAnimation();
    };
    ModelRendererUpdater.prototype._onEditCommand_deleteAnimation = function (id) {
        this.modelRenderer.updateAnimationsByName();
        this._playAnimation();
    };
    ModelRendererUpdater.prototype._onEditCommand_setAnimationProperty = function (id, key, value) {
        this.modelRenderer.updateAnimationsByName();
        this._playAnimation();
    };
    ModelRendererUpdater.prototype._onEditCommand_setMapSlot = function (slot, name) { this._setModel(); };
    ModelRendererUpdater.prototype._onEditCommand_deleteMap = function (name) { this._setModel(); };
    ModelRendererUpdater.prototype._onEditCommand_setProperty = function (path, value) {
        switch (path) {
            case "filtering":
                for (var textureName in this.modelAsset.pub.textures) {
                    var texture = this.modelAsset.pub.textures[textureName];
                    if (value === "pixelated") {
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
            case "wrapping":
                for (var textureName in this.modelAsset.pub.textures) {
                    var texture = this.modelAsset.pub.textures[textureName];
                    if (value === "clampToEdge") {
                        texture.wrapS = SupEngine.THREE.ClampToEdgeWrapping;
                        texture.wrapT = SupEngine.THREE.ClampToEdgeWrapping;
                    }
                    else if (value === "repeat") {
                        texture.wrapS = SupEngine.THREE.RepeatWrapping;
                        texture.wrapT = SupEngine.THREE.RepeatWrapping;
                    }
                    else if (value === "mirroredRepeat") {
                        texture.wrapS = SupEngine.THREE.MirroredRepeatWrapping;
                        texture.wrapT = SupEngine.THREE.MirroredRepeatWrapping;
                    }
                    texture.needsUpdate = true;
                }
                break;
            case "unitRatio":
                this.modelRenderer.setUnitRatio(value);
                break;
            case "opacity":
                if (!this.overrideOpacity)
                    this.modelRenderer.setOpacity(value);
                break;
        }
    };
    ModelRendererUpdater.prototype._onModelAssetTrashed = function () {
        this.modelAsset = null;
        this.modelRenderer.setModel(null);
        // FIXME: the updater shouldn't be dealing with SupClient.onAssetTrashed directly
        if (this.editAssetCallbacks != null)
            SupClient.onAssetTrashed();
    };
    ModelRendererUpdater.prototype._onShaderAssetReceived = function (assetId, asset) {
        this.shaderPub = asset.pub;
        this._setModel();
    };
    ModelRendererUpdater.prototype._onShaderAssetEdited = function (id, command) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (command !== "editVertexShader" && command !== "editFragmentShader")
            this._setModel();
    };
    ModelRendererUpdater.prototype._onShaderAssetTrashed = function () {
        this.shaderPub = null;
        this._setModel();
    };
    ModelRendererUpdater.prototype.config_setProperty = function (path, value) {
        switch (path) {
            case "modelAssetId":
                if (this.modelAssetId != null)
                    this.client.unsubAsset(this.modelAssetId, this.modelSubscriber);
                this.modelAssetId = value;
                this.modelAsset = null;
                this.modelRenderer.setModel(null, null);
                if (this.modelAssetId != null)
                    this.client.subAsset(this.modelAssetId, "model", this.modelSubscriber);
                break;
            case "animationId":
                this.animationId = value;
                if (this.modelAsset != null)
                    this._playAnimation();
                break;
            case "castShadow":
                this.modelRenderer.setCastShadow(value);
                break;
            case "receiveShadow":
                this.modelRenderer.threeMesh.receiveShadow = value;
                this.modelRenderer.threeMesh.material.needsUpdate = true;
                break;
            case "overrideOpacity":
                this.overrideOpacity = value;
                this.modelRenderer.setOpacity(value ? null : this.modelAsset.pub.opacity);
                break;
            case "opacity":
                this.modelRenderer.setOpacity(value);
                break;
            case "color":
                var hex = parseInt(value, 16);
                this.modelRenderer.setColor((hex >> 16 & 255) / 255, (hex >> 8 & 255) / 255, (hex & 255) / 255);
                break;
            case "materialType":
                this.materialType = value;
                this._setModel();
                break;
            case "shaderAssetId":
                if (this.shaderAssetId != null)
                    this.client.unsubAsset(this.shaderAssetId, this.shaderSubscriber);
                this.shaderAssetId = value;
                this.shaderPub = null;
                this.modelRenderer.setModel(null);
                if (this.shaderAssetId != null)
                    this.client.subAsset(this.shaderAssetId, "shader", this.shaderSubscriber);
                break;
        }
    };
    return ModelRendererUpdater;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelRendererUpdater;

},{"async":2}]},{},[1]);
