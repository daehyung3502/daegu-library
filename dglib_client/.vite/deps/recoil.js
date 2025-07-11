import {
  __toESM,
  require_react,
  require_react_dom
} from "./chunk-LORZZD4G.js";

// node_modules/recoil/es/index.js
var import_react = __toESM(require_react());
var import_react_dom = __toESM(require_react_dom());
function err(message) {
  const error = new Error(message);
  if (error.stack === void 0) {
    try {
      throw error;
    } catch (_) {
    }
  }
  return error;
}
var err_1 = err;
var Recoil_err = err_1;
function isPromise(p) {
  return !!p && typeof p.then === "function";
}
var Recoil_isPromise = isPromise;
function nullthrows(x, message) {
  if (x != null) {
    return x;
  }
  throw Recoil_err(message !== null && message !== void 0 ? message : "Got unexpected null or undefined");
}
var Recoil_nullthrows = nullthrows;
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var BaseLoadable = class {
  getValue() {
    throw Recoil_err("BaseLoadable");
  }
  toPromise() {
    throw Recoil_err("BaseLoadable");
  }
  valueMaybe() {
    throw Recoil_err("BaseLoadable");
  }
  valueOrThrow() {
    throw Recoil_err(`Loadable expected value, but in "${this.state}" state`);
  }
  promiseMaybe() {
    throw Recoil_err("BaseLoadable");
  }
  promiseOrThrow() {
    throw Recoil_err(`Loadable expected promise, but in "${this.state}" state`);
  }
  errorMaybe() {
    throw Recoil_err("BaseLoadable");
  }
  errorOrThrow() {
    throw Recoil_err(`Loadable expected error, but in "${this.state}" state`);
  }
  is(other) {
    return other.state === this.state && other.contents === this.contents;
  }
  map(_map) {
    throw Recoil_err("BaseLoadable");
  }
};
var ValueLoadable = class extends BaseLoadable {
  constructor(value) {
    super();
    _defineProperty(this, "state", "hasValue");
    _defineProperty(this, "contents", void 0);
    this.contents = value;
  }
  getValue() {
    return this.contents;
  }
  toPromise() {
    return Promise.resolve(this.contents);
  }
  valueMaybe() {
    return this.contents;
  }
  valueOrThrow() {
    return this.contents;
  }
  promiseMaybe() {
    return void 0;
  }
  errorMaybe() {
    return void 0;
  }
  map(map) {
    try {
      const next = map(this.contents);
      return Recoil_isPromise(next) ? loadableWithPromise(next) : isLoadable(next) ? next : loadableWithValue(next);
    } catch (e) {
      return Recoil_isPromise(e) ? (
        // If we "suspended", then try again.
        // errors and subsequent retries will be handled in 'loading' case
        // $FlowFixMe[prop-missing]
        loadableWithPromise(e.next(() => this.map(map)))
      ) : loadableWithError(e);
    }
  }
};
var ErrorLoadable = class extends BaseLoadable {
  constructor(error) {
    super();
    _defineProperty(this, "state", "hasError");
    _defineProperty(this, "contents", void 0);
    this.contents = error;
  }
  getValue() {
    throw this.contents;
  }
  toPromise() {
    return Promise.reject(this.contents);
  }
  valueMaybe() {
    return void 0;
  }
  promiseMaybe() {
    return void 0;
  }
  errorMaybe() {
    return this.contents;
  }
  errorOrThrow() {
    return this.contents;
  }
  map(_map) {
    return this;
  }
};
var LoadingLoadable = class extends BaseLoadable {
  constructor(promise) {
    super();
    _defineProperty(this, "state", "loading");
    _defineProperty(this, "contents", void 0);
    this.contents = promise;
  }
  getValue() {
    throw this.contents;
  }
  toPromise() {
    return this.contents;
  }
  valueMaybe() {
    return void 0;
  }
  promiseMaybe() {
    return this.contents;
  }
  promiseOrThrow() {
    return this.contents;
  }
  errorMaybe() {
    return void 0;
  }
  map(map) {
    return loadableWithPromise(this.contents.then((value) => {
      const next = map(value);
      if (isLoadable(next)) {
        const nextLoadable = next;
        switch (nextLoadable.state) {
          case "hasValue":
            return nextLoadable.contents;
          case "hasError":
            throw nextLoadable.contents;
          case "loading":
            return nextLoadable.contents;
        }
      }
      return next;
    }).catch((e) => {
      if (Recoil_isPromise(e)) {
        return e.then(() => this.map(map).contents);
      }
      throw e;
    }));
  }
};
function loadableWithValue(value) {
  return Object.freeze(new ValueLoadable(value));
}
function loadableWithError(error) {
  return Object.freeze(new ErrorLoadable(error));
}
function loadableWithPromise(promise) {
  return Object.freeze(new LoadingLoadable(promise));
}
function loadableLoading() {
  return Object.freeze(new LoadingLoadable(new Promise(() => {
  })));
}
function loadableAllArray(inputs) {
  return inputs.every((i) => i.state === "hasValue") ? loadableWithValue(inputs.map((i) => i.contents)) : inputs.some((i) => i.state === "hasError") ? loadableWithError(Recoil_nullthrows(inputs.find((i) => i.state === "hasError"), "Invalid loadable passed to loadableAll").contents) : loadableWithPromise(Promise.all(inputs.map((i) => i.contents)));
}
function loadableAll(inputs) {
  const unwrapedInputs = Array.isArray(inputs) ? inputs : Object.getOwnPropertyNames(inputs).map((key) => inputs[key]);
  const normalizedInputs = unwrapedInputs.map((x) => isLoadable(x) ? x : Recoil_isPromise(x) ? loadableWithPromise(x) : loadableWithValue(x));
  const output = loadableAllArray(normalizedInputs);
  return Array.isArray(inputs) ? (
    // $FlowIssue[incompatible-return]
    output
  ) : (
    // Object.getOwnPropertyNames() has consistent key ordering with ES6
    // $FlowIssue[incompatible-call]
    output.map((outputs) => Object.getOwnPropertyNames(inputs).reduce(
      // $FlowFixMe[invalid-computed-prop]
      (out, key, idx) => ({
        ...out,
        [key]: outputs[idx]
      }),
      {}
    ))
  );
}
function isLoadable(x) {
  return x instanceof BaseLoadable;
}
var LoadableStaticInterface = {
  of: (value) => Recoil_isPromise(value) ? loadableWithPromise(value) : isLoadable(value) ? value : loadableWithValue(value),
  error: (error) => loadableWithError(error),
  // $FlowIssue[incompatible-return]
  loading: () => loadableLoading(),
  // $FlowIssue[unclear-type]
  all: loadableAll,
  isLoadable
};
var Recoil_Loadable = {
  loadableWithValue,
  loadableWithError,
  loadableWithPromise,
  loadableLoading,
  loadableAll,
  isLoadable,
  RecoilLoadable: LoadableStaticInterface
};
var Recoil_Loadable_1 = Recoil_Loadable.loadableWithValue;
var Recoil_Loadable_2 = Recoil_Loadable.loadableWithError;
var Recoil_Loadable_3 = Recoil_Loadable.loadableWithPromise;
var Recoil_Loadable_4 = Recoil_Loadable.loadableLoading;
var Recoil_Loadable_5 = Recoil_Loadable.loadableAll;
var Recoil_Loadable_6 = Recoil_Loadable.isLoadable;
var Recoil_Loadable_7 = Recoil_Loadable.RecoilLoadable;
var Recoil_Loadable$1 = Object.freeze({
  __proto__: null,
  loadableWithValue: Recoil_Loadable_1,
  loadableWithError: Recoil_Loadable_2,
  loadableWithPromise: Recoil_Loadable_3,
  loadableLoading: Recoil_Loadable_4,
  loadableAll: Recoil_Loadable_5,
  isLoadable: Recoil_Loadable_6,
  RecoilLoadable: Recoil_Loadable_7
});
var env = {
  RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: true,
  // Note: RECOIL_GKS_ENABLED settings will only be honored in OSS builds of Recoil
  RECOIL_GKS_ENABLED: /* @__PURE__ */ new Set(["recoil_hamt_2020", "recoil_sync_external_store", "recoil_suppress_rerender_in_callback", "recoil_memory_managament_2020"])
};
function readProcessEnvBooleanFlag(name, set) {
  var _process$env$name, _process$env$name$toL;
  const sanitizedValue = (_process$env$name = process.env[name]) === null || _process$env$name === void 0 ? void 0 : (_process$env$name$toL = _process$env$name.toLowerCase()) === null || _process$env$name$toL === void 0 ? void 0 : _process$env$name$toL.trim();
  if (sanitizedValue == null || sanitizedValue === "") {
    return;
  }
  const allowedValues = ["true", "false"];
  if (!allowedValues.includes(sanitizedValue)) {
    throw Recoil_err(`process.env.${name} value must be 'true', 'false', or empty: ${sanitizedValue}`);
  }
  set(sanitizedValue === "true");
}
function readProcessEnvStringArrayFlag(name, set) {
  var _process$env$name2;
  const sanitizedValue = (_process$env$name2 = process.env[name]) === null || _process$env$name2 === void 0 ? void 0 : _process$env$name2.trim();
  if (sanitizedValue == null || sanitizedValue === "") {
    return;
  }
  set(sanitizedValue.split(/\s*,\s*|\s+/));
}
function applyProcessEnvFlagOverrides() {
  var _process;
  if (typeof process === "undefined") {
    return;
  }
  if (((_process = process) === null || _process === void 0 ? void 0 : _process.env) == null) {
    return;
  }
  readProcessEnvBooleanFlag("RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED", (value) => {
    env.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = value;
  });
  readProcessEnvStringArrayFlag("RECOIL_GKS_ENABLED", (value) => {
    value.forEach((gk) => {
      env.RECOIL_GKS_ENABLED.add(gk);
    });
  });
}
applyProcessEnvFlagOverrides();
var Recoil_RecoilEnv = env;
function Recoil_gkx_OSS(gk) {
  return Recoil_RecoilEnv.RECOIL_GKS_ENABLED.has(gk);
}
Recoil_gkx_OSS.setPass = (gk) => {
  Recoil_RecoilEnv.RECOIL_GKS_ENABLED.add(gk);
};
Recoil_gkx_OSS.setFail = (gk) => {
  Recoil_RecoilEnv.RECOIL_GKS_ENABLED.delete(gk);
};
Recoil_gkx_OSS.clear = () => {
  Recoil_RecoilEnv.RECOIL_GKS_ENABLED.clear();
};
var Recoil_gkx = Recoil_gkx_OSS;
function recoverableViolation(message, _projectName, {
  error
} = {}) {
  if (true) {
    console.error(message, error);
  }
  return null;
}
var recoverableViolation_1 = recoverableViolation;
var Recoil_recoverableViolation = recoverableViolation_1;
var _createMutableSource;
var _useMutableSource;
var _useSyncExternalStore;
var createMutableSource = (
  // flowlint-next-line unclear-type:off
  (_createMutableSource = import_react.default.createMutableSource) !== null && _createMutableSource !== void 0 ? _createMutableSource : import_react.default.unstable_createMutableSource
);
var useMutableSource = (
  // flowlint-next-line unclear-type:off
  (_useMutableSource = import_react.default.useMutableSource) !== null && _useMutableSource !== void 0 ? _useMutableSource : import_react.default.unstable_useMutableSource
);
var useSyncExternalStore = (
  // flowlint-next-line unclear-type:off
  (_useSyncExternalStore = import_react.default.useSyncExternalStore) !== null && _useSyncExternalStore !== void 0 ? _useSyncExternalStore : (
    // flowlint-next-line unclear-type:off
    import_react.default.unstable_useSyncExternalStore
  )
);
var ReactRendererVersionMismatchWarnOnce = false;
function currentRendererSupportsUseSyncExternalStore() {
  var _ReactCurrentDispatch;
  const {
    ReactCurrentDispatcher,
    ReactCurrentOwner
  } = (
    /* $FlowFixMe[prop-missing] This workaround was approved as a safer mechanism
     * to detect if the current renderer supports useSyncExternalStore()
     * https://fb.workplace.com/groups/reactjs/posts/9558682330846963/ */
    import_react.default.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
  );
  const dispatcher = (_ReactCurrentDispatch = ReactCurrentDispatcher === null || ReactCurrentDispatcher === void 0 ? void 0 : ReactCurrentDispatcher.current) !== null && _ReactCurrentDispatch !== void 0 ? _ReactCurrentDispatch : ReactCurrentOwner.currentDispatcher;
  const isUseSyncExternalStoreSupported = dispatcher.useSyncExternalStore != null;
  if (useSyncExternalStore && !isUseSyncExternalStoreSupported && !ReactRendererVersionMismatchWarnOnce) {
    ReactRendererVersionMismatchWarnOnce = true;
    Recoil_recoverableViolation("A React renderer without React 18+ API support is being used with React 18+.");
  }
  return isUseSyncExternalStoreSupported;
}
function reactMode() {
  if (Recoil_gkx("recoil_transition_support")) {
    return {
      mode: "TRANSITION_SUPPORT",
      early: true,
      concurrent: true
    };
  }
  if (Recoil_gkx("recoil_sync_external_store") && useSyncExternalStore != null) {
    return {
      mode: "SYNC_EXTERNAL_STORE",
      early: true,
      concurrent: false
    };
  }
  if (Recoil_gkx("recoil_mutable_source") && useMutableSource != null && typeof window !== "undefined" && !window.$disableRecoilValueMutableSource_TEMP_HACK_DO_NOT_USE) {
    return Recoil_gkx("recoil_suppress_rerender_in_callback") ? {
      mode: "MUTABLE_SOURCE",
      early: true,
      concurrent: true
    } : {
      mode: "MUTABLE_SOURCE",
      early: false,
      concurrent: false
    };
  }
  return Recoil_gkx("recoil_suppress_rerender_in_callback") ? {
    mode: "LEGACY",
    early: true,
    concurrent: false
  } : {
    mode: "LEGACY",
    early: false,
    concurrent: false
  };
}
function isFastRefreshEnabled() {
  return false;
}
var Recoil_ReactMode = {
  createMutableSource,
  useMutableSource,
  useSyncExternalStore,
  currentRendererSupportsUseSyncExternalStore,
  reactMode,
  isFastRefreshEnabled
};
var AbstractRecoilValue = class {
  constructor(newKey) {
    _defineProperty(this, "key", void 0);
    this.key = newKey;
  }
  toJSON() {
    return {
      key: this.key
    };
  }
};
var RecoilState = class extends AbstractRecoilValue {
};
var RecoilValueReadOnly = class extends AbstractRecoilValue {
};
function isRecoilValue(x) {
  return x instanceof RecoilState || x instanceof RecoilValueReadOnly;
}
var Recoil_RecoilValue = {
  AbstractRecoilValue,
  RecoilState,
  RecoilValueReadOnly,
  isRecoilValue
};
var Recoil_RecoilValue_1 = Recoil_RecoilValue.AbstractRecoilValue;
var Recoil_RecoilValue_2 = Recoil_RecoilValue.RecoilState;
var Recoil_RecoilValue_3 = Recoil_RecoilValue.RecoilValueReadOnly;
var Recoil_RecoilValue_4 = Recoil_RecoilValue.isRecoilValue;
var Recoil_RecoilValue$1 = Object.freeze({
  __proto__: null,
  AbstractRecoilValue: Recoil_RecoilValue_1,
  RecoilState: Recoil_RecoilValue_2,
  RecoilValueReadOnly: Recoil_RecoilValue_3,
  isRecoilValue: Recoil_RecoilValue_4
});
function sprintf(format, ...args) {
  let index = 0;
  return format.replace(/%s/g, () => String(args[index++]));
}
var sprintf_1 = sprintf;
function expectationViolation(format, ...args) {
  if (true) {
    const message = sprintf_1.call(null, format, ...args);
    const error = new Error(message);
    error.name = "Expectation Violation";
    console.error(error);
  }
}
var expectationViolation_1 = expectationViolation;
var Recoil_expectationViolation = expectationViolation_1;
function mapIterable(iterable, callback) {
  return function* () {
    let index = 0;
    for (const value of iterable) {
      yield callback(value, index++);
    }
  }();
}
var Recoil_mapIterable = mapIterable;
var {
  isFastRefreshEnabled: isFastRefreshEnabled$1
} = Recoil_ReactMode;
var DefaultValue = class {
};
var DEFAULT_VALUE = new DefaultValue();
var nodes = /* @__PURE__ */ new Map();
var recoilValues = /* @__PURE__ */ new Map();
function recoilValuesForKeys(keys) {
  return Recoil_mapIterable(keys, (key) => Recoil_nullthrows(recoilValues.get(key)));
}
function checkForDuplicateAtomKey(key) {
  if (nodes.has(key)) {
    const message = `Duplicate atom key "${key}". This is a FATAL ERROR in
      production. But it is safe to ignore this warning if it occurred because of
      hot module replacement.`;
    if (true) {
      if (!isFastRefreshEnabled$1()) {
        Recoil_expectationViolation(message, "recoil");
      }
    } else {
      console.warn(message);
    }
  }
}
function registerNode(node) {
  if (Recoil_RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED) {
    checkForDuplicateAtomKey(node.key);
  }
  nodes.set(node.key, node);
  const recoilValue = node.set == null ? new Recoil_RecoilValue$1.RecoilValueReadOnly(node.key) : new Recoil_RecoilValue$1.RecoilState(node.key);
  recoilValues.set(node.key, recoilValue);
  return recoilValue;
}
var NodeMissingError = class extends Error {
};
function getNode(key) {
  const node = nodes.get(key);
  if (node == null) {
    throw new NodeMissingError(`Missing definition for RecoilValue: "${key}""`);
  }
  return node;
}
function getNodeMaybe(key) {
  return nodes.get(key);
}
var configDeletionHandlers = /* @__PURE__ */ new Map();
function deleteNodeConfigIfPossible(key) {
  var _node$shouldDeleteCon;
  if (!Recoil_gkx("recoil_memory_managament_2020")) {
    return;
  }
  const node = nodes.get(key);
  if (node !== null && node !== void 0 && (_node$shouldDeleteCon = node.shouldDeleteConfigOnRelease) !== null && _node$shouldDeleteCon !== void 0 && _node$shouldDeleteCon.call(node)) {
    var _getConfigDeletionHan;
    nodes.delete(key);
    (_getConfigDeletionHan = getConfigDeletionHandler(key)) === null || _getConfigDeletionHan === void 0 ? void 0 : _getConfigDeletionHan();
    configDeletionHandlers.delete(key);
  }
}
function setConfigDeletionHandler(key, fn) {
  if (!Recoil_gkx("recoil_memory_managament_2020")) {
    return;
  }
  if (fn === void 0) {
    configDeletionHandlers.delete(key);
  } else {
    configDeletionHandlers.set(key, fn);
  }
}
function getConfigDeletionHandler(key) {
  return configDeletionHandlers.get(key);
}
var Recoil_Node = {
  nodes,
  recoilValues,
  registerNode,
  getNode,
  getNodeMaybe,
  deleteNodeConfigIfPossible,
  setConfigDeletionHandler,
  getConfigDeletionHandler,
  recoilValuesForKeys,
  NodeMissingError,
  DefaultValue,
  DEFAULT_VALUE
};
function enqueueExecution(s, f) {
  f();
}
var Recoil_Queue = {
  enqueueExecution
};
function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}
var hamt_1 = createCommonjsModule(function(module) {
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  var hamt = {};
  var SIZE = 5;
  var BUCKET_SIZE = Math.pow(2, SIZE);
  var MASK = BUCKET_SIZE - 1;
  var MAX_INDEX_NODE = BUCKET_SIZE / 2;
  var MIN_ARRAY_NODE = BUCKET_SIZE / 4;
  var nothing = {};
  var constant = function constant2(x) {
    return function() {
      return x;
    };
  };
  var hash = hamt.hash = function(str) {
    var type = typeof str === "undefined" ? "undefined" : _typeof(str);
    if (type === "number") return str;
    if (type !== "string") str += "";
    var hash2 = 0;
    for (var i = 0, len = str.length; i < len; ++i) {
      var c = str.charCodeAt(i);
      hash2 = (hash2 << 5) - hash2 + c | 0;
    }
    return hash2;
  };
  var popcount = function popcount2(x) {
    x -= x >> 1 & 1431655765;
    x = (x & 858993459) + (x >> 2 & 858993459);
    x = x + (x >> 4) & 252645135;
    x += x >> 8;
    x += x >> 16;
    return x & 127;
  };
  var hashFragment = function hashFragment2(shift, h) {
    return h >>> shift & MASK;
  };
  var toBitmap = function toBitmap2(x) {
    return 1 << x;
  };
  var fromBitmap = function fromBitmap2(bitmap, bit) {
    return popcount(bitmap & bit - 1);
  };
  var arrayUpdate = function arrayUpdate2(mutate2, at, v, arr) {
    var out = arr;
    if (!mutate2) {
      var len = arr.length;
      out = new Array(len);
      for (var i = 0; i < len; ++i) {
        out[i] = arr[i];
      }
    }
    out[at] = v;
    return out;
  };
  var arraySpliceOut = function arraySpliceOut2(mutate2, at, arr) {
    var newLen = arr.length - 1;
    var i = 0;
    var g = 0;
    var out = arr;
    if (mutate2) {
      i = g = at;
    } else {
      out = new Array(newLen);
      while (i < at) {
        out[g++] = arr[i++];
      }
    }
    ++i;
    while (i <= newLen) {
      out[g++] = arr[i++];
    }
    if (mutate2) {
      out.length = newLen;
    }
    return out;
  };
  var arraySpliceIn = function arraySpliceIn2(mutate2, at, v, arr) {
    var len = arr.length;
    if (mutate2) {
      var _i = len;
      while (_i >= at) {
        arr[_i--] = arr[_i];
      }
      arr[at] = v;
      return arr;
    }
    var i = 0, g = 0;
    var out = new Array(len + 1);
    while (i < at) {
      out[g++] = arr[i++];
    }
    out[at] = v;
    while (i < len) {
      out[++g] = arr[i++];
    }
    return out;
  };
  var LEAF = 1;
  var COLLISION = 2;
  var INDEX = 3;
  var ARRAY = 4;
  var empty = {
    __hamt_isEmpty: true
  };
  var isEmptyNode = function isEmptyNode2(x) {
    return x === empty || x && x.__hamt_isEmpty;
  };
  var Leaf = function Leaf2(edit, hash2, key, value) {
    return {
      type: LEAF,
      edit,
      hash: hash2,
      key,
      value,
      _modify: Leaf__modify
    };
  };
  var Collision = function Collision2(edit, hash2, children) {
    return {
      type: COLLISION,
      edit,
      hash: hash2,
      children,
      _modify: Collision__modify
    };
  };
  var IndexedNode = function IndexedNode2(edit, mask, children) {
    return {
      type: INDEX,
      edit,
      mask,
      children,
      _modify: IndexedNode__modify
    };
  };
  var ArrayNode = function ArrayNode2(edit, size, children) {
    return {
      type: ARRAY,
      edit,
      size,
      children,
      _modify: ArrayNode__modify
    };
  };
  var isLeaf = function isLeaf2(node) {
    return node === empty || node.type === LEAF || node.type === COLLISION;
  };
  var expand = function expand2(edit, frag, child, bitmap, subNodes) {
    var arr = [];
    var bit = bitmap;
    var count2 = 0;
    for (var i = 0; bit; ++i) {
      if (bit & 1) arr[i] = subNodes[count2++];
      bit >>>= 1;
    }
    arr[frag] = child;
    return ArrayNode(edit, count2 + 1, arr);
  };
  var pack = function pack2(edit, count2, removed, elements) {
    var children = new Array(count2 - 1);
    var g = 0;
    var bitmap = 0;
    for (var i = 0, len = elements.length; i < len; ++i) {
      if (i !== removed) {
        var elem = elements[i];
        if (elem && !isEmptyNode(elem)) {
          children[g++] = elem;
          bitmap |= 1 << i;
        }
      }
    }
    return IndexedNode(edit, bitmap, children);
  };
  var mergeLeaves = function mergeLeaves2(edit, shift, h1, n1, h2, n2) {
    if (h1 === h2) return Collision(edit, h1, [n2, n1]);
    var subH1 = hashFragment(shift, h1);
    var subH2 = hashFragment(shift, h2);
    return IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), subH1 === subH2 ? [mergeLeaves2(edit, shift + SIZE, h1, n1, h2, n2)] : subH1 < subH2 ? [n1, n2] : [n2, n1]);
  };
  var updateCollisionList = function updateCollisionList2(mutate2, edit, keyEq, h, list, f, k, size) {
    var len = list.length;
    for (var i = 0; i < len; ++i) {
      var child = list[i];
      if (keyEq(k, child.key)) {
        var value = child.value;
        var _newValue = f(value);
        if (_newValue === value) return list;
        if (_newValue === nothing) {
          --size.value;
          return arraySpliceOut(mutate2, i, list);
        }
        return arrayUpdate(mutate2, i, Leaf(edit, h, k, _newValue), list);
      }
    }
    var newValue = f();
    if (newValue === nothing) return list;
    ++size.value;
    return arrayUpdate(mutate2, len, Leaf(edit, h, k, newValue), list);
  };
  var canEditNode = function canEditNode2(edit, node) {
    return edit === node.edit;
  };
  var Leaf__modify = function Leaf__modify2(edit, keyEq, shift, f, h, k, size) {
    if (keyEq(k, this.key)) {
      var _v = f(this.value);
      if (_v === this.value) return this;
      else if (_v === nothing) {
        --size.value;
        return empty;
      }
      if (canEditNode(edit, this)) {
        this.value = _v;
        return this;
      }
      return Leaf(edit, h, k, _v);
    }
    var v = f();
    if (v === nothing) return this;
    ++size.value;
    return mergeLeaves(edit, shift, this.hash, this, h, Leaf(edit, h, k, v));
  };
  var Collision__modify = function Collision__modify2(edit, keyEq, shift, f, h, k, size) {
    if (h === this.hash) {
      var canEdit = canEditNode(edit, this);
      var list = updateCollisionList(canEdit, edit, keyEq, this.hash, this.children, f, k, size);
      if (list === this.children) return this;
      return list.length > 1 ? Collision(edit, this.hash, list) : list[0];
    }
    var v = f();
    if (v === nothing) return this;
    ++size.value;
    return mergeLeaves(edit, shift, this.hash, this, h, Leaf(edit, h, k, v));
  };
  var IndexedNode__modify = function IndexedNode__modify2(edit, keyEq, shift, f, h, k, size) {
    var mask = this.mask;
    var children = this.children;
    var frag = hashFragment(shift, h);
    var bit = toBitmap(frag);
    var indx = fromBitmap(mask, bit);
    var exists = mask & bit;
    var current = exists ? children[indx] : empty;
    var child = current._modify(edit, keyEq, shift + SIZE, f, h, k, size);
    if (current === child) return this;
    var canEdit = canEditNode(edit, this);
    var bitmap = mask;
    var newChildren = void 0;
    if (exists && isEmptyNode(child)) {
      bitmap &= ~bit;
      if (!bitmap) return empty;
      if (children.length <= 2 && isLeaf(children[indx ^ 1])) return children[indx ^ 1];
      newChildren = arraySpliceOut(canEdit, indx, children);
    } else if (!exists && !isEmptyNode(child)) {
      if (children.length >= MAX_INDEX_NODE) return expand(edit, frag, child, mask, children);
      bitmap |= bit;
      newChildren = arraySpliceIn(canEdit, indx, child, children);
    } else {
      newChildren = arrayUpdate(canEdit, indx, child, children);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return IndexedNode(edit, bitmap, newChildren);
  };
  var ArrayNode__modify = function ArrayNode__modify2(edit, keyEq, shift, f, h, k, size) {
    var count2 = this.size;
    var children = this.children;
    var frag = hashFragment(shift, h);
    var child = children[frag];
    var newChild = (child || empty)._modify(edit, keyEq, shift + SIZE, f, h, k, size);
    if (child === newChild) return this;
    var canEdit = canEditNode(edit, this);
    var newChildren = void 0;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
      ++count2;
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
      --count2;
      if (count2 <= MIN_ARRAY_NODE) return pack(edit, count2, frag, children);
      newChildren = arrayUpdate(canEdit, frag, empty, children);
    } else {
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    }
    if (canEdit) {
      this.size = count2;
      this.children = newChildren;
      return this;
    }
    return ArrayNode(edit, count2, newChildren);
  };
  empty._modify = function(edit, keyEq, shift, f, h, k, size) {
    var v = f();
    if (v === nothing) return empty;
    ++size.value;
    return Leaf(edit, h, k, v);
  };
  function Map2(editable, edit, config, root, size) {
    this._editable = editable;
    this._edit = edit;
    this._config = config;
    this._root = root;
    this._size = size;
  }
  Map2.prototype.setTree = function(newRoot, newSize) {
    if (this._editable) {
      this._root = newRoot;
      this._size = newSize;
      return this;
    }
    return newRoot === this._root ? this : new Map2(this._editable, this._edit, this._config, newRoot, newSize);
  };
  var tryGetHash = hamt.tryGetHash = function(alt, hash2, key, map) {
    var node = map._root;
    var shift = 0;
    var keyEq = map._config.keyEq;
    while (true) {
      switch (node.type) {
        case LEAF: {
          return keyEq(key, node.key) ? node.value : alt;
        }
        case COLLISION: {
          if (hash2 === node.hash) {
            var children = node.children;
            for (var i = 0, len = children.length; i < len; ++i) {
              var child = children[i];
              if (keyEq(key, child.key)) return child.value;
            }
          }
          return alt;
        }
        case INDEX: {
          var frag = hashFragment(shift, hash2);
          var bit = toBitmap(frag);
          if (node.mask & bit) {
            node = node.children[fromBitmap(node.mask, bit)];
            shift += SIZE;
            break;
          }
          return alt;
        }
        case ARRAY: {
          node = node.children[hashFragment(shift, hash2)];
          if (node) {
            shift += SIZE;
            break;
          }
          return alt;
        }
        default:
          return alt;
      }
    }
  };
  Map2.prototype.tryGetHash = function(alt, hash2, key) {
    return tryGetHash(alt, hash2, key, this);
  };
  var tryGet = hamt.tryGet = function(alt, key, map) {
    return tryGetHash(alt, map._config.hash(key), key, map);
  };
  Map2.prototype.tryGet = function(alt, key) {
    return tryGet(alt, key, this);
  };
  var getHash = hamt.getHash = function(hash2, key, map) {
    return tryGetHash(void 0, hash2, key, map);
  };
  Map2.prototype.getHash = function(hash2, key) {
    return getHash(hash2, key, this);
  };
  var get = hamt.get = function(key, map) {
    return tryGetHash(void 0, map._config.hash(key), key, map);
  };
  Map2.prototype.get = function(key, alt) {
    return tryGet(alt, key, this);
  };
  var hasHash = hamt.has = function(hash2, key, map) {
    return tryGetHash(nothing, hash2, key, map) !== nothing;
  };
  Map2.prototype.hasHash = function(hash2, key) {
    return hasHash(hash2, key, this);
  };
  var has = hamt.has = function(key, map) {
    return hasHash(map._config.hash(key), key, map);
  };
  Map2.prototype.has = function(key) {
    return has(key, this);
  };
  var defKeyCompare = function defKeyCompare2(x, y) {
    return x === y;
  };
  hamt.make = function(config) {
    return new Map2(0, 0, {
      keyEq: config && config.keyEq || defKeyCompare,
      hash: config && config.hash || hash
    }, empty, 0);
  };
  hamt.empty = hamt.make();
  var isEmpty = hamt.isEmpty = function(map) {
    return map && !!isEmptyNode(map._root);
  };
  Map2.prototype.isEmpty = function() {
    return isEmpty(this);
  };
  var modifyHash = hamt.modifyHash = function(f, hash2, key, map) {
    var size = {
      value: map._size
    };
    var newRoot = map._root._modify(map._editable ? map._edit : NaN, map._config.keyEq, 0, f, hash2, key, size);
    return map.setTree(newRoot, size.value);
  };
  Map2.prototype.modifyHash = function(hash2, key, f) {
    return modifyHash(f, hash2, key, this);
  };
  var modify = hamt.modify = function(f, key, map) {
    return modifyHash(f, map._config.hash(key), key, map);
  };
  Map2.prototype.modify = function(key, f) {
    return modify(f, key, this);
  };
  var setHash = hamt.setHash = function(hash2, key, value, map) {
    return modifyHash(constant(value), hash2, key, map);
  };
  Map2.prototype.setHash = function(hash2, key, value) {
    return setHash(hash2, key, value, this);
  };
  var set = hamt.set = function(key, value, map) {
    return setHash(map._config.hash(key), key, value, map);
  };
  Map2.prototype.set = function(key, value) {
    return set(key, value, this);
  };
  var del = constant(nothing);
  var removeHash = hamt.removeHash = function(hash2, key, map) {
    return modifyHash(del, hash2, key, map);
  };
  Map2.prototype.removeHash = Map2.prototype.deleteHash = function(hash2, key) {
    return removeHash(hash2, key, this);
  };
  var remove = hamt.remove = function(key, map) {
    return removeHash(map._config.hash(key), key, map);
  };
  Map2.prototype.remove = Map2.prototype.delete = function(key) {
    return remove(key, this);
  };
  var beginMutation = hamt.beginMutation = function(map) {
    return new Map2(map._editable + 1, map._edit + 1, map._config, map._root, map._size);
  };
  Map2.prototype.beginMutation = function() {
    return beginMutation(this);
  };
  var endMutation = hamt.endMutation = function(map) {
    map._editable = map._editable && map._editable - 1;
    return map;
  };
  Map2.prototype.endMutation = function() {
    return endMutation(this);
  };
  var mutate = hamt.mutate = function(f, map) {
    var transient = beginMutation(map);
    f(transient);
    return endMutation(transient);
  };
  Map2.prototype.mutate = function(f) {
    return mutate(f, this);
  };
  var appk = function appk2(k) {
    return k && lazyVisitChildren(k[0], k[1], k[2], k[3], k[4]);
  };
  var lazyVisitChildren = function lazyVisitChildren2(len, children, i, f, k) {
    while (i < len) {
      var child = children[i++];
      if (child && !isEmptyNode(child)) return lazyVisit(child, f, [len, children, i, f, k]);
    }
    return appk(k);
  };
  var lazyVisit = function lazyVisit2(node, f, k) {
    switch (node.type) {
      case LEAF:
        return {
          value: f(node),
          rest: k
        };
      case COLLISION:
      case ARRAY:
      case INDEX:
        var children = node.children;
        return lazyVisitChildren(children.length, children, 0, f, k);
      default:
        return appk(k);
    }
  };
  var DONE = {
    done: true
  };
  function MapIterator(v) {
    this.v = v;
  }
  MapIterator.prototype.next = function() {
    if (!this.v) return DONE;
    var v0 = this.v;
    this.v = appk(v0.rest);
    return v0;
  };
  MapIterator.prototype[Symbol.iterator] = function() {
    return this;
  };
  var visit = function visit2(map, f) {
    return new MapIterator(lazyVisit(map._root, f));
  };
  var buildPairs = function buildPairs2(x) {
    return [x.key, x.value];
  };
  var entries = hamt.entries = function(map) {
    return visit(map, buildPairs);
  };
  Map2.prototype.entries = Map2.prototype[Symbol.iterator] = function() {
    return entries(this);
  };
  var buildKeys = function buildKeys2(x) {
    return x.key;
  };
  var keys = hamt.keys = function(map) {
    return visit(map, buildKeys);
  };
  Map2.prototype.keys = function() {
    return keys(this);
  };
  var buildValues = function buildValues2(x) {
    return x.value;
  };
  var values = hamt.values = Map2.prototype.values = function(map) {
    return visit(map, buildValues);
  };
  Map2.prototype.values = function() {
    return values(this);
  };
  var fold = hamt.fold = function(f, z, m) {
    var root = m._root;
    if (root.type === LEAF) return f(z, root.value, root.key);
    var toVisit = [root.children];
    var children = void 0;
    while (children = toVisit.pop()) {
      for (var i = 0, len = children.length; i < len; ) {
        var child = children[i++];
        if (child && child.type) {
          if (child.type === LEAF) z = f(z, child.value, child.key);
          else toVisit.push(child.children);
        }
      }
    }
    return z;
  };
  Map2.prototype.fold = function(f, z) {
    return fold(f, z, this);
  };
  var forEach = hamt.forEach = function(f, map) {
    return fold(function(_, value, key) {
      return f(value, key, map);
    }, null, map);
  };
  Map2.prototype.forEach = function(f) {
    return forEach(f, this);
  };
  var count = hamt.count = function(map) {
    return map._size;
  };
  Map2.prototype.count = function() {
    return count(this);
  };
  Object.defineProperty(Map2.prototype, "size", {
    get: Map2.prototype.count
  });
  if (module.exports) {
    module.exports = hamt;
  } else {
    (void 0).hamt = hamt;
  }
});
var BuiltInMap = class {
  constructor(existing) {
    _defineProperty(this, "_map", void 0);
    this._map = new Map(existing === null || existing === void 0 ? void 0 : existing.entries());
  }
  keys() {
    return this._map.keys();
  }
  entries() {
    return this._map.entries();
  }
  get(k) {
    return this._map.get(k);
  }
  has(k) {
    return this._map.has(k);
  }
  set(k, v) {
    this._map.set(k, v);
    return this;
  }
  delete(k) {
    this._map.delete(k);
    return this;
  }
  clone() {
    return persistentMap(this);
  }
  toMap() {
    return new Map(this._map);
  }
};
var HashArrayMappedTrieMap = class _HashArrayMappedTrieMap {
  // Because hamt.empty is not a function there is no way to introduce type
  // parameters on it, so empty is typed as HAMTPlusMap<string, mixed>.
  // $FlowIssue
  constructor(existing) {
    _defineProperty(this, "_hamt", hamt_1.empty.beginMutation());
    if (existing instanceof _HashArrayMappedTrieMap) {
      const h = existing._hamt.endMutation();
      existing._hamt = h.beginMutation();
      this._hamt = h.beginMutation();
    } else if (existing) {
      for (const [k, v] of existing.entries()) {
        this._hamt.set(k, v);
      }
    }
  }
  keys() {
    return this._hamt.keys();
  }
  entries() {
    return this._hamt.entries();
  }
  get(k) {
    return this._hamt.get(k);
  }
  has(k) {
    return this._hamt.has(k);
  }
  set(k, v) {
    this._hamt.set(k, v);
    return this;
  }
  delete(k) {
    this._hamt.delete(k);
    return this;
  }
  clone() {
    return persistentMap(this);
  }
  toMap() {
    return new Map(this._hamt);
  }
};
function persistentMap(existing) {
  if (Recoil_gkx("recoil_hamt_2020")) {
    return new HashArrayMappedTrieMap(existing);
  } else {
    return new BuiltInMap(existing);
  }
}
var Recoil_PersistentMap = {
  persistentMap
};
var Recoil_PersistentMap_1 = Recoil_PersistentMap.persistentMap;
var Recoil_PersistentMap$1 = Object.freeze({
  __proto__: null,
  persistentMap: Recoil_PersistentMap_1
});
function differenceSets(set, ...setsWithValuesToRemove) {
  const ret = /* @__PURE__ */ new Set();
  FIRST: for (const value of set) {
    for (const otherSet of setsWithValuesToRemove) {
      if (otherSet.has(value)) {
        continue FIRST;
      }
    }
    ret.add(value);
  }
  return ret;
}
var Recoil_differenceSets = differenceSets;
function mapMap(map, callback) {
  const result = /* @__PURE__ */ new Map();
  map.forEach((value, key) => {
    result.set(key, callback(value, key));
  });
  return result;
}
var Recoil_mapMap = mapMap;
function makeGraph() {
  return {
    nodeDeps: /* @__PURE__ */ new Map(),
    nodeToNodeSubscriptions: /* @__PURE__ */ new Map()
  };
}
function cloneGraph(graph2) {
  return {
    nodeDeps: Recoil_mapMap(graph2.nodeDeps, (s) => new Set(s)),
    nodeToNodeSubscriptions: Recoil_mapMap(graph2.nodeToNodeSubscriptions, (s) => new Set(s))
  };
}
function mergeDepsIntoGraph(key, newDeps, graph2, olderGraph) {
  const {
    nodeDeps,
    nodeToNodeSubscriptions
  } = graph2;
  const oldDeps = nodeDeps.get(key);
  if (oldDeps && olderGraph && oldDeps !== olderGraph.nodeDeps.get(key)) {
    return;
  }
  nodeDeps.set(key, newDeps);
  const addedDeps = oldDeps == null ? newDeps : Recoil_differenceSets(newDeps, oldDeps);
  for (const dep of addedDeps) {
    if (!nodeToNodeSubscriptions.has(dep)) {
      nodeToNodeSubscriptions.set(dep, /* @__PURE__ */ new Set());
    }
    const existing = Recoil_nullthrows(nodeToNodeSubscriptions.get(dep));
    existing.add(key);
  }
  if (oldDeps) {
    const removedDeps = Recoil_differenceSets(oldDeps, newDeps);
    for (const dep of removedDeps) {
      if (!nodeToNodeSubscriptions.has(dep)) {
        return;
      }
      const existing = Recoil_nullthrows(nodeToNodeSubscriptions.get(dep));
      existing.delete(key);
      if (existing.size === 0) {
        nodeToNodeSubscriptions.delete(dep);
      }
    }
  }
}
function saveDepsToStore(key, deps, store, version) {
  var _storeState$nextTree, _storeState$previousT, _storeState$previousT2, _storeState$previousT3;
  const storeState = store.getState();
  if (!(version === storeState.currentTree.version || version === ((_storeState$nextTree = storeState.nextTree) === null || _storeState$nextTree === void 0 ? void 0 : _storeState$nextTree.version) || version === ((_storeState$previousT = storeState.previousTree) === null || _storeState$previousT === void 0 ? void 0 : _storeState$previousT.version))) {
    Recoil_recoverableViolation("Tried to save dependencies to a discarded tree");
  }
  const graph2 = store.getGraph(version);
  mergeDepsIntoGraph(key, deps, graph2);
  if (version === ((_storeState$previousT2 = storeState.previousTree) === null || _storeState$previousT2 === void 0 ? void 0 : _storeState$previousT2.version)) {
    const currentGraph = store.getGraph(storeState.currentTree.version);
    mergeDepsIntoGraph(key, deps, currentGraph, graph2);
  }
  if (version === ((_storeState$previousT3 = storeState.previousTree) === null || _storeState$previousT3 === void 0 ? void 0 : _storeState$previousT3.version) || version === storeState.currentTree.version) {
    var _storeState$nextTree2;
    const nextVersion = (_storeState$nextTree2 = storeState.nextTree) === null || _storeState$nextTree2 === void 0 ? void 0 : _storeState$nextTree2.version;
    if (nextVersion !== void 0) {
      const nextGraph = store.getGraph(nextVersion);
      mergeDepsIntoGraph(key, deps, nextGraph, graph2);
    }
  }
}
var Recoil_Graph = {
  cloneGraph,
  graph: makeGraph,
  saveDepsToStore
};
var nextTreeStateVersion = 0;
var getNextTreeStateVersion = () => nextTreeStateVersion++;
var nextStoreID = 0;
var getNextStoreID = () => nextStoreID++;
var nextComponentID = 0;
var getNextComponentID = () => nextComponentID++;
var Recoil_Keys = {
  getNextTreeStateVersion,
  getNextStoreID,
  getNextComponentID
};
var {
  persistentMap: persistentMap$1
} = Recoil_PersistentMap$1;
var {
  graph
} = Recoil_Graph;
var {
  getNextTreeStateVersion: getNextTreeStateVersion$1
} = Recoil_Keys;
function makeEmptyTreeState() {
  const version = getNextTreeStateVersion$1();
  return {
    version,
    stateID: version,
    transactionMetadata: {},
    dirtyAtoms: /* @__PURE__ */ new Set(),
    atomValues: persistentMap$1(),
    nonvalidatedAtoms: persistentMap$1()
  };
}
function makeEmptyStoreState() {
  const currentTree = makeEmptyTreeState();
  return {
    currentTree,
    nextTree: null,
    previousTree: null,
    commitDepth: 0,
    knownAtoms: /* @__PURE__ */ new Set(),
    knownSelectors: /* @__PURE__ */ new Set(),
    transactionSubscriptions: /* @__PURE__ */ new Map(),
    nodeTransactionSubscriptions: /* @__PURE__ */ new Map(),
    nodeToComponentSubscriptions: /* @__PURE__ */ new Map(),
    queuedComponentCallbacks_DEPRECATED: [],
    suspendedComponentResolvers: /* @__PURE__ */ new Set(),
    graphsByVersion: (/* @__PURE__ */ new Map()).set(currentTree.version, graph()),
    retention: {
      referenceCounts: /* @__PURE__ */ new Map(),
      nodesRetainedByZone: /* @__PURE__ */ new Map(),
      retainablesToCheckForRelease: /* @__PURE__ */ new Set()
    },
    nodeCleanupFunctions: /* @__PURE__ */ new Map()
  };
}
var Recoil_State = {
  makeEmptyTreeState,
  makeEmptyStoreState,
  getNextTreeStateVersion: getNextTreeStateVersion$1
};
var RetentionZone = class {
};
function retentionZone() {
  return new RetentionZone();
}
var Recoil_RetentionZone = {
  RetentionZone,
  retentionZone
};
function setByAddingToSet(set, v) {
  const next = new Set(set);
  next.add(v);
  return next;
}
function setByDeletingFromSet(set, v) {
  const next = new Set(set);
  next.delete(v);
  return next;
}
function mapBySettingInMap(map, k, v) {
  const next = new Map(map);
  next.set(k, v);
  return next;
}
function mapByUpdatingInMap(map, k, updater) {
  const next = new Map(map);
  next.set(k, updater(next.get(k)));
  return next;
}
function mapByDeletingFromMap(map, k) {
  const next = new Map(map);
  next.delete(k);
  return next;
}
function mapByDeletingMultipleFromMap(map, ks) {
  const next = new Map(map);
  ks.forEach((k) => next.delete(k));
  return next;
}
var Recoil_CopyOnWrite = {
  setByAddingToSet,
  setByDeletingFromSet,
  mapBySettingInMap,
  mapByUpdatingInMap,
  mapByDeletingFromMap,
  mapByDeletingMultipleFromMap
};
function* filterIterable(iterable, predicate) {
  let index = 0;
  for (const value of iterable) {
    if (predicate(value, index++)) {
      yield value;
    }
  }
}
var Recoil_filterIterable = filterIterable;
function lazyProxy(base, factories) {
  const proxy = new Proxy(base, {
    // Compute and cache lazy property if not already done.
    get: (target, prop) => {
      if (!(prop in target) && prop in factories) {
        target[prop] = factories[prop]();
      }
      return target[prop];
    },
    // This method allows user to iterate keys as normal
    ownKeys: (target) => {
      return Object.keys(target);
    }
  });
  return proxy;
}
var Recoil_lazyProxy = lazyProxy;
var {
  getNode: getNode$1,
  getNodeMaybe: getNodeMaybe$1,
  recoilValuesForKeys: recoilValuesForKeys$1
} = Recoil_Node;
var {
  RetentionZone: RetentionZone$1
} = Recoil_RetentionZone;
var {
  setByAddingToSet: setByAddingToSet$1
} = Recoil_CopyOnWrite;
var emptySet = Object.freeze(/* @__PURE__ */ new Set());
var ReadOnlyRecoilValueError = class extends Error {
};
function initializeRetentionForNode(store, nodeKey, retainedBy) {
  if (!Recoil_gkx("recoil_memory_managament_2020")) {
    return () => void 0;
  }
  const {
    nodesRetainedByZone: nodesRetainedByZone2
  } = store.getState().retention;
  function addToZone(zone) {
    let set = nodesRetainedByZone2.get(zone);
    if (!set) {
      nodesRetainedByZone2.set(zone, set = /* @__PURE__ */ new Set());
    }
    set.add(nodeKey);
  }
  if (retainedBy instanceof RetentionZone$1) {
    addToZone(retainedBy);
  } else if (Array.isArray(retainedBy)) {
    for (const zone of retainedBy) {
      addToZone(zone);
    }
  }
  return () => {
    if (!Recoil_gkx("recoil_memory_managament_2020")) {
      return;
    }
    const {
      retention
    } = store.getState();
    function deleteFromZone(zone) {
      const set = retention.nodesRetainedByZone.get(zone);
      set === null || set === void 0 ? void 0 : set.delete(nodeKey);
      if (set && set.size === 0) {
        retention.nodesRetainedByZone.delete(zone);
      }
    }
    if (retainedBy instanceof RetentionZone$1) {
      deleteFromZone(retainedBy);
    } else if (Array.isArray(retainedBy)) {
      for (const zone of retainedBy) {
        deleteFromZone(zone);
      }
    }
  };
}
function initializeNodeIfNewToStore(store, treeState, key, trigger) {
  const storeState = store.getState();
  if (storeState.nodeCleanupFunctions.has(key)) {
    return;
  }
  const node = getNode$1(key);
  const retentionCleanup = initializeRetentionForNode(store, key, node.retainedBy);
  const nodeCleanup = node.init(store, treeState, trigger);
  storeState.nodeCleanupFunctions.set(key, () => {
    nodeCleanup();
    retentionCleanup();
  });
}
function initializeNode(store, key, trigger) {
  initializeNodeIfNewToStore(store, store.getState().currentTree, key, trigger);
}
function cleanUpNode(store, key) {
  var _state$nodeCleanupFun;
  const state = store.getState();
  (_state$nodeCleanupFun = state.nodeCleanupFunctions.get(key)) === null || _state$nodeCleanupFun === void 0 ? void 0 : _state$nodeCleanupFun();
  state.nodeCleanupFunctions.delete(key);
}
function getNodeLoadable(store, state, key) {
  initializeNodeIfNewToStore(store, state, key, "get");
  return getNode$1(key).get(store, state);
}
function peekNodeLoadable(store, state, key) {
  return getNode$1(key).peek(store, state);
}
function setUnvalidatedAtomValue_DEPRECATED(state, key, newValue) {
  var _node$invalidate;
  const node = getNodeMaybe$1(key);
  node === null || node === void 0 ? void 0 : (_node$invalidate = node.invalidate) === null || _node$invalidate === void 0 ? void 0 : _node$invalidate.call(node, state);
  return {
    ...state,
    atomValues: state.atomValues.clone().delete(key),
    nonvalidatedAtoms: state.nonvalidatedAtoms.clone().set(key, newValue),
    dirtyAtoms: setByAddingToSet$1(state.dirtyAtoms, key)
  };
}
function setNodeValue(store, state, key, newValue) {
  const node = getNode$1(key);
  if (node.set == null) {
    throw new ReadOnlyRecoilValueError(`Attempt to set read-only RecoilValue: ${key}`);
  }
  const set = node.set;
  initializeNodeIfNewToStore(store, state, key, "set");
  return set(store, state, newValue);
}
function peekNodeInfo(store, state, key) {
  const storeState = store.getState();
  const graph2 = store.getGraph(state.version);
  const type = getNode$1(key).nodeType;
  return Recoil_lazyProxy({
    type
  }, {
    // $FlowFixMe[underconstrained-implicit-instantiation]
    loadable: () => peekNodeLoadable(store, state, key),
    isActive: () => storeState.knownAtoms.has(key) || storeState.knownSelectors.has(key),
    isSet: () => type === "selector" ? false : state.atomValues.has(key),
    isModified: () => state.dirtyAtoms.has(key),
    // Report current dependencies.  If the node hasn't been evaluated, then
    // dependencies may be missing based on the current state.
    deps: () => {
      var _graph$nodeDeps$get;
      return recoilValuesForKeys$1((_graph$nodeDeps$get = graph2.nodeDeps.get(key)) !== null && _graph$nodeDeps$get !== void 0 ? _graph$nodeDeps$get : []);
    },
    // Reports all "current" subscribers.  Evaluating other nodes or
    // previous in-progress async evaluations may introduce new subscribers.
    subscribers: () => {
      var _storeState$nodeToCom, _storeState$nodeToCom2;
      return {
        nodes: recoilValuesForKeys$1(Recoil_filterIterable(getDownstreamNodes(store, state, /* @__PURE__ */ new Set([key])), (nodeKey) => nodeKey !== key)),
        components: Recoil_mapIterable((_storeState$nodeToCom = (_storeState$nodeToCom2 = storeState.nodeToComponentSubscriptions.get(key)) === null || _storeState$nodeToCom2 === void 0 ? void 0 : _storeState$nodeToCom2.values()) !== null && _storeState$nodeToCom !== void 0 ? _storeState$nodeToCom : [], ([name]) => ({
          name
        }))
      };
    }
  });
}
function getDownstreamNodes(store, state, keys) {
  const visitedNodes = /* @__PURE__ */ new Set();
  const visitingNodes = Array.from(keys);
  const graph2 = store.getGraph(state.version);
  for (let key = visitingNodes.pop(); key; key = visitingNodes.pop()) {
    var _graph$nodeToNodeSubs;
    visitedNodes.add(key);
    const subscribedNodes = (_graph$nodeToNodeSubs = graph2.nodeToNodeSubscriptions.get(key)) !== null && _graph$nodeToNodeSubs !== void 0 ? _graph$nodeToNodeSubs : emptySet;
    for (const downstreamNode of subscribedNodes) {
      if (!visitedNodes.has(downstreamNode)) {
        visitingNodes.push(downstreamNode);
      }
    }
  }
  return visitedNodes;
}
var Recoil_FunctionalCore = {
  getNodeLoadable,
  peekNodeLoadable,
  setNodeValue,
  initializeNode,
  cleanUpNode,
  setUnvalidatedAtomValue_DEPRECATED,
  peekNodeInfo,
  getDownstreamNodes
};
var _invalidateMemoizedSnapshot = null;
function setInvalidateMemoizedSnapshot(invalidate) {
  _invalidateMemoizedSnapshot = invalidate;
}
function invalidateMemoizedSnapshot() {
  var _invalidateMemoizedSn;
  (_invalidateMemoizedSn = _invalidateMemoizedSnapshot) === null || _invalidateMemoizedSn === void 0 ? void 0 : _invalidateMemoizedSn();
}
var Recoil_SnapshotCache = {
  setInvalidateMemoizedSnapshot,
  invalidateMemoizedSnapshot
};
var {
  getDownstreamNodes: getDownstreamNodes$1,
  getNodeLoadable: getNodeLoadable$1,
  setNodeValue: setNodeValue$1
} = Recoil_FunctionalCore;
var {
  getNextComponentID: getNextComponentID$1
} = Recoil_Keys;
var {
  getNode: getNode$2,
  getNodeMaybe: getNodeMaybe$2
} = Recoil_Node;
var {
  DefaultValue: DefaultValue$1
} = Recoil_Node;
var {
  reactMode: reactMode$1
} = Recoil_ReactMode;
var {
  AbstractRecoilValue: AbstractRecoilValue$1,
  RecoilState: RecoilState$1,
  RecoilValueReadOnly: RecoilValueReadOnly$1,
  isRecoilValue: isRecoilValue$1
} = Recoil_RecoilValue$1;
var {
  invalidateMemoizedSnapshot: invalidateMemoizedSnapshot$1
} = Recoil_SnapshotCache;
function getRecoilValueAsLoadable(store, {
  key
}, treeState = store.getState().currentTree) {
  var _storeState$nextTree, _storeState$previousT;
  const storeState = store.getState();
  if (!(treeState.version === storeState.currentTree.version || treeState.version === ((_storeState$nextTree = storeState.nextTree) === null || _storeState$nextTree === void 0 ? void 0 : _storeState$nextTree.version) || treeState.version === ((_storeState$previousT = storeState.previousTree) === null || _storeState$previousT === void 0 ? void 0 : _storeState$previousT.version))) {
    Recoil_recoverableViolation("Tried to read from a discarded tree");
  }
  const loadable = getNodeLoadable$1(store, treeState, key);
  if (loadable.state === "loading") {
    loadable.contents.catch(() => {
      return;
    });
  }
  return loadable;
}
function applyAtomValueWrites(atomValues, writes) {
  const result = atomValues.clone();
  writes.forEach((v, k) => {
    if (v.state === "hasValue" && v.contents instanceof DefaultValue$1) {
      result.delete(k);
    } else {
      result.set(k, v);
    }
  });
  return result;
}
function valueFromValueOrUpdater(store, state, {
  key
}, valueOrUpdater) {
  if (typeof valueOrUpdater === "function") {
    const current = getNodeLoadable$1(store, state, key);
    if (current.state === "loading") {
      const msg = `Tried to set atom or selector "${key}" using an updater function while the current state is pending, this is not currently supported.`;
      Recoil_recoverableViolation(msg);
      throw Recoil_err(msg);
    } else if (current.state === "hasError") {
      throw current.contents;
    }
    return valueOrUpdater(current.contents);
  } else {
    return valueOrUpdater;
  }
}
function applyAction(store, state, action) {
  if (action.type === "set") {
    const {
      recoilValue,
      valueOrUpdater
    } = action;
    const newValue = valueFromValueOrUpdater(store, state, recoilValue, valueOrUpdater);
    const writes = setNodeValue$1(store, state, recoilValue.key, newValue);
    for (const [key, loadable] of writes.entries()) {
      writeLoadableToTreeState(state, key, loadable);
    }
  } else if (action.type === "setLoadable") {
    const {
      recoilValue: {
        key
      },
      loadable
    } = action;
    writeLoadableToTreeState(state, key, loadable);
  } else if (action.type === "markModified") {
    const {
      recoilValue: {
        key
      }
    } = action;
    state.dirtyAtoms.add(key);
  } else if (action.type === "setUnvalidated") {
    var _node$invalidate;
    const {
      recoilValue: {
        key
      },
      unvalidatedValue
    } = action;
    const node = getNodeMaybe$2(key);
    node === null || node === void 0 ? void 0 : (_node$invalidate = node.invalidate) === null || _node$invalidate === void 0 ? void 0 : _node$invalidate.call(node, state);
    state.atomValues.delete(key);
    state.nonvalidatedAtoms.set(key, unvalidatedValue);
    state.dirtyAtoms.add(key);
  } else {
    Recoil_recoverableViolation(`Unknown action ${action.type}`);
  }
}
function writeLoadableToTreeState(state, key, loadable) {
  if (loadable.state === "hasValue" && loadable.contents instanceof DefaultValue$1) {
    state.atomValues.delete(key);
  } else {
    state.atomValues.set(key, loadable);
  }
  state.dirtyAtoms.add(key);
  state.nonvalidatedAtoms.delete(key);
}
function applyActionsToStore(store, actions) {
  store.replaceState((state) => {
    const newState = copyTreeState(state);
    for (const action of actions) {
      applyAction(store, newState, action);
    }
    invalidateDownstreams(store, newState);
    invalidateMemoizedSnapshot$1();
    return newState;
  });
}
function queueOrPerformStateUpdate(store, action) {
  if (batchStack.length) {
    const actionsByStore = batchStack[batchStack.length - 1];
    let actions = actionsByStore.get(store);
    if (!actions) {
      actionsByStore.set(store, actions = []);
    }
    actions.push(action);
  } else {
    applyActionsToStore(store, [action]);
  }
}
var batchStack = [];
function batchStart() {
  const actionsByStore = /* @__PURE__ */ new Map();
  batchStack.push(actionsByStore);
  return () => {
    for (const [store, actions] of actionsByStore) {
      applyActionsToStore(store, actions);
    }
    const popped = batchStack.pop();
    if (popped !== actionsByStore) {
      Recoil_recoverableViolation("Incorrect order of batch popping");
    }
  };
}
function copyTreeState(state) {
  return {
    ...state,
    atomValues: state.atomValues.clone(),
    nonvalidatedAtoms: state.nonvalidatedAtoms.clone(),
    dirtyAtoms: new Set(state.dirtyAtoms)
  };
}
function invalidateDownstreams(store, state) {
  const downstreams = getDownstreamNodes$1(store, state, state.dirtyAtoms);
  for (const key of downstreams) {
    var _getNodeMaybe, _getNodeMaybe$invalid;
    (_getNodeMaybe = getNodeMaybe$2(key)) === null || _getNodeMaybe === void 0 ? void 0 : (_getNodeMaybe$invalid = _getNodeMaybe.invalidate) === null || _getNodeMaybe$invalid === void 0 ? void 0 : _getNodeMaybe$invalid.call(_getNodeMaybe, state);
  }
}
function setRecoilValue(store, recoilValue, valueOrUpdater) {
  queueOrPerformStateUpdate(store, {
    type: "set",
    recoilValue,
    valueOrUpdater
  });
}
function setRecoilValueLoadable(store, recoilValue, loadable) {
  if (loadable instanceof DefaultValue$1) {
    return setRecoilValue(store, recoilValue, loadable);
  }
  queueOrPerformStateUpdate(store, {
    type: "setLoadable",
    recoilValue,
    loadable
  });
}
function markRecoilValueModified(store, recoilValue) {
  queueOrPerformStateUpdate(store, {
    type: "markModified",
    recoilValue
  });
}
function setUnvalidatedRecoilValue(store, recoilValue, unvalidatedValue) {
  queueOrPerformStateUpdate(store, {
    type: "setUnvalidated",
    recoilValue,
    unvalidatedValue
  });
}
function subscribeToRecoilValue(store, {
  key
}, callback, componentDebugName = null) {
  const subID = getNextComponentID$1();
  const storeState = store.getState();
  if (!storeState.nodeToComponentSubscriptions.has(key)) {
    storeState.nodeToComponentSubscriptions.set(key, /* @__PURE__ */ new Map());
  }
  Recoil_nullthrows(storeState.nodeToComponentSubscriptions.get(key)).set(subID, [componentDebugName !== null && componentDebugName !== void 0 ? componentDebugName : "<not captured>", callback]);
  const mode = reactMode$1();
  if (mode.early && (mode.mode === "LEGACY" || mode.mode === "MUTABLE_SOURCE")) {
    const nextTree = store.getState().nextTree;
    if (nextTree && nextTree.dirtyAtoms.has(key)) {
      callback(nextTree);
    }
  }
  return {
    release: () => {
      const releaseStoreState = store.getState();
      const subs = releaseStoreState.nodeToComponentSubscriptions.get(key);
      if (subs === void 0 || !subs.has(subID)) {
        Recoil_recoverableViolation(`Subscription missing at release time for atom ${key}. This is a bug in Recoil.`);
        return;
      }
      subs.delete(subID);
      if (subs.size === 0) {
        releaseStoreState.nodeToComponentSubscriptions.delete(key);
      }
    }
  };
}
function refreshRecoilValue(store, recoilValue) {
  var _node$clearCache;
  const {
    currentTree
  } = store.getState();
  const node = getNode$2(recoilValue.key);
  (_node$clearCache = node.clearCache) === null || _node$clearCache === void 0 ? void 0 : _node$clearCache.call(node, store, currentTree);
}
var Recoil_RecoilValueInterface = {
  RecoilValueReadOnly: RecoilValueReadOnly$1,
  AbstractRecoilValue: AbstractRecoilValue$1,
  RecoilState: RecoilState$1,
  getRecoilValueAsLoadable,
  setRecoilValue,
  setRecoilValueLoadable,
  markRecoilValueModified,
  setUnvalidatedRecoilValue,
  subscribeToRecoilValue,
  isRecoilValue: isRecoilValue$1,
  applyAtomValueWrites,
  // TODO Remove export when deprecating initialStoreState_DEPRECATED in RecoilRoot
  batchStart,
  writeLoadableToTreeState,
  invalidateDownstreams,
  copyTreeState,
  refreshRecoilValue
};
function someSet(set, callback, context) {
  const iterator = set.entries();
  let current = iterator.next();
  while (!current.done) {
    const entry = current.value;
    if (callback.call(context, entry[1], entry[0], set)) {
      return true;
    }
    current = iterator.next();
  }
  return false;
}
var Recoil_someSet = someSet;
var {
  cleanUpNode: cleanUpNode$1
} = Recoil_FunctionalCore;
var {
  deleteNodeConfigIfPossible: deleteNodeConfigIfPossible$1,
  getNode: getNode$3
} = Recoil_Node;
var {
  RetentionZone: RetentionZone$2
} = Recoil_RetentionZone;
var SUSPENSE_TIMEOUT_MS = 12e4;
var emptySet$1 = /* @__PURE__ */ new Set();
function releaseRetainablesNowOnCurrentTree(store, retainables) {
  const storeState = store.getState();
  const treeState = storeState.currentTree;
  if (storeState.nextTree) {
    Recoil_recoverableViolation("releaseNodesNowOnCurrentTree should only be called at the end of a batch");
    return;
  }
  const nodes2 = /* @__PURE__ */ new Set();
  for (const r of retainables) {
    if (r instanceof RetentionZone$2) {
      for (const n of nodesRetainedByZone(storeState, r)) {
        nodes2.add(n);
      }
    } else {
      nodes2.add(r);
    }
  }
  const releasableNodes = findReleasableNodes(store, nodes2);
  for (const node of releasableNodes) {
    releaseNode(store, treeState, node);
  }
}
function findReleasableNodes(store, searchFromNodes) {
  const storeState = store.getState();
  const treeState = storeState.currentTree;
  const graph2 = store.getGraph(treeState.version);
  const releasableNodes = /* @__PURE__ */ new Set();
  const nonReleasableNodes = /* @__PURE__ */ new Set();
  findReleasableNodesInner(searchFromNodes);
  return releasableNodes;
  function findReleasableNodesInner(searchFromNodes2) {
    const releasableNodesFoundThisIteration = /* @__PURE__ */ new Set();
    const downstreams = getDownstreamNodesInTopologicalOrder(
      store,
      treeState,
      searchFromNodes2,
      releasableNodes,
      // don't descend into these
      nonReleasableNodes
      // don't descend into these
    );
    for (const node of downstreams) {
      var _storeState$retention;
      if (getNode$3(node).retainedBy === "recoilRoot") {
        nonReleasableNodes.add(node);
        continue;
      }
      if (((_storeState$retention = storeState.retention.referenceCounts.get(node)) !== null && _storeState$retention !== void 0 ? _storeState$retention : 0) > 0) {
        nonReleasableNodes.add(node);
        continue;
      }
      if (zonesThatCouldRetainNode(node).some((z) => storeState.retention.referenceCounts.get(z))) {
        nonReleasableNodes.add(node);
        continue;
      }
      const nodeChildren = graph2.nodeToNodeSubscriptions.get(node);
      if (nodeChildren && Recoil_someSet(nodeChildren, (child) => nonReleasableNodes.has(child))) {
        nonReleasableNodes.add(node);
        continue;
      }
      releasableNodes.add(node);
      releasableNodesFoundThisIteration.add(node);
    }
    const parents = /* @__PURE__ */ new Set();
    for (const node of releasableNodesFoundThisIteration) {
      for (const parent of (_graph$nodeDeps$get = graph2.nodeDeps.get(node)) !== null && _graph$nodeDeps$get !== void 0 ? _graph$nodeDeps$get : emptySet$1) {
        var _graph$nodeDeps$get;
        if (!releasableNodes.has(parent)) {
          parents.add(parent);
        }
      }
    }
    if (parents.size) {
      findReleasableNodesInner(parents);
    }
  }
}
function getDownstreamNodesInTopologicalOrder(store, treeState, nodes2, doNotDescendInto1, doNotDescendInto2) {
  const graph2 = store.getGraph(treeState.version);
  const answer = [];
  const visited = /* @__PURE__ */ new Set();
  while (nodes2.size > 0) {
    visit(Recoil_nullthrows(nodes2.values().next().value));
  }
  return answer;
  function visit(node) {
    if (doNotDescendInto1.has(node) || doNotDescendInto2.has(node)) {
      nodes2.delete(node);
      return;
    }
    if (visited.has(node)) {
      return;
    }
    const children = graph2.nodeToNodeSubscriptions.get(node);
    if (children) {
      for (const child of children) {
        visit(child);
      }
    }
    visited.add(node);
    nodes2.delete(node);
    answer.push(node);
  }
}
function releaseNode(store, treeState, node) {
  if (!Recoil_gkx("recoil_memory_managament_2020")) {
    return;
  }
  cleanUpNode$1(store, node);
  const storeState = store.getState();
  storeState.knownAtoms.delete(node);
  storeState.knownSelectors.delete(node);
  storeState.nodeTransactionSubscriptions.delete(node);
  storeState.retention.referenceCounts.delete(node);
  const zones = zonesThatCouldRetainNode(node);
  for (const zone of zones) {
    var _storeState$retention2;
    (_storeState$retention2 = storeState.retention.nodesRetainedByZone.get(zone)) === null || _storeState$retention2 === void 0 ? void 0 : _storeState$retention2.delete(node);
  }
  treeState.atomValues.delete(node);
  treeState.dirtyAtoms.delete(node);
  treeState.nonvalidatedAtoms.delete(node);
  const graph2 = storeState.graphsByVersion.get(treeState.version);
  if (graph2) {
    const deps = graph2.nodeDeps.get(node);
    if (deps !== void 0) {
      graph2.nodeDeps.delete(node);
      for (const dep of deps) {
        var _graph$nodeToNodeSubs;
        (_graph$nodeToNodeSubs = graph2.nodeToNodeSubscriptions.get(dep)) === null || _graph$nodeToNodeSubs === void 0 ? void 0 : _graph$nodeToNodeSubs.delete(node);
      }
    }
    graph2.nodeToNodeSubscriptions.delete(node);
  }
  deleteNodeConfigIfPossible$1(node);
}
function nodesRetainedByZone(storeState, zone) {
  var _storeState$retention3;
  return (_storeState$retention3 = storeState.retention.nodesRetainedByZone.get(zone)) !== null && _storeState$retention3 !== void 0 ? _storeState$retention3 : emptySet$1;
}
function zonesThatCouldRetainNode(node) {
  const retainedBy = getNode$3(node).retainedBy;
  if (retainedBy === void 0 || retainedBy === "components" || retainedBy === "recoilRoot") {
    return [];
  } else if (retainedBy instanceof RetentionZone$2) {
    return [retainedBy];
  } else {
    return retainedBy;
  }
}
function scheduleOrPerformPossibleReleaseOfRetainable(store, retainable) {
  const state = store.getState();
  if (state.nextTree) {
    state.retention.retainablesToCheckForRelease.add(retainable);
  } else {
    releaseRetainablesNowOnCurrentTree(store, /* @__PURE__ */ new Set([retainable]));
  }
}
function updateRetainCount(store, retainable, delta) {
  var _map$get;
  if (!Recoil_gkx("recoil_memory_managament_2020")) {
    return;
  }
  const map = store.getState().retention.referenceCounts;
  const newCount = ((_map$get = map.get(retainable)) !== null && _map$get !== void 0 ? _map$get : 0) + delta;
  if (newCount === 0) {
    updateRetainCountToZero(store, retainable);
  } else {
    map.set(retainable, newCount);
  }
}
function updateRetainCountToZero(store, retainable) {
  if (!Recoil_gkx("recoil_memory_managament_2020")) {
    return;
  }
  const map = store.getState().retention.referenceCounts;
  map.delete(retainable);
  scheduleOrPerformPossibleReleaseOfRetainable(store, retainable);
}
function releaseScheduledRetainablesNow(store) {
  if (!Recoil_gkx("recoil_memory_managament_2020")) {
    return;
  }
  const state = store.getState();
  releaseRetainablesNowOnCurrentTree(store, state.retention.retainablesToCheckForRelease);
  state.retention.retainablesToCheckForRelease.clear();
}
function retainedByOptionWithDefault(r) {
  return r === void 0 ? "recoilRoot" : r;
}
var Recoil_Retention = {
  SUSPENSE_TIMEOUT_MS,
  updateRetainCount,
  updateRetainCountToZero,
  releaseScheduledRetainablesNow,
  retainedByOptionWithDefault
};
var {
  unstable_batchedUpdates
} = import_react_dom.default;
var ReactBatchedUpdates = {
  unstable_batchedUpdates
};
var {
  unstable_batchedUpdates: unstable_batchedUpdates$1
} = ReactBatchedUpdates;
var Recoil_ReactBatchedUpdates = {
  unstable_batchedUpdates: unstable_batchedUpdates$1
};
var {
  batchStart: batchStart$1
} = Recoil_RecoilValueInterface;
var {
  unstable_batchedUpdates: unstable_batchedUpdates$2
} = Recoil_ReactBatchedUpdates;
var batcher = unstable_batchedUpdates$2 || ((batchFn) => batchFn());
var setBatcher = (newBatcher) => {
  batcher = newBatcher;
};
var getBatcher = () => batcher;
var batchUpdates = (callback) => {
  batcher(() => {
    let batchEnd = () => void 0;
    try {
      batchEnd = batchStart$1();
      callback();
    } finally {
      batchEnd();
    }
  });
};
var Recoil_Batching = {
  getBatcher,
  setBatcher,
  batchUpdates
};
function* concatIterables(iters) {
  for (const iter of iters) {
    for (const val of iter) {
      yield val;
    }
  }
}
var Recoil_concatIterables = concatIterables;
var isSSR = (
  // $FlowFixMe(site=recoil) Window does not have a FlowType definition https://github.com/facebook/flow/issues/6709
  typeof Window === "undefined" || typeof window === "undefined"
);
var isWindow = (value) => !isSSR && // $FlowFixMe(site=recoil) Window does not have a FlowType definition https://github.com/facebook/flow/issues/6709
(value === window || value instanceof Window);
var isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative";
var Recoil_Environment = {
  isSSR,
  isReactNative,
  isWindow
};
function memoizeWithArgsHash(fn, hashFunction) {
  let cache;
  return (...args) => {
    if (!cache) {
      cache = {};
    }
    const key = hashFunction(...args);
    if (!Object.hasOwnProperty.call(cache, key)) {
      cache[key] = fn(...args);
    }
    return cache[key];
  };
}
function memoizeOneWithArgsHash(fn, hashFunction) {
  let lastKey;
  let lastResult;
  return (...args) => {
    const key = hashFunction(...args);
    if (lastKey === key) {
      return lastResult;
    }
    lastKey = key;
    lastResult = fn(...args);
    return lastResult;
  };
}
function memoizeOneWithArgsHashAndInvalidation(fn, hashFunction) {
  let lastKey;
  let lastResult;
  const memoizedFn = (...args) => {
    const key = hashFunction(...args);
    if (lastKey === key) {
      return lastResult;
    }
    lastKey = key;
    lastResult = fn(...args);
    return lastResult;
  };
  const invalidate = () => {
    lastKey = null;
  };
  return [memoizedFn, invalidate];
}
var Recoil_Memoize = {
  memoizeWithArgsHash,
  memoizeOneWithArgsHash,
  memoizeOneWithArgsHashAndInvalidation
};
var {
  batchUpdates: batchUpdates$1
} = Recoil_Batching;
var {
  initializeNode: initializeNode$1,
  peekNodeInfo: peekNodeInfo$1
} = Recoil_FunctionalCore;
var {
  graph: graph$1
} = Recoil_Graph;
var {
  getNextStoreID: getNextStoreID$1
} = Recoil_Keys;
var {
  DEFAULT_VALUE: DEFAULT_VALUE$1,
  recoilValues: recoilValues$1,
  recoilValuesForKeys: recoilValuesForKeys$2
} = Recoil_Node;
var {
  AbstractRecoilValue: AbstractRecoilValue$2,
  getRecoilValueAsLoadable: getRecoilValueAsLoadable$1,
  setRecoilValue: setRecoilValue$1,
  setUnvalidatedRecoilValue: setUnvalidatedRecoilValue$1
} = Recoil_RecoilValueInterface;
var {
  updateRetainCount: updateRetainCount$1
} = Recoil_Retention;
var {
  setInvalidateMemoizedSnapshot: setInvalidateMemoizedSnapshot$1
} = Recoil_SnapshotCache;
var {
  getNextTreeStateVersion: getNextTreeStateVersion$2,
  makeEmptyStoreState: makeEmptyStoreState$1
} = Recoil_State;
var {
  isSSR: isSSR$1
} = Recoil_Environment;
var {
  memoizeOneWithArgsHashAndInvalidation: memoizeOneWithArgsHashAndInvalidation$1
} = Recoil_Memoize;
var retainWarning = `
Recoil Snapshots only last for the duration of the callback they are provided to. To keep a Snapshot longer, do this:

  const release = snapshot.retain();
  try {
    await doSomethingWithSnapshot(snapshot);
  } finally {
    release();
  }

This is currently a DEV-only warning but will become a thrown exception in the next release of Recoil.
`;
var Snapshot = class {
  // eslint-disable-next-line fb-www/no-uninitialized-properties
  constructor(storeState, parentStoreID) {
    _defineProperty(this, "_store", void 0);
    _defineProperty(this, "_refCount", 1);
    _defineProperty(this, "getLoadable", (recoilValue) => {
      this.checkRefCount_INTERNAL();
      return getRecoilValueAsLoadable$1(this._store, recoilValue);
    });
    _defineProperty(this, "getPromise", (recoilValue) => {
      this.checkRefCount_INTERNAL();
      return this.getLoadable(recoilValue).toPromise();
    });
    _defineProperty(this, "getNodes_UNSTABLE", (opt) => {
      this.checkRefCount_INTERNAL();
      if ((opt === null || opt === void 0 ? void 0 : opt.isModified) === true) {
        if ((opt === null || opt === void 0 ? void 0 : opt.isInitialized) === false) {
          return [];
        }
        const state = this._store.getState().currentTree;
        return recoilValuesForKeys$2(state.dirtyAtoms);
      }
      const knownAtoms = this._store.getState().knownAtoms;
      const knownSelectors = this._store.getState().knownSelectors;
      return (opt === null || opt === void 0 ? void 0 : opt.isInitialized) == null ? recoilValues$1.values() : opt.isInitialized === true ? recoilValuesForKeys$2(Recoil_concatIterables([knownAtoms, knownSelectors])) : Recoil_filterIterable(recoilValues$1.values(), ({
        key
      }) => !knownAtoms.has(key) && !knownSelectors.has(key));
    });
    _defineProperty(this, "getInfo_UNSTABLE", ({
      key
    }) => {
      this.checkRefCount_INTERNAL();
      return peekNodeInfo$1(this._store, this._store.getState().currentTree, key);
    });
    _defineProperty(this, "map", (mapper) => {
      this.checkRefCount_INTERNAL();
      const mutableSnapshot = new MutableSnapshot(this, batchUpdates$1);
      mapper(mutableSnapshot);
      return mutableSnapshot;
    });
    _defineProperty(this, "asyncMap", async (mapper) => {
      this.checkRefCount_INTERNAL();
      const mutableSnapshot = new MutableSnapshot(this, batchUpdates$1);
      mutableSnapshot.retain();
      await mapper(mutableSnapshot);
      mutableSnapshot.autoRelease_INTERNAL();
      return mutableSnapshot;
    });
    this._store = {
      storeID: getNextStoreID$1(),
      parentStoreID,
      getState: () => storeState,
      replaceState: (replacer) => {
        storeState.currentTree = replacer(storeState.currentTree);
      },
      getGraph: (version) => {
        const graphs = storeState.graphsByVersion;
        if (graphs.has(version)) {
          return Recoil_nullthrows(graphs.get(version));
        }
        const newGraph = graph$1();
        graphs.set(version, newGraph);
        return newGraph;
      },
      subscribeToTransactions: () => ({
        release: () => {
        }
      }),
      addTransactionMetadata: () => {
        throw Recoil_err("Cannot subscribe to Snapshots");
      }
    };
    for (const nodeKey of this._store.getState().knownAtoms) {
      initializeNode$1(this._store, nodeKey, "get");
      updateRetainCount$1(this._store, nodeKey, 1);
    }
    this.autoRelease_INTERNAL();
  }
  retain() {
    if (this._refCount <= 0) {
      if (true) {
        throw Recoil_err("Snapshot has already been released.");
      } else {
        Recoil_recoverableViolation("Attempt to retain() Snapshot that was already released.");
      }
    }
    this._refCount++;
    let released = false;
    return () => {
      if (!released) {
        released = true;
        this._release();
      }
    };
  }
  /**
   * Release the snapshot on the next tick.  This means the snapshot is retained
   * during the execution of the current function using it.
   */
  autoRelease_INTERNAL() {
    if (!isSSR$1) {
      window.setTimeout(() => this._release(), 10);
    }
  }
  _release() {
    this._refCount--;
    if (this._refCount === 0) {
      this._store.getState().nodeCleanupFunctions.forEach((cleanup) => cleanup());
      this._store.getState().nodeCleanupFunctions.clear();
      if (!Recoil_gkx("recoil_memory_managament_2020")) {
        return;
      }
    } else if (this._refCount < 0) {
      if (true) {
        Recoil_recoverableViolation("Snapshot released an extra time.");
      }
    }
  }
  isRetained() {
    return this._refCount > 0;
  }
  checkRefCount_INTERNAL() {
    if (Recoil_gkx("recoil_memory_managament_2020") && this._refCount <= 0) {
      if (true) {
        Recoil_recoverableViolation(retainWarning);
      }
    }
  }
  getStore_INTERNAL() {
    this.checkRefCount_INTERNAL();
    return this._store;
  }
  getID() {
    this.checkRefCount_INTERNAL();
    return this._store.getState().currentTree.stateID;
  }
  getStoreID() {
    this.checkRefCount_INTERNAL();
    return this._store.storeID;
  }
  // We want to allow the methods to be destructured and used as accessors
  /* eslint-disable fb-www/extra-arrow-initializer */
  /* eslint-enable fb-www/extra-arrow-initializer */
};
function cloneStoreState(store, treeState, bumpVersion = false) {
  const storeState = store.getState();
  const version = bumpVersion ? getNextTreeStateVersion$2() : treeState.version;
  return {
    // Always clone the TreeState to isolate stores from accidental mutations.
    // For example, reading a selector from a cloned snapshot shouldn't cache
    // in the original treestate which may cause the original to skip
    // initialization of upstream atoms.
    currentTree: {
      // TODO snapshots shouldn't really have versions because a new version number
      // is always assigned when the snapshot is gone to.
      version: bumpVersion ? version : treeState.version,
      stateID: bumpVersion ? version : treeState.stateID,
      transactionMetadata: {
        ...treeState.transactionMetadata
      },
      dirtyAtoms: new Set(treeState.dirtyAtoms),
      atomValues: treeState.atomValues.clone(),
      nonvalidatedAtoms: treeState.nonvalidatedAtoms.clone()
    },
    commitDepth: 0,
    nextTree: null,
    previousTree: null,
    knownAtoms: new Set(storeState.knownAtoms),
    // FIXME here's a copy
    knownSelectors: new Set(storeState.knownSelectors),
    // FIXME here's a copy
    transactionSubscriptions: /* @__PURE__ */ new Map(),
    nodeTransactionSubscriptions: /* @__PURE__ */ new Map(),
    nodeToComponentSubscriptions: /* @__PURE__ */ new Map(),
    queuedComponentCallbacks_DEPRECATED: [],
    suspendedComponentResolvers: /* @__PURE__ */ new Set(),
    graphsByVersion: (/* @__PURE__ */ new Map()).set(version, store.getGraph(treeState.version)),
    retention: {
      referenceCounts: /* @__PURE__ */ new Map(),
      nodesRetainedByZone: /* @__PURE__ */ new Map(),
      retainablesToCheckForRelease: /* @__PURE__ */ new Set()
    },
    // FIXME here's a copy
    // Create blank cleanup handlers for atoms so snapshots don't re-run
    // atom effects.
    nodeCleanupFunctions: new Map(Recoil_mapIterable(storeState.nodeCleanupFunctions.entries(), ([key]) => [key, () => {
    }]))
  };
}
function freshSnapshot(initializeState) {
  const snapshot = new Snapshot(makeEmptyStoreState$1());
  return initializeState != null ? snapshot.map(initializeState) : snapshot;
}
var [memoizedCloneSnapshot, invalidateMemoizedSnapshot$2] = memoizeOneWithArgsHashAndInvalidation$1(
  // $FlowFixMe[missing-local-annot]
  (store, version) => {
    var _storeState$nextTree;
    const storeState = store.getState();
    const treeState = version === "latest" ? (_storeState$nextTree = storeState.nextTree) !== null && _storeState$nextTree !== void 0 ? _storeState$nextTree : storeState.currentTree : Recoil_nullthrows(storeState.previousTree);
    return new Snapshot(cloneStoreState(store, treeState), store.storeID);
  },
  (store, version) => {
    var _store$getState$nextT, _store$getState$previ;
    return String(version) + String(store.storeID) + String((_store$getState$nextT = store.getState().nextTree) === null || _store$getState$nextT === void 0 ? void 0 : _store$getState$nextT.version) + String(store.getState().currentTree.version) + String((_store$getState$previ = store.getState().previousTree) === null || _store$getState$previ === void 0 ? void 0 : _store$getState$previ.version);
  }
);
setInvalidateMemoizedSnapshot$1(invalidateMemoizedSnapshot$2);
function cloneSnapshot(store, version = "latest") {
  const snapshot = memoizedCloneSnapshot(store, version);
  if (!snapshot.isRetained()) {
    invalidateMemoizedSnapshot$2();
    return memoizedCloneSnapshot(store, version);
  }
  return snapshot;
}
var MutableSnapshot = class extends Snapshot {
  constructor(snapshot, batch) {
    super(cloneStoreState(snapshot.getStore_INTERNAL(), snapshot.getStore_INTERNAL().getState().currentTree, true), snapshot.getStoreID());
    _defineProperty(this, "_batch", void 0);
    _defineProperty(this, "set", (recoilState, newValueOrUpdater) => {
      this.checkRefCount_INTERNAL();
      const store = this.getStore_INTERNAL();
      this._batch(() => {
        updateRetainCount$1(store, recoilState.key, 1);
        setRecoilValue$1(this.getStore_INTERNAL(), recoilState, newValueOrUpdater);
      });
    });
    _defineProperty(this, "reset", (recoilState) => {
      this.checkRefCount_INTERNAL();
      const store = this.getStore_INTERNAL();
      this._batch(() => {
        updateRetainCount$1(store, recoilState.key, 1);
        setRecoilValue$1(this.getStore_INTERNAL(), recoilState, DEFAULT_VALUE$1);
      });
    });
    _defineProperty(this, "setUnvalidatedAtomValues_DEPRECATED", (values) => {
      this.checkRefCount_INTERNAL();
      const store = this.getStore_INTERNAL();
      batchUpdates$1(() => {
        for (const [k, v] of values.entries()) {
          updateRetainCount$1(store, k, 1);
          setUnvalidatedRecoilValue$1(store, new AbstractRecoilValue$2(k), v);
        }
      });
    });
    this._batch = batch;
  }
};
var Recoil_Snapshot = {
  Snapshot,
  MutableSnapshot,
  freshSnapshot,
  cloneSnapshot
};
var Recoil_Snapshot_1 = Recoil_Snapshot.Snapshot;
var Recoil_Snapshot_2 = Recoil_Snapshot.MutableSnapshot;
var Recoil_Snapshot_3 = Recoil_Snapshot.freshSnapshot;
var Recoil_Snapshot_4 = Recoil_Snapshot.cloneSnapshot;
var Recoil_Snapshot$1 = Object.freeze({
  __proto__: null,
  Snapshot: Recoil_Snapshot_1,
  MutableSnapshot: Recoil_Snapshot_2,
  freshSnapshot: Recoil_Snapshot_3,
  cloneSnapshot: Recoil_Snapshot_4
});
function unionSets(...sets) {
  const result = /* @__PURE__ */ new Set();
  for (const set of sets) {
    for (const value of set) {
      result.add(value);
    }
  }
  return result;
}
var Recoil_unionSets = unionSets;
var {
  useRef
} = import_react.default;
function useRefInitOnce(initialValue) {
  const ref = useRef(initialValue);
  if (ref.current === initialValue && typeof initialValue === "function") {
    ref.current = initialValue();
  }
  return ref;
}
var Recoil_useRefInitOnce = useRefInitOnce;
var {
  getNextTreeStateVersion: getNextTreeStateVersion$3,
  makeEmptyStoreState: makeEmptyStoreState$2
} = Recoil_State;
var {
  cleanUpNode: cleanUpNode$2,
  getDownstreamNodes: getDownstreamNodes$2,
  initializeNode: initializeNode$2,
  setNodeValue: setNodeValue$2,
  setUnvalidatedAtomValue_DEPRECATED: setUnvalidatedAtomValue_DEPRECATED$1
} = Recoil_FunctionalCore;
var {
  graph: graph$2
} = Recoil_Graph;
var {
  cloneGraph: cloneGraph$1
} = Recoil_Graph;
var {
  getNextStoreID: getNextStoreID$2
} = Recoil_Keys;
var {
  createMutableSource: createMutableSource$1,
  reactMode: reactMode$2
} = Recoil_ReactMode;
var {
  applyAtomValueWrites: applyAtomValueWrites$1
} = Recoil_RecoilValueInterface;
var {
  releaseScheduledRetainablesNow: releaseScheduledRetainablesNow$1
} = Recoil_Retention;
var {
  freshSnapshot: freshSnapshot$1
} = Recoil_Snapshot$1;
var {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef: useRef$1,
  useState
} = import_react.default;
function notInAContext() {
  throw Recoil_err("This component must be used inside a <RecoilRoot> component.");
}
var defaultStore = Object.freeze({
  storeID: getNextStoreID$2(),
  getState: notInAContext,
  replaceState: notInAContext,
  getGraph: notInAContext,
  subscribeToTransactions: notInAContext,
  addTransactionMetadata: notInAContext
});
var stateReplacerIsBeingExecuted = false;
function startNextTreeIfNeeded(store) {
  if (stateReplacerIsBeingExecuted) {
    throw Recoil_err("An atom update was triggered within the execution of a state updater function. State updater functions provided to Recoil must be pure functions.");
  }
  const storeState = store.getState();
  if (storeState.nextTree === null) {
    if (Recoil_gkx("recoil_memory_managament_2020") && Recoil_gkx("recoil_release_on_cascading_update_killswitch_2021")) {
      if (storeState.commitDepth > 0) {
        releaseScheduledRetainablesNow$1(store);
      }
    }
    const version = storeState.currentTree.version;
    const nextVersion = getNextTreeStateVersion$3();
    storeState.nextTree = {
      ...storeState.currentTree,
      version: nextVersion,
      stateID: nextVersion,
      dirtyAtoms: /* @__PURE__ */ new Set(),
      transactionMetadata: {}
    };
    storeState.graphsByVersion.set(nextVersion, cloneGraph$1(Recoil_nullthrows(storeState.graphsByVersion.get(version))));
  }
}
var AppContext = import_react.default.createContext({
  current: defaultStore
});
var useStoreRef = () => useContext(AppContext);
var MutableSourceContext = import_react.default.createContext(null);
function useRecoilMutableSource() {
  const mutableSource = useContext(MutableSourceContext);
  if (mutableSource == null) {
    Recoil_expectationViolation("Attempted to use a Recoil hook outside of a <RecoilRoot>. <RecoilRoot> must be an ancestor of any component that uses Recoil hooks.");
  }
  return mutableSource;
}
function notifyComponents(store, storeState, treeState) {
  const dependentNodes = getDownstreamNodes$2(store, treeState, treeState.dirtyAtoms);
  for (const key of dependentNodes) {
    const comps = storeState.nodeToComponentSubscriptions.get(key);
    if (comps) {
      for (const [_subID, [_debugName, callback]] of comps) {
        callback(treeState);
      }
    }
  }
}
function sendEndOfBatchNotifications(store) {
  const storeState = store.getState();
  const treeState = storeState.currentTree;
  const dirtyAtoms = treeState.dirtyAtoms;
  if (dirtyAtoms.size) {
    for (const [key, subscriptions] of storeState.nodeTransactionSubscriptions) {
      if (dirtyAtoms.has(key)) {
        for (const [_, subscription] of subscriptions) {
          subscription(store);
        }
      }
    }
    for (const [_, subscription] of storeState.transactionSubscriptions) {
      subscription(store);
    }
    if (!reactMode$2().early || storeState.suspendedComponentResolvers.size > 0) {
      notifyComponents(store, storeState, treeState);
      storeState.suspendedComponentResolvers.forEach((cb) => cb());
      storeState.suspendedComponentResolvers.clear();
    }
  }
  storeState.queuedComponentCallbacks_DEPRECATED.forEach((cb) => cb(treeState));
  storeState.queuedComponentCallbacks_DEPRECATED.splice(0, storeState.queuedComponentCallbacks_DEPRECATED.length);
}
function endBatch(store) {
  const storeState = store.getState();
  storeState.commitDepth++;
  try {
    const {
      nextTree
    } = storeState;
    if (nextTree == null) {
      return;
    }
    storeState.previousTree = storeState.currentTree;
    storeState.currentTree = nextTree;
    storeState.nextTree = null;
    sendEndOfBatchNotifications(store);
    if (storeState.previousTree != null) {
      storeState.graphsByVersion.delete(storeState.previousTree.version);
    } else {
      Recoil_recoverableViolation("Ended batch with no previous state, which is unexpected", "recoil");
    }
    storeState.previousTree = null;
    if (Recoil_gkx("recoil_memory_managament_2020")) {
      if (nextTree == null) {
        releaseScheduledRetainablesNow$1(store);
      }
    }
  } finally {
    storeState.commitDepth--;
  }
}
function Batcher({
  setNotifyBatcherOfChange
}) {
  const storeRef = useStoreRef();
  const [, setState] = useState([]);
  setNotifyBatcherOfChange(() => setState({}));
  useEffect(() => {
    setNotifyBatcherOfChange(() => setState({}));
    return () => {
      setNotifyBatcherOfChange(() => {
      });
    };
  }, [setNotifyBatcherOfChange]);
  useEffect(() => {
    Recoil_Queue.enqueueExecution("Batcher", () => {
      endBatch(storeRef.current);
    });
  });
  return null;
}
if (true) {
  if (typeof window !== "undefined" && !window.$recoilDebugStates) {
    window.$recoilDebugStates = [];
  }
}
function initialStoreState_DEPRECATED(store, initializeState) {
  const initial = makeEmptyStoreState$2();
  initializeState({
    set: (atom2, value) => {
      const state = initial.currentTree;
      const writes = setNodeValue$2(store, state, atom2.key, value);
      const writtenNodes = new Set(writes.keys());
      const nonvalidatedAtoms = state.nonvalidatedAtoms.clone();
      for (const n of writtenNodes) {
        nonvalidatedAtoms.delete(n);
      }
      initial.currentTree = {
        ...state,
        dirtyAtoms: Recoil_unionSets(state.dirtyAtoms, writtenNodes),
        atomValues: applyAtomValueWrites$1(state.atomValues, writes),
        // NB: PLEASE un-export applyAtomValueWrites when deleting this code
        nonvalidatedAtoms
      };
    },
    setUnvalidatedAtomValues: (atomValues) => {
      atomValues.forEach((v, k) => {
        initial.currentTree = setUnvalidatedAtomValue_DEPRECATED$1(initial.currentTree, k, v);
      });
    }
  });
  return initial;
}
function initialStoreState(initializeState) {
  const snapshot = freshSnapshot$1(initializeState);
  const storeState = snapshot.getStore_INTERNAL().getState();
  snapshot.retain();
  storeState.nodeCleanupFunctions.forEach((cleanup) => cleanup());
  storeState.nodeCleanupFunctions.clear();
  return storeState;
}
var nextID = 0;
function RecoilRoot_INTERNAL({
  initializeState_DEPRECATED,
  initializeState,
  store_INTERNAL: storeProp,
  // For use with React "context bridging"
  children
}) {
  let storeStateRef;
  const getGraph = (version) => {
    const graphs = storeStateRef.current.graphsByVersion;
    if (graphs.has(version)) {
      return Recoil_nullthrows(graphs.get(version));
    }
    const newGraph = graph$2();
    graphs.set(version, newGraph);
    return newGraph;
  };
  const subscribeToTransactions = (callback, key) => {
    if (key == null) {
      const {
        transactionSubscriptions
      } = storeRef.current.getState();
      const id = nextID++;
      transactionSubscriptions.set(id, callback);
      return {
        release: () => {
          transactionSubscriptions.delete(id);
        }
      };
    } else {
      const {
        nodeTransactionSubscriptions
      } = storeRef.current.getState();
      if (!nodeTransactionSubscriptions.has(key)) {
        nodeTransactionSubscriptions.set(key, /* @__PURE__ */ new Map());
      }
      const id = nextID++;
      Recoil_nullthrows(nodeTransactionSubscriptions.get(key)).set(id, callback);
      return {
        release: () => {
          const subs = nodeTransactionSubscriptions.get(key);
          if (subs) {
            subs.delete(id);
            if (subs.size === 0) {
              nodeTransactionSubscriptions.delete(key);
            }
          }
        }
      };
    }
  };
  const addTransactionMetadata = (metadata) => {
    startNextTreeIfNeeded(storeRef.current);
    for (const k of Object.keys(metadata)) {
      Recoil_nullthrows(storeRef.current.getState().nextTree).transactionMetadata[k] = metadata[k];
    }
  };
  const replaceState = (replacer) => {
    startNextTreeIfNeeded(storeRef.current);
    const nextTree = Recoil_nullthrows(storeStateRef.current.nextTree);
    let replaced;
    try {
      stateReplacerIsBeingExecuted = true;
      replaced = replacer(nextTree);
    } finally {
      stateReplacerIsBeingExecuted = false;
    }
    if (replaced === nextTree) {
      return;
    }
    if (true) {
      if (typeof window !== "undefined") {
        window.$recoilDebugStates.push(replaced);
      }
    }
    storeStateRef.current.nextTree = replaced;
    if (reactMode$2().early) {
      notifyComponents(storeRef.current, storeStateRef.current, replaced);
    }
    Recoil_nullthrows(notifyBatcherOfChange.current)();
  };
  const notifyBatcherOfChange = useRef$1(null);
  const setNotifyBatcherOfChange = useCallback((x) => {
    notifyBatcherOfChange.current = x;
  }, [notifyBatcherOfChange]);
  const storeRef = Recoil_useRefInitOnce(() => storeProp !== null && storeProp !== void 0 ? storeProp : {
    storeID: getNextStoreID$2(),
    getState: () => storeStateRef.current,
    replaceState,
    getGraph,
    subscribeToTransactions,
    addTransactionMetadata
  });
  if (storeProp != null) {
    storeRef.current = storeProp;
  }
  storeStateRef = Recoil_useRefInitOnce(() => initializeState_DEPRECATED != null ? initialStoreState_DEPRECATED(storeRef.current, initializeState_DEPRECATED) : initializeState != null ? initialStoreState(initializeState) : makeEmptyStoreState$2());
  const mutableSource = useMemo(() => createMutableSource$1 === null || createMutableSource$1 === void 0 ? void 0 : createMutableSource$1(storeStateRef, () => storeStateRef.current.currentTree.version), [storeStateRef]);
  useEffect(() => {
    const store = storeRef.current;
    for (const atomKey of new Set(store.getState().knownAtoms)) {
      initializeNode$2(store, atomKey, "get");
    }
    return () => {
      for (const atomKey of store.getState().knownAtoms) {
        cleanUpNode$2(store, atomKey);
      }
    };
  }, [storeRef]);
  return import_react.default.createElement(AppContext.Provider, {
    value: storeRef
  }, import_react.default.createElement(MutableSourceContext.Provider, {
    value: mutableSource
  }, import_react.default.createElement(Batcher, {
    setNotifyBatcherOfChange
  }), children));
}
function RecoilRoot(props) {
  const {
    override,
    ...propsExceptOverride
  } = props;
  const ancestorStoreRef = useStoreRef();
  if (override === false && ancestorStoreRef.current !== defaultStore) {
    return props.children;
  }
  return import_react.default.createElement(RecoilRoot_INTERNAL, propsExceptOverride);
}
function useRecoilStoreID() {
  return useStoreRef().current.storeID;
}
var Recoil_RecoilRoot = {
  RecoilRoot,
  useStoreRef,
  useRecoilMutableSource,
  useRecoilStoreID,
  notifyComponents_FOR_TESTING: notifyComponents,
  sendEndOfBatchNotifications_FOR_TESTING: sendEndOfBatchNotifications
};
function shallowArrayEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
var Recoil_shallowArrayEqual = shallowArrayEqual;
var {
  useEffect: useEffect$1,
  useRef: useRef$2
} = import_react.default;
function usePrevious(value) {
  const ref = useRef$2();
  useEffect$1(() => {
    ref.current = value;
  });
  return ref.current;
}
var Recoil_usePrevious = usePrevious;
var {
  useStoreRef: useStoreRef$1
} = Recoil_RecoilRoot;
var {
  SUSPENSE_TIMEOUT_MS: SUSPENSE_TIMEOUT_MS$1
} = Recoil_Retention;
var {
  updateRetainCount: updateRetainCount$2
} = Recoil_Retention;
var {
  RetentionZone: RetentionZone$3
} = Recoil_RetentionZone;
var {
  useEffect: useEffect$2,
  useRef: useRef$3
} = import_react.default;
var {
  isSSR: isSSR$2
} = Recoil_Environment;
function useRetain(toRetain) {
  if (!Recoil_gkx("recoil_memory_managament_2020")) {
    return;
  }
  return useRetain_ACTUAL(toRetain);
}
function useRetain_ACTUAL(toRetain) {
  const array = Array.isArray(toRetain) ? toRetain : [toRetain];
  const retainables = array.map((a) => a instanceof RetentionZone$3 ? a : a.key);
  const storeRef = useStoreRef$1();
  useEffect$2(() => {
    if (!Recoil_gkx("recoil_memory_managament_2020")) {
      return;
    }
    const store = storeRef.current;
    if (timeoutID.current && !isSSR$2) {
      window.clearTimeout(timeoutID.current);
      timeoutID.current = null;
    } else {
      for (const r of retainables) {
        updateRetainCount$2(store, r, 1);
      }
    }
    return () => {
      for (const r of retainables) {
        updateRetainCount$2(store, r, -1);
      }
    };
  }, [storeRef, ...retainables]);
  const timeoutID = useRef$3();
  const previousRetainables = Recoil_usePrevious(retainables);
  if (!isSSR$2 && (previousRetainables === void 0 || !Recoil_shallowArrayEqual(previousRetainables, retainables))) {
    const store = storeRef.current;
    for (const r of retainables) {
      updateRetainCount$2(store, r, 1);
    }
    if (previousRetainables) {
      for (const r of previousRetainables) {
        updateRetainCount$2(store, r, -1);
      }
    }
    if (timeoutID.current) {
      window.clearTimeout(timeoutID.current);
    }
    timeoutID.current = window.setTimeout(() => {
      timeoutID.current = null;
      for (const r of retainables) {
        updateRetainCount$2(store, r, -1);
      }
    }, SUSPENSE_TIMEOUT_MS$1);
  }
}
var Recoil_useRetain = useRetain;
function useComponentName() {
  return "<component name not available>";
}
var Recoil_useComponentName = useComponentName;
var {
  batchUpdates: batchUpdates$2
} = Recoil_Batching;
var {
  DEFAULT_VALUE: DEFAULT_VALUE$2
} = Recoil_Node;
var {
  currentRendererSupportsUseSyncExternalStore: currentRendererSupportsUseSyncExternalStore$1,
  reactMode: reactMode$3,
  useMutableSource: useMutableSource$1,
  useSyncExternalStore: useSyncExternalStore$1
} = Recoil_ReactMode;
var {
  useRecoilMutableSource: useRecoilMutableSource$1,
  useStoreRef: useStoreRef$2
} = Recoil_RecoilRoot;
var {
  isRecoilValue: isRecoilValue$2
} = Recoil_RecoilValue$1;
var {
  AbstractRecoilValue: AbstractRecoilValue$3,
  getRecoilValueAsLoadable: getRecoilValueAsLoadable$2,
  setRecoilValue: setRecoilValue$2,
  setUnvalidatedRecoilValue: setUnvalidatedRecoilValue$2,
  subscribeToRecoilValue: subscribeToRecoilValue$1
} = Recoil_RecoilValueInterface;
var {
  useCallback: useCallback$1,
  useEffect: useEffect$3,
  useMemo: useMemo$1,
  useRef: useRef$4,
  useState: useState$1
} = import_react.default;
var {
  setByAddingToSet: setByAddingToSet$2
} = Recoil_CopyOnWrite;
var {
  isSSR: isSSR$3
} = Recoil_Environment;
function handleLoadable(loadable, recoilValue, storeRef) {
  if (loadable.state === "hasValue") {
    return loadable.contents;
  } else if (loadable.state === "loading") {
    const promise = new Promise((resolve) => {
      const suspendedComponentResolvers = storeRef.current.getState().suspendedComponentResolvers;
      suspendedComponentResolvers.add(resolve);
      if (isSSR$3 && Recoil_isPromise(loadable.contents)) {
        loadable.contents.finally(() => {
          suspendedComponentResolvers.delete(resolve);
        });
      }
    });
    throw promise;
  } else if (loadable.state === "hasError") {
    throw loadable.contents;
  } else {
    throw Recoil_err(`Invalid value of loadable atom "${recoilValue.key}"`);
  }
}
function validateRecoilValue(recoilValue, hookName) {
  if (!isRecoilValue$2(recoilValue)) {
    throw Recoil_err(`Invalid argument to ${hookName}: expected an atom or selector but got ${String(recoilValue)}`);
  }
}
function useRecoilInterface_DEPRECATED() {
  const componentName = Recoil_useComponentName();
  const storeRef = useStoreRef$2();
  const [, forceUpdate] = useState$1([]);
  const recoilValuesUsed = useRef$4(/* @__PURE__ */ new Set());
  recoilValuesUsed.current = /* @__PURE__ */ new Set();
  const previousSubscriptions = useRef$4(/* @__PURE__ */ new Set());
  const subscriptions = useRef$4(/* @__PURE__ */ new Map());
  const unsubscribeFrom = useCallback$1((key) => {
    const sub = subscriptions.current.get(key);
    if (sub) {
      sub.release();
      subscriptions.current.delete(key);
    }
  }, [subscriptions]);
  const updateState = useCallback$1((_state, key) => {
    if (subscriptions.current.has(key)) {
      forceUpdate([]);
    }
  }, []);
  useEffect$3(() => {
    const store = storeRef.current;
    Recoil_differenceSets(recoilValuesUsed.current, previousSubscriptions.current).forEach((key) => {
      if (subscriptions.current.has(key)) {
        Recoil_expectationViolation(`Double subscription to RecoilValue "${key}"`);
        return;
      }
      const sub = subscribeToRecoilValue$1(store, new AbstractRecoilValue$3(key), (state2) => updateState(state2, key), componentName);
      subscriptions.current.set(key, sub);
      const state = store.getState();
      if (state.nextTree) {
        store.getState().queuedComponentCallbacks_DEPRECATED.push(() => {
          updateState(store.getState(), key);
        });
      } else {
        updateState(store.getState(), key);
      }
    });
    Recoil_differenceSets(previousSubscriptions.current, recoilValuesUsed.current).forEach((key) => {
      unsubscribeFrom(key);
    });
    previousSubscriptions.current = recoilValuesUsed.current;
  });
  useEffect$3(() => {
    const currentSubscriptions = subscriptions.current;
    Recoil_differenceSets(recoilValuesUsed.current, new Set(currentSubscriptions.keys())).forEach((key) => {
      const sub = subscribeToRecoilValue$1(storeRef.current, new AbstractRecoilValue$3(key), (state) => updateState(state, key), componentName);
      currentSubscriptions.set(key, sub);
    });
    return () => currentSubscriptions.forEach((_, key) => unsubscribeFrom(key));
  }, [componentName, storeRef, unsubscribeFrom, updateState]);
  return useMemo$1(() => {
    function useSetRecoilState2(recoilState) {
      if (true) {
        validateRecoilValue(recoilState, "useSetRecoilState");
      }
      return (newValueOrUpdater) => {
        setRecoilValue$2(storeRef.current, recoilState, newValueOrUpdater);
      };
    }
    function useResetRecoilState2(recoilState) {
      if (true) {
        validateRecoilValue(recoilState, "useResetRecoilState");
      }
      return () => setRecoilValue$2(storeRef.current, recoilState, DEFAULT_VALUE$2);
    }
    function useRecoilValueLoadable2(recoilValue) {
      var _storeState$nextTree;
      if (true) {
        validateRecoilValue(recoilValue, "useRecoilValueLoadable");
      }
      if (!recoilValuesUsed.current.has(recoilValue.key)) {
        recoilValuesUsed.current = setByAddingToSet$2(recoilValuesUsed.current, recoilValue.key);
      }
      const storeState = storeRef.current.getState();
      return getRecoilValueAsLoadable$2(storeRef.current, recoilValue, reactMode$3().early ? (_storeState$nextTree = storeState.nextTree) !== null && _storeState$nextTree !== void 0 ? _storeState$nextTree : storeState.currentTree : storeState.currentTree);
    }
    function useRecoilValue2(recoilValue) {
      if (true) {
        validateRecoilValue(recoilValue, "useRecoilValue");
      }
      const loadable = useRecoilValueLoadable2(recoilValue);
      return handleLoadable(loadable, recoilValue, storeRef);
    }
    function useRecoilState2(recoilState) {
      if (true) {
        validateRecoilValue(recoilState, "useRecoilState");
      }
      return [useRecoilValue2(recoilState), useSetRecoilState2(recoilState)];
    }
    function useRecoilStateLoadable2(recoilState) {
      if (true) {
        validateRecoilValue(recoilState, "useRecoilStateLoadable");
      }
      return [useRecoilValueLoadable2(recoilState), useSetRecoilState2(recoilState)];
    }
    return {
      getRecoilValue: useRecoilValue2,
      getRecoilValueLoadable: useRecoilValueLoadable2,
      getRecoilState: useRecoilState2,
      getRecoilStateLoadable: useRecoilStateLoadable2,
      getSetRecoilState: useSetRecoilState2,
      getResetRecoilState: useResetRecoilState2
    };
  }, [recoilValuesUsed, storeRef]);
}
var recoilComponentGetRecoilValueCount_FOR_TESTING = {
  current: 0
};
function useRecoilValueLoadable_SYNC_EXTERNAL_STORE(recoilValue) {
  const storeRef = useStoreRef$2();
  const componentName = Recoil_useComponentName();
  const getSnapshot = useCallback$1(() => {
    var _storeState$nextTree2;
    if (true) {
      recoilComponentGetRecoilValueCount_FOR_TESTING.current++;
    }
    const store = storeRef.current;
    const storeState = store.getState();
    const treeState = reactMode$3().early ? (_storeState$nextTree2 = storeState.nextTree) !== null && _storeState$nextTree2 !== void 0 ? _storeState$nextTree2 : storeState.currentTree : storeState.currentTree;
    const loadable = getRecoilValueAsLoadable$2(store, recoilValue, treeState);
    return {
      loadable,
      key: recoilValue.key
    };
  }, [storeRef, recoilValue]);
  const memoizePreviousSnapshot = useCallback$1((getState) => {
    let prevState;
    return () => {
      var _prevState, _prevState2;
      const nextState = getState();
      if ((_prevState = prevState) !== null && _prevState !== void 0 && _prevState.loadable.is(nextState.loadable) && ((_prevState2 = prevState) === null || _prevState2 === void 0 ? void 0 : _prevState2.key) === nextState.key) {
        return prevState;
      }
      prevState = nextState;
      return nextState;
    };
  }, []);
  const getMemoizedSnapshot = useMemo$1(() => memoizePreviousSnapshot(getSnapshot), [getSnapshot, memoizePreviousSnapshot]);
  const subscribe = useCallback$1((notify) => {
    const store = storeRef.current;
    const subscription = subscribeToRecoilValue$1(store, recoilValue, notify, componentName);
    return subscription.release;
  }, [storeRef, recoilValue, componentName]);
  return useSyncExternalStore$1(
    subscribe,
    getMemoizedSnapshot,
    // getSnapshot()
    getMemoizedSnapshot
    // getServerSnapshot() for SSR support
  ).loadable;
}
function useRecoilValueLoadable_MUTABLE_SOURCE(recoilValue) {
  const storeRef = useStoreRef$2();
  const getLoadable = useCallback$1(() => {
    var _storeState$nextTree3;
    const store = storeRef.current;
    const storeState = store.getState();
    const treeState = reactMode$3().early ? (_storeState$nextTree3 = storeState.nextTree) !== null && _storeState$nextTree3 !== void 0 ? _storeState$nextTree3 : storeState.currentTree : storeState.currentTree;
    return getRecoilValueAsLoadable$2(store, recoilValue, treeState);
  }, [storeRef, recoilValue]);
  const getLoadableWithTesting = useCallback$1(() => {
    if (true) {
      recoilComponentGetRecoilValueCount_FOR_TESTING.current++;
    }
    return getLoadable();
  }, [getLoadable]);
  const componentName = Recoil_useComponentName();
  const subscribe = useCallback$1((_storeState, notify) => {
    const store = storeRef.current;
    const subscription = subscribeToRecoilValue$1(store, recoilValue, () => {
      if (!Recoil_gkx("recoil_suppress_rerender_in_callback")) {
        return notify();
      }
      const newLoadable = getLoadable();
      if (!prevLoadableRef.current.is(newLoadable)) {
        notify();
      }
      prevLoadableRef.current = newLoadable;
    }, componentName);
    return subscription.release;
  }, [storeRef, recoilValue, componentName, getLoadable]);
  const source = useRecoilMutableSource$1();
  if (source == null) {
    throw Recoil_err("Recoil hooks must be used in components contained within a <RecoilRoot> component.");
  }
  const loadable = useMutableSource$1(source, getLoadableWithTesting, subscribe);
  const prevLoadableRef = useRef$4(loadable);
  useEffect$3(() => {
    prevLoadableRef.current = loadable;
  });
  return loadable;
}
function useRecoilValueLoadable_TRANSITION_SUPPORT(recoilValue) {
  const storeRef = useStoreRef$2();
  const componentName = Recoil_useComponentName();
  const getLoadable = useCallback$1(() => {
    var _storeState$nextTree4;
    if (true) {
      recoilComponentGetRecoilValueCount_FOR_TESTING.current++;
    }
    const store = storeRef.current;
    const storeState = store.getState();
    const treeState = reactMode$3().early ? (_storeState$nextTree4 = storeState.nextTree) !== null && _storeState$nextTree4 !== void 0 ? _storeState$nextTree4 : storeState.currentTree : storeState.currentTree;
    return getRecoilValueAsLoadable$2(store, recoilValue, treeState);
  }, [storeRef, recoilValue]);
  const getState = useCallback$1(() => ({
    loadable: getLoadable(),
    key: recoilValue.key
  }), [getLoadable, recoilValue.key]);
  const updateState = useCallback$1((prevState) => {
    const nextState = getState();
    return prevState.loadable.is(nextState.loadable) && prevState.key === nextState.key ? prevState : nextState;
  }, [getState]);
  useEffect$3(() => {
    const subscription = subscribeToRecoilValue$1(storeRef.current, recoilValue, (_state) => {
      setState(updateState);
    }, componentName);
    setState(updateState);
    return subscription.release;
  }, [componentName, recoilValue, storeRef, updateState]);
  const [state, setState] = useState$1(getState);
  return state.key !== recoilValue.key ? getState().loadable : state.loadable;
}
function useRecoilValueLoadable_LEGACY(recoilValue) {
  const storeRef = useStoreRef$2();
  const [, forceUpdate] = useState$1([]);
  const componentName = Recoil_useComponentName();
  const getLoadable = useCallback$1(() => {
    var _storeState$nextTree5;
    if (true) {
      recoilComponentGetRecoilValueCount_FOR_TESTING.current++;
    }
    const store = storeRef.current;
    const storeState = store.getState();
    const treeState = reactMode$3().early ? (_storeState$nextTree5 = storeState.nextTree) !== null && _storeState$nextTree5 !== void 0 ? _storeState$nextTree5 : storeState.currentTree : storeState.currentTree;
    return getRecoilValueAsLoadable$2(store, recoilValue, treeState);
  }, [storeRef, recoilValue]);
  const loadable = getLoadable();
  const prevLoadableRef = useRef$4(loadable);
  useEffect$3(() => {
    prevLoadableRef.current = loadable;
  });
  useEffect$3(() => {
    const store = storeRef.current;
    const storeState = store.getState();
    const subscription = subscribeToRecoilValue$1(store, recoilValue, (_state) => {
      var _prevLoadableRef$curr;
      if (!Recoil_gkx("recoil_suppress_rerender_in_callback")) {
        return forceUpdate([]);
      }
      const newLoadable = getLoadable();
      if (!((_prevLoadableRef$curr = prevLoadableRef.current) !== null && _prevLoadableRef$curr !== void 0 && _prevLoadableRef$curr.is(newLoadable))) {
        forceUpdate(newLoadable);
      }
      prevLoadableRef.current = newLoadable;
    }, componentName);
    if (storeState.nextTree) {
      store.getState().queuedComponentCallbacks_DEPRECATED.push(() => {
        prevLoadableRef.current = null;
        forceUpdate([]);
      });
    } else {
      var _prevLoadableRef$curr2;
      if (!Recoil_gkx("recoil_suppress_rerender_in_callback")) {
        return forceUpdate([]);
      }
      const newLoadable = getLoadable();
      if (!((_prevLoadableRef$curr2 = prevLoadableRef.current) !== null && _prevLoadableRef$curr2 !== void 0 && _prevLoadableRef$curr2.is(newLoadable))) {
        forceUpdate(newLoadable);
      }
      prevLoadableRef.current = newLoadable;
    }
    return subscription.release;
  }, [componentName, getLoadable, recoilValue, storeRef]);
  return loadable;
}
function useRecoilValueLoadable(recoilValue) {
  if (true) {
    validateRecoilValue(recoilValue, "useRecoilValueLoadable");
  }
  if (Recoil_gkx("recoil_memory_managament_2020")) {
    Recoil_useRetain(recoilValue);
  }
  return {
    TRANSITION_SUPPORT: useRecoilValueLoadable_TRANSITION_SUPPORT,
    // Recoil will attemp to detect if `useSyncExternalStore()` is supported with
    // `reactMode()` before calling it.  However, sometimes the host React
    // environment supports it but uses additional React renderers (such as with
    // `react-three-fiber`) which do not.  While this is technically a user issue
    // by using a renderer with React 18+ that doesn't fully support React 18 we
    // don't want to break users if it can be avoided. As the current renderer can
    // change at runtime, we need to dynamically check and fallback if necessary.
    SYNC_EXTERNAL_STORE: currentRendererSupportsUseSyncExternalStore$1() ? useRecoilValueLoadable_SYNC_EXTERNAL_STORE : useRecoilValueLoadable_TRANSITION_SUPPORT,
    MUTABLE_SOURCE: useRecoilValueLoadable_MUTABLE_SOURCE,
    LEGACY: useRecoilValueLoadable_LEGACY
  }[reactMode$3().mode](recoilValue);
}
function useRecoilValue(recoilValue) {
  if (true) {
    validateRecoilValue(recoilValue, "useRecoilValue");
  }
  const storeRef = useStoreRef$2();
  const loadable = useRecoilValueLoadable(recoilValue);
  return handleLoadable(loadable, recoilValue, storeRef);
}
function useSetRecoilState(recoilState) {
  if (true) {
    validateRecoilValue(recoilState, "useSetRecoilState");
  }
  const storeRef = useStoreRef$2();
  return useCallback$1((newValueOrUpdater) => {
    setRecoilValue$2(storeRef.current, recoilState, newValueOrUpdater);
  }, [storeRef, recoilState]);
}
function useResetRecoilState(recoilState) {
  if (true) {
    validateRecoilValue(recoilState, "useResetRecoilState");
  }
  const storeRef = useStoreRef$2();
  return useCallback$1(() => {
    setRecoilValue$2(storeRef.current, recoilState, DEFAULT_VALUE$2);
  }, [storeRef, recoilState]);
}
function useRecoilState(recoilState) {
  if (true) {
    validateRecoilValue(recoilState, "useRecoilState");
  }
  return [useRecoilValue(recoilState), useSetRecoilState(recoilState)];
}
function useRecoilStateLoadable(recoilState) {
  if (true) {
    validateRecoilValue(recoilState, "useRecoilStateLoadable");
  }
  return [useRecoilValueLoadable(recoilState), useSetRecoilState(recoilState)];
}
function useSetUnvalidatedAtomValues() {
  const storeRef = useStoreRef$2();
  return (values, transactionMetadata = {}) => {
    batchUpdates$2(() => {
      storeRef.current.addTransactionMetadata(transactionMetadata);
      values.forEach((value, key) => setUnvalidatedRecoilValue$2(storeRef.current, new AbstractRecoilValue$3(key), value));
    });
  };
}
function useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE(recoilValue) {
  if (true) {
    validateRecoilValue(recoilValue, "useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE");
    if (!reactMode$3().early) {
      Recoil_recoverableViolation("Attepmt to use a hook with UNSTABLE_TRANSITION_SUPPORT in a rendering mode incompatible with concurrent rendering.  Try enabling the recoil_sync_external_store or recoil_transition_support GKs.");
    }
  }
  if (Recoil_gkx("recoil_memory_managament_2020")) {
    Recoil_useRetain(recoilValue);
  }
  return useRecoilValueLoadable_TRANSITION_SUPPORT(recoilValue);
}
function useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(recoilValue) {
  if (true) {
    validateRecoilValue(recoilValue, "useRecoilValue_TRANSITION_SUPPORT_UNSTABLE");
  }
  const storeRef = useStoreRef$2();
  const loadable = useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE(recoilValue);
  return handleLoadable(loadable, recoilValue, storeRef);
}
function useRecoilState_TRANSITION_SUPPORT_UNSTABLE(recoilState) {
  if (true) {
    validateRecoilValue(recoilState, "useRecoilState_TRANSITION_SUPPORT_UNSTABLE");
  }
  return [useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(recoilState), useSetRecoilState(recoilState)];
}
var Recoil_Hooks = {
  recoilComponentGetRecoilValueCount_FOR_TESTING,
  useRecoilInterface: useRecoilInterface_DEPRECATED,
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValue,
  useRecoilValueLoadable,
  useResetRecoilState,
  useSetRecoilState,
  useSetUnvalidatedAtomValues,
  useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE,
  useRecoilValue_TRANSITION_SUPPORT_UNSTABLE,
  useRecoilState_TRANSITION_SUPPORT_UNSTABLE
};
function filterMap(map, callback) {
  const result = /* @__PURE__ */ new Map();
  for (const [key, value] of map) {
    if (callback(value, key)) {
      result.set(key, value);
    }
  }
  return result;
}
var Recoil_filterMap = filterMap;
function filterSet(set, callback) {
  const result = /* @__PURE__ */ new Set();
  for (const value of set) {
    if (callback(value)) {
      result.add(value);
    }
  }
  return result;
}
var Recoil_filterSet = filterSet;
function mergeMaps(...maps) {
  const result = /* @__PURE__ */ new Map();
  for (let i = 0; i < maps.length; i++) {
    const iterator = maps[i].keys();
    let nextKey;
    while (!(nextKey = iterator.next()).done) {
      result.set(nextKey.value, maps[i].get(nextKey.value));
    }
  }
  return result;
}
var Recoil_mergeMaps = mergeMaps;
var {
  batchUpdates: batchUpdates$3
} = Recoil_Batching;
var {
  DEFAULT_VALUE: DEFAULT_VALUE$3,
  getNode: getNode$4,
  nodes: nodes$1
} = Recoil_Node;
var {
  useStoreRef: useStoreRef$3
} = Recoil_RecoilRoot;
var {
  AbstractRecoilValue: AbstractRecoilValue$4,
  setRecoilValueLoadable: setRecoilValueLoadable$1
} = Recoil_RecoilValueInterface;
var {
  SUSPENSE_TIMEOUT_MS: SUSPENSE_TIMEOUT_MS$2
} = Recoil_Retention;
var {
  cloneSnapshot: cloneSnapshot$1
} = Recoil_Snapshot$1;
var {
  useCallback: useCallback$2,
  useEffect: useEffect$4,
  useRef: useRef$5,
  useState: useState$2
} = import_react.default;
var {
  isSSR: isSSR$4
} = Recoil_Environment;
function useTransactionSubscription(callback) {
  const storeRef = useStoreRef$3();
  useEffect$4(() => {
    const sub = storeRef.current.subscribeToTransactions(callback);
    return sub.release;
  }, [callback, storeRef]);
}
function externallyVisibleAtomValuesInState(state) {
  const atomValues = state.atomValues.toMap();
  const persistedAtomContentsValues = Recoil_mapMap(Recoil_filterMap(atomValues, (v, k) => {
    const node = getNode$4(k);
    const persistence = node.persistence_UNSTABLE;
    return persistence != null && persistence.type !== "none" && v.state === "hasValue";
  }), (v) => v.contents);
  return Recoil_mergeMaps(state.nonvalidatedAtoms.toMap(), persistedAtomContentsValues);
}
function useTransactionObservation_DEPRECATED(callback) {
  useTransactionSubscription(useCallback$2((store) => {
    let previousTree = store.getState().previousTree;
    const currentTree = store.getState().currentTree;
    if (!previousTree) {
      Recoil_recoverableViolation("Transaction subscribers notified without a previous tree being present -- this is a bug in Recoil");
      previousTree = store.getState().currentTree;
    }
    const atomValues = externallyVisibleAtomValuesInState(currentTree);
    const previousAtomValues = externallyVisibleAtomValuesInState(previousTree);
    const atomInfo = Recoil_mapMap(nodes$1, (node) => {
      var _node$persistence_UNS, _node$persistence_UNS2, _node$persistence_UNS3, _node$persistence_UNS4;
      return {
        persistence_UNSTABLE: {
          type: (_node$persistence_UNS = (_node$persistence_UNS2 = node.persistence_UNSTABLE) === null || _node$persistence_UNS2 === void 0 ? void 0 : _node$persistence_UNS2.type) !== null && _node$persistence_UNS !== void 0 ? _node$persistence_UNS : "none",
          backButton: (_node$persistence_UNS3 = (_node$persistence_UNS4 = node.persistence_UNSTABLE) === null || _node$persistence_UNS4 === void 0 ? void 0 : _node$persistence_UNS4.backButton) !== null && _node$persistence_UNS3 !== void 0 ? _node$persistence_UNS3 : false
        }
      };
    });
    const modifiedAtoms = Recoil_filterSet(currentTree.dirtyAtoms, (k) => atomValues.has(k) || previousAtomValues.has(k));
    callback({
      atomValues,
      previousAtomValues,
      atomInfo,
      modifiedAtoms,
      transactionMetadata: {
        ...currentTree.transactionMetadata
      }
    });
  }, [callback]));
}
function useRecoilTransactionObserver(callback) {
  useTransactionSubscription(useCallback$2((store) => {
    const snapshot = cloneSnapshot$1(store, "latest");
    const previousSnapshot = cloneSnapshot$1(store, "previous");
    callback({
      snapshot,
      previousSnapshot
    });
  }, [callback]));
}
function useRecoilSnapshot() {
  const storeRef = useStoreRef$3();
  const [snapshot, setSnapshot] = useState$2(() => cloneSnapshot$1(storeRef.current));
  const previousSnapshot = Recoil_usePrevious(snapshot);
  const timeoutID = useRef$5();
  const releaseRef = useRef$5();
  useTransactionSubscription(useCallback$2((store) => setSnapshot(cloneSnapshot$1(store)), []));
  useEffect$4(() => {
    const release = snapshot.retain();
    if (timeoutID.current && !isSSR$4) {
      var _releaseRef$current;
      window.clearTimeout(timeoutID.current);
      timeoutID.current = null;
      (_releaseRef$current = releaseRef.current) === null || _releaseRef$current === void 0 ? void 0 : _releaseRef$current.call(releaseRef);
      releaseRef.current = null;
    }
    return () => {
      window.setTimeout(release, 10);
    };
  }, [snapshot]);
  if (previousSnapshot !== snapshot && !isSSR$4) {
    if (timeoutID.current) {
      var _releaseRef$current2;
      window.clearTimeout(timeoutID.current);
      timeoutID.current = null;
      (_releaseRef$current2 = releaseRef.current) === null || _releaseRef$current2 === void 0 ? void 0 : _releaseRef$current2.call(releaseRef);
      releaseRef.current = null;
    }
    releaseRef.current = snapshot.retain();
    timeoutID.current = window.setTimeout(() => {
      var _releaseRef$current3;
      timeoutID.current = null;
      (_releaseRef$current3 = releaseRef.current) === null || _releaseRef$current3 === void 0 ? void 0 : _releaseRef$current3.call(releaseRef);
      releaseRef.current = null;
    }, SUSPENSE_TIMEOUT_MS$2);
  }
  return snapshot;
}
function gotoSnapshot(store, snapshot) {
  var _storeState$nextTree;
  const storeState = store.getState();
  const prev = (_storeState$nextTree = storeState.nextTree) !== null && _storeState$nextTree !== void 0 ? _storeState$nextTree : storeState.currentTree;
  const next = snapshot.getStore_INTERNAL().getState().currentTree;
  batchUpdates$3(() => {
    const keysToUpdate = /* @__PURE__ */ new Set();
    for (const keys of [prev.atomValues.keys(), next.atomValues.keys()]) {
      for (const key of keys) {
        var _prev$atomValues$get, _next$atomValues$get;
        if (((_prev$atomValues$get = prev.atomValues.get(key)) === null || _prev$atomValues$get === void 0 ? void 0 : _prev$atomValues$get.contents) !== ((_next$atomValues$get = next.atomValues.get(key)) === null || _next$atomValues$get === void 0 ? void 0 : _next$atomValues$get.contents) && getNode$4(key).shouldRestoreFromSnapshots) {
          keysToUpdate.add(key);
        }
      }
    }
    keysToUpdate.forEach((key) => {
      setRecoilValueLoadable$1(store, new AbstractRecoilValue$4(key), next.atomValues.has(key) ? Recoil_nullthrows(next.atomValues.get(key)) : DEFAULT_VALUE$3);
    });
    store.replaceState((state) => ({
      ...state,
      stateID: snapshot.getID()
    }));
  });
}
function useGotoRecoilSnapshot() {
  const storeRef = useStoreRef$3();
  return useCallback$2((snapshot) => gotoSnapshot(storeRef.current, snapshot), [storeRef]);
}
var Recoil_SnapshotHooks = {
  useRecoilSnapshot,
  gotoSnapshot,
  useGotoRecoilSnapshot,
  useRecoilTransactionObserver,
  useTransactionObservation_DEPRECATED,
  useTransactionSubscription_DEPRECATED: useTransactionSubscription
};
var {
  peekNodeInfo: peekNodeInfo$2
} = Recoil_FunctionalCore;
var {
  useStoreRef: useStoreRef$4
} = Recoil_RecoilRoot;
function useGetRecoilValueInfo() {
  const storeRef = useStoreRef$4();
  return ({
    key
  }) => peekNodeInfo$2(storeRef.current, storeRef.current.getState().currentTree, key);
}
var Recoil_useGetRecoilValueInfo = useGetRecoilValueInfo;
var {
  reactMode: reactMode$4
} = Recoil_ReactMode;
var {
  RecoilRoot: RecoilRoot$1,
  useStoreRef: useStoreRef$5
} = Recoil_RecoilRoot;
var {
  useMemo: useMemo$2
} = import_react.default;
function useRecoilBridgeAcrossReactRoots() {
  if (reactMode$4().mode === "MUTABLE_SOURCE") {
    console.warn("Warning: There are known issues using useRecoilBridgeAcrossReactRoots() in recoil_mutable_source rendering mode.  Please consider upgrading to recoil_sync_external_store mode.");
  }
  const store = useStoreRef$5().current;
  return useMemo$2(() => {
    function RecoilBridge({
      children
    }) {
      return import_react.default.createElement(RecoilRoot$1, {
        store_INTERNAL: store
      }, children);
    }
    return RecoilBridge;
  }, [store]);
}
var Recoil_useRecoilBridgeAcrossReactRoots = useRecoilBridgeAcrossReactRoots;
var {
  loadableWithValue: loadableWithValue$1
} = Recoil_Loadable$1;
var {
  initializeNode: initializeNode$3
} = Recoil_FunctionalCore;
var {
  DEFAULT_VALUE: DEFAULT_VALUE$4,
  getNode: getNode$5
} = Recoil_Node;
var {
  copyTreeState: copyTreeState$1,
  getRecoilValueAsLoadable: getRecoilValueAsLoadable$3,
  invalidateDownstreams: invalidateDownstreams$1,
  writeLoadableToTreeState: writeLoadableToTreeState$1
} = Recoil_RecoilValueInterface;
function isAtom(recoilValue) {
  return getNode$5(recoilValue.key).nodeType === "atom";
}
var TransactionInterfaceImpl = class {
  constructor(store, treeState) {
    _defineProperty(this, "_store", void 0);
    _defineProperty(this, "_treeState", void 0);
    _defineProperty(this, "_changes", void 0);
    _defineProperty(this, "get", (recoilValue) => {
      if (this._changes.has(recoilValue.key)) {
        return this._changes.get(recoilValue.key);
      }
      if (!isAtom(recoilValue)) {
        throw Recoil_err("Reading selectors within atomicUpdate is not supported");
      }
      const loadable = getRecoilValueAsLoadable$3(this._store, recoilValue, this._treeState);
      if (loadable.state === "hasValue") {
        return loadable.contents;
      } else if (loadable.state === "hasError") {
        throw loadable.contents;
      } else {
        throw Recoil_err(`Expected Recoil atom ${recoilValue.key} to have a value, but it is in a loading state.`);
      }
    });
    _defineProperty(this, "set", (recoilState, valueOrUpdater) => {
      if (!isAtom(recoilState)) {
        throw Recoil_err("Setting selectors within atomicUpdate is not supported");
      }
      if (typeof valueOrUpdater === "function") {
        const current = this.get(recoilState);
        this._changes.set(recoilState.key, valueOrUpdater(current));
      } else {
        initializeNode$3(this._store, recoilState.key, "set");
        this._changes.set(recoilState.key, valueOrUpdater);
      }
    });
    _defineProperty(this, "reset", (recoilState) => {
      this.set(recoilState, DEFAULT_VALUE$4);
    });
    this._store = store;
    this._treeState = treeState;
    this._changes = /* @__PURE__ */ new Map();
  }
  // Allow destructing
  // eslint-disable-next-line fb-www/extra-arrow-initializer
  newTreeState_INTERNAL() {
    if (this._changes.size === 0) {
      return this._treeState;
    }
    const newState = copyTreeState$1(this._treeState);
    for (const [k, v] of this._changes) {
      writeLoadableToTreeState$1(newState, k, loadableWithValue$1(v));
    }
    invalidateDownstreams$1(this._store, newState);
    return newState;
  }
};
function atomicUpdater(store) {
  return (fn) => {
    store.replaceState((treeState) => {
      const changeset = new TransactionInterfaceImpl(store, treeState);
      fn(changeset);
      return changeset.newTreeState_INTERNAL();
    });
  };
}
var Recoil_AtomicUpdates = {
  atomicUpdater
};
var Recoil_AtomicUpdates_1 = Recoil_AtomicUpdates.atomicUpdater;
var Recoil_AtomicUpdates$1 = Object.freeze({
  __proto__: null,
  atomicUpdater: Recoil_AtomicUpdates_1
});
function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
var invariant_1 = invariant;
var Recoil_invariant = invariant_1;
var {
  atomicUpdater: atomicUpdater$1
} = Recoil_AtomicUpdates$1;
var {
  batchUpdates: batchUpdates$4
} = Recoil_Batching;
var {
  DEFAULT_VALUE: DEFAULT_VALUE$5
} = Recoil_Node;
var {
  useStoreRef: useStoreRef$6
} = Recoil_RecoilRoot;
var {
  refreshRecoilValue: refreshRecoilValue$1,
  setRecoilValue: setRecoilValue$3
} = Recoil_RecoilValueInterface;
var {
  cloneSnapshot: cloneSnapshot$2
} = Recoil_Snapshot$1;
var {
  gotoSnapshot: gotoSnapshot$1
} = Recoil_SnapshotHooks;
var {
  useCallback: useCallback$3
} = import_react.default;
var Sentinel = class {
};
var SENTINEL = new Sentinel();
function recoilCallback(store, fn, args, extraInterface) {
  let ret = SENTINEL;
  let releaseSnapshot;
  batchUpdates$4(() => {
    const errMsg = "useRecoilCallback() expects a function that returns a function: it accepts a function of the type (RecoilInterface) => (Args) => ReturnType and returns a callback function (Args) => ReturnType, where RecoilInterface is an object {snapshot, set, ...} and Args and ReturnType are the argument and return types of the callback you want to create.  Please see the docs at recoiljs.org for details.";
    if (typeof fn !== "function") {
      throw Recoil_err(errMsg);
    }
    const callbackInterface = Recoil_lazyProxy({
      ...extraInterface !== null && extraInterface !== void 0 ? extraInterface : {},
      // flowlint-line unclear-type:off
      // $FlowFixMe[missing-local-annot]
      set: (node, newValue) => setRecoilValue$3(store, node, newValue),
      // $FlowFixMe[missing-local-annot]
      reset: (node) => setRecoilValue$3(store, node, DEFAULT_VALUE$5),
      // $FlowFixMe[missing-local-annot]
      refresh: (node) => refreshRecoilValue$1(store, node),
      gotoSnapshot: (snapshot) => gotoSnapshot$1(store, snapshot),
      transact_UNSTABLE: (transaction) => atomicUpdater$1(store)(transaction)
    }, {
      snapshot: () => {
        const snapshot = cloneSnapshot$2(store);
        releaseSnapshot = snapshot.retain();
        return snapshot;
      }
    });
    const callback = fn(callbackInterface);
    if (typeof callback !== "function") {
      throw Recoil_err(errMsg);
    }
    ret = callback(...args);
  });
  !!(ret instanceof Sentinel) ? true ? Recoil_invariant(false, "batchUpdates should return immediately") : Recoil_invariant(false) : void 0;
  if (Recoil_isPromise(ret)) {
    ret = ret.finally(() => {
      var _releaseSnapshot;
      (_releaseSnapshot = releaseSnapshot) === null || _releaseSnapshot === void 0 ? void 0 : _releaseSnapshot();
    });
  } else {
    var _releaseSnapshot2;
    (_releaseSnapshot2 = releaseSnapshot) === null || _releaseSnapshot2 === void 0 ? void 0 : _releaseSnapshot2();
  }
  return ret;
}
function useRecoilCallback(fn, deps) {
  const storeRef = useStoreRef$6();
  return useCallback$3(
    // $FlowIssue[incompatible-call]
    (...args) => {
      return recoilCallback(storeRef.current, fn, args);
    },
    deps != null ? [...deps, storeRef] : void 0
    // eslint-disable-line fb-www/react-hooks-deps
  );
}
var Recoil_useRecoilCallback = {
  recoilCallback,
  useRecoilCallback
};
var {
  useStoreRef: useStoreRef$7
} = Recoil_RecoilRoot;
var {
  refreshRecoilValue: refreshRecoilValue$2
} = Recoil_RecoilValueInterface;
var {
  useCallback: useCallback$4
} = import_react.default;
function useRecoilRefresher(recoilValue) {
  const storeRef = useStoreRef$7();
  return useCallback$4(() => {
    const store = storeRef.current;
    refreshRecoilValue$2(store, recoilValue);
  }, [recoilValue, storeRef]);
}
var Recoil_useRecoilRefresher = useRecoilRefresher;
var {
  atomicUpdater: atomicUpdater$2
} = Recoil_AtomicUpdates$1;
var {
  useStoreRef: useStoreRef$8
} = Recoil_RecoilRoot;
var {
  useMemo: useMemo$3
} = import_react.default;
function useRecoilTransaction(fn, deps) {
  const storeRef = useStoreRef$8();
  return useMemo$3(
    () => (...args) => {
      const atomicUpdate = atomicUpdater$2(storeRef.current);
      atomicUpdate((transactionInterface) => {
        fn(transactionInterface)(...args);
      });
    },
    deps != null ? [...deps, storeRef] : void 0
    // eslint-disable-line fb-www/react-hooks-deps
  );
}
var Recoil_useRecoilTransaction = useRecoilTransaction;
var WrappedValue = class {
  constructor(value) {
    _defineProperty(this, "value", void 0);
    this.value = value;
  }
};
var Recoil_Wrapper = {
  WrappedValue
};
var Recoil_Wrapper_1 = Recoil_Wrapper.WrappedValue;
var Recoil_Wrapper$1 = Object.freeze({
  __proto__: null,
  WrappedValue: Recoil_Wrapper_1
});
var {
  isFastRefreshEnabled: isFastRefreshEnabled$2
} = Recoil_ReactMode;
var ChangedPathError = class extends Error {
};
var TreeCache = class {
  // $FlowIssue[unclear-type]
  constructor(options) {
    var _options$onHit, _options$onSet, _options$mapNodeValue;
    _defineProperty(this, "_name", void 0);
    _defineProperty(this, "_numLeafs", void 0);
    _defineProperty(this, "_root", void 0);
    _defineProperty(this, "_onHit", void 0);
    _defineProperty(this, "_onSet", void 0);
    _defineProperty(this, "_mapNodeValue", void 0);
    this._name = options === null || options === void 0 ? void 0 : options.name;
    this._numLeafs = 0;
    this._root = null;
    this._onHit = (_options$onHit = options === null || options === void 0 ? void 0 : options.onHit) !== null && _options$onHit !== void 0 ? _options$onHit : () => {
    };
    this._onSet = (_options$onSet = options === null || options === void 0 ? void 0 : options.onSet) !== null && _options$onSet !== void 0 ? _options$onSet : () => {
    };
    this._mapNodeValue = (_options$mapNodeValue = options === null || options === void 0 ? void 0 : options.mapNodeValue) !== null && _options$mapNodeValue !== void 0 ? _options$mapNodeValue : (val) => val;
  }
  size() {
    return this._numLeafs;
  }
  // $FlowIssue[unclear-type]
  root() {
    return this._root;
  }
  get(getNodeValue, handlers) {
    var _this$getLeafNode;
    return (_this$getLeafNode = this.getLeafNode(getNodeValue, handlers)) === null || _this$getLeafNode === void 0 ? void 0 : _this$getLeafNode.value;
  }
  getLeafNode(getNodeValue, handlers) {
    if (this._root == null) {
      return void 0;
    }
    let node = this._root;
    while (node) {
      handlers === null || handlers === void 0 ? void 0 : handlers.onNodeVisit(node);
      if (node.type === "leaf") {
        this._onHit(node);
        return node;
      }
      const nodeValue = this._mapNodeValue(getNodeValue(node.nodeKey));
      node = node.branches.get(nodeValue);
    }
    return void 0;
  }
  set(route, value, handlers) {
    const addLeaf = () => {
      var _node2, _node3, _this$_root2, _handlers$onNodeVisit2;
      let node;
      let branchKey;
      for (const [nodeKey, nodeValue] of route) {
        var _node, _handlers$onNodeVisit, _this$_root;
        const root = this._root;
        if ((root === null || root === void 0 ? void 0 : root.type) === "leaf") {
          throw this.invalidCacheError();
        }
        const parent = node;
        node = parent ? parent.branches.get(branchKey) : root;
        node = (_node = node) !== null && _node !== void 0 ? _node : {
          type: "branch",
          nodeKey,
          parent,
          branches: /* @__PURE__ */ new Map(),
          branchKey
        };
        if (node.type !== "branch" || node.nodeKey !== nodeKey) {
          throw this.invalidCacheError();
        }
        parent === null || parent === void 0 ? void 0 : parent.branches.set(branchKey, node);
        handlers === null || handlers === void 0 ? void 0 : (_handlers$onNodeVisit = handlers.onNodeVisit) === null || _handlers$onNodeVisit === void 0 ? void 0 : _handlers$onNodeVisit.call(handlers, node);
        branchKey = this._mapNodeValue(nodeValue);
        this._root = (_this$_root = this._root) !== null && _this$_root !== void 0 ? _this$_root : node;
      }
      const oldLeaf = node ? (_node2 = node) === null || _node2 === void 0 ? void 0 : _node2.branches.get(branchKey) : this._root;
      if (oldLeaf != null && (oldLeaf.type !== "leaf" || oldLeaf.branchKey !== branchKey)) {
        throw this.invalidCacheError();
      }
      const leafNode = {
        type: "leaf",
        value,
        parent: node,
        branchKey
      };
      (_node3 = node) === null || _node3 === void 0 ? void 0 : _node3.branches.set(branchKey, leafNode);
      this._root = (_this$_root2 = this._root) !== null && _this$_root2 !== void 0 ? _this$_root2 : leafNode;
      this._numLeafs++;
      this._onSet(leafNode);
      handlers === null || handlers === void 0 ? void 0 : (_handlers$onNodeVisit2 = handlers.onNodeVisit) === null || _handlers$onNodeVisit2 === void 0 ? void 0 : _handlers$onNodeVisit2.call(handlers, leafNode);
    };
    try {
      addLeaf();
    } catch (error) {
      if (error instanceof ChangedPathError) {
        this.clear();
        addLeaf();
      } else {
        throw error;
      }
    }
  }
  // Returns true if leaf was actually deleted from the tree
  delete(leaf) {
    const root = this.root();
    if (!root) {
      return false;
    }
    if (leaf === root) {
      this._root = null;
      this._numLeafs = 0;
      return true;
    }
    let node = leaf.parent;
    let branchKey = leaf.branchKey;
    while (node) {
      var _node4;
      node.branches.delete(branchKey);
      if (node === root) {
        if (node.branches.size === 0) {
          this._root = null;
          this._numLeafs = 0;
        } else {
          this._numLeafs--;
        }
        return true;
      }
      if (node.branches.size > 0) {
        break;
      }
      branchKey = (_node4 = node) === null || _node4 === void 0 ? void 0 : _node4.branchKey;
      node = node.parent;
    }
    for (; node !== root; node = node.parent) {
      if (node == null) {
        return false;
      }
    }
    this._numLeafs--;
    return true;
  }
  clear() {
    this._numLeafs = 0;
    this._root = null;
  }
  invalidCacheError() {
    const CHANGED_PATH_ERROR_MESSAGE = isFastRefreshEnabled$2() ? "Possible Fast Refresh module reload detected.  This may also be caused by an selector returning inconsistent values. Resetting cache." : "Invalid cache values.  This happens when selectors do not return consistent values for the same input dependency values.  That may also be caused when using Fast Refresh to change a selector implementation.  Resetting cache.";
    Recoil_recoverableViolation(CHANGED_PATH_ERROR_MESSAGE + (this._name != null ? ` - ${this._name}` : ""));
    throw new ChangedPathError();
  }
};
var Recoil_TreeCache = {
  TreeCache
};
var Recoil_TreeCache_1 = Recoil_TreeCache.TreeCache;
var Recoil_TreeCache$1 = Object.freeze({
  __proto__: null,
  TreeCache: Recoil_TreeCache_1
});
var LRUCache = class {
  constructor(options) {
    var _options$mapKey;
    _defineProperty(this, "_maxSize", void 0);
    _defineProperty(this, "_size", void 0);
    _defineProperty(this, "_head", void 0);
    _defineProperty(this, "_tail", void 0);
    _defineProperty(this, "_map", void 0);
    _defineProperty(this, "_keyMapper", void 0);
    this._maxSize = options.maxSize;
    this._size = 0;
    this._head = null;
    this._tail = null;
    this._map = /* @__PURE__ */ new Map();
    this._keyMapper = (_options$mapKey = options.mapKey) !== null && _options$mapKey !== void 0 ? _options$mapKey : (v) => v;
  }
  head() {
    return this._head;
  }
  tail() {
    return this._tail;
  }
  size() {
    return this._size;
  }
  maxSize() {
    return this._maxSize;
  }
  has(key) {
    return this._map.has(this._keyMapper(key));
  }
  get(key) {
    const mappedKey = this._keyMapper(key);
    const node = this._map.get(mappedKey);
    if (!node) {
      return void 0;
    }
    this.set(key, node.value);
    return node.value;
  }
  set(key, val) {
    const mappedKey = this._keyMapper(key);
    const existingNode = this._map.get(mappedKey);
    if (existingNode) {
      this.delete(key);
    }
    const head = this.head();
    const node = {
      key,
      right: head,
      left: null,
      value: val
    };
    if (head) {
      head.left = node;
    } else {
      this._tail = node;
    }
    this._map.set(mappedKey, node);
    this._head = node;
    this._size++;
    this._maybeDeleteLRU();
  }
  _maybeDeleteLRU() {
    if (this.size() > this.maxSize()) {
      this.deleteLru();
    }
  }
  deleteLru() {
    const tail = this.tail();
    if (tail) {
      this.delete(tail.key);
    }
  }
  delete(key) {
    const mappedKey = this._keyMapper(key);
    if (!this._size || !this._map.has(mappedKey)) {
      return;
    }
    const node = Recoil_nullthrows(this._map.get(mappedKey));
    const right = node.right;
    const left = node.left;
    if (right) {
      right.left = node.left;
    }
    if (left) {
      left.right = node.right;
    }
    if (node === this.head()) {
      this._head = right;
    }
    if (node === this.tail()) {
      this._tail = left;
    }
    this._map.delete(mappedKey);
    this._size--;
  }
  clear() {
    this._size = 0;
    this._head = null;
    this._tail = null;
    this._map = /* @__PURE__ */ new Map();
  }
};
var Recoil_LRUCache = {
  LRUCache
};
var Recoil_LRUCache_1 = Recoil_LRUCache.LRUCache;
var Recoil_LRUCache$1 = Object.freeze({
  __proto__: null,
  LRUCache: Recoil_LRUCache_1
});
var {
  LRUCache: LRUCache$1
} = Recoil_LRUCache$1;
var {
  TreeCache: TreeCache$1
} = Recoil_TreeCache$1;
function treeCacheLRU({
  name,
  maxSize,
  mapNodeValue = (v) => v
}) {
  const lruCache = new LRUCache$1({
    maxSize
  });
  const cache = new TreeCache$1({
    name,
    mapNodeValue,
    onHit: (node) => {
      lruCache.set(node, true);
    },
    onSet: (node) => {
      const lruNode = lruCache.tail();
      lruCache.set(node, true);
      if (lruNode && cache.size() > maxSize) {
        cache.delete(lruNode.key);
      }
    }
  });
  return cache;
}
var Recoil_treeCacheLRU = treeCacheLRU;
var TIME_WARNING_THRESHOLD_MS = 15;
function stringify(x, opt, key) {
  if (typeof x === "string" && !x.includes('"') && !x.includes("\\")) {
    return `"${x}"`;
  }
  switch (typeof x) {
    case "undefined":
      return "";
    // JSON.stringify(undefined) returns undefined, but we always want to return a string
    case "boolean":
      return x ? "true" : "false";
    case "number":
    case "symbol":
      return String(x);
    case "string":
      return JSON.stringify(x);
    case "function":
      if ((opt === null || opt === void 0 ? void 0 : opt.allowFunctions) !== true) {
        throw Recoil_err("Attempt to serialize function in a Recoil cache key");
      }
      return `__FUNCTION(${x.name})__`;
  }
  if (x === null) {
    return "null";
  }
  if (typeof x !== "object") {
    var _JSON$stringify;
    return (_JSON$stringify = JSON.stringify(x)) !== null && _JSON$stringify !== void 0 ? _JSON$stringify : "";
  }
  if (Recoil_isPromise(x)) {
    return "__PROMISE__";
  }
  if (Array.isArray(x)) {
    return `[${x.map((v, i) => stringify(v, opt, i.toString()))}]`;
  }
  if (typeof x.toJSON === "function") {
    return stringify(x.toJSON(key), opt, key);
  }
  if (x instanceof Map) {
    const obj = {};
    for (const [k, v] of x) {
      obj[typeof k === "string" ? k : stringify(k, opt)] = v;
    }
    return stringify(obj, opt, key);
  }
  if (x instanceof Set) {
    return stringify(
      // $FlowFixMe[missing-local-annot]
      Array.from(x).sort((a, b) => stringify(a, opt).localeCompare(stringify(b, opt))),
      opt,
      key
    );
  }
  if (Symbol !== void 0 && x[Symbol.iterator] != null && typeof x[Symbol.iterator] === "function") {
    return stringify(Array.from(x), opt, key);
  }
  return `{${Object.keys(x).filter((k) => x[k] !== void 0).sort().map((k) => `${stringify(k, opt)}:${stringify(x[k], opt, k)}`).join(",")}}`;
}
function stableStringify(x, opt = {
  allowFunctions: false
}) {
  if (true) {
    if (typeof window !== "undefined") {
      const startTime = window.performance ? window.performance.now() : 0;
      const str = stringify(x, opt);
      const endTime = window.performance ? window.performance.now() : 0;
      if (endTime - startTime > TIME_WARNING_THRESHOLD_MS) {
        console.groupCollapsed(`Recoil: Spent ${endTime - startTime}ms computing a cache key`);
        console.warn(x, str);
        console.groupEnd();
      }
      return str;
    }
  }
  return stringify(x, opt);
}
var Recoil_stableStringify = stableStringify;
var {
  TreeCache: TreeCache$2
} = Recoil_TreeCache$1;
var defaultPolicy = {
  equality: "reference",
  eviction: "keep-all",
  maxSize: Infinity
};
function treeCacheFromPolicy({
  equality = defaultPolicy.equality,
  eviction = defaultPolicy.eviction,
  maxSize = defaultPolicy.maxSize
} = defaultPolicy, name) {
  const valueMapper = getValueMapper(equality);
  return getTreeCache(eviction, maxSize, valueMapper, name);
}
function getValueMapper(equality) {
  switch (equality) {
    case "reference":
      return (val) => val;
    case "value":
      return (val) => Recoil_stableStringify(val);
  }
  throw Recoil_err(`Unrecognized equality policy ${equality}`);
}
function getTreeCache(eviction, maxSize, mapNodeValue, name) {
  switch (eviction) {
    case "keep-all":
      return new TreeCache$2({
        name,
        mapNodeValue
      });
    case "lru":
      return Recoil_treeCacheLRU({
        name,
        maxSize: Recoil_nullthrows(maxSize),
        mapNodeValue
      });
    case "most-recent":
      return Recoil_treeCacheLRU({
        name,
        maxSize: 1,
        mapNodeValue
      });
  }
  throw Recoil_err(`Unrecognized eviction policy ${eviction}`);
}
var Recoil_treeCacheFromPolicy = treeCacheFromPolicy;
function isNode(object) {
  var _ownerDocument, _doc$defaultView;
  if (typeof window === "undefined") {
    return false;
  }
  const doc = object != null ? (_ownerDocument = object.ownerDocument) !== null && _ownerDocument !== void 0 ? _ownerDocument : object : document;
  const defaultView = (_doc$defaultView = doc.defaultView) !== null && _doc$defaultView !== void 0 ? _doc$defaultView : window;
  return !!(object != null && (typeof defaultView.Node === "function" ? object instanceof defaultView.Node : typeof object === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string"));
}
var Recoil_isNode = isNode;
var {
  isReactNative: isReactNative$1,
  isWindow: isWindow$1
} = Recoil_Environment;
function shouldNotBeFrozen(value) {
  if (value === null || typeof value !== "object") {
    return true;
  }
  switch (typeof value.$$typeof) {
    case "symbol":
      return true;
    case "number":
      return true;
  }
  if (value["@@__IMMUTABLE_ITERABLE__@@"] != null || value["@@__IMMUTABLE_KEYED__@@"] != null || value["@@__IMMUTABLE_INDEXED__@@"] != null || value["@@__IMMUTABLE_ORDERED__@@"] != null || value["@@__IMMUTABLE_RECORD__@@"] != null) {
    return true;
  }
  if (Recoil_isNode(value)) {
    return true;
  }
  if (Recoil_isPromise(value)) {
    return true;
  }
  if (value instanceof Error) {
    return true;
  }
  if (ArrayBuffer.isView(value)) {
    return true;
  }
  if (!isReactNative$1 && isWindow$1(value)) {
    return true;
  }
  return false;
}
function deepFreezeValue(value) {
  if (typeof value !== "object" || shouldNotBeFrozen(value)) {
    return;
  }
  Object.freeze(value);
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      const prop = value[key];
      if (typeof prop === "object" && prop != null && !Object.isFrozen(prop)) {
        deepFreezeValue(prop);
      }
    }
  }
  Object.seal(value);
}
var Recoil_deepFreezeValue = deepFreezeValue;
function startPerfBlock(_id) {
  return () => null;
}
var Recoil_PerformanceTimings = {
  startPerfBlock
};
var {
  isLoadable: isLoadable$1,
  loadableWithError: loadableWithError$1,
  loadableWithPromise: loadableWithPromise$1,
  loadableWithValue: loadableWithValue$2
} = Recoil_Loadable$1;
var {
  WrappedValue: WrappedValue$1
} = Recoil_Wrapper$1;
var {
  getNodeLoadable: getNodeLoadable$2,
  peekNodeLoadable: peekNodeLoadable$1,
  setNodeValue: setNodeValue$3
} = Recoil_FunctionalCore;
var {
  saveDepsToStore: saveDepsToStore$1
} = Recoil_Graph;
var {
  DEFAULT_VALUE: DEFAULT_VALUE$6,
  getConfigDeletionHandler: getConfigDeletionHandler$1,
  getNode: getNode$6,
  registerNode: registerNode$1
} = Recoil_Node;
var {
  isRecoilValue: isRecoilValue$3
} = Recoil_RecoilValue$1;
var {
  markRecoilValueModified: markRecoilValueModified$1
} = Recoil_RecoilValueInterface;
var {
  retainedByOptionWithDefault: retainedByOptionWithDefault$1
} = Recoil_Retention;
var {
  recoilCallback: recoilCallback$1
} = Recoil_useRecoilCallback;
var {
  startPerfBlock: startPerfBlock$1
} = Recoil_PerformanceTimings;
var Canceled = class {
};
var CANCELED = new Canceled();
var dependencyStack = [];
var waitingStores = /* @__PURE__ */ new Map();
var getNewExecutionID = /* @__PURE__ */ (() => {
  let executionID = 0;
  return () => executionID++;
})();
function selector(options) {
  let recoilValue = null;
  const {
    key,
    get,
    cachePolicy_UNSTABLE: cachePolicy
  } = options;
  const set = options.set != null ? options.set : void 0;
  if (true) {
    if (typeof key !== "string") {
      throw Recoil_err("A key option with a unique string value must be provided when creating a selector.");
    }
    if (typeof get !== "function") {
      throw Recoil_err("Selectors must specify a get callback option to get the selector value.");
    }
  }
  const discoveredDependencyNodeKeys = /* @__PURE__ */ new Set();
  const cache = Recoil_treeCacheFromPolicy(cachePolicy !== null && cachePolicy !== void 0 ? cachePolicy : {
    equality: "reference",
    eviction: "keep-all"
  }, key);
  const retainedBy = retainedByOptionWithDefault$1(options.retainedBy_UNSTABLE);
  const executionInfoMap = /* @__PURE__ */ new Map();
  let liveStoresCount = 0;
  function selectorIsLive() {
    return !Recoil_gkx("recoil_memory_managament_2020") || liveStoresCount > 0;
  }
  function selectorInit(store) {
    store.getState().knownSelectors.add(key);
    liveStoresCount++;
    return () => {
      liveStoresCount--;
    };
  }
  function selectorShouldDeleteConfigOnRelease() {
    return getConfigDeletionHandler$1(key) !== void 0 && !selectorIsLive();
  }
  function resolveAsync(store, state, executionID, loadable, depValues) {
    setCache(state, loadable, depValues);
    notifyStoresOfResolvedAsync(store, executionID);
  }
  function notifyStoresOfResolvedAsync(store, executionID) {
    if (isLatestExecution(store, executionID)) {
      clearExecutionInfo(store);
    }
    notifyWaitingStores(executionID, true);
  }
  function notifyStoresOfNewAsyncDep(store, executionID) {
    if (isLatestExecution(store, executionID)) {
      const executionInfo = Recoil_nullthrows(getExecutionInfo(store));
      executionInfo.stateVersions.clear();
      notifyWaitingStores(executionID, false);
    }
  }
  function notifyWaitingStores(executionID, clearWaitlist) {
    const stores = waitingStores.get(executionID);
    if (stores != null) {
      for (const waitingStore of stores) {
        markRecoilValueModified$1(waitingStore, Recoil_nullthrows(recoilValue));
      }
      if (clearWaitlist) {
        waitingStores.delete(executionID);
      }
    }
  }
  function markStoreWaitingForResolvedAsync(store, executionID) {
    let stores = waitingStores.get(executionID);
    if (stores == null) {
      waitingStores.set(executionID, stores = /* @__PURE__ */ new Set());
    }
    stores.add(store);
  }
  function wrapResultPromise(store, promise, state, depValues, executionID, loadingDepsState) {
    return promise.then((value) => {
      if (!selectorIsLive()) {
        clearExecutionInfo(store);
        throw CANCELED;
      }
      const loadable = loadableWithValue$2(value);
      resolveAsync(store, state, executionID, loadable, depValues);
      return value;
    }).catch((errorOrPromise) => {
      if (!selectorIsLive()) {
        clearExecutionInfo(store);
        throw CANCELED;
      }
      if (Recoil_isPromise(errorOrPromise)) {
        return wrapPendingDependencyPromise(store, errorOrPromise, state, depValues, executionID, loadingDepsState);
      }
      const loadable = loadableWithError$1(errorOrPromise);
      resolveAsync(store, state, executionID, loadable, depValues);
      throw errorOrPromise;
    });
  }
  function wrapPendingDependencyPromise(store, promise, state, existingDeps, executionID, loadingDepsState) {
    return promise.then((resolvedDep) => {
      if (!selectorIsLive()) {
        clearExecutionInfo(store);
        throw CANCELED;
      }
      if (loadingDepsState.loadingDepKey != null && loadingDepsState.loadingDepPromise === promise) {
        state.atomValues.set(loadingDepsState.loadingDepKey, loadableWithValue$2(resolvedDep));
      } else {
        store.getState().knownSelectors.forEach((nodeKey) => {
          state.atomValues.delete(nodeKey);
        });
      }
      const cachedLoadable = getLoadableFromCacheAndUpdateDeps(store, state);
      if (cachedLoadable && cachedLoadable.state !== "loading") {
        if (isLatestExecution(store, executionID) || getExecutionInfo(store) == null) {
          notifyStoresOfResolvedAsync(store, executionID);
        }
        if (cachedLoadable.state === "hasValue") {
          return cachedLoadable.contents;
        } else {
          throw cachedLoadable.contents;
        }
      }
      if (!isLatestExecution(store, executionID)) {
        const executionInfo = getInProgressExecutionInfo(store, state);
        if (executionInfo != null) {
          return executionInfo.loadingLoadable.contents;
        }
      }
      const [loadable, depValues] = evaluateSelectorGetter(store, state, executionID);
      if (loadable.state !== "loading") {
        resolveAsync(store, state, executionID, loadable, depValues);
      }
      if (loadable.state === "hasError") {
        throw loadable.contents;
      }
      return loadable.contents;
    }).catch((error) => {
      if (error instanceof Canceled) {
        throw CANCELED;
      }
      if (!selectorIsLive()) {
        clearExecutionInfo(store);
        throw CANCELED;
      }
      const loadable = loadableWithError$1(error);
      resolveAsync(store, state, executionID, loadable, existingDeps);
      throw error;
    });
  }
  function updateDeps(store, state, deps, executionID) {
    var _store$getState, _store$getState$curre, _store$getState2, _store$getState2$next;
    if (isLatestExecution(store, executionID) || state.version === ((_store$getState = store.getState()) === null || _store$getState === void 0 ? void 0 : (_store$getState$curre = _store$getState.currentTree) === null || _store$getState$curre === void 0 ? void 0 : _store$getState$curre.version) || state.version === ((_store$getState2 = store.getState()) === null || _store$getState2 === void 0 ? void 0 : (_store$getState2$next = _store$getState2.nextTree) === null || _store$getState2$next === void 0 ? void 0 : _store$getState2$next.version)) {
      var _store$getState$nextT, _store$getState3, _store$getState3$next;
      saveDepsToStore$1(key, deps, store, (_store$getState$nextT = (_store$getState3 = store.getState()) === null || _store$getState3 === void 0 ? void 0 : (_store$getState3$next = _store$getState3.nextTree) === null || _store$getState3$next === void 0 ? void 0 : _store$getState3$next.version) !== null && _store$getState$nextT !== void 0 ? _store$getState$nextT : store.getState().currentTree.version);
    }
    for (const nodeKey of deps) {
      discoveredDependencyNodeKeys.add(nodeKey);
    }
  }
  function evaluateSelectorGetter(store, state, executionID) {
    const endPerfBlock = startPerfBlock$1(key);
    let duringSynchronousExecution = true;
    let duringAsynchronousExecution = true;
    const finishEvaluation = () => {
      endPerfBlock();
      duringAsynchronousExecution = false;
    };
    let result;
    let resultIsError = false;
    let loadable;
    const loadingDepsState = {
      loadingDepKey: null,
      loadingDepPromise: null
    };
    const depValues = /* @__PURE__ */ new Map();
    function getRecoilValue({
      key: depKey
    }) {
      const depLoadable = getNodeLoadable$2(store, state, depKey);
      depValues.set(depKey, depLoadable);
      if (!duringSynchronousExecution) {
        updateDeps(store, state, new Set(depValues.keys()), executionID);
        notifyStoresOfNewAsyncDep(store, executionID);
      }
      switch (depLoadable.state) {
        case "hasValue":
          return depLoadable.contents;
        case "hasError":
          throw depLoadable.contents;
        case "loading":
          loadingDepsState.loadingDepKey = depKey;
          loadingDepsState.loadingDepPromise = depLoadable.contents;
          throw depLoadable.contents;
      }
      throw Recoil_err("Invalid Loadable state");
    }
    const getCallback = (fn) => {
      return (...args) => {
        if (duringAsynchronousExecution) {
          throw Recoil_err("Callbacks from getCallback() should only be called asynchronously after the selector is evalutated.  It can be used for selectors to return objects with callbacks that can work with Recoil state without a subscription.");
        }
        !(recoilValue != null) ? true ? Recoil_invariant(false, "Recoil Value can never be null") : Recoil_invariant(false) : void 0;
        return recoilCallback$1(
          store,
          fn,
          args,
          {
            node: recoilValue
          }
          // flowlint-line unclear-type:off
        );
      };
    };
    try {
      result = get({
        get: getRecoilValue,
        getCallback
      });
      result = isRecoilValue$3(result) ? getRecoilValue(result) : result;
      if (isLoadable$1(result)) {
        if (result.state === "hasError") {
          resultIsError = true;
        }
        result = result.contents;
      }
      if (Recoil_isPromise(result)) {
        result = wrapResultPromise(store, result, state, depValues, executionID, loadingDepsState).finally(finishEvaluation);
      } else {
        finishEvaluation();
      }
      result = result instanceof WrappedValue$1 ? result.value : result;
    } catch (errorOrDepPromise) {
      result = errorOrDepPromise;
      if (Recoil_isPromise(result)) {
        result = wrapPendingDependencyPromise(store, result, state, depValues, executionID, loadingDepsState).finally(finishEvaluation);
      } else {
        resultIsError = true;
        finishEvaluation();
      }
    }
    if (resultIsError) {
      loadable = loadableWithError$1(result);
    } else if (Recoil_isPromise(result)) {
      loadable = loadableWithPromise$1(result);
    } else {
      loadable = loadableWithValue$2(result);
    }
    duringSynchronousExecution = false;
    updateExecutionInfoDepValues(store, executionID, depValues);
    updateDeps(store, state, new Set(depValues.keys()), executionID);
    return [loadable, depValues];
  }
  function getLoadableFromCacheAndUpdateDeps(store, state) {
    let cachedLoadable = state.atomValues.get(key);
    if (cachedLoadable != null) {
      return cachedLoadable;
    }
    const depsAfterCacheLookup = /* @__PURE__ */ new Set();
    try {
      cachedLoadable = cache.get((nodeKey) => {
        !(typeof nodeKey === "string") ? true ? Recoil_invariant(false, "Cache nodeKey is type string") : Recoil_invariant(false) : void 0;
        return getNodeLoadable$2(store, state, nodeKey).contents;
      }, {
        onNodeVisit: (node) => {
          if (node.type === "branch" && node.nodeKey !== key) {
            depsAfterCacheLookup.add(node.nodeKey);
          }
        }
      });
    } catch (error) {
      throw Recoil_err(`Problem with cache lookup for selector "${key}": ${error.message}`);
    }
    if (cachedLoadable) {
      var _getExecutionInfo;
      state.atomValues.set(key, cachedLoadable);
      updateDeps(store, state, depsAfterCacheLookup, (_getExecutionInfo = getExecutionInfo(store)) === null || _getExecutionInfo === void 0 ? void 0 : _getExecutionInfo.executionID);
    }
    return cachedLoadable;
  }
  function getSelectorLoadableAndUpdateDeps(store, state) {
    const cachedVal = getLoadableFromCacheAndUpdateDeps(store, state);
    if (cachedVal != null) {
      clearExecutionInfo(store);
      return cachedVal;
    }
    const inProgressExecutionInfo = getInProgressExecutionInfo(store, state);
    if (inProgressExecutionInfo != null) {
      var _inProgressExecutionI;
      if (((_inProgressExecutionI = inProgressExecutionInfo.loadingLoadable) === null || _inProgressExecutionI === void 0 ? void 0 : _inProgressExecutionI.state) === "loading") {
        markStoreWaitingForResolvedAsync(store, inProgressExecutionInfo.executionID);
      }
      return inProgressExecutionInfo.loadingLoadable;
    }
    const newExecutionID = getNewExecutionID();
    const [loadable, newDepValues] = evaluateSelectorGetter(store, state, newExecutionID);
    if (loadable.state === "loading") {
      setExecutionInfo(store, newExecutionID, loadable, newDepValues, state);
      markStoreWaitingForResolvedAsync(store, newExecutionID);
    } else {
      clearExecutionInfo(store);
      setCache(state, loadable, newDepValues);
    }
    return loadable;
  }
  function getInProgressExecutionInfo(store, state) {
    const pendingExecutions = Recoil_concatIterables([executionInfoMap.has(store) ? [Recoil_nullthrows(executionInfoMap.get(store))] : [], Recoil_mapIterable(Recoil_filterIterable(executionInfoMap, ([s]) => s !== store), ([, execInfo]) => execInfo)]);
    function anyDepChanged(execDepValues) {
      for (const [depKey, execLoadable] of execDepValues) {
        if (!getNodeLoadable$2(store, state, depKey).is(execLoadable)) {
          return true;
        }
      }
      return false;
    }
    for (const execInfo of pendingExecutions) {
      if (
        // If this execution was already checked to be valid with this version
        // of state, then let's use it!
        execInfo.stateVersions.get(state.version) || // If the deps for the execution match our current state, then it's valid
        !anyDepChanged(execInfo.depValuesDiscoveredSoFarDuringAsyncWork)
      ) {
        execInfo.stateVersions.set(state.version, true);
        return execInfo;
      } else {
        execInfo.stateVersions.set(state.version, false);
      }
    }
    return void 0;
  }
  function getExecutionInfo(store) {
    return executionInfoMap.get(store);
  }
  function setExecutionInfo(store, newExecutionID, loadable, depValues, state) {
    executionInfoMap.set(store, {
      depValuesDiscoveredSoFarDuringAsyncWork: depValues,
      executionID: newExecutionID,
      loadingLoadable: loadable,
      stateVersions: /* @__PURE__ */ new Map([[state.version, true]])
    });
  }
  function updateExecutionInfoDepValues(store, executionID, depValues) {
    if (isLatestExecution(store, executionID)) {
      const executionInfo = getExecutionInfo(store);
      if (executionInfo != null) {
        executionInfo.depValuesDiscoveredSoFarDuringAsyncWork = depValues;
      }
    }
  }
  function clearExecutionInfo(store) {
    executionInfoMap.delete(store);
  }
  function isLatestExecution(store, executionID) {
    var _getExecutionInfo2;
    return executionID === ((_getExecutionInfo2 = getExecutionInfo(store)) === null || _getExecutionInfo2 === void 0 ? void 0 : _getExecutionInfo2.executionID);
  }
  function depValuesToDepRoute(depValues) {
    return Array.from(depValues.entries()).map(([depKey, valLoadable]) => [depKey, valLoadable.contents]);
  }
  function setCache(state, loadable, depValues) {
    if (true) {
      if (loadable.state !== "loading" && Boolean(options.dangerouslyAllowMutability) === false) {
        Recoil_deepFreezeValue(loadable.contents);
      }
    }
    state.atomValues.set(key, loadable);
    try {
      cache.set(depValuesToDepRoute(depValues), loadable);
    } catch (error) {
      throw Recoil_err(`Problem with setting cache for selector "${key}": ${error.message}`);
    }
  }
  function detectCircularDependencies(fn) {
    if (dependencyStack.includes(key)) {
      const message = `Recoil selector has circular dependencies: ${dependencyStack.slice(dependencyStack.indexOf(key)).join(" → ")}`;
      return loadableWithError$1(Recoil_err(message));
    }
    dependencyStack.push(key);
    try {
      return fn();
    } finally {
      dependencyStack.pop();
    }
  }
  function selectorPeek(store, state) {
    const cachedLoadable = state.atomValues.get(key);
    if (cachedLoadable != null) {
      return cachedLoadable;
    }
    return cache.get((nodeKey) => {
      var _peekNodeLoadable;
      !(typeof nodeKey === "string") ? true ? Recoil_invariant(false, "Cache nodeKey is type string") : Recoil_invariant(false) : void 0;
      return (_peekNodeLoadable = peekNodeLoadable$1(store, state, nodeKey)) === null || _peekNodeLoadable === void 0 ? void 0 : _peekNodeLoadable.contents;
    });
  }
  function selectorGet(store, state) {
    return detectCircularDependencies(() => getSelectorLoadableAndUpdateDeps(store, state));
  }
  function invalidateSelector(state) {
    state.atomValues.delete(key);
  }
  function clearSelectorCache(store, treeState) {
    !(recoilValue != null) ? true ? Recoil_invariant(false, "Recoil Value can never be null") : Recoil_invariant(false) : void 0;
    for (const nodeKey of discoveredDependencyNodeKeys) {
      var _node$clearCache;
      const node = getNode$6(nodeKey);
      (_node$clearCache = node.clearCache) === null || _node$clearCache === void 0 ? void 0 : _node$clearCache.call(node, store, treeState);
    }
    discoveredDependencyNodeKeys.clear();
    invalidateSelector(treeState);
    cache.clear();
    markRecoilValueModified$1(store, recoilValue);
  }
  if (set != null) {
    const selectorSet = (store, state, newValue) => {
      let syncSelectorSetFinished = false;
      const writes = /* @__PURE__ */ new Map();
      function getRecoilValue({
        key: depKey
      }) {
        if (syncSelectorSetFinished) {
          throw Recoil_err("Recoil: Async selector sets are not currently supported.");
        }
        const loadable = getNodeLoadable$2(store, state, depKey);
        if (loadable.state === "hasValue") {
          return loadable.contents;
        } else if (loadable.state === "loading") {
          const msg = `Getting value of asynchronous atom or selector "${depKey}" in a pending state while setting selector "${key}" is not yet supported.`;
          Recoil_recoverableViolation(msg);
          throw Recoil_err(msg);
        } else {
          throw loadable.contents;
        }
      }
      function setRecoilState(recoilState, valueOrUpdater) {
        if (syncSelectorSetFinished) {
          const msg = "Recoil: Async selector sets are not currently supported.";
          Recoil_recoverableViolation(msg);
          throw Recoil_err(msg);
        }
        const setValue = typeof valueOrUpdater === "function" ? (
          // cast to any because we can't restrict type S from being a function itself without losing support for opaque types
          // flowlint-next-line unclear-type:off
          valueOrUpdater(getRecoilValue(recoilState))
        ) : valueOrUpdater;
        const upstreamWrites = setNodeValue$3(store, state, recoilState.key, setValue);
        upstreamWrites.forEach((v, k) => writes.set(k, v));
      }
      function resetRecoilState(recoilState) {
        setRecoilState(recoilState, DEFAULT_VALUE$6);
      }
      const ret = set({
        set: setRecoilState,
        get: getRecoilValue,
        reset: resetRecoilState
      }, newValue);
      if (ret !== void 0) {
        throw Recoil_isPromise(ret) ? Recoil_err("Recoil: Async selector sets are not currently supported.") : Recoil_err("Recoil: selector set should be a void function.");
      }
      syncSelectorSetFinished = true;
      return writes;
    };
    return recoilValue = registerNode$1({
      key,
      nodeType: "selector",
      peek: selectorPeek,
      get: selectorGet,
      set: selectorSet,
      init: selectorInit,
      invalidate: invalidateSelector,
      clearCache: clearSelectorCache,
      shouldDeleteConfigOnRelease: selectorShouldDeleteConfigOnRelease,
      dangerouslyAllowMutability: options.dangerouslyAllowMutability,
      shouldRestoreFromSnapshots: false,
      retainedBy
    });
  } else {
    return recoilValue = registerNode$1({
      key,
      nodeType: "selector",
      peek: selectorPeek,
      get: selectorGet,
      init: selectorInit,
      invalidate: invalidateSelector,
      clearCache: clearSelectorCache,
      shouldDeleteConfigOnRelease: selectorShouldDeleteConfigOnRelease,
      dangerouslyAllowMutability: options.dangerouslyAllowMutability,
      shouldRestoreFromSnapshots: false,
      retainedBy
    });
  }
}
selector.value = (value) => new WrappedValue$1(value);
var Recoil_selector = selector;
var {
  isLoadable: isLoadable$2,
  loadableWithError: loadableWithError$2,
  loadableWithPromise: loadableWithPromise$2,
  loadableWithValue: loadableWithValue$3
} = Recoil_Loadable$1;
var {
  WrappedValue: WrappedValue$2
} = Recoil_Wrapper$1;
var {
  peekNodeInfo: peekNodeInfo$3
} = Recoil_FunctionalCore;
var {
  DEFAULT_VALUE: DEFAULT_VALUE$7,
  DefaultValue: DefaultValue$2,
  getConfigDeletionHandler: getConfigDeletionHandler$2,
  registerNode: registerNode$2,
  setConfigDeletionHandler: setConfigDeletionHandler$1
} = Recoil_Node;
var {
  isRecoilValue: isRecoilValue$4
} = Recoil_RecoilValue$1;
var {
  getRecoilValueAsLoadable: getRecoilValueAsLoadable$4,
  markRecoilValueModified: markRecoilValueModified$2,
  setRecoilValue: setRecoilValue$4,
  setRecoilValueLoadable: setRecoilValueLoadable$2
} = Recoil_RecoilValueInterface;
var {
  retainedByOptionWithDefault: retainedByOptionWithDefault$2
} = Recoil_Retention;
var unwrap = (x) => x instanceof WrappedValue$2 ? x.value : x;
function baseAtom(options) {
  const {
    key,
    persistence_UNSTABLE: persistence
  } = options;
  const retainedBy = retainedByOptionWithDefault$2(options.retainedBy_UNSTABLE);
  let liveStoresCount = 0;
  function unwrapPromise(promise) {
    return loadableWithPromise$2(promise.then((value) => {
      defaultLoadable = loadableWithValue$3(value);
      return value;
    }).catch((error) => {
      defaultLoadable = loadableWithError$2(error);
      throw error;
    }));
  }
  let defaultLoadable = Recoil_isPromise(options.default) ? unwrapPromise(options.default) : isLoadable$2(options.default) ? options.default.state === "loading" ? unwrapPromise(options.default.contents) : options.default : (
    // $FlowFixMe[incompatible-call]
    loadableWithValue$3(unwrap(options.default))
  );
  maybeFreezeValueOrPromise(defaultLoadable.contents);
  let cachedAnswerForUnvalidatedValue = void 0;
  const cleanupEffectsByStore = /* @__PURE__ */ new Map();
  function maybeFreezeValueOrPromise(valueOrPromise) {
    if (true) {
      if (options.dangerouslyAllowMutability !== true) {
        if (Recoil_isPromise(valueOrPromise)) {
          return valueOrPromise.then((value) => {
            Recoil_deepFreezeValue(value);
            return value;
          });
        } else {
          Recoil_deepFreezeValue(valueOrPromise);
          return valueOrPromise;
        }
      }
    }
    return valueOrPromise;
  }
  function wrapPendingPromise(store, promise) {
    const wrappedPromise = promise.then((value) => {
      var _store$getState$nextT, _state$atomValues$get;
      const state = (_store$getState$nextT = store.getState().nextTree) !== null && _store$getState$nextT !== void 0 ? _store$getState$nextT : store.getState().currentTree;
      if (((_state$atomValues$get = state.atomValues.get(key)) === null || _state$atomValues$get === void 0 ? void 0 : _state$atomValues$get.contents) === wrappedPromise) {
        setRecoilValue$4(store, node, value);
      }
      return value;
    }).catch((error) => {
      var _store$getState$nextT2, _state$atomValues$get2;
      const state = (_store$getState$nextT2 = store.getState().nextTree) !== null && _store$getState$nextT2 !== void 0 ? _store$getState$nextT2 : store.getState().currentTree;
      if (((_state$atomValues$get2 = state.atomValues.get(key)) === null || _state$atomValues$get2 === void 0 ? void 0 : _state$atomValues$get2.contents) === wrappedPromise) {
        setRecoilValueLoadable$2(store, node, loadableWithError$2(error));
      }
      throw error;
    });
    return wrappedPromise;
  }
  function initAtom(store, initState, trigger) {
    var _options$effects;
    liveStoresCount++;
    const cleanupAtom = () => {
      var _cleanupEffectsByStor;
      liveStoresCount--;
      (_cleanupEffectsByStor = cleanupEffectsByStore.get(store)) === null || _cleanupEffectsByStor === void 0 ? void 0 : _cleanupEffectsByStor.forEach((cleanup) => cleanup());
      cleanupEffectsByStore.delete(store);
    };
    store.getState().knownAtoms.add(key);
    if (defaultLoadable.state === "loading") {
      const notifyDefaultSubscribers = () => {
        var _store$getState$nextT3;
        const state = (_store$getState$nextT3 = store.getState().nextTree) !== null && _store$getState$nextT3 !== void 0 ? _store$getState$nextT3 : store.getState().currentTree;
        if (!state.atomValues.has(key)) {
          markRecoilValueModified$2(store, node);
        }
      };
      defaultLoadable.contents.finally(notifyDefaultSubscribers);
    }
    const effects = (_options$effects = options.effects) !== null && _options$effects !== void 0 ? _options$effects : options.effects_UNSTABLE;
    if (effects != null) {
      let getLoadable = function(recoilValue) {
        if (isDuringInit && recoilValue.key === key) {
          const retValue = initValue;
          return retValue instanceof DefaultValue$2 ? peekAtom(store, initState) : Recoil_isPromise(retValue) ? loadableWithPromise$2(retValue.then((v) => v instanceof DefaultValue$2 ? (
            // Cast T to S
            defaultLoadable.toPromise()
          ) : v)) : (
            // $FlowFixMe[incompatible-call]
            loadableWithValue$3(retValue)
          );
        }
        return getRecoilValueAsLoadable$4(store, recoilValue);
      }, getPromise = function(recoilValue) {
        return getLoadable(recoilValue).toPromise();
      }, getInfo_UNSTABLE = function(recoilValue) {
        var _store$getState$nextT4;
        const info = peekNodeInfo$3(store, (_store$getState$nextT4 = store.getState().nextTree) !== null && _store$getState$nextT4 !== void 0 ? _store$getState$nextT4 : store.getState().currentTree, recoilValue.key);
        return isDuringInit && recoilValue.key === key && !(initValue instanceof DefaultValue$2) ? {
          ...info,
          isSet: true,
          loadable: getLoadable(recoilValue)
        } : info;
      };
      let initValue = DEFAULT_VALUE$7;
      let isDuringInit = true;
      let isInitError = false;
      let pendingSetSelf = null;
      const setSelf = (effect) => (valueOrUpdater) => {
        if (isDuringInit) {
          const currentLoadable = getLoadable(node);
          const currentValue = currentLoadable.state === "hasValue" ? currentLoadable.contents : DEFAULT_VALUE$7;
          initValue = typeof valueOrUpdater === "function" ? (
            // cast to any because we can't restrict T from being a function without losing support for opaque types
            valueOrUpdater(currentValue)
          ) : valueOrUpdater;
          if (Recoil_isPromise(initValue)) {
            initValue = initValue.then((value) => {
              pendingSetSelf = {
                effect,
                value
              };
              return value;
            });
          }
        } else {
          if (Recoil_isPromise(valueOrUpdater)) {
            throw Recoil_err("Setting atoms to async values is not implemented.");
          }
          if (typeof valueOrUpdater !== "function") {
            pendingSetSelf = {
              effect,
              value: unwrap(valueOrUpdater)
            };
          }
          setRecoilValue$4(store, node, typeof valueOrUpdater === "function" ? (currentValue) => {
            const newValue = unwrap(
              // cast to any because we can't restrict T from being a function without losing support for opaque types
              valueOrUpdater(currentValue)
              // flowlint-line unclear-type:off
            );
            pendingSetSelf = {
              effect,
              value: newValue
            };
            return newValue;
          } : unwrap(valueOrUpdater));
        }
      };
      const resetSelf = (effect) => () => setSelf(effect)(DEFAULT_VALUE$7);
      const onSet = (effect) => (handler) => {
        var _cleanupEffectsByStor2;
        const {
          release
        } = store.subscribeToTransactions((currentStore) => {
          var _currentTree$atomValu;
          let {
            currentTree,
            previousTree
          } = currentStore.getState();
          if (!previousTree) {
            Recoil_recoverableViolation("Transaction subscribers notified without a next tree being present -- this is a bug in Recoil");
            previousTree = currentTree;
          }
          const newLoadable = (_currentTree$atomValu = currentTree.atomValues.get(key)) !== null && _currentTree$atomValu !== void 0 ? _currentTree$atomValu : defaultLoadable;
          if (newLoadable.state === "hasValue") {
            var _previousTree$atomVal, _pendingSetSelf, _pendingSetSelf2, _pendingSetSelf3;
            const newValue = newLoadable.contents;
            const oldLoadable = (_previousTree$atomVal = previousTree.atomValues.get(key)) !== null && _previousTree$atomVal !== void 0 ? _previousTree$atomVal : defaultLoadable;
            const oldValue = oldLoadable.state === "hasValue" ? oldLoadable.contents : DEFAULT_VALUE$7;
            if (((_pendingSetSelf = pendingSetSelf) === null || _pendingSetSelf === void 0 ? void 0 : _pendingSetSelf.effect) !== effect || ((_pendingSetSelf2 = pendingSetSelf) === null || _pendingSetSelf2 === void 0 ? void 0 : _pendingSetSelf2.value) !== newValue) {
              handler(newValue, oldValue, !currentTree.atomValues.has(key));
            } else if (((_pendingSetSelf3 = pendingSetSelf) === null || _pendingSetSelf3 === void 0 ? void 0 : _pendingSetSelf3.effect) === effect) {
              pendingSetSelf = null;
            }
          }
        }, key);
        cleanupEffectsByStore.set(store, [...(_cleanupEffectsByStor2 = cleanupEffectsByStore.get(store)) !== null && _cleanupEffectsByStor2 !== void 0 ? _cleanupEffectsByStor2 : [], release]);
      };
      for (const effect of effects) {
        try {
          const cleanup = effect({
            node,
            storeID: store.storeID,
            parentStoreID_UNSTABLE: store.parentStoreID,
            trigger,
            setSelf: setSelf(effect),
            resetSelf: resetSelf(effect),
            onSet: onSet(effect),
            getPromise,
            getLoadable,
            getInfo_UNSTABLE
          });
          if (cleanup != null) {
            var _cleanupEffectsByStor3;
            cleanupEffectsByStore.set(store, [...(_cleanupEffectsByStor3 = cleanupEffectsByStore.get(store)) !== null && _cleanupEffectsByStor3 !== void 0 ? _cleanupEffectsByStor3 : [], cleanup]);
          }
        } catch (error) {
          initValue = error;
          isInitError = true;
        }
      }
      isDuringInit = false;
      if (!(initValue instanceof DefaultValue$2)) {
        var _store$getState$nextT5;
        const initLoadable = isInitError ? loadableWithError$2(initValue) : Recoil_isPromise(initValue) ? loadableWithPromise$2(wrapPendingPromise(store, initValue)) : loadableWithValue$3(unwrap(initValue));
        maybeFreezeValueOrPromise(initLoadable.contents);
        initState.atomValues.set(key, initLoadable);
        (_store$getState$nextT5 = store.getState().nextTree) === null || _store$getState$nextT5 === void 0 ? void 0 : _store$getState$nextT5.atomValues.set(key, initLoadable);
      }
    }
    return cleanupAtom;
  }
  function peekAtom(_store, state) {
    var _ref, _state$atomValues$get3;
    return (_ref = (_state$atomValues$get3 = state.atomValues.get(key)) !== null && _state$atomValues$get3 !== void 0 ? _state$atomValues$get3 : cachedAnswerForUnvalidatedValue) !== null && _ref !== void 0 ? _ref : defaultLoadable;
  }
  function getAtom(_store, state) {
    if (state.atomValues.has(key)) {
      return Recoil_nullthrows(state.atomValues.get(key));
    } else if (state.nonvalidatedAtoms.has(key)) {
      if (cachedAnswerForUnvalidatedValue != null) {
        return cachedAnswerForUnvalidatedValue;
      }
      if (persistence == null) {
        Recoil_expectationViolation(`Tried to restore a persisted value for atom ${key} but it has no persistence settings.`);
        return defaultLoadable;
      }
      const nonvalidatedValue = state.nonvalidatedAtoms.get(key);
      const validatorResult = persistence.validator(nonvalidatedValue, DEFAULT_VALUE$7);
      const validatedValueLoadable = validatorResult instanceof DefaultValue$2 ? defaultLoadable : loadableWithValue$3(validatorResult);
      cachedAnswerForUnvalidatedValue = validatedValueLoadable;
      return cachedAnswerForUnvalidatedValue;
    } else {
      return defaultLoadable;
    }
  }
  function invalidateAtom() {
    cachedAnswerForUnvalidatedValue = void 0;
  }
  function setAtom(_store, state, newValue) {
    if (state.atomValues.has(key)) {
      const existing = Recoil_nullthrows(state.atomValues.get(key));
      if (existing.state === "hasValue" && newValue === existing.contents) {
        return /* @__PURE__ */ new Map();
      }
    } else if (!state.nonvalidatedAtoms.has(key) && newValue instanceof DefaultValue$2) {
      return /* @__PURE__ */ new Map();
    }
    maybeFreezeValueOrPromise(newValue);
    cachedAnswerForUnvalidatedValue = void 0;
    return (/* @__PURE__ */ new Map()).set(key, loadableWithValue$3(newValue));
  }
  function shouldDeleteConfigOnReleaseAtom() {
    return getConfigDeletionHandler$2(key) !== void 0 && liveStoresCount <= 0;
  }
  const node = registerNode$2({
    key,
    nodeType: "atom",
    peek: peekAtom,
    get: getAtom,
    set: setAtom,
    init: initAtom,
    invalidate: invalidateAtom,
    shouldDeleteConfigOnRelease: shouldDeleteConfigOnReleaseAtom,
    dangerouslyAllowMutability: options.dangerouslyAllowMutability,
    persistence_UNSTABLE: options.persistence_UNSTABLE ? {
      type: options.persistence_UNSTABLE.type,
      backButton: options.persistence_UNSTABLE.backButton
    } : void 0,
    shouldRestoreFromSnapshots: true,
    retainedBy
  });
  return node;
}
function atom(options) {
  if (true) {
    if (typeof options.key !== "string") {
      throw Recoil_err("A key option with a unique string value must be provided when creating an atom.");
    }
  }
  const {
    // @fb-only: scopeRules_APPEND_ONLY_READ_THE_DOCS,
    ...restOptions
  } = options;
  const optionsDefault = "default" in options ? (
    // $FlowIssue[incompatible-type] No way to refine in Flow that property is not defined
    options.default
  ) : new Promise(() => {
  });
  if (isRecoilValue$4(optionsDefault)) {
    return atomWithFallback({
      ...restOptions,
      default: optionsDefault
      // @fb-only: scopeRules_APPEND_ONLY_READ_THE_DOCS,
    });
  } else {
    return baseAtom({
      ...restOptions,
      default: optionsDefault
    });
  }
}
function atomWithFallback(options) {
  const base = atom({
    ...options,
    default: DEFAULT_VALUE$7,
    persistence_UNSTABLE: options.persistence_UNSTABLE === void 0 ? void 0 : {
      ...options.persistence_UNSTABLE,
      validator: (storedValue) => storedValue instanceof DefaultValue$2 ? storedValue : Recoil_nullthrows(options.persistence_UNSTABLE).validator(storedValue, DEFAULT_VALUE$7)
    },
    // TODO Hack for now.
    effects: options.effects,
    // flowlint-line unclear-type: off
    effects_UNSTABLE: options.effects_UNSTABLE
    // flowlint-line unclear-type: off
  });
  const sel = Recoil_selector({
    key: `${options.key}__withFallback`,
    get: ({
      get
    }) => {
      const baseValue = get(base);
      return baseValue instanceof DefaultValue$2 ? options.default : baseValue;
    },
    // $FlowFixMe[incompatible-call]
    set: ({
      set
    }, newValue) => set(base, newValue),
    // This selector does not need to cache as it is a wrapper selector
    // and the selector within the wrapper selector will have a cache
    // option by default
    cachePolicy_UNSTABLE: {
      eviction: "most-recent"
    },
    dangerouslyAllowMutability: options.dangerouslyAllowMutability
  });
  setConfigDeletionHandler$1(sel.key, getConfigDeletionHandler$2(options.key));
  return sel;
}
atom.value = (value) => new WrappedValue$2(value);
var Recoil_atom = atom;
var MapCache = class {
  constructor(options) {
    var _options$mapKey;
    _defineProperty(this, "_map", void 0);
    _defineProperty(this, "_keyMapper", void 0);
    this._map = /* @__PURE__ */ new Map();
    this._keyMapper = (_options$mapKey = options === null || options === void 0 ? void 0 : options.mapKey) !== null && _options$mapKey !== void 0 ? _options$mapKey : (v) => v;
  }
  size() {
    return this._map.size;
  }
  has(key) {
    return this._map.has(this._keyMapper(key));
  }
  get(key) {
    return this._map.get(this._keyMapper(key));
  }
  set(key, val) {
    this._map.set(this._keyMapper(key), val);
  }
  delete(key) {
    this._map.delete(this._keyMapper(key));
  }
  clear() {
    this._map.clear();
  }
};
var Recoil_MapCache = {
  MapCache
};
var Recoil_MapCache_1 = Recoil_MapCache.MapCache;
var Recoil_MapCache$1 = Object.freeze({
  __proto__: null,
  MapCache: Recoil_MapCache_1
});
var {
  LRUCache: LRUCache$2
} = Recoil_LRUCache$1;
var {
  MapCache: MapCache$1
} = Recoil_MapCache$1;
var defaultPolicy$1 = {
  equality: "reference",
  eviction: "none",
  maxSize: Infinity
};
function cacheFromPolicy({
  equality = defaultPolicy$1.equality,
  eviction = defaultPolicy$1.eviction,
  maxSize = defaultPolicy$1.maxSize
} = defaultPolicy$1) {
  const valueMapper = getValueMapper$1(equality);
  const cache = getCache(eviction, maxSize, valueMapper);
  return cache;
}
function getValueMapper$1(equality) {
  switch (equality) {
    case "reference":
      return (val) => val;
    case "value":
      return (val) => Recoil_stableStringify(val);
  }
  throw Recoil_err(`Unrecognized equality policy ${equality}`);
}
function getCache(eviction, maxSize, mapKey) {
  switch (eviction) {
    case "keep-all":
      return new MapCache$1({
        mapKey
      });
    case "lru":
      return new LRUCache$2({
        mapKey,
        maxSize: Recoil_nullthrows(maxSize)
      });
    case "most-recent":
      return new LRUCache$2({
        mapKey,
        maxSize: 1
      });
  }
  throw Recoil_err(`Unrecognized eviction policy ${eviction}`);
}
var Recoil_cacheFromPolicy = cacheFromPolicy;
var {
  setConfigDeletionHandler: setConfigDeletionHandler$2
} = Recoil_Node;
function atomFamily(options) {
  var _options$cachePolicyF, _options$cachePolicyF2;
  const atomCache = Recoil_cacheFromPolicy({
    equality: (_options$cachePolicyF = (_options$cachePolicyF2 = options.cachePolicyForParams_UNSTABLE) === null || _options$cachePolicyF2 === void 0 ? void 0 : _options$cachePolicyF2.equality) !== null && _options$cachePolicyF !== void 0 ? _options$cachePolicyF : "value",
    eviction: "keep-all"
  });
  return (params) => {
    var _stableStringify, _options$effects;
    const cachedAtom = atomCache.get(params);
    if (cachedAtom != null) {
      return cachedAtom;
    }
    const {
      cachePolicyForParams_UNSTABLE,
      ...atomOptions
    } = options;
    const optionsDefault = "default" in options ? (
      // $FlowIssue[incompatible-type] No way to refine in Flow that property is not defined
      options.default
    ) : new Promise(() => {
    });
    const newAtom = Recoil_atom({
      ...atomOptions,
      key: `${options.key}__${(_stableStringify = Recoil_stableStringify(params)) !== null && _stableStringify !== void 0 ? _stableStringify : "void"}`,
      default: typeof optionsDefault === "function" ? (
        // The default was parameterized
        // Flow doesn't know that T isn't a function, so we need to case to any
        // $FlowIssue[incompatible-use]
        optionsDefault(params)
      ) : (
        // Default may be a static value, promise, or RecoilValue
        optionsDefault
      ),
      retainedBy_UNSTABLE: typeof options.retainedBy_UNSTABLE === "function" ? options.retainedBy_UNSTABLE(params) : options.retainedBy_UNSTABLE,
      effects: typeof options.effects === "function" ? options.effects(params) : typeof options.effects_UNSTABLE === "function" ? options.effects_UNSTABLE(params) : (_options$effects = options.effects) !== null && _options$effects !== void 0 ? _options$effects : options.effects_UNSTABLE
      // prettier-ignore
      // @fb-only: scopeRules_APPEND_ONLY_READ_THE_DOCS: mapScopeRules(
      // @fb-only: options.scopeRules_APPEND_ONLY_READ_THE_DOCS,
      // @fb-only: params,
      // @fb-only: ),
    });
    atomCache.set(params, newAtom);
    setConfigDeletionHandler$2(newAtom.key, () => {
      atomCache.delete(params);
    });
    return newAtom;
  };
}
var Recoil_atomFamily = atomFamily;
var {
  setConfigDeletionHandler: setConfigDeletionHandler$3
} = Recoil_Node;
var nextIndex = 0;
function selectorFamily(options) {
  var _options$cachePolicyF, _options$cachePolicyF2;
  const selectorCache = Recoil_cacheFromPolicy({
    equality: (_options$cachePolicyF = (_options$cachePolicyF2 = options.cachePolicyForParams_UNSTABLE) === null || _options$cachePolicyF2 === void 0 ? void 0 : _options$cachePolicyF2.equality) !== null && _options$cachePolicyF !== void 0 ? _options$cachePolicyF : "value",
    eviction: "keep-all"
  });
  return (params) => {
    var _stableStringify;
    let cachedSelector;
    try {
      cachedSelector = selectorCache.get(params);
    } catch (error) {
      throw Recoil_err(`Problem with cache lookup for selector ${options.key}: ${error.message}`);
    }
    if (cachedSelector != null) {
      return cachedSelector;
    }
    const myKey = `${options.key}__selectorFamily/${(_stableStringify = Recoil_stableStringify(params, {
      // It is possible to use functions in parameters if the user uses
      // a cache with reference equality thanks to the incrementing index.
      allowFunctions: true
    })) !== null && _stableStringify !== void 0 ? _stableStringify : "void"}/${nextIndex++}`;
    const myGet = (callbacks) => options.get(params)(callbacks);
    const myCachePolicy = options.cachePolicy_UNSTABLE;
    const retainedBy = typeof options.retainedBy_UNSTABLE === "function" ? options.retainedBy_UNSTABLE(params) : options.retainedBy_UNSTABLE;
    let newSelector;
    if (options.set != null) {
      const set = options.set;
      const mySet = (callbacks, newValue) => set(params)(callbacks, newValue);
      newSelector = Recoil_selector({
        key: myKey,
        get: myGet,
        set: mySet,
        cachePolicy_UNSTABLE: myCachePolicy,
        dangerouslyAllowMutability: options.dangerouslyAllowMutability,
        retainedBy_UNSTABLE: retainedBy
      });
    } else {
      newSelector = Recoil_selector({
        key: myKey,
        get: myGet,
        cachePolicy_UNSTABLE: myCachePolicy,
        dangerouslyAllowMutability: options.dangerouslyAllowMutability,
        retainedBy_UNSTABLE: retainedBy
      });
    }
    selectorCache.set(params, newSelector);
    setConfigDeletionHandler$3(newSelector.key, () => {
      selectorCache.delete(params);
    });
    return newSelector;
  };
}
var Recoil_selectorFamily = selectorFamily;
var constantSelector = Recoil_selectorFamily({
  key: "__constant",
  get: (constant) => () => constant,
  cachePolicyForParams_UNSTABLE: {
    equality: "reference"
  }
});
function constSelector(constant) {
  return constantSelector(constant);
}
var Recoil_constSelector = constSelector;
var throwingSelector = Recoil_selectorFamily({
  key: "__error",
  get: (message) => () => {
    throw Recoil_err(message);
  },
  // TODO Why?
  cachePolicyForParams_UNSTABLE: {
    equality: "reference"
  }
});
function errorSelector(message) {
  return throwingSelector(message);
}
var Recoil_errorSelector = errorSelector;
function readOnlySelector(atom2) {
  return atom2;
}
var Recoil_readOnlySelector = readOnlySelector;
var {
  loadableWithError: loadableWithError$3,
  loadableWithPromise: loadableWithPromise$3,
  loadableWithValue: loadableWithValue$4
} = Recoil_Loadable$1;
function concurrentRequests(getRecoilValue, deps) {
  const results = Array(deps.length).fill(void 0);
  const exceptions = Array(deps.length).fill(void 0);
  for (const [i, dep] of deps.entries()) {
    try {
      results[i] = getRecoilValue(dep);
    } catch (e) {
      exceptions[i] = e;
    }
  }
  return [results, exceptions];
}
function isError(exp) {
  return exp != null && !Recoil_isPromise(exp);
}
function unwrapDependencies(dependencies) {
  return Array.isArray(dependencies) ? dependencies : Object.getOwnPropertyNames(dependencies).map((key) => dependencies[key]);
}
function wrapResults(dependencies, results) {
  return Array.isArray(dependencies) ? results : (
    // Object.getOwnPropertyNames() has consistent key ordering with ES6
    Object.getOwnPropertyNames(dependencies).reduce((out, key, idx) => ({
      ...out,
      [key]: results[idx]
    }), {})
  );
}
function wrapLoadables(dependencies, results, exceptions) {
  const output = exceptions.map((exception, idx) => exception == null ? loadableWithValue$4(results[idx]) : Recoil_isPromise(exception) ? loadableWithPromise$3(exception) : loadableWithError$3(exception));
  return wrapResults(dependencies, output);
}
function combineAsyncResultsWithSyncResults(syncResults, asyncResults) {
  return asyncResults.map((result, idx) => (
    /**
     * it's important we use === undefined as opposed to == null, because the
     * resolved value of the async promise could be `null`, in which case we
     * don't want to use syncResults[idx], which would be undefined. If async
     * promise resolves to `undefined`, that's ok because `syncResults[idx]`
     * will also be `undefined`. That's a little hacky, but it works.
     */
    result === void 0 ? syncResults[idx] : result
  ));
}
var waitForNone = Recoil_selectorFamily({
  key: "__waitForNone",
  get: (dependencies) => ({
    get
  }) => {
    const deps = unwrapDependencies(dependencies);
    const [results, exceptions] = concurrentRequests(get, deps);
    return wrapLoadables(dependencies, results, exceptions);
  },
  dangerouslyAllowMutability: true
});
var waitForAny = Recoil_selectorFamily({
  key: "__waitForAny",
  get: (dependencies) => ({
    get
  }) => {
    const deps = unwrapDependencies(dependencies);
    const [results, exceptions] = concurrentRequests(get, deps);
    if (exceptions.some((exp) => !Recoil_isPromise(exp))) {
      return wrapLoadables(dependencies, results, exceptions);
    }
    return new Promise((resolve) => {
      for (const [i, exp] of exceptions.entries()) {
        if (Recoil_isPromise(exp)) {
          exp.then((result) => {
            results[i] = result;
            exceptions[i] = void 0;
            resolve(wrapLoadables(dependencies, results, exceptions));
          }).catch((error) => {
            exceptions[i] = error;
            resolve(wrapLoadables(dependencies, results, exceptions));
          });
        }
      }
    });
  },
  dangerouslyAllowMutability: true
});
var waitForAll = Recoil_selectorFamily({
  key: "__waitForAll",
  get: (dependencies) => ({
    get
  }) => {
    const deps = unwrapDependencies(dependencies);
    const [results, exceptions] = concurrentRequests(get, deps);
    if (exceptions.every((exp) => exp == null)) {
      return wrapResults(dependencies, results);
    }
    const error = exceptions.find(isError);
    if (error != null) {
      throw error;
    }
    return Promise.all(exceptions).then((exceptionResults) => wrapResults(dependencies, combineAsyncResultsWithSyncResults(results, exceptionResults)));
  },
  dangerouslyAllowMutability: true
});
var waitForAllSettled = Recoil_selectorFamily({
  key: "__waitForAllSettled",
  get: (dependencies) => ({
    get
  }) => {
    const deps = unwrapDependencies(dependencies);
    const [results, exceptions] = concurrentRequests(get, deps);
    if (exceptions.every((exp) => !Recoil_isPromise(exp))) {
      return wrapLoadables(dependencies, results, exceptions);
    }
    return Promise.all(exceptions.map((exp, i) => Recoil_isPromise(exp) ? exp.then((result) => {
      results[i] = result;
      exceptions[i] = void 0;
    }).catch((error) => {
      results[i] = void 0;
      exceptions[i] = error;
    }) : null)).then(() => wrapLoadables(dependencies, results, exceptions));
  },
  dangerouslyAllowMutability: true
});
var noWait = Recoil_selectorFamily({
  key: "__noWait",
  get: (dependency) => ({
    get
  }) => {
    try {
      return Recoil_selector.value(loadableWithValue$4(get(dependency)));
    } catch (exception) {
      return Recoil_selector.value(Recoil_isPromise(exception) ? loadableWithPromise$3(exception) : loadableWithError$3(exception));
    }
  },
  dangerouslyAllowMutability: true
});
var Recoil_WaitFor = {
  waitForNone,
  waitForAny,
  waitForAll,
  waitForAllSettled,
  noWait
};
var {
  RecoilLoadable
} = Recoil_Loadable$1;
var {
  DefaultValue: DefaultValue$3
} = Recoil_Node;
var {
  RecoilRoot: RecoilRoot$2,
  useRecoilStoreID: useRecoilStoreID$1
} = Recoil_RecoilRoot;
var {
  isRecoilValue: isRecoilValue$5
} = Recoil_RecoilValue$1;
var {
  retentionZone: retentionZone$1
} = Recoil_RetentionZone;
var {
  freshSnapshot: freshSnapshot$2
} = Recoil_Snapshot$1;
var {
  useRecoilState: useRecoilState$1,
  useRecoilState_TRANSITION_SUPPORT_UNSTABLE: useRecoilState_TRANSITION_SUPPORT_UNSTABLE$1,
  useRecoilStateLoadable: useRecoilStateLoadable$1,
  useRecoilValue: useRecoilValue$1,
  useRecoilValue_TRANSITION_SUPPORT_UNSTABLE: useRecoilValue_TRANSITION_SUPPORT_UNSTABLE$1,
  useRecoilValueLoadable: useRecoilValueLoadable$1,
  useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE: useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE$1,
  useResetRecoilState: useResetRecoilState$1,
  useSetRecoilState: useSetRecoilState$1
} = Recoil_Hooks;
var {
  useGotoRecoilSnapshot: useGotoRecoilSnapshot$1,
  useRecoilSnapshot: useRecoilSnapshot$1,
  useRecoilTransactionObserver: useRecoilTransactionObserver$1
} = Recoil_SnapshotHooks;
var {
  useRecoilCallback: useRecoilCallback$1
} = Recoil_useRecoilCallback;
var {
  noWait: noWait$1,
  waitForAll: waitForAll$1,
  waitForAllSettled: waitForAllSettled$1,
  waitForAny: waitForAny$1,
  waitForNone: waitForNone$1
} = Recoil_WaitFor;
var Recoil_index = {
  // Types
  DefaultValue: DefaultValue$3,
  isRecoilValue: isRecoilValue$5,
  RecoilLoadable,
  // Global Recoil environment settiongs
  RecoilEnv: Recoil_RecoilEnv,
  // Recoil Root
  RecoilRoot: RecoilRoot$2,
  useRecoilStoreID: useRecoilStoreID$1,
  useRecoilBridgeAcrossReactRoots_UNSTABLE: Recoil_useRecoilBridgeAcrossReactRoots,
  // Atoms/Selectors
  atom: Recoil_atom,
  selector: Recoil_selector,
  // Convenience Atoms/Selectors
  atomFamily: Recoil_atomFamily,
  selectorFamily: Recoil_selectorFamily,
  constSelector: Recoil_constSelector,
  errorSelector: Recoil_errorSelector,
  readOnlySelector: Recoil_readOnlySelector,
  // Concurrency Helpers for Atoms/Selectors
  noWait: noWait$1,
  waitForNone: waitForNone$1,
  waitForAny: waitForAny$1,
  waitForAll: waitForAll$1,
  waitForAllSettled: waitForAllSettled$1,
  // Hooks for Atoms/Selectors
  useRecoilValue: useRecoilValue$1,
  useRecoilValueLoadable: useRecoilValueLoadable$1,
  useRecoilState: useRecoilState$1,
  useRecoilStateLoadable: useRecoilStateLoadable$1,
  useSetRecoilState: useSetRecoilState$1,
  useResetRecoilState: useResetRecoilState$1,
  useGetRecoilValueInfo_UNSTABLE: Recoil_useGetRecoilValueInfo,
  useRecoilRefresher_UNSTABLE: Recoil_useRecoilRefresher,
  useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE: useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE$1,
  useRecoilValue_TRANSITION_SUPPORT_UNSTABLE: useRecoilValue_TRANSITION_SUPPORT_UNSTABLE$1,
  useRecoilState_TRANSITION_SUPPORT_UNSTABLE: useRecoilState_TRANSITION_SUPPORT_UNSTABLE$1,
  // Hooks for complex operations
  useRecoilCallback: useRecoilCallback$1,
  useRecoilTransaction_UNSTABLE: Recoil_useRecoilTransaction,
  // Snapshots
  useGotoRecoilSnapshot: useGotoRecoilSnapshot$1,
  useRecoilSnapshot: useRecoilSnapshot$1,
  useRecoilTransactionObserver_UNSTABLE: useRecoilTransactionObserver$1,
  snapshot_UNSTABLE: freshSnapshot$2,
  // Memory Management
  useRetain: Recoil_useRetain,
  retentionZone: retentionZone$1
};
var Recoil_index_1 = Recoil_index.DefaultValue;
var Recoil_index_2 = Recoil_index.isRecoilValue;
var Recoil_index_3 = Recoil_index.RecoilLoadable;
var Recoil_index_4 = Recoil_index.RecoilEnv;
var Recoil_index_5 = Recoil_index.RecoilRoot;
var Recoil_index_6 = Recoil_index.useRecoilStoreID;
var Recoil_index_7 = Recoil_index.useRecoilBridgeAcrossReactRoots_UNSTABLE;
var Recoil_index_8 = Recoil_index.atom;
var Recoil_index_9 = Recoil_index.selector;
var Recoil_index_10 = Recoil_index.atomFamily;
var Recoil_index_11 = Recoil_index.selectorFamily;
var Recoil_index_12 = Recoil_index.constSelector;
var Recoil_index_13 = Recoil_index.errorSelector;
var Recoil_index_14 = Recoil_index.readOnlySelector;
var Recoil_index_15 = Recoil_index.noWait;
var Recoil_index_16 = Recoil_index.waitForNone;
var Recoil_index_17 = Recoil_index.waitForAny;
var Recoil_index_18 = Recoil_index.waitForAll;
var Recoil_index_19 = Recoil_index.waitForAllSettled;
var Recoil_index_20 = Recoil_index.useRecoilValue;
var Recoil_index_21 = Recoil_index.useRecoilValueLoadable;
var Recoil_index_22 = Recoil_index.useRecoilState;
var Recoil_index_23 = Recoil_index.useRecoilStateLoadable;
var Recoil_index_24 = Recoil_index.useSetRecoilState;
var Recoil_index_25 = Recoil_index.useResetRecoilState;
var Recoil_index_26 = Recoil_index.useGetRecoilValueInfo_UNSTABLE;
var Recoil_index_27 = Recoil_index.useRecoilRefresher_UNSTABLE;
var Recoil_index_28 = Recoil_index.useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE;
var Recoil_index_29 = Recoil_index.useRecoilValue_TRANSITION_SUPPORT_UNSTABLE;
var Recoil_index_30 = Recoil_index.useRecoilState_TRANSITION_SUPPORT_UNSTABLE;
var Recoil_index_31 = Recoil_index.useRecoilCallback;
var Recoil_index_32 = Recoil_index.useRecoilTransaction_UNSTABLE;
var Recoil_index_33 = Recoil_index.useGotoRecoilSnapshot;
var Recoil_index_34 = Recoil_index.useRecoilSnapshot;
var Recoil_index_35 = Recoil_index.useRecoilTransactionObserver_UNSTABLE;
var Recoil_index_36 = Recoil_index.snapshot_UNSTABLE;
var Recoil_index_37 = Recoil_index.useRetain;
var Recoil_index_38 = Recoil_index.retentionZone;
var es_default = Recoil_index;
export {
  Recoil_index_1 as DefaultValue,
  Recoil_index_4 as RecoilEnv,
  Recoil_index_3 as RecoilLoadable,
  Recoil_index_5 as RecoilRoot,
  Recoil_index_8 as atom,
  Recoil_index_10 as atomFamily,
  Recoil_index_12 as constSelector,
  es_default as default,
  Recoil_index_13 as errorSelector,
  Recoil_index_2 as isRecoilValue,
  Recoil_index_15 as noWait,
  Recoil_index_14 as readOnlySelector,
  Recoil_index_38 as retentionZone,
  Recoil_index_9 as selector,
  Recoil_index_11 as selectorFamily,
  Recoil_index_36 as snapshot_UNSTABLE,
  Recoil_index_26 as useGetRecoilValueInfo_UNSTABLE,
  Recoil_index_33 as useGotoRecoilSnapshot,
  Recoil_index_7 as useRecoilBridgeAcrossReactRoots_UNSTABLE,
  Recoil_index_31 as useRecoilCallback,
  Recoil_index_27 as useRecoilRefresher_UNSTABLE,
  Recoil_index_34 as useRecoilSnapshot,
  Recoil_index_22 as useRecoilState,
  Recoil_index_23 as useRecoilStateLoadable,
  Recoil_index_30 as useRecoilState_TRANSITION_SUPPORT_UNSTABLE,
  Recoil_index_6 as useRecoilStoreID,
  Recoil_index_35 as useRecoilTransactionObserver_UNSTABLE,
  Recoil_index_32 as useRecoilTransaction_UNSTABLE,
  Recoil_index_20 as useRecoilValue,
  Recoil_index_21 as useRecoilValueLoadable,
  Recoil_index_28 as useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE,
  Recoil_index_29 as useRecoilValue_TRANSITION_SUPPORT_UNSTABLE,
  Recoil_index_25 as useResetRecoilState,
  Recoil_index_37 as useRetain,
  Recoil_index_24 as useSetRecoilState,
  Recoil_index_18 as waitForAll,
  Recoil_index_19 as waitForAllSettled,
  Recoil_index_17 as waitForAny,
  Recoil_index_16 as waitForNone
};
//# sourceMappingURL=recoil.js.map
