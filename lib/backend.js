"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.clearMainBindings = exports.mainBindings = exports.preloadBindings = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = require("lodash");

var _utils = require("./utils");

var _uuid = require("uuid");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// CONFIGS
var defaultOptions = {
  debug: false,
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  // Where the translation files get loaded from
  addPath: '/locales/{{lng}}/{{ns}}.missing.json' // Where the missing translation files get generated

}; // Electron-specific; must match mainIpc

var readFileRequest = 'ReadFile-Request';
var writeFileRequest = 'WriteFile-Request';
var readFileResponse = 'ReadFile-Response';
var writeFileResponse = 'WriteFile-Response';
var changeLanguageRequest = 'ChangeLanguage-Request'; // This is the code that will go into the preload.js file
// in order to set up the contextBridge api

var preloadBindings = function preloadBindings(ipcRenderer) {
  return {
    send: function send(channel, data) {
      var validChannels = [readFileRequest, writeFileRequest];

      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    onReceive: function onReceive(channel, func) {
      var validChannels = [readFileResponse, writeFileResponse];

      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes "sender"
        ipcRenderer.on(channel, function (event, args) {
          return func(args);
        });
      }
    },
    onLanguageChange: function onLanguageChange(func) {
      // Deliberately strip event as it includes "sender"
      ipcRenderer.on(changeLanguageRequest, function (event, args) {
        return func(args);
      });
    }
  };
}; // This is the code that will go into the main.js file
// in order to set up the ipc main bindings


exports.preloadBindings = preloadBindings;

var mainBindings = function mainBindings(ipcMain, browserWindow, fs, distPath) {
  ipcMain.on(readFileRequest, function (IpcMainEvent, args) {
    var callback = function (error, data) {
      this.webContents.send(readFileResponse, {
        key: args.key,
        error: error,
        data: typeof data !== 'undefined' && data !== null ? data.toString() : ''
      });
    }.bind(browserWindow);

    fs.readFile("".concat(distPath).concat(args.filename), callback);
  });
  ipcMain.on(writeFileRequest, function (IpcMainEvent, args) {
    var callback = function (error) {
      this.webContents.send(writeFileResponse, {
        keys: args.keys,
        error: error
      });
    }.bind(browserWindow); // https://stackoverflow.com/a/51721295/1837080


    var separator = '/';
    var windowsSeparator = '\\';
    if (args.filename.includes(windowsSeparator)) separator = windowsSeparator;
    var root = args.filename.slice(0, args.filename.lastIndexOf(separator));
    fs.mkdir(root, {
      recursive: true
    }, function (error) {
      fs.writeFile(args.filename, JSON.stringify(args.data), callback);
    });
  });
}; // Clears the bindings from ipcMain;
// in case app is closed/reopened (only on macos)


exports.mainBindings = mainBindings;

var clearMainBindings = function clearMainBindings(ipcMain) {
  ipcMain.removeAllListeners(readFileRequest);
  ipcMain.removeAllListeners(writeFileRequest);
}; // Template is found at: https://www.i18next.com/misc/creating-own-plugins#backend;
// also took code from: https://github.com/i18next/i18next-node-fs-backend


exports.clearMainBindings = clearMainBindings;

var Backend = /*#__PURE__*/function () {
  function Backend(services) {
    var backendOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var i18nextOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck2.default)(this, Backend);
    this.init(services, backendOptions, i18nextOptions);
    this.readCallbacks = {}; // Callbacks after reading a translation

    this.writeCallbacks = {}; // Callbacks after writing a missing translation

    this.writeTimeout = undefined; // A timer that will initiate writing missing translations to files

    this.writeQueue = []; // An array to hold missing translations before the writeTimeout occurs

    this.writeQueueOverflow = []; // An array to hold missing translations while the writeTimeout's items are being written to file

    this.useOverflow = false; // If true, we should insert missing translations into the writeQueueOverflow
  }

  (0, _createClass2.default)(Backend, [{
    key: "init",
    value: function init(services, backendOptions, i18nextOptions) {
      if (typeof window.api.i18nextElectronBackend === 'undefined') {
        throw Error('\'window.api.i18nextElectronBackend\' is not defined! Be sure you are setting up your BrowserWindow\'s preload script properly!');
      }

      this.services = services;
      this.backendOptions = _objectSpread(_objectSpread(_objectSpread({}, defaultOptions), backendOptions), {}, {
        i18nextElectronBackend: window.api.i18nextElectronBackend
      });
      this.i18nextOptions = i18nextOptions; // log-related

      var logPrepend = '[i18next-electron-fs-backend:';
      this.mainLog = "".concat(logPrepend, "main]=>");
      this.rendererLog = "".concat(logPrepend, "renderer]=>");
      this.setupIpcBindings();
    } // Sets up Ipc bindings so that we can keep any node-specific
    // modules; (ie. 'fs') out of the Electron renderer process

  }, {
    key: "setupIpcBindings",
    value: function setupIpcBindings() {
      var _this = this;

      var i18nextElectronBackend = this.backendOptions.i18nextElectronBackend;
      i18nextElectronBackend.onReceive(readFileResponse, function (args) {
        // args:
        // {
        //   key
        //   error
        //   data
        // }
        // Don't know why we need this line;
        // upon initialization, the i18next library
        // ends up in this .on([channel], args) method twice
        if (typeof _this.readCallbacks[args.key] === 'undefined') return;
        var callback;

        if (args.error) {
          // Failed to read translation file;
          // we pass back a fake "success" response
          // so that we create a translation file
          callback = _this.readCallbacks[args.key].callback;
          delete _this.readCallbacks[args.key];
          if (callback !== null && typeof callback === 'function') callback(null, {});
        } else {
          var result;
          args.data = args.data.replace(/^\uFEFF/, '');

          try {
            result = JSON.parse(args.data);
          } catch (parseError) {
            parseError.message = "Error parsing '".concat(args.filename, "'. Message: '").concat(parseError, "'.");
            callback = _this.readCallbacks[args.key].callback;
            delete _this.readCallbacks[args.key];
            if (callback !== null && typeof callback === 'function') callback(parseError);
            return;
          }

          callback = _this.readCallbacks[args.key].callback;
          delete _this.readCallbacks[args.key];
          if (callback !== null && typeof callback === 'function') callback(null, result);
        }
      });
      i18nextElectronBackend.onReceive(writeFileResponse, function (args) {
        // args:
        // {
        //   keys
        //   error
        // }
        var keys = args.keys;

        for (var i = 0; i < keys.length; i++) {
          var callback = void 0; // Write methods don't have any callbacks from what I've seen,
          // so this is called more than I thought; but necessary!

          if (typeof _this.writeCallbacks[keys[i]] === 'undefined') return;

          if (args.error) {
            callback = _this.writeCallbacks[keys[i]].callback;
            delete _this.writeCallbacks[keys[i]];
            callback(args.error);
          } else {
            callback = _this.writeCallbacks[keys[i]].callback;
            delete _this.writeCallbacks[keys[i]];
            callback(null, true);
          }
        }
      });
    } // Writes a given translation to file

  }, {
    key: "write",
    value: function write(writeQueue) {
      var _this2 = this;

      var _this$backendOptions = this.backendOptions,
          debug = _this$backendOptions.debug,
          i18nextElectronBackend = _this$backendOptions.i18nextElectronBackend; // Group by filename so we can make one request
      // for all changes within a given file

      var toWork = (0, _utils.groupByArray)(writeQueue, 'filename');

      var _loop = function _loop(i) {
        var anonymous = function (error, data) {
          if (error) {
            console.error("".concat(this.rendererLog, " encountered error when trying to read file '").concat(data.filename, "' before writing missing translation ('").concat(data.key, "'/'").concat(data.fallbackValue, "') to file. Please resolve this error so missing translation values can be written to file. Error: '").concat(error, "'."));
            return;
          }

          var keySeparator = !!this.i18nextOptions.keySeparator; // Do we have a key separator or not?

          var writeKeys = [];

          for (var j = 0; j < toWork[i].values.length; j++) {
            // If we have no key separator set, simply update the translation value
            if (!keySeparator) {
              data[toWork[i].values[j].key] = toWork[i].values[j].fallbackValue;
            } else {
              // Created the nested object structure based on the key separator, and merge that
              // into the existing translation data
              data = (0, _utils.mergeNested)(data, toWork[i].values[j].key, this.i18nextOptions.keySeparator, toWork[i].values[j].fallbackValue);
            }

            var writeKey = "".concat((0, _uuid.v4)());

            if (toWork[i].values[j].callback) {
              this.writeCallbacks[writeKey] = {
                callback: toWork[i].values[j].callback
              };
              writeKeys.push(writeKey);
            }
          } // Send out the message to the ipcMain process


          if (debug) {
            console.log("".concat(this.rendererLog, " requesting the missing key '").concat(data.key, "' be written to file '").concat(data.filename, "'."));
          }

          i18nextElectronBackend.send(writeFileRequest, {
            keys: writeKeys,
            filename: toWork[i].key,
            data: data
          });
        }.bind(_this2);

        _this2.requestFileRead(toWork[i].key, anonymous);
      };

      for (var i = 0; i < toWork.length; i++) {
        _loop(i);
      }
    } // Reads a given translation file

  }, {
    key: "requestFileRead",
    value: function requestFileRead(filename, callback) {
      var i18nextElectronBackend = this.backendOptions.i18nextElectronBackend; // Save the callback for this request so we
      // can execute once the ipcRender process returns
      // with a value from the ipcMain process

      var key = "".concat((0, _uuid.v4)());
      this.readCallbacks[key] = {
        callback: callback
      }; // Send out the message to the ipcMain process

      i18nextElectronBackend.send(readFileRequest, {
        key: key,
        filename: filename
      });
    } // Reads a given translation file

  }, {
    key: "read",
    value: function read(language, namespace, callback) {
      var loadPath = this.backendOptions.loadPath;
      var filename = this.services.interpolator.interpolate(loadPath, {
        lng: language,
        ns: namespace
      });
      this.requestFileRead(filename, function (error, data) {
        if (error) return callback(error, false); // no retry

        callback(null, data);
      });
    } // Not implementing at this time

  }, {
    key: "readMulti",
    value: function readMulti(languages, namespaces, callback) {
      throw Error('Not implemented exception.');
    } // Writes a missing translation to file

  }, {
    key: "create",
    value: function create(languages, namespace, key, fallbackValue, callback) {
      var addPath = this.backendOptions.addPath;
      var filename;
      languages = typeof languages === 'string' ? [languages] : languages; // Create the missing translation for all languages

      for (var i = 0; i < languages.length; i++) {
        filename = this.services.interpolator.interpolate(addPath, {
          lng: languages[i],
          ns: namespace
        }); // If we are currently writing missing translations from writeQueue,
        // temporarily store the requests in writeQueueOverflow until we are
        // done writing to file

        if (this.useOverflow) {
          this.writeQueueOverflow.push({
            filename: filename,
            key: key,
            fallbackValue: fallbackValue,
            callback: callback
          });
        } else {
          this.writeQueue.push({
            filename: filename,
            key: key,
            fallbackValue: fallbackValue,
            callback: callback
          });
        }
      } // Fire up the timeout to process items to write


      if (this.writeQueue.length > 0 && !this.useOverflow) {
        // Clear out any existing timeout if we are still getting translations to write
        if (typeof this.writeTimeout !== 'undefined') {
          clearInterval(this.writeTimeout);
        }

        this.writeTimeout = setInterval(function () {
          // Write writeQueue entries, then after,
          // fill in any from the writeQueueOverflow
          if (this.writeQueue.length > 0) {
            this.write((0, _lodash.cloneDeep)(this.writeQueue));
          }

          this.writeQueue = (0, _lodash.cloneDeep)(this.writeQueueOverflow);
          this.writeQueueOverflow = [];

          if (this.writeQueue.length === 0) {
            // Clear timer
            clearInterval(this.writeTimeout);
            delete this.writeTimeout;
            this.useOverflow = false;
          }
        }.bind(this), 1000);
        this.useOverflow = true;
      }
    }
  }]);
  return Backend;
}();

Backend.type = 'backend';
var _default = Backend;
exports.default = _default;