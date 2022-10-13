"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/defer-to-connect/dist/source/index.js
var require_source = __commonJS({
  "node_modules/defer-to-connect/dist/source/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function isTLSSocket(socket) {
      return socket.encrypted;
    }
    var deferToConnect2 = (socket, fn) => {
      let listeners;
      if (typeof fn === "function") {
        const connect2 = fn;
        listeners = { connect: connect2 };
      } else {
        listeners = fn;
      }
      const hasConnectListener = typeof listeners.connect === "function";
      const hasSecureConnectListener = typeof listeners.secureConnect === "function";
      const hasCloseListener = typeof listeners.close === "function";
      const onConnect = () => {
        if (hasConnectListener) {
          listeners.connect();
        }
        if (isTLSSocket(socket) && hasSecureConnectListener) {
          if (socket.authorized) {
            listeners.secureConnect();
          } else if (!socket.authorizationError) {
            socket.once("secureConnect", listeners.secureConnect);
          }
        }
        if (hasCloseListener) {
          socket.once("close", listeners.close);
        }
      };
      if (socket.writable && !socket.connecting) {
        onConnect();
      } else if (socket.connecting) {
        socket.once("connect", onConnect);
      } else if (socket.destroyed && hasCloseListener) {
        listeners.close(socket._hadError);
      }
    };
    exports2.default = deferToConnect2;
    module2.exports = deferToConnect2;
    module2.exports.default = deferToConnect2;
  }
});

// node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS({
  "node_modules/get-stream/buffer-stream.js"(exports2, module2) {
    "use strict";
    var { PassThrough: PassThroughStream2 } = require("stream");
    module2.exports = (options) => {
      options = { ...options };
      const { array } = options;
      let { encoding } = options;
      const isBuffer2 = encoding === "buffer";
      let objectMode = false;
      if (array) {
        objectMode = !(encoding || isBuffer2);
      } else {
        encoding = encoding || "utf8";
      }
      if (isBuffer2) {
        encoding = null;
      }
      const stream2 = new PassThroughStream2({ objectMode });
      if (encoding) {
        stream2.setEncoding(encoding);
      }
      let length = 0;
      const chunks = [];
      stream2.on("data", (chunk) => {
        chunks.push(chunk);
        if (objectMode) {
          length = chunks.length;
        } else {
          length += chunk.length;
        }
      });
      stream2.getBufferedValue = () => {
        if (array) {
          return chunks;
        }
        return isBuffer2 ? Buffer.concat(chunks, length) : chunks.join("");
      };
      stream2.getBufferedLength = () => length;
      return stream2;
    };
  }
});

// node_modules/get-stream/index.js
var require_get_stream = __commonJS({
  "node_modules/get-stream/index.js"(exports2, module2) {
    "use strict";
    var { constants: BufferConstants } = require("buffer");
    var stream2 = require("stream");
    var { promisify: promisify5 } = require("util");
    var bufferStream = require_buffer_stream();
    var streamPipelinePromisified = promisify5(stream2.pipeline);
    var MaxBufferError = class extends Error {
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    };
    async function getStream2(inputStream, options) {
      if (!inputStream) {
        throw new Error("Expected a stream");
      }
      options = {
        maxBuffer: Infinity,
        ...options
      };
      const { maxBuffer } = options;
      const stream3 = bufferStream(options);
      await new Promise((resolve, reject) => {
        const rejectPromise = (error) => {
          if (error && stream3.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
            error.bufferedData = stream3.getBufferedValue();
          }
          reject(error);
        };
        (async () => {
          try {
            await streamPipelinePromisified(inputStream, stream3);
            resolve();
          } catch (error) {
            rejectPromise(error);
          }
        })();
        stream3.on("data", () => {
          if (stream3.getBufferedLength() > maxBuffer) {
            rejectPromise(new MaxBufferError());
          }
        });
      });
      return stream3.getBufferedValue();
    }
    module2.exports = getStream2;
    module2.exports.buffer = (stream3, options) => getStream2(stream3, { ...options, encoding: "buffer" });
    module2.exports.array = (stream3, options) => getStream2(stream3, { ...options, array: true });
    module2.exports.MaxBufferError = MaxBufferError;
  }
});

// node_modules/http-cache-semantics/index.js
var require_http_cache_semantics = __commonJS({
  "node_modules/http-cache-semantics/index.js"(exports2, module2) {
    "use strict";
    var statusCodeCacheableByDefault = /* @__PURE__ */ new Set([
      200,
      203,
      204,
      206,
      300,
      301,
      404,
      405,
      410,
      414,
      501
    ]);
    var understoodStatuses = /* @__PURE__ */ new Set([
      200,
      203,
      204,
      300,
      301,
      302,
      303,
      307,
      308,
      404,
      405,
      410,
      414,
      501
    ]);
    var errorStatusCodes = /* @__PURE__ */ new Set([
      500,
      502,
      503,
      504
    ]);
    var hopByHopHeaders = {
      date: true,
      connection: true,
      "keep-alive": true,
      "proxy-authenticate": true,
      "proxy-authorization": true,
      te: true,
      trailer: true,
      "transfer-encoding": true,
      upgrade: true
    };
    var excludedFromRevalidationUpdate = {
      "content-length": true,
      "content-encoding": true,
      "transfer-encoding": true,
      "content-range": true
    };
    function toNumberOrZero(s) {
      const n = parseInt(s, 10);
      return isFinite(n) ? n : 0;
    }
    function isErrorResponse(response) {
      if (!response) {
        return true;
      }
      return errorStatusCodes.has(response.status);
    }
    function parseCacheControl(header) {
      const cc = {};
      if (!header)
        return cc;
      const parts = header.trim().split(/\s*,\s*/);
      for (const part of parts) {
        const [k, v] = part.split(/\s*=\s*/, 2);
        cc[k] = v === void 0 ? true : v.replace(/^"|"$/g, "");
      }
      return cc;
    }
    function formatCacheControl(cc) {
      let parts = [];
      for (const k in cc) {
        const v = cc[k];
        parts.push(v === true ? k : k + "=" + v);
      }
      if (!parts.length) {
        return void 0;
      }
      return parts.join(", ");
    }
    module2.exports = class CachePolicy {
      constructor(req, res, {
        shared,
        cacheHeuristic,
        immutableMinTimeToLive,
        ignoreCargoCult,
        _fromObject
      } = {}) {
        if (_fromObject) {
          this._fromObject(_fromObject);
          return;
        }
        if (!res || !res.headers) {
          throw Error("Response headers missing");
        }
        this._assertRequestHasHeaders(req);
        this._responseTime = this.now();
        this._isShared = shared !== false;
        this._cacheHeuristic = void 0 !== cacheHeuristic ? cacheHeuristic : 0.1;
        this._immutableMinTtl = void 0 !== immutableMinTimeToLive ? immutableMinTimeToLive : 24 * 3600 * 1e3;
        this._status = "status" in res ? res.status : 200;
        this._resHeaders = res.headers;
        this._rescc = parseCacheControl(res.headers["cache-control"]);
        this._method = "method" in req ? req.method : "GET";
        this._url = req.url;
        this._host = req.headers.host;
        this._noAuthorization = !req.headers.authorization;
        this._reqHeaders = res.headers.vary ? req.headers : null;
        this._reqcc = parseCacheControl(req.headers["cache-control"]);
        if (ignoreCargoCult && "pre-check" in this._rescc && "post-check" in this._rescc) {
          delete this._rescc["pre-check"];
          delete this._rescc["post-check"];
          delete this._rescc["no-cache"];
          delete this._rescc["no-store"];
          delete this._rescc["must-revalidate"];
          this._resHeaders = Object.assign({}, this._resHeaders, {
            "cache-control": formatCacheControl(this._rescc)
          });
          delete this._resHeaders.expires;
          delete this._resHeaders.pragma;
        }
        if (res.headers["cache-control"] == null && /no-cache/.test(res.headers.pragma)) {
          this._rescc["no-cache"] = true;
        }
      }
      now() {
        return Date.now();
      }
      storable() {
        return !!(!this._reqcc["no-store"] && ("GET" === this._method || "HEAD" === this._method || "POST" === this._method && this._hasExplicitExpiration()) && understoodStatuses.has(this._status) && !this._rescc["no-store"] && (!this._isShared || !this._rescc.private) && (!this._isShared || this._noAuthorization || this._allowsStoringAuthenticated()) && (this._resHeaders.expires || this._rescc["max-age"] || this._isShared && this._rescc["s-maxage"] || this._rescc.public || statusCodeCacheableByDefault.has(this._status)));
      }
      _hasExplicitExpiration() {
        return this._isShared && this._rescc["s-maxage"] || this._rescc["max-age"] || this._resHeaders.expires;
      }
      _assertRequestHasHeaders(req) {
        if (!req || !req.headers) {
          throw Error("Request headers missing");
        }
      }
      satisfiesWithoutRevalidation(req) {
        this._assertRequestHasHeaders(req);
        const requestCC = parseCacheControl(req.headers["cache-control"]);
        if (requestCC["no-cache"] || /no-cache/.test(req.headers.pragma)) {
          return false;
        }
        if (requestCC["max-age"] && this.age() > requestCC["max-age"]) {
          return false;
        }
        if (requestCC["min-fresh"] && this.timeToLive() < 1e3 * requestCC["min-fresh"]) {
          return false;
        }
        if (this.stale()) {
          const allowsStale = requestCC["max-stale"] && !this._rescc["must-revalidate"] && (true === requestCC["max-stale"] || requestCC["max-stale"] > this.age() - this.maxAge());
          if (!allowsStale) {
            return false;
          }
        }
        return this._requestMatches(req, false);
      }
      _requestMatches(req, allowHeadMethod) {
        return (!this._url || this._url === req.url) && this._host === req.headers.host && (!req.method || this._method === req.method || allowHeadMethod && "HEAD" === req.method) && this._varyMatches(req);
      }
      _allowsStoringAuthenticated() {
        return this._rescc["must-revalidate"] || this._rescc.public || this._rescc["s-maxage"];
      }
      _varyMatches(req) {
        if (!this._resHeaders.vary) {
          return true;
        }
        if (this._resHeaders.vary === "*") {
          return false;
        }
        const fields = this._resHeaders.vary.trim().toLowerCase().split(/\s*,\s*/);
        for (const name of fields) {
          if (req.headers[name] !== this._reqHeaders[name])
            return false;
        }
        return true;
      }
      _copyWithoutHopByHopHeaders(inHeaders) {
        const headers = {};
        for (const name in inHeaders) {
          if (hopByHopHeaders[name])
            continue;
          headers[name] = inHeaders[name];
        }
        if (inHeaders.connection) {
          const tokens = inHeaders.connection.trim().split(/\s*,\s*/);
          for (const name of tokens) {
            delete headers[name];
          }
        }
        if (headers.warning) {
          const warnings = headers.warning.split(/,/).filter((warning) => {
            return !/^\s*1[0-9][0-9]/.test(warning);
          });
          if (!warnings.length) {
            delete headers.warning;
          } else {
            headers.warning = warnings.join(",").trim();
          }
        }
        return headers;
      }
      responseHeaders() {
        const headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
        const age = this.age();
        if (age > 3600 * 24 && !this._hasExplicitExpiration() && this.maxAge() > 3600 * 24) {
          headers.warning = (headers.warning ? `${headers.warning}, ` : "") + '113 - "rfc7234 5.5.4"';
        }
        headers.age = `${Math.round(age)}`;
        headers.date = new Date(this.now()).toUTCString();
        return headers;
      }
      date() {
        const serverDate = Date.parse(this._resHeaders.date);
        if (isFinite(serverDate)) {
          return serverDate;
        }
        return this._responseTime;
      }
      age() {
        let age = this._ageValue();
        const residentTime = (this.now() - this._responseTime) / 1e3;
        return age + residentTime;
      }
      _ageValue() {
        return toNumberOrZero(this._resHeaders.age);
      }
      maxAge() {
        if (!this.storable() || this._rescc["no-cache"]) {
          return 0;
        }
        if (this._isShared && (this._resHeaders["set-cookie"] && !this._rescc.public && !this._rescc.immutable)) {
          return 0;
        }
        if (this._resHeaders.vary === "*") {
          return 0;
        }
        if (this._isShared) {
          if (this._rescc["proxy-revalidate"]) {
            return 0;
          }
          if (this._rescc["s-maxage"]) {
            return toNumberOrZero(this._rescc["s-maxage"]);
          }
        }
        if (this._rescc["max-age"]) {
          return toNumberOrZero(this._rescc["max-age"]);
        }
        const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;
        const serverDate = this.date();
        if (this._resHeaders.expires) {
          const expires = Date.parse(this._resHeaders.expires);
          if (Number.isNaN(expires) || expires < serverDate) {
            return 0;
          }
          return Math.max(defaultMinTtl, (expires - serverDate) / 1e3);
        }
        if (this._resHeaders["last-modified"]) {
          const lastModified = Date.parse(this._resHeaders["last-modified"]);
          if (isFinite(lastModified) && serverDate > lastModified) {
            return Math.max(
              defaultMinTtl,
              (serverDate - lastModified) / 1e3 * this._cacheHeuristic
            );
          }
        }
        return defaultMinTtl;
      }
      timeToLive() {
        const age = this.maxAge() - this.age();
        const staleIfErrorAge = age + toNumberOrZero(this._rescc["stale-if-error"]);
        const staleWhileRevalidateAge = age + toNumberOrZero(this._rescc["stale-while-revalidate"]);
        return Math.max(0, age, staleIfErrorAge, staleWhileRevalidateAge) * 1e3;
      }
      stale() {
        return this.maxAge() <= this.age();
      }
      _useStaleIfError() {
        return this.maxAge() + toNumberOrZero(this._rescc["stale-if-error"]) > this.age();
      }
      useStaleWhileRevalidate() {
        return this.maxAge() + toNumberOrZero(this._rescc["stale-while-revalidate"]) > this.age();
      }
      static fromObject(obj) {
        return new this(void 0, void 0, { _fromObject: obj });
      }
      _fromObject(obj) {
        if (this._responseTime)
          throw Error("Reinitialized");
        if (!obj || obj.v !== 1)
          throw Error("Invalid serialization");
        this._responseTime = obj.t;
        this._isShared = obj.sh;
        this._cacheHeuristic = obj.ch;
        this._immutableMinTtl = obj.imm !== void 0 ? obj.imm : 24 * 3600 * 1e3;
        this._status = obj.st;
        this._resHeaders = obj.resh;
        this._rescc = obj.rescc;
        this._method = obj.m;
        this._url = obj.u;
        this._host = obj.h;
        this._noAuthorization = obj.a;
        this._reqHeaders = obj.reqh;
        this._reqcc = obj.reqcc;
      }
      toObject() {
        return {
          v: 1,
          t: this._responseTime,
          sh: this._isShared,
          ch: this._cacheHeuristic,
          imm: this._immutableMinTtl,
          st: this._status,
          resh: this._resHeaders,
          rescc: this._rescc,
          m: this._method,
          u: this._url,
          h: this._host,
          a: this._noAuthorization,
          reqh: this._reqHeaders,
          reqcc: this._reqcc
        };
      }
      revalidationHeaders(incomingReq) {
        this._assertRequestHasHeaders(incomingReq);
        const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);
        delete headers["if-range"];
        if (!this._requestMatches(incomingReq, true) || !this.storable()) {
          delete headers["if-none-match"];
          delete headers["if-modified-since"];
          return headers;
        }
        if (this._resHeaders.etag) {
          headers["if-none-match"] = headers["if-none-match"] ? `${headers["if-none-match"]}, ${this._resHeaders.etag}` : this._resHeaders.etag;
        }
        const forbidsWeakValidators = headers["accept-ranges"] || headers["if-match"] || headers["if-unmodified-since"] || this._method && this._method != "GET";
        if (forbidsWeakValidators) {
          delete headers["if-modified-since"];
          if (headers["if-none-match"]) {
            const etags = headers["if-none-match"].split(/,/).filter((etag) => {
              return !/^\s*W\//.test(etag);
            });
            if (!etags.length) {
              delete headers["if-none-match"];
            } else {
              headers["if-none-match"] = etags.join(",").trim();
            }
          }
        } else if (this._resHeaders["last-modified"] && !headers["if-modified-since"]) {
          headers["if-modified-since"] = this._resHeaders["last-modified"];
        }
        return headers;
      }
      revalidatedPolicy(request2, response) {
        this._assertRequestHasHeaders(request2);
        if (this._useStaleIfError() && isErrorResponse(response)) {
          return {
            modified: false,
            matches: false,
            policy: this
          };
        }
        if (!response || !response.headers) {
          throw Error("Response headers missing");
        }
        let matches = false;
        if (response.status !== void 0 && response.status != 304) {
          matches = false;
        } else if (response.headers.etag && !/^\s*W\//.test(response.headers.etag)) {
          matches = this._resHeaders.etag && this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag;
        } else if (this._resHeaders.etag && response.headers.etag) {
          matches = this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag.replace(/^\s*W\//, "");
        } else if (this._resHeaders["last-modified"]) {
          matches = this._resHeaders["last-modified"] === response.headers["last-modified"];
        } else {
          if (!this._resHeaders.etag && !this._resHeaders["last-modified"] && !response.headers.etag && !response.headers["last-modified"]) {
            matches = true;
          }
        }
        if (!matches) {
          return {
            policy: new this.constructor(request2, response),
            modified: response.status != 304,
            matches: false
          };
        }
        const headers = {};
        for (const k in this._resHeaders) {
          headers[k] = k in response.headers && !excludedFromRevalidationUpdate[k] ? response.headers[k] : this._resHeaders[k];
        }
        const newResponse = Object.assign({}, response, {
          status: this._status,
          method: this._method,
          headers
        });
        return {
          policy: new this.constructor(request2, newResponse, {
            shared: this._isShared,
            cacheHeuristic: this._cacheHeuristic,
            immutableMinTimeToLive: this._immutableMinTtl
          }),
          modified: false,
          matches: true
        };
      }
    };
  }
});

// node_modules/json-buffer/index.js
var require_json_buffer = __commonJS({
  "node_modules/json-buffer/index.js"(exports2) {
    exports2.stringify = function stringify2(o) {
      if ("undefined" == typeof o)
        return o;
      if (o && Buffer.isBuffer(o))
        return JSON.stringify(":base64:" + o.toString("base64"));
      if (o && o.toJSON)
        o = o.toJSON();
      if (o && "object" === typeof o) {
        var s = "";
        var array = Array.isArray(o);
        s = array ? "[" : "{";
        var first = true;
        for (var k in o) {
          var ignore = "function" == typeof o[k] || !array && "undefined" === typeof o[k];
          if (Object.hasOwnProperty.call(o, k) && !ignore) {
            if (!first)
              s += ",";
            first = false;
            if (array) {
              if (o[k] == void 0)
                s += "null";
              else
                s += stringify2(o[k]);
            } else if (o[k] !== void 0) {
              s += stringify2(k) + ":" + stringify2(o[k]);
            }
          }
        }
        s += array ? "]" : "}";
        return s;
      } else if ("string" === typeof o) {
        return JSON.stringify(/^:/.test(o) ? ":" + o : o);
      } else if ("undefined" === typeof o) {
        return "null";
      } else
        return JSON.stringify(o);
    };
    exports2.parse = function(s) {
      return JSON.parse(s, function(key, value) {
        if ("string" === typeof value) {
          if (/^:base64:/.test(value))
            return Buffer.from(value.substring(8), "base64");
          else
            return /^:/.test(value) ? value.substring(1) : value;
        }
        return value;
      });
    };
  }
});

// node_modules/keyv/src/index.js
var require_src = __commonJS({
  "node_modules/keyv/src/index.js"(exports2, module2) {
    "use strict";
    var EventEmitter3 = require("events");
    var JSONB = require_json_buffer();
    var loadStore = (options) => {
      const adapters = {
        redis: "@keyv/redis",
        rediss: "@keyv/redis",
        mongodb: "@keyv/mongo",
        mongo: "@keyv/mongo",
        sqlite: "@keyv/sqlite",
        postgresql: "@keyv/postgres",
        postgres: "@keyv/postgres",
        mysql: "@keyv/mysql",
        etcd: "@keyv/etcd",
        offline: "@keyv/offline",
        tiered: "@keyv/tiered"
      };
      if (options.adapter || options.uri) {
        const adapter = options.adapter || /^[^:+]*/.exec(options.uri)[0];
        return new (require(adapters[adapter]))(options);
      }
      return /* @__PURE__ */ new Map();
    };
    var iterableAdapters = [
      "sqlite",
      "postgres",
      "mysql",
      "mongo",
      "redis",
      "tiered"
    ];
    var Keyv2 = class extends EventEmitter3 {
      constructor(uri, { emitErrors = true, ...options } = {}) {
        super();
        this.opts = {
          namespace: "keyv",
          serialize: JSONB.stringify,
          deserialize: JSONB.parse,
          ...typeof uri === "string" ? { uri } : uri,
          ...options
        };
        if (!this.opts.store) {
          const adapterOptions = { ...this.opts };
          this.opts.store = loadStore(adapterOptions);
        }
        if (this.opts.compression) {
          const compression = this.opts.compression;
          const { serialize, deserialize } = compression.opts;
          this.opts.serialize = serialize;
          this.opts.deserialize = deserialize;
        }
        if (typeof this.opts.store.on === "function" && emitErrors) {
          this.opts.store.on("error", (error) => this.emit("error", error));
        }
        this.opts.store.namespace = this.opts.namespace;
        const generateIterator = (iterator) => async function* () {
          for await (const [key, raw] of typeof iterator === "function" ? iterator(this.opts.store.namespace) : iterator) {
            const data = this.opts.deserialize(raw);
            if (this.opts.store.namespace && !key.includes(this.opts.store.namespace)) {
              continue;
            }
            if (typeof data.expires === "number" && Date.now() > data.expires) {
              this.delete(key);
              continue;
            }
            yield [this._getKeyUnprefix(key), data.value];
          }
        };
        if (typeof this.opts.store[Symbol.iterator] === "function" && this.opts.store instanceof Map) {
          this.iterator = generateIterator(this.opts.store);
        } else if (typeof this.opts.store.iterator === "function" && this.opts.store.opts && this._checkIterableAdaptar()) {
          this.iterator = generateIterator(this.opts.store.iterator.bind(this.opts.store));
        }
      }
      _checkIterableAdaptar() {
        return iterableAdapters.includes(this.opts.store.opts.dialect) || iterableAdapters.findIndex((element) => this.opts.store.opts.url.includes(element)) >= 0;
      }
      _getKeyPrefix(key) {
        return `${this.opts.namespace}:${key}`;
      }
      _getKeyPrefixArray(keys2) {
        return keys2.map((key) => `${this.opts.namespace}:${key}`);
      }
      _getKeyUnprefix(key) {
        return key.split(":").splice(1).join(":");
      }
      get(key, options) {
        const { store } = this.opts;
        const isArray2 = Array.isArray(key);
        const keyPrefixed = isArray2 ? this._getKeyPrefixArray(key) : this._getKeyPrefix(key);
        if (isArray2 && store.getMany === void 0) {
          const promises = [];
          for (const key2 of keyPrefixed) {
            promises.push(
              Promise.resolve().then(() => store.get(key2)).then((data) => typeof data === "string" ? this.opts.deserialize(data) : data).then((data) => {
                if (data === void 0 || data === null) {
                  return void 0;
                }
                if (typeof data.expires === "number" && Date.now() > data.expires) {
                  return this.delete(key2).then(() => void 0);
                }
                return options && options.raw ? data : data.value;
              })
            );
          }
          return Promise.allSettled(promises).then((values2) => {
            const data = [];
            for (const value of values2) {
              data.push(value.value);
            }
            return data;
          });
        }
        return Promise.resolve().then(() => isArray2 ? store.getMany(keyPrefixed) : store.get(keyPrefixed)).then((data) => typeof data === "string" ? this.opts.deserialize(data) : data).then((data) => {
          if (data === void 0 || data === null) {
            return void 0;
          }
          if (isArray2) {
            const result = [];
            for (let row of data) {
              if (typeof row === "string") {
                row = this.opts.deserialize(row);
              }
              if (row === void 0 || row === null) {
                result.push(void 0);
                continue;
              }
              if (typeof row.expires === "number" && Date.now() > row.expires) {
                this.delete(key).then(() => void 0);
                result.push(void 0);
              } else {
                result.push(options && options.raw ? row : row.value);
              }
            }
            return result;
          }
          if (typeof data.expires === "number" && Date.now() > data.expires) {
            return this.delete(key).then(() => void 0);
          }
          return options && options.raw ? data : data.value;
        });
      }
      set(key, value, ttl2) {
        const keyPrefixed = this._getKeyPrefix(key);
        if (typeof ttl2 === "undefined") {
          ttl2 = this.opts.ttl;
        }
        if (ttl2 === 0) {
          ttl2 = void 0;
        }
        const { store } = this.opts;
        return Promise.resolve().then(() => {
          const expires = typeof ttl2 === "number" ? Date.now() + ttl2 : null;
          if (typeof value === "symbol") {
            this.emit("error", "symbol cannot be serialized");
          }
          value = { value, expires };
          return this.opts.serialize(value);
        }).then((value2) => store.set(keyPrefixed, value2, ttl2)).then(() => true);
      }
      delete(key) {
        const { store } = this.opts;
        if (Array.isArray(key)) {
          const keyPrefixed2 = this._getKeyPrefixArray(key);
          if (store.deleteMany === void 0) {
            const promises = [];
            for (const key2 of keyPrefixed2) {
              promises.push(store.delete(key2));
            }
            return Promise.allSettled(promises).then((values2) => values2.every((x) => x.value === true));
          }
          return Promise.resolve().then(() => store.deleteMany(keyPrefixed2));
        }
        const keyPrefixed = this._getKeyPrefix(key);
        return Promise.resolve().then(() => store.delete(keyPrefixed));
      }
      clear() {
        const { store } = this.opts;
        return Promise.resolve().then(() => store.clear());
      }
      has(key) {
        const keyPrefixed = this._getKeyPrefix(key);
        const { store } = this.opts;
        return Promise.resolve().then(async () => {
          if (typeof store.has === "function") {
            return store.has(keyPrefixed);
          }
          const value = await store.get(keyPrefixed);
          return value !== void 0;
        });
      }
      disconnect() {
        const { store } = this.opts;
        if (typeof store.disconnect === "function") {
          return store.disconnect();
        }
      }
    };
    module2.exports = Keyv2;
  }
});

// node_modules/mimic-response/index.js
var require_mimic_response = __commonJS({
  "node_modules/mimic-response/index.js"(exports2, module2) {
    "use strict";
    var knownProperties2 = [
      "aborted",
      "complete",
      "headers",
      "httpVersion",
      "httpVersionMinor",
      "httpVersionMajor",
      "method",
      "rawHeaders",
      "rawTrailers",
      "setTimeout",
      "socket",
      "statusCode",
      "statusMessage",
      "trailers",
      "url"
    ];
    module2.exports = (fromStream, toStream) => {
      if (toStream._readableState.autoDestroy) {
        throw new Error("The second stream must have the `autoDestroy` option set to `false`");
      }
      const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties2));
      const properties = {};
      for (const property2 of fromProperties) {
        if (property2 in toStream) {
          continue;
        }
        properties[property2] = {
          get() {
            const value = fromStream[property2];
            const isFunction4 = typeof value === "function";
            return isFunction4 ? value.bind(fromStream) : value;
          },
          set(value) {
            fromStream[property2] = value;
          },
          enumerable: true,
          configurable: false
        };
      }
      Object.defineProperties(toStream, properties);
      fromStream.once("aborted", () => {
        toStream.destroy();
        toStream.emit("aborted");
      });
      fromStream.once("close", () => {
        if (fromStream.complete) {
          if (toStream.readable) {
            toStream.once("end", () => {
              toStream.emit("close");
            });
          } else {
            toStream.emit("close");
          }
        } else {
          toStream.emit("close");
        }
      });
      return toStream;
    };
  }
});

// node_modules/decompress-response/index.js
var require_decompress_response = __commonJS({
  "node_modules/decompress-response/index.js"(exports2, module2) {
    "use strict";
    var { Transform, PassThrough } = require("stream");
    var zlib = require("zlib");
    var mimicResponse2 = require_mimic_response();
    module2.exports = (response) => {
      const contentEncoding = (response.headers["content-encoding"] || "").toLowerCase();
      if (!["gzip", "deflate", "br"].includes(contentEncoding)) {
        return response;
      }
      const isBrotli = contentEncoding === "br";
      if (isBrotli && typeof zlib.createBrotliDecompress !== "function") {
        response.destroy(new Error("Brotli is not supported on Node.js < 12"));
        return response;
      }
      let isEmpty3 = true;
      const checker = new Transform({
        transform(data, _encoding, callback) {
          isEmpty3 = false;
          callback(null, data);
        },
        flush(callback) {
          callback();
        }
      });
      const finalStream = new PassThrough({
        autoDestroy: false,
        destroy(error, callback) {
          response.destroy();
          callback(error);
        }
      });
      const decompressStream = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();
      decompressStream.once("error", (error) => {
        if (isEmpty3 && !response.readable) {
          finalStream.end();
          return;
        }
        finalStream.destroy(error);
      });
      mimicResponse2(response, finalStream);
      response.pipe(checker).pipe(decompressStream).pipe(finalStream);
      return finalStream;
    };
  }
});

// node_modules/quick-lru/index.js
var require_quick_lru = __commonJS({
  "node_modules/quick-lru/index.js"(exports2, module2) {
    "use strict";
    var QuickLRU = class {
      constructor(options = {}) {
        if (!(options.maxSize && options.maxSize > 0)) {
          throw new TypeError("`maxSize` must be a number greater than 0");
        }
        this.maxSize = options.maxSize;
        this.onEviction = options.onEviction;
        this.cache = /* @__PURE__ */ new Map();
        this.oldCache = /* @__PURE__ */ new Map();
        this._size = 0;
      }
      _set(key, value) {
        this.cache.set(key, value);
        this._size++;
        if (this._size >= this.maxSize) {
          this._size = 0;
          if (typeof this.onEviction === "function") {
            for (const [key2, value2] of this.oldCache.entries()) {
              this.onEviction(key2, value2);
            }
          }
          this.oldCache = this.cache;
          this.cache = /* @__PURE__ */ new Map();
        }
      }
      get(key) {
        if (this.cache.has(key)) {
          return this.cache.get(key);
        }
        if (this.oldCache.has(key)) {
          const value = this.oldCache.get(key);
          this.oldCache.delete(key);
          this._set(key, value);
          return value;
        }
      }
      set(key, value) {
        if (this.cache.has(key)) {
          this.cache.set(key, value);
        } else {
          this._set(key, value);
        }
        return this;
      }
      has(key) {
        return this.cache.has(key) || this.oldCache.has(key);
      }
      peek(key) {
        if (this.cache.has(key)) {
          return this.cache.get(key);
        }
        if (this.oldCache.has(key)) {
          return this.oldCache.get(key);
        }
      }
      delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
          this._size--;
        }
        return this.oldCache.delete(key) || deleted;
      }
      clear() {
        this.cache.clear();
        this.oldCache.clear();
        this._size = 0;
      }
      *keys() {
        for (const [key] of this) {
          yield key;
        }
      }
      *values() {
        for (const [, value] of this) {
          yield value;
        }
      }
      *[Symbol.iterator]() {
        for (const item of this.cache) {
          yield item;
        }
        for (const item of this.oldCache) {
          const [key] = item;
          if (!this.cache.has(key)) {
            yield item;
          }
        }
      }
      get size() {
        let oldCacheSize = 0;
        for (const key of this.oldCache.keys()) {
          if (!this.cache.has(key)) {
            oldCacheSize++;
          }
        }
        return Math.min(this._size + oldCacheSize, this.maxSize);
      }
    };
    module2.exports = QuickLRU;
  }
});

// node_modules/http2-wrapper/source/utils/delay-async-destroy.js
var require_delay_async_destroy = __commonJS({
  "node_modules/http2-wrapper/source/utils/delay-async-destroy.js"(exports2, module2) {
    "use strict";
    module2.exports = (stream2) => {
      if (stream2.listenerCount("error") !== 0) {
        return stream2;
      }
      stream2.__destroy = stream2._destroy;
      stream2._destroy = (...args) => {
        const callback = args.pop();
        stream2.__destroy(...args, async (error) => {
          await Promise.resolve();
          callback(error);
        });
      };
      const onError = (error) => {
        Promise.resolve().then(() => {
          stream2.emit("error", error);
        });
      };
      stream2.once("error", onError);
      Promise.resolve().then(() => {
        stream2.off("error", onError);
      });
      return stream2;
    };
  }
});

// node_modules/http2-wrapper/source/agent.js
var require_agent = __commonJS({
  "node_modules/http2-wrapper/source/agent.js"(exports2, module2) {
    "use strict";
    var { URL: URL4 } = require("url");
    var EventEmitter3 = require("events");
    var tls = require("tls");
    var http22 = require("http2");
    var QuickLRU = require_quick_lru();
    var delayAsyncDestroy = require_delay_async_destroy();
    var kCurrentStreamCount = Symbol("currentStreamCount");
    var kRequest = Symbol("request");
    var kOriginSet = Symbol("cachedOriginSet");
    var kGracefullyClosing = Symbol("gracefullyClosing");
    var kLength = Symbol("length");
    var nameKeys = [
      "createConnection",
      "maxDeflateDynamicTableSize",
      "maxSettings",
      "maxSessionMemory",
      "maxHeaderListPairs",
      "maxOutstandingPings",
      "maxReservedRemoteStreams",
      "maxSendHeaderBlockLength",
      "paddingStrategy",
      "peerMaxConcurrentStreams",
      "settings",
      "family",
      "localAddress",
      "rejectUnauthorized",
      "pskCallback",
      "minDHSize",
      "path",
      "socket",
      "ca",
      "cert",
      "sigalgs",
      "ciphers",
      "clientCertEngine",
      "crl",
      "dhparam",
      "ecdhCurve",
      "honorCipherOrder",
      "key",
      "privateKeyEngine",
      "privateKeyIdentifier",
      "maxVersion",
      "minVersion",
      "pfx",
      "secureOptions",
      "secureProtocol",
      "sessionIdContext",
      "ticketKeys"
    ];
    var getSortedIndex = (array, value, compare) => {
      let low = 0;
      let high = array.length;
      while (low < high) {
        const mid3 = low + high >>> 1;
        if (compare(array[mid3], value)) {
          low = mid3 + 1;
        } else {
          high = mid3;
        }
      }
      return low;
    };
    var compareSessions = (a, b) => a.remoteSettings.maxConcurrentStreams > b.remoteSettings.maxConcurrentStreams;
    var closeCoveredSessions = (where, session) => {
      for (let index = 0; index < where.length; index++) {
        const coveredSession = where[index];
        if (coveredSession[kOriginSet].length > 0 && coveredSession[kOriginSet].length < session[kOriginSet].length && coveredSession[kOriginSet].every((origin) => session[kOriginSet].includes(origin)) && coveredSession[kCurrentStreamCount] + session[kCurrentStreamCount] <= session.remoteSettings.maxConcurrentStreams) {
          gracefullyClose(coveredSession);
        }
      }
    };
    var closeSessionIfCovered = (where, coveredSession) => {
      for (let index = 0; index < where.length; index++) {
        const session = where[index];
        if (coveredSession[kOriginSet].length > 0 && coveredSession[kOriginSet].length < session[kOriginSet].length && coveredSession[kOriginSet].every((origin) => session[kOriginSet].includes(origin)) && coveredSession[kCurrentStreamCount] + session[kCurrentStreamCount] <= session.remoteSettings.maxConcurrentStreams) {
          gracefullyClose(coveredSession);
          return true;
        }
      }
      return false;
    };
    var gracefullyClose = (session) => {
      session[kGracefullyClosing] = true;
      if (session[kCurrentStreamCount] === 0) {
        session.close();
      }
    };
    var Agent = class extends EventEmitter3 {
      constructor({ timeout = 0, maxSessions = Number.POSITIVE_INFINITY, maxEmptySessions = 10, maxCachedTlsSessions = 100 } = {}) {
        super();
        this.sessions = {};
        this.queue = {};
        this.timeout = timeout;
        this.maxSessions = maxSessions;
        this.maxEmptySessions = maxEmptySessions;
        this._emptySessionCount = 0;
        this._sessionCount = 0;
        this.settings = {
          enablePush: false,
          initialWindowSize: 1024 * 1024 * 32
        };
        this.tlsSessionCache = new QuickLRU({ maxSize: maxCachedTlsSessions });
      }
      get protocol() {
        return "https:";
      }
      normalizeOptions(options) {
        let normalized = "";
        for (let index = 0; index < nameKeys.length; index++) {
          const key = nameKeys[index];
          normalized += ":";
          if (options && options[key] !== void 0) {
            normalized += options[key];
          }
        }
        return normalized;
      }
      _processQueue() {
        if (this._sessionCount >= this.maxSessions) {
          this.closeEmptySessions(this.maxSessions - this._sessionCount + 1);
          return;
        }
        for (const normalizedOptions in this.queue) {
          for (const normalizedOrigin in this.queue[normalizedOptions]) {
            const item = this.queue[normalizedOptions][normalizedOrigin];
            if (!item.completed) {
              item.completed = true;
              item();
            }
          }
        }
      }
      _isBetterSession(thisStreamCount, thatStreamCount) {
        return thisStreamCount > thatStreamCount;
      }
      _accept(session, listeners, normalizedOrigin, options) {
        let index = 0;
        while (index < listeners.length && session[kCurrentStreamCount] < session.remoteSettings.maxConcurrentStreams) {
          listeners[index].resolve(session);
          index++;
        }
        listeners.splice(0, index);
        if (listeners.length > 0) {
          this.getSession(normalizedOrigin, options, listeners);
          listeners.length = 0;
        }
      }
      getSession(origin, options, listeners) {
        return new Promise((resolve, reject) => {
          if (Array.isArray(listeners) && listeners.length > 0) {
            listeners = [...listeners];
            resolve();
          } else {
            listeners = [{ resolve, reject }];
          }
          try {
            if (typeof origin === "string") {
              origin = new URL4(origin);
            } else if (!(origin instanceof URL4)) {
              throw new TypeError("The `origin` argument needs to be a string or an URL object");
            }
            if (options) {
              const { servername } = options;
              const { hostname } = origin;
              if (servername && hostname !== servername) {
                throw new Error(`Origin ${hostname} differs from servername ${servername}`);
              }
            }
          } catch (error) {
            for (let index = 0; index < listeners.length; index++) {
              listeners[index].reject(error);
            }
            return;
          }
          const normalizedOptions = this.normalizeOptions(options);
          const normalizedOrigin = origin.origin;
          if (normalizedOptions in this.sessions) {
            const sessions = this.sessions[normalizedOptions];
            let maxConcurrentStreams = -1;
            let currentStreamsCount = -1;
            let optimalSession;
            for (let index = 0; index < sessions.length; index++) {
              const session = sessions[index];
              const sessionMaxConcurrentStreams = session.remoteSettings.maxConcurrentStreams;
              if (sessionMaxConcurrentStreams < maxConcurrentStreams) {
                break;
              }
              if (!session[kOriginSet].includes(normalizedOrigin)) {
                continue;
              }
              const sessionCurrentStreamsCount = session[kCurrentStreamCount];
              if (sessionCurrentStreamsCount >= sessionMaxConcurrentStreams || session[kGracefullyClosing] || session.destroyed) {
                continue;
              }
              if (!optimalSession) {
                maxConcurrentStreams = sessionMaxConcurrentStreams;
              }
              if (this._isBetterSession(sessionCurrentStreamsCount, currentStreamsCount)) {
                optimalSession = session;
                currentStreamsCount = sessionCurrentStreamsCount;
              }
            }
            if (optimalSession) {
              this._accept(optimalSession, listeners, normalizedOrigin, options);
              return;
            }
          }
          if (normalizedOptions in this.queue) {
            if (normalizedOrigin in this.queue[normalizedOptions]) {
              this.queue[normalizedOptions][normalizedOrigin].listeners.push(...listeners);
              return;
            }
          } else {
            this.queue[normalizedOptions] = {
              [kLength]: 0
            };
          }
          const removeFromQueue = () => {
            if (normalizedOptions in this.queue && this.queue[normalizedOptions][normalizedOrigin] === entry) {
              delete this.queue[normalizedOptions][normalizedOrigin];
              if (--this.queue[normalizedOptions][kLength] === 0) {
                delete this.queue[normalizedOptions];
              }
            }
          };
          const entry = async () => {
            this._sessionCount++;
            const name = `${normalizedOrigin}:${normalizedOptions}`;
            let receivedSettings = false;
            let socket;
            try {
              const computedOptions = { ...options };
              if (computedOptions.settings === void 0) {
                computedOptions.settings = this.settings;
              }
              if (computedOptions.session === void 0) {
                computedOptions.session = this.tlsSessionCache.get(name);
              }
              const createConnection = computedOptions.createConnection || this.createConnection;
              socket = await createConnection.call(this, origin, computedOptions);
              computedOptions.createConnection = () => socket;
              const session = http22.connect(origin, computedOptions);
              session[kCurrentStreamCount] = 0;
              session[kGracefullyClosing] = false;
              const getOriginSet = () => {
                const { socket: socket2 } = session;
                let originSet;
                if (socket2.servername === false) {
                  socket2.servername = socket2.remoteAddress;
                  originSet = session.originSet;
                  socket2.servername = false;
                } else {
                  originSet = session.originSet;
                }
                return originSet;
              };
              const isFree = () => session[kCurrentStreamCount] < session.remoteSettings.maxConcurrentStreams;
              session.socket.once("session", (tlsSession) => {
                this.tlsSessionCache.set(name, tlsSession);
              });
              session.once("error", (error) => {
                for (let index = 0; index < listeners.length; index++) {
                  listeners[index].reject(error);
                }
                this.tlsSessionCache.delete(name);
              });
              session.setTimeout(this.timeout, () => {
                session.destroy();
              });
              session.once("close", () => {
                this._sessionCount--;
                if (receivedSettings) {
                  this._emptySessionCount--;
                  const where = this.sessions[normalizedOptions];
                  if (where.length === 1) {
                    delete this.sessions[normalizedOptions];
                  } else {
                    where.splice(where.indexOf(session), 1);
                  }
                } else {
                  removeFromQueue();
                  const error = new Error("Session closed without receiving a SETTINGS frame");
                  error.code = "HTTP2WRAPPER_NOSETTINGS";
                  for (let index = 0; index < listeners.length; index++) {
                    listeners[index].reject(error);
                  }
                }
                this._processQueue();
              });
              const processListeners = () => {
                const queue = this.queue[normalizedOptions];
                if (!queue) {
                  return;
                }
                const originSet = session[kOriginSet];
                for (let index = 0; index < originSet.length; index++) {
                  const origin2 = originSet[index];
                  if (origin2 in queue) {
                    const { listeners: listeners2, completed } = queue[origin2];
                    let index2 = 0;
                    while (index2 < listeners2.length && isFree()) {
                      listeners2[index2].resolve(session);
                      index2++;
                    }
                    queue[origin2].listeners.splice(0, index2);
                    if (queue[origin2].listeners.length === 0 && !completed) {
                      delete queue[origin2];
                      if (--queue[kLength] === 0) {
                        delete this.queue[normalizedOptions];
                        break;
                      }
                    }
                    if (!isFree()) {
                      break;
                    }
                  }
                }
              };
              session.on("origin", () => {
                session[kOriginSet] = getOriginSet() || [];
                session[kGracefullyClosing] = false;
                closeSessionIfCovered(this.sessions[normalizedOptions], session);
                if (session[kGracefullyClosing] || !isFree()) {
                  return;
                }
                processListeners();
                if (!isFree()) {
                  return;
                }
                closeCoveredSessions(this.sessions[normalizedOptions], session);
              });
              session.once("remoteSettings", () => {
                if (entry.destroyed) {
                  const error = new Error("Agent has been destroyed");
                  for (let index = 0; index < listeners.length; index++) {
                    listeners[index].reject(error);
                  }
                  session.destroy();
                  return;
                }
                if (session.setLocalWindowSize) {
                  session.setLocalWindowSize(1024 * 1024 * 4);
                }
                session[kOriginSet] = getOriginSet() || [];
                if (session.socket.encrypted) {
                  const mainOrigin = session[kOriginSet][0];
                  if (mainOrigin !== normalizedOrigin) {
                    const error = new Error(`Requested origin ${normalizedOrigin} does not match server ${mainOrigin}`);
                    for (let index = 0; index < listeners.length; index++) {
                      listeners[index].reject(error);
                    }
                    session.destroy();
                    return;
                  }
                }
                removeFromQueue();
                {
                  const where = this.sessions;
                  if (normalizedOptions in where) {
                    const sessions = where[normalizedOptions];
                    sessions.splice(getSortedIndex(sessions, session, compareSessions), 0, session);
                  } else {
                    where[normalizedOptions] = [session];
                  }
                }
                receivedSettings = true;
                this._emptySessionCount++;
                this.emit("session", session);
                this._accept(session, listeners, normalizedOrigin, options);
                if (session[kCurrentStreamCount] === 0 && this._emptySessionCount > this.maxEmptySessions) {
                  this.closeEmptySessions(this._emptySessionCount - this.maxEmptySessions);
                }
                session.on("remoteSettings", () => {
                  if (!isFree()) {
                    return;
                  }
                  processListeners();
                  if (!isFree()) {
                    return;
                  }
                  closeCoveredSessions(this.sessions[normalizedOptions], session);
                });
              });
              session[kRequest] = session.request;
              session.request = (headers, streamOptions) => {
                if (session[kGracefullyClosing]) {
                  throw new Error("The session is gracefully closing. No new streams are allowed.");
                }
                const stream2 = session[kRequest](headers, streamOptions);
                session.ref();
                if (session[kCurrentStreamCount]++ === 0) {
                  this._emptySessionCount--;
                }
                stream2.once("close", () => {
                  if (--session[kCurrentStreamCount] === 0) {
                    this._emptySessionCount++;
                    session.unref();
                    if (this._emptySessionCount > this.maxEmptySessions || session[kGracefullyClosing]) {
                      session.close();
                      return;
                    }
                  }
                  if (session.destroyed || session.closed) {
                    return;
                  }
                  if (isFree() && !closeSessionIfCovered(this.sessions[normalizedOptions], session)) {
                    closeCoveredSessions(this.sessions[normalizedOptions], session);
                    processListeners();
                    if (session[kCurrentStreamCount] === 0) {
                      this._processQueue();
                    }
                  }
                });
                return stream2;
              };
            } catch (error) {
              removeFromQueue();
              this._sessionCount--;
              for (let index = 0; index < listeners.length; index++) {
                listeners[index].reject(error);
              }
            }
          };
          entry.listeners = listeners;
          entry.completed = false;
          entry.destroyed = false;
          this.queue[normalizedOptions][normalizedOrigin] = entry;
          this.queue[normalizedOptions][kLength]++;
          this._processQueue();
        });
      }
      request(origin, options, headers, streamOptions) {
        return new Promise((resolve, reject) => {
          this.getSession(origin, options, [{
            reject,
            resolve: (session) => {
              try {
                const stream2 = session.request(headers, streamOptions);
                delayAsyncDestroy(stream2);
                resolve(stream2);
              } catch (error) {
                reject(error);
              }
            }
          }]);
        });
      }
      async createConnection(origin, options) {
        return Agent.connect(origin, options);
      }
      static connect(origin, options) {
        options.ALPNProtocols = ["h2"];
        const port = origin.port || 443;
        const host = origin.hostname;
        if (typeof options.servername === "undefined") {
          options.servername = host;
        }
        const socket = tls.connect(port, host, options);
        if (options.socket) {
          socket._peername = {
            family: void 0,
            address: void 0,
            port
          };
        }
        return socket;
      }
      closeEmptySessions(maxCount = Number.POSITIVE_INFINITY) {
        let closedCount = 0;
        const { sessions } = this;
        for (const key in sessions) {
          const thisSessions = sessions[key];
          for (let index = 0; index < thisSessions.length; index++) {
            const session = thisSessions[index];
            if (session[kCurrentStreamCount] === 0) {
              closedCount++;
              session.close();
              if (closedCount >= maxCount) {
                return closedCount;
              }
            }
          }
        }
        return closedCount;
      }
      destroy(reason) {
        const { sessions, queue } = this;
        for (const key in sessions) {
          const thisSessions = sessions[key];
          for (let index = 0; index < thisSessions.length; index++) {
            thisSessions[index].destroy(reason);
          }
        }
        for (const normalizedOptions in queue) {
          const entries2 = queue[normalizedOptions];
          for (const normalizedOrigin in entries2) {
            entries2[normalizedOrigin].destroyed = true;
          }
        }
        this.queue = {};
        this.tlsSessionCache.clear();
      }
      get emptySessionCount() {
        return this._emptySessionCount;
      }
      get pendingSessionCount() {
        return this._sessionCount - this._emptySessionCount;
      }
      get sessionCount() {
        return this._sessionCount;
      }
    };
    Agent.kCurrentStreamCount = kCurrentStreamCount;
    Agent.kGracefullyClosing = kGracefullyClosing;
    module2.exports = {
      Agent,
      globalAgent: new Agent()
    };
  }
});

// node_modules/http2-wrapper/source/incoming-message.js
var require_incoming_message = __commonJS({
  "node_modules/http2-wrapper/source/incoming-message.js"(exports2, module2) {
    "use strict";
    var { Readable: Readable2 } = require("stream");
    var IncomingMessage = class extends Readable2 {
      constructor(socket, highWaterMark) {
        super({
          emitClose: false,
          autoDestroy: true,
          highWaterMark
        });
        this.statusCode = null;
        this.statusMessage = "";
        this.httpVersion = "2.0";
        this.httpVersionMajor = 2;
        this.httpVersionMinor = 0;
        this.headers = {};
        this.trailers = {};
        this.req = null;
        this.aborted = false;
        this.complete = false;
        this.upgrade = null;
        this.rawHeaders = [];
        this.rawTrailers = [];
        this.socket = socket;
        this._dumped = false;
      }
      get connection() {
        return this.socket;
      }
      set connection(value) {
        this.socket = value;
      }
      _destroy(error, callback) {
        if (!this.readableEnded) {
          this.aborted = true;
        }
        callback();
        this.req._request.destroy(error);
      }
      setTimeout(ms, callback) {
        this.req.setTimeout(ms, callback);
        return this;
      }
      _dump() {
        if (!this._dumped) {
          this._dumped = true;
          this.removeAllListeners("data");
          this.resume();
        }
      }
      _read() {
        if (this.req) {
          this.req._request.resume();
        }
      }
    };
    module2.exports = IncomingMessage;
  }
});

// node_modules/http2-wrapper/source/utils/proxy-events.js
var require_proxy_events = __commonJS({
  "node_modules/http2-wrapper/source/utils/proxy-events.js"(exports2, module2) {
    "use strict";
    module2.exports = (from, to, events4) => {
      for (const event of events4) {
        from.on(event, (...args) => to.emit(event, ...args));
      }
    };
  }
});

// node_modules/http2-wrapper/source/utils/errors.js
var require_errors = __commonJS({
  "node_modules/http2-wrapper/source/utils/errors.js"(exports2, module2) {
    "use strict";
    var makeError = (Base, key, getMessage) => {
      module2.exports[key] = class NodeError extends Base {
        constructor(...args) {
          super(typeof getMessage === "string" ? getMessage : getMessage(args));
          this.name = `${super.name} [${key}]`;
          this.code = key;
        }
      };
    };
    makeError(TypeError, "ERR_INVALID_ARG_TYPE", (args) => {
      const type = args[0].includes(".") ? "property" : "argument";
      let valid = args[1];
      const isManyTypes = Array.isArray(valid);
      if (isManyTypes) {
        valid = `${valid.slice(0, -1).join(", ")} or ${valid.slice(-1)}`;
      }
      return `The "${args[0]}" ${type} must be ${isManyTypes ? "one of" : "of"} type ${valid}. Received ${typeof args[2]}`;
    });
    makeError(
      TypeError,
      "ERR_INVALID_PROTOCOL",
      (args) => `Protocol "${args[0]}" not supported. Expected "${args[1]}"`
    );
    makeError(
      Error,
      "ERR_HTTP_HEADERS_SENT",
      (args) => `Cannot ${args[0]} headers after they are sent to the client`
    );
    makeError(
      TypeError,
      "ERR_INVALID_HTTP_TOKEN",
      (args) => `${args[0]} must be a valid HTTP token [${args[1]}]`
    );
    makeError(
      TypeError,
      "ERR_HTTP_INVALID_HEADER_VALUE",
      (args) => `Invalid value "${args[0]} for header "${args[1]}"`
    );
    makeError(
      TypeError,
      "ERR_INVALID_CHAR",
      (args) => `Invalid character in ${args[0]} [${args[1]}]`
    );
    makeError(
      Error,
      "ERR_HTTP2_NO_SOCKET_MANIPULATION",
      "HTTP/2 sockets should not be directly manipulated (e.g. read and written)"
    );
  }
});

// node_modules/http2-wrapper/source/utils/is-request-pseudo-header.js
var require_is_request_pseudo_header = __commonJS({
  "node_modules/http2-wrapper/source/utils/is-request-pseudo-header.js"(exports2, module2) {
    "use strict";
    module2.exports = (header) => {
      switch (header) {
        case ":method":
        case ":scheme":
        case ":authority":
        case ":path":
          return true;
        default:
          return false;
      }
    };
  }
});

// node_modules/http2-wrapper/source/utils/validate-header-name.js
var require_validate_header_name = __commonJS({
  "node_modules/http2-wrapper/source/utils/validate-header-name.js"(exports2, module2) {
    "use strict";
    var { ERR_INVALID_HTTP_TOKEN } = require_errors();
    var isRequestPseudoHeader = require_is_request_pseudo_header();
    var isValidHttpToken = /^[\^`\-\w!#$%&*+.|~]+$/;
    module2.exports = (name) => {
      if (typeof name !== "string" || !isValidHttpToken.test(name) && !isRequestPseudoHeader(name)) {
        throw new ERR_INVALID_HTTP_TOKEN("Header name", name);
      }
    };
  }
});

// node_modules/http2-wrapper/source/utils/validate-header-value.js
var require_validate_header_value = __commonJS({
  "node_modules/http2-wrapper/source/utils/validate-header-value.js"(exports2, module2) {
    "use strict";
    var {
      ERR_HTTP_INVALID_HEADER_VALUE,
      ERR_INVALID_CHAR
    } = require_errors();
    var isInvalidHeaderValue = /[^\t\u0020-\u007E\u0080-\u00FF]/;
    module2.exports = (name, value) => {
      if (typeof value === "undefined") {
        throw new ERR_HTTP_INVALID_HEADER_VALUE(value, name);
      }
      if (isInvalidHeaderValue.test(value)) {
        throw new ERR_INVALID_CHAR("header content", name);
      }
    };
  }
});

// node_modules/http2-wrapper/source/utils/proxy-socket-handler.js
var require_proxy_socket_handler = __commonJS({
  "node_modules/http2-wrapper/source/utils/proxy-socket-handler.js"(exports2, module2) {
    "use strict";
    var { ERR_HTTP2_NO_SOCKET_MANIPULATION } = require_errors();
    var proxySocketHandler = {
      has(stream2, property2) {
        const reference = stream2.session === void 0 ? stream2 : stream2.session.socket;
        return property2 in stream2 || property2 in reference;
      },
      get(stream2, property2) {
        switch (property2) {
          case "on":
          case "once":
          case "end":
          case "emit":
          case "destroy":
            return stream2[property2].bind(stream2);
          case "writable":
          case "destroyed":
            return stream2[property2];
          case "readable":
            if (stream2.destroyed) {
              return false;
            }
            return stream2.readable;
          case "setTimeout": {
            const { session } = stream2;
            if (session !== void 0) {
              return session.setTimeout.bind(session);
            }
            return stream2.setTimeout.bind(stream2);
          }
          case "write":
          case "read":
          case "pause":
          case "resume":
            throw new ERR_HTTP2_NO_SOCKET_MANIPULATION();
          default: {
            const reference = stream2.session === void 0 ? stream2 : stream2.session.socket;
            const value = reference[property2];
            return typeof value === "function" ? value.bind(reference) : value;
          }
        }
      },
      getPrototypeOf(stream2) {
        if (stream2.session !== void 0) {
          return Reflect.getPrototypeOf(stream2.session.socket);
        }
        return Reflect.getPrototypeOf(stream2);
      },
      set(stream2, property2, value) {
        switch (property2) {
          case "writable":
          case "readable":
          case "destroyed":
          case "on":
          case "once":
          case "end":
          case "emit":
          case "destroy":
            stream2[property2] = value;
            return true;
          case "setTimeout": {
            const { session } = stream2;
            if (session === void 0) {
              stream2.setTimeout = value;
            } else {
              session.setTimeout = value;
            }
            return true;
          }
          case "write":
          case "read":
          case "pause":
          case "resume":
            throw new ERR_HTTP2_NO_SOCKET_MANIPULATION();
          default: {
            const reference = stream2.session === void 0 ? stream2 : stream2.session.socket;
            reference[property2] = value;
            return true;
          }
        }
      }
    };
    module2.exports = proxySocketHandler;
  }
});

// node_modules/http2-wrapper/source/client-request.js
var require_client_request = __commonJS({
  "node_modules/http2-wrapper/source/client-request.js"(exports2, module2) {
    "use strict";
    var { URL: URL4, urlToHttpOptions } = require("url");
    var http22 = require("http2");
    var { Writable: Writable2 } = require("stream");
    var { Agent, globalAgent } = require_agent();
    var IncomingMessage = require_incoming_message();
    var proxyEvents2 = require_proxy_events();
    var {
      ERR_INVALID_ARG_TYPE,
      ERR_INVALID_PROTOCOL,
      ERR_HTTP_HEADERS_SENT
    } = require_errors();
    var validateHeaderName = require_validate_header_name();
    var validateHeaderValue = require_validate_header_value();
    var proxySocketHandler = require_proxy_socket_handler();
    var {
      HTTP2_HEADER_STATUS,
      HTTP2_HEADER_METHOD,
      HTTP2_HEADER_PATH,
      HTTP2_HEADER_AUTHORITY,
      HTTP2_METHOD_CONNECT
    } = http22.constants;
    var kHeaders = Symbol("headers");
    var kOrigin = Symbol("origin");
    var kSession = Symbol("session");
    var kOptions = Symbol("options");
    var kFlushedHeaders = Symbol("flushedHeaders");
    var kJobs = Symbol("jobs");
    var kPendingAgentPromise = Symbol("pendingAgentPromise");
    var ClientRequest = class extends Writable2 {
      constructor(input, options, callback) {
        super({
          autoDestroy: false,
          emitClose: false
        });
        if (typeof input === "string") {
          input = urlToHttpOptions(new URL4(input));
        } else if (input instanceof URL4) {
          input = urlToHttpOptions(input);
        } else {
          input = { ...input };
        }
        if (typeof options === "function" || options === void 0) {
          callback = options;
          options = input;
        } else {
          options = Object.assign(input, options);
        }
        if (options.h2session) {
          this[kSession] = options.h2session;
          if (this[kSession].destroyed) {
            throw new Error("The session has been closed already");
          }
          this.protocol = this[kSession].socket.encrypted ? "https:" : "http:";
        } else if (options.agent === false) {
          this.agent = new Agent({ maxEmptySessions: 0 });
        } else if (typeof options.agent === "undefined" || options.agent === null) {
          this.agent = globalAgent;
        } else if (typeof options.agent.request === "function") {
          this.agent = options.agent;
        } else {
          throw new ERR_INVALID_ARG_TYPE("options.agent", ["http2wrapper.Agent-like Object", "undefined", "false"], options.agent);
        }
        if (this.agent) {
          this.protocol = this.agent.protocol;
        }
        if (options.protocol && options.protocol !== this.protocol) {
          throw new ERR_INVALID_PROTOCOL(options.protocol, this.protocol);
        }
        if (!options.port) {
          options.port = options.defaultPort || this.agent && this.agent.defaultPort || 443;
        }
        options.host = options.hostname || options.host || "localhost";
        delete options.hostname;
        const { timeout } = options;
        options.timeout = void 0;
        this[kHeaders] = /* @__PURE__ */ Object.create(null);
        this[kJobs] = [];
        this[kPendingAgentPromise] = void 0;
        this.socket = null;
        this.connection = null;
        this.method = options.method || "GET";
        if (!(this.method === "CONNECT" && (options.path === "/" || options.path === void 0))) {
          this.path = options.path;
        }
        this.res = null;
        this.aborted = false;
        this.reusedSocket = false;
        const { headers } = options;
        if (headers) {
          for (const header in headers) {
            this.setHeader(header, headers[header]);
          }
        }
        if (options.auth && !("authorization" in this[kHeaders])) {
          this[kHeaders].authorization = "Basic " + Buffer.from(options.auth).toString("base64");
        }
        options.session = options.tlsSession;
        options.path = options.socketPath;
        this[kOptions] = options;
        this[kOrigin] = new URL4(`${this.protocol}//${options.servername || options.host}:${options.port}`);
        const reuseSocket = options._reuseSocket;
        if (reuseSocket) {
          options.createConnection = (...args) => {
            if (reuseSocket.destroyed) {
              return this.agent.createConnection(...args);
            }
            return reuseSocket;
          };
          this.agent.getSession(this[kOrigin], this[kOptions]).catch(() => {
          });
        }
        if (timeout) {
          this.setTimeout(timeout);
        }
        if (callback) {
          this.once("response", callback);
        }
        this[kFlushedHeaders] = false;
      }
      get method() {
        return this[kHeaders][HTTP2_HEADER_METHOD];
      }
      set method(value) {
        if (value) {
          this[kHeaders][HTTP2_HEADER_METHOD] = value.toUpperCase();
        }
      }
      get path() {
        const header = this.method === "CONNECT" ? HTTP2_HEADER_AUTHORITY : HTTP2_HEADER_PATH;
        return this[kHeaders][header];
      }
      set path(value) {
        if (value) {
          const header = this.method === "CONNECT" ? HTTP2_HEADER_AUTHORITY : HTTP2_HEADER_PATH;
          this[kHeaders][header] = value;
        }
      }
      get host() {
        return this[kOrigin].hostname;
      }
      set host(_value) {
      }
      get _mustNotHaveABody() {
        return this.method === "GET" || this.method === "HEAD" || this.method === "DELETE";
      }
      _write(chunk, encoding, callback) {
        if (this._mustNotHaveABody) {
          callback(new Error("The GET, HEAD and DELETE methods must NOT have a body"));
          return;
        }
        this.flushHeaders();
        const callWrite = () => this._request.write(chunk, encoding, callback);
        if (this._request) {
          callWrite();
        } else {
          this[kJobs].push(callWrite);
        }
      }
      _final(callback) {
        this.flushHeaders();
        const callEnd = () => {
          if (this._mustNotHaveABody || this.method === "CONNECT") {
            callback();
            return;
          }
          this._request.end(callback);
        };
        if (this._request) {
          callEnd();
        } else {
          this[kJobs].push(callEnd);
        }
      }
      abort() {
        if (this.res && this.res.complete) {
          return;
        }
        if (!this.aborted) {
          process.nextTick(() => this.emit("abort"));
        }
        this.aborted = true;
        this.destroy();
      }
      async _destroy(error, callback) {
        if (this.res) {
          this.res._dump();
        }
        if (this._request) {
          this._request.destroy();
        } else {
          process.nextTick(() => {
            this.emit("close");
          });
        }
        try {
          await this[kPendingAgentPromise];
        } catch (internalError) {
          if (this.aborted) {
            error = internalError;
          }
        }
        callback(error);
      }
      async flushHeaders() {
        if (this[kFlushedHeaders] || this.destroyed) {
          return;
        }
        this[kFlushedHeaders] = true;
        const isConnectMethod = this.method === HTTP2_METHOD_CONNECT;
        const onStream = (stream2) => {
          this._request = stream2;
          if (this.destroyed) {
            stream2.destroy();
            return;
          }
          if (!isConnectMethod) {
            proxyEvents2(stream2, this, ["timeout", "continue"]);
          }
          stream2.once("error", (error) => {
            this.destroy(error);
          });
          stream2.once("aborted", () => {
            const { res } = this;
            if (res) {
              res.aborted = true;
              res.emit("aborted");
              res.destroy();
            } else {
              this.destroy(new Error("The server aborted the HTTP/2 stream"));
            }
          });
          const onResponse = (headers, flags, rawHeaders) => {
            const response = new IncomingMessage(this.socket, stream2.readableHighWaterMark);
            this.res = response;
            response.url = `${this[kOrigin].origin}${this.path}`;
            response.req = this;
            response.statusCode = headers[HTTP2_HEADER_STATUS];
            response.headers = headers;
            response.rawHeaders = rawHeaders;
            response.once("end", () => {
              response.complete = true;
              response.socket = null;
              response.connection = null;
            });
            if (isConnectMethod) {
              response.upgrade = true;
              if (this.emit("connect", response, stream2, Buffer.alloc(0))) {
                this.emit("close");
              } else {
                stream2.destroy();
              }
            } else {
              stream2.on("data", (chunk) => {
                if (!response._dumped && !response.push(chunk)) {
                  stream2.pause();
                }
              });
              stream2.once("end", () => {
                if (!this.aborted) {
                  response.push(null);
                }
              });
              if (!this.emit("response", response)) {
                response._dump();
              }
            }
          };
          stream2.once("response", onResponse);
          stream2.once("headers", (headers) => this.emit("information", { statusCode: headers[HTTP2_HEADER_STATUS] }));
          stream2.once("trailers", (trailers, flags, rawTrailers) => {
            const { res } = this;
            if (res === null) {
              onResponse(trailers, flags, rawTrailers);
              return;
            }
            res.trailers = trailers;
            res.rawTrailers = rawTrailers;
          });
          stream2.once("close", () => {
            const { aborted, res } = this;
            if (res) {
              if (aborted) {
                res.aborted = true;
                res.emit("aborted");
                res.destroy();
              }
              const finish = () => {
                res.emit("close");
                this.destroy();
                this.emit("close");
              };
              if (res.readable) {
                res.once("end", finish);
              } else {
                finish();
              }
              return;
            }
            if (!this.destroyed) {
              this.destroy(new Error("The HTTP/2 stream has been early terminated"));
              this.emit("close");
              return;
            }
            this.destroy();
            this.emit("close");
          });
          this.socket = new Proxy(stream2, proxySocketHandler);
          for (const job of this[kJobs]) {
            job();
          }
          this.emit("socket", this.socket);
        };
        if (!(HTTP2_HEADER_AUTHORITY in this[kHeaders]) && !isConnectMethod) {
          this[kHeaders][HTTP2_HEADER_AUTHORITY] = this[kOrigin].host;
        }
        if (this[kSession]) {
          try {
            onStream(this[kSession].request(this[kHeaders]));
          } catch (error) {
            this.destroy(error);
          }
        } else {
          this.reusedSocket = true;
          try {
            const promise = this.agent.request(this[kOrigin], this[kOptions], this[kHeaders]);
            this[kPendingAgentPromise] = promise;
            onStream(await promise);
            this[kPendingAgentPromise] = false;
          } catch (error) {
            this[kPendingAgentPromise] = false;
            this.destroy(error);
          }
        }
      }
      get connection() {
        return this.socket;
      }
      set connection(value) {
        this.socket = value;
      }
      getHeaderNames() {
        return Object.keys(this[kHeaders]);
      }
      hasHeader(name) {
        if (typeof name !== "string") {
          throw new ERR_INVALID_ARG_TYPE("name", "string", name);
        }
        return Boolean(this[kHeaders][name.toLowerCase()]);
      }
      getHeader(name) {
        if (typeof name !== "string") {
          throw new ERR_INVALID_ARG_TYPE("name", "string", name);
        }
        return this[kHeaders][name.toLowerCase()];
      }
      get headersSent() {
        return this[kFlushedHeaders];
      }
      removeHeader(name) {
        if (typeof name !== "string") {
          throw new ERR_INVALID_ARG_TYPE("name", "string", name);
        }
        if (this.headersSent) {
          throw new ERR_HTTP_HEADERS_SENT("remove");
        }
        delete this[kHeaders][name.toLowerCase()];
      }
      setHeader(name, value) {
        if (this.headersSent) {
          throw new ERR_HTTP_HEADERS_SENT("set");
        }
        validateHeaderName(name);
        validateHeaderValue(name, value);
        const lowercased = name.toLowerCase();
        if (lowercased === "connection") {
          if (value.toLowerCase() === "keep-alive") {
            return;
          }
          throw new Error(`Invalid 'connection' header: ${value}`);
        }
        if (lowercased === "host" && this.method === "CONNECT") {
          this[kHeaders][HTTP2_HEADER_AUTHORITY] = value;
        } else {
          this[kHeaders][lowercased] = value;
        }
      }
      setNoDelay() {
      }
      setSocketKeepAlive() {
      }
      setTimeout(ms, callback) {
        const applyTimeout = () => this._request.setTimeout(ms, callback);
        if (this._request) {
          applyTimeout();
        } else {
          this[kJobs].push(applyTimeout);
        }
        return this;
      }
      get maxHeadersCount() {
        if (!this.destroyed && this._request) {
          return this._request.session.localSettings.maxHeaderListSize;
        }
        return void 0;
      }
      set maxHeadersCount(_value) {
      }
    };
    module2.exports = ClientRequest;
  }
});

// node_modules/resolve-alpn/index.js
var require_resolve_alpn = __commonJS({
  "node_modules/resolve-alpn/index.js"(exports2, module2) {
    "use strict";
    var tls = require("tls");
    module2.exports = (options = {}, connect2 = tls.connect) => new Promise((resolve, reject) => {
      let timeout = false;
      let socket;
      const callback = async () => {
        await socketPromise;
        socket.off("timeout", onTimeout);
        socket.off("error", reject);
        if (options.resolveSocket) {
          resolve({ alpnProtocol: socket.alpnProtocol, socket, timeout });
          if (timeout) {
            await Promise.resolve();
            socket.emit("timeout");
          }
        } else {
          socket.destroy();
          resolve({ alpnProtocol: socket.alpnProtocol, timeout });
        }
      };
      const onTimeout = async () => {
        timeout = true;
        callback();
      };
      const socketPromise = (async () => {
        try {
          socket = await connect2(options, callback);
          socket.on("error", reject);
          socket.once("timeout", onTimeout);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
});

// node_modules/http2-wrapper/source/utils/calculate-server-name.js
var require_calculate_server_name = __commonJS({
  "node_modules/http2-wrapper/source/utils/calculate-server-name.js"(exports2, module2) {
    "use strict";
    var { isIP } = require("net");
    var assert2 = require("assert");
    var getHost = (host) => {
      if (host[0] === "[") {
        const idx2 = host.indexOf("]");
        assert2(idx2 !== -1);
        return host.slice(1, idx2);
      }
      const idx = host.indexOf(":");
      if (idx === -1) {
        return host;
      }
      return host.slice(0, idx);
    };
    module2.exports = (host) => {
      const servername = getHost(host);
      if (isIP(servername)) {
        return "";
      }
      return servername;
    };
  }
});

// node_modules/http2-wrapper/source/auto.js
var require_auto = __commonJS({
  "node_modules/http2-wrapper/source/auto.js"(exports2, module2) {
    "use strict";
    var { URL: URL4, urlToHttpOptions } = require("url");
    var http3 = require("http");
    var https2 = require("https");
    var resolveALPN = require_resolve_alpn();
    var QuickLRU = require_quick_lru();
    var { Agent, globalAgent } = require_agent();
    var Http2ClientRequest = require_client_request();
    var calculateServerName = require_calculate_server_name();
    var delayAsyncDestroy = require_delay_async_destroy();
    var cache = new QuickLRU({ maxSize: 100 });
    var queue = /* @__PURE__ */ new Map();
    var installSocket = (agent, socket, options) => {
      socket._httpMessage = { shouldKeepAlive: true };
      const onFree = () => {
        agent.emit("free", socket, options);
      };
      socket.on("free", onFree);
      const onClose = () => {
        agent.removeSocket(socket, options);
      };
      socket.on("close", onClose);
      const onTimeout = () => {
        const { freeSockets } = agent;
        for (const sockets of Object.values(freeSockets)) {
          if (sockets.includes(socket)) {
            socket.destroy();
            return;
          }
        }
      };
      socket.on("timeout", onTimeout);
      const onRemove = () => {
        agent.removeSocket(socket, options);
        socket.off("close", onClose);
        socket.off("free", onFree);
        socket.off("timeout", onTimeout);
        socket.off("agentRemove", onRemove);
      };
      socket.on("agentRemove", onRemove);
      agent.emit("free", socket, options);
    };
    var createResolveProtocol = (cache2, queue2 = /* @__PURE__ */ new Map(), connect2 = void 0) => {
      return async (options) => {
        const name = `${options.host}:${options.port}:${options.ALPNProtocols.sort()}`;
        if (!cache2.has(name)) {
          if (queue2.has(name)) {
            const result = await queue2.get(name);
            return { alpnProtocol: result.alpnProtocol };
          }
          const { path } = options;
          options.path = options.socketPath;
          const resultPromise = resolveALPN(options, connect2);
          queue2.set(name, resultPromise);
          try {
            const result = await resultPromise;
            cache2.set(name, result.alpnProtocol);
            queue2.delete(name);
            options.path = path;
            return result;
          } catch (error) {
            queue2.delete(name);
            options.path = path;
            throw error;
          }
        }
        return { alpnProtocol: cache2.get(name) };
      };
    };
    var defaultResolveProtocol = createResolveProtocol(cache, queue);
    module2.exports = async (input, options, callback) => {
      if (typeof input === "string") {
        input = urlToHttpOptions(new URL4(input));
      } else if (input instanceof URL4) {
        input = urlToHttpOptions(input);
      } else {
        input = { ...input };
      }
      if (typeof options === "function" || options === void 0) {
        callback = options;
        options = input;
      } else {
        options = Object.assign(input, options);
      }
      options.ALPNProtocols = options.ALPNProtocols || ["h2", "http/1.1"];
      if (!Array.isArray(options.ALPNProtocols) || options.ALPNProtocols.length === 0) {
        throw new Error("The `ALPNProtocols` option must be an Array with at least one entry");
      }
      options.protocol = options.protocol || "https:";
      const isHttps = options.protocol === "https:";
      options.host = options.hostname || options.host || "localhost";
      options.session = options.tlsSession;
      options.servername = options.servername || calculateServerName(options.headers && options.headers.host || options.host);
      options.port = options.port || (isHttps ? 443 : 80);
      options._defaultAgent = isHttps ? https2.globalAgent : http3.globalAgent;
      const resolveProtocol = options.resolveProtocol || defaultResolveProtocol;
      let { agent } = options;
      if (agent !== void 0 && agent !== false && agent.constructor.name !== "Object") {
        throw new Error("The `options.agent` can be only an object `http`, `https` or `http2` properties");
      }
      if (isHttps) {
        options.resolveSocket = true;
        let { socket, alpnProtocol, timeout } = await resolveProtocol(options);
        if (timeout) {
          if (socket) {
            socket.destroy();
          }
          const error = new Error(`Timed out resolving ALPN: ${options.timeout} ms`);
          error.code = "ETIMEDOUT";
          error.ms = options.timeout;
          throw error;
        }
        if (socket && options.createConnection) {
          socket.destroy();
          socket = void 0;
        }
        delete options.resolveSocket;
        const isHttp2 = alpnProtocol === "h2";
        if (agent) {
          agent = isHttp2 ? agent.http2 : agent.https;
          options.agent = agent;
        }
        if (agent === void 0) {
          agent = isHttp2 ? globalAgent : https2.globalAgent;
        }
        if (socket) {
          if (agent === false) {
            socket.destroy();
          } else {
            const defaultCreateConnection = (isHttp2 ? Agent : https2.Agent).prototype.createConnection;
            if (agent.createConnection === defaultCreateConnection) {
              if (isHttp2) {
                options._reuseSocket = socket;
              } else {
                installSocket(agent, socket, options);
              }
            } else {
              socket.destroy();
            }
          }
        }
        if (isHttp2) {
          return delayAsyncDestroy(new Http2ClientRequest(options, callback));
        }
      } else if (agent) {
        options.agent = agent.http;
      }
      return delayAsyncDestroy(http3.request(options, callback));
    };
    module2.exports.protocolCache = cache;
    module2.exports.resolveProtocol = defaultResolveProtocol;
    module2.exports.createResolveProtocol = createResolveProtocol;
  }
});

// node_modules/http2-wrapper/source/utils/js-stream-socket.js
var require_js_stream_socket = __commonJS({
  "node_modules/http2-wrapper/source/utils/js-stream-socket.js"(exports2, module2) {
    "use strict";
    var stream2 = require("stream");
    var tls = require("tls");
    var JSStreamSocket = new tls.TLSSocket(new stream2.PassThrough())._handle._parentWrap.constructor;
    module2.exports = JSStreamSocket;
  }
});

// node_modules/http2-wrapper/source/proxies/unexpected-status-code-error.js
var require_unexpected_status_code_error = __commonJS({
  "node_modules/http2-wrapper/source/proxies/unexpected-status-code-error.js"(exports2, module2) {
    "use strict";
    var UnexpectedStatusCodeError = class extends Error {
      constructor(statusCode) {
        super(`The proxy server rejected the request with status code ${statusCode}`);
        this.statusCode = statusCode;
      }
    };
    module2.exports = UnexpectedStatusCodeError;
  }
});

// node_modules/http2-wrapper/source/utils/check-type.js
var require_check_type = __commonJS({
  "node_modules/http2-wrapper/source/utils/check-type.js"(exports2, module2) {
    "use strict";
    var checkType = (name, value, types2) => {
      const valid = types2.some((type) => {
        const typeofType = typeof type;
        if (typeofType === "string") {
          return typeof value === type;
        }
        return value instanceof type;
      });
      if (!valid) {
        const names = types2.map((type) => typeof type === "string" ? type : type.name);
        throw new TypeError(`Expected '${name}' to be a type of ${names.join(" or ")}, got ${typeof value}`);
      }
    };
    module2.exports = checkType;
  }
});

// node_modules/http2-wrapper/source/proxies/initialize.js
var require_initialize = __commonJS({
  "node_modules/http2-wrapper/source/proxies/initialize.js"(exports2, module2) {
    "use strict";
    var { URL: URL4 } = require("url");
    var checkType = require_check_type();
    module2.exports = (self2, proxyOptions) => {
      checkType("proxyOptions", proxyOptions, ["object"]);
      checkType("proxyOptions.headers", proxyOptions.headers, ["object", "undefined"]);
      checkType("proxyOptions.raw", proxyOptions.raw, ["boolean", "undefined"]);
      checkType("proxyOptions.url", proxyOptions.url, [URL4, "string"]);
      const url2 = new URL4(proxyOptions.url);
      self2.proxyOptions = {
        raw: true,
        ...proxyOptions,
        headers: { ...proxyOptions.headers },
        url: url2
      };
    };
  }
});

// node_modules/http2-wrapper/source/proxies/get-auth-headers.js
var require_get_auth_headers = __commonJS({
  "node_modules/http2-wrapper/source/proxies/get-auth-headers.js"(exports2, module2) {
    "use strict";
    module2.exports = (self2) => {
      const { username, password } = self2.proxyOptions.url;
      if (username || password) {
        const data = `${username}:${password}`;
        const authorization = `Basic ${Buffer.from(data).toString("base64")}`;
        return {
          "proxy-authorization": authorization,
          authorization
        };
      }
      return {};
    };
  }
});

// node_modules/http2-wrapper/source/proxies/h1-over-h2.js
var require_h1_over_h2 = __commonJS({
  "node_modules/http2-wrapper/source/proxies/h1-over-h2.js"(exports2, module2) {
    "use strict";
    var tls = require("tls");
    var http3 = require("http");
    var https2 = require("https");
    var JSStreamSocket = require_js_stream_socket();
    var { globalAgent } = require_agent();
    var UnexpectedStatusCodeError = require_unexpected_status_code_error();
    var initialize = require_initialize();
    var getAuthorizationHeaders = require_get_auth_headers();
    var createConnection = (self2, options, callback) => {
      (async () => {
        try {
          const { proxyOptions } = self2;
          const { url: url2, headers, raw } = proxyOptions;
          const stream2 = await globalAgent.request(url2, proxyOptions, {
            ...getAuthorizationHeaders(self2),
            ...headers,
            ":method": "CONNECT",
            ":authority": `${options.host}:${options.port}`
          });
          stream2.once("error", callback);
          stream2.once("response", (headers2) => {
            const statusCode = headers2[":status"];
            if (statusCode !== 200) {
              callback(new UnexpectedStatusCodeError(statusCode));
              return;
            }
            const encrypted = self2 instanceof https2.Agent;
            if (raw && encrypted) {
              options.socket = stream2;
              const secureStream = tls.connect(options);
              secureStream.once("close", () => {
                stream2.destroy();
              });
              callback(null, secureStream);
              return;
            }
            const socket = new JSStreamSocket(stream2);
            socket.encrypted = false;
            socket._handle.getpeername = (out) => {
              out.family = void 0;
              out.address = void 0;
              out.port = void 0;
            };
            callback(null, socket);
          });
        } catch (error) {
          callback(error);
        }
      })();
    };
    var HttpOverHttp2 = class extends http3.Agent {
      constructor(options) {
        super(options);
        initialize(this, options.proxyOptions);
      }
      createConnection(options, callback) {
        createConnection(this, options, callback);
      }
    };
    var HttpsOverHttp2 = class extends https2.Agent {
      constructor(options) {
        super(options);
        initialize(this, options.proxyOptions);
      }
      createConnection(options, callback) {
        createConnection(this, options, callback);
      }
    };
    module2.exports = {
      HttpOverHttp2,
      HttpsOverHttp2
    };
  }
});

// node_modules/http2-wrapper/source/proxies/h2-over-hx.js
var require_h2_over_hx = __commonJS({
  "node_modules/http2-wrapper/source/proxies/h2-over-hx.js"(exports2, module2) {
    "use strict";
    var { Agent } = require_agent();
    var JSStreamSocket = require_js_stream_socket();
    var UnexpectedStatusCodeError = require_unexpected_status_code_error();
    var initialize = require_initialize();
    var Http2OverHttpX = class extends Agent {
      constructor(options) {
        super(options);
        initialize(this, options.proxyOptions);
      }
      async createConnection(origin, options) {
        const authority = `${origin.hostname}:${origin.port || 443}`;
        const [stream2, statusCode] = await this._getProxyStream(authority);
        if (statusCode !== 200) {
          throw new UnexpectedStatusCodeError(statusCode);
        }
        if (this.proxyOptions.raw) {
          options.socket = stream2;
        } else {
          const socket = new JSStreamSocket(stream2);
          socket.encrypted = false;
          socket._handle.getpeername = (out) => {
            out.family = void 0;
            out.address = void 0;
            out.port = void 0;
          };
          return socket;
        }
        return super.createConnection(origin, options);
      }
    };
    module2.exports = Http2OverHttpX;
  }
});

// node_modules/http2-wrapper/source/proxies/h2-over-h2.js
var require_h2_over_h2 = __commonJS({
  "node_modules/http2-wrapper/source/proxies/h2-over-h2.js"(exports2, module2) {
    "use strict";
    var { globalAgent } = require_agent();
    var Http2OverHttpX = require_h2_over_hx();
    var getAuthorizationHeaders = require_get_auth_headers();
    var getStatusCode = (stream2) => new Promise((resolve, reject) => {
      stream2.once("error", reject);
      stream2.once("response", (headers) => {
        stream2.off("error", reject);
        resolve(headers[":status"]);
      });
    });
    var Http2OverHttp2 = class extends Http2OverHttpX {
      async _getProxyStream(authority) {
        const { proxyOptions } = this;
        const headers = {
          ...getAuthorizationHeaders(this),
          ...proxyOptions.headers,
          ":method": "CONNECT",
          ":authority": authority
        };
        const stream2 = await globalAgent.request(proxyOptions.url, proxyOptions, headers);
        const statusCode = await getStatusCode(stream2);
        return [stream2, statusCode];
      }
    };
    module2.exports = Http2OverHttp2;
  }
});

// node_modules/http2-wrapper/source/proxies/h2-over-h1.js
var require_h2_over_h1 = __commonJS({
  "node_modules/http2-wrapper/source/proxies/h2-over-h1.js"(exports2, module2) {
    "use strict";
    var http3 = require("http");
    var https2 = require("https");
    var Http2OverHttpX = require_h2_over_hx();
    var getAuthorizationHeaders = require_get_auth_headers();
    var getStream2 = (request2) => new Promise((resolve, reject) => {
      const onConnect = (response, socket, head) => {
        socket.unshift(head);
        request2.off("error", reject);
        resolve([socket, response.statusCode]);
      };
      request2.once("error", reject);
      request2.once("connect", onConnect);
    });
    var Http2OverHttp = class extends Http2OverHttpX {
      async _getProxyStream(authority) {
        const { proxyOptions } = this;
        const { url: url2, headers } = this.proxyOptions;
        const network = url2.protocol === "https:" ? https2 : http3;
        const request2 = network.request({
          ...proxyOptions,
          hostname: url2.hostname,
          port: url2.port,
          path: authority,
          headers: {
            ...getAuthorizationHeaders(this),
            ...headers,
            host: authority
          },
          method: "CONNECT"
        }).end();
        return getStream2(request2);
      }
    };
    module2.exports = {
      Http2OverHttp,
      Http2OverHttps: Http2OverHttp
    };
  }
});

// node_modules/http2-wrapper/source/index.js
var require_source2 = __commonJS({
  "node_modules/http2-wrapper/source/index.js"(exports2, module2) {
    "use strict";
    var http22 = require("http2");
    var {
      Agent,
      globalAgent
    } = require_agent();
    var ClientRequest = require_client_request();
    var IncomingMessage = require_incoming_message();
    var auto = require_auto();
    var {
      HttpOverHttp2,
      HttpsOverHttp2
    } = require_h1_over_h2();
    var Http2OverHttp2 = require_h2_over_h2();
    var {
      Http2OverHttp,
      Http2OverHttps
    } = require_h2_over_h1();
    var validateHeaderName = require_validate_header_name();
    var validateHeaderValue = require_validate_header_value();
    var request2 = (url2, options, callback) => new ClientRequest(url2, options, callback);
    var get2 = (url2, options, callback) => {
      const req = new ClientRequest(url2, options, callback);
      req.end();
      return req;
    };
    module2.exports = {
      ...http22,
      ClientRequest,
      IncomingMessage,
      Agent,
      globalAgent,
      request: request2,
      get: get2,
      auto,
      proxies: {
        HttpOverHttp2,
        HttpsOverHttp2,
        Http2OverHttp2,
        Http2OverHttp,
        Http2OverHttps
      },
      validateHeaderName,
      validateHeaderValue
    };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse3(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse3(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env2) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env2).forEach((key) => {
        createDebug[key] = env2[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os2 = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env: env2 } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env2) {
      if (env2.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env2.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env2.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env2.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env2.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os2.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env2) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env2) || env2.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env2) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env2.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env2.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env2) {
        const version3 = parseInt((env2.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env2.TERM_PROGRAM) {
          case "iTerm.app":
            return version3 >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env2.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env2.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env2) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream2) {
      const level = supportsColor(stream2, stream2 && stream2.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util2 = require("util");
    exports2.init = init2;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util2.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return new Date().toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util2.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init2(debug) {
      debug.inspectOpts = {};
      const keys2 = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys2.length; i++) {
        debug.inspectOpts[keys2[i]] = exports2.inspectOpts[keys2[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src2 = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/@tootallnate/once/dist/index.js
var require_dist = __commonJS({
  "node_modules/@tootallnate/once/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function once(emitter, name, { signal } = {}) {
      return new Promise((resolve, reject) => {
        function cleanup() {
          signal === null || signal === void 0 ? void 0 : signal.removeEventListener("abort", cleanup);
          emitter.removeListener(name, onEvent);
          emitter.removeListener("error", onError);
        }
        function onEvent(...args) {
          cleanup();
          resolve(args);
        }
        function onError(err) {
          cleanup();
          reject(err);
        }
        signal === null || signal === void 0 ? void 0 : signal.addEventListener("abort", cleanup);
        emitter.on(name, onEvent);
        emitter.on("error", onError);
      });
    }
    exports2.default = once;
  }
});

// node_modules/agent-base/dist/src/promisify.js
var require_promisify = __commonJS({
  "node_modules/agent-base/dist/src/promisify.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function promisify5(fn) {
      return function(req, opts) {
        return new Promise((resolve, reject) => {
          fn.call(this, req, opts, (err, rtn) => {
            if (err) {
              reject(err);
            } else {
              resolve(rtn);
            }
          });
        });
      };
    }
    exports2.default = promisify5;
  }
});

// node_modules/agent-base/dist/src/index.js
var require_src3 = __commonJS({
  "node_modules/agent-base/dist/src/index.js"(exports2, module2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    var events_1 = require("events");
    var debug_1 = __importDefault2(require_src2());
    var promisify_1 = __importDefault2(require_promisify());
    var debug = debug_1.default("agent-base");
    function isAgent(v) {
      return Boolean(v) && typeof v.addRequest === "function";
    }
    function isSecureEndpoint() {
      const { stack } = new Error();
      if (typeof stack !== "string")
        return false;
      return stack.split("\n").some((l) => l.indexOf("(https.js:") !== -1 || l.indexOf("node:https:") !== -1);
    }
    function createAgent(callback, opts) {
      return new createAgent.Agent(callback, opts);
    }
    (function(createAgent2) {
      class Agent extends events_1.EventEmitter {
        constructor(callback, _opts) {
          super();
          let opts = _opts;
          if (typeof callback === "function") {
            this.callback = callback;
          } else if (callback) {
            opts = callback;
          }
          this.timeout = null;
          if (opts && typeof opts.timeout === "number") {
            this.timeout = opts.timeout;
          }
          this.maxFreeSockets = 1;
          this.maxSockets = 1;
          this.maxTotalSockets = Infinity;
          this.sockets = {};
          this.freeSockets = {};
          this.requests = {};
          this.options = {};
        }
        get defaultPort() {
          if (typeof this.explicitDefaultPort === "number") {
            return this.explicitDefaultPort;
          }
          return isSecureEndpoint() ? 443 : 80;
        }
        set defaultPort(v) {
          this.explicitDefaultPort = v;
        }
        get protocol() {
          if (typeof this.explicitProtocol === "string") {
            return this.explicitProtocol;
          }
          return isSecureEndpoint() ? "https:" : "http:";
        }
        set protocol(v) {
          this.explicitProtocol = v;
        }
        callback(req, opts, fn) {
          throw new Error('"agent-base" has no default implementation, you must subclass and override `callback()`');
        }
        addRequest(req, _opts) {
          const opts = Object.assign({}, _opts);
          if (typeof opts.secureEndpoint !== "boolean") {
            opts.secureEndpoint = isSecureEndpoint();
          }
          if (opts.host == null) {
            opts.host = "localhost";
          }
          if (opts.port == null) {
            opts.port = opts.secureEndpoint ? 443 : 80;
          }
          if (opts.protocol == null) {
            opts.protocol = opts.secureEndpoint ? "https:" : "http:";
          }
          if (opts.host && opts.path) {
            delete opts.path;
          }
          delete opts.agent;
          delete opts.hostname;
          delete opts._defaultAgent;
          delete opts.defaultPort;
          delete opts.createConnection;
          req._last = true;
          req.shouldKeepAlive = false;
          let timedOut2 = false;
          let timeoutId = null;
          const timeoutMs = opts.timeout || this.timeout;
          const onerror = (err) => {
            if (req._hadError)
              return;
            req.emit("error", err);
            req._hadError = true;
          };
          const ontimeout = () => {
            timeoutId = null;
            timedOut2 = true;
            const err = new Error(`A "socket" was not created for HTTP request before ${timeoutMs}ms`);
            err.code = "ETIMEOUT";
            onerror(err);
          };
          const callbackError = (err) => {
            if (timedOut2)
              return;
            if (timeoutId !== null) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            onerror(err);
          };
          const onsocket = (socket) => {
            if (timedOut2)
              return;
            if (timeoutId != null) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            if (isAgent(socket)) {
              debug("Callback returned another Agent instance %o", socket.constructor.name);
              socket.addRequest(req, opts);
              return;
            }
            if (socket) {
              socket.once("free", () => {
                this.freeSocket(socket, opts);
              });
              req.onSocket(socket);
              return;
            }
            const err = new Error(`no Duplex stream was returned to agent-base for \`${req.method} ${req.path}\``);
            onerror(err);
          };
          if (typeof this.callback !== "function") {
            onerror(new Error("`callback` is not defined"));
            return;
          }
          if (!this.promisifiedCallback) {
            if (this.callback.length >= 3) {
              debug("Converting legacy callback function to promise");
              this.promisifiedCallback = promisify_1.default(this.callback);
            } else {
              this.promisifiedCallback = this.callback;
            }
          }
          if (typeof timeoutMs === "number" && timeoutMs > 0) {
            timeoutId = setTimeout(ontimeout, timeoutMs);
          }
          if ("port" in opts && typeof opts.port !== "number") {
            opts.port = Number(opts.port);
          }
          try {
            debug("Resolving socket for %o request: %o", opts.protocol, `${req.method} ${req.path}`);
            Promise.resolve(this.promisifiedCallback(req, opts)).then(onsocket, callbackError);
          } catch (err) {
            Promise.reject(err).catch(callbackError);
          }
        }
        freeSocket(socket, opts) {
          debug("Freeing socket %o %o", socket.constructor.name, opts);
          socket.destroy();
        }
        destroy() {
          debug("Destroying agent %o", this.constructor.name);
        }
      }
      createAgent2.Agent = Agent;
      createAgent2.prototype = createAgent2.Agent.prototype;
    })(createAgent || (createAgent = {}));
    module2.exports = createAgent;
  }
});

// node_modules/http-proxy-agent/dist/agent.js
var require_agent2 = __commonJS({
  "node_modules/http-proxy-agent/dist/agent.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var net_1 = __importDefault2(require("net"));
    var tls_1 = __importDefault2(require("tls"));
    var url_1 = __importDefault2(require("url"));
    var debug_1 = __importDefault2(require_src2());
    var once_1 = __importDefault2(require_dist());
    var agent_base_1 = require_src3();
    var debug = (0, debug_1.default)("http-proxy-agent");
    function isHTTPS(protocol) {
      return typeof protocol === "string" ? /^https:?$/i.test(protocol) : false;
    }
    var HttpProxyAgent2 = class extends agent_base_1.Agent {
      constructor(_opts) {
        let opts;
        if (typeof _opts === "string") {
          opts = url_1.default.parse(_opts);
        } else {
          opts = _opts;
        }
        if (!opts) {
          throw new Error("an HTTP(S) proxy server `host` and `port` must be specified!");
        }
        debug("Creating new HttpProxyAgent instance: %o", opts);
        super(opts);
        const proxy = Object.assign({}, opts);
        this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
        proxy.host = proxy.hostname || proxy.host;
        if (typeof proxy.port === "string") {
          proxy.port = parseInt(proxy.port, 10);
        }
        if (!proxy.port && proxy.host) {
          proxy.port = this.secureProxy ? 443 : 80;
        }
        if (proxy.host && proxy.path) {
          delete proxy.path;
          delete proxy.pathname;
        }
        this.proxy = proxy;
      }
      callback(req, opts) {
        return __awaiter2(this, void 0, void 0, function* () {
          const { proxy, secureProxy } = this;
          const parsed = url_1.default.parse(req.path);
          if (!parsed.protocol) {
            parsed.protocol = "http:";
          }
          if (!parsed.hostname) {
            parsed.hostname = opts.hostname || opts.host || null;
          }
          if (parsed.port == null && typeof opts.port) {
            parsed.port = String(opts.port);
          }
          if (parsed.port === "80") {
            parsed.port = "";
          }
          req.path = url_1.default.format(parsed);
          if (proxy.auth) {
            req.setHeader("Proxy-Authorization", `Basic ${Buffer.from(proxy.auth).toString("base64")}`);
          }
          let socket;
          if (secureProxy) {
            debug("Creating `tls.Socket`: %o", proxy);
            socket = tls_1.default.connect(proxy);
          } else {
            debug("Creating `net.Socket`: %o", proxy);
            socket = net_1.default.connect(proxy);
          }
          if (req._header) {
            let first;
            let endOfHeaders;
            debug("Regenerating stored HTTP header string for request");
            req._header = null;
            req._implicitHeader();
            if (req.output && req.output.length > 0) {
              debug("Patching connection write() output buffer with updated header");
              first = req.output[0];
              endOfHeaders = first.indexOf("\r\n\r\n") + 4;
              req.output[0] = req._header + first.substring(endOfHeaders);
              debug("Output buffer: %o", req.output);
            } else if (req.outputData && req.outputData.length > 0) {
              debug("Patching connection write() output buffer with updated header");
              first = req.outputData[0].data;
              endOfHeaders = first.indexOf("\r\n\r\n") + 4;
              req.outputData[0].data = req._header + first.substring(endOfHeaders);
              debug("Output buffer: %o", req.outputData[0].data);
            }
          }
          yield (0, once_1.default)(socket, "connect");
          return socket;
        });
      }
    };
    exports2.default = HttpProxyAgent2;
  }
});

// node_modules/http-proxy-agent/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/http-proxy-agent/dist/index.js"(exports2, module2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    var agent_1 = __importDefault2(require_agent2());
    function createHttpProxyAgent(opts) {
      return new agent_1.default(opts);
    }
    (function(createHttpProxyAgent2) {
      createHttpProxyAgent2.HttpProxyAgent = agent_1.default;
      createHttpProxyAgent2.prototype = agent_1.default.prototype;
    })(createHttpProxyAgent || (createHttpProxyAgent = {}));
    module2.exports = createHttpProxyAgent;
  }
});

// node_modules/https-proxy-agent/dist/parse-proxy-response.js
var require_parse_proxy_response = __commonJS({
  "node_modules/https-proxy-agent/dist/parse-proxy-response.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var debug_1 = __importDefault2(require_src2());
    var debug = debug_1.default("https-proxy-agent:parse-proxy-response");
    function parseProxyResponse(socket) {
      return new Promise((resolve, reject) => {
        let buffersLength = 0;
        const buffers = [];
        function read() {
          const b = socket.read();
          if (b)
            ondata(b);
          else
            socket.once("readable", read);
        }
        function cleanup() {
          socket.removeListener("end", onend);
          socket.removeListener("error", onerror);
          socket.removeListener("close", onclose);
          socket.removeListener("readable", read);
        }
        function onclose(err) {
          debug("onclose had error %o", err);
        }
        function onend() {
          debug("onend");
        }
        function onerror(err) {
          cleanup();
          debug("onerror %o", err);
          reject(err);
        }
        function ondata(b) {
          buffers.push(b);
          buffersLength += b.length;
          const buffered = Buffer.concat(buffers, buffersLength);
          const endOfHeaders = buffered.indexOf("\r\n\r\n");
          if (endOfHeaders === -1) {
            debug("have not received end of HTTP headers yet...");
            read();
            return;
          }
          const firstLine = buffered.toString("ascii", 0, buffered.indexOf("\r\n"));
          const statusCode = +firstLine.split(" ")[1];
          debug("got proxy server response: %o", firstLine);
          resolve({
            statusCode,
            buffered
          });
        }
        socket.on("error", onerror);
        socket.on("close", onclose);
        socket.on("end", onend);
        read();
      });
    }
    exports2.default = parseProxyResponse;
  }
});

// node_modules/https-proxy-agent/dist/agent.js
var require_agent3 = __commonJS({
  "node_modules/https-proxy-agent/dist/agent.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var net_1 = __importDefault2(require("net"));
    var tls_1 = __importDefault2(require("tls"));
    var url_1 = __importDefault2(require("url"));
    var assert_1 = __importDefault2(require("assert"));
    var debug_1 = __importDefault2(require_src2());
    var agent_base_1 = require_src3();
    var parse_proxy_response_1 = __importDefault2(require_parse_proxy_response());
    var debug = debug_1.default("https-proxy-agent:agent");
    var HttpsProxyAgent2 = class extends agent_base_1.Agent {
      constructor(_opts) {
        let opts;
        if (typeof _opts === "string") {
          opts = url_1.default.parse(_opts);
        } else {
          opts = _opts;
        }
        if (!opts) {
          throw new Error("an HTTP(S) proxy server `host` and `port` must be specified!");
        }
        debug("creating new HttpsProxyAgent instance: %o", opts);
        super(opts);
        const proxy = Object.assign({}, opts);
        this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
        proxy.host = proxy.hostname || proxy.host;
        if (typeof proxy.port === "string") {
          proxy.port = parseInt(proxy.port, 10);
        }
        if (!proxy.port && proxy.host) {
          proxy.port = this.secureProxy ? 443 : 80;
        }
        if (this.secureProxy && !("ALPNProtocols" in proxy)) {
          proxy.ALPNProtocols = ["http 1.1"];
        }
        if (proxy.host && proxy.path) {
          delete proxy.path;
          delete proxy.pathname;
        }
        this.proxy = proxy;
      }
      callback(req, opts) {
        return __awaiter2(this, void 0, void 0, function* () {
          const { proxy, secureProxy } = this;
          let socket;
          if (secureProxy) {
            debug("Creating `tls.Socket`: %o", proxy);
            socket = tls_1.default.connect(proxy);
          } else {
            debug("Creating `net.Socket`: %o", proxy);
            socket = net_1.default.connect(proxy);
          }
          const headers = Object.assign({}, proxy.headers);
          const hostname = `${opts.host}:${opts.port}`;
          let payload = `CONNECT ${hostname} HTTP/1.1\r
`;
          if (proxy.auth) {
            headers["Proxy-Authorization"] = `Basic ${Buffer.from(proxy.auth).toString("base64")}`;
          }
          let { host, port, secureEndpoint } = opts;
          if (!isDefaultPort(port, secureEndpoint)) {
            host += `:${port}`;
          }
          headers.Host = host;
          headers.Connection = "close";
          for (const name of Object.keys(headers)) {
            payload += `${name}: ${headers[name]}\r
`;
          }
          const proxyResponsePromise = parse_proxy_response_1.default(socket);
          socket.write(`${payload}\r
`);
          const { statusCode, buffered } = yield proxyResponsePromise;
          if (statusCode === 200) {
            req.once("socket", resume);
            if (opts.secureEndpoint) {
              debug("Upgrading socket connection to TLS");
              const servername = opts.servername || opts.host;
              return tls_1.default.connect(Object.assign(Object.assign({}, omit(opts, "host", "hostname", "path", "port")), {
                socket,
                servername
              }));
            }
            return socket;
          }
          socket.destroy();
          const fakeSocket = new net_1.default.Socket({ writable: false });
          fakeSocket.readable = true;
          req.once("socket", (s) => {
            debug("replaying proxy buffer for failed request");
            assert_1.default(s.listenerCount("data") > 0);
            s.push(buffered);
            s.push(null);
          });
          return fakeSocket;
        });
      }
    };
    exports2.default = HttpsProxyAgent2;
    function resume(socket) {
      socket.resume();
    }
    function isDefaultPort(port, secure) {
      return Boolean(!secure && port === 80 || secure && port === 443);
    }
    function isHTTPS(protocol) {
      return typeof protocol === "string" ? /^https:?$/i.test(protocol) : false;
    }
    function omit(obj, ...keys2) {
      const ret = {};
      let key;
      for (key in obj) {
        if (!keys2.includes(key)) {
          ret[key] = obj[key];
        }
      }
      return ret;
    }
  }
});

// node_modules/https-proxy-agent/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/https-proxy-agent/dist/index.js"(exports2, module2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    var agent_1 = __importDefault2(require_agent3());
    function createHttpsProxyAgent(opts) {
      return new agent_1.default(opts);
    }
    (function(createHttpsProxyAgent2) {
      createHttpsProxyAgent2.HttpsProxyAgent = agent_1.default;
      createHttpsProxyAgent2.prototype = agent_1.default.prototype;
    })(createHttpsProxyAgent || (createHttpsProxyAgent = {}));
    module2.exports = createHttpsProxyAgent;
  }
});

// node_modules/ip/lib/ip.js
var require_ip = __commonJS({
  "node_modules/ip/lib/ip.js"(exports2) {
    var ip = exports2;
    var { Buffer: Buffer8 } = require("buffer");
    var os2 = require("os");
    ip.toBuffer = function(ip2, buff, offset) {
      offset = ~~offset;
      let result;
      if (this.isV4Format(ip2)) {
        result = buff || Buffer8.alloc(offset + 4);
        ip2.split(/\./g).map((byte) => {
          result[offset++] = parseInt(byte, 10) & 255;
        });
      } else if (this.isV6Format(ip2)) {
        const sections = ip2.split(":", 8);
        let i;
        for (i = 0; i < sections.length; i++) {
          const isv4 = this.isV4Format(sections[i]);
          let v4Buffer;
          if (isv4) {
            v4Buffer = this.toBuffer(sections[i]);
            sections[i] = v4Buffer.slice(0, 2).toString("hex");
          }
          if (v4Buffer && ++i < 8) {
            sections.splice(i, 0, v4Buffer.slice(2, 4).toString("hex"));
          }
        }
        if (sections[0] === "") {
          while (sections.length < 8)
            sections.unshift("0");
        } else if (sections[sections.length - 1] === "") {
          while (sections.length < 8)
            sections.push("0");
        } else if (sections.length < 8) {
          for (i = 0; i < sections.length && sections[i] !== ""; i++)
            ;
          const argv = [i, 1];
          for (i = 9 - sections.length; i > 0; i--) {
            argv.push("0");
          }
          sections.splice(...argv);
        }
        result = buff || Buffer8.alloc(offset + 16);
        for (i = 0; i < sections.length; i++) {
          const word = parseInt(sections[i], 16);
          result[offset++] = word >> 8 & 255;
          result[offset++] = word & 255;
        }
      }
      if (!result) {
        throw Error(`Invalid ip address: ${ip2}`);
      }
      return result;
    };
    ip.toString = function(buff, offset, length) {
      offset = ~~offset;
      length = length || buff.length - offset;
      let result = [];
      if (length === 4) {
        for (let i = 0; i < length; i++) {
          result.push(buff[offset + i]);
        }
        result = result.join(".");
      } else if (length === 16) {
        for (let i = 0; i < length; i += 2) {
          result.push(buff.readUInt16BE(offset + i).toString(16));
        }
        result = result.join(":");
        result = result.replace(/(^|:)0(:0)*:0(:|$)/, "$1::$3");
        result = result.replace(/:{3,4}/, "::");
      }
      return result;
    };
    var ipv4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/;
    var ipv6Regex = /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;
    ip.isV4Format = function(ip2) {
      return ipv4Regex.test(ip2);
    };
    ip.isV6Format = function(ip2) {
      return ipv6Regex.test(ip2);
    };
    function _normalizeFamily(family) {
      if (family === 4) {
        return "ipv4";
      }
      if (family === 6) {
        return "ipv6";
      }
      return family ? family.toLowerCase() : "ipv4";
    }
    ip.fromPrefixLen = function(prefixlen, family) {
      if (prefixlen > 32) {
        family = "ipv6";
      } else {
        family = _normalizeFamily(family);
      }
      let len = 4;
      if (family === "ipv6") {
        len = 16;
      }
      const buff = Buffer8.alloc(len);
      for (let i = 0, n = buff.length; i < n; ++i) {
        let bits = 8;
        if (prefixlen < 8) {
          bits = prefixlen;
        }
        prefixlen -= bits;
        buff[i] = ~(255 >> bits) & 255;
      }
      return ip.toString(buff);
    };
    ip.mask = function(addr, mask) {
      addr = ip.toBuffer(addr);
      mask = ip.toBuffer(mask);
      const result = Buffer8.alloc(Math.max(addr.length, mask.length));
      let i;
      if (addr.length === mask.length) {
        for (i = 0; i < addr.length; i++) {
          result[i] = addr[i] & mask[i];
        }
      } else if (mask.length === 4) {
        for (i = 0; i < mask.length; i++) {
          result[i] = addr[addr.length - 4 + i] & mask[i];
        }
      } else {
        for (i = 0; i < result.length - 6; i++) {
          result[i] = 0;
        }
        result[10] = 255;
        result[11] = 255;
        for (i = 0; i < addr.length; i++) {
          result[i + 12] = addr[i] & mask[i + 12];
        }
        i += 12;
      }
      for (; i < result.length; i++) {
        result[i] = 0;
      }
      return ip.toString(result);
    };
    ip.cidr = function(cidrString) {
      const cidrParts = cidrString.split("/");
      const addr = cidrParts[0];
      if (cidrParts.length !== 2) {
        throw new Error(`invalid CIDR subnet: ${addr}`);
      }
      const mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));
      return ip.mask(addr, mask);
    };
    ip.subnet = function(addr, mask) {
      const networkAddress = ip.toLong(ip.mask(addr, mask));
      const maskBuffer = ip.toBuffer(mask);
      let maskLength = 0;
      for (let i = 0; i < maskBuffer.length; i++) {
        if (maskBuffer[i] === 255) {
          maskLength += 8;
        } else {
          let octet = maskBuffer[i] & 255;
          while (octet) {
            octet = octet << 1 & 255;
            maskLength++;
          }
        }
      }
      const numberOfAddresses = 2 ** (32 - maskLength);
      return {
        networkAddress: ip.fromLong(networkAddress),
        firstAddress: numberOfAddresses <= 2 ? ip.fromLong(networkAddress) : ip.fromLong(networkAddress + 1),
        lastAddress: numberOfAddresses <= 2 ? ip.fromLong(networkAddress + numberOfAddresses - 1) : ip.fromLong(networkAddress + numberOfAddresses - 2),
        broadcastAddress: ip.fromLong(networkAddress + numberOfAddresses - 1),
        subnetMask: mask,
        subnetMaskLength: maskLength,
        numHosts: numberOfAddresses <= 2 ? numberOfAddresses : numberOfAddresses - 2,
        length: numberOfAddresses,
        contains(other) {
          return networkAddress === ip.toLong(ip.mask(other, mask));
        }
      };
    };
    ip.cidrSubnet = function(cidrString) {
      const cidrParts = cidrString.split("/");
      const addr = cidrParts[0];
      if (cidrParts.length !== 2) {
        throw new Error(`invalid CIDR subnet: ${addr}`);
      }
      const mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));
      return ip.subnet(addr, mask);
    };
    ip.not = function(addr) {
      const buff = ip.toBuffer(addr);
      for (let i = 0; i < buff.length; i++) {
        buff[i] = 255 ^ buff[i];
      }
      return ip.toString(buff);
    };
    ip.or = function(a, b) {
      a = ip.toBuffer(a);
      b = ip.toBuffer(b);
      if (a.length === b.length) {
        for (let i = 0; i < a.length; ++i) {
          a[i] |= b[i];
        }
        return ip.toString(a);
      }
      let buff = a;
      let other = b;
      if (b.length > a.length) {
        buff = b;
        other = a;
      }
      const offset = buff.length - other.length;
      for (let i = offset; i < buff.length; ++i) {
        buff[i] |= other[i - offset];
      }
      return ip.toString(buff);
    };
    ip.isEqual = function(a, b) {
      a = ip.toBuffer(a);
      b = ip.toBuffer(b);
      if (a.length === b.length) {
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i])
            return false;
        }
        return true;
      }
      if (b.length === 4) {
        const t = b;
        b = a;
        a = t;
      }
      for (let i = 0; i < 10; i++) {
        if (b[i] !== 0)
          return false;
      }
      const word = b.readUInt16BE(10);
      if (word !== 0 && word !== 65535)
        return false;
      for (let i = 0; i < 4; i++) {
        if (a[i] !== b[i + 12])
          return false;
      }
      return true;
    };
    ip.isPrivate = function(addr) {
      return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^f[cd][0-9a-f]{2}:/i.test(addr) || /^fe80:/i.test(addr) || /^::1$/.test(addr) || /^::$/.test(addr);
    };
    ip.isPublic = function(addr) {
      return !ip.isPrivate(addr);
    };
    ip.isLoopback = function(addr) {
      return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/.test(addr) || /^fe80::1$/.test(addr) || /^::1$/.test(addr) || /^::$/.test(addr);
    };
    ip.loopback = function(family) {
      family = _normalizeFamily(family);
      if (family !== "ipv4" && family !== "ipv6") {
        throw new Error("family must be ipv4 or ipv6");
      }
      return family === "ipv4" ? "127.0.0.1" : "fe80::1";
    };
    ip.address = function(name, family) {
      const interfaces = os2.networkInterfaces();
      family = _normalizeFamily(family);
      if (name && name !== "private" && name !== "public") {
        const res = interfaces[name].filter((details) => {
          const itemFamily = _normalizeFamily(details.family);
          return itemFamily === family;
        });
        if (res.length === 0) {
          return void 0;
        }
        return res[0].address;
      }
      const all2 = Object.keys(interfaces).map((nic) => {
        const addresses = interfaces[nic].filter((details) => {
          details.family = _normalizeFamily(details.family);
          if (details.family !== family || ip.isLoopback(details.address)) {
            return false;
          }
          if (!name) {
            return true;
          }
          return name === "public" ? ip.isPrivate(details.address) : ip.isPublic(details.address);
        });
        return addresses.length ? addresses[0].address : void 0;
      }).filter(Boolean);
      return !all2.length ? ip.loopback(family) : all2[0];
    };
    ip.toLong = function(ip2) {
      let ipl = 0;
      ip2.split(".").forEach((octet) => {
        ipl <<= 8;
        ipl += parseInt(octet);
      });
      return ipl >>> 0;
    };
    ip.fromLong = function(ipl) {
      return `${ipl >>> 24}.${ipl >> 16 & 255}.${ipl >> 8 & 255}.${ipl & 255}`;
    };
  }
});

// node_modules/smart-buffer/build/utils.js
var require_utils = __commonJS({
  "node_modules/smart-buffer/build/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var buffer_1 = require("buffer");
    var ERRORS = {
      INVALID_ENCODING: "Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.",
      INVALID_SMARTBUFFER_SIZE: "Invalid size provided. Size must be a valid integer greater than zero.",
      INVALID_SMARTBUFFER_BUFFER: "Invalid Buffer provided in SmartBufferOptions.",
      INVALID_SMARTBUFFER_OBJECT: "Invalid SmartBufferOptions object supplied to SmartBuffer constructor or factory methods.",
      INVALID_OFFSET: "An invalid offset value was provided.",
      INVALID_OFFSET_NON_NUMBER: "An invalid offset value was provided. A numeric value is required.",
      INVALID_LENGTH: "An invalid length value was provided.",
      INVALID_LENGTH_NON_NUMBER: "An invalid length value was provived. A numeric value is required.",
      INVALID_TARGET_OFFSET: "Target offset is beyond the bounds of the internal SmartBuffer data.",
      INVALID_TARGET_LENGTH: "Specified length value moves cursor beyong the bounds of the internal SmartBuffer data.",
      INVALID_READ_BEYOND_BOUNDS: "Attempted to read beyond the bounds of the managed data.",
      INVALID_WRITE_BEYOND_BOUNDS: "Attempted to write beyond the bounds of the managed data."
    };
    exports2.ERRORS = ERRORS;
    function checkEncoding(encoding) {
      if (!buffer_1.Buffer.isEncoding(encoding)) {
        throw new Error(ERRORS.INVALID_ENCODING);
      }
    }
    exports2.checkEncoding = checkEncoding;
    function isFiniteInteger(value) {
      return typeof value === "number" && isFinite(value) && isInteger(value);
    }
    exports2.isFiniteInteger = isFiniteInteger;
    function checkOffsetOrLengthValue(value, offset) {
      if (typeof value === "number") {
        if (!isFiniteInteger(value) || value < 0) {
          throw new Error(offset ? ERRORS.INVALID_OFFSET : ERRORS.INVALID_LENGTH);
        }
      } else {
        throw new Error(offset ? ERRORS.INVALID_OFFSET_NON_NUMBER : ERRORS.INVALID_LENGTH_NON_NUMBER);
      }
    }
    function checkLengthValue(length) {
      checkOffsetOrLengthValue(length, false);
    }
    exports2.checkLengthValue = checkLengthValue;
    function checkOffsetValue(offset) {
      checkOffsetOrLengthValue(offset, true);
    }
    exports2.checkOffsetValue = checkOffsetValue;
    function checkTargetOffset(offset, buff) {
      if (offset < 0 || offset > buff.length) {
        throw new Error(ERRORS.INVALID_TARGET_OFFSET);
      }
    }
    exports2.checkTargetOffset = checkTargetOffset;
    function isInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    }
    function bigIntAndBufferInt64Check(bufferMethod) {
      if (typeof BigInt === "undefined") {
        throw new Error("Platform does not support JS BigInt type.");
      }
      if (typeof buffer_1.Buffer.prototype[bufferMethod] === "undefined") {
        throw new Error(`Platform does not support Buffer.prototype.${bufferMethod}.`);
      }
    }
    exports2.bigIntAndBufferInt64Check = bigIntAndBufferInt64Check;
  }
});

// node_modules/smart-buffer/build/smartbuffer.js
var require_smartbuffer = __commonJS({
  "node_modules/smart-buffer/build/smartbuffer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils_1 = require_utils();
    var DEFAULT_SMARTBUFFER_SIZE = 4096;
    var DEFAULT_SMARTBUFFER_ENCODING = "utf8";
    var SmartBuffer = class {
      constructor(options) {
        this.length = 0;
        this._encoding = DEFAULT_SMARTBUFFER_ENCODING;
        this._writeOffset = 0;
        this._readOffset = 0;
        if (SmartBuffer.isSmartBufferOptions(options)) {
          if (options.encoding) {
            utils_1.checkEncoding(options.encoding);
            this._encoding = options.encoding;
          }
          if (options.size) {
            if (utils_1.isFiniteInteger(options.size) && options.size > 0) {
              this._buff = Buffer.allocUnsafe(options.size);
            } else {
              throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_SIZE);
            }
          } else if (options.buff) {
            if (Buffer.isBuffer(options.buff)) {
              this._buff = options.buff;
              this.length = options.buff.length;
            } else {
              throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_BUFFER);
            }
          } else {
            this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
          }
        } else {
          if (typeof options !== "undefined") {
            throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_OBJECT);
          }
          this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
        }
      }
      static fromSize(size, encoding) {
        return new this({
          size,
          encoding
        });
      }
      static fromBuffer(buff, encoding) {
        return new this({
          buff,
          encoding
        });
      }
      static fromOptions(options) {
        return new this(options);
      }
      static isSmartBufferOptions(options) {
        const castOptions = options;
        return castOptions && (castOptions.encoding !== void 0 || castOptions.size !== void 0 || castOptions.buff !== void 0);
      }
      readInt8(offset) {
        return this._readNumberValue(Buffer.prototype.readInt8, 1, offset);
      }
      readInt16BE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt16BE, 2, offset);
      }
      readInt16LE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt16LE, 2, offset);
      }
      readInt32BE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt32BE, 4, offset);
      }
      readInt32LE(offset) {
        return this._readNumberValue(Buffer.prototype.readInt32LE, 4, offset);
      }
      readBigInt64BE(offset) {
        utils_1.bigIntAndBufferInt64Check("readBigInt64BE");
        return this._readNumberValue(Buffer.prototype.readBigInt64BE, 8, offset);
      }
      readBigInt64LE(offset) {
        utils_1.bigIntAndBufferInt64Check("readBigInt64LE");
        return this._readNumberValue(Buffer.prototype.readBigInt64LE, 8, offset);
      }
      writeInt8(value, offset) {
        this._writeNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
        return this;
      }
      insertInt8(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
      }
      writeInt16BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
      }
      insertInt16BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
      }
      writeInt16LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
      }
      insertInt16LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
      }
      writeInt32BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
      }
      insertInt32BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
      }
      writeInt32LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
      }
      insertInt32LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
      }
      writeBigInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check("writeBigInt64BE");
        return this._writeNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
      }
      insertBigInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check("writeBigInt64BE");
        return this._insertNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
      }
      writeBigInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check("writeBigInt64LE");
        return this._writeNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
      }
      insertBigInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check("writeBigInt64LE");
        return this._insertNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
      }
      readUInt8(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt8, 1, offset);
      }
      readUInt16BE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt16BE, 2, offset);
      }
      readUInt16LE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt16LE, 2, offset);
      }
      readUInt32BE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt32BE, 4, offset);
      }
      readUInt32LE(offset) {
        return this._readNumberValue(Buffer.prototype.readUInt32LE, 4, offset);
      }
      readBigUInt64BE(offset) {
        utils_1.bigIntAndBufferInt64Check("readBigUInt64BE");
        return this._readNumberValue(Buffer.prototype.readBigUInt64BE, 8, offset);
      }
      readBigUInt64LE(offset) {
        utils_1.bigIntAndBufferInt64Check("readBigUInt64LE");
        return this._readNumberValue(Buffer.prototype.readBigUInt64LE, 8, offset);
      }
      writeUInt8(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
      }
      insertUInt8(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
      }
      writeUInt16BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
      }
      insertUInt16BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
      }
      writeUInt16LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
      }
      insertUInt16LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
      }
      writeUInt32BE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
      }
      insertUInt32BE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
      }
      writeUInt32LE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
      }
      insertUInt32LE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
      }
      writeBigUInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check("writeBigUInt64BE");
        return this._writeNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
      }
      insertBigUInt64BE(value, offset) {
        utils_1.bigIntAndBufferInt64Check("writeBigUInt64BE");
        return this._insertNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
      }
      writeBigUInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check("writeBigUInt64LE");
        return this._writeNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
      }
      insertBigUInt64LE(value, offset) {
        utils_1.bigIntAndBufferInt64Check("writeBigUInt64LE");
        return this._insertNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
      }
      readFloatBE(offset) {
        return this._readNumberValue(Buffer.prototype.readFloatBE, 4, offset);
      }
      readFloatLE(offset) {
        return this._readNumberValue(Buffer.prototype.readFloatLE, 4, offset);
      }
      writeFloatBE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
      }
      insertFloatBE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
      }
      writeFloatLE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
      }
      insertFloatLE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
      }
      readDoubleBE(offset) {
        return this._readNumberValue(Buffer.prototype.readDoubleBE, 8, offset);
      }
      readDoubleLE(offset) {
        return this._readNumberValue(Buffer.prototype.readDoubleLE, 8, offset);
      }
      writeDoubleBE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
      }
      insertDoubleBE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
      }
      writeDoubleLE(value, offset) {
        return this._writeNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
      }
      insertDoubleLE(value, offset) {
        return this._insertNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
      }
      readString(arg1, encoding) {
        let lengthVal;
        if (typeof arg1 === "number") {
          utils_1.checkLengthValue(arg1);
          lengthVal = Math.min(arg1, this.length - this._readOffset);
        } else {
          encoding = arg1;
          lengthVal = this.length - this._readOffset;
        }
        if (typeof encoding !== "undefined") {
          utils_1.checkEncoding(encoding);
        }
        const value = this._buff.slice(this._readOffset, this._readOffset + lengthVal).toString(encoding || this._encoding);
        this._readOffset += lengthVal;
        return value;
      }
      insertString(value, offset, encoding) {
        utils_1.checkOffsetValue(offset);
        return this._handleString(value, true, offset, encoding);
      }
      writeString(value, arg2, encoding) {
        return this._handleString(value, false, arg2, encoding);
      }
      readStringNT(encoding) {
        if (typeof encoding !== "undefined") {
          utils_1.checkEncoding(encoding);
        }
        let nullPos = this.length;
        for (let i = this._readOffset; i < this.length; i++) {
          if (this._buff[i] === 0) {
            nullPos = i;
            break;
          }
        }
        const value = this._buff.slice(this._readOffset, nullPos);
        this._readOffset = nullPos + 1;
        return value.toString(encoding || this._encoding);
      }
      insertStringNT(value, offset, encoding) {
        utils_1.checkOffsetValue(offset);
        this.insertString(value, offset, encoding);
        this.insertUInt8(0, offset + value.length);
        return this;
      }
      writeStringNT(value, arg2, encoding) {
        this.writeString(value, arg2, encoding);
        this.writeUInt8(0, typeof arg2 === "number" ? arg2 + value.length : this.writeOffset);
        return this;
      }
      readBuffer(length) {
        if (typeof length !== "undefined") {
          utils_1.checkLengthValue(length);
        }
        const lengthVal = typeof length === "number" ? length : this.length;
        const endPoint = Math.min(this.length, this._readOffset + lengthVal);
        const value = this._buff.slice(this._readOffset, endPoint);
        this._readOffset = endPoint;
        return value;
      }
      insertBuffer(value, offset) {
        utils_1.checkOffsetValue(offset);
        return this._handleBuffer(value, true, offset);
      }
      writeBuffer(value, offset) {
        return this._handleBuffer(value, false, offset);
      }
      readBufferNT() {
        let nullPos = this.length;
        for (let i = this._readOffset; i < this.length; i++) {
          if (this._buff[i] === 0) {
            nullPos = i;
            break;
          }
        }
        const value = this._buff.slice(this._readOffset, nullPos);
        this._readOffset = nullPos + 1;
        return value;
      }
      insertBufferNT(value, offset) {
        utils_1.checkOffsetValue(offset);
        this.insertBuffer(value, offset);
        this.insertUInt8(0, offset + value.length);
        return this;
      }
      writeBufferNT(value, offset) {
        if (typeof offset !== "undefined") {
          utils_1.checkOffsetValue(offset);
        }
        this.writeBuffer(value, offset);
        this.writeUInt8(0, typeof offset === "number" ? offset + value.length : this._writeOffset);
        return this;
      }
      clear() {
        this._writeOffset = 0;
        this._readOffset = 0;
        this.length = 0;
        return this;
      }
      remaining() {
        return this.length - this._readOffset;
      }
      get readOffset() {
        return this._readOffset;
      }
      set readOffset(offset) {
        utils_1.checkOffsetValue(offset);
        utils_1.checkTargetOffset(offset, this);
        this._readOffset = offset;
      }
      get writeOffset() {
        return this._writeOffset;
      }
      set writeOffset(offset) {
        utils_1.checkOffsetValue(offset);
        utils_1.checkTargetOffset(offset, this);
        this._writeOffset = offset;
      }
      get encoding() {
        return this._encoding;
      }
      set encoding(encoding) {
        utils_1.checkEncoding(encoding);
        this._encoding = encoding;
      }
      get internalBuffer() {
        return this._buff;
      }
      toBuffer() {
        return this._buff.slice(0, this.length);
      }
      toString(encoding) {
        const encodingVal = typeof encoding === "string" ? encoding : this._encoding;
        utils_1.checkEncoding(encodingVal);
        return this._buff.toString(encodingVal, 0, this.length);
      }
      destroy() {
        this.clear();
        return this;
      }
      _handleString(value, isInsert, arg3, encoding) {
        let offsetVal = this._writeOffset;
        let encodingVal = this._encoding;
        if (typeof arg3 === "number") {
          offsetVal = arg3;
        } else if (typeof arg3 === "string") {
          utils_1.checkEncoding(arg3);
          encodingVal = arg3;
        }
        if (typeof encoding === "string") {
          utils_1.checkEncoding(encoding);
          encodingVal = encoding;
        }
        const byteLength = Buffer.byteLength(value, encodingVal);
        if (isInsert) {
          this.ensureInsertable(byteLength, offsetVal);
        } else {
          this._ensureWriteable(byteLength, offsetVal);
        }
        this._buff.write(value, offsetVal, byteLength, encodingVal);
        if (isInsert) {
          this._writeOffset += byteLength;
        } else {
          if (typeof arg3 === "number") {
            this._writeOffset = Math.max(this._writeOffset, offsetVal + byteLength);
          } else {
            this._writeOffset += byteLength;
          }
        }
        return this;
      }
      _handleBuffer(value, isInsert, offset) {
        const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
        if (isInsert) {
          this.ensureInsertable(value.length, offsetVal);
        } else {
          this._ensureWriteable(value.length, offsetVal);
        }
        value.copy(this._buff, offsetVal);
        if (isInsert) {
          this._writeOffset += value.length;
        } else {
          if (typeof offset === "number") {
            this._writeOffset = Math.max(this._writeOffset, offsetVal + value.length);
          } else {
            this._writeOffset += value.length;
          }
        }
        return this;
      }
      ensureReadable(length, offset) {
        let offsetVal = this._readOffset;
        if (typeof offset !== "undefined") {
          utils_1.checkOffsetValue(offset);
          offsetVal = offset;
        }
        if (offsetVal < 0 || offsetVal + length > this.length) {
          throw new Error(utils_1.ERRORS.INVALID_READ_BEYOND_BOUNDS);
        }
      }
      ensureInsertable(dataLength, offset) {
        utils_1.checkOffsetValue(offset);
        this._ensureCapacity(this.length + dataLength);
        if (offset < this.length) {
          this._buff.copy(this._buff, offset + dataLength, offset, this._buff.length);
        }
        if (offset + dataLength > this.length) {
          this.length = offset + dataLength;
        } else {
          this.length += dataLength;
        }
      }
      _ensureWriteable(dataLength, offset) {
        const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
        this._ensureCapacity(offsetVal + dataLength);
        if (offsetVal + dataLength > this.length) {
          this.length = offsetVal + dataLength;
        }
      }
      _ensureCapacity(minLength) {
        const oldLength = this._buff.length;
        if (minLength > oldLength) {
          let data = this._buff;
          let newLength = oldLength * 3 / 2 + 1;
          if (newLength < minLength) {
            newLength = minLength;
          }
          this._buff = Buffer.allocUnsafe(newLength);
          data.copy(this._buff, 0, 0, oldLength);
        }
      }
      _readNumberValue(func, byteSize, offset) {
        this.ensureReadable(byteSize, offset);
        const value = func.call(this._buff, typeof offset === "number" ? offset : this._readOffset);
        if (typeof offset === "undefined") {
          this._readOffset += byteSize;
        }
        return value;
      }
      _insertNumberValue(func, byteSize, value, offset) {
        utils_1.checkOffsetValue(offset);
        this.ensureInsertable(byteSize, offset);
        func.call(this._buff, value, offset);
        this._writeOffset += byteSize;
        return this;
      }
      _writeNumberValue(func, byteSize, value, offset) {
        if (typeof offset === "number") {
          if (offset < 0) {
            throw new Error(utils_1.ERRORS.INVALID_WRITE_BEYOND_BOUNDS);
          }
          utils_1.checkOffsetValue(offset);
        }
        const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
        this._ensureWriteable(byteSize, offsetVal);
        func.call(this._buff, value, offsetVal);
        if (typeof offset === "number") {
          this._writeOffset = Math.max(this._writeOffset, offsetVal + byteSize);
        } else {
          this._writeOffset += byteSize;
        }
        return this;
      }
    };
    exports2.SmartBuffer = SmartBuffer;
  }
});

// node_modules/socks/build/common/constants.js
var require_constants = __commonJS({
  "node_modules/socks/build/common/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SOCKS5_NO_ACCEPTABLE_AUTH = exports2.SOCKS5_CUSTOM_AUTH_END = exports2.SOCKS5_CUSTOM_AUTH_START = exports2.SOCKS_INCOMING_PACKET_SIZES = exports2.SocksClientState = exports2.Socks5Response = exports2.Socks5HostType = exports2.Socks5Auth = exports2.Socks4Response = exports2.SocksCommand = exports2.ERRORS = exports2.DEFAULT_TIMEOUT = void 0;
    var DEFAULT_TIMEOUT2 = 3e4;
    exports2.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT2;
    var ERRORS = {
      InvalidSocksCommand: "An invalid SOCKS command was provided. Valid options are connect, bind, and associate.",
      InvalidSocksCommandForOperation: "An invalid SOCKS command was provided. Only a subset of commands are supported for this operation.",
      InvalidSocksCommandChain: "An invalid SOCKS command was provided. Chaining currently only supports the connect command.",
      InvalidSocksClientOptionsDestination: "An invalid destination host was provided.",
      InvalidSocksClientOptionsExistingSocket: "An invalid existing socket was provided. This should be an instance of stream.Duplex.",
      InvalidSocksClientOptionsProxy: "Invalid SOCKS proxy details were provided.",
      InvalidSocksClientOptionsTimeout: "An invalid timeout value was provided. Please enter a value above 0 (in ms).",
      InvalidSocksClientOptionsProxiesLength: "At least two socks proxies must be provided for chaining.",
      InvalidSocksClientOptionsCustomAuthRange: "Custom auth must be a value between 0x80 and 0xFE.",
      InvalidSocksClientOptionsCustomAuthOptions: "When a custom_auth_method is provided, custom_auth_request_handler, custom_auth_response_size, and custom_auth_response_handler must also be provided and valid.",
      NegotiationError: "Negotiation error",
      SocketClosed: "Socket closed",
      ProxyConnectionTimedOut: "Proxy connection timed out",
      InternalError: "SocksClient internal error (this should not happen)",
      InvalidSocks4HandshakeResponse: "Received invalid Socks4 handshake response",
      Socks4ProxyRejectedConnection: "Socks4 Proxy rejected connection",
      InvalidSocks4IncomingConnectionResponse: "Socks4 invalid incoming connection response",
      Socks4ProxyRejectedIncomingBoundConnection: "Socks4 Proxy rejected incoming bound connection",
      InvalidSocks5InitialHandshakeResponse: "Received invalid Socks5 initial handshake response",
      InvalidSocks5IntiailHandshakeSocksVersion: "Received invalid Socks5 initial handshake (invalid socks version)",
      InvalidSocks5InitialHandshakeNoAcceptedAuthType: "Received invalid Socks5 initial handshake (no accepted authentication type)",
      InvalidSocks5InitialHandshakeUnknownAuthType: "Received invalid Socks5 initial handshake (unknown authentication type)",
      Socks5AuthenticationFailed: "Socks5 Authentication failed",
      InvalidSocks5FinalHandshake: "Received invalid Socks5 final handshake response",
      InvalidSocks5FinalHandshakeRejected: "Socks5 proxy rejected connection",
      InvalidSocks5IncomingConnectionResponse: "Received invalid Socks5 incoming connection response",
      Socks5ProxyRejectedIncomingBoundConnection: "Socks5 Proxy rejected incoming bound connection"
    };
    exports2.ERRORS = ERRORS;
    var SOCKS_INCOMING_PACKET_SIZES = {
      Socks5InitialHandshakeResponse: 2,
      Socks5UserPassAuthenticationResponse: 2,
      Socks5ResponseHeader: 5,
      Socks5ResponseIPv4: 10,
      Socks5ResponseIPv6: 22,
      Socks5ResponseHostname: (hostNameLength) => hostNameLength + 7,
      Socks4Response: 8
    };
    exports2.SOCKS_INCOMING_PACKET_SIZES = SOCKS_INCOMING_PACKET_SIZES;
    var SocksCommand;
    (function(SocksCommand2) {
      SocksCommand2[SocksCommand2["connect"] = 1] = "connect";
      SocksCommand2[SocksCommand2["bind"] = 2] = "bind";
      SocksCommand2[SocksCommand2["associate"] = 3] = "associate";
    })(SocksCommand || (SocksCommand = {}));
    exports2.SocksCommand = SocksCommand;
    var Socks4Response;
    (function(Socks4Response2) {
      Socks4Response2[Socks4Response2["Granted"] = 90] = "Granted";
      Socks4Response2[Socks4Response2["Failed"] = 91] = "Failed";
      Socks4Response2[Socks4Response2["Rejected"] = 92] = "Rejected";
      Socks4Response2[Socks4Response2["RejectedIdent"] = 93] = "RejectedIdent";
    })(Socks4Response || (Socks4Response = {}));
    exports2.Socks4Response = Socks4Response;
    var Socks5Auth;
    (function(Socks5Auth2) {
      Socks5Auth2[Socks5Auth2["NoAuth"] = 0] = "NoAuth";
      Socks5Auth2[Socks5Auth2["GSSApi"] = 1] = "GSSApi";
      Socks5Auth2[Socks5Auth2["UserPass"] = 2] = "UserPass";
    })(Socks5Auth || (Socks5Auth = {}));
    exports2.Socks5Auth = Socks5Auth;
    var SOCKS5_CUSTOM_AUTH_START = 128;
    exports2.SOCKS5_CUSTOM_AUTH_START = SOCKS5_CUSTOM_AUTH_START;
    var SOCKS5_CUSTOM_AUTH_END = 254;
    exports2.SOCKS5_CUSTOM_AUTH_END = SOCKS5_CUSTOM_AUTH_END;
    var SOCKS5_NO_ACCEPTABLE_AUTH = 255;
    exports2.SOCKS5_NO_ACCEPTABLE_AUTH = SOCKS5_NO_ACCEPTABLE_AUTH;
    var Socks5Response;
    (function(Socks5Response2) {
      Socks5Response2[Socks5Response2["Granted"] = 0] = "Granted";
      Socks5Response2[Socks5Response2["Failure"] = 1] = "Failure";
      Socks5Response2[Socks5Response2["NotAllowed"] = 2] = "NotAllowed";
      Socks5Response2[Socks5Response2["NetworkUnreachable"] = 3] = "NetworkUnreachable";
      Socks5Response2[Socks5Response2["HostUnreachable"] = 4] = "HostUnreachable";
      Socks5Response2[Socks5Response2["ConnectionRefused"] = 5] = "ConnectionRefused";
      Socks5Response2[Socks5Response2["TTLExpired"] = 6] = "TTLExpired";
      Socks5Response2[Socks5Response2["CommandNotSupported"] = 7] = "CommandNotSupported";
      Socks5Response2[Socks5Response2["AddressNotSupported"] = 8] = "AddressNotSupported";
    })(Socks5Response || (Socks5Response = {}));
    exports2.Socks5Response = Socks5Response;
    var Socks5HostType;
    (function(Socks5HostType2) {
      Socks5HostType2[Socks5HostType2["IPv4"] = 1] = "IPv4";
      Socks5HostType2[Socks5HostType2["Hostname"] = 3] = "Hostname";
      Socks5HostType2[Socks5HostType2["IPv6"] = 4] = "IPv6";
    })(Socks5HostType || (Socks5HostType = {}));
    exports2.Socks5HostType = Socks5HostType;
    var SocksClientState;
    (function(SocksClientState2) {
      SocksClientState2[SocksClientState2["Created"] = 0] = "Created";
      SocksClientState2[SocksClientState2["Connecting"] = 1] = "Connecting";
      SocksClientState2[SocksClientState2["Connected"] = 2] = "Connected";
      SocksClientState2[SocksClientState2["SentInitialHandshake"] = 3] = "SentInitialHandshake";
      SocksClientState2[SocksClientState2["ReceivedInitialHandshakeResponse"] = 4] = "ReceivedInitialHandshakeResponse";
      SocksClientState2[SocksClientState2["SentAuthentication"] = 5] = "SentAuthentication";
      SocksClientState2[SocksClientState2["ReceivedAuthenticationResponse"] = 6] = "ReceivedAuthenticationResponse";
      SocksClientState2[SocksClientState2["SentFinalHandshake"] = 7] = "SentFinalHandshake";
      SocksClientState2[SocksClientState2["ReceivedFinalResponse"] = 8] = "ReceivedFinalResponse";
      SocksClientState2[SocksClientState2["BoundWaitingForConnection"] = 9] = "BoundWaitingForConnection";
      SocksClientState2[SocksClientState2["Established"] = 10] = "Established";
      SocksClientState2[SocksClientState2["Disconnected"] = 11] = "Disconnected";
      SocksClientState2[SocksClientState2["Error"] = 99] = "Error";
    })(SocksClientState || (SocksClientState = {}));
    exports2.SocksClientState = SocksClientState;
  }
});

// node_modules/socks/build/common/util.js
var require_util = __commonJS({
  "node_modules/socks/build/common/util.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.shuffleArray = exports2.SocksClientError = void 0;
    var SocksClientError = class extends Error {
      constructor(message, options) {
        super(message);
        this.options = options;
      }
    };
    exports2.SocksClientError = SocksClientError;
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    exports2.shuffleArray = shuffleArray;
  }
});

// node_modules/socks/build/common/helpers.js
var require_helpers = __commonJS({
  "node_modules/socks/build/common/helpers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateSocksClientChainOptions = exports2.validateSocksClientOptions = void 0;
    var util_1 = require_util();
    var constants_1 = require_constants();
    var stream2 = require("stream");
    function validateSocksClientOptions(options, acceptedCommands = ["connect", "bind", "associate"]) {
      if (!constants_1.SocksCommand[options.command]) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommand, options);
      }
      if (acceptedCommands.indexOf(options.command) === -1) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandForOperation, options);
      }
      if (!isValidSocksRemoteHost(options.destination)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
      }
      if (!isValidSocksProxy(options.proxy)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
      }
      validateCustomProxyAuth(options.proxy, options);
      if (options.timeout && !isValidTimeoutValue(options.timeout)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
      }
      if (options.existing_socket && !(options.existing_socket instanceof stream2.Duplex)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsExistingSocket, options);
      }
    }
    exports2.validateSocksClientOptions = validateSocksClientOptions;
    function validateSocksClientChainOptions(options) {
      if (options.command !== "connect") {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandChain, options);
      }
      if (!isValidSocksRemoteHost(options.destination)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
      }
      if (!(options.proxies && Array.isArray(options.proxies) && options.proxies.length >= 2)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxiesLength, options);
      }
      options.proxies.forEach((proxy) => {
        if (!isValidSocksProxy(proxy)) {
          throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
        }
        validateCustomProxyAuth(proxy, options);
      });
      if (options.timeout && !isValidTimeoutValue(options.timeout)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
      }
    }
    exports2.validateSocksClientChainOptions = validateSocksClientChainOptions;
    function validateCustomProxyAuth(proxy, options) {
      if (proxy.custom_auth_method !== void 0) {
        if (proxy.custom_auth_method < constants_1.SOCKS5_CUSTOM_AUTH_START || proxy.custom_auth_method > constants_1.SOCKS5_CUSTOM_AUTH_END) {
          throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthRange, options);
        }
        if (proxy.custom_auth_request_handler === void 0 || typeof proxy.custom_auth_request_handler !== "function") {
          throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
        }
        if (proxy.custom_auth_response_size === void 0) {
          throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
        }
        if (proxy.custom_auth_response_handler === void 0 || typeof proxy.custom_auth_response_handler !== "function") {
          throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
        }
      }
    }
    function isValidSocksRemoteHost(remoteHost) {
      return remoteHost && typeof remoteHost.host === "string" && typeof remoteHost.port === "number" && remoteHost.port >= 0 && remoteHost.port <= 65535;
    }
    function isValidSocksProxy(proxy) {
      return proxy && (typeof proxy.host === "string" || typeof proxy.ipaddress === "string") && typeof proxy.port === "number" && proxy.port >= 0 && proxy.port <= 65535 && (proxy.type === 4 || proxy.type === 5);
    }
    function isValidTimeoutValue(value) {
      return typeof value === "number" && value > 0;
    }
  }
});

// node_modules/socks/build/common/receivebuffer.js
var require_receivebuffer = __commonJS({
  "node_modules/socks/build/common/receivebuffer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ReceiveBuffer = void 0;
    var ReceiveBuffer = class {
      constructor(size = 4096) {
        this.buffer = Buffer.allocUnsafe(size);
        this.offset = 0;
        this.originalSize = size;
      }
      get length() {
        return this.offset;
      }
      append(data) {
        if (!Buffer.isBuffer(data)) {
          throw new Error("Attempted to append a non-buffer instance to ReceiveBuffer.");
        }
        if (this.offset + data.length >= this.buffer.length) {
          const tmp = this.buffer;
          this.buffer = Buffer.allocUnsafe(Math.max(this.buffer.length + this.originalSize, this.buffer.length + data.length));
          tmp.copy(this.buffer);
        }
        data.copy(this.buffer, this.offset);
        return this.offset += data.length;
      }
      peek(length) {
        if (length > this.offset) {
          throw new Error("Attempted to read beyond the bounds of the managed internal data.");
        }
        return this.buffer.slice(0, length);
      }
      get(length) {
        if (length > this.offset) {
          throw new Error("Attempted to read beyond the bounds of the managed internal data.");
        }
        const value = Buffer.allocUnsafe(length);
        this.buffer.slice(0, length).copy(value);
        this.buffer.copyWithin(0, length, length + this.offset - length);
        this.offset -= length;
        return value;
      }
    };
    exports2.ReceiveBuffer = ReceiveBuffer;
  }
});

// node_modules/socks/build/client/socksclient.js
var require_socksclient = __commonJS({
  "node_modules/socks/build/client/socksclient.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SocksClientError = exports2.SocksClient = void 0;
    var events_1 = require("events");
    var net2 = require("net");
    var ip = require_ip();
    var smart_buffer_1 = require_smartbuffer();
    var constants_1 = require_constants();
    var helpers_1 = require_helpers();
    var receivebuffer_1 = require_receivebuffer();
    var util_1 = require_util();
    Object.defineProperty(exports2, "SocksClientError", { enumerable: true, get: function() {
      return util_1.SocksClientError;
    } });
    var SocksClient = class extends events_1.EventEmitter {
      constructor(options) {
        super();
        this.options = Object.assign({}, options);
        (0, helpers_1.validateSocksClientOptions)(options);
        this.setState(constants_1.SocksClientState.Created);
      }
      static createConnection(options, callback) {
        return new Promise((resolve, reject) => {
          try {
            (0, helpers_1.validateSocksClientOptions)(options, ["connect"]);
          } catch (err) {
            if (typeof callback === "function") {
              callback(err);
              return resolve(err);
            } else {
              return reject(err);
            }
          }
          const client = new SocksClient(options);
          client.connect(options.existing_socket);
          client.once("established", (info) => {
            client.removeAllListeners();
            if (typeof callback === "function") {
              callback(null, info);
              resolve(info);
            } else {
              resolve(info);
            }
          });
          client.once("error", (err) => {
            client.removeAllListeners();
            if (typeof callback === "function") {
              callback(err);
              resolve(err);
            } else {
              reject(err);
            }
          });
        });
      }
      static createConnectionChain(options, callback) {
        return new Promise((resolve, reject) => __awaiter2(this, void 0, void 0, function* () {
          try {
            (0, helpers_1.validateSocksClientChainOptions)(options);
          } catch (err) {
            if (typeof callback === "function") {
              callback(err);
              return resolve(err);
            } else {
              return reject(err);
            }
          }
          if (options.randomizeChain) {
            (0, util_1.shuffleArray)(options.proxies);
          }
          try {
            let sock;
            for (let i = 0; i < options.proxies.length; i++) {
              const nextProxy = options.proxies[i];
              const nextDestination = i === options.proxies.length - 1 ? options.destination : {
                host: options.proxies[i + 1].host || options.proxies[i + 1].ipaddress,
                port: options.proxies[i + 1].port
              };
              const result = yield SocksClient.createConnection({
                command: "connect",
                proxy: nextProxy,
                destination: nextDestination,
                existing_socket: sock
              });
              sock = sock || result.socket;
            }
            if (typeof callback === "function") {
              callback(null, { socket: sock });
              resolve({ socket: sock });
            } else {
              resolve({ socket: sock });
            }
          } catch (err) {
            if (typeof callback === "function") {
              callback(err);
              resolve(err);
            } else {
              reject(err);
            }
          }
        }));
      }
      static createUDPFrame(options) {
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt16BE(0);
        buff.writeUInt8(options.frameNumber || 0);
        if (net2.isIPv4(options.remoteHost.host)) {
          buff.writeUInt8(constants_1.Socks5HostType.IPv4);
          buff.writeUInt32BE(ip.toLong(options.remoteHost.host));
        } else if (net2.isIPv6(options.remoteHost.host)) {
          buff.writeUInt8(constants_1.Socks5HostType.IPv6);
          buff.writeBuffer(ip.toBuffer(options.remoteHost.host));
        } else {
          buff.writeUInt8(constants_1.Socks5HostType.Hostname);
          buff.writeUInt8(Buffer.byteLength(options.remoteHost.host));
          buff.writeString(options.remoteHost.host);
        }
        buff.writeUInt16BE(options.remoteHost.port);
        buff.writeBuffer(options.data);
        return buff.toBuffer();
      }
      static parseUDPFrame(data) {
        const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
        buff.readOffset = 2;
        const frameNumber = buff.readUInt8();
        const hostType = buff.readUInt8();
        let remoteHost;
        if (hostType === constants_1.Socks5HostType.IPv4) {
          remoteHost = ip.fromLong(buff.readUInt32BE());
        } else if (hostType === constants_1.Socks5HostType.IPv6) {
          remoteHost = ip.toString(buff.readBuffer(16));
        } else {
          remoteHost = buff.readString(buff.readUInt8());
        }
        const remotePort = buff.readUInt16BE();
        return {
          frameNumber,
          remoteHost: {
            host: remoteHost,
            port: remotePort
          },
          data: buff.readBuffer()
        };
      }
      setState(newState) {
        if (this.state !== constants_1.SocksClientState.Error) {
          this.state = newState;
        }
      }
      connect(existingSocket) {
        this.onDataReceived = (data) => this.onDataReceivedHandler(data);
        this.onClose = () => this.onCloseHandler();
        this.onError = (err) => this.onErrorHandler(err);
        this.onConnect = () => this.onConnectHandler();
        const timer2 = setTimeout(() => this.onEstablishedTimeout(), this.options.timeout || constants_1.DEFAULT_TIMEOUT);
        if (timer2.unref && typeof timer2.unref === "function") {
          timer2.unref();
        }
        if (existingSocket) {
          this.socket = existingSocket;
        } else {
          this.socket = new net2.Socket();
        }
        this.socket.once("close", this.onClose);
        this.socket.once("error", this.onError);
        this.socket.once("connect", this.onConnect);
        this.socket.on("data", this.onDataReceived);
        this.setState(constants_1.SocksClientState.Connecting);
        this.receiveBuffer = new receivebuffer_1.ReceiveBuffer();
        if (existingSocket) {
          this.socket.emit("connect");
        } else {
          this.socket.connect(this.getSocketOptions());
          if (this.options.set_tcp_nodelay !== void 0 && this.options.set_tcp_nodelay !== null) {
            this.socket.setNoDelay(!!this.options.set_tcp_nodelay);
          }
        }
        this.prependOnceListener("established", (info) => {
          setImmediate(() => {
            if (this.receiveBuffer.length > 0) {
              const excessData = this.receiveBuffer.get(this.receiveBuffer.length);
              info.socket.emit("data", excessData);
            }
            info.socket.resume();
          });
        });
      }
      getSocketOptions() {
        return Object.assign(Object.assign({}, this.options.socket_options), { host: this.options.proxy.host || this.options.proxy.ipaddress, port: this.options.proxy.port });
      }
      onEstablishedTimeout() {
        if (this.state !== constants_1.SocksClientState.Established && this.state !== constants_1.SocksClientState.BoundWaitingForConnection) {
          this.closeSocket(constants_1.ERRORS.ProxyConnectionTimedOut);
        }
      }
      onConnectHandler() {
        this.setState(constants_1.SocksClientState.Connected);
        if (this.options.proxy.type === 4) {
          this.sendSocks4InitialHandshake();
        } else {
          this.sendSocks5InitialHandshake();
        }
        this.setState(constants_1.SocksClientState.SentInitialHandshake);
      }
      onDataReceivedHandler(data) {
        this.receiveBuffer.append(data);
        this.processData();
      }
      processData() {
        while (this.state !== constants_1.SocksClientState.Established && this.state !== constants_1.SocksClientState.Error && this.receiveBuffer.length >= this.nextRequiredPacketBufferSize) {
          if (this.state === constants_1.SocksClientState.SentInitialHandshake) {
            if (this.options.proxy.type === 4) {
              this.handleSocks4FinalHandshakeResponse();
            } else {
              this.handleInitialSocks5HandshakeResponse();
            }
          } else if (this.state === constants_1.SocksClientState.SentAuthentication) {
            this.handleInitialSocks5AuthenticationHandshakeResponse();
          } else if (this.state === constants_1.SocksClientState.SentFinalHandshake) {
            this.handleSocks5FinalHandshakeResponse();
          } else if (this.state === constants_1.SocksClientState.BoundWaitingForConnection) {
            if (this.options.proxy.type === 4) {
              this.handleSocks4IncomingConnectionResponse();
            } else {
              this.handleSocks5IncomingConnectionResponse();
            }
          } else {
            this.closeSocket(constants_1.ERRORS.InternalError);
            break;
          }
        }
      }
      onCloseHandler() {
        this.closeSocket(constants_1.ERRORS.SocketClosed);
      }
      onErrorHandler(err) {
        this.closeSocket(err.message);
      }
      removeInternalSocketHandlers() {
        this.socket.pause();
        this.socket.removeListener("data", this.onDataReceived);
        this.socket.removeListener("close", this.onClose);
        this.socket.removeListener("error", this.onError);
        this.socket.removeListener("connect", this.onConnect);
      }
      closeSocket(err) {
        if (this.state !== constants_1.SocksClientState.Error) {
          this.setState(constants_1.SocksClientState.Error);
          this.socket.destroy();
          this.removeInternalSocketHandlers();
          this.emit("error", new util_1.SocksClientError(err, this.options));
        }
      }
      sendSocks4InitialHandshake() {
        const userId = this.options.proxy.userId || "";
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(4);
        buff.writeUInt8(constants_1.SocksCommand[this.options.command]);
        buff.writeUInt16BE(this.options.destination.port);
        if (net2.isIPv4(this.options.destination.host)) {
          buff.writeBuffer(ip.toBuffer(this.options.destination.host));
          buff.writeStringNT(userId);
        } else {
          buff.writeUInt8(0);
          buff.writeUInt8(0);
          buff.writeUInt8(0);
          buff.writeUInt8(1);
          buff.writeStringNT(userId);
          buff.writeStringNT(this.options.destination.host);
        }
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks4Response;
        this.socket.write(buff.toBuffer());
      }
      handleSocks4FinalHandshakeResponse() {
        const data = this.receiveBuffer.get(8);
        if (data[1] !== constants_1.Socks4Response.Granted) {
          this.closeSocket(`${constants_1.ERRORS.Socks4ProxyRejectedConnection} - (${constants_1.Socks4Response[data[1]]})`);
        } else {
          if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.bind) {
            const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
            buff.readOffset = 2;
            const remoteHost = {
              port: buff.readUInt16BE(),
              host: ip.fromLong(buff.readUInt32BE())
            };
            if (remoteHost.host === "0.0.0.0") {
              remoteHost.host = this.options.proxy.ipaddress;
            }
            this.setState(constants_1.SocksClientState.BoundWaitingForConnection);
            this.emit("bound", { remoteHost, socket: this.socket });
          } else {
            this.setState(constants_1.SocksClientState.Established);
            this.removeInternalSocketHandlers();
            this.emit("established", { socket: this.socket });
          }
        }
      }
      handleSocks4IncomingConnectionResponse() {
        const data = this.receiveBuffer.get(8);
        if (data[1] !== constants_1.Socks4Response.Granted) {
          this.closeSocket(`${constants_1.ERRORS.Socks4ProxyRejectedIncomingBoundConnection} - (${constants_1.Socks4Response[data[1]]})`);
        } else {
          const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
          buff.readOffset = 2;
          const remoteHost = {
            port: buff.readUInt16BE(),
            host: ip.fromLong(buff.readUInt32BE())
          };
          this.setState(constants_1.SocksClientState.Established);
          this.removeInternalSocketHandlers();
          this.emit("established", { remoteHost, socket: this.socket });
        }
      }
      sendSocks5InitialHandshake() {
        const buff = new smart_buffer_1.SmartBuffer();
        const supportedAuthMethods = [constants_1.Socks5Auth.NoAuth];
        if (this.options.proxy.userId || this.options.proxy.password) {
          supportedAuthMethods.push(constants_1.Socks5Auth.UserPass);
        }
        if (this.options.proxy.custom_auth_method !== void 0) {
          supportedAuthMethods.push(this.options.proxy.custom_auth_method);
        }
        buff.writeUInt8(5);
        buff.writeUInt8(supportedAuthMethods.length);
        for (const authMethod of supportedAuthMethods) {
          buff.writeUInt8(authMethod);
        }
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5InitialHandshakeResponse;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentInitialHandshake);
      }
      handleInitialSocks5HandshakeResponse() {
        const data = this.receiveBuffer.get(2);
        if (data[0] !== 5) {
          this.closeSocket(constants_1.ERRORS.InvalidSocks5IntiailHandshakeSocksVersion);
        } else if (data[1] === constants_1.SOCKS5_NO_ACCEPTABLE_AUTH) {
          this.closeSocket(constants_1.ERRORS.InvalidSocks5InitialHandshakeNoAcceptedAuthType);
        } else {
          if (data[1] === constants_1.Socks5Auth.NoAuth) {
            this.socks5ChosenAuthType = constants_1.Socks5Auth.NoAuth;
            this.sendSocks5CommandRequest();
          } else if (data[1] === constants_1.Socks5Auth.UserPass) {
            this.socks5ChosenAuthType = constants_1.Socks5Auth.UserPass;
            this.sendSocks5UserPassAuthentication();
          } else if (data[1] === this.options.proxy.custom_auth_method) {
            this.socks5ChosenAuthType = this.options.proxy.custom_auth_method;
            this.sendSocks5CustomAuthentication();
          } else {
            this.closeSocket(constants_1.ERRORS.InvalidSocks5InitialHandshakeUnknownAuthType);
          }
        }
      }
      sendSocks5UserPassAuthentication() {
        const userId = this.options.proxy.userId || "";
        const password = this.options.proxy.password || "";
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(1);
        buff.writeUInt8(Buffer.byteLength(userId));
        buff.writeString(userId);
        buff.writeUInt8(Buffer.byteLength(password));
        buff.writeString(password);
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5UserPassAuthenticationResponse;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentAuthentication);
      }
      sendSocks5CustomAuthentication() {
        return __awaiter2(this, void 0, void 0, function* () {
          this.nextRequiredPacketBufferSize = this.options.proxy.custom_auth_response_size;
          this.socket.write(yield this.options.proxy.custom_auth_request_handler());
          this.setState(constants_1.SocksClientState.SentAuthentication);
        });
      }
      handleSocks5CustomAuthHandshakeResponse(data) {
        return __awaiter2(this, void 0, void 0, function* () {
          return yield this.options.proxy.custom_auth_response_handler(data);
        });
      }
      handleSocks5AuthenticationNoAuthHandshakeResponse(data) {
        return __awaiter2(this, void 0, void 0, function* () {
          return data[1] === 0;
        });
      }
      handleSocks5AuthenticationUserPassHandshakeResponse(data) {
        return __awaiter2(this, void 0, void 0, function* () {
          return data[1] === 0;
        });
      }
      handleInitialSocks5AuthenticationHandshakeResponse() {
        return __awaiter2(this, void 0, void 0, function* () {
          this.setState(constants_1.SocksClientState.ReceivedAuthenticationResponse);
          let authResult = false;
          if (this.socks5ChosenAuthType === constants_1.Socks5Auth.NoAuth) {
            authResult = yield this.handleSocks5AuthenticationNoAuthHandshakeResponse(this.receiveBuffer.get(2));
          } else if (this.socks5ChosenAuthType === constants_1.Socks5Auth.UserPass) {
            authResult = yield this.handleSocks5AuthenticationUserPassHandshakeResponse(this.receiveBuffer.get(2));
          } else if (this.socks5ChosenAuthType === this.options.proxy.custom_auth_method) {
            authResult = yield this.handleSocks5CustomAuthHandshakeResponse(this.receiveBuffer.get(this.options.proxy.custom_auth_response_size));
          }
          if (!authResult) {
            this.closeSocket(constants_1.ERRORS.Socks5AuthenticationFailed);
          } else {
            this.sendSocks5CommandRequest();
          }
        });
      }
      sendSocks5CommandRequest() {
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(5);
        buff.writeUInt8(constants_1.SocksCommand[this.options.command]);
        buff.writeUInt8(0);
        if (net2.isIPv4(this.options.destination.host)) {
          buff.writeUInt8(constants_1.Socks5HostType.IPv4);
          buff.writeBuffer(ip.toBuffer(this.options.destination.host));
        } else if (net2.isIPv6(this.options.destination.host)) {
          buff.writeUInt8(constants_1.Socks5HostType.IPv6);
          buff.writeBuffer(ip.toBuffer(this.options.destination.host));
        } else {
          buff.writeUInt8(constants_1.Socks5HostType.Hostname);
          buff.writeUInt8(this.options.destination.host.length);
          buff.writeString(this.options.destination.host);
        }
        buff.writeUInt16BE(this.options.destination.port);
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentFinalHandshake);
      }
      handleSocks5FinalHandshakeResponse() {
        const header = this.receiveBuffer.peek(5);
        if (header[0] !== 5 || header[1] !== constants_1.Socks5Response.Granted) {
          this.closeSocket(`${constants_1.ERRORS.InvalidSocks5FinalHandshakeRejected} - ${constants_1.Socks5Response[header[1]]}`);
        } else {
          const addressType = header[3];
          let remoteHost;
          let buff;
          if (addressType === constants_1.Socks5HostType.IPv4) {
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
            remoteHost = {
              host: ip.fromLong(buff.readUInt32BE()),
              port: buff.readUInt16BE()
            };
            if (remoteHost.host === "0.0.0.0") {
              remoteHost.host = this.options.proxy.ipaddress;
            }
          } else if (addressType === constants_1.Socks5HostType.Hostname) {
            const hostLength = header[4];
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength);
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
            remoteHost = {
              host: buff.readString(hostLength),
              port: buff.readUInt16BE()
            };
          } else if (addressType === constants_1.Socks5HostType.IPv6) {
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
            remoteHost = {
              host: ip.toString(buff.readBuffer(16)),
              port: buff.readUInt16BE()
            };
          }
          this.setState(constants_1.SocksClientState.ReceivedFinalResponse);
          if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.connect) {
            this.setState(constants_1.SocksClientState.Established);
            this.removeInternalSocketHandlers();
            this.emit("established", { remoteHost, socket: this.socket });
          } else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.bind) {
            this.setState(constants_1.SocksClientState.BoundWaitingForConnection);
            this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
            this.emit("bound", { remoteHost, socket: this.socket });
          } else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.associate) {
            this.setState(constants_1.SocksClientState.Established);
            this.removeInternalSocketHandlers();
            this.emit("established", {
              remoteHost,
              socket: this.socket
            });
          }
        }
      }
      handleSocks5IncomingConnectionResponse() {
        const header = this.receiveBuffer.peek(5);
        if (header[0] !== 5 || header[1] !== constants_1.Socks5Response.Granted) {
          this.closeSocket(`${constants_1.ERRORS.Socks5ProxyRejectedIncomingBoundConnection} - ${constants_1.Socks5Response[header[1]]}`);
        } else {
          const addressType = header[3];
          let remoteHost;
          let buff;
          if (addressType === constants_1.Socks5HostType.IPv4) {
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
            remoteHost = {
              host: ip.fromLong(buff.readUInt32BE()),
              port: buff.readUInt16BE()
            };
            if (remoteHost.host === "0.0.0.0") {
              remoteHost.host = this.options.proxy.ipaddress;
            }
          } else if (addressType === constants_1.Socks5HostType.Hostname) {
            const hostLength = header[4];
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength);
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
            remoteHost = {
              host: buff.readString(hostLength),
              port: buff.readUInt16BE()
            };
          } else if (addressType === constants_1.Socks5HostType.IPv6) {
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
            remoteHost = {
              host: ip.toString(buff.readBuffer(16)),
              port: buff.readUInt16BE()
            };
          }
          this.setState(constants_1.SocksClientState.Established);
          this.removeInternalSocketHandlers();
          this.emit("established", { remoteHost, socket: this.socket });
        }
      }
      get socksClientOptions() {
        return Object.assign({}, this.options);
      }
    };
    exports2.SocksClient = SocksClient;
  }
});

// node_modules/socks/build/index.js
var require_build = __commonJS({
  "node_modules/socks/build/index.js"(exports2) {
    "use strict";
    var __createBinding2 = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar2 = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding2(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar2(require_socksclient(), exports2);
  }
});

// node_modules/socks-proxy-agent/dist/index.js
var require_dist4 = __commonJS({
  "node_modules/socks-proxy-agent/dist/index.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SocksProxyAgent = void 0;
    var socks_1 = require_build();
    var agent_base_1 = require_src3();
    var debug_1 = __importDefault2(require_src2());
    var dns_1 = __importDefault2(require("dns"));
    var tls_1 = __importDefault2(require("tls"));
    var debug = (0, debug_1.default)("socks-proxy-agent");
    function parseSocksProxy(opts) {
      var _a;
      let port = 0;
      let lookup = false;
      let type = 5;
      const host = opts.hostname;
      if (host == null) {
        throw new TypeError('No "host"');
      }
      if (typeof opts.port === "number") {
        port = opts.port;
      } else if (typeof opts.port === "string") {
        port = parseInt(opts.port, 10);
      }
      if (port == null) {
        port = 1080;
      }
      if (opts.protocol != null) {
        switch (opts.protocol.replace(":", "")) {
          case "socks4":
            lookup = true;
          case "socks4a":
            type = 4;
            break;
          case "socks5":
            lookup = true;
          case "socks":
          case "socks5h":
            type = 5;
            break;
          default:
            throw new TypeError(`A "socks" protocol must be specified! Got: ${String(opts.protocol)}`);
        }
      }
      if (typeof opts.type !== "undefined") {
        if (opts.type === 4 || opts.type === 5) {
          type = opts.type;
        } else {
          throw new TypeError(`"type" must be 4 or 5, got: ${String(opts.type)}`);
        }
      }
      const proxy = {
        host,
        port,
        type
      };
      let userId = (_a = opts.userId) !== null && _a !== void 0 ? _a : opts.username;
      let password = opts.password;
      if (opts.auth != null) {
        const auth = opts.auth.split(":");
        userId = auth[0];
        password = auth[1];
      }
      if (userId != null) {
        Object.defineProperty(proxy, "userId", {
          value: userId,
          enumerable: false
        });
      }
      if (password != null) {
        Object.defineProperty(proxy, "password", {
          value: password,
          enumerable: false
        });
      }
      return { lookup, proxy };
    }
    var normalizeProxyOptions = (input) => {
      let proxyOptions;
      if (typeof input === "string") {
        proxyOptions = new URL(input);
      } else {
        proxyOptions = input;
      }
      if (proxyOptions == null) {
        throw new TypeError("a SOCKS proxy server `host` and `port` must be specified!");
      }
      return proxyOptions;
    };
    var SocksProxyAgent2 = class extends agent_base_1.Agent {
      constructor(input, options) {
        var _a;
        const proxyOptions = normalizeProxyOptions(input);
        super(proxyOptions);
        const parsedProxy = parseSocksProxy(proxyOptions);
        this.shouldLookup = parsedProxy.lookup;
        this.proxy = parsedProxy.proxy;
        this.tlsConnectionOptions = proxyOptions.tls != null ? proxyOptions.tls : {};
        this.timeout = (_a = options === null || options === void 0 ? void 0 : options.timeout) !== null && _a !== void 0 ? _a : null;
      }
      callback(req, opts) {
        var _a;
        return __awaiter2(this, void 0, void 0, function* () {
          const { shouldLookup, proxy, timeout } = this;
          let { host, port, lookup: lookupCallback } = opts;
          if (host == null) {
            throw new Error("No `host` defined!");
          }
          if (shouldLookup) {
            host = yield new Promise((resolve, reject) => {
              const lookupFn = lookupCallback !== null && lookupCallback !== void 0 ? lookupCallback : dns_1.default.lookup;
              lookupFn(host, {}, (err, res) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(res);
                }
              });
            });
          }
          const socksOpts = {
            proxy,
            destination: { host, port },
            command: "connect",
            timeout: timeout !== null && timeout !== void 0 ? timeout : void 0
          };
          const cleanup = (tlsSocket) => {
            req.destroy();
            socket.destroy();
            if (tlsSocket)
              tlsSocket.destroy();
          };
          debug("Creating socks proxy connection: %o", socksOpts);
          const { socket } = yield socks_1.SocksClient.createConnection(socksOpts);
          debug("Successfully created socks proxy connection");
          if (timeout !== null) {
            socket.setTimeout(timeout);
            socket.on("timeout", () => cleanup());
          }
          if (opts.secureEndpoint) {
            debug("Upgrading socket connection to TLS");
            const servername = (_a = opts.servername) !== null && _a !== void 0 ? _a : opts.host;
            const tlsSocket = tls_1.default.connect(Object.assign(Object.assign(Object.assign({}, omit(opts, "host", "hostname", "path", "port")), {
              socket,
              servername
            }), this.tlsConnectionOptions));
            tlsSocket.once("error", (error) => {
              debug("socket TLS error", error.message);
              cleanup(tlsSocket);
            });
            return tlsSocket;
          }
          return socket;
        });
      }
    };
    exports2.SocksProxyAgent = SocksProxyAgent2;
    function omit(obj, ...keys2) {
      const ret = {};
      let key;
      for (key in obj) {
        if (!keys2.includes(key)) {
          ret[key] = obj[key];
        }
      }
      return ret;
    }
  }
});

// node_modules/tslib/tslib.js
var require_tslib = __commonJS({
  "node_modules/tslib/tslib.js"(exports2, module2) {
    var __extends2;
    var __assign2;
    var __rest2;
    var __decorate2;
    var __param2;
    var __metadata2;
    var __awaiter2;
    var __generator2;
    var __exportStar2;
    var __values2;
    var __read2;
    var __spread2;
    var __spreadArrays2;
    var __spreadArray2;
    var __await2;
    var __asyncGenerator2;
    var __asyncDelegator2;
    var __asyncValues2;
    var __makeTemplateObject2;
    var __importStar2;
    var __importDefault2;
    var __classPrivateFieldGet3;
    var __classPrivateFieldSet3;
    var __classPrivateFieldIn2;
    var __createBinding2;
    (function(factory) {
      var root2 = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
      if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function(exports3) {
          factory(createExporter(root2, createExporter(exports3)));
        });
      } else if (typeof module2 === "object" && typeof module2.exports === "object") {
        factory(createExporter(root2, createExporter(module2.exports)));
      } else {
        factory(createExporter(root2));
      }
      function createExporter(exports3, previous) {
        if (exports3 !== root2) {
          if (typeof Object.create === "function") {
            Object.defineProperty(exports3, "__esModule", { value: true });
          } else {
            exports3.__esModule = true;
          }
        }
        return function(id, v) {
          return exports3[id] = previous ? previous(id, v) : v;
        };
      }
    })(function(exporter) {
      var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      __extends2 = function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      __assign2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      __rest2 = function(s, e) {
        var t = {};
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
          }
        return t;
      };
      __decorate2 = function(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          r = Reflect.decorate(decorators, target, key, desc);
        else
          for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
              r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };
      __param2 = function(paramIndex, decorator) {
        return function(target, key) {
          decorator(target, key, paramIndex);
        };
      };
      __metadata2 = function(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(metadataKey, metadataValue);
      };
      __awaiter2 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      __generator2 = function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      __exportStar2 = function(m, o) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
            __createBinding2(o, m, p);
      };
      __createBinding2 = Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      };
      __values2 = function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
          return m.call(o);
        if (o && typeof o.length === "number")
          return {
            next: function() {
              if (o && i >= o.length)
                o = void 0;
              return { value: o && o[i++], done: !o };
            }
          };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
      };
      __read2 = function(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
          return o;
        var i = m.call(o), r, ar = [], e;
        try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
            ar.push(r.value);
        } catch (error) {
          e = { error };
        } finally {
          try {
            if (r && !r.done && (m = i["return"]))
              m.call(i);
          } finally {
            if (e)
              throw e.error;
          }
        }
        return ar;
      };
      __spread2 = function() {
        for (var ar = [], i = 0; i < arguments.length; i++)
          ar = ar.concat(__read2(arguments[i]));
        return ar;
      };
      __spreadArrays2 = function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
          s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
        return r;
      };
      __spreadArray2 = function(to, from, pack) {
        if (pack || arguments.length === 2)
          for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
              if (!ar)
                ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
            }
          }
        return to.concat(ar || Array.prototype.slice.call(from));
      };
      __await2 = function(v) {
        return this instanceof __await2 ? (this.v = v, this) : new __await2(v);
      };
      __asyncGenerator2 = function(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i;
        function verb(n) {
          if (g[n])
            i[n] = function(v) {
              return new Promise(function(a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
              });
            };
        }
        function resume(n, v) {
          try {
            step(g[n](v));
          } catch (e) {
            settle(q[0][3], e);
          }
        }
        function step(r) {
          r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
        }
        function fulfill(value) {
          resume("next", value);
        }
        function reject(value) {
          resume("throw", value);
        }
        function settle(f, v) {
          if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]);
        }
      };
      __asyncDelegator2 = function(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function(e) {
          throw e;
        }), verb("return"), i[Symbol.iterator] = function() {
          return this;
        }, i;
        function verb(n, f) {
          i[n] = o[n] ? function(v) {
            return (p = !p) ? { value: __await2(o[n](v)), done: n === "return" } : f ? f(v) : v;
          } : f;
        }
      };
      __asyncValues2 = function(o) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values2 === "function" ? __values2(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i);
        function verb(n) {
          i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
              v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
          };
        }
        function settle(resolve, reject, d, v) {
          Promise.resolve(v).then(function(v2) {
            resolve({ value: v2, done: d });
          }, reject);
        }
      };
      __makeTemplateObject2 = function(cooked, raw) {
        if (Object.defineProperty) {
          Object.defineProperty(cooked, "raw", { value: raw });
        } else {
          cooked.raw = raw;
        }
        return cooked;
      };
      var __setModuleDefault = Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      };
      __importStar2 = function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding2(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      __importDefault2 = function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      __classPrivateFieldGet3 = function(receiver, state, kind, f) {
        if (kind === "a" && !f)
          throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
          throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
      };
      __classPrivateFieldSet3 = function(receiver, state, value, kind, f) {
        if (kind === "m")
          throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
          throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
          throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
      };
      __classPrivateFieldIn2 = function(state, receiver) {
        if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function")
          throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
      };
      exporter("__extends", __extends2);
      exporter("__assign", __assign2);
      exporter("__rest", __rest2);
      exporter("__decorate", __decorate2);
      exporter("__param", __param2);
      exporter("__metadata", __metadata2);
      exporter("__awaiter", __awaiter2);
      exporter("__generator", __generator2);
      exporter("__exportStar", __exportStar2);
      exporter("__createBinding", __createBinding2);
      exporter("__values", __values2);
      exporter("__read", __read2);
      exporter("__spread", __spread2);
      exporter("__spreadArrays", __spreadArrays2);
      exporter("__spreadArray", __spreadArray2);
      exporter("__await", __await2);
      exporter("__asyncGenerator", __asyncGenerator2);
      exporter("__asyncDelegator", __asyncDelegator2);
      exporter("__asyncValues", __asyncValues2);
      exporter("__makeTemplateObject", __makeTemplateObject2);
      exporter("__importStar", __importStar2);
      exporter("__importDefault", __importDefault2);
      exporter("__classPrivateFieldGet", __classPrivateFieldGet3);
      exporter("__classPrivateFieldSet", __classPrivateFieldSet3);
      exporter("__classPrivateFieldIn", __classPrivateFieldIn2);
    });
  }
});

// node_modules/uuid/dist/rng.js
var require_rng = __commonJS({
  "node_modules/uuid/dist/rng.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = rng;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var rnds8Pool = new Uint8Array(256);
    var poolPtr = rnds8Pool.length;
    function rng() {
      if (poolPtr > rnds8Pool.length - 16) {
        _crypto.default.randomFillSync(rnds8Pool);
        poolPtr = 0;
      }
      return rnds8Pool.slice(poolPtr, poolPtr += 16);
    }
  }
});

// node_modules/uuid/dist/regex.js
var require_regex = __commonJS({
  "node_modules/uuid/dist/regex.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/validate.js
var require_validate = __commonJS({
  "node_modules/uuid/dist/validate.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _regex = _interopRequireDefault(require_regex());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function validate2(uuid2) {
      return typeof uuid2 === "string" && _regex.default.test(uuid2);
    }
    var _default = validate2;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/stringify.js
var require_stringify = __commonJS({
  "node_modules/uuid/dist/stringify.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var byteToHex = [];
    for (let i = 0; i < 256; ++i) {
      byteToHex.push((i + 256).toString(16).substr(1));
    }
    function stringify2(arr, offset = 0) {
      const uuid2 = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
      if (!(0, _validate.default)(uuid2)) {
        throw TypeError("Stringified UUID is invalid");
      }
      return uuid2;
    }
    var _default = stringify2;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/v1.js
var require_v1 = __commonJS({
  "node_modules/uuid/dist/v1.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _stringify = _interopRequireDefault(require_stringify());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var _nodeId;
    var _clockseq;
    var _lastMSecs = 0;
    var _lastNSecs = 0;
    function v12(options, buf, offset) {
      let i = buf && offset || 0;
      const b = buf || new Array(16);
      options = options || {};
      let node = options.node || _nodeId;
      let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
      if (node == null || clockseq == null) {
        const seedBytes = options.random || (options.rng || _rng.default)();
        if (node == null) {
          node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
        }
        if (clockseq == null) {
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
        }
      }
      let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
      let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
      const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
      if (dt < 0 && options.clockseq === void 0) {
        clockseq = clockseq + 1 & 16383;
      }
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
        nsecs = 0;
      }
      if (nsecs >= 1e4) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
      }
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
      msecs += 122192928e5;
      const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
      b[i++] = tl >>> 24 & 255;
      b[i++] = tl >>> 16 & 255;
      b[i++] = tl >>> 8 & 255;
      b[i++] = tl & 255;
      const tmh = msecs / 4294967296 * 1e4 & 268435455;
      b[i++] = tmh >>> 8 & 255;
      b[i++] = tmh & 255;
      b[i++] = tmh >>> 24 & 15 | 16;
      b[i++] = tmh >>> 16 & 255;
      b[i++] = clockseq >>> 8 | 128;
      b[i++] = clockseq & 255;
      for (let n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }
      return buf || (0, _stringify.default)(b);
    }
    var _default = v12;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/parse.js
var require_parse = __commonJS({
  "node_modules/uuid/dist/parse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function parse3(uuid2) {
      if (!(0, _validate.default)(uuid2)) {
        throw TypeError("Invalid UUID");
      }
      let v;
      const arr = new Uint8Array(16);
      arr[0] = (v = parseInt(uuid2.slice(0, 8), 16)) >>> 24;
      arr[1] = v >>> 16 & 255;
      arr[2] = v >>> 8 & 255;
      arr[3] = v & 255;
      arr[4] = (v = parseInt(uuid2.slice(9, 13), 16)) >>> 8;
      arr[5] = v & 255;
      arr[6] = (v = parseInt(uuid2.slice(14, 18), 16)) >>> 8;
      arr[7] = v & 255;
      arr[8] = (v = parseInt(uuid2.slice(19, 23), 16)) >>> 8;
      arr[9] = v & 255;
      arr[10] = (v = parseInt(uuid2.slice(24, 36), 16)) / 1099511627776 & 255;
      arr[11] = v / 4294967296 & 255;
      arr[12] = v >>> 24 & 255;
      arr[13] = v >>> 16 & 255;
      arr[14] = v >>> 8 & 255;
      arr[15] = v & 255;
      return arr;
    }
    var _default = parse3;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/v35.js
var require_v35 = __commonJS({
  "node_modules/uuid/dist/v35.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = _default;
    exports2.URL = exports2.DNS = void 0;
    var _stringify = _interopRequireDefault(require_stringify());
    var _parse = _interopRequireDefault(require_parse());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function stringToBytes(str) {
      str = unescape(encodeURIComponent(str));
      const bytes = [];
      for (let i = 0; i < str.length; ++i) {
        bytes.push(str.charCodeAt(i));
      }
      return bytes;
    }
    var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    exports2.DNS = DNS;
    var URL4 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    exports2.URL = URL4;
    function _default(name, version3, hashfunc) {
      function generateUUID(value, namespace, buf, offset) {
        if (typeof value === "string") {
          value = stringToBytes(value);
        }
        if (typeof namespace === "string") {
          namespace = (0, _parse.default)(namespace);
        }
        if (namespace.length !== 16) {
          throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
        }
        let bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 15 | version3;
        bytes[8] = bytes[8] & 63 | 128;
        if (buf) {
          offset = offset || 0;
          for (let i = 0; i < 16; ++i) {
            buf[offset + i] = bytes[i];
          }
          return buf;
        }
        return (0, _stringify.default)(bytes);
      }
      try {
        generateUUID.name = name;
      } catch (err) {
      }
      generateUUID.DNS = DNS;
      generateUUID.URL = URL4;
      return generateUUID;
    }
  }
});

// node_modules/uuid/dist/md5.js
var require_md5 = __commonJS({
  "node_modules/uuid/dist/md5.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function md5(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("md5").update(bytes).digest();
    }
    var _default = md5;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/v3.js
var require_v3 = __commonJS({
  "node_modules/uuid/dist/v3.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _md = _interopRequireDefault(require_md5());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v32 = (0, _v.default)("v3", 48, _md.default);
    var _default = v32;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/v4.js
var require_v4 = __commonJS({
  "node_modules/uuid/dist/v4.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _stringify = _interopRequireDefault(require_stringify());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function v42(options, buf, offset) {
      options = options || {};
      const rnds = options.random || (options.rng || _rng.default)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }
        return buf;
      }
      return (0, _stringify.default)(rnds);
    }
    var _default = v42;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/sha1.js
var require_sha1 = __commonJS({
  "node_modules/uuid/dist/sha1.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function sha1(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("sha1").update(bytes).digest();
    }
    var _default = sha1;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/v5.js
var require_v5 = __commonJS({
  "node_modules/uuid/dist/v5.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _sha = _interopRequireDefault(require_sha1());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v52 = (0, _v.default)("v5", 80, _sha.default);
    var _default = v52;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/nil.js
var require_nil = __commonJS({
  "node_modules/uuid/dist/nil.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _default = "00000000-0000-0000-0000-000000000000";
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/version.js
var require_version = __commonJS({
  "node_modules/uuid/dist/version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function version3(uuid2) {
      if (!(0, _validate.default)(uuid2)) {
        throw TypeError("Invalid UUID");
      }
      return parseInt(uuid2.substr(14, 1), 16);
    }
    var _default = version3;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/index.js
var require_dist5 = __commonJS({
  "node_modules/uuid/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "v1", {
      enumerable: true,
      get: function() {
        return _v.default;
      }
    });
    Object.defineProperty(exports2, "v3", {
      enumerable: true,
      get: function() {
        return _v2.default;
      }
    });
    Object.defineProperty(exports2, "v4", {
      enumerable: true,
      get: function() {
        return _v3.default;
      }
    });
    Object.defineProperty(exports2, "v5", {
      enumerable: true,
      get: function() {
        return _v4.default;
      }
    });
    Object.defineProperty(exports2, "NIL", {
      enumerable: true,
      get: function() {
        return _nil.default;
      }
    });
    Object.defineProperty(exports2, "version", {
      enumerable: true,
      get: function() {
        return _version.default;
      }
    });
    Object.defineProperty(exports2, "validate", {
      enumerable: true,
      get: function() {
        return _validate.default;
      }
    });
    Object.defineProperty(exports2, "stringify", {
      enumerable: true,
      get: function() {
        return _stringify.default;
      }
    });
    Object.defineProperty(exports2, "parse", {
      enumerable: true,
      get: function() {
        return _parse.default;
      }
    });
    var _v = _interopRequireDefault(require_v1());
    var _v2 = _interopRequireDefault(require_v3());
    var _v3 = _interopRequireDefault(require_v4());
    var _v4 = _interopRequireDefault(require_v5());
    var _nil = _interopRequireDefault(require_nil());
    var _version = _interopRequireDefault(require_version());
    var _validate = _interopRequireDefault(require_validate());
    var _stringify = _interopRequireDefault(require_stringify());
    var _parse = _interopRequireDefault(require_parse());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  }
});

// node_modules/entities/lib/maps/entities.json
var require_entities = __commonJS({
  "node_modules/entities/lib/maps/entities.json"(exports2, module2) {
    module2.exports = { Aacute: "\xC1", aacute: "\xE1", Abreve: "\u0102", abreve: "\u0103", ac: "\u223E", acd: "\u223F", acE: "\u223E\u0333", Acirc: "\xC2", acirc: "\xE2", acute: "\xB4", Acy: "\u0410", acy: "\u0430", AElig: "\xC6", aelig: "\xE6", af: "\u2061", Afr: "\u{1D504}", afr: "\u{1D51E}", Agrave: "\xC0", agrave: "\xE0", alefsym: "\u2135", aleph: "\u2135", Alpha: "\u0391", alpha: "\u03B1", Amacr: "\u0100", amacr: "\u0101", amalg: "\u2A3F", amp: "&", AMP: "&", andand: "\u2A55", And: "\u2A53", and: "\u2227", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A", ang: "\u2220", ange: "\u29A4", angle: "\u2220", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angmsd: "\u2221", angrt: "\u221F", angrtvb: "\u22BE", angrtvbd: "\u299D", angsph: "\u2222", angst: "\xC5", angzarr: "\u237C", Aogon: "\u0104", aogon: "\u0105", Aopf: "\u{1D538}", aopf: "\u{1D552}", apacir: "\u2A6F", ap: "\u2248", apE: "\u2A70", ape: "\u224A", apid: "\u224B", apos: "'", ApplyFunction: "\u2061", approx: "\u2248", approxeq: "\u224A", Aring: "\xC5", aring: "\xE5", Ascr: "\u{1D49C}", ascr: "\u{1D4B6}", Assign: "\u2254", ast: "*", asymp: "\u2248", asympeq: "\u224D", Atilde: "\xC3", atilde: "\xE3", Auml: "\xC4", auml: "\xE4", awconint: "\u2233", awint: "\u2A11", backcong: "\u224C", backepsilon: "\u03F6", backprime: "\u2035", backsim: "\u223D", backsimeq: "\u22CD", Backslash: "\u2216", Barv: "\u2AE7", barvee: "\u22BD", barwed: "\u2305", Barwed: "\u2306", barwedge: "\u2305", bbrk: "\u23B5", bbrktbrk: "\u23B6", bcong: "\u224C", Bcy: "\u0411", bcy: "\u0431", bdquo: "\u201E", becaus: "\u2235", because: "\u2235", Because: "\u2235", bemptyv: "\u29B0", bepsi: "\u03F6", bernou: "\u212C", Bernoullis: "\u212C", Beta: "\u0392", beta: "\u03B2", beth: "\u2136", between: "\u226C", Bfr: "\u{1D505}", bfr: "\u{1D51F}", bigcap: "\u22C2", bigcirc: "\u25EF", bigcup: "\u22C3", bigodot: "\u2A00", bigoplus: "\u2A01", bigotimes: "\u2A02", bigsqcup: "\u2A06", bigstar: "\u2605", bigtriangledown: "\u25BD", bigtriangleup: "\u25B3", biguplus: "\u2A04", bigvee: "\u22C1", bigwedge: "\u22C0", bkarow: "\u290D", blacklozenge: "\u29EB", blacksquare: "\u25AA", blacktriangle: "\u25B4", blacktriangledown: "\u25BE", blacktriangleleft: "\u25C2", blacktriangleright: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588", bne: "=\u20E5", bnequiv: "\u2261\u20E5", bNot: "\u2AED", bnot: "\u2310", Bopf: "\u{1D539}", bopf: "\u{1D553}", bot: "\u22A5", bottom: "\u22A5", bowtie: "\u22C8", boxbox: "\u29C9", boxdl: "\u2510", boxdL: "\u2555", boxDl: "\u2556", boxDL: "\u2557", boxdr: "\u250C", boxdR: "\u2552", boxDr: "\u2553", boxDR: "\u2554", boxh: "\u2500", boxH: "\u2550", boxhd: "\u252C", boxHd: "\u2564", boxhD: "\u2565", boxHD: "\u2566", boxhu: "\u2534", boxHu: "\u2567", boxhU: "\u2568", boxHU: "\u2569", boxminus: "\u229F", boxplus: "\u229E", boxtimes: "\u22A0", boxul: "\u2518", boxuL: "\u255B", boxUl: "\u255C", boxUL: "\u255D", boxur: "\u2514", boxuR: "\u2558", boxUr: "\u2559", boxUR: "\u255A", boxv: "\u2502", boxV: "\u2551", boxvh: "\u253C", boxvH: "\u256A", boxVh: "\u256B", boxVH: "\u256C", boxvl: "\u2524", boxvL: "\u2561", boxVl: "\u2562", boxVL: "\u2563", boxvr: "\u251C", boxvR: "\u255E", boxVr: "\u255F", boxVR: "\u2560", bprime: "\u2035", breve: "\u02D8", Breve: "\u02D8", brvbar: "\xA6", bscr: "\u{1D4B7}", Bscr: "\u212C", bsemi: "\u204F", bsim: "\u223D", bsime: "\u22CD", bsolb: "\u29C5", bsol: "\\", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\u2022", bump: "\u224E", bumpE: "\u2AAE", bumpe: "\u224F", Bumpeq: "\u224E", bumpeq: "\u224F", Cacute: "\u0106", cacute: "\u0107", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", cap: "\u2229", Cap: "\u22D2", capcup: "\u2A47", capdot: "\u2A40", CapitalDifferentialD: "\u2145", caps: "\u2229\uFE00", caret: "\u2041", caron: "\u02C7", Cayleys: "\u212D", ccaps: "\u2A4D", Ccaron: "\u010C", ccaron: "\u010D", Ccedil: "\xC7", ccedil: "\xE7", Ccirc: "\u0108", ccirc: "\u0109", Cconint: "\u2230", ccups: "\u2A4C", ccupssm: "\u2A50", Cdot: "\u010A", cdot: "\u010B", cedil: "\xB8", Cedilla: "\xB8", cemptyv: "\u29B2", cent: "\xA2", centerdot: "\xB7", CenterDot: "\xB7", cfr: "\u{1D520}", Cfr: "\u212D", CHcy: "\u0427", chcy: "\u0447", check: "\u2713", checkmark: "\u2713", Chi: "\u03A7", chi: "\u03C7", circ: "\u02C6", circeq: "\u2257", circlearrowleft: "\u21BA", circlearrowright: "\u21BB", circledast: "\u229B", circledcirc: "\u229A", circleddash: "\u229D", CircleDot: "\u2299", circledR: "\xAE", circledS: "\u24C8", CircleMinus: "\u2296", CirclePlus: "\u2295", CircleTimes: "\u2297", cir: "\u25CB", cirE: "\u29C3", cire: "\u2257", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", ClockwiseContourIntegral: "\u2232", CloseCurlyDoubleQuote: "\u201D", CloseCurlyQuote: "\u2019", clubs: "\u2663", clubsuit: "\u2663", colon: ":", Colon: "\u2237", Colone: "\u2A74", colone: "\u2254", coloneq: "\u2254", comma: ",", commat: "@", comp: "\u2201", compfn: "\u2218", complement: "\u2201", complexes: "\u2102", cong: "\u2245", congdot: "\u2A6D", Congruent: "\u2261", conint: "\u222E", Conint: "\u222F", ContourIntegral: "\u222E", copf: "\u{1D554}", Copf: "\u2102", coprod: "\u2210", Coproduct: "\u2210", copy: "\xA9", COPY: "\xA9", copysr: "\u2117", CounterClockwiseContourIntegral: "\u2233", crarr: "\u21B5", cross: "\u2717", Cross: "\u2A2F", Cscr: "\u{1D49E}", cscr: "\u{1D4B8}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935", cuepr: "\u22DE", cuesc: "\u22DF", cularr: "\u21B6", cularrp: "\u293D", cupbrcap: "\u2A48", cupcap: "\u2A46", CupCap: "\u224D", cup: "\u222A", Cup: "\u22D3", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7", curarrm: "\u293C", curlyeqprec: "\u22DE", curlyeqsucc: "\u22DF", curlyvee: "\u22CE", curlywedge: "\u22CF", curren: "\xA4", curvearrowleft: "\u21B6", curvearrowright: "\u21B7", cuvee: "\u22CE", cuwed: "\u22CF", cwconint: "\u2232", cwint: "\u2231", cylcty: "\u232D", dagger: "\u2020", Dagger: "\u2021", daleth: "\u2138", darr: "\u2193", Darr: "\u21A1", dArr: "\u21D3", dash: "\u2010", Dashv: "\u2AE4", dashv: "\u22A3", dbkarow: "\u290F", dblac: "\u02DD", Dcaron: "\u010E", dcaron: "\u010F", Dcy: "\u0414", dcy: "\u0434", ddagger: "\u2021", ddarr: "\u21CA", DD: "\u2145", dd: "\u2146", DDotrahd: "\u2911", ddotseq: "\u2A77", deg: "\xB0", Del: "\u2207", Delta: "\u0394", delta: "\u03B4", demptyv: "\u29B1", dfisht: "\u297F", Dfr: "\u{1D507}", dfr: "\u{1D521}", dHar: "\u2965", dharl: "\u21C3", dharr: "\u21C2", DiacriticalAcute: "\xB4", DiacriticalDot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", DiacriticalGrave: "`", DiacriticalTilde: "\u02DC", diam: "\u22C4", diamond: "\u22C4", Diamond: "\u22C4", diamondsuit: "\u2666", diams: "\u2666", die: "\xA8", DifferentialD: "\u2146", digamma: "\u03DD", disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", DJcy: "\u0402", djcy: "\u0452", dlcorn: "\u231E", dlcrop: "\u230D", dollar: "$", Dopf: "\u{1D53B}", dopf: "\u{1D555}", Dot: "\xA8", dot: "\u02D9", DotDot: "\u20DC", doteq: "\u2250", doteqdot: "\u2251", DotEqual: "\u2250", dotminus: "\u2238", dotplus: "\u2214", dotsquare: "\u22A1", doublebarwedge: "\u2306", DoubleContourIntegral: "\u222F", DoubleDot: "\xA8", DoubleDownArrow: "\u21D3", DoubleLeftArrow: "\u21D0", DoubleLeftRightArrow: "\u21D4", DoubleLeftTee: "\u2AE4", DoubleLongLeftArrow: "\u27F8", DoubleLongLeftRightArrow: "\u27FA", DoubleLongRightArrow: "\u27F9", DoubleRightArrow: "\u21D2", DoubleRightTee: "\u22A8", DoubleUpArrow: "\u21D1", DoubleUpDownArrow: "\u21D5", DoubleVerticalBar: "\u2225", DownArrowBar: "\u2913", downarrow: "\u2193", DownArrow: "\u2193", Downarrow: "\u21D3", DownArrowUpArrow: "\u21F5", DownBreve: "\u0311", downdownarrows: "\u21CA", downharpoonleft: "\u21C3", downharpoonright: "\u21C2", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVectorBar: "\u2956", DownLeftVector: "\u21BD", DownRightTeeVector: "\u295F", DownRightVectorBar: "\u2957", DownRightVector: "\u21C1", DownTeeArrow: "\u21A7", DownTee: "\u22A4", drbkarow: "\u2910", drcorn: "\u231F", drcrop: "\u230C", Dscr: "\u{1D49F}", dscr: "\u{1D4B9}", DScy: "\u0405", dscy: "\u0455", dsol: "\u29F6", Dstrok: "\u0110", dstrok: "\u0111", dtdot: "\u22F1", dtri: "\u25BF", dtrif: "\u25BE", duarr: "\u21F5", duhar: "\u296F", dwangle: "\u29A6", DZcy: "\u040F", dzcy: "\u045F", dzigrarr: "\u27FF", Eacute: "\xC9", eacute: "\xE9", easter: "\u2A6E", Ecaron: "\u011A", ecaron: "\u011B", Ecirc: "\xCA", ecirc: "\xEA", ecir: "\u2256", ecolon: "\u2255", Ecy: "\u042D", ecy: "\u044D", eDDot: "\u2A77", Edot: "\u0116", edot: "\u0117", eDot: "\u2251", ee: "\u2147", efDot: "\u2252", Efr: "\u{1D508}", efr: "\u{1D522}", eg: "\u2A9A", Egrave: "\xC8", egrave: "\xE8", egs: "\u2A96", egsdot: "\u2A98", el: "\u2A99", Element: "\u2208", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", elsdot: "\u2A97", Emacr: "\u0112", emacr: "\u0113", empty: "\u2205", emptyset: "\u2205", EmptySmallSquare: "\u25FB", emptyv: "\u2205", EmptyVerySmallSquare: "\u25AB", emsp13: "\u2004", emsp14: "\u2005", emsp: "\u2003", ENG: "\u014A", eng: "\u014B", ensp: "\u2002", Eogon: "\u0118", eogon: "\u0119", Eopf: "\u{1D53C}", eopf: "\u{1D556}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", Epsilon: "\u0395", epsilon: "\u03B5", epsiv: "\u03F5", eqcirc: "\u2256", eqcolon: "\u2255", eqsim: "\u2242", eqslantgtr: "\u2A96", eqslantless: "\u2A95", Equal: "\u2A75", equals: "=", EqualTilde: "\u2242", equest: "\u225F", Equilibrium: "\u21CC", equiv: "\u2261", equivDD: "\u2A78", eqvparsl: "\u29E5", erarr: "\u2971", erDot: "\u2253", escr: "\u212F", Escr: "\u2130", esdot: "\u2250", Esim: "\u2A73", esim: "\u2242", Eta: "\u0397", eta: "\u03B7", ETH: "\xD0", eth: "\xF0", Euml: "\xCB", euml: "\xEB", euro: "\u20AC", excl: "!", exist: "\u2203", Exists: "\u2203", expectation: "\u2130", exponentiale: "\u2147", ExponentialE: "\u2147", fallingdotseq: "\u2252", Fcy: "\u0424", fcy: "\u0444", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", Ffr: "\u{1D509}", ffr: "\u{1D523}", filig: "\uFB01", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", fjlig: "fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", Fopf: "\u{1D53D}", fopf: "\u{1D557}", forall: "\u2200", ForAll: "\u2200", fork: "\u22D4", forkv: "\u2AD9", Fouriertrf: "\u2131", fpartint: "\u2A0D", frac12: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\u215E", frasl: "\u2044", frown: "\u2322", fscr: "\u{1D4BB}", Fscr: "\u2131", gacute: "\u01F5", Gamma: "\u0393", gamma: "\u03B3", Gammad: "\u03DC", gammad: "\u03DD", gap: "\u2A86", Gbreve: "\u011E", gbreve: "\u011F", Gcedil: "\u0122", Gcirc: "\u011C", gcirc: "\u011D", Gcy: "\u0413", gcy: "\u0433", Gdot: "\u0120", gdot: "\u0121", ge: "\u2265", gE: "\u2267", gEl: "\u2A8C", gel: "\u22DB", geq: "\u2265", geqq: "\u2267", geqslant: "\u2A7E", gescc: "\u2AA9", ges: "\u2A7E", gesdot: "\u2A80", gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", Gfr: "\u{1D50A}", gfr: "\u{1D524}", gg: "\u226B", Gg: "\u22D9", ggg: "\u22D9", gimel: "\u2137", GJcy: "\u0403", gjcy: "\u0453", gla: "\u2AA5", gl: "\u2277", glE: "\u2A92", glj: "\u2AA4", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gnE: "\u2269", gneq: "\u2A88", gneqq: "\u2269", gnsim: "\u22E7", Gopf: "\u{1D53E}", gopf: "\u{1D558}", grave: "`", GreaterEqual: "\u2265", GreaterEqualLess: "\u22DB", GreaterFullEqual: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", GreaterSlantEqual: "\u2A7E", GreaterTilde: "\u2273", Gscr: "\u{1D4A2}", gscr: "\u210A", gsim: "\u2273", gsime: "\u2A8E", gsiml: "\u2A90", gtcc: "\u2AA7", gtcir: "\u2A7A", gt: ">", GT: ">", Gt: "\u226B", gtdot: "\u22D7", gtlPar: "\u2995", gtquest: "\u2A7C", gtrapprox: "\u2A86", gtrarr: "\u2978", gtrdot: "\u22D7", gtreqless: "\u22DB", gtreqqless: "\u2A8C", gtrless: "\u2277", gtrsim: "\u2273", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", Hacek: "\u02C7", hairsp: "\u200A", half: "\xBD", hamilt: "\u210B", HARDcy: "\u042A", hardcy: "\u044A", harrcir: "\u2948", harr: "\u2194", hArr: "\u21D4", harrw: "\u21AD", Hat: "^", hbar: "\u210F", Hcirc: "\u0124", hcirc: "\u0125", hearts: "\u2665", heartsuit: "\u2665", hellip: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", Hfr: "\u210C", HilbertSpace: "\u210B", hksearow: "\u2925", hkswarow: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", hookrightarrow: "\u21AA", hopf: "\u{1D559}", Hopf: "\u210D", horbar: "\u2015", HorizontalLine: "\u2500", hscr: "\u{1D4BD}", Hscr: "\u210B", hslash: "\u210F", Hstrok: "\u0126", hstrok: "\u0127", HumpDownHump: "\u224E", HumpEqual: "\u224F", hybull: "\u2043", hyphen: "\u2010", Iacute: "\xCD", iacute: "\xED", ic: "\u2063", Icirc: "\xCE", icirc: "\xEE", Icy: "\u0418", icy: "\u0438", Idot: "\u0130", IEcy: "\u0415", iecy: "\u0435", iexcl: "\xA1", iff: "\u21D4", ifr: "\u{1D526}", Ifr: "\u2111", Igrave: "\xCC", igrave: "\xEC", ii: "\u2148", iiiint: "\u2A0C", iiint: "\u222D", iinfin: "\u29DC", iiota: "\u2129", IJlig: "\u0132", ijlig: "\u0133", Imacr: "\u012A", imacr: "\u012B", image: "\u2111", ImaginaryI: "\u2148", imagline: "\u2110", imagpart: "\u2111", imath: "\u0131", Im: "\u2111", imof: "\u22B7", imped: "\u01B5", Implies: "\u21D2", incare: "\u2105", in: "\u2208", infin: "\u221E", infintie: "\u29DD", inodot: "\u0131", intcal: "\u22BA", int: "\u222B", Int: "\u222C", integers: "\u2124", Integral: "\u222B", intercal: "\u22BA", Intersection: "\u22C2", intlarhk: "\u2A17", intprod: "\u2A3C", InvisibleComma: "\u2063", InvisibleTimes: "\u2062", IOcy: "\u0401", iocy: "\u0451", Iogon: "\u012E", iogon: "\u012F", Iopf: "\u{1D540}", iopf: "\u{1D55A}", Iota: "\u0399", iota: "\u03B9", iprod: "\u2A3C", iquest: "\xBF", iscr: "\u{1D4BE}", Iscr: "\u2110", isin: "\u2208", isindot: "\u22F5", isinE: "\u22F9", isins: "\u22F4", isinsv: "\u22F3", isinv: "\u2208", it: "\u2062", Itilde: "\u0128", itilde: "\u0129", Iukcy: "\u0406", iukcy: "\u0456", Iuml: "\xCF", iuml: "\xEF", Jcirc: "\u0134", jcirc: "\u0135", Jcy: "\u0419", jcy: "\u0439", Jfr: "\u{1D50D}", jfr: "\u{1D527}", jmath: "\u0237", Jopf: "\u{1D541}", jopf: "\u{1D55B}", Jscr: "\u{1D4A5}", jscr: "\u{1D4BF}", Jsercy: "\u0408", jsercy: "\u0458", Jukcy: "\u0404", jukcy: "\u0454", Kappa: "\u039A", kappa: "\u03BA", kappav: "\u03F0", Kcedil: "\u0136", kcedil: "\u0137", Kcy: "\u041A", kcy: "\u043A", Kfr: "\u{1D50E}", kfr: "\u{1D528}", kgreen: "\u0138", KHcy: "\u0425", khcy: "\u0445", KJcy: "\u040C", kjcy: "\u045C", Kopf: "\u{1D542}", kopf: "\u{1D55C}", Kscr: "\u{1D4A6}", kscr: "\u{1D4C0}", lAarr: "\u21DA", Lacute: "\u0139", lacute: "\u013A", laemptyv: "\u29B4", lagran: "\u2112", Lambda: "\u039B", lambda: "\u03BB", lang: "\u27E8", Lang: "\u27EA", langd: "\u2991", langle: "\u27E8", lap: "\u2A85", Laplacetrf: "\u2112", laquo: "\xAB", larrb: "\u21E4", larrbfs: "\u291F", larr: "\u2190", Larr: "\u219E", lArr: "\u21D0", larrfs: "\u291D", larrhk: "\u21A9", larrlp: "\u21AB", larrpl: "\u2939", larrsim: "\u2973", larrtl: "\u21A2", latail: "\u2919", lAtail: "\u291B", lat: "\u2AAB", late: "\u2AAD", lates: "\u2AAD\uFE00", lbarr: "\u290C", lBarr: "\u290E", lbbrk: "\u2772", lbrace: "{", lbrack: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", Lcaron: "\u013D", lcaron: "\u013E", Lcedil: "\u013B", lcedil: "\u013C", lceil: "\u2308", lcub: "{", Lcy: "\u041B", lcy: "\u043B", ldca: "\u2936", ldquo: "\u201C", ldquor: "\u201E", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", lE: "\u2266", LeftAngleBracket: "\u27E8", LeftArrowBar: "\u21E4", leftarrow: "\u2190", LeftArrow: "\u2190", Leftarrow: "\u21D0", LeftArrowRightArrow: "\u21C6", leftarrowtail: "\u21A2", LeftCeiling: "\u2308", LeftDoubleBracket: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVectorBar: "\u2959", LeftDownVector: "\u21C3", LeftFloor: "\u230A", leftharpoondown: "\u21BD", leftharpoonup: "\u21BC", leftleftarrows: "\u21C7", leftrightarrow: "\u2194", LeftRightArrow: "\u2194", Leftrightarrow: "\u21D4", leftrightarrows: "\u21C6", leftrightharpoons: "\u21CB", leftrightsquigarrow: "\u21AD", LeftRightVector: "\u294E", LeftTeeArrow: "\u21A4", LeftTee: "\u22A3", LeftTeeVector: "\u295A", leftthreetimes: "\u22CB", LeftTriangleBar: "\u29CF", LeftTriangle: "\u22B2", LeftTriangleEqual: "\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVectorBar: "\u2958", LeftUpVector: "\u21BF", LeftVectorBar: "\u2952", LeftVector: "\u21BC", lEg: "\u2A8B", leg: "\u22DA", leq: "\u2264", leqq: "\u2266", leqslant: "\u2A7D", lescc: "\u2AA8", les: "\u2A7D", lesdot: "\u2A7F", lesdoto: "\u2A81", lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessapprox: "\u2A85", lessdot: "\u22D6", lesseqgtr: "\u22DA", lesseqqgtr: "\u2A8B", LessEqualGreater: "\u22DA", LessFullEqual: "\u2266", LessGreater: "\u2276", lessgtr: "\u2276", LessLess: "\u2AA1", lesssim: "\u2272", LessSlantEqual: "\u2A7D", LessTilde: "\u2272", lfisht: "\u297C", lfloor: "\u230A", Lfr: "\u{1D50F}", lfr: "\u{1D529}", lg: "\u2276", lgE: "\u2A91", lHar: "\u2962", lhard: "\u21BD", lharu: "\u21BC", lharul: "\u296A", lhblk: "\u2584", LJcy: "\u0409", ljcy: "\u0459", llarr: "\u21C7", ll: "\u226A", Ll: "\u22D8", llcorner: "\u231E", Lleftarrow: "\u21DA", llhard: "\u296B", lltri: "\u25FA", Lmidot: "\u013F", lmidot: "\u0140", lmoustache: "\u23B0", lmoust: "\u23B0", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lnE: "\u2268", lneq: "\u2A87", lneqq: "\u2268", lnsim: "\u22E6", loang: "\u27EC", loarr: "\u21FD", lobrk: "\u27E6", longleftarrow: "\u27F5", LongLeftArrow: "\u27F5", Longleftarrow: "\u27F8", longleftrightarrow: "\u27F7", LongLeftRightArrow: "\u27F7", Longleftrightarrow: "\u27FA", longmapsto: "\u27FC", longrightarrow: "\u27F6", LongRightArrow: "\u27F6", Longrightarrow: "\u27F9", looparrowleft: "\u21AB", looparrowright: "\u21AC", lopar: "\u2985", Lopf: "\u{1D543}", lopf: "\u{1D55D}", loplus: "\u2A2D", lotimes: "\u2A34", lowast: "\u2217", lowbar: "_", LowerLeftArrow: "\u2199", LowerRightArrow: "\u2198", loz: "\u25CA", lozenge: "\u25CA", lozf: "\u29EB", lpar: "(", lparlt: "\u2993", lrarr: "\u21C6", lrcorner: "\u231F", lrhar: "\u21CB", lrhard: "\u296D", lrm: "\u200E", lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", Lscr: "\u2112", lsh: "\u21B0", Lsh: "\u21B0", lsim: "\u2272", lsime: "\u2A8D", lsimg: "\u2A8F", lsqb: "[", lsquo: "\u2018", lsquor: "\u201A", Lstrok: "\u0141", lstrok: "\u0142", ltcc: "\u2AA6", ltcir: "\u2A79", lt: "<", LT: "<", Lt: "\u226A", ltdot: "\u22D6", lthree: "\u22CB", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltri: "\u25C3", ltrie: "\u22B4", ltrif: "\u25C2", ltrPar: "\u2996", lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", macr: "\xAF", male: "\u2642", malt: "\u2720", maltese: "\u2720", Map: "\u2905", map: "\u21A6", mapsto: "\u21A6", mapstodown: "\u21A7", mapstoleft: "\u21A4", mapstoup: "\u21A5", marker: "\u25AE", mcomma: "\u2A29", Mcy: "\u041C", mcy: "\u043C", mdash: "\u2014", mDDot: "\u223A", measuredangle: "\u2221", MediumSpace: "\u205F", Mellintrf: "\u2133", Mfr: "\u{1D510}", mfr: "\u{1D52A}", mho: "\u2127", micro: "\xB5", midast: "*", midcir: "\u2AF0", mid: "\u2223", middot: "\xB7", minusb: "\u229F", minus: "\u2212", minusd: "\u2238", minusdu: "\u2A2A", MinusPlus: "\u2213", mlcp: "\u2ADB", mldr: "\u2026", mnplus: "\u2213", models: "\u22A7", Mopf: "\u{1D544}", mopf: "\u{1D55E}", mp: "\u2213", mscr: "\u{1D4C2}", Mscr: "\u2133", mstpos: "\u223E", Mu: "\u039C", mu: "\u03BC", multimap: "\u22B8", mumap: "\u22B8", nabla: "\u2207", Nacute: "\u0143", nacute: "\u0144", nang: "\u2220\u20D2", nap: "\u2249", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", napprox: "\u2249", natural: "\u266E", naturals: "\u2115", natur: "\u266E", nbsp: "\xA0", nbump: "\u224E\u0338", nbumpe: "\u224F\u0338", ncap: "\u2A43", Ncaron: "\u0147", ncaron: "\u0148", Ncedil: "\u0145", ncedil: "\u0146", ncong: "\u2247", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", Ncy: "\u041D", ncy: "\u043D", ndash: "\u2013", nearhk: "\u2924", nearr: "\u2197", neArr: "\u21D7", nearrow: "\u2197", ne: "\u2260", nedot: "\u2250\u0338", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", nequiv: "\u2262", nesear: "\u2928", nesim: "\u2242\u0338", NestedGreaterGreater: "\u226B", NestedLessLess: "\u226A", NewLine: "\n", nexist: "\u2204", nexists: "\u2204", Nfr: "\u{1D511}", nfr: "\u{1D52B}", ngE: "\u2267\u0338", nge: "\u2271", ngeq: "\u2271", ngeqq: "\u2267\u0338", ngeqslant: "\u2A7E\u0338", nges: "\u2A7E\u0338", nGg: "\u22D9\u0338", ngsim: "\u2275", nGt: "\u226B\u20D2", ngt: "\u226F", ngtr: "\u226F", nGtv: "\u226B\u0338", nharr: "\u21AE", nhArr: "\u21CE", nhpar: "\u2AF2", ni: "\u220B", nis: "\u22FC", nisd: "\u22FA", niv: "\u220B", NJcy: "\u040A", njcy: "\u045A", nlarr: "\u219A", nlArr: "\u21CD", nldr: "\u2025", nlE: "\u2266\u0338", nle: "\u2270", nleftarrow: "\u219A", nLeftarrow: "\u21CD", nleftrightarrow: "\u21AE", nLeftrightarrow: "\u21CE", nleq: "\u2270", nleqq: "\u2266\u0338", nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", nless: "\u226E", nLl: "\u22D8\u0338", nlsim: "\u2274", nLt: "\u226A\u20D2", nlt: "\u226E", nltri: "\u22EA", nltrie: "\u22EC", nLtv: "\u226A\u0338", nmid: "\u2224", NoBreak: "\u2060", NonBreakingSpace: "\xA0", nopf: "\u{1D55F}", Nopf: "\u2115", Not: "\u2AEC", not: "\xAC", NotCongruent: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", NotElement: "\u2209", NotEqual: "\u2260", NotEqualTilde: "\u2242\u0338", NotExists: "\u2204", NotGreater: "\u226F", NotGreaterEqual: "\u2271", NotGreaterFullEqual: "\u2267\u0338", NotGreaterGreater: "\u226B\u0338", NotGreaterLess: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", NotGreaterTilde: "\u2275", NotHumpDownHump: "\u224E\u0338", NotHumpEqual: "\u224F\u0338", notin: "\u2209", notindot: "\u22F5\u0338", notinE: "\u22F9\u0338", notinva: "\u2209", notinvb: "\u22F7", notinvc: "\u22F6", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangle: "\u22EA", NotLeftTriangleEqual: "\u22EC", NotLess: "\u226E", NotLessEqual: "\u2270", NotLessGreater: "\u2278", NotLessLess: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338", NotLessTilde: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\u2AA1\u0338", notni: "\u220C", notniva: "\u220C", notnivb: "\u22FE", notnivc: "\u22FD", NotPrecedes: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", NotPrecedesSlantEqual: "\u22E0", NotReverseElement: "\u220C", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangle: "\u22EB", NotRightTriangleEqual: "\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\u22E3", NotSubset: "\u2282\u20D2", NotSubsetEqual: "\u2288", NotSucceeds: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", NotSupersetEqual: "\u2289", NotTilde: "\u2241", NotTildeEqual: "\u2244", NotTildeFullEqual: "\u2247", NotTildeTilde: "\u2249", NotVerticalBar: "\u2224", nparallel: "\u2226", npar: "\u2226", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", npr: "\u2280", nprcue: "\u22E0", nprec: "\u2280", npreceq: "\u2AAF\u0338", npre: "\u2AAF\u0338", nrarrc: "\u2933\u0338", nrarr: "\u219B", nrArr: "\u21CF", nrarrw: "\u219D\u0338", nrightarrow: "\u219B", nRightarrow: "\u21CF", nrtri: "\u22EB", nrtrie: "\u22ED", nsc: "\u2281", nsccue: "\u22E1", nsce: "\u2AB0\u0338", Nscr: "\u{1D4A9}", nscr: "\u{1D4C3}", nshortmid: "\u2224", nshortparallel: "\u2226", nsim: "\u2241", nsime: "\u2244", nsimeq: "\u2244", nsmid: "\u2224", nspar: "\u2226", nsqsube: "\u22E2", nsqsupe: "\u22E3", nsub: "\u2284", nsubE: "\u2AC5\u0338", nsube: "\u2288", nsubset: "\u2282\u20D2", nsubseteq: "\u2288", nsubseteqq: "\u2AC5\u0338", nsucc: "\u2281", nsucceq: "\u2AB0\u0338", nsup: "\u2285", nsupE: "\u2AC6\u0338", nsupe: "\u2289", nsupset: "\u2283\u20D2", nsupseteq: "\u2289", nsupseteqq: "\u2AC6\u0338", ntgl: "\u2279", Ntilde: "\xD1", ntilde: "\xF1", ntlg: "\u2278", ntriangleleft: "\u22EA", ntrianglelefteq: "\u22EC", ntriangleright: "\u22EB", ntrianglerighteq: "\u22ED", Nu: "\u039D", nu: "\u03BD", num: "#", numero: "\u2116", numsp: "\u2007", nvap: "\u224D\u20D2", nvdash: "\u22AC", nvDash: "\u22AD", nVdash: "\u22AE", nVDash: "\u22AF", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvHarr: "\u2904", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwarhk: "\u2923", nwarr: "\u2196", nwArr: "\u21D6", nwarrow: "\u2196", nwnear: "\u2927", Oacute: "\xD3", oacute: "\xF3", oast: "\u229B", Ocirc: "\xD4", ocirc: "\xF4", ocir: "\u229A", Ocy: "\u041E", ocy: "\u043E", odash: "\u229D", Odblac: "\u0150", odblac: "\u0151", odiv: "\u2A38", odot: "\u2299", odsold: "\u29BC", OElig: "\u0152", oelig: "\u0153", ofcir: "\u29BF", Ofr: "\u{1D512}", ofr: "\u{1D52C}", ogon: "\u02DB", Ograve: "\xD2", ograve: "\xF2", ogt: "\u29C1", ohbar: "\u29B5", ohm: "\u03A9", oint: "\u222E", olarr: "\u21BA", olcir: "\u29BE", olcross: "\u29BB", oline: "\u203E", olt: "\u29C0", Omacr: "\u014C", omacr: "\u014D", Omega: "\u03A9", omega: "\u03C9", Omicron: "\u039F", omicron: "\u03BF", omid: "\u29B6", ominus: "\u2296", Oopf: "\u{1D546}", oopf: "\u{1D560}", opar: "\u29B7", OpenCurlyDoubleQuote: "\u201C", OpenCurlyQuote: "\u2018", operp: "\u29B9", oplus: "\u2295", orarr: "\u21BB", Or: "\u2A54", or: "\u2228", ord: "\u2A5D", order: "\u2134", orderof: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\u2A57", orv: "\u2A5B", oS: "\u24C8", Oscr: "\u{1D4AA}", oscr: "\u2134", Oslash: "\xD8", oslash: "\xF8", osol: "\u2298", Otilde: "\xD5", otilde: "\xF5", otimesas: "\u2A36", Otimes: "\u2A37", otimes: "\u2297", Ouml: "\xD6", ouml: "\xF6", ovbar: "\u233D", OverBar: "\u203E", OverBrace: "\u23DE", OverBracket: "\u23B4", OverParenthesis: "\u23DC", para: "\xB6", parallel: "\u2225", par: "\u2225", parsim: "\u2AF3", parsl: "\u2AFD", part: "\u2202", PartialD: "\u2202", Pcy: "\u041F", pcy: "\u043F", percnt: "%", period: ".", permil: "\u2030", perp: "\u22A5", pertenk: "\u2031", Pfr: "\u{1D513}", pfr: "\u{1D52D}", Phi: "\u03A6", phi: "\u03C6", phiv: "\u03D5", phmmat: "\u2133", phone: "\u260E", Pi: "\u03A0", pi: "\u03C0", pitchfork: "\u22D4", piv: "\u03D6", planck: "\u210F", planckh: "\u210E", plankv: "\u210F", plusacir: "\u2A23", plusb: "\u229E", pluscir: "\u2A22", plus: "+", plusdo: "\u2214", plusdu: "\u2A25", pluse: "\u2A72", PlusMinus: "\xB1", plusmn: "\xB1", plussim: "\u2A26", plustwo: "\u2A27", pm: "\xB1", Poincareplane: "\u210C", pointint: "\u2A15", popf: "\u{1D561}", Popf: "\u2119", pound: "\xA3", prap: "\u2AB7", Pr: "\u2ABB", pr: "\u227A", prcue: "\u227C", precapprox: "\u2AB7", prec: "\u227A", preccurlyeq: "\u227C", Precedes: "\u227A", PrecedesEqual: "\u2AAF", PrecedesSlantEqual: "\u227C", PrecedesTilde: "\u227E", preceq: "\u2AAF", precnapprox: "\u2AB9", precneqq: "\u2AB5", precnsim: "\u22E8", pre: "\u2AAF", prE: "\u2AB3", precsim: "\u227E", prime: "\u2032", Prime: "\u2033", primes: "\u2119", prnap: "\u2AB9", prnE: "\u2AB5", prnsim: "\u22E8", prod: "\u220F", Product: "\u220F", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prop: "\u221D", Proportional: "\u221D", Proportion: "\u2237", propto: "\u221D", prsim: "\u227E", prurel: "\u22B0", Pscr: "\u{1D4AB}", pscr: "\u{1D4C5}", Psi: "\u03A8", psi: "\u03C8", puncsp: "\u2008", Qfr: "\u{1D514}", qfr: "\u{1D52E}", qint: "\u2A0C", qopf: "\u{1D562}", Qopf: "\u211A", qprime: "\u2057", Qscr: "\u{1D4AC}", qscr: "\u{1D4C6}", quaternions: "\u210D", quatint: "\u2A16", quest: "?", questeq: "\u225F", quot: '"', QUOT: '"', rAarr: "\u21DB", race: "\u223D\u0331", Racute: "\u0154", racute: "\u0155", radic: "\u221A", raemptyv: "\u29B3", rang: "\u27E9", Rang: "\u27EB", rangd: "\u2992", range: "\u29A5", rangle: "\u27E9", raquo: "\xBB", rarrap: "\u2975", rarrb: "\u21E5", rarrbfs: "\u2920", rarrc: "\u2933", rarr: "\u2192", Rarr: "\u21A0", rArr: "\u21D2", rarrfs: "\u291E", rarrhk: "\u21AA", rarrlp: "\u21AC", rarrpl: "\u2945", rarrsim: "\u2974", Rarrtl: "\u2916", rarrtl: "\u21A3", rarrw: "\u219D", ratail: "\u291A", rAtail: "\u291C", ratio: "\u2236", rationals: "\u211A", rbarr: "\u290D", rBarr: "\u290F", RBarr: "\u2910", rbbrk: "\u2773", rbrace: "}", rbrack: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", Rcaron: "\u0158", rcaron: "\u0159", Rcedil: "\u0156", rcedil: "\u0157", rceil: "\u2309", rcub: "}", Rcy: "\u0420", rcy: "\u0440", rdca: "\u2937", rdldhar: "\u2969", rdquo: "\u201D", rdquor: "\u201D", rdsh: "\u21B3", real: "\u211C", realine: "\u211B", realpart: "\u211C", reals: "\u211D", Re: "\u211C", rect: "\u25AD", reg: "\xAE", REG: "\xAE", ReverseElement: "\u220B", ReverseEquilibrium: "\u21CB", ReverseUpEquilibrium: "\u296F", rfisht: "\u297D", rfloor: "\u230B", rfr: "\u{1D52F}", Rfr: "\u211C", rHar: "\u2964", rhard: "\u21C1", rharu: "\u21C0", rharul: "\u296C", Rho: "\u03A1", rho: "\u03C1", rhov: "\u03F1", RightAngleBracket: "\u27E9", RightArrowBar: "\u21E5", rightarrow: "\u2192", RightArrow: "\u2192", Rightarrow: "\u21D2", RightArrowLeftArrow: "\u21C4", rightarrowtail: "\u21A3", RightCeiling: "\u2309", RightDoubleBracket: "\u27E7", RightDownTeeVector: "\u295D", RightDownVectorBar: "\u2955", RightDownVector: "\u21C2", RightFloor: "\u230B", rightharpoondown: "\u21C1", rightharpoonup: "\u21C0", rightleftarrows: "\u21C4", rightleftharpoons: "\u21CC", rightrightarrows: "\u21C9", rightsquigarrow: "\u219D", RightTeeArrow: "\u21A6", RightTee: "\u22A2", RightTeeVector: "\u295B", rightthreetimes: "\u22CC", RightTriangleBar: "\u29D0", RightTriangle: "\u22B3", RightTriangleEqual: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVectorBar: "\u2954", RightUpVector: "\u21BE", RightVectorBar: "\u2953", RightVector: "\u21C0", ring: "\u02DA", risingdotseq: "\u2253", rlarr: "\u21C4", rlhar: "\u21CC", rlm: "\u200F", rmoustache: "\u23B1", rmoust: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", robrk: "\u27E7", ropar: "\u2986", ropf: "\u{1D563}", Ropf: "\u211D", roplus: "\u2A2E", rotimes: "\u2A35", RoundImplies: "\u2970", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rrarr: "\u21C9", Rrightarrow: "\u21DB", rsaquo: "\u203A", rscr: "\u{1D4C7}", Rscr: "\u211B", rsh: "\u21B1", Rsh: "\u21B1", rsqb: "]", rsquo: "\u2019", rsquor: "\u2019", rthree: "\u22CC", rtimes: "\u22CA", rtri: "\u25B9", rtrie: "\u22B5", rtrif: "\u25B8", rtriltri: "\u29CE", RuleDelayed: "\u29F4", ruluhar: "\u2968", rx: "\u211E", Sacute: "\u015A", sacute: "\u015B", sbquo: "\u201A", scap: "\u2AB8", Scaron: "\u0160", scaron: "\u0161", Sc: "\u2ABC", sc: "\u227B", sccue: "\u227D", sce: "\u2AB0", scE: "\u2AB4", Scedil: "\u015E", scedil: "\u015F", Scirc: "\u015C", scirc: "\u015D", scnap: "\u2ABA", scnE: "\u2AB6", scnsim: "\u22E9", scpolint: "\u2A13", scsim: "\u227F", Scy: "\u0421", scy: "\u0441", sdotb: "\u22A1", sdot: "\u22C5", sdote: "\u2A66", searhk: "\u2925", searr: "\u2198", seArr: "\u21D8", searrow: "\u2198", sect: "\xA7", semi: ";", seswar: "\u2929", setminus: "\u2216", setmn: "\u2216", sext: "\u2736", Sfr: "\u{1D516}", sfr: "\u{1D530}", sfrown: "\u2322", sharp: "\u266F", SHCHcy: "\u0429", shchcy: "\u0449", SHcy: "\u0428", shcy: "\u0448", ShortDownArrow: "\u2193", ShortLeftArrow: "\u2190", shortmid: "\u2223", shortparallel: "\u2225", ShortRightArrow: "\u2192", ShortUpArrow: "\u2191", shy: "\xAD", Sigma: "\u03A3", sigma: "\u03C3", sigmaf: "\u03C2", sigmav: "\u03C2", sim: "\u223C", simdot: "\u2A6A", sime: "\u2243", simeq: "\u2243", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246", simplus: "\u2A24", simrarr: "\u2972", slarr: "\u2190", SmallCircle: "\u2218", smallsetminus: "\u2216", smashp: "\u2A33", smeparsl: "\u29E4", smid: "\u2223", smile: "\u2323", smt: "\u2AAA", smte: "\u2AAC", smtes: "\u2AAC\uFE00", SOFTcy: "\u042C", softcy: "\u044C", solbar: "\u233F", solb: "\u29C4", sol: "/", Sopf: "\u{1D54A}", sopf: "\u{1D564}", spades: "\u2660", spadesuit: "\u2660", spar: "\u2225", sqcap: "\u2293", sqcaps: "\u2293\uFE00", sqcup: "\u2294", sqcups: "\u2294\uFE00", Sqrt: "\u221A", sqsub: "\u228F", sqsube: "\u2291", sqsubset: "\u228F", sqsubseteq: "\u2291", sqsup: "\u2290", sqsupe: "\u2292", sqsupset: "\u2290", sqsupseteq: "\u2292", square: "\u25A1", Square: "\u25A1", SquareIntersection: "\u2293", SquareSubset: "\u228F", SquareSubsetEqual: "\u2291", SquareSuperset: "\u2290", SquareSupersetEqual: "\u2292", SquareUnion: "\u2294", squarf: "\u25AA", squ: "\u25A1", squf: "\u25AA", srarr: "\u2192", Sscr: "\u{1D4AE}", sscr: "\u{1D4C8}", ssetmn: "\u2216", ssmile: "\u2323", sstarf: "\u22C6", Star: "\u22C6", star: "\u2606", starf: "\u2605", straightepsilon: "\u03F5", straightphi: "\u03D5", strns: "\xAF", sub: "\u2282", Sub: "\u22D0", subdot: "\u2ABD", subE: "\u2AC5", sube: "\u2286", subedot: "\u2AC3", submult: "\u2AC1", subnE: "\u2ACB", subne: "\u228A", subplus: "\u2ABF", subrarr: "\u2979", subset: "\u2282", Subset: "\u22D0", subseteq: "\u2286", subseteqq: "\u2AC5", SubsetEqual: "\u2286", subsetneq: "\u228A", subsetneqq: "\u2ACB", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", succapprox: "\u2AB8", succ: "\u227B", succcurlyeq: "\u227D", Succeeds: "\u227B", SucceedsEqual: "\u2AB0", SucceedsSlantEqual: "\u227D", SucceedsTilde: "\u227F", succeq: "\u2AB0", succnapprox: "\u2ABA", succneqq: "\u2AB6", succnsim: "\u22E9", succsim: "\u227F", SuchThat: "\u220B", sum: "\u2211", Sum: "\u2211", sung: "\u266A", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", sup: "\u2283", Sup: "\u22D1", supdot: "\u2ABE", supdsub: "\u2AD8", supE: "\u2AC6", supe: "\u2287", supedot: "\u2AC4", Superset: "\u2283", SupersetEqual: "\u2287", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\u297B", supmult: "\u2AC2", supnE: "\u2ACC", supne: "\u228B", supplus: "\u2AC0", supset: "\u2283", Supset: "\u22D1", supseteq: "\u2287", supseteqq: "\u2AC6", supsetneq: "\u228B", supsetneqq: "\u2ACC", supsim: "\u2AC8", supsub: "\u2AD4", supsup: "\u2AD6", swarhk: "\u2926", swarr: "\u2199", swArr: "\u21D9", swarrow: "\u2199", swnwar: "\u292A", szlig: "\xDF", Tab: "	", target: "\u2316", Tau: "\u03A4", tau: "\u03C4", tbrk: "\u23B4", Tcaron: "\u0164", tcaron: "\u0165", Tcedil: "\u0162", tcedil: "\u0163", Tcy: "\u0422", tcy: "\u0442", tdot: "\u20DB", telrec: "\u2315", Tfr: "\u{1D517}", tfr: "\u{1D531}", there4: "\u2234", therefore: "\u2234", Therefore: "\u2234", Theta: "\u0398", theta: "\u03B8", thetasym: "\u03D1", thetav: "\u03D1", thickapprox: "\u2248", thicksim: "\u223C", ThickSpace: "\u205F\u200A", ThinSpace: "\u2009", thinsp: "\u2009", thkap: "\u2248", thksim: "\u223C", THORN: "\xDE", thorn: "\xFE", tilde: "\u02DC", Tilde: "\u223C", TildeEqual: "\u2243", TildeFullEqual: "\u2245", TildeTilde: "\u2248", timesbar: "\u2A31", timesb: "\u22A0", times: "\xD7", timesd: "\u2A30", tint: "\u222D", toea: "\u2928", topbot: "\u2336", topcir: "\u2AF1", top: "\u22A4", Topf: "\u{1D54B}", topf: "\u{1D565}", topfork: "\u2ADA", tosa: "\u2929", tprime: "\u2034", trade: "\u2122", TRADE: "\u2122", triangle: "\u25B5", triangledown: "\u25BF", triangleleft: "\u25C3", trianglelefteq: "\u22B4", triangleq: "\u225C", triangleright: "\u25B9", trianglerighteq: "\u22B5", tridot: "\u25EC", trie: "\u225C", triminus: "\u2A3A", TripleDot: "\u20DB", triplus: "\u2A39", trisb: "\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", Tscr: "\u{1D4AF}", tscr: "\u{1D4C9}", TScy: "\u0426", tscy: "\u0446", TSHcy: "\u040B", tshcy: "\u045B", Tstrok: "\u0166", tstrok: "\u0167", twixt: "\u226C", twoheadleftarrow: "\u219E", twoheadrightarrow: "\u21A0", Uacute: "\xDA", uacute: "\xFA", uarr: "\u2191", Uarr: "\u219F", uArr: "\u21D1", Uarrocir: "\u2949", Ubrcy: "\u040E", ubrcy: "\u045E", Ubreve: "\u016C", ubreve: "\u016D", Ucirc: "\xDB", ucirc: "\xFB", Ucy: "\u0423", ucy: "\u0443", udarr: "\u21C5", Udblac: "\u0170", udblac: "\u0171", udhar: "\u296E", ufisht: "\u297E", Ufr: "\u{1D518}", ufr: "\u{1D532}", Ugrave: "\xD9", ugrave: "\xF9", uHar: "\u2963", uharl: "\u21BF", uharr: "\u21BE", uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", Umacr: "\u016A", umacr: "\u016B", uml: "\xA8", UnderBar: "_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", UnionPlus: "\u228E", Uogon: "\u0172", uogon: "\u0173", Uopf: "\u{1D54C}", uopf: "\u{1D566}", UpArrowBar: "\u2912", uparrow: "\u2191", UpArrow: "\u2191", Uparrow: "\u21D1", UpArrowDownArrow: "\u21C5", updownarrow: "\u2195", UpDownArrow: "\u2195", Updownarrow: "\u21D5", UpEquilibrium: "\u296E", upharpoonleft: "\u21BF", upharpoonright: "\u21BE", uplus: "\u228E", UpperLeftArrow: "\u2196", UpperRightArrow: "\u2197", upsi: "\u03C5", Upsi: "\u03D2", upsih: "\u03D2", Upsilon: "\u03A5", upsilon: "\u03C5", UpTeeArrow: "\u21A5", UpTee: "\u22A5", upuparrows: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", Uring: "\u016E", uring: "\u016F", urtri: "\u25F9", Uscr: "\u{1D4B0}", uscr: "\u{1D4CA}", utdot: "\u22F0", Utilde: "\u0168", utilde: "\u0169", utri: "\u25B5", utrif: "\u25B4", uuarr: "\u21C8", Uuml: "\xDC", uuml: "\xFC", uwangle: "\u29A7", vangrt: "\u299C", varepsilon: "\u03F5", varkappa: "\u03F0", varnothing: "\u2205", varphi: "\u03D5", varpi: "\u03D6", varpropto: "\u221D", varr: "\u2195", vArr: "\u21D5", varrho: "\u03F1", varsigma: "\u03C2", varsubsetneq: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", varsupsetneq: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vartheta: "\u03D1", vartriangleleft: "\u22B2", vartriangleright: "\u22B3", vBar: "\u2AE8", Vbar: "\u2AEB", vBarv: "\u2AE9", Vcy: "\u0412", vcy: "\u0432", vdash: "\u22A2", vDash: "\u22A8", Vdash: "\u22A9", VDash: "\u22AB", Vdashl: "\u2AE6", veebar: "\u22BB", vee: "\u2228", Vee: "\u22C1", veeeq: "\u225A", vellip: "\u22EE", verbar: "|", Verbar: "\u2016", vert: "|", Vert: "\u2016", VerticalBar: "\u2223", VerticalLine: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", VeryThinSpace: "\u200A", Vfr: "\u{1D519}", vfr: "\u{1D533}", vltri: "\u22B2", vnsub: "\u2282\u20D2", vnsup: "\u2283\u20D2", Vopf: "\u{1D54D}", vopf: "\u{1D567}", vprop: "\u221D", vrtri: "\u22B3", Vscr: "\u{1D4B1}", vscr: "\u{1D4CB}", vsubnE: "\u2ACB\uFE00", vsubne: "\u228A\uFE00", vsupnE: "\u2ACC\uFE00", vsupne: "\u228B\uFE00", Vvdash: "\u22AA", vzigzag: "\u299A", Wcirc: "\u0174", wcirc: "\u0175", wedbar: "\u2A5F", wedge: "\u2227", Wedge: "\u22C0", wedgeq: "\u2259", weierp: "\u2118", Wfr: "\u{1D51A}", wfr: "\u{1D534}", Wopf: "\u{1D54E}", wopf: "\u{1D568}", wp: "\u2118", wr: "\u2240", wreath: "\u2240", Wscr: "\u{1D4B2}", wscr: "\u{1D4CC}", xcap: "\u22C2", xcirc: "\u25EF", xcup: "\u22C3", xdtri: "\u25BD", Xfr: "\u{1D51B}", xfr: "\u{1D535}", xharr: "\u27F7", xhArr: "\u27FA", Xi: "\u039E", xi: "\u03BE", xlarr: "\u27F5", xlArr: "\u27F8", xmap: "\u27FC", xnis: "\u22FB", xodot: "\u2A00", Xopf: "\u{1D54F}", xopf: "\u{1D569}", xoplus: "\u2A01", xotime: "\u2A02", xrarr: "\u27F6", xrArr: "\u27F9", Xscr: "\u{1D4B3}", xscr: "\u{1D4CD}", xsqcup: "\u2A06", xuplus: "\u2A04", xutri: "\u25B3", xvee: "\u22C1", xwedge: "\u22C0", Yacute: "\xDD", yacute: "\xFD", YAcy: "\u042F", yacy: "\u044F", Ycirc: "\u0176", ycirc: "\u0177", Ycy: "\u042B", ycy: "\u044B", yen: "\xA5", Yfr: "\u{1D51C}", yfr: "\u{1D536}", YIcy: "\u0407", yicy: "\u0457", Yopf: "\u{1D550}", yopf: "\u{1D56A}", Yscr: "\u{1D4B4}", yscr: "\u{1D4CE}", YUcy: "\u042E", yucy: "\u044E", yuml: "\xFF", Yuml: "\u0178", Zacute: "\u0179", zacute: "\u017A", Zcaron: "\u017D", zcaron: "\u017E", Zcy: "\u0417", zcy: "\u0437", Zdot: "\u017B", zdot: "\u017C", zeetrf: "\u2128", ZeroWidthSpace: "\u200B", Zeta: "\u0396", zeta: "\u03B6", zfr: "\u{1D537}", Zfr: "\u2128", ZHcy: "\u0416", zhcy: "\u0436", zigrarr: "\u21DD", zopf: "\u{1D56B}", Zopf: "\u2124", Zscr: "\u{1D4B5}", zscr: "\u{1D4CF}", zwj: "\u200D", zwnj: "\u200C" };
  }
});

// node_modules/entities/lib/maps/legacy.json
var require_legacy = __commonJS({
  "node_modules/entities/lib/maps/legacy.json"(exports2, module2) {
    module2.exports = { Aacute: "\xC1", aacute: "\xE1", Acirc: "\xC2", acirc: "\xE2", acute: "\xB4", AElig: "\xC6", aelig: "\xE6", Agrave: "\xC0", agrave: "\xE0", amp: "&", AMP: "&", Aring: "\xC5", aring: "\xE5", Atilde: "\xC3", atilde: "\xE3", Auml: "\xC4", auml: "\xE4", brvbar: "\xA6", Ccedil: "\xC7", ccedil: "\xE7", cedil: "\xB8", cent: "\xA2", copy: "\xA9", COPY: "\xA9", curren: "\xA4", deg: "\xB0", divide: "\xF7", Eacute: "\xC9", eacute: "\xE9", Ecirc: "\xCA", ecirc: "\xEA", Egrave: "\xC8", egrave: "\xE8", ETH: "\xD0", eth: "\xF0", Euml: "\xCB", euml: "\xEB", frac12: "\xBD", frac14: "\xBC", frac34: "\xBE", gt: ">", GT: ">", Iacute: "\xCD", iacute: "\xED", Icirc: "\xCE", icirc: "\xEE", iexcl: "\xA1", Igrave: "\xCC", igrave: "\xEC", iquest: "\xBF", Iuml: "\xCF", iuml: "\xEF", laquo: "\xAB", lt: "<", LT: "<", macr: "\xAF", micro: "\xB5", middot: "\xB7", nbsp: "\xA0", not: "\xAC", Ntilde: "\xD1", ntilde: "\xF1", Oacute: "\xD3", oacute: "\xF3", Ocirc: "\xD4", ocirc: "\xF4", Ograve: "\xD2", ograve: "\xF2", ordf: "\xAA", ordm: "\xBA", Oslash: "\xD8", oslash: "\xF8", Otilde: "\xD5", otilde: "\xF5", Ouml: "\xD6", ouml: "\xF6", para: "\xB6", plusmn: "\xB1", pound: "\xA3", quot: '"', QUOT: '"', raquo: "\xBB", reg: "\xAE", REG: "\xAE", sect: "\xA7", shy: "\xAD", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", szlig: "\xDF", THORN: "\xDE", thorn: "\xFE", times: "\xD7", Uacute: "\xDA", uacute: "\xFA", Ucirc: "\xDB", ucirc: "\xFB", Ugrave: "\xD9", ugrave: "\xF9", uml: "\xA8", Uuml: "\xDC", uuml: "\xFC", Yacute: "\xDD", yacute: "\xFD", yen: "\xA5", yuml: "\xFF" };
  }
});

// node_modules/entities/lib/maps/xml.json
var require_xml = __commonJS({
  "node_modules/entities/lib/maps/xml.json"(exports2, module2) {
    module2.exports = { amp: "&", apos: "'", gt: ">", lt: "<", quot: '"' };
  }
});

// node_modules/entities/lib/maps/decode.json
var require_decode = __commonJS({
  "node_modules/entities/lib/maps/decode.json"(exports2, module2) {
    module2.exports = { "0": 65533, "128": 8364, "130": 8218, "131": 402, "132": 8222, "133": 8230, "134": 8224, "135": 8225, "136": 710, "137": 8240, "138": 352, "139": 8249, "140": 338, "142": 381, "145": 8216, "146": 8217, "147": 8220, "148": 8221, "149": 8226, "150": 8211, "151": 8212, "152": 732, "153": 8482, "154": 353, "155": 8250, "156": 339, "158": 382, "159": 376 };
  }
});

// node_modules/entities/lib/decode_codepoint.js
var require_decode_codepoint = __commonJS({
  "node_modules/entities/lib/decode_codepoint.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var decode_json_1 = __importDefault2(require_decode());
    var fromCodePoint = String.fromCodePoint || function(codePoint) {
      var output = "";
      if (codePoint > 65535) {
        codePoint -= 65536;
        output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      output += String.fromCharCode(codePoint);
      return output;
    };
    function decodeCodePoint(codePoint) {
      if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
        return "\uFFFD";
      }
      if (codePoint in decode_json_1.default) {
        codePoint = decode_json_1.default[codePoint];
      }
      return fromCodePoint(codePoint);
    }
    exports2.default = decodeCodePoint;
  }
});

// node_modules/entities/lib/decode.js
var require_decode2 = __commonJS({
  "node_modules/entities/lib/decode.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.decodeHTML = exports2.decodeHTMLStrict = exports2.decodeXML = void 0;
    var entities_json_1 = __importDefault2(require_entities());
    var legacy_json_1 = __importDefault2(require_legacy());
    var xml_json_1 = __importDefault2(require_xml());
    var decode_codepoint_1 = __importDefault2(require_decode_codepoint());
    var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
    exports2.decodeXML = getStrictDecoder(xml_json_1.default);
    exports2.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
    function getStrictDecoder(map4) {
      var replace = getReplacer(map4);
      return function(str) {
        return String(str).replace(strictEntityRe, replace);
      };
    }
    var sorter = function(a, b) {
      return a < b ? 1 : -1;
    };
    exports2.decodeHTML = function() {
      var legacy = Object.keys(legacy_json_1.default).sort(sorter);
      var keys2 = Object.keys(entities_json_1.default).sort(sorter);
      for (var i = 0, j = 0; i < keys2.length; i++) {
        if (legacy[j] === keys2[i]) {
          keys2[i] += ";?";
          j++;
        } else {
          keys2[i] += ";";
        }
      }
      var re = new RegExp("&(?:" + keys2.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
      var replace = getReplacer(entities_json_1.default);
      function replacer(str) {
        if (str.substr(-1) !== ";")
          str += ";";
        return replace(str);
      }
      return function(str) {
        return String(str).replace(re, replacer);
      };
    }();
    function getReplacer(map4) {
      return function replace(str) {
        if (str.charAt(1) === "#") {
          var secondChar = str.charAt(2);
          if (secondChar === "X" || secondChar === "x") {
            return decode_codepoint_1.default(parseInt(str.substr(3), 16));
          }
          return decode_codepoint_1.default(parseInt(str.substr(2), 10));
        }
        return map4[str.slice(1, -1)] || str;
      };
    }
  }
});

// node_modules/entities/lib/encode.js
var require_encode = __commonJS({
  "node_modules/entities/lib/encode.js"(exports2) {
    "use strict";
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.escapeUTF8 = exports2.escape = exports2.encodeNonAsciiHTML = exports2.encodeHTML = exports2.encodeXML = void 0;
    var xml_json_1 = __importDefault2(require_xml());
    var inverseXML = getInverseObj(xml_json_1.default);
    var xmlReplacer = getInverseReplacer(inverseXML);
    exports2.encodeXML = getASCIIEncoder(inverseXML);
    var entities_json_1 = __importDefault2(require_entities());
    var inverseHTML = getInverseObj(entities_json_1.default);
    var htmlReplacer = getInverseReplacer(inverseHTML);
    exports2.encodeHTML = getInverse(inverseHTML, htmlReplacer);
    exports2.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
    function getInverseObj(obj) {
      return Object.keys(obj).sort().reduce(function(inverse, name) {
        inverse[obj[name]] = "&" + name + ";";
        return inverse;
      }, {});
    }
    function getInverseReplacer(inverse) {
      var single = [];
      var multiple = [];
      for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
        var k = _a[_i];
        if (k.length === 1) {
          single.push("\\" + k);
        } else {
          multiple.push(k);
        }
      }
      single.sort();
      for (var start = 0; start < single.length - 1; start++) {
        var end = start;
        while (end < single.length - 1 && single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
          end += 1;
        }
        var count = 1 + end - start;
        if (count < 3)
          continue;
        single.splice(start, count, single[start] + "-" + single[end]);
      }
      multiple.unshift("[" + single.join("") + "]");
      return new RegExp(multiple.join("|"), "g");
    }
    var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
    var getCodePoint = String.prototype.codePointAt != null ? function(str) {
      return str.codePointAt(0);
    } : function(c) {
      return (c.charCodeAt(0) - 55296) * 1024 + c.charCodeAt(1) - 56320 + 65536;
    };
    function singleCharReplacer(c) {
      return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0)).toString(16).toUpperCase() + ";";
    }
    function getInverse(inverse, re) {
      return function(data) {
        return data.replace(re, function(name) {
          return inverse[name];
        }).replace(reNonASCII, singleCharReplacer);
      };
    }
    var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
    function escape(data) {
      return data.replace(reEscapeChars, singleCharReplacer);
    }
    exports2.escape = escape;
    function escapeUTF8(data) {
      return data.replace(xmlReplacer, singleCharReplacer);
    }
    exports2.escapeUTF8 = escapeUTF8;
    function getASCIIEncoder(obj) {
      return function(data) {
        return data.replace(reEscapeChars, function(c) {
          return obj[c] || singleCharReplacer(c);
        });
      };
    }
  }
});

// node_modules/entities/lib/index.js
var require_lib = __commonJS({
  "node_modules/entities/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.decodeXMLStrict = exports2.decodeHTML5Strict = exports2.decodeHTML4Strict = exports2.decodeHTML5 = exports2.decodeHTML4 = exports2.decodeHTMLStrict = exports2.decodeHTML = exports2.decodeXML = exports2.encodeHTML5 = exports2.encodeHTML4 = exports2.escapeUTF8 = exports2.escape = exports2.encodeNonAsciiHTML = exports2.encodeHTML = exports2.encodeXML = exports2.encode = exports2.decodeStrict = exports2.decode = void 0;
    var decode_1 = require_decode2();
    var encode_1 = require_encode();
    function decode(data, level) {
      return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
    }
    exports2.decode = decode;
    function decodeStrict(data, level) {
      return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
    }
    exports2.decodeStrict = decodeStrict;
    function encode(data, level) {
      return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
    }
    exports2.encode = encode;
    var encode_2 = require_encode();
    Object.defineProperty(exports2, "encodeXML", { enumerable: true, get: function() {
      return encode_2.encodeXML;
    } });
    Object.defineProperty(exports2, "encodeHTML", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    Object.defineProperty(exports2, "encodeNonAsciiHTML", { enumerable: true, get: function() {
      return encode_2.encodeNonAsciiHTML;
    } });
    Object.defineProperty(exports2, "escape", { enumerable: true, get: function() {
      return encode_2.escape;
    } });
    Object.defineProperty(exports2, "escapeUTF8", { enumerable: true, get: function() {
      return encode_2.escapeUTF8;
    } });
    Object.defineProperty(exports2, "encodeHTML4", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    Object.defineProperty(exports2, "encodeHTML5", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    var decode_2 = require_decode2();
    Object.defineProperty(exports2, "decodeXML", { enumerable: true, get: function() {
      return decode_2.decodeXML;
    } });
    Object.defineProperty(exports2, "decodeHTML", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports2, "decodeHTMLStrict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports2, "decodeHTML4", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports2, "decodeHTML5", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports2, "decodeHTML4Strict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports2, "decodeHTML5Strict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports2, "decodeXMLStrict", { enumerable: true, get: function() {
      return decode_2.decodeXML;
    } });
  }
});

// node_modules/fast-xml-parser/src/util.js
var require_util2 = __commonJS({
  "node_modules/fast-xml-parser/src/util.js"(exports2) {
    "use strict";
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    var isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports2.isExist = function(v) {
      return typeof v !== "undefined";
    };
    exports2.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports2.merge = function(target, a, arrayMode) {
      if (a) {
        const keys2 = Object.keys(a);
        const len = keys2.length;
        for (let i = 0; i < len; i++) {
          if (arrayMode === "strict") {
            target[keys2[i]] = [a[keys2[i]]];
          } else {
            target[keys2[i]] = a[keys2[i]];
          }
        }
      }
    };
    exports2.getValue = function(v) {
      if (exports2.isExist(v)) {
        return v;
      } else {
        return "";
      }
    };
    exports2.buildOptions = function(options, defaultOptions2, props) {
      var newOptions = {};
      if (!options) {
        return defaultOptions2;
      }
      for (let i = 0; i < props.length; i++) {
        if (options[props[i]] !== void 0) {
          newOptions[props[i]] = options[props[i]];
        } else {
          newOptions[props[i]] = defaultOptions2[props[i]];
        }
      }
      return newOptions;
    };
    exports2.isTagNameInArrayMode = function(tagName, arrayMode, parentTagName) {
      if (arrayMode === false) {
        return false;
      } else if (arrayMode instanceof RegExp) {
        return arrayMode.test(tagName);
      } else if (typeof arrayMode === "function") {
        return !!arrayMode(tagName, parentTagName);
      }
      return arrayMode === "strict";
    };
    exports2.isName = isName;
    exports2.getAllMatches = getAllMatches;
    exports2.nameRegexp = nameRegexp;
  }
});

// node_modules/fast-xml-parser/src/node2json.js
var require_node2json = __commonJS({
  "node_modules/fast-xml-parser/src/node2json.js"(exports2) {
    "use strict";
    var util2 = require_util2();
    var convertToJson = function(node, options, parentTagName) {
      const jObj = {};
      if ((!node.child || util2.isEmptyObject(node.child)) && (!node.attrsMap || util2.isEmptyObject(node.attrsMap))) {
        return util2.isExist(node.val) ? node.val : "";
      }
      if (util2.isExist(node.val) && !(typeof node.val === "string" && (node.val === "" || node.val === options.cdataPositionChar))) {
        const asArray = util2.isTagNameInArrayMode(node.tagname, options.arrayMode, parentTagName);
        jObj[options.textNodeName] = asArray ? [node.val] : node.val;
      }
      util2.merge(jObj, node.attrsMap, options.arrayMode);
      const keys2 = Object.keys(node.child);
      for (let index = 0; index < keys2.length; index++) {
        const tagName = keys2[index];
        if (node.child[tagName] && node.child[tagName].length > 1) {
          jObj[tagName] = [];
          for (let tag in node.child[tagName]) {
            if (node.child[tagName].hasOwnProperty(tag)) {
              jObj[tagName].push(convertToJson(node.child[tagName][tag], options, tagName));
            }
          }
        } else {
          const result = convertToJson(node.child[tagName][0], options, tagName);
          const asArray = options.arrayMode === true && typeof result === "object" || util2.isTagNameInArrayMode(tagName, options.arrayMode, parentTagName);
          jObj[tagName] = asArray ? [result] : result;
        }
      }
      return jObj;
    };
    exports2.convertToJson = convertToJson;
  }
});

// node_modules/fast-xml-parser/src/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlNode.js"(exports2, module2) {
    "use strict";
    module2.exports = function(tagname, parent, val) {
      this.tagname = tagname;
      this.parent = parent;
      this.child = {};
      this.attrsMap = {};
      this.val = val;
      this.addChild = function(child) {
        if (Array.isArray(this.child[child.tagname])) {
          this.child[child.tagname].push(child);
        } else {
          this.child[child.tagname] = [child];
        }
      };
    };
  }
});

// node_modules/fast-xml-parser/src/xmlstr2xmlnode.js
var require_xmlstr2xmlnode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlstr2xmlnode.js"(exports2) {
    "use strict";
    var util2 = require_util2();
    var buildOptions = require_util2().buildOptions;
    var xmlNode = require_xmlNode();
    var regx = "<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)".replace(/NAME/g, util2.nameRegexp);
    if (!Number.parseInt && window.parseInt) {
      Number.parseInt = window.parseInt;
    }
    if (!Number.parseFloat && window.parseFloat) {
      Number.parseFloat = window.parseFloat;
    }
    var defaultOptions2 = {
      attributeNamePrefix: "@_",
      attrNodeName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      ignoreNameSpace: false,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: false,
      arrayMode: false,
      trimValues: true,
      cdataTagName: false,
      cdataPositionChar: "\\c",
      tagValueProcessor: function(a, tagName) {
        return a;
      },
      attrValueProcessor: function(a, attrName) {
        return a;
      },
      stopNodes: []
    };
    exports2.defaultOptions = defaultOptions2;
    var props = [
      "attributeNamePrefix",
      "attrNodeName",
      "textNodeName",
      "ignoreAttributes",
      "ignoreNameSpace",
      "allowBooleanAttributes",
      "parseNodeValue",
      "parseAttributeValue",
      "arrayMode",
      "trimValues",
      "cdataTagName",
      "cdataPositionChar",
      "tagValueProcessor",
      "attrValueProcessor",
      "parseTrueNumberOnly",
      "stopNodes"
    ];
    exports2.props = props;
    function processTagValue(tagName, val, options) {
      if (val) {
        if (options.trimValues) {
          val = val.trim();
        }
        val = options.tagValueProcessor(val, tagName);
        val = parseValue(val, options.parseNodeValue, options.parseTrueNumberOnly);
      }
      return val;
    }
    function resolveNameSpace(tagname, options) {
      if (options.ignoreNameSpace) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    function parseValue(val, shouldParse, parseTrueNumberOnly) {
      if (shouldParse && typeof val === "string") {
        let parsed;
        if (val.trim() === "" || isNaN(val)) {
          parsed = val === "true" ? true : val === "false" ? false : val;
        } else {
          if (val.indexOf("0x") !== -1) {
            parsed = Number.parseInt(val, 16);
          } else if (val.indexOf(".") !== -1) {
            parsed = Number.parseFloat(val);
            val = val.replace(/\.?0+$/, "");
          } else {
            parsed = Number.parseInt(val, 10);
          }
          if (parseTrueNumberOnly) {
            parsed = String(parsed) === val ? parsed : val;
          }
        }
        return parsed;
      } else {
        if (util2.isExist(val)) {
          return val;
        } else {
          return "";
        }
      }
    }
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])(.*?)\\3)?`, "g");
    function buildAttributesMap(attrStr, options) {
      if (!options.ignoreAttributes && typeof attrStr === "string") {
        attrStr = attrStr.replace(/\r?\n/g, " ");
        const matches = util2.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i = 0; i < len; i++) {
          const attrName = resolveNameSpace(matches[i][1], options);
          if (attrName.length) {
            if (matches[i][4] !== void 0) {
              if (options.trimValues) {
                matches[i][4] = matches[i][4].trim();
              }
              matches[i][4] = options.attrValueProcessor(matches[i][4], attrName);
              attrs[options.attributeNamePrefix + attrName] = parseValue(
                matches[i][4],
                options.parseAttributeValue,
                options.parseTrueNumberOnly
              );
            } else if (options.allowBooleanAttributes) {
              attrs[options.attributeNamePrefix + attrName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (options.attrNodeName) {
          const attrCollection = {};
          attrCollection[options.attrNodeName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    var getTraversalObj = function(xmlData, options) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      options = buildOptions(options, defaultOptions2, props);
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      for (let i = 0; i < xmlData.length; i++) {
        const ch = xmlData[i];
        if (ch === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i + 2, closeIndex).trim();
            if (options.ignoreNameSpace) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (currentNode) {
              if (currentNode.val) {
                currentNode.val = util2.getValue(currentNode.val) + "" + processTagValue(tagName, textData, options);
              } else {
                currentNode.val = processTagValue(tagName, textData, options);
              }
            }
            if (options.stopNodes.length && options.stopNodes.includes(currentNode.tagname)) {
              currentNode.child = [];
              if (currentNode.attrsMap == void 0) {
                currentNode.attrsMap = {};
              }
              currentNode.val = xmlData.substr(currentNode.startIndex + 1, i - currentNode.startIndex - 1);
            }
            currentNode = currentNode.parent;
            textData = "";
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            i = findClosingIndex(xmlData, "?>", i, "Pi Tag is not closed.");
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            i = findClosingIndex(xmlData, "-->", i, "Comment is not closed.");
          } else if (xmlData.substr(i + 1, 2) === "!D") {
            const closeIndex = findClosingIndex(xmlData, ">", i, "DOCTYPE is not closed.");
            const tagExp = xmlData.substring(i, closeIndex);
            if (tagExp.indexOf("[") >= 0) {
              i = xmlData.indexOf("]>", i) + 1;
            } else {
              i = closeIndex;
            }
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i + 9, closeIndex);
            if (textData) {
              currentNode.val = util2.getValue(currentNode.val) + "" + processTagValue(currentNode.tagname, textData, options);
              textData = "";
            }
            if (options.cdataTagName) {
              const childNode = new xmlNode(options.cdataTagName, currentNode, tagExp);
              currentNode.addChild(childNode);
              currentNode.val = util2.getValue(currentNode.val) + options.cdataPositionChar;
              if (tagExp) {
                childNode.val = tagExp;
              }
            } else {
              currentNode.val = (currentNode.val || "") + (tagExp || "");
            }
            i = closeIndex + 2;
          } else {
            const result = closingIndexForOpeningTag(xmlData, i + 1);
            let tagExp = result.data;
            const closeIndex = result.index;
            const separatorIndex = tagExp.indexOf(" ");
            let tagName = tagExp;
            let shouldBuildAttributesMap = true;
            if (separatorIndex !== -1) {
              tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, "");
              tagExp = tagExp.substr(separatorIndex + 1);
            }
            if (options.ignoreNameSpace) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
                shouldBuildAttributesMap = tagName !== result.data.substr(colonIndex + 1);
              }
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                currentNode.val = util2.getValue(currentNode.val) + "" + processTagValue(currentNode.tagname, textData, options);
              }
            }
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substr(0, tagName.length - 1);
                tagExp = tagName;
              } else {
                tagExp = tagExp.substr(0, tagExp.length - 1);
              }
              const childNode = new xmlNode(tagName, currentNode, "");
              if (tagName !== tagExp) {
                childNode.attrsMap = buildAttributesMap(tagExp, options);
              }
              currentNode.addChild(childNode);
            } else {
              const childNode = new xmlNode(tagName, currentNode);
              if (options.stopNodes.length && options.stopNodes.includes(childNode.tagname)) {
                childNode.startIndex = closeIndex;
              }
              if (tagName !== tagExp && shouldBuildAttributesMap) {
                childNode.attrsMap = buildAttributesMap(tagExp, options);
              }
              currentNode.addChild(childNode);
              currentNode = childNode;
            }
            textData = "";
            i = closeIndex;
          }
        } else {
          textData += xmlData[i];
        }
      }
      return xmlObj;
    };
    function closingIndexForOpeningTag(data, i) {
      let attrBoundary;
      let tagExp = "";
      for (let index = i; index < data.length; index++) {
        let ch = data[index];
        if (attrBoundary) {
          if (ch === attrBoundary)
            attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === ">") {
          return {
            data: tagExp,
            index
          };
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    function findClosingIndex(xmlData, str, i, errMsg) {
      const closingIndex = xmlData.indexOf(str, i);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    exports2.getTraversalObj = getTraversalObj;
  }
});

// node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/fast-xml-parser/src/validator.js"(exports2) {
    "use strict";
    var util2 = require_util2();
    var defaultOptions2 = {
      allowBooleanAttributes: false
    };
    var props = ["allowBooleanAttributes"];
    exports2.validate = function(xmlData, options) {
      options = util2.buildOptions(options, defaultOptions2, props);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i = 0; i < xmlData.length; i++) {
        if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
          i += 2;
          i = readPI(xmlData, i);
          if (i.err)
            return i;
        } else if (xmlData[i] === "<") {
          i++;
          if (xmlData[i] === "!") {
            i = readCommentAndCDATA(xmlData, i);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i] === "/") {
              closingTag = true;
              i++;
            }
            let tagName = "";
            for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
              tagName += xmlData[i];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "There is an unnecessary space between tag name and backward slash '</ ..'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
            }
            const result = readAttributeStr(xmlData, i);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
            }
            let attrStr = result.value;
            i = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, i));
              } else {
                const otg = tags.pop();
                if (tagName !== otg) {
                  return getErrorObject("InvalidTag", "Closing tag '" + otg + "' is expected inplace of '" + tagName + "'.", getLineNumberForPosition(xmlData, i));
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
              } else {
                tags.push(tagName);
              }
              tagFound = true;
            }
            for (i++; i < xmlData.length; i++) {
              if (xmlData[i] === "<") {
                if (xmlData[i + 1] === "!") {
                  i++;
                  i = readCommentAndCDATA(xmlData, i);
                  continue;
                } else if (xmlData[i + 1] === "?") {
                  i = readPI(xmlData, ++i);
                  if (i.err)
                    return i;
                } else {
                  break;
                }
              } else if (xmlData[i] === "&") {
                const afterAmp = validateAmpersand(xmlData, i);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
                i = afterAmp;
              }
            }
            if (xmlData[i] === "<") {
              i--;
            }
          }
        } else {
          if (xmlData[i] === " " || xmlData[i] === "	" || xmlData[i] === "\n" || xmlData[i] === "\r") {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags, null, 4).replace(/\r?\n/g, "") + "' found.", 1);
      }
      return true;
    };
    function readPI(xmlData, i) {
      var start = i;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] == "?" || xmlData[i] == " ") {
          var tagname = xmlData.substr(start, i - start);
          if (i > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
          } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
            i++;
            break;
          } else {
            continue;
          }
        }
      }
      return i;
    }
    function readCommentAndCDATA(xmlData, i) {
      if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
        for (i += 3; i < xmlData.length; i++) {
          if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
        let angleBracketsCount = 1;
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      }
      return i;
    }
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i];
          } else if (startChar !== xmlData[i]) {
            continue;
          } else {
            startChar = "";
          }
        } else if (xmlData[i] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i,
        tagClosed
      };
    }
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util2.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(attrStr, matches[i][0]));
        } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(attrStr, matches[i][0]));
        }
        const attrName = matches[i][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(attrStr, matches[i][0]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(attrStr, matches[i][0]));
        }
      }
      return true;
    }
    function validateNumberAmpersand(xmlData, i) {
      let re = /\d/;
      if (xmlData[i] === "x") {
        i++;
        re = /[\da-fA-F]/;
      }
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === ";")
          return i;
        if (!xmlData[i].match(re))
          break;
      }
      return -1;
    }
    function validateAmpersand(xmlData, i) {
      i++;
      if (xmlData[i] === ";")
        return -1;
      if (xmlData[i] === "#") {
        i++;
        return validateNumberAmpersand(xmlData, i);
      }
      let count = 0;
      for (; i < xmlData.length; i++, count++) {
        if (xmlData[i].match(/\w/) && count < 20)
          continue;
        if (xmlData[i] === ";")
          break;
        return -1;
      }
      return i;
    }
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber
        }
      };
    }
    function validateAttrName(attrName) {
      return util2.isName(attrName);
    }
    function validateTagName(tagname) {
      return util2.isName(tagname);
    }
    function getLineNumberForPosition(xmlData, index) {
      var lines = xmlData.substring(0, index).split(/\r?\n/);
      return lines.length;
    }
    function getPositionFromMatch(attrStr, match) {
      return attrStr.indexOf(match) + match.length;
    }
  }
});

// node_modules/fast-xml-parser/src/nimndata.js
var require_nimndata = __commonJS({
  "node_modules/fast-xml-parser/src/nimndata.js"(exports2) {
    "use strict";
    var char = function(a) {
      return String.fromCharCode(a);
    };
    var chars = {
      nilChar: char(176),
      missingChar: char(201),
      nilPremitive: char(175),
      missingPremitive: char(200),
      emptyChar: char(178),
      emptyValue: char(177),
      boundryChar: char(179),
      objStart: char(198),
      arrStart: char(204),
      arrayEnd: char(185)
    };
    var charsArr = [
      chars.nilChar,
      chars.nilPremitive,
      chars.missingChar,
      chars.missingPremitive,
      chars.boundryChar,
      chars.emptyChar,
      chars.emptyValue,
      chars.arrayEnd,
      chars.objStart,
      chars.arrStart
    ];
    var _e = function(node, e_schema, options) {
      if (typeof e_schema === "string") {
        if (node && node[0] && node[0].val !== void 0) {
          return getValue2(node[0].val, e_schema);
        } else {
          return getValue2(node, e_schema);
        }
      } else {
        const hasValidData = hasData(node);
        if (hasValidData === true) {
          let str = "";
          if (Array.isArray(e_schema)) {
            str += chars.arrStart;
            const itemSchema = e_schema[0];
            const arr_len = node.length;
            if (typeof itemSchema === "string") {
              for (let arr_i = 0; arr_i < arr_len; arr_i++) {
                const r = getValue2(node[arr_i].val, itemSchema);
                str = processValue(str, r);
              }
            } else {
              for (let arr_i = 0; arr_i < arr_len; arr_i++) {
                const r = _e(node[arr_i], itemSchema, options);
                str = processValue(str, r);
              }
            }
            str += chars.arrayEnd;
          } else {
            str += chars.objStart;
            const keys2 = Object.keys(e_schema);
            if (Array.isArray(node)) {
              node = node[0];
            }
            for (let i in keys2) {
              const key = keys2[i];
              let r;
              if (!options.ignoreAttributes && node.attrsMap && node.attrsMap[key]) {
                r = _e(node.attrsMap[key], e_schema[key], options);
              } else if (key === options.textNodeName) {
                r = _e(node.val, e_schema[key], options);
              } else {
                r = _e(node.child[key], e_schema[key], options);
              }
              str = processValue(str, r);
            }
          }
          return str;
        } else {
          return hasValidData;
        }
      }
    };
    var getValue2 = function(a) {
      switch (a) {
        case void 0:
          return chars.missingPremitive;
        case null:
          return chars.nilPremitive;
        case "":
          return chars.emptyValue;
        default:
          return a;
      }
    };
    var processValue = function(str, r) {
      if (!isAppChar(r[0]) && !isAppChar(str[str.length - 1])) {
        str += chars.boundryChar;
      }
      return str + r;
    };
    var isAppChar = function(ch) {
      return charsArr.indexOf(ch) !== -1;
    };
    function hasData(jObj) {
      if (jObj === void 0) {
        return chars.missingChar;
      } else if (jObj === null) {
        return chars.nilChar;
      } else if (jObj.child && Object.keys(jObj.child).length === 0 && (!jObj.attrsMap || Object.keys(jObj.attrsMap).length === 0)) {
        return chars.emptyChar;
      } else {
        return true;
      }
    }
    var x2j = require_xmlstr2xmlnode();
    var buildOptions = require_util2().buildOptions;
    var convert2nimn = function(node, e_schema, options) {
      options = buildOptions(options, x2j.defaultOptions, x2j.props);
      return _e(node, e_schema, options);
    };
    exports2.convert2nimn = convert2nimn;
  }
});

// node_modules/fast-xml-parser/src/node2json_str.js
var require_node2json_str = __commonJS({
  "node_modules/fast-xml-parser/src/node2json_str.js"(exports2) {
    "use strict";
    var util2 = require_util2();
    var buildOptions = require_util2().buildOptions;
    var x2j = require_xmlstr2xmlnode();
    var convertToJsonString = function(node, options) {
      options = buildOptions(options, x2j.defaultOptions, x2j.props);
      options.indentBy = options.indentBy || "";
      return _cToJsonStr(node, options, 0);
    };
    var _cToJsonStr = function(node, options, level) {
      let jObj = "{";
      const keys2 = Object.keys(node.child);
      for (let index = 0; index < keys2.length; index++) {
        var tagname = keys2[index];
        if (node.child[tagname] && node.child[tagname].length > 1) {
          jObj += '"' + tagname + '" : [ ';
          for (var tag in node.child[tagname]) {
            jObj += _cToJsonStr(node.child[tagname][tag], options) + " , ";
          }
          jObj = jObj.substr(0, jObj.length - 1) + " ] ";
        } else {
          jObj += '"' + tagname + '" : ' + _cToJsonStr(node.child[tagname][0], options) + " ,";
        }
      }
      util2.merge(jObj, node.attrsMap);
      if (util2.isEmptyObject(jObj)) {
        return util2.isExist(node.val) ? node.val : "";
      } else {
        if (util2.isExist(node.val)) {
          if (!(typeof node.val === "string" && (node.val === "" || node.val === options.cdataPositionChar))) {
            jObj += '"' + options.textNodeName + '" : ' + stringval(node.val);
          }
        }
      }
      if (jObj[jObj.length - 1] === ",") {
        jObj = jObj.substr(0, jObj.length - 2);
      }
      return jObj + "}";
    };
    function stringval(v) {
      if (v === true || v === false || !isNaN(v)) {
        return v;
      } else {
        return '"' + v + '"';
      }
    }
    exports2.convertToJsonString = convertToJsonString;
  }
});

// node_modules/fast-xml-parser/src/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/fast-xml-parser/src/json2xml.js"(exports2, module2) {
    "use strict";
    var buildOptions = require_util2().buildOptions;
    var defaultOptions2 = {
      attributeNamePrefix: "@_",
      attrNodeName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataTagName: false,
      cdataPositionChar: "\\c",
      format: false,
      indentBy: "  ",
      supressEmptyNode: false,
      tagValueProcessor: function(a) {
        return a;
      },
      attrValueProcessor: function(a) {
        return a;
      }
    };
    var props = [
      "attributeNamePrefix",
      "attrNodeName",
      "textNodeName",
      "ignoreAttributes",
      "cdataTagName",
      "cdataPositionChar",
      "format",
      "indentBy",
      "supressEmptyNode",
      "tagValueProcessor",
      "attrValueProcessor"
    ];
    function Parser(options) {
      this.options = buildOptions(options, defaultOptions2, props);
      if (this.options.ignoreAttributes || this.options.attrNodeName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      if (this.options.cdataTagName) {
        this.isCDATA = isCDATA;
      } else {
        this.isCDATA = function() {
          return false;
        };
      }
      this.replaceCDATAstr = replaceCDATAstr;
      this.replaceCDATAarr = replaceCDATAarr;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
      if (this.options.supressEmptyNode) {
        this.buildTextNode = buildEmptyTextNode;
        this.buildObjNode = buildEmptyObjNode;
      } else {
        this.buildTextNode = buildTextValNode;
        this.buildObjNode = buildObjectNode;
      }
      this.buildTextValNode = buildTextValNode;
      this.buildObjectNode = buildObjectNode;
    }
    Parser.prototype.parse = function(jObj) {
      return this.j2x(jObj, 0).val;
    };
    Parser.prototype.j2x = function(jObj, level) {
      let attrStr = "";
      let val = "";
      const keys2 = Object.keys(jObj);
      const len = keys2.length;
      for (let i = 0; i < len; i++) {
        const key = keys2[i];
        if (typeof jObj[key] === "undefined") {
        } else if (jObj[key] === null) {
          val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        } else if (jObj[key] instanceof Date) {
          val += this.buildTextNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr) {
            attrStr += " " + attr + '="' + this.options.attrValueProcessor("" + jObj[key]) + '"';
          } else if (this.isCDATA(key)) {
            if (jObj[this.options.textNodeName]) {
              val += this.replaceCDATAstr(jObj[this.options.textNodeName], jObj[key]);
            } else {
              val += this.replaceCDATAstr("", jObj[key]);
            }
          } else {
            if (key === this.options.textNodeName) {
              if (jObj[this.options.cdataTagName]) {
              } else {
                val += this.options.tagValueProcessor("" + jObj[key]);
              }
            } else {
              val += this.buildTextNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          if (this.isCDATA(key)) {
            val += this.indentate(level);
            if (jObj[this.options.textNodeName]) {
              val += this.replaceCDATAarr(jObj[this.options.textNodeName], jObj[key]);
            } else {
              val += this.replaceCDATAarr("", jObj[key]);
            }
          } else {
            const arrLen = jObj[key].length;
            for (let j = 0; j < arrLen; j++) {
              const item = jObj[key][j];
              if (typeof item === "undefined") {
              } else if (item === null) {
                val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
              } else if (typeof item === "object") {
                const result = this.j2x(item, level + 1);
                val += this.buildObjNode(result.val, key, result.attrStr, level);
              } else {
                val += this.buildTextNode(item, key, "", level);
              }
            }
          }
        } else {
          if (this.options.attrNodeName && key === this.options.attrNodeName) {
            const Ks = Object.keys(jObj[key]);
            const L = Ks.length;
            for (let j = 0; j < L; j++) {
              attrStr += " " + Ks[j] + '="' + this.options.attrValueProcessor("" + jObj[key][Ks[j]]) + '"';
            }
          } else {
            const result = this.j2x(jObj[key], level + 1);
            val += this.buildObjNode(result.val, key, result.attrStr, level);
          }
        }
      }
      return { attrStr, val };
    };
    function replaceCDATAstr(str, cdata) {
      str = this.options.tagValueProcessor("" + str);
      if (this.options.cdataPositionChar === "" || str === "") {
        return str + "<![CDATA[" + cdata + "]]" + this.tagEndChar;
      } else {
        return str.replace(this.options.cdataPositionChar, "<![CDATA[" + cdata + "]]" + this.tagEndChar);
      }
    }
    function replaceCDATAarr(str, cdata) {
      str = this.options.tagValueProcessor("" + str);
      if (this.options.cdataPositionChar === "" || str === "") {
        return str + "<![CDATA[" + cdata.join("]]><![CDATA[") + "]]" + this.tagEndChar;
      } else {
        for (let v in cdata) {
          str = str.replace(this.options.cdataPositionChar, "<![CDATA[" + cdata[v] + "]]>");
        }
        return str + this.newLine;
      }
    }
    function buildObjectNode(val, key, attrStr, level) {
      if (attrStr && !val.includes("<")) {
        return this.indentate(level) + "<" + key + attrStr + ">" + val + "</" + key + this.tagEndChar;
      } else {
        return this.indentate(level) + "<" + key + attrStr + this.tagEndChar + val + this.indentate(level) + "</" + key + this.tagEndChar;
      }
    }
    function buildEmptyObjNode(val, key, attrStr, level) {
      if (val !== "") {
        return this.buildObjectNode(val, key, attrStr, level);
      } else {
        return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
      }
    }
    function buildTextValNode(val, key, attrStr, level) {
      return this.indentate(level) + "<" + key + attrStr + ">" + this.options.tagValueProcessor(val) + "</" + key + this.tagEndChar;
    }
    function buildEmptyTextNode(val, key, attrStr, level) {
      if (val !== "") {
        return this.buildTextValNode(val, key, attrStr, level);
      } else {
        return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
      }
    }
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix)) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    function isCDATA(name) {
      return name === this.options.cdataTagName;
    }
    module2.exports = Parser;
  }
});

// node_modules/fast-xml-parser/src/parser.js
var require_parser = __commonJS({
  "node_modules/fast-xml-parser/src/parser.js"(exports2) {
    "use strict";
    var nodeToJson = require_node2json();
    var xmlToNodeobj = require_xmlstr2xmlnode();
    var x2xmlnode = require_xmlstr2xmlnode();
    var buildOptions = require_util2().buildOptions;
    var validator = require_validator();
    exports2.parse = function(xmlData, options, validationOption) {
      if (validationOption) {
        if (validationOption === true)
          validationOption = {};
        const result = validator.validate(xmlData, validationOption);
        if (result !== true) {
          throw Error(result.err.msg);
        }
      }
      options = buildOptions(options, x2xmlnode.defaultOptions, x2xmlnode.props);
      const traversableObj = xmlToNodeobj.getTraversalObj(xmlData, options);
      return nodeToJson.convertToJson(traversableObj, options);
    };
    exports2.convertTonimn = require_nimndata().convert2nimn;
    exports2.getTraversalObj = xmlToNodeobj.getTraversalObj;
    exports2.convertToJson = nodeToJson.convertToJson;
    exports2.convertToJsonString = require_node2json_str().convertToJsonString;
    exports2.validate = validator.validate;
    exports2.j2xParser = require_json2xml();
    exports2.parseToNimn = function(xmlData, schema, options) {
      return exports2.convertTonimn(exports2.getTraversalObj(xmlData, options), schema, options);
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(src_exports);

// node_modules/coc-helper/lib/esm/index.js
var import_coc14 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/events.js
var import_coc7 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/VimModule.js
var import_coc5 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/notifier.js
var import_coc4 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/util/collection.js
var compactI = (arr) => arr.filter((it) => it !== void 0 && it !== null);

// node_modules/coc-helper/lib/esm/util/config.js
var import_coc2 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/util/text.js
var import_coc = require("coc.nvim");

// node_modules/coc-helper/lib/esm/util/env.js
var isWindows = process.platform === "win32";
var isMacintosh = process.platform === "darwin";
var isLinux = process.platform === "linux";
var isTest = process.env.NODE_ENV === "test";

// node_modules/coc-helper/lib/esm/util/text.js
async function displayWidth(content) {
  return await import_coc.workspace.nvim.call("strdisplaywidth", [content]);
}

// node_modules/coc-helper/lib/esm/util/log.js
var import_coc3 = require("coc.nvim");
var import_util = __toESM(require("util"));
var levelList = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "off"
];
var levelErrorNum = levelList.indexOf("error");
function formatDate(date) {
  return `${date.toLocaleString()} ${date.getMilliseconds().toString().padStart(3, "0")}`;
}
var HelperLogger = class {
  constructor(channelName) {
    this.channelName = channelName;
    this.timeMarkers = /* @__PURE__ */ new Map();
    this.levelStatus = "trace";
    this.levelNumber = levelList.indexOf(this.levelStatus);
    this.appendLine = (line) => {
      this.outputChannel.appendLine(line);
    };
    this.log = (levelName, data) => {
      var _a, _b;
      const levelNum = levelList[levelName];
      if (levelNum < this.levelNumber) {
        return;
      }
      const prefix = `[${formatDate(new Date())}] [${levelName}]: `;
      if (data instanceof Error) {
        this.appendLine(`${prefix}${(_a = data.stack) !== null && _a !== void 0 ? _a : data.toString()}`);
        void import_coc3.window.showErrorMessage(data.message);
        if (isTest) {
          console.error((_b = data.stack) !== null && _b !== void 0 ? _b : data.toString());
        }
        return;
      }
      this.appendLine(`${prefix}${data}`);
      if (levelNum > levelErrorNum) {
        void import_coc3.window.showErrorMessage(data);
        if (isTest) {
          console.error(data);
        }
      }
    };
    this.trace = (line) => {
      this.log("trace", line);
    };
    this.debug = (line) => {
      this.log("debug", line);
    };
    this.info = (line) => {
      this.log("info", line);
    };
    this.warn = (line) => {
      this.log("warn", line);
    };
    this.error = (data) => {
      if (!(data instanceof Error)) {
        data = new Error(data);
      }
      this.log("error", data);
    };
    this.fatal = (data) => {
      this.log("fatal", data);
    };
  }
  set level(level) {
    this.levelStatus = level;
    this.levelNumber = levelList[level];
  }
  get level() {
    return this.levelStatus;
  }
  dispose() {
    var _a;
    (_a = this.outputChannel_) === null || _a === void 0 ? void 0 : _a.dispose();
  }
  get outputChannel() {
    if (!this.outputChannel_) {
      this.outputChannel_ = import_coc3.window.createOutputChannel(this.channelName);
    }
    return this.outputChannel_;
  }
  time(label = "default") {
    this.timeMarkers.set(label, new Date().valueOf());
  }
  timeElapsed(label = "default") {
    const time = this.timeMarkers.get(label);
    if (time !== void 0) {
      return new Date().valueOf() - time;
    }
  }
  timeLog(label = "default") {
    const time = this.timeElapsed(label);
    if (time !== void 0) {
      this.appendLine(`${label}: ${time} ms`);
    }
  }
  measureTime(task) {
    const time = new Date().valueOf();
    const result = task();
    if (!("then" in result)) {
      return [result, new Date().valueOf() - time];
    }
    return result.then((r) => {
      return [r, new Date().valueOf() - time];
    });
  }
  measureTask(task, label = "default", level = "info") {
    const response = this.measureTime(task);
    if (!("then" in response)) {
      const [result, time] = response;
      this.log(level, `[measureTask] ${label}: ${time} ms`);
      return result;
    }
    return response.then(([result, time]) => {
      this.log(level, `${label}: ${time} ms`);
      return result;
    });
  }
  asyncCatch(fn) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (e) {
        this.error(e);
      }
    };
  }
  prettyPrint(...data) {
    this.info(prettyObject(...data));
    void import_coc3.window.showErrorMessage(`[${formatDate(new Date())}] ${prettyObject(...data)}`);
  }
};
var helperLogger = new HelperLogger("coc-helper");
function prettyObject(...data) {
  return data.map((d) => import_util.default.inspect(d)).join(" ");
}

// node_modules/coc-helper/lib/esm/_package.json
var package_default = {
  name: "coc-helper",
  version: "0.15.2",
  description: "Helpers for coc.nvim",
  module: "lib/esm/index.js",
  main: "lib/cjs/index.js",
  homepage: "https://github.com/weirongxu/coc-helper",
  repository: "git@github.com:weirongxu/coc-helper.git",
  author: "Weirong Xu <weirongxu.raidou@gmail.com>",
  license: "MIT",
  files: [
    "lib",
    "tests",
    "jest.config.js",
    "JestHelper.js",
    "JestHelper.d.ts"
  ],
  scripts: {
    clean: "rimraf lib",
    "copy:pkg": "cpy --rename=_package.json package.json src/",
    "build:esm": "tsc -p ./tsconfig.prod.json --module es2020 --outDir lib/esm",
    "build:cjs": "tsc -p ./tsconfig.prod.json --module commonjs --outDir lib/cjs",
    build: "npm-run-all clean copy:pkg build:esm build:cjs",
    lint: "eslint src --ext ts",
    "setup:test-env": "node ./tests/setup.js",
    prepare: "run-s clean setup:test-env build",
    unittest: "jest --runInBand --detectOpenHandles --forceExit",
    test: "npm-run-all copy:pkg lint unittest"
  },
  engines: {
    coc: "^0.0.77"
  },
  activationEvents: [
    "*"
  ],
  prettier: {
    singleQuote: true,
    printWidth: 80,
    semi: true,
    trailingComma: "all"
  },
  peerDependencies: {
    "coc.nvim": "*"
  },
  devDependencies: {
    "@chemzqm/neovim": "^5.7.10",
    "@raidou/eslint-config-base": "^1.5.0",
    "@types/eslint": "^8.4.6",
    "@types/jest": "^29.0.2",
    "@types/node": "^18.7.18",
    "@types/rimraf": "^3.0.2",
    "@types/uuid": "^8.3.4",
    "coc.nvim": "0.0.82",
    "cpy-cli": "^4.2.0",
    eslint: "^8.23.1",
    jest: "^29.0.3",
    log4js: "^6.6.1",
    "npm-run-all": "^4.1.5",
    prettier: "^2.7.1",
    "ts-jest": "^29.0.1",
    "type-fest": "^2.19.0",
    typescript: "^4.8.3"
  },
  dependencies: {
    rimraf: "^3.0.2",
    uuid: "^9.0.0"
  }
};

// node_modules/coc-helper/lib/esm/util/version.js
var version = package_default.version;
var versionName = version.replace(/[.-]/g, "_");

// node_modules/coc-helper/lib/esm/notifier.js
var Notifier = class {
  constructor(notify) {
    this.notifyFns = [];
    this.notifyFns.push(notify);
  }
  static async run(notifier) {
    if (!notifier) {
      return;
    }
    if ("then" in notifier) {
      const awaitedNotifier = await notifier;
      if (awaitedNotifier) {
        return awaitedNotifier.run();
      }
    } else {
      return notifier.run();
    }
  }
  static notifyAll(lazyNotifies) {
    for (const n of lazyNotifies) {
      if (n) {
        n.notify();
      }
    }
  }
  static async runAll(notifierPromises) {
    const notifiers = await Promise.all(notifierPromises);
    import_coc4.workspace.nvim.pauseNotification();
    this.notifyAll(notifiers);
    return import_coc4.workspace.nvim.resumeNotification();
  }
  static combine(notifiers) {
    const compactedNotifiers = compactI(notifiers);
    if (compactedNotifiers.length < 1) {
      return Notifier.noop();
    }
    if (compactedNotifiers.length === 1) {
      return compactedNotifiers[0];
    }
    return compactedNotifiers.reduce((ret, cur) => ret.concat(cur), Notifier.noop());
  }
  static noop() {
    return this.create(() => {
    });
  }
  static create(notify) {
    return new Notifier(notify);
  }
  async run() {
    return Notifier.runAll([this]);
  }
  notify() {
    for (const fn of this.notifyFns) {
      fn();
    }
  }
  concat(notifier) {
    this.notifyFns.push(...notifier.notifyFns);
    return this;
  }
};

// node_modules/coc-helper/lib/esm/util/module.js
var globalModuleIdKey = "__coc_helper_module_max_id";
function getModuleId(key) {
  const globalKey2 = `${globalModuleIdKey}_${key}`;
  if (!(globalKey2 in global)) {
    global[globalKey2] = 0;
  }
  global[globalKey2] += 1;
  return global[globalKey2];
}

// node_modules/coc-helper/lib/esm/VimModule.js
var mid = getModuleId("VimModule");
var globalKey = `coc_helper_module_m${mid}_v${versionName}`;
var globalVariable = `g:${globalKey}`;
var callFunc = `CocHelperCallFn_m${mid}_v${versionName}`;
var declareVar = `CocHelperCallVar_m${mid}_v${versionName}`;
function filterLineCont(content) {
  return content.replace(/\n\s*\\/g, "");
}
var VimModule = class {
  constructor(moduleKey) {
    this.moduleKey = moduleKey;
  }
  static async init(context) {
    this.inited = true;
    await import_coc5.workspace.nvim.call("execute", `
        if !exists('${globalVariable}')
          let ${globalVariable} = {}
        endif

        function! ${callFunc}(module_key, method_name, args)
          try
            return call(${globalVariable}[a:module_key][a:method_name], a:args)
          catch
            let ex = v:exception
            let msg = printf('error when call %s.%s.%s, args: [%s]', '${globalVariable}', a:module_key, a:method_name, join(a:args, ','))
            echom msg
            echom ex
            throw msg . ' ' . ex
          endtry
        endfunction

        function! ${declareVar}(module_key, var_name, expression)
          try
            let ${globalVariable}[a:module_key][a:var_name] = eval(a:expression)
          catch
            let ex = v:exception
            let msg = printf('error when declare %s.%s.%s, expression: %s', '${globalVariable}', a:module_key, a:var_name, a:expression)
            echom msg
            echom ex
            throw msg . ' ' . ex
          endtry
        endfunction
      `);
    const queue = [...this.initQueue];
    while (queue.length) {
      const it = queue.shift();
      try {
        await it.fn(context);
      } catch (error) {
        helperLogger.error(error);
      }
      if (this.initAfterQueue.length) {
        queue.push(...this.initAfterQueue);
        this.initAfterQueue = [];
      }
    }
  }
  static registerInit(description, fn) {
    if (!this.inited) {
      this.initQueue.push({ description, fn });
    } else {
      this.initAfterQueue.push({ description, fn });
    }
  }
  static create(moduleName, cb) {
    const id = getModuleId("VimModule.module");
    const moduleKey = `${id}_${moduleName}`;
    const vMod = new VimModule(moduleKey);
    let mod = void 0;
    function initedMod() {
      if (!mod) {
        mod = cb(vMod);
      }
      return mod;
    }
    VimModule.registerInit(`module ${moduleKey}`, async () => {
      await import_coc5.workspace.nvim.call("execute", `
          if !exists('${globalVariable}.${moduleKey}')
            let ${globalVariable}.${moduleKey} = {}
          endif
        `);
      initedMod();
    });
    return new Proxy({}, {
      get(_o, key) {
        return Reflect.get(initedMod(), key);
      },
      has(_o, key) {
        return key in initedMod();
      },
      ownKeys() {
        return Object.keys(initedMod());
      }
    });
  }
  registerInit(description, fn) {
    if (typeof description === "string") {
      return VimModule.registerInit(description, fn);
    } else {
      return this.registerInit("", description);
    }
  }
  fn(fnName, getContent) {
    const { nvim } = import_coc5.workspace;
    const name = `${globalVariable}.${this.moduleKey}.${fnName}`;
    const content = getContent({ name });
    this.registerInit(`fn ${name}`, async () => {
      helperLogger.debug(`declare fn ${name}`);
      await nvim.call("execute", [filterLineCont(content)]);
    });
    return {
      name,
      inlineCall: (argsExpression = "") => `${callFunc}('${this.moduleKey}', '${fnName}', [${argsExpression}])`,
      call: (...args) => {
        helperLogger.debug(`call ${name}`);
        return nvim.call(callFunc, [
          this.moduleKey,
          fnName,
          args
        ]);
      },
      callNotify: (...args) => {
        helperLogger.debug(`callNotify ${name}`);
        return nvim.call(callFunc, [this.moduleKey, fnName, args], true);
      },
      callNotifier: (...args) => {
        helperLogger.debug(`callNotifier ${name}`);
        return Notifier.create(() => {
          nvim.call(callFunc, [this.moduleKey, fnName, args], true);
        });
      }
    };
  }
  var(varName, expression) {
    const { nvim } = import_coc5.workspace;
    const name = `${globalVariable}.${this.moduleKey}.${varName}`;
    this.registerInit(`var ${name}`, async () => {
      helperLogger.debug(`declare var ${name}`);
      await nvim.call(declareVar, [
        this.moduleKey,
        varName,
        filterLineCont(expression)
      ]);
    });
    return {
      name,
      inline: name,
      get: () => {
        return nvim.eval(name);
      },
      set: async (expression2) => {
        await nvim.call(declareVar, [
          this.moduleKey,
          varName,
          filterLineCont(expression2)
        ]);
      },
      setNotify: (expression2) => {
        nvim.call(declareVar, [this.moduleKey, varName, filterLineCont(expression2)], true);
      },
      setNotifier: (expression2) => {
        return Notifier.create(() => {
          nvim.call(declareVar, [this.moduleKey, varName, filterLineCont(expression2)], true);
        });
      }
    };
  }
};
VimModule.inited = false;
VimModule.initQueue = [];
VimModule.initAfterQueue = [];

// node_modules/coc-helper/lib/esm/modules/util.js
var import_coc6 = require("coc.nvim");
var utilModule = VimModule.create("util", (m) => {
  const isNvim = import_coc6.workspace.isNvim;
  return {
    globalCursorPosition: m.fn("global_cursor_position", ({ name }) => `
        function! ${name}()
          let nr = winnr()
          let [row, col] = win_screenpos(nr)
          return [row + winline() - 2, col + wincol() - 2]
        endfunction
      `),
    isFloat: m.fn("is_float", ({ name }) => isNvim ? `
          function! ${name}(winnr) abort
            if !exists('*nvim_win_get_config')
              return v:false
            endif
            let winid = win_getid(a:winnr)
            return nvim_win_get_config(winid)['relative'] != ''
          endfunction
        ` : `
          function! ${name}(winnr) abort
            return v:false
          endfunction
        `),
    closeWinByBufnr: m.fn("close_win_by_bufnr", ({ name }) => `
        if exists('*nvim_win_close')
          function! ${name}(bufnrs) abort
            for bufnr in a:bufnrs
              try
                let winid = bufwinid(bufnr)
                if winid >= 0
                  call nvim_win_close(winid, v:true)
                endif
              catch
              endtry
            endfor
          endfunction
        else
          function! ${name}(bufnrs) abort
            for bufnr in a:bufnrs
              try
                let winnr = bufwinnr(bufnr)
                if winnr >= 0
                  execute winnr . 'wincmd c'
                endif
              catch
              endtry
            endfor
          endfunction
        endif
      `),
    runCocCmd: m.fn("run_coc_cmd", ({ name }) => `
      function! ${name}(name, ...) abort
        return call('CocAction', extend(['runCommand', a:name], a:000))
      endfunction
    `),
    runCocCmdAsync: m.fn("run_coc_cmd_async", ({ name }) => `
      function! ${name}(name, ...) abort
        return call('CocActionAsync', extend(['runCommand', a:name], a:000))
      endfunction
    `)
  };
});

// node_modules/coc-helper/lib/esm/events.js
var mid2 = getModuleId("events");
var uname = `m${mid2}_v${versionName}`;
var HelperEventEmitter = class {
  constructor(helperLogger2, concurrent = false) {
    this.helperLogger = helperLogger2;
    this.concurrent = concurrent;
    this.listenersMap = /* @__PURE__ */ new Map();
  }
  listeners(event) {
    if (!this.listenersMap.has(event)) {
      const listeners = [];
      this.listenersMap.set(event, listeners);
      return listeners;
    }
    return this.listenersMap.get(event);
  }
  once(event, listener, disposables) {
    this.listeners(event).push(async (...args) => {
      const result = await listener(...args);
      disposable.dispose();
      return result;
    });
    const disposable = import_coc7.Disposable.create(() => this.off(event, listener));
    if (disposables) {
      disposables.push(disposable);
    }
    return disposable;
  }
  on(event, listener, disposables) {
    this.listeners(event).push(listener);
    const disposable = import_coc7.Disposable.create(() => this.off(event, listener));
    if (disposables) {
      disposables.push(disposable);
    }
    return disposable;
  }
  off(event, listener) {
    if (typeof listener.cancel === "function") {
      listener.cancel();
    }
    const listeners = this.listeners(event);
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }
  async fire(event, ...args) {
    if (this.concurrent) {
      await Promise.all(this.listeners(event).map(async (listener) => {
        try {
          await listener(...args);
        } catch (e) {
          this.helperLogger.error(e);
        }
      }));
    } else {
      for (const listener of this.listeners(event)) {
        try {
          await listener(...args);
        } catch (e) {
          this.helperLogger.error(e);
        }
      }
    }
  }
};
var HelperVimEvents = class {
  constructor(vimEvents, helperLogger2, options = {}) {
    var _a;
    this.vimEvents = vimEvents;
    this.helperLogger = helperLogger2;
    this.options = options;
    this.id = getModuleId("events.id");
    this.augroupName = `CocHelperInternal_${uname}_${options.name ? `${options.name}_` : ""}${this.id}`;
    this.commandName = `coc-helper.internal.didVimEvent_${uname}_${options.name ? `${options.name}_` : ""}${this.id}`;
    this.events = new HelperEventEmitter(this.helperLogger, (_a = options.concurrent) !== null && _a !== void 0 ? _a : false);
  }
  async register(context) {
    await eventsModule.activate.call(this.augroupName, this.commandName, Object.entries(this.vimEvents).map(([key, e]) => Object.assign({ event: key }, e)));
    context.subscriptions.push(import_coc7.Disposable.create(() => {
      eventsModule.deactivate.call(this.augroupName).catch(this.helperLogger.error);
    }));
    context.subscriptions.push(import_coc7.commands.registerCommand(this.commandName, helperLogger.asyncCatch((event, ...args) => this.events.fire(event, ...args)), void 0, true));
  }
};
var helperVimEvents = new HelperVimEvents({
  BufDelete: {
    eventExpr: "BufDelete *",
    argExprs: ["+expand('<abuf>')"]
  },
  BufWipeout: {
    eventExpr: "BufWipeout *",
    argExprs: ["+expand('<abuf>')"]
  }
}, helperLogger, {
  name: "coc_helper"
});
var helperEvents = helperVimEvents.events;
var eventsModule = VimModule.create("events", (m) => {
  const activate2 = m.fn("activate", ({ name }) => `
      function! ${name}(augroup_name, autocmd_events) abort
        execute 'augroup ' . a:augroup_name
          autocmd!
          for autocmd_event in a:autocmd_events
            execute autocmd_event
          endfor
        augroup END
      endfunction
    `);
  function getActivateEvents(commandName, activateEvents) {
    return activateEvents.map((e) => {
      var _a;
      const args = `${[
        `'${commandName}'`,
        `'${e.event}'`,
        ...(_a = e.argExprs) !== null && _a !== void 0 ? _a : []
      ].join(", ")}`;
      return `autocmd ${e.eventExpr} call ${e.async === false ? utilModule.runCocCmd.inlineCall(args) : utilModule.runCocCmdAsync.inlineCall(args)}`;
    });
  }
  return {
    activate: {
      call: (augroupName, commandName, activateEvents) => activate2.call(augroupName, getActivateEvents(commandName, activateEvents)),
      callNotify: (augroupName, commandName, activateEvents) => activate2.callNotify(augroupName, getActivateEvents(commandName, activateEvents)),
      callNotifier: (augroupName, commandName, activateEvents) => activate2.callNotifier(augroupName, getActivateEvents(commandName, activateEvents))
    },
    deactivate: m.fn("deactivate", ({ name }) => `
        function! ${name}(augroup_name) abort
          execute 'augroup ' . a:augroup_name
            autocmd!
          augroup END
        endfunction
      `),
    doAutocmd: m.fn("do_autocmd", ({ name }) => `
        function! ${name}(name) abort
          if exists('#User#'.a:name)
            exe 'doautocmd <nomodeline> User '.a:name
          endif
        endfunction
      `)
  };
});

// node_modules/coc-helper/lib/esm/FloatingWindow.js
var import_coc11 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/modules/floating.js
var import_coc9 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/modules/buf.js
var import_coc8 = require("coc.nvim");
var bufModule = VimModule.create("buf", (m) => {
  const isNvim = import_coc8.workspace.isNvim;
  const createByName = m.fn("create_by_name", ({ name }) => `
      function! ${name}(name) abort
        return bufadd(a:name)
      endfunction
    `);
  return {
    createByName,
    create: m.fn("create", ({ name }) => isNvim ? `
          function! ${name}(...) abort
            let name = get(a:000, 0, '')
            if name is ''
              return nvim_create_buf(v:false, v:true)
            else
              return ${createByName.inlineCall("name")}
            endif
          endfunction
        ` : `
          function! ${name}(...) abort
            let name = get(a:000, 0, '')
            return ${createByName.inlineCall("name")}
          endfunction
        `)
  };
});

// node_modules/coc-helper/lib/esm/modules/floating.js
var floatingModule = VimModule.create("float", (m) => {
  const isNvim = import_coc9.workspace.isNvim;
  const initExecute = m.fn("init_execute", ({ name }) => `
      function! ${name}(ctx, inited_execute) abort
        execute a:inited_execute
      endfunction
    `);
  const openWin = m.fn("open_win", ({ name }) => isNvim ? `
        function! ${name}(bufnr, focus, win_config, win_hl, inited_execute) abort
          noau let winid = nvim_open_win(a:bufnr, a:focus, a:win_config)
          if !empty(a:win_hl)
            call nvim_win_set_option(winid, 'winhl', a:win_hl)
          endif
          if !empty(a:inited_execute)
            call ${initExecute.inlineCall("{'bufnr': a:bufnr, 'winid': winid}, a:inited_execute")}
          endif
          return winid
        endfunction
      ` : `
        function! ${name}(bufnr, focus, win_config, win_hl, inited_execute) abort
          let winid = popup_create(a:bufnr, a:win_config)
          call ${initExecute.inlineCall("{'bufnr': a:bufnr, 'winid': winid}, a:inited_execute")}

          return winid
        endfunction
      `);
  return {
    create: m.fn("create", ({ name }) => isNvim ? `
            function! ${name}(name, inited_execute, has_border_buf, border_inited_execute) abort
              let bufnr = ${bufModule.create.inlineCall("a:name")}
              call ${initExecute.inlineCall("{'bufnr': bufnr}, a:inited_execute")}

              let border_bufnr = v:null
              if a:has_border_buf
                let border_bufnr = nvim_create_buf(v:false, v:true)
                call ${initExecute.inlineCall("{'bufnr': border_bufnr}, a:border_inited_execute")}
              endif
              return [bufnr, border_bufnr]
            endfunction
          ` : `
            function! ${name}(name, inited_execute, has_border_buf, border_inited_execute) abort
              let bufnr = ${bufModule.create.inlineCall("a:name")}
              call ${initExecute.inlineCall("{'bufnr': bufnr}, a:inited_execute")}
              return [bufnr, v:null]
            endfunction
          `),
    open: m.fn("open", ({ name }) => `
        function! ${name}(bufnr, win_config, inited_execute, border_bufnr, border_win_config, border_inited_execute, focus, win_hl) abort
          let winid = ${openWin.inlineCall("a:bufnr, a:focus, a:win_config, a:win_hl, a:inited_execute")}
          call setbufvar(a:bufnr, 'coc_helper_winid', winid)

          if a:border_bufnr
            let border_winid = ${openWin.inlineCall("a:border_bufnr, v:false, a:border_win_config, a:win_hl, a:border_inited_execute")}
            call setbufvar(a:bufnr, 'coc_helper_border_winid', border_winid)
          endif
        endfunction
      `),
    resume: m.fn("resume", ({ name }) => `
        function! ${name}(bufnr, win_config, border_bufnr, border_win_config, focus, win_hl) abort
          let winid = ${openWin.inlineCall("a:bufnr, a:focus, a:win_config, a:win_hl, ''")}
          call setbufvar(a:bufnr, 'coc_helper_winid', winid)

          if a:border_bufnr
            let border_winid = ${openWin.inlineCall("border_bufnr, v:false, a:border_win_config, a:win_hl, ''")}
            call setbufvar(a:bufnr, 'coc_helper_border_winid', border_winid)
          endif
        endfunction
      `),
    update: m.fn("update", ({ name }) => isNvim ? `
          function! ${name}(bufnr, win_config, border_bufnr, border_win_config, win_hl) abort
            let winid = getbufvar(a:bufnr, 'coc_helper_winid', v:null)
            if !winid
              return
            endif
            call nvim_win_set_config(winid, a:win_config)
            if !empty(a:win_hl)
              call nvim_win_set_option(winid, 'winhl', a:win_hl)
            endif
            if has('nvim')
              redraw!
            endif

            if a:border_bufnr
              let border_winid = getbufvar(a:bufnr, 'coc_helper_border_winid', v:null)
              if border_winid
                call nvim_win_set_config(border_winid, a:border_win_config)
                if !empty(a:win_hl)
                  call nvim_win_set_option(border_winid, 'winhl', a:win_hl)
                endif
                if has('nvim')
                  redraw!
                endif
              endif
            endif
          endfunction
        ` : `
          function! ${name}(bufnr, win_config, border_bufnr, border_win_config, win_hl) abort
            let winid = getbufvar(a:bufnr, 'coc_helper_winid', v:null)
            if !winid
              return
            endif
            call popup_setoptions(winid, a:win_config)
          endfunction
        `),
    winid: m.fn("winid", ({ name }) => `
        function! ${name}(bufnr) abort
          let id = getbufvar(a:bufnr, 'coc_helper_winid', v:null)
          let nr = win_id2win(id)
          return nr is 0 ? v:null : id
        endfunction
      `),
    borderWinid: m.fn("border_winid", ({ name }) => `
        function! ${name}(bufnr) abort
          return getbufvar(a:bufnr, 'coc_helper_border_winid', v:null)
        endfunction
      `),
    close: m.fn("close", ({ name }) => isNvim ? `
            function! ${name}(bufnr) abort
              let winid = getbufvar(a:bufnr, 'coc_helper_winid', v:null)
              let border_winid = getbufvar(a:bufnr, 'coc_helper_border_winid', v:null)
              try
                if winid
                  call nvim_win_close(winid, v:true)
                endif
                if border_winid
                  call nvim_win_close(border_winid, v:true)
                endif
              catch
              endtry
            endfunction
          ` : `
            function! ${name}(bufnr) abort
              let winid = getbufvar(a:bufnr, 'coc_helper_winid', v:null)
              try
                if winid
                  call popup_close(winid)
                endif
              catch
              endtry
            endfunction
          `)
  };
});

// node_modules/coc-helper/lib/esm/FloatingUtil.js
var import_coc10 = require("coc.nvim");
var defaultBorderChars = ["\u2500", "\u2502", "\u2500", "\u2502", "\u250C", "\u2510", "\u2518", "\u2514"];
var defaultWinHl = "CocHelperNormalFloat";
var defaultWinHlNC = "CocHelperNormalFloatNC";
var defaultBorderWinHl = "CocHelperNormalFloatBorder";
var FloatingUtil = class {
  constructor(srcId) {
    this.srcId = srcId;
  }
  async createContext(options) {
    var _a, _b;
    return (_a = options.context) !== null && _a !== void 0 ? _a : {
      lines: import_coc10.workspace.env.lines,
      columns: import_coc10.workspace.env.columns - import_coc10.workspace.env.cmdheight - 1,
      globalCursorPosition: await utilModule.globalCursorPosition.call(),
      title: options.title ? {
        text: options.title,
        width: await displayWidth(options.title)
      } : { text: "", width: 0 },
      borderEnabled: !!options.border,
      border: this.extendEdges((_b = options.border) === null || _b === void 0 ? void 0 : _b.map((b) => typeof b === "boolean" ? 1 : b)),
      paddingEnabled: !!options.padding,
      padding: this.extendEdges(options.padding)
    };
  }
  getCenterPos(ctx, box) {
    const [, , width, height] = box;
    const top = Math.floor((ctx.lines - height) / 2);
    const left = Math.floor((ctx.columns - width) / 2);
    return [top, left];
  }
  getPosForAround(ctx, size, cursorPosition, preferAbove = false) {
    const columns = ctx.columns;
    const lines = ctx.lines - 1;
    const [width, height] = size;
    let [top, left] = cursorPosition;
    if (preferAbove) {
      if (top - height < 0) {
        top += 1;
      } else {
        top -= height;
      }
    } else {
      if (top + height >= lines) {
        top -= height;
      } else {
        top += 1;
      }
    }
    if (left + width >= columns) {
      left -= width - 1;
    }
    return [top, left];
  }
  extendEdges(edges) {
    var _a, _b, _c, _d;
    if (!edges) {
      return [0, 0, 0, 0];
    }
    const top = (_a = edges[0]) !== null && _a !== void 0 ? _a : 1;
    const right = (_b = edges[1]) !== null && _b !== void 0 ? _b : top;
    const bottom = (_c = edges[2]) !== null && _c !== void 0 ? _c : top;
    const left = (_d = edges[3]) !== null && _d !== void 0 ? _d : right;
    return [top, right, bottom, left];
  }
  changeBoxByEdgesList(box, edgesList) {
    let retBox = [...box];
    for (const edges of edgesList) {
      retBox = this.changeBoxByEdges(retBox, edges);
    }
    return retBox;
  }
  changeBoxByEdges(box, edges) {
    if (!edges) {
      return box;
    }
    const [wTop, wRight, wBottom, wLeft] = edges;
    let [top, left, width, height] = box;
    top -= wTop;
    left -= wLeft;
    width += wLeft + wRight;
    height += wTop + wBottom;
    return [top, left, width, height];
  }
  getBoxSizes(ctx, options, updateCursorPosition) {
    var _a, _b;
    const [top, left] = [(_a = options.top) !== null && _a !== void 0 ? _a : 0, (_b = options.left) !== null && _b !== void 0 ? _b : 0];
    const width = Math.max(options.width, ctx.title.width);
    const contentBox = [0, 0, width, options.height];
    const paddingBox = this.changeBoxByEdges(contentBox, ctx.padding);
    const borderBox = this.changeBoxByEdges(paddingBox, ctx.border);
    let fullPos;
    if (options.relative === "center") {
      fullPos = this.getCenterPos(ctx, borderBox);
    } else {
      const cursorPosition = !updateCursorPosition && this.storeCursorPosition ? this.storeCursorPosition : ctx.globalCursorPosition;
      if (options.relative === "cursor") {
        fullPos = cursorPosition;
      } else if (options.relative === "cursor-around") {
        fullPos = this.getPosForAround(ctx, [borderBox[2], borderBox[3]], cursorPosition);
      } else {
        fullPos = [top, left];
      }
      this.storeCursorPosition = cursorPosition;
    }
    [borderBox[0], borderBox[1]] = [fullPos[0], fullPos[1]];
    [paddingBox[0], paddingBox[1]] = [
      borderBox[0] + ctx.border[0],
      borderBox[1] + ctx.border[3]
    ];
    [contentBox[0], contentBox[1]] = [
      paddingBox[0] + ctx.padding[0],
      paddingBox[1] + ctx.padding[3]
    ];
    return {
      contentBox,
      paddingBox,
      borderBox
    };
  }
  vimWinConfig(ctx, options, updateCursorPosition) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [top, left, width, height] = [
      (_a = options.top) !== null && _a !== void 0 ? _a : 0,
      (_b = options.left) !== null && _b !== void 0 ? _b : 0,
      options.width,
      options.height
    ];
    const config = {
      line: 0,
      col: 0,
      zindex: ((_c = options.borderOnly) !== null && _c !== void 0 ? _c : false) ? 1 : 100,
      minwidth: width,
      minheight: height,
      maxwidth: width,
      maxheight: height
    };
    if (options.relative === "center") {
      config.pos = "center";
    } else {
      const cursorPosition = !updateCursorPosition && this.storeCursorPosition ? this.storeCursorPosition : ctx.globalCursorPosition;
      if (options.relative === "cursor") {
        [config.line, config.col] = cursorPosition;
      } else if (options.relative === "cursor-around") {
        const box = this.changeBoxByEdgesList([top, left, width, height], [ctx.padding, ctx.border]);
        [config.line, config.col] = this.getPosForAround(ctx, [box[2], box[3]], cursorPosition);
      } else {
        [config.line, config.col] = [top, left];
      }
      this.storeCursorPosition = cursorPosition;
      config.line += 1;
      config.col += 1;
    }
    const topOffset = (_d = options.topOffset) !== null && _d !== void 0 ? _d : 0;
    const leftOffset = (_e = options.leftOffset) !== null && _e !== void 0 ? _e : 0;
    config.line += topOffset;
    config.col += leftOffset;
    if (options.maxWidth) {
      config.maxwidth = options.maxWidth;
    }
    if (options.maxHeight) {
      config.maxheight = options.maxHeight;
    }
    config.highlight = (_f = options.winHl) !== null && _f !== void 0 ? _f : defaultWinHl;
    if (options.padding) {
      config.padding = options.padding;
    }
    if (ctx.borderEnabled) {
      config.border = ctx.border;
      if (config.border[0]) {
        if (ctx.title.width) {
          config.title = ctx.title.text;
        }
        config.close = "button";
      }
      config.borderchars = (_g = options.borderChars) !== null && _g !== void 0 ? _g : defaultBorderChars;
      config.borderhighlight = [(_h = options.borderWinHl) !== null && _h !== void 0 ? _h : defaultBorderWinHl];
    }
    return config;
  }
  nvimWinConfig(ctx, options, updateCursorPosition) {
    var _a, _b, _c;
    const { contentBox, borderBox } = this.getBoxSizes(ctx, options, updateCursorPosition);
    const topOffset = (_a = options.topOffset) !== null && _a !== void 0 ? _a : 0;
    const leftOffset = (_b = options.leftOffset) !== null && _b !== void 0 ? _b : 0;
    const winConfig = {
      relative: "editor",
      row: contentBox[0] + topOffset,
      col: contentBox[1] + leftOffset,
      width: contentBox[2],
      height: contentBox[3],
      focusable: (_c = options.focusable) !== null && _c !== void 0 ? _c : true
    };
    let winConfigBorder;
    if (borderBox) {
      winConfigBorder = {
        relative: "editor",
        row: borderBox[0] + topOffset,
        col: borderBox[1] + leftOffset,
        width: borderBox[2],
        height: borderBox[3],
        focusable: false
      };
    }
    return [winConfig, winConfigBorder];
  }
  winConfig(ctx, options, updateCursorPosition = true) {
    return import_coc10.workspace.isVim ? [this.vimWinConfig(ctx, options, updateCursorPosition), void 0] : this.nvimWinConfig(ctx, options, updateCursorPosition);
  }
  getRenderBorderData(ctx, options, winOptions) {
    var _a, _b, _c, _d, _e, _f;
    const title = (_b = (_a = ctx.title) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
    const titleWidth = (_d = (_c = ctx.title) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : 0;
    if (!ctx.borderEnabled) {
      return;
    }
    const [bTop, bRight, bBottom, bLeft] = ctx.border;
    let [cTop, cRight, cBottom, cLeft, cTopleft, cTopright, cBotright, cBotleft] = (_e = options.borderChars) !== null && _e !== void 0 ? _e : defaultBorderChars;
    if (!bTop) {
      cTop = "";
    }
    if (!bRight) {
      cRight = "";
    }
    if (!bBottom) {
      cBottom = "";
    }
    if (!bLeft) {
      cLeft = "";
    }
    if (!bTop || !bLeft) {
      cTopleft = "";
    }
    if (!bTop || !bRight) {
      cTopright = "";
    }
    if (!bBottom || !bLeft) {
      cBotleft = "";
    }
    if (!bBottom || !bRight) {
      cBotright = "";
    }
    const width = winOptions[0];
    const height = winOptions[1];
    const spaceWidth = width - bLeft - bRight;
    const spaceHeight = height - bTop - bBottom;
    const lines = [];
    if (bTop) {
      lines.push(cTopleft + title + cTop.repeat(spaceWidth - titleWidth) + cTopright);
    }
    lines.push(...Array.from({ length: spaceHeight }, () => cLeft + " ".repeat(spaceWidth) + cRight));
    if (bBottom) {
      lines.push(cBotleft + cBottom.repeat(spaceWidth) + cBotright);
    }
    const highlights = [];
    const borderWinHl = (_f = options.borderWinHl) !== null && _f !== void 0 ? _f : defaultBorderWinHl;
    if (borderWinHl) {
      highlights.push({
        hlGroup: borderWinHl,
        line: 0,
        colStart: 0,
        colEnd: width
      });
      for (let l = 0, len = spaceHeight; l < len; l++) {
        if (bLeft) {
          highlights.push({
            hlGroup: borderWinHl,
            line: l + 1,
            colStart: 0,
            colEnd: bLeft
          });
        }
        if (bRight) {
          highlights.push({
            hlGroup: borderWinHl,
            line: l + 1,
            colStart: bLeft + spaceWidth,
            colEnd: width
          });
        }
      }
      if (bBottom) {
        highlights.push({
          hlGroup: borderWinHl,
          line: height - 1,
          colStart: 0,
          colEnd: width
        });
      }
    }
    return {
      lines,
      highlights
    };
  }
  renderBorderNotifier(buf, ctx, options, winOptions) {
    const renderData = this.getRenderBorderData(ctx, options, "width" in winOptions ? [winOptions.width, winOptions.height] : [winOptions.minwidth, winOptions.minheight]);
    if (!renderData) {
      return Notifier.noop();
    }
    const { lines, highlights } = renderData;
    return Notifier.create(() => {
      buf.setOption("modifiable", true, true);
      buf.setOption("readonly", false, true);
      void buf.setLines(lines, { start: 0, end: -1 }, true);
      buf.setOption("modifiable", false, true);
      buf.setOption("readonly", true, true);
      this.addHighlightsNotify(buf, highlights);
    });
  }
  nvimWinHl(options) {
    var _a, _b;
    if (import_coc10.workspace.isVim) {
      return "";
    }
    const arr = [];
    arr.push(`Normal:${(_a = options.winHl) !== null && _a !== void 0 ? _a : defaultWinHl}`);
    arr.push(`NormalNC:${(_b = options.winHlNC) !== null && _b !== void 0 ? _b : defaultWinHlNC}`);
    return arr.join(",");
  }
  addHighlightsNotify(buf, highlights) {
    for (const hl of highlights) {
      if (!hl.hlGroup || hl.line === void 0 || hl.colStart === void 0 || hl.colEnd === void 0) {
        continue;
      }
      buf.highlightRanges(this.srcId, hl.hlGroup, [
        import_coc10.Range.create(hl.line, hl.colStart, hl.line, hl.colEnd)
      ]);
    }
  }
};

// node_modules/coc-helper/lib/esm/FloatingWindow.js
var FloatingWindow = class {
  constructor(bufnr, borderBufnr, createOptions, mode, util2) {
    this.bufnr = bufnr;
    this.borderBufnr = borderBufnr;
    this.createOptions = createOptions;
    this.mode = mode;
    this.util = util2;
    this.nvim = import_coc11.workspace.nvim;
    this.disposables = [];
    this.nvim = import_coc11.workspace.nvim;
    this.buffer = this.nvim.createBuffer(bufnr);
    if (borderBufnr) {
      this.borderBuffer = import_coc11.workspace.nvim.createBuffer(borderBufnr);
      this.disposables.push(import_coc11.events.on("BufWinLeave", helperLogger.asyncCatch(async (curBufnr) => {
        if (this.borderBufnr && curBufnr === this.bufnr) {
          await utilModule.closeWinByBufnr.call([this.borderBufnr]);
        }
      })));
    }
  }
  static getInitedExecute(mode, options) {
    var _a, _b, _c, _d;
    let initedExecute = (_b = (_a = options.initedExecute) === null || _a === void 0 ? void 0 : _a.call(options, FloatingWindow.initedContextVars.create)) !== null && _b !== void 0 ? _b : "";
    initedExecute = `${FloatingWindow.modePresets[mode].createInitedExecute(FloatingWindow.initedContextVars.create)}
${initedExecute}`;
    const borderInitedExecute = (_d = (_c = options.borderInitedExecute) === null || _c === void 0 ? void 0 : _c.call(options, FloatingWindow.initedContextVars.create)) !== null && _d !== void 0 ? _d : FloatingWindow.modePresets.show.createInitedExecute(FloatingWindow.initedContextVars.create);
    return [initedExecute, borderInitedExecute];
  }
  static async create(options = {}) {
    var _a, _b, _c;
    const mode = (_a = options.mode) !== null && _a !== void 0 ? _a : "default";
    const [initedExecute, borderInitedExecute] = this.getInitedExecute(mode, options);
    const [bufnr, borderBufnr] = await floatingModule.create.call((_b = options.name) !== null && _b !== void 0 ? _b : "", initedExecute, (_c = options.hasBorderBuf) !== null && _c !== void 0 ? _c : true, borderInitedExecute);
    const floatingUtil = new FloatingUtil(this.srcId);
    return new FloatingWindow(bufnr, borderBufnr !== null && borderBufnr !== void 0 ? borderBufnr : void 0, options, mode, floatingUtil);
  }
  getInitedExecute(options) {
    var _a, _b, _c, _d;
    let initedExecute = (_b = (_a = options.initedExecute) === null || _a === void 0 ? void 0 : _a.call(options, FloatingWindow.initedContextVars.open)) !== null && _b !== void 0 ? _b : "";
    initedExecute = `${FloatingWindow.modePresets[this.mode].openInitedExecute(FloatingWindow.initedContextVars.open)}
${initedExecute}`;
    const borderInitedExecute = (_d = (_c = options.borderInitedExecute) === null || _c === void 0 ? void 0 : _c.call(options, FloatingWindow.initedContextVars.open)) !== null && _d !== void 0 ? _d : FloatingWindow.modePresets.show.openInitedExecute(FloatingWindow.initedContextVars.open);
    return [initedExecute, borderInitedExecute];
  }
  getFocus(options) {
    var _a, _b;
    return (_b = (_a = options.focus) !== null && _a !== void 0 ? _a : this.mode ? FloatingWindow.modePresets[this.mode].focus : void 0) !== null && _b !== void 0 ? _b : false;
  }
  getModifiable(options) {
    var _a, _b;
    return (_b = (_a = options.modifiable) !== null && _a !== void 0 ? _a : this.mode ? FloatingWindow.modePresets[this.mode].modifiable : void 0) !== null && _b !== void 0 ? _b : false;
  }
  setLinesNotifier(options) {
    return Notifier.create(() => {
      if (!options.lines && !options.modifiable) {
        return;
      }
      const modifiable = this.getModifiable(options);
      this.buffer.setOption("modifiable", true, true);
      this.buffer.setOption("readonly", false, true);
      if (options.lines) {
        void this.buffer.setLines(options.lines, { start: 0, end: -1 }, true);
      }
      if (!modifiable) {
        this.buffer.setOption("modifiable", false, true);
        this.buffer.setOption("readonly", true, true);
      }
      if (options.highlights) {
        for (const hl of options.highlights) {
          this.util.addHighlightsNotify(this.buffer, [hl]);
        }
      }
      if (import_coc11.workspace.isVim) {
        this.nvim.command("redraw!", true);
      }
    });
  }
  async setLines(options) {
    await this.setLinesNotifier(options).run();
  }
  async opened() {
    const win = await this.win();
    return !!win;
  }
  async openNotifier(options) {
    var _a;
    if (options.width <= 0 || options.height <= 0) {
      return Notifier.noop();
    }
    const notifiers = [];
    notifiers.push(this.closeNotifier());
    const ctx = await this.util.createContext(options);
    const [initedExecute, borderInitedExecute] = this.getInitedExecute(options);
    const [winConfig, borderWinConfig] = this.util.winConfig(ctx, options);
    if (options.borderOnly && borderWinConfig) {
      notifiers.push(floatingModule.open.callNotifier(this.bufnr, borderWinConfig, borderInitedExecute, null, null, "", false, this.util.nvimWinHl(options)));
      notifiers.push(this.util.renderBorderNotifier(this.buffer, ctx, options, borderWinConfig));
    } else {
      notifiers.push(floatingModule.open.callNotifier(this.bufnr, winConfig, initedExecute, (_a = this.borderBufnr) !== null && _a !== void 0 ? _a : null, borderWinConfig !== null && borderWinConfig !== void 0 ? borderWinConfig : null, borderInitedExecute, this.getFocus(options), this.util.nvimWinHl(options)));
    }
    if (import_coc11.workspace.isNvim && this.borderBuffer && borderWinConfig) {
      notifiers.push(this.util.renderBorderNotifier(this.borderBuffer, ctx, options, borderWinConfig));
    }
    notifiers.push(this.setLinesNotifier(options), Notifier.create(() => {
      if (options.filetype) {
        this.buffer.setOption("filetype", options.filetype, true);
      }
    }));
    return Notifier.combine(notifiers);
  }
  async open(options) {
    await (await this.openNotifier(options)).run();
  }
  async resumeNotifier(options) {
    const ctx = await this.util.createContext(options);
    const [winConfig, borderWinConfig] = this.util.winConfig(ctx, options);
    return Notifier.create(() => {
      var _a;
      floatingModule.resume.callNotify(this.bufnr, winConfig, (_a = this.borderBufnr) !== null && _a !== void 0 ? _a : null, borderWinConfig !== null && borderWinConfig !== void 0 ? borderWinConfig : null, this.getFocus(options), this.util.nvimWinHl(options));
      if (this.borderBuffer && borderWinConfig) {
        this.util.renderBorderNotifier(this.borderBuffer, ctx, options, borderWinConfig).notify();
      }
      if (import_coc11.workspace.isVim) {
        this.nvim.command("redraw!", true);
      }
    });
  }
  async resume(options) {
    await (await this.resumeNotifier(options)).run();
  }
  async resizeNotifier(options) {
    var _a;
    const ctx = await this.util.createContext(options);
    const [winConfig, borderWinConfig] = this.util.winConfig(ctx, options, false);
    const notifiers = [];
    if (options.borderOnly && borderWinConfig) {
      notifiers.push(floatingModule.update.callNotifier(this.bufnr, borderWinConfig, null, null, this.util.nvimWinHl(options)));
      notifiers.push(this.util.renderBorderNotifier(this.buffer, ctx, options, borderWinConfig));
    } else {
      notifiers.push(floatingModule.update.callNotifier(this.bufnr, winConfig, (_a = this.borderBufnr) !== null && _a !== void 0 ? _a : null, borderWinConfig !== null && borderWinConfig !== void 0 ? borderWinConfig : null, this.util.nvimWinHl(options)));
    }
    if (import_coc11.workspace.isNvim && this.borderBuffer && borderWinConfig) {
      notifiers.push(this.util.renderBorderNotifier(this.borderBuffer, ctx, options, borderWinConfig));
    }
    notifiers.push(Notifier.create(() => {
      if (import_coc11.workspace.isVim) {
        this.nvim.command("redraw!", true);
      }
    }));
    return Notifier.combine(notifiers);
  }
  async resize(options) {
    await (await this.resizeNotifier(options)).run();
  }
  async win() {
    const winid = await floatingModule.winid.call(this.bufnr);
    return winid ? this.nvim.createWindow(winid) : void 0;
  }
  async borderWin() {
    const borderWinid = await floatingModule.winid.call(this.bufnr);
    return borderWinid ? this.nvim.createWindow(borderWinid) : void 0;
  }
  closeNotifier() {
    return floatingModule.close.callNotifier(this.bufnr);
  }
  async close() {
    await this.closeNotifier().run();
  }
  dispose() {
    (0, import_coc11.disposeAll)(this.disposables);
    this.disposables.forEach((s) => s.dispose());
  }
};
FloatingWindow.modePresets = {
  default: {
    modifiable: false,
    focus: false,
    createInitedExecute: () => "",
    openInitedExecute: () => ""
  },
  base: {
    createInitedExecute: (ctx) => `
        call setbufvar(${ctx.bufnr}, '&buftype', 'nofile')
        call setbufvar(${ctx.bufnr}, '&bufhidden', 'hide')
        call setbufvar(${ctx.bufnr}, '&buflisted', 0)

        call setbufvar(${ctx.bufnr}, '&wrap', 1)

        call setbufvar(${ctx.bufnr}, '&swapfile', 0)

        call setbufvar(${ctx.bufnr}, '&modeline', 0)
      `,
    openInitedExecute: (ctx) => `
        call setbufvar(${ctx.bufnr}, '&list', 0)

        call setbufvar(${ctx.bufnr}, '&listchars', '')
        if has('nvim')
          call setbufvar(${ctx.bufnr}, '&fillchars', 'eob: ')
        endif

        call setbufvar(${ctx.bufnr}, '&signcolumn', 'no')
        call setbufvar(${ctx.bufnr}, '&number', 0)
        call setbufvar(${ctx.bufnr}, '&relativenumber', 0)
        call setbufvar(${ctx.bufnr}, '&foldenable', 0)
        call setbufvar(${ctx.bufnr}, '&foldcolumn', 0)

        call setbufvar(${ctx.bufnr}, '&spell', 0)

        call setbufvar(${ctx.bufnr}, '&cursorcolumn', 0)
        call setbufvar(${ctx.bufnr}, '&cursorline', 0)
        call setbufvar(${ctx.bufnr}, '&colorcolumn', '')
      `
  },
  show: {
    modifiable: false,
    createInitedExecute: (ctx) => `
        ${FloatingWindow.modePresets.base.createInitedExecute(ctx)}
        " call setbufvar(${ctx.bufnr}, '&undofile', 0)
        " call setbufvar(${ctx.bufnr}, '&undolevels', -1)

        call setbufvar(${ctx.bufnr}, '&modifiable', 0)
        call setbufvar(${ctx.bufnr}, '&modified', 0)
        call setbufvar(${ctx.bufnr}, '&readonly', 1)
      `,
    openInitedExecute: (ctx) => `
        ${FloatingWindow.modePresets.base.openInitedExecute(ctx)}
      `
  }
};
FloatingWindow.initedContextVars = {
  create: { bufnr: "a:ctx.bufnr" },
  open: { bufnr: "a:ctx.bufnr", winid: "a:ctx.winid" }
};
FloatingWindow.srcId = "coc-helper-floatwin";

// node_modules/coc-helper/lib/esm/MultiFloatingWindow.js
var import_coc12 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/WinLayoutFinder.js
var import_coc13 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/index.js
async function activateHelper(context, options = {}) {
  var _a, _b, _c;
  if ((_b = (_a = options.vimModule) !== null && _a !== void 0 ? _a : options.events) !== null && _b !== void 0 ? _b : true) {
    await VimModule.init(context);
  }
  if ((_c = options.events) !== null && _c !== void 0 ? _c : true) {
    await helperVimEvents.register(context);
  }
  try {
    await import_coc14.workspace.nvim.command("hi default link CocHelperNormalFloatNC CocHelperNormalFloat");
  } catch (error) {
    void import_coc14.window.showErrorMessage(error.toString());
  }
}

// src/index.ts
var import_coc17 = require("coc.nvim");

// node_modules/lodash-es/_freeGlobal.js
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal_default = freeGlobal;

// node_modules/lodash-es/_root.js
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal_default || freeSelf || Function("return this")();
var root_default = root;

// node_modules/lodash-es/_Symbol.js
var Symbol2 = root_default.Symbol;
var Symbol_default = Symbol2;

// node_modules/lodash-es/_getRawTag.js
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
var getRawTag_default = getRawTag;

// node_modules/lodash-es/_objectToString.js
var objectProto2 = Object.prototype;
var nativeObjectToString2 = objectProto2.toString;
function objectToString(value) {
  return nativeObjectToString2.call(value);
}
var objectToString_default = objectToString;

// node_modules/lodash-es/_baseGetTag.js
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
}
var baseGetTag_default = baseGetTag;

// node_modules/lodash-es/isObjectLike.js
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_default = isObjectLike;

// node_modules/lodash-es/isSymbol.js
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike_default(value) && baseGetTag_default(value) == symbolTag;
}
var isSymbol_default = isSymbol;

// node_modules/lodash-es/_arrayMap.js
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var arrayMap_default = arrayMap;

// node_modules/lodash-es/isArray.js
var isArray = Array.isArray;
var isArray_default = isArray;

// node_modules/lodash-es/_baseToString.js
var INFINITY = 1 / 0;
var symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
var symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray_default(value)) {
    return arrayMap_default(value, baseToString) + "";
  }
  if (isSymbol_default(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
var baseToString_default = baseToString;

// node_modules/lodash-es/_trimmedEndIndex.js
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
var trimmedEndIndex_default = trimmedEndIndex;

// node_modules/lodash-es/_baseTrim.js
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex_default(string) + 1).replace(reTrimStart, "") : string;
}
var baseTrim_default = baseTrim;

// node_modules/lodash-es/isObject.js
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_default = isObject;

// node_modules/lodash-es/toNumber.js
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol_default(value)) {
    return NAN;
  }
  if (isObject_default(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject_default(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim_default(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var toNumber_default = toNumber;

// node_modules/lodash-es/toFinite.js
var INFINITY2 = 1 / 0;
var MAX_INTEGER = 17976931348623157e292;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_default(value);
  if (value === INFINITY2 || value === -INFINITY2) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
var toFinite_default = toFinite;

// node_modules/lodash-es/toInteger.js
function toInteger(value) {
  var result = toFinite_default(value), remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
var toInteger_default = toInteger;

// node_modules/lodash-es/identity.js
function identity(value) {
  return value;
}
var identity_default = identity;

// node_modules/lodash-es/isFunction.js
var asyncTag = "[object AsyncFunction]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject_default(value)) {
    return false;
  }
  var tag = baseGetTag_default(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_default = isFunction;

// node_modules/lodash-es/_coreJsData.js
var coreJsData = root_default["__core-js_shared__"];
var coreJsData_default = coreJsData;

// node_modules/lodash-es/_isMasked.js
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var isMasked_default = isMasked;

// node_modules/lodash-es/_toSource.js
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var toSource_default = toSource;

// node_modules/lodash-es/_baseIsNative.js
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto2 = Function.prototype;
var objectProto3 = Object.prototype;
var funcToString2 = funcProto2.toString;
var hasOwnProperty2 = objectProto3.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject_default(value) || isMasked_default(value)) {
    return false;
  }
  var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource_default(value));
}
var baseIsNative_default = baseIsNative;

// node_modules/lodash-es/_getValue.js
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
var getValue_default = getValue;

// node_modules/lodash-es/_getNative.js
function getNative(object, key) {
  var value = getValue_default(object, key);
  return baseIsNative_default(value) ? value : void 0;
}
var getNative_default = getNative;

// node_modules/lodash-es/_WeakMap.js
var WeakMap2 = getNative_default(root_default, "WeakMap");
var WeakMap_default = WeakMap2;

// node_modules/lodash-es/noop.js
function noop() {
}
var noop_default = noop;

// node_modules/lodash-es/_baseFindIndex.js
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
var baseFindIndex_default = baseFindIndex;

// node_modules/lodash-es/_baseIsNaN.js
function baseIsNaN(value) {
  return value !== value;
}
var baseIsNaN_default = baseIsNaN;

// node_modules/lodash-es/_strictIndexOf.js
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1, length = array.length;
  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
var strictIndexOf_default = strictIndexOf;

// node_modules/lodash-es/_baseIndexOf.js
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf_default(array, value, fromIndex) : baseFindIndex_default(array, baseIsNaN_default, fromIndex);
}
var baseIndexOf_default = baseIndexOf;

// node_modules/lodash-es/_arrayIncludes.js
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf_default(array, value, 0) > -1;
}
var arrayIncludes_default = arrayIncludes;

// node_modules/lodash-es/_isIndex.js
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var isIndex_default = isIndex;

// node_modules/lodash-es/eq.js
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_default = eq;

// node_modules/lodash-es/isLength.js
var MAX_SAFE_INTEGER2 = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
}
var isLength_default = isLength;

// node_modules/lodash-es/isArrayLike.js
function isArrayLike(value) {
  return value != null && isLength_default(value.length) && !isFunction_default(value);
}
var isArrayLike_default = isArrayLike;

// node_modules/lodash-es/_isPrototype.js
var objectProto4 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto4;
  return value === proto;
}
var isPrototype_default = isPrototype;

// node_modules/lodash-es/_baseTimes.js
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
var baseTimes_default = baseTimes;

// node_modules/lodash-es/_baseIsArguments.js
var argsTag = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
}
var baseIsArguments_default = baseIsArguments;

// node_modules/lodash-es/isArguments.js
var objectProto5 = Object.prototype;
var hasOwnProperty3 = objectProto5.hasOwnProperty;
var propertyIsEnumerable = objectProto5.propertyIsEnumerable;
var isArguments = baseIsArguments_default(function() {
  return arguments;
}()) ? baseIsArguments_default : function(value) {
  return isObjectLike_default(value) && hasOwnProperty3.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments_default = isArguments;

// node_modules/lodash-es/stubFalse.js
function stubFalse() {
  return false;
}
var stubFalse_default = stubFalse;

// node_modules/lodash-es/isBuffer.js
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer2 = moduleExports ? root_default.Buffer : void 0;
var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse_default;
var isBuffer_default = isBuffer;

// node_modules/lodash-es/_baseIsTypedArray.js
var argsTag2 = "[object Arguments]";
var arrayTag = "[object Array]";
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var funcTag2 = "[object Function]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var objectTag = "[object Object]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
}
var baseIsTypedArray_default = baseIsTypedArray;

// node_modules/lodash-es/_baseUnary.js
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var baseUnary_default = baseUnary;

// node_modules/lodash-es/_nodeUtil.js
var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
var freeProcess = moduleExports2 && freeGlobal_default.process;
var nodeUtil = function() {
  try {
    var types2 = freeModule2 && freeModule2.require && freeModule2.require("util").types;
    if (types2) {
      return types2;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
var nodeUtil_default = nodeUtil;

// node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
var isTypedArray_default = isTypedArray;

// node_modules/lodash-es/_arrayLikeKeys.js
var objectProto6 = Object.prototype;
var hasOwnProperty4 = objectProto6.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty4.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex_default(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
var arrayLikeKeys_default = arrayLikeKeys;

// node_modules/lodash-es/_overArg.js
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var overArg_default = overArg;

// node_modules/lodash-es/_nativeKeys.js
var nativeKeys = overArg_default(Object.keys, Object);
var nativeKeys_default = nativeKeys;

// node_modules/lodash-es/_baseKeys.js
var objectProto7 = Object.prototype;
var hasOwnProperty5 = objectProto7.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype_default(object)) {
    return nativeKeys_default(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty5.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var baseKeys_default = baseKeys;

// node_modules/lodash-es/keys.js
function keys(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object) : baseKeys_default(object);
}
var keys_default = keys;

// node_modules/lodash-es/_isKey.js
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray_default(value)) {
    return false;
  }
  var type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol_default(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var isKey_default = isKey;

// node_modules/lodash-es/_nativeCreate.js
var nativeCreate = getNative_default(Object, "create");
var nativeCreate_default = nativeCreate;

// node_modules/lodash-es/_hashClear.js
function hashClear() {
  this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
  this.size = 0;
}
var hashClear_default = hashClear;

// node_modules/lodash-es/_hashDelete.js
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var hashDelete_default = hashDelete;

// node_modules/lodash-es/_hashGet.js
var HASH_UNDEFINED = "__lodash_hash_undefined__";
var objectProto8 = Object.prototype;
var hasOwnProperty6 = objectProto8.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate_default) {
    var result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty6.call(data, key) ? data[key] : void 0;
}
var hashGet_default = hashGet;

// node_modules/lodash-es/_hashHas.js
var objectProto9 = Object.prototype;
var hasOwnProperty7 = objectProto9.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty7.call(data, key);
}
var hashHas_default = hashHas;

// node_modules/lodash-es/_hashSet.js
var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
  return this;
}
var hashSet_default = hashSet;

// node_modules/lodash-es/_Hash.js
function Hash(entries2) {
  var index = -1, length = entries2 == null ? 0 : entries2.length;
  this.clear();
  while (++index < length) {
    var entry = entries2[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear_default;
Hash.prototype["delete"] = hashDelete_default;
Hash.prototype.get = hashGet_default;
Hash.prototype.has = hashHas_default;
Hash.prototype.set = hashSet_default;
var Hash_default = Hash;

// node_modules/lodash-es/_listCacheClear.js
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
var listCacheClear_default = listCacheClear;

// node_modules/lodash-es/_assocIndexOf.js
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_default(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var assocIndexOf_default = assocIndexOf;

// node_modules/lodash-es/_listCacheDelete.js
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
var listCacheDelete_default = listCacheDelete;

// node_modules/lodash-es/_listCacheGet.js
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  return index < 0 ? void 0 : data[index][1];
}
var listCacheGet_default = listCacheGet;

// node_modules/lodash-es/_listCacheHas.js
function listCacheHas(key) {
  return assocIndexOf_default(this.__data__, key) > -1;
}
var listCacheHas_default = listCacheHas;

// node_modules/lodash-es/_listCacheSet.js
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
var listCacheSet_default = listCacheSet;

// node_modules/lodash-es/_ListCache.js
function ListCache(entries2) {
  var index = -1, length = entries2 == null ? 0 : entries2.length;
  this.clear();
  while (++index < length) {
    var entry = entries2[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear_default;
ListCache.prototype["delete"] = listCacheDelete_default;
ListCache.prototype.get = listCacheGet_default;
ListCache.prototype.has = listCacheHas_default;
ListCache.prototype.set = listCacheSet_default;
var ListCache_default = ListCache;

// node_modules/lodash-es/_Map.js
var Map2 = getNative_default(root_default, "Map");
var Map_default = Map2;

// node_modules/lodash-es/_mapCacheClear.js
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash_default(),
    "map": new (Map_default || ListCache_default)(),
    "string": new Hash_default()
  };
}
var mapCacheClear_default = mapCacheClear;

// node_modules/lodash-es/_isKeyable.js
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var isKeyable_default = isKeyable;

// node_modules/lodash-es/_getMapData.js
function getMapData(map4, key) {
  var data = map4.__data__;
  return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var getMapData_default = getMapData;

// node_modules/lodash-es/_mapCacheDelete.js
function mapCacheDelete(key) {
  var result = getMapData_default(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var mapCacheDelete_default = mapCacheDelete;

// node_modules/lodash-es/_mapCacheGet.js
function mapCacheGet(key) {
  return getMapData_default(this, key).get(key);
}
var mapCacheGet_default = mapCacheGet;

// node_modules/lodash-es/_mapCacheHas.js
function mapCacheHas(key) {
  return getMapData_default(this, key).has(key);
}
var mapCacheHas_default = mapCacheHas;

// node_modules/lodash-es/_mapCacheSet.js
function mapCacheSet(key, value) {
  var data = getMapData_default(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
var mapCacheSet_default = mapCacheSet;

// node_modules/lodash-es/_MapCache.js
function MapCache(entries2) {
  var index = -1, length = entries2 == null ? 0 : entries2.length;
  this.clear();
  while (++index < length) {
    var entry = entries2[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear_default;
MapCache.prototype["delete"] = mapCacheDelete_default;
MapCache.prototype.get = mapCacheGet_default;
MapCache.prototype.has = mapCacheHas_default;
MapCache.prototype.set = mapCacheSet_default;
var MapCache_default = MapCache;

// node_modules/lodash-es/memoize.js
var FUNC_ERROR_TEXT = "Expected a function";
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache_default)();
  return memoized;
}
memoize.Cache = MapCache_default;
var memoize_default = memoize;

// node_modules/lodash-es/_memoizeCapped.js
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize_default(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var memoizeCapped_default = memoizeCapped;

// node_modules/lodash-es/_stringToPath.js
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped_default(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
  });
  return result;
});
var stringToPath_default = stringToPath;

// node_modules/lodash-es/toString.js
function toString(value) {
  return value == null ? "" : baseToString_default(value);
}
var toString_default = toString;

// node_modules/lodash-es/_castPath.js
function castPath(value, object) {
  if (isArray_default(value)) {
    return value;
  }
  return isKey_default(value, object) ? [value] : stringToPath_default(toString_default(value));
}
var castPath_default = castPath;

// node_modules/lodash-es/_toKey.js
var INFINITY3 = 1 / 0;
function toKey(value) {
  if (typeof value == "string" || isSymbol_default(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY3 ? "-0" : result;
}
var toKey_default = toKey;

// node_modules/lodash-es/_baseGet.js
function baseGet(object, path) {
  path = castPath_default(path, object);
  var index = 0, length = path.length;
  while (object != null && index < length) {
    object = object[toKey_default(path[index++])];
  }
  return index && index == length ? object : void 0;
}
var baseGet_default = baseGet;

// node_modules/lodash-es/get.js
function get(object, path, defaultValue) {
  var result = object == null ? void 0 : baseGet_default(object, path);
  return result === void 0 ? defaultValue : result;
}
var get_default = get;

// node_modules/lodash-es/_arrayPush.js
function arrayPush(array, values2) {
  var index = -1, length = values2.length, offset = array.length;
  while (++index < length) {
    array[offset + index] = values2[index];
  }
  return array;
}
var arrayPush_default = arrayPush;

// node_modules/lodash-es/_stackClear.js
function stackClear() {
  this.__data__ = new ListCache_default();
  this.size = 0;
}
var stackClear_default = stackClear;

// node_modules/lodash-es/_stackDelete.js
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
var stackDelete_default = stackDelete;

// node_modules/lodash-es/_stackGet.js
function stackGet(key) {
  return this.__data__.get(key);
}
var stackGet_default = stackGet;

// node_modules/lodash-es/_stackHas.js
function stackHas(key) {
  return this.__data__.has(key);
}
var stackHas_default = stackHas;

// node_modules/lodash-es/_stackSet.js
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache_default) {
    var pairs = data.__data__;
    if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache_default(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
var stackSet_default = stackSet;

// node_modules/lodash-es/_Stack.js
function Stack(entries2) {
  var data = this.__data__ = new ListCache_default(entries2);
  this.size = data.size;
}
Stack.prototype.clear = stackClear_default;
Stack.prototype["delete"] = stackDelete_default;
Stack.prototype.get = stackGet_default;
Stack.prototype.has = stackHas_default;
Stack.prototype.set = stackSet_default;
var Stack_default = Stack;

// node_modules/lodash-es/_arrayFilter.js
function arrayFilter(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var arrayFilter_default = arrayFilter;

// node_modules/lodash-es/stubArray.js
function stubArray() {
  return [];
}
var stubArray_default = stubArray;

// node_modules/lodash-es/_getSymbols.js
var objectProto10 = Object.prototype;
var propertyIsEnumerable2 = objectProto10.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter_default(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable2.call(object, symbol);
  });
};
var getSymbols_default = getSymbols;

// node_modules/lodash-es/_baseGetAllKeys.js
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_default(object) ? result : arrayPush_default(result, symbolsFunc(object));
}
var baseGetAllKeys_default = baseGetAllKeys;

// node_modules/lodash-es/_getAllKeys.js
function getAllKeys(object) {
  return baseGetAllKeys_default(object, keys_default, getSymbols_default);
}
var getAllKeys_default = getAllKeys;

// node_modules/lodash-es/_DataView.js
var DataView = getNative_default(root_default, "DataView");
var DataView_default = DataView;

// node_modules/lodash-es/_Promise.js
var Promise2 = getNative_default(root_default, "Promise");
var Promise_default = Promise2;

// node_modules/lodash-es/_Set.js
var Set2 = getNative_default(root_default, "Set");
var Set_default = Set2;

// node_modules/lodash-es/_getTag.js
var mapTag2 = "[object Map]";
var objectTag2 = "[object Object]";
var promiseTag = "[object Promise]";
var setTag2 = "[object Set]";
var weakMapTag2 = "[object WeakMap]";
var dataViewTag2 = "[object DataView]";
var dataViewCtorString = toSource_default(DataView_default);
var mapCtorString = toSource_default(Map_default);
var promiseCtorString = toSource_default(Promise_default);
var setCtorString = toSource_default(Set_default);
var weakMapCtorString = toSource_default(WeakMap_default);
var getTag = baseGetTag_default;
if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
  getTag = function(value) {
    var result = baseGetTag_default(value), Ctor = result == objectTag2 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag2;
        case mapCtorString:
          return mapTag2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag2;
        case weakMapCtorString:
          return weakMapTag2;
      }
    }
    return result;
  };
}
var getTag_default = getTag;

// node_modules/lodash-es/_Uint8Array.js
var Uint8Array2 = root_default.Uint8Array;
var Uint8Array_default = Uint8Array2;

// node_modules/lodash-es/compact.js
function compact(array) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var compact_default = compact;

// node_modules/lodash-es/_setCacheAdd.js
var HASH_UNDEFINED3 = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED3);
  return this;
}
var setCacheAdd_default = setCacheAdd;

// node_modules/lodash-es/_setCacheHas.js
function setCacheHas(value) {
  return this.__data__.has(value);
}
var setCacheHas_default = setCacheHas;

// node_modules/lodash-es/_SetCache.js
function SetCache(values2) {
  var index = -1, length = values2 == null ? 0 : values2.length;
  this.__data__ = new MapCache_default();
  while (++index < length) {
    this.add(values2[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
SetCache.prototype.has = setCacheHas_default;
var SetCache_default = SetCache;

// node_modules/lodash-es/_arraySome.js
function arraySome(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
var arraySome_default = arraySome;

// node_modules/lodash-es/_cacheHas.js
function cacheHas(cache, key) {
  return cache.has(key);
}
var cacheHas_default = cacheHas;

// node_modules/lodash-es/_equalArrays.js
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache_default() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index], othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome_default(other, function(othValue2, othIndex) {
        if (!cacheHas_default(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
var equalArrays_default = equalArrays;

// node_modules/lodash-es/_mapToArray.js
function mapToArray(map4) {
  var index = -1, result = Array(map4.size);
  map4.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}
var mapToArray_default = mapToArray;

// node_modules/lodash-es/_setToArray.js
function setToArray(set) {
  var index = -1, result = Array(set.size);
  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}
var setToArray_default = setToArray;

// node_modules/lodash-es/_equalByTag.js
var COMPARE_PARTIAL_FLAG2 = 1;
var COMPARE_UNORDERED_FLAG2 = 2;
var boolTag2 = "[object Boolean]";
var dateTag2 = "[object Date]";
var errorTag2 = "[object Error]";
var mapTag3 = "[object Map]";
var numberTag2 = "[object Number]";
var regexpTag2 = "[object RegExp]";
var setTag3 = "[object Set]";
var stringTag2 = "[object String]";
var symbolTag2 = "[object Symbol]";
var arrayBufferTag2 = "[object ArrayBuffer]";
var dataViewTag3 = "[object DataView]";
var symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
var symbolValueOf = symbolProto2 ? symbolProto2.valueOf : void 0;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag3:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag2:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array_default(object), new Uint8Array_default(other))) {
        return false;
      }
      return true;
    case boolTag2:
    case dateTag2:
    case numberTag2:
      return eq_default(+object, +other);
    case errorTag2:
      return object.name == other.name && object.message == other.message;
    case regexpTag2:
    case stringTag2:
      return object == other + "";
    case mapTag3:
      var convert = mapToArray_default;
    case setTag3:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
      convert || (convert = setToArray_default);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG2;
      stack.set(object, other);
      var result = equalArrays_default(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag2:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}
var equalByTag_default = equalByTag;

// node_modules/lodash-es/_equalObjects.js
var COMPARE_PARTIAL_FLAG3 = 1;
var objectProto11 = Object.prototype;
var hasOwnProperty8 = objectProto11.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG3, objProps = getAllKeys_default(object), objLength = objProps.length, othProps = getAllKeys_default(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty8.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
var equalObjects_default = equalObjects;

// node_modules/lodash-es/_baseIsEqualDeep.js
var COMPARE_PARTIAL_FLAG4 = 1;
var argsTag3 = "[object Arguments]";
var arrayTag2 = "[object Array]";
var objectTag3 = "[object Object]";
var objectProto12 = Object.prototype;
var hasOwnProperty9 = objectProto12.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_default(object), othIsArr = isArray_default(other), objTag = objIsArr ? arrayTag2 : getTag_default(object), othTag = othIsArr ? arrayTag2 : getTag_default(other);
  objTag = objTag == argsTag3 ? objectTag3 : objTag;
  othTag = othTag == argsTag3 ? objectTag3 : othTag;
  var objIsObj = objTag == objectTag3, othIsObj = othTag == objectTag3, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer_default(object)) {
    if (!isBuffer_default(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack_default());
    return objIsArr || isTypedArray_default(object) ? equalArrays_default(object, other, bitmask, customizer, equalFunc, stack) : equalByTag_default(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG4)) {
    var objIsWrapped = objIsObj && hasOwnProperty9.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty9.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack_default());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack_default());
  return equalObjects_default(object, other, bitmask, customizer, equalFunc, stack);
}
var baseIsEqualDeep_default = baseIsEqualDeep;

// node_modules/lodash-es/_baseIsEqual.js
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike_default(value) && !isObjectLike_default(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep_default(value, other, bitmask, customizer, baseIsEqual, stack);
}
var baseIsEqual_default = baseIsEqual;

// node_modules/lodash-es/_baseIsMatch.js
var COMPARE_PARTIAL_FLAG5 = 1;
var COMPARE_UNORDERED_FLAG3 = 2;
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length, length = index, noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0], objValue = object[key], srcValue = data[1];
    if (noCustomizer && data[2]) {
      if (objValue === void 0 && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack_default();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === void 0 ? baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG5 | COMPARE_UNORDERED_FLAG3, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}
var baseIsMatch_default = baseIsMatch;

// node_modules/lodash-es/_isStrictComparable.js
function isStrictComparable(value) {
  return value === value && !isObject_default(value);
}
var isStrictComparable_default = isStrictComparable;

// node_modules/lodash-es/_getMatchData.js
function getMatchData(object) {
  var result = keys_default(object), length = result.length;
  while (length--) {
    var key = result[length], value = object[key];
    result[length] = [key, value, isStrictComparable_default(value)];
  }
  return result;
}
var getMatchData_default = getMatchData;

// node_modules/lodash-es/_matchesStrictComparable.js
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
  };
}
var matchesStrictComparable_default = matchesStrictComparable;

// node_modules/lodash-es/_baseMatches.js
function baseMatches(source) {
  var matchData = getMatchData_default(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable_default(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch_default(object, source, matchData);
  };
}
var baseMatches_default = baseMatches;

// node_modules/lodash-es/_baseHasIn.js
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
var baseHasIn_default = baseHasIn;

// node_modules/lodash-es/_hasPath.js
function hasPath(object, path, hasFunc) {
  path = castPath_default(path, object);
  var index = -1, length = path.length, result = false;
  while (++index < length) {
    var key = toKey_default(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_default(length) && isIndex_default(key, length) && (isArray_default(object) || isArguments_default(object));
}
var hasPath_default = hasPath;

// node_modules/lodash-es/hasIn.js
function hasIn(object, path) {
  return object != null && hasPath_default(object, path, baseHasIn_default);
}
var hasIn_default = hasIn;

// node_modules/lodash-es/_baseMatchesProperty.js
var COMPARE_PARTIAL_FLAG6 = 1;
var COMPARE_UNORDERED_FLAG4 = 2;
function baseMatchesProperty(path, srcValue) {
  if (isKey_default(path) && isStrictComparable_default(srcValue)) {
    return matchesStrictComparable_default(toKey_default(path), srcValue);
  }
  return function(object) {
    var objValue = get_default(object, path);
    return objValue === void 0 && objValue === srcValue ? hasIn_default(object, path) : baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG6 | COMPARE_UNORDERED_FLAG4);
  };
}
var baseMatchesProperty_default = baseMatchesProperty;

// node_modules/lodash-es/_baseProperty.js
function baseProperty(key) {
  return function(object) {
    return object == null ? void 0 : object[key];
  };
}
var baseProperty_default = baseProperty;

// node_modules/lodash-es/_basePropertyDeep.js
function basePropertyDeep(path) {
  return function(object) {
    return baseGet_default(object, path);
  };
}
var basePropertyDeep_default = basePropertyDeep;

// node_modules/lodash-es/property.js
function property(path) {
  return isKey_default(path) ? baseProperty_default(toKey_default(path)) : basePropertyDeep_default(path);
}
var property_default = property;

// node_modules/lodash-es/_baseIteratee.js
function baseIteratee(value) {
  if (typeof value == "function") {
    return value;
  }
  if (value == null) {
    return identity_default;
  }
  if (typeof value == "object") {
    return isArray_default(value) ? baseMatchesProperty_default(value[0], value[1]) : baseMatches_default(value);
  }
  return property_default(value);
}
var baseIteratee_default = baseIteratee;

// node_modules/lodash-es/_createBaseFor.js
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var createBaseFor_default = createBaseFor;

// node_modules/lodash-es/_baseFor.js
var baseFor = createBaseFor_default();
var baseFor_default = baseFor;

// node_modules/lodash-es/_baseForOwn.js
function baseForOwn(object, iteratee) {
  return object && baseFor_default(object, iteratee, keys_default);
}
var baseForOwn_default = baseForOwn;

// node_modules/lodash-es/_createBaseEach.js
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_default(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}
var createBaseEach_default = createBaseEach;

// node_modules/lodash-es/_baseEach.js
var baseEach = createBaseEach_default(baseForOwn_default);
var baseEach_default = baseEach;

// node_modules/lodash-es/_arrayIncludesWith.js
function arrayIncludesWith(array, value, comparator) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}
var arrayIncludesWith_default = arrayIncludesWith;

// node_modules/lodash-es/_baseFilter.js
function baseFilter(collection, predicate) {
  var result = [];
  baseEach_default(collection, function(value, index, collection2) {
    if (predicate(value, index, collection2)) {
      result.push(value);
    }
  });
  return result;
}
var baseFilter_default = baseFilter;

// node_modules/lodash-es/filter.js
function filter(collection, predicate) {
  var func = isArray_default(collection) ? arrayFilter_default : baseFilter_default;
  return func(collection, baseIteratee_default(predicate, 3));
}
var filter_default = filter;

// node_modules/lodash-es/_baseMap.js
function baseMap(collection, iteratee) {
  var index = -1, result = isArrayLike_default(collection) ? Array(collection.length) : [];
  baseEach_default(collection, function(value, key, collection2) {
    result[++index] = iteratee(value, key, collection2);
  });
  return result;
}
var baseMap_default = baseMap;

// node_modules/lodash-es/map.js
function map(collection, iteratee) {
  var func = isArray_default(collection) ? arrayMap_default : baseMap_default;
  return func(collection, baseIteratee_default(iteratee, 3));
}
var map_default = map;

// node_modules/lodash-es/isString.js
var stringTag3 = "[object String]";
function isString(value) {
  return typeof value == "string" || !isArray_default(value) && isObjectLike_default(value) && baseGetTag_default(value) == stringTag3;
}
var isString_default = isString;

// node_modules/lodash-es/_baseValues.js
function baseValues(object, props) {
  return arrayMap_default(props, function(key) {
    return object[key];
  });
}
var baseValues_default = baseValues;

// node_modules/lodash-es/values.js
function values(object) {
  return object == null ? [] : baseValues_default(object, keys_default(object));
}
var values_default = values;

// node_modules/lodash-es/includes.js
var nativeMax = Math.max;
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike_default(collection) ? collection : values_default(collection);
  fromIndex = fromIndex && !guard ? toInteger_default(fromIndex) : 0;
  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString_default(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf_default(collection, value, fromIndex) > -1;
}
var includes_default = includes;

// node_modules/lodash-es/isEmpty.js
var mapTag4 = "[object Map]";
var setTag4 = "[object Set]";
var objectProto13 = Object.prototype;
var hasOwnProperty10 = objectProto13.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike_default(value) && (isArray_default(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer_default(value) || isTypedArray_default(value) || isArguments_default(value))) {
    return !value.length;
  }
  var tag = getTag_default(value);
  if (tag == mapTag4 || tag == setTag4) {
    return !value.size;
  }
  if (isPrototype_default(value)) {
    return !baseKeys_default(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty10.call(value, key)) {
      return false;
    }
  }
  return true;
}
var isEmpty_default = isEmpty;

// node_modules/lodash-es/isUndefined.js
function isUndefined(value) {
  return value === void 0;
}
var isUndefined_default = isUndefined;

// node_modules/lodash-es/_createSet.js
var INFINITY4 = 1 / 0;
var createSet = !(Set_default && 1 / setToArray_default(new Set_default([, -0]))[1] == INFINITY4) ? noop_default : function(values2) {
  return new Set_default(values2);
};
var createSet_default = createSet;

// node_modules/lodash-es/_baseUniq.js
var LARGE_ARRAY_SIZE2 = 200;
function baseUniq(array, iteratee, comparator) {
  var index = -1, includes2 = arrayIncludes_default, length = array.length, isCommon = true, result = [], seen = result;
  if (comparator) {
    isCommon = false;
    includes2 = arrayIncludesWith_default;
  } else if (length >= LARGE_ARRAY_SIZE2) {
    var set = iteratee ? null : createSet_default(array);
    if (set) {
      return setToArray_default(set);
    }
    isCommon = false;
    includes2 = cacheHas_default;
    seen = new SetCache_default();
  } else {
    seen = iteratee ? [] : result;
  }
  outer:
    while (++index < length) {
      var value = array[index], computed = iteratee ? iteratee(value) : value;
      value = comparator || value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var seenIndex = seen.length;
        while (seenIndex--) {
          if (seen[seenIndex] === computed) {
            continue outer;
          }
        }
        if (iteratee) {
          seen.push(computed);
        }
        result.push(value);
      } else if (!includes2(seen, computed, comparator)) {
        if (seen !== result) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
  return result;
}
var baseUniq_default = baseUniq;

// node_modules/lodash-es/uniq.js
function uniq(array) {
  return array && array.length ? baseUniq_default(array) : [];
}
var uniq_default = uniq;

// src/common/config.ts
var import_coc15 = require("coc.nvim");

// src/common/constant.ts
var EXT_NAME = "coc-translate";
var CONFIG_NAME = "translate";

// src/common/config.ts
var defaultConfig = {
  enable: true,
  logLevel: "debug",
  timeout: 5e3,
  providers: ["aws", "google"],
  proxy: "",
  aws: {
    formality: "none",
    sourceLanguageCode: "auto",
    targetLanguageCode: "en"
  },
  google: {
    host: "translate.googleapis.com",
    sourceLanguageCode: "auto",
    targetLanguageCode: "en"
  }
};
var ConfigManager = class {
  constructor() {
    this.cfg = defaultConfig;
    this.disposables = [];
    import_coc15.workspace.onDidChangeConfiguration(
      (ev) => {
        if (ev.affectsConfiguration(CONFIG_NAME)) {
          this.update();
        }
      },
      null,
      this.disposables
    );
    this.update();
  }
  dispose() {
    for (const d of this.disposables) {
      d.dispose();
    }
  }
  update() {
    const configuration = import_coc15.workspace.getConfiguration(CONFIG_NAME);
    this.cfg.enable = configuration.get("enable", defaultConfig.enable);
    this.cfg.logLevel = configuration.get("logLevel", defaultConfig.logLevel);
    this.cfg.timeout = configuration.get("timeout", defaultConfig.timeout);
    this.cfg.providers = configuration.get("providers", defaultConfig.providers);
    this.cfg.proxy = configuration.get("proxy", defaultConfig.proxy);
    this.cfg.aws.formality = configuration.get("aws.formality", defaultConfig.aws.formality);
    this.cfg.aws.sourceLanguageCode = configuration.get(
      "aws.sourceLanguageCode",
      defaultConfig.aws.sourceLanguageCode
    );
    this.cfg.aws.targetLanguageCode = configuration.get(
      "aws.targetLanguageCode",
      defaultConfig.aws.targetLanguageCode
    );
    this.cfg.google.host = configuration.get("google.host", defaultConfig.google.host);
    this.cfg.google.sourceLanguageCode = configuration.get(
      "google.sourceLanguageCode",
      defaultConfig.google.sourceLanguageCode
    );
    this.cfg.google.targetLanguageCode = configuration.get(
      "google.targetLanguageCode",
      defaultConfig.google.targetLanguageCode
    );
  }
};

// node_modules/@sindresorhus/is/dist/index.js
var typedArrayTypeNames = [
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "BigInt64Array",
  "BigUint64Array"
];
function isTypedArrayName(name) {
  return typedArrayTypeNames.includes(name);
}
var objectTypeNames = [
  "Function",
  "Generator",
  "AsyncGenerator",
  "GeneratorFunction",
  "AsyncGeneratorFunction",
  "AsyncFunction",
  "Observable",
  "Array",
  "Buffer",
  "Blob",
  "Object",
  "RegExp",
  "Date",
  "Error",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "WeakRef",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Promise",
  "URL",
  "FormData",
  "URLSearchParams",
  "HTMLElement",
  "NaN",
  ...typedArrayTypeNames
];
function isObjectTypeName(name) {
  return objectTypeNames.includes(name);
}
var primitiveTypeNames = [
  "null",
  "undefined",
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol"
];
function isPrimitiveTypeName(name) {
  return primitiveTypeNames.includes(name);
}
function isOfType(type) {
  return (value) => typeof value === type;
}
var { toString: toString2 } = Object.prototype;
var getObjectType = (value) => {
  const objectTypeName = toString2.call(value).slice(8, -1);
  if (/HTML\w+Element/.test(objectTypeName) && is.domElement(value)) {
    return "HTMLElement";
  }
  if (isObjectTypeName(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
};
var isObjectOfType = (type) => (value) => getObjectType(value) === type;
function is(value) {
  if (value === null) {
    return "null";
  }
  switch (typeof value) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(value) ? "NaN" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "Function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    default:
  }
  if (is.observable(value)) {
    return "Observable";
  }
  if (is.array(value)) {
    return "Array";
  }
  if (is.buffer(value)) {
    return "Buffer";
  }
  const tagType = getObjectType(value);
  if (tagType) {
    return tagType;
  }
  if (value instanceof String || value instanceof Boolean || value instanceof Number) {
    throw new TypeError("Please don't use object wrappers for primitive types");
  }
  return "Object";
}
is.undefined = isOfType("undefined");
is.string = isOfType("string");
var isNumberType = isOfType("number");
is.number = (value) => isNumberType(value) && !is.nan(value);
is.bigint = isOfType("bigint");
is.function_ = isOfType("function");
is.null_ = (value) => value === null;
is.class_ = (value) => is.function_(value) && value.toString().startsWith("class ");
is.boolean = (value) => value === true || value === false;
is.symbol = isOfType("symbol");
is.numericString = (value) => is.string(value) && !is.emptyStringOrWhitespace(value) && !Number.isNaN(Number(value));
is.array = (value, assertion) => {
  if (!Array.isArray(value)) {
    return false;
  }
  if (!is.function_(assertion)) {
    return true;
  }
  return value.every((element) => assertion(element));
};
is.buffer = (value) => {
  var _a, _b, _c;
  return (_c = (_b = (_a = value == null ? void 0 : value.constructor) == null ? void 0 : _a.isBuffer) == null ? void 0 : _b.call(_a, value)) != null ? _c : false;
};
is.blob = (value) => isObjectOfType("Blob")(value);
is.nullOrUndefined = (value) => is.null_(value) || is.undefined(value);
is.object = (value) => !is.null_(value) && (typeof value === "object" || is.function_(value));
is.iterable = (value) => is.function_(value == null ? void 0 : value[Symbol.iterator]);
is.asyncIterable = (value) => is.function_(value == null ? void 0 : value[Symbol.asyncIterator]);
is.generator = (value) => is.iterable(value) && is.function_(value == null ? void 0 : value.next) && is.function_(value == null ? void 0 : value.throw);
is.asyncGenerator = (value) => is.asyncIterable(value) && is.function_(value.next) && is.function_(value.throw);
is.nativePromise = (value) => isObjectOfType("Promise")(value);
var hasPromiseApi = (value) => is.function_(value == null ? void 0 : value.then) && is.function_(value == null ? void 0 : value.catch);
is.promise = (value) => is.nativePromise(value) || hasPromiseApi(value);
is.generatorFunction = isObjectOfType("GeneratorFunction");
is.asyncGeneratorFunction = (value) => getObjectType(value) === "AsyncGeneratorFunction";
is.asyncFunction = (value) => getObjectType(value) === "AsyncFunction";
is.boundFunction = (value) => is.function_(value) && !value.hasOwnProperty("prototype");
is.regExp = isObjectOfType("RegExp");
is.date = isObjectOfType("Date");
is.error = isObjectOfType("Error");
is.map = (value) => isObjectOfType("Map")(value);
is.set = (value) => isObjectOfType("Set")(value);
is.weakMap = (value) => isObjectOfType("WeakMap")(value);
is.weakSet = (value) => isObjectOfType("WeakSet")(value);
is.weakRef = (value) => isObjectOfType("WeakRef")(value);
is.int8Array = isObjectOfType("Int8Array");
is.uint8Array = isObjectOfType("Uint8Array");
is.uint8ClampedArray = isObjectOfType("Uint8ClampedArray");
is.int16Array = isObjectOfType("Int16Array");
is.uint16Array = isObjectOfType("Uint16Array");
is.int32Array = isObjectOfType("Int32Array");
is.uint32Array = isObjectOfType("Uint32Array");
is.float32Array = isObjectOfType("Float32Array");
is.float64Array = isObjectOfType("Float64Array");
is.bigInt64Array = isObjectOfType("BigInt64Array");
is.bigUint64Array = isObjectOfType("BigUint64Array");
is.arrayBuffer = isObjectOfType("ArrayBuffer");
is.sharedArrayBuffer = isObjectOfType("SharedArrayBuffer");
is.dataView = isObjectOfType("DataView");
is.enumCase = (value, targetEnum) => Object.values(targetEnum).includes(value);
is.directInstanceOf = (instance, class_) => Object.getPrototypeOf(instance) === class_.prototype;
is.urlInstance = (value) => isObjectOfType("URL")(value);
is.urlString = (value) => {
  if (!is.string(value)) {
    return false;
  }
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};
is.truthy = (value) => Boolean(value);
is.falsy = (value) => !value;
is.nan = (value) => Number.isNaN(value);
is.primitive = (value) => is.null_(value) || isPrimitiveTypeName(typeof value);
is.integer = (value) => Number.isInteger(value);
is.safeInteger = (value) => Number.isSafeInteger(value);
is.plainObject = (value) => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
};
is.typedArray = (value) => isTypedArrayName(getObjectType(value));
var isValidLength = (value) => is.safeInteger(value) && value >= 0;
is.arrayLike = (value) => !is.nullOrUndefined(value) && !is.function_(value) && isValidLength(value.length);
is.inRange = (value, range) => {
  if (is.number(range)) {
    return value >= Math.min(0, range) && value <= Math.max(range, 0);
  }
  if (is.array(range) && range.length === 2) {
    return value >= Math.min(...range) && value <= Math.max(...range);
  }
  throw new TypeError(`Invalid range: ${JSON.stringify(range)}`);
};
var NODE_TYPE_ELEMENT = 1;
var DOM_PROPERTIES_TO_CHECK = [
  "innerHTML",
  "ownerDocument",
  "style",
  "attributes",
  "nodeValue"
];
is.domElement = (value) => is.object(value) && value.nodeType === NODE_TYPE_ELEMENT && is.string(value.nodeName) && !is.plainObject(value) && DOM_PROPERTIES_TO_CHECK.every((property2) => property2 in value);
is.observable = (value) => {
  var _a, _b;
  if (!value) {
    return false;
  }
  if (value === ((_a = value[Symbol.observable]) == null ? void 0 : _a.call(value))) {
    return true;
  }
  if (value === ((_b = value["@@observable"]) == null ? void 0 : _b.call(value))) {
    return true;
  }
  return false;
};
is.nodeStream = (value) => is.object(value) && is.function_(value.pipe) && !is.observable(value);
is.infinite = (value) => value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY;
var isAbsoluteMod2 = (remainder) => (value) => is.integer(value) && Math.abs(value % 2) === remainder;
is.evenInteger = isAbsoluteMod2(0);
is.oddInteger = isAbsoluteMod2(1);
is.emptyArray = (value) => is.array(value) && value.length === 0;
is.nonEmptyArray = (value) => is.array(value) && value.length > 0;
is.emptyString = (value) => is.string(value) && value.length === 0;
var isWhiteSpaceString = (value) => is.string(value) && !/\S/.test(value);
is.emptyStringOrWhitespace = (value) => is.emptyString(value) || isWhiteSpaceString(value);
is.nonEmptyString = (value) => is.string(value) && value.length > 0;
is.nonEmptyStringAndNotWhitespace = (value) => is.string(value) && !is.emptyStringOrWhitespace(value);
is.emptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0;
is.nonEmptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length > 0;
is.emptySet = (value) => is.set(value) && value.size === 0;
is.nonEmptySet = (value) => is.set(value) && value.size > 0;
is.emptyMap = (value) => is.map(value) && value.size === 0;
is.nonEmptyMap = (value) => is.map(value) && value.size > 0;
is.propertyKey = (value) => is.any([is.string, is.number, is.symbol], value);
is.formData = (value) => isObjectOfType("FormData")(value);
is.urlSearchParams = (value) => isObjectOfType("URLSearchParams")(value);
var predicateOnArray = (method, predicate, values2) => {
  if (!is.function_(predicate)) {
    throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
  }
  if (values2.length === 0) {
    throw new TypeError("Invalid number of values");
  }
  return method.call(values2, predicate);
};
is.any = (predicate, ...values2) => {
  const predicates = is.array(predicate) ? predicate : [predicate];
  return predicates.some((singlePredicate) => predicateOnArray(Array.prototype.some, singlePredicate, values2));
};
is.all = (predicate, ...values2) => predicateOnArray(Array.prototype.every, predicate, values2);
var assertType = (condition, description, value, options = {}) => {
  if (!condition) {
    const { multipleValues } = options;
    const valuesMessage = multipleValues ? `received values of types ${[
      ...new Set(value.map((singleValue) => `\`${is(singleValue)}\``))
    ].join(", ")}` : `received value of type \`${is(value)}\``;
    throw new TypeError(`Expected value which is \`${description}\`, ${valuesMessage}.`);
  }
};
var assert = {
  undefined: (value) => assertType(is.undefined(value), "undefined", value),
  string: (value) => assertType(is.string(value), "string", value),
  number: (value) => assertType(is.number(value), "number", value),
  bigint: (value) => assertType(is.bigint(value), "bigint", value),
  function_: (value) => assertType(is.function_(value), "Function", value),
  null_: (value) => assertType(is.null_(value), "null", value),
  class_: (value) => assertType(is.class_(value), "Class", value),
  boolean: (value) => assertType(is.boolean(value), "boolean", value),
  symbol: (value) => assertType(is.symbol(value), "symbol", value),
  numericString: (value) => assertType(is.numericString(value), "string with a number", value),
  array: (value, assertion) => {
    const assert2 = assertType;
    assert2(is.array(value), "Array", value);
    if (assertion) {
      value.forEach(assertion);
    }
  },
  buffer: (value) => assertType(is.buffer(value), "Buffer", value),
  blob: (value) => assertType(is.blob(value), "Blob", value),
  nullOrUndefined: (value) => assertType(is.nullOrUndefined(value), "null or undefined", value),
  object: (value) => assertType(is.object(value), "Object", value),
  iterable: (value) => assertType(is.iterable(value), "Iterable", value),
  asyncIterable: (value) => assertType(is.asyncIterable(value), "AsyncIterable", value),
  generator: (value) => assertType(is.generator(value), "Generator", value),
  asyncGenerator: (value) => assertType(is.asyncGenerator(value), "AsyncGenerator", value),
  nativePromise: (value) => assertType(is.nativePromise(value), "native Promise", value),
  promise: (value) => assertType(is.promise(value), "Promise", value),
  generatorFunction: (value) => assertType(is.generatorFunction(value), "GeneratorFunction", value),
  asyncGeneratorFunction: (value) => assertType(is.asyncGeneratorFunction(value), "AsyncGeneratorFunction", value),
  asyncFunction: (value) => assertType(is.asyncFunction(value), "AsyncFunction", value),
  boundFunction: (value) => assertType(is.boundFunction(value), "Function", value),
  regExp: (value) => assertType(is.regExp(value), "RegExp", value),
  date: (value) => assertType(is.date(value), "Date", value),
  error: (value) => assertType(is.error(value), "Error", value),
  map: (value) => assertType(is.map(value), "Map", value),
  set: (value) => assertType(is.set(value), "Set", value),
  weakMap: (value) => assertType(is.weakMap(value), "WeakMap", value),
  weakSet: (value) => assertType(is.weakSet(value), "WeakSet", value),
  weakRef: (value) => assertType(is.weakRef(value), "WeakRef", value),
  int8Array: (value) => assertType(is.int8Array(value), "Int8Array", value),
  uint8Array: (value) => assertType(is.uint8Array(value), "Uint8Array", value),
  uint8ClampedArray: (value) => assertType(is.uint8ClampedArray(value), "Uint8ClampedArray", value),
  int16Array: (value) => assertType(is.int16Array(value), "Int16Array", value),
  uint16Array: (value) => assertType(is.uint16Array(value), "Uint16Array", value),
  int32Array: (value) => assertType(is.int32Array(value), "Int32Array", value),
  uint32Array: (value) => assertType(is.uint32Array(value), "Uint32Array", value),
  float32Array: (value) => assertType(is.float32Array(value), "Float32Array", value),
  float64Array: (value) => assertType(is.float64Array(value), "Float64Array", value),
  bigInt64Array: (value) => assertType(is.bigInt64Array(value), "BigInt64Array", value),
  bigUint64Array: (value) => assertType(is.bigUint64Array(value), "BigUint64Array", value),
  arrayBuffer: (value) => assertType(is.arrayBuffer(value), "ArrayBuffer", value),
  sharedArrayBuffer: (value) => assertType(is.sharedArrayBuffer(value), "SharedArrayBuffer", value),
  dataView: (value) => assertType(is.dataView(value), "DataView", value),
  enumCase: (value, targetEnum) => assertType(is.enumCase(value, targetEnum), "EnumCase", value),
  urlInstance: (value) => assertType(is.urlInstance(value), "URL", value),
  urlString: (value) => assertType(is.urlString(value), "string with a URL", value),
  truthy: (value) => assertType(is.truthy(value), "truthy", value),
  falsy: (value) => assertType(is.falsy(value), "falsy", value),
  nan: (value) => assertType(is.nan(value), "NaN", value),
  primitive: (value) => assertType(is.primitive(value), "primitive", value),
  integer: (value) => assertType(is.integer(value), "integer", value),
  safeInteger: (value) => assertType(is.safeInteger(value), "integer", value),
  plainObject: (value) => assertType(is.plainObject(value), "plain object", value),
  typedArray: (value) => assertType(is.typedArray(value), "TypedArray", value),
  arrayLike: (value) => assertType(is.arrayLike(value), "array-like", value),
  domElement: (value) => assertType(is.domElement(value), "HTMLElement", value),
  observable: (value) => assertType(is.observable(value), "Observable", value),
  nodeStream: (value) => assertType(is.nodeStream(value), "Node.js Stream", value),
  infinite: (value) => assertType(is.infinite(value), "infinite number", value),
  emptyArray: (value) => assertType(is.emptyArray(value), "empty array", value),
  nonEmptyArray: (value) => assertType(is.nonEmptyArray(value), "non-empty array", value),
  emptyString: (value) => assertType(is.emptyString(value), "empty string", value),
  emptyStringOrWhitespace: (value) => assertType(is.emptyStringOrWhitespace(value), "empty string or whitespace", value),
  nonEmptyString: (value) => assertType(is.nonEmptyString(value), "non-empty string", value),
  nonEmptyStringAndNotWhitespace: (value) => assertType(is.nonEmptyStringAndNotWhitespace(value), "non-empty string and not whitespace", value),
  emptyObject: (value) => assertType(is.emptyObject(value), "empty object", value),
  nonEmptyObject: (value) => assertType(is.nonEmptyObject(value), "non-empty object", value),
  emptySet: (value) => assertType(is.emptySet(value), "empty set", value),
  nonEmptySet: (value) => assertType(is.nonEmptySet(value), "non-empty set", value),
  emptyMap: (value) => assertType(is.emptyMap(value), "empty map", value),
  nonEmptyMap: (value) => assertType(is.nonEmptyMap(value), "non-empty map", value),
  propertyKey: (value) => assertType(is.propertyKey(value), "PropertyKey", value),
  formData: (value) => assertType(is.formData(value), "FormData", value),
  urlSearchParams: (value) => assertType(is.urlSearchParams(value), "URLSearchParams", value),
  evenInteger: (value) => assertType(is.evenInteger(value), "even integer", value),
  oddInteger: (value) => assertType(is.oddInteger(value), "odd integer", value),
  directInstanceOf: (instance, class_) => assertType(is.directInstanceOf(instance, class_), "T", instance),
  inRange: (value, range) => assertType(is.inRange(value, range), "in range", value),
  any: (predicate, ...values2) => assertType(is.any(predicate, ...values2), "predicate returns truthy for any value", values2, { multipleValues: true }),
  all: (predicate, ...values2) => assertType(is.all(predicate, ...values2), "predicate returns truthy for all values", values2, { multipleValues: true })
};
Object.defineProperties(is, {
  class: {
    value: is.class_
  },
  function: {
    value: is.function_
  },
  null: {
    value: is.null_
  }
});
Object.defineProperties(assert, {
  class: {
    value: assert.class_
  },
  function: {
    value: assert.function_
  },
  null: {
    value: assert.null_
  }
});
var dist_default = is;

// node_modules/got/dist/source/as-promise/index.js
var import_node_events2 = require("events");

// node_modules/p-cancelable/index.js
var CancelError = class extends Error {
  constructor(reason) {
    super(reason || "Promise was canceled");
    this.name = "CancelError";
  }
  get isCanceled() {
    return true;
  }
};
var PCancelable = class {
  static fn(userFunction) {
    return (...arguments_) => {
      return new PCancelable((resolve, reject, onCancel) => {
        arguments_.push(onCancel);
        userFunction(...arguments_).then(resolve, reject);
      });
    };
  }
  constructor(executor) {
    this._cancelHandlers = [];
    this._isPending = true;
    this._isCanceled = false;
    this._rejectOnCancel = true;
    this._promise = new Promise((resolve, reject) => {
      this._reject = reject;
      const onResolve = (value) => {
        if (!this._isCanceled || !onCancel.shouldReject) {
          this._isPending = false;
          resolve(value);
        }
      };
      const onReject = (error) => {
        this._isPending = false;
        reject(error);
      };
      const onCancel = (handler) => {
        if (!this._isPending) {
          throw new Error("The `onCancel` handler was attached after the promise settled.");
        }
        this._cancelHandlers.push(handler);
      };
      Object.defineProperties(onCancel, {
        shouldReject: {
          get: () => this._rejectOnCancel,
          set: (boolean) => {
            this._rejectOnCancel = boolean;
          }
        }
      });
      executor(onResolve, onReject, onCancel);
    });
  }
  then(onFulfilled, onRejected) {
    return this._promise.then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return this._promise.catch(onRejected);
  }
  finally(onFinally) {
    return this._promise.finally(onFinally);
  }
  cancel(reason) {
    if (!this._isPending || this._isCanceled) {
      return;
    }
    this._isCanceled = true;
    if (this._cancelHandlers.length > 0) {
      try {
        for (const handler of this._cancelHandlers) {
          handler();
        }
      } catch (error) {
        this._reject(error);
        return;
      }
    }
    if (this._rejectOnCancel) {
      this._reject(new CancelError(reason));
    }
  }
  get isCanceled() {
    return this._isCanceled;
  }
};
Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);

// node_modules/got/dist/source/core/errors.js
function isRequest(x) {
  return dist_default.object(x) && "_onResponse" in x;
}
var RequestError = class extends Error {
  constructor(message, error, self2) {
    var _a, _b;
    super(message);
    Object.defineProperty(this, "input", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stack", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "response", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "request", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "timings", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Error.captureStackTrace(this, this.constructor);
    this.name = "RequestError";
    this.code = (_a = error.code) != null ? _a : "ERR_GOT_REQUEST_ERROR";
    this.input = error.input;
    if (isRequest(self2)) {
      Object.defineProperty(this, "request", {
        enumerable: false,
        value: self2
      });
      Object.defineProperty(this, "response", {
        enumerable: false,
        value: self2.response
      });
      this.options = self2.options;
    } else {
      this.options = self2;
    }
    this.timings = (_b = this.request) == null ? void 0 : _b.timings;
    if (dist_default.string(error.stack) && dist_default.string(this.stack)) {
      const indexOfMessage = this.stack.indexOf(this.message) + this.message.length;
      const thisStackTrace = this.stack.slice(indexOfMessage).split("\n").reverse();
      const errorStackTrace = error.stack.slice(error.stack.indexOf(error.message) + error.message.length).split("\n").reverse();
      while (errorStackTrace.length > 0 && errorStackTrace[0] === thisStackTrace[0]) {
        thisStackTrace.shift();
      }
      this.stack = `${this.stack.slice(0, indexOfMessage)}${thisStackTrace.reverse().join("\n")}${errorStackTrace.reverse().join("\n")}`;
    }
  }
};
var MaxRedirectsError = class extends RequestError {
  constructor(request2) {
    super(`Redirected ${request2.options.maxRedirects} times. Aborting.`, {}, request2);
    this.name = "MaxRedirectsError";
    this.code = "ERR_TOO_MANY_REDIRECTS";
  }
};
var HTTPError = class extends RequestError {
  constructor(response) {
    super(`Response code ${response.statusCode} (${response.statusMessage})`, {}, response.request);
    this.name = "HTTPError";
    this.code = "ERR_NON_2XX_3XX_RESPONSE";
  }
};
var CacheError = class extends RequestError {
  constructor(error, request2) {
    super(error.message, error, request2);
    this.name = "CacheError";
    this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_CACHE_ACCESS" : this.code;
  }
};
var UploadError = class extends RequestError {
  constructor(error, request2) {
    super(error.message, error, request2);
    this.name = "UploadError";
    this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_UPLOAD" : this.code;
  }
};
var TimeoutError = class extends RequestError {
  constructor(error, timings, request2) {
    super(error.message, error, request2);
    Object.defineProperty(this, "timings", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "event", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = "TimeoutError";
    this.event = error.event;
    this.timings = timings;
  }
};
var ReadError = class extends RequestError {
  constructor(error, request2) {
    super(error.message, error, request2);
    this.name = "ReadError";
    this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_READING_RESPONSE_STREAM" : this.code;
  }
};
var RetryError = class extends RequestError {
  constructor(request2) {
    super("Retrying", {}, request2);
    this.name = "RetryError";
    this.code = "ERR_RETRYING";
  }
};
var AbortError = class extends RequestError {
  constructor(request2) {
    super("This operation was aborted.", {}, request2);
    this.code = "ERR_ABORTED";
    this.name = "AbortError";
  }
};

// node_modules/got/dist/source/core/index.js
var import_node_process2 = __toESM(require("process"), 1);
var import_node_buffer2 = require("buffer");
var import_node_stream3 = require("stream");
var import_node_url3 = require("url");
var import_node_http2 = __toESM(require("http"), 1);

// node_modules/@szmarczak/http-timer/dist/source/index.js
var import_events2 = require("events");
var import_util11 = require("util");
var import_defer_to_connect = __toESM(require_source(), 1);
var timer = (request2) => {
  if (request2.timings) {
    return request2.timings;
  }
  const timings = {
    start: Date.now(),
    socket: void 0,
    lookup: void 0,
    connect: void 0,
    secureConnect: void 0,
    upload: void 0,
    response: void 0,
    end: void 0,
    error: void 0,
    abort: void 0,
    phases: {
      wait: void 0,
      dns: void 0,
      tcp: void 0,
      tls: void 0,
      request: void 0,
      firstByte: void 0,
      download: void 0,
      total: void 0
    }
  };
  request2.timings = timings;
  const handleError = (origin) => {
    origin.once(import_events2.errorMonitor, () => {
      timings.error = Date.now();
      timings.phases.total = timings.error - timings.start;
    });
  };
  handleError(request2);
  const onAbort = () => {
    timings.abort = Date.now();
    timings.phases.total = timings.abort - timings.start;
  };
  request2.prependOnceListener("abort", onAbort);
  const onSocket = (socket) => {
    timings.socket = Date.now();
    timings.phases.wait = timings.socket - timings.start;
    if (import_util11.types.isProxy(socket)) {
      return;
    }
    const lookupListener = () => {
      timings.lookup = Date.now();
      timings.phases.dns = timings.lookup - timings.socket;
    };
    socket.prependOnceListener("lookup", lookupListener);
    (0, import_defer_to_connect.default)(socket, {
      connect: () => {
        timings.connect = Date.now();
        if (timings.lookup === void 0) {
          socket.removeListener("lookup", lookupListener);
          timings.lookup = timings.connect;
          timings.phases.dns = timings.lookup - timings.socket;
        }
        timings.phases.tcp = timings.connect - timings.lookup;
      },
      secureConnect: () => {
        timings.secureConnect = Date.now();
        timings.phases.tls = timings.secureConnect - timings.connect;
      }
    });
  };
  if (request2.socket) {
    onSocket(request2.socket);
  } else {
    request2.prependOnceListener("socket", onSocket);
  }
  const onUpload = () => {
    var _a;
    timings.upload = Date.now();
    timings.phases.request = timings.upload - ((_a = timings.secureConnect) != null ? _a : timings.connect);
  };
  if (request2.writableFinished) {
    onUpload();
  } else {
    request2.prependOnceListener("finish", onUpload);
  }
  request2.prependOnceListener("response", (response) => {
    timings.response = Date.now();
    timings.phases.firstByte = timings.response - timings.upload;
    response.timings = timings;
    handleError(response);
    response.prependOnceListener("end", () => {
      request2.off("abort", onAbort);
      response.off("aborted", onAbort);
      if (timings.phases.total) {
        return;
      }
      timings.end = Date.now();
      timings.phases.download = timings.end - timings.response;
      timings.phases.total = timings.end - timings.start;
    });
    response.prependOnceListener("aborted", onAbort);
  });
  return timings;
};
var source_default = timer;

// node_modules/cacheable-request/dist/index.js
var import_node_events = __toESM(require("events"), 1);
var import_node_url = __toESM(require("url"), 1);
var import_node_crypto = __toESM(require("crypto"), 1);
var import_node_stream2 = __toESM(require("stream"), 1);

// node_modules/normalize-url/index.js
var DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
var DATA_URL_DEFAULT_CHARSET = "us-ascii";
var testParameter = (name, filters) => filters.some((filter2) => filter2 instanceof RegExp ? filter2.test(name) : filter2 === name);
var normalizeDataURL = (urlString, { stripHash }) => {
  const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);
  if (!match) {
    throw new Error(`Invalid URL: ${urlString}`);
  }
  let { type, data, hash } = match.groups;
  const mediaType = type.split(";");
  hash = stripHash ? "" : hash;
  let isBase64 = false;
  if (mediaType[mediaType.length - 1] === "base64") {
    mediaType.pop();
    isBase64 = true;
  }
  const mimeType = (mediaType.shift() || "").toLowerCase();
  const attributes = mediaType.map((attribute) => {
    let [key, value = ""] = attribute.split("=").map((string) => string.trim());
    if (key === "charset") {
      value = value.toLowerCase();
      if (value === DATA_URL_DEFAULT_CHARSET) {
        return "";
      }
    }
    return `${key}${value ? `=${value}` : ""}`;
  }).filter(Boolean);
  const normalizedMediaType = [
    ...attributes
  ];
  if (isBase64) {
    normalizedMediaType.push("base64");
  }
  if (normalizedMediaType.length > 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) {
    normalizedMediaType.unshift(mimeType);
  }
  return `data:${normalizedMediaType.join(";")},${isBase64 ? data.trim() : data}${hash ? `#${hash}` : ""}`;
};
function normalizeUrl(urlString, options) {
  options = {
    defaultProtocol: "http:",
    normalizeProtocol: true,
    forceHttp: false,
    forceHttps: false,
    stripAuthentication: true,
    stripHash: false,
    stripTextFragment: true,
    stripWWW: true,
    removeQueryParameters: [/^utm_\w+/i],
    removeTrailingSlash: true,
    removeSingleSlash: true,
    removeDirectoryIndex: false,
    removeExplicitPort: false,
    sortQueryParameters: true,
    ...options
  };
  urlString = urlString.trim();
  if (/^data:/i.test(urlString)) {
    return normalizeDataURL(urlString, options);
  }
  if (/^view-source:/i.test(urlString)) {
    throw new Error("`view-source:` is not supported as it is a non-standard protocol");
  }
  const hasRelativeProtocol = urlString.startsWith("//");
  const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);
  if (!isRelativeUrl) {
    urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
  }
  const urlObject = new URL(urlString);
  if (options.forceHttp && options.forceHttps) {
    throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
  }
  if (options.forceHttp && urlObject.protocol === "https:") {
    urlObject.protocol = "http:";
  }
  if (options.forceHttps && urlObject.protocol === "http:") {
    urlObject.protocol = "https:";
  }
  if (options.stripAuthentication) {
    urlObject.username = "";
    urlObject.password = "";
  }
  if (options.stripHash) {
    urlObject.hash = "";
  } else if (options.stripTextFragment) {
    urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, "");
  }
  if (urlObject.pathname) {
    const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
    let lastIndex = 0;
    let result = "";
    for (; ; ) {
      const match = protocolRegex.exec(urlObject.pathname);
      if (!match) {
        break;
      }
      const protocol = match[0];
      const protocolAtIndex = match.index;
      const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);
      result += intermediate.replace(/\/{2,}/g, "/");
      result += protocol;
      lastIndex = protocolAtIndex + protocol.length;
    }
    const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
    result += remnant.replace(/\/{2,}/g, "/");
    urlObject.pathname = result;
  }
  if (urlObject.pathname) {
    try {
      urlObject.pathname = decodeURI(urlObject.pathname);
    } catch {
    }
  }
  if (options.removeDirectoryIndex === true) {
    options.removeDirectoryIndex = [/^index\.[a-z]+$/];
  }
  if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
    let pathComponents = urlObject.pathname.split("/");
    const lastComponent = pathComponents[pathComponents.length - 1];
    if (testParameter(lastComponent, options.removeDirectoryIndex)) {
      pathComponents = pathComponents.slice(0, -1);
      urlObject.pathname = pathComponents.slice(1).join("/") + "/";
    }
  }
  if (urlObject.hostname) {
    urlObject.hostname = urlObject.hostname.replace(/\.$/, "");
    if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) {
      urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
    }
  }
  if (Array.isArray(options.removeQueryParameters)) {
    for (const key of [...urlObject.searchParams.keys()]) {
      if (testParameter(key, options.removeQueryParameters)) {
        urlObject.searchParams.delete(key);
      }
    }
  }
  if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) {
    urlObject.search = "";
  }
  if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
    for (const key of [...urlObject.searchParams.keys()]) {
      if (!testParameter(key, options.keepQueryParameters)) {
        urlObject.searchParams.delete(key);
      }
    }
  }
  if (options.sortQueryParameters) {
    urlObject.searchParams.sort();
    try {
      urlObject.search = decodeURIComponent(urlObject.search);
    } catch {
    }
  }
  if (options.removeTrailingSlash) {
    urlObject.pathname = urlObject.pathname.replace(/\/$/, "");
  }
  if (options.removeExplicitPort && urlObject.port) {
    urlObject.port = "";
  }
  const oldUrlString = urlString;
  urlString = urlObject.toString();
  if (!options.removeSingleSlash && urlObject.pathname === "/" && !oldUrlString.endsWith("/") && urlObject.hash === "") {
    urlString = urlString.replace(/\/$/, "");
  }
  if ((options.removeTrailingSlash || urlObject.pathname === "/") && urlObject.hash === "" && options.removeSingleSlash) {
    urlString = urlString.replace(/\/$/, "");
  }
  if (hasRelativeProtocol && !options.normalizeProtocol) {
    urlString = urlString.replace(/^http:\/\//, "//");
  }
  if (options.stripProtocol) {
    urlString = urlString.replace(/^(?:https?:)?\/\//, "");
  }
  return urlString;
}

// node_modules/cacheable-request/dist/index.js
var import_get_stream = __toESM(require_get_stream(), 1);
var import_http_cache_semantics = __toESM(require_http_cache_semantics(), 1);

// node_modules/responselike/index.js
var import_node_stream = require("stream");

// node_modules/lowercase-keys/index.js
function lowercaseKeys(object) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key.toLowerCase(), value]));
}

// node_modules/responselike/index.js
var Response = class extends import_node_stream.Readable {
  constructor({ statusCode, headers, body, url: url2 }) {
    if (typeof statusCode !== "number") {
      throw new TypeError("Argument `statusCode` should be a number");
    }
    if (typeof headers !== "object") {
      throw new TypeError("Argument `headers` should be an object");
    }
    if (!(body instanceof Uint8Array)) {
      throw new TypeError("Argument `body` should be a buffer");
    }
    if (typeof url2 !== "string") {
      throw new TypeError("Argument `url` should be a string");
    }
    super({
      read() {
        this.push(body);
        this.push(null);
      }
    });
    __publicField(this, "statusCode");
    __publicField(this, "headers");
    __publicField(this, "body");
    __publicField(this, "url");
    this.statusCode = statusCode;
    this.headers = lowercaseKeys(headers);
    this.body = body;
    this.url = url2;
  }
};

// node_modules/cacheable-request/dist/index.js
var import_keyv = __toESM(require_src(), 1);

// node_modules/cacheable-request/node_modules/mimic-response/index.js
var knownProperties = [
  "aborted",
  "complete",
  "headers",
  "httpVersion",
  "httpVersionMinor",
  "httpVersionMajor",
  "method",
  "rawHeaders",
  "rawTrailers",
  "setTimeout",
  "socket",
  "statusCode",
  "statusMessage",
  "trailers",
  "url"
];
function mimicResponse(fromStream, toStream) {
  if (toStream._readableState.autoDestroy) {
    throw new Error("The second stream must have the `autoDestroy` option set to `false`");
  }
  const fromProperties = /* @__PURE__ */ new Set([...Object.keys(fromStream), ...knownProperties]);
  const properties = {};
  for (const property2 of fromProperties) {
    if (property2 in toStream) {
      continue;
    }
    properties[property2] = {
      get() {
        const value = fromStream[property2];
        const isFunction4 = typeof value === "function";
        return isFunction4 ? value.bind(fromStream) : value;
      },
      set(value) {
        fromStream[property2] = value;
      },
      enumerable: true,
      configurable: false
    };
  }
  Object.defineProperties(toStream, properties);
  fromStream.once("aborted", () => {
    toStream.destroy();
    toStream.emit("aborted");
  });
  fromStream.once("close", () => {
    if (fromStream.complete) {
      if (toStream.readable) {
        toStream.once("end", () => {
          toStream.emit("close");
        });
      } else {
        toStream.emit("close");
      }
    } else {
      toStream.emit("close");
    }
  });
  return toStream;
}

// node_modules/cacheable-request/dist/types.js
var RequestError2 = class extends Error {
  constructor(error) {
    super(error.message);
    Object.assign(this, error);
  }
};
var CacheError2 = class extends Error {
  constructor(error) {
    super(error.message);
    Object.assign(this, error);
  }
};

// node_modules/cacheable-request/dist/index.js
var CacheableRequest = class {
  constructor(cacheRequest, cacheAdapter) {
    this.hooks = /* @__PURE__ */ new Map();
    this.request = () => (options, cb) => {
      var _a;
      let url2;
      if (typeof options === "string") {
        url2 = normalizeUrlObject(import_node_url.default.parse(options));
        options = {};
      } else if (options instanceof import_node_url.default.URL) {
        url2 = normalizeUrlObject(import_node_url.default.parse(options.toString()));
        options = {};
      } else {
        const [pathname, ...searchParts] = ((_a = options.path) != null ? _a : "").split("?");
        const search = searchParts.length > 0 ? `?${searchParts.join("?")}` : "";
        url2 = normalizeUrlObject({ ...options, pathname, search });
      }
      options = {
        headers: {},
        method: "GET",
        cache: true,
        strictTtl: false,
        automaticFailover: false,
        ...options,
        ...urlObjectToRequestOptions(url2)
      };
      options.headers = Object.fromEntries(entries(options.headers).map(([key2, value]) => [key2.toLowerCase(), value]));
      const ee = new import_node_events.default();
      const normalizedUrlString = normalizeUrl(import_node_url.default.format(url2), {
        stripWWW: false,
        removeTrailingSlash: false,
        stripAuthentication: false
      });
      let key = `${options.method}:${normalizedUrlString}`;
      if (options.body && options.method !== void 0 && ["POST", "PATCH", "PUT"].includes(options.method)) {
        if (options.body instanceof import_node_stream2.default.Readable) {
          options.cache = false;
        } else {
          key += `:${import_node_crypto.default.createHash("md5").update(options.body).digest("hex")}`;
        }
      }
      let revalidate = false;
      let madeRequest = false;
      const makeRequest = (options_) => {
        madeRequest = true;
        let requestErrored = false;
        let requestErrorCallback = () => {
        };
        const requestErrorPromise = new Promise((resolve) => {
          requestErrorCallback = () => {
            if (!requestErrored) {
              requestErrored = true;
              resolve();
            }
          };
        });
        const handler = async (response) => {
          if (revalidate) {
            response.status = response.statusCode;
            const revalidatedPolicy = import_http_cache_semantics.default.fromObject(revalidate.cachePolicy).revalidatedPolicy(options_, response);
            if (!revalidatedPolicy.modified) {
              response.resume();
              await new Promise((resolve) => {
                response.once("end", resolve);
              });
              const headers = convertHeaders(revalidatedPolicy.policy.responseHeaders());
              response = new Response({ statusCode: revalidate.statusCode, headers, body: revalidate.body, url: revalidate.url });
              response.cachePolicy = revalidatedPolicy.policy;
              response.fromCache = true;
            }
          }
          if (!response.fromCache) {
            response.cachePolicy = new import_http_cache_semantics.default(options_, response, options_);
            response.fromCache = false;
          }
          let clonedResponse;
          if (options_.cache && response.cachePolicy.storable()) {
            clonedResponse = cloneResponse(response);
            (async () => {
              try {
                const bodyPromise = import_get_stream.default.buffer(response);
                await Promise.race([
                  requestErrorPromise,
                  new Promise((resolve) => response.once("end", resolve))
                ]);
                const body = await bodyPromise;
                let value = {
                  url: response.url,
                  statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
                  body,
                  cachePolicy: response.cachePolicy.toObject()
                };
                let ttl2 = options_.strictTtl ? response.cachePolicy.timeToLive() : void 0;
                if (options_.maxTtl) {
                  ttl2 = ttl2 ? Math.min(ttl2, options_.maxTtl) : options_.maxTtl;
                }
                if (this.hooks.size > 0) {
                  for (const key_ of this.hooks.keys()) {
                    value = await this.runHook(key_, value, response);
                  }
                }
                await this.cache.set(key, value, ttl2);
              } catch (error) {
                ee.emit("error", new CacheError2(error));
              }
            })();
          } else if (options_.cache && revalidate) {
            (async () => {
              try {
                await this.cache.delete(key);
              } catch (error) {
                ee.emit("error", new CacheError2(error));
              }
            })();
          }
          ee.emit("response", clonedResponse != null ? clonedResponse : response);
          if (typeof cb === "function") {
            cb(clonedResponse != null ? clonedResponse : response);
          }
        };
        try {
          const request_ = this.cacheRequest(options_, handler);
          request_.once("error", requestErrorCallback);
          request_.once("abort", requestErrorCallback);
          ee.emit("request", request_);
        } catch (error) {
          ee.emit("error", new RequestError2(error));
        }
      };
      (async () => {
        const get2 = async (options_) => {
          await Promise.resolve();
          const cacheEntry = options_.cache ? await this.cache.get(key) : void 0;
          if (typeof cacheEntry === "undefined" && !options_.forceRefresh) {
            makeRequest(options_);
            return;
          }
          const policy = import_http_cache_semantics.default.fromObject(cacheEntry.cachePolicy);
          if (policy.satisfiesWithoutRevalidation(options_) && !options_.forceRefresh) {
            const headers = convertHeaders(policy.responseHeaders());
            const response = new Response({ statusCode: cacheEntry.statusCode, headers, body: cacheEntry.body, url: cacheEntry.url });
            response.cachePolicy = policy;
            response.fromCache = true;
            ee.emit("response", response);
            if (typeof cb === "function") {
              cb(response);
            }
          } else if (policy.satisfiesWithoutRevalidation(options_) && Date.now() >= policy.timeToLive() && options_.forceRefresh) {
            await this.cache.delete(key);
            options_.headers = policy.revalidationHeaders(options_);
            makeRequest(options_);
          } else {
            revalidate = cacheEntry;
            options_.headers = policy.revalidationHeaders(options_);
            makeRequest(options_);
          }
        };
        const errorHandler = (error) => ee.emit("error", new CacheError2(error));
        if (this.cache instanceof import_keyv.default) {
          const cachek = this.cache;
          cachek.once("error", errorHandler);
          ee.on("error", () => cachek.removeListener("error", errorHandler));
        }
        try {
          await get2(options);
        } catch (error) {
          if (options.automaticFailover && !madeRequest) {
            makeRequest(options);
          }
          ee.emit("error", new CacheError2(error));
        }
      })();
      return ee;
    };
    this.addHook = (name, fn) => {
      if (!this.hooks.has(name)) {
        this.hooks.set(name, fn);
      }
    };
    this.removeHook = (name) => this.hooks.delete(name);
    this.getHook = (name) => this.hooks.get(name);
    this.runHook = async (name, ...args) => {
      var _a;
      return (_a = this.hooks.get(name)) == null ? void 0 : _a(...args);
    };
    if (cacheAdapter instanceof import_keyv.default) {
      this.cache = cacheAdapter;
    } else if (typeof cacheAdapter === "string") {
      this.cache = new import_keyv.default({
        uri: cacheAdapter,
        namespace: "cacheable-request"
      });
    } else {
      this.cache = new import_keyv.default({
        store: cacheAdapter,
        namespace: "cacheable-request"
      });
    }
    this.request = this.request.bind(this);
    this.cacheRequest = cacheRequest;
  }
};
var entries = Object.entries;
var cloneResponse = (response) => {
  const clone = new import_node_stream2.PassThrough({ autoDestroy: false });
  mimicResponse(response, clone);
  return response.pipe(clone);
};
var urlObjectToRequestOptions = (url2) => {
  const options = { ...url2 };
  options.path = `${url2.pathname || "/"}${url2.search || ""}`;
  delete options.pathname;
  delete options.search;
  return options;
};
var normalizeUrlObject = (url2) => ({
  protocol: url2.protocol,
  auth: url2.auth,
  hostname: url2.hostname || url2.host || "localhost",
  port: url2.port,
  pathname: url2.pathname,
  search: url2.search
});
var convertHeaders = (headers) => {
  const result = [];
  for (const name of Object.keys(headers)) {
    result[name.toLowerCase()] = headers[name];
  }
  return result;
};
var dist_default2 = CacheableRequest;

// node_modules/got/dist/source/core/index.js
var import_decompress_response = __toESM(require_decompress_response(), 1);
var import_get_stream2 = __toESM(require_get_stream(), 1);

// node_modules/form-data-encoder/lib/util/createBoundary.js
var alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
function createBoundary() {
  let size = 16;
  let res = "";
  while (size--) {
    res += alphabet[Math.random() * alphabet.length << 0];
  }
  return res;
}

// node_modules/form-data-encoder/lib/util/normalizeValue.js
var normalizeValue = (value) => String(value).replace(/\r|\n/g, (match, i, str) => {
  if (match === "\r" && str[i + 1] !== "\n" || match === "\n" && str[i - 1] !== "\r") {
    return "\r\n";
  }
  return match;
});

// node_modules/form-data-encoder/lib/util/isPlainObject.js
var getType = (value) => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
function isPlainObject(value) {
  if (getType(value) !== "object") {
    return false;
  }
  const pp = Object.getPrototypeOf(value);
  if (pp === null || pp === void 0) {
    return true;
  }
  const Ctor = pp.constructor && pp.constructor.toString();
  return Ctor === Object.toString();
}

// node_modules/form-data-encoder/lib/util/proxyHeaders.js
function getProperty(target, prop) {
  if (typeof prop === "string") {
    for (const [name, value] of Object.entries(target)) {
      if (prop.toLowerCase() === name.toLowerCase()) {
        return value;
      }
    }
  }
  return void 0;
}
var proxyHeaders = (object) => new Proxy(object, {
  get: (target, prop) => getProperty(target, prop),
  has: (target, prop) => getProperty(target, prop) !== void 0
});

// node_modules/form-data-encoder/lib/util/isFunction.js
var isFunction2 = (value) => typeof value === "function";

// node_modules/form-data-encoder/lib/util/isFormData.js
var isFormData = (value) => Boolean(value && isFunction2(value.constructor) && value[Symbol.toStringTag] === "FormData" && isFunction2(value.append) && isFunction2(value.getAll) && isFunction2(value.entries) && isFunction2(value[Symbol.iterator]));

// node_modules/form-data-encoder/lib/util/escapeName.js
var escapeName = (name) => String(name).replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/"/g, "%22");

// node_modules/form-data-encoder/lib/util/isFile.js
var isFile = (value) => Boolean(value && typeof value === "object" && isFunction2(value.constructor) && value[Symbol.toStringTag] === "File" && isFunction2(value.stream) && value.name != null);

// node_modules/form-data-encoder/lib/FormDataEncoder.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FormDataEncoder_instances;
var _FormDataEncoder_CRLF;
var _FormDataEncoder_CRLF_BYTES;
var _FormDataEncoder_CRLF_BYTES_LENGTH;
var _FormDataEncoder_DASHES;
var _FormDataEncoder_encoder;
var _FormDataEncoder_footer;
var _FormDataEncoder_form;
var _FormDataEncoder_options;
var _FormDataEncoder_getFieldHeader;
var _FormDataEncoder_getContentLength;
var defaultOptions = {
  enableAdditionalHeaders: false
};
var readonlyProp = { writable: false, configurable: false };
var FormDataEncoder = class {
  constructor(form, boundaryOrOptions, options) {
    _FormDataEncoder_instances.add(this);
    _FormDataEncoder_CRLF.set(this, "\r\n");
    _FormDataEncoder_CRLF_BYTES.set(this, void 0);
    _FormDataEncoder_CRLF_BYTES_LENGTH.set(this, void 0);
    _FormDataEncoder_DASHES.set(this, "-".repeat(2));
    _FormDataEncoder_encoder.set(this, new TextEncoder());
    _FormDataEncoder_footer.set(this, void 0);
    _FormDataEncoder_form.set(this, void 0);
    _FormDataEncoder_options.set(this, void 0);
    if (!isFormData(form)) {
      throw new TypeError("Expected first argument to be a FormData instance.");
    }
    let boundary;
    if (isPlainObject(boundaryOrOptions)) {
      options = boundaryOrOptions;
    } else {
      boundary = boundaryOrOptions;
    }
    if (!boundary) {
      boundary = createBoundary();
    }
    if (typeof boundary !== "string") {
      throw new TypeError("Expected boundary argument to be a string.");
    }
    if (options && !isPlainObject(options)) {
      throw new TypeError("Expected options argument to be an object.");
    }
    __classPrivateFieldSet(this, _FormDataEncoder_form, Array.from(form.entries()), "f");
    __classPrivateFieldSet(this, _FormDataEncoder_options, { ...defaultOptions, ...options }, "f");
    __classPrivateFieldSet(this, _FormDataEncoder_CRLF_BYTES, __classPrivateFieldGet(this, _FormDataEncoder_encoder, "f").encode(__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f")), "f");
    __classPrivateFieldSet(this, _FormDataEncoder_CRLF_BYTES_LENGTH, __classPrivateFieldGet(this, _FormDataEncoder_CRLF_BYTES, "f").byteLength, "f");
    this.boundary = `form-data-boundary-${boundary}`;
    this.contentType = `multipart/form-data; boundary=${this.boundary}`;
    __classPrivateFieldSet(this, _FormDataEncoder_footer, __classPrivateFieldGet(this, _FormDataEncoder_encoder, "f").encode(`${__classPrivateFieldGet(this, _FormDataEncoder_DASHES, "f")}${this.boundary}${__classPrivateFieldGet(this, _FormDataEncoder_DASHES, "f")}${__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f").repeat(2)}`), "f");
    const headers = {
      "Content-Type": this.contentType
    };
    const contentLength = __classPrivateFieldGet(this, _FormDataEncoder_instances, "m", _FormDataEncoder_getContentLength).call(this);
    if (contentLength) {
      this.contentLength = contentLength;
      headers["Content-Length"] = contentLength;
    }
    this.headers = proxyHeaders(Object.freeze(headers));
    Object.defineProperties(this, {
      boundary: readonlyProp,
      contentType: readonlyProp,
      contentLength: readonlyProp,
      headers: readonlyProp
    });
  }
  getContentLength() {
    return this.contentLength == null ? void 0 : Number(this.contentLength);
  }
  *values() {
    for (const [name, raw] of __classPrivateFieldGet(this, _FormDataEncoder_form, "f")) {
      const value = isFile(raw) ? raw : __classPrivateFieldGet(this, _FormDataEncoder_encoder, "f").encode(normalizeValue(raw));
      yield __classPrivateFieldGet(this, _FormDataEncoder_instances, "m", _FormDataEncoder_getFieldHeader).call(this, name, value);
      yield value;
      yield __classPrivateFieldGet(this, _FormDataEncoder_CRLF_BYTES, "f");
    }
    yield __classPrivateFieldGet(this, _FormDataEncoder_footer, "f");
  }
  async *encode() {
    for (const part of this.values()) {
      if (isFile(part)) {
        yield* part.stream();
      } else {
        yield part;
      }
    }
  }
  [(_FormDataEncoder_CRLF = /* @__PURE__ */ new WeakMap(), _FormDataEncoder_CRLF_BYTES = /* @__PURE__ */ new WeakMap(), _FormDataEncoder_CRLF_BYTES_LENGTH = /* @__PURE__ */ new WeakMap(), _FormDataEncoder_DASHES = /* @__PURE__ */ new WeakMap(), _FormDataEncoder_encoder = /* @__PURE__ */ new WeakMap(), _FormDataEncoder_footer = /* @__PURE__ */ new WeakMap(), _FormDataEncoder_form = /* @__PURE__ */ new WeakMap(), _FormDataEncoder_options = /* @__PURE__ */ new WeakMap(), _FormDataEncoder_instances = /* @__PURE__ */ new WeakSet(), _FormDataEncoder_getFieldHeader = function _FormDataEncoder_getFieldHeader2(name, value) {
    let header = "";
    header += `${__classPrivateFieldGet(this, _FormDataEncoder_DASHES, "f")}${this.boundary}${__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f")}`;
    header += `Content-Disposition: form-data; name="${escapeName(name)}"`;
    if (isFile(value)) {
      header += `; filename="${escapeName(value.name)}"${__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f")}`;
      header += `Content-Type: ${value.type || "application/octet-stream"}`;
    }
    const size = isFile(value) ? value.size : value.byteLength;
    if (__classPrivateFieldGet(this, _FormDataEncoder_options, "f").enableAdditionalHeaders === true && size != null && !isNaN(size)) {
      header += `${__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f")}Content-Length: ${isFile(value) ? value.size : value.byteLength}`;
    }
    return __classPrivateFieldGet(this, _FormDataEncoder_encoder, "f").encode(`${header}${__classPrivateFieldGet(this, _FormDataEncoder_CRLF, "f").repeat(2)}`);
  }, _FormDataEncoder_getContentLength = function _FormDataEncoder_getContentLength2() {
    let length = 0;
    for (const [name, raw] of __classPrivateFieldGet(this, _FormDataEncoder_form, "f")) {
      const value = isFile(raw) ? raw : __classPrivateFieldGet(this, _FormDataEncoder_encoder, "f").encode(normalizeValue(raw));
      const size = isFile(value) ? value.size : value.byteLength;
      if (size == null || isNaN(size)) {
        return void 0;
      }
      length += __classPrivateFieldGet(this, _FormDataEncoder_instances, "m", _FormDataEncoder_getFieldHeader).call(this, name, value).byteLength;
      length += size;
      length += __classPrivateFieldGet(this, _FormDataEncoder_CRLF_BYTES_LENGTH, "f");
    }
    return String(length + __classPrivateFieldGet(this, _FormDataEncoder_footer, "f").byteLength);
  }, Symbol.iterator)]() {
    return this.values();
  }
  [Symbol.asyncIterator]() {
    return this.encode();
  }
};

// node_modules/got/dist/source/core/utils/get-body-size.js
var import_node_buffer = require("buffer");
var import_node_util = require("util");

// node_modules/got/dist/source/core/utils/is-form-data.js
function isFormData2(body) {
  return dist_default.nodeStream(body) && dist_default.function_(body.getBoundary);
}

// node_modules/got/dist/source/core/utils/get-body-size.js
async function getBodySize(body, headers) {
  if (headers && "content-length" in headers) {
    return Number(headers["content-length"]);
  }
  if (!body) {
    return 0;
  }
  if (dist_default.string(body)) {
    return import_node_buffer.Buffer.byteLength(body);
  }
  if (dist_default.buffer(body)) {
    return body.length;
  }
  if (isFormData2(body)) {
    return (0, import_node_util.promisify)(body.getLength.bind(body))();
  }
  return void 0;
}

// node_modules/got/dist/source/core/utils/proxy-events.js
function proxyEvents(from, to, events4) {
  const eventFunctions = {};
  for (const event of events4) {
    const eventFunction = (...args) => {
      to.emit(event, ...args);
    };
    eventFunctions[event] = eventFunction;
    from.on(event, eventFunction);
  }
  return () => {
    for (const [event, eventFunction] of Object.entries(eventFunctions)) {
      from.off(event, eventFunction);
    }
  };
}

// node_modules/got/dist/source/core/timed-out.js
var import_node_net = __toESM(require("net"), 1);

// node_modules/got/dist/source/core/utils/unhandle.js
function unhandle() {
  const handlers = [];
  return {
    once(origin, event, fn) {
      origin.once(event, fn);
      handlers.push({ origin, event, fn });
    },
    unhandleAll() {
      for (const handler of handlers) {
        const { origin, event, fn } = handler;
        origin.removeListener(event, fn);
      }
      handlers.length = 0;
    }
  };
}

// node_modules/got/dist/source/core/timed-out.js
var reentry = Symbol("reentry");
var noop2 = () => {
};
var TimeoutError2 = class extends Error {
  constructor(threshold, event) {
    super(`Timeout awaiting '${event}' for ${threshold}ms`);
    Object.defineProperty(this, "event", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: event
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = "TimeoutError";
    this.code = "ETIMEDOUT";
  }
};
function timedOut(request2, delays, options) {
  if (reentry in request2) {
    return noop2;
  }
  request2[reentry] = true;
  const cancelers = [];
  const { once, unhandleAll } = unhandle();
  const addTimeout = (delay2, callback, event) => {
    var _a;
    const timeout = setTimeout(callback, delay2, delay2, event);
    (_a = timeout.unref) == null ? void 0 : _a.call(timeout);
    const cancel = () => {
      clearTimeout(timeout);
    };
    cancelers.push(cancel);
    return cancel;
  };
  const { host, hostname } = options;
  const timeoutHandler = (delay2, event) => {
    request2.destroy(new TimeoutError2(delay2, event));
  };
  const cancelTimeouts = () => {
    for (const cancel of cancelers) {
      cancel();
    }
    unhandleAll();
  };
  request2.once("error", (error) => {
    cancelTimeouts();
    if (request2.listenerCount("error") === 0) {
      throw error;
    }
  });
  if (typeof delays.request !== "undefined") {
    const cancelTimeout = addTimeout(delays.request, timeoutHandler, "request");
    once(request2, "response", (response) => {
      once(response, "end", cancelTimeout);
    });
  }
  if (typeof delays.socket !== "undefined") {
    const { socket } = delays;
    const socketTimeoutHandler = () => {
      timeoutHandler(socket, "socket");
    };
    request2.setTimeout(socket, socketTimeoutHandler);
    cancelers.push(() => {
      request2.removeListener("timeout", socketTimeoutHandler);
    });
  }
  const hasLookup = typeof delays.lookup !== "undefined";
  const hasConnect = typeof delays.connect !== "undefined";
  const hasSecureConnect = typeof delays.secureConnect !== "undefined";
  const hasSend = typeof delays.send !== "undefined";
  if (hasLookup || hasConnect || hasSecureConnect || hasSend) {
    once(request2, "socket", (socket) => {
      var _a;
      const { socketPath } = request2;
      if (socket.connecting) {
        const hasPath2 = Boolean(socketPath != null ? socketPath : import_node_net.default.isIP((_a = hostname != null ? hostname : host) != null ? _a : "") !== 0);
        if (hasLookup && !hasPath2 && typeof socket.address().address === "undefined") {
          const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, "lookup");
          once(socket, "lookup", cancelTimeout);
        }
        if (hasConnect) {
          const timeConnect = () => addTimeout(delays.connect, timeoutHandler, "connect");
          if (hasPath2) {
            once(socket, "connect", timeConnect());
          } else {
            once(socket, "lookup", (error) => {
              if (error === null) {
                once(socket, "connect", timeConnect());
              }
            });
          }
        }
        if (hasSecureConnect && options.protocol === "https:") {
          once(socket, "connect", () => {
            const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, "secureConnect");
            once(socket, "secureConnect", cancelTimeout);
          });
        }
      }
      if (hasSend) {
        const timeRequest = () => addTimeout(delays.send, timeoutHandler, "send");
        if (socket.connecting) {
          once(socket, "connect", () => {
            once(request2, "upload-complete", timeRequest());
          });
        } else {
          once(request2, "upload-complete", timeRequest());
        }
      }
    });
  }
  if (typeof delays.response !== "undefined") {
    once(request2, "upload-complete", () => {
      const cancelTimeout = addTimeout(delays.response, timeoutHandler, "response");
      once(request2, "response", cancelTimeout);
    });
  }
  if (typeof delays.read !== "undefined") {
    once(request2, "response", (response) => {
      const cancelTimeout = addTimeout(delays.read, timeoutHandler, "read");
      once(response, "end", cancelTimeout);
    });
  }
  return cancelTimeouts;
}

// node_modules/got/dist/source/core/utils/url-to-options.js
function urlToOptions(url2) {
  url2 = url2;
  const options = {
    protocol: url2.protocol,
    hostname: dist_default.string(url2.hostname) && url2.hostname.startsWith("[") ? url2.hostname.slice(1, -1) : url2.hostname,
    host: url2.host,
    hash: url2.hash,
    search: url2.search,
    pathname: url2.pathname,
    href: url2.href,
    path: `${url2.pathname || ""}${url2.search || ""}`
  };
  if (dist_default.string(url2.port) && url2.port.length > 0) {
    options.port = Number(url2.port);
  }
  if (url2.username || url2.password) {
    options.auth = `${url2.username || ""}:${url2.password || ""}`;
  }
  return options;
}

// node_modules/got/dist/source/core/utils/weakable-map.js
var WeakableMap = class {
  constructor() {
    Object.defineProperty(this, "weakMap", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "map", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.weakMap = /* @__PURE__ */ new WeakMap();
    this.map = /* @__PURE__ */ new Map();
  }
  set(key, value) {
    if (typeof key === "object") {
      this.weakMap.set(key, value);
    } else {
      this.map.set(key, value);
    }
  }
  get(key) {
    if (typeof key === "object") {
      return this.weakMap.get(key);
    }
    return this.map.get(key);
  }
  has(key) {
    if (typeof key === "object") {
      return this.weakMap.has(key);
    }
    return this.map.has(key);
  }
};

// node_modules/got/dist/source/core/calculate-retry-delay.js
var calculateRetryDelay = ({ attemptCount, retryOptions, error, retryAfter, computedValue }) => {
  if (error.name === "RetryError") {
    return 1;
  }
  if (attemptCount > retryOptions.limit) {
    return 0;
  }
  const hasMethod = retryOptions.methods.includes(error.options.method);
  const hasErrorCode = retryOptions.errorCodes.includes(error.code);
  const hasStatusCode = error.response && retryOptions.statusCodes.includes(error.response.statusCode);
  if (!hasMethod || !hasErrorCode && !hasStatusCode) {
    return 0;
  }
  if (error.response) {
    if (retryAfter) {
      if (retryAfter > computedValue) {
        return 0;
      }
      return retryAfter;
    }
    if (error.response.statusCode === 413) {
      return 0;
    }
  }
  const noise = Math.random() * retryOptions.noise;
  return Math.min(2 ** (attemptCount - 1) * 1e3, retryOptions.backoffLimit) + noise;
};
var calculate_retry_delay_default = calculateRetryDelay;

// node_modules/got/dist/source/core/options.js
var import_node_process = __toESM(require("process"), 1);
var import_node_util3 = require("util");
var import_node_url2 = require("url");
var import_node_tls = require("tls");
var import_node_http = __toESM(require("http"), 1);
var import_node_https = __toESM(require("https"), 1);

// node_modules/cacheable-lookup/source/index.js
var import_node_dns = require("dns");
var import_node_util2 = require("util");
var import_node_os = __toESM(require("os"), 1);
var { Resolver: AsyncResolver } = import_node_dns.promises;
var kCacheableLookupCreateConnection = Symbol("cacheableLookupCreateConnection");
var kCacheableLookupInstance = Symbol("cacheableLookupInstance");
var kExpires = Symbol("expires");
var supportsALL = typeof import_node_dns.ALL === "number";
var verifyAgent = (agent) => {
  if (!(agent && typeof agent.createConnection === "function")) {
    throw new Error("Expected an Agent instance as the first argument");
  }
};
var map4to6 = (entries2) => {
  for (const entry of entries2) {
    if (entry.family === 6) {
      continue;
    }
    entry.address = `::ffff:${entry.address}`;
    entry.family = 6;
  }
};
var getIfaceInfo = () => {
  let has4 = false;
  let has6 = false;
  for (const device of Object.values(import_node_os.default.networkInterfaces())) {
    for (const iface of device) {
      if (iface.internal) {
        continue;
      }
      if (iface.family === "IPv6") {
        has6 = true;
      } else {
        has4 = true;
      }
      if (has4 && has6) {
        return { has4, has6 };
      }
    }
  }
  return { has4, has6 };
};
var isIterable = (map4) => {
  return Symbol.iterator in map4;
};
var ignoreNoResultErrors = (dnsPromise) => {
  return dnsPromise.catch((error) => {
    if (error.code === "ENODATA" || error.code === "ENOTFOUND" || error.code === "ENOENT") {
      return [];
    }
    throw error;
  });
};
var ttl = { ttl: true };
var all = { all: true };
var all4 = { all: true, family: 4 };
var all6 = { all: true, family: 6 };
var CacheableLookup = class {
  constructor({
    cache = /* @__PURE__ */ new Map(),
    maxTtl = Infinity,
    fallbackDuration = 3600,
    errorTtl = 0.15,
    resolver = new AsyncResolver(),
    lookup = import_node_dns.lookup
  } = {}) {
    this.maxTtl = maxTtl;
    this.errorTtl = errorTtl;
    this._cache = cache;
    this._resolver = resolver;
    this._dnsLookup = lookup && (0, import_node_util2.promisify)(lookup);
    this.stats = {
      cache: 0,
      query: 0
    };
    if (this._resolver instanceof AsyncResolver) {
      this._resolve4 = this._resolver.resolve4.bind(this._resolver);
      this._resolve6 = this._resolver.resolve6.bind(this._resolver);
    } else {
      this._resolve4 = (0, import_node_util2.promisify)(this._resolver.resolve4.bind(this._resolver));
      this._resolve6 = (0, import_node_util2.promisify)(this._resolver.resolve6.bind(this._resolver));
    }
    this._iface = getIfaceInfo();
    this._pending = {};
    this._nextRemovalTime = false;
    this._hostnamesToFallback = /* @__PURE__ */ new Set();
    this.fallbackDuration = fallbackDuration;
    if (fallbackDuration > 0) {
      const interval = setInterval(() => {
        this._hostnamesToFallback.clear();
      }, fallbackDuration * 1e3);
      if (interval.unref) {
        interval.unref();
      }
      this._fallbackInterval = interval;
    }
    this.lookup = this.lookup.bind(this);
    this.lookupAsync = this.lookupAsync.bind(this);
  }
  set servers(servers) {
    this.clear();
    this._resolver.setServers(servers);
  }
  get servers() {
    return this._resolver.getServers();
  }
  lookup(hostname, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    } else if (typeof options === "number") {
      options = {
        family: options
      };
    }
    if (!callback) {
      throw new Error("Callback must be a function.");
    }
    this.lookupAsync(hostname, options).then((result) => {
      if (options.all) {
        callback(null, result);
      } else {
        callback(null, result.address, result.family, result.expires, result.ttl, result.source);
      }
    }, callback);
  }
  async lookupAsync(hostname, options = {}) {
    if (typeof options === "number") {
      options = {
        family: options
      };
    }
    let cached = await this.query(hostname);
    if (options.family === 6) {
      const filtered = cached.filter((entry) => entry.family === 6);
      if (options.hints & import_node_dns.V4MAPPED) {
        if (supportsALL && options.hints & import_node_dns.ALL || filtered.length === 0) {
          map4to6(cached);
        } else {
          cached = filtered;
        }
      } else {
        cached = filtered;
      }
    } else if (options.family === 4) {
      cached = cached.filter((entry) => entry.family === 4);
    }
    if (options.hints & import_node_dns.ADDRCONFIG) {
      const { _iface } = this;
      cached = cached.filter((entry) => entry.family === 6 ? _iface.has6 : _iface.has4);
    }
    if (cached.length === 0) {
      const error = new Error(`cacheableLookup ENOTFOUND ${hostname}`);
      error.code = "ENOTFOUND";
      error.hostname = hostname;
      throw error;
    }
    if (options.all) {
      return cached;
    }
    return cached[0];
  }
  async query(hostname) {
    let source = "cache";
    let cached = await this._cache.get(hostname);
    if (cached) {
      this.stats.cache++;
    }
    if (!cached) {
      const pending = this._pending[hostname];
      if (pending) {
        this.stats.cache++;
        cached = await pending;
      } else {
        source = "query";
        const newPromise = this.queryAndCache(hostname);
        this._pending[hostname] = newPromise;
        this.stats.query++;
        try {
          cached = await newPromise;
        } finally {
          delete this._pending[hostname];
        }
      }
    }
    cached = cached.map((entry) => {
      return { ...entry, source };
    });
    return cached;
  }
  async _resolve(hostname) {
    const [A, AAAA] = await Promise.all([
      ignoreNoResultErrors(this._resolve4(hostname, ttl)),
      ignoreNoResultErrors(this._resolve6(hostname, ttl))
    ]);
    let aTtl = 0;
    let aaaaTtl = 0;
    let cacheTtl = 0;
    const now = Date.now();
    for (const entry of A) {
      entry.family = 4;
      entry.expires = now + entry.ttl * 1e3;
      aTtl = Math.max(aTtl, entry.ttl);
    }
    for (const entry of AAAA) {
      entry.family = 6;
      entry.expires = now + entry.ttl * 1e3;
      aaaaTtl = Math.max(aaaaTtl, entry.ttl);
    }
    if (A.length > 0) {
      if (AAAA.length > 0) {
        cacheTtl = Math.min(aTtl, aaaaTtl);
      } else {
        cacheTtl = aTtl;
      }
    } else {
      cacheTtl = aaaaTtl;
    }
    return {
      entries: [
        ...A,
        ...AAAA
      ],
      cacheTtl
    };
  }
  async _lookup(hostname) {
    try {
      const [A, AAAA] = await Promise.all([
        ignoreNoResultErrors(this._dnsLookup(hostname, all4)),
        ignoreNoResultErrors(this._dnsLookup(hostname, all6))
      ]);
      return {
        entries: [
          ...A,
          ...AAAA
        ],
        cacheTtl: 0
      };
    } catch {
      return {
        entries: [],
        cacheTtl: 0
      };
    }
  }
  async _set(hostname, data, cacheTtl) {
    if (this.maxTtl > 0 && cacheTtl > 0) {
      cacheTtl = Math.min(cacheTtl, this.maxTtl) * 1e3;
      data[kExpires] = Date.now() + cacheTtl;
      try {
        await this._cache.set(hostname, data, cacheTtl);
      } catch (error) {
        this.lookupAsync = async () => {
          const cacheError = new Error("Cache Error. Please recreate the CacheableLookup instance.");
          cacheError.cause = error;
          throw cacheError;
        };
      }
      if (isIterable(this._cache)) {
        this._tick(cacheTtl);
      }
    }
  }
  async queryAndCache(hostname) {
    if (this._hostnamesToFallback.has(hostname)) {
      return this._dnsLookup(hostname, all);
    }
    let query = await this._resolve(hostname);
    if (query.entries.length === 0 && this._dnsLookup) {
      query = await this._lookup(hostname);
      if (query.entries.length !== 0 && this.fallbackDuration > 0) {
        this._hostnamesToFallback.add(hostname);
      }
    }
    const cacheTtl = query.entries.length === 0 ? this.errorTtl : query.cacheTtl;
    await this._set(hostname, query.entries, cacheTtl);
    return query.entries;
  }
  _tick(ms) {
    const nextRemovalTime = this._nextRemovalTime;
    if (!nextRemovalTime || ms < nextRemovalTime) {
      clearTimeout(this._removalTimeout);
      this._nextRemovalTime = ms;
      this._removalTimeout = setTimeout(() => {
        this._nextRemovalTime = false;
        let nextExpiry = Infinity;
        const now = Date.now();
        for (const [hostname, entries2] of this._cache) {
          const expires = entries2[kExpires];
          if (now >= expires) {
            this._cache.delete(hostname);
          } else if (expires < nextExpiry) {
            nextExpiry = expires;
          }
        }
        if (nextExpiry !== Infinity) {
          this._tick(nextExpiry - now);
        }
      }, ms);
      if (this._removalTimeout.unref) {
        this._removalTimeout.unref();
      }
    }
  }
  install(agent) {
    verifyAgent(agent);
    if (kCacheableLookupCreateConnection in agent) {
      throw new Error("CacheableLookup has been already installed");
    }
    agent[kCacheableLookupCreateConnection] = agent.createConnection;
    agent[kCacheableLookupInstance] = this;
    agent.createConnection = (options, callback) => {
      if (!("lookup" in options)) {
        options.lookup = this.lookup;
      }
      return agent[kCacheableLookupCreateConnection](options, callback);
    };
  }
  uninstall(agent) {
    verifyAgent(agent);
    if (agent[kCacheableLookupCreateConnection]) {
      if (agent[kCacheableLookupInstance] !== this) {
        throw new Error("The agent is not owned by this CacheableLookup instance");
      }
      agent.createConnection = agent[kCacheableLookupCreateConnection];
      delete agent[kCacheableLookupCreateConnection];
      delete agent[kCacheableLookupInstance];
    }
  }
  updateInterfaceInfo() {
    const { _iface } = this;
    this._iface = getIfaceInfo();
    if (_iface.has4 && !this._iface.has4 || _iface.has6 && !this._iface.has6) {
      this._cache.clear();
    }
  }
  clear(hostname) {
    if (hostname) {
      this._cache.delete(hostname);
      return;
    }
    this._cache.clear();
  }
};

// node_modules/got/dist/source/core/options.js
var import_http2_wrapper = __toESM(require_source2(), 1);

// node_modules/got/dist/source/core/parse-link-header.js
function parseLinkHeader(link) {
  const parsed = [];
  const items = link.split(",");
  for (const item of items) {
    const [rawUriReference, ...rawLinkParameters] = item.split(";");
    const trimmedUriReference = rawUriReference.trim();
    if (trimmedUriReference[0] !== "<" || trimmedUriReference[trimmedUriReference.length - 1] !== ">") {
      throw new Error(`Invalid format of the Link header reference: ${trimmedUriReference}`);
    }
    const reference = trimmedUriReference.slice(1, -1);
    const parameters = {};
    if (rawLinkParameters.length === 0) {
      throw new Error(`Unexpected end of Link header parameters: ${rawLinkParameters.join(";")}`);
    }
    for (const rawParameter of rawLinkParameters) {
      const trimmedRawParameter = rawParameter.trim();
      const center = trimmedRawParameter.indexOf("=");
      if (center === -1) {
        throw new Error(`Failed to parse Link header: ${link}`);
      }
      const name = trimmedRawParameter.slice(0, center).trim();
      const value = trimmedRawParameter.slice(center + 1).trim();
      parameters[name] = value;
    }
    parsed.push({
      reference,
      parameters
    });
  }
  return parsed;
}

// node_modules/got/dist/source/core/options.js
var [major, minor] = import_node_process.default.versions.node.split(".").map(Number);
function validateSearchParameters(searchParameters) {
  for (const key in searchParameters) {
    const value = searchParameters[key];
    assert.any([dist_default.string, dist_default.number, dist_default.boolean, dist_default.null_, dist_default.undefined], value);
  }
}
var globalCache = /* @__PURE__ */ new Map();
var globalDnsCache;
var getGlobalDnsCache = () => {
  if (globalDnsCache) {
    return globalDnsCache;
  }
  globalDnsCache = new CacheableLookup();
  return globalDnsCache;
};
var defaultInternals = {
  request: void 0,
  agent: {
    http: void 0,
    https: void 0,
    http2: void 0
  },
  h2session: void 0,
  decompress: true,
  timeout: {
    connect: void 0,
    lookup: void 0,
    read: void 0,
    request: void 0,
    response: void 0,
    secureConnect: void 0,
    send: void 0,
    socket: void 0
  },
  prefixUrl: "",
  body: void 0,
  form: void 0,
  json: void 0,
  cookieJar: void 0,
  ignoreInvalidCookies: false,
  searchParams: void 0,
  dnsLookup: void 0,
  dnsCache: void 0,
  context: {},
  hooks: {
    init: [],
    beforeRequest: [],
    beforeError: [],
    beforeRedirect: [],
    beforeRetry: [],
    afterResponse: []
  },
  followRedirect: true,
  maxRedirects: 10,
  cache: void 0,
  throwHttpErrors: true,
  username: "",
  password: "",
  http2: false,
  allowGetBody: false,
  headers: {
    "user-agent": "got (https://github.com/sindresorhus/got)"
  },
  methodRewriting: false,
  dnsLookupIpVersion: void 0,
  parseJson: JSON.parse,
  stringifyJson: JSON.stringify,
  retry: {
    limit: 2,
    methods: [
      "GET",
      "PUT",
      "HEAD",
      "DELETE",
      "OPTIONS",
      "TRACE"
    ],
    statusCodes: [
      408,
      413,
      429,
      500,
      502,
      503,
      504,
      521,
      522,
      524
    ],
    errorCodes: [
      "ETIMEDOUT",
      "ECONNRESET",
      "EADDRINUSE",
      "ECONNREFUSED",
      "EPIPE",
      "ENOTFOUND",
      "ENETUNREACH",
      "EAI_AGAIN"
    ],
    maxRetryAfter: void 0,
    calculateDelay: ({ computedValue }) => computedValue,
    backoffLimit: Number.POSITIVE_INFINITY,
    noise: 100
  },
  localAddress: void 0,
  method: "GET",
  createConnection: void 0,
  cacheOptions: {
    shared: void 0,
    cacheHeuristic: void 0,
    immutableMinTimeToLive: void 0,
    ignoreCargoCult: void 0
  },
  https: {
    alpnProtocols: void 0,
    rejectUnauthorized: void 0,
    checkServerIdentity: void 0,
    certificateAuthority: void 0,
    key: void 0,
    certificate: void 0,
    passphrase: void 0,
    pfx: void 0,
    ciphers: void 0,
    honorCipherOrder: void 0,
    minVersion: void 0,
    maxVersion: void 0,
    signatureAlgorithms: void 0,
    tlsSessionLifetime: void 0,
    dhparam: void 0,
    ecdhCurve: void 0,
    certificateRevocationLists: void 0
  },
  encoding: void 0,
  resolveBodyOnly: false,
  isStream: false,
  responseType: "text",
  url: void 0,
  pagination: {
    transform(response) {
      if (response.request.options.responseType === "json") {
        return response.body;
      }
      return JSON.parse(response.body);
    },
    paginate({ response }) {
      const rawLinkHeader = response.headers.link;
      if (typeof rawLinkHeader !== "string" || rawLinkHeader.trim() === "") {
        return false;
      }
      const parsed = parseLinkHeader(rawLinkHeader);
      const next = parsed.find((entry) => entry.parameters.rel === "next" || entry.parameters.rel === '"next"');
      if (next) {
        return {
          url: new import_node_url2.URL(next.reference, response.url)
        };
      }
      return false;
    },
    filter: () => true,
    shouldContinue: () => true,
    countLimit: Number.POSITIVE_INFINITY,
    backoff: 0,
    requestLimit: 1e4,
    stackAllItems: false
  },
  setHost: true,
  maxHeaderSize: void 0,
  signal: void 0,
  enableUnixSockets: true
};
var cloneInternals = (internals) => {
  const { hooks, retry: retry2 } = internals;
  const result = {
    ...internals,
    context: { ...internals.context },
    cacheOptions: { ...internals.cacheOptions },
    https: { ...internals.https },
    agent: { ...internals.agent },
    headers: { ...internals.headers },
    retry: {
      ...retry2,
      errorCodes: [...retry2.errorCodes],
      methods: [...retry2.methods],
      statusCodes: [...retry2.statusCodes]
    },
    timeout: { ...internals.timeout },
    hooks: {
      init: [...hooks.init],
      beforeRequest: [...hooks.beforeRequest],
      beforeError: [...hooks.beforeError],
      beforeRedirect: [...hooks.beforeRedirect],
      beforeRetry: [...hooks.beforeRetry],
      afterResponse: [...hooks.afterResponse]
    },
    searchParams: internals.searchParams ? new import_node_url2.URLSearchParams(internals.searchParams) : void 0,
    pagination: { ...internals.pagination }
  };
  if (result.url !== void 0) {
    result.prefixUrl = "";
  }
  return result;
};
var cloneRaw = (raw) => {
  const { hooks, retry: retry2 } = raw;
  const result = { ...raw };
  if (dist_default.object(raw.context)) {
    result.context = { ...raw.context };
  }
  if (dist_default.object(raw.cacheOptions)) {
    result.cacheOptions = { ...raw.cacheOptions };
  }
  if (dist_default.object(raw.https)) {
    result.https = { ...raw.https };
  }
  if (dist_default.object(raw.cacheOptions)) {
    result.cacheOptions = { ...result.cacheOptions };
  }
  if (dist_default.object(raw.agent)) {
    result.agent = { ...raw.agent };
  }
  if (dist_default.object(raw.headers)) {
    result.headers = { ...raw.headers };
  }
  if (dist_default.object(retry2)) {
    result.retry = { ...retry2 };
    if (dist_default.array(retry2.errorCodes)) {
      result.retry.errorCodes = [...retry2.errorCodes];
    }
    if (dist_default.array(retry2.methods)) {
      result.retry.methods = [...retry2.methods];
    }
    if (dist_default.array(retry2.statusCodes)) {
      result.retry.statusCodes = [...retry2.statusCodes];
    }
  }
  if (dist_default.object(raw.timeout)) {
    result.timeout = { ...raw.timeout };
  }
  if (dist_default.object(hooks)) {
    result.hooks = {
      ...hooks
    };
    if (dist_default.array(hooks.init)) {
      result.hooks.init = [...hooks.init];
    }
    if (dist_default.array(hooks.beforeRequest)) {
      result.hooks.beforeRequest = [...hooks.beforeRequest];
    }
    if (dist_default.array(hooks.beforeError)) {
      result.hooks.beforeError = [...hooks.beforeError];
    }
    if (dist_default.array(hooks.beforeRedirect)) {
      result.hooks.beforeRedirect = [...hooks.beforeRedirect];
    }
    if (dist_default.array(hooks.beforeRetry)) {
      result.hooks.beforeRetry = [...hooks.beforeRetry];
    }
    if (dist_default.array(hooks.afterResponse)) {
      result.hooks.afterResponse = [...hooks.afterResponse];
    }
  }
  if (dist_default.object(raw.pagination)) {
    result.pagination = { ...raw.pagination };
  }
  return result;
};
var getHttp2TimeoutOption = (internals) => {
  const delays = [internals.timeout.socket, internals.timeout.connect, internals.timeout.lookup, internals.timeout.request, internals.timeout.secureConnect].filter((delay2) => typeof delay2 === "number");
  if (delays.length > 0) {
    return Math.min(...delays);
  }
  return void 0;
};
var init = (options, withOptions, self2) => {
  var _a;
  const initHooks = (_a = options.hooks) == null ? void 0 : _a.init;
  if (initHooks) {
    for (const hook of initHooks) {
      hook(withOptions, self2);
    }
  }
};
var Options = class {
  constructor(input, options, defaults2) {
    var _a, _b, _c;
    Object.defineProperty(this, "_unixOptions", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_internals", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_merging", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_init", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    assert.any([dist_default.string, dist_default.urlInstance, dist_default.object, dist_default.undefined], input);
    assert.any([dist_default.object, dist_default.undefined], options);
    assert.any([dist_default.object, dist_default.undefined], defaults2);
    if (input instanceof Options || options instanceof Options) {
      throw new TypeError("The defaults must be passed as the third argument");
    }
    this._internals = cloneInternals((_b = (_a = defaults2 == null ? void 0 : defaults2._internals) != null ? _a : defaults2) != null ? _b : defaultInternals);
    this._init = [...(_c = defaults2 == null ? void 0 : defaults2._init) != null ? _c : []];
    this._merging = false;
    this._unixOptions = void 0;
    try {
      if (dist_default.plainObject(input)) {
        try {
          this.merge(input);
          this.merge(options);
        } finally {
          this.url = input.url;
        }
      } else {
        try {
          this.merge(options);
        } finally {
          if ((options == null ? void 0 : options.url) !== void 0) {
            if (input === void 0) {
              this.url = options.url;
            } else {
              throw new TypeError("The `url` option is mutually exclusive with the `input` argument");
            }
          } else if (input !== void 0) {
            this.url = input;
          }
        }
      }
    } catch (error) {
      error.options = this;
      throw error;
    }
  }
  merge(options) {
    if (!options) {
      return;
    }
    if (options instanceof Options) {
      for (const init2 of options._init) {
        this.merge(init2);
      }
      return;
    }
    options = cloneRaw(options);
    init(this, options, this);
    init(options, options, this);
    this._merging = true;
    if ("isStream" in options) {
      this.isStream = options.isStream;
    }
    try {
      let push = false;
      for (const key in options) {
        if (key === "mutableDefaults" || key === "handlers") {
          continue;
        }
        if (key === "url") {
          continue;
        }
        if (!(key in this)) {
          throw new Error(`Unexpected option: ${key}`);
        }
        this[key] = options[key];
        push = true;
      }
      if (push) {
        this._init.push(options);
      }
    } finally {
      this._merging = false;
    }
  }
  get request() {
    return this._internals.request;
  }
  set request(value) {
    assert.any([dist_default.function_, dist_default.undefined], value);
    this._internals.request = value;
  }
  get agent() {
    return this._internals.agent;
  }
  set agent(value) {
    assert.plainObject(value);
    for (const key in value) {
      if (!(key in this._internals.agent)) {
        throw new TypeError(`Unexpected agent option: ${key}`);
      }
      assert.any([dist_default.object, dist_default.undefined], value[key]);
    }
    if (this._merging) {
      Object.assign(this._internals.agent, value);
    } else {
      this._internals.agent = { ...value };
    }
  }
  get h2session() {
    return this._internals.h2session;
  }
  set h2session(value) {
    this._internals.h2session = value;
  }
  get decompress() {
    return this._internals.decompress;
  }
  set decompress(value) {
    assert.boolean(value);
    this._internals.decompress = value;
  }
  get timeout() {
    return this._internals.timeout;
  }
  set timeout(value) {
    assert.plainObject(value);
    for (const key in value) {
      if (!(key in this._internals.timeout)) {
        throw new Error(`Unexpected timeout option: ${key}`);
      }
      assert.any([dist_default.number, dist_default.undefined], value[key]);
    }
    if (this._merging) {
      Object.assign(this._internals.timeout, value);
    } else {
      this._internals.timeout = { ...value };
    }
  }
  get prefixUrl() {
    return this._internals.prefixUrl;
  }
  set prefixUrl(value) {
    assert.any([dist_default.string, dist_default.urlInstance], value);
    if (value === "") {
      this._internals.prefixUrl = "";
      return;
    }
    value = value.toString();
    if (!value.endsWith("/")) {
      value += "/";
    }
    if (this._internals.prefixUrl && this._internals.url) {
      const { href } = this._internals.url;
      this._internals.url.href = value + href.slice(this._internals.prefixUrl.length);
    }
    this._internals.prefixUrl = value;
  }
  get body() {
    return this._internals.body;
  }
  set body(value) {
    assert.any([dist_default.string, dist_default.buffer, dist_default.nodeStream, dist_default.generator, dist_default.asyncGenerator, isFormData, dist_default.undefined], value);
    if (dist_default.nodeStream(value)) {
      assert.truthy(value.readable);
    }
    if (value !== void 0) {
      assert.undefined(this._internals.form);
      assert.undefined(this._internals.json);
    }
    this._internals.body = value;
  }
  get form() {
    return this._internals.form;
  }
  set form(value) {
    assert.any([dist_default.plainObject, dist_default.undefined], value);
    if (value !== void 0) {
      assert.undefined(this._internals.body);
      assert.undefined(this._internals.json);
    }
    this._internals.form = value;
  }
  get json() {
    return this._internals.json;
  }
  set json(value) {
    if (value !== void 0) {
      assert.undefined(this._internals.body);
      assert.undefined(this._internals.form);
    }
    this._internals.json = value;
  }
  get url() {
    return this._internals.url;
  }
  set url(value) {
    assert.any([dist_default.string, dist_default.urlInstance, dist_default.undefined], value);
    if (value === void 0) {
      this._internals.url = void 0;
      return;
    }
    if (dist_default.string(value) && value.startsWith("/")) {
      throw new Error("`url` must not start with a slash");
    }
    const urlString = `${this.prefixUrl}${value.toString()}`;
    const url2 = new import_node_url2.URL(urlString);
    this._internals.url = url2;
    decodeURI(urlString);
    if (url2.protocol === "unix:") {
      url2.href = `http://unix${url2.pathname}${url2.search}`;
    }
    if (url2.protocol !== "http:" && url2.protocol !== "https:") {
      const error = new Error(`Unsupported protocol: ${url2.protocol}`);
      error.code = "ERR_UNSUPPORTED_PROTOCOL";
      throw error;
    }
    if (this._internals.username) {
      url2.username = this._internals.username;
      this._internals.username = "";
    }
    if (this._internals.password) {
      url2.password = this._internals.password;
      this._internals.password = "";
    }
    if (this._internals.searchParams) {
      url2.search = this._internals.searchParams.toString();
      this._internals.searchParams = void 0;
    }
    if (url2.hostname === "unix") {
      if (!this._internals.enableUnixSockets) {
        throw new Error("Using UNIX domain sockets but option `enableUnixSockets` is not enabled");
      }
      const matches = /(?<socketPath>.+?):(?<path>.+)/.exec(`${url2.pathname}${url2.search}`);
      if (matches == null ? void 0 : matches.groups) {
        const { socketPath, path } = matches.groups;
        this._unixOptions = {
          socketPath,
          path,
          host: ""
        };
      } else {
        this._unixOptions = void 0;
      }
      return;
    }
    this._unixOptions = void 0;
  }
  get cookieJar() {
    return this._internals.cookieJar;
  }
  set cookieJar(value) {
    assert.any([dist_default.object, dist_default.undefined], value);
    if (value === void 0) {
      this._internals.cookieJar = void 0;
      return;
    }
    let { setCookie, getCookieString } = value;
    assert.function_(setCookie);
    assert.function_(getCookieString);
    if (setCookie.length === 4 && getCookieString.length === 0) {
      setCookie = (0, import_node_util3.promisify)(setCookie.bind(value));
      getCookieString = (0, import_node_util3.promisify)(getCookieString.bind(value));
      this._internals.cookieJar = {
        setCookie,
        getCookieString
      };
    } else {
      this._internals.cookieJar = value;
    }
  }
  get signal() {
    return this._internals.signal;
  }
  set signal(value) {
    assert.object(value);
    this._internals.signal = value;
  }
  get ignoreInvalidCookies() {
    return this._internals.ignoreInvalidCookies;
  }
  set ignoreInvalidCookies(value) {
    assert.boolean(value);
    this._internals.ignoreInvalidCookies = value;
  }
  get searchParams() {
    if (this._internals.url) {
      return this._internals.url.searchParams;
    }
    if (this._internals.searchParams === void 0) {
      this._internals.searchParams = new import_node_url2.URLSearchParams();
    }
    return this._internals.searchParams;
  }
  set searchParams(value) {
    assert.any([dist_default.string, dist_default.object, dist_default.undefined], value);
    const url2 = this._internals.url;
    if (value === void 0) {
      this._internals.searchParams = void 0;
      if (url2) {
        url2.search = "";
      }
      return;
    }
    const searchParameters = this.searchParams;
    let updated;
    if (dist_default.string(value)) {
      updated = new import_node_url2.URLSearchParams(value);
    } else if (value instanceof import_node_url2.URLSearchParams) {
      updated = value;
    } else {
      validateSearchParameters(value);
      updated = new import_node_url2.URLSearchParams();
      for (const key in value) {
        const entry = value[key];
        if (entry === null) {
          updated.append(key, "");
        } else if (entry === void 0) {
          searchParameters.delete(key);
        } else {
          updated.append(key, entry);
        }
      }
    }
    if (this._merging) {
      for (const key of updated.keys()) {
        searchParameters.delete(key);
      }
      for (const [key, value2] of updated) {
        searchParameters.append(key, value2);
      }
    } else if (url2) {
      url2.search = searchParameters.toString();
    } else {
      this._internals.searchParams = searchParameters;
    }
  }
  get searchParameters() {
    throw new Error("The `searchParameters` option does not exist. Use `searchParams` instead.");
  }
  set searchParameters(_value) {
    throw new Error("The `searchParameters` option does not exist. Use `searchParams` instead.");
  }
  get dnsLookup() {
    return this._internals.dnsLookup;
  }
  set dnsLookup(value) {
    assert.any([dist_default.function_, dist_default.undefined], value);
    this._internals.dnsLookup = value;
  }
  get dnsCache() {
    return this._internals.dnsCache;
  }
  set dnsCache(value) {
    assert.any([dist_default.object, dist_default.boolean, dist_default.undefined], value);
    if (value === true) {
      this._internals.dnsCache = getGlobalDnsCache();
    } else if (value === false) {
      this._internals.dnsCache = void 0;
    } else {
      this._internals.dnsCache = value;
    }
  }
  get context() {
    return this._internals.context;
  }
  set context(value) {
    assert.object(value);
    if (this._merging) {
      Object.assign(this._internals.context, value);
    } else {
      this._internals.context = { ...value };
    }
  }
  get hooks() {
    return this._internals.hooks;
  }
  set hooks(value) {
    assert.object(value);
    for (const knownHookEvent in value) {
      if (!(knownHookEvent in this._internals.hooks)) {
        throw new Error(`Unexpected hook event: ${knownHookEvent}`);
      }
      const typedKnownHookEvent = knownHookEvent;
      const hooks = value[typedKnownHookEvent];
      assert.any([dist_default.array, dist_default.undefined], hooks);
      if (hooks) {
        for (const hook of hooks) {
          assert.function_(hook);
        }
      }
      if (this._merging) {
        if (hooks) {
          this._internals.hooks[typedKnownHookEvent].push(...hooks);
        }
      } else {
        if (!hooks) {
          throw new Error(`Missing hook event: ${knownHookEvent}`);
        }
        this._internals.hooks[knownHookEvent] = [...hooks];
      }
    }
  }
  get followRedirect() {
    return this._internals.followRedirect;
  }
  set followRedirect(value) {
    assert.boolean(value);
    this._internals.followRedirect = value;
  }
  get followRedirects() {
    throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
  }
  set followRedirects(_value) {
    throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
  }
  get maxRedirects() {
    return this._internals.maxRedirects;
  }
  set maxRedirects(value) {
    assert.number(value);
    this._internals.maxRedirects = value;
  }
  get cache() {
    return this._internals.cache;
  }
  set cache(value) {
    assert.any([dist_default.object, dist_default.string, dist_default.boolean, dist_default.undefined], value);
    if (value === true) {
      this._internals.cache = globalCache;
    } else if (value === false) {
      this._internals.cache = void 0;
    } else {
      this._internals.cache = value;
    }
  }
  get throwHttpErrors() {
    return this._internals.throwHttpErrors;
  }
  set throwHttpErrors(value) {
    assert.boolean(value);
    this._internals.throwHttpErrors = value;
  }
  get username() {
    const url2 = this._internals.url;
    const value = url2 ? url2.username : this._internals.username;
    return decodeURIComponent(value);
  }
  set username(value) {
    assert.string(value);
    const url2 = this._internals.url;
    const fixedValue = encodeURIComponent(value);
    if (url2) {
      url2.username = fixedValue;
    } else {
      this._internals.username = fixedValue;
    }
  }
  get password() {
    const url2 = this._internals.url;
    const value = url2 ? url2.password : this._internals.password;
    return decodeURIComponent(value);
  }
  set password(value) {
    assert.string(value);
    const url2 = this._internals.url;
    const fixedValue = encodeURIComponent(value);
    if (url2) {
      url2.password = fixedValue;
    } else {
      this._internals.password = fixedValue;
    }
  }
  get http2() {
    return this._internals.http2;
  }
  set http2(value) {
    assert.boolean(value);
    this._internals.http2 = value;
  }
  get allowGetBody() {
    return this._internals.allowGetBody;
  }
  set allowGetBody(value) {
    assert.boolean(value);
    this._internals.allowGetBody = value;
  }
  get headers() {
    return this._internals.headers;
  }
  set headers(value) {
    assert.plainObject(value);
    if (this._merging) {
      Object.assign(this._internals.headers, lowercaseKeys(value));
    } else {
      this._internals.headers = lowercaseKeys(value);
    }
  }
  get methodRewriting() {
    return this._internals.methodRewriting;
  }
  set methodRewriting(value) {
    assert.boolean(value);
    this._internals.methodRewriting = value;
  }
  get dnsLookupIpVersion() {
    return this._internals.dnsLookupIpVersion;
  }
  set dnsLookupIpVersion(value) {
    if (value !== void 0 && value !== 4 && value !== 6) {
      throw new TypeError(`Invalid DNS lookup IP version: ${value}`);
    }
    this._internals.dnsLookupIpVersion = value;
  }
  get parseJson() {
    return this._internals.parseJson;
  }
  set parseJson(value) {
    assert.function_(value);
    this._internals.parseJson = value;
  }
  get stringifyJson() {
    return this._internals.stringifyJson;
  }
  set stringifyJson(value) {
    assert.function_(value);
    this._internals.stringifyJson = value;
  }
  get retry() {
    return this._internals.retry;
  }
  set retry(value) {
    assert.plainObject(value);
    assert.any([dist_default.function_, dist_default.undefined], value.calculateDelay);
    assert.any([dist_default.number, dist_default.undefined], value.maxRetryAfter);
    assert.any([dist_default.number, dist_default.undefined], value.limit);
    assert.any([dist_default.array, dist_default.undefined], value.methods);
    assert.any([dist_default.array, dist_default.undefined], value.statusCodes);
    assert.any([dist_default.array, dist_default.undefined], value.errorCodes);
    assert.any([dist_default.number, dist_default.undefined], value.noise);
    if (value.noise && Math.abs(value.noise) > 100) {
      throw new Error(`The maximum acceptable retry noise is +/- 100ms, got ${value.noise}`);
    }
    for (const key in value) {
      if (!(key in this._internals.retry)) {
        throw new Error(`Unexpected retry option: ${key}`);
      }
    }
    if (this._merging) {
      Object.assign(this._internals.retry, value);
    } else {
      this._internals.retry = { ...value };
    }
    const { retry: retry2 } = this._internals;
    retry2.methods = [...new Set(retry2.methods.map((method) => method.toUpperCase()))];
    retry2.statusCodes = [...new Set(retry2.statusCodes)];
    retry2.errorCodes = [...new Set(retry2.errorCodes)];
  }
  get localAddress() {
    return this._internals.localAddress;
  }
  set localAddress(value) {
    assert.any([dist_default.string, dist_default.undefined], value);
    this._internals.localAddress = value;
  }
  get method() {
    return this._internals.method;
  }
  set method(value) {
    assert.string(value);
    this._internals.method = value.toUpperCase();
  }
  get createConnection() {
    return this._internals.createConnection;
  }
  set createConnection(value) {
    assert.any([dist_default.function_, dist_default.undefined], value);
    this._internals.createConnection = value;
  }
  get cacheOptions() {
    return this._internals.cacheOptions;
  }
  set cacheOptions(value) {
    assert.plainObject(value);
    assert.any([dist_default.boolean, dist_default.undefined], value.shared);
    assert.any([dist_default.number, dist_default.undefined], value.cacheHeuristic);
    assert.any([dist_default.number, dist_default.undefined], value.immutableMinTimeToLive);
    assert.any([dist_default.boolean, dist_default.undefined], value.ignoreCargoCult);
    for (const key in value) {
      if (!(key in this._internals.cacheOptions)) {
        throw new Error(`Cache option \`${key}\` does not exist`);
      }
    }
    if (this._merging) {
      Object.assign(this._internals.cacheOptions, value);
    } else {
      this._internals.cacheOptions = { ...value };
    }
  }
  get https() {
    return this._internals.https;
  }
  set https(value) {
    assert.plainObject(value);
    assert.any([dist_default.boolean, dist_default.undefined], value.rejectUnauthorized);
    assert.any([dist_default.function_, dist_default.undefined], value.checkServerIdentity);
    assert.any([dist_default.string, dist_default.object, dist_default.array, dist_default.undefined], value.certificateAuthority);
    assert.any([dist_default.string, dist_default.object, dist_default.array, dist_default.undefined], value.key);
    assert.any([dist_default.string, dist_default.object, dist_default.array, dist_default.undefined], value.certificate);
    assert.any([dist_default.string, dist_default.undefined], value.passphrase);
    assert.any([dist_default.string, dist_default.buffer, dist_default.array, dist_default.undefined], value.pfx);
    assert.any([dist_default.array, dist_default.undefined], value.alpnProtocols);
    assert.any([dist_default.string, dist_default.undefined], value.ciphers);
    assert.any([dist_default.string, dist_default.buffer, dist_default.undefined], value.dhparam);
    assert.any([dist_default.string, dist_default.undefined], value.signatureAlgorithms);
    assert.any([dist_default.string, dist_default.undefined], value.minVersion);
    assert.any([dist_default.string, dist_default.undefined], value.maxVersion);
    assert.any([dist_default.boolean, dist_default.undefined], value.honorCipherOrder);
    assert.any([dist_default.number, dist_default.undefined], value.tlsSessionLifetime);
    assert.any([dist_default.string, dist_default.undefined], value.ecdhCurve);
    assert.any([dist_default.string, dist_default.buffer, dist_default.array, dist_default.undefined], value.certificateRevocationLists);
    for (const key in value) {
      if (!(key in this._internals.https)) {
        throw new Error(`HTTPS option \`${key}\` does not exist`);
      }
    }
    if (this._merging) {
      Object.assign(this._internals.https, value);
    } else {
      this._internals.https = { ...value };
    }
  }
  get encoding() {
    return this._internals.encoding;
  }
  set encoding(value) {
    if (value === null) {
      throw new TypeError("To get a Buffer, set `options.responseType` to `buffer` instead");
    }
    assert.any([dist_default.string, dist_default.undefined], value);
    this._internals.encoding = value;
  }
  get resolveBodyOnly() {
    return this._internals.resolveBodyOnly;
  }
  set resolveBodyOnly(value) {
    assert.boolean(value);
    this._internals.resolveBodyOnly = value;
  }
  get isStream() {
    return this._internals.isStream;
  }
  set isStream(value) {
    assert.boolean(value);
    this._internals.isStream = value;
  }
  get responseType() {
    return this._internals.responseType;
  }
  set responseType(value) {
    if (value === void 0) {
      this._internals.responseType = "text";
      return;
    }
    if (value !== "text" && value !== "buffer" && value !== "json") {
      throw new Error(`Invalid \`responseType\` option: ${value}`);
    }
    this._internals.responseType = value;
  }
  get pagination() {
    return this._internals.pagination;
  }
  set pagination(value) {
    assert.object(value);
    if (this._merging) {
      Object.assign(this._internals.pagination, value);
    } else {
      this._internals.pagination = value;
    }
  }
  get auth() {
    throw new Error("Parameter `auth` is deprecated. Use `username` / `password` instead.");
  }
  set auth(_value) {
    throw new Error("Parameter `auth` is deprecated. Use `username` / `password` instead.");
  }
  get setHost() {
    return this._internals.setHost;
  }
  set setHost(value) {
    assert.boolean(value);
    this._internals.setHost = value;
  }
  get maxHeaderSize() {
    return this._internals.maxHeaderSize;
  }
  set maxHeaderSize(value) {
    assert.any([dist_default.number, dist_default.undefined], value);
    this._internals.maxHeaderSize = value;
  }
  get enableUnixSockets() {
    return this._internals.enableUnixSockets;
  }
  set enableUnixSockets(value) {
    assert.boolean(value);
    this._internals.enableUnixSockets = value;
  }
  toJSON() {
    return { ...this._internals };
  }
  [Symbol.for("nodejs.util.inspect.custom")](_depth, options) {
    return (0, import_node_util3.inspect)(this._internals, options);
  }
  createNativeRequestOptions() {
    var _a, _b, _c;
    const internals = this._internals;
    const url2 = internals.url;
    let agent;
    if (url2.protocol === "https:") {
      agent = internals.http2 ? internals.agent : internals.agent.https;
    } else {
      agent = internals.agent.http;
    }
    const { https: https2 } = internals;
    let { pfx } = https2;
    if (dist_default.array(pfx) && dist_default.plainObject(pfx[0])) {
      pfx = pfx.map((object) => ({
        buf: object.buffer,
        passphrase: object.passphrase
      }));
    }
    return {
      ...internals.cacheOptions,
      ...this._unixOptions,
      ALPNProtocols: https2.alpnProtocols,
      ca: https2.certificateAuthority,
      cert: https2.certificate,
      key: https2.key,
      passphrase: https2.passphrase,
      pfx: https2.pfx,
      rejectUnauthorized: https2.rejectUnauthorized,
      checkServerIdentity: (_a = https2.checkServerIdentity) != null ? _a : import_node_tls.checkServerIdentity,
      ciphers: https2.ciphers,
      honorCipherOrder: https2.honorCipherOrder,
      minVersion: https2.minVersion,
      maxVersion: https2.maxVersion,
      sigalgs: https2.signatureAlgorithms,
      sessionTimeout: https2.tlsSessionLifetime,
      dhparam: https2.dhparam,
      ecdhCurve: https2.ecdhCurve,
      crl: https2.certificateRevocationLists,
      lookup: (_c = internals.dnsLookup) != null ? _c : (_b = internals.dnsCache) == null ? void 0 : _b.lookup,
      family: internals.dnsLookupIpVersion,
      agent,
      setHost: internals.setHost,
      method: internals.method,
      maxHeaderSize: internals.maxHeaderSize,
      localAddress: internals.localAddress,
      headers: internals.headers,
      createConnection: internals.createConnection,
      timeout: internals.http2 ? getHttp2TimeoutOption(internals) : void 0,
      h2session: internals.h2session
    };
  }
  getRequestFunction() {
    const url2 = this._internals.url;
    const { request: request2 } = this._internals;
    if (!request2 && url2) {
      return this.getFallbackRequestFunction();
    }
    return request2;
  }
  getFallbackRequestFunction() {
    const url2 = this._internals.url;
    if (!url2) {
      return;
    }
    if (url2.protocol === "https:") {
      if (this._internals.http2) {
        if (major < 15 || major === 15 && minor < 10) {
          const error = new Error("To use the `http2` option, install Node.js 15.10.0 or above");
          error.code = "EUNSUPPORTED";
          throw error;
        }
        return import_http2_wrapper.default.auto;
      }
      return import_node_https.default.request;
    }
    return import_node_http.default.request;
  }
  freeze() {
    const options = this._internals;
    Object.freeze(options);
    Object.freeze(options.hooks);
    Object.freeze(options.hooks.afterResponse);
    Object.freeze(options.hooks.beforeError);
    Object.freeze(options.hooks.beforeRedirect);
    Object.freeze(options.hooks.beforeRequest);
    Object.freeze(options.hooks.beforeRetry);
    Object.freeze(options.hooks.init);
    Object.freeze(options.https);
    Object.freeze(options.cacheOptions);
    Object.freeze(options.agent);
    Object.freeze(options.headers);
    Object.freeze(options.timeout);
    Object.freeze(options.retry);
    Object.freeze(options.retry.errorCodes);
    Object.freeze(options.retry.methods);
    Object.freeze(options.retry.statusCodes);
  }
};

// node_modules/got/dist/source/core/response.js
var isResponseOk = (response) => {
  const { statusCode } = response;
  const limitStatusCode = response.request.options.followRedirect ? 299 : 399;
  return statusCode >= 200 && statusCode <= limitStatusCode || statusCode === 304;
};
var ParseError = class extends RequestError {
  constructor(error, response) {
    const { options } = response.request;
    super(`${error.message} in "${options.url.toString()}"`, error, response.request);
    this.name = "ParseError";
    this.code = "ERR_BODY_PARSE_FAILURE";
  }
};
var parseBody = (response, responseType, parseJson, encoding) => {
  const { rawBody } = response;
  try {
    if (responseType === "text") {
      return rawBody.toString(encoding);
    }
    if (responseType === "json") {
      return rawBody.length === 0 ? "" : parseJson(rawBody.toString(encoding));
    }
    if (responseType === "buffer") {
      return rawBody;
    }
  } catch (error) {
    throw new ParseError(error, response);
  }
  throw new ParseError({
    message: `Unknown body type '${responseType}'`,
    name: "Error"
  }, response);
};

// node_modules/got/dist/source/core/utils/is-client-request.js
function isClientRequest(clientRequest) {
  return clientRequest.writable && !clientRequest.writableEnded;
}
var is_client_request_default = isClientRequest;

// node_modules/got/dist/source/core/utils/is-unix-socket-url.js
function isUnixSocketURL(url2) {
  return url2.protocol === "unix:" || url2.hostname === "unix";
}

// node_modules/got/dist/source/core/index.js
var supportsBrotli = dist_default.string(import_node_process2.default.versions.brotli);
var methodsWithoutBody = /* @__PURE__ */ new Set(["GET", "HEAD"]);
var cacheableStore = new WeakableMap();
var redirectCodes = /* @__PURE__ */ new Set([300, 301, 302, 303, 304, 307, 308]);
var proxiedRequestEvents = [
  "socket",
  "connect",
  "continue",
  "information",
  "upgrade"
];
var noop3 = () => {
};
var Request = class extends import_node_stream3.Duplex {
  constructor(url2, options, defaults2) {
    var _a, _b;
    super({
      autoDestroy: false,
      highWaterMark: 0
    });
    Object.defineProperty(this, "constructor", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_noPipe", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "options", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "response", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "requestUrl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "redirectUrls", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "retryCount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_stopRetry", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_downloadedSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_uploadedSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_stopReading", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_pipedServerResponses", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_request", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_responseSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_bodySize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_unproxyEvents", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_isFromCache", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_cannotHaveBody", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_triggerRead", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_cancelTimeouts", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_nativeResponse", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_flushed", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_aborted", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_requestInitialized", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this._downloadedSize = 0;
    this._uploadedSize = 0;
    this._stopReading = false;
    this._pipedServerResponses = /* @__PURE__ */ new Set();
    this._cannotHaveBody = false;
    this._unproxyEvents = noop3;
    this._triggerRead = false;
    this._cancelTimeouts = noop3;
    this._jobs = [];
    this._flushed = false;
    this._requestInitialized = false;
    this._aborted = false;
    this.redirectUrls = [];
    this.retryCount = 0;
    this._stopRetry = noop3;
    this.on("pipe", (source) => {
      if (source.headers) {
        Object.assign(this.options.headers, source.headers);
      }
    });
    this.on("newListener", (event) => {
      if (event === "retry" && this.listenerCount("retry") > 0) {
        throw new Error("A retry listener has been attached already.");
      }
    });
    try {
      this.options = new Options(url2, options, defaults2);
      if (!this.options.url) {
        if (this.options.prefixUrl === "") {
          throw new TypeError("Missing `url` property");
        }
        this.options.url = "";
      }
      this.requestUrl = this.options.url;
    } catch (error) {
      const { options: options2 } = error;
      if (options2) {
        this.options = options2;
      }
      this.flush = async () => {
        this.flush = async () => {
        };
        this.destroy(error);
      };
      return;
    }
    if ((_a = this.options.signal) == null ? void 0 : _a.aborted) {
      this.destroy(new AbortError(this));
    }
    (_b = this.options.signal) == null ? void 0 : _b.addEventListener("abort", () => {
      this.destroy(new AbortError(this));
    });
    const { body } = this.options;
    if (dist_default.nodeStream(body)) {
      body.once("error", (error) => {
        if (this._flushed) {
          this._beforeError(new UploadError(error, this));
        } else {
          this.flush = async () => {
            this.flush = async () => {
            };
            this._beforeError(new UploadError(error, this));
          };
        }
      });
    }
  }
  async flush() {
    var _a;
    if (this._flushed) {
      return;
    }
    this._flushed = true;
    try {
      await this._finalizeBody();
      if (this.destroyed) {
        return;
      }
      await this._makeRequest();
      if (this.destroyed) {
        (_a = this._request) == null ? void 0 : _a.destroy();
        return;
      }
      for (const job of this._jobs) {
        job();
      }
      this._jobs.length = 0;
      this._requestInitialized = true;
    } catch (error) {
      this._beforeError(error);
    }
  }
  _beforeError(error) {
    if (this._stopReading) {
      return;
    }
    const { response, options } = this;
    const attemptCount = this.retryCount + (error.name === "RetryError" ? 0 : 1);
    this._stopReading = true;
    if (!(error instanceof RequestError)) {
      error = new RequestError(error.message, error, this);
    }
    const typedError = error;
    void (async () => {
      var _a, _b, _c, _d;
      if ((response == null ? void 0 : response.readable) && !response.rawBody && !((_b = (_a = this._request) == null ? void 0 : _a.socket) == null ? void 0 : _b.destroyed)) {
        response.setEncoding(this.readableEncoding);
        const success = await this._setRawBody(response);
        if (success) {
          response.body = response.rawBody.toString();
        }
      }
      if (this.listenerCount("retry") !== 0) {
        let backoff;
        try {
          let retryAfter;
          if (response && "retry-after" in response.headers) {
            retryAfter = Number(response.headers["retry-after"]);
            if (Number.isNaN(retryAfter)) {
              retryAfter = Date.parse(response.headers["retry-after"]) - Date.now();
              if (retryAfter <= 0) {
                retryAfter = 1;
              }
            } else {
              retryAfter *= 1e3;
            }
          }
          const retryOptions = options.retry;
          backoff = await retryOptions.calculateDelay({
            attemptCount,
            retryOptions,
            error: typedError,
            retryAfter,
            computedValue: calculate_retry_delay_default({
              attemptCount,
              retryOptions,
              error: typedError,
              retryAfter,
              computedValue: (_d = (_c = retryOptions.maxRetryAfter) != null ? _c : options.timeout.request) != null ? _d : Number.POSITIVE_INFINITY
            })
          });
        } catch (error_) {
          void this._error(new RequestError(error_.message, error_, this));
          return;
        }
        if (backoff) {
          await new Promise((resolve) => {
            const timeout = setTimeout(resolve, backoff);
            this._stopRetry = () => {
              clearTimeout(timeout);
              resolve();
            };
          });
          if (this.destroyed) {
            return;
          }
          try {
            for (const hook of this.options.hooks.beforeRetry) {
              await hook(typedError, this.retryCount + 1);
            }
          } catch (error_) {
            void this._error(new RequestError(error_.message, error, this));
            return;
          }
          if (this.destroyed) {
            return;
          }
          this.destroy();
          this.emit("retry", this.retryCount + 1, error, (updatedOptions) => {
            const request2 = new Request(options.url, updatedOptions, options);
            request2.retryCount = this.retryCount + 1;
            import_node_process2.default.nextTick(() => {
              void request2.flush();
            });
            return request2;
          });
          return;
        }
      }
      void this._error(typedError);
    })();
  }
  _read() {
    this._triggerRead = true;
    const { response } = this;
    if (response && !this._stopReading) {
      if (response.readableLength) {
        this._triggerRead = false;
      }
      let data;
      while ((data = response.read()) !== null) {
        this._downloadedSize += data.length;
        const progress = this.downloadProgress;
        if (progress.percent < 1) {
          this.emit("downloadProgress", progress);
        }
        this.push(data);
      }
    }
  }
  _write(chunk, encoding, callback) {
    const write = () => {
      this._writeRequest(chunk, encoding, callback);
    };
    if (this._requestInitialized) {
      write();
    } else {
      this._jobs.push(write);
    }
  }
  _final(callback) {
    const endRequest = () => {
      if (!this._request || this._request.destroyed) {
        callback();
        return;
      }
      this._request.end((error) => {
        var _a;
        if ((_a = this._request._writableState) == null ? void 0 : _a.errored) {
          return;
        }
        if (!error) {
          this._bodySize = this._uploadedSize;
          this.emit("uploadProgress", this.uploadProgress);
          this._request.emit("upload-complete");
        }
        callback(error);
      });
    };
    if (this._requestInitialized) {
      endRequest();
    } else {
      this._jobs.push(endRequest);
    }
  }
  _destroy(error, callback) {
    this._stopReading = true;
    this.flush = async () => {
    };
    this._stopRetry();
    this._cancelTimeouts();
    if (this.options) {
      const { body } = this.options;
      if (dist_default.nodeStream(body)) {
        body.destroy();
      }
    }
    if (this._request) {
      this._request.destroy();
    }
    if (error !== null && !dist_default.undefined(error) && !(error instanceof RequestError)) {
      error = new RequestError(error.message, error, this);
    }
    callback(error);
  }
  pipe(destination, options) {
    if (destination instanceof import_node_http2.ServerResponse) {
      this._pipedServerResponses.add(destination);
    }
    return super.pipe(destination, options);
  }
  unpipe(destination) {
    if (destination instanceof import_node_http2.ServerResponse) {
      this._pipedServerResponses.delete(destination);
    }
    super.unpipe(destination);
    return this;
  }
  async _finalizeBody() {
    const { options } = this;
    const { headers } = options;
    const isForm = !dist_default.undefined(options.form);
    const isJSON = !dist_default.undefined(options.json);
    const isBody = !dist_default.undefined(options.body);
    const cannotHaveBody = methodsWithoutBody.has(options.method) && !(options.method === "GET" && options.allowGetBody);
    this._cannotHaveBody = cannotHaveBody;
    if (isForm || isJSON || isBody) {
      if (cannotHaveBody) {
        throw new TypeError(`The \`${options.method}\` method cannot be used with a body`);
      }
      const noContentType = !dist_default.string(headers["content-type"]);
      if (isBody) {
        if (isFormData(options.body)) {
          const encoder = new FormDataEncoder(options.body);
          if (noContentType) {
            headers["content-type"] = encoder.headers["Content-Type"];
          }
          if ("Content-Length" in encoder.headers) {
            headers["content-length"] = encoder.headers["Content-Length"];
          }
          options.body = encoder.encode();
        }
        if (isFormData2(options.body) && noContentType) {
          headers["content-type"] = `multipart/form-data; boundary=${options.body.getBoundary()}`;
        }
      } else if (isForm) {
        if (noContentType) {
          headers["content-type"] = "application/x-www-form-urlencoded";
        }
        const { form } = options;
        options.form = void 0;
        options.body = new import_node_url3.URLSearchParams(form).toString();
      } else {
        if (noContentType) {
          headers["content-type"] = "application/json";
        }
        const { json } = options;
        options.json = void 0;
        options.body = options.stringifyJson(json);
      }
      const uploadBodySize = await getBodySize(options.body, options.headers);
      if (dist_default.undefined(headers["content-length"]) && dist_default.undefined(headers["transfer-encoding"]) && !cannotHaveBody && !dist_default.undefined(uploadBodySize)) {
        headers["content-length"] = String(uploadBodySize);
      }
    }
    if (options.responseType === "json" && !("accept" in options.headers)) {
      options.headers.accept = "application/json";
    }
    this._bodySize = Number(headers["content-length"]) || void 0;
  }
  async _onResponseBase(response) {
    var _a;
    if (this.isAborted) {
      return;
    }
    const { options } = this;
    const { url: url2 } = options;
    this._nativeResponse = response;
    if (options.decompress) {
      response = (0, import_decompress_response.default)(response);
    }
    const statusCode = response.statusCode;
    const typedResponse = response;
    typedResponse.statusMessage = typedResponse.statusMessage ? typedResponse.statusMessage : import_node_http2.default.STATUS_CODES[statusCode];
    typedResponse.url = options.url.toString();
    typedResponse.requestUrl = this.requestUrl;
    typedResponse.redirectUrls = this.redirectUrls;
    typedResponse.request = this;
    typedResponse.isFromCache = (_a = this._nativeResponse.fromCache) != null ? _a : false;
    typedResponse.ip = this.ip;
    typedResponse.retryCount = this.retryCount;
    typedResponse.ok = isResponseOk(typedResponse);
    this._isFromCache = typedResponse.isFromCache;
    this._responseSize = Number(response.headers["content-length"]) || void 0;
    this.response = typedResponse;
    response.once("end", () => {
      this._responseSize = this._downloadedSize;
      this.emit("downloadProgress", this.downloadProgress);
    });
    response.once("error", (error) => {
      this._aborted = true;
      response.destroy();
      this._beforeError(new ReadError(error, this));
    });
    response.once("aborted", () => {
      this._aborted = true;
      this._beforeError(new ReadError({
        name: "Error",
        message: "The server aborted pending request",
        code: "ECONNRESET"
      }, this));
    });
    this.emit("downloadProgress", this.downloadProgress);
    const rawCookies = response.headers["set-cookie"];
    if (dist_default.object(options.cookieJar) && rawCookies) {
      let promises = rawCookies.map(async (rawCookie) => options.cookieJar.setCookie(rawCookie, url2.toString()));
      if (options.ignoreInvalidCookies) {
        promises = promises.map(async (promise) => {
          try {
            await promise;
          } catch {
          }
        });
      }
      try {
        await Promise.all(promises);
      } catch (error) {
        this._beforeError(error);
        return;
      }
    }
    if (this.isAborted) {
      return;
    }
    if (options.followRedirect && response.headers.location && redirectCodes.has(statusCode)) {
      response.resume();
      this._cancelTimeouts();
      this._unproxyEvents();
      if (this.redirectUrls.length >= options.maxRedirects) {
        this._beforeError(new MaxRedirectsError(this));
        return;
      }
      this._request = void 0;
      const updatedOptions = new Options(void 0, void 0, this.options);
      const serverRequestedGet = statusCode === 303 && updatedOptions.method !== "GET" && updatedOptions.method !== "HEAD";
      const canRewrite = statusCode !== 307 && statusCode !== 308;
      const userRequestedGet = updatedOptions.methodRewriting && canRewrite;
      if (serverRequestedGet || userRequestedGet) {
        updatedOptions.method = "GET";
        updatedOptions.body = void 0;
        updatedOptions.json = void 0;
        updatedOptions.form = void 0;
        delete updatedOptions.headers["content-length"];
      }
      try {
        const redirectBuffer = import_node_buffer2.Buffer.from(response.headers.location, "binary").toString();
        const redirectUrl = new import_node_url3.URL(redirectBuffer, url2);
        if (!isUnixSocketURL(url2) && isUnixSocketURL(redirectUrl)) {
          this._beforeError(new RequestError("Cannot redirect to UNIX socket", {}, this));
          return;
        }
        if (redirectUrl.hostname !== url2.hostname || redirectUrl.port !== url2.port) {
          if ("host" in updatedOptions.headers) {
            delete updatedOptions.headers.host;
          }
          if ("cookie" in updatedOptions.headers) {
            delete updatedOptions.headers.cookie;
          }
          if ("authorization" in updatedOptions.headers) {
            delete updatedOptions.headers.authorization;
          }
          if (updatedOptions.username || updatedOptions.password) {
            updatedOptions.username = "";
            updatedOptions.password = "";
          }
        } else {
          redirectUrl.username = updatedOptions.username;
          redirectUrl.password = updatedOptions.password;
        }
        this.redirectUrls.push(redirectUrl);
        updatedOptions.prefixUrl = "";
        updatedOptions.url = redirectUrl;
        for (const hook of updatedOptions.hooks.beforeRedirect) {
          await hook(updatedOptions, typedResponse);
        }
        this.emit("redirect", updatedOptions, typedResponse);
        this.options = updatedOptions;
        await this._makeRequest();
      } catch (error) {
        this._beforeError(error);
        return;
      }
      return;
    }
    if (options.isStream && options.throwHttpErrors && !isResponseOk(typedResponse)) {
      this._beforeError(new HTTPError(typedResponse));
      return;
    }
    response.on("readable", () => {
      if (this._triggerRead) {
        this._read();
      }
    });
    this.on("resume", () => {
      response.resume();
    });
    this.on("pause", () => {
      response.pause();
    });
    response.once("end", () => {
      this.push(null);
    });
    if (this._noPipe) {
      const success = await this._setRawBody();
      if (success) {
        this.emit("response", response);
      }
      return;
    }
    this.emit("response", response);
    for (const destination of this._pipedServerResponses) {
      if (destination.headersSent) {
        continue;
      }
      for (const key in response.headers) {
        const isAllowed = options.decompress ? key !== "content-encoding" : true;
        const value = response.headers[key];
        if (isAllowed) {
          destination.setHeader(key, value);
        }
      }
      destination.statusCode = statusCode;
    }
  }
  async _setRawBody(from = this) {
    if (from.readableEnded) {
      return false;
    }
    try {
      const rawBody = await (0, import_get_stream2.buffer)(from);
      if (!this.isAborted) {
        this.response.rawBody = rawBody;
        return true;
      }
    } catch {
    }
    return false;
  }
  async _onResponse(response) {
    try {
      await this._onResponseBase(response);
    } catch (error) {
      this._beforeError(error);
    }
  }
  _onRequest(request2) {
    const { options } = this;
    const { timeout, url: url2 } = options;
    source_default(request2);
    if (this.options.http2) {
      request2.setTimeout(0);
    }
    this._cancelTimeouts = timedOut(request2, timeout, url2);
    const responseEventName = options.cache ? "cacheableResponse" : "response";
    request2.once(responseEventName, (response) => {
      void this._onResponse(response);
    });
    request2.once("error", (error) => {
      this._aborted = true;
      request2.destroy();
      error = error instanceof TimeoutError2 ? new TimeoutError(error, this.timings, this) : new RequestError(error.message, error, this);
      this._beforeError(error);
    });
    this._unproxyEvents = proxyEvents(request2, this, proxiedRequestEvents);
    this._request = request2;
    this.emit("uploadProgress", this.uploadProgress);
    this._sendBody();
    this.emit("request", request2);
  }
  async _asyncWrite(chunk) {
    return new Promise((resolve, reject) => {
      super.write(chunk, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
  _sendBody() {
    var _a;
    const { body } = this.options;
    const currentRequest = this.redirectUrls.length === 0 ? this : (_a = this._request) != null ? _a : this;
    if (dist_default.nodeStream(body)) {
      body.pipe(currentRequest);
    } else if (dist_default.generator(body) || dist_default.asyncGenerator(body)) {
      (async () => {
        try {
          for await (const chunk of body) {
            await this._asyncWrite(chunk);
          }
          super.end();
        } catch (error) {
          this._beforeError(error);
        }
      })();
    } else if (!dist_default.undefined(body)) {
      this._writeRequest(body, void 0, () => {
      });
      currentRequest.end();
    } else if (this._cannotHaveBody || this._noPipe) {
      currentRequest.end();
    }
  }
  _prepareCache(cache) {
    if (!cacheableStore.has(cache)) {
      const cacheableRequest = new dist_default2((requestOptions, handler) => {
        const result = requestOptions._request(requestOptions, handler);
        if (dist_default.promise(result)) {
          result.once = (event, handler2) => {
            if (event === "error") {
              (async () => {
                try {
                  await result;
                } catch (error) {
                  handler2(error);
                }
              })();
            } else if (event === "abort") {
              (async () => {
                try {
                  const request2 = await result;
                  request2.once("abort", handler2);
                } catch {
                }
              })();
            } else {
              throw new Error(`Unknown HTTP2 promise event: ${event}`);
            }
            return result;
          };
        }
        return result;
      }, cache);
      cacheableStore.set(cache, cacheableRequest.request());
    }
  }
  async _createCacheableRequest(url2, options) {
    return new Promise((resolve, reject) => {
      Object.assign(options, urlToOptions(url2));
      let request2;
      const cacheRequest = cacheableStore.get(options.cache)(options, async (response) => {
        response._readableState.autoDestroy = false;
        if (request2) {
          const fix = () => {
            if (response.req) {
              response.complete = response.req.res.complete;
            }
          };
          response.prependOnceListener("end", fix);
          fix();
          (await request2).emit("cacheableResponse", response);
        }
        resolve(response);
      });
      cacheRequest.once("error", reject);
      cacheRequest.once("request", async (requestOrPromise) => {
        request2 = requestOrPromise;
        resolve(request2);
      });
    });
  }
  async _makeRequest() {
    const { options } = this;
    const { headers, username, password } = options;
    const cookieJar = options.cookieJar;
    for (const key in headers) {
      if (dist_default.undefined(headers[key])) {
        delete headers[key];
      } else if (dist_default.null_(headers[key])) {
        throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${key}\` header`);
      }
    }
    if (options.decompress && dist_default.undefined(headers["accept-encoding"])) {
      headers["accept-encoding"] = supportsBrotli ? "gzip, deflate, br" : "gzip, deflate";
    }
    if (username || password) {
      const credentials = import_node_buffer2.Buffer.from(`${username}:${password}`).toString("base64");
      headers.authorization = `Basic ${credentials}`;
    }
    if (cookieJar) {
      const cookieString = await cookieJar.getCookieString(options.url.toString());
      if (dist_default.nonEmptyString(cookieString)) {
        headers.cookie = cookieString;
      }
    }
    options.prefixUrl = "";
    let request2;
    for (const hook of options.hooks.beforeRequest) {
      const result = await hook(options);
      if (!dist_default.undefined(result)) {
        request2 = () => result;
        break;
      }
    }
    if (!request2) {
      request2 = options.getRequestFunction();
    }
    const url2 = options.url;
    this._requestOptions = options.createNativeRequestOptions();
    if (options.cache) {
      this._requestOptions._request = request2;
      this._requestOptions.cache = options.cache;
      this._requestOptions.body = options.body;
      this._prepareCache(options.cache);
    }
    const fn = options.cache ? this._createCacheableRequest : request2;
    try {
      let requestOrResponse = fn(url2, this._requestOptions);
      if (dist_default.promise(requestOrResponse)) {
        requestOrResponse = await requestOrResponse;
      }
      if (dist_default.undefined(requestOrResponse)) {
        requestOrResponse = options.getFallbackRequestFunction()(url2, this._requestOptions);
        if (dist_default.promise(requestOrResponse)) {
          requestOrResponse = await requestOrResponse;
        }
      }
      if (is_client_request_default(requestOrResponse)) {
        this._onRequest(requestOrResponse);
      } else if (this.writable) {
        this.once("finish", () => {
          void this._onResponse(requestOrResponse);
        });
        this._sendBody();
      } else {
        void this._onResponse(requestOrResponse);
      }
    } catch (error) {
      if (error instanceof CacheError2) {
        throw new CacheError(error, this);
      }
      throw error;
    }
  }
  async _error(error) {
    try {
      if (error instanceof HTTPError && !this.options.throwHttpErrors) {
      } else {
        for (const hook of this.options.hooks.beforeError) {
          error = await hook(error);
        }
      }
    } catch (error_) {
      error = new RequestError(error_.message, error_, this);
    }
    this.destroy(error);
  }
  _writeRequest(chunk, encoding, callback) {
    if (!this._request || this._request.destroyed) {
      return;
    }
    this._request.write(chunk, encoding, (error) => {
      if (!error && !this._request.destroyed) {
        this._uploadedSize += import_node_buffer2.Buffer.byteLength(chunk, encoding);
        const progress = this.uploadProgress;
        if (progress.percent < 1) {
          this.emit("uploadProgress", progress);
        }
      }
      callback(error);
    });
  }
  get ip() {
    var _a;
    return (_a = this.socket) == null ? void 0 : _a.remoteAddress;
  }
  get isAborted() {
    return this._aborted;
  }
  get socket() {
    var _a, _b;
    return (_b = (_a = this._request) == null ? void 0 : _a.socket) != null ? _b : void 0;
  }
  get downloadProgress() {
    let percent;
    if (this._responseSize) {
      percent = this._downloadedSize / this._responseSize;
    } else if (this._responseSize === this._downloadedSize) {
      percent = 1;
    } else {
      percent = 0;
    }
    return {
      percent,
      transferred: this._downloadedSize,
      total: this._responseSize
    };
  }
  get uploadProgress() {
    let percent;
    if (this._bodySize) {
      percent = this._uploadedSize / this._bodySize;
    } else if (this._bodySize === this._uploadedSize) {
      percent = 1;
    } else {
      percent = 0;
    }
    return {
      percent,
      transferred: this._uploadedSize,
      total: this._bodySize
    };
  }
  get timings() {
    var _a;
    return (_a = this._request) == null ? void 0 : _a.timings;
  }
  get isFromCache() {
    return this._isFromCache;
  }
  get reusedSocket() {
    var _a;
    return (_a = this._request) == null ? void 0 : _a.reusedSocket;
  }
};

// node_modules/got/dist/source/as-promise/types.js
var CancelError2 = class extends RequestError {
  constructor(request2) {
    super("Promise was canceled", {}, request2);
    this.name = "CancelError";
    this.code = "ERR_CANCELED";
  }
  get isCanceled() {
    return true;
  }
};

// node_modules/got/dist/source/as-promise/index.js
var proxiedRequestEvents2 = [
  "request",
  "response",
  "redirect",
  "uploadProgress",
  "downloadProgress"
];
function asPromise(firstRequest) {
  let globalRequest;
  let globalResponse;
  let normalizedOptions;
  const emitter = new import_node_events2.EventEmitter();
  const promise = new PCancelable((resolve, reject, onCancel) => {
    onCancel(() => {
      globalRequest.destroy();
    });
    onCancel.shouldReject = false;
    onCancel(() => {
      reject(new CancelError2(globalRequest));
    });
    const makeRequest = (retryCount) => {
      var _a;
      onCancel(() => {
      });
      const request2 = firstRequest != null ? firstRequest : new Request(void 0, void 0, normalizedOptions);
      request2.retryCount = retryCount;
      request2._noPipe = true;
      globalRequest = request2;
      request2.once("response", async (response) => {
        var _a2;
        const contentEncoding = ((_a2 = response.headers["content-encoding"]) != null ? _a2 : "").toLowerCase();
        const isCompressed = contentEncoding === "gzip" || contentEncoding === "deflate" || contentEncoding === "br";
        const { options } = request2;
        if (isCompressed && !options.decompress) {
          response.body = response.rawBody;
        } else {
          try {
            response.body = parseBody(response, options.responseType, options.parseJson, options.encoding);
          } catch (error) {
            response.body = response.rawBody.toString();
            if (isResponseOk(response)) {
              request2._beforeError(error);
              return;
            }
          }
        }
        try {
          const hooks = options.hooks.afterResponse;
          for (const [index, hook] of hooks.entries()) {
            response = await hook(response, async (updatedOptions) => {
              options.merge(updatedOptions);
              options.prefixUrl = "";
              if (updatedOptions.url) {
                options.url = updatedOptions.url;
              }
              options.hooks.afterResponse = options.hooks.afterResponse.slice(0, index);
              throw new RetryError(request2);
            });
            if (!(dist_default.object(response) && dist_default.number(response.statusCode) && !dist_default.nullOrUndefined(response.body))) {
              throw new TypeError("The `afterResponse` hook returned an invalid value");
            }
          }
        } catch (error) {
          request2._beforeError(error);
          return;
        }
        globalResponse = response;
        if (!isResponseOk(response)) {
          request2._beforeError(new HTTPError(response));
          return;
        }
        request2.destroy();
        resolve(request2.options.resolveBodyOnly ? response.body : response);
      });
      const onError = (error) => {
        if (promise.isCanceled) {
          return;
        }
        const { options } = request2;
        if (error instanceof HTTPError && !options.throwHttpErrors) {
          const { response } = error;
          request2.destroy();
          resolve(request2.options.resolveBodyOnly ? response.body : response);
          return;
        }
        reject(error);
      };
      request2.once("error", onError);
      const previousBody = (_a = request2.options) == null ? void 0 : _a.body;
      request2.once("retry", (newRetryCount, error) => {
        firstRequest = void 0;
        const newBody = request2.options.body;
        if (previousBody === newBody && dist_default.nodeStream(newBody)) {
          error.message = "Cannot retry with consumed body stream";
          onError(error);
          return;
        }
        normalizedOptions = request2.options;
        makeRequest(newRetryCount);
      });
      proxyEvents(request2, emitter, proxiedRequestEvents2);
      if (dist_default.undefined(firstRequest)) {
        void request2.flush();
      }
    };
    makeRequest(0);
  });
  promise.on = (event, fn) => {
    emitter.on(event, fn);
    return promise;
  };
  promise.off = (event, fn) => {
    emitter.off(event, fn);
    return promise;
  };
  const shortcut = (responseType) => {
    const newPromise = (async () => {
      await promise;
      const { options } = globalResponse.request;
      return parseBody(globalResponse, responseType, options.parseJson, options.encoding);
    })();
    Object.defineProperties(newPromise, Object.getOwnPropertyDescriptors(promise));
    return newPromise;
  };
  promise.json = () => {
    if (globalRequest.options) {
      const { headers } = globalRequest.options;
      if (!globalRequest.writableFinished && !("accept" in headers)) {
        headers.accept = "application/json";
      }
    }
    return shortcut("json");
  };
  promise.buffer = () => shortcut("buffer");
  promise.text = () => shortcut("text");
  return promise;
}

// node_modules/got/dist/source/create.js
var delay = async (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
var isGotInstance = (value) => dist_default.function_(value);
var aliases = [
  "get",
  "post",
  "put",
  "patch",
  "head",
  "delete"
];
var create = (defaults2) => {
  defaults2 = {
    options: new Options(void 0, void 0, defaults2.options),
    handlers: [...defaults2.handlers],
    mutableDefaults: defaults2.mutableDefaults
  };
  Object.defineProperty(defaults2, "mutableDefaults", {
    enumerable: true,
    configurable: false,
    writable: false
  });
  const got2 = (url2, options, defaultOptions2 = defaults2.options) => {
    const request2 = new Request(url2, options, defaultOptions2);
    let promise;
    const lastHandler = (normalized) => {
      request2.options = normalized;
      request2._noPipe = !normalized.isStream;
      void request2.flush();
      if (normalized.isStream) {
        return request2;
      }
      if (!promise) {
        promise = asPromise(request2);
      }
      return promise;
    };
    let iteration = 0;
    const iterateHandlers = (newOptions) => {
      var _a;
      const handler = (_a = defaults2.handlers[iteration++]) != null ? _a : lastHandler;
      const result = handler(newOptions, iterateHandlers);
      if (dist_default.promise(result) && !request2.options.isStream) {
        if (!promise) {
          promise = asPromise(request2);
        }
        if (result !== promise) {
          const descriptors = Object.getOwnPropertyDescriptors(promise);
          for (const key in descriptors) {
            if (key in result) {
              delete descriptors[key];
            }
          }
          Object.defineProperties(result, descriptors);
          result.cancel = promise.cancel;
        }
      }
      return result;
    };
    return iterateHandlers(request2.options);
  };
  got2.extend = (...instancesOrOptions) => {
    const options = new Options(void 0, void 0, defaults2.options);
    const handlers = [...defaults2.handlers];
    let mutableDefaults;
    for (const value of instancesOrOptions) {
      if (isGotInstance(value)) {
        options.merge(value.defaults.options);
        handlers.push(...value.defaults.handlers);
        mutableDefaults = value.defaults.mutableDefaults;
      } else {
        options.merge(value);
        if (value.handlers) {
          handlers.push(...value.handlers);
        }
        mutableDefaults = value.mutableDefaults;
      }
    }
    return create({
      options,
      handlers,
      mutableDefaults: Boolean(mutableDefaults)
    });
  };
  const paginateEach = async function* (url2, options) {
    let normalizedOptions = new Options(url2, options, defaults2.options);
    normalizedOptions.resolveBodyOnly = false;
    const { pagination } = normalizedOptions;
    assert.function_(pagination.transform);
    assert.function_(pagination.shouldContinue);
    assert.function_(pagination.filter);
    assert.function_(pagination.paginate);
    assert.number(pagination.countLimit);
    assert.number(pagination.requestLimit);
    assert.number(pagination.backoff);
    const allItems = [];
    let { countLimit } = pagination;
    let numberOfRequests = 0;
    while (numberOfRequests < pagination.requestLimit) {
      if (numberOfRequests !== 0) {
        await delay(pagination.backoff);
      }
      const response = await got2(void 0, void 0, normalizedOptions);
      const parsed = await pagination.transform(response);
      const currentItems = [];
      assert.array(parsed);
      for (const item of parsed) {
        if (pagination.filter({ item, currentItems, allItems })) {
          if (!pagination.shouldContinue({ item, currentItems, allItems })) {
            return;
          }
          yield item;
          if (pagination.stackAllItems) {
            allItems.push(item);
          }
          currentItems.push(item);
          if (--countLimit <= 0) {
            return;
          }
        }
      }
      const optionsToMerge = pagination.paginate({
        response,
        currentItems,
        allItems
      });
      if (optionsToMerge === false) {
        return;
      }
      if (optionsToMerge === response.request.options) {
        normalizedOptions = response.request.options;
      } else {
        normalizedOptions.merge(optionsToMerge);
        assert.any([dist_default.urlInstance, dist_default.undefined], optionsToMerge.url);
        if (optionsToMerge.url !== void 0) {
          normalizedOptions.prefixUrl = "";
          normalizedOptions.url = optionsToMerge.url;
        }
      }
      numberOfRequests++;
    }
  };
  got2.paginate = paginateEach;
  got2.paginate.all = async (url2, options) => {
    const results = [];
    for await (const item of paginateEach(url2, options)) {
      results.push(item);
    }
    return results;
  };
  got2.paginate.each = paginateEach;
  got2.stream = (url2, options) => got2(url2, { ...options, isStream: true });
  for (const method of aliases) {
    got2[method] = (url2, options) => got2(url2, { ...options, method });
    got2.stream[method] = (url2, options) => got2(url2, { ...options, method, isStream: true });
  }
  if (!defaults2.mutableDefaults) {
    Object.freeze(defaults2.handlers);
    defaults2.options.freeze();
  }
  Object.defineProperty(got2, "defaults", {
    value: defaults2,
    writable: false,
    configurable: false,
    enumerable: true
  });
  return got2;
};
var create_default = create;

// node_modules/got/dist/source/index.js
var defaults = {
  options: new Options(),
  handlers: [],
  mutableDefaults: false
};
var got = create_default(defaults);
var source_default2 = got;

// src/common/http.ts
var import_http_proxy_agent = __toESM(require_dist2());
var import_https_proxy_agent = __toESM(require_dist3());
var import_socks_proxy_agent = __toESM(require_dist4());
var import_url = __toESM(require("url"));
var ProxyAgentMap = {
  "http:": import_http_proxy_agent.HttpProxyAgent,
  "https:": import_https_proxy_agent.HttpsProxyAgent,
  "socks:": import_socks_proxy_agent.SocksProxyAgent
};
function isProxyAgentProtocal(protocol) {
  return protocol in ProxyAgentMap;
}
var getProxyAgent = (proxy) => {
  if (isEmpty_default(proxy)) {
    return;
  }
  proxy = proxy.replace("localhost", "127.0.0.1");
  const protocol = import_url.default.parse(proxy).protocol;
  if (protocol && isProxyAgentProtocal(protocol)) {
    const agent = new ProxyAgentMap[protocol](proxy);
    return agent;
  }
  throw new Error(`Not supported protocol: ${proxy}`);
};
var getGotInstance = (cfg) => {
  const agent = getProxyAgent(cfg.proxy);
  return source_default2.extend({
    timeout: {
      request: cfg.timeout
    },
    agent: {
      http: agent,
      https: agent
    }
  });
};

// src/common/logger.ts
var logger = new HelperLogger(EXT_NAME);

// src/common/vim.ts
var import_coc16 = require("coc.nvim");
var getWordStr = async () => {
  const word = await import_coc16.workspace.nvim.eval('expand("<cword>")');
  if (typeof word !== "string") {
    logger.error("failed to get the word");
    throw new Error("failed to get the word");
  }
  return word;
};
var getLineStr = async () => {
  const line = await import_coc16.workspace.nvim.eval('getline(".")');
  if (typeof line !== "string") {
    logger.error("failed to get the content of the line");
    throw new Error("failed to get the content of the line");
  }
  return line;
};
var getVisualSelectedStr = async () => {
  const range = await import_coc16.window.getSelectedRange("v");
  if (range === null) {
    logger.error("visual range is empty");
    throw new Error("visual range is empty");
  }
  const doc = await import_coc16.workspace.document;
  const lines = doc.getLines(range.start.line, range.end.line + 1);
  if (lines.length === 0) {
    logger.error("no lines are selected");
    throw new Error("no lines are selected");
  }
  lines[lines.length - 1] = lines[lines.length - 1].slice(0, range.end.character);
  lines[0] = lines[0].slice(range.start.character);
  return lines.join("\n");
};

// node_modules/tslib/modules/index.js
var import_tslib = __toESM(require_tslib(), 1);
var {
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __exportStar,
  __createBinding,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet: __classPrivateFieldGet2,
  __classPrivateFieldSet: __classPrivateFieldSet2,
  __classPrivateFieldIn
} = import_tslib.default;

// node_modules/@aws-sdk/middleware-serde/dist-es/deserializerMiddleware.js
var deserializerMiddleware = function(options, deserializer) {
  return function(next, context) {
    return function(args) {
      return __awaiter(void 0, void 0, void 0, function() {
        var response, parsed, error_1;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, next(args)];
            case 1:
              response = _a.sent().response;
              _a.label = 2;
            case 2:
              _a.trys.push([2, 4, , 5]);
              return [4, deserializer(response, options)];
            case 3:
              parsed = _a.sent();
              return [2, {
                response,
                output: parsed
              }];
            case 4:
              error_1 = _a.sent();
              Object.defineProperty(error_1, "$response", {
                value: response
              });
              throw error_1;
            case 5:
              return [2];
          }
        });
      });
    };
  };
};

// node_modules/@aws-sdk/middleware-serde/dist-es/serializerMiddleware.js
var serializerMiddleware = function(options, serializer) {
  return function(next, context) {
    return function(args) {
      return __awaiter(void 0, void 0, void 0, function() {
        var endpoint, request2;
        var _a;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              endpoint = ((_a = context.endpointV2) === null || _a === void 0 ? void 0 : _a.url) && options.urlParser ? function() {
                return __awaiter(void 0, void 0, void 0, function() {
                  return __generator(this, function(_a2) {
                    return [2, options.urlParser(context.endpointV2.url)];
                  });
                });
              } : options.endpoint;
              if (!endpoint) {
                throw new Error("No valid endpoint provider available.");
              }
              return [4, serializer(args.input, __assign(__assign({}, options), { endpoint }))];
            case 1:
              request2 = _b.sent();
              return [2, next(__assign(__assign({}, args), { request: request2 }))];
          }
        });
      });
    };
  };
};

// node_modules/@aws-sdk/middleware-serde/dist-es/serdePlugin.js
var deserializerMiddlewareOption = {
  name: "deserializerMiddleware",
  step: "deserialize",
  tags: ["DESERIALIZER"],
  override: true
};
var serializerMiddlewareOption = {
  name: "serializerMiddleware",
  step: "serialize",
  tags: ["SERIALIZER"],
  override: true
};
function getSerdePlugin(config, serializer, deserializer) {
  return {
    applyToStack: function(commandStack) {
      commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
      commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
    }
  };
}

// node_modules/@aws-sdk/middleware-stack/dist-es/MiddlewareStack.js
var constructStack = function() {
  var absoluteEntries = [];
  var relativeEntries = [];
  var entriesNameSet = /* @__PURE__ */ new Set();
  var sort = function(entries2) {
    return entries2.sort(function(a, b) {
      return stepWeights[b.step] - stepWeights[a.step] || priorityWeights[b.priority || "normal"] - priorityWeights[a.priority || "normal"];
    });
  };
  var removeByName = function(toRemove) {
    var isRemoved = false;
    var filterCb = function(entry) {
      if (entry.name && entry.name === toRemove) {
        isRemoved = true;
        entriesNameSet.delete(toRemove);
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  var removeByReference = function(toRemove) {
    var isRemoved = false;
    var filterCb = function(entry) {
      if (entry.middleware === toRemove) {
        isRemoved = true;
        if (entry.name)
          entriesNameSet.delete(entry.name);
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  var cloneTo = function(toStack) {
    absoluteEntries.forEach(function(entry) {
      toStack.add(entry.middleware, __assign({}, entry));
    });
    relativeEntries.forEach(function(entry) {
      toStack.addRelativeTo(entry.middleware, __assign({}, entry));
    });
    return toStack;
  };
  var expandRelativeMiddlewareList = function(from) {
    var expandedMiddlewareList = [];
    from.before.forEach(function(entry) {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push.apply(expandedMiddlewareList, __spreadArray([], __read(expandRelativeMiddlewareList(entry)), false));
      }
    });
    expandedMiddlewareList.push(from);
    from.after.reverse().forEach(function(entry) {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push.apply(expandedMiddlewareList, __spreadArray([], __read(expandRelativeMiddlewareList(entry)), false));
      }
    });
    return expandedMiddlewareList;
  };
  var getMiddlewareList = function(debug) {
    if (debug === void 0) {
      debug = false;
    }
    var normalizedAbsoluteEntries = [];
    var normalizedRelativeEntries = [];
    var normalizedEntriesNameMap = {};
    absoluteEntries.forEach(function(entry) {
      var normalizedEntry = __assign(__assign({}, entry), { before: [], after: [] });
      if (normalizedEntry.name)
        normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
      normalizedAbsoluteEntries.push(normalizedEntry);
    });
    relativeEntries.forEach(function(entry) {
      var normalizedEntry = __assign(__assign({}, entry), { before: [], after: [] });
      if (normalizedEntry.name)
        normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
      normalizedRelativeEntries.push(normalizedEntry);
    });
    normalizedRelativeEntries.forEach(function(entry) {
      if (entry.toMiddleware) {
        var toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
        if (toMiddleware === void 0) {
          if (debug) {
            return;
          }
          throw new Error("".concat(entry.toMiddleware, " is not found when adding ").concat(entry.name || "anonymous", " middleware ").concat(entry.relation, " ").concat(entry.toMiddleware));
        }
        if (entry.relation === "after") {
          toMiddleware.after.push(entry);
        }
        if (entry.relation === "before") {
          toMiddleware.before.push(entry);
        }
      }
    });
    var mainChain = sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce(function(wholeList, expendedMiddlewareList) {
      wholeList.push.apply(wholeList, __spreadArray([], __read(expendedMiddlewareList), false));
      return wholeList;
    }, []);
    return mainChain;
  };
  var stack = {
    add: function(middleware, options) {
      if (options === void 0) {
        options = {};
      }
      var name = options.name, override = options.override;
      var entry = __assign({ step: "initialize", priority: "normal", middleware }, options);
      if (name) {
        if (entriesNameSet.has(name)) {
          if (!override)
            throw new Error("Duplicate middleware name '".concat(name, "'"));
          var toOverrideIndex = absoluteEntries.findIndex(function(entry2) {
            return entry2.name === name;
          });
          var toOverride = absoluteEntries[toOverrideIndex];
          if (toOverride.step !== entry.step || toOverride.priority !== entry.priority) {
            throw new Error('"'.concat(name, '" middleware with ').concat(toOverride.priority, " priority in ").concat(toOverride.step, " step cannot be ") + "overridden by same-name middleware with ".concat(entry.priority, " priority in ").concat(entry.step, " step."));
          }
          absoluteEntries.splice(toOverrideIndex, 1);
        }
        entriesNameSet.add(name);
      }
      absoluteEntries.push(entry);
    },
    addRelativeTo: function(middleware, options) {
      var name = options.name, override = options.override;
      var entry = __assign({ middleware }, options);
      if (name) {
        if (entriesNameSet.has(name)) {
          if (!override)
            throw new Error("Duplicate middleware name '".concat(name, "'"));
          var toOverrideIndex = relativeEntries.findIndex(function(entry2) {
            return entry2.name === name;
          });
          var toOverride = relativeEntries[toOverrideIndex];
          if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
            throw new Error('"'.concat(name, '" middleware ').concat(toOverride.relation, ' "').concat(toOverride.toMiddleware, '" middleware cannot be overridden ') + "by same-name middleware ".concat(entry.relation, ' "').concat(entry.toMiddleware, '" middleware.'));
          }
          relativeEntries.splice(toOverrideIndex, 1);
        }
        entriesNameSet.add(name);
      }
      relativeEntries.push(entry);
    },
    clone: function() {
      return cloneTo(constructStack());
    },
    use: function(plugin) {
      plugin.applyToStack(stack);
    },
    remove: function(toRemove) {
      if (typeof toRemove === "string")
        return removeByName(toRemove);
      else
        return removeByReference(toRemove);
    },
    removeByTag: function(toRemove) {
      var isRemoved = false;
      var filterCb = function(entry) {
        var tags = entry.tags, name = entry.name;
        if (tags && tags.includes(toRemove)) {
          if (name)
            entriesNameSet.delete(name);
          isRemoved = true;
          return false;
        }
        return true;
      };
      absoluteEntries = absoluteEntries.filter(filterCb);
      relativeEntries = relativeEntries.filter(filterCb);
      return isRemoved;
    },
    concat: function(from) {
      var cloned = cloneTo(constructStack());
      cloned.use(from);
      return cloned;
    },
    applyToStack: cloneTo,
    identify: function() {
      return getMiddlewareList(true).map(function(mw) {
        return mw.name + ": " + (mw.tags || []).join(",");
      });
    },
    resolve: function(handler, context) {
      var e_1, _a;
      try {
        for (var _b = __values(getMiddlewareList().map(function(entry) {
          return entry.middleware;
        }).reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var middleware = _c.value;
          handler = middleware(handler, context);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return))
            _a.call(_b);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      return handler;
    }
  };
  return stack;
};
var stepWeights = {
  initialize: 5,
  serialize: 4,
  build: 3,
  finalizeRequest: 2,
  deserialize: 1
};
var priorityWeights = {
  high: 3,
  normal: 2,
  low: 1
};

// node_modules/@aws-sdk/smithy-client/dist-es/client.js
var Client = function() {
  function Client2(config) {
    this.middlewareStack = constructStack();
    this.config = config;
  }
  Client2.prototype.send = function(command, optionsOrCb, cb) {
    var options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
    var callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
    var handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
    if (callback) {
      handler(command).then(function(result) {
        return callback(null, result.output);
      }, function(err) {
        return callback(err);
      }).catch(function() {
      });
    } else {
      return handler(command).then(function(result) {
        return result.output;
      });
    }
  };
  Client2.prototype.destroy = function() {
    if (this.config.requestHandler.destroy)
      this.config.requestHandler.destroy();
  };
  return Client2;
}();

// node_modules/@aws-sdk/smithy-client/dist-es/command.js
var Command = function() {
  function Command2() {
    this.middlewareStack = constructStack();
  }
  return Command2;
}();

// node_modules/@aws-sdk/smithy-client/dist-es/constants.js
var SENSITIVE_STRING = "***SensitiveInformation***";

// node_modules/@aws-sdk/smithy-client/dist-es/parse-utils.js
var expectNumber = function(value) {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    var parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      if (String(parsed) !== String(value)) {
        logger2.warn(stackTraceWarning("Expected number but observed string: ".concat(value)));
      }
      return parsed;
    }
  }
  if (typeof value === "number") {
    return value;
  }
  throw new TypeError("Expected number, got ".concat(typeof value, ": ").concat(value));
};
var MAX_FLOAT = Math.ceil(Math.pow(2, 127) * (2 - Math.pow(2, -23)));
var expectFloat32 = function(value) {
  var expected = expectNumber(value);
  if (expected !== void 0 && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
    if (Math.abs(expected) > MAX_FLOAT) {
      throw new TypeError("Expected 32-bit float, got ".concat(value));
    }
  }
  return expected;
};
var expectLong = function(value) {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (Number.isInteger(value) && !Number.isNaN(value)) {
    return value;
  }
  throw new TypeError("Expected integer, got ".concat(typeof value, ": ").concat(value));
};
var expectInt32 = function(value) {
  return expectSizedInt(value, 32);
};
var expectShort = function(value) {
  return expectSizedInt(value, 16);
};
var expectByte = function(value) {
  return expectSizedInt(value, 8);
};
var expectSizedInt = function(value, size) {
  var expected = expectLong(value);
  if (expected !== void 0 && castInt(expected, size) !== expected) {
    throw new TypeError("Expected ".concat(size, "-bit integer, got ").concat(value));
  }
  return expected;
};
var castInt = function(value, size) {
  switch (size) {
    case 32:
      return Int32Array.of(value)[0];
    case 16:
      return Int16Array.of(value)[0];
    case 8:
      return Int8Array.of(value)[0];
  }
};
var expectNonNull = function(value, location) {
  if (value === null || value === void 0) {
    if (location) {
      throw new TypeError("Expected a non-null value for ".concat(location));
    }
    throw new TypeError("Expected a non-null value");
  }
  return value;
};
var expectObject = function(value) {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  var receivedType = Array.isArray(value) ? "array" : typeof value;
  throw new TypeError("Expected object, got ".concat(receivedType, ": ").concat(value));
};
var expectString = function(value) {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    return value;
  }
  if (["boolean", "number", "bigint"].includes(typeof value)) {
    logger2.warn(stackTraceWarning("Expected string, got ".concat(typeof value, ": ").concat(value)));
    return String(value);
  }
  throw new TypeError("Expected string, got ".concat(typeof value, ": ").concat(value));
};
var strictParseFloat32 = function(value) {
  if (typeof value == "string") {
    return expectFloat32(parseNumber(value));
  }
  return expectFloat32(value);
};
var NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
var parseNumber = function(value) {
  var matches = value.match(NUMBER_REGEX);
  if (matches === null || matches[0].length !== value.length) {
    throw new TypeError("Expected real number, got implicit NaN");
  }
  return parseFloat(value);
};
var strictParseInt32 = function(value) {
  if (typeof value === "string") {
    return expectInt32(parseNumber(value));
  }
  return expectInt32(value);
};
var strictParseShort = function(value) {
  if (typeof value === "string") {
    return expectShort(parseNumber(value));
  }
  return expectShort(value);
};
var strictParseByte = function(value) {
  if (typeof value === "string") {
    return expectByte(parseNumber(value));
  }
  return expectByte(value);
};
var stackTraceWarning = function(message) {
  return String(new TypeError(message).stack || message).split("\n").slice(0, 5).filter(function(s) {
    return !s.includes("stackTraceWarning");
  }).join("\n");
};
var logger2 = {
  warn: console.warn
};

// node_modules/@aws-sdk/smithy-client/dist-es/date-utils.js
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var RFC3339 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
var parseRfc3339DateTime = function(value) {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC-3339 date-times must be expressed as strings");
  }
  var match = RFC3339.exec(value);
  if (!match) {
    throw new TypeError("Invalid RFC-3339 date-time value");
  }
  var _a = __read(match, 8), _ = _a[0], yearStr = _a[1], monthStr = _a[2], dayStr = _a[3], hours = _a[4], minutes = _a[5], seconds = _a[6], fractionalMilliseconds = _a[7];
  var year = strictParseShort(stripLeadingZeroes(yearStr));
  var month = parseDateValue(monthStr, "month", 1, 12);
  var day = parseDateValue(dayStr, "day", 1, 31);
  return buildDate(year, month, day, { hours, minutes, seconds, fractionalMilliseconds });
};
var IMF_FIXDATE = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var RFC_850_DATE = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var ASC_TIME = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
var buildDate = function(year, month, day, time) {
  var adjustedMonth = month - 1;
  validateDayOfMonth(year, adjustedMonth, day);
  return new Date(Date.UTC(year, adjustedMonth, day, parseDateValue(time.hours, "hour", 0, 23), parseDateValue(time.minutes, "minute", 0, 59), parseDateValue(time.seconds, "seconds", 0, 60), parseMilliseconds(time.fractionalMilliseconds)));
};
var FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var validateDayOfMonth = function(year, month, day) {
  var maxDays = DAYS_IN_MONTH[month];
  if (month === 1 && isLeapYear(year)) {
    maxDays = 29;
  }
  if (day > maxDays) {
    throw new TypeError("Invalid day for ".concat(MONTHS[month], " in ").concat(year, ": ").concat(day));
  }
};
var isLeapYear = function(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};
var parseDateValue = function(value, type, lower, upper) {
  var dateVal = strictParseByte(stripLeadingZeroes(value));
  if (dateVal < lower || dateVal > upper) {
    throw new TypeError("".concat(type, " must be between ").concat(lower, " and ").concat(upper, ", inclusive"));
  }
  return dateVal;
};
var parseMilliseconds = function(value) {
  if (value === null || value === void 0) {
    return 0;
  }
  return strictParseFloat32("0." + value) * 1e3;
};
var stripLeadingZeroes = function(value) {
  var idx = 0;
  while (idx < value.length - 1 && value.charAt(idx) === "0") {
    idx++;
  }
  if (idx === 0) {
    return value;
  }
  return value.slice(idx);
};

// node_modules/@aws-sdk/smithy-client/dist-es/exceptions.js
var ServiceException = function(_super) {
  __extends(ServiceException2, _super);
  function ServiceException2(options) {
    var _this = _super.call(this, options.message) || this;
    Object.setPrototypeOf(_this, ServiceException2.prototype);
    _this.name = options.name;
    _this.$fault = options.$fault;
    _this.$metadata = options.$metadata;
    return _this;
  }
  return ServiceException2;
}(Error);
var decorateServiceException = function(exception, additions) {
  if (additions === void 0) {
    additions = {};
  }
  Object.entries(additions).filter(function(_a) {
    var _b = __read(_a, 2), v = _b[1];
    return v !== void 0;
  }).forEach(function(_a) {
    var _b = __read(_a, 2), k = _b[0], v = _b[1];
    if (exception[k] == void 0 || exception[k] === "") {
      exception[k] = v;
    }
  });
  var message = exception.message || exception.Message || "UnknownError";
  exception.message = message;
  delete exception.Message;
  return exception;
};

// node_modules/@aws-sdk/smithy-client/dist-es/default-error-handler.js
var throwDefaultError = function(_a) {
  var output = _a.output, parsedBody = _a.parsedBody, exceptionCtor = _a.exceptionCtor, errorCode = _a.errorCode;
  var $metadata = deserializeMetadata(output);
  var statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0;
  var response = new exceptionCtor({
    name: parsedBody.code || parsedBody.Code || errorCode || statusCode || "UnknowError",
    $fault: "client",
    $metadata
  });
  throw decorateServiceException(response, parsedBody);
};
var deserializeMetadata = function(output) {
  var _a;
  return {
    httpStatusCode: output.statusCode,
    requestId: (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"]
  };
};

// node_modules/@aws-sdk/smithy-client/dist-es/defaults-mode.js
var loadConfigsForDefaultMode = function(mode) {
  switch (mode) {
    case "standard":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "in-region":
      return {
        retryMode: "standard",
        connectionTimeout: 1100
      };
    case "cross-region":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "mobile":
      return {
        retryMode: "standard",
        connectionTimeout: 3e4
      };
    default:
      return {};
  }
};

// node_modules/@aws-sdk/smithy-client/dist-es/emitWarningIfUnsupportedVersion.js
var warningEmitted = false;
var emitWarningIfUnsupportedVersion = function(version3) {
  if (version3 && !warningEmitted && parseInt(version3.substring(1, version3.indexOf("."))) < 14) {
    warningEmitted = true;
    process.emitWarning("The AWS SDK for JavaScript (v3) will\n" + "no longer support Node.js ".concat(version3, " on November 1, 2022.\n\n") + "To continue receiving updates to AWS services, bug fixes, and security\nupdates please upgrade to Node.js 14.x or later.\n\nFor details, please refer our blog post: https://a.co/48dbdYz", "NodeDeprecationWarning");
  }
};

// node_modules/@aws-sdk/smithy-client/dist-es/extended-encode-uri-component.js
function extendedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

// node_modules/@aws-sdk/smithy-client/dist-es/get-value-from-text-node.js
var getValueFromTextNode = function(obj) {
  var textNodeName = "#text";
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== void 0) {
      obj[key] = obj[key][textNodeName];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = getValueFromTextNode(obj[key]);
    }
  }
  return obj;
};

// node_modules/@aws-sdk/smithy-client/dist-es/lazy-json.js
var StringWrapper = function() {
  var Class = Object.getPrototypeOf(this).constructor;
  var Constructor = Function.bind.apply(String, __spreadArray([null], __read(arguments), false));
  var instance = new Constructor();
  Object.setPrototypeOf(instance, Class.prototype);
  return instance;
};
StringWrapper.prototype = Object.create(String.prototype, {
  constructor: {
    value: StringWrapper,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
Object.setPrototypeOf(StringWrapper, String);
var LazyJsonString = function(_super) {
  __extends(LazyJsonString2, _super);
  function LazyJsonString2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  LazyJsonString2.prototype.deserializeJSON = function() {
    return JSON.parse(_super.prototype.toString.call(this));
  };
  LazyJsonString2.prototype.toJSON = function() {
    return _super.prototype.toString.call(this);
  };
  LazyJsonString2.fromObject = function(object) {
    if (object instanceof LazyJsonString2) {
      return object;
    } else if (object instanceof String || typeof object === "string") {
      return new LazyJsonString2(object);
    }
    return new LazyJsonString2(JSON.stringify(object));
  };
  return LazyJsonString2;
}(StringWrapper);

// node_modules/@aws-sdk/smithy-client/dist-es/object-mapping.js
function map2(arg0, arg1, arg2) {
  var e_1, _a;
  var target;
  var filter2;
  var instructions;
  if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
    target = {};
    instructions = arg0;
  } else {
    target = arg0;
    if (typeof arg1 === "function") {
      filter2 = arg1;
      instructions = arg2;
      return mapWithFilter(target, filter2, instructions);
    } else {
      instructions = arg1;
    }
  }
  try {
    for (var _b = __values(Object.keys(instructions)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      if (!Array.isArray(instructions[key])) {
        target[key] = instructions[key];
        continue;
      }
      var _d = __read(instructions[key], 2), filter_1 = _d[0], value = _d[1];
      if (typeof value === "function") {
        var _value = void 0;
        var defaultFilterPassed = filter_1 === void 0 && (_value = value()) != null;
        var customFilterPassed = typeof filter_1 === "function" && !!filter_1(void 0) || typeof filter_1 !== "function" && !!filter_1;
        if (defaultFilterPassed) {
          target[key] = _value;
        } else if (customFilterPassed) {
          target[key] = value();
        }
      } else {
        var defaultFilterPassed = filter_1 === void 0 && value != null;
        var customFilterPassed = typeof filter_1 === "function" && !!filter_1(value) || typeof filter_1 !== "function" && !!filter_1;
        if (defaultFilterPassed || customFilterPassed) {
          target[key] = value;
        }
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return))
        _a.call(_b);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return target;
}
var mapWithFilter = function(target, filter2, instructions) {
  return map2(target, Object.entries(instructions).reduce(function(_instructions, _a) {
    var _b = __read(_a, 2), key = _b[0], value = _b[1];
    if (Array.isArray(value)) {
      _instructions[key] = value;
    } else {
      if (typeof value === "function") {
        _instructions[key] = [filter2, value()];
      } else {
        _instructions[key] = [filter2, value];
      }
    }
    return _instructions;
  }, {}));
};

// node_modules/@aws-sdk/client-translate/dist-es/models/TranslateServiceException.js
var TranslateServiceException = function(_super) {
  __extends(TranslateServiceException2, _super);
  function TranslateServiceException2(options) {
    var _this = _super.call(this, options) || this;
    Object.setPrototypeOf(_this, TranslateServiceException2.prototype);
    return _this;
  }
  return TranslateServiceException2;
}(ServiceException);

// node_modules/@aws-sdk/client-translate/dist-es/models/models_0.js
var ConcurrentModificationException = function(_super) {
  __extends(ConcurrentModificationException2, _super);
  function ConcurrentModificationException2(opts) {
    var _this = _super.call(this, __assign({ name: "ConcurrentModificationException", $fault: "client" }, opts)) || this;
    _this.name = "ConcurrentModificationException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, ConcurrentModificationException2.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return ConcurrentModificationException2;
}(TranslateServiceException);
var ConflictException = function(_super) {
  __extends(ConflictException2, _super);
  function ConflictException2(opts) {
    var _this = _super.call(this, __assign({ name: "ConflictException", $fault: "client" }, opts)) || this;
    _this.name = "ConflictException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, ConflictException2.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return ConflictException2;
}(TranslateServiceException);
var EncryptionKeyType;
(function(EncryptionKeyType2) {
  EncryptionKeyType2["KMS"] = "KMS";
})(EncryptionKeyType || (EncryptionKeyType = {}));
var ParallelDataFormat;
(function(ParallelDataFormat2) {
  ParallelDataFormat2["CSV"] = "CSV";
  ParallelDataFormat2["TMX"] = "TMX";
  ParallelDataFormat2["TSV"] = "TSV";
})(ParallelDataFormat || (ParallelDataFormat = {}));
var ParallelDataStatus;
(function(ParallelDataStatus2) {
  ParallelDataStatus2["ACTIVE"] = "ACTIVE";
  ParallelDataStatus2["CREATING"] = "CREATING";
  ParallelDataStatus2["DELETING"] = "DELETING";
  ParallelDataStatus2["FAILED"] = "FAILED";
  ParallelDataStatus2["UPDATING"] = "UPDATING";
})(ParallelDataStatus || (ParallelDataStatus = {}));
var InternalServerException = function(_super) {
  __extends(InternalServerException2, _super);
  function InternalServerException2(opts) {
    var _this = _super.call(this, __assign({ name: "InternalServerException", $fault: "server" }, opts)) || this;
    _this.name = "InternalServerException";
    _this.$fault = "server";
    Object.setPrototypeOf(_this, InternalServerException2.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return InternalServerException2;
}(TranslateServiceException);
var InvalidParameterValueException = function(_super) {
  __extends(InvalidParameterValueException2, _super);
  function InvalidParameterValueException2(opts) {
    var _this = _super.call(this, __assign({ name: "InvalidParameterValueException", $fault: "client" }, opts)) || this;
    _this.name = "InvalidParameterValueException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, InvalidParameterValueException2.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return InvalidParameterValueException2;
}(TranslateServiceException);
var InvalidRequestException = function(_super) {
  __extends(InvalidRequestException3, _super);
  function InvalidRequestException3(opts) {
    var _this = _super.call(this, __assign({ name: "InvalidRequestException", $fault: "client" }, opts)) || this;
    _this.name = "InvalidRequestException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, InvalidRequestException3.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return InvalidRequestException3;
}(TranslateServiceException);
var LimitExceededException = function(_super) {
  __extends(LimitExceededException2, _super);
  function LimitExceededException2(opts) {
    var _this = _super.call(this, __assign({ name: "LimitExceededException", $fault: "client" }, opts)) || this;
    _this.name = "LimitExceededException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, LimitExceededException2.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return LimitExceededException2;
}(TranslateServiceException);
var TooManyRequestsException = function(_super) {
  __extends(TooManyRequestsException3, _super);
  function TooManyRequestsException3(opts) {
    var _this = _super.call(this, __assign({ name: "TooManyRequestsException", $fault: "client" }, opts)) || this;
    _this.name = "TooManyRequestsException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, TooManyRequestsException3.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return TooManyRequestsException3;
}(TranslateServiceException);
var TooManyTagsException = function(_super) {
  __extends(TooManyTagsException2, _super);
  function TooManyTagsException2(opts) {
    var _this = _super.call(this, __assign({ name: "TooManyTagsException", $fault: "client" }, opts)) || this;
    _this.name = "TooManyTagsException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, TooManyTagsException2.prototype);
    _this.ResourceArn = opts.ResourceArn;
    return _this;
  }
  return TooManyTagsException2;
}(TranslateServiceException);
var ResourceNotFoundException = function(_super) {
  __extends(ResourceNotFoundException3, _super);
  function ResourceNotFoundException3(opts) {
    var _this = _super.call(this, __assign({ name: "ResourceNotFoundException", $fault: "client" }, opts)) || this;
    _this.name = "ResourceNotFoundException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, ResourceNotFoundException3.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return ResourceNotFoundException3;
}(TranslateServiceException);
var JobStatus;
(function(JobStatus2) {
  JobStatus2["COMPLETED"] = "COMPLETED";
  JobStatus2["COMPLETED_WITH_ERROR"] = "COMPLETED_WITH_ERROR";
  JobStatus2["FAILED"] = "FAILED";
  JobStatus2["IN_PROGRESS"] = "IN_PROGRESS";
  JobStatus2["STOPPED"] = "STOPPED";
  JobStatus2["STOP_REQUESTED"] = "STOP_REQUESTED";
  JobStatus2["SUBMITTED"] = "SUBMITTED";
})(JobStatus || (JobStatus = {}));
var Formality;
(function(Formality2) {
  Formality2["FORMAL"] = "FORMAL";
  Formality2["INFORMAL"] = "INFORMAL";
})(Formality || (Formality = {}));
var Profanity;
(function(Profanity2) {
  Profanity2["MASK"] = "MASK";
})(Profanity || (Profanity = {}));
var TerminologyDataFormat;
(function(TerminologyDataFormat2) {
  TerminologyDataFormat2["CSV"] = "CSV";
  TerminologyDataFormat2["TMX"] = "TMX";
  TerminologyDataFormat2["TSV"] = "TSV";
})(TerminologyDataFormat || (TerminologyDataFormat = {}));
var Directionality;
(function(Directionality2) {
  Directionality2["MULTI"] = "MULTI";
  Directionality2["UNI"] = "UNI";
})(Directionality || (Directionality = {}));
var MergeStrategy;
(function(MergeStrategy2) {
  MergeStrategy2["OVERWRITE"] = "OVERWRITE";
})(MergeStrategy || (MergeStrategy = {}));
var DisplayLanguageCode;
(function(DisplayLanguageCode2) {
  DisplayLanguageCode2["DE"] = "de";
  DisplayLanguageCode2["EN"] = "en";
  DisplayLanguageCode2["ES"] = "es";
  DisplayLanguageCode2["FR"] = "fr";
  DisplayLanguageCode2["IT"] = "it";
  DisplayLanguageCode2["JA"] = "ja";
  DisplayLanguageCode2["KO"] = "ko";
  DisplayLanguageCode2["PT"] = "pt";
  DisplayLanguageCode2["ZH"] = "zh";
  DisplayLanguageCode2["ZH_TW"] = "zh-TW";
})(DisplayLanguageCode || (DisplayLanguageCode = {}));
var UnsupportedDisplayLanguageCodeException = function(_super) {
  __extends(UnsupportedDisplayLanguageCodeException2, _super);
  function UnsupportedDisplayLanguageCodeException2(opts) {
    var _this = _super.call(this, __assign({ name: "UnsupportedDisplayLanguageCodeException", $fault: "client" }, opts)) || this;
    _this.name = "UnsupportedDisplayLanguageCodeException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, UnsupportedDisplayLanguageCodeException2.prototype);
    _this.Message = opts.Message;
    _this.DisplayLanguageCode = opts.DisplayLanguageCode;
    return _this;
  }
  return UnsupportedDisplayLanguageCodeException2;
}(TranslateServiceException);
var InvalidFilterException = function(_super) {
  __extends(InvalidFilterException2, _super);
  function InvalidFilterException2(opts) {
    var _this = _super.call(this, __assign({ name: "InvalidFilterException", $fault: "client" }, opts)) || this;
    _this.name = "InvalidFilterException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, InvalidFilterException2.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return InvalidFilterException2;
}(TranslateServiceException);
var UnsupportedLanguagePairException = function(_super) {
  __extends(UnsupportedLanguagePairException2, _super);
  function UnsupportedLanguagePairException2(opts) {
    var _this = _super.call(this, __assign({ name: "UnsupportedLanguagePairException", $fault: "client" }, opts)) || this;
    _this.name = "UnsupportedLanguagePairException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, UnsupportedLanguagePairException2.prototype);
    _this.Message = opts.Message;
    _this.SourceLanguageCode = opts.SourceLanguageCode;
    _this.TargetLanguageCode = opts.TargetLanguageCode;
    return _this;
  }
  return UnsupportedLanguagePairException2;
}(TranslateServiceException);
var DetectedLanguageLowConfidenceException = function(_super) {
  __extends(DetectedLanguageLowConfidenceException2, _super);
  function DetectedLanguageLowConfidenceException2(opts) {
    var _this = _super.call(this, __assign({ name: "DetectedLanguageLowConfidenceException", $fault: "client" }, opts)) || this;
    _this.name = "DetectedLanguageLowConfidenceException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, DetectedLanguageLowConfidenceException2.prototype);
    _this.Message = opts.Message;
    _this.DetectedLanguageCode = opts.DetectedLanguageCode;
    return _this;
  }
  return DetectedLanguageLowConfidenceException2;
}(TranslateServiceException);
var ServiceUnavailableException = function(_super) {
  __extends(ServiceUnavailableException2, _super);
  function ServiceUnavailableException2(opts) {
    var _this = _super.call(this, __assign({ name: "ServiceUnavailableException", $fault: "server" }, opts)) || this;
    _this.name = "ServiceUnavailableException";
    _this.$fault = "server";
    Object.setPrototypeOf(_this, ServiceUnavailableException2.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return ServiceUnavailableException2;
}(TranslateServiceException);
var TextSizeLimitExceededException = function(_super) {
  __extends(TextSizeLimitExceededException2, _super);
  function TextSizeLimitExceededException2(opts) {
    var _this = _super.call(this, __assign({ name: "TextSizeLimitExceededException", $fault: "client" }, opts)) || this;
    _this.name = "TextSizeLimitExceededException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, TextSizeLimitExceededException2.prototype);
    _this.Message = opts.Message;
    return _this;
  }
  return TextSizeLimitExceededException2;
}(TranslateServiceException);
var ListLanguagesRequestFilterSensitiveLog = function(obj) {
  return __assign({}, obj);
};
var ListLanguagesResponseFilterSensitiveLog = function(obj) {
  return __assign({}, obj);
};
var TranslateTextRequestFilterSensitiveLog = function(obj) {
  return __assign({}, obj);
};
var TranslateTextResponseFilterSensitiveLog = function(obj) {
  return __assign({}, obj);
};

// node_modules/@aws-sdk/protocol-http/dist-es/httpRequest.js
var HttpRequest = function() {
  function HttpRequest2(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? "".concat(options.protocol, ":") : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? "/".concat(options.path) : options.path : "/";
  }
  HttpRequest2.isInstance = function(request2) {
    if (!request2)
      return false;
    var req = request2;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  };
  HttpRequest2.prototype.clone = function() {
    var cloned = new HttpRequest2(__assign(__assign({}, this), { headers: __assign({}, this.headers) }));
    if (cloned.query)
      cloned.query = cloneQuery(cloned.query);
    return cloned;
  };
  return HttpRequest2;
}();
function cloneQuery(query) {
  return Object.keys(query).reduce(function(carry, paramName) {
    var _a;
    var param = query[paramName];
    return __assign(__assign({}, carry), (_a = {}, _a[paramName] = Array.isArray(param) ? __spreadArray([], __read(param), false) : param, _a));
  }, {});
}

// node_modules/@aws-sdk/protocol-http/dist-es/httpResponse.js
var HttpResponse = function() {
  function HttpResponse2(options) {
    this.statusCode = options.statusCode;
    this.headers = options.headers || {};
    this.body = options.body;
  }
  HttpResponse2.isInstance = function(response) {
    if (!response)
      return false;
    var resp = response;
    return typeof resp.statusCode === "number" && typeof resp.headers === "object";
  };
  return HttpResponse2;
}();

// node_modules/uuid/wrapper.mjs
var import_dist = __toESM(require_dist5(), 1);
var v1 = import_dist.default.v1;
var v3 = import_dist.default.v3;
var v4 = import_dist.default.v4;
var v5 = import_dist.default.v5;
var NIL = import_dist.default.NIL;
var version2 = import_dist.default.version;
var validate = import_dist.default.validate;
var stringify = import_dist.default.stringify;
var parse = import_dist.default.parse;

// node_modules/@aws-sdk/client-translate/dist-es/protocols/Aws_json1_1.js
var serializeAws_json1_1ListLanguagesCommand = function(input, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var headers, body;
    return __generator(this, function(_a) {
      headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AWSShineFrontendService_20170701.ListLanguages"
      };
      body = JSON.stringify(serializeAws_json1_1ListLanguagesRequest(input, context));
      return [2, buildHttpRpcRequest(context, headers, "/", void 0, body)];
    });
  });
};
var serializeAws_json1_1TranslateTextCommand = function(input, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var headers, body;
    return __generator(this, function(_a) {
      headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AWSShineFrontendService_20170701.TranslateText"
      };
      body = JSON.stringify(serializeAws_json1_1TranslateTextRequest(input, context));
      return [2, buildHttpRpcRequest(context, headers, "/", void 0, body)];
    });
  });
};
var deserializeAws_json1_1ListLanguagesCommand = function(output, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var data, contents, response;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (output.statusCode >= 300) {
            return [2, deserializeAws_json1_1ListLanguagesCommandError(output, context)];
          }
          return [4, parseBody2(output.body, context)];
        case 1:
          data = _a.sent();
          contents = {};
          contents = deserializeAws_json1_1ListLanguagesResponse(data, context);
          response = __assign({ $metadata: deserializeMetadata2(output) }, contents);
          return [2, Promise.resolve(response)];
      }
    });
  });
};
var deserializeAws_json1_1ListLanguagesCommandError = function(output, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var parsedOutput, _a, errorCode, _b, parsedBody;
    var _c;
    return __generator(this, function(_d) {
      switch (_d.label) {
        case 0:
          _a = [__assign({}, output)];
          _c = {};
          return [4, parseErrorBody(output.body, context)];
        case 1:
          parsedOutput = __assign.apply(void 0, _a.concat([(_c.body = _d.sent(), _c)]));
          errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
          _b = errorCode;
          switch (_b) {
            case "InternalServerException":
              return [3, 2];
            case "com.amazonaws.translate#InternalServerException":
              return [3, 2];
            case "InvalidParameterValueException":
              return [3, 4];
            case "com.amazonaws.translate#InvalidParameterValueException":
              return [3, 4];
            case "TooManyRequestsException":
              return [3, 6];
            case "com.amazonaws.translate#TooManyRequestsException":
              return [3, 6];
            case "UnsupportedDisplayLanguageCodeException":
              return [3, 8];
            case "com.amazonaws.translate#UnsupportedDisplayLanguageCodeException":
              return [3, 8];
          }
          return [3, 10];
        case 2:
          return [4, deserializeAws_json1_1InternalServerExceptionResponse(parsedOutput, context)];
        case 3:
          throw _d.sent();
        case 4:
          return [4, deserializeAws_json1_1InvalidParameterValueExceptionResponse(parsedOutput, context)];
        case 5:
          throw _d.sent();
        case 6:
          return [4, deserializeAws_json1_1TooManyRequestsExceptionResponse(parsedOutput, context)];
        case 7:
          throw _d.sent();
        case 8:
          return [4, deserializeAws_json1_1UnsupportedDisplayLanguageCodeExceptionResponse(parsedOutput, context)];
        case 9:
          throw _d.sent();
        case 10:
          parsedBody = parsedOutput.body;
          throwDefaultError({
            output,
            parsedBody,
            exceptionCtor: TranslateServiceException,
            errorCode
          });
          _d.label = 11;
        case 11:
          return [2];
      }
    });
  });
};
var deserializeAws_json1_1TranslateTextCommand = function(output, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var data, contents, response;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (output.statusCode >= 300) {
            return [2, deserializeAws_json1_1TranslateTextCommandError(output, context)];
          }
          return [4, parseBody2(output.body, context)];
        case 1:
          data = _a.sent();
          contents = {};
          contents = deserializeAws_json1_1TranslateTextResponse(data, context);
          response = __assign({ $metadata: deserializeMetadata2(output) }, contents);
          return [2, Promise.resolve(response)];
      }
    });
  });
};
var deserializeAws_json1_1TranslateTextCommandError = function(output, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var parsedOutput, _a, errorCode, _b, parsedBody;
    var _c;
    return __generator(this, function(_d) {
      switch (_d.label) {
        case 0:
          _a = [__assign({}, output)];
          _c = {};
          return [4, parseErrorBody(output.body, context)];
        case 1:
          parsedOutput = __assign.apply(void 0, _a.concat([(_c.body = _d.sent(), _c)]));
          errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
          _b = errorCode;
          switch (_b) {
            case "DetectedLanguageLowConfidenceException":
              return [3, 2];
            case "com.amazonaws.translate#DetectedLanguageLowConfidenceException":
              return [3, 2];
            case "InternalServerException":
              return [3, 4];
            case "com.amazonaws.translate#InternalServerException":
              return [3, 4];
            case "InvalidRequestException":
              return [3, 6];
            case "com.amazonaws.translate#InvalidRequestException":
              return [3, 6];
            case "ResourceNotFoundException":
              return [3, 8];
            case "com.amazonaws.translate#ResourceNotFoundException":
              return [3, 8];
            case "ServiceUnavailableException":
              return [3, 10];
            case "com.amazonaws.translate#ServiceUnavailableException":
              return [3, 10];
            case "TextSizeLimitExceededException":
              return [3, 12];
            case "com.amazonaws.translate#TextSizeLimitExceededException":
              return [3, 12];
            case "TooManyRequestsException":
              return [3, 14];
            case "com.amazonaws.translate#TooManyRequestsException":
              return [3, 14];
            case "UnsupportedLanguagePairException":
              return [3, 16];
            case "com.amazonaws.translate#UnsupportedLanguagePairException":
              return [3, 16];
          }
          return [3, 18];
        case 2:
          return [4, deserializeAws_json1_1DetectedLanguageLowConfidenceExceptionResponse(parsedOutput, context)];
        case 3:
          throw _d.sent();
        case 4:
          return [4, deserializeAws_json1_1InternalServerExceptionResponse(parsedOutput, context)];
        case 5:
          throw _d.sent();
        case 6:
          return [4, deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context)];
        case 7:
          throw _d.sent();
        case 8:
          return [4, deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context)];
        case 9:
          throw _d.sent();
        case 10:
          return [4, deserializeAws_json1_1ServiceUnavailableExceptionResponse(parsedOutput, context)];
        case 11:
          throw _d.sent();
        case 12:
          return [4, deserializeAws_json1_1TextSizeLimitExceededExceptionResponse(parsedOutput, context)];
        case 13:
          throw _d.sent();
        case 14:
          return [4, deserializeAws_json1_1TooManyRequestsExceptionResponse(parsedOutput, context)];
        case 15:
          throw _d.sent();
        case 16:
          return [4, deserializeAws_json1_1UnsupportedLanguagePairExceptionResponse(parsedOutput, context)];
        case 17:
          throw _d.sent();
        case 18:
          parsedBody = parsedOutput.body;
          throwDefaultError({
            output,
            parsedBody,
            exceptionCtor: TranslateServiceException,
            errorCode
          });
          _d.label = 19;
        case 19:
          return [2];
      }
    });
  });
};
var deserializeAws_json1_1DetectedLanguageLowConfidenceExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_json1_1DetectedLanguageLowConfidenceException(body, context);
      exception = new DetectedLanguageLowConfidenceException(__assign({ $metadata: deserializeMetadata2(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_json1_1InternalServerExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_json1_1InternalServerException(body, context);
      exception = new InternalServerException(__assign({ $metadata: deserializeMetadata2(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_json1_1InvalidParameterValueExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_json1_1InvalidParameterValueException(body, context);
      exception = new InvalidParameterValueException(__assign({ $metadata: deserializeMetadata2(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_json1_1InvalidRequestExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_json1_1InvalidRequestException(body, context);
      exception = new InvalidRequestException(__assign({ $metadata: deserializeMetadata2(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_json1_1ResourceNotFoundExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_json1_1ResourceNotFoundException(body, context);
      exception = new ResourceNotFoundException(__assign({ $metadata: deserializeMetadata2(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_json1_1ServiceUnavailableExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_json1_1ServiceUnavailableException(body, context);
      exception = new ServiceUnavailableException(__assign({ $metadata: deserializeMetadata2(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_json1_1TextSizeLimitExceededExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_json1_1TextSizeLimitExceededException(body, context);
      exception = new TextSizeLimitExceededException(__assign({ $metadata: deserializeMetadata2(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_json1_1TooManyRequestsExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_json1_1TooManyRequestsException(body, context);
      exception = new TooManyRequestsException(__assign({ $metadata: deserializeMetadata2(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_json1_1UnsupportedDisplayLanguageCodeExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_json1_1UnsupportedDisplayLanguageCodeException(body, context);
      exception = new UnsupportedDisplayLanguageCodeException(__assign({ $metadata: deserializeMetadata2(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_json1_1UnsupportedLanguagePairExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_json1_1UnsupportedLanguagePairException(body, context);
      exception = new UnsupportedLanguagePairException(__assign({ $metadata: deserializeMetadata2(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var serializeAws_json1_1ListLanguagesRequest = function(input, context) {
  return __assign(__assign(__assign({}, input.DisplayLanguageCode != null && { DisplayLanguageCode: input.DisplayLanguageCode }), input.MaxResults != null && { MaxResults: input.MaxResults }), input.NextToken != null && { NextToken: input.NextToken });
};
var serializeAws_json1_1ResourceNameList = function(input, context) {
  return input.filter(function(e) {
    return e != null;
  }).map(function(entry) {
    return entry;
  });
};
var serializeAws_json1_1TranslateTextRequest = function(input, context) {
  return __assign(__assign(__assign(__assign(__assign({}, input.Settings != null && { Settings: serializeAws_json1_1TranslationSettings(input.Settings, context) }), input.SourceLanguageCode != null && { SourceLanguageCode: input.SourceLanguageCode }), input.TargetLanguageCode != null && { TargetLanguageCode: input.TargetLanguageCode }), input.TerminologyNames != null && {
    TerminologyNames: serializeAws_json1_1ResourceNameList(input.TerminologyNames, context)
  }), input.Text != null && { Text: input.Text });
};
var serializeAws_json1_1TranslationSettings = function(input, context) {
  return __assign(__assign({}, input.Formality != null && { Formality: input.Formality }), input.Profanity != null && { Profanity: input.Profanity });
};
var deserializeAws_json1_1AppliedTerminology = function(output, context) {
  return {
    Name: expectString(output.Name),
    Terms: output.Terms != null ? deserializeAws_json1_1TermList(output.Terms, context) : void 0
  };
};
var deserializeAws_json1_1AppliedTerminologyList = function(output, context) {
  var retVal = (output || []).filter(function(e) {
    return e != null;
  }).map(function(entry) {
    if (entry === null) {
      return null;
    }
    return deserializeAws_json1_1AppliedTerminology(entry, context);
  });
  return retVal;
};
var deserializeAws_json1_1DetectedLanguageLowConfidenceException = function(output, context) {
  return {
    DetectedLanguageCode: expectString(output.DetectedLanguageCode),
    Message: expectString(output.Message)
  };
};
var deserializeAws_json1_1InternalServerException = function(output, context) {
  return {
    Message: expectString(output.Message)
  };
};
var deserializeAws_json1_1InvalidParameterValueException = function(output, context) {
  return {
    Message: expectString(output.Message)
  };
};
var deserializeAws_json1_1InvalidRequestException = function(output, context) {
  return {
    Message: expectString(output.Message)
  };
};
var deserializeAws_json1_1Language = function(output, context) {
  return {
    LanguageCode: expectString(output.LanguageCode),
    LanguageName: expectString(output.LanguageName)
  };
};
var deserializeAws_json1_1LanguagesList = function(output, context) {
  var retVal = (output || []).filter(function(e) {
    return e != null;
  }).map(function(entry) {
    if (entry === null) {
      return null;
    }
    return deserializeAws_json1_1Language(entry, context);
  });
  return retVal;
};
var deserializeAws_json1_1ListLanguagesResponse = function(output, context) {
  return {
    DisplayLanguageCode: expectString(output.DisplayLanguageCode),
    Languages: output.Languages != null ? deserializeAws_json1_1LanguagesList(output.Languages, context) : void 0,
    NextToken: expectString(output.NextToken)
  };
};
var deserializeAws_json1_1ResourceNotFoundException = function(output, context) {
  return {
    Message: expectString(output.Message)
  };
};
var deserializeAws_json1_1ServiceUnavailableException = function(output, context) {
  return {
    Message: expectString(output.Message)
  };
};
var deserializeAws_json1_1Term = function(output, context) {
  return {
    SourceText: expectString(output.SourceText),
    TargetText: expectString(output.TargetText)
  };
};
var deserializeAws_json1_1TermList = function(output, context) {
  var retVal = (output || []).filter(function(e) {
    return e != null;
  }).map(function(entry) {
    if (entry === null) {
      return null;
    }
    return deserializeAws_json1_1Term(entry, context);
  });
  return retVal;
};
var deserializeAws_json1_1TextSizeLimitExceededException = function(output, context) {
  return {
    Message: expectString(output.Message)
  };
};
var deserializeAws_json1_1TooManyRequestsException = function(output, context) {
  return {
    Message: expectString(output.Message)
  };
};
var deserializeAws_json1_1TranslateTextResponse = function(output, context) {
  return {
    AppliedSettings: output.AppliedSettings != null ? deserializeAws_json1_1TranslationSettings(output.AppliedSettings, context) : void 0,
    AppliedTerminologies: output.AppliedTerminologies != null ? deserializeAws_json1_1AppliedTerminologyList(output.AppliedTerminologies, context) : void 0,
    SourceLanguageCode: expectString(output.SourceLanguageCode),
    TargetLanguageCode: expectString(output.TargetLanguageCode),
    TranslatedText: expectString(output.TranslatedText)
  };
};
var deserializeAws_json1_1TranslationSettings = function(output, context) {
  return {
    Formality: expectString(output.Formality),
    Profanity: expectString(output.Profanity)
  };
};
var deserializeAws_json1_1UnsupportedDisplayLanguageCodeException = function(output, context) {
  return {
    DisplayLanguageCode: expectString(output.DisplayLanguageCode),
    Message: expectString(output.Message)
  };
};
var deserializeAws_json1_1UnsupportedLanguagePairException = function(output, context) {
  return {
    Message: expectString(output.Message),
    SourceLanguageCode: expectString(output.SourceLanguageCode),
    TargetLanguageCode: expectString(output.TargetLanguageCode)
  };
};
var deserializeMetadata2 = function(output) {
  var _a, _b;
  return {
    httpStatusCode: output.statusCode,
    requestId: (_b = (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"]) !== null && _b !== void 0 ? _b : output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"]
  };
};
var collectBody = function(streamBody, context) {
  if (streamBody === void 0) {
    streamBody = new Uint8Array();
  }
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
var collectBodyString = function(streamBody, context) {
  return collectBody(streamBody, context).then(function(body) {
    return context.utf8Encoder(body);
  });
};
var buildHttpRpcRequest = function(context, headers, path, resolvedHostname, body) {
  return __awaiter(void 0, void 0, void 0, function() {
    var _a, hostname, _b, protocol, port, basePath, contents;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          return [4, context.endpoint()];
        case 1:
          _a = _c.sent(), hostname = _a.hostname, _b = _a.protocol, protocol = _b === void 0 ? "https" : _b, port = _a.port, basePath = _a.path;
          contents = {
            protocol,
            hostname,
            port,
            method: "POST",
            path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
            headers
          };
          if (resolvedHostname !== void 0) {
            contents.hostname = resolvedHostname;
          }
          if (body !== void 0) {
            contents.body = body;
          }
          return [2, new HttpRequest(contents)];
      }
    });
  });
};
var parseBody2 = function(streamBody, context) {
  return collectBodyString(streamBody, context).then(function(encoded) {
    if (encoded.length) {
      return JSON.parse(encoded);
    }
    return {};
  });
};
var parseErrorBody = function(errorBody, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var value;
    var _a;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          return [4, parseBody2(errorBody, context)];
        case 1:
          value = _b.sent();
          value.message = (_a = value.message) !== null && _a !== void 0 ? _a : value.Message;
          return [2, value];
      }
    });
  });
};
var loadRestJsonErrorCode = function(output, data) {
  var findKey = function(object, key) {
    return Object.keys(object).find(function(k) {
      return k.toLowerCase() === key.toLowerCase();
    });
  };
  var sanitizeErrorCode = function(rawValue) {
    var cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  };
  var headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
};

// node_modules/@aws-sdk/client-translate/dist-es/commands/ListLanguagesCommand.js
var ListLanguagesCommand = function(_super) {
  __extends(ListLanguagesCommand2, _super);
  function ListLanguagesCommand2(input) {
    var _this = _super.call(this) || this;
    _this.input = input;
    return _this;
  }
  ListLanguagesCommand2.prototype.resolveMiddleware = function(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    var stack = clientStack.concat(this.middlewareStack);
    var logger3 = configuration.logger;
    var clientName = "TranslateClient";
    var commandName = "ListLanguagesCommand";
    var handlerExecutionContext = {
      logger: logger3,
      clientName,
      commandName,
      inputFilterSensitiveLog: ListLanguagesRequestFilterSensitiveLog,
      outputFilterSensitiveLog: ListLanguagesResponseFilterSensitiveLog
    };
    var requestHandler = configuration.requestHandler;
    return stack.resolve(function(request2) {
      return requestHandler.handle(request2.request, options || {});
    }, handlerExecutionContext);
  };
  ListLanguagesCommand2.prototype.serialize = function(input, context) {
    return serializeAws_json1_1ListLanguagesCommand(input, context);
  };
  ListLanguagesCommand2.prototype.deserialize = function(output, context) {
    return deserializeAws_json1_1ListLanguagesCommand(output, context);
  };
  return ListLanguagesCommand2;
}(Command);

// node_modules/@aws-sdk/client-translate/dist-es/commands/TranslateTextCommand.js
var TranslateTextCommand = function(_super) {
  __extends(TranslateTextCommand2, _super);
  function TranslateTextCommand2(input) {
    var _this = _super.call(this) || this;
    _this.input = input;
    return _this;
  }
  TranslateTextCommand2.prototype.resolveMiddleware = function(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    var stack = clientStack.concat(this.middlewareStack);
    var logger3 = configuration.logger;
    var clientName = "TranslateClient";
    var commandName = "TranslateTextCommand";
    var handlerExecutionContext = {
      logger: logger3,
      clientName,
      commandName,
      inputFilterSensitiveLog: TranslateTextRequestFilterSensitiveLog,
      outputFilterSensitiveLog: TranslateTextResponseFilterSensitiveLog
    };
    var requestHandler = configuration.requestHandler;
    return stack.resolve(function(request2) {
      return requestHandler.handle(request2.request, options || {});
    }, handlerExecutionContext);
  };
  TranslateTextCommand2.prototype.serialize = function(input, context) {
    return serializeAws_json1_1TranslateTextCommand(input, context);
  };
  TranslateTextCommand2.prototype.deserialize = function(output, context) {
    return deserializeAws_json1_1TranslateTextCommand(output, context);
  };
  return TranslateTextCommand2;
}(Command);

// node_modules/@aws-sdk/util-config-provider/dist-es/booleanSelector.js
var SelectorType;
(function(SelectorType2) {
  SelectorType2["ENV"] = "env";
  SelectorType2["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));
var booleanSelector = function(obj, key, type) {
  if (!(key in obj))
    return void 0;
  if (obj[key] === "true")
    return true;
  if (obj[key] === "false")
    return false;
  throw new Error("Cannot load ".concat(type, ' "').concat(key, '". Expected "true" or "false", got ').concat(obj[key], "."));
};

// node_modules/@aws-sdk/config-resolver/dist-es/endpointsConfig/NodeUseDualstackEndpointConfigOptions.js
var ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
var CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
var NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env2) {
    return booleanSelector(env2, ENV_USE_DUALSTACK_ENDPOINT, SelectorType.ENV);
  },
  configFileSelector: function(profile) {
    return booleanSelector(profile, CONFIG_USE_DUALSTACK_ENDPOINT, SelectorType.CONFIG);
  },
  default: false
};

// node_modules/@aws-sdk/config-resolver/dist-es/endpointsConfig/NodeUseFipsEndpointConfigOptions.js
var ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
var CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
var NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env2) {
    return booleanSelector(env2, ENV_USE_FIPS_ENDPOINT, SelectorType.ENV);
  },
  configFileSelector: function(profile) {
    return booleanSelector(profile, CONFIG_USE_FIPS_ENDPOINT, SelectorType.CONFIG);
  },
  default: false
};

// node_modules/@aws-sdk/util-middleware/dist-es/normalizeProvider.js
var normalizeProvider = function(input) {
  if (typeof input === "function")
    return input;
  var promisified = Promise.resolve(input);
  return function() {
    return promisified;
  };
};

// node_modules/@aws-sdk/config-resolver/dist-es/endpointsConfig/utils/getEndpointFromRegion.js
var getEndpointFromRegion = function(input) {
  return __awaiter(void 0, void 0, void 0, function() {
    var _a, tls, region, dnsHostRegex, useDualstackEndpoint, useFipsEndpoint, hostname;
    var _b;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          _a = input.tls, tls = _a === void 0 ? true : _a;
          return [4, input.region()];
        case 1:
          region = _c.sent();
          dnsHostRegex = new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/);
          if (!dnsHostRegex.test(region)) {
            throw new Error("Invalid region in client config");
          }
          return [4, input.useDualstackEndpoint()];
        case 2:
          useDualstackEndpoint = _c.sent();
          return [4, input.useFipsEndpoint()];
        case 3:
          useFipsEndpoint = _c.sent();
          return [4, input.regionInfoProvider(region, { useDualstackEndpoint, useFipsEndpoint })];
        case 4:
          hostname = ((_b = _c.sent()) !== null && _b !== void 0 ? _b : {}).hostname;
          if (!hostname) {
            throw new Error("Cannot resolve hostname from client config");
          }
          return [2, input.urlParser("".concat(tls ? "https:" : "http:", "//").concat(hostname))];
      }
    });
  });
};

// node_modules/@aws-sdk/config-resolver/dist-es/endpointsConfig/resolveEndpointsConfig.js
var resolveEndpointsConfig = function(input) {
  var _a;
  var useDualstackEndpoint = normalizeProvider(input.useDualstackEndpoint);
  var endpoint = input.endpoint, useFipsEndpoint = input.useFipsEndpoint, urlParser = input.urlParser;
  return __assign(__assign({}, input), { tls: (_a = input.tls) !== null && _a !== void 0 ? _a : true, endpoint: endpoint ? normalizeProvider(typeof endpoint === "string" ? urlParser(endpoint) : endpoint) : function() {
    return getEndpointFromRegion(__assign(__assign({}, input), { useDualstackEndpoint, useFipsEndpoint }));
  }, isCustomEndpoint: !!endpoint, useDualstackEndpoint });
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionConfig/config.js
var REGION_ENV_NAME = "AWS_REGION";
var REGION_INI_NAME = "region";
var NODE_REGION_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env2) {
    return env2[REGION_ENV_NAME];
  },
  configFileSelector: function(profile) {
    return profile[REGION_INI_NAME];
  },
  default: function() {
    throw new Error("Region is missing");
  }
};
var NODE_REGION_CONFIG_FILE_OPTIONS = {
  preferredFile: "credentials"
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionConfig/isFipsRegion.js
var isFipsRegion = function(region) {
  return typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionConfig/getRealRegion.js
var getRealRegion = function(region) {
  return isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region;
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionConfig/resolveRegionConfig.js
var resolveRegionConfig = function(input) {
  var region = input.region, useFipsEndpoint = input.useFipsEndpoint;
  if (!region) {
    throw new Error("Region is missing");
  }
  return __assign(__assign({}, input), { region: function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var providedRegion;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (typeof region === "string") {
              return [2, getRealRegion(region)];
            }
            return [4, region()];
          case 1:
            providedRegion = _a.sent();
            return [2, getRealRegion(providedRegion)];
        }
      });
    });
  }, useFipsEndpoint: function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var providedRegion, _a;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            if (!(typeof region === "string"))
              return [3, 1];
            _a = region;
            return [3, 3];
          case 1:
            return [4, region()];
          case 2:
            _a = _b.sent();
            _b.label = 3;
          case 3:
            providedRegion = _a;
            if (isFipsRegion(providedRegion)) {
              return [2, true];
            }
            return [2, typeof useFipsEndpoint === "boolean" ? Promise.resolve(useFipsEndpoint) : useFipsEndpoint()];
        }
      });
    });
  } });
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionInfo/getHostnameFromVariants.js
var getHostnameFromVariants = function(variants, _a) {
  var _b;
  if (variants === void 0) {
    variants = [];
  }
  var useFipsEndpoint = _a.useFipsEndpoint, useDualstackEndpoint = _a.useDualstackEndpoint;
  return (_b = variants.find(function(_a2) {
    var tags = _a2.tags;
    return useFipsEndpoint === tags.includes("fips") && useDualstackEndpoint === tags.includes("dualstack");
  })) === null || _b === void 0 ? void 0 : _b.hostname;
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionInfo/getResolvedHostname.js
var getResolvedHostname = function(resolvedRegion, _a) {
  var regionHostname = _a.regionHostname, partitionHostname = _a.partitionHostname;
  return regionHostname ? regionHostname : partitionHostname ? partitionHostname.replace("{region}", resolvedRegion) : void 0;
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionInfo/getResolvedPartition.js
var getResolvedPartition = function(region, _a) {
  var _b;
  var partitionHash4 = _a.partitionHash;
  return (_b = Object.keys(partitionHash4 || {}).find(function(key) {
    return partitionHash4[key].regions.includes(region);
  })) !== null && _b !== void 0 ? _b : "aws";
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionInfo/getResolvedSigningRegion.js
var getResolvedSigningRegion = function(hostname, _a) {
  var signingRegion = _a.signingRegion, regionRegex = _a.regionRegex, useFipsEndpoint = _a.useFipsEndpoint;
  if (signingRegion) {
    return signingRegion;
  } else if (useFipsEndpoint) {
    var regionRegexJs = regionRegex.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\.");
    var regionRegexmatchArray = hostname.match(regionRegexJs);
    if (regionRegexmatchArray) {
      return regionRegexmatchArray[0].slice(1, -1);
    }
  }
};

// node_modules/@aws-sdk/config-resolver/dist-es/regionInfo/getRegionInfo.js
var getRegionInfo = function(region, _a) {
  var _b, _c, _d, _e, _f, _g;
  var _h = _a.useFipsEndpoint, useFipsEndpoint = _h === void 0 ? false : _h, _j = _a.useDualstackEndpoint, useDualstackEndpoint = _j === void 0 ? false : _j, signingService = _a.signingService, regionHash4 = _a.regionHash, partitionHash4 = _a.partitionHash;
  var partition = getResolvedPartition(region, { partitionHash: partitionHash4 });
  var resolvedRegion = region in regionHash4 ? region : (_c = (_b = partitionHash4[partition]) === null || _b === void 0 ? void 0 : _b.endpoint) !== null && _c !== void 0 ? _c : region;
  var hostnameOptions = { useFipsEndpoint, useDualstackEndpoint };
  var regionHostname = getHostnameFromVariants((_d = regionHash4[resolvedRegion]) === null || _d === void 0 ? void 0 : _d.variants, hostnameOptions);
  var partitionHostname = getHostnameFromVariants((_e = partitionHash4[partition]) === null || _e === void 0 ? void 0 : _e.variants, hostnameOptions);
  var hostname = getResolvedHostname(resolvedRegion, { regionHostname, partitionHostname });
  if (hostname === void 0) {
    throw new Error("Endpoint resolution failed for: ".concat({ resolvedRegion, useFipsEndpoint, useDualstackEndpoint }));
  }
  var signingRegion = getResolvedSigningRegion(hostname, {
    signingRegion: (_f = regionHash4[resolvedRegion]) === null || _f === void 0 ? void 0 : _f.signingRegion,
    regionRegex: partitionHash4[partition].regionRegex,
    useFipsEndpoint
  });
  return __assign(__assign({ partition, signingService, hostname }, signingRegion && { signingRegion }), ((_g = regionHash4[resolvedRegion]) === null || _g === void 0 ? void 0 : _g.signingService) && {
    signingService: regionHash4[resolvedRegion].signingService
  });
};

// node_modules/@aws-sdk/middleware-content-length/dist-es/index.js
var CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
  var _this = this;
  return function(next) {
    return function(args) {
      return __awaiter(_this, void 0, void 0, function() {
        var request2, body, headers, length_1;
        var _a;
        return __generator(this, function(_b) {
          request2 = args.request;
          if (HttpRequest.isInstance(request2)) {
            body = request2.body, headers = request2.headers;
            if (body && Object.keys(headers).map(function(str) {
              return str.toLowerCase();
            }).indexOf(CONTENT_LENGTH_HEADER) === -1) {
              try {
                length_1 = bodyLengthChecker(body);
                request2.headers = __assign(__assign({}, request2.headers), (_a = {}, _a[CONTENT_LENGTH_HEADER] = String(length_1), _a));
              } catch (error) {
              }
            }
          }
          return [2, next(__assign(__assign({}, args), { request: request2 }))];
        });
      });
    };
  };
}
var contentLengthMiddlewareOptions = {
  step: "build",
  tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
  name: "contentLengthMiddleware",
  override: true
};
var getContentLengthPlugin = function(options) {
  return {
    applyToStack: function(clientStack) {
      clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
    }
  };
};

// node_modules/@aws-sdk/middleware-host-header/dist-es/index.js
function resolveHostHeaderConfig(input) {
  return input;
}
var hostHeaderMiddleware = function(options) {
  return function(next) {
    return function(args) {
      return __awaiter(void 0, void 0, void 0, function() {
        var request2, _a, handlerProtocol;
        return __generator(this, function(_b) {
          if (!HttpRequest.isInstance(args.request))
            return [2, next(args)];
          request2 = args.request;
          _a = (options.requestHandler.metadata || {}).handlerProtocol, handlerProtocol = _a === void 0 ? "" : _a;
          if (handlerProtocol.indexOf("h2") >= 0 && !request2.headers[":authority"]) {
            delete request2.headers["host"];
            request2.headers[":authority"] = "";
          } else if (!request2.headers["host"]) {
            request2.headers["host"] = request2.hostname;
          }
          return [2, next(args)];
        });
      });
    };
  };
};
var hostHeaderMiddlewareOptions = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: true
};
var getHostHeaderPlugin = function(options) {
  return {
    applyToStack: function(clientStack) {
      clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
    }
  };
};

// node_modules/@aws-sdk/middleware-logger/dist-es/loggerMiddleware.js
var loggerMiddleware = function() {
  return function(next, context) {
    return function(args) {
      return __awaiter(void 0, void 0, void 0, function() {
        var clientName, commandName, inputFilterSensitiveLog, logger3, outputFilterSensitiveLog, response, _a, $metadata, outputWithoutMetadata;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              clientName = context.clientName, commandName = context.commandName, inputFilterSensitiveLog = context.inputFilterSensitiveLog, logger3 = context.logger, outputFilterSensitiveLog = context.outputFilterSensitiveLog;
              return [4, next(args)];
            case 1:
              response = _b.sent();
              if (!logger3) {
                return [2, response];
              }
              if (typeof logger3.info === "function") {
                _a = response.output, $metadata = _a.$metadata, outputWithoutMetadata = __rest(_a, ["$metadata"]);
                logger3.info({
                  clientName,
                  commandName,
                  input: inputFilterSensitiveLog(args.input),
                  output: outputFilterSensitiveLog(outputWithoutMetadata),
                  metadata: $metadata
                });
              }
              return [2, response];
          }
        });
      });
    };
  };
};
var loggerMiddlewareOptions = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: true
};
var getLoggerPlugin = function(options) {
  return {
    applyToStack: function(clientStack) {
      clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
    }
  };
};

// node_modules/@aws-sdk/middleware-recursion-detection/dist-es/index.js
var TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
var ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
var ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
var recursionDetectionMiddleware = function(options) {
  return function(next) {
    return function(args) {
      return __awaiter(void 0, void 0, void 0, function() {
        var request2, functionName, traceId, nonEmptyString;
        return __generator(this, function(_a) {
          request2 = args.request;
          if (!HttpRequest.isInstance(request2) || options.runtime !== "node" || request2.headers.hasOwnProperty(TRACE_ID_HEADER_NAME)) {
            return [2, next(args)];
          }
          functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
          traceId = process.env[ENV_TRACE_ID];
          nonEmptyString = function(str) {
            return typeof str === "string" && str.length > 0;
          };
          if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
            request2.headers[TRACE_ID_HEADER_NAME] = traceId;
          }
          return [2, next(__assign(__assign({}, args), { request: request2 }))];
        });
      });
    };
  };
};
var addRecursionDetectionMiddlewareOptions = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: true,
  priority: "low"
};
var getRecursionDetectionPlugin = function(options) {
  return {
    applyToStack: function(clientStack) {
      clientStack.add(recursionDetectionMiddleware(options), addRecursionDetectionMiddlewareOptions);
    }
  };
};

// node_modules/@aws-sdk/middleware-retry/dist-es/config.js
var RETRY_MODES;
(function(RETRY_MODES2) {
  RETRY_MODES2["STANDARD"] = "standard";
  RETRY_MODES2["ADAPTIVE"] = "adaptive";
})(RETRY_MODES || (RETRY_MODES = {}));
var DEFAULT_MAX_ATTEMPTS = 3;
var DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;

// node_modules/@aws-sdk/service-error-classification/dist-es/constants.js
var CLOCK_SKEW_ERROR_CODES = [
  "AuthFailure",
  "InvalidSignatureException",
  "RequestExpired",
  "RequestInTheFuture",
  "RequestTimeTooSkewed",
  "SignatureDoesNotMatch"
];
var THROTTLING_ERROR_CODES = [
  "BandwidthLimitExceeded",
  "EC2ThrottledException",
  "LimitExceededException",
  "PriorRequestNotComplete",
  "ProvisionedThroughputExceededException",
  "RequestLimitExceeded",
  "RequestThrottled",
  "RequestThrottledException",
  "SlowDown",
  "ThrottledException",
  "Throttling",
  "ThrottlingException",
  "TooManyRequestsException",
  "TransactionInProgressException"
];
var TRANSIENT_ERROR_CODES = ["AbortError", "TimeoutError", "RequestTimeout", "RequestTimeoutException"];
var TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
var NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];

// node_modules/@aws-sdk/service-error-classification/dist-es/index.js
var isRetryableByTrait = function(error) {
  return error.$retryable !== void 0;
};
var isClockSkewError = function(error) {
  return CLOCK_SKEW_ERROR_CODES.includes(error.name);
};
var isThrottlingError = function(error) {
  var _a, _b;
  return ((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) === 429 || THROTTLING_ERROR_CODES.includes(error.name) || ((_b = error.$retryable) === null || _b === void 0 ? void 0 : _b.throttling) == true;
};
var isTransientError = function(error) {
  var _a;
  return TRANSIENT_ERROR_CODES.includes(error.name) || NODEJS_TIMEOUT_ERROR_CODES.includes((error === null || error === void 0 ? void 0 : error.code) || "") || TRANSIENT_ERROR_STATUS_CODES.includes(((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) || 0);
};

// node_modules/@aws-sdk/middleware-retry/dist-es/DefaultRateLimiter.js
var DefaultRateLimiter = function() {
  function DefaultRateLimiter2(options) {
    var _a, _b, _c, _d, _e;
    this.currentCapacity = 0;
    this.enabled = false;
    this.lastMaxRate = 0;
    this.measuredTxRate = 0;
    this.requestCount = 0;
    this.lastTimestamp = 0;
    this.timeWindow = 0;
    this.beta = (_a = options === null || options === void 0 ? void 0 : options.beta) !== null && _a !== void 0 ? _a : 0.7;
    this.minCapacity = (_b = options === null || options === void 0 ? void 0 : options.minCapacity) !== null && _b !== void 0 ? _b : 1;
    this.minFillRate = (_c = options === null || options === void 0 ? void 0 : options.minFillRate) !== null && _c !== void 0 ? _c : 0.5;
    this.scaleConstant = (_d = options === null || options === void 0 ? void 0 : options.scaleConstant) !== null && _d !== void 0 ? _d : 0.4;
    this.smooth = (_e = options === null || options === void 0 ? void 0 : options.smooth) !== null && _e !== void 0 ? _e : 0.8;
    var currentTimeInSeconds = this.getCurrentTimeInSeconds();
    this.lastThrottleTime = currentTimeInSeconds;
    this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
    this.fillRate = this.minFillRate;
    this.maxCapacity = this.minCapacity;
  }
  DefaultRateLimiter2.prototype.getCurrentTimeInSeconds = function() {
    return Date.now() / 1e3;
  };
  DefaultRateLimiter2.prototype.getSendToken = function() {
    return __awaiter(this, void 0, void 0, function() {
      return __generator(this, function(_a) {
        return [2, this.acquireTokenBucket(1)];
      });
    });
  };
  DefaultRateLimiter2.prototype.acquireTokenBucket = function(amount) {
    return __awaiter(this, void 0, void 0, function() {
      var delay_1;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!this.enabled) {
              return [2];
            }
            this.refillTokenBucket();
            if (!(amount > this.currentCapacity))
              return [3, 2];
            delay_1 = (amount - this.currentCapacity) / this.fillRate * 1e3;
            return [4, new Promise(function(resolve) {
              return setTimeout(resolve, delay_1);
            })];
          case 1:
            _a.sent();
            _a.label = 2;
          case 2:
            this.currentCapacity = this.currentCapacity - amount;
            return [2];
        }
      });
    });
  };
  DefaultRateLimiter2.prototype.refillTokenBucket = function() {
    var timestamp = this.getCurrentTimeInSeconds();
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      return;
    }
    var fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
    this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
    this.lastTimestamp = timestamp;
  };
  DefaultRateLimiter2.prototype.updateClientSendingRate = function(response) {
    var calculatedRate;
    this.updateMeasuredRate();
    if (isThrottlingError(response)) {
      var rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
      this.lastMaxRate = rateToUse;
      this.calculateTimeWindow();
      this.lastThrottleTime = this.getCurrentTimeInSeconds();
      calculatedRate = this.cubicThrottle(rateToUse);
      this.enableTokenBucket();
    } else {
      this.calculateTimeWindow();
      calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
    }
    var newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
    this.updateTokenBucketRate(newRate);
  };
  DefaultRateLimiter2.prototype.calculateTimeWindow = function() {
    this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
  };
  DefaultRateLimiter2.prototype.cubicThrottle = function(rateToUse) {
    return this.getPrecise(rateToUse * this.beta);
  };
  DefaultRateLimiter2.prototype.cubicSuccess = function(timestamp) {
    return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
  };
  DefaultRateLimiter2.prototype.enableTokenBucket = function() {
    this.enabled = true;
  };
  DefaultRateLimiter2.prototype.updateTokenBucketRate = function(newRate) {
    this.refillTokenBucket();
    this.fillRate = Math.max(newRate, this.minFillRate);
    this.maxCapacity = Math.max(newRate, this.minCapacity);
    this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
  };
  DefaultRateLimiter2.prototype.updateMeasuredRate = function() {
    var t = this.getCurrentTimeInSeconds();
    var timeBucket = Math.floor(t * 2) / 2;
    this.requestCount++;
    if (timeBucket > this.lastTxRateBucket) {
      var currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
      this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
      this.requestCount = 0;
      this.lastTxRateBucket = timeBucket;
    }
  };
  DefaultRateLimiter2.prototype.getPrecise = function(num) {
    return parseFloat(num.toFixed(8));
  };
  return DefaultRateLimiter2;
}();

// node_modules/@aws-sdk/middleware-retry/dist-es/constants.js
var DEFAULT_RETRY_DELAY_BASE = 100;
var MAXIMUM_RETRY_DELAY = 20 * 1e3;
var THROTTLING_RETRY_DELAY_BASE = 500;
var INITIAL_RETRY_TOKENS = 500;
var RETRY_COST = 5;
var TIMEOUT_RETRY_COST = 10;
var NO_RETRY_INCREMENT = 1;
var INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
var REQUEST_HEADER = "amz-sdk-request";

// node_modules/@aws-sdk/middleware-retry/dist-es/defaultRetryQuota.js
var getDefaultRetryQuota = function(initialRetryTokens, options) {
  var _a, _b, _c;
  var MAX_CAPACITY = initialRetryTokens;
  var noRetryIncrement = (_a = options === null || options === void 0 ? void 0 : options.noRetryIncrement) !== null && _a !== void 0 ? _a : NO_RETRY_INCREMENT;
  var retryCost = (_b = options === null || options === void 0 ? void 0 : options.retryCost) !== null && _b !== void 0 ? _b : RETRY_COST;
  var timeoutRetryCost = (_c = options === null || options === void 0 ? void 0 : options.timeoutRetryCost) !== null && _c !== void 0 ? _c : TIMEOUT_RETRY_COST;
  var availableCapacity = initialRetryTokens;
  var getCapacityAmount = function(error) {
    return error.name === "TimeoutError" ? timeoutRetryCost : retryCost;
  };
  var hasRetryTokens = function(error) {
    return getCapacityAmount(error) <= availableCapacity;
  };
  var retrieveRetryTokens = function(error) {
    if (!hasRetryTokens(error)) {
      throw new Error("No retry token available");
    }
    var capacityAmount = getCapacityAmount(error);
    availableCapacity -= capacityAmount;
    return capacityAmount;
  };
  var releaseRetryTokens = function(capacityReleaseAmount) {
    availableCapacity += capacityReleaseAmount !== null && capacityReleaseAmount !== void 0 ? capacityReleaseAmount : noRetryIncrement;
    availableCapacity = Math.min(availableCapacity, MAX_CAPACITY);
  };
  return Object.freeze({
    hasRetryTokens,
    retrieveRetryTokens,
    releaseRetryTokens
  });
};

// node_modules/@aws-sdk/middleware-retry/dist-es/delayDecider.js
var defaultDelayDecider = function(delayBase, attempts) {
  return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * Math.pow(2, attempts) * delayBase));
};

// node_modules/@aws-sdk/middleware-retry/dist-es/retryDecider.js
var defaultRetryDecider = function(error) {
  if (!error) {
    return false;
  }
  return isRetryableByTrait(error) || isClockSkewError(error) || isThrottlingError(error) || isTransientError(error);
};

// node_modules/@aws-sdk/middleware-retry/dist-es/StandardRetryStrategy.js
var StandardRetryStrategy = function() {
  function StandardRetryStrategy2(maxAttemptsProvider, options) {
    var _a, _b, _c;
    this.maxAttemptsProvider = maxAttemptsProvider;
    this.mode = RETRY_MODES.STANDARD;
    this.retryDecider = (_a = options === null || options === void 0 ? void 0 : options.retryDecider) !== null && _a !== void 0 ? _a : defaultRetryDecider;
    this.delayDecider = (_b = options === null || options === void 0 ? void 0 : options.delayDecider) !== null && _b !== void 0 ? _b : defaultDelayDecider;
    this.retryQuota = (_c = options === null || options === void 0 ? void 0 : options.retryQuota) !== null && _c !== void 0 ? _c : getDefaultRetryQuota(INITIAL_RETRY_TOKENS);
  }
  StandardRetryStrategy2.prototype.shouldRetry = function(error, attempts, maxAttempts) {
    return attempts < maxAttempts && this.retryDecider(error) && this.retryQuota.hasRetryTokens(error);
  };
  StandardRetryStrategy2.prototype.getMaxAttempts = function() {
    return __awaiter(this, void 0, void 0, function() {
      var maxAttempts, error_1;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [4, this.maxAttemptsProvider()];
          case 1:
            maxAttempts = _a.sent();
            return [3, 3];
          case 2:
            error_1 = _a.sent();
            maxAttempts = DEFAULT_MAX_ATTEMPTS;
            return [3, 3];
          case 3:
            return [2, maxAttempts];
        }
      });
    });
  };
  StandardRetryStrategy2.prototype.retry = function(next, args, options) {
    return __awaiter(this, void 0, void 0, function() {
      var retryTokenAmount, attempts, totalDelay, maxAttempts, request2, _loop_1, this_1, state_1;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            attempts = 0;
            totalDelay = 0;
            return [4, this.getMaxAttempts()];
          case 1:
            maxAttempts = _a.sent();
            request2 = args.request;
            if (HttpRequest.isInstance(request2)) {
              request2.headers[INVOCATION_ID_HEADER] = v4();
            }
            _loop_1 = function() {
              var _b, response, output, e_1, err, delayFromDecider, delayFromResponse, delay_1;
              return __generator(this, function(_c) {
                switch (_c.label) {
                  case 0:
                    _c.trys.push([0, 4, , 7]);
                    if (HttpRequest.isInstance(request2)) {
                      request2.headers[REQUEST_HEADER] = "attempt=".concat(attempts + 1, "; max=").concat(maxAttempts);
                    }
                    if (!(options === null || options === void 0 ? void 0 : options.beforeRequest))
                      return [3, 2];
                    return [4, options.beforeRequest()];
                  case 1:
                    _c.sent();
                    _c.label = 2;
                  case 2:
                    return [4, next(args)];
                  case 3:
                    _b = _c.sent(), response = _b.response, output = _b.output;
                    if (options === null || options === void 0 ? void 0 : options.afterRequest) {
                      options.afterRequest(response);
                    }
                    this_1.retryQuota.releaseRetryTokens(retryTokenAmount);
                    output.$metadata.attempts = attempts + 1;
                    output.$metadata.totalRetryDelay = totalDelay;
                    return [2, { value: { response, output } }];
                  case 4:
                    e_1 = _c.sent();
                    err = asSdkError(e_1);
                    attempts++;
                    if (!this_1.shouldRetry(err, attempts, maxAttempts))
                      return [3, 6];
                    retryTokenAmount = this_1.retryQuota.retrieveRetryTokens(err);
                    delayFromDecider = this_1.delayDecider(isThrottlingError(err) ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE, attempts);
                    delayFromResponse = getDelayFromRetryAfterHeader(err.$response);
                    delay_1 = Math.max(delayFromResponse || 0, delayFromDecider);
                    totalDelay += delay_1;
                    return [4, new Promise(function(resolve) {
                      return setTimeout(resolve, delay_1);
                    })];
                  case 5:
                    _c.sent();
                    return [2, "continue"];
                  case 6:
                    if (!err.$metadata) {
                      err.$metadata = {};
                    }
                    err.$metadata.attempts = attempts;
                    err.$metadata.totalRetryDelay = totalDelay;
                    throw err;
                  case 7:
                    return [2];
                }
              });
            };
            this_1 = this;
            _a.label = 2;
          case 2:
            if (false)
              return [3, 4];
            return [5, _loop_1()];
          case 3:
            state_1 = _a.sent();
            if (typeof state_1 === "object")
              return [2, state_1.value];
            return [3, 2];
          case 4:
            return [2];
        }
      });
    });
  };
  return StandardRetryStrategy2;
}();
var getDelayFromRetryAfterHeader = function(response) {
  if (!HttpResponse.isInstance(response))
    return;
  var retryAfterHeaderName = Object.keys(response.headers).find(function(key) {
    return key.toLowerCase() === "retry-after";
  });
  if (!retryAfterHeaderName)
    return;
  var retryAfter = response.headers[retryAfterHeaderName];
  var retryAfterSeconds = Number(retryAfter);
  if (!Number.isNaN(retryAfterSeconds))
    return retryAfterSeconds * 1e3;
  var retryAfterDate = new Date(retryAfter);
  return retryAfterDate.getTime() - Date.now();
};
var asSdkError = function(error) {
  if (error instanceof Error)
    return error;
  if (error instanceof Object)
    return Object.assign(new Error(), error);
  if (typeof error === "string")
    return new Error(error);
  return new Error("AWS SDK error wrapper for ".concat(error));
};

// node_modules/@aws-sdk/middleware-retry/dist-es/AdaptiveRetryStrategy.js
var AdaptiveRetryStrategy = function(_super) {
  __extends(AdaptiveRetryStrategy2, _super);
  function AdaptiveRetryStrategy2(maxAttemptsProvider, options) {
    var _this = this;
    var _a = options !== null && options !== void 0 ? options : {}, rateLimiter = _a.rateLimiter, superOptions = __rest(_a, ["rateLimiter"]);
    _this = _super.call(this, maxAttemptsProvider, superOptions) || this;
    _this.rateLimiter = rateLimiter !== null && rateLimiter !== void 0 ? rateLimiter : new DefaultRateLimiter();
    _this.mode = RETRY_MODES.ADAPTIVE;
    return _this;
  }
  AdaptiveRetryStrategy2.prototype.retry = function(next, args) {
    return __awaiter(this, void 0, void 0, function() {
      var _this = this;
      return __generator(this, function(_a) {
        return [2, _super.prototype.retry.call(this, next, args, {
          beforeRequest: function() {
            return __awaiter(_this, void 0, void 0, function() {
              return __generator(this, function(_a2) {
                return [2, this.rateLimiter.getSendToken()];
              });
            });
          },
          afterRequest: function(response) {
            _this.rateLimiter.updateClientSendingRate(response);
          }
        })];
      });
    });
  };
  return AdaptiveRetryStrategy2;
}(StandardRetryStrategy);

// node_modules/@aws-sdk/middleware-retry/dist-es/configurations.js
var ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
var CONFIG_MAX_ATTEMPTS = "max_attempts";
var NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env2) {
    var value = env2[ENV_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    var maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error("Environment variable ".concat(ENV_MAX_ATTEMPTS, ' mast be a number, got "').concat(value, '"'));
    }
    return maxAttempt;
  },
  configFileSelector: function(profile) {
    var value = profile[CONFIG_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    var maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error("Shared config file entry ".concat(CONFIG_MAX_ATTEMPTS, ' mast be a number, got "').concat(value, '"'));
    }
    return maxAttempt;
  },
  default: DEFAULT_MAX_ATTEMPTS
};
var resolveRetryConfig = function(input) {
  var _a;
  var maxAttempts = normalizeProvider((_a = input.maxAttempts) !== null && _a !== void 0 ? _a : DEFAULT_MAX_ATTEMPTS);
  return __assign(__assign({}, input), { maxAttempts, retryStrategy: function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var retryMode;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            if (input.retryStrategy) {
              return [2, input.retryStrategy];
            }
            return [4, normalizeProvider(input.retryMode)()];
          case 1:
            retryMode = _a2.sent();
            if (retryMode === RETRY_MODES.ADAPTIVE) {
              return [2, new AdaptiveRetryStrategy(maxAttempts)];
            }
            return [2, new StandardRetryStrategy(maxAttempts)];
        }
      });
    });
  } });
};
var ENV_RETRY_MODE = "AWS_RETRY_MODE";
var CONFIG_RETRY_MODE = "retry_mode";
var NODE_RETRY_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env2) {
    return env2[ENV_RETRY_MODE];
  },
  configFileSelector: function(profile) {
    return profile[CONFIG_RETRY_MODE];
  },
  default: DEFAULT_RETRY_MODE
};

// node_modules/@aws-sdk/middleware-retry/dist-es/retryMiddleware.js
var retryMiddleware = function(options) {
  return function(next, context) {
    return function(args) {
      return __awaiter(void 0, void 0, void 0, function() {
        var retryStrategy;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, options.retryStrategy()];
            case 1:
              retryStrategy = _a.sent();
              if (retryStrategy === null || retryStrategy === void 0 ? void 0 : retryStrategy.mode)
                context.userAgent = __spreadArray(__spreadArray([], __read(context.userAgent || []), false), [["cfg/retry-mode", retryStrategy.mode]], false);
              return [2, retryStrategy.retry(next, args)];
          }
        });
      });
    };
  };
};
var retryMiddlewareOptions = {
  name: "retryMiddleware",
  tags: ["RETRY"],
  step: "finalizeRequest",
  priority: "high",
  override: true
};
var getRetryPlugin = function(options) {
  return {
    applyToStack: function(clientStack) {
      clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
    }
  };
};

// node_modules/@aws-sdk/property-provider/dist-es/ProviderError.js
var ProviderError = function(_super) {
  __extends(ProviderError2, _super);
  function ProviderError2(message, tryNextLink) {
    if (tryNextLink === void 0) {
      tryNextLink = true;
    }
    var _this = _super.call(this, message) || this;
    _this.tryNextLink = tryNextLink;
    _this.name = "ProviderError";
    Object.setPrototypeOf(_this, ProviderError2.prototype);
    return _this;
  }
  ProviderError2.from = function(error, tryNextLink) {
    if (tryNextLink === void 0) {
      tryNextLink = true;
    }
    return Object.assign(new this(error.message, tryNextLink), error);
  };
  return ProviderError2;
}(Error);

// node_modules/@aws-sdk/property-provider/dist-es/CredentialsProviderError.js
var CredentialsProviderError = function(_super) {
  __extends(CredentialsProviderError2, _super);
  function CredentialsProviderError2(message, tryNextLink) {
    if (tryNextLink === void 0) {
      tryNextLink = true;
    }
    var _this = _super.call(this, message, tryNextLink) || this;
    _this.tryNextLink = tryNextLink;
    _this.name = "CredentialsProviderError";
    Object.setPrototypeOf(_this, CredentialsProviderError2.prototype);
    return _this;
  }
  return CredentialsProviderError2;
}(ProviderError);

// node_modules/@aws-sdk/property-provider/dist-es/TokenProviderError.js
var TokenProviderError = function(_super) {
  __extends(TokenProviderError2, _super);
  function TokenProviderError2(message, tryNextLink) {
    if (tryNextLink === void 0) {
      tryNextLink = true;
    }
    var _this = _super.call(this, message, tryNextLink) || this;
    _this.tryNextLink = tryNextLink;
    _this.name = "TokenProviderError";
    Object.setPrototypeOf(_this, TokenProviderError2.prototype);
    return _this;
  }
  return TokenProviderError2;
}(ProviderError);

// node_modules/@aws-sdk/property-provider/dist-es/chain.js
function chain() {
  var providers = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    providers[_i] = arguments[_i];
  }
  return function() {
    var e_1, _a;
    var promise = Promise.reject(new ProviderError("No providers in chain"));
    var _loop_1 = function(provider2) {
      promise = promise.catch(function(err) {
        if (err === null || err === void 0 ? void 0 : err.tryNextLink) {
          return provider2();
        }
        throw err;
      });
    };
    try {
      for (var providers_1 = __values(providers), providers_1_1 = providers_1.next(); !providers_1_1.done; providers_1_1 = providers_1.next()) {
        var provider = providers_1_1.value;
        _loop_1(provider);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (providers_1_1 && !providers_1_1.done && (_a = providers_1.return))
          _a.call(providers_1);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    return promise;
  };
}

// node_modules/@aws-sdk/property-provider/dist-es/fromStatic.js
var fromStatic = function(staticValue) {
  return function() {
    return Promise.resolve(staticValue);
  };
};

// node_modules/@aws-sdk/property-provider/dist-es/memoize.js
var memoize2 = function(provider, isExpired, requiresRefresh) {
  var resolved;
  var pending;
  var hasResult;
  var isConstant = false;
  var coalesceProvider = function() {
    return __awaiter(void 0, void 0, void 0, function() {
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!pending) {
              pending = provider();
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 3, 4]);
            return [4, pending];
          case 2:
            resolved = _a.sent();
            hasResult = true;
            isConstant = false;
            return [3, 4];
          case 3:
            pending = void 0;
            return [7];
          case 4:
            return [2, resolved];
        }
      });
    });
  };
  if (isExpired === void 0) {
    return function(options) {
      return __awaiter(void 0, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (!(!hasResult || (options === null || options === void 0 ? void 0 : options.forceRefresh)))
                return [3, 2];
              return [4, coalesceProvider()];
            case 1:
              resolved = _a.sent();
              _a.label = 2;
            case 2:
              return [2, resolved];
          }
        });
      });
    };
  }
  return function(options) {
    return __awaiter(void 0, void 0, void 0, function() {
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!(!hasResult || (options === null || options === void 0 ? void 0 : options.forceRefresh)))
              return [3, 2];
            return [4, coalesceProvider()];
          case 1:
            resolved = _a.sent();
            _a.label = 2;
          case 2:
            if (isConstant) {
              return [2, resolved];
            }
            if (requiresRefresh && !requiresRefresh(resolved)) {
              isConstant = true;
              return [2, resolved];
            }
            if (!isExpired(resolved))
              return [3, 4];
            return [4, coalesceProvider()];
          case 3:
            _a.sent();
            return [2, resolved];
          case 4:
            return [2, resolved];
        }
      });
    });
  };
};

// node_modules/@aws-sdk/util-hex-encoding/dist-es/index.js
var SHORT_TO_HEX = {};
var HEX_TO_SHORT = {};
for (i = 0; i < 256; i++) {
  encodedByte = i.toString(16).toLowerCase();
  if (encodedByte.length === 1) {
    encodedByte = "0".concat(encodedByte);
  }
  SHORT_TO_HEX[i] = encodedByte;
  HEX_TO_SHORT[encodedByte] = i;
}
var encodedByte;
var i;
function toHex(bytes) {
  var out = "";
  for (var i = 0; i < bytes.byteLength; i++) {
    out += SHORT_TO_HEX[bytes[i]];
  }
  return out;
}

// node_modules/@aws-sdk/signature-v4/dist-es/constants.js
var ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
var CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
var AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
var SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
var EXPIRES_QUERY_PARAM = "X-Amz-Expires";
var SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
var TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
var AUTH_HEADER = "authorization";
var AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
var DATE_HEADER = "date";
var GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
var SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
var SHA256_HEADER = "x-amz-content-sha256";
var TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
var ALWAYS_UNSIGNABLE_HEADERS = {
  authorization: true,
  "cache-control": true,
  connection: true,
  expect: true,
  from: true,
  "keep-alive": true,
  "max-forwards": true,
  pragma: true,
  referer: true,
  te: true,
  trailer: true,
  "transfer-encoding": true,
  upgrade: true,
  "user-agent": true,
  "x-amzn-trace-id": true
};
var PROXY_HEADER_PATTERN = /^proxy-/;
var SEC_HEADER_PATTERN = /^sec-/;
var ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
var EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
var UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
var MAX_CACHE_SIZE = 50;
var KEY_TYPE_IDENTIFIER = "aws4_request";
var MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;

// node_modules/@aws-sdk/signature-v4/dist-es/credentialDerivation.js
var signingKeyCache = {};
var cacheQueue = [];
var createScope = function(shortDate, region, service) {
  return "".concat(shortDate, "/").concat(region, "/").concat(service, "/").concat(KEY_TYPE_IDENTIFIER);
};
var getSigningKey = function(sha256Constructor, credentials, shortDate, region, service) {
  return __awaiter(void 0, void 0, void 0, function() {
    var credsHash, cacheKey, key, _a, _b, signable, e_1_1;
    var e_1, _c;
    return __generator(this, function(_d) {
      switch (_d.label) {
        case 0:
          return [4, hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId)];
        case 1:
          credsHash = _d.sent();
          cacheKey = "".concat(shortDate, ":").concat(region, ":").concat(service, ":").concat(toHex(credsHash), ":").concat(credentials.sessionToken);
          if (cacheKey in signingKeyCache) {
            return [2, signingKeyCache[cacheKey]];
          }
          cacheQueue.push(cacheKey);
          while (cacheQueue.length > MAX_CACHE_SIZE) {
            delete signingKeyCache[cacheQueue.shift()];
          }
          key = "AWS4".concat(credentials.secretAccessKey);
          _d.label = 2;
        case 2:
          _d.trys.push([2, 7, 8, 9]);
          _a = __values([shortDate, region, service, KEY_TYPE_IDENTIFIER]), _b = _a.next();
          _d.label = 3;
        case 3:
          if (!!_b.done)
            return [3, 6];
          signable = _b.value;
          return [4, hmac(sha256Constructor, key, signable)];
        case 4:
          key = _d.sent();
          _d.label = 5;
        case 5:
          _b = _a.next();
          return [3, 3];
        case 6:
          return [3, 9];
        case 7:
          e_1_1 = _d.sent();
          e_1 = { error: e_1_1 };
          return [3, 9];
        case 8:
          try {
            if (_b && !_b.done && (_c = _a.return))
              _c.call(_a);
          } finally {
            if (e_1)
              throw e_1.error;
          }
          return [7];
        case 9:
          return [2, signingKeyCache[cacheKey] = key];
      }
    });
  });
};
var hmac = function(ctor, secret, data) {
  var hash = new ctor(secret);
  hash.update(data);
  return hash.digest();
};

// node_modules/@aws-sdk/signature-v4/dist-es/getCanonicalHeaders.js
var getCanonicalHeaders = function(_a, unsignableHeaders, signableHeaders) {
  var e_1, _b;
  var headers = _a.headers;
  var canonical = {};
  try {
    for (var _c = __values(Object.keys(headers).sort()), _d = _c.next(); !_d.done; _d = _c.next()) {
      var headerName = _d.value;
      if (headers[headerName] == void 0) {
        continue;
      }
      var canonicalHeaderName = headerName.toLowerCase();
      if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || (unsignableHeaders === null || unsignableHeaders === void 0 ? void 0 : unsignableHeaders.has(canonicalHeaderName)) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
        if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
          continue;
        }
      }
      canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_d && !_d.done && (_b = _c.return))
        _b.call(_c);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return canonical;
};

// node_modules/@aws-sdk/util-uri-escape/dist-es/escape-uri.js
var escapeUri = function(uri) {
  return encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
};
var hexEncode = function(c) {
  return "%".concat(c.charCodeAt(0).toString(16).toUpperCase());
};

// node_modules/@aws-sdk/signature-v4/dist-es/getCanonicalQuery.js
var getCanonicalQuery = function(_a) {
  var e_1, _b;
  var _c = _a.query, query = _c === void 0 ? {} : _c;
  var keys2 = [];
  var serialized = {};
  var _loop_1 = function(key2) {
    if (key2.toLowerCase() === SIGNATURE_HEADER) {
      return "continue";
    }
    keys2.push(key2);
    var value = query[key2];
    if (typeof value === "string") {
      serialized[key2] = "".concat(escapeUri(key2), "=").concat(escapeUri(value));
    } else if (Array.isArray(value)) {
      serialized[key2] = value.slice(0).sort().reduce(function(encoded, value2) {
        return encoded.concat(["".concat(escapeUri(key2), "=").concat(escapeUri(value2))]);
      }, []).join("&");
    }
  };
  try {
    for (var _d = __values(Object.keys(query).sort()), _e = _d.next(); !_e.done; _e = _d.next()) {
      var key = _e.value;
      _loop_1(key);
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_e && !_e.done && (_b = _d.return))
        _b.call(_d);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return keys2.map(function(key2) {
    return serialized[key2];
  }).filter(function(serialized2) {
    return serialized2;
  }).join("&");
};

// node_modules/@aws-sdk/is-array-buffer/dist-es/index.js
var isArrayBuffer = function(arg) {
  return typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
};

// node_modules/@aws-sdk/signature-v4/dist-es/getPayloadHash.js
var getPayloadHash = function(_a, hashConstructor) {
  var headers = _a.headers, body = _a.body;
  return __awaiter(void 0, void 0, void 0, function() {
    var _b, _c, headerName, hashCtor, _d;
    var e_1, _e;
    return __generator(this, function(_f) {
      switch (_f.label) {
        case 0:
          try {
            for (_b = __values(Object.keys(headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
              headerName = _c.value;
              if (headerName.toLowerCase() === SHA256_HEADER) {
                return [2, headers[headerName]];
              }
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_c && !_c.done && (_e = _b.return))
                _e.call(_b);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          if (!(body == void 0))
            return [3, 1];
          return [2, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"];
        case 1:
          if (!(typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body)))
            return [3, 3];
          hashCtor = new hashConstructor();
          hashCtor.update(body);
          _d = toHex;
          return [4, hashCtor.digest()];
        case 2:
          return [2, _d.apply(void 0, [_f.sent()])];
        case 3:
          return [2, UNSIGNED_PAYLOAD];
      }
    });
  });
};

// node_modules/@aws-sdk/signature-v4/dist-es/headerUtil.js
var hasHeader = function(soughtHeader, headers) {
  var e_1, _a;
  soughtHeader = soughtHeader.toLowerCase();
  try {
    for (var _b = __values(Object.keys(headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var headerName = _c.value;
      if (soughtHeader === headerName.toLowerCase()) {
        return true;
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return))
        _a.call(_b);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return false;
};

// node_modules/@aws-sdk/signature-v4/dist-es/cloneRequest.js
var cloneRequest = function(_a) {
  var headers = _a.headers, query = _a.query, rest = __rest(_a, ["headers", "query"]);
  return __assign(__assign({}, rest), { headers: __assign({}, headers), query: query ? cloneQuery2(query) : void 0 });
};
var cloneQuery2 = function(query) {
  return Object.keys(query).reduce(function(carry, paramName) {
    var _a;
    var param = query[paramName];
    return __assign(__assign({}, carry), (_a = {}, _a[paramName] = Array.isArray(param) ? __spreadArray([], __read(param), false) : param, _a));
  }, {});
};

// node_modules/@aws-sdk/signature-v4/dist-es/moveHeadersToQuery.js
var moveHeadersToQuery = function(request2, options) {
  var e_1, _a;
  var _b;
  if (options === void 0) {
    options = {};
  }
  var _c = typeof request2.clone === "function" ? request2.clone() : cloneRequest(request2), headers = _c.headers, _d = _c.query, query = _d === void 0 ? {} : _d;
  try {
    for (var _e = __values(Object.keys(headers)), _f = _e.next(); !_f.done; _f = _e.next()) {
      var name_1 = _f.value;
      var lname = name_1.toLowerCase();
      if (lname.slice(0, 6) === "x-amz-" && !((_b = options.unhoistableHeaders) === null || _b === void 0 ? void 0 : _b.has(lname))) {
        query[name_1] = headers[name_1];
        delete headers[name_1];
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_f && !_f.done && (_a = _e.return))
        _a.call(_e);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return __assign(__assign({}, request2), { headers, query });
};

// node_modules/@aws-sdk/signature-v4/dist-es/prepareRequest.js
var prepareRequest = function(request2) {
  var e_1, _a;
  request2 = typeof request2.clone === "function" ? request2.clone() : cloneRequest(request2);
  try {
    for (var _b = __values(Object.keys(request2.headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var headerName = _c.value;
      if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
        delete request2.headers[headerName];
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return))
        _a.call(_b);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return request2;
};

// node_modules/@aws-sdk/signature-v4/dist-es/utilDate.js
var iso8601 = function(time) {
  return toDate(time).toISOString().replace(/\.\d{3}Z$/, "Z");
};
var toDate = function(time) {
  if (typeof time === "number") {
    return new Date(time * 1e3);
  }
  if (typeof time === "string") {
    if (Number(time)) {
      return new Date(Number(time) * 1e3);
    }
    return new Date(time);
  }
  return time;
};

// node_modules/@aws-sdk/signature-v4/dist-es/SignatureV4.js
var SignatureV4 = function() {
  function SignatureV42(_a) {
    var applyChecksum = _a.applyChecksum, credentials = _a.credentials, region = _a.region, service = _a.service, sha256 = _a.sha256, _b = _a.uriEscapePath, uriEscapePath = _b === void 0 ? true : _b;
    this.service = service;
    this.sha256 = sha256;
    this.uriEscapePath = uriEscapePath;
    this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
    this.regionProvider = normalizeProvider(region);
    this.credentialProvider = normalizeProvider(credentials);
  }
  SignatureV42.prototype.presign = function(originalRequest, options) {
    if (options === void 0) {
      options = {};
    }
    return __awaiter(this, void 0, void 0, function() {
      var _a, signingDate, _b, expiresIn, unsignableHeaders, unhoistableHeaders, signableHeaders, signingRegion, signingService, credentials, region, _c, _d, longDate, shortDate, scope, request2, canonicalHeaders, _e, _f, _g, _h, _j, _k;
      return __generator(this, function(_l) {
        switch (_l.label) {
          case 0:
            _a = options.signingDate, signingDate = _a === void 0 ? new Date() : _a, _b = options.expiresIn, expiresIn = _b === void 0 ? 3600 : _b, unsignableHeaders = options.unsignableHeaders, unhoistableHeaders = options.unhoistableHeaders, signableHeaders = options.signableHeaders, signingRegion = options.signingRegion, signingService = options.signingService;
            return [4, this.credentialProvider()];
          case 1:
            credentials = _l.sent();
            this.validateResolvedCredentials(credentials);
            if (!(signingRegion !== null && signingRegion !== void 0))
              return [3, 2];
            _c = signingRegion;
            return [3, 4];
          case 2:
            return [4, this.regionProvider()];
          case 3:
            _c = _l.sent();
            _l.label = 4;
          case 4:
            region = _c;
            _d = formatDate2(signingDate), longDate = _d.longDate, shortDate = _d.shortDate;
            if (expiresIn > MAX_PRESIGNED_TTL) {
              return [2, Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future")];
            }
            scope = createScope(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
            request2 = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders });
            if (credentials.sessionToken) {
              request2.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
            }
            request2.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
            request2.query[CREDENTIAL_QUERY_PARAM] = "".concat(credentials.accessKeyId, "/").concat(scope);
            request2.query[AMZ_DATE_QUERY_PARAM] = longDate;
            request2.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
            canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
            request2.query[SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
            _e = request2.query;
            _f = SIGNATURE_QUERY_PARAM;
            _g = this.getSignature;
            _h = [
              longDate,
              scope,
              this.getSigningKey(credentials, region, shortDate, signingService)
            ];
            _j = this.createCanonicalRequest;
            _k = [request2, canonicalHeaders];
            return [4, getPayloadHash(originalRequest, this.sha256)];
          case 5:
            return [4, _g.apply(this, _h.concat([_j.apply(this, _k.concat([_l.sent()]))]))];
          case 6:
            _e[_f] = _l.sent();
            return [2, request2];
        }
      });
    });
  };
  SignatureV42.prototype.sign = function(toSign, options) {
    return __awaiter(this, void 0, void 0, function() {
      return __generator(this, function(_a) {
        if (typeof toSign === "string") {
          return [2, this.signString(toSign, options)];
        } else if (toSign.headers && toSign.payload) {
          return [2, this.signEvent(toSign, options)];
        } else {
          return [2, this.signRequest(toSign, options)];
        }
        return [2];
      });
    });
  };
  SignatureV42.prototype.signEvent = function(_a, _b) {
    var headers = _a.headers, payload = _a.payload;
    var _c = _b.signingDate, signingDate = _c === void 0 ? new Date() : _c, priorSignature = _b.priorSignature, signingRegion = _b.signingRegion, signingService = _b.signingService;
    return __awaiter(this, void 0, void 0, function() {
      var region, _d, _e, shortDate, longDate, scope, hashedPayload, hash, hashedHeaders, _f, stringToSign;
      return __generator(this, function(_g) {
        switch (_g.label) {
          case 0:
            if (!(signingRegion !== null && signingRegion !== void 0))
              return [3, 1];
            _d = signingRegion;
            return [3, 3];
          case 1:
            return [4, this.regionProvider()];
          case 2:
            _d = _g.sent();
            _g.label = 3;
          case 3:
            region = _d;
            _e = formatDate2(signingDate), shortDate = _e.shortDate, longDate = _e.longDate;
            scope = createScope(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
            return [4, getPayloadHash({ headers: {}, body: payload }, this.sha256)];
          case 4:
            hashedPayload = _g.sent();
            hash = new this.sha256();
            hash.update(headers);
            _f = toHex;
            return [4, hash.digest()];
          case 5:
            hashedHeaders = _f.apply(void 0, [_g.sent()]);
            stringToSign = [
              EVENT_ALGORITHM_IDENTIFIER,
              longDate,
              scope,
              priorSignature,
              hashedHeaders,
              hashedPayload
            ].join("\n");
            return [2, this.signString(stringToSign, { signingDate, signingRegion: region, signingService })];
        }
      });
    });
  };
  SignatureV42.prototype.signString = function(stringToSign, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.signingDate, signingDate = _c === void 0 ? new Date() : _c, signingRegion = _b.signingRegion, signingService = _b.signingService;
    return __awaiter(this, void 0, void 0, function() {
      var credentials, region, _d, shortDate, hash, _e, _f, _g;
      return __generator(this, function(_h) {
        switch (_h.label) {
          case 0:
            return [4, this.credentialProvider()];
          case 1:
            credentials = _h.sent();
            this.validateResolvedCredentials(credentials);
            if (!(signingRegion !== null && signingRegion !== void 0))
              return [3, 2];
            _d = signingRegion;
            return [3, 4];
          case 2:
            return [4, this.regionProvider()];
          case 3:
            _d = _h.sent();
            _h.label = 4;
          case 4:
            region = _d;
            shortDate = formatDate2(signingDate).shortDate;
            _f = (_e = this.sha256).bind;
            return [4, this.getSigningKey(credentials, region, shortDate, signingService)];
          case 5:
            hash = new (_f.apply(_e, [void 0, _h.sent()]))();
            hash.update(stringToSign);
            _g = toHex;
            return [4, hash.digest()];
          case 6:
            return [2, _g.apply(void 0, [_h.sent()])];
        }
      });
    });
  };
  SignatureV42.prototype.signRequest = function(requestToSign, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.signingDate, signingDate = _c === void 0 ? new Date() : _c, signableHeaders = _b.signableHeaders, unsignableHeaders = _b.unsignableHeaders, signingRegion = _b.signingRegion, signingService = _b.signingService;
    return __awaiter(this, void 0, void 0, function() {
      var credentials, region, _d, request2, _e, longDate, shortDate, scope, payloadHash, canonicalHeaders, signature;
      return __generator(this, function(_f) {
        switch (_f.label) {
          case 0:
            return [4, this.credentialProvider()];
          case 1:
            credentials = _f.sent();
            this.validateResolvedCredentials(credentials);
            if (!(signingRegion !== null && signingRegion !== void 0))
              return [3, 2];
            _d = signingRegion;
            return [3, 4];
          case 2:
            return [4, this.regionProvider()];
          case 3:
            _d = _f.sent();
            _f.label = 4;
          case 4:
            region = _d;
            request2 = prepareRequest(requestToSign);
            _e = formatDate2(signingDate), longDate = _e.longDate, shortDate = _e.shortDate;
            scope = createScope(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
            request2.headers[AMZ_DATE_HEADER] = longDate;
            if (credentials.sessionToken) {
              request2.headers[TOKEN_HEADER] = credentials.sessionToken;
            }
            return [4, getPayloadHash(request2, this.sha256)];
          case 5:
            payloadHash = _f.sent();
            if (!hasHeader(SHA256_HEADER, request2.headers) && this.applyChecksum) {
              request2.headers[SHA256_HEADER] = payloadHash;
            }
            canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
            return [4, this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, payloadHash))];
          case 6:
            signature = _f.sent();
            request2.headers[AUTH_HEADER] = "".concat(ALGORITHM_IDENTIFIER, " ") + "Credential=".concat(credentials.accessKeyId, "/").concat(scope, ", ") + "SignedHeaders=".concat(getCanonicalHeaderList(canonicalHeaders), ", ") + "Signature=".concat(signature);
            return [2, request2];
        }
      });
    });
  };
  SignatureV42.prototype.createCanonicalRequest = function(request2, canonicalHeaders, payloadHash) {
    var sortedHeaders = Object.keys(canonicalHeaders).sort();
    return "".concat(request2.method, "\n").concat(this.getCanonicalPath(request2), "\n").concat(getCanonicalQuery(request2), "\n").concat(sortedHeaders.map(function(name) {
      return "".concat(name, ":").concat(canonicalHeaders[name]);
    }).join("\n"), "\n\n").concat(sortedHeaders.join(";"), "\n").concat(payloadHash);
  };
  SignatureV42.prototype.createStringToSign = function(longDate, credentialScope, canonicalRequest) {
    return __awaiter(this, void 0, void 0, function() {
      var hash, hashedRequest;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            hash = new this.sha256();
            hash.update(canonicalRequest);
            return [4, hash.digest()];
          case 1:
            hashedRequest = _a.sent();
            return [2, "".concat(ALGORITHM_IDENTIFIER, "\n").concat(longDate, "\n").concat(credentialScope, "\n").concat(toHex(hashedRequest))];
        }
      });
    });
  };
  SignatureV42.prototype.getCanonicalPath = function(_a) {
    var e_1, _b;
    var path = _a.path;
    if (this.uriEscapePath) {
      var normalizedPathSegments = [];
      try {
        for (var _c = __values(path.split("/")), _d = _c.next(); !_d.done; _d = _c.next()) {
          var pathSegment = _d.value;
          if ((pathSegment === null || pathSegment === void 0 ? void 0 : pathSegment.length) === 0)
            continue;
          if (pathSegment === ".")
            continue;
          if (pathSegment === "..") {
            normalizedPathSegments.pop();
          } else {
            normalizedPathSegments.push(pathSegment);
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_d && !_d.done && (_b = _c.return))
            _b.call(_c);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      var normalizedPath = "".concat((path === null || path === void 0 ? void 0 : path.startsWith("/")) ? "/" : "").concat(normalizedPathSegments.join("/")).concat(normalizedPathSegments.length > 0 && (path === null || path === void 0 ? void 0 : path.endsWith("/")) ? "/" : "");
      var doubleEncoded = encodeURIComponent(normalizedPath);
      return doubleEncoded.replace(/%2F/g, "/");
    }
    return path;
  };
  SignatureV42.prototype.getSignature = function(longDate, credentialScope, keyPromise, canonicalRequest) {
    return __awaiter(this, void 0, void 0, function() {
      var stringToSign, hash, _a, _b, _c;
      return __generator(this, function(_d) {
        switch (_d.label) {
          case 0:
            return [4, this.createStringToSign(longDate, credentialScope, canonicalRequest)];
          case 1:
            stringToSign = _d.sent();
            _b = (_a = this.sha256).bind;
            return [4, keyPromise];
          case 2:
            hash = new (_b.apply(_a, [void 0, _d.sent()]))();
            hash.update(stringToSign);
            _c = toHex;
            return [4, hash.digest()];
          case 3:
            return [2, _c.apply(void 0, [_d.sent()])];
        }
      });
    });
  };
  SignatureV42.prototype.getSigningKey = function(credentials, region, shortDate, service) {
    return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
  };
  SignatureV42.prototype.validateResolvedCredentials = function(credentials) {
    if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") {
      throw new Error("Resolved credential object is not valid");
    }
  };
  return SignatureV42;
}();
var formatDate2 = function(now) {
  var longDate = iso8601(now).replace(/[\-:]/g, "");
  return {
    longDate,
    shortDate: longDate.slice(0, 8)
  };
};
var getCanonicalHeaderList = function(headers) {
  return Object.keys(headers).sort().join(";");
};

// node_modules/@aws-sdk/middleware-signing/dist-es/configurations.js
var CREDENTIAL_EXPIRE_WINDOW = 3e5;
var resolveAwsAuthConfig = function(input) {
  var normalizedCreds = input.credentials ? normalizeCredentialProvider(input.credentials) : input.credentialDefaultProvider(input);
  var _a = input.signingEscapePath, signingEscapePath = _a === void 0 ? true : _a, _b = input.systemClockOffset, systemClockOffset = _b === void 0 ? input.systemClockOffset || 0 : _b, sha256 = input.sha256;
  var signer;
  if (input.signer) {
    signer = normalizeProvider(input.signer);
  } else if (input.regionInfoProvider) {
    signer = function() {
      return normalizeProvider(input.region)().then(function(region) {
        return __awaiter(void 0, void 0, void 0, function() {
          var _a2, _b2, _c;
          var _d;
          return __generator(this, function(_e) {
            switch (_e.label) {
              case 0:
                _b2 = (_a2 = input).regionInfoProvider;
                _c = [region];
                _d = {};
                return [4, input.useFipsEndpoint()];
              case 1:
                _d.useFipsEndpoint = _e.sent();
                return [4, input.useDualstackEndpoint()];
              case 2:
                return [4, _b2.apply(_a2, _c.concat([(_d.useDualstackEndpoint = _e.sent(), _d)]))];
              case 3:
                return [2, [
                  _e.sent() || {},
                  region
                ]];
            }
          });
        });
      }).then(function(_a2) {
        var _b2 = __read(_a2, 2), regionInfo = _b2[0], region = _b2[1];
        var signingRegion = regionInfo.signingRegion, signingService = regionInfo.signingService;
        input.signingRegion = input.signingRegion || signingRegion || region;
        input.signingName = input.signingName || signingService || input.serviceId;
        var params = __assign(__assign({}, input), { credentials: normalizedCreds, region: input.signingRegion, service: input.signingName, sha256, uriEscapePath: signingEscapePath });
        var SignerCtor = input.signerConstructor || SignatureV4;
        return new SignerCtor(params);
      });
    };
  } else {
    signer = function(authScheme) {
      return __awaiter(void 0, void 0, void 0, function() {
        var signingRegion, signingService, params, SignerCtor;
        return __generator(this, function(_a2) {
          if (!authScheme) {
            throw new Error("Unexpected empty auth scheme config");
          }
          signingRegion = authScheme.signingScope;
          signingService = authScheme.signingName;
          input.signingRegion = input.signingRegion || signingRegion;
          input.signingName = input.signingName || signingService || input.serviceId;
          params = __assign(__assign({}, input), { credentials: normalizedCreds, region: input.signingRegion, service: input.signingName, sha256, uriEscapePath: signingEscapePath });
          SignerCtor = input.signerConstructor || SignatureV4;
          return [2, new SignerCtor(params)];
        });
      });
    };
  }
  return __assign(__assign({}, input), { systemClockOffset, signingEscapePath, credentials: normalizedCreds, signer });
};
var normalizeCredentialProvider = function(credentials) {
  if (typeof credentials === "function") {
    return memoize2(credentials, function(credentials2) {
      return credentials2.expiration !== void 0 && credentials2.expiration.getTime() - Date.now() < CREDENTIAL_EXPIRE_WINDOW;
    }, function(credentials2) {
      return credentials2.expiration !== void 0;
    });
  }
  return normalizeProvider(credentials);
};

// node_modules/@aws-sdk/middleware-signing/dist-es/utils/getSkewCorrectedDate.js
var getSkewCorrectedDate = function(systemClockOffset) {
  return new Date(Date.now() + systemClockOffset);
};

// node_modules/@aws-sdk/middleware-signing/dist-es/utils/isClockSkewed.js
var isClockSkewed = function(clockTime, systemClockOffset) {
  return Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5;
};

// node_modules/@aws-sdk/middleware-signing/dist-es/utils/getUpdatedSystemClockOffset.js
var getUpdatedSystemClockOffset = function(clockTime, currentSystemClockOffset) {
  var clockTimeInMs = Date.parse(clockTime);
  if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
    return clockTimeInMs - Date.now();
  }
  return currentSystemClockOffset;
};

// node_modules/@aws-sdk/middleware-signing/dist-es/middleware.js
var awsAuthMiddleware = function(options) {
  return function(next, context) {
    return function(args) {
      var _a, _b, _c;
      return __awaiter(this, void 0, void 0, function() {
        var authScheme, signer, output, _d, _e, dateHeader;
        var _f;
        return __generator(this, function(_g) {
          switch (_g.label) {
            case 0:
              if (!HttpRequest.isInstance(args.request))
                return [2, next(args)];
              authScheme = (_c = (_b = (_a = context.endpointV2) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.authSchemes) === null || _c === void 0 ? void 0 : _c[0];
              return [4, options.signer(authScheme)];
            case 1:
              signer = _g.sent();
              _d = next;
              _e = [__assign({}, args)];
              _f = {};
              return [4, signer.sign(args.request, {
                signingDate: getSkewCorrectedDate(options.systemClockOffset),
                signingRegion: context["signing_region"],
                signingService: context["signing_service"]
              })];
            case 2:
              return [4, _d.apply(void 0, [__assign.apply(void 0, _e.concat([(_f.request = _g.sent(), _f)]))]).catch(function(error) {
                var _a2;
                var serverTime = (_a2 = error.ServerTime) !== null && _a2 !== void 0 ? _a2 : getDateHeader(error.$response);
                if (serverTime) {
                  options.systemClockOffset = getUpdatedSystemClockOffset(serverTime, options.systemClockOffset);
                }
                throw error;
              })];
            case 3:
              output = _g.sent();
              dateHeader = getDateHeader(output.response);
              if (dateHeader) {
                options.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, options.systemClockOffset);
              }
              return [2, output];
          }
        });
      });
    };
  };
};
var getDateHeader = function(response) {
  var _a, _b, _c;
  return HttpResponse.isInstance(response) ? (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.date) !== null && _b !== void 0 ? _b : (_c = response.headers) === null || _c === void 0 ? void 0 : _c.Date : void 0;
};
var awsAuthMiddlewareOptions = {
  name: "awsAuthMiddleware",
  tags: ["SIGNATURE", "AWSAUTH"],
  relation: "after",
  toMiddleware: "retryMiddleware",
  override: true
};
var getAwsAuthPlugin = function(options) {
  return {
    applyToStack: function(clientStack) {
      clientStack.addRelativeTo(awsAuthMiddleware(options), awsAuthMiddlewareOptions);
    }
  };
};

// node_modules/@aws-sdk/middleware-user-agent/dist-es/configurations.js
function resolveUserAgentConfig(input) {
  return __assign(__assign({}, input), { customUserAgent: typeof input.customUserAgent === "string" ? [[input.customUserAgent]] : input.customUserAgent });
}

// node_modules/@aws-sdk/middleware-user-agent/dist-es/constants.js
var USER_AGENT = "user-agent";
var X_AMZ_USER_AGENT = "x-amz-user-agent";
var SPACE = " ";
var UA_ESCAPE_REGEX = /[^\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;

// node_modules/@aws-sdk/middleware-user-agent/dist-es/user-agent-middleware.js
var userAgentMiddleware = function(options) {
  return function(next, context) {
    return function(args) {
      return __awaiter(void 0, void 0, void 0, function() {
        var request2, headers, userAgent, defaultUserAgent2, customUserAgent, sdkUserAgentValue, normalUAValue;
        var _a, _b;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              request2 = args.request;
              if (!HttpRequest.isInstance(request2))
                return [2, next(args)];
              headers = request2.headers;
              userAgent = ((_a = context === null || context === void 0 ? void 0 : context.userAgent) === null || _a === void 0 ? void 0 : _a.map(escapeUserAgent)) || [];
              return [4, options.defaultUserAgentProvider()];
            case 1:
              defaultUserAgent2 = _c.sent().map(escapeUserAgent);
              customUserAgent = ((_b = options === null || options === void 0 ? void 0 : options.customUserAgent) === null || _b === void 0 ? void 0 : _b.map(escapeUserAgent)) || [];
              sdkUserAgentValue = __spreadArray(__spreadArray(__spreadArray([], __read(defaultUserAgent2), false), __read(userAgent), false), __read(customUserAgent), false).join(SPACE);
              normalUAValue = __spreadArray(__spreadArray([], __read(defaultUserAgent2.filter(function(section) {
                return section.startsWith("aws-sdk-");
              })), false), __read(customUserAgent), false).join(SPACE);
              if (options.runtime !== "browser") {
                if (normalUAValue) {
                  headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? "".concat(headers[USER_AGENT], " ").concat(normalUAValue) : normalUAValue;
                }
                headers[USER_AGENT] = sdkUserAgentValue;
              } else {
                headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
              }
              return [2, next(__assign(__assign({}, args), { request: request2 }))];
          }
        });
      });
    };
  };
};
var escapeUserAgent = function(_a) {
  var _b = __read(_a, 2), name = _b[0], version3 = _b[1];
  var prefixSeparatorIndex = name.indexOf("/");
  var prefix = name.substring(0, prefixSeparatorIndex);
  var uaName = name.substring(prefixSeparatorIndex + 1);
  if (prefix === "api") {
    uaName = uaName.toLowerCase();
  }
  return [prefix, uaName, version3].filter(function(item) {
    return item && item.length > 0;
  }).map(function(item) {
    return item === null || item === void 0 ? void 0 : item.replace(UA_ESCAPE_REGEX, "_");
  }).join("/");
};
var getUserAgentMiddlewareOptions = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: true
};
var getUserAgentPlugin = function(config) {
  return {
    applyToStack: function(clientStack) {
      clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
    }
  };
};

// node_modules/@aws-sdk/client-translate/package.json
var package_default2 = {
  name: "@aws-sdk/client-translate",
  description: "AWS SDK for JavaScript Translate Client for Node.js, Browser and React Native",
  version: "3.186.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "2.0.0",
    "@aws-crypto/sha256-js": "2.0.0",
    "@aws-sdk/client-sts": "3.186.0",
    "@aws-sdk/config-resolver": "3.186.0",
    "@aws-sdk/credential-provider-node": "3.186.0",
    "@aws-sdk/fetch-http-handler": "3.186.0",
    "@aws-sdk/hash-node": "3.186.0",
    "@aws-sdk/invalid-dependency": "3.186.0",
    "@aws-sdk/middleware-content-length": "3.186.0",
    "@aws-sdk/middleware-host-header": "3.186.0",
    "@aws-sdk/middleware-logger": "3.186.0",
    "@aws-sdk/middleware-recursion-detection": "3.186.0",
    "@aws-sdk/middleware-retry": "3.186.0",
    "@aws-sdk/middleware-serde": "3.186.0",
    "@aws-sdk/middleware-signing": "3.186.0",
    "@aws-sdk/middleware-stack": "3.186.0",
    "@aws-sdk/middleware-user-agent": "3.186.0",
    "@aws-sdk/node-config-provider": "3.186.0",
    "@aws-sdk/node-http-handler": "3.186.0",
    "@aws-sdk/protocol-http": "3.186.0",
    "@aws-sdk/smithy-client": "3.186.0",
    "@aws-sdk/types": "3.186.0",
    "@aws-sdk/url-parser": "3.186.0",
    "@aws-sdk/util-base64-browser": "3.186.0",
    "@aws-sdk/util-base64-node": "3.186.0",
    "@aws-sdk/util-body-length-browser": "3.186.0",
    "@aws-sdk/util-body-length-node": "3.186.0",
    "@aws-sdk/util-defaults-mode-browser": "3.186.0",
    "@aws-sdk/util-defaults-mode-node": "3.186.0",
    "@aws-sdk/util-user-agent-browser": "3.186.0",
    "@aws-sdk/util-user-agent-node": "3.186.0",
    "@aws-sdk/util-utf8-browser": "3.186.0",
    "@aws-sdk/util-utf8-node": "3.186.0",
    tslib: "^2.3.1",
    uuid: "^8.3.2"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.186.0",
    "@tsconfig/recommended": "1.0.1",
    "@types/node": "^12.7.5",
    "@types/uuid": "^8.3.0",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.19.2",
    typescript: "~4.6.2"
  },
  overrides: {
    typedoc: {
      typescript: "~4.6.2"
    }
  },
  engines: {
    node: ">=12.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-translate",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-translate"
  }
};

// node_modules/@aws-sdk/client-sts/dist-es/models/STSServiceException.js
var STSServiceException = function(_super) {
  __extends(STSServiceException2, _super);
  function STSServiceException2(options) {
    var _this = _super.call(this, options) || this;
    Object.setPrototypeOf(_this, STSServiceException2.prototype);
    return _this;
  }
  return STSServiceException2;
}(ServiceException);

// node_modules/@aws-sdk/client-sts/dist-es/models/models_0.js
var ExpiredTokenException = function(_super) {
  __extends(ExpiredTokenException2, _super);
  function ExpiredTokenException2(opts) {
    var _this = _super.call(this, __assign({ name: "ExpiredTokenException", $fault: "client" }, opts)) || this;
    _this.name = "ExpiredTokenException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, ExpiredTokenException2.prototype);
    return _this;
  }
  return ExpiredTokenException2;
}(STSServiceException);
var MalformedPolicyDocumentException = function(_super) {
  __extends(MalformedPolicyDocumentException2, _super);
  function MalformedPolicyDocumentException2(opts) {
    var _this = _super.call(this, __assign({ name: "MalformedPolicyDocumentException", $fault: "client" }, opts)) || this;
    _this.name = "MalformedPolicyDocumentException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, MalformedPolicyDocumentException2.prototype);
    return _this;
  }
  return MalformedPolicyDocumentException2;
}(STSServiceException);
var PackedPolicyTooLargeException = function(_super) {
  __extends(PackedPolicyTooLargeException2, _super);
  function PackedPolicyTooLargeException2(opts) {
    var _this = _super.call(this, __assign({ name: "PackedPolicyTooLargeException", $fault: "client" }, opts)) || this;
    _this.name = "PackedPolicyTooLargeException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, PackedPolicyTooLargeException2.prototype);
    return _this;
  }
  return PackedPolicyTooLargeException2;
}(STSServiceException);
var RegionDisabledException = function(_super) {
  __extends(RegionDisabledException2, _super);
  function RegionDisabledException2(opts) {
    var _this = _super.call(this, __assign({ name: "RegionDisabledException", $fault: "client" }, opts)) || this;
    _this.name = "RegionDisabledException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, RegionDisabledException2.prototype);
    return _this;
  }
  return RegionDisabledException2;
}(STSServiceException);
var IDPRejectedClaimException = function(_super) {
  __extends(IDPRejectedClaimException2, _super);
  function IDPRejectedClaimException2(opts) {
    var _this = _super.call(this, __assign({ name: "IDPRejectedClaimException", $fault: "client" }, opts)) || this;
    _this.name = "IDPRejectedClaimException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, IDPRejectedClaimException2.prototype);
    return _this;
  }
  return IDPRejectedClaimException2;
}(STSServiceException);
var InvalidIdentityTokenException = function(_super) {
  __extends(InvalidIdentityTokenException2, _super);
  function InvalidIdentityTokenException2(opts) {
    var _this = _super.call(this, __assign({ name: "InvalidIdentityTokenException", $fault: "client" }, opts)) || this;
    _this.name = "InvalidIdentityTokenException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, InvalidIdentityTokenException2.prototype);
    return _this;
  }
  return InvalidIdentityTokenException2;
}(STSServiceException);
var IDPCommunicationErrorException = function(_super) {
  __extends(IDPCommunicationErrorException2, _super);
  function IDPCommunicationErrorException2(opts) {
    var _this = _super.call(this, __assign({ name: "IDPCommunicationErrorException", $fault: "client" }, opts)) || this;
    _this.name = "IDPCommunicationErrorException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, IDPCommunicationErrorException2.prototype);
    return _this;
  }
  return IDPCommunicationErrorException2;
}(STSServiceException);
var InvalidAuthorizationMessageException = function(_super) {
  __extends(InvalidAuthorizationMessageException2, _super);
  function InvalidAuthorizationMessageException2(opts) {
    var _this = _super.call(this, __assign({ name: "InvalidAuthorizationMessageException", $fault: "client" }, opts)) || this;
    _this.name = "InvalidAuthorizationMessageException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, InvalidAuthorizationMessageException2.prototype);
    return _this;
  }
  return InvalidAuthorizationMessageException2;
}(STSServiceException);
var AssumeRoleRequestFilterSensitiveLog = function(obj) {
  return __assign({}, obj);
};
var AssumeRoleResponseFilterSensitiveLog = function(obj) {
  return __assign({}, obj);
};
var AssumeRoleWithWebIdentityRequestFilterSensitiveLog = function(obj) {
  return __assign({}, obj);
};
var AssumeRoleWithWebIdentityResponseFilterSensitiveLog = function(obj) {
  return __assign({}, obj);
};

// node_modules/@aws-sdk/client-sts/dist-es/protocols/Aws_query.js
var import_entities = __toESM(require_lib());
var import_fast_xml_parser = __toESM(require_parser());
var serializeAws_queryAssumeRoleCommand = function(input, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var headers, body;
    return __generator(this, function(_a) {
      headers = {
        "content-type": "application/x-www-form-urlencoded"
      };
      body = buildFormUrlencodedString(__assign(__assign({}, serializeAws_queryAssumeRoleRequest(input, context)), { Action: "AssumeRole", Version: "2011-06-15" }));
      return [2, buildHttpRpcRequest2(context, headers, "/", void 0, body)];
    });
  });
};
var serializeAws_queryAssumeRoleWithWebIdentityCommand = function(input, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var headers, body;
    return __generator(this, function(_a) {
      headers = {
        "content-type": "application/x-www-form-urlencoded"
      };
      body = buildFormUrlencodedString(__assign(__assign({}, serializeAws_queryAssumeRoleWithWebIdentityRequest(input, context)), { Action: "AssumeRoleWithWebIdentity", Version: "2011-06-15" }));
      return [2, buildHttpRpcRequest2(context, headers, "/", void 0, body)];
    });
  });
};
var deserializeAws_queryAssumeRoleCommand = function(output, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var data, contents, response;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (output.statusCode >= 300) {
            return [2, deserializeAws_queryAssumeRoleCommandError(output, context)];
          }
          return [4, parseBody3(output.body, context)];
        case 1:
          data = _a.sent();
          contents = {};
          contents = deserializeAws_queryAssumeRoleResponse(data.AssumeRoleResult, context);
          response = __assign({ $metadata: deserializeMetadata3(output) }, contents);
          return [2, Promise.resolve(response)];
      }
    });
  });
};
var deserializeAws_queryAssumeRoleCommandError = function(output, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var parsedOutput, _a, errorCode, _b, parsedBody;
    var _c;
    return __generator(this, function(_d) {
      switch (_d.label) {
        case 0:
          _a = [__assign({}, output)];
          _c = {};
          return [4, parseErrorBody2(output.body, context)];
        case 1:
          parsedOutput = __assign.apply(void 0, _a.concat([(_c.body = _d.sent(), _c)]));
          errorCode = loadQueryErrorCode(output, parsedOutput.body);
          _b = errorCode;
          switch (_b) {
            case "ExpiredTokenException":
              return [3, 2];
            case "com.amazonaws.sts#ExpiredTokenException":
              return [3, 2];
            case "MalformedPolicyDocument":
              return [3, 4];
            case "com.amazonaws.sts#MalformedPolicyDocumentException":
              return [3, 4];
            case "PackedPolicyTooLarge":
              return [3, 6];
            case "com.amazonaws.sts#PackedPolicyTooLargeException":
              return [3, 6];
            case "RegionDisabledException":
              return [3, 8];
            case "com.amazonaws.sts#RegionDisabledException":
              return [3, 8];
          }
          return [3, 10];
        case 2:
          return [4, deserializeAws_queryExpiredTokenExceptionResponse(parsedOutput, context)];
        case 3:
          throw _d.sent();
        case 4:
          return [4, deserializeAws_queryMalformedPolicyDocumentExceptionResponse(parsedOutput, context)];
        case 5:
          throw _d.sent();
        case 6:
          return [4, deserializeAws_queryPackedPolicyTooLargeExceptionResponse(parsedOutput, context)];
        case 7:
          throw _d.sent();
        case 8:
          return [4, deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context)];
        case 9:
          throw _d.sent();
        case 10:
          parsedBody = parsedOutput.body;
          throwDefaultError({
            output,
            parsedBody: parsedBody.Error,
            exceptionCtor: STSServiceException,
            errorCode
          });
          _d.label = 11;
        case 11:
          return [2];
      }
    });
  });
};
var deserializeAws_queryAssumeRoleWithWebIdentityCommand = function(output, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var data, contents, response;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (output.statusCode >= 300) {
            return [2, deserializeAws_queryAssumeRoleWithWebIdentityCommandError(output, context)];
          }
          return [4, parseBody3(output.body, context)];
        case 1:
          data = _a.sent();
          contents = {};
          contents = deserializeAws_queryAssumeRoleWithWebIdentityResponse(data.AssumeRoleWithWebIdentityResult, context);
          response = __assign({ $metadata: deserializeMetadata3(output) }, contents);
          return [2, Promise.resolve(response)];
      }
    });
  });
};
var deserializeAws_queryAssumeRoleWithWebIdentityCommandError = function(output, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var parsedOutput, _a, errorCode, _b, parsedBody;
    var _c;
    return __generator(this, function(_d) {
      switch (_d.label) {
        case 0:
          _a = [__assign({}, output)];
          _c = {};
          return [4, parseErrorBody2(output.body, context)];
        case 1:
          parsedOutput = __assign.apply(void 0, _a.concat([(_c.body = _d.sent(), _c)]));
          errorCode = loadQueryErrorCode(output, parsedOutput.body);
          _b = errorCode;
          switch (_b) {
            case "ExpiredTokenException":
              return [3, 2];
            case "com.amazonaws.sts#ExpiredTokenException":
              return [3, 2];
            case "IDPCommunicationError":
              return [3, 4];
            case "com.amazonaws.sts#IDPCommunicationErrorException":
              return [3, 4];
            case "IDPRejectedClaim":
              return [3, 6];
            case "com.amazonaws.sts#IDPRejectedClaimException":
              return [3, 6];
            case "InvalidIdentityToken":
              return [3, 8];
            case "com.amazonaws.sts#InvalidIdentityTokenException":
              return [3, 8];
            case "MalformedPolicyDocument":
              return [3, 10];
            case "com.amazonaws.sts#MalformedPolicyDocumentException":
              return [3, 10];
            case "PackedPolicyTooLarge":
              return [3, 12];
            case "com.amazonaws.sts#PackedPolicyTooLargeException":
              return [3, 12];
            case "RegionDisabledException":
              return [3, 14];
            case "com.amazonaws.sts#RegionDisabledException":
              return [3, 14];
          }
          return [3, 16];
        case 2:
          return [4, deserializeAws_queryExpiredTokenExceptionResponse(parsedOutput, context)];
        case 3:
          throw _d.sent();
        case 4:
          return [4, deserializeAws_queryIDPCommunicationErrorExceptionResponse(parsedOutput, context)];
        case 5:
          throw _d.sent();
        case 6:
          return [4, deserializeAws_queryIDPRejectedClaimExceptionResponse(parsedOutput, context)];
        case 7:
          throw _d.sent();
        case 8:
          return [4, deserializeAws_queryInvalidIdentityTokenExceptionResponse(parsedOutput, context)];
        case 9:
          throw _d.sent();
        case 10:
          return [4, deserializeAws_queryMalformedPolicyDocumentExceptionResponse(parsedOutput, context)];
        case 11:
          throw _d.sent();
        case 12:
          return [4, deserializeAws_queryPackedPolicyTooLargeExceptionResponse(parsedOutput, context)];
        case 13:
          throw _d.sent();
        case 14:
          return [4, deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context)];
        case 15:
          throw _d.sent();
        case 16:
          parsedBody = parsedOutput.body;
          throwDefaultError({
            output,
            parsedBody: parsedBody.Error,
            exceptionCtor: STSServiceException,
            errorCode
          });
          _d.label = 17;
        case 17:
          return [2];
      }
    });
  });
};
var deserializeAws_queryExpiredTokenExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_queryExpiredTokenException(body.Error, context);
      exception = new ExpiredTokenException(__assign({ $metadata: deserializeMetadata3(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_queryIDPCommunicationErrorExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_queryIDPCommunicationErrorException(body.Error, context);
      exception = new IDPCommunicationErrorException(__assign({ $metadata: deserializeMetadata3(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_queryIDPRejectedClaimExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_queryIDPRejectedClaimException(body.Error, context);
      exception = new IDPRejectedClaimException(__assign({ $metadata: deserializeMetadata3(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_queryInvalidIdentityTokenExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_queryInvalidIdentityTokenException(body.Error, context);
      exception = new InvalidIdentityTokenException(__assign({ $metadata: deserializeMetadata3(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_queryMalformedPolicyDocumentExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_queryMalformedPolicyDocumentException(body.Error, context);
      exception = new MalformedPolicyDocumentException(__assign({ $metadata: deserializeMetadata3(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_queryPackedPolicyTooLargeExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_queryPackedPolicyTooLargeException(body.Error, context);
      exception = new PackedPolicyTooLargeException(__assign({ $metadata: deserializeMetadata3(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var deserializeAws_queryRegionDisabledExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var body, deserialized, exception;
    return __generator(this, function(_a) {
      body = parsedOutput.body;
      deserialized = deserializeAws_queryRegionDisabledException(body.Error, context);
      exception = new RegionDisabledException(__assign({ $metadata: deserializeMetadata3(parsedOutput) }, deserialized));
      return [2, decorateServiceException(exception, body)];
    });
  });
};
var serializeAws_queryAssumeRoleRequest = function(input, context) {
  var entries2 = {};
  if (input.RoleArn != null) {
    entries2["RoleArn"] = input.RoleArn;
  }
  if (input.RoleSessionName != null) {
    entries2["RoleSessionName"] = input.RoleSessionName;
  }
  if (input.PolicyArns != null) {
    var memberEntries = serializeAws_querypolicyDescriptorListType(input.PolicyArns, context);
    Object.entries(memberEntries).forEach(function(_a) {
      var _b = __read(_a, 2), key = _b[0], value = _b[1];
      var loc = "PolicyArns.".concat(key);
      entries2[loc] = value;
    });
  }
  if (input.Policy != null) {
    entries2["Policy"] = input.Policy;
  }
  if (input.DurationSeconds != null) {
    entries2["DurationSeconds"] = input.DurationSeconds;
  }
  if (input.Tags != null) {
    var memberEntries = serializeAws_querytagListType(input.Tags, context);
    Object.entries(memberEntries).forEach(function(_a) {
      var _b = __read(_a, 2), key = _b[0], value = _b[1];
      var loc = "Tags.".concat(key);
      entries2[loc] = value;
    });
  }
  if (input.TransitiveTagKeys != null) {
    var memberEntries = serializeAws_querytagKeyListType(input.TransitiveTagKeys, context);
    Object.entries(memberEntries).forEach(function(_a) {
      var _b = __read(_a, 2), key = _b[0], value = _b[1];
      var loc = "TransitiveTagKeys.".concat(key);
      entries2[loc] = value;
    });
  }
  if (input.ExternalId != null) {
    entries2["ExternalId"] = input.ExternalId;
  }
  if (input.SerialNumber != null) {
    entries2["SerialNumber"] = input.SerialNumber;
  }
  if (input.TokenCode != null) {
    entries2["TokenCode"] = input.TokenCode;
  }
  if (input.SourceIdentity != null) {
    entries2["SourceIdentity"] = input.SourceIdentity;
  }
  return entries2;
};
var serializeAws_queryAssumeRoleWithWebIdentityRequest = function(input, context) {
  var entries2 = {};
  if (input.RoleArn != null) {
    entries2["RoleArn"] = input.RoleArn;
  }
  if (input.RoleSessionName != null) {
    entries2["RoleSessionName"] = input.RoleSessionName;
  }
  if (input.WebIdentityToken != null) {
    entries2["WebIdentityToken"] = input.WebIdentityToken;
  }
  if (input.ProviderId != null) {
    entries2["ProviderId"] = input.ProviderId;
  }
  if (input.PolicyArns != null) {
    var memberEntries = serializeAws_querypolicyDescriptorListType(input.PolicyArns, context);
    Object.entries(memberEntries).forEach(function(_a) {
      var _b = __read(_a, 2), key = _b[0], value = _b[1];
      var loc = "PolicyArns.".concat(key);
      entries2[loc] = value;
    });
  }
  if (input.Policy != null) {
    entries2["Policy"] = input.Policy;
  }
  if (input.DurationSeconds != null) {
    entries2["DurationSeconds"] = input.DurationSeconds;
  }
  return entries2;
};
var serializeAws_querypolicyDescriptorListType = function(input, context) {
  var e_1, _a;
  var entries2 = {};
  var counter = 1;
  try {
    for (var input_1 = __values(input), input_1_1 = input_1.next(); !input_1_1.done; input_1_1 = input_1.next()) {
      var entry = input_1_1.value;
      if (entry === null) {
        continue;
      }
      var memberEntries = serializeAws_queryPolicyDescriptorType(entry, context);
      Object.entries(memberEntries).forEach(function(_a2) {
        var _b = __read(_a2, 2), key = _b[0], value = _b[1];
        entries2["member.".concat(counter, ".").concat(key)] = value;
      });
      counter++;
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (input_1_1 && !input_1_1.done && (_a = input_1.return))
        _a.call(input_1);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return entries2;
};
var serializeAws_queryPolicyDescriptorType = function(input, context) {
  var entries2 = {};
  if (input.arn != null) {
    entries2["arn"] = input.arn;
  }
  return entries2;
};
var serializeAws_queryTag = function(input, context) {
  var entries2 = {};
  if (input.Key != null) {
    entries2["Key"] = input.Key;
  }
  if (input.Value != null) {
    entries2["Value"] = input.Value;
  }
  return entries2;
};
var serializeAws_querytagKeyListType = function(input, context) {
  var e_2, _a;
  var entries2 = {};
  var counter = 1;
  try {
    for (var input_2 = __values(input), input_2_1 = input_2.next(); !input_2_1.done; input_2_1 = input_2.next()) {
      var entry = input_2_1.value;
      if (entry === null) {
        continue;
      }
      entries2["member.".concat(counter)] = entry;
      counter++;
    }
  } catch (e_2_1) {
    e_2 = { error: e_2_1 };
  } finally {
    try {
      if (input_2_1 && !input_2_1.done && (_a = input_2.return))
        _a.call(input_2);
    } finally {
      if (e_2)
        throw e_2.error;
    }
  }
  return entries2;
};
var serializeAws_querytagListType = function(input, context) {
  var e_3, _a;
  var entries2 = {};
  var counter = 1;
  try {
    for (var input_3 = __values(input), input_3_1 = input_3.next(); !input_3_1.done; input_3_1 = input_3.next()) {
      var entry = input_3_1.value;
      if (entry === null) {
        continue;
      }
      var memberEntries = serializeAws_queryTag(entry, context);
      Object.entries(memberEntries).forEach(function(_a2) {
        var _b = __read(_a2, 2), key = _b[0], value = _b[1];
        entries2["member.".concat(counter, ".").concat(key)] = value;
      });
      counter++;
    }
  } catch (e_3_1) {
    e_3 = { error: e_3_1 };
  } finally {
    try {
      if (input_3_1 && !input_3_1.done && (_a = input_3.return))
        _a.call(input_3);
    } finally {
      if (e_3)
        throw e_3.error;
    }
  }
  return entries2;
};
var deserializeAws_queryAssumedRoleUser = function(output, context) {
  var contents = {
    AssumedRoleId: void 0,
    Arn: void 0
  };
  if (output["AssumedRoleId"] !== void 0) {
    contents.AssumedRoleId = expectString(output["AssumedRoleId"]);
  }
  if (output["Arn"] !== void 0) {
    contents.Arn = expectString(output["Arn"]);
  }
  return contents;
};
var deserializeAws_queryAssumeRoleResponse = function(output, context) {
  var contents = {
    Credentials: void 0,
    AssumedRoleUser: void 0,
    PackedPolicySize: void 0,
    SourceIdentity: void 0
  };
  if (output["Credentials"] !== void 0) {
    contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
  }
  if (output["AssumedRoleUser"] !== void 0) {
    contents.AssumedRoleUser = deserializeAws_queryAssumedRoleUser(output["AssumedRoleUser"], context);
  }
  if (output["PackedPolicySize"] !== void 0) {
    contents.PackedPolicySize = strictParseInt32(output["PackedPolicySize"]);
  }
  if (output["SourceIdentity"] !== void 0) {
    contents.SourceIdentity = expectString(output["SourceIdentity"]);
  }
  return contents;
};
var deserializeAws_queryAssumeRoleWithWebIdentityResponse = function(output, context) {
  var contents = {
    Credentials: void 0,
    SubjectFromWebIdentityToken: void 0,
    AssumedRoleUser: void 0,
    PackedPolicySize: void 0,
    Provider: void 0,
    Audience: void 0,
    SourceIdentity: void 0
  };
  if (output["Credentials"] !== void 0) {
    contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
  }
  if (output["SubjectFromWebIdentityToken"] !== void 0) {
    contents.SubjectFromWebIdentityToken = expectString(output["SubjectFromWebIdentityToken"]);
  }
  if (output["AssumedRoleUser"] !== void 0) {
    contents.AssumedRoleUser = deserializeAws_queryAssumedRoleUser(output["AssumedRoleUser"], context);
  }
  if (output["PackedPolicySize"] !== void 0) {
    contents.PackedPolicySize = strictParseInt32(output["PackedPolicySize"]);
  }
  if (output["Provider"] !== void 0) {
    contents.Provider = expectString(output["Provider"]);
  }
  if (output["Audience"] !== void 0) {
    contents.Audience = expectString(output["Audience"]);
  }
  if (output["SourceIdentity"] !== void 0) {
    contents.SourceIdentity = expectString(output["SourceIdentity"]);
  }
  return contents;
};
var deserializeAws_queryCredentials = function(output, context) {
  var contents = {
    AccessKeyId: void 0,
    SecretAccessKey: void 0,
    SessionToken: void 0,
    Expiration: void 0
  };
  if (output["AccessKeyId"] !== void 0) {
    contents.AccessKeyId = expectString(output["AccessKeyId"]);
  }
  if (output["SecretAccessKey"] !== void 0) {
    contents.SecretAccessKey = expectString(output["SecretAccessKey"]);
  }
  if (output["SessionToken"] !== void 0) {
    contents.SessionToken = expectString(output["SessionToken"]);
  }
  if (output["Expiration"] !== void 0) {
    contents.Expiration = expectNonNull(parseRfc3339DateTime(output["Expiration"]));
  }
  return contents;
};
var deserializeAws_queryExpiredTokenException = function(output, context) {
  var contents = {
    message: void 0
  };
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var deserializeAws_queryIDPCommunicationErrorException = function(output, context) {
  var contents = {
    message: void 0
  };
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var deserializeAws_queryIDPRejectedClaimException = function(output, context) {
  var contents = {
    message: void 0
  };
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var deserializeAws_queryInvalidIdentityTokenException = function(output, context) {
  var contents = {
    message: void 0
  };
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var deserializeAws_queryMalformedPolicyDocumentException = function(output, context) {
  var contents = {
    message: void 0
  };
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var deserializeAws_queryPackedPolicyTooLargeException = function(output, context) {
  var contents = {
    message: void 0
  };
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var deserializeAws_queryRegionDisabledException = function(output, context) {
  var contents = {
    message: void 0
  };
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var deserializeMetadata3 = function(output) {
  var _a, _b;
  return {
    httpStatusCode: output.statusCode,
    requestId: (_b = (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"]) !== null && _b !== void 0 ? _b : output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"]
  };
};
var collectBody2 = function(streamBody, context) {
  if (streamBody === void 0) {
    streamBody = new Uint8Array();
  }
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
var collectBodyString2 = function(streamBody, context) {
  return collectBody2(streamBody, context).then(function(body) {
    return context.utf8Encoder(body);
  });
};
var buildHttpRpcRequest2 = function(context, headers, path, resolvedHostname, body) {
  return __awaiter(void 0, void 0, void 0, function() {
    var _a, hostname, _b, protocol, port, basePath, contents;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          return [4, context.endpoint()];
        case 1:
          _a = _c.sent(), hostname = _a.hostname, _b = _a.protocol, protocol = _b === void 0 ? "https" : _b, port = _a.port, basePath = _a.path;
          contents = {
            protocol,
            hostname,
            port,
            method: "POST",
            path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
            headers
          };
          if (resolvedHostname !== void 0) {
            contents.hostname = resolvedHostname;
          }
          if (body !== void 0) {
            contents.body = body;
          }
          return [2, new HttpRequest(contents)];
      }
    });
  });
};
var parseBody3 = function(streamBody, context) {
  return collectBodyString2(streamBody, context).then(function(encoded) {
    if (encoded.length) {
      var parsedObj = (0, import_fast_xml_parser.parse)(encoded, {
        attributeNamePrefix: "",
        ignoreAttributes: false,
        parseNodeValue: false,
        trimValues: false,
        tagValueProcessor: function(val) {
          return val.trim() === "" && val.includes("\n") ? "" : (0, import_entities.decodeHTML)(val);
        }
      });
      var textNodeName = "#text";
      var key = Object.keys(parsedObj)[0];
      var parsedObjToReturn = parsedObj[key];
      if (parsedObjToReturn[textNodeName]) {
        parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
        delete parsedObjToReturn[textNodeName];
      }
      return getValueFromTextNode(parsedObjToReturn);
    }
    return {};
  });
};
var parseErrorBody2 = function(errorBody, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var value;
    var _a;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          return [4, parseBody3(errorBody, context)];
        case 1:
          value = _b.sent();
          if (value.Error) {
            value.Error.message = (_a = value.Error.message) !== null && _a !== void 0 ? _a : value.Error.Message;
          }
          return [2, value];
      }
    });
  });
};
var buildFormUrlencodedString = function(formEntries) {
  return Object.entries(formEntries).map(function(_a) {
    var _b = __read(_a, 2), key = _b[0], value = _b[1];
    return extendedEncodeURIComponent(key) + "=" + extendedEncodeURIComponent(value);
  }).join("&");
};
var loadQueryErrorCode = function(output, data) {
  if (data.Error.Code !== void 0) {
    return data.Error.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
};

// node_modules/@aws-sdk/client-sts/dist-es/commands/AssumeRoleCommand.js
var AssumeRoleCommand = function(_super) {
  __extends(AssumeRoleCommand2, _super);
  function AssumeRoleCommand2(input) {
    var _this = _super.call(this) || this;
    _this.input = input;
    return _this;
  }
  AssumeRoleCommand2.prototype.resolveMiddleware = function(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getAwsAuthPlugin(configuration));
    var stack = clientStack.concat(this.middlewareStack);
    var logger3 = configuration.logger;
    var clientName = "STSClient";
    var commandName = "AssumeRoleCommand";
    var handlerExecutionContext = {
      logger: logger3,
      clientName,
      commandName,
      inputFilterSensitiveLog: AssumeRoleRequestFilterSensitiveLog,
      outputFilterSensitiveLog: AssumeRoleResponseFilterSensitiveLog
    };
    var requestHandler = configuration.requestHandler;
    return stack.resolve(function(request2) {
      return requestHandler.handle(request2.request, options || {});
    }, handlerExecutionContext);
  };
  AssumeRoleCommand2.prototype.serialize = function(input, context) {
    return serializeAws_queryAssumeRoleCommand(input, context);
  };
  AssumeRoleCommand2.prototype.deserialize = function(output, context) {
    return deserializeAws_queryAssumeRoleCommand(output, context);
  };
  return AssumeRoleCommand2;
}(Command);

// node_modules/@aws-sdk/client-sts/dist-es/commands/AssumeRoleWithWebIdentityCommand.js
var AssumeRoleWithWebIdentityCommand = function(_super) {
  __extends(AssumeRoleWithWebIdentityCommand2, _super);
  function AssumeRoleWithWebIdentityCommand2(input) {
    var _this = _super.call(this) || this;
    _this.input = input;
    return _this;
  }
  AssumeRoleWithWebIdentityCommand2.prototype.resolveMiddleware = function(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    var stack = clientStack.concat(this.middlewareStack);
    var logger3 = configuration.logger;
    var clientName = "STSClient";
    var commandName = "AssumeRoleWithWebIdentityCommand";
    var handlerExecutionContext = {
      logger: logger3,
      clientName,
      commandName,
      inputFilterSensitiveLog: AssumeRoleWithWebIdentityRequestFilterSensitiveLog,
      outputFilterSensitiveLog: AssumeRoleWithWebIdentityResponseFilterSensitiveLog
    };
    var requestHandler = configuration.requestHandler;
    return stack.resolve(function(request2) {
      return requestHandler.handle(request2.request, options || {});
    }, handlerExecutionContext);
  };
  AssumeRoleWithWebIdentityCommand2.prototype.serialize = function(input, context) {
    return serializeAws_queryAssumeRoleWithWebIdentityCommand(input, context);
  };
  AssumeRoleWithWebIdentityCommand2.prototype.deserialize = function(output, context) {
    return deserializeAws_queryAssumeRoleWithWebIdentityCommand(output, context);
  };
  return AssumeRoleWithWebIdentityCommand2;
}(Command);

// node_modules/@aws-sdk/middleware-sdk-sts/dist-es/index.js
var resolveStsAuthConfig = function(input, _a) {
  var stsClientCtor = _a.stsClientCtor;
  return resolveAwsAuthConfig(__assign(__assign({}, input), { stsClientCtor }));
};

// node_modules/@aws-sdk/client-sts/package.json
var package_default3 = {
  name: "@aws-sdk/client-sts",
  description: "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native",
  version: "3.186.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    test: "yarn test:unit",
    "test:unit": "jest"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "2.0.0",
    "@aws-crypto/sha256-js": "2.0.0",
    "@aws-sdk/config-resolver": "3.186.0",
    "@aws-sdk/credential-provider-node": "3.186.0",
    "@aws-sdk/fetch-http-handler": "3.186.0",
    "@aws-sdk/hash-node": "3.186.0",
    "@aws-sdk/invalid-dependency": "3.186.0",
    "@aws-sdk/middleware-content-length": "3.186.0",
    "@aws-sdk/middleware-host-header": "3.186.0",
    "@aws-sdk/middleware-logger": "3.186.0",
    "@aws-sdk/middleware-recursion-detection": "3.186.0",
    "@aws-sdk/middleware-retry": "3.186.0",
    "@aws-sdk/middleware-sdk-sts": "3.186.0",
    "@aws-sdk/middleware-serde": "3.186.0",
    "@aws-sdk/middleware-signing": "3.186.0",
    "@aws-sdk/middleware-stack": "3.186.0",
    "@aws-sdk/middleware-user-agent": "3.186.0",
    "@aws-sdk/node-config-provider": "3.186.0",
    "@aws-sdk/node-http-handler": "3.186.0",
    "@aws-sdk/protocol-http": "3.186.0",
    "@aws-sdk/smithy-client": "3.186.0",
    "@aws-sdk/types": "3.186.0",
    "@aws-sdk/url-parser": "3.186.0",
    "@aws-sdk/util-base64-browser": "3.186.0",
    "@aws-sdk/util-base64-node": "3.186.0",
    "@aws-sdk/util-body-length-browser": "3.186.0",
    "@aws-sdk/util-body-length-node": "3.186.0",
    "@aws-sdk/util-defaults-mode-browser": "3.186.0",
    "@aws-sdk/util-defaults-mode-node": "3.186.0",
    "@aws-sdk/util-user-agent-browser": "3.186.0",
    "@aws-sdk/util-user-agent-node": "3.186.0",
    "@aws-sdk/util-utf8-browser": "3.186.0",
    "@aws-sdk/util-utf8-node": "3.186.0",
    entities: "2.2.0",
    "fast-xml-parser": "3.19.0",
    tslib: "^2.3.1"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.186.0",
    "@tsconfig/recommended": "1.0.1",
    "@types/node": "^12.7.5",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.19.2",
    typescript: "~4.6.2"
  },
  overrides: {
    typedoc: {
      typescript: "~4.6.2"
    }
  },
  engines: {
    node: ">=12.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sts"
  }
};

// node_modules/@aws-sdk/client-sts/dist-es/defaultStsRoleAssumers.js
var ASSUME_ROLE_DEFAULT_REGION = "us-east-1";
var decorateDefaultRegion = function(region) {
  if (typeof region !== "function") {
    return region === void 0 ? ASSUME_ROLE_DEFAULT_REGION : region;
  }
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var e_1;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [4, region()];
          case 1:
            return [2, _a.sent()];
          case 2:
            e_1 = _a.sent();
            return [2, ASSUME_ROLE_DEFAULT_REGION];
          case 3:
            return [2];
        }
      });
    });
  };
};
var getDefaultRoleAssumer = function(stsOptions, stsClientCtor) {
  var stsClient;
  var closureSourceCreds;
  return function(sourceCreds, params) {
    return __awaiter(void 0, void 0, void 0, function() {
      var logger3, region, requestHandler, Credentials;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            closureSourceCreds = sourceCreds;
            if (!stsClient) {
              logger3 = stsOptions.logger, region = stsOptions.region, requestHandler = stsOptions.requestHandler;
              stsClient = new stsClientCtor(__assign({ logger: logger3, credentialDefaultProvider: function() {
                return function() {
                  return __awaiter(void 0, void 0, void 0, function() {
                    return __generator(this, function(_a2) {
                      return [2, closureSourceCreds];
                    });
                  });
                };
              }, region: decorateDefaultRegion(region || stsOptions.region) }, requestHandler ? { requestHandler } : {}));
            }
            return [4, stsClient.send(new AssumeRoleCommand(params))];
          case 1:
            Credentials = _a.sent().Credentials;
            if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
              throw new Error("Invalid response from STS.assumeRole call with role ".concat(params.RoleArn));
            }
            return [2, {
              accessKeyId: Credentials.AccessKeyId,
              secretAccessKey: Credentials.SecretAccessKey,
              sessionToken: Credentials.SessionToken,
              expiration: Credentials.Expiration
            }];
        }
      });
    });
  };
};
var getDefaultRoleAssumerWithWebIdentity = function(stsOptions, stsClientCtor) {
  var stsClient;
  return function(params) {
    return __awaiter(void 0, void 0, void 0, function() {
      var logger3, region, requestHandler, Credentials;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!stsClient) {
              logger3 = stsOptions.logger, region = stsOptions.region, requestHandler = stsOptions.requestHandler;
              stsClient = new stsClientCtor(__assign({ logger: logger3, region: decorateDefaultRegion(region || stsOptions.region) }, requestHandler ? { requestHandler } : {}));
            }
            return [4, stsClient.send(new AssumeRoleWithWebIdentityCommand(params))];
          case 1:
            Credentials = _a.sent().Credentials;
            if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
              throw new Error("Invalid response from STS.assumeRoleWithWebIdentity call with role ".concat(params.RoleArn));
            }
            return [2, {
              accessKeyId: Credentials.AccessKeyId,
              secretAccessKey: Credentials.SecretAccessKey,
              sessionToken: Credentials.SessionToken,
              expiration: Credentials.Expiration
            }];
        }
      });
    });
  };
};
var decorateDefaultCredentialProvider = function(provider) {
  return function(input) {
    return provider(__assign({ roleAssumer: getDefaultRoleAssumer(input, input.stsClientCtor), roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity(input, input.stsClientCtor) }, input));
  };
};

// node_modules/@aws-sdk/credential-provider-env/dist-es/fromEnv.js
var ENV_KEY = "AWS_ACCESS_KEY_ID";
var ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
var ENV_SESSION = "AWS_SESSION_TOKEN";
var ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
var fromEnv = function() {
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var accessKeyId, secretAccessKey, sessionToken, expiry;
      return __generator(this, function(_a) {
        accessKeyId = process.env[ENV_KEY];
        secretAccessKey = process.env[ENV_SECRET];
        sessionToken = process.env[ENV_SESSION];
        expiry = process.env[ENV_EXPIRATION];
        if (accessKeyId && secretAccessKey) {
          return [2, __assign(__assign({ accessKeyId, secretAccessKey }, sessionToken && { sessionToken }), expiry && { expiration: new Date(expiry) })];
        }
        throw new CredentialsProviderError("Unable to find environment variable credentials.");
      });
    });
  };
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getHomeDir.js
var import_os = require("os");
var import_path = require("path");
var getHomeDir = function() {
  var _a = process.env, HOME = _a.HOME, USERPROFILE = _a.USERPROFILE, HOMEPATH = _a.HOMEPATH, _b = _a.HOMEDRIVE, HOMEDRIVE = _b === void 0 ? "C:".concat(import_path.sep) : _b;
  if (HOME)
    return HOME;
  if (USERPROFILE)
    return USERPROFILE;
  if (HOMEPATH)
    return "".concat(HOMEDRIVE).concat(HOMEPATH);
  return (0, import_os.homedir)();
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getProfileName.js
var ENV_PROFILE = "AWS_PROFILE";
var DEFAULT_PROFILE = "default";
var getProfileName = function(init2) {
  return init2.profile || process.env[ENV_PROFILE] || DEFAULT_PROFILE;
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getSSOTokenFilepath.js
var import_crypto = require("crypto");
var import_path2 = require("path");
var getSSOTokenFilepath = function(ssoStartUrl) {
  var hasher = (0, import_crypto.createHash)("sha1");
  var cacheName = hasher.update(ssoStartUrl).digest("hex");
  return (0, import_path2.join)(getHomeDir(), ".aws", "sso", "cache", "".concat(cacheName, ".json"));
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getSSOTokenFromFile.js
var import_fs = require("fs");
var readFile = import_fs.promises.readFile;
var getSSOTokenFromFile = function(ssoStartUrl) {
  return __awaiter(void 0, void 0, void 0, function() {
    var ssoTokenFilepath, ssoTokenText;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          ssoTokenFilepath = getSSOTokenFilepath(ssoStartUrl);
          return [4, readFile(ssoTokenFilepath, "utf8")];
        case 1:
          ssoTokenText = _a.sent();
          return [2, JSON.parse(ssoTokenText)];
      }
    });
  });
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getConfigFilepath.js
var import_path3 = require("path");
var ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
var getConfigFilepath = function() {
  return process.env[ENV_CONFIG_PATH] || (0, import_path3.join)(getHomeDir(), ".aws", "config");
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getCredentialsFilepath.js
var import_path4 = require("path");
var ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
var getCredentialsFilepath = function() {
  return process.env[ENV_CREDENTIALS_PATH] || (0, import_path4.join)(getHomeDir(), ".aws", "credentials");
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/getProfileData.js
var profileKeyRegex = /^profile\s(["'])?([^\1]+)\1$/;
var getProfileData = function(data) {
  return Object.entries(data).filter(function(_a) {
    var _b = __read(_a, 1), key = _b[0];
    return profileKeyRegex.test(key);
  }).reduce(function(acc, _a) {
    var _b;
    var _c = __read(_a, 2), key = _c[0], value = _c[1];
    return __assign(__assign({}, acc), (_b = {}, _b[profileKeyRegex.exec(key)[2]] = value, _b));
  }, __assign({}, data.default && { default: data.default }));
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/parseIni.js
var profileNameBlockList = ["__proto__", "profile __proto__"];
var parseIni = function(iniData) {
  var e_1, _a;
  var map4 = {};
  var currentSection;
  try {
    for (var _b = __values(iniData.split(/\r?\n/)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var line = _c.value;
      line = line.split(/(^|\s)[;#]/)[0].trim();
      var isSection = line[0] === "[" && line[line.length - 1] === "]";
      if (isSection) {
        currentSection = line.substring(1, line.length - 1);
        if (profileNameBlockList.includes(currentSection)) {
          throw new Error('Found invalid profile name "'.concat(currentSection, '"'));
        }
      } else if (currentSection) {
        var indexOfEqualsSign = line.indexOf("=");
        var start = 0;
        var end = line.length - 1;
        var isAssignment = indexOfEqualsSign !== -1 && indexOfEqualsSign !== start && indexOfEqualsSign !== end;
        if (isAssignment) {
          var _d = __read([
            line.substring(0, indexOfEqualsSign).trim(),
            line.substring(indexOfEqualsSign + 1).trim()
          ], 2), name_1 = _d[0], value = _d[1];
          map4[currentSection] = map4[currentSection] || {};
          map4[currentSection][name_1] = value;
        }
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return))
        _a.call(_b);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return map4;
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/slurpFile.js
var import_fs2 = require("fs");
var readFile2 = import_fs2.promises.readFile;
var filePromisesHash = {};
var slurpFile = function(path) {
  if (!filePromisesHash[path]) {
    filePromisesHash[path] = readFile2(path, "utf8");
  }
  return filePromisesHash[path];
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/loadSharedConfigFiles.js
var swallowError = function() {
  return {};
};
var loadSharedConfigFiles = function(init2) {
  if (init2 === void 0) {
    init2 = {};
  }
  return __awaiter(void 0, void 0, void 0, function() {
    var _a, filepath, _b, configFilepath, parsedFiles;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          _a = init2.filepath, filepath = _a === void 0 ? getCredentialsFilepath() : _a, _b = init2.configFilepath, configFilepath = _b === void 0 ? getConfigFilepath() : _b;
          return [4, Promise.all([
            slurpFile(configFilepath).then(parseIni).then(getProfileData).catch(swallowError),
            slurpFile(filepath).then(parseIni).catch(swallowError)
          ])];
        case 1:
          parsedFiles = _c.sent();
          return [2, {
            configFile: parsedFiles[0],
            credentialsFile: parsedFiles[1]
          }];
      }
    });
  });
};

// node_modules/@aws-sdk/shared-ini-file-loader/dist-es/parseKnownFiles.js
var parseKnownFiles = function(init2) {
  return __awaiter(void 0, void 0, void 0, function() {
    var parsedFiles;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          return [4, loadSharedConfigFiles(init2)];
        case 1:
          parsedFiles = _a.sent();
          return [2, __assign(__assign({}, parsedFiles.configFile), parsedFiles.credentialsFile)];
      }
    });
  });
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/fromContainerMetadata.js
var import_url2 = require("url");

// node_modules/@aws-sdk/credential-provider-imds/dist-es/remoteProvider/httpRequest.js
var import_buffer = require("buffer");
var import_http = require("http");
function httpRequest(options) {
  return new Promise(function(resolve, reject) {
    var _a;
    var req = (0, import_http.request)(__assign(__assign({ method: "GET" }, options), { hostname: (_a = options.hostname) === null || _a === void 0 ? void 0 : _a.replace(/^\[(.+)\]$/, "$1") }));
    req.on("error", function(err) {
      reject(Object.assign(new ProviderError("Unable to connect to instance metadata service"), err));
      req.destroy();
    });
    req.on("timeout", function() {
      reject(new ProviderError("TimeoutError from instance metadata service"));
      req.destroy();
    });
    req.on("response", function(res) {
      var _a2 = res.statusCode, statusCode = _a2 === void 0 ? 400 : _a2;
      if (statusCode < 200 || 300 <= statusCode) {
        reject(Object.assign(new ProviderError("Error response received from instance metadata service"), { statusCode }));
        req.destroy();
      }
      var chunks = [];
      res.on("data", function(chunk) {
        chunks.push(chunk);
      });
      res.on("end", function() {
        resolve(import_buffer.Buffer.concat(chunks));
        req.destroy();
      });
    });
    req.end();
  });
}

// node_modules/@aws-sdk/credential-provider-imds/dist-es/remoteProvider/ImdsCredentials.js
var isImdsCredentials = function(arg) {
  return Boolean(arg) && typeof arg === "object" && typeof arg.AccessKeyId === "string" && typeof arg.SecretAccessKey === "string" && typeof arg.Token === "string" && typeof arg.Expiration === "string";
};
var fromImdsCredentials = function(creds) {
  return {
    accessKeyId: creds.AccessKeyId,
    secretAccessKey: creds.SecretAccessKey,
    sessionToken: creds.Token,
    expiration: new Date(creds.Expiration)
  };
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/remoteProvider/RemoteProviderInit.js
var DEFAULT_TIMEOUT = 1e3;
var DEFAULT_MAX_RETRIES = 0;
var providerConfigFromInit = function(_a) {
  var _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT_MAX_RETRIES : _b, _c = _a.timeout, timeout = _c === void 0 ? DEFAULT_TIMEOUT : _c;
  return { maxRetries, timeout };
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/remoteProvider/retry.js
var retry = function(toRetry, maxRetries) {
  var promise = toRetry();
  for (var i = 0; i < maxRetries; i++) {
    promise = promise.catch(toRetry);
  }
  return promise;
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/fromContainerMetadata.js
var ENV_CMDS_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI";
var ENV_CMDS_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI";
var ENV_CMDS_AUTH_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN";
var fromContainerMetadata = function(init2) {
  if (init2 === void 0) {
    init2 = {};
  }
  var _a = providerConfigFromInit(init2), timeout = _a.timeout, maxRetries = _a.maxRetries;
  return function() {
    return retry(function() {
      return __awaiter(void 0, void 0, void 0, function() {
        var requestOptions, credsResponse, _a2, _b;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              return [4, getCmdsUri()];
            case 1:
              requestOptions = _c.sent();
              _b = (_a2 = JSON).parse;
              return [4, requestFromEcsImds(timeout, requestOptions)];
            case 2:
              credsResponse = _b.apply(_a2, [_c.sent()]);
              if (!isImdsCredentials(credsResponse)) {
                throw new CredentialsProviderError("Invalid response received from instance metadata service.");
              }
              return [2, fromImdsCredentials(credsResponse)];
          }
        });
      });
    }, maxRetries);
  };
};
var requestFromEcsImds = function(timeout, options) {
  return __awaiter(void 0, void 0, void 0, function() {
    var buffer;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (process.env[ENV_CMDS_AUTH_TOKEN]) {
            options.headers = __assign(__assign({}, options.headers), { Authorization: process.env[ENV_CMDS_AUTH_TOKEN] });
          }
          return [4, httpRequest(__assign(__assign({}, options), { timeout }))];
        case 1:
          buffer = _a.sent();
          return [2, buffer.toString()];
      }
    });
  });
};
var CMDS_IP = "169.254.170.2";
var GREENGRASS_HOSTS = {
  localhost: true,
  "127.0.0.1": true
};
var GREENGRASS_PROTOCOLS = {
  "http:": true,
  "https:": true
};
var getCmdsUri = function() {
  return __awaiter(void 0, void 0, void 0, function() {
    var parsed;
    return __generator(this, function(_a) {
      if (process.env[ENV_CMDS_RELATIVE_URI]) {
        return [2, {
          hostname: CMDS_IP,
          path: process.env[ENV_CMDS_RELATIVE_URI]
        }];
      }
      if (process.env[ENV_CMDS_FULL_URI]) {
        parsed = (0, import_url2.parse)(process.env[ENV_CMDS_FULL_URI]);
        if (!parsed.hostname || !(parsed.hostname in GREENGRASS_HOSTS)) {
          throw new CredentialsProviderError("".concat(parsed.hostname, " is not a valid container metadata service hostname"), false);
        }
        if (!parsed.protocol || !(parsed.protocol in GREENGRASS_PROTOCOLS)) {
          throw new CredentialsProviderError("".concat(parsed.protocol, " is not a valid container metadata service protocol"), false);
        }
        return [2, __assign(__assign({}, parsed), { port: parsed.port ? parseInt(parsed.port, 10) : void 0 })];
      }
      throw new CredentialsProviderError("The container metadata credential provider cannot be used unless" + " the ".concat(ENV_CMDS_RELATIVE_URI, " or ").concat(ENV_CMDS_FULL_URI, " environment") + " variable is set", false);
    });
  });
};

// node_modules/@aws-sdk/node-config-provider/dist-es/fromEnv.js
var fromEnv2 = function(envVarSelector) {
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var config;
      return __generator(this, function(_a) {
        try {
          config = envVarSelector(process.env);
          if (config === void 0) {
            throw new Error();
          }
          return [2, config];
        } catch (e) {
          throw new CredentialsProviderError(e.message || "Cannot load config from environment variables with getter: ".concat(envVarSelector));
        }
        return [2];
      });
    });
  };
};

// node_modules/@aws-sdk/node-config-provider/dist-es/fromSharedConfigFiles.js
var fromSharedConfigFiles = function(configSelector, _a) {
  if (_a === void 0) {
    _a = {};
  }
  var _b = _a.preferredFile, preferredFile = _b === void 0 ? "config" : _b, init2 = __rest(_a, ["preferredFile"]);
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var profile, _a2, configFile, credentialsFile, profileFromCredentials, profileFromConfig, mergedProfile, configValue;
      return __generator(this, function(_b2) {
        switch (_b2.label) {
          case 0:
            profile = getProfileName(init2);
            return [4, loadSharedConfigFiles(init2)];
          case 1:
            _a2 = _b2.sent(), configFile = _a2.configFile, credentialsFile = _a2.credentialsFile;
            profileFromCredentials = credentialsFile[profile] || {};
            profileFromConfig = configFile[profile] || {};
            mergedProfile = preferredFile === "config" ? __assign(__assign({}, profileFromCredentials), profileFromConfig) : __assign(__assign({}, profileFromConfig), profileFromCredentials);
            try {
              configValue = configSelector(mergedProfile);
              if (configValue === void 0) {
                throw new Error();
              }
              return [2, configValue];
            } catch (e) {
              throw new CredentialsProviderError(e.message || "Cannot load config for profile ".concat(profile, " in SDK configuration files with getter: ").concat(configSelector));
            }
            return [2];
        }
      });
    });
  };
};

// node_modules/@aws-sdk/node-config-provider/dist-es/fromStatic.js
var isFunction3 = function(func) {
  return typeof func === "function";
};
var fromStatic2 = function(defaultValue) {
  return isFunction3(defaultValue) ? function() {
    return __awaiter(void 0, void 0, void 0, function() {
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4, defaultValue()];
          case 1:
            return [2, _a.sent()];
        }
      });
    });
  } : fromStatic(defaultValue);
};

// node_modules/@aws-sdk/node-config-provider/dist-es/configLoader.js
var loadConfig = function(_a, configuration) {
  var environmentVariableSelector = _a.environmentVariableSelector, configFileSelector = _a.configFileSelector, defaultValue = _a.default;
  if (configuration === void 0) {
    configuration = {};
  }
  return memoize2(chain(fromEnv2(environmentVariableSelector), fromSharedConfigFiles(configFileSelector, configuration), fromStatic2(defaultValue)));
};

// node_modules/@aws-sdk/querystring-parser/dist-es/index.js
function parseQueryString(querystring) {
  var e_1, _a;
  var query = {};
  querystring = querystring.replace(/^\?/, "");
  if (querystring) {
    try {
      for (var _b = __values(querystring.split("&")), _c = _b.next(); !_c.done; _c = _b.next()) {
        var pair = _c.value;
        var _d = __read(pair.split("="), 2), key = _d[0], _e = _d[1], value = _e === void 0 ? null : _e;
        key = decodeURIComponent(key);
        if (value) {
          value = decodeURIComponent(value);
        }
        if (!(key in query)) {
          query[key] = value;
        } else if (Array.isArray(query[key])) {
          query[key].push(value);
        } else {
          query[key] = [query[key], value];
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return))
          _a.call(_b);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
  }
  return query;
}

// node_modules/@aws-sdk/url-parser/dist-es/index.js
var parseUrl = function(url2) {
  if (typeof url2 === "string") {
    return parseUrl(new URL(url2));
  }
  var _a = url2, hostname = _a.hostname, pathname = _a.pathname, port = _a.port, protocol = _a.protocol, search = _a.search;
  var query;
  if (search) {
    query = parseQueryString(search);
  }
  return {
    hostname,
    port: port ? parseInt(port) : void 0,
    protocol,
    path: pathname,
    query
  };
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/config/Endpoint.js
var Endpoint;
(function(Endpoint2) {
  Endpoint2["IPv4"] = "http://169.254.169.254";
  Endpoint2["IPv6"] = "http://[fd00:ec2::254]";
})(Endpoint || (Endpoint = {}));

// node_modules/@aws-sdk/credential-provider-imds/dist-es/config/EndpointConfigOptions.js
var ENV_ENDPOINT_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT";
var CONFIG_ENDPOINT_NAME = "ec2_metadata_service_endpoint";
var ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env2) {
    return env2[ENV_ENDPOINT_NAME];
  },
  configFileSelector: function(profile) {
    return profile[CONFIG_ENDPOINT_NAME];
  },
  default: void 0
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/config/EndpointMode.js
var EndpointMode;
(function(EndpointMode2) {
  EndpointMode2["IPv4"] = "IPv4";
  EndpointMode2["IPv6"] = "IPv6";
})(EndpointMode || (EndpointMode = {}));

// node_modules/@aws-sdk/credential-provider-imds/dist-es/config/EndpointModeConfigOptions.js
var ENV_ENDPOINT_MODE_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE";
var CONFIG_ENDPOINT_MODE_NAME = "ec2_metadata_service_endpoint_mode";
var ENDPOINT_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env2) {
    return env2[ENV_ENDPOINT_MODE_NAME];
  },
  configFileSelector: function(profile) {
    return profile[CONFIG_ENDPOINT_MODE_NAME];
  },
  default: EndpointMode.IPv4
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/utils/getInstanceMetadataEndpoint.js
var getInstanceMetadataEndpoint = function() {
  return __awaiter(void 0, void 0, void 0, function() {
    var _a, _b;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          _a = parseUrl;
          return [4, getFromEndpointConfig()];
        case 1:
          _b = _c.sent();
          if (_b)
            return [3, 3];
          return [4, getFromEndpointModeConfig()];
        case 2:
          _b = _c.sent();
          _c.label = 3;
        case 3:
          return [2, _a.apply(void 0, [_b])];
      }
    });
  });
};
var getFromEndpointConfig = function() {
  return __awaiter(void 0, void 0, void 0, function() {
    return __generator(this, function(_a) {
      return [2, loadConfig(ENDPOINT_CONFIG_OPTIONS)()];
    });
  });
};
var getFromEndpointModeConfig = function() {
  return __awaiter(void 0, void 0, void 0, function() {
    var endpointMode;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          return [4, loadConfig(ENDPOINT_MODE_CONFIG_OPTIONS)()];
        case 1:
          endpointMode = _a.sent();
          switch (endpointMode) {
            case EndpointMode.IPv4:
              return [2, Endpoint.IPv4];
            case EndpointMode.IPv6:
              return [2, Endpoint.IPv6];
            default:
              throw new Error("Unsupported endpoint mode: ".concat(endpointMode, ".") + " Select from ".concat(Object.values(EndpointMode)));
          }
          return [2];
      }
    });
  });
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/utils/getExtendedInstanceMetadataCredentials.js
var STATIC_STABILITY_REFRESH_INTERVAL_SECONDS = 5 * 60;
var STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS = 5 * 60;
var STATIC_STABILITY_DOC_URL = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html";
var getExtendedInstanceMetadataCredentials = function(credentials, logger3) {
  var _a;
  var refreshInterval = STATIC_STABILITY_REFRESH_INTERVAL_SECONDS + Math.floor(Math.random() * STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS);
  var newExpiration = new Date(Date.now() + refreshInterval * 1e3);
  logger3.warn("Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(newExpiration)}.\nFor more information, please visit: " + STATIC_STABILITY_DOC_URL);
  var originalExpiration = (_a = credentials.originalExpiration) !== null && _a !== void 0 ? _a : credentials.expiration;
  return __assign(__assign(__assign({}, credentials), originalExpiration ? { originalExpiration } : {}), { expiration: newExpiration });
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/utils/staticStabilityProvider.js
var staticStabilityProvider = function(provider, options) {
  if (options === void 0) {
    options = {};
  }
  var logger3 = (options === null || options === void 0 ? void 0 : options.logger) || console;
  var pastCredentials;
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var credentials, e_1;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [4, provider()];
          case 1:
            credentials = _a.sent();
            if (credentials.expiration && credentials.expiration.getTime() < Date.now()) {
              credentials = getExtendedInstanceMetadataCredentials(credentials, logger3);
            }
            return [3, 3];
          case 2:
            e_1 = _a.sent();
            if (pastCredentials) {
              logger3.warn("Credential renew failed: ", e_1);
              credentials = getExtendedInstanceMetadataCredentials(pastCredentials, logger3);
            } else {
              throw e_1;
            }
            return [3, 3];
          case 3:
            pastCredentials = credentials;
            return [2, credentials];
        }
      });
    });
  };
};

// node_modules/@aws-sdk/credential-provider-imds/dist-es/fromInstanceMetadata.js
var IMDS_PATH = "/latest/meta-data/iam/security-credentials/";
var IMDS_TOKEN_PATH = "/latest/api/token";
var fromInstanceMetadata = function(init2) {
  if (init2 === void 0) {
    init2 = {};
  }
  return staticStabilityProvider(getInstanceImdsProvider(init2), { logger: init2.logger });
};
var getInstanceImdsProvider = function(init2) {
  var disableFetchToken = false;
  var _a = providerConfigFromInit(init2), timeout = _a.timeout, maxRetries = _a.maxRetries;
  var getCredentials = function(maxRetries2, options) {
    return __awaiter(void 0, void 0, void 0, function() {
      var profile;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            return [4, retry(function() {
              return __awaiter(void 0, void 0, void 0, function() {
                var profile2, err_1;
                return __generator(this, function(_a3) {
                  switch (_a3.label) {
                    case 0:
                      _a3.trys.push([0, 2, , 3]);
                      return [4, getProfile(options)];
                    case 1:
                      profile2 = _a3.sent();
                      return [3, 3];
                    case 2:
                      err_1 = _a3.sent();
                      if (err_1.statusCode === 401) {
                        disableFetchToken = false;
                      }
                      throw err_1;
                    case 3:
                      return [2, profile2];
                  }
                });
              });
            }, maxRetries2)];
          case 1:
            profile = _a2.sent().trim();
            return [2, retry(function() {
              return __awaiter(void 0, void 0, void 0, function() {
                var creds, err_2;
                return __generator(this, function(_a3) {
                  switch (_a3.label) {
                    case 0:
                      _a3.trys.push([0, 2, , 3]);
                      return [4, getCredentialsFromProfile(profile, options)];
                    case 1:
                      creds = _a3.sent();
                      return [3, 3];
                    case 2:
                      err_2 = _a3.sent();
                      if (err_2.statusCode === 401) {
                        disableFetchToken = false;
                      }
                      throw err_2;
                    case 3:
                      return [2, creds];
                  }
                });
              });
            }, maxRetries2)];
        }
      });
    });
  };
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var endpoint, token, error_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            return [4, getInstanceMetadataEndpoint()];
          case 1:
            endpoint = _a2.sent();
            if (!disableFetchToken)
              return [3, 2];
            return [2, getCredentials(maxRetries, __assign(__assign({}, endpoint), { timeout }))];
          case 2:
            token = void 0;
            _a2.label = 3;
          case 3:
            _a2.trys.push([3, 5, , 6]);
            return [4, getMetadataToken(__assign(__assign({}, endpoint), { timeout }))];
          case 4:
            token = _a2.sent().toString();
            return [3, 6];
          case 5:
            error_1 = _a2.sent();
            if ((error_1 === null || error_1 === void 0 ? void 0 : error_1.statusCode) === 400) {
              throw Object.assign(error_1, {
                message: "EC2 Metadata token request returned error"
              });
            } else if (error_1.message === "TimeoutError" || [403, 404, 405].includes(error_1.statusCode)) {
              disableFetchToken = true;
            }
            return [2, getCredentials(maxRetries, __assign(__assign({}, endpoint), { timeout }))];
          case 6:
            return [2, getCredentials(maxRetries, __assign(__assign({}, endpoint), { headers: {
              "x-aws-ec2-metadata-token": token
            }, timeout }))];
        }
      });
    });
  };
};
var getMetadataToken = function(options) {
  return __awaiter(void 0, void 0, void 0, function() {
    return __generator(this, function(_a) {
      return [2, httpRequest(__assign(__assign({}, options), { path: IMDS_TOKEN_PATH, method: "PUT", headers: {
        "x-aws-ec2-metadata-token-ttl-seconds": "21600"
      } }))];
    });
  });
};
var getProfile = function(options) {
  return __awaiter(void 0, void 0, void 0, function() {
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          return [4, httpRequest(__assign(__assign({}, options), { path: IMDS_PATH }))];
        case 1:
          return [2, _a.sent().toString()];
      }
    });
  });
};
var getCredentialsFromProfile = function(profile, options) {
  return __awaiter(void 0, void 0, void 0, function() {
    var credsResponse, _a, _b;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          _b = (_a = JSON).parse;
          return [4, httpRequest(__assign(__assign({}, options), { path: IMDS_PATH + profile }))];
        case 1:
          credsResponse = _b.apply(_a, [_c.sent().toString()]);
          if (!isImdsCredentials(credsResponse)) {
            throw new CredentialsProviderError("Invalid response received from instance metadata service.");
          }
          return [2, fromImdsCredentials(credsResponse)];
      }
    });
  });
};

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveCredentialSource.js
var resolveCredentialSource = function(credentialSource, profileName) {
  var sourceProvidersMap = {
    EcsContainer: fromContainerMetadata,
    Ec2InstanceMetadata: fromInstanceMetadata,
    Environment: fromEnv
  };
  if (credentialSource in sourceProvidersMap) {
    return sourceProvidersMap[credentialSource]();
  } else {
    throw new CredentialsProviderError("Unsupported credential source in profile ".concat(profileName, ". Got ").concat(credentialSource, ", ") + "expected EcsContainer or Ec2InstanceMetadata or Environment.");
  }
};

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveAssumeRoleCredentials.js
var isAssumeRoleProfile = function(arg) {
  return Boolean(arg) && typeof arg === "object" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof arg.external_id) > -1 && ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 && (isAssumeRoleWithSourceProfile(arg) || isAssumeRoleWithProviderProfile(arg));
};
var isAssumeRoleWithSourceProfile = function(arg) {
  return typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined";
};
var isAssumeRoleWithProviderProfile = function(arg) {
  return typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined";
};
var resolveAssumeRoleCredentials = function(profileName, profiles, options, visitedProfiles) {
  if (visitedProfiles === void 0) {
    visitedProfiles = {};
  }
  return __awaiter(void 0, void 0, void 0, function() {
    var data, source_profile, sourceCredsProvider, params, mfa_serial, _a, sourceCreds;
    var _b;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          data = profiles[profileName];
          if (!options.roleAssumer) {
            throw new CredentialsProviderError("Profile ".concat(profileName, " requires a role to be assumed, but no role assumption callback was provided."), false);
          }
          source_profile = data.source_profile;
          if (source_profile && source_profile in visitedProfiles) {
            throw new CredentialsProviderError("Detected a cycle attempting to resolve credentials for profile" + " ".concat(getProfileName(options), ". Profiles visited: ") + Object.keys(visitedProfiles).join(", "), false);
          }
          sourceCredsProvider = source_profile ? resolveProfileData(source_profile, profiles, options, __assign(__assign({}, visitedProfiles), (_b = {}, _b[source_profile] = true, _b))) : resolveCredentialSource(data.credential_source, profileName)();
          params = {
            RoleArn: data.role_arn,
            RoleSessionName: data.role_session_name || "aws-sdk-js-".concat(Date.now()),
            ExternalId: data.external_id
          };
          mfa_serial = data.mfa_serial;
          if (!mfa_serial)
            return [3, 2];
          if (!options.mfaCodeProvider) {
            throw new CredentialsProviderError("Profile ".concat(profileName, " requires multi-factor authentication, but no MFA code callback was provided."), false);
          }
          params.SerialNumber = mfa_serial;
          _a = params;
          return [4, options.mfaCodeProvider(mfa_serial)];
        case 1:
          _a.TokenCode = _c.sent();
          _c.label = 2;
        case 2:
          return [4, sourceCredsProvider];
        case 3:
          sourceCreds = _c.sent();
          return [2, options.roleAssumer(sourceCreds, params)];
      }
    });
  });
};

// node_modules/@aws-sdk/credential-provider-sso/dist-es/isSsoProfile.js
var isSsoProfile = function(arg) {
  return arg && (typeof arg.sso_start_url === "string" || typeof arg.sso_account_id === "string" || typeof arg.sso_region === "string" || typeof arg.sso_role_name === "string");
};

// node_modules/@aws-sdk/client-sso/dist-es/models/SSOServiceException.js
var SSOServiceException = function(_super) {
  __extends(SSOServiceException2, _super);
  function SSOServiceException2(options) {
    var _this = _super.call(this, options) || this;
    Object.setPrototypeOf(_this, SSOServiceException2.prototype);
    return _this;
  }
  return SSOServiceException2;
}(ServiceException);

// node_modules/@aws-sdk/client-sso/dist-es/models/models_0.js
var InvalidRequestException2 = function(_super) {
  __extends(InvalidRequestException3, _super);
  function InvalidRequestException3(opts) {
    var _this = _super.call(this, __assign({ name: "InvalidRequestException", $fault: "client" }, opts)) || this;
    _this.name = "InvalidRequestException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, InvalidRequestException3.prototype);
    return _this;
  }
  return InvalidRequestException3;
}(SSOServiceException);
var ResourceNotFoundException2 = function(_super) {
  __extends(ResourceNotFoundException3, _super);
  function ResourceNotFoundException3(opts) {
    var _this = _super.call(this, __assign({ name: "ResourceNotFoundException", $fault: "client" }, opts)) || this;
    _this.name = "ResourceNotFoundException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, ResourceNotFoundException3.prototype);
    return _this;
  }
  return ResourceNotFoundException3;
}(SSOServiceException);
var TooManyRequestsException2 = function(_super) {
  __extends(TooManyRequestsException3, _super);
  function TooManyRequestsException3(opts) {
    var _this = _super.call(this, __assign({ name: "TooManyRequestsException", $fault: "client" }, opts)) || this;
    _this.name = "TooManyRequestsException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, TooManyRequestsException3.prototype);
    return _this;
  }
  return TooManyRequestsException3;
}(SSOServiceException);
var UnauthorizedException = function(_super) {
  __extends(UnauthorizedException2, _super);
  function UnauthorizedException2(opts) {
    var _this = _super.call(this, __assign({ name: "UnauthorizedException", $fault: "client" }, opts)) || this;
    _this.name = "UnauthorizedException";
    _this.$fault = "client";
    Object.setPrototypeOf(_this, UnauthorizedException2.prototype);
    return _this;
  }
  return UnauthorizedException2;
}(SSOServiceException);
var GetRoleCredentialsRequestFilterSensitiveLog = function(obj) {
  return __assign(__assign({}, obj), obj.accessToken && { accessToken: SENSITIVE_STRING });
};
var RoleCredentialsFilterSensitiveLog = function(obj) {
  return __assign(__assign(__assign({}, obj), obj.secretAccessKey && { secretAccessKey: SENSITIVE_STRING }), obj.sessionToken && { sessionToken: SENSITIVE_STRING });
};
var GetRoleCredentialsResponseFilterSensitiveLog = function(obj) {
  return __assign(__assign({}, obj), obj.roleCredentials && { roleCredentials: RoleCredentialsFilterSensitiveLog(obj.roleCredentials) });
};

// node_modules/@aws-sdk/client-sso/dist-es/protocols/Aws_restJson1.js
var serializeAws_restJson1GetRoleCredentialsCommand = function(input, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var _a, hostname, _b, protocol, port, basePath, headers, resolvedPath, query, body;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          return [4, context.endpoint()];
        case 1:
          _a = _c.sent(), hostname = _a.hostname, _b = _a.protocol, protocol = _b === void 0 ? "https" : _b, port = _a.port, basePath = _a.path;
          headers = map3({}, isSerializableHeaderValue, {
            "x-amz-sso_bearer_token": input.accessToken
          });
          resolvedPath = "".concat((basePath === null || basePath === void 0 ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || "") + "/federation/credentials";
          query = map3({
            role_name: [, input.roleName],
            account_id: [, input.accountId]
          });
          return [2, new HttpRequest({
            protocol,
            hostname,
            port,
            method: "GET",
            headers,
            path: resolvedPath,
            query,
            body
          })];
      }
    });
  });
};
var deserializeAws_restJson1GetRoleCredentialsCommand = function(output, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var contents, data, _a, _b;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          if (output.statusCode !== 200 && output.statusCode >= 300) {
            return [2, deserializeAws_restJson1GetRoleCredentialsCommandError(output, context)];
          }
          contents = map3({
            $metadata: deserializeMetadata4(output)
          });
          _a = expectNonNull;
          _b = expectObject;
          return [4, parseBody4(output.body, context)];
        case 1:
          data = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]), "body"]);
          if (data.roleCredentials != null) {
            contents.roleCredentials = deserializeAws_restJson1RoleCredentials(data.roleCredentials, context);
          }
          return [2, contents];
      }
    });
  });
};
var deserializeAws_restJson1GetRoleCredentialsCommandError = function(output, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var parsedOutput, _a, errorCode, _b, parsedBody;
    var _c;
    return __generator(this, function(_d) {
      switch (_d.label) {
        case 0:
          _a = [__assign({}, output)];
          _c = {};
          return [4, parseErrorBody3(output.body, context)];
        case 1:
          parsedOutput = __assign.apply(void 0, _a.concat([(_c.body = _d.sent(), _c)]));
          errorCode = loadRestJsonErrorCode2(output, parsedOutput.body);
          _b = errorCode;
          switch (_b) {
            case "InvalidRequestException":
              return [3, 2];
            case "com.amazonaws.sso#InvalidRequestException":
              return [3, 2];
            case "ResourceNotFoundException":
              return [3, 4];
            case "com.amazonaws.sso#ResourceNotFoundException":
              return [3, 4];
            case "TooManyRequestsException":
              return [3, 6];
            case "com.amazonaws.sso#TooManyRequestsException":
              return [3, 6];
            case "UnauthorizedException":
              return [3, 8];
            case "com.amazonaws.sso#UnauthorizedException":
              return [3, 8];
          }
          return [3, 10];
        case 2:
          return [4, deserializeAws_restJson1InvalidRequestExceptionResponse(parsedOutput, context)];
        case 3:
          throw _d.sent();
        case 4:
          return [4, deserializeAws_restJson1ResourceNotFoundExceptionResponse(parsedOutput, context)];
        case 5:
          throw _d.sent();
        case 6:
          return [4, deserializeAws_restJson1TooManyRequestsExceptionResponse(parsedOutput, context)];
        case 7:
          throw _d.sent();
        case 8:
          return [4, deserializeAws_restJson1UnauthorizedExceptionResponse(parsedOutput, context)];
        case 9:
          throw _d.sent();
        case 10:
          parsedBody = parsedOutput.body;
          throwDefaultError({
            output,
            parsedBody,
            exceptionCtor: SSOServiceException,
            errorCode
          });
          _d.label = 11;
        case 11:
          return [2];
      }
    });
  });
};
var map3 = map2;
var deserializeAws_restJson1InvalidRequestExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var contents, data, exception;
    return __generator(this, function(_a) {
      contents = map3({});
      data = parsedOutput.body;
      if (data.message != null) {
        contents.message = expectString(data.message);
      }
      exception = new InvalidRequestException2(__assign({ $metadata: deserializeMetadata4(parsedOutput) }, contents));
      return [2, decorateServiceException(exception, parsedOutput.body)];
    });
  });
};
var deserializeAws_restJson1ResourceNotFoundExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var contents, data, exception;
    return __generator(this, function(_a) {
      contents = map3({});
      data = parsedOutput.body;
      if (data.message != null) {
        contents.message = expectString(data.message);
      }
      exception = new ResourceNotFoundException2(__assign({ $metadata: deserializeMetadata4(parsedOutput) }, contents));
      return [2, decorateServiceException(exception, parsedOutput.body)];
    });
  });
};
var deserializeAws_restJson1TooManyRequestsExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var contents, data, exception;
    return __generator(this, function(_a) {
      contents = map3({});
      data = parsedOutput.body;
      if (data.message != null) {
        contents.message = expectString(data.message);
      }
      exception = new TooManyRequestsException2(__assign({ $metadata: deserializeMetadata4(parsedOutput) }, contents));
      return [2, decorateServiceException(exception, parsedOutput.body)];
    });
  });
};
var deserializeAws_restJson1UnauthorizedExceptionResponse = function(parsedOutput, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var contents, data, exception;
    return __generator(this, function(_a) {
      contents = map3({});
      data = parsedOutput.body;
      if (data.message != null) {
        contents.message = expectString(data.message);
      }
      exception = new UnauthorizedException(__assign({ $metadata: deserializeMetadata4(parsedOutput) }, contents));
      return [2, decorateServiceException(exception, parsedOutput.body)];
    });
  });
};
var deserializeAws_restJson1RoleCredentials = function(output, context) {
  return {
    accessKeyId: expectString(output.accessKeyId),
    expiration: expectLong(output.expiration),
    secretAccessKey: expectString(output.secretAccessKey),
    sessionToken: expectString(output.sessionToken)
  };
};
var deserializeMetadata4 = function(output) {
  var _a, _b;
  return {
    httpStatusCode: output.statusCode,
    requestId: (_b = (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"]) !== null && _b !== void 0 ? _b : output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"]
  };
};
var collectBody3 = function(streamBody, context) {
  if (streamBody === void 0) {
    streamBody = new Uint8Array();
  }
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
var collectBodyString3 = function(streamBody, context) {
  return collectBody3(streamBody, context).then(function(body) {
    return context.utf8Encoder(body);
  });
};
var isSerializableHeaderValue = function(value) {
  return value !== void 0 && value !== null && value !== "" && (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) && (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
};
var parseBody4 = function(streamBody, context) {
  return collectBodyString3(streamBody, context).then(function(encoded) {
    if (encoded.length) {
      return JSON.parse(encoded);
    }
    return {};
  });
};
var parseErrorBody3 = function(errorBody, context) {
  return __awaiter(void 0, void 0, void 0, function() {
    var value;
    var _a;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          return [4, parseBody4(errorBody, context)];
        case 1:
          value = _b.sent();
          value.message = (_a = value.message) !== null && _a !== void 0 ? _a : value.Message;
          return [2, value];
      }
    });
  });
};
var loadRestJsonErrorCode2 = function(output, data) {
  var findKey = function(object, key) {
    return Object.keys(object).find(function(k) {
      return k.toLowerCase() === key.toLowerCase();
    });
  };
  var sanitizeErrorCode = function(rawValue) {
    var cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  };
  var headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
};

// node_modules/@aws-sdk/client-sso/dist-es/commands/GetRoleCredentialsCommand.js
var GetRoleCredentialsCommand = function(_super) {
  __extends(GetRoleCredentialsCommand2, _super);
  function GetRoleCredentialsCommand2(input) {
    var _this = _super.call(this) || this;
    _this.input = input;
    return _this;
  }
  GetRoleCredentialsCommand2.prototype.resolveMiddleware = function(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    var stack = clientStack.concat(this.middlewareStack);
    var logger3 = configuration.logger;
    var clientName = "SSOClient";
    var commandName = "GetRoleCredentialsCommand";
    var handlerExecutionContext = {
      logger: logger3,
      clientName,
      commandName,
      inputFilterSensitiveLog: GetRoleCredentialsRequestFilterSensitiveLog,
      outputFilterSensitiveLog: GetRoleCredentialsResponseFilterSensitiveLog
    };
    var requestHandler = configuration.requestHandler;
    return stack.resolve(function(request2) {
      return requestHandler.handle(request2.request, options || {});
    }, handlerExecutionContext);
  };
  GetRoleCredentialsCommand2.prototype.serialize = function(input, context) {
    return serializeAws_restJson1GetRoleCredentialsCommand(input, context);
  };
  GetRoleCredentialsCommand2.prototype.deserialize = function(output, context) {
    return deserializeAws_restJson1GetRoleCredentialsCommand(output, context);
  };
  return GetRoleCredentialsCommand2;
}(Command);

// node_modules/@aws-sdk/client-sso/package.json
var package_default4 = {
  name: "@aws-sdk/client-sso",
  description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
  version: "3.186.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "2.0.0",
    "@aws-crypto/sha256-js": "2.0.0",
    "@aws-sdk/config-resolver": "3.186.0",
    "@aws-sdk/fetch-http-handler": "3.186.0",
    "@aws-sdk/hash-node": "3.186.0",
    "@aws-sdk/invalid-dependency": "3.186.0",
    "@aws-sdk/middleware-content-length": "3.186.0",
    "@aws-sdk/middleware-host-header": "3.186.0",
    "@aws-sdk/middleware-logger": "3.186.0",
    "@aws-sdk/middleware-recursion-detection": "3.186.0",
    "@aws-sdk/middleware-retry": "3.186.0",
    "@aws-sdk/middleware-serde": "3.186.0",
    "@aws-sdk/middleware-stack": "3.186.0",
    "@aws-sdk/middleware-user-agent": "3.186.0",
    "@aws-sdk/node-config-provider": "3.186.0",
    "@aws-sdk/node-http-handler": "3.186.0",
    "@aws-sdk/protocol-http": "3.186.0",
    "@aws-sdk/smithy-client": "3.186.0",
    "@aws-sdk/types": "3.186.0",
    "@aws-sdk/url-parser": "3.186.0",
    "@aws-sdk/util-base64-browser": "3.186.0",
    "@aws-sdk/util-base64-node": "3.186.0",
    "@aws-sdk/util-body-length-browser": "3.186.0",
    "@aws-sdk/util-body-length-node": "3.186.0",
    "@aws-sdk/util-defaults-mode-browser": "3.186.0",
    "@aws-sdk/util-defaults-mode-node": "3.186.0",
    "@aws-sdk/util-user-agent-browser": "3.186.0",
    "@aws-sdk/util-user-agent-node": "3.186.0",
    "@aws-sdk/util-utf8-browser": "3.186.0",
    "@aws-sdk/util-utf8-node": "3.186.0",
    tslib: "^2.3.1"
  },
  devDependencies: {
    "@aws-sdk/service-client-documentation-generator": "3.186.0",
    "@tsconfig/recommended": "1.0.1",
    "@types/node": "^12.7.5",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.19.2",
    typescript: "~4.6.2"
  },
  overrides: {
    typedoc: {
      typescript: "~4.6.2"
    }
  },
  engines: {
    node: ">=12.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sso"
  }
};

// node_modules/@aws-sdk/util-buffer-from/dist-es/index.js
var import_buffer2 = require("buffer");
var fromArrayBuffer = function(input, offset, length) {
  if (offset === void 0) {
    offset = 0;
  }
  if (length === void 0) {
    length = input.byteLength - offset;
  }
  if (!isArrayBuffer(input)) {
    throw new TypeError('The "input" argument must be ArrayBuffer. Received type '.concat(typeof input, " (").concat(input, ")"));
  }
  return import_buffer2.Buffer.from(input, offset, length);
};
var fromString = function(input, encoding) {
  if (typeof input !== "string") {
    throw new TypeError('The "input" argument must be of type string. Received type '.concat(typeof input, " (").concat(input, ")"));
  }
  return encoding ? import_buffer2.Buffer.from(input, encoding) : import_buffer2.Buffer.from(input);
};

// node_modules/@aws-sdk/hash-node/dist-es/index.js
var import_buffer3 = require("buffer");
var import_crypto2 = require("crypto");
var Hash2 = function() {
  function Hash3(algorithmIdentifier, secret) {
    this.hash = secret ? (0, import_crypto2.createHmac)(algorithmIdentifier, castSourceData(secret)) : (0, import_crypto2.createHash)(algorithmIdentifier);
  }
  Hash3.prototype.update = function(toHash, encoding) {
    this.hash.update(castSourceData(toHash, encoding));
  };
  Hash3.prototype.digest = function() {
    return Promise.resolve(this.hash.digest());
  };
  return Hash3;
}();
function castSourceData(toCast, encoding) {
  if (import_buffer3.Buffer.isBuffer(toCast)) {
    return toCast;
  }
  if (typeof toCast === "string") {
    return fromString(toCast, encoding);
  }
  if (ArrayBuffer.isView(toCast)) {
    return fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
  }
  return fromArrayBuffer(toCast);
}

// node_modules/@aws-sdk/querystring-builder/dist-es/index.js
function buildQueryString(query) {
  var e_1, _a;
  var parts = [];
  try {
    for (var _b = __values(Object.keys(query).sort()), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var value = query[key];
      key = escapeUri(key);
      if (Array.isArray(value)) {
        for (var i = 0, iLen = value.length; i < iLen; i++) {
          parts.push("".concat(key, "=").concat(escapeUri(value[i])));
        }
      } else {
        var qsEntry = key;
        if (value || typeof value === "string") {
          qsEntry += "=".concat(escapeUri(value));
        }
        parts.push(qsEntry);
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return))
        _a.call(_b);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return parts.join("&");
}

// node_modules/@aws-sdk/node-http-handler/dist-es/node-http-handler.js
var import_http2 = require("http");
var import_https = require("https");

// node_modules/@aws-sdk/node-http-handler/dist-es/constants.js
var NODEJS_TIMEOUT_ERROR_CODES2 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];

// node_modules/@aws-sdk/node-http-handler/dist-es/get-transformed-headers.js
var getTransformedHeaders = function(headers) {
  var e_1, _a;
  var transformedHeaders = {};
  try {
    for (var _b = __values(Object.keys(headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var name_1 = _c.value;
      var headerValues = headers[name_1];
      transformedHeaders[name_1] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return))
        _a.call(_b);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return transformedHeaders;
};

// node_modules/@aws-sdk/node-http-handler/dist-es/set-connection-timeout.js
var setConnectionTimeout = function(request2, reject, timeoutInMs) {
  if (timeoutInMs === void 0) {
    timeoutInMs = 0;
  }
  if (!timeoutInMs) {
    return;
  }
  request2.on("socket", function(socket) {
    if (socket.connecting) {
      var timeoutId_1 = setTimeout(function() {
        request2.destroy();
        reject(Object.assign(new Error("Socket timed out without establishing a connection within ".concat(timeoutInMs, " ms")), {
          name: "TimeoutError"
        }));
      }, timeoutInMs);
      socket.on("connect", function() {
        clearTimeout(timeoutId_1);
      });
    }
  });
};

// node_modules/@aws-sdk/node-http-handler/dist-es/set-socket-timeout.js
var setSocketTimeout = function(request2, reject, timeoutInMs) {
  if (timeoutInMs === void 0) {
    timeoutInMs = 0;
  }
  request2.setTimeout(timeoutInMs, function() {
    request2.destroy();
    reject(Object.assign(new Error("Connection timed out after ".concat(timeoutInMs, " ms")), { name: "TimeoutError" }));
  });
};

// node_modules/@aws-sdk/node-http-handler/dist-es/write-request-body.js
var import_stream = require("stream");
function writeRequestBody(httpRequest2, request2) {
  var expect = request2.headers["Expect"] || request2.headers["expect"];
  if (expect === "100-continue") {
    httpRequest2.on("continue", function() {
      writeBody(httpRequest2, request2.body);
    });
  } else {
    writeBody(httpRequest2, request2.body);
  }
}
function writeBody(httpRequest2, body) {
  if (body instanceof import_stream.Readable) {
    body.pipe(httpRequest2);
  } else if (body) {
    httpRequest2.end(Buffer.from(body));
  } else {
    httpRequest2.end();
  }
}

// node_modules/@aws-sdk/node-http-handler/dist-es/node-http-handler.js
var NodeHttpHandler = function() {
  function NodeHttpHandler2(options) {
    var _this = this;
    this.metadata = { handlerProtocol: "http/1.1" };
    this.configProvider = new Promise(function(resolve, reject) {
      if (typeof options === "function") {
        options().then(function(_options) {
          resolve(_this.resolveDefaultConfig(_options));
        }).catch(reject);
      } else {
        resolve(_this.resolveDefaultConfig(options));
      }
    });
  }
  NodeHttpHandler2.prototype.resolveDefaultConfig = function(options) {
    var _a = options || {}, connectionTimeout = _a.connectionTimeout, socketTimeout = _a.socketTimeout, httpAgent = _a.httpAgent, httpsAgent = _a.httpsAgent;
    var keepAlive = true;
    var maxSockets = 50;
    return {
      connectionTimeout,
      socketTimeout,
      httpAgent: httpAgent || new import_http2.Agent({ keepAlive, maxSockets }),
      httpsAgent: httpsAgent || new import_https.Agent({ keepAlive, maxSockets })
    };
  };
  NodeHttpHandler2.prototype.destroy = function() {
    var _a, _b, _c, _d;
    (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.httpAgent) === null || _b === void 0 ? void 0 : _b.destroy();
    (_d = (_c = this.config) === null || _c === void 0 ? void 0 : _c.httpsAgent) === null || _d === void 0 ? void 0 : _d.destroy();
  };
  NodeHttpHandler2.prototype.handle = function(request2, _a) {
    var _b = _a === void 0 ? {} : _a, abortSignal = _b.abortSignal;
    return __awaiter(this, void 0, void 0, function() {
      var _c;
      var _this = this;
      return __generator(this, function(_d) {
        switch (_d.label) {
          case 0:
            if (!!this.config)
              return [3, 2];
            _c = this;
            return [4, this.configProvider];
          case 1:
            _c.config = _d.sent();
            _d.label = 2;
          case 2:
            return [2, new Promise(function(resolve, reject) {
              if (!_this.config) {
                throw new Error("Node HTTP request handler config is not resolved");
              }
              if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
                var abortError = new Error("Request aborted");
                abortError.name = "AbortError";
                reject(abortError);
                return;
              }
              var isSSL = request2.protocol === "https:";
              var queryString = buildQueryString(request2.query || {});
              var nodeHttpsOptions = {
                headers: request2.headers,
                host: request2.hostname,
                method: request2.method,
                path: queryString ? "".concat(request2.path, "?").concat(queryString) : request2.path,
                port: request2.port,
                agent: isSSL ? _this.config.httpsAgent : _this.config.httpAgent
              };
              var requestFunc = isSSL ? import_https.request : import_http2.request;
              var req = requestFunc(nodeHttpsOptions, function(res) {
                var httpResponse = new HttpResponse({
                  statusCode: res.statusCode || -1,
                  headers: getTransformedHeaders(res.headers),
                  body: res
                });
                resolve({ response: httpResponse });
              });
              req.on("error", function(err) {
                if (NODEJS_TIMEOUT_ERROR_CODES2.includes(err.code)) {
                  reject(Object.assign(err, { name: "TimeoutError" }));
                } else {
                  reject(err);
                }
              });
              setConnectionTimeout(req, reject, _this.config.connectionTimeout);
              setSocketTimeout(req, reject, _this.config.socketTimeout);
              if (abortSignal) {
                abortSignal.onabort = function() {
                  req.abort();
                  var abortError2 = new Error("Request aborted");
                  abortError2.name = "AbortError";
                  reject(abortError2);
                };
              }
              writeRequestBody(req, request2);
            })];
        }
      });
    });
  };
  return NodeHttpHandler2;
}();

// node_modules/@aws-sdk/node-http-handler/dist-es/node-http2-handler.js
var import_http22 = require("http2");
var NodeHttp2Handler = function() {
  function NodeHttp2Handler2(options) {
    this.metadata = { handlerProtocol: "h2" };
    this.configProvider = new Promise(function(resolve, reject) {
      if (typeof options === "function") {
        options().then(function(opts) {
          resolve(opts || {});
        }).catch(reject);
      } else {
        resolve(options || {});
      }
    });
    this.sessionCache = /* @__PURE__ */ new Map();
  }
  NodeHttp2Handler2.prototype.destroy = function() {
    var e_1, _a;
    var _this = this;
    try {
      for (var _b = __values(this.sessionCache.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var sessions = _c.value;
        sessions.forEach(function(session) {
          return _this.destroySession(session);
        });
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return))
          _a.call(_b);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    this.sessionCache.clear();
  };
  NodeHttp2Handler2.prototype.handle = function(request2, _a) {
    var _b = _a === void 0 ? {} : _a, abortSignal = _b.abortSignal;
    return __awaiter(this, void 0, void 0, function() {
      var _c, _d, requestTimeout, disableConcurrentStreams;
      var _this = this;
      return __generator(this, function(_e) {
        switch (_e.label) {
          case 0:
            if (!!this.config)
              return [3, 2];
            _c = this;
            return [4, this.configProvider];
          case 1:
            _c.config = _e.sent();
            _e.label = 2;
          case 2:
            _d = this.config, requestTimeout = _d.requestTimeout, disableConcurrentStreams = _d.disableConcurrentStreams;
            return [2, new Promise(function(resolve, rejectOriginal) {
              var _a2;
              var fulfilled = false;
              if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
                fulfilled = true;
                var abortError = new Error("Request aborted");
                abortError.name = "AbortError";
                rejectOriginal(abortError);
                return;
              }
              var hostname = request2.hostname, method = request2.method, port = request2.port, protocol = request2.protocol, path = request2.path, query = request2.query;
              var authority = "".concat(protocol, "//").concat(hostname).concat(port ? ":".concat(port) : "");
              var session = _this.getSession(authority, disableConcurrentStreams || false);
              var reject = function(err) {
                if (disableConcurrentStreams) {
                  _this.destroySession(session);
                }
                fulfilled = true;
                rejectOriginal(err);
              };
              var queryString = buildQueryString(query || {});
              var req = session.request(__assign(__assign({}, request2.headers), (_a2 = {}, _a2[import_http22.constants.HTTP2_HEADER_PATH] = queryString ? "".concat(path, "?").concat(queryString) : path, _a2[import_http22.constants.HTTP2_HEADER_METHOD] = method, _a2)));
              session.ref();
              req.on("response", function(headers) {
                var httpResponse = new HttpResponse({
                  statusCode: headers[":status"] || -1,
                  headers: getTransformedHeaders(headers),
                  body: req
                });
                fulfilled = true;
                resolve({ response: httpResponse });
                if (disableConcurrentStreams) {
                  session.close();
                  _this.deleteSessionFromCache(authority, session);
                }
              });
              if (requestTimeout) {
                req.setTimeout(requestTimeout, function() {
                  req.close();
                  var timeoutError = new Error("Stream timed out because of no activity for ".concat(requestTimeout, " ms"));
                  timeoutError.name = "TimeoutError";
                  reject(timeoutError);
                });
              }
              if (abortSignal) {
                abortSignal.onabort = function() {
                  req.close();
                  var abortError2 = new Error("Request aborted");
                  abortError2.name = "AbortError";
                  reject(abortError2);
                };
              }
              req.on("frameError", function(type, code, id) {
                reject(new Error("Frame type id ".concat(type, " in stream id ").concat(id, " has failed with code ").concat(code, ".")));
              });
              req.on("error", reject);
              req.on("aborted", function() {
                reject(new Error("HTTP/2 stream is abnormally aborted in mid-communication with result code ".concat(req.rstCode, ".")));
              });
              req.on("close", function() {
                session.unref();
                if (disableConcurrentStreams) {
                  session.destroy();
                }
                if (!fulfilled) {
                  reject(new Error("Unexpected error: http2 request did not get a response"));
                }
              });
              writeRequestBody(req, request2);
            })];
        }
      });
    });
  };
  NodeHttp2Handler2.prototype.getSession = function(authority, disableConcurrentStreams) {
    var _this = this;
    var _a;
    var sessionCache = this.sessionCache;
    var existingSessions = sessionCache.get(authority) || [];
    if (existingSessions.length > 0 && !disableConcurrentStreams)
      return existingSessions[0];
    var newSession = (0, import_http22.connect)(authority);
    newSession.unref();
    var destroySessionCb = function() {
      _this.destroySession(newSession);
      _this.deleteSessionFromCache(authority, newSession);
    };
    newSession.on("goaway", destroySessionCb);
    newSession.on("error", destroySessionCb);
    newSession.on("frameError", destroySessionCb);
    newSession.on("close", function() {
      return _this.deleteSessionFromCache(authority, newSession);
    });
    if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.sessionTimeout) {
      newSession.setTimeout(this.config.sessionTimeout, destroySessionCb);
    }
    existingSessions.push(newSession);
    sessionCache.set(authority, existingSessions);
    return newSession;
  };
  NodeHttp2Handler2.prototype.destroySession = function(session) {
    if (!session.destroyed) {
      session.destroy();
    }
  };
  NodeHttp2Handler2.prototype.deleteSessionFromCache = function(authority, session) {
    var existingSessions = this.sessionCache.get(authority) || [];
    if (!existingSessions.includes(session)) {
      return;
    }
    this.sessionCache.set(authority, existingSessions.filter(function(s) {
      return s !== session;
    }));
  };
  return NodeHttp2Handler2;
}();

// node_modules/@aws-sdk/node-http-handler/dist-es/stream-collector/collector.js
var import_stream2 = require("stream");
var Collector = function(_super) {
  __extends(Collector2, _super);
  function Collector2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.bufferedBytes = [];
    return _this;
  }
  Collector2.prototype._write = function(chunk, encoding, callback) {
    this.bufferedBytes.push(chunk);
    callback();
  };
  return Collector2;
}(import_stream2.Writable);

// node_modules/@aws-sdk/node-http-handler/dist-es/stream-collector/index.js
var streamCollector = function(stream2) {
  return new Promise(function(resolve, reject) {
    var collector = new Collector();
    stream2.pipe(collector);
    stream2.on("error", function(err) {
      collector.end();
      reject(err);
    });
    collector.on("error", reject);
    collector.on("finish", function() {
      var bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
      resolve(bytes);
    });
  });
};

// node_modules/@aws-sdk/util-base64-node/dist-es/index.js
var BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
function fromBase64(input) {
  if (input.length * 3 % 4 !== 0) {
    throw new TypeError("Incorrect padding on base64 string.");
  }
  if (!BASE64_REGEX.exec(input)) {
    throw new TypeError("Invalid base64 string.");
  }
  var buffer = fromString(input, "base64");
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}
function toBase64(input) {
  return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64");
}

// node_modules/@aws-sdk/util-body-length-node/dist-es/calculateBodyLength.js
var import_fs3 = require("fs");
var calculateBodyLength = function(body) {
  if (!body) {
    return 0;
  }
  if (typeof body === "string") {
    return Buffer.from(body).length;
  } else if (typeof body.byteLength === "number") {
    return body.byteLength;
  } else if (typeof body.size === "number") {
    return body.size;
  } else if (typeof body.path === "string" || Buffer.isBuffer(body.path)) {
    return (0, import_fs3.lstatSync)(body.path).size;
  } else if (typeof body.fd === "number") {
    return (0, import_fs3.fstatSync)(body.fd).size;
  }
  throw new Error("Body Length computation failed for ".concat(body));
};

// node_modules/@aws-sdk/util-user-agent-node/dist-es/index.js
var import_os2 = require("os");
var import_process = require("process");

// node_modules/@aws-sdk/util-user-agent-node/dist-es/is-crt-available.js
var isCrtAvailable = function() {
  try {
    if (typeof require === "function" && typeof module !== "undefined" && module.require && require("aws-crt")) {
      return ["md/crt-avail"];
    }
    return null;
  } catch (e) {
    return null;
  }
};

// node_modules/@aws-sdk/util-user-agent-node/dist-es/index.js
var UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
var UA_APP_ID_INI_NAME = "sdk-ua-app-id";
var defaultUserAgent = function(_a) {
  var serviceId = _a.serviceId, clientVersion = _a.clientVersion;
  var sections = [
    ["aws-sdk-js", clientVersion],
    ["os/".concat((0, import_os2.platform)()), (0, import_os2.release)()],
    ["lang/js"],
    ["md/nodejs", "".concat(import_process.versions.node)]
  ];
  var crtAvailable = isCrtAvailable();
  if (crtAvailable) {
    sections.push(crtAvailable);
  }
  if (serviceId) {
    sections.push(["api/".concat(serviceId), clientVersion]);
  }
  if (import_process.env.AWS_EXECUTION_ENV) {
    sections.push(["exec-env/".concat(import_process.env.AWS_EXECUTION_ENV)]);
  }
  var appIdPromise = loadConfig({
    environmentVariableSelector: function(env2) {
      return env2[UA_APP_ID_ENV_NAME];
    },
    configFileSelector: function(profile) {
      return profile[UA_APP_ID_INI_NAME];
    },
    default: void 0
  })();
  var resolvedUserAgent = void 0;
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var appId;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            if (!!resolvedUserAgent)
              return [3, 2];
            return [4, appIdPromise];
          case 1:
            appId = _a2.sent();
            resolvedUserAgent = appId ? __spreadArray(__spreadArray([], __read(sections), false), [["app/".concat(appId)]], false) : __spreadArray([], __read(sections), false);
            _a2.label = 2;
          case 2:
            return [2, resolvedUserAgent];
        }
      });
    });
  };
};

// node_modules/@aws-sdk/util-utf8-node/dist-es/index.js
var fromUtf8 = function(input) {
  var buf = fromString(input, "utf8");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};
var toUtf8 = function(input) {
  return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
};

// node_modules/@aws-sdk/client-sso/dist-es/endpoints.js
var regionHash = {
  "ap-east-1": {
    variants: [
      {
        hostname: "portal.sso.ap-east-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "ap-east-1"
  },
  "ap-northeast-1": {
    variants: [
      {
        hostname: "portal.sso.ap-northeast-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "ap-northeast-1"
  },
  "ap-northeast-2": {
    variants: [
      {
        hostname: "portal.sso.ap-northeast-2.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "ap-northeast-2"
  },
  "ap-northeast-3": {
    variants: [
      {
        hostname: "portal.sso.ap-northeast-3.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "ap-northeast-3"
  },
  "ap-south-1": {
    variants: [
      {
        hostname: "portal.sso.ap-south-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "ap-south-1"
  },
  "ap-southeast-1": {
    variants: [
      {
        hostname: "portal.sso.ap-southeast-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "ap-southeast-1"
  },
  "ap-southeast-2": {
    variants: [
      {
        hostname: "portal.sso.ap-southeast-2.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "ap-southeast-2"
  },
  "ca-central-1": {
    variants: [
      {
        hostname: "portal.sso.ca-central-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "ca-central-1"
  },
  "eu-central-1": {
    variants: [
      {
        hostname: "portal.sso.eu-central-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "eu-central-1"
  },
  "eu-north-1": {
    variants: [
      {
        hostname: "portal.sso.eu-north-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "eu-north-1"
  },
  "eu-south-1": {
    variants: [
      {
        hostname: "portal.sso.eu-south-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "eu-south-1"
  },
  "eu-west-1": {
    variants: [
      {
        hostname: "portal.sso.eu-west-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "eu-west-1"
  },
  "eu-west-2": {
    variants: [
      {
        hostname: "portal.sso.eu-west-2.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "eu-west-2"
  },
  "eu-west-3": {
    variants: [
      {
        hostname: "portal.sso.eu-west-3.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "eu-west-3"
  },
  "me-south-1": {
    variants: [
      {
        hostname: "portal.sso.me-south-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "me-south-1"
  },
  "sa-east-1": {
    variants: [
      {
        hostname: "portal.sso.sa-east-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "sa-east-1"
  },
  "us-east-1": {
    variants: [
      {
        hostname: "portal.sso.us-east-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "us-east-1"
  },
  "us-east-2": {
    variants: [
      {
        hostname: "portal.sso.us-east-2.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "us-east-2"
  },
  "us-gov-east-1": {
    variants: [
      {
        hostname: "portal.sso.us-gov-east-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "us-gov-east-1"
  },
  "us-gov-west-1": {
    variants: [
      {
        hostname: "portal.sso.us-gov-west-1.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "us-gov-west-1"
  },
  "us-west-2": {
    variants: [
      {
        hostname: "portal.sso.us-west-2.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "us-west-2"
  }
};
var partitionHash = {
  aws: {
    regions: [
      "af-south-1",
      "ap-east-1",
      "ap-northeast-1",
      "ap-northeast-2",
      "ap-northeast-3",
      "ap-south-1",
      "ap-southeast-1",
      "ap-southeast-2",
      "ap-southeast-3",
      "ca-central-1",
      "eu-central-1",
      "eu-north-1",
      "eu-south-1",
      "eu-west-1",
      "eu-west-2",
      "eu-west-3",
      "me-central-1",
      "me-south-1",
      "sa-east-1",
      "us-east-1",
      "us-east-2",
      "us-west-1",
      "us-west-2"
    ],
    regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "portal.sso.{region}.amazonaws.com",
        tags: []
      },
      {
        hostname: "portal.sso-fips.{region}.amazonaws.com",
        tags: ["fips"]
      },
      {
        hostname: "portal.sso-fips.{region}.api.aws",
        tags: ["dualstack", "fips"]
      },
      {
        hostname: "portal.sso.{region}.api.aws",
        tags: ["dualstack"]
      }
    ]
  },
  "aws-cn": {
    regions: ["cn-north-1", "cn-northwest-1"],
    regionRegex: "^cn\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "portal.sso.{region}.amazonaws.com.cn",
        tags: []
      },
      {
        hostname: "portal.sso-fips.{region}.amazonaws.com.cn",
        tags: ["fips"]
      },
      {
        hostname: "portal.sso-fips.{region}.api.amazonwebservices.com.cn",
        tags: ["dualstack", "fips"]
      },
      {
        hostname: "portal.sso.{region}.api.amazonwebservices.com.cn",
        tags: ["dualstack"]
      }
    ]
  },
  "aws-iso": {
    regions: ["us-iso-east-1", "us-iso-west-1"],
    regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "portal.sso.{region}.c2s.ic.gov",
        tags: []
      },
      {
        hostname: "portal.sso-fips.{region}.c2s.ic.gov",
        tags: ["fips"]
      }
    ]
  },
  "aws-iso-b": {
    regions: ["us-isob-east-1"],
    regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "portal.sso.{region}.sc2s.sgov.gov",
        tags: []
      },
      {
        hostname: "portal.sso-fips.{region}.sc2s.sgov.gov",
        tags: ["fips"]
      }
    ]
  },
  "aws-us-gov": {
    regions: ["us-gov-east-1", "us-gov-west-1"],
    regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "portal.sso.{region}.amazonaws.com",
        tags: []
      },
      {
        hostname: "portal.sso-fips.{region}.amazonaws.com",
        tags: ["fips"]
      },
      {
        hostname: "portal.sso-fips.{region}.api.aws",
        tags: ["dualstack", "fips"]
      },
      {
        hostname: "portal.sso.{region}.api.aws",
        tags: ["dualstack"]
      }
    ]
  }
};
var defaultRegionInfoProvider = function(region, options) {
  return __awaiter(void 0, void 0, void 0, function() {
    return __generator(this, function(_a) {
      return [2, getRegionInfo(region, __assign(__assign({}, options), { signingService: "awsssoportal", regionHash, partitionHash }))];
    });
  });
};

// node_modules/@aws-sdk/client-sso/dist-es/runtimeConfig.shared.js
var getRuntimeConfig = function(config) {
  var _a, _b, _c, _d, _e;
  return {
    apiVersion: "2019-06-10",
    disableHostPrefix: (_a = config === null || config === void 0 ? void 0 : config.disableHostPrefix) !== null && _a !== void 0 ? _a : false,
    logger: (_b = config === null || config === void 0 ? void 0 : config.logger) !== null && _b !== void 0 ? _b : {},
    regionInfoProvider: (_c = config === null || config === void 0 ? void 0 : config.regionInfoProvider) !== null && _c !== void 0 ? _c : defaultRegionInfoProvider,
    serviceId: (_d = config === null || config === void 0 ? void 0 : config.serviceId) !== null && _d !== void 0 ? _d : "SSO",
    urlParser: (_e = config === null || config === void 0 ? void 0 : config.urlParser) !== null && _e !== void 0 ? _e : parseUrl
  };
};

// node_modules/@aws-sdk/util-defaults-mode-node/dist-es/constants.js
var AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
var AWS_REGION_ENV = "AWS_REGION";
var AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
var ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
var DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];
var IMDS_REGION_PATH = "/latest/meta-data/placement/region";

// node_modules/@aws-sdk/util-defaults-mode-node/dist-es/defaultsModeConfig.js
var AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
var AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
var NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env2) {
    return env2[AWS_DEFAULTS_MODE_ENV];
  },
  configFileSelector: function(profile) {
    return profile[AWS_DEFAULTS_MODE_CONFIG];
  },
  default: "legacy"
};

// node_modules/@aws-sdk/util-defaults-mode-node/dist-es/resolveDefaultsModeConfig.js
var resolveDefaultsModeConfig = function(_a) {
  var _b = _a === void 0 ? {} : _a, _c = _b.region, region = _c === void 0 ? loadConfig(NODE_REGION_CONFIG_OPTIONS) : _c, _d = _b.defaultsMode, defaultsMode = _d === void 0 ? loadConfig(NODE_DEFAULTS_MODE_CONFIG_OPTIONS) : _d;
  return memoize2(function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var mode, _a2;
      return __generator(this, function(_b2) {
        switch (_b2.label) {
          case 0:
            if (!(typeof defaultsMode === "function"))
              return [3, 2];
            return [4, defaultsMode()];
          case 1:
            _a2 = _b2.sent();
            return [3, 3];
          case 2:
            _a2 = defaultsMode;
            _b2.label = 3;
          case 3:
            mode = _a2;
            switch (mode === null || mode === void 0 ? void 0 : mode.toLowerCase()) {
              case "auto":
                return [2, resolveNodeDefaultsModeAuto(region)];
              case "in-region":
              case "cross-region":
              case "mobile":
              case "standard":
              case "legacy":
                return [2, Promise.resolve(mode === null || mode === void 0 ? void 0 : mode.toLocaleLowerCase())];
              case void 0:
                return [2, Promise.resolve("legacy")];
              default:
                throw new Error('Invalid parameter for "defaultsMode", expect '.concat(DEFAULTS_MODE_OPTIONS.join(", "), ", got ").concat(mode));
            }
            return [2];
        }
      });
    });
  });
};
var resolveNodeDefaultsModeAuto = function(clientRegion) {
  return __awaiter(void 0, void 0, void 0, function() {
    var resolvedRegion, _a, inferredRegion;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          if (!clientRegion)
            return [3, 5];
          if (!(typeof clientRegion === "function"))
            return [3, 2];
          return [4, clientRegion()];
        case 1:
          _a = _b.sent();
          return [3, 3];
        case 2:
          _a = clientRegion;
          _b.label = 3;
        case 3:
          resolvedRegion = _a;
          return [4, inferPhysicalRegion()];
        case 4:
          inferredRegion = _b.sent();
          if (!inferredRegion) {
            return [2, "standard"];
          }
          if (resolvedRegion === inferredRegion) {
            return [2, "in-region"];
          } else {
            return [2, "cross-region"];
          }
          _b.label = 5;
        case 5:
          return [2, "standard"];
      }
    });
  });
};
var inferPhysicalRegion = function() {
  return __awaiter(void 0, void 0, void 0, function() {
    var endpoint, e_1;
    var _a;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          if (process.env[AWS_EXECUTION_ENV] && (process.env[AWS_REGION_ENV] || process.env[AWS_DEFAULT_REGION_ENV])) {
            return [2, (_a = process.env[AWS_REGION_ENV]) !== null && _a !== void 0 ? _a : process.env[AWS_DEFAULT_REGION_ENV]];
          }
          if (!!process.env[ENV_IMDS_DISABLED])
            return [3, 5];
          _b.label = 1;
        case 1:
          _b.trys.push([1, 4, , 5]);
          return [4, getInstanceMetadataEndpoint()];
        case 2:
          endpoint = _b.sent();
          return [4, httpRequest(__assign(__assign({}, endpoint), { path: IMDS_REGION_PATH }))];
        case 3:
          return [2, _b.sent().toString()];
        case 4:
          e_1 = _b.sent();
          return [3, 5];
        case 5:
          return [2];
      }
    });
  });
};

// node_modules/@aws-sdk/client-sso/dist-es/runtimeConfig.js
var getRuntimeConfig2 = function(config) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
  emitWarningIfUnsupportedVersion(process.version);
  var defaultsMode = resolveDefaultsModeConfig(config);
  var defaultConfigProvider = function() {
    return defaultsMode().then(loadConfigsForDefaultMode);
  };
  var clientSharedValues = getRuntimeConfig(config);
  return __assign(__assign(__assign({}, clientSharedValues), config), { runtime: "node", defaultsMode, base64Decoder: (_a = config === null || config === void 0 ? void 0 : config.base64Decoder) !== null && _a !== void 0 ? _a : fromBase64, base64Encoder: (_b = config === null || config === void 0 ? void 0 : config.base64Encoder) !== null && _b !== void 0 ? _b : toBase64, bodyLengthChecker: (_c = config === null || config === void 0 ? void 0 : config.bodyLengthChecker) !== null && _c !== void 0 ? _c : calculateBodyLength, defaultUserAgentProvider: (_d = config === null || config === void 0 ? void 0 : config.defaultUserAgentProvider) !== null && _d !== void 0 ? _d : defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default4.version }), maxAttempts: (_e = config === null || config === void 0 ? void 0 : config.maxAttempts) !== null && _e !== void 0 ? _e : loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS), region: (_f = config === null || config === void 0 ? void 0 : config.region) !== null && _f !== void 0 ? _f : loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS), requestHandler: (_g = config === null || config === void 0 ? void 0 : config.requestHandler) !== null && _g !== void 0 ? _g : new NodeHttpHandler(defaultConfigProvider), retryMode: (_h = config === null || config === void 0 ? void 0 : config.retryMode) !== null && _h !== void 0 ? _h : loadConfig(__assign(__assign({}, NODE_RETRY_MODE_CONFIG_OPTIONS), { default: function() {
    return __awaiter(void 0, void 0, void 0, function() {
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            return [4, defaultConfigProvider()];
          case 1:
            return [2, _a2.sent().retryMode || DEFAULT_RETRY_MODE];
        }
      });
    });
  } })), sha256: (_j = config === null || config === void 0 ? void 0 : config.sha256) !== null && _j !== void 0 ? _j : Hash2.bind(null, "sha256"), streamCollector: (_k = config === null || config === void 0 ? void 0 : config.streamCollector) !== null && _k !== void 0 ? _k : streamCollector, useDualstackEndpoint: (_l = config === null || config === void 0 ? void 0 : config.useDualstackEndpoint) !== null && _l !== void 0 ? _l : loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS), useFipsEndpoint: (_m = config === null || config === void 0 ? void 0 : config.useFipsEndpoint) !== null && _m !== void 0 ? _m : loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS), utf8Decoder: (_o = config === null || config === void 0 ? void 0 : config.utf8Decoder) !== null && _o !== void 0 ? _o : fromUtf8, utf8Encoder: (_p = config === null || config === void 0 ? void 0 : config.utf8Encoder) !== null && _p !== void 0 ? _p : toUtf8 });
};

// node_modules/@aws-sdk/client-sso/dist-es/SSOClient.js
var SSOClient = function(_super) {
  __extends(SSOClient2, _super);
  function SSOClient2(configuration) {
    var _this = this;
    var _config_0 = getRuntimeConfig2(configuration);
    var _config_1 = resolveRegionConfig(_config_0);
    var _config_2 = resolveEndpointsConfig(_config_1);
    var _config_3 = resolveRetryConfig(_config_2);
    var _config_4 = resolveHostHeaderConfig(_config_3);
    var _config_5 = resolveUserAgentConfig(_config_4);
    _this = _super.call(this, _config_5) || this;
    _this.config = _config_5;
    _this.middlewareStack.use(getRetryPlugin(_this.config));
    _this.middlewareStack.use(getContentLengthPlugin(_this.config));
    _this.middlewareStack.use(getHostHeaderPlugin(_this.config));
    _this.middlewareStack.use(getLoggerPlugin(_this.config));
    _this.middlewareStack.use(getRecursionDetectionPlugin(_this.config));
    _this.middlewareStack.use(getUserAgentPlugin(_this.config));
    return _this;
  }
  SSOClient2.prototype.destroy = function() {
    _super.prototype.destroy.call(this);
  };
  return SSOClient2;
}(Client);

// node_modules/@aws-sdk/credential-provider-sso/dist-es/resolveSSOCredentials.js
var EXPIRE_WINDOW_MS = 15 * 60 * 1e3;
var SHOULD_FAIL_CREDENTIAL_CHAIN = false;
var resolveSSOCredentials = function(_a) {
  var ssoStartUrl = _a.ssoStartUrl, ssoAccountId = _a.ssoAccountId, ssoRegion = _a.ssoRegion, ssoRoleName = _a.ssoRoleName, ssoClient = _a.ssoClient;
  return __awaiter(void 0, void 0, void 0, function() {
    var token, refreshMessage, e_1, accessToken, sso, ssoResp, e_2, _b, _c, accessKeyId, secretAccessKey, sessionToken, expiration;
    return __generator(this, function(_d) {
      switch (_d.label) {
        case 0:
          refreshMessage = "To refresh this SSO session run aws sso login with the corresponding profile.";
          _d.label = 1;
        case 1:
          _d.trys.push([1, 3, , 4]);
          return [4, getSSOTokenFromFile(ssoStartUrl)];
        case 2:
          token = _d.sent();
          return [3, 4];
        case 3:
          e_1 = _d.sent();
          throw new CredentialsProviderError("The SSO session associated with this profile is invalid. ".concat(refreshMessage), SHOULD_FAIL_CREDENTIAL_CHAIN);
        case 4:
          if (new Date(token.expiresAt).getTime() - Date.now() <= EXPIRE_WINDOW_MS) {
            throw new CredentialsProviderError("The SSO session associated with this profile has expired. ".concat(refreshMessage), SHOULD_FAIL_CREDENTIAL_CHAIN);
          }
          accessToken = token.accessToken;
          sso = ssoClient || new SSOClient({ region: ssoRegion });
          _d.label = 5;
        case 5:
          _d.trys.push([5, 7, , 8]);
          return [4, sso.send(new GetRoleCredentialsCommand({
            accountId: ssoAccountId,
            roleName: ssoRoleName,
            accessToken
          }))];
        case 6:
          ssoResp = _d.sent();
          return [3, 8];
        case 7:
          e_2 = _d.sent();
          throw CredentialsProviderError.from(e_2, SHOULD_FAIL_CREDENTIAL_CHAIN);
        case 8:
          _b = ssoResp.roleCredentials, _c = _b === void 0 ? {} : _b, accessKeyId = _c.accessKeyId, secretAccessKey = _c.secretAccessKey, sessionToken = _c.sessionToken, expiration = _c.expiration;
          if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration) {
            throw new CredentialsProviderError("SSO returns an invalid temporary credential.", SHOULD_FAIL_CREDENTIAL_CHAIN);
          }
          return [2, { accessKeyId, secretAccessKey, sessionToken, expiration: new Date(expiration) }];
      }
    });
  });
};

// node_modules/@aws-sdk/credential-provider-sso/dist-es/validateSsoProfile.js
var validateSsoProfile = function(profile) {
  var sso_start_url = profile.sso_start_url, sso_account_id = profile.sso_account_id, sso_region = profile.sso_region, sso_role_name = profile.sso_role_name;
  if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name) {
    throw new CredentialsProviderError('Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", ' + '"sso_role_name", "sso_start_url". Got '.concat(Object.keys(profile).join(", "), "\nReference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html"), false);
  }
  return profile;
};

// node_modules/@aws-sdk/credential-provider-sso/dist-es/fromSSO.js
var fromSSO = function(init2) {
  if (init2 === void 0) {
    init2 = {};
  }
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, profiles, profileName, profile, _a, sso_start_url, sso_account_id, sso_region, sso_role_name;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            ssoStartUrl = init2.ssoStartUrl, ssoAccountId = init2.ssoAccountId, ssoRegion = init2.ssoRegion, ssoRoleName = init2.ssoRoleName, ssoClient = init2.ssoClient;
            if (!(!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName))
              return [3, 2];
            return [4, parseKnownFiles(init2)];
          case 1:
            profiles = _b.sent();
            profileName = getProfileName(init2);
            profile = profiles[profileName];
            if (!isSsoProfile(profile)) {
              throw new CredentialsProviderError("Profile ".concat(profileName, " is not configured with SSO credentials."));
            }
            _a = validateSsoProfile(profile), sso_start_url = _a.sso_start_url, sso_account_id = _a.sso_account_id, sso_region = _a.sso_region, sso_role_name = _a.sso_role_name;
            return [2, resolveSSOCredentials({
              ssoStartUrl: sso_start_url,
              ssoAccountId: sso_account_id,
              ssoRegion: sso_region,
              ssoRoleName: sso_role_name,
              ssoClient
            })];
          case 2:
            if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
              throw new CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"');
            } else {
              return [2, resolveSSOCredentials({ ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient })];
            }
            _b.label = 3;
          case 3:
            return [2];
        }
      });
    });
  };
};

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveSsoCredentials.js
var resolveSsoCredentials = function(data) {
  var _a = validateSsoProfile(data), sso_start_url = _a.sso_start_url, sso_account_id = _a.sso_account_id, sso_region = _a.sso_region, sso_role_name = _a.sso_role_name;
  return fromSSO({
    ssoStartUrl: sso_start_url,
    ssoAccountId: sso_account_id,
    ssoRegion: sso_region,
    ssoRoleName: sso_role_name
  })();
};

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveStaticCredentials.js
var isStaticCredsProfile = function(arg) {
  return Boolean(arg) && typeof arg === "object" && typeof arg.aws_access_key_id === "string" && typeof arg.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1;
};
var resolveStaticCredentials = function(profile) {
  return Promise.resolve({
    accessKeyId: profile.aws_access_key_id,
    secretAccessKey: profile.aws_secret_access_key,
    sessionToken: profile.aws_session_token
  });
};

// node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromTokenFile.js
var import_fs4 = require("fs");

// node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromWebToken.js
var fromWebToken = function(init2) {
  return function() {
    var roleArn = init2.roleArn, roleSessionName = init2.roleSessionName, webIdentityToken = init2.webIdentityToken, providerId = init2.providerId, policyArns = init2.policyArns, policy = init2.policy, durationSeconds = init2.durationSeconds, roleAssumerWithWebIdentity = init2.roleAssumerWithWebIdentity;
    if (!roleAssumerWithWebIdentity) {
      throw new CredentialsProviderError("Role Arn '".concat(roleArn, "' needs to be assumed with web identity,") + " but no role assumption callback was provided.", false);
    }
    return roleAssumerWithWebIdentity({
      RoleArn: roleArn,
      RoleSessionName: roleSessionName !== null && roleSessionName !== void 0 ? roleSessionName : "aws-sdk-js-session-".concat(Date.now()),
      WebIdentityToken: webIdentityToken,
      ProviderId: providerId,
      PolicyArns: policyArns,
      Policy: policy,
      DurationSeconds: durationSeconds
    });
  };
};

// node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromTokenFile.js
var ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
var ENV_ROLE_ARN = "AWS_ROLE_ARN";
var ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
var fromTokenFile = function(init2) {
  if (init2 === void 0) {
    init2 = {};
  }
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      return __generator(this, function(_a) {
        return [2, resolveTokenFile(init2)];
      });
    });
  };
};
var resolveTokenFile = function(init2) {
  var _a, _b, _c;
  var webIdentityTokenFile = (_a = init2 === null || init2 === void 0 ? void 0 : init2.webIdentityTokenFile) !== null && _a !== void 0 ? _a : process.env[ENV_TOKEN_FILE];
  var roleArn = (_b = init2 === null || init2 === void 0 ? void 0 : init2.roleArn) !== null && _b !== void 0 ? _b : process.env[ENV_ROLE_ARN];
  var roleSessionName = (_c = init2 === null || init2 === void 0 ? void 0 : init2.roleSessionName) !== null && _c !== void 0 ? _c : process.env[ENV_ROLE_SESSION_NAME];
  if (!webIdentityTokenFile || !roleArn) {
    throw new CredentialsProviderError("Web identity configuration not specified");
  }
  return fromWebToken(__assign(__assign({}, init2), { webIdentityToken: (0, import_fs4.readFileSync)(webIdentityTokenFile, { encoding: "ascii" }), roleArn, roleSessionName }))();
};

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveWebIdentityCredentials.js
var isWebIdentityProfile = function(arg) {
  return Boolean(arg) && typeof arg === "object" && typeof arg.web_identity_token_file === "string" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1;
};
var resolveWebIdentityCredentials = function(profile, options) {
  return __awaiter(void 0, void 0, void 0, function() {
    return __generator(this, function(_a) {
      return [2, fromTokenFile({
        webIdentityTokenFile: profile.web_identity_token_file,
        roleArn: profile.role_arn,
        roleSessionName: profile.role_session_name,
        roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity
      })()];
    });
  });
};

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveProfileData.js
var resolveProfileData = function(profileName, profiles, options, visitedProfiles) {
  if (visitedProfiles === void 0) {
    visitedProfiles = {};
  }
  return __awaiter(void 0, void 0, void 0, function() {
    var data;
    return __generator(this, function(_a) {
      data = profiles[profileName];
      if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data)) {
        return [2, resolveStaticCredentials(data)];
      }
      if (isAssumeRoleProfile(data)) {
        return [2, resolveAssumeRoleCredentials(profileName, profiles, options, visitedProfiles)];
      }
      if (isStaticCredsProfile(data)) {
        return [2, resolveStaticCredentials(data)];
      }
      if (isWebIdentityProfile(data)) {
        return [2, resolveWebIdentityCredentials(data, options)];
      }
      if (isSsoProfile(data)) {
        return [2, resolveSsoCredentials(data)];
      }
      throw new CredentialsProviderError("Profile ".concat(profileName, " could not be found or parsed in shared credentials file."));
    });
  });
};

// node_modules/@aws-sdk/credential-provider-ini/dist-es/fromIni.js
var fromIni = function(init2) {
  if (init2 === void 0) {
    init2 = {};
  }
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var profiles;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4, parseKnownFiles(init2)];
          case 1:
            profiles = _a.sent();
            return [2, resolveProfileData(getProfileName(init2), profiles, init2)];
        }
      });
    });
  };
};

// node_modules/@aws-sdk/credential-provider-process/dist-es/resolveProcessCredentials.js
var import_child_process = require("child_process");
var import_util12 = require("util");

// node_modules/@aws-sdk/credential-provider-process/dist-es/getValidatedProcessCredentials.js
var getValidatedProcessCredentials = function(profileName, data) {
  if (data.Version !== 1) {
    throw Error("Profile ".concat(profileName, " credential_process did not return Version 1."));
  }
  if (data.AccessKeyId === void 0 || data.SecretAccessKey === void 0) {
    throw Error("Profile ".concat(profileName, " credential_process returned invalid credentials."));
  }
  if (data.Expiration) {
    var currentTime = new Date();
    var expireTime = new Date(data.Expiration);
    if (expireTime < currentTime) {
      throw Error("Profile ".concat(profileName, " credential_process returned expired credentials."));
    }
  }
  return __assign(__assign({ accessKeyId: data.AccessKeyId, secretAccessKey: data.SecretAccessKey }, data.SessionToken && { sessionToken: data.SessionToken }), data.Expiration && { expiration: new Date(data.Expiration) });
};

// node_modules/@aws-sdk/credential-provider-process/dist-es/resolveProcessCredentials.js
var resolveProcessCredentials = function(profileName, profiles) {
  return __awaiter(void 0, void 0, void 0, function() {
    var profile, credentialProcess, execPromise, stdout, data, error_1;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          profile = profiles[profileName];
          if (!profiles[profileName])
            return [3, 7];
          credentialProcess = profile["credential_process"];
          if (!(credentialProcess !== void 0))
            return [3, 5];
          execPromise = (0, import_util12.promisify)(import_child_process.exec);
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [4, execPromise(credentialProcess)];
        case 2:
          stdout = _a.sent().stdout;
          data = void 0;
          try {
            data = JSON.parse(stdout.trim());
          } catch (_b) {
            throw Error("Profile ".concat(profileName, " credential_process returned invalid JSON."));
          }
          return [2, getValidatedProcessCredentials(profileName, data)];
        case 3:
          error_1 = _a.sent();
          throw new CredentialsProviderError(error_1.message);
        case 4:
          return [3, 6];
        case 5:
          throw new CredentialsProviderError("Profile ".concat(profileName, " did not contain credential_process."));
        case 6:
          return [3, 8];
        case 7:
          throw new CredentialsProviderError("Profile ".concat(profileName, " could not be found in shared credentials file."));
        case 8:
          return [2];
      }
    });
  });
};

// node_modules/@aws-sdk/credential-provider-process/dist-es/fromProcess.js
var fromProcess = function(init2) {
  if (init2 === void 0) {
    init2 = {};
  }
  return function() {
    return __awaiter(void 0, void 0, void 0, function() {
      var profiles;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4, parseKnownFiles(init2)];
          case 1:
            profiles = _a.sent();
            return [2, resolveProcessCredentials(getProfileName(init2), profiles)];
        }
      });
    });
  };
};

// node_modules/@aws-sdk/credential-provider-node/dist-es/remoteProvider.js
var ENV_IMDS_DISABLED2 = "AWS_EC2_METADATA_DISABLED";
var remoteProvider = function(init2) {
  if (process.env[ENV_CMDS_RELATIVE_URI] || process.env[ENV_CMDS_FULL_URI]) {
    return fromContainerMetadata(init2);
  }
  if (process.env[ENV_IMDS_DISABLED2]) {
    return function() {
      return __awaiter(void 0, void 0, void 0, function() {
        return __generator(this, function(_a) {
          throw new CredentialsProviderError("EC2 Instance Metadata Service access disabled");
        });
      });
    };
  }
  return fromInstanceMetadata(init2);
};

// node_modules/@aws-sdk/credential-provider-node/dist-es/defaultProvider.js
var defaultProvider = function(init2) {
  if (init2 === void 0) {
    init2 = {};
  }
  return memoize2(chain.apply(void 0, __spreadArray(__spreadArray([], __read(init2.profile || process.env[ENV_PROFILE] ? [] : [fromEnv()]), false), [
    fromSSO(init2),
    fromIni(init2),
    fromProcess(init2),
    fromTokenFile(init2),
    remoteProvider(init2),
    function() {
      return __awaiter(void 0, void 0, void 0, function() {
        return __generator(this, function(_a) {
          throw new CredentialsProviderError("Could not load credentials from any providers", false);
        });
      });
    }
  ], false)), function(credentials) {
    return credentials.expiration !== void 0 && credentials.expiration.getTime() - Date.now() < 3e5;
  }, function(credentials) {
    return credentials.expiration !== void 0;
  });
};

// node_modules/@aws-sdk/client-sts/dist-es/endpoints.js
var regionHash2 = {
  "aws-global": {
    variants: [
      {
        hostname: "sts.amazonaws.com",
        tags: []
      }
    ],
    signingRegion: "us-east-1"
  },
  "us-east-1": {
    variants: [
      {
        hostname: "sts-fips.us-east-1.amazonaws.com",
        tags: ["fips"]
      }
    ]
  },
  "us-east-2": {
    variants: [
      {
        hostname: "sts-fips.us-east-2.amazonaws.com",
        tags: ["fips"]
      }
    ]
  },
  "us-gov-east-1": {
    variants: [
      {
        hostname: "sts.us-gov-east-1.amazonaws.com",
        tags: ["fips"]
      }
    ]
  },
  "us-gov-west-1": {
    variants: [
      {
        hostname: "sts.us-gov-west-1.amazonaws.com",
        tags: ["fips"]
      }
    ]
  },
  "us-west-1": {
    variants: [
      {
        hostname: "sts-fips.us-west-1.amazonaws.com",
        tags: ["fips"]
      }
    ]
  },
  "us-west-2": {
    variants: [
      {
        hostname: "sts-fips.us-west-2.amazonaws.com",
        tags: ["fips"]
      }
    ]
  }
};
var partitionHash2 = {
  aws: {
    regions: [
      "af-south-1",
      "ap-east-1",
      "ap-northeast-1",
      "ap-northeast-2",
      "ap-northeast-3",
      "ap-south-1",
      "ap-southeast-1",
      "ap-southeast-2",
      "ap-southeast-3",
      "aws-global",
      "ca-central-1",
      "eu-central-1",
      "eu-north-1",
      "eu-south-1",
      "eu-west-1",
      "eu-west-2",
      "eu-west-3",
      "me-central-1",
      "me-south-1",
      "sa-east-1",
      "us-east-1",
      "us-east-1-fips",
      "us-east-2",
      "us-east-2-fips",
      "us-west-1",
      "us-west-1-fips",
      "us-west-2",
      "us-west-2-fips"
    ],
    regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "sts.{region}.amazonaws.com",
        tags: []
      },
      {
        hostname: "sts-fips.{region}.amazonaws.com",
        tags: ["fips"]
      },
      {
        hostname: "sts-fips.{region}.api.aws",
        tags: ["dualstack", "fips"]
      },
      {
        hostname: "sts.{region}.api.aws",
        tags: ["dualstack"]
      }
    ]
  },
  "aws-cn": {
    regions: ["cn-north-1", "cn-northwest-1"],
    regionRegex: "^cn\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "sts.{region}.amazonaws.com.cn",
        tags: []
      },
      {
        hostname: "sts-fips.{region}.amazonaws.com.cn",
        tags: ["fips"]
      },
      {
        hostname: "sts-fips.{region}.api.amazonwebservices.com.cn",
        tags: ["dualstack", "fips"]
      },
      {
        hostname: "sts.{region}.api.amazonwebservices.com.cn",
        tags: ["dualstack"]
      }
    ]
  },
  "aws-iso": {
    regions: ["us-iso-east-1", "us-iso-west-1"],
    regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "sts.{region}.c2s.ic.gov",
        tags: []
      },
      {
        hostname: "sts-fips.{region}.c2s.ic.gov",
        tags: ["fips"]
      }
    ]
  },
  "aws-iso-b": {
    regions: ["us-isob-east-1"],
    regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "sts.{region}.sc2s.sgov.gov",
        tags: []
      },
      {
        hostname: "sts-fips.{region}.sc2s.sgov.gov",
        tags: ["fips"]
      }
    ]
  },
  "aws-us-gov": {
    regions: ["us-gov-east-1", "us-gov-east-1-fips", "us-gov-west-1", "us-gov-west-1-fips"],
    regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "sts.{region}.amazonaws.com",
        tags: []
      },
      {
        hostname: "sts.{region}.amazonaws.com",
        tags: ["fips"]
      },
      {
        hostname: "sts-fips.{region}.api.aws",
        tags: ["dualstack", "fips"]
      },
      {
        hostname: "sts.{region}.api.aws",
        tags: ["dualstack"]
      }
    ]
  }
};
var defaultRegionInfoProvider2 = function(region, options) {
  return __awaiter(void 0, void 0, void 0, function() {
    return __generator(this, function(_a) {
      return [2, getRegionInfo(region, __assign(__assign({}, options), { signingService: "sts", regionHash: regionHash2, partitionHash: partitionHash2 }))];
    });
  });
};

// node_modules/@aws-sdk/client-sts/dist-es/runtimeConfig.shared.js
var getRuntimeConfig3 = function(config) {
  var _a, _b, _c, _d, _e;
  return {
    apiVersion: "2011-06-15",
    disableHostPrefix: (_a = config === null || config === void 0 ? void 0 : config.disableHostPrefix) !== null && _a !== void 0 ? _a : false,
    logger: (_b = config === null || config === void 0 ? void 0 : config.logger) !== null && _b !== void 0 ? _b : {},
    regionInfoProvider: (_c = config === null || config === void 0 ? void 0 : config.regionInfoProvider) !== null && _c !== void 0 ? _c : defaultRegionInfoProvider2,
    serviceId: (_d = config === null || config === void 0 ? void 0 : config.serviceId) !== null && _d !== void 0 ? _d : "STS",
    urlParser: (_e = config === null || config === void 0 ? void 0 : config.urlParser) !== null && _e !== void 0 ? _e : parseUrl
  };
};

// node_modules/@aws-sdk/client-sts/dist-es/runtimeConfig.js
var getRuntimeConfig4 = function(config) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
  emitWarningIfUnsupportedVersion(process.version);
  var defaultsMode = resolveDefaultsModeConfig(config);
  var defaultConfigProvider = function() {
    return defaultsMode().then(loadConfigsForDefaultMode);
  };
  var clientSharedValues = getRuntimeConfig3(config);
  return __assign(__assign(__assign({}, clientSharedValues), config), { runtime: "node", defaultsMode, base64Decoder: (_a = config === null || config === void 0 ? void 0 : config.base64Decoder) !== null && _a !== void 0 ? _a : fromBase64, base64Encoder: (_b = config === null || config === void 0 ? void 0 : config.base64Encoder) !== null && _b !== void 0 ? _b : toBase64, bodyLengthChecker: (_c = config === null || config === void 0 ? void 0 : config.bodyLengthChecker) !== null && _c !== void 0 ? _c : calculateBodyLength, credentialDefaultProvider: (_d = config === null || config === void 0 ? void 0 : config.credentialDefaultProvider) !== null && _d !== void 0 ? _d : decorateDefaultCredentialProvider(defaultProvider), defaultUserAgentProvider: (_e = config === null || config === void 0 ? void 0 : config.defaultUserAgentProvider) !== null && _e !== void 0 ? _e : defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default3.version }), maxAttempts: (_f = config === null || config === void 0 ? void 0 : config.maxAttempts) !== null && _f !== void 0 ? _f : loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS), region: (_g = config === null || config === void 0 ? void 0 : config.region) !== null && _g !== void 0 ? _g : loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS), requestHandler: (_h = config === null || config === void 0 ? void 0 : config.requestHandler) !== null && _h !== void 0 ? _h : new NodeHttpHandler(defaultConfigProvider), retryMode: (_j = config === null || config === void 0 ? void 0 : config.retryMode) !== null && _j !== void 0 ? _j : loadConfig(__assign(__assign({}, NODE_RETRY_MODE_CONFIG_OPTIONS), { default: function() {
    return __awaiter(void 0, void 0, void 0, function() {
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            return [4, defaultConfigProvider()];
          case 1:
            return [2, _a2.sent().retryMode || DEFAULT_RETRY_MODE];
        }
      });
    });
  } })), sha256: (_k = config === null || config === void 0 ? void 0 : config.sha256) !== null && _k !== void 0 ? _k : Hash2.bind(null, "sha256"), streamCollector: (_l = config === null || config === void 0 ? void 0 : config.streamCollector) !== null && _l !== void 0 ? _l : streamCollector, useDualstackEndpoint: (_m = config === null || config === void 0 ? void 0 : config.useDualstackEndpoint) !== null && _m !== void 0 ? _m : loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS), useFipsEndpoint: (_o = config === null || config === void 0 ? void 0 : config.useFipsEndpoint) !== null && _o !== void 0 ? _o : loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS), utf8Decoder: (_p = config === null || config === void 0 ? void 0 : config.utf8Decoder) !== null && _p !== void 0 ? _p : fromUtf8, utf8Encoder: (_q = config === null || config === void 0 ? void 0 : config.utf8Encoder) !== null && _q !== void 0 ? _q : toUtf8 });
};

// node_modules/@aws-sdk/client-sts/dist-es/STSClient.js
var STSClient = function(_super) {
  __extends(STSClient2, _super);
  function STSClient2(configuration) {
    var _this = this;
    var _config_0 = getRuntimeConfig4(configuration);
    var _config_1 = resolveRegionConfig(_config_0);
    var _config_2 = resolveEndpointsConfig(_config_1);
    var _config_3 = resolveRetryConfig(_config_2);
    var _config_4 = resolveHostHeaderConfig(_config_3);
    var _config_5 = resolveStsAuthConfig(_config_4, { stsClientCtor: STSClient2 });
    var _config_6 = resolveUserAgentConfig(_config_5);
    _this = _super.call(this, _config_6) || this;
    _this.config = _config_6;
    _this.middlewareStack.use(getRetryPlugin(_this.config));
    _this.middlewareStack.use(getContentLengthPlugin(_this.config));
    _this.middlewareStack.use(getHostHeaderPlugin(_this.config));
    _this.middlewareStack.use(getLoggerPlugin(_this.config));
    _this.middlewareStack.use(getRecursionDetectionPlugin(_this.config));
    _this.middlewareStack.use(getUserAgentPlugin(_this.config));
    return _this;
  }
  STSClient2.prototype.destroy = function() {
    _super.prototype.destroy.call(this);
  };
  return STSClient2;
}(Client);

// node_modules/@aws-sdk/client-sts/dist-es/defaultRoleAssumers.js
var getCustomizableStsClientCtor = function(baseCtor, customizations) {
  if (!customizations)
    return baseCtor;
  else
    return function(_super) {
      __extends(CustomizableSTSClient, _super);
      function CustomizableSTSClient(config) {
        var e_1, _a;
        var _this = _super.call(this, config) || this;
        try {
          for (var _b = __values(customizations), _c = _b.next(); !_c.done; _c = _b.next()) {
            var customization = _c.value;
            _this.middlewareStack.use(customization);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return))
              _a.call(_b);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return _this;
      }
      return CustomizableSTSClient;
    }(baseCtor);
};
var getDefaultRoleAssumer2 = function(stsOptions, stsPlugins) {
  if (stsOptions === void 0) {
    stsOptions = {};
  }
  return getDefaultRoleAssumer(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins));
};
var getDefaultRoleAssumerWithWebIdentity2 = function(stsOptions, stsPlugins) {
  if (stsOptions === void 0) {
    stsOptions = {};
  }
  return getDefaultRoleAssumerWithWebIdentity(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins));
};
var decorateDefaultCredentialProvider2 = function(provider) {
  return function(input) {
    return provider(__assign({ roleAssumer: getDefaultRoleAssumer2(input), roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity2(input) }, input));
  };
};

// node_modules/@aws-sdk/client-translate/dist-es/endpoints.js
var regionHash3 = {
  "us-east-1": {
    variants: [
      {
        hostname: "translate-fips.us-east-1.amazonaws.com",
        tags: ["fips"]
      }
    ]
  },
  "us-east-2": {
    variants: [
      {
        hostname: "translate-fips.us-east-2.amazonaws.com",
        tags: ["fips"]
      }
    ]
  },
  "us-gov-west-1": {
    variants: [
      {
        hostname: "translate-fips.us-gov-west-1.amazonaws.com",
        tags: ["fips"]
      }
    ]
  },
  "us-west-2": {
    variants: [
      {
        hostname: "translate-fips.us-west-2.amazonaws.com",
        tags: ["fips"]
      }
    ]
  }
};
var partitionHash3 = {
  aws: {
    regions: [
      "af-south-1",
      "ap-east-1",
      "ap-northeast-1",
      "ap-northeast-2",
      "ap-northeast-3",
      "ap-south-1",
      "ap-southeast-1",
      "ap-southeast-2",
      "ap-southeast-3",
      "ca-central-1",
      "eu-central-1",
      "eu-north-1",
      "eu-south-1",
      "eu-west-1",
      "eu-west-2",
      "eu-west-3",
      "me-central-1",
      "me-south-1",
      "sa-east-1",
      "us-east-1",
      "us-east-1-fips",
      "us-east-2",
      "us-east-2-fips",
      "us-west-1",
      "us-west-2",
      "us-west-2-fips"
    ],
    regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "translate.{region}.amazonaws.com",
        tags: []
      },
      {
        hostname: "translate-fips.{region}.amazonaws.com",
        tags: ["fips"]
      },
      {
        hostname: "translate-fips.{region}.api.aws",
        tags: ["dualstack", "fips"]
      },
      {
        hostname: "translate.{region}.api.aws",
        tags: ["dualstack"]
      }
    ]
  },
  "aws-cn": {
    regions: ["cn-north-1", "cn-northwest-1"],
    regionRegex: "^cn\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "translate.{region}.amazonaws.com.cn",
        tags: []
      },
      {
        hostname: "translate-fips.{region}.amazonaws.com.cn",
        tags: ["fips"]
      },
      {
        hostname: "translate-fips.{region}.api.amazonwebservices.com.cn",
        tags: ["dualstack", "fips"]
      },
      {
        hostname: "translate.{region}.api.amazonwebservices.com.cn",
        tags: ["dualstack"]
      }
    ]
  },
  "aws-iso": {
    regions: ["us-iso-east-1", "us-iso-west-1"],
    regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "translate.{region}.c2s.ic.gov",
        tags: []
      },
      {
        hostname: "translate-fips.{region}.c2s.ic.gov",
        tags: ["fips"]
      }
    ]
  },
  "aws-iso-b": {
    regions: ["us-isob-east-1"],
    regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "translate.{region}.sc2s.sgov.gov",
        tags: []
      },
      {
        hostname: "translate-fips.{region}.sc2s.sgov.gov",
        tags: ["fips"]
      }
    ]
  },
  "aws-us-gov": {
    regions: ["us-gov-east-1", "us-gov-west-1", "us-gov-west-1-fips"],
    regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
    variants: [
      {
        hostname: "translate.{region}.amazonaws.com",
        tags: []
      },
      {
        hostname: "translate-fips.{region}.amazonaws.com",
        tags: ["fips"]
      },
      {
        hostname: "translate-fips.{region}.api.aws",
        tags: ["dualstack", "fips"]
      },
      {
        hostname: "translate.{region}.api.aws",
        tags: ["dualstack"]
      }
    ]
  }
};
var defaultRegionInfoProvider3 = function(region, options) {
  return __awaiter(void 0, void 0, void 0, function() {
    return __generator(this, function(_a) {
      return [2, getRegionInfo(region, __assign(__assign({}, options), { signingService: "translate", regionHash: regionHash3, partitionHash: partitionHash3 }))];
    });
  });
};

// node_modules/@aws-sdk/client-translate/dist-es/runtimeConfig.shared.js
var getRuntimeConfig5 = function(config) {
  var _a, _b, _c, _d, _e;
  return {
    apiVersion: "2017-07-01",
    disableHostPrefix: (_a = config === null || config === void 0 ? void 0 : config.disableHostPrefix) !== null && _a !== void 0 ? _a : false,
    logger: (_b = config === null || config === void 0 ? void 0 : config.logger) !== null && _b !== void 0 ? _b : {},
    regionInfoProvider: (_c = config === null || config === void 0 ? void 0 : config.regionInfoProvider) !== null && _c !== void 0 ? _c : defaultRegionInfoProvider3,
    serviceId: (_d = config === null || config === void 0 ? void 0 : config.serviceId) !== null && _d !== void 0 ? _d : "Translate",
    urlParser: (_e = config === null || config === void 0 ? void 0 : config.urlParser) !== null && _e !== void 0 ? _e : parseUrl
  };
};

// node_modules/@aws-sdk/client-translate/dist-es/runtimeConfig.js
var getRuntimeConfig6 = function(config) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
  emitWarningIfUnsupportedVersion(process.version);
  var defaultsMode = resolveDefaultsModeConfig(config);
  var defaultConfigProvider = function() {
    return defaultsMode().then(loadConfigsForDefaultMode);
  };
  var clientSharedValues = getRuntimeConfig5(config);
  return __assign(__assign(__assign({}, clientSharedValues), config), { runtime: "node", defaultsMode, base64Decoder: (_a = config === null || config === void 0 ? void 0 : config.base64Decoder) !== null && _a !== void 0 ? _a : fromBase64, base64Encoder: (_b = config === null || config === void 0 ? void 0 : config.base64Encoder) !== null && _b !== void 0 ? _b : toBase64, bodyLengthChecker: (_c = config === null || config === void 0 ? void 0 : config.bodyLengthChecker) !== null && _c !== void 0 ? _c : calculateBodyLength, credentialDefaultProvider: (_d = config === null || config === void 0 ? void 0 : config.credentialDefaultProvider) !== null && _d !== void 0 ? _d : decorateDefaultCredentialProvider2(defaultProvider), defaultUserAgentProvider: (_e = config === null || config === void 0 ? void 0 : config.defaultUserAgentProvider) !== null && _e !== void 0 ? _e : defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default2.version }), maxAttempts: (_f = config === null || config === void 0 ? void 0 : config.maxAttempts) !== null && _f !== void 0 ? _f : loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS), region: (_g = config === null || config === void 0 ? void 0 : config.region) !== null && _g !== void 0 ? _g : loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS), requestHandler: (_h = config === null || config === void 0 ? void 0 : config.requestHandler) !== null && _h !== void 0 ? _h : new NodeHttpHandler(defaultConfigProvider), retryMode: (_j = config === null || config === void 0 ? void 0 : config.retryMode) !== null && _j !== void 0 ? _j : loadConfig(__assign(__assign({}, NODE_RETRY_MODE_CONFIG_OPTIONS), { default: function() {
    return __awaiter(void 0, void 0, void 0, function() {
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            return [4, defaultConfigProvider()];
          case 1:
            return [2, _a2.sent().retryMode || DEFAULT_RETRY_MODE];
        }
      });
    });
  } })), sha256: (_k = config === null || config === void 0 ? void 0 : config.sha256) !== null && _k !== void 0 ? _k : Hash2.bind(null, "sha256"), streamCollector: (_l = config === null || config === void 0 ? void 0 : config.streamCollector) !== null && _l !== void 0 ? _l : streamCollector, useDualstackEndpoint: (_m = config === null || config === void 0 ? void 0 : config.useDualstackEndpoint) !== null && _m !== void 0 ? _m : loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS), useFipsEndpoint: (_o = config === null || config === void 0 ? void 0 : config.useFipsEndpoint) !== null && _o !== void 0 ? _o : loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS), utf8Decoder: (_p = config === null || config === void 0 ? void 0 : config.utf8Decoder) !== null && _p !== void 0 ? _p : fromUtf8, utf8Encoder: (_q = config === null || config === void 0 ? void 0 : config.utf8Encoder) !== null && _q !== void 0 ? _q : toUtf8 });
};

// node_modules/@aws-sdk/client-translate/dist-es/TranslateClient.js
var TranslateClient = function(_super) {
  __extends(TranslateClient2, _super);
  function TranslateClient2(configuration) {
    var _this = this;
    var _config_0 = getRuntimeConfig6(configuration);
    var _config_1 = resolveRegionConfig(_config_0);
    var _config_2 = resolveEndpointsConfig(_config_1);
    var _config_3 = resolveRetryConfig(_config_2);
    var _config_4 = resolveHostHeaderConfig(_config_3);
    var _config_5 = resolveAwsAuthConfig(_config_4);
    var _config_6 = resolveUserAgentConfig(_config_5);
    _this = _super.call(this, _config_6) || this;
    _this.config = _config_6;
    _this.middlewareStack.use(getRetryPlugin(_this.config));
    _this.middlewareStack.use(getContentLengthPlugin(_this.config));
    _this.middlewareStack.use(getHostHeaderPlugin(_this.config));
    _this.middlewareStack.use(getLoggerPlugin(_this.config));
    _this.middlewareStack.use(getRecursionDetectionPlugin(_this.config));
    _this.middlewareStack.use(getAwsAuthPlugin(_this.config));
    _this.middlewareStack.use(getUserAgentPlugin(_this.config));
    return _this;
  }
  TranslateClient2.prototype.destroy = function() {
    _super.prototype.destroy.call(this);
  };
  return TranslateClient2;
}(Client);

// src/translate/aws.ts
var AwsTranslateManager = class {
  constructor() {
    this.cli = new TranslateClient({});
    this.langCodes = [];
    this.sl = "auto";
    this.tl = "en";
  }
  async initialize(cfg) {
    const proxyAgent = getProxyAgent(cfg.proxy);
    this.cli = new TranslateClient({
      requestHandler: new NodeHttpHandler({
        connectionTimeout: cfg.timeout,
        httpAgent: proxyAgent,
        httpsAgent: proxyAgent
      })
    });
    const command = new ListLanguagesCommand({});
    const data = await this.cli.send(command);
    if (isUndefined_default(data.Languages)) {
      logger.error("failed to fetch available languages");
      throw new Error("failed to fetch available languages");
    }
    this.langCodes = compact_default(map_default(data.Languages, (v) => v.LanguageCode));
    this.sl = cfg.aws.sourceLanguageCode;
    this.tl = cfg.aws.targetLanguageCode;
    this.formality = {
      formal: Formality.FORMAL,
      informal: Formality.INFORMAL,
      none: void 0
    }[cfg.aws.formality];
    if (!includes_default(this.langCodes, this.sl)) {
      logger.error(`not supported language code: ${this.sl}`);
      throw new Error(`not supported language code: ${this.sl}`);
    }
    if (!includes_default(this.langCodes, this.tl)) {
      logger.error(`not supported language code: ${this.tl}`);
      throw new Error(`not supported language code: ${this.tl}`);
    }
  }
  async translate(text) {
    const params = {
      SourceLanguageCode: this.sl,
      TargetLanguageCode: this.tl,
      Text: text,
      Settings: {
        Formality: this.formality
      }
    };
    const command = new TranslateTextCommand(params);
    const data = await this.cli.send(command);
    if (isUndefined_default(data.TranslatedText)) {
      logger.error("translated text is empty");
      throw new Error("translated text is empty");
    }
    return data.TranslatedText;
  }
  static async create(config) {
    const o = new AwsTranslateManager();
    await o.initialize(config);
    return o;
  }
};

// src/translate/googleLangCodes.ts
var googleLangCodes = [
  "auto",
  "af",
  "sq",
  "am",
  "ar",
  "hy",
  "as",
  "ay",
  "az",
  "bm",
  "eu",
  "be",
  "bn",
  "bho",
  "bs",
  "bg",
  "ca",
  "ceb",
  "zh-CN",
  "zh",
  "zh-TW",
  "co",
  "hr",
  "cs",
  "da",
  "dv",
  "doi",
  "nl",
  "en",
  "eo",
  "et",
  "ee",
  "fil",
  "fi",
  "fr",
  "fy",
  "gl",
  "ka",
  "de",
  "el",
  "gn",
  "gu",
  "ht",
  "ha",
  "haw",
  "he",
  "iw",
  "hi",
  "hmn",
  "hu",
  "is",
  "ig",
  "ilo",
  "id",
  "ga",
  "it",
  "ja",
  "jv",
  "jw",
  "kn",
  "kk",
  "km",
  "rw",
  "gom",
  "ko",
  "kri",
  "ku",
  "ckb",
  "ky",
  "lo",
  "la",
  "lv",
  "ln",
  "lt",
  "lg",
  "lb",
  "mk",
  "mai",
  "mg",
  "ms",
  "ml",
  "mt",
  "mi",
  "mr",
  "mni-Mtei",
  "lus",
  "mn",
  "my",
  "ne",
  "no",
  "ny",
  "or",
  "om",
  "ps",
  "fa",
  "pl",
  "pt",
  "pa",
  "qu",
  "ro",
  "ru",
  "sm",
  "sa",
  "gd",
  "nso",
  "sr",
  "st",
  "sn",
  "sd",
  "si",
  "sk",
  "sl",
  "so",
  "es",
  "su",
  "sw",
  "sv",
  "tl",
  "tg",
  "ta",
  "tt",
  "te",
  "th",
  "ti",
  "ts",
  "tr",
  "tk",
  "ak",
  "uk",
  "ur",
  "ug",
  "uz",
  "vi",
  "cy",
  "xh",
  "yi",
  "yo",
  "zu"
];

// src/translate/google.ts
var GoogleTranslateManager = class {
  constructor() {
    this.cli = source_default2;
    this.host = "translate.googleapis.com";
    this.langCodes = [];
    this.sl = "auto";
    this.tl = "en";
  }
  async initialize(cfg) {
    this.cli = getGotInstance(cfg);
    this.langCodes = googleLangCodes;
    this.host = cfg.google.host;
    this.sl = cfg.google.sourceLanguageCode;
    this.tl = cfg.google.targetLanguageCode;
    if (!includes_default(this.langCodes, this.sl)) {
      logger.error(`not supported language code: ${this.sl}`);
      throw new Error(`not supported language code: ${this.sl}`);
    }
    if (!includes_default(this.langCodes, this.tl)) {
      logger.error(`not supported language code: ${this.tl}`);
      throw new Error(`not supported language code: ${this.tl}`);
    }
  }
  async translate(text) {
    const url2 = `https://${this.host}/translate_a/single?client=gtx&dj=1&sl=${this.sl}&tl=${this.tl}&ie=UTF-8&oe=UTF-8&source=icon&dt=t&dt=md&dt=ex&dt=ss&q=${encodeURIComponent(text)}`;
    const res = await this.cli.get(url2).json();
    logger.debug(`response: ${JSON.stringify(res, null, 2)}`);
    return res;
  }
  static async create(config) {
    const o = new GoogleTranslateManager();
    await o.initialize(config);
    return o;
  }
};

// src/index.ts
var TranslateManager = class {
  constructor(aws, google, cfg) {
    this.aws = aws;
    this.google = google;
    this.cfg = cfg;
  }
  async translate(rawText) {
    logger.debug("translate requested");
    const text = rawText.trim();
    if (isEmpty_default(text)) {
      logger.error("requested text is empty");
      throw new Error("requested text is empty");
    }
    logger.debug(`requested text (trimmed): ${text.slice(0, 20)}`);
    const docs = [];
    await Promise.all(
      map_default(uniq_default(this.cfg.providers), async (provider) => {
        if (provider === "aws" && this.aws) {
          const content = await this.aws.translate(text);
          docs.push({ filetype: "markdown", content: `translated by \`AWS\`:
${content}` });
        }
        if (provider === "google" && this.google) {
          const res = await this.google.translate(text);
          if (isEmpty_default(res.sentences)) {
            logger.error("failed to translate");
            throw new Error("failed to translate");
          }
          const content = res.sentences[0].trans;
          docs.push({ filetype: "markdown", content: `translated by \`Google\`:
${content}` });
          if (res.definitions) {
            const defs = map_default(res.definitions, (d) => {
              const def = map_default(d.entry, (entry, i) => {
                let entryStr = `  ${i + 1}. ${entry.gloss}`;
                if (res.examples) {
                  const examples = map_default(
                    filter_default(res.examples.example, (ex) => ex.definition_id === entry.definition_id),
                    (ex) => `     *ex)* ${ex.text.replace(text, `__${text}__`)}`
                  ).join("\n");
                  if (!isEmpty_default(examples)) {
                    entryStr += "\n" + examples;
                  }
                }
                return entryStr;
              }).join("\n");
              return `  \`[${d.pos}]\`
${def}
`;
            }).join("\n");
            docs.push({
              filetype: "markdown",
              content: `___definitions___
${defs}`
            });
          }
          if (res.examples) {
            const examples = map_default(
              res.examples.example,
              (e, i) => `  ${i + 1}. ${e.text.replace(text, `__${text}__`)}`
            ).join("\n");
            docs.push({ filetype: "markdown", content: `___examples___
${examples}` });
          }
        }
      })
    );
    return docs;
  }
};
async function activate(context) {
  await activateHelper(context);
  const cm = new ConfigManager();
  context.subscriptions.push(cm);
  const cfg = cm.cfg;
  if (!cfg.enable || isEmpty_default(cfg.providers)) {
    return;
  }
  logger.info(`${EXT_NAME} activated!`);
  logger.info(`configurations are applied: ${JSON.stringify(cfg, null, 2)}`);
  const ff = new import_coc17.FloatFactory(import_coc17.workspace.nvim);
  context.subscriptions.push(ff);
  let aws = null;
  let google = null;
  if (includes_default(cfg.providers, "aws")) {
    aws = await AwsTranslateManager.create(cfg);
  }
  if (includes_default(cfg.providers, "google")) {
    google = await GoogleTranslateManager.create(cfg);
  }
  const tm = new TranslateManager(aws, google, cfg);
  const floatConfig = {
    border: [1, 1, 1, 1]
  };
  context.subscriptions.push(
    import_coc17.workspace.registerKeymap(
      ["n"],
      "translate-word",
      async () => {
        const text = await getWordStr();
        try {
          const docs = await tm.translate(text);
          return ff.show(docs, floatConfig);
        } catch (e) {
          logger.error(e);
        }
      },
      { sync: false }
    ),
    import_coc17.workspace.registerKeymap(
      ["n"],
      "translate-line",
      async () => {
        const text = await getLineStr();
        try {
          const docs = await tm.translate(text);
          return ff.show(docs, floatConfig);
        } catch (e) {
          logger.error(e);
        }
      },
      { sync: false }
    ),
    import_coc17.workspace.registerKeymap(
      ["v"],
      "translate-selected",
      async () => {
        const text = await getVisualSelectedStr();
        try {
          const docs = await tm.translate(text);
          return ff.show(docs, floatConfig);
        } catch (e) {
          logger.error(e);
        }
      },
      { sync: false }
    )
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
