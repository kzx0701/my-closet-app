"use strict";
/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
}
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i2 = arr.indexOf(el);
  if (i2 > -1) {
    arr.splice(i2, 1);
  }
};
const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
const hasOwn$1 = (val, key) => hasOwnProperty$2.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$2 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject$2(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction = (fn2) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn2(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_2, c2) => c2 ? c2.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s2 = str ? `on${capitalize(str)}` : ``;
  return s2;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns$1 = (fns, arg) => {
  for (let i2 = 0; i2 < fns.length; i2++) {
    fns[i2](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i2 = 0; i2 < value.length; i2++) {
      const item = value[i2];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject$2(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      const normalized = normalizeClass(value[i2]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$2(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject$2(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i2) => {
          entries[stringifySymbol(key, i2) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v2) => stringifySymbol(v2))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$2(val) && !isArray$1(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v2, i2 = "") => {
  var _a;
  return isSymbol(v2) ? `Symbol(${(_a = v2.description) != null ? _a : i2})` : v2;
};
const isObject$1 = (val) => val !== null && typeof val === "object";
const defaultDelimiters = ["{", "}"];
class BaseFormatter {
  constructor() {
    this._caches = /* @__PURE__ */ Object.create(null);
  }
  interpolate(message, values, delimiters = defaultDelimiters) {
    if (!values) {
      return [message];
    }
    let tokens = this._caches[message];
    if (!tokens) {
      tokens = parse(message, delimiters);
      this._caches[message] = tokens;
    }
    return compile$1(tokens, values);
  }
}
const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
function parse(format, [startDelimiter, endDelimiter]) {
  const tokens = [];
  let position = 0;
  let text = "";
  while (position < format.length) {
    let char = format[position++];
    if (char === startDelimiter) {
      if (text) {
        tokens.push({ type: "text", value: text });
      }
      text = "";
      let sub2 = "";
      char = format[position++];
      while (char !== void 0 && char !== endDelimiter) {
        sub2 += char;
        char = format[position++];
      }
      const isClosed = char === endDelimiter;
      const type = RE_TOKEN_LIST_VALUE.test(sub2) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub2) ? "named" : "unknown";
      tokens.push({ value: sub2, type });
    } else {
      text += char;
    }
  }
  text && tokens.push({ type: "text", value: text });
  return tokens;
}
function compile$1(tokens, values) {
  const compiled = [];
  let index2 = 0;
  const mode = Array.isArray(values) ? "list" : isObject$1(values) ? "named" : "unknown";
  if (mode === "unknown") {
    return compiled;
  }
  while (index2 < tokens.length) {
    const token = tokens[index2];
    switch (token.type) {
      case "text":
        compiled.push(token.value);
        break;
      case "list":
        compiled.push(values[parseInt(token.value, 10)]);
        break;
      case "named":
        if (mode === "named") {
          compiled.push(values[token.value]);
        } else {
          {
            console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
          }
        }
        break;
      case "unknown":
        {
          console.warn(`Detect 'unknown' type of token!`);
        }
        break;
    }
    index2++;
  }
  return compiled;
}
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const defaultFormatter = new BaseFormatter();
function include(str, parts) {
  return !!parts.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts) {
  return parts.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, "-");
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf("zh") === 0) {
    if (locale.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages && Object.keys(messages).length > 0) {
    locales = Object.keys(messages);
  }
  const lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
class I18n {
  constructor({ locale, fallbackLocale, messages, watcher, formater: formater2 }) {
    this.locale = LOCALE_EN;
    this.fallbackLocale = LOCALE_EN;
    this.message = {};
    this.messages = {};
    this.watchers = [];
    if (fallbackLocale) {
      this.fallbackLocale = fallbackLocale;
    }
    this.formater = formater2 || defaultFormatter;
    this.messages = messages || {};
    this.setLocale(locale || LOCALE_EN);
    if (watcher) {
      this.watchLocale(watcher);
    }
  }
  setLocale(locale) {
    const oldLocale = this.locale;
    this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
    if (!this.messages[this.locale]) {
      this.messages[this.locale] = {};
    }
    this.message = this.messages[this.locale];
    if (oldLocale !== this.locale) {
      this.watchers.forEach((watcher) => {
        watcher(this.locale, oldLocale);
      });
    }
  }
  getLocale() {
    return this.locale;
  }
  watchLocale(fn2) {
    const index2 = this.watchers.push(fn2) - 1;
    return () => {
      this.watchers.splice(index2, 1);
    };
  }
  add(locale, message, override = true) {
    const curMessages = this.messages[locale];
    if (curMessages) {
      if (override) {
        Object.assign(curMessages, message);
      } else {
        Object.keys(message).forEach((key) => {
          if (!hasOwn(curMessages, key)) {
            curMessages[key] = message[key];
          }
        });
      }
    } else {
      this.messages[locale] = message;
    }
  }
  f(message, values, delimiters) {
    return this.formater.interpolate(message, values, delimiters).join("");
  }
  t(key, locale, values) {
    let message = this.message;
    if (typeof locale === "string") {
      locale = normalizeLocale(locale, this.messages);
      locale && (message = this.messages[locale]);
    } else {
      values = locale;
    }
    if (!hasOwn(message, key)) {
      console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
      return key;
    }
    return this.formater.interpolate(message[key], values).join("");
  }
}
function watchAppLocale(appVm, i18n) {
  if (appVm.$watchLocale) {
    appVm.$watchLocale((newLocale) => {
      i18n.setLocale(newLocale);
    });
  } else {
    appVm.$watch(() => appVm.$locale, (newLocale) => {
      i18n.setLocale(newLocale);
    });
  }
}
function getDefaultLocale() {
  if (typeof index$1 !== "undefined" && index$1.getLocale) {
    return index$1.getLocale();
  }
  if (typeof global !== "undefined" && global.getLocale) {
    return global.getLocale();
  }
  return LOCALE_EN;
}
function initVueI18n(locale, messages = {}, fallbackLocale, watcher) {
  if (typeof locale !== "string") {
    const options = [
      messages,
      locale
    ];
    locale = options[0];
    messages = options[1];
  }
  if (typeof locale !== "string") {
    locale = getDefaultLocale();
  }
  if (typeof fallbackLocale !== "string") {
    fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
  }
  const i18n = new I18n({
    locale,
    fallbackLocale,
    messages,
    watcher
  });
  let t2 = (key, values) => {
    if (typeof getApp !== "function") {
      t2 = function(key2, values2) {
        return i18n.t(key2, values2);
      };
    } else {
      let isWatchedAppLocale = false;
      t2 = function(key2, values2) {
        const appVm = getApp().$vm;
        if (appVm) {
          appVm.$locale;
          if (!isWatchedAppLocale) {
            isWatchedAppLocale = true;
            watchAppLocale(appVm, i18n);
          }
        }
        return i18n.t(key2, values2);
      };
    }
    return t2(key, values);
  };
  return {
    i18n,
    f(message, values, delimiters) {
      return i18n.f(message, values, delimiters);
    },
    t(key, values) {
      return t2(key, values);
    },
    add(locale2, message, override = true) {
      return i18n.add(locale2, message, override);
    },
    watch(fn2) {
      return i18n.watchLocale(fn2);
    },
    getLocale() {
      return i18n.getLocale();
    },
    setLocale(newLocale) {
      return i18n.setLocale(newLocale);
    }
  };
}
const SLOT_DEFAULT_NAME = "d";
const ON_SHOW = "onShow";
const ON_HIDE = "onHide";
const ON_LAUNCH = "onLaunch";
const ON_ERROR = "onError";
const ON_THEME_CHANGE = "onThemeChange";
const ON_PAGE_NOT_FOUND = "onPageNotFound";
const ON_UNHANDLE_REJECTION = "onUnhandledRejection";
const ON_LAST_PAGE_BACK_PRESS = "onLastPageBackPress";
const ON_EXIT = "onExit";
const ON_LOAD = "onLoad";
const ON_READY = "onReady";
const ON_UNLOAD = "onUnload";
const ON_INIT = "onInit";
const ON_SAVE_EXIT_STATE = "onSaveExitState";
const ON_UPLOAD_DOUYIN_VIDEO = "onUploadDouyinVideo";
const ON_LIVE_MOUNT = "onLiveMount";
const ON_TITLE_CLICK = "onTitleClick";
const ON_RESIZE = "onResize";
const ON_BACK_PRESS = "onBackPress";
const ON_PAGE_SCROLL = "onPageScroll";
const ON_TAB_ITEM_TAP = "onTabItemTap";
const ON_REACH_BOTTOM = "onReachBottom";
const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
const ON_SHARE_TIMELINE = "onShareTimeline";
const ON_SHARE_CHAT = "onShareChat";
const ON_COPY_URL = "onCopyUrl";
const ON_ADD_TO_FAVORITES = "onAddToFavorites";
const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED = "onNavigationBarSearchInputClicked";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED = "onNavigationBarSearchInputChanged";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED = "onNavigationBarSearchInputConfirmed";
const ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED = "onNavigationBarSearchInputFocusChanged";
const VIRTUAL_HOST_STYLE = "virtualHostStyle";
const VIRTUAL_HOST_CLASS = "virtualHostClass";
const VIRTUAL_HOST_HIDDEN = "virtualHostHidden";
const VIRTUAL_HOST_ID = "virtualHostId";
const customizeRE = /:/g;
function customizeEvent(str) {
  return camelize(str.replace(customizeRE, "-"));
}
function hasLeadingSlash(str) {
  return str.indexOf("/") === 0;
}
function addLeadingSlash(str) {
  return hasLeadingSlash(str) ? str : "/" + str;
}
const invokeArrayFns = (fns, arg) => {
  let ret;
  for (let i2 = 0; i2 < fns.length; i2++) {
    ret = fns[i2](arg);
  }
  return ret;
};
function once(fn2, ctx = null) {
  let res;
  return (...args) => {
    if (fn2) {
      res = fn2.apply(ctx, args);
      fn2 = null;
    }
    return res;
  };
}
function getValueByDataPath(obj, path) {
  if (!isString(path)) {
    return;
  }
  path = path.replace(/\[(\d+)\]/g, ".$1");
  const parts = path.split(".");
  let key = parts[0];
  if (!obj) {
    obj = {};
  }
  if (parts.length === 1) {
    return obj[key];
  }
  return getValueByDataPath(obj[key], parts.slice(1).join("."));
}
const encode$1 = encodeURIComponent;
function stringifyQuery(obj, encodeStr = encode$1) {
  const res = obj ? Object.keys(obj).map((key) => {
    let val = obj[key];
    if (typeof val === void 0 || val === null) {
      val = "";
    } else if (isPlainObject$1(val)) {
      val = JSON.stringify(val);
    }
    return encodeStr(key) + "=" + encodeStr(val);
  }).filter((x) => x.length > 0).join("&") : null;
  return res ? `?${res}` : "";
}
const PAGE_HOOKS = [
  ON_INIT,
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_COPY_URL,
  ON_UPLOAD_DOUYIN_VIDEO,
  ON_LIVE_MOUNT,
  ON_TITLE_CLICK,
  ON_ADD_TO_FAVORITES,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
function isRootHook(name) {
  return PAGE_HOOKS.indexOf(name) > -1;
}
const UniLifecycleHooks = [
  ON_SHOW,
  ON_HIDE,
  ON_LAUNCH,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION,
  ON_EXIT,
  ON_INIT,
  ON_LOAD,
  ON_READY,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_ADD_TO_FAVORITES,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_COPY_URL,
  ON_UPLOAD_DOUYIN_VIDEO,
  ON_LIVE_MOUNT,
  ON_TITLE_CLICK,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED,
  ON_LAST_PAGE_BACK_PRESS
];
const MINI_PROGRAM_PAGE_RUNTIME_HOOKS = /* @__PURE__ */ (() => {
  return {
    onPageScroll: 1,
    onShareAppMessage: 1 << 1,
    onShareTimeline: 1 << 2,
    onShareChat: 1 << 3,
    onCopyUrl: 1 << 4,
    onUploadDouyinVideo: 1 << 5,
    onLiveMount: 1 << 6,
    onTitleClick: 1 << 7
  };
})();
function isUniLifecycleHook(name, value, checkType = true) {
  if (checkType && !isFunction(value)) {
    return false;
  }
  if (UniLifecycleHooks.indexOf(name) > -1) {
    return true;
  } else if (name.indexOf("on") === 0) {
    return true;
  }
  return false;
}
let vueApp;
const createVueAppHooks = [];
function onCreateVueApp(hook) {
  if (vueApp) {
    return hook(vueApp);
  }
  createVueAppHooks.push(hook);
}
function invokeCreateVueAppHook(app) {
  vueApp = app;
  createVueAppHooks.forEach((hook) => hook(app));
}
const invokeCreateErrorHandler = once((app, createErrorHandler2) => {
  return createErrorHandler2(app);
});
const E$1 = function() {
};
E$1.prototype = {
  _id: 1,
  on: function(name, callback, ctx) {
    var e2 = this.e || (this.e = {});
    (e2[name] || (e2[name] = [])).push({
      fn: callback,
      ctx,
      _id: this._id
    });
    return this._id++;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i2 = 0;
    var len = evtArr.length;
    for (i2; i2 < len; i2++) {
      evtArr[i2].fn.apply(evtArr[i2].ctx, data);
    }
    return this;
  },
  off: function(name, event) {
    var e2 = this.e || (this.e = {});
    var evts = e2[name];
    var liveEvents = [];
    if (evts && event) {
      for (var i2 = evts.length - 1; i2 >= 0; i2--) {
        if (evts[i2].fn === event || evts[i2].fn._ === event || evts[i2]._id === event) {
          evts.splice(i2, 1);
          break;
        }
      }
      liveEvents = evts;
    }
    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
    return this;
  }
};
var E$1$1 = E$1;
/**
* @dcloudio/uni-mp-vue v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn2) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn2();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else {
      warn$2(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i2, l2;
      for (i2 = 0, l2 = this.effects.length; i2 < l2; i2++) {
        this.effects[i2].stop();
      }
      for (i2 = 0, l2 = this.cleanups.length; i2 < l2; i2++) {
        this.cleanups[i2]();
      }
      if (this.scopes) {
        for (i2 = 0, l2 = this.scopes.length; i2 < l2; i2++) {
          this.scopes[i2].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn2, trigger2, scheduler, scope) {
    this.fn = fn2;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i2 = 0; i2 < this._depsLength; i2++) {
        const dep = this.deps[i2];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v2) {
    this._dirtyLevel = v2 ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    var _a;
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      (_a = this.onStop) == null ? void 0 : _a.call(this);
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i2 = effect2._depsLength; i2 < effect2.deps.length; i2++) {
      cleanupDepEffect(effect2.deps[i2], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  var _a;
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
    {
      (_a = effect2.onTrack) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  var _a;
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      {
        (_a = effect2.onTrigger) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
      }
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("iterate");
const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep,
      {
        target,
        type,
        key
      }
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4,
        {
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget
        }
      );
    }
  }
  resetScheduling();
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i2 = 0, l2 = this.length; i2 < l2; i2++) {
        track(arr, "get", i2 + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn$1(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$2(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn$1(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn$1(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    {
      warn$2(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
  deleteProperty(target, key) {
    {
      warn$2(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v2) => Reflect.getPrototypeOf(v2);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add$1(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach3(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      warn$2(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add: add$1,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add: add$1,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn$1(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    warn$2(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$2(target)) {
    {
      warn$2(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject$2(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$2(value) ? readonly(value) : value;
const COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self = toRaw(this);
    if ((!self._cacheable || self.effect.dirty) && hasChanged(self._value, self._value = self.effect.run())) {
      triggerRefValue(self, 4);
    }
    trackRefValue(self);
    if (self.effect._dirtyLevel >= 2) {
      if (this._warnRecursive) {
        warn$2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
      }
      triggerRefValue(self, 2);
    }
    return self._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v2) {
    this.effect.dirty = v2;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
      warn$2("Write operation failed: computed value is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  if (debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ),
      {
        target: ref2,
        type: "get",
        key: "value"
      }
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel,
      {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      }
    );
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a2) => {
          var _a, _b;
          return (_b = (_a = a2.toString) == null ? void 0 : _a.call(a2)) != null ? _b : JSON.stringify(a2);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i2) => {
    logs.push(...i2 === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props2) {
  const res = [];
  const keys = Object.keys(props2);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props2[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
};
function callWithErrorHandling(fn2, instance, type, args) {
  try {
    return args ? fn2(...args) : fn2();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn2, instance, type, args) {
  if (isFunction(fn2)) {
    const res = callWithErrorHandling(fn2, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i2 = 0; i2 < fn2.length; i2++) {
    values.push(callWithAsyncErrorHandling(fn2[i2], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = ErrorTypeStrings[type] || type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i2 = 0; i2 < errorCapturedHooks.length; i2++) {
          if (errorCapturedHooks[i2](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    const info = ErrorTypeStrings[type] || type;
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      console.error(err);
    } else {
      console.error(err);
    }
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue$1 = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick$1(fn2) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn2 ? p2.then(this ? fn2.bind(this) : fn2) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue$1.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue$1[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue$1.length || !queue$1.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue$1.push(job);
    } else {
      queue$1.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function hasQueueJob(job) {
  return queue$1.indexOf(job) > -1;
}
function invalidateJob(job) {
  const i2 = queue$1.indexOf(job);
  if (i2 > flushIndex) {
    queue$1.splice(i2, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i2 = isFlushing ? flushIndex + 1 : 0) {
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i2 < queue$1.length; i2++) {
    const cb = queue$1[i2];
    if (cb && cb.pre) {
      if (checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue$1.splice(i2, 1);
      i2--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a2, b2) => getId(a2) - getId(b2)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a2, b2) => {
  const diff2 = getId(a2) - getId(b2);
  if (diff2 === 0) {
    if (a2.pre && !b2.pre)
      return -1;
    if (b2.pre && !a2.pre)
      return 1;
  }
  return diff2;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue$1.sort(comparator);
  const check = (job) => checkRecursiveUpdates(seen, job);
  try {
    for (flushIndex = 0; flushIndex < queue$1.length; flushIndex++) {
      const job = queue$1[flushIndex];
      if (job && job.active !== false) {
        if (check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue$1.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue$1.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn2) {
  if (!seen.has(fn2)) {
    seen.set(fn2, 1);
  } else {
    const count = seen.get(fn2);
    if (count > RECURSION_LIMIT) {
      const instance = fn2.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    } else {
      seen.set(fn2, count + 1);
    }
  }
}
let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app, version2) {
  emit$1("app:init", app, version2, {
    Fragment,
    Text: Text$1,
    Comment,
    Static
  });
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added"
  /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:updated"
  /* COMPONENT_UPDATED */
);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed"
  /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      // fixed by xxxxxx
      // 为 0 是 App，无 parent 是 Page 指向 App
      component.uid === 0 ? void 0 : component.parent ? component.parent.uid : 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start"
  /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end"
  /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type, time) => {
    emit$1(hook, component.appContext.app, component.uid, component, type, time);
  };
}
function devtoolsComponentEmit(component, event, params2) {
  emit$1(
    "component:emit",
    component.appContext.app,
    component,
    event,
    params2
  );
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props2 = instance.vnode.props || EMPTY_OBJ;
  {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn$1(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props2) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number: number2, trim: trim2 } = props2[modifiersKey] || EMPTY_OBJ;
    if (trim2) {
      args = rawArgs.map((a2) => isString(a2) ? a2.trim() : a2);
    }
    if (number2) {
      args = rawArgs.map(looseToNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props2[toHandlerKey(lowerCaseEvent)]) {
      warn$1(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
          event
        )}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props2[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props2[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props2[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props2[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$2(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$2(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn$1(options, key[0].toLowerCase() + key.slice(1)) || hasOwn$1(options, hyphenate(key)) || hasOwn$1(options, key);
}
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  instance && instance.type.__scopeId || null;
  return prev;
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component2 = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component2,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component2;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component2[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component2;
    }
    if (warnMissing && !res) {
      const extra = type === COMPONENTS ? `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.` : ``;
      warn$1(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
    }
    return res;
  } else {
    warn$1(
      `resolve${capitalize(type.slice(0, -1))} can only be used in render() or setup().`
    );
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if (!isFunction(cb)) {
    warn$1(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once: once2,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once2) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  if (deep !== void 0 && typeof deep === "number") {
    warn$1(
      `watch() "deep" option with number value will be used as watch depth in future versions. Please use a boolean instead to avoid potential breakage.`
    );
  }
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once2 !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s2) => {
    warn$1(
      `Invalid watch source: `,
      s2,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return reactiveGetter(s2);
      } else if (isFunction(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else {
        warnInvalidSource(s2);
      }
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn2) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn2, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v2, i2) => hasChanged(v2, oldValue[i2])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect$1(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  {
    effect2.onTrack = onTrack;
    effect2.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect$1(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i2 = 0; i2 < segments.length && cur; i2++) {
      cur = cur[segments[i2]];
    }
    return cur;
  };
}
function traverse(value, depth, currentDepth = 0, seen) {
  if (!isObject$2(value) || value["__v_skip"]) {
    return value;
  }
  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value;
    }
    currentDepth++;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, depth, currentDepth, seen);
  } else if (isArray$1(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      traverse(value[i2], depth, currentDepth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v2) => {
      traverse(v2, depth, currentDepth, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], depth, currentDepth, seen);
    }
  }
  return value;
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject$2(rootProps)) {
      warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version: version$1,
      get config() {
        return context.config;
      },
      set config(v2) {
        {
          warn$1(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2)) {
          warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin2 && isFunction(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options);
        } else if (isFunction(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options);
        } else {
          warn$1(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app;
      },
      mixin(mixin2) {
        {
          if (!context.mixins.includes(mixin2)) {
            context.mixins.push(mixin2);
          } else {
            warn$1(
              "Mixin has already been applied to target app" + (mixin2.name ? `: ${mixin2.name}` : "")
            );
          }
        }
        return app;
      },
      component(name, component) {
        {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if (context.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if (context.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app;
      },
      // fixed by xxxxxx
      mount() {
      },
      // fixed by xxxxxx
      unmount() {
      },
      provide(key, value) {
        if (key in context.provides) {
          warn$1(
            `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
          );
        }
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn2) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn2();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) {
    {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
    if (currentInstance.type.mpType === "app") {
      currentInstance.appContext.app.provide(key, value);
    }
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    if (isRootHook(type)) {
      target = target.root;
    }
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = toHandlerKey(
      (ErrorTypeStrings[type] || type.replace(/^on/, "")).replace(/ hook$/, "")
    );
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().`
    );
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const getPublicInstance = (i2) => {
  if (!i2)
    return null;
  if (isStatefulComponent(i2))
    return getExposeProxy(i2) || i2.proxy;
  return getPublicInstance(i2.parent);
};
function getComponentInternalInstance(i2) {
  return i2;
}
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    // fixed by xxxxxx
    $: getComponentInternalInstance,
    // fixed by xxxxxx vue-i18n 在 dev 模式，访问了 $el，故模拟一个假的
    // $el: i => i.vnode.el,
    $el: (i2) => i2.__$el || (i2.__$el = {}),
    $data: (i2) => i2.data,
    $props: (i2) => shallowReadonly(i2.props),
    $attrs: (i2) => shallowReadonly(i2.attrs),
    $slots: (i2) => shallowReadonly(i2.slots),
    $refs: (i2) => shallowReadonly(i2.refs),
    $parent: (i2) => getPublicInstance(i2.parent),
    $root: (i2) => getPublicInstance(i2.root),
    $emit: (i2) => i2.emit,
    $options: (i2) => resolveMergedOptions(i2),
    $forceUpdate: (i2) => i2.f || (i2.f = () => {
      i2.effect.dirty = true;
      queueJob(i2.update);
    }),
    // $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy!)),// fixed by xxxxxx
    $watch: (i2) => instanceWatch.bind(i2)
  })
);
const isReservedPrefix = (key) => key === "_" || key === "$";
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn$1(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props: props2, accessCache, type, appContext } = instance;
    if (key === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props2[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn$1(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn$1(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props2[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn$1(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      } else if (key === "$slots") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn$1(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (instance.exposed && hasOwn$1(instance.exposed, key)) {
      return instance.exposed[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn$1(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else if (currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn$1(data, key)) {
        warn$1(
          `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn$1(
          `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (setupState.__isScriptSetup && hasOwn$1(setupState, key)) {
      warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
      return false;
    } else if (data !== EMPTY_OBJ && hasOwn$1(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn$1(instance.props, key)) {
      warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      warn$1(
        `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if (key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn$1(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn$1(normalizedProps, key) || hasOwn$1(ctx, key) || hasOwn$1(publicPropertiesMap, key) || hasOwn$1(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn$1(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
{
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn$1(
          `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    }
  });
}
function normalizePropsOrEmits(props2) {
  return isArray$1(props2) ? props2.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props2;
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions$1(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = createDuplicateChecker();
  {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props", key);
      }
    }
  }
  function initInjections() {
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
  }
  {
    initInjections();
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
        {
          checkDuplicateProperties("Methods", key);
        }
      } else {
        warn$1(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if (!isFunction(dataOptions)) {
      warn$1(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (isPromise(data)) {
      warn$1(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!isObject$2(data)) {
      warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      {
        for (const key in data) {
          checkDuplicateProperties("Data", key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (get2 === NOOP) {
        warn$1(`Computed property "${key}" has no getter.`);
      }
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
        warn$1(
          `Write operation failed: computed property "${key}" is readonly.`
        );
      };
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v2) => c2.value = v2
      });
      {
        checkDuplicateProperties("Computed", key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  function initProvides() {
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
  }
  {
    initProvides();
  }
  {
    if (created) {
      callHook$1(created, instance, "c");
    }
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (instance.ctx.$onApplyOptions) {
    instance.ctx.$onApplyOptions(options, instance, publicThis);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$2(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v2) => injected.value = v2
      });
    } else {
      ctx[key] = injected;
    }
    {
      checkDuplicateProperties("Inject", key);
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    } else {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$2(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      } else {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else {
    warn$1(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$2(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to, m2, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
      warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray$1,
  created: mergeAsArray$1,
  beforeMount: mergeAsArray$1,
  mounted: mergeAsArray$1,
  beforeUpdate: mergeAsArray$1,
  updated: mergeAsArray$1,
  beforeDestroy: mergeAsArray$1,
  beforeUnmount: mergeAsArray$1,
  destroyed: mergeAsArray$1,
  unmounted: mergeAsArray$1,
  activated: mergeAsArray$1,
  deactivated: mergeAsArray$1,
  errorCaptured: mergeAsArray$1,
  serverPrefetch: mergeAsArray$1,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i2 = 0; i2 < raw.length; i2++) {
      res[raw[i2]] = raw[i2];
    }
    return res;
  }
  return raw;
}
function mergeAsArray$1(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray$1(to[key], from[key]);
  }
  return merged;
}
function initProps$1(instance, rawProps, isStateful, isSSR = false) {
  const props2 = {};
  const attrs = {};
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props2, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props2)) {
      props2[key] = void 0;
    }
  }
  {
    validateProps(rawProps || {}, props2, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props2 : shallowReactive(props2);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props2;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props: props2,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props2);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !isInHmrContext() && (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
        let key = propsToUpdate[i2];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn$1(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = normalizeInheritAttrsValue(instance, key, value);
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props2[camelizedKey] = resolvePropValue$1(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = normalizeInheritAttrsValue(instance, key, value);
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props2, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn$1(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn$1(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props2[key] = resolvePropValue$1(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props2[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn$1(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
  {
    validateProps(rawProps || {}, props2, instance);
  }
}
function setFullProps(instance, rawProps, props2, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn$1(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          {
            props2[camelKey] = value;
          }
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = normalizeInheritAttrsValue(instance, key, value);
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props2);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i2 = 0; i2 < needCastKeys.length; i2++) {
      const key = needCastKeys[i2];
      props2[key] = resolvePropValue$1(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn$1(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function normalizeInheritAttrsValue(instance, key, value) {
  return value;
}
function resolvePropValue$1(options, props2, key, value, instance, isAbsent) {
  const result = _resolvePropValue(
    options,
    props2,
    key,
    value,
    instance,
    isAbsent
  );
  return result;
}
function _resolvePropValue(options, props2, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn$1(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props2
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props2, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props2);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$2(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i2 = 0; i2 < raw.length; i2++) {
      if (!isString(raw[i2])) {
        warn$1(`props must be strings when using array syntax.`, raw[i2]);
      }
      const normalizedKey = camelize(raw[i2]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!isObject$2(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn$1(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$2(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  } else {
    warn$1(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType$1(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a2, b2) {
  return getType$1(a2) === getType$1(b2);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props2, instance) {
  const resolvedValues = toRaw(props2);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp$1(
      key,
      resolvedValues[key],
      opt,
      shallowReadonly(resolvedValues),
      !hasOwn$1(rawProps, key) && !hasOwn$1(rawProps, hyphenate(key))
    );
  }
}
function validateProp$1(name, value, prop, props2, isAbsent) {
  const { type, required, validator, skipCheck } = prop;
  if (required && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !required) {
    return;
  }
  if (type != null && type !== true && !skipCheck) {
    let isValid = false;
    const types = isArray$1(type) ? type : [type];
    const expectedTypes = [];
    for (let i2 = 0; i2 < types.length && !isValid; i2++) {
      const { valid, expectedType } = assertType$1(value, types[i2]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn$1(getInvalidTypeMessage$1(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value, props2)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType$1 = /* @__PURE__ */ makeMap(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType$1(value, type) {
  let valid;
  const expectedType = getType$1(type);
  if (isSimpleType$1(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$2(value);
  } else if (expectedType === "Array") {
    valid = isArray$1(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage$1(name, value, expectedTypes) {
  if (expectedTypes.length === 0) {
    return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
  }
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue$1(value, expectedType);
  const receivedValue = styleValue$1(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable$1(expectedType) && !isBoolean$1(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable$1(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue$1(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable$1(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean$1(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
let supported;
let perf;
function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }
  {
    devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  {
    devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}
const queuePostRenderEffect$1 = queuePostFlushCb;
const Fragment = Symbol.for("v-fgt");
const Text$1 = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
const InternalObjectKey = `__vInternal`;
function guardReactiveProps(props2) {
  if (!props2)
    return null;
  return isProxy(props2) || InternalObjectKey in props2 ? extend({}, props2) : props2;
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null,
    // fixed by xxxxxx 用于存储uni-app的元素缓存
    $uniElements: /* @__PURE__ */ new Map(),
    $templateUniElementRefs: [],
    $templateUniElementStyles: {},
    $eS: {},
    $eA: {}
  };
  {
    instance.ctx = createDevRenderContext(instance);
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  internalSetCurrentInstance = (i2) => {
    currentInstance = i2;
  };
  setInSSRSetupState = (v2) => {
    isInSSRComponentSetup = v2;
  };
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn$1(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const {
    props: props2
    /*, children*/
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps$1(instance, props2, isStateful, isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component2 = instance.type;
  {
    if (Component2.name) {
      validateComponentName(Component2.name, instance.appContext.config);
    }
    if (Component2.components) {
      const names = Object.keys(Component2.components);
      for (let i2 = 0; i2 < names.length; i2++) {
        validateComponentName(names[i2], instance.appContext.config);
      }
    }
    if (Component2.directives) {
      const names = Object.keys(Component2.directives);
      for (let i2 = 0; i2 < names.length; i2++) {
        validateDirectiveName(names[i2]);
      }
    }
    if (Component2.compilerOptions && isRuntimeOnly()) {
      warn$1(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component2;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        shallowReadonly(instance.props),
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      {
        warn$1(
          `setup() returned a Promise, but the version of Vue you are using does not support it yet.`
        );
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject$2(setupResult)) {
    if (isVNode(setupResult)) {
      warn$1(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (setupResult !== void 0) {
    warn$1(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
let compile;
const isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component2 = instance.type;
  if (!instance.render) {
    instance.render = Component2.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions$1(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
  if (!Component2.render && instance.render === NOOP && !isSSR) {
    if (Component2.template) {
      warn$1(
        `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      );
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      },
      set() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      }
    }
  ));
}
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key) {
      track(instance, "get", "$slots");
      return target[key];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    {
      if (instance.exposed) {
        warn$1(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if (isArray$1(exposed)) {
            exposedType = "array";
          } else if (isRef(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn$1(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  {
    return Object.freeze({
      get attrs() {
        return getAttrsProxy(instance);
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        }
        return instance.proxy[key];
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component2, includeInferred = true) {
  return isFunction(Component2) ? Component2.displayName || Component2.name : Component2.name || includeInferred && Component2.__name;
}
function formatComponentName(instance, Component2, isRoot = false) {
  let name = getComponentName(Component2);
  if (!name && Component2.__file) {
    const match = Component2.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component2) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
const computed = (getterOrOptions, debugOptions) => {
  const c2 = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  {
    const i2 = getCurrentInstance();
    if (i2 && i2.appContext.config.warnRecursiveComputed) {
      c2._warnRecursive = true;
    }
  }
  return c2;
};
const version$1 = "3.4.21";
const warn = warn$1;
function unwrapper(target) {
  return unref(target);
}
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}
function syncKeys(current, pre) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key in pre) {
      const currentValue = current[key];
      if (currentValue === void 0) {
        current[key] = null;
      } else {
        syncKeys(currentValue, pre[key]);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index2) => {
        syncKeys(current[index2], item);
      });
    }
  }
}
function _diff(current, pre, path, result) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = unwrapper(current[key]);
        const preValue = pre[key];
        const currentType = toTypeString(currentValue);
        const preType = toTypeString(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != preValue) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == "" ? "" : path + ".") + key,
                currentValue
              );
            } else {
              currentValue.forEach((item, index2) => {
                _diff(
                  item,
                  preValue[index2],
                  (path == "" ? "" : path + ".") + key + "[" + index2 + "]",
                  result
                );
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == "" ? "" : path + ".") + key + "." + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index2) => {
          _diff(item, pre[index2], path + "[" + index2 + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}
function setResult(result, k, v2) {
  result[k] = v2;
}
function hasComponentEffect(instance) {
  return queue$1.includes(instance.update);
}
function flushCallbacks(instance) {
  const ctx = instance.ctx;
  const callbacks = ctx.__next_tick_callbacks;
  if (callbacks && callbacks.length) {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i2 = 0; i2 < copies.length; i2++) {
      copies[i2]();
    }
  }
}
function nextTick(instance, fn2) {
  const ctx = instance.ctx;
  if (!ctx.__next_tick_pending && !hasComponentEffect(instance)) {
    return nextTick$1(fn2 && fn2.bind(instance.proxy));
  }
  let _resolve;
  if (!ctx.__next_tick_callbacks) {
    ctx.__next_tick_callbacks = [];
  }
  ctx.__next_tick_callbacks.push(() => {
    if (fn2) {
      callWithErrorHandling(
        fn2.bind(instance.proxy),
        instance,
        14
      );
    } else if (_resolve) {
      _resolve(instance.proxy);
    }
  });
  return new Promise((resolve2) => {
    _resolve = resolve2;
  });
}
function clone$1(src, seen) {
  src = unwrapper(src);
  const type = typeof src;
  if (type === "object" && src !== null) {
    let copy = seen.get(src);
    if (typeof copy !== "undefined") {
      return copy;
    }
    if (isArray$1(src)) {
      const len = src.length;
      copy = new Array(len);
      seen.set(src, copy);
      for (let i2 = 0; i2 < len; i2++) {
        copy[i2] = clone$1(src[i2], seen);
      }
    } else {
      copy = {};
      seen.set(src, copy);
      for (const name in src) {
        if (hasOwn$1(src, name)) {
          copy[name] = clone$1(src[name], seen);
        }
      }
    }
    return copy;
  }
  if (type !== "symbol") {
    return src;
  }
}
function deepCopy(src) {
  return clone$1(src, typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map());
}
function getMPInstanceData(instance, keys) {
  const data = instance.data;
  const ret = /* @__PURE__ */ Object.create(null);
  keys.forEach((key) => {
    ret[key] = data[key];
  });
  return ret;
}
function patch(instance, data, oldData) {
  if (!data) {
    return;
  }
  data = deepCopy(data);
  data.$eS = instance.$eS || {};
  data.$eA = instance.$eA || {};
  const ctx = instance.ctx;
  const mpType = ctx.mpType;
  if (mpType === "page" || mpType === "component") {
    data.r0 = 1;
    const mpInstance = ctx.$scope;
    const keys = Object.keys(data);
    const diffData = diff(data, oldData || getMPInstanceData(mpInstance, keys));
    if (Object.keys(diffData).length) {
      ctx.__next_tick_pending = true;
      mpInstance.setData(diffData, () => {
        ctx.__next_tick_pending = false;
        flushCallbacks(instance);
      });
      flushPreFlushCbs();
    } else {
      flushCallbacks(instance);
    }
  }
}
function initAppConfig(appConfig) {
  appConfig.globalProperties.$nextTick = function $nextTick(fn2) {
    return nextTick(this.$, fn2);
  };
}
function onApplyOptions(options, instance, publicThis) {
  instance.appContext.config.globalProperties.$applyOptions(
    options,
    instance,
    publicThis
  );
  const computedOptions = options.computed;
  if (computedOptions) {
    const keys = Object.keys(computedOptions);
    if (keys.length) {
      const ctx = instance.ctx;
      if (!ctx.$computedKeys) {
        ctx.$computedKeys = [];
      }
      ctx.$computedKeys.push(...keys);
    }
  }
  delete instance.ctx.$onApplyOptions;
}
function setRef$1(instance, isUnmount = false) {
  const {
    setupState,
    $templateRefs,
    $templateUniElementRefs,
    ctx: { $scope, $mpPlatform }
  } = instance;
  if (!$scope || !$templateRefs && !$templateUniElementRefs) {
    return;
  }
  if (isUnmount) {
    if ($mpPlatform !== "mp-alipay") {
      $templateRefs && $templateRefs.forEach(
        (templateRef) => setTemplateRef(templateRef, null, setupState)
      );
    }
    $templateUniElementRefs && $templateUniElementRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    return;
  }
  const check = $mpPlatform === "mp-baidu" || $mpPlatform === "mp-toutiao";
  const doSetByRefs = (refs) => {
    if (refs.length === 0) {
      return [];
    }
    const mpComponents = (
      // 字节小程序 selectAllComponents 可能返回 null
      // https://github.com/dcloudio/uni-app/issues/3954
      ($scope.selectAllComponents(".r") || []).concat(
        $scope.selectAllComponents(".r-i-f") || []
      )
    );
    return refs.filter((templateRef) => {
      const refValue = findComponentPublicInstance(mpComponents, templateRef.i);
      if (check && refValue === null) {
        return true;
      }
      setTemplateRef(templateRef, refValue, setupState);
      return false;
    });
  };
  const doSet = () => {
    if ($templateRefs) {
      const refs = doSetByRefs($templateRefs);
      if (refs.length && instance.proxy && instance.proxy.$scope) {
        instance.proxy.$scope.setData({ r1: 1 }, () => {
          doSetByRefs(refs);
        });
      }
    }
  };
  if ($mpPlatform !== "mp-alipay") {
    if ($scope._$setRef) {
      $scope._$setRef(doSet);
    } else {
      nextTick(instance, doSet);
    }
  }
  if ($templateUniElementRefs && $templateUniElementRefs.length) {
    nextTick(instance, () => {
      $templateUniElementRefs.forEach((templateRef) => {
        if (isArray$1(templateRef.v)) {
          templateRef.v.forEach((v2) => {
            setTemplateRef(templateRef, v2, setupState);
          });
        } else {
          setTemplateRef(templateRef, templateRef.v, setupState);
        }
      });
    });
  }
}
function toSkip(value) {
  if (isObject$2(value)) {
    markRaw(value);
  }
  return value;
}
function findComponentPublicInstance(mpComponents, id) {
  const mpInstance = mpComponents.find(
    (com) => com && (com.properties || com.props).uI === id
  );
  if (mpInstance) {
    const vm = mpInstance.$vm;
    if (vm) {
      return getExposeProxy(vm.$) || vm;
    }
    return toSkip(mpInstance);
  }
  return null;
}
function setTemplateRef({ r: r2, f: f2 }, refValue, setupState) {
  if (isFunction(r2)) {
    r2(refValue, {});
  } else {
    const _isString = isString(r2);
    const _isRef = isRef(r2);
    if (_isString || _isRef) {
      if (f2) {
        if (!_isRef) {
          return;
        }
        if (!isArray$1(r2.value)) {
          r2.value = [];
        }
        const existing = r2.value;
        if (existing.indexOf(refValue) === -1) {
          existing.push(refValue);
          if (!refValue) {
            return;
          }
          if (refValue.$) {
            onBeforeUnmount(() => remove(existing, refValue), refValue.$);
          }
        }
      } else if (_isString) {
        if (hasOwn$1(setupState, r2)) {
          setupState[r2] = refValue;
        }
      } else if (isRef(r2)) {
        r2.value = refValue;
      } else {
        warnRef(r2);
      }
    } else {
      warnRef(r2);
    }
  }
}
function warnRef(ref2) {
  warn("Invalid template ref type:", ref2, `(${typeof ref2})`);
}
const queuePostRenderEffect = queuePostFlushCb;
function mountComponent(initialVNode, options) {
  const instance = initialVNode.component = createComponentInstance(initialVNode, options.parentComponent, null);
  instance.renderer = options.mpType ? options.mpType : "component";
  {
    instance.ctx.$onApplyOptions = onApplyOptions;
    instance.ctx.$children = [];
  }
  if (options.mpType === "app") {
    instance.render = NOOP;
  }
  if (options.onBeforeSetup) {
    options.onBeforeSetup(instance, options);
  }
  {
    pushWarningContext(initialVNode);
    startMeasure(instance, `mount`);
  }
  {
    startMeasure(instance, `init`);
  }
  setupComponent(instance);
  {
    endMeasure(instance, `init`);
  }
  {
    if (options.parentComponent && instance.proxy) {
      options.parentComponent.ctx.$children.push(getExposeProxy(instance) || instance.proxy);
    }
  }
  setupRenderEffect(instance);
  {
    popWarningContext();
    endMeasure(instance, `mount`);
  }
  return instance.proxy;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
function clearTemplateRefs(templateRefs) {
  if (!templateRefs) {
    return [];
  }
  return templateRefs.filter((templateRef) => {
    const v2 = templateRef.v;
    if (v2 && typeof v2 === "object" && ["UNI-LOADING-ELEMENT", "UNI-CLOUD-DB-ELEMENT"].includes(v2.nodeName)) {
      return true;
    }
    return false;
  });
}
function renderComponentRoot(instance) {
  const {
    type: Component2,
    vnode,
    proxy,
    withProxy,
    props: props2,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    uid: uid2,
    appContext: {
      app: {
        config: {
          globalProperties: { pruneComponentPropsCache: pruneComponentPropsCache2 }
        }
      }
    },
    inheritAttrs
  } = instance;
  instance.$uniElementIds = /* @__PURE__ */ new Map();
  instance.$templateRefs = clearTemplateRefs(
    instance.$templateRefs || []
  );
  instance.$templateUniElementRefs = clearTemplateRefs(
    instance.$templateUniElementRefs || []
  );
  instance.$templateUniElementStyles = {};
  instance.$ei = 0;
  pruneComponentPropsCache2(uid2);
  instance.__counter = instance.__counter === 0 ? 1 : 0;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      fallthroughAttrs(inheritAttrs, props2, propsOptions, attrs);
      const proxyToUse = withProxy || proxy;
      result = render.call(
        proxyToUse,
        proxyToUse,
        renderCache,
        props2,
        setupState,
        data,
        ctx
      );
    } else {
      fallthroughAttrs(
        inheritAttrs,
        props2,
        propsOptions,
        Component2.props ? attrs : getFunctionalFallthrough(attrs)
      );
      const render2 = Component2;
      result = render2.length > 1 ? render2(props2, { attrs, slots, emit: emit2 }) : render2(
        props2,
        null
        /* we know it doesn't need it */
      );
    }
  } catch (err) {
    handleError(err, instance, 1);
    result = false;
  }
  setRef$1(instance);
  setCurrentRenderingInstance(prev);
  return result;
}
function fallthroughAttrs(inheritAttrs, props2, propsOptions, fallthroughAttrs2) {
  if (props2 && fallthroughAttrs2 && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs2).filter(
      (key) => key !== "class" && key !== "style"
    );
    if (!keys.length) {
      return;
    }
    if (propsOptions && keys.some(isModelListener)) {
      keys.forEach((key) => {
        if (!isModelListener(key) || !(key.slice(9) in propsOptions)) {
          props2[key] = fallthroughAttrs2[key];
        }
      });
    } else {
      keys.forEach((key) => props2[key] = fallthroughAttrs2[key]);
    }
  }
}
const updateComponentPreRender = (instance) => {
  pauseTracking();
  flushPreFlushCbs();
  resetTracking();
};
function componentUpdateScopedSlotsFn() {
  const scopedSlotsData = this.$scopedSlotsData;
  if (!scopedSlotsData || scopedSlotsData.length === 0) {
    return;
  }
  const mpInstance = this.ctx.$scope;
  const oldData = mpInstance.data;
  const diffData = /* @__PURE__ */ Object.create(null);
  scopedSlotsData.forEach(({ path, index: index2, data }) => {
    const oldScopedSlotData = getValueByDataPath(oldData, path);
    const diffPath = isString(index2) ? `${path}.${index2}` : `${path}[${index2}]`;
    if (typeof oldScopedSlotData === "undefined" || typeof oldScopedSlotData[index2] === "undefined") {
      diffData[diffPath] = data;
    } else {
      const diffScopedSlotData = diff(
        data,
        oldScopedSlotData[index2]
      );
      Object.keys(diffScopedSlotData).forEach((name) => {
        diffData[diffPath + "." + name] = diffScopedSlotData[name];
      });
    }
  });
  scopedSlotsData.length = 0;
  if (Object.keys(diffData).length) {
    mpInstance.setData(diffData);
  }
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function setupRenderEffect(instance) {
  const updateScopedSlots = componentUpdateScopedSlotsFn.bind(
    instance
  );
  instance.$updateScopedSlots = () => nextTick$1(() => queueJob(updateScopedSlots));
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      onBeforeUnmount(() => {
        setRef$1(instance, true);
      }, instance);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      {
        devtoolsComponentAdded(instance);
      }
    } else {
      const { next, bu, u: u2 } = instance;
      {
        pushWarningContext(next || instance.vnode);
      }
      toggleRecurse(instance, false);
      updateComponentPreRender();
      if (bu) {
        invokeArrayFns$1(bu);
      }
      toggleRecurse(instance, true);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      if (u2) {
        queuePostRenderEffect(u2);
      }
      {
        devtoolsComponentUpdated(instance);
      }
      {
        popWarningContext();
      }
    }
  };
  const effect2 = instance.effect = new ReactiveEffect(
    componentUpdateFn,
    NOOP,
    () => queueJob(update),
    instance.scope
    // track it in component's effect scope
  );
  const update = instance.update = () => {
    if (effect2.dirty) {
      effect2.run();
    }
  };
  update.id = instance.uid;
  toggleRecurse(instance, true);
  {
    effect2.onTrack = instance.rtc ? (e2) => invokeArrayFns$1(instance.rtc, e2) : void 0;
    effect2.onTrigger = instance.rtg ? (e2) => invokeArrayFns$1(instance.rtg, e2) : void 0;
    update.ownerInstance = instance;
  }
  {
    update();
  }
}
function unmountComponent(instance) {
  const { bum, scope, update, um } = instance;
  if (bum) {
    invokeArrayFns$1(bum);
  }
  {
    const parentInstance = instance.parent;
    if (parentInstance) {
      const $children = parentInstance.ctx.$children;
      const target = getExposeProxy(instance) || instance.proxy;
      const index2 = $children.indexOf(target);
      if (index2 > -1) {
        $children.splice(index2, 1);
      }
    }
  }
  scope.stop();
  if (update) {
    update.active = false;
  }
  if (um) {
    queuePostRenderEffect(um);
  }
  queuePostRenderEffect(() => {
    instance.isUnmounted = true;
  });
  {
    devtoolsComponentRemoved(instance);
  }
}
const oldCreateApp = createAppAPI();
function getTarget() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof my !== "undefined") {
    return my;
  }
}
function createVueApp(rootComponent, rootProps = null) {
  const target = getTarget();
  target.__VUE__ = true;
  {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const app = oldCreateApp(rootComponent, rootProps);
  const appContext = app._context;
  initAppConfig(appContext.config);
  const createVNode2 = (initialVNode) => {
    initialVNode.appContext = appContext;
    initialVNode.shapeFlag = 6;
    return initialVNode;
  };
  const createComponent2 = function createComponent22(initialVNode, options) {
    return mountComponent(createVNode2(initialVNode), options);
  };
  const destroyComponent = function destroyComponent2(component) {
    return component && unmountComponent(component.$);
  };
  app.mount = function mount() {
    rootComponent.render = NOOP;
    const instance = mountComponent(
      createVNode2({ type: rootComponent }),
      {
        mpType: "app",
        mpInstance: null,
        parentComponent: null,
        slots: [],
        props: null
      }
    );
    app._instance = instance.$;
    {
      devtoolsInitApp(app, version$1);
    }
    instance.$app = app;
    instance.$createComponent = createComponent2;
    instance.$destroyComponent = destroyComponent;
    appContext.$appInstance = instance;
    return instance;
  };
  app.unmount = function unmount() {
    warn(`Cannot unmount an app.`);
  };
  return app;
}
function injectLifecycleHook(name, hook, publicThis, instance) {
  if (isFunction(hook)) {
    injectHook(name, hook.bind(publicThis), instance);
  }
}
function initHooks$1(options, instance, publicThis) {
  const mpType = options.mpType || publicThis.$mpType;
  if (!mpType || mpType === "component" || // instance.renderer 标识页面是否作为组件渲染
  mpType === "page" && instance.renderer === "component") {
    return;
  }
  Object.keys(options).forEach((name) => {
    if (isUniLifecycleHook(name, options[name], false)) {
      const hooks = options[name];
      if (isArray$1(hooks)) {
        hooks.forEach((hook) => injectLifecycleHook(name, hook, publicThis, instance));
      } else {
        injectLifecycleHook(name, hooks, publicThis, instance);
      }
    }
  });
}
function applyOptions$2(options, instance, publicThis) {
  initHooks$1(options, instance, publicThis);
}
function set(target, key, val) {
  return target[key] = val;
}
function $callMethod(method, ...args) {
  const fn2 = this[method];
  if (fn2) {
    return fn2(...args);
  }
  console.error(`method ${method} not found`);
  return null;
}
function createErrorHandler(app) {
  const userErrorHandler = app.config.errorHandler;
  return function errorHandler(err, instance, info) {
    if (userErrorHandler) {
      userErrorHandler(err, instance, info);
    }
    const appInstance = app._instance;
    if (!appInstance || !appInstance.proxy) {
      throw err;
    }
    if (appInstance[ON_ERROR]) {
      {
        appInstance.proxy.$callHook(ON_ERROR, err);
      }
    } else {
      logError(err, info, instance ? instance.$.vnode : null, false);
    }
  };
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function initOptionMergeStrategies(optionMergeStrategies) {
  UniLifecycleHooks.forEach((name) => {
    optionMergeStrategies[name] = mergeAsArray;
  });
}
let realAtob;
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== "function") {
  realAtob = function(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    str += "==".slice(2 - (str.length & 3));
    var bitmap;
    var result = "";
    var r1;
    var r2;
    var i2 = 0;
    for (; i2 < str.length; ) {
      bitmap = b64.indexOf(str.charAt(i2++)) << 18 | b64.indexOf(str.charAt(i2++)) << 12 | (r1 = b64.indexOf(str.charAt(i2++))) << 6 | (r2 = b64.indexOf(str.charAt(i2++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split("").map(function(c2) {
    return "%" + ("00" + c2.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function getCurrentUserInfo() {
  const token = index$1.getStorageSync("uni_id_token") || "";
  const tokenArr = token.split(".");
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  let userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error2) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + error2.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1e3;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(globalProperties) {
  globalProperties.uniIDHasRole = function(roleId) {
    const { role } = getCurrentUserInfo();
    return role.indexOf(roleId) > -1;
  };
  globalProperties.uniIDHasPermission = function(permissionId) {
    const { permission } = getCurrentUserInfo();
    return this.uniIDHasRole("admin") || permission.indexOf(permissionId) > -1;
  };
  globalProperties.uniIDTokenValid = function() {
    const { tokenExpired } = getCurrentUserInfo();
    return tokenExpired > Date.now();
  };
}
function initApp(app) {
  const appConfig = app.config;
  appConfig.errorHandler = invokeCreateErrorHandler(app, createErrorHandler);
  initOptionMergeStrategies(appConfig.optionMergeStrategies);
  const globalProperties = appConfig.globalProperties;
  {
    uniIdMixin(globalProperties);
  }
  {
    globalProperties.$set = set;
    globalProperties.$applyOptions = applyOptions$2;
    globalProperties.$callMethod = $callMethod;
  }
  {
    index$1.invokeCreateVueAppHook(app);
  }
}
const propsCaches = /* @__PURE__ */ Object.create(null);
function renderProps(props2) {
  const { uid: uid2, __counter } = getCurrentInstance();
  const propsId = (propsCaches[uid2] || (propsCaches[uid2] = [])).push(guardReactiveProps(props2)) - 1;
  return uid2 + "," + propsId + "," + __counter;
}
function pruneComponentPropsCache(uid2) {
  delete propsCaches[uid2];
}
function findComponentPropsData(up) {
  if (!up) {
    return;
  }
  const [uid2, propsId] = up.split(",");
  if (!propsCaches[uid2]) {
    return;
  }
  return propsCaches[uid2][parseInt(propsId)];
}
var plugin = {
  install(app) {
    initApp(app);
    app.config.globalProperties.pruneComponentPropsCache = pruneComponentPropsCache;
    const oldMount = app.mount;
    app.mount = function mount(rootContainer) {
      const instance = oldMount.call(app, rootContainer);
      const createApp2 = getCreateApp();
      if (createApp2) {
        createApp2(instance);
      } else {
        if (typeof createMiniProgramApp !== "undefined") {
          createMiniProgramApp(instance);
        }
      }
      return instance;
    };
  }
};
function getCreateApp() {
  const method = "createApp";
  if (typeof global !== "undefined" && typeof global[method] !== "undefined") {
    return global[method];
  } else if (typeof my !== "undefined") {
    return my[method];
  }
}
function stringifyStyle(value) {
  if (isString(value)) {
    return value;
  }
  return stringify(normalizeStyle(value));
}
function stringify(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key in styles) {
    ret += `${key.startsWith(`--`) ? key : hyphenate(key)}:${styles[key]};`;
  }
  return ret;
}
function vOn(value, key) {
  const instance = getCurrentInstance();
  const ctx = instance.ctx;
  const extraKey = typeof key !== "undefined" && (ctx.$mpPlatform === "mp-weixin" || ctx.$mpPlatform === "mp-qq" || ctx.$mpPlatform === "mp-xhs") && (isString(key) || typeof key === "number") ? "_" + key : "";
  const name = "e" + instance.$ei++ + extraKey;
  const mpInstance = ctx.$scope;
  if (!value) {
    delete mpInstance[name];
    return name;
  }
  const existingInvoker = mpInstance[name];
  if (existingInvoker) {
    existingInvoker.value = value;
  } else {
    mpInstance[name] = createInvoker(value, instance);
  }
  return name;
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    patchMPEvent(e2);
    let args = [e2];
    if (instance && instance.ctx.$getTriggerEventDetail) {
      if (typeof e2.detail === "number") {
        e2.detail = instance.ctx.$getTriggerEventDetail(e2.detail);
      }
    }
    if (e2.detail && e2.detail.__args__) {
      args = e2.detail.__args__;
    }
    const eventValue = invoker.value;
    const invoke = () => callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, eventValue), instance, 5, args);
    const eventTarget = e2.target;
    const eventSync = eventTarget ? eventTarget.dataset ? String(eventTarget.dataset.eventsync) === "true" : false : false;
    if (bubbles.includes(e2.type) && !eventSync) {
      setTimeout(invoke);
    } else {
      const res = invoke();
      if (e2.type === "input" && (isArray$1(res) || isPromise(res))) {
        return;
      }
      return res;
    }
  };
  invoker.value = initialValue;
  return invoker;
}
const bubbles = [
  // touch事件暂不做延迟，否则在 Android 上会影响性能，比如一些拖拽跟手手势等
  // 'touchstart',
  // 'touchmove',
  // 'touchcancel',
  // 'touchend',
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];
function patchMPEvent(event, instance) {
  if (event.type && event.target) {
    event.preventDefault = NOOP;
    event.stopPropagation = NOOP;
    event.stopImmediatePropagation = NOOP;
    if (!hasOwn$1(event, "detail")) {
      event.detail = {};
    }
    if (hasOwn$1(event, "markerId")) {
      event.detail = typeof event.detail === "object" ? event.detail : {};
      event.detail.markerId = event.markerId;
    }
    if (isPlainObject$1(event.detail) && hasOwn$1(event.detail, "checked") && !hasOwn$1(event.detail, "value")) {
      event.detail.value = event.detail.checked;
    }
    if (isPlainObject$1(event.detail)) {
      event.target = extend({}, event.target, event.detail);
    }
  }
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray$1(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop && originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn2) => (e3) => !e3._stopped && fn2(e3));
  } else {
    return value;
  }
}
function vFor(source, renderItem) {
  let ret;
  if (isArray$1(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i2 = 0, l2 = source.length; i2 < l2; i2++) {
      ret[i2] = renderItem(source[i2], i2, i2);
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }
    ret = new Array(source);
    for (let i2 = 0; i2 < source; i2++) {
      ret[i2] = renderItem(i2 + 1, i2, i2);
    }
  } else if (isObject$2(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i2) => renderItem(item, i2, i2));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
        const key = keys[i2];
        ret[i2] = renderItem(source[key], key, i2);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function setRef(ref2, id, opts = {}) {
  const { $templateRefs } = getCurrentInstance();
  $templateRefs.push({ i: id, r: ref2, k: opts.k, f: opts.f });
}
const o$1 = (value, key) => vOn(value, key);
const f$1 = (source, renderItem) => vFor(source, renderItem);
const s$1 = (value) => stringifyStyle(value);
const e = (target, ...sources) => extend(target, ...sources);
const n$1 = (value) => normalizeClass(value);
const t$2 = (val) => toDisplayString(val);
const p$1 = (props2) => renderProps(props2);
const sr$1 = (ref2, id, opts) => setRef(ref2, id, opts);
function createApp$1(rootComponent, rootProps = null) {
  rootComponent && (rootComponent.mpType = "app");
  return createVueApp(rootComponent, rootProps).use(plugin);
}
const createSSRApp = createApp$1;
function getLocaleLanguage$1() {
  var _a;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a = wx.getAppBaseInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
function validateProtocolFail(name, msg) {
  console.warn(`${name}: ${msg}`);
}
function validateProtocol(name, data, protocol, onFail) {
  if (!onFail) {
    onFail = validateProtocolFail;
  }
  for (const key in protocol) {
    const errMsg = validateProp(key, data[key], protocol[key], !hasOwn$1(data, key));
    if (isString(errMsg)) {
      onFail(name, errMsg);
    }
  }
}
function validateProtocols(name, args, protocol, onFail) {
  if (!protocol) {
    return;
  }
  if (!isArray$1(protocol)) {
    return validateProtocol(name, args[0] || /* @__PURE__ */ Object.create(null), protocol, onFail);
  }
  const len = protocol.length;
  const argsLen = args.length;
  for (let i2 = 0; i2 < len; i2++) {
    const opts = protocol[i2];
    const data = /* @__PURE__ */ Object.create(null);
    if (argsLen > i2) {
      data[opts.name] = args[i2];
    }
    validateProtocol(name, data, { [opts.name]: opts }, onFail);
  }
}
function validateProp(name, value, prop, isAbsent) {
  if (!isPlainObject$1(prop)) {
    prop = { type: prop };
  }
  const { type, required, validator } = prop;
  if (required && isAbsent) {
    return 'Missing required args: "' + name + '"';
  }
  if (value == null && !required) {
    return;
  }
  if (type != null) {
    let isValid = false;
    const types = isArray$1(type) ? type : [type];
    const expectedTypes = [];
    for (let i2 = 0; i2 < types.length && !isValid; i2++) {
      const { valid, expectedType } = assertType(value, types[i2]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      return getInvalidTypeMessage(name, value, expectedTypes);
    }
  }
  if (validator) {
    return validator(value);
  }
}
const isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
function assertType(value, type) {
  let valid;
  const expectedType = getType(type);
  if (isSimpleType(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$2(value);
  } else if (expectedType === "Array") {
    valid = isArray$1(value);
  } else {
    {
      valid = value instanceof type;
    }
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  let message = `Invalid args: type check failed for args "${name}". Expected ${expectedTypes.map(capitalize).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function tryCatch(fn2) {
  return function() {
    try {
      return fn2.apply(fn2, arguments);
    } catch (e2) {
      console.error(e2);
    }
  };
}
let invokeCallbackId = 1;
const invokeCallbacks = {};
function addInvokeCallback(id, name, callback, keepAlive = false) {
  invokeCallbacks[id] = {
    name,
    keepAlive,
    callback
  };
  return id;
}
function invokeCallback(id, res, extras) {
  if (typeof id === "number") {
    const opts = invokeCallbacks[id];
    if (opts) {
      if (!opts.keepAlive) {
        delete invokeCallbacks[id];
      }
      return opts.callback(res, extras);
    }
  }
  return res;
}
const API_SUCCESS = "success";
const API_FAIL = "fail";
const API_COMPLETE = "complete";
function getApiCallbacks(args) {
  const apiCallbacks = {};
  for (const name in args) {
    const fn2 = args[name];
    if (isFunction(fn2)) {
      apiCallbacks[name] = tryCatch(fn2);
      delete args[name];
    }
  }
  return apiCallbacks;
}
function normalizeErrMsg(errMsg, name) {
  if (!errMsg || errMsg.indexOf(":fail") === -1) {
    return name + ":ok";
  }
  return name + errMsg.substring(errMsg.indexOf(":fail"));
}
function createAsyncApiCallback(name, args = {}, { beforeAll, beforeSuccess } = {}) {
  if (!isPlainObject$1(args)) {
    args = {};
  }
  const { success, fail, complete } = getApiCallbacks(args);
  const hasSuccess = isFunction(success);
  const hasFail = isFunction(fail);
  const hasComplete = isFunction(complete);
  const callbackId = invokeCallbackId++;
  addInvokeCallback(callbackId, name, (res) => {
    res = res || {};
    res.errMsg = normalizeErrMsg(res.errMsg, name);
    isFunction(beforeAll) && beforeAll(res);
    if (res.errMsg === name + ":ok") {
      isFunction(beforeSuccess) && beforeSuccess(res, args);
      hasSuccess && success(res);
    } else {
      hasFail && fail(res);
    }
    hasComplete && complete(res);
  });
  return callbackId;
}
const HOOK_SUCCESS = "success";
const HOOK_FAIL = "fail";
const HOOK_COMPLETE = "complete";
const globalInterceptors = {};
const scopedInterceptors = {};
function wrapperHook(hook, params2) {
  return function(data) {
    return hook(data, params2) || data;
  };
}
function queue(hooks, data, params2) {
  let promise2 = false;
  for (let i2 = 0; i2 < hooks.length; i2++) {
    const hook = hooks[i2];
    if (promise2) {
      promise2 = Promise.resolve(wrapperHook(hook, params2));
    } else {
      const res = hook(data, params2);
      if (isPromise(res)) {
        promise2 = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() {
          },
          catch() {
          }
        };
      }
    }
  }
  return promise2 || {
    then(callback) {
      return callback(data);
    },
    catch() {
    }
  };
}
function wrapperOptions(interceptors2, options = {}) {
  [HOOK_SUCCESS, HOOK_FAIL, HOOK_COMPLETE].forEach((name) => {
    const hooks = interceptors2[name];
    if (!isArray$1(hooks)) {
      return;
    }
    const oldCallback = options[name];
    options[name] = function callbackInterceptor(res) {
      queue(hooks, res, options).then((res2) => {
        return isFunction(oldCallback) && oldCallback(res2) || res2;
      });
    };
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  const returnValueHooks = [];
  if (isArray$1(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method];
  if (interceptor && isArray$1(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach((hook) => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  const interceptor = /* @__PURE__ */ Object.create(null);
  Object.keys(globalInterceptors).forEach((hook) => {
    if (hook !== "returnValue") {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach((hook) => {
      if (hook !== "returnValue") {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options, params2) {
  const interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (isArray$1(interceptor.invoke)) {
      const res = queue(interceptor.invoke, options);
      return res.then((options2) => {
        return api(wrapperOptions(getApiInterceptorHooks(method), options2), ...params2);
      });
    } else {
      return api(wrapperOptions(interceptor, options), ...params2);
    }
  }
  return api(options, ...params2);
}
function hasCallback(args) {
  if (isPlainObject$1(args) && [API_SUCCESS, API_FAIL, API_COMPLETE].find((cb) => isFunction(args[cb]))) {
    return true;
  }
  return false;
}
function handlePromise(promise2) {
  return promise2;
}
function promisify$1(name, fn2) {
  return (args = {}, ...rest) => {
    if (hasCallback(args)) {
      return wrapperReturnValue(name, invokeApi(name, fn2, extend({}, args), rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, fn2, extend({}, args, { success: resolve2, fail: reject }), rest);
    })));
  };
}
function formatApiArgs(args, options) {
  args[0];
  {
    return;
  }
}
function invokeSuccess(id, name, res) {
  const result = {
    errMsg: name + ":ok"
  };
  return invokeCallback(id, extend(res || {}, result));
}
function invokeFail(id, name, errMsg, errRes = {}) {
  const errMsgPrefix = name + ":fail";
  let apiErrMsg = "";
  if (!errMsg) {
    apiErrMsg = errMsgPrefix;
  } else if (errMsg.indexOf(errMsgPrefix) === 0) {
    apiErrMsg = errMsg;
  } else {
    apiErrMsg = errMsgPrefix + " " + errMsg;
  }
  {
    delete errRes.errCode;
  }
  let res = extend({ errMsg: apiErrMsg }, errRes);
  return invokeCallback(id, res);
}
function beforeInvokeApi(name, args, protocol, options) {
  {
    validateProtocols(name, args, protocol);
  }
  const errMsg = formatApiArgs(args);
  if (errMsg) {
    return errMsg;
  }
}
function parseErrMsg(errMsg) {
  if (!errMsg || isString(errMsg)) {
    return errMsg;
  }
  if (errMsg.stack) {
    if (typeof globalThis === "undefined" || !globalThis.harmonyChannel) {
      console.error(errMsg.message + "\n" + errMsg.stack);
    }
    return errMsg.message;
  }
  return errMsg;
}
function wrapperTaskApi(name, fn2, protocol, options) {
  return (args) => {
    const id = createAsyncApiCallback(name, args, options);
    const errMsg = beforeInvokeApi(name, [args], protocol);
    if (errMsg) {
      return invokeFail(id, name, errMsg);
    }
    return fn2(args, {
      resolve: (res) => invokeSuccess(id, name, res),
      reject: (errMsg2, errRes) => invokeFail(id, name, parseErrMsg(errMsg2), errRes)
    });
  };
}
function wrapperSyncApi(name, fn2, protocol, options) {
  return (...args) => {
    const errMsg = beforeInvokeApi(name, args, protocol);
    if (errMsg) {
      throw new Error(errMsg);
    }
    return fn2.apply(null, args);
  };
}
function wrapperAsyncApi(name, fn2, protocol, options) {
  return wrapperTaskApi(name, fn2, protocol, options);
}
function defineSyncApi(name, fn2, protocol, options) {
  return wrapperSyncApi(name, fn2, protocol);
}
function defineAsyncApi(name, fn2, protocol, options) {
  return promisify$1(name, wrapperAsyncApi(name, fn2, protocol, options));
}
const API_UPX2PX = "upx2px";
const Upx2pxProtocol = [
  {
    name: "upx",
    type: [Number, String],
    required: true
  }
];
const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;
function checkDeviceWidth() {
  var _a, _b;
  let windowWidth, pixelRatio, platform2;
  {
    const windowInfo = ((_a = wx.getWindowInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const deviceInfo = ((_b = wx.getDeviceInfo) === null || _b === void 0 ? void 0 : _b.call(wx)) || wx.getSystemInfoSync();
    windowWidth = windowInfo.windowWidth;
    pixelRatio = windowInfo.pixelRatio;
    platform2 = deviceInfo.platform;
  }
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform2 === "ios";
}
const upx2px = defineSyncApi(API_UPX2PX, (number2, newDeviceWidth) => {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number2 = Number(number2);
  if (number2 === 0) {
    return 0;
  }
  let width = newDeviceWidth || deviceWidth;
  let result = number2 / BASE_DEVICE_WIDTH * width;
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number2 < 0 ? -result : result;
}, Upx2pxProtocol);
function __f__(type, filename, ...args) {
  if (filename) {
    args.push(filename);
  }
  console[type].apply(console, args);
}
const API_ADD_INTERCEPTOR = "addInterceptor";
const API_REMOVE_INTERCEPTOR = "removeInterceptor";
const AddInterceptorProtocol = [
  {
    name: "method",
    type: [String, Object],
    required: true
  }
];
const RemoveInterceptorProtocol = AddInterceptorProtocol;
function mergeInterceptorHook(interceptors2, interceptor) {
  Object.keys(interceptor).forEach((hook) => {
    if (isFunction(interceptor[hook])) {
      interceptors2[hook] = mergeHook(interceptors2[hook], interceptor[hook]);
    }
  });
}
function removeInterceptorHook(interceptors2, interceptor) {
  if (!interceptors2 || !interceptor) {
    return;
  }
  Object.keys(interceptor).forEach((name) => {
    const hooks = interceptors2[name];
    const hook = interceptor[name];
    if (isArray$1(hooks) && isFunction(hook)) {
      remove(hooks, hook);
    }
  });
}
function mergeHook(parentVal, childVal) {
  const res = childVal ? parentVal ? parentVal.concat(childVal) : isArray$1(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  const res = [];
  for (let i2 = 0; i2 < hooks.length; i2++) {
    if (res.indexOf(hooks[i2]) === -1) {
      res.push(hooks[i2]);
    }
  }
  return res;
}
const addInterceptor = defineSyncApi(API_ADD_INTERCEPTOR, (method, interceptor) => {
  if (isString(method) && isPlainObject$1(interceptor)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), interceptor);
  } else if (isPlainObject$1(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}, AddInterceptorProtocol);
const removeInterceptor = defineSyncApi(API_REMOVE_INTERCEPTOR, (method, interceptor) => {
  if (isString(method)) {
    if (isPlainObject$1(interceptor)) {
      removeInterceptorHook(scopedInterceptors[method], interceptor);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject$1(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}, RemoveInterceptorProtocol);
const interceptors = {};
const API_ON = "$on";
const OnProtocol = [
  {
    name: "event",
    type: String,
    required: true
  },
  {
    name: "callback",
    type: Function,
    required: true
  }
];
const API_ONCE = "$once";
const OnceProtocol = OnProtocol;
const API_OFF = "$off";
const OffProtocol = [
  {
    name: "event",
    type: [String, Array]
  },
  {
    name: "callback",
    type: [Function, Number]
  }
];
const API_EMIT = "$emit";
const EmitProtocol = [
  {
    name: "event",
    type: String,
    required: true
  }
];
class EventBus {
  constructor() {
    this.$emitter = new E$1$1();
  }
  on(name, callback) {
    return this.$emitter.on(name, callback);
  }
  once(name, callback) {
    return this.$emitter.once(name, callback);
  }
  off(name, callback) {
    if (!name) {
      this.$emitter.e = {};
      return;
    }
    this.$emitter.off(name, callback);
  }
  emit(name, ...args) {
    this.$emitter.emit(name, ...args);
  }
}
const eventBus = new EventBus();
const $on = defineSyncApi(API_ON, (name, callback) => {
  eventBus.on(name, callback);
  return () => eventBus.off(name, callback);
}, OnProtocol);
const $once = defineSyncApi(API_ONCE, (name, callback) => {
  eventBus.once(name, callback);
  return () => eventBus.off(name, callback);
}, OnceProtocol);
const $off = defineSyncApi(API_OFF, (name, callback) => {
  if (!isArray$1(name))
    name = name ? [name] : [];
  name.forEach((n2) => {
    eventBus.off(n2, callback);
  });
}, OffProtocol);
const $emit = defineSyncApi(API_EMIT, (name, ...args) => {
  eventBus.emit(name, ...args);
}, EmitProtocol);
let cid;
let cidErrMsg;
let enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e2) {
  }
  return message;
}
function invokePushCallback(args) {
  if (args.type === "enabled") {
    enabled = true;
  } else if (args.type === "clientId") {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === "pushMsg") {
    const message = {
      type: "receive",
      data: normalizePushMessage(args.message)
    };
    for (let i2 = 0; i2 < onPushMessageCallbacks.length; i2++) {
      const callback = onPushMessageCallbacks[i2];
      callback(message);
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === "click") {
    onPushMessageCallbacks.forEach((callback) => {
      callback({
        type: "click",
        data: normalizePushMessage(args.message)
      });
    });
  }
}
const getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid2, errMsg) {
  getPushCidCallbacks.forEach((callback) => {
    callback(cid2, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
const API_GET_PUSH_CLIENT_ID = "getPushClientId";
const getPushClientId = defineAsyncApi(API_GET_PUSH_CLIENT_ID, (_2, { resolve: resolve2, reject }) => {
  Promise.resolve().then(() => {
    if (typeof enabled === "undefined") {
      enabled = false;
      cid = "";
      cidErrMsg = "uniPush is not enabled";
    }
    getPushCidCallbacks.push((cid2, errMsg) => {
      if (cid2) {
        resolve2({ cid: cid2 });
      } else {
        reject(errMsg);
      }
    });
    if (typeof cid !== "undefined") {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
});
const onPushMessageCallbacks = [];
const onPushMessage = (fn2) => {
  if (onPushMessageCallbacks.indexOf(fn2) === -1) {
    onPushMessageCallbacks.push(fn2);
  }
};
const offPushMessage = (fn2) => {
  if (!fn2) {
    onPushMessageCallbacks.length = 0;
  } else {
    const index2 = onPushMessageCallbacks.indexOf(fn2);
    if (index2 > -1) {
      onPushMessageCallbacks.splice(index2, 1);
    }
  }
};
const SYNC_API_RE = /^\$|__f__|getLocale|setLocale|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|rpx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getDeviceInfo|getAppBaseInfo|getWindowInfo|getSystemSetting|getAppAuthorizeSetting/;
const CONTEXT_API_RE = /^create|Manager$/;
const CONTEXT_API_RE_EXC = ["createBLEConnection"];
const TASK_APIS = ["request", "downloadFile", "uploadFile", "connectSocket"];
const ASYNC_API = ["createBLEConnection"];
const CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== "onPush";
}
function isTaskApi(name) {
  return TASK_APIS.indexOf(name) !== -1;
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(onfinally) {
    const promise2 = this.constructor;
    return this.then((value) => promise2.resolve(onfinally && onfinally()).then(() => value), (reason) => promise2.resolve(onfinally && onfinally()).then(() => {
      throw reason;
    }));
  };
}
function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  if (!isFunction(api)) {
    return api;
  }
  return function promiseApi(options = {}, ...rest) {
    if (isFunction(options.success) || isFunction(options.fail) || isFunction(options.complete)) {
      return wrapperReturnValue(name, invokeApi(name, api, extend({}, options), rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, api, extend({}, options, {
        success: resolve2,
        fail: reject
      }), rest);
    })));
  };
}
const CALLBACKS = ["success", "fail", "cancel", "complete"];
function initWrapper(protocols2) {
  function processCallback(methodName, method, returnValue) {
    return function(res) {
      return method(processReturnValue(methodName, res, returnValue));
    };
  }
  function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
    if (isPlainObject$1(fromArgs)) {
      const toArgs = keepFromArgs === true ? fromArgs : {};
      if (isFunction(argsOption)) {
        argsOption = argsOption(fromArgs, toArgs) || {};
      }
      for (const key in fromArgs) {
        if (hasOwn$1(argsOption, key)) {
          let keyOption = argsOption[key];
          if (isFunction(keyOption)) {
            keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
          }
          if (!keyOption) {
            console.warn(`微信小程序 ${methodName} 暂不支持 ${key}`);
          } else if (isString(keyOption)) {
            toArgs[keyOption] = fromArgs[key];
          } else if (isPlainObject$1(keyOption)) {
            toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
          }
        } else if (CALLBACKS.indexOf(key) !== -1) {
          const callback = fromArgs[key];
          if (isFunction(callback)) {
            toArgs[key] = processCallback(methodName, callback, returnValue);
          }
        } else {
          if (!keepFromArgs && !hasOwn$1(toArgs, key)) {
            toArgs[key] = fromArgs[key];
          }
        }
      }
      return toArgs;
    } else if (isFunction(fromArgs)) {
      if (isFunction(argsOption)) {
        argsOption(fromArgs, {});
      }
      fromArgs = processCallback(methodName, fromArgs, returnValue);
    }
    return fromArgs;
  }
  function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
    if (isFunction(protocols2.returnValue)) {
      res = protocols2.returnValue(methodName, res);
    }
    const realKeepReturnValue = keepReturnValue || false;
    return processArgs(methodName, res, returnValue, {}, realKeepReturnValue);
  }
  return function wrapper(methodName, method) {
    const hasProtocol = hasOwn$1(protocols2, methodName);
    if (!hasProtocol && typeof wx[methodName] !== "function") {
      return method;
    }
    const needWrapper = hasProtocol || isFunction(protocols2.returnValue) || isContextApi(methodName) || isTaskApi(methodName);
    const hasMethod = hasProtocol || isFunction(method);
    if (!hasProtocol && !method) {
      return function() {
        console.error(`微信小程序 暂不支持${methodName}`);
      };
    }
    if (!needWrapper || !hasMethod) {
      return method;
    }
    const protocol = protocols2[methodName];
    return function(arg1, arg2) {
      let options = protocol || {};
      if (isFunction(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      const args = [arg1];
      if (typeof arg2 !== "undefined") {
        args.push(arg2);
      }
      const returnValue = wx[options.name || methodName].apply(wx, args);
      if (isContextApi(methodName) || isTaskApi(methodName)) {
        if (returnValue && !returnValue.__v_skip) {
          returnValue.__v_skip = true;
        }
      }
      if (isSyncApi(methodName)) {
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  };
}
const getLocale = () => {
  const app = isFunction(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm) {
    return app.$vm.$locale;
  }
  return getLocaleLanguage$1();
};
const setLocale = (locale) => {
  const app = isFunction(getApp) && getApp();
  if (!app) {
    return false;
  }
  const oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach((fn2) => fn2({ locale }));
    return true;
  }
  return false;
};
const onLocaleChangeCallbacks = [];
const onLocaleChange = (fn2) => {
  if (onLocaleChangeCallbacks.indexOf(fn2) === -1) {
    onLocaleChangeCallbacks.push(fn2);
  }
};
if (typeof global !== "undefined") {
  global.getLocale = getLocale;
}
const UUID_KEY = "__DC_STAT_UUID";
let deviceId;
function useDeviceId(global2 = wx) {
  return function addDeviceId(_2, toRes) {
    deviceId = deviceId || global2.getStorageSync(UUID_KEY);
    if (!deviceId) {
      deviceId = Date.now() + "" + Math.floor(Math.random() * 1e7);
      wx.setStorage({
        key: UUID_KEY,
        data: deviceId
      });
    }
    toRes.deviceId = deviceId;
  };
}
function addSafeAreaInsets(fromRes, toRes) {
  if (fromRes.safeArea) {
    const safeArea = fromRes.safeArea;
    toRes.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: fromRes.windowWidth - safeArea.right,
      bottom: fromRes.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform2) {
  let osName = "";
  let osVersion = "";
  if (platform2 && false) {
    osName = platform2;
    osVersion = system;
  } else {
    osName = system.split(" ")[0] || platform2;
    osVersion = system.split(" ")[1] || "";
  }
  osName = osName.toLowerCase();
  switch (osName) {
    case "harmony":
    case "ohos":
    case "openharmony":
      osName = "harmonyos";
      break;
    case "iphone os":
      osName = "ios";
      break;
    case "mac":
    case "darwin":
      osName = "macos";
      break;
    case "windows_nt":
      osName = "windows";
      break;
  }
  return {
    osName,
    osVersion
  };
}
function populateParameters(fromRes, toRes) {
  const { brand = "", model = "", system = "", language = "", theme, version: version2, platform: platform2, fontSizeSetting, SDKVersion, pixelRatio, deviceOrientation } = fromRes;
  const { osName, osVersion } = getOSInfo(system, platform2);
  let hostVersion = version2;
  let deviceType = getGetDeviceType(fromRes, model);
  let deviceBrand = getDeviceBrand(brand);
  let _hostName = getHostName(fromRes);
  let _deviceOrientation = deviceOrientation;
  let _devicePixelRatio = pixelRatio;
  let _SDKVersion = SDKVersion;
  const hostLanguage = (language || "").replace(/_/g, "-");
  const parameters = {
    appId: "__UNI__3EC23B9",
    appName: "my-closet-app",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "5.07",
    uniCompilerVersion: "5.07",
    uniRuntimeVersion: "5.07",
    uniPlatform: "mp-weixin",
    deviceBrand,
    deviceModel: model,
    deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName,
    osVersion,
    hostTheme: theme,
    hostVersion,
    hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: void 0,
    osTheme: void 0,
    ua: void 0,
    hostPackageName: void 0,
    browserName: void 0,
    browserVersion: void 0,
    isUniAppX: false
  };
  extend(toRes, parameters);
}
function getGetDeviceType(fromRes, model) {
  let deviceType = fromRes.deviceType || "phone";
  {
    const deviceTypeMaps = {
      ipad: "pad",
      windows: "pc",
      mac: "pc"
    };
    const deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    const _model = model.toLowerCase();
    for (let index2 = 0; index2 < deviceTypeMapsKeys.length; index2++) {
      const _m = deviceTypeMapsKeys[index2];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  let deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = deviceBrand.toLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale ? getLocale() : defaultLanguage;
}
function getHostName(fromRes) {
  const _platform = "WeChat";
  let _hostName = fromRes.hostName || _platform;
  {
    if (fromRes.environment) {
      _hostName = fromRes.environment;
    } else if (fromRes.host && fromRes.host.env) {
      _hostName = fromRes.host.env;
    }
  }
  return _hostName;
}
const getSystemInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    useDeviceId()(fromRes, toRes);
    populateParameters(fromRes, toRes);
  }
};
const getSystemInfoSync = getSystemInfo;
const redirectTo = {};
const previewImage = {
  args(fromArgs, toArgs) {
    let currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    const urls = fromArgs.urls;
    if (!isArray$1(urls)) {
      return;
    }
    const len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      toArgs.current = urls[currentIndex];
      toArgs.urls = urls.filter((item, index2) => index2 < currentIndex ? item !== urls[currentIndex] : true);
    } else {
      toArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
const showActionSheet = {
  args(fromArgs, toArgs) {
    toArgs.alertText = fromArgs.title;
  }
};
const getDeviceInfo = {
  returnValue: (fromRes, toRes) => {
    const { brand, model, system = "", platform: platform2 = "" } = fromRes;
    let deviceType = getGetDeviceType(fromRes, model);
    let deviceBrand = getDeviceBrand(brand);
    useDeviceId()(fromRes, toRes);
    const { osName, osVersion } = getOSInfo(system, platform2);
    toRes = extend(toRes, {
      deviceType,
      deviceBrand,
      deviceModel: model,
      osName,
      osVersion
    });
  }
};
const getAppBaseInfo = {
  returnValue: (fromRes, toRes) => {
    const { version: version2, language, SDKVersion, theme } = fromRes;
    let _hostName = getHostName(fromRes);
    let hostLanguage = (language || "").replace(/_/g, "-");
    const parameters = {
      appId: "__UNI__3EC23B9",
      appName: "my-closet-app",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      hostVersion: version2,
      hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      isUniAppX: false,
      uniPlatform: "mp-weixin",
      uniCompileVersion: "5.07",
      uniCompilerVersion: "5.07",
      uniRuntimeVersion: "5.07"
    };
    extend(toRes, parameters);
  }
};
const getWindowInfo$1 = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    toRes = extend(toRes, {
      windowTop: 0,
      windowBottom: 0
    });
  }
};
const getAppAuthorizeSetting = {
  returnValue: function(fromRes, toRes) {
    const { locationReducedAccuracy } = fromRes;
    toRes.locationAccuracy = "unsupported";
    if (locationReducedAccuracy === true) {
      toRes.locationAccuracy = "reduced";
    } else if (locationReducedAccuracy === false) {
      toRes.locationAccuracy = "full";
    }
  }
};
const onError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        wx.$onErrorHandlers = [];
      }
      wx.$onErrorHandlers.push(fromArgs);
    } else {
      injectHook(ON_ERROR, fromArgs, app.$vm.$);
    }
  }
};
const offError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        return;
      }
      const index2 = wx.$onErrorHandlers.findIndex((fn2) => fn2 === fromArgs);
      if (index2 !== -1) {
        wx.$onErrorHandlers.splice(index2, 1);
      }
    } else if (fromArgs.__weh) {
      const onErrors = app.$vm.$[ON_ERROR];
      if (onErrors) {
        const index2 = onErrors.indexOf(fromArgs.__weh);
        if (index2 > -1) {
          onErrors.splice(index2, 1);
        }
      }
    }
  }
};
const onSocketOpen = {
  args() {
    if (wx.__uni_console__) {
      if (wx.__uni_console_warned__) {
        return;
      }
      wx.__uni_console_warned__ = true;
      console.warn(`开发模式下小程序日志回显会使用 socket 连接，为了避免冲突，建议使用 SocketTask 的方式去管理 WebSocket 或手动关闭日志回显功能。[详情](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)`);
    }
  }
};
const onSocketMessage = onSocketOpen;
const baseApis = {
  $on,
  $off,
  $once,
  $emit,
  upx2px,
  rpx2px: upx2px,
  interceptors,
  addInterceptor,
  removeInterceptor,
  onCreateVueApp,
  invokeCreateVueAppHook,
  getLocale,
  setLocale,
  onLocaleChange,
  getPushClientId,
  onPushMessage,
  offPushMessage,
  invokePushCallback,
  __f__
};
function initUni(api, protocols2, platform2 = wx) {
  const wrapper = initWrapper(protocols2);
  const UniProxyHandlers = {
    get(target, key) {
      if (hasOwn$1(target, key)) {
        return target[key];
      }
      if (hasOwn$1(api, key)) {
        return promisify(key, api[key]);
      }
      if (hasOwn$1(baseApis, key)) {
        return promisify(key, baseApis[key]);
      }
      return promisify(key, wrapper(key, platform2[key]));
    }
  };
  return new Proxy({}, UniProxyHandlers);
}
function initGetProvider(providers) {
  return function getProvider2({ service, success, fail, complete }) {
    let res;
    if (providers[service]) {
      res = {
        errMsg: "getProvider:ok",
        service,
        provider: providers[service]
      };
      isFunction(success) && success(res);
    } else {
      res = {
        errMsg: "getProvider:fail:服务[" + service + "]不存在"
      };
      isFunction(fail) && fail(res);
    }
    isFunction(complete) && complete(res);
  };
}
const objectKeys = [
  "qy",
  "env",
  "error",
  "version",
  "lanDebug",
  "cloud",
  "serviceMarket",
  "router",
  "worklet",
  "__webpack_require_UNI_MP_PLUGIN__"
];
const singlePageDisableKey = ["lanDebug", "router", "worklet"];
const launchOption = wx.getLaunchOptionsSync ? wx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof wx[key] === "function";
}
function initWx() {
  const newWx = {};
  for (const key in wx) {
    if (isWxKey(key)) {
      newWx[key] = wx[key];
    }
  }
  if (typeof globalThis !== "undefined" && typeof requireMiniProgram === "undefined") {
    globalThis.wx = newWx;
  }
  return newWx;
}
const mocks$1 = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
const getProvider = initGetProvider({
  oauth: ["weixin"],
  share: ["weixin"],
  payment: ["wxpay"],
  push: ["weixin"]
});
function initComponentMocks(component) {
  const res = /* @__PURE__ */ Object.create(null);
  mocks$1.forEach((name) => {
    res[name] = component[name];
  });
  return res;
}
function createSelectorQuery() {
  const query = wx$2.createSelectorQuery();
  const oldIn = query.in;
  query.in = function newIn(component) {
    if (component.$scope) {
      return oldIn.call(this, component.$scope);
    }
    return oldIn.call(this, initComponentMocks(component));
  };
  return query;
}
const wx$2 = initWx();
if (!wx$2.getAppBaseInfo || !wx$2.getAppBaseInfo()) {
  wx$2.getAppBaseInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.getWindowInfo || !wx$2.getWindowInfo()) {
  wx$2.getWindowInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.getDeviceInfo || !wx$2.getDeviceInfo()) {
  wx$2.getDeviceInfo = wx$2.getSystemInfoSync;
}
let baseInfo = wx$2.getAppBaseInfo && wx$2.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx$2.getSystemInfoSync();
}
const host = baseInfo ? baseInfo.host : null;
const shareVideoMessage = host && host.env === "SAAASDK" ? wx$2.miniapp.shareVideoMessage : wx$2.shareVideoMessage;
var shims = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  createSelectorQuery,
  getProvider,
  shareVideoMessage
});
const compressImage = {
  args(fromArgs, toArgs) {
    if (fromArgs.compressedHeight && !toArgs.compressHeight) {
      toArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !toArgs.compressWidth) {
      toArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  compressImage,
  getAppAuthorizeSetting,
  getAppBaseInfo,
  getDeviceInfo,
  getSystemInfo,
  getSystemInfoSync,
  getWindowInfo: getWindowInfo$1,
  offError,
  onError,
  onSocketMessage,
  onSocketOpen,
  previewImage,
  redirectTo,
  showActionSheet
});
const wx$1 = initWx();
var index$1 = initUni(shims, protocols, wx$1);
function currentPageCaptureScreenshot(fullPage, callback) {
  var _a;
  const pages2 = getCurrentPages();
  const currentPage = pages2[pages2.length - 1];
  (_a = currentPage.vm) === null || _a === void 0 ? void 0 : _a.$viewToTempFilePath({
    wholeContent: fullPage,
    overwrite: true,
    success: (res) => {
      const fileManager = index$1.getFileSystemManager();
      fileManager.readFile({
        encoding: "base64",
        filePath: res.tempFilePath,
        success(readFileRes) {
          callback(readFileRes.data, "");
        },
        fail(err) {
          callback("", `captureScreenshot fail: ${JSON.stringify(err)}`);
        }
      });
    },
    fail: (err) => {
      callback("", `captureScreenshot fail: ${JSON.stringify(err)}`);
    }
  });
}
function initRuntimeSocket(hosts, port, id) {
  if (hosts == "" || port == "" || id == "")
    return Promise.resolve(null);
  return hosts.split(",").reduce((promise2, host2) => {
    return promise2.then((socket) => {
      if (socket != null)
        return Promise.resolve(socket);
      return tryConnectSocket(host2, port, id);
    });
  }, Promise.resolve(null));
}
const SOCKET_TIMEOUT = 500;
function tryConnectSocket(host2, port, id) {
  return new Promise((resolve2, reject) => {
    const socket = index$1.connectSocket({
      url: `ws://${host2}:${port}/${id}`,
      multiple: true,
      // 支付宝小程序 是否开启多实例
      fail() {
        resolve2(null);
      }
    });
    const timer = setTimeout(() => {
      socket.close({
        code: 1006,
        reason: "connect timeout"
      });
      resolve2(null);
    }, SOCKET_TIMEOUT);
    socket.onOpen((e2) => {
      clearTimeout(timer);
      resolve2(socket);
    });
    socket.onClose((e2) => {
      clearTimeout(timer);
      resolve2(null);
    });
    socket.onError((e2) => {
      clearTimeout(timer);
      resolve2(null);
    });
    socket.onMessage((result) => {
      const message = JSON.parse(result.data);
      if (message["type"] == "screencap") {
        const id2 = message["id"];
        currentPageCaptureScreenshot(message.fullPage, (base64, error2) => {
          socket.send({
            data: JSON.stringify({
              id: id2,
              base64,
              error: error2
            })
          });
        });
      }
      resolve2(null);
    });
  });
}
const CONSOLE_TYPES = ["log", "warn", "error", "info", "debug"];
const originalConsole = /* @__PURE__ */ CONSOLE_TYPES.reduce((methods, type) => {
  methods[type] = console[type].bind(console);
  return methods;
}, {});
let sendError = null;
const errorQueue = /* @__PURE__ */ new Set();
const errorExtra = {};
function sendErrorMessages(errors) {
  if (sendError == null) {
    errors.forEach((error2) => {
      errorQueue.add(error2);
    });
    return;
  }
  const data = errors.map((err) => {
    if (typeof err === "string") {
      return err;
    }
    const isPromiseRejection = err && "promise" in err && "reason" in err;
    const prefix = isPromiseRejection ? "UnhandledPromiseRejection: " : "";
    if (isPromiseRejection) {
      err = err.reason;
    }
    if (err instanceof Error && err.stack) {
      if (err.message && !err.stack.includes(err.message)) {
        return `${prefix}${err.message}
${err.stack}`;
      }
      return `${prefix}${err.stack}`;
    }
    if (typeof err === "object" && err !== null) {
      try {
        return prefix + JSON.stringify(err);
      } catch (err2) {
        return prefix + String(err2);
      }
    }
    return prefix + String(err);
  }).filter(Boolean);
  if (data.length > 0) {
    sendError(JSON.stringify(Object.assign({
      type: "error",
      data
    }, errorExtra)));
  }
}
function setSendError(value, extra = {}) {
  sendError = value;
  Object.assign(errorExtra, extra);
  if (value != null && errorQueue.size > 0) {
    const errors = Array.from(errorQueue);
    errorQueue.clear();
    sendErrorMessages(errors);
  }
}
function initOnError() {
  function onError2(error2) {
    try {
      if (typeof PromiseRejectionEvent !== "undefined" && error2 instanceof PromiseRejectionEvent && error2.reason instanceof Error && error2.reason.message && error2.reason.message.includes(`Cannot create property 'errMsg' on string 'taskId`)) {
        return;
      }
      if (true) {
        originalConsole.error(error2);
      }
      sendErrorMessages([error2]);
    } catch (err) {
      originalConsole.error(err);
    }
  }
  if (typeof index$1 !== "undefined") {
    if (typeof index$1.onError === "function") {
      index$1.onError(onError2);
    }
    if (typeof index$1.onUnhandledRejection === "function") {
      index$1.onUnhandledRejection(onError2);
    }
  }
  return function offError2() {
    if (typeof index$1 !== "undefined") {
      if (typeof index$1.offError === "function") {
        index$1.offError(onError2);
      }
      if (typeof index$1.offUnhandledRejection === "function") {
        index$1.offUnhandledRejection(onError2);
      }
    }
  };
}
function formatMessage(type, args) {
  try {
    return {
      type,
      args: formatArgs(args)
    };
  } catch (e2) {
  }
  return {
    type,
    args: []
  };
}
function formatArgs(args) {
  return args.map((arg) => formatArg(arg));
}
function formatArg(arg, depth = 0) {
  if (depth >= 7) {
    return {
      type: "object",
      value: "[Maximum depth reached]"
    };
  }
  const type = typeof arg;
  switch (type) {
    case "string":
      return formatString(arg);
    case "number":
      return formatNumber(arg);
    case "boolean":
      return formatBoolean(arg);
    case "object":
      try {
        return formatObject(arg, depth);
      } catch (e2) {
        return {
          type: "object",
          value: {
            properties: []
          }
        };
      }
    case "undefined":
      return formatUndefined();
    case "function":
      return formatFunction(arg);
    case "symbol": {
      return formatSymbol(arg);
    }
    case "bigint":
      return formatBigInt(arg);
  }
}
function formatFunction(value) {
  return {
    type: "function",
    value: `function ${value.name}() {}`
  };
}
function formatUndefined() {
  return {
    type: "undefined"
  };
}
function formatBoolean(value) {
  return {
    type: "boolean",
    value: String(value)
  };
}
function formatNumber(value) {
  return {
    type: "number",
    value: String(value)
  };
}
function formatBigInt(value) {
  return {
    type: "bigint",
    value: String(value)
  };
}
function formatString(value) {
  return {
    type: "string",
    value
  };
}
function formatSymbol(value) {
  return {
    type: "symbol",
    value: value.description
  };
}
function formatObject(value, depth) {
  if (value === null) {
    return {
      type: "null"
    };
  }
  {
    if (isComponentPublicInstance(value)) {
      return formatComponentPublicInstance(value, depth);
    }
    if (isComponentInternalInstance(value)) {
      return formatComponentInternalInstance(value, depth);
    }
    if (isUniElement(value)) {
      return formatUniElement(value, depth);
    }
    if (isCSSStyleDeclaration(value)) {
      return formatCSSStyleDeclaration(value, depth);
    }
  }
  if (Array.isArray(value)) {
    return {
      type: "object",
      subType: "array",
      value: {
        properties: value.map((v2, i2) => formatArrayElement(v2, i2, depth + 1))
      }
    };
  }
  if (value instanceof Set) {
    return {
      type: "object",
      subType: "set",
      className: "Set",
      description: `Set(${value.size})`,
      value: {
        entries: Array.from(value).map((v2) => formatSetEntry(v2, depth + 1))
      }
    };
  }
  if (value instanceof Map) {
    return {
      type: "object",
      subType: "map",
      className: "Map",
      description: `Map(${value.size})`,
      value: {
        entries: Array.from(value.entries()).map((v2) => formatMapEntry(v2, depth + 1))
      }
    };
  }
  if (value instanceof Promise) {
    return {
      type: "object",
      subType: "promise",
      value: {
        properties: []
      }
    };
  }
  if (value instanceof RegExp) {
    return {
      type: "object",
      subType: "regexp",
      value: String(value),
      className: "Regexp"
    };
  }
  if (value instanceof Date) {
    return {
      type: "object",
      subType: "date",
      value: String(value),
      className: "Date"
    };
  }
  if (value instanceof Error) {
    return {
      type: "object",
      subType: "error",
      value: value.message || String(value),
      className: value.name || "Error"
    };
  }
  let className = void 0;
  {
    const constructor = value.constructor;
    if (constructor) {
      if (constructor.get$UTSMetadata$) {
        className = constructor.get$UTSMetadata$().name;
      }
    }
  }
  let entries = Object.entries(value);
  if (isHarmonyBuilderParams(value)) {
    entries = entries.filter(([key]) => key !== "modifier" && key !== "nodeContent");
  }
  return {
    type: "object",
    className,
    value: {
      properties: entries.map((entry) => formatObjectProperty(entry[0], entry[1], depth + 1))
    }
  };
}
function isHarmonyBuilderParams(value) {
  return value.modifier && value.modifier._attribute && value.nodeContent;
}
function isComponentPublicInstance(value) {
  return value.$ && isComponentInternalInstance(value.$);
}
function isComponentInternalInstance(value) {
  return value.type && value.uid != null && value.appContext;
}
function formatComponentPublicInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentPublicInstance",
    value: {
      properties: Object.entries(value.$.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function formatComponentInternalInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentInternalInstance",
    value: {
      properties: Object.entries(value.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isUniElement(value) {
  return value.style && value.tagName != null && value.nodeName != null;
}
function formatUniElement(value, depth) {
  return {
    type: "object",
    // 非 x 没有 UniElement 的概念
    // className: 'UniElement',
    value: {
      properties: Object.entries(value).filter(([name]) => [
        "id",
        "tagName",
        "nodeName",
        "dataset",
        "offsetTop",
        "offsetLeft",
        "style"
      ].includes(name)).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isCSSStyleDeclaration(value) {
  return typeof value.getPropertyValue === "function" && typeof value.setProperty === "function" && value.$styles;
}
function formatCSSStyleDeclaration(style, depth) {
  return {
    type: "object",
    value: {
      properties: Object.entries(style.$styles).map(([name, value]) => formatObjectProperty(name, value, depth + 1))
    }
  };
}
function formatObjectProperty(name, value, depth) {
  const result = formatArg(value, depth);
  result.name = name;
  return result;
}
function formatArrayElement(value, index2, depth) {
  const result = formatArg(value, depth);
  result.name = `${index2}`;
  return result;
}
function formatSetEntry(value, depth) {
  return {
    value: formatArg(value, depth)
  };
}
function formatMapEntry(value, depth) {
  return {
    key: formatArg(value[0], depth),
    value: formatArg(value[1], depth)
  };
}
let sendConsole = null;
const messageQueue = [];
const messageExtra = {};
const EXCEPTION_BEGIN_MARK = "---BEGIN:EXCEPTION---";
const EXCEPTION_END_MARK = "---END:EXCEPTION---";
function sendConsoleMessages(messages) {
  if (sendConsole == null) {
    messageQueue.push(...messages);
    return;
  }
  sendConsole(JSON.stringify(Object.assign({
    type: "console",
    data: messages
  }, messageExtra)));
}
function setSendConsole(value, extra = {}) {
  sendConsole = value;
  Object.assign(messageExtra, extra);
  if (value != null && messageQueue.length > 0) {
    const messages = messageQueue.slice();
    messageQueue.length = 0;
    sendConsoleMessages(messages);
  }
}
const atFileRegex = /^\s*at\s+[\w/./-]+:\d+$/;
function rewriteConsole() {
  function wrapConsole(type) {
    return function(...args) {
      {
        const originalArgs = [...args];
        if (originalArgs.length) {
          const maybeAtFile = originalArgs[originalArgs.length - 1];
          if (typeof maybeAtFile === "string" && atFileRegex.test(maybeAtFile)) {
            originalArgs.pop();
          }
        }
        originalConsole[type](...originalArgs);
      }
      if (type === "error" && args.length === 1) {
        const arg = args[0];
        if (typeof arg === "string" && arg.startsWith(EXCEPTION_BEGIN_MARK)) {
          const startIndex = EXCEPTION_BEGIN_MARK.length;
          const endIndex = arg.length - EXCEPTION_END_MARK.length;
          sendErrorMessages([arg.slice(startIndex, endIndex)]);
          return;
        } else if (arg instanceof Error) {
          sendErrorMessages([arg]);
          return;
        }
      }
      sendConsoleMessages([formatMessage(type, args)]);
    };
  }
  if (isConsoleWritable()) {
    CONSOLE_TYPES.forEach((type) => {
      console[type] = wrapConsole(type);
    });
    return function restoreConsole() {
      CONSOLE_TYPES.forEach((type) => {
        console[type] = originalConsole[type];
      });
    };
  } else {
    {
      if (typeof index$1 !== "undefined" && index$1.__f__) {
        const oldLog = index$1.__f__;
        if (oldLog) {
          index$1.__f__ = function(...args) {
            const [type, filename, ...rest] = args;
            oldLog(type, "", ...rest);
            sendConsoleMessages([formatMessage(type, [...rest, filename])]);
          };
          return function restoreConsole() {
            index$1.__f__ = oldLog;
          };
        }
      }
    }
  }
  return function restoreConsole() {
  };
}
function isConsoleWritable() {
  const value = console.log;
  const sym = Symbol();
  try {
    console.log = sym;
  } catch (ex) {
    return false;
  }
  const isWritable = console.log === sym;
  console.log = value;
  return isWritable;
}
function initRuntimeSocketService() {
  const hosts = "172.17.224.1,192.168.1.3,127.0.0.1";
  const port = "8090";
  const id = "mp-weixin_PQEgua";
  const lazy = typeof swan !== "undefined";
  let restoreError = lazy ? () => {
  } : initOnError();
  let restoreConsole = lazy ? () => {
  } : rewriteConsole();
  return Promise.resolve().then(() => {
    if (lazy) {
      restoreError = initOnError();
      restoreConsole = rewriteConsole();
    }
    return initRuntimeSocket(hosts, port, id).then((socket) => {
      if (!socket) {
        restoreError();
        restoreConsole();
        originalConsole.error(wrapError("开发模式下日志通道建立 socket 连接失败。"));
        {
          originalConsole.error(wrapError("小程序平台，请勾选不校验合法域名配置。"));
        }
        originalConsole.error(wrapError("如果是运行到真机，请确认手机与电脑处于同一网络。"));
        return false;
      }
      {
        initMiniProgramGlobalFlag();
      }
      socket.onClose(() => {
        {
          originalConsole.error(wrapError("开发模式下日志通道 socket 连接关闭，请在 HBuilderX 中重新运行。"));
        }
        restoreError();
        restoreConsole();
      });
      setSendConsole((data) => {
        socket.send({
          data
        });
      });
      setSendError((data) => {
        socket.send({
          data
        });
      });
      return true;
    });
  });
}
const ERROR_CHAR = "‌";
function wrapError(error2) {
  return `${ERROR_CHAR}${error2}${ERROR_CHAR}`;
}
function initMiniProgramGlobalFlag() {
  if (typeof wx$1 !== "undefined") {
    wx$1.__uni_console__ = true;
  } else if (typeof my !== "undefined") {
    my.__uni_console__ = true;
  } else if (typeof tt !== "undefined") {
    tt.__uni_console__ = true;
  } else if (typeof swan !== "undefined") {
    swan.__uni_console__ = true;
  } else if (typeof qq !== "undefined") {
    qq.__uni_console__ = true;
  } else if (typeof ks !== "undefined") {
    ks.__uni_console__ = true;
  } else if (typeof jd !== "undefined") {
    jd.__uni_console__ = true;
  } else if (typeof xhs !== "undefined") {
    xhs.__uni_console__ = true;
  } else if (typeof has !== "undefined") {
    has.__uni_console__ = true;
  } else if (typeof qa !== "undefined") {
    qa.__uni_console__ = true;
  }
}
initRuntimeSocketService();
const _export_sfc = (sfc, props2) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props2) {
    target[key] = val;
  }
  return target;
};
function initVueIds(vueIds, mpInstance) {
  if (!vueIds) {
    return;
  }
  const ids = vueIds.split(",");
  const len = ids.length;
  if (len === 1) {
    mpInstance._$vueId = ids[0];
  } else if (len === 2) {
    mpInstance._$vueId = ids[0];
    mpInstance._$vuePid = ids[1];
  }
}
const EXTRAS = ["externalClasses"];
function initExtraOptions(miniProgramComponentOptions, vueOptions) {
  EXTRAS.forEach((name) => {
    if (hasOwn$1(vueOptions, name)) {
      miniProgramComponentOptions[name] = vueOptions[name];
    }
  });
}
const WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach((name) => {
      const matches = name.match(WORKLET_RE);
      if (matches) {
        const workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
function initWxsCallMethods(methods, wxsCallMethods) {
  if (!isArray$1(wxsCallMethods)) {
    return;
  }
  wxsCallMethods.forEach((callMethod) => {
    methods[callMethod] = function(args) {
      return this.$vm[callMethod](args);
    };
  });
}
function selectAllComponents(mpInstance, selector, $refs) {
  const components = mpInstance.selectAllComponents(selector);
  components.forEach((component) => {
    const ref2 = component.properties.uR;
    $refs[ref2] = component.$vm || component;
  });
}
function initRefs(instance, mpInstance) {
  Object.defineProperty(instance, "refs", {
    get() {
      const $refs = {};
      selectAllComponents(mpInstance, ".r", $refs);
      const forComponents = mpInstance.selectAllComponents(".r-i-f");
      forComponents.forEach((component) => {
        const ref2 = component.properties.uR;
        if (!ref2) {
          return;
        }
        if (!$refs[ref2]) {
          $refs[ref2] = [];
        }
        $refs[ref2].push(component.$vm || component);
      });
      return $refs;
    }
  });
}
function findVmByVueId(instance, vuePid) {
  const $children = instance.$children;
  for (let i2 = $children.length - 1; i2 >= 0; i2--) {
    const childVm = $children[i2];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  let parentVm;
  for (let i2 = $children.length - 1; i2 >= 0; i2--) {
    parentVm = findVmByVueId($children[i2], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function getLocaleLanguage() {
  var _a;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a = wx.getAppBaseInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
const MP_METHODS = [
  "createSelectorQuery",
  "createIntersectionObserver",
  "selectAllComponents",
  "selectComponent"
];
function createEmitFn(oldEmit, ctx) {
  return function emit2(event, ...args) {
    const scope = ctx.$scope;
    if (scope && event) {
      const detail = { __args__: args };
      {
        scope.triggerEvent(event, detail);
      }
    }
    return oldEmit.apply(this, [event, ...args]);
  };
}
function initBaseInstance(instance, options) {
  const ctx = instance.ctx;
  ctx.mpType = options.mpType;
  ctx.$mpType = options.mpType;
  ctx.$mpPlatform = "mp-weixin";
  ctx.$scope = options.mpInstance;
  {
    Object.defineProperties(ctx, {
      // only id
      [VIRTUAL_HOST_ID]: {
        get() {
          const id = this.$scope.data[VIRTUAL_HOST_ID];
          return id === void 0 ? "" : id;
        }
      }
    });
  }
  ctx.$mp = {};
  {
    ctx._self = {};
  }
  instance.slots = {};
  if (isArray$1(options.slots) && options.slots.length) {
    options.slots.forEach((name) => {
      instance.slots[name] = true;
    });
    if (instance.slots[SLOT_DEFAULT_NAME]) {
      instance.slots.default = true;
    }
  }
  ctx.getOpenerEventChannel = function() {
    {
      return options.mpInstance.getOpenerEventChannel();
    }
  };
  ctx.$hasHook = hasHook;
  ctx.$callHook = callHook;
  instance.emit = createEmitFn(instance.emit, ctx);
}
function initComponentInstance(instance, options) {
  initBaseInstance(instance, options);
  const ctx = instance.ctx;
  MP_METHODS.forEach((method) => {
    ctx[method] = function(...args) {
      const mpInstance = ctx.$scope;
      if (mpInstance && mpInstance[method]) {
        return mpInstance[method].apply(mpInstance, args);
      }
    };
  });
}
function initMocks(instance, mpInstance, mocks2) {
  const ctx = instance.ctx;
  mocks2.forEach((mock) => {
    if (hasOwn$1(mpInstance, mock)) {
      instance[mock] = ctx[mock] = mpInstance[mock];
    }
  });
}
function hasHook(name) {
  const hooks = this.$[name];
  if (hooks && hooks.length) {
    return true;
  }
  return false;
}
function callHook(name, args) {
  if (name === "mounted") {
    callHook.call(this, "bm");
    this.$.isMounted = true;
    name = "m";
  }
  const hooks = this.$[name];
  return hooks && invokeArrayFns(hooks, args);
}
const PAGE_INIT_HOOKS = [
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_ADD_TO_FAVORITES
  // 'onReady', // lifetimes.ready
  // 'onPageScroll', // 影响性能，开发者手动注册
  // 'onShareTimeline', // 右上角菜单，开发者手动注册
  // 'onShareAppMessage' // 右上角菜单，开发者手动注册
];
function findHooks(vueOptions, hooks = /* @__PURE__ */ new Set()) {
  if (vueOptions) {
    Object.keys(vueOptions).forEach((name) => {
      if (isUniLifecycleHook(name, vueOptions[name])) {
        hooks.add(name);
      }
    });
    {
      const { extends: extendsOptions, mixins } = vueOptions;
      if (mixins) {
        mixins.forEach((mixin2) => findHooks(mixin2, hooks));
      }
      if (extendsOptions) {
        findHooks(extendsOptions, hooks);
      }
    }
  }
  return hooks;
}
function initHook(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn$1(mpOptions, hook)) {
    mpOptions[hook] = function(args) {
      return this.$vm && this.$vm.$callHook(hook, args);
    };
  }
}
const EXCLUDE_HOOKS = [ON_READY];
function initHooks(mpOptions, hooks, excludes = EXCLUDE_HOOKS) {
  hooks.forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initUnknownHooks(mpOptions, vueOptions, excludes = EXCLUDE_HOOKS) {
  findHooks(vueOptions).forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initRuntimeHooks(mpOptions, runtimeHooks) {
  if (!runtimeHooks) {
    return;
  }
  const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
  hooks.forEach((hook) => {
    if (runtimeHooks & MINI_PROGRAM_PAGE_RUNTIME_HOOKS[hook]) {
      initHook(mpOptions, hook, []);
    }
  });
}
const findMixinRuntimeHooks = /* @__PURE__ */ once(() => {
  const runtimeHooks = [];
  const app = isFunction(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm && app.$vm.$) {
    const mixins = app.$vm.$.appContext.mixins;
    if (isArray$1(mixins)) {
      const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
      mixins.forEach((mixin2) => {
        hooks.forEach((hook) => {
          if (hasOwn$1(mixin2, hook) && !runtimeHooks.includes(hook)) {
            runtimeHooks.push(hook);
          }
        });
      });
    }
  }
  return runtimeHooks;
});
function initMixinRuntimeHooks(mpOptions) {
  initHooks(mpOptions, findMixinRuntimeHooks());
}
const HOOKS = [
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION
];
function parseApp(instance, parseAppOptions) {
  const internalInstance = instance.$;
  const appOptions = {
    globalData: instance.$options && instance.$options.globalData || {},
    $vm: instance,
    // mp-alipay 组件 data 初始化比 onLaunch 早，提前挂载
    onLaunch(options) {
      this.$vm = instance;
      const ctx = internalInstance.ctx;
      if (this.$vm && ctx.$scope && ctx.$callHook) {
        return;
      }
      initBaseInstance(internalInstance, {
        mpType: "app",
        mpInstance: this,
        slots: []
      });
      ctx.globalData = this.globalData;
      instance.$callHook(ON_LAUNCH, options);
    }
  };
  const onErrorHandlers = wx.$onErrorHandlers;
  if (onErrorHandlers) {
    onErrorHandlers.forEach((fn2) => {
      injectHook(ON_ERROR, fn2, internalInstance);
    });
    onErrorHandlers.length = 0;
  }
  initLocale(instance);
  const vueOptions = instance.$.type;
  initHooks(appOptions, HOOKS);
  initUnknownHooks(appOptions, vueOptions);
  {
    const methods = vueOptions.methods;
    methods && extend(appOptions, methods);
  }
  return appOptions;
}
function initCreateApp(parseAppOptions) {
  return function createApp2(vm) {
    return App(parseApp(vm));
  };
}
function initCreateSubpackageApp(parseAppOptions) {
  return function createApp2(vm) {
    const appOptions = parseApp(vm);
    const app = isFunction(getApp) && getApp({
      allowDefault: true
    });
    if (!app)
      return;
    vm.$.ctx.$scope = app;
    const globalData = app.globalData;
    if (globalData) {
      Object.keys(appOptions.globalData).forEach((name) => {
        if (!hasOwn$1(globalData, name)) {
          globalData[name] = appOptions.globalData[name];
        }
      });
    }
    Object.keys(appOptions).forEach((name) => {
      if (!hasOwn$1(app, name)) {
        app[name] = appOptions[name];
      }
    });
    initAppLifecycle(appOptions, vm);
  };
}
function initAppLifecycle(appOptions, vm) {
  if (isFunction(appOptions.onLaunch)) {
    const args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    appOptions.onLaunch(args);
  }
  if (isFunction(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow((args) => {
      vm.$callHook("onShow", args);
    });
  }
  if (isFunction(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide((args) => {
      vm.$callHook("onHide", args);
    });
  }
}
function initLocale(appVm) {
  const locale = ref(getLocaleLanguage());
  Object.defineProperty(appVm, "$locale", {
    get() {
      return locale.value;
    },
    set(v2) {
      locale.value = v2;
    }
  });
}
const builtInProps = [
  // 百度小程序,快手小程序自定义组件不支持绑定动态事件，动态dataset，故通过props传递事件信息
  // event-opts
  "eO",
  // 组件 ref
  "uR",
  // 组件 ref-in-for
  "uRIF",
  // 组件 id
  "uI",
  // 组件类型 m: 小程序组件
  "uT",
  // 组件 props
  "uP",
  // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
  "uS"
];
function initDefaultProps(options, isBehavior = false) {
  const properties = {};
  if (!isBehavior) {
    let observerSlots = function(newVal) {
      const $slots = /* @__PURE__ */ Object.create(null);
      newVal && newVal.forEach((slotName) => {
        $slots[slotName] = true;
      });
      this.setData({
        $slots
      });
    };
    builtInProps.forEach((name) => {
      properties[name] = {
        type: null,
        value: ""
      };
    });
    properties.uS = {
      type: null,
      value: []
    };
    {
      properties.uS.observer = observerSlots;
    }
  }
  if (options.behaviors) {
    if (options.behaviors.includes("wx://form-field")) {
      if (!options.properties || !options.properties.name) {
        properties.name = {
          type: null,
          value: ""
        };
      }
      if (!options.properties || !options.properties.value) {
        properties.value = {
          type: null,
          value: ""
        };
      }
    }
  }
  return properties;
}
function initVirtualHostProps(options) {
  const properties = {};
  {
    if (options && options.virtualHost) {
      properties[VIRTUAL_HOST_STYLE] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_CLASS] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_HIDDEN] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_ID] = {
        type: null,
        value: ""
      };
    }
  }
  return properties;
}
function initProps(mpComponentOptions) {
  if (!mpComponentOptions.properties) {
    mpComponentOptions.properties = {};
  }
  extend(mpComponentOptions.properties, initDefaultProps(mpComponentOptions), initVirtualHostProps(mpComponentOptions.options));
}
const PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function parsePropType(type, defaultValue) {
  if (isArray$1(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function normalizePropType(type, defaultValue) {
  const res = parsePropType(type);
  return PROP_TYPES.indexOf(res) !== -1 ? res : null;
}
function initPageProps({ properties }, rawProps) {
  if (isArray$1(rawProps)) {
    rawProps.forEach((key) => {
      properties[key] = {
        type: String,
        value: ""
      };
    });
  } else if (isPlainObject$1(rawProps)) {
    Object.keys(rawProps).forEach((key) => {
      const opts = rawProps[key];
      if (isPlainObject$1(opts)) {
        let value = opts.default;
        if (isFunction(value)) {
          value = value();
        }
        const type = opts.type;
        opts.type = normalizePropType(type);
        properties[key] = {
          type: opts.type,
          value
        };
      } else {
        properties[key] = {
          type: normalizePropType(opts)
        };
      }
    });
  }
}
function findPropsData(properties, isPage2) {
  return (isPage2 ? findPagePropsData(properties) : findComponentPropsData(resolvePropValue(properties.uP))) || {};
}
function findPagePropsData(properties) {
  const propsData = {};
  if (isPlainObject$1(properties)) {
    Object.keys(properties).forEach((name) => {
      if (builtInProps.indexOf(name) === -1) {
        propsData[name] = resolvePropValue(properties[name]);
      }
    });
  }
  return propsData;
}
function initFormField(vm) {
  const vueOptions = vm.$options;
  if (isArray$1(vueOptions.behaviors) && vueOptions.behaviors.includes("uni://form-field")) {
    vm.$watch("modelValue", () => {
      vm.$scope && vm.$scope.setData({
        name: vm.name,
        value: vm.modelValue
      });
    }, {
      immediate: true
    });
  }
}
function resolvePropValue(prop) {
  return prop;
}
function initData(_2) {
  return {};
}
function initPropsObserver(componentOptions) {
  const observe = function observe2() {
    const up = this.properties.uP;
    if (!up) {
      return;
    }
    if (this.$vm) {
      updateComponentProps(resolvePropValue(up), this.$vm.$);
    } else if (resolvePropValue(this.properties.uT) === "m") {
      updateMiniProgramComponentProperties(resolvePropValue(up), this);
    }
  };
  {
    if (!componentOptions.observers) {
      componentOptions.observers = {};
    }
    componentOptions.observers.uP = observe;
  }
}
function updateMiniProgramComponentProperties(up, mpInstance) {
  const prevProps = mpInstance.properties;
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps, false)) {
    mpInstance.setData(nextProps);
  }
}
function updateComponentProps(up, instance) {
  const prevProps = toRaw(instance.props);
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps)) {
    updateProps(instance, nextProps, prevProps, false);
    if (hasQueueJob(instance.update)) {
      invalidateJob(instance.update);
    }
    {
      instance.update();
    }
  }
}
function hasPropsChanged(prevProps, nextProps, checkLen = true) {
  const nextKeys = Object.keys(nextProps);
  if (checkLen && nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i2 = 0; i2 < nextKeys.length; i2++) {
    const key = nextKeys[i2];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
function initBehaviors(vueOptions) {
  const vueBehaviors = vueOptions.behaviors;
  let vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  const behaviors = [];
  if (isArray$1(vueBehaviors)) {
    vueBehaviors.forEach((behavior) => {
      behaviors.push(behavior.replace("uni://", "wx://"));
      if (behavior === "uni://form-field") {
        if (isArray$1(vueProps)) {
          vueProps.push("name");
          vueProps.push("modelValue");
        } else {
          vueProps.name = {
            type: String,
            default: ""
          };
          vueProps.modelValue = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ""
          };
        }
      }
    });
  }
  return behaviors;
}
function applyOptions(componentOptions, vueOptions) {
  componentOptions.data = initData();
  componentOptions.behaviors = initBehaviors(vueOptions);
}
function parseComponent(vueOptions, { parse: parse2, mocks: mocks2, isPage: isPage2, isPageInProject, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 }) {
  vueOptions = vueOptions.default || vueOptions;
  const options = {
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true,
    pureDataPattern: /^uP$/
  };
  if (isArray$1(vueOptions.mixins)) {
    vueOptions.mixins.forEach((item) => {
      if (isObject$2(item.options)) {
        extend(options, item.options);
      }
    });
  }
  if (vueOptions.options) {
    extend(options, vueOptions.options);
  }
  const mpComponentOptions = {
    options,
    lifetimes: initLifetimes2({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }),
    pageLifetimes: {
      show() {
        this.$vm && this.$vm.$callHook("onPageShow");
      },
      hide() {
        this.$vm && this.$vm.$callHook("onPageHide");
      },
      resize(size2) {
        this.$vm && this.$vm.$callHook("onPageResize", size2);
      }
    },
    methods: {
      __l: handleLink2
    }
  };
  {
    applyOptions(mpComponentOptions, vueOptions);
  }
  initProps(mpComponentOptions);
  initPropsObserver(mpComponentOptions);
  initExtraOptions(mpComponentOptions, vueOptions);
  initWxsCallMethods(mpComponentOptions.methods, vueOptions.wxsCallMethods);
  {
    initWorkletMethods(mpComponentOptions.methods, vueOptions.methods);
  }
  if (parse2) {
    parse2(mpComponentOptions, { handleLink: handleLink2 });
  }
  return mpComponentOptions;
}
function initCreateComponent(parseOptions2) {
  return function createComponent2(vueComponentOptions) {
    return Component(parseComponent(vueComponentOptions, parseOptions2));
  };
}
let $createComponentFn;
let $destroyComponentFn;
function getAppVm() {
  return getApp().$vm;
}
function $createComponent(initialVNode, options) {
  if (!$createComponentFn) {
    $createComponentFn = getAppVm().$createComponent;
  }
  const proxy = $createComponentFn(initialVNode, options);
  return getExposeProxy(proxy.$) || proxy;
}
function $destroyComponent(instance) {
  if (!$destroyComponentFn) {
    $destroyComponentFn = getAppVm().$destroyComponent;
  }
  return $destroyComponentFn(instance);
}
function parsePage(vueOptions, parseOptions2) {
  const { parse: parse2, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 } = parseOptions2;
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks: mocks2,
    isPage: isPage2,
    isPageInProject: true,
    initRelation: initRelation2,
    handleLink: handleLink2,
    initLifetimes: initLifetimes2
  });
  initPageProps(miniProgramPageOptions, (vueOptions.default || vueOptions).props);
  const methods = miniProgramPageOptions.methods;
  methods.onLoad = function(query) {
    {
      this.options = query;
    }
    this.$page = {
      fullPath: addLeadingSlash(this.route + stringifyQuery(query))
    };
    return this.$vm && this.$vm.$callHook(ON_LOAD, query);
  };
  initHooks(methods, PAGE_INIT_HOOKS);
  {
    initUnknownHooks(methods, vueOptions);
  }
  initRuntimeHooks(methods, vueOptions.__runtimeHooks);
  initMixinRuntimeHooks(methods);
  parse2 && parse2(miniProgramPageOptions, { handleLink: handleLink2 });
  return miniProgramPageOptions;
}
function initCreatePage(parseOptions2) {
  return function createPage2(vuePageOptions) {
    return Component(parsePage(vuePageOptions, parseOptions2));
  };
}
function initCreatePluginApp(parseAppOptions) {
  return function createApp2(vm) {
    initAppLifecycle(parseApp(vm), vm);
  };
}
const MPPage = Page;
const MPComponent = Component;
function initTriggerEvent(mpInstance) {
  const oldTriggerEvent = mpInstance.triggerEvent;
  const newTriggerEvent = function(event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [
      customizeEvent(event),
      ...args
    ]);
  };
  try {
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error2) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initMiniProgramHook(name, options, isComponent) {
  const oldHook = options[name];
  if (!oldHook) {
    options[name] = function() {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function(...args) {
      initTriggerEvent(this);
      return oldHook.apply(this, args);
    };
  }
}
Page = function(options) {
  initMiniProgramHook(ON_LOAD, options);
  return MPPage(options);
};
Component = function(options) {
  initMiniProgramHook("created", options);
  const isVueComponent = options.properties && options.properties.uP;
  if (!isVueComponent) {
    initProps(options);
    initPropsObserver(options);
  }
  return MPComponent(options);
};
function initLifetimes({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }) {
  return {
    attached() {
      let properties = this.properties;
      initVueIds(properties.uI, this);
      const relationOptions = {
        vuePid: this._$vuePid
      };
      initRelation2(this, relationOptions);
      const mpInstance = this;
      const isMiniProgramPage = isPage2(mpInstance);
      let propsData = properties;
      this.$vm = $createComponent({
        type: vueOptions,
        props: findPropsData(propsData, isMiniProgramPage)
      }, {
        mpType: isMiniProgramPage ? "page" : "component",
        mpInstance,
        slots: properties.uS || {},
        // vueSlots
        parentComponent: relationOptions.parent && relationOptions.parent.$,
        onBeforeSetup(instance, options) {
          initRefs(instance, mpInstance);
          initMocks(instance, mpInstance, mocks2);
          initComponentInstance(instance, options);
        }
      });
      if (!isMiniProgramPage) {
        initFormField(this.$vm);
      }
    },
    ready() {
      if (this.$vm) {
        {
          this.$vm.$callHook("mounted");
          this.$vm.$callHook(ON_READY);
        }
      }
    },
    detached() {
      if (this.$vm) {
        pruneComponentPropsCache(this.$vm.$.uid);
        $destroyComponent(this.$vm);
      }
    }
  };
}
const mocks = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
function isPage(mpInstance) {
  return !!mpInstance.route;
}
function initRelation(mpInstance, detail) {
  mpInstance.triggerEvent("__l", detail);
}
function handleLink(event) {
  const detail = event.detail || event.value;
  const vuePid = detail.vuePid;
  let parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  detail.parent = parentVm;
}
var parseOptions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  handleLink,
  initLifetimes,
  initRelation,
  isPage,
  mocks
});
const createApp = initCreateApp();
const createPage = initCreatePage(parseOptions);
const createComponent = initCreateComponent(parseOptions);
const createPluginApp = initCreatePluginApp();
const createSubpackageApp = initCreateSubpackageApp();
{
  wx.createApp = global.createApp = createApp;
  wx.createPage = createPage;
  wx.createComponent = createComponent;
  wx.createPluginApp = global.createPluginApp = createPluginApp;
  wx.createSubpackageApp = global.createSubpackageApp = createSubpackageApp;
}
const defineMixin = (options) => {
  return options;
};
const mpMixin = defineMixin({
  // 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性
  options: {
    virtualHost: true
  }
});
function email(value) {
  return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
}
function mobile(value) {
  return /^1[23456789]\d{9}$/.test(value);
}
function url(value) {
  return /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/.test(value);
}
function date(value) {
  if (!value)
    return false;
  if (typeof value === "number") {
    if (value.toString().length !== 10 && value.toString().length !== 13) {
      return false;
    }
    return !isNaN(new Date(value).getTime());
  }
  if (typeof value === "string") {
    const numV = Number(value);
    if (!isNaN(numV)) {
      if (numV.toString().length === 10 || numV.toString().length === 13) {
        return !isNaN(new Date(numV).getTime());
      }
    }
    if (value.length < 10 || value.length > 19) {
      return false;
    }
    const dateRegex = /^\d{4}[-\/]\d{2}[-\/]\d{2}( \d{1,2}:\d{2}(:\d{2})?)?$/;
    if (!dateRegex.test(value)) {
      return false;
    }
    const dateValue = new Date(value);
    return !isNaN(dateValue.getTime());
  }
  return false;
}
function dateISO(value) {
  return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
}
function number(value) {
  return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value);
}
function string(value) {
  return typeof value === "string";
}
function digits(value) {
  return /^\d+$/.test(value);
}
function idCard(value) {
  return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
    value
  );
}
function carNo(value) {
  const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
  const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
  if (value.length === 7) {
    return creg.test(value);
  }
  if (value.length === 8) {
    return xreg.test(value);
  }
  return false;
}
function amount(value) {
  return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value);
}
function chinese(value) {
  const reg = /^[\u4e00-\u9fa5]+$/gi;
  return reg.test(value);
}
function letter(value) {
  return /^[a-zA-Z]*$/.test(value);
}
function enOrNum(value) {
  const reg = /^[0-9a-zA-Z]*$/g;
  return reg.test(value);
}
function contains(value, param) {
  return value.indexOf(param) >= 0;
}
function range$1(value, param) {
  return value >= param[0] && value <= param[1];
}
function rangeLength(value, param) {
  return value.length >= param[0] && value.length <= param[1];
}
function landline(value) {
  const reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
  return reg.test(value);
}
function empty(value) {
  switch (typeof value) {
    case "undefined":
      return true;
    case "string":
      if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length == 0)
        return true;
      break;
    case "boolean":
      if (!value)
        return true;
      break;
    case "number":
      if (value === 0 || isNaN(value))
        return true;
      break;
    case "object":
      if (value === null || value.length === 0)
        return true;
      for (const i2 in value) {
        return false;
      }
      return true;
  }
  return false;
}
function jsonString(value) {
  if (typeof value === "string") {
    try {
      const obj = JSON.parse(value);
      if (typeof obj === "object" && obj) {
        return true;
      }
      return false;
    } catch (e2) {
      return false;
    }
  }
  return false;
}
function array(value) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(value);
  }
  return Object.prototype.toString.call(value) === "[object Array]";
}
function object(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}
function objectPromise(value) {
  return Object.prototype.toString.call(value) === "[object Promise]";
}
function code(value, len = 6) {
  return new RegExp(`^\\d{${len}}$`).test(value);
}
function func(value) {
  return typeof value === "function";
}
function promise(value) {
  return objectPromise(value) && func(value.then) && func(value.catch);
}
function image(value) {
  const newValue = value.split("?")[0];
  const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
  return IMAGE_REGEXP.test(newValue);
}
function video(value) {
  const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8)/i;
  return VIDEO_REGEXP.test(value);
}
function regExp(o2) {
  return o2 && Object.prototype.toString.call(o2) === "[object RegExp]";
}
const test = {
  email,
  mobile,
  url,
  date,
  dateISO,
  number,
  digits,
  idCard,
  carNo,
  amount,
  chinese,
  letter,
  enOrNum,
  contains,
  range: range$1,
  rangeLength,
  empty,
  isEmpty: empty,
  jsonString,
  landline,
  object,
  array,
  code,
  func,
  promise,
  video,
  image,
  regExp,
  string
};
function strip(num, precision = 15) {
  return +parseFloat(Number(num).toPrecision(precision));
}
function digitLength(num) {
  const eSplit = num.toString().split(/[eE]/);
  const len = (eSplit[0].split(".")[1] || "").length - +(eSplit[1] || 0);
  return len > 0 ? len : 0;
}
function float2Fixed(num) {
  if (num.toString().indexOf("e") === -1) {
    return Number(num.toString().replace(".", ""));
  }
  const dLen = digitLength(num);
  return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num);
}
function checkBoundary(num) {
  {
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
      index$1.__f__("warn", "at node_modules/uview-plus/libs/function/digit.js:45", `${num} 超出了精度限制，结果可能不正确`);
    }
  }
}
function iteratorOperation(arr, operation) {
  const [num1, num2, ...others] = arr;
  let res = operation(num1, num2);
  others.forEach((num) => {
    res = operation(res, num);
  });
  return res;
}
function times(...nums) {
  if (nums.length > 2) {
    return iteratorOperation(nums, times);
  }
  const [num1, num2] = nums;
  const num1Changed = float2Fixed(num1);
  const num2Changed = float2Fixed(num2);
  const baseNum = digitLength(num1) + digitLength(num2);
  const leftValue = num1Changed * num2Changed;
  checkBoundary(leftValue);
  return leftValue / Math.pow(10, baseNum);
}
function divide(...nums) {
  if (nums.length > 2) {
    return iteratorOperation(nums, divide);
  }
  const [num1, num2] = nums;
  const num1Changed = float2Fixed(num1);
  const num2Changed = float2Fixed(num2);
  checkBoundary(num1Changed);
  checkBoundary(num2Changed);
  return times(num1Changed / num2Changed, strip(Math.pow(10, digitLength(num2) - digitLength(num1))));
}
function round(num, ratio) {
  const base = Math.pow(10, ratio);
  let result = divide(Math.round(Math.abs(times(num, base))), base);
  if (num < 0 && result !== 0) {
    result = times(result, -1);
  }
  return result;
}
const version = "3";
{
  index$1.__f__("log", "at node_modules/uview-plus/libs/config/config.js:5", `
 %c uview-plus V${version} %c https://uview-plus.jiangruyi.com/ 

`, "color: #ffffff; background: #3c9cff; padding:5px 0;", "color: #3c9cff;background: #ffffff; padding:5px 0;");
}
const config = {
  v: version,
  version,
  // 主题名称
  type: [
    "primary",
    "success",
    "info",
    "error",
    "warning"
  ],
  // 颜色部分，本来可以通过scss的:export导出供js使用，但是奈何nvue不支持
  color: {
    "u-primary": "#2979ff",
    "u-warning": "#ff9900",
    "u-success": "#19be6b",
    "u-error": "#fa3534",
    "u-info": "#909399",
    "u-main-color": "#303133",
    "u-content-color": "#606266",
    "u-tips-color": "#909399",
    "u-light-color": "#c0c4cc",
    "up-primary": "#2979ff",
    "up-warning": "#ff9900",
    "up-success": "#19be6b",
    "up-error": "#fa3534",
    "up-info": "#909399",
    "up-main-color": "#303133",
    "up-content-color": "#606266",
    "up-tips-color": "#909399",
    "up-light-color": "#c0c4cc"
  },
  // 字体图标地址
  iconUrl: "https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf",
  // 自定义图标
  customIcon: {
    family: "",
    url: ""
  },
  customIcons: {},
  // 自定义图标与unicode对应关系
  // 默认单位，可以通过配置为rpx，那么在用于传入组件大小参数为数值时，就默认为rpx
  unit: "px",
  // 是否由运行时主题同步原生导航栏、页面背景、tabBar等全局UI
  nativeThemeSync: false,
  // 拦截器
  interceptor: {
    navbarLeftClick: null
  },
  // 只加载一次字体
  loadFontOnce: false
};
function range(min = 0, max = 0, value = 0) {
  return Math.max(min, Math.min(max, Number(value)));
}
function getPx(value, unit = false) {
  if (number(value)) {
    return unit ? `${value}px` : Number(value);
  }
  if (/(rpx|upx)$/.test(value)) {
    return unit ? `${index$1.upx2px(parseInt(value))}px` : Number(index$1.upx2px(parseInt(value)));
  }
  return unit ? `${parseInt(value)}px` : parseInt(value);
}
function rpx2px(value) {
  return index$1.rpx2px(value);
}
function sleep(value = 30) {
  return new Promise((resolve2) => {
    setTimeout(() => {
      resolve2();
    }, value);
  });
}
function os$1() {
  return index$1.getDeviceInfo().platform.toLowerCase();
}
function sys() {
  return index$1.getSystemInfoSync();
}
function getWindowInfo() {
  let ret = {};
  ret = index$1.getWindowInfo();
  return ret;
}
function random(min, max) {
  if (min >= 0 && max > 0 && max >= min) {
    const gab = max - min + 1;
    return Math.floor(Math.random() * gab + min);
  }
  return 0;
}
function guid(len = 32, firstU = true, radix = null) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  const uuid = [];
  radix = radix || chars.length;
  if (len) {
    for (let i2 = 0; i2 < len; i2++)
      uuid[i2] = chars[0 | Math.random() * radix];
  } else {
    let r2;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";
    for (let i2 = 0; i2 < 36; i2++) {
      if (!uuid[i2]) {
        r2 = 0 | Math.random() * 16;
        uuid[i2] = chars[i2 == 19 ? r2 & 3 | 8 : r2];
      }
    }
  }
  if (firstU) {
    uuid.shift();
    return `u${uuid.join("")}`;
  }
  return uuid.join("");
}
function $parent(name = void 0) {
  let parent = this.$parent;
  while (parent) {
    let name2 = "";
    if (name.startsWith("up-")) {
      name2 = name.replace(/up-([a-zA-Z0-9-_]+)/g, "u-$1");
    } else if (name.startsWith("u-")) {
      name2 = name.replace(/u-([a-zA-Z0-9-_]+)/g, "up-$1");
    }
    if (parent.$options && parent.$options.name !== name && parent.$options.name !== name2) {
      parent = parent.$parent;
    } else {
      return parent;
    }
  }
  return false;
}
function addStyle(customStyle, target = "object") {
  if (empty(customStyle) || typeof customStyle === "object" && target === "object" || target === "string" && typeof customStyle === "string") {
    return customStyle;
  }
  if (target === "object") {
    customStyle = trim(customStyle);
    const styleArray = customStyle.split(";");
    const style = {};
    for (let i2 = 0; i2 < styleArray.length; i2++) {
      if (styleArray[i2]) {
        const item = styleArray[i2].split(":");
        style[trim(item[0])] = trim(item[1]);
      }
    }
    return style;
  }
  let string2 = "";
  if (typeof customStyle === "object") {
    customStyle.forEach((val, i2) => {
      const key = i2.replace(/([A-Z])/g, "-$1").toLowerCase();
      string2 += `${key}:${val};`;
    });
  }
  return trim(string2);
}
function addUnit(value = "auto", unit = "") {
  if (!unit) {
    unit = config.unit || "px";
  }
  if (unit == "rpx" && number(String(value))) {
    value = value * 2;
  }
  value = String(value);
  return number(value) ? `${value}${unit}` : value;
}
function deepClone(obj) {
  if ([null, void 0, NaN, false].includes(obj))
    return obj;
  if (typeof obj !== "object" && typeof obj !== "function") {
    return obj;
  }
  const o2 = array(obj) ? [] : {};
  for (const i2 in obj) {
    if (obj.hasOwnProperty(i2)) {
      o2[i2] = typeof obj[i2] === "object" ? deepClone(obj[i2]) : obj[i2];
    }
  }
  return o2;
}
function deepMerge$1(targetOrigin = {}, source = {}) {
  let target = deepClone(targetOrigin);
  if (typeof target !== "object" || typeof source !== "object")
    return false;
  for (const prop in source) {
    if (!source.hasOwnProperty(prop))
      continue;
    if (prop in target) {
      if (source[prop] == null) {
        target[prop] = source[prop];
      } else if (typeof target[prop] !== "object") {
        target[prop] = source[prop];
      } else if (typeof source[prop] !== "object") {
        target[prop] = source[prop];
      } else if (target[prop].concat && source[prop].concat) {
        target[prop] = target[prop].concat(source[prop]);
      } else {
        target[prop] = deepMerge$1(target[prop], source[prop]);
      }
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}
function shallowMerge(target, source = {}) {
  if (typeof target !== "object" || typeof source !== "object")
    return false;
  for (const prop in source) {
    if (!source.hasOwnProperty(prop))
      continue;
    if (prop in target) {
      if (source[prop] == null) {
        target[prop] = source[prop];
      } else if (typeof target[prop] !== "object") {
        target[prop] = source[prop];
      } else if (typeof source[prop] !== "object") {
        target[prop] = source[prop];
      } else if (target[prop].concat && source[prop].concat) {
        target[prop] = target[prop].concat(source[prop]);
      } else {
        target[prop] = shallowMerge(target[prop], source[prop]);
      }
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}
function error(err) {
  {
    index$1.__f__("error", "at node_modules/uview-plus/libs/function/index.js:323", `uView提示：${err}`);
  }
}
function randomArray(array2 = []) {
  return array2.sort(() => Math.random() - 0.5);
}
if (!String.prototype.padStart) {
  String.prototype.padStart = function(maxLength, fillString = " ") {
    if (Object.prototype.toString.call(fillString) !== "[object String]") {
      throw new TypeError(
        "fillString must be String"
      );
    }
    const str = this;
    if (str.length >= maxLength)
      return String(str);
    const fillLength = maxLength - str.length;
    let times2 = Math.ceil(fillLength / fillString.length);
    while (times2 >>= 1) {
      fillString += fillString;
      if (times2 === 1) {
        fillString += fillString;
      }
    }
    return fillString.slice(0, fillLength) + str;
  };
}
function timeFormat(dateTime = null, formatStr = "yyyy-mm-dd") {
  let date2;
  if (!dateTime) {
    date2 = /* @__PURE__ */ new Date();
  } else if (/^\d{10}$/.test(dateTime.toString().trim())) {
    date2 = new Date(dateTime * 1e3);
  } else if (typeof dateTime === "string" && /^\d+$/.test(dateTime.trim())) {
    date2 = new Date(Number(dateTime));
  } else if (typeof dateTime === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?$/.test(dateTime)) {
    date2 = new Date(dateTime);
  } else {
    date2 = new Date(
      typeof dateTime === "string" ? dateTime.replace(/-/g, "/") : dateTime
    );
  }
  const timeSource = {
    "y": date2.getFullYear().toString(),
    // 年
    "m": (date2.getMonth() + 1).toString().padStart(2, "0"),
    // 月
    "d": date2.getDate().toString().padStart(2, "0"),
    // 日
    "h": date2.getHours().toString().padStart(2, "0"),
    // 时
    "M": date2.getMinutes().toString().padStart(2, "0"),
    // 分
    "s": date2.getSeconds().toString().padStart(2, "0")
    // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const key in timeSource) {
    const [ret] = new RegExp(`${key}+`).exec(formatStr) || [];
    if (ret) {
      const beginIndex = key === "y" && ret.length === 2 ? 2 : 0;
      formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex));
    }
  }
  return formatStr;
}
function timeFrom(timestamp = null, format = "yyyy-mm-dd") {
  if (timestamp == null)
    timestamp = Number(/* @__PURE__ */ new Date());
  timestamp = parseInt(timestamp);
  if (timestamp.toString().length == 10)
    timestamp *= 1e3;
  let timer = (/* @__PURE__ */ new Date()).getTime() - timestamp;
  timer = parseInt(timer / 1e3);
  let tips = "";
  switch (true) {
    case timer < 300:
      tips = "刚刚";
      break;
    case (timer >= 300 && timer < 3600):
      tips = `${parseInt(timer / 60)}分钟前`;
      break;
    case (timer >= 3600 && timer < 86400):
      tips = `${parseInt(timer / 3600)}小时前`;
      break;
    case (timer >= 86400 && timer < 2592e3):
      tips = `${parseInt(timer / 86400)}天前`;
      break;
    default:
      if (format === false) {
        if (timer >= 2592e3 && timer < 365 * 86400) {
          tips = `${parseInt(timer / (86400 * 30))}个月前`;
        } else {
          tips = `${parseInt(timer / (86400 * 365))}年前`;
        }
      } else {
        tips = timeFormat(timestamp, format);
      }
  }
  return tips;
}
function trim(str, pos = "both") {
  str = String(str);
  if (pos == "both") {
    return str.replace(/^\s+|\s+$/g, "");
  }
  if (pos == "left") {
    return str.replace(/^\s*/, "");
  }
  if (pos == "right") {
    return str.replace(/(\s*$)/g, "");
  }
  if (pos == "all") {
    return str.replace(/\s+/g, "");
  }
  return str;
}
function queryParams(data = {}, isPrefix = true, arrayFormat = "brackets") {
  const prefix = isPrefix ? "?" : "";
  const _result = [];
  if (["indices", "brackets", "repeat", "comma"].indexOf(arrayFormat) == -1)
    arrayFormat = "brackets";
  for (const key in data) {
    const value = data[key];
    if (["", void 0, null].indexOf(value) >= 0) {
      continue;
    }
    if (value.constructor === Array) {
      switch (arrayFormat) {
        case "indices":
          for (let i2 = 0; i2 < value.length; i2++) {
            _result.push(`${key}[${i2}]=${value[i2]}`);
          }
          break;
        case "brackets":
          value.forEach((_value) => {
            _result.push(`${key}[]=${_value}`);
          });
          break;
        case "repeat":
          value.forEach((_value) => {
            _result.push(`${key}=${_value}`);
          });
          break;
        case "comma":
          let commaStr = "";
          value.forEach((_value) => {
            commaStr += (commaStr ? "," : "") + _value;
          });
          _result.push(`${key}=${commaStr}`);
          break;
        default:
          value.forEach((_value) => {
            _result.push(`${key}[]=${_value}`);
          });
      }
    } else {
      _result.push(`${key}=${value}`);
    }
  }
  return _result.length ? prefix + _result.join("&") : "";
}
function toast(title, duration = 2e3) {
  index$1.showToast({
    title: String(title),
    icon: "none",
    duration
  });
}
function type2icon(type = "success", fill = false) {
  if (["primary", "info", "error", "warning", "success"].indexOf(type) == -1)
    type = "success";
  let iconName = "";
  switch (type) {
    case "primary":
      iconName = "info-circle";
      break;
    case "info":
      iconName = "info-circle";
      break;
    case "error":
      iconName = "close-circle";
      break;
    case "warning":
      iconName = "error-circle";
      break;
    case "success":
      iconName = "checkmark-circle";
      break;
    default:
      iconName = "checkmark-circle";
  }
  if (fill)
    iconName += "-fill";
  return iconName;
}
function priceFormat(number2, decimals = 0, decimalPoint = ".", thousandsSeparator = ",") {
  number2 = `${number2}`.replace(/[^0-9+-Ee.]/g, "");
  const n2 = !isFinite(+number2) ? 0 : +number2;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = typeof thousandsSeparator === "undefined" ? "," : thousandsSeparator;
  const dec = typeof decimalPoint === "undefined" ? "." : decimalPoint;
  let s2 = "";
  s2 = (prec ? round(n2, prec) + "" : `${Math.round(n2)}`).split(".");
  const re2 = /(-?\d+)(\d{3})/;
  while (re2.test(s2[0])) {
    s2[0] = s2[0].replace(re2, `$1${sep}$2`);
  }
  if ((s2[1] || "").length < prec) {
    s2[1] = s2[1] || "";
    s2[1] += new Array(prec - s2[1].length + 1).join("0");
  }
  return s2.join(dec);
}
function getDuration(value, unit = true) {
  const valueNum = parseInt(value);
  if (unit) {
    if (/s$/.test(value))
      return value;
    return value > 30 ? `${value}ms` : `${value}s`;
  }
  if (/ms$/.test(value))
    return valueNum;
  if (/s$/.test(value))
    return valueNum > 30 ? valueNum : valueNum * 1e3;
  return valueNum;
}
function padZero(value) {
  return `00${value}`.slice(-2);
}
function formValidate(instance, event) {
  const formItem = $parent.call(instance, "up-form-item");
  const form = $parent.call(instance, "up-form");
  if (formItem && form) {
    form.validateField(formItem.prop, () => {
    }, event);
  }
}
function getProperty(obj, key) {
  if (typeof obj !== "object" || null == obj) {
    return "";
  }
  if (typeof key !== "string" || key === "") {
    return "";
  }
  if (key.indexOf(".") !== -1) {
    const keys = key.split(".");
    let firstObj = obj[keys[0]] || {};
    for (let i2 = 1; i2 < keys.length; i2++) {
      if (firstObj) {
        firstObj = firstObj[keys[i2]];
      }
    }
    return firstObj;
  }
  return obj[key];
}
function setProperty(obj, key, value) {
  if (typeof obj !== "object" || null == obj) {
    return;
  }
  const inFn = function(_obj, keys, v2) {
    if (keys.length === 1) {
      _obj[keys[0]] = v2;
      return;
    }
    while (keys.length > 1) {
      const k = keys[0];
      if (!_obj[k] || typeof _obj[k] !== "object") {
        _obj[k] = {};
      }
      keys.shift();
      inFn(_obj[k], keys, v2);
    }
  };
  if (typeof key !== "string" || key === "")
    ;
  else if (key.indexOf(".") !== -1) {
    const keys = key.split(".");
    inFn(obj, keys, value);
  } else {
    obj[key] = value;
  }
}
function page() {
  const pages2 = getCurrentPages();
  return `/${pages2[pages2.length - 1].route || ""}`;
}
function pages$1() {
  const pages2 = getCurrentPages();
  return pages2;
}
function getValueByPath(obj, path) {
  const pathArr = path.split(".");
  return pathArr.reduce((acc, curr) => {
    return acc && acc[curr] !== void 0 ? acc[curr] : void 0;
  }, obj);
}
function genLightColor(textColor, lightness = 95) {
  const rgb = parseColorWithoutDOM(textColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const bgHsl = {
    h: hsl.h,
    s: hsl.s,
    l: Math.min(lightness, 95)
  };
  return hslToHex(bgHsl.h, bgHsl.s, bgHsl.l);
}
function parseColorWithoutDOM(colorStr) {
  const str = colorStr.toLowerCase().trim();
  if (str.startsWith("#")) {
    const hex = str.replace("#", "");
    const fullHex = hex.length === 3 ? hex.split("").map((c2) => c2 + c2).join("") : hex;
    return {
      r: parseInt(fullHex.substring(0, 2), 16),
      g: parseInt(fullHex.substring(2, 4), 16),
      b: parseInt(fullHex.substring(4, 6), 16)
    };
  }
  const rgbMatch = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: +rgbMatch[1],
      g: +rgbMatch[2],
      b: +rgbMatch[3]
    };
  }
  throw new Error("Invalid color format");
}
function rgbToHsl(r2, g2, b2) {
  r2 /= 255, g2 /= 255, b2 /= 255;
  const max = Math.max(r2, g2, b2), min = Math.min(r2, g2, b2);
  let h2, s2, l2 = (max + min) / 2;
  if (max === min) {
    h2 = s2 = 0;
  } else {
    const d2 = max - min;
    s2 = l2 > 0.5 ? d2 / (2 - max - min) : d2 / (max + min);
    switch (max) {
      case r2:
        h2 = (g2 - b2) / d2 + (g2 < b2 ? 6 : 0);
        break;
      case g2:
        h2 = (b2 - r2) / d2 + 2;
        break;
      case b2:
        h2 = (r2 - g2) / d2 + 4;
        break;
    }
    h2 = (h2 * 60).toFixed(1);
  }
  return { h: +h2, s: +(s2 * 100).toFixed(1), l: +(l2 * 100).toFixed(1) };
}
function hslToHex(h2, s2, l2) {
  l2 /= 100;
  const a2 = s2 * Math.min(l2, 1 - l2) / 100;
  const f2 = (n2) => {
    const k = (n2 + h2 / 30) % 12;
    const color2 = l2 - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color2).toString(16).padStart(2, "0");
  };
  return `#${f2(0)}${f2(8)}${f2(4)}`;
}
const index = {
  range,
  getPx,
  sleep,
  os: os$1,
  sys,
  getWindowInfo,
  random,
  guid,
  $parent,
  addStyle,
  addUnit,
  deepClone,
  deepMerge: deepMerge$1,
  shallowMerge,
  error,
  randomArray,
  timeFormat,
  timeFrom,
  trim,
  queryParams,
  toast,
  type2icon,
  priceFormat,
  getDuration,
  padZero,
  formValidate,
  getProperty,
  setProperty,
  page,
  pages: pages$1,
  getValueByPath,
  genLightColor,
  rpx2px
};
class Router {
  constructor() {
    this.config = {
      type: "navigateTo",
      url: "",
      delta: 1,
      // navigateBack页面后退时,回退的层数
      params: {},
      // 传递的参数
      animationType: "pop-in",
      // 窗口动画,只在APP有效
      animationDuration: 300,
      // 窗口动画持续时间,单位毫秒,只在APP有效
      intercept: false
      // 是否需要拦截
    };
    this.route = this.route.bind(this);
  }
  // 判断url前面是否有"/"，如果没有则加上，否则无法跳转
  addRootPath(url2) {
    return url2[0] === "/" ? url2 : `/${url2}`;
  }
  // 整合路由参数
  mixinParam(url2, params2) {
    url2 = url2 && this.addRootPath(url2);
    let query = "";
    if (/.*\/.*\?.*=.*/.test(url2)) {
      query = queryParams(params2, false);
      return url2 += `&${query}`;
    }
    query = queryParams(params2);
    return url2 += query;
  }
  // 对外的方法名称
  async route(options = {}, params2 = {}) {
    let mergeConfig2 = {};
    if (typeof options === "string") {
      mergeConfig2.url = this.mixinParam(options, params2);
      mergeConfig2.type = "navigateTo";
    } else {
      mergeConfig2 = deepMerge$1(this.config, options);
      mergeConfig2.url = this.mixinParam(options.url, options.params);
    }
    if (mergeConfig2.url === page())
      return;
    if (params2.intercept) {
      this.config.intercept = params2.intercept;
    }
    mergeConfig2.params = params2;
    mergeConfig2 = deepMerge$1(this.config, mergeConfig2);
    if (typeof index$1.$u.routeIntercept === "function") {
      const isNext = await new Promise((resolve2, reject) => {
        index$1.$u.routeIntercept(mergeConfig2, resolve2);
      });
      isNext && this.openPage(mergeConfig2);
    } else {
      this.openPage(mergeConfig2);
    }
  }
  // 执行路由跳转
  openPage(config2) {
    const {
      url: url2,
      type,
      delta,
      animationType,
      animationDuration
    } = config2;
    if (config2.type == "navigateTo" || config2.type == "to") {
      index$1.navigateTo({
        url: url2,
        animationType,
        animationDuration
      });
    }
    if (config2.type == "redirectTo" || config2.type == "redirect") {
      index$1.redirectTo({
        url: url2
      });
    }
    if (config2.type == "switchTab" || config2.type == "tab") {
      index$1.switchTab({
        url: url2
      });
    }
    if (config2.type == "reLaunch" || config2.type == "launch") {
      index$1.reLaunch({
        url: url2
      });
    }
    if (config2.type == "navigateBack" || config2.type == "back") {
      index$1.navigateBack({
        delta
      });
    }
  }
}
const route = new Router().route;
const THEME_MODE_STORAGE_KEY$1 = "u-theme-mode";
const FALLBACK_THEME_VARS = {
  light: {
    "--up-main-color": "var(--up-light-main-color, #303133)",
    "--up-content-color": "var(--up-light-content-color, #606266)",
    "--up-tips-color": "var(--up-light-tips-color, #909193)",
    "--up-light-color": "var(--up-light-light-color, #c0c4cc)",
    "--up-border-color": "var(--up-light-border-color, #dadbde)",
    "--up-bg-color": "var(--up-light-bg-color, #f3f4f6)",
    "--up-hover-bg-color": "#e7ebf0",
    "--up-page-bg-color": "#f3f4f6",
    "--up-card-bg-color": "#ffffff",
    "--up-navbar-bg-color": "#ffffff",
    "--up-table2-header-bg-color": "#f5f7fa",
    "--up-table2-zebra-bg-color": "#fafafa",
    "--up-table2-highlight-bg-color": "#f5f7fa",
    "--up-gap-bg-color": "#f3f4f6",
    "--up-skeleton-bg-color": "#f1f2f4",
    "--up-skeleton-shimmer-color": "#e6e6e6",
    "--up-swipe-action-button-bg-color": "#c7c6cd",
    "--up-index-list-indicator-bg-color": "#c9c9c9",
    "--up-calendar-month-mark-color": "rgba(231, 232, 234, 0.83)",
    "--up-disabled-color": "var(--up-light-disabled-color, #c8c9cc)",
    "--up-primary": "var(--up-light-primary, #3c9cff)",
    "--up-primary-dark": "var(--up-light-primary-dark, #398ade)",
    "--up-primary-disabled": "var(--up-light-primary-disabled, #9acafc)",
    "--up-primary-light": "var(--up-light-primary-light, #ecf5ff)",
    "--up-warning": "var(--up-light-warning, #f9ae3d)",
    "--up-warning-dark": "var(--up-light-warning-dark, #f1a532)",
    "--up-warning-disabled": "var(--up-light-warning-disabled, #f9d39b)",
    "--up-warning-light": "var(--up-light-warning-light, #fdf6ec)",
    "--up-success": "var(--up-light-success, #5ac725)",
    "--up-success-dark": "var(--up-light-success-dark, #53c21d)",
    "--up-success-disabled": "var(--up-light-success-disabled, #a9e08f)",
    "--up-success-light": "var(--up-light-success-light, #f5fff0)",
    "--up-error": "var(--up-light-error, #f56c6c)",
    "--up-error-dark": "var(--up-light-error-dark, #e45656)",
    "--up-error-disabled": "var(--up-light-error-disabled, #f7b2b2)",
    "--up-error-light": "var(--up-light-error-light, #fef0f0)",
    "--up-info": "var(--up-light-info, #909399)",
    "--up-info-dark": "var(--up-light-info-dark, #767a82)",
    "--up-info-disabled": "var(--up-light-info-disabled, #c4c6c9)",
    "--up-info-light": "var(--up-light-info-light, #f4f4f5)"
  },
  dark: {
    "--up-main-color": "#f5f5f5",
    "--up-content-color": "#d1d5db",
    "--up-tips-color": "#9ca3af",
    "--up-light-color": "#6b7280",
    "--up-border-color": "#3a3a3c",
    "--up-bg-color": "#1f1f1f",
    "--up-hover-bg-color": "#343741",
    "--up-page-bg-color": "#1f1f1f",
    "--up-card-bg-color": "#1c1c1e",
    "--up-navbar-bg-color": "#1c1c1e",
    "--up-table2-header-bg-color": "#2a2d33",
    "--up-table2-zebra-bg-color": "#23262b",
    "--up-table2-highlight-bg-color": "#2f3440",
    "--up-gap-bg-color": "#111111",
    "--up-skeleton-bg-color": "#2f3135",
    "--up-skeleton-shimmer-color": "rgba(255, 255, 255, 0.12)",
    "--up-swipe-action-button-bg-color": "#4b5563",
    "--up-index-list-indicator-bg-color": "#4b5563",
    "--up-calendar-month-mark-color": "rgba(255, 255, 255, 0.04)",
    "--up-disabled-color": "#4b5563",
    "--up-primary": "#3c9cff",
    "--up-primary-dark": "#5aa8ff",
    "--up-primary-disabled": "#4c6f92",
    "--up-primary-light": "#10243a",
    "--up-warning": "#f9ae3d",
    "--up-warning-dark": "#ffbf66",
    "--up-warning-disabled": "#8a6a3a",
    "--up-warning-light": "#3d2f1b",
    "--up-success": "#5ac725",
    "--up-success-dark": "#7ad94b",
    "--up-success-disabled": "#5f7f4f",
    "--up-success-light": "#1f3316",
    "--up-error": "#f56c6c",
    "--up-error-dark": "#ff8a8a",
    "--up-error-disabled": "#8d5858",
    "--up-error-light": "#3a2222",
    "--up-info": "#909399",
    "--up-info-dark": "#b0b3b8",
    "--up-info-disabled": "#5f6368",
    "--up-info-light": "#2f3238"
  }
};
const THEME_COLOR_SYNC_MAP = {
  "--up-main-color": "mainColor",
  "--up-content-color": "contentColor",
  "--up-tips-color": "tipsColor",
  "--up-light-color": "lightColor",
  "--up-border-color": "borderColor",
  "--up-bg-color": "bgColor",
  "--up-disabled-color": "disabledColor",
  "--up-primary": "primary",
  "--up-primary-dark": "primaryDark",
  "--up-primary-disabled": "primaryDisabled",
  "--up-primary-light": "primaryLight",
  "--up-warning": "warning",
  "--up-warning-dark": "warningDark",
  "--up-warning-disabled": "warningDisabled",
  "--up-warning-light": "warningLight",
  "--up-success": "success",
  "--up-success-dark": "successDark",
  "--up-success-disabled": "successDisabled",
  "--up-success-light": "successLight",
  "--up-error": "error",
  "--up-error-dark": "errorDark",
  "--up-error-disabled": "errorDisabled",
  "--up-error-light": "errorLight",
  "--up-info": "info",
  "--up-info-dark": "infoDark",
  "--up-info-disabled": "infoDisabled",
  "--up-info-light": "infoLight"
};
function buildFallbackAliasVars(vars) {
  const aliasVars = {};
  Object.keys(vars).forEach((key) => {
    if (typeof key === "string" && key.indexOf("--up-") === 0) {
      aliasVars[key.replace("--up-", "--u-")] = vars[key];
    }
  });
  return aliasVars;
}
function getRuntimeU(upU) {
  if (upU)
    return upU;
  if (typeof index$1 !== "undefined")
    return index$1.$u;
  return null;
}
function normalizeRuntimeRoute(route2) {
  if (typeof route2 !== "string")
    return "";
  return route2.replace(/^\//, "").split("?")[0];
}
function getCurrentRuntimeRoute() {
  try {
    if (typeof getCurrentPages !== "function")
      return "";
    const pages2 = getCurrentPages();
    if (!Array.isArray(pages2) || pages2.length === 0)
      return "";
    const page2 = pages2[pages2.length - 1] || {};
    return normalizeRuntimeRoute(page2.route || page2.path || "");
  } catch (e2) {
  }
  return "";
}
function getRuntimeTabBarRoutes() {
  var _a;
  const routes = [];
  try {
    const runtimeConfig = typeof __uniConfig !== "undefined" ? __uniConfig : null;
    const tabBarList = (_a = runtimeConfig == null ? void 0 : runtimeConfig.tabBar) == null ? void 0 : _a.list;
    if (Array.isArray(tabBarList)) {
      tabBarList.forEach((item) => {
        const route2 = normalizeRuntimeRoute((item == null ? void 0 : item.pagePath) || "");
        if (route2)
          routes.push(route2);
      });
    }
  } catch (e2) {
  }
  return routes;
}
function hasActiveRuntimePage$1() {
  try {
    if (typeof getCurrentPages === "function") {
      const pages2 = getCurrentPages();
      return Array.isArray(pages2) && pages2.length > 0;
    }
  } catch (e2) {
  }
  return false;
}
function trySetNavigationBarColor$1(options) {
  if (typeof index$1 === "undefined" || typeof index$1.setNavigationBarColor !== "function")
    return;
  if (!hasActiveRuntimePage$1())
    return;
  try {
    const result = index$1.setNavigationBarColor(options);
    if (result && typeof result.catch === "function") {
      result.catch(() => {
      });
    }
  } catch (e2) {
  }
}
function isTabBarPage() {
  const route2 = getCurrentRuntimeRoute();
  if (!route2)
    return false;
  const tabBarRoutes = getRuntimeTabBarRoutes();
  if (!tabBarRoutes.length)
    return false;
  return tabBarRoutes.includes(route2);
}
function trySetTabBarStyle(options) {
  if (typeof index$1 === "undefined" || typeof index$1.setTabBarStyle !== "function")
    return;
  if (!isTabBarPage())
    return;
  try {
    const result = index$1.setTabBarStyle(options);
    if (result && typeof result.catch === "function") {
      result.catch(() => {
      });
    }
  } catch (e2) {
  }
}
function normalizeThemeMode$1(theme = "light") {
  return theme === "dark" ? "dark" : "light";
}
function normalizeThemePreference$1(mode = "system") {
  return mode === "dark" || mode === "light" ? mode : "system";
}
function getFallbackSystemTheme() {
  let theme = "light";
  try {
    if (typeof index$1 !== "undefined" && typeof index$1.getAppBaseInfo === "function") {
      const appBaseInfo = index$1.getAppBaseInfo() || {};
      if (appBaseInfo.theme)
        theme = appBaseInfo.theme;
    }
    if (typeof index$1 !== "undefined" && typeof index$1.getSystemInfoSync === "function") {
      const systemInfo = index$1.getSystemInfoSync() || {};
      if (systemInfo.theme)
        theme = systemInfo.theme;
    }
  } catch (e2) {
    theme = "light";
  }
  return normalizeThemeMode$1(theme);
}
function getFallbackThemePreference() {
  try {
    if (typeof index$1 !== "undefined" && typeof index$1.getStorageSync === "function") {
      const preference = index$1.getStorageSync(THEME_MODE_STORAGE_KEY$1);
      return normalizeThemePreference$1(preference);
    }
  } catch (e2) {
  }
  return "system";
}
function getFallbackThemeMode() {
  const preference = getFallbackThemePreference();
  if (preference === "dark" || preference === "light")
    return preference;
  return getFallbackSystemTheme();
}
function getFallbackThemeVarsByMode(mode) {
  const vars = FALLBACK_THEME_VARS[normalizeThemeMode$1(mode)] || FALLBACK_THEME_VARS.light;
  return {
    ...vars,
    ...buildFallbackAliasVars(vars)
  };
}
function getFallbackThemeVars(upU) {
  const mode = getThemeIsDark(upU) ? "dark" : "light";
  return getFallbackThemeVarsByMode(mode);
}
function syncRuntimeColor(runtimeU, vars) {
  if (!runtimeU || !runtimeU.color)
    return;
  Object.keys(THEME_COLOR_SYNC_MAP).forEach((token) => {
    const field = THEME_COLOR_SYNC_MAP[token];
    runtimeU.color[field] = vars[token];
  });
}
function syncThemeRuntimeFromStorage(upU) {
  const runtimeU = getRuntimeU(upU);
  if (!runtimeU || !runtimeU.theme)
    return runtimeU == null ? void 0 : runtimeU.theme;
  const preference = getFallbackThemePreference();
  const mode = preference === "system" ? getFallbackSystemTheme() : preference;
  const vars = getFallbackThemeVarsByMode(mode);
  const shouldUpdate = runtimeU.theme.preference !== preference || runtimeU.theme.mode !== mode;
  if (shouldUpdate && typeof runtimeU.setThemePreference === "function") {
    return runtimeU.setThemePreference(preference) || runtimeU.theme;
  }
  runtimeU.theme.preference = preference;
  runtimeU.theme.mode = mode;
  runtimeU.theme.vars = {
    ...vars,
    ...runtimeU.theme.vars && !shouldUpdate ? runtimeU.theme.vars : {}
  };
  if (shouldUpdate) {
    runtimeU.theme.version = Number(runtimeU.theme.version || 0) + 1;
  }
  syncRuntimeColor(runtimeU, runtimeU.theme.vars);
  return runtimeU.theme;
}
function getThemeIsDark(upU) {
  var _a, _b;
  const runtimeMode = (_b = (_a = getRuntimeU(upU)) == null ? void 0 : _a.theme) == null ? void 0 : _b.mode;
  if (runtimeMode)
    return runtimeMode === "dark";
  return getFallbackThemeMode() === "dark";
}
function getThemeVarsForStyle(upU) {
  const runtimeU = getRuntimeU(upU);
  if (runtimeU && typeof runtimeU.getThemeVars === "function") {
    return runtimeU.getThemeVars();
  }
  return getFallbackThemeVars(runtimeU);
}
function getThemeVar(varName, fallbackColor, upU) {
  var _a, _b;
  const runtimeU = getRuntimeU(upU);
  const themeVars = (_a = runtimeU == null ? void 0 : runtimeU.theme) == null ? void 0 : _a.vars;
  if (themeVars && Object.prototype.hasOwnProperty.call(themeVars, varName)) {
    return themeVars[varName];
  }
  if (typeof varName === "string") {
    const aliasVarName = varName.indexOf("--up-") === 0 ? varName.replace("--up-", "--u-") : varName.indexOf("--u-") === 0 ? varName.replace("--u-", "--up-") : "";
    if (aliasVarName && themeVars && Object.prototype.hasOwnProperty.call(themeVars, aliasVarName)) {
      return themeVars[aliasVarName];
    }
    const runtimeColorMap = ((_b = runtimeU == null ? void 0 : runtimeU.config) == null ? void 0 : _b.color) || {};
    const colorTokenKey = varName.indexOf("--") === 0 ? varName.slice(2) : varName;
    if (Object.prototype.hasOwnProperty.call(runtimeColorMap, colorTokenKey)) {
      return runtimeColorMap[colorTokenKey];
    }
    const aliasColorTokenKey = colorTokenKey.indexOf("up-") === 0 ? colorTokenKey.replace("up-", "u-") : colorTokenKey.indexOf("u-") === 0 ? colorTokenKey.replace("u-", "up-") : "";
    if (aliasColorTokenKey && Object.prototype.hasOwnProperty.call(runtimeColorMap, aliasColorTokenKey)) {
      return runtimeColorMap[aliasColorTokenKey];
    }
  }
  if (runtimeU && typeof runtimeU.getThemeVars === "function") {
    const vars = runtimeU.getThemeVars();
    if (vars && Object.prototype.hasOwnProperty.call(vars, varName)) {
      return vars[varName];
    }
  }
  const fallbackVars = getFallbackThemeVars(runtimeU);
  if (fallbackVars && Object.prototype.hasOwnProperty.call(fallbackVars, varName)) {
    return fallbackVars[varName];
  }
  return typeof fallbackColor !== "undefined" ? fallbackColor : "";
}
function getThemePageStyle(upU, preferCssVars = false) {
  var _a;
  const runtimeU = getRuntimeU(upU);
  const isDark = getThemeIsDark(runtimeU);
  const fallbackBg = isDark ? "#1f1f1f" : ((_a = runtimeU == null ? void 0 : runtimeU.color) == null ? void 0 : _a.bgColor) || "#f3f4f6";
  if (preferCssVars) {
    return {
      ...getThemeVarsForStyle(runtimeU),
      minHeight: "100vh",
      backgroundColor: `var(--up-page-bg-color, var(--up-bg-color, ${fallbackBg}))`
    };
  }
  return {
    backgroundColor: getThemeVar(
      "--up-page-bg-color",
      getThemeVar("--up-bg-color", fallbackBg, runtimeU),
      runtimeU
    )
  };
}
function getThemeCardStyle(upU, preferCssVars = false) {
  var _a;
  const runtimeU = getRuntimeU(upU);
  const isDark = getThemeIsDark(runtimeU);
  const fallbackCard = isDark ? "#1c1c1e" : "#ffffff";
  const fallbackBorder = ((_a = runtimeU == null ? void 0 : runtimeU.color) == null ? void 0 : _a.borderColor) || "#dadbde";
  if (preferCssVars) {
    return {
      backgroundColor: `var(--up-card-bg-color, ${fallbackCard})`,
      borderColor: `var(--up-border-color, ${fallbackBorder})`
    };
  }
  return {
    backgroundColor: getThemeVar("--up-card-bg-color", fallbackCard, runtimeU),
    borderColor: getThemeVar("--up-border-color", fallbackBorder, runtimeU)
  };
}
function getThemeTabBarStyle(upU) {
  const runtimeU = getRuntimeU(upU);
  const isDark = getThemeIsDark(runtimeU);
  return {
    color: isDark ? "#8e8e93" : "#909399",
    selectedColor: isDark ? "#f2f2f7" : "#303133",
    backgroundColor: isDark ? "#111111" : "#ffffff",
    borderStyle: isDark ? "white" : "black"
  };
}
function applyNativeThemeUI$1(upU) {
  var _a, _b;
  if (typeof index$1 === "undefined")
    return;
  const runtimeU = getRuntimeU(upU);
  if (((_a = runtimeU == null ? void 0 : runtimeU.config) == null ? void 0 : _a.nativeThemeSync) !== true)
    return;
  const isDark = getThemeIsDark(runtimeU);
  const fallbackBg = isDark ? "#1f1f1f" : ((_b = runtimeU == null ? void 0 : runtimeU.color) == null ? void 0 : _b.bgColor) || "#f3f4f6";
  const pageBg = getThemeVar(
    "--up-page-bg-color",
    getThemeVar("--up-bg-color", fallbackBg, runtimeU),
    runtimeU
  );
  const navBg = getThemeVar(
    "--up-navbar-bg-color",
    isDark ? "#1c1c1e" : "#ffffff",
    runtimeU
  );
  trySetNavigationBarColor$1({
    frontColor: isDark ? "#ffffff" : "#000000",
    backgroundColor: navBg,
    animation: {
      duration: 0,
      timingFunc: "linear"
    }
  });
  if (typeof index$1.setBackgroundColor === "function") {
    index$1.setBackgroundColor({
      backgroundColor: pageBg,
      backgroundColorTop: pageBg,
      backgroundColorBottom: pageBg
    });
  }
  trySetTabBarStyle(getThemeTabBarStyle(runtimeU));
}
function applyNativeThemeUIDeferred(upU, delay = 30) {
  applyNativeThemeUI$1(upU);
  if (typeof setTimeout === "function") {
    setTimeout(() => {
      applyNativeThemeUI$1(upU);
    }, delay);
  }
}
const mixin = defineMixin({
  // 定义每个组件都可能需要用到的外部样式以及类名
  props: {
    // 每个组件都有的父组件传递的样式，可以为字符串或者对象形式
    customStyle: {
      type: [Object, String],
      default: () => ({})
    },
    customClass: {
      type: String,
      default: ""
    },
    // 跳转的页面路径
    url: {
      type: String,
      default: ""
    },
    // 页面跳转的类型
    linkType: {
      type: String,
      default: "navigateTo"
    }
  },
  data() {
    return {
      __upPageThemeChangeHandler: null,
      upThemeVersion: 0
    };
  },
  onLoad() {
    this.upBindGetRect();
    this.upInitThemeVersion();
    if (this.upIsPageScope()) {
      this.upApplyNativeThemeUI();
      if (typeof index$1 !== "undefined" && typeof index$1.$on === "function" && !this.__upPageThemeChangeHandler) {
        this.__upPageThemeChangeHandler = () => {
          this.upApplyNativeThemeUI();
        };
        index$1.$on("uThemeChange", this.__upPageThemeChangeHandler);
      }
    }
  },
  onShow() {
    if (this.upIsPageScope()) {
      this.upApplyNativeThemeUI();
    }
  },
  created() {
    this.upBindGetRect();
    this.upInitThemeVersion();
    if (typeof index$1 !== "undefined" && typeof index$1.$on === "function") {
      this.__uThemeChangeHandler = (payload = {}) => {
        this.upSyncThemeVersion(payload);
        this.chacheU = null;
        if (typeof this.$forceUpdate === "function") {
          this.$forceUpdate();
        }
      };
      index$1.$on("uThemeChange", this.__uThemeChangeHandler);
    }
  },
  computed: {
    // 在2.x版本中，将会把$u挂载到uni对象下，导致在模板中无法使用uni.$u.xxx形式
    // 所以这里通过computed计算属性将其附加到this.$u上，就可以在模板或者js中使用uni.$u.xxx
    // 只在nvue环境通过此方式引入完整的$u，其他平台会出现性能问题，非nvue则按需引入（主要原因是props过大）
    $u() {
      this.upThemeVersion;
      let mergeU = deepMerge$1(index$1.$u, {
        props: void 0,
        http: void 0,
        mixin: void 0
      });
      if (!this.chacheU) {
        this.chacheU = mergeU;
      }
      return this.chacheU;
    },
    upThemeIsDark() {
      this.upThemeVersion;
      return getThemeIsDark(this.$u);
    },
    upThemeVars() {
      this.upThemeVersion;
      return getThemeVarsForStyle(this.$u);
    },
    upThemePageStyle() {
      this.upThemeVersion;
      return getThemePageStyle(this.$u);
    },
    upThemeCardStyle() {
      this.upThemeVersion;
      return getThemeCardStyle(this.$u);
    },
    /**
     * 生成bem规则类名
     * 由于微信小程序，H5，nvue之间绑定class的差异，无法通过:class="[bem()]"的形式进行同用
     * 故采用如下折中做法，最后返回的是数组（一般平台）或字符串（支付宝和字节跳动平台），类似['a', 'b', 'c']或'a b c'的形式
     * @param {String} name 组件名称
     * @param {Array} fixed 一直会存在的类名
     * @param {Array} change 会根据变量值为true或者false而出现或者隐藏的类名
     * @returns {Array|string}
     */
    bem() {
      return function(name, fixed, change) {
        const prefix = `u-${name}--`;
        const classes = {};
        if (fixed) {
          fixed.map((item) => {
            classes[prefix + this[item]] = true;
          });
        }
        if (change) {
          change.map((item) => {
            this[item] ? classes[prefix + item] = this[item] : delete classes[prefix + item];
          });
        }
        return Object.keys(classes);
      };
    }
  },
  methods: {
    upBindGetRect() {
      const upU = this.$u || (typeof index$1 !== "undefined" ? index$1.$u : null);
      if (upU) {
        upU.getRect = this.$uGetRect;
      } else if (typeof index$1 !== "undefined") {
        index$1.$u = {
          getRect: this.$uGetRect
        };
      }
    },
    upReadThemeVersion() {
      return Number(typeof index$1 !== "undefined" && index$1.$u && index$1.$u.theme && index$1.$u.theme.version || 0);
    },
    upInitThemeVersion() {
      const version2 = this.upReadThemeVersion();
      if (version2) {
        this.upThemeVersion = version2;
      }
    },
    upSyncThemeVersion(payload = {}) {
      const version2 = Number(payload.version || this.upReadThemeVersion() || 0);
      this.upThemeVersion = version2 || Number(this.upThemeVersion || 0) + 1;
    },
    upIsPageScope() {
      var _a;
      return !!(this.$page || this.route || ((_a = this.$options) == null ? void 0 : _a.mpType) === "page");
    },
    upHasProp(propName) {
      var _a, _b;
      const vnodeProps = ((_b = (_a = this.$) == null ? void 0 : _a.vnode) == null ? void 0 : _b.props) || {};
      const kebabName = propName.replace(/[A-Z]/g, (s2) => `-${s2.toLowerCase()}`);
      return Object.prototype.hasOwnProperty.call(vnodeProps, propName) || Object.prototype.hasOwnProperty.call(vnodeProps, kebabName);
    },
    upThemeVar(varName, fallbackColor) {
      this.upThemeVersion;
      return getThemeVar(varName, fallbackColor, this.$u);
    },
    upApplyNativeThemeUI() {
      syncThemeRuntimeFromStorage(this.$u);
      this.upSyncThemeVersion();
      applyNativeThemeUIDeferred(this.$u);
    },
    // 跳转某一个页面
    openPage(urlKey = "url") {
      const url2 = this[urlKey];
      if (url2) {
        route({ type: this.linkType, url: url2 });
      }
    },
    navTo(url2 = "", linkType = "navigateTo") {
      route({ type: this.linkType, url: url2 });
    },
    // 查询节点信息
    // 目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21)
    // 解决办法为在组件根部再套一个没有任何作用的view元素
    $uGetRect(selector, all) {
      return new Promise((resolve2) => {
        index$1.createSelectorQuery().in(this)[all ? "selectAll" : "select"](selector).boundingClientRect((rect) => {
          if (all && Array.isArray(rect) && rect.length) {
            resolve2(rect);
          }
          if (!all && rect) {
            resolve2(rect);
          }
        }).exec();
      });
    },
    getParentData(parentName = "") {
      if (!this.parent)
        this.parent = {};
      this.parent = $parent.call(this, parentName);
      if (this.parent.children) {
        this.parent.children.indexOf(this) === -1 && this.parent.children.push(this);
      }
      if (this.parent && this.parentData) {
        Object.keys(this.parentData).map((key) => {
          this.parentData[key] = this.parent[key];
        });
      }
    },
    // 阻止事件冒泡
    preventEvent(e2) {
      e2 && typeof e2.stopPropagation === "function" && e2.stopPropagation();
    },
    // 空操作
    noop(e2) {
      this.preventEvent(e2);
    }
  },
  onReachBottom() {
    index$1.$emit("uOnReachBottom");
  },
  beforeUnmount() {
    if (this.parent && test.array(this.parent.children)) {
      const childrenList = this.parent.children;
      childrenList.map((child, index2) => {
        if (child === this) {
          childrenList.splice(index2, 1);
        }
      });
    }
    if (typeof index$1 !== "undefined" && typeof index$1.$off === "function" && this.__uThemeChangeHandler) {
      index$1.$off("uThemeChange", this.__uThemeChangeHandler);
      this.__uThemeChangeHandler = null;
    }
    if (typeof index$1 !== "undefined" && typeof index$1.$off === "function" && this.__upPageThemeChangeHandler) {
      index$1.$off("uThemeChange", this.__upPageThemeChangeHandler);
      this.__upPageThemeChangeHandler = null;
    }
  }
});
const color$3 = {
  primary: "#3c9cff",
  info: "#909399",
  default: "#909399",
  warning: "#f9ae3d",
  error: "#f56c6c",
  success: "#5ac725",
  mainColor: "#303133",
  contentColor: "#606266",
  tipsColor: "#909399",
  lightColor: "#c0c4cc",
  borderColor: "#e4e7ed"
};
function colorGradient(startColor = "rgb(0, 0, 0)", endColor = "rgb(255, 255, 255)", step = 10) {
  const startRGB = hexToRgb(startColor, false);
  const startR = startRGB[0];
  const startG = startRGB[1];
  const startB = startRGB[2];
  const endRGB = hexToRgb(endColor, false);
  const endR = endRGB[0];
  const endG = endRGB[1];
  const endB = endRGB[2];
  const sR = (endR - startR) / step;
  const sG = (endG - startG) / step;
  const sB = (endB - startB) / step;
  const colorArr = [];
  for (let i2 = 0; i2 < step; i2++) {
    let hex = rgbToHex(`rgb(${Math.round(sR * i2 + startR)},${Math.round(sG * i2 + startG)},${Math.round(sB * i2 + startB)})`);
    if (i2 === 0)
      hex = rgbToHex(startColor);
    if (i2 === step - 1)
      hex = rgbToHex(endColor);
    colorArr.push(hex);
  }
  return colorArr;
}
function hexToRgb(sColor, str = true) {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  sColor = String(sColor).toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i2 = 1; i2 < 4; i2 += 1) {
        sColorNew += sColor.slice(i2, i2 + 1).concat(sColor.slice(i2, i2 + 1));
      }
      sColor = sColorNew;
    }
    const sColorChange = [];
    for (let i2 = 1; i2 < 7; i2 += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i2, i2 + 2)}`));
    }
    if (!str) {
      return sColorChange;
    }
    return `rgb(${sColorChange[0]},${sColorChange[1]},${sColorChange[2]})`;
  }
  if (/^(rgb|RGB)/.test(sColor)) {
    const arr = sColor.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    return arr.map((val) => Number(val));
  }
  return sColor;
}
function rgbToHex(rgb) {
  const _this = rgb;
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if (/^(rgb|RGB)/.test(_this)) {
    const aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    let strHex = "#";
    for (let i2 = 0; i2 < aColor.length; i2++) {
      let hex = Number(aColor[i2]).toString(16);
      hex = String(hex).length == 1 ? `${0}${hex}` : hex;
      if (hex === "0") {
        hex += hex;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = _this;
    }
    return strHex;
  }
  if (reg.test(_this)) {
    const aNum = _this.replace(/#/, "").split("");
    if (aNum.length === 6) {
      return _this;
    }
    if (aNum.length === 3) {
      let numHex = "#";
      for (let i2 = 0; i2 < aNum.length; i2 += 1) {
        numHex += aNum[i2] + aNum[i2];
      }
      return numHex;
    }
  } else {
    return _this;
  }
}
function colorToRgba(color2, alpha) {
  color2 = rgbToHex(color2);
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  let sColor = String(color2).toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i2 = 1; i2 < 4; i2 += 1) {
        sColorNew += sColor.slice(i2, i2 + 1).concat(sColor.slice(i2, i2 + 1));
      }
      sColor = sColorNew;
    }
    const sColorChange = [];
    for (let i2 = 1; i2 < 7; i2 += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i2, i2 + 2)}`));
    }
    return `rgba(${sColorChange.join(",")},${alpha})`;
  }
  return sColor;
}
const colorGradient$1 = {
  colorGradient,
  hexToRgb,
  rgbToHex,
  colorToRgba
};
const _sfc_main$1 = {
  name: "u-toast",
  mixins: [mpMixin, mixin],
  data() {
    return {
      isShow: false,
      timer: null,
      // 定时器
      config: {
        message: "",
        // 显示文本
        type: "",
        // 主题类型，primary，success，error，warning，black
        zIndex: 10090,
        // 层级
        duration: 2e3,
        // 显示的时间，毫秒
        icon: true,
        // 显示的图标
        position: "center",
        // toast出现的位置
        complete: null,
        // 执行完后的回调函数
        overlay: true,
        // 是否防止触摸穿透
        loading: false
        // 是否加载中状态
      },
      tmpConfig: {}
      // 将用户配置和内置配置合并后的临时配置变量
    };
  },
  computed: {
    iconName() {
      if (!this.tmpConfig.icon || this.tmpConfig.icon == "none") {
        return "";
      }
      if (this.tmpConfig.icon === true) {
        if (["error", "warning", "success", "primary"].includes(this.tmpConfig.type)) {
          return type2icon(this.tmpConfig.type);
        } else {
          return "";
        }
      } else {
        return this.tmpConfig.icon;
      }
    },
    overlayStyle() {
      const style = {
        justifyContent: "center",
        alignItems: "center",
        display: "flex"
      };
      style.backgroundColor = "rgba(0, 0, 0, 0)";
      if (!this.tmpConfig.overlay) {
        style.pointerEvents = "none";
      }
      return style;
    },
    iconStyle() {
      const style = {};
      style.marginRight = "4px";
      return style;
    },
    loadingIconColor() {
      let colorTmp = "rgb(255, 255, 255)";
      if (["error", "warning", "success", "primary"].includes(this.tmpConfig.type)) {
        colorTmp = hexToRgb(color$3[this.tmpConfig.type]);
      }
      return colorTmp;
    },
    // 内容盒子的样式
    contentStyle() {
      const windowHeight = getWindowInfo().windowHeight, style = {};
      let value = 0;
      if (this.tmpConfig.position === "top") {
        value = -windowHeight * 0.25;
      } else if (this.tmpConfig.position === "bottom") {
        value = windowHeight * 0.25;
      }
      style.transform = `translateY(${value}px)`;
      return style;
    }
  },
  created() {
    ["primary", "success", "error", "warning", "default", "loading"].map((item) => {
      this[item] = (message) => this.show({
        type: item,
        message
      });
    });
  },
  methods: {
    // 显示toast组件，由父组件通过this.$refs.xxx.show(options)形式调用
    show(options) {
      this.tmpConfig = deepMerge$1(this.config, options);
      this.clearTimer();
      this.isShow = true;
      if (this.tmpConfig.duration !== -1) {
        this.timer = setTimeout(() => {
          this.clearTimer();
          typeof this.tmpConfig.complete === "function" && this.tmpConfig.complete();
        }, this.tmpConfig.duration);
      }
    },
    // 隐藏toast组件，由父组件通过this.$refs.xxx.hide()形式调用
    hide() {
      this.clearTimer();
    },
    clearTimer() {
      this.isShow = false;
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  beforeUnmount() {
    this.clearTimer();
  }
};
if (!Array) {
  const _easycom_u_loading_icon2 = resolveComponent("u-loading-icon");
  const _component_up_icon = resolveComponent("up-icon");
  const _easycom_u_gap2 = resolveComponent("u-gap");
  const _easycom_u_overlay2 = resolveComponent("u-overlay");
  (_easycom_u_loading_icon2 + _component_up_icon + _easycom_u_gap2 + _easycom_u_overlay2)();
}
const _easycom_u_loading_icon$1 = () => "../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_gap = () => "../node-modules/uview-plus/components/u-gap/u-gap.js";
const _easycom_u_overlay = () => "../node-modules/uview-plus/components/u-overlay/u-overlay.js";
if (!Math) {
  (_easycom_u_loading_icon$1 + _easycom_u_gap + _easycom_u_overlay)();
}
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return e({
    a: $data.tmpConfig.type === "loading"
  }, $data.tmpConfig.type === "loading" ? {
    b: p$1({
      mode: "circle",
      color: "rgb(255, 255, 255)",
      inactiveColor: "rgb(120, 120, 120)",
      size: "25"
    })
  } : $data.tmpConfig.type !== "defalut" && $options.iconName ? {
    d: p$1({
      name: $options.iconName,
      size: "17",
      color: $data.tmpConfig.type,
      customStyle: $options.iconStyle
    })
  } : {}, {
    c: $data.tmpConfig.type !== "defalut" && $options.iconName,
    e: $data.tmpConfig.type === "loading" || $data.tmpConfig.loading
  }, $data.tmpConfig.type === "loading" || $data.tmpConfig.loading ? {
    f: p$1({
      height: "12",
      bgColor: "transparent"
    })
  } : {}, {
    g: t$2($data.tmpConfig.message),
    h: n$1("u-toast__content__text--" + $data.tmpConfig.type),
    i: s$1($options.contentStyle),
    j: n$1("u-type-" + $data.tmpConfig.type),
    k: n$1($data.tmpConfig.type === "loading" || $data.tmpConfig.loading ? "u-toast__content--loading" : ""),
    l: p$1({
      show: $data.isShow,
      zIndex: $data.tmpConfig.zIndex,
      ["custom-style"]: $options.overlayStyle
    })
  });
}
const _easycom_u_toast = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-2232870a"]]);
const zIndex = {
  toast: 10090,
  noNetwork: 10080,
  // popup包含popup，actionsheet，keyboard，picker的值
  popup: 10075,
  mask: 10070,
  navbar: 980,
  topTips: 975,
  sticky: 970,
  indexListSticky: 965
};
const { toString } = Object.prototype;
function isArray(val) {
  return toString.call(val) === "[object Array]";
}
function isObject(val) {
  return val !== null && typeof val === "object";
}
function isDate(val) {
  return toString.call(val) === "[object Date]";
}
function isURLSearchParams(val) {
  return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
}
function forEach(obj, fn2) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (let i2 = 0, l2 = obj.length; i2 < l2; i2++) {
      fn2.call(null, obj[i2], i2, obj);
    }
  } else {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn2.call(null, obj[key], key, obj);
      }
    }
  }
}
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function deepMerge() {
  const result = {};
  function assignValue(val, key) {
    if (typeof result[key] === "object" && typeof val === "object") {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === "object") {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }
  for (let i2 = 0, l2 = arguments.length; i2 < l2; i2++) {
    forEach(arguments[i2], assignValue);
  }
  return result;
}
function isUndefined(val) {
  return typeof val === "undefined";
}
function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url2, params2) {
  if (!params2) {
    return url2;
  }
  let serializedParams;
  if (isURLSearchParams(params2)) {
    serializedParams = params2.toString();
  } else {
    const parts = [];
    forEach(params2, (val, key) => {
      if (val === null || typeof val === "undefined") {
        return;
      }
      if (isArray(val)) {
        key = `${key}[]`;
      } else {
        val = [val];
      }
      forEach(val, (v2) => {
        if (isDate(v2)) {
          v2 = v2.toISOString();
        } else if (isObject(v2)) {
          v2 = JSON.stringify(v2);
        }
        parts.push(`${encode(key)}=${encode(v2)}`);
      });
    });
    serializedParams = parts.join("&");
  }
  if (serializedParams) {
    const hashmarkIndex = url2.indexOf("#");
    if (hashmarkIndex !== -1) {
      url2 = url2.slice(0, hashmarkIndex);
    }
    url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url2;
}
function isAbsoluteURL(url2) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}` : baseURL;
}
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
function settle(resolve2, reject, response) {
  const { validateStatus: validateStatus2 } = response.config;
  const status = response.statusCode;
  if (status && (!validateStatus2 || validateStatus2(status))) {
    resolve2(response);
  } else {
    reject(response);
  }
}
const mergeKeys$1 = (keys, config2) => {
  const config3 = {};
  keys.forEach((prop) => {
    if (!isUndefined(config2[prop])) {
      config3[prop] = config2[prop];
    }
  });
  return config3;
};
const adapter = (config2) => new Promise((resolve2, reject) => {
  const fullPath = buildURL(buildFullPath(config2.baseURL, config2.url), config2.params);
  const _config = {
    url: fullPath,
    header: config2.header,
    complete: (response) => {
      config2.fullPath = fullPath;
      response.config = config2;
      try {
        if (typeof response.data === "string") {
          response.data = JSON.parse(response.data);
        }
      } catch (e2) {
      }
      settle(resolve2, reject, response);
    }
  };
  let requestTask;
  if (config2.method === "UPLOAD") {
    delete _config.header["content-type"];
    delete _config.header["Content-Type"];
    const otherConfig = {
      filePath: config2.filePath,
      name: config2.name
    };
    const optionalKeys = [
      "formData"
    ];
    requestTask = index$1.uploadFile({ ..._config, ...otherConfig, ...mergeKeys$1(optionalKeys, config2) });
  } else if (config2.method === "DOWNLOAD") {
    requestTask = index$1.downloadFile(_config);
  } else {
    const optionalKeys = [
      "data",
      "method",
      "timeout",
      "dataType",
      "responseType"
    ];
    requestTask = index$1.request({ ..._config, ...mergeKeys$1(optionalKeys, config2) });
  }
  if (config2.getTask) {
    config2.getTask(requestTask, config2);
  }
});
const dispatchRequest = (config2) => adapter(config2);
function InterceptorManager() {
  this.handlers = [];
}
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled,
    rejected
  });
  return this.handlers.length - 1;
};
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
InterceptorManager.prototype.forEach = function forEach2(fn2) {
  this.handlers.forEach((h2) => {
    if (h2 !== null) {
      fn2(h2);
    }
  });
};
const mergeKeys = (keys, globalsConfig, config2) => {
  const config3 = {};
  keys.forEach((prop) => {
    if (!isUndefined(config2[prop])) {
      config3[prop] = config2[prop];
    } else if (!isUndefined(globalsConfig[prop])) {
      config3[prop] = globalsConfig[prop];
    }
  });
  return config3;
};
const mergeConfig = (globalsConfig, config2 = {}) => {
  const method = config2.method || globalsConfig.method || "GET";
  let config3 = {
    baseURL: globalsConfig.baseURL || "",
    method,
    url: config2.url || "",
    params: config2.params || {},
    custom: { ...globalsConfig.custom || {}, ...config2.custom || {} },
    header: deepMerge(globalsConfig.header || {}, config2.header || {})
  };
  const defaultToConfig2Keys = ["getTask", "validateStatus"];
  config3 = { ...config3, ...mergeKeys(defaultToConfig2Keys, globalsConfig, config2) };
  if (method === "DOWNLOAD")
    ;
  else if (method === "UPLOAD") {
    delete config3.header["content-type"];
    delete config3.header["Content-Type"];
    const uploadKeys = [
      "filePath",
      "name",
      "formData"
    ];
    uploadKeys.forEach((prop) => {
      if (!isUndefined(config2[prop])) {
        config3[prop] = config2[prop];
      }
    });
  } else {
    const defaultsKeys = [
      "data",
      "timeout",
      "dataType",
      "responseType"
    ];
    config3 = { ...config3, ...mergeKeys(defaultsKeys, globalsConfig, config2) };
  }
  return config3;
};
const defaults = {
  baseURL: "",
  header: {},
  method: "GET",
  dataType: "json",
  responseType: "text",
  custom: {},
  timeout: 6e4,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};
var clone = function() {
  function _instanceof(obj, type) {
    return type != null && obj instanceof type;
  }
  var nativeMap;
  try {
    nativeMap = Map;
  } catch (_2) {
    nativeMap = function() {
    };
  }
  var nativeSet;
  try {
    nativeSet = Set;
  } catch (_2) {
    nativeSet = function() {
    };
  }
  var nativePromise;
  try {
    nativePromise = Promise;
  } catch (_2) {
    nativePromise = function() {
    };
  }
  function clone2(parent, circular, depth, prototype, includeNonEnumerable) {
    if (typeof circular === "object") {
      depth = circular.depth;
      prototype = circular.prototype;
      includeNonEnumerable = circular.includeNonEnumerable;
      circular = circular.circular;
    }
    var allParents = [];
    var allChildren = [];
    var useBuffer = typeof Buffer != "undefined";
    if (typeof circular == "undefined")
      circular = true;
    if (typeof depth == "undefined")
      depth = Infinity;
    function _clone(parent2, depth2) {
      if (parent2 === null)
        return null;
      if (depth2 === 0)
        return parent2;
      var child;
      var proto;
      if (typeof parent2 != "object") {
        return parent2;
      }
      if (_instanceof(parent2, nativeMap)) {
        child = new nativeMap();
      } else if (_instanceof(parent2, nativeSet)) {
        child = new nativeSet();
      } else if (_instanceof(parent2, nativePromise)) {
        child = new nativePromise(function(resolve2, reject) {
          parent2.then(function(value) {
            resolve2(_clone(value, depth2 - 1));
          }, function(err) {
            reject(_clone(err, depth2 - 1));
          });
        });
      } else if (clone2.__isArray(parent2)) {
        child = [];
      } else if (clone2.__isRegExp(parent2)) {
        child = new RegExp(parent2.source, __getRegExpFlags(parent2));
        if (parent2.lastIndex)
          child.lastIndex = parent2.lastIndex;
      } else if (clone2.__isDate(parent2)) {
        child = new Date(parent2.getTime());
      } else if (useBuffer && Buffer.isBuffer(parent2)) {
        if (Buffer.from) {
          child = Buffer.from(parent2);
        } else {
          child = new Buffer(parent2.length);
          parent2.copy(child);
        }
        return child;
      } else if (_instanceof(parent2, Error)) {
        child = Object.create(parent2);
      } else {
        if (typeof prototype == "undefined") {
          proto = Object.getPrototypeOf(parent2);
          child = Object.create(proto);
        } else {
          child = Object.create(prototype);
          proto = prototype;
        }
      }
      if (circular) {
        var index2 = allParents.indexOf(parent2);
        if (index2 != -1) {
          return allChildren[index2];
        }
        allParents.push(parent2);
        allChildren.push(child);
      }
      if (_instanceof(parent2, nativeMap)) {
        parent2.forEach(function(value, key) {
          var keyChild = _clone(key, depth2 - 1);
          var valueChild = _clone(value, depth2 - 1);
          child.set(keyChild, valueChild);
        });
      }
      if (_instanceof(parent2, nativeSet)) {
        parent2.forEach(function(value) {
          var entryChild = _clone(value, depth2 - 1);
          child.add(entryChild);
        });
      }
      for (var i2 in parent2) {
        var attrs = Object.getOwnPropertyDescriptor(parent2, i2);
        if (attrs) {
          child[i2] = _clone(parent2[i2], depth2 - 1);
        }
        try {
          var objProperty = Object.getOwnPropertyDescriptor(parent2, i2);
          if (objProperty.set === "undefined") {
            continue;
          }
          child[i2] = _clone(parent2[i2], depth2 - 1);
        } catch (e2) {
          if (e2 instanceof TypeError) {
            continue;
          } else if (e2 instanceof ReferenceError) {
            continue;
          }
        }
      }
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(parent2);
        for (var i2 = 0; i2 < symbols.length; i2++) {
          var symbol = symbols[i2];
          var descriptor = Object.getOwnPropertyDescriptor(parent2, symbol);
          if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
            continue;
          }
          child[symbol] = _clone(parent2[symbol], depth2 - 1);
          Object.defineProperty(child, symbol, descriptor);
        }
      }
      if (includeNonEnumerable) {
        var allPropertyNames = Object.getOwnPropertyNames(parent2);
        for (var i2 = 0; i2 < allPropertyNames.length; i2++) {
          var propertyName = allPropertyNames[i2];
          var descriptor = Object.getOwnPropertyDescriptor(parent2, propertyName);
          if (descriptor && descriptor.enumerable) {
            continue;
          }
          child[propertyName] = _clone(parent2[propertyName], depth2 - 1);
          Object.defineProperty(child, propertyName, descriptor);
        }
      }
      return child;
    }
    return _clone(parent, depth);
  }
  clone2.clonePrototype = function clonePrototype(parent) {
    if (parent === null)
      return null;
    var c2 = function() {
    };
    c2.prototype = parent;
    return new c2();
  };
  function __objToStr(o2) {
    return Object.prototype.toString.call(o2);
  }
  clone2.__objToStr = __objToStr;
  function __isDate(o2) {
    return typeof o2 === "object" && __objToStr(o2) === "[object Date]";
  }
  clone2.__isDate = __isDate;
  function __isArray(o2) {
    return typeof o2 === "object" && __objToStr(o2) === "[object Array]";
  }
  clone2.__isArray = __isArray;
  function __isRegExp(o2) {
    return typeof o2 === "object" && __objToStr(o2) === "[object RegExp]";
  }
  clone2.__isRegExp = __isRegExp;
  function __getRegExpFlags(re2) {
    var flags = "";
    if (re2.global)
      flags += "g";
    if (re2.ignoreCase)
      flags += "i";
    if (re2.multiline)
      flags += "m";
    return flags;
  }
  clone2.__getRegExpFlags = __getRegExpFlags;
  return clone2;
}();
class Request {
  /**
  * @param {Object} arg - 全局配置
  * @param {String} arg.baseURL - 全局根路径
  * @param {Object} arg.header - 全局header
  * @param {String} arg.method = [GET|POST|PUT|DELETE|CONNECT|HEAD|OPTIONS|TRACE] - 全局默认请求方式
  * @param {String} arg.dataType = [json] - 全局默认的dataType
  * @param {String} arg.responseType = [text|arraybuffer] - 全局默认的responseType。支付宝小程序不支持
  * @param {Object} arg.custom - 全局默认的自定义参数
  * @param {Number} arg.timeout - 全局默认的超时时间，单位 ms。默认60000。H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)、微信小程序（2.10.0）、支付宝小程序
  * @param {Boolean} arg.sslVerify - 全局默认的是否验证 ssl 证书。默认true.仅App安卓端支持（HBuilderX 2.3.3+）
  * @param {Boolean} arg.withCredentials - 全局默认的跨域请求时是否携带凭证（cookies）。默认false。仅H5支持（HBuilderX 2.6.15+）
  * @param {Boolean} arg.firstIpv4 - 全DNS解析时优先使用ipv4。默认false。仅 App-Android 支持 (HBuilderX 2.8.0+)
  * @param {Function(statusCode):Boolean} arg.validateStatus - 全局默认的自定义验证器。默认statusCode >= 200 && statusCode < 300
  */
  constructor(arg = {}) {
    if (!isPlainObject(arg)) {
      arg = {};
      index$1.__f__("warn", "at node_modules/uview-plus/libs/luch-request/core/Request.js:40", "设置全局参数必须接收一个Object");
    }
    this.config = clone({ ...defaults, ...arg });
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  /**
  * @Function
  * @param {Request~setConfigCallback} f - 设置全局默认配置
  */
  setConfig(f2) {
    this.config = f2(this.config);
  }
  middleware(config2) {
    config2 = mergeConfig(this.config, config2);
    const chain = [dispatchRequest, void 0];
    let promise2 = Promise.resolve(config2);
    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });
    while (chain.length) {
      promise2 = promise2.then(chain.shift(), chain.shift());
    }
    return promise2;
  }
  /**
  * @Function
  * @param {Object} config - 请求配置项
  * @prop {String} options.url - 请求路径
  * @prop {Object} options.data - 请求参数
  * @prop {Object} [options.responseType = config.responseType] [text|arraybuffer] - 响应的数据类型
  * @prop {Object} [options.dataType = config.dataType] - 如果设为 json，会尝试对返回的数据做一次 JSON.parse
  * @prop {Object} [options.header = config.header] - 请求header
  * @prop {Object} [options.method = config.method] - 请求方法
  * @returns {Promise<unknown>}
  */
  request(config2 = {}) {
    return this.middleware(config2);
  }
  get(url2, options = {}) {
    return this.middleware({
      url: url2,
      method: "GET",
      ...options
    });
  }
  post(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "POST",
      ...options
    });
  }
  put(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "PUT",
      ...options
    });
  }
  delete(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "DELETE",
      ...options
    });
  }
  connect(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "CONNECT",
      ...options
    });
  }
  head(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "HEAD",
      ...options
    });
  }
  options(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "OPTIONS",
      ...options
    });
  }
  trace(url2, data, options = {}) {
    return this.middleware({
      url: url2,
      data,
      method: "TRACE",
      ...options
    });
  }
  upload(url2, config2 = {}) {
    config2.url = url2;
    config2.method = "UPLOAD";
    return this.middleware(config2);
  }
  download(url2, config2 = {}) {
    config2.url = url2;
    config2.method = "DOWNLOAD";
    return this.middleware(config2);
  }
}
const http = new Request();
const ActionSheet = {
  // action-sheet组件
  actionSheet: {
    show: false,
    title: "",
    description: "",
    actions: [],
    nameKey: "name",
    subnameKey: "subnameKey",
    index: "",
    cancelText: "",
    closeOnClickAction: true,
    safeAreaInsetBottom: true,
    openType: "",
    closeOnClickOverlay: true,
    round: 0,
    wrapMaxHeight: "600px"
  }
};
const Album = {
  // album 组件
  album: {
    urls: [],
    keyName: "",
    singleSize: 180,
    multipleSize: 70,
    space: 6,
    singleMode: "scaleToFill",
    multipleMode: "aspectFill",
    maxCount: 9,
    previewFullImage: true,
    rowCount: 3,
    showMore: true,
    autoWrap: false,
    unit: "px",
    stop: true
  }
};
const Alert = {
  // alert警告组件
  alert: {
    title: "",
    type: "warning",
    description: "",
    closable: false,
    showIcon: false,
    effect: "light",
    center: false,
    fontSize: 14,
    transitionMode: "fade",
    duration: 0,
    icon: "",
    value: true
  }
};
const Avatar = {
  // avatar 组件
  avatar: {
    src: "",
    shape: "circle",
    size: 40,
    mode: "scaleToFill",
    text: "",
    bgColor: "#c0c4cc",
    color: "#ffffff",
    fontSize: 18,
    icon: "",
    mpAvatar: false,
    randomBgColor: false,
    defaultUrl: "",
    colorIndex: "",
    name: ""
  }
};
const AvatarGroup = {
  // avatarGroup 组件
  avatarGroup: {
    urls: [],
    maxCount: 5,
    shape: "circle",
    mode: "scaleToFill",
    showMore: true,
    size: 40,
    keyName: "",
    gap: 0.5,
    extraValue: 0
  }
};
const Backtop = {
  // backtop组件
  backtop: {
    mode: "circle",
    icon: "arrow-upward",
    text: "",
    duration: 100,
    scrollTop: 0,
    top: 400,
    bottom: 100,
    right: 20,
    zIndex: 9,
    iconStyle: {
      color: "#909399",
      fontSize: "19px"
    }
  }
};
const Badge = {
  // 徽标数组件
  badge: {
    isDot: false,
    value: "",
    show: true,
    max: 999,
    type: "error",
    showZero: false,
    bgColor: null,
    color: null,
    shape: "circle",
    numberType: "overflow",
    offset: [],
    inverted: false,
    absolute: false
  }
};
const Button = {
  // button组件
  button: {
    hairline: false,
    type: "info",
    size: "normal",
    shape: "square",
    plain: false,
    disabled: false,
    loading: false,
    loadingText: "",
    loadingMode: "spinner",
    loadingSize: 15,
    openType: "",
    formType: "",
    appParameter: "",
    hoverStopPropagation: true,
    lang: "en",
    sessionFrom: "",
    sendMessageTitle: "",
    sendMessagePath: "",
    sendMessageImg: "",
    showMessageCard: false,
    dataName: "",
    throttleTime: 0,
    hoverStartTime: 0,
    hoverStayTime: 200,
    text: "",
    icon: "",
    iconColor: "",
    color: "",
    stop: true
  }
};
const zhHans = {
  "up.common.cancel": "取消",
  "up.common.confirm": "确定",
  "up.common.start": "开始",
  "up.common.end": "结束",
  "up.common.stop": "停止",
  "up.common.copy": "复制",
  "up.common.none": "暂无",
  "up.common.tip": "提示",
  "up.common.success": "成功",
  "up.common.fail": "失败",
  "up.common.close": "关闭",
  "up.common.preview": "预览",
  "up.common.re-select": "重选",
  "up.common.rotate": "旋转",
  "up.common.pleaseChoose": "请选择",
  "up.common.loading": "加载中",
  "up.common.loading2": "正在加载",
  "up.common.inOperation": "操作中",
  "up.common.settings": "设置",
  "up.common.retry": "重试",
  "up.common.search": "搜索",
  "up.common.more": "更多",
  "up.common.video": "视频",
  "up.common.file": "文件",
  "up.week.one": "一",
  "up.week.two": "二",
  "up.week.three": "三",
  "up.week.four": "四",
  "up.week.five": "五",
  "up.week.six": "六",
  "up.week.seven": "日",
  "up.barcode.error": "生成条码失败",
  "up.calendar.chooseDates": "日期选择",
  "up.calendar.disabled": "该日期已禁用",
  "up.calendar.daysExceed": "选择天数不能超过{days}天",
  "up.calendar.today": "今天",
  "up.cityLocate.locateCity": "定位城市",
  "up.cityLocate.fail": "定位失败，请点击重试。",
  "up.cityLocate.locating": "定位中",
  "up.code.send": "获取验证码",
  "up.code.resendAfter": "X秒重新获取",
  "up.code.resend": "重新获取",
  "up.cropper.emptyWidhtOrHeight": "裁剪框的宽或高没有设置",
  "up.empty.car": "购物车为空",
  "up.empty.page": "页面不存在",
  "up.empty.search": "没有搜索结果",
  "up.empty.address": "没有收货地址",
  "up.empty.wifi": "没有WiFi",
  "up.empty.order": "订单为空",
  "up.empty.coupon": "没有优惠券",
  "up.empty.favor": "暂无收藏",
  "up.empty.permission": "无权限",
  "up.empty.history": "无历史记录",
  "up.empty.news": "无新闻列表",
  "up.empty.message": "消息列表为空",
  "up.empty.list": "列表为空",
  "up.empty.data": "数据为空",
  "up.empty.comment": "暂无评论",
  "up.link.copyed": "链接已复制，请在浏览器打开",
  "up.loadmoe.loadmore": "加载更多",
  "up.loadmoe.nomore": "没有更多了",
  "up.noNetwork.text": "哎呀，网络信号丢失",
  "up.noNetwork.pleaseCheck": "请检查网络，或前往",
  "up.noNetwork.connect": "网络已连接",
  "up.noNetwork.disconnect": "无网络连接",
  "up.pagination.previous": "上一页",
  "up.pagination.next": "下一页",
  "up.pullRefresh.pull": "下拉刷新",
  "up.pullRefresh.release": "释放刷新",
  "up.pullRefresh.refreshing": "正在刷新",
  "up.readMore.expand": "展开阅读全文",
  "up.readMore.fold": "收起",
  "up.search.placeholder": "请输入关键字",
  "up.signature.penSize": "笔画大小",
  "up.signature.penColor": "笔画颜色",
  "up.upload.sizeExceed": "超过大小限制",
  "up.upload.uploading": "上传中",
  "up.upload.previewImageFail": "预览图片失败",
  "up.upload.previewVideoFail": "预览视频失败",
  "up.goodsSku.stock": "库存",
  "up.goodsSku.price": "价格",
  "up.goodsSku.amount": "件",
  "up.goodsSku.choosed": "已选",
  "up.goodsSku.buyAmount": "购买数量"
};
const zhHant = {
  "up.common.cancel": "取消",
  "up.common.confirm": "確定",
  "up.common.start": "開始",
  "up.common.end": "結束",
  "up.common.stop": "停止",
  "up.common.copy": "複製",
  "up.common.none": "暫無",
  "up.common.tip": "提示",
  "up.common.success": "成功",
  "up.common.fail": "失敗",
  "up.common.close": "關閉",
  "up.common.preview": "預覽",
  "up.common.re-select": "重選",
  "up.common.rotate": "旋轉",
  "up.common.pleaseChoose": "請選擇",
  "up.common.loading": "加載中",
  "up.common.loading2": "正在加載",
  "up.common.inOperation": "操作中",
  "up.common.settings": "設置",
  "up.common.retry": "重試",
  "up.common.search": "搜索",
  "up.common.more": "更多",
  "up.common.video": "視頻",
  "up.common.file": "文件",
  "up.week.one": "一",
  "up.week.two": "二",
  "up.week.three": "三",
  "up.week.four": "四",
  "up.week.five": "五",
  "up.week.six": "六",
  "up.week.seven": "日",
  "up.barcode.error": "生成條碼失敗",
  "up.calendar.chooseDates": "日期選擇",
  "up.calendar.disabled": "該日期已禁用",
  "up.calendar.daysExceed": "選擇天數不能超過{days}天",
  "up.calendar.today": "今天",
  "up.cityLocate.locateCity": "定位城市",
  "up.cityLocate.fail": "定位失敗，請點擊重試。",
  "up.cityLocate.locating": "定位中",
  "up.code.send": "獲取驗證碼",
  "up.code.resendAfter": "X秒重新獲取",
  "up.code.resend": "重新獲取",
  "up.cropper.emptyWidhtOrHeight": "裁剪框的寬或高沒有設置",
  "up.empty.car": "購物車為空",
  "up.empty.page": "頁面不存在",
  "up.empty.search": "沒有搜索結果",
  "up.empty.address": "沒有收貨地址",
  "up.empty.wifi": "沒有WiFi",
  "up.empty.order": "訂單為空",
  "up.empty.coupon": "沒有優惠券",
  "up.empty.favor": "暫無收藏",
  "up.empty.permission": "無權限",
  "up.empty.history": "無歷史記錄",
  "up.empty.news": "無新聞列表",
  "up.empty.message": "消息列表為空",
  "up.empty.list": "列表為空",
  "up.empty.data": "數據為空",
  "up.empty.comment": "暫無評論",
  "up.link.copyed": "鏈接已複製，請在瀏覽器打開",
  "up.loadmoe.loadmore": "加載更多",
  "up.loadmoe.nomore": "沒有更多了",
  "up.noNetwork.text": "哎呀，網絡信號丟失",
  "up.noNetwork.pleaseCheck": "請檢查網絡，或前往",
  "up.noNetwork.connect": "網絡已連接",
  "up.noNetwork.disconnect": "無網絡連接",
  "up.pagination.previous": "上一頁",
  "up.pagination.next": "下一頁",
  "up.pullRefresh.pull": "下拉刷新",
  "up.pullRefresh.release": "釋放刷新",
  "up.pullRefresh.refreshing": "正在刷新",
  "up.readMore.expand": "展開閱讀全文",
  "up.readMore.fold": "收起",
  "up.search.placeholder": "請輸入關鍵字",
  "up.signature.penSize": "筆畫大小",
  "up.signature.penColor": "筆畫顏色",
  "up.upload.sizeExceed": "超過大小限制",
  "up.upload.uploading": "上傳中",
  "up.upload.previewImageFail": "預覽圖片失敗",
  "up.upload.previewVideoFail": "預覽視頻失敗",
  "up.goodsSku.stock": "庫存",
  "up.goodsSku.price": "價格",
  "up.goodsSku.amount": "件",
  "up.goodsSku.choosed": "已選",
  "up.goodsSku.buyAmount": "購買數量"
};
const en$1 = {
  "up.common.cancel": "Cancel",
  "up.common.confirm": "Confirm",
  "up.common.start": "Start",
  "up.common.end": "End",
  "up.common.stop": "Stop",
  "up.common.copy": "Copy",
  "up.common.none": "None",
  "up.common.tip": "Tip",
  "up.common.success": "Success",
  "up.common.fail": "Fail",
  "up.common.close": "Close",
  "up.common.preview": "Preview",
  "up.common.re-select": "Re-select",
  "up.common.rotate": "Rotate",
  "up.common.pleaseChoose": "Please choose",
  "up.common.loading": "Loading",
  "up.common.loading2": "Loading",
  "up.common.inOperation": "In operation",
  "up.common.settings": "Settings",
  "up.common.retry": "Retry",
  "up.common.search": "Search",
  "up.common.more": "More",
  "up.common.video": "Video",
  "up.common.file": "File",
  "up.week.one": "Mon",
  "up.week.two": "Tue",
  "up.week.three": "Wed",
  "up.week.four": "Thu",
  "up.week.five": "Fri",
  "up.week.six": "Sat",
  "up.week.seven": "Sun",
  "up.barcode.error": "Failed to generate barcode",
  "up.calendar.chooseDates": "Date selection",
  "up.calendar.disabled": "This date is disabled",
  "up.calendar.daysExceed": "The number of selected days cannot exceed {days} days",
  "up.calendar.today": "Today",
  "up.cityLocate.locateCity": "Locate city",
  "up.cityLocate.fail": "Location failed, please click to retry.",
  "up.cityLocate.locating": "Locating",
  "up.code.send": "Get verification code",
  "up.code.resendAfter": "Resend after X seconds",
  "up.code.resend": "Resend",
  "up.cropper.emptyWidhtOrHeight": "The width or height of the cropping box is not set",
  "up.empty.car": "Shopping cart is empty",
  "up.empty.page": "Page not found",
  "up.empty.search": "No search results",
  "up.empty.address": "No shipping address",
  "up.empty.wifi": "No WiFi",
  "up.empty.order": "Order is empty",
  "up.empty.coupon": "No coupons",
  "up.empty.favor": "No favorites",
  "up.empty.permission": "No permission",
  "up.empty.history": "No history",
  "up.empty.news": "No news list",
  "up.empty.message": "Message list is empty",
  "up.empty.list": "List is empty",
  "up.empty.data": "Data is empty",
  "up.empty.comment": "No comments",
  "up.link.copyed": "Link copied, please open in browser",
  "up.loadmoe.loadmore": "Load more",
  "up.loadmoe.nomore": "No more",
  "up.noNetwork.text": "Oops, network signal lost",
  "up.noNetwork.pleaseCheck": "Please check the network, or go to",
  "up.noNetwork.connect": "Network connected",
  "up.noNetwork.disconnect": "No network connection",
  "up.pagination.previous": "Previous",
  "up.pagination.next": "Next",
  "up.pullRefresh.pull": "Pull to refresh",
  "up.pullRefresh.release": "Release to refresh",
  "up.pullRefresh.refreshing": "Refreshing",
  "up.readMore.expand": "Expand to read more",
  "up.readMore.fold": "Collapse",
  "up.search.placeholder": "Please enter keywords",
  "up.signature.penSize": "Stroke size",
  "up.signature.penColor": "Stroke color",
  "up.upload.sizeExceed": "Size limit exceeded",
  "up.upload.uploading": "Uploading",
  "up.upload.previewImageFail": "Failed to preview image",
  "up.upload.previewVideoFail": "Failed to preview video",
  "up.goodsSku.stock": "Stock",
  "up.goodsSku.price": "Price",
  "up.goodsSku.amount": "Items",
  "up.goodsSku.choosed": "Selected",
  "up.goodsSku.buyAmount": "Quantity"
};
const es = {
  "up.common.cancel": "Cancelar",
  "up.common.confirm": "Confirmar",
  "up.common.start": "Iniciar",
  "up.common.end": "Finalizar",
  "up.common.stop": "Detener",
  "up.common.copy": "Copiar",
  "up.common.none": "Ninguno",
  "up.common.tip": "Consejo",
  "up.common.success": "Éxito",
  "up.common.fail": "Fallido",
  "up.common.close": "Cerrar",
  "up.common.preview": "Vista previa",
  "up.common.re-select": "Re seleccionar",
  "up.common.rotate": "Rotar",
  "up.common.pleaseChoose": "Por favor seleccione",
  "up.common.loading": "Cargando",
  "up.common.loading2": "Cargando",
  "up.common.inOperation": "En operación",
  "up.common.settings": "Configuración",
  "up.common.retry": "Reintentar",
  "up.common.search": "Buscar",
  "up.common.more": "Más",
  "up.common.video": "Vídeo",
  "up.common.file": "Archivo",
  "up.week.one": "Lun",
  "up.week.two": "Mar",
  "up.week.three": "Mié",
  "up.week.four": "Jue",
  "up.week.five": "Vie",
  "up.week.six": "Sáb",
  "up.week.seven": "Dom",
  "up.barcode.error": "Error al generar código de barras",
  "up.calendar.chooseDates": "Selección de fecha",
  "up.calendar.disabled": "Esta fecha está deshabilitada",
  "up.calendar.daysExceed": "Los días seleccionados no pueden exceder {days} días",
  "up.calendar.today": "Hoy",
  "up.cityLocate.locateCity": "Localizar ciudad",
  "up.cityLocate.fail": "Error de localización, haga clic para reintentar.",
  "up.cityLocate.locating": "Localizando",
  "up.code.send": "Obtener código de verificación",
  "up.code.resendAfter": "Reenviar en X segundos",
  "up.code.resend": "Reenviar",
  "up.cropper.emptyWidhtOrHeight": "El ancho o alto del recorte no está configurado",
  "up.empty.car": "Carrito de compras vacío",
  "up.empty.page": "Página no encontrada",
  "up.empty.search": "Sin resultados de búsqueda",
  "up.empty.address": "Sin dirección de envío",
  "up.empty.wifi": "Sin WiFi",
  "up.empty.order": "Pedido vacío",
  "up.empty.coupon": "Sin cupones",
  "up.empty.favor": "Sin favoritos",
  "up.empty.permission": "Sin permisos",
  "up.empty.history": "Sin historial",
  "up.empty.news": "Sin noticias",
  "up.empty.message": "Lista de mensajes vacía",
  "up.empty.list": "Lista vacía",
  "up.empty.data": "Datos vacíos",
  "up.empty.comment": "Sin comentarios",
  "up.link.copyed": "Enlace copiado, por favor abra en el navegador",
  "up.loadmoe.loadmore": "Cargar más",
  "up.loadmoe.nomore": "No hay más",
  "up.noNetwork.text": "¡Ups! Se perdió la señal de red",
  "up.noNetwork.pleaseCheck": "Por favor verifique la red, o vaya a",
  "up.noNetwork.connect": "Red conectada",
  "up.noNetwork.disconnect": "Sin conexión a internet",
  "up.pagination.previous": "Página anterior",
  "up.pagination.next": "Página siguiente",
  "up.pullRefresh.pull": "Deslizar hacia abajo para actualizar",
  "up.pullRefresh.release": "Soltar para actualizar",
  "up.pullRefresh.refreshing": "Actualizando",
  "up.readMore.expand": "Expandir para leer más",
  "up.readMore.fold": "Contraer",
  "up.search.placeholder": "Ingrese palabra clave",
  "up.signature.penSize": "Tamaño del trazo",
  "up.signature.penColor": "Color del trazo",
  "up.upload.sizeExceed": "Excede el límite de tamaño",
  "up.upload.uploading": "Subiendo",
  "up.upload.previewImageFail": "Error al previsualizar imagen",
  "up.upload.previewVideoFail": "Error al previsualizar vídeo",
  "up.goodsSku.stock": "Inventario",
  "up.goodsSku.price": "Precio",
  "up.goodsSku.amount": "Piezas",
  "up.goodsSku.choosed": "Seleccionado",
  "up.goodsSku.buyAmount": "Cantidad"
};
const fr$1 = {
  "up.common.cancel": "Annuler",
  "up.common.confirm": "Confirmer",
  "up.common.start": "Démarrer",
  "up.common.end": "Terminer",
  "up.common.stop": "Arrêter",
  "up.common.copy": "Copier",
  "up.common.none": "Aucun",
  "up.common.tip": "Conseil",
  "up.common.success": "Succès",
  "up.common.fail": "Échec",
  "up.common.close": "Fermer",
  "up.common.preview": "Aperçu",
  "up.common.re-select": "Resélectionner",
  "up.common.rotate": "Rotation",
  "up.common.pleaseChoose": "Veuillez choisir",
  "up.common.loading": "Chargement",
  "up.common.loading2": "Chargement en cours",
  "up.common.inOperation": "En cours d'opération",
  "up.common.settings": "Paramètres",
  "up.common.retry": "Réessayer",
  "up.common.search": "Rechercher",
  "up.common.more": "Plus",
  "up.common.video": "Vidéo",
  "up.common.file": "Fichier",
  "up.week.one": "Lun",
  "up.week.two": "Mar",
  "up.week.three": "Mer",
  "up.week.four": "Jeu",
  "up.week.five": "Ven",
  "up.week.six": "Sam",
  "up.week.seven": "Dim",
  "up.barcode.error": "Échec de génération du code-barres",
  "up.calendar.chooseDates": "Sélection de dates",
  "up.calendar.disabled": "Cette date est désactivée",
  "up.calendar.daysExceed": "Le nombre de jours sélectionnés ne peut pas dépasser {days} jours",
  "up.calendar.today": "Aujourd'hui",
  "up.cityLocate.locateCity": "Localiser la ville",
  "up.cityLocate.fail": "Échec de localisation, veuillez cliquer pour réessayer.",
  "up.cityLocate.locating": "Localisation en cours",
  "up.code.send": "Obtenir le code de vérification",
  "up.code.resendAfter": "Renvoyer dans X secondes",
  "up.code.resend": "Renvoyer",
  "up.cropper.emptyWidhtOrHeight": "La largeur ou la hauteur de recadrage n'est pas définie",
  "up.empty.car": "Panier vide",
  "up.empty.page": "Page introuvable",
  "up.empty.search": "Aucun résultat de recherche",
  "up.empty.address": "Aucune adresse de livraison",
  "up.empty.wifi": "Aucun Wi-Fi",
  "up.empty.order": "Commande vide",
  "up.empty.coupon": "Aucun coupon",
  "up.empty.favor": "Aucun favori",
  "up.empty.permission": "Aucune autorisation",
  "up.empty.history": "Aucun historique",
  "up.empty.news": "Aucune actualité",
  "up.empty.message": "Liste de messages vide",
  "up.empty.list": "Liste vide",
  "up.empty.data": "Données vides",
  "up.empty.comment": "Aucun commentaire",
  "up.link.copyed": "Lien copié, veuillez ouvrir dans le navigateur",
  "up.loadmoe.loadmore": "Charger plus",
  "up.loadmoe.nomore": "Plus de contenu",
  "up.noNetwork.text": "Oups, le signal réseau est perdu",
  "up.noNetwork.pleaseCheck": "Veuillez vérifier le réseau, ou aller à",
  "up.noNetwork.connect": "Réseau connecté",
  "up.noNetwork.disconnect": "Aucune connexion réseau",
  "up.pagination.previous": "Page précédente",
  "up.pagination.next": "Page suivante",
  "up.pullRefresh.pull": "Tirer pour actualiser",
  "up.pullRefresh.release": "Relâcher pour actualiser",
  "up.pullRefresh.refreshing": "Actualisation en cours",
  "up.readMore.expand": "Développer pour lire la suite",
  "up.readMore.fold": "Réduire",
  "up.search.placeholder": "Veuillez saisir un mot-clé",
  "up.signature.penSize": "Taille du trait",
  "up.signature.penColor": "Couleur du trait",
  "up.upload.sizeExceed": "Dépassement de la limite de taille",
  "up.upload.uploading": "Téléchargement en cours",
  "up.upload.previewImageFail": "Échec de l'aperçu de l'image",
  "up.upload.previewVideoFail": "Échec de l'aperçu de la vidéo",
  "up.goodsSku.stock": "Stock",
  "up.goodsSku.price": "Prix",
  "up.goodsSku.amount": "Pièces",
  "up.goodsSku.choosed": "Sélectionné",
  "up.goodsSku.buyAmount": "Quantité"
};
const de$1 = {
  "up.common.cancel": "Abbrechen",
  "up.common.confirm": "Bestätigen",
  "up.common.start": "Start",
  "up.common.end": "Ende",
  "up.common.stop": "Stopp",
  "up.common.copy": "Kopieren",
  "up.common.none": "Keine",
  "up.common.tip": "Hinweis",
  "up.common.success": "Erfolg",
  "up.common.fail": "Fehlgeschlagen",
  "up.common.close": "Schließen",
  "up.common.preview": "Vorschau",
  "up.common.re-select": "Erneut auswählen",
  "up.common.rotate": "Drehen",
  "up.common.pleaseChoose": "Bitte wählen",
  "up.common.loading": "Laden",
  "up.common.loading2": "Wird geladen",
  "up.common.inOperation": "In Bearbeitung",
  "up.common.settings": "Einstellungen",
  "up.common.retry": "Wiederholen",
  "up.common.search": "Suchen",
  "up.common.more": "Mehr",
  "up.common.video": "Video",
  "up.common.file": "Datei",
  "up.week.one": "Mo",
  "up.week.two": "Di",
  "up.week.three": "Mi",
  "up.week.four": "Do",
  "up.week.five": "Fr",
  "up.week.six": "Sa",
  "up.week.seven": "So",
  "up.barcode.error": "Barcode-Generierung fehlgeschlagen",
  "up.calendar.chooseDates": "Datumsauswahl",
  "up.calendar.disabled": "Dieses Datum ist deaktiviert",
  "up.calendar.daysExceed": "Die Anzahl der ausgewählten Tage darf {days} Tage nicht überschreiten",
  "up.calendar.today": "Heute",
  "up.cityLocate.locateCity": "Stadt lokalisieren",
  "up.cityLocate.fail": "Lokalisierung fehlgeschlagen, bitte klicken Sie zum Wiederholen.",
  "up.cityLocate.locating": "Lokalisierung läuft",
  "up.code.send": "Bestätigungscode erhalten",
  "up.code.resendAfter": "Erneut senden in X Sekunden",
  "up.code.resend": "Erneut senden",
  "up.cropper.emptyWidhtOrHeight": "Breite oder Höhe des Zuschneidebereichs nicht festgelegt",
  "up.empty.car": "Warenkorb ist leer",
  "up.empty.page": "Seite existiert nicht",
  "up.empty.search": "Keine Suchergebnisse",
  "up.empty.address": "Keine Lieferadresse",
  "up.empty.wifi": "Kein WLAN",
  "up.empty.order": "Bestellungen sind leer",
  "up.empty.coupon": "Keine Gutscheine",
  "up.empty.favor": "Keine Favoriten",
  "up.empty.permission": "Keine Berechtigung",
  "up.empty.history": "Kein Verlauf",
  "up.empty.news": "Keine Nachrichtenliste",
  "up.empty.message": "Nachrichtenliste ist leer",
  "up.empty.list": "Liste ist leer",
  "up.empty.data": "Daten sind leer",
  "up.empty.comment": "Keine Kommentare",
  "up.link.copyed": "Link kopiert, bitte im Browser öffnen",
  "up.loadmoe.loadmore": "Mehr laden",
  "up.loadmoe.nomore": "Keine weiteren Daten",
  "up.noNetwork.text": "Ups, Netzwerksignal verloren",
  "up.noNetwork.pleaseCheck": "Bitte überprüfen Sie das Netzwerk oder gehen Sie zu",
  "up.noNetwork.connect": "Netzwerk verbunden",
  "up.noNetwork.disconnect": "Keine Netzwerkverbindung",
  "up.pagination.previous": "Vorherige Seite",
  "up.pagination.next": "Nächste Seite",
  "up.pullRefresh.pull": "Zum Aktualisieren nach unten ziehen",
  "up.pullRefresh.release": "Loslassen zum Aktualisieren",
  "up.pullRefresh.refreshing": "Aktualisierung läuft",
  "up.readMore.expand": "Erweitern zum vollständigen Lesen",
  "up.readMore.fold": "Einklappen",
  "up.search.placeholder": "Bitte Schlüsselwort eingeben",
  "up.signature.penSize": "Strichstärke",
  "up.signature.penColor": "Strichfarbe",
  "up.upload.sizeExceed": "Größenbegrenzung überschritten",
  "up.upload.uploading": "Upload läuft",
  "up.upload.previewImageFail": "Bildvorschau fehlgeschlagen",
  "up.upload.previewVideoFail": "Videovorschau fehlgeschlagen",
  "up.goodsSku.stock": "Lagerbestand",
  "up.goodsSku.price": "Preis",
  "up.goodsSku.amount": "Stück",
  "up.goodsSku.choosed": "Ausgewählt",
  "up.goodsSku.buyAmount": "Anzahl"
};
const ko = {
  "up.common.cancel": "취소",
  "up.common.confirm": "확인",
  "up.common.start": "시작",
  "up.common.end": "종료",
  "up.common.stop": "정지",
  "up.common.copy": "복사",
  "up.common.none": "없음",
  "up.common.tip": "팁",
  "up.common.success": "성공",
  "up.common.fail": "실패",
  "up.common.close": "닫기",
  "up.common.preview": "미리보기",
  "up.common.re-select": "재선택",
  "up.common.rotate": "회전",
  "up.common.pleaseChoose": "선택해주세요",
  "up.common.loading": "로딩중",
  "up.common.loading2": "로딩중",
  "up.common.inOperation": "작업중",
  "up.common.settings": "설정",
  "up.common.retry": "재시도",
  "up.common.search": "검색",
  "up.common.more": "더보기",
  "up.common.video": "비디오",
  "up.common.file": "파일",
  "up.week.one": "월",
  "up.week.two": "화",
  "up.week.three": "수",
  "up.week.four": "목",
  "up.week.five": "금",
  "up.week.six": "토",
  "up.week.seven": "일",
  "up.barcode.error": "바코드 생성 실패",
  "up.calendar.chooseDates": "날짜 선택",
  "up.calendar.disabled": "해당 날짜는 사용할 수 없습니다",
  "up.calendar.daysExceed": "선택한 날짜 수가 {days}일을 초과할 수 없습니다",
  "up.calendar.today": "오늘",
  "up.cityLocate.locateCity": "도시 위치 찾기",
  "up.cityLocate.fail": "위치 찾기 실패, 다시 시도하려면 클릭하세요.",
  "up.cityLocate.locating": "위치 찾는 중",
  "up.code.send": "인증코드 받기",
  "up.code.resendAfter": "X초 후 재전송",
  "up.code.resend": "재전송",
  "up.cropper.emptyWidhtOrHeight": "자르기 영역의 너비 또는 높이가 설정되지 않았습니다",
  "up.empty.car": "장바구니가 비어 있습니다",
  "up.empty.page": "페이지가 존재하지 않습니다",
  "up.empty.search": "검색 결과가 없습니다",
  "up.empty.address": "배송 주소가 없습니다",
  "up.empty.wifi": "Wi-Fi가 없습니다",
  "up.empty.order": "주문이 없습니다",
  "up.empty.coupon": "쿠폰이 없습니다",
  "up.empty.favor": "즐겨찾기가 없습니다",
  "up.empty.permission": "권한이 없습니다",
  "up.empty.history": "기록이 없습니다",
  "up.empty.news": "뉴스가 없습니다",
  "up.empty.message": "메시지가 없습니다",
  "up.empty.list": "목록이 비어 있습니다",
  "up.empty.data": "데이터가 없습니다",
  "up.empty.comment": "댓글이 없습니다",
  "up.link.copyed": "링크가 복사되었습니다. 브라우저에서 열어주세요",
  "up.loadmoe.loadmore": "더 불러오기",
  "up.loadmoe.nomore": "더 이상 데이터가 없습니다",
  "up.noNetwork.text": "네트워크 신호가 없습니다",
  "up.noNetwork.pleaseCheck": "네트워크를 확인하거나 이동하세요",
  "up.noNetwork.connect": "네트워크 연결됨",
  "up.noNetwork.disconnect": "네트워크 연결 끊김",
  "up.pagination.previous": "이전 페이지",
  "up.pagination.next": "다음 페이지",
  "up.pullRefresh.pull": "당겨서 새로고침",
  "up.pullRefresh.release": "놓아서 새로고침",
  "up.pullRefresh.refreshing": "새로고침 중",
  "up.readMore.expand": "펼쳐서 전체 보기",
  "up.readMore.fold": "접기",
  "up.search.placeholder": "키워드를 입력하세요",
  "up.signature.penSize": "선 굵기",
  "up.signature.penColor": "선 색상",
  "up.upload.sizeExceed": "용량 제한 초과",
  "up.upload.uploading": "업로드 중",
  "up.upload.previewImageFail": "이미지 미리보기 실패",
  "up.upload.previewVideoFail": "비디오 미리보기 실패",
  "up.goodsSku.stock": "재고",
  "up.goodsSku.price": "가격",
  "up.goodsSku.amount": "개",
  "up.goodsSku.choosed": "선택됨",
  "up.goodsSku.buyAmount": "구매 수량"
};
const ja = {
  "up.common.cancel": "キャンセル",
  "up.common.confirm": "確認",
  "up.common.start": "開始",
  "up.common.end": "終了",
  "up.common.stop": "停止",
  "up.common.copy": "コピー",
  "up.common.none": "なし",
  "up.common.tip": "ヒント",
  "up.common.success": "成功",
  "up.common.fail": "失敗",
  "up.common.close": "閉じる",
  "up.common.preview": "プレビュー",
  "up.common.re-select": "再選択",
  "up.common.rotate": "回転",
  "up.common.pleaseChoose": "選択してください",
  "up.common.loading": "読み込み中",
  "up.common.loading2": "読み込み中",
  "up.common.inOperation": "操作中",
  "up.common.settings": "設定",
  "up.common.retry": "再試行",
  "up.common.search": "検索",
  "up.common.more": "もっと見る",
  "up.common.video": "ビデオ",
  "up.common.file": "ファイル",
  "up.week.one": "月",
  "up.week.two": "火",
  "up.week.three": "水",
  "up.week.four": "木",
  "up.week.five": "金",
  "up.week.six": "土",
  "up.week.seven": "日",
  "up.barcode.error": "バーコードの生成に失敗しました",
  "up.calendar.chooseDates": "日付選択",
  "up.calendar.disabled": "この日付は無効です",
  "up.calendar.daysExceed": "選択日数は{days}日を超えることはできません",
  "up.calendar.today": "今日",
  "up.cityLocate.locateCity": "都市の位置を特定",
  "up.cityLocate.fail": "位置特定に失敗しました。再試行するにはクリックしてください。",
  "up.cityLocate.locating": "位置特定中",
  "up.code.send": "認証コードを取得",
  "up.code.resendAfter": "X秒後に再送信",
  "up.code.resend": "再送信",
  "up.cropper.emptyWidhtOrHeight": "切り抜き枠の幅または高さが設定されていません",
  "up.empty.car": "ショッピングカートは空です",
  "up.empty.page": "ページが存在しません",
  "up.empty.search": "検索結果がありません",
  "up.empty.address": "配送先住所がありません",
  "up.empty.wifi": "Wi-Fiがありません",
  "up.empty.order": "注文がありません",
  "up.empty.coupon": "クーポンがありません",
  "up.empty.favor": "お気に入りがありません",
  "up.empty.permission": "権限がありません",
  "up.empty.history": "履歴がありません",
  "up.empty.news": "ニュースがありません",
  "up.empty.message": "メッセージがありません",
  "up.empty.list": "リストが空です",
  "up.empty.data": "データがありません",
  "up.empty.comment": "コメントがありません",
  "up.link.copyed": "リンクがコピーされました。ブラウザで開いてください",
  "up.loadmoe.loadmore": "さらに読み込む",
  "up.loadmoe.nomore": "これ以上データがありません",
  "up.noNetwork.text": "ネットワーク信号が失われました",
  "up.noNetwork.pleaseCheck": "ネットワークを確認するか、移動してください",
  "up.noNetwork.connect": "ネットワーク接続済み",
  "up.noNetwork.disconnect": "ネットワーク未接続",
  "up.pagination.previous": "前へ",
  "up.pagination.next": "次へ",
  "up.pullRefresh.pull": "引き下げて更新",
  "up.pullRefresh.release": "指を離して更新",
  "up.pullRefresh.refreshing": "更新中",
  "up.readMore.expand": "全文表示",
  "up.readMore.fold": "折りたたむ",
  "up.search.placeholder": "キーワードを入力してください",
  "up.signature.penSize": "線の太さ",
  "up.signature.penColor": "線の色",
  "up.upload.sizeExceed": "サイズ制限を超えています",
  "up.upload.uploading": "アップロード中",
  "up.upload.previewImageFail": "画像プレビュー失敗",
  "up.upload.previewVideoFail": "ビデオプレビュー失敗",
  "up.goodsSku.stock": "在庫",
  "up.goodsSku.price": "価格",
  "up.goodsSku.amount": "個",
  "up.goodsSku.choosed": "選択済み",
  "up.goodsSku.buyAmount": "購入数量"
};
const ru = {
  "up.common.cancel": "Отмена",
  "up.common.confirm": "Подтвердить",
  "up.common.start": "Начало",
  "up.common.end": "Конец",
  "up.common.stop": "Стоп",
  "up.common.copy": "Копировать",
  "up.common.none": "Нет",
  "up.common.tip": "Подсказка",
  "up.common.success": "Успех",
  "up.common.fail": "Ошибка",
  "up.common.close": "Закрыть",
  "up.common.preview": "Предпросмотр",
  "up.common.re-select": "Выбрать снова",
  "up.common.rotate": "Повернуть",
  "up.common.pleaseChoose": "Пожалуйста, выберите",
  "up.common.loading": "Загрузка",
  "up.common.loading2": "Загружается",
  "up.common.inOperation": "В процессе",
  "up.common.settings": "Настройки",
  "up.common.retry": "Повторить",
  "up.common.search": "Поиск",
  "up.common.more": "Больше",
  "up.common.video": "Видео",
  "up.common.file": "Файл",
  "up.week.one": "Пн",
  "up.week.two": "Вт",
  "up.week.three": "Ср",
  "up.week.four": "Чт",
  "up.week.five": "Пт",
  "up.week.six": "Сб",
  "up.week.seven": "Вс",
  "up.barcode.error": "Ошибка генерации штрихкода",
  "up.calendar.chooseDates": "Выбор даты",
  "up.calendar.disabled": "Эта дата отключена",
  "up.calendar.daysExceed": "Количество выбранных дней не может превышать {days} дней",
  "up.calendar.today": "Сегодня",
  "up.cityLocate.locateCity": "Определение города",
  "up.cityLocate.fail": "Ошибка определения местоположения, нажмите для повтора.",
  "up.cityLocate.locating": "Определение местоположения",
  "up.code.send": "Получить код подтверждения",
  "up.code.resendAfter": "Повторная отправка через X секунд",
  "up.code.resend": "Отправить снова",
  "up.cropper.emptyWidhtOrHeight": "Ширина или высота области обрезки не задана",
  "up.empty.car": "Корзина пуста",
  "up.empty.page": "Страница не существует",
  "up.empty.search": "Нет результатов поиска",
  "up.empty.address": "Нет адреса доставки",
  "up.empty.wifi": "Нет Wi-Fi",
  "up.empty.order": "Заказы отсутствуют",
  "up.empty.coupon": "Нет купонов",
  "up.empty.favor": "Нет избранного",
  "up.empty.permission": "Нет разрешения",
  "up.empty.history": "Нет истории",
  "up.empty.news": "Нет новостей",
  "up.empty.message": "Список сообщений пуст",
  "up.empty.list": "Список пуст",
  "up.empty.data": "Нет данных",
  "up.empty.comment": "Нет комментариев",
  "up.link.copyed": "Ссылка скопирована, откройте в браузере",
  "up.loadmoe.loadmore": "Загрузить еще",
  "up.loadmoe.nomore": "Больше нет данных",
  "up.noNetwork.text": "Ой, потеряно сетевое соединение",
  "up.noNetwork.pleaseCheck": "Проверьте сеть или перейдите к",
  "up.noNetwork.connect": "Сеть подключена",
  "up.noNetwork.disconnect": "Нет сетевого подключения",
  "up.pagination.previous": "Предыдущая страница",
  "up.pagination.next": "Следующая страница",
  "up.pullRefresh.pull": "Потяните вниз для обновления",
  "up.pullRefresh.release": "Отпустите для обновления",
  "up.pullRefresh.refreshing": "Обновление",
  "up.readMore.expand": "Развернуть для полного чтения",
  "up.readMore.fold": "Свернуть",
  "up.search.placeholder": "Введите ключевое слово",
  "up.signature.penSize": "Размер штриха",
  "up.signature.penColor": "Цвет штриха",
  "up.upload.sizeExceed": "Превышен лимит размера",
  "up.upload.uploading": "Загрузка",
  "up.upload.previewImageFail": "Ошибка предпросмотра изображения",
  "up.upload.previewVideoFail": "Ошибка предпросмотра видео",
  "up.goodsSku.stock": "Запас",
  "up.goodsSku.price": "Цена",
  "up.goodsSku.amount": "Штук",
  "up.goodsSku.choosed": "Выбрано",
  "up.goodsSku.buyAmount": "Количество"
};
let settings = {
  lang: index$1.getLocale(),
  locales: {
    en: en$1,
    es,
    fr: fr$1,
    de: de$1,
    ko,
    ja,
    ru,
    "zh-Hant": zhHant,
    "zh-Hans": zhHans
  }
};
index$1.onLocaleChange((locale) => {
  settings.lang = locale;
});
function t$1(value, params2 = {}) {
  if (value) {
    let lang = settings.lang;
    if (!settings.locales[settings.lang]) {
      lang = "zh-Hans";
    }
    let result = settings.locales[lang][value] || value;
    Object.keys(params2).forEach((key) => {
      const reg = new RegExp(`{${key}}`, "g");
      result = result.replace(reg, params2[key]);
    });
    return result;
  } else {
    return value;
  }
}
const Calendar = {
  // calendar 组件
  calendar: {
    title: t$1("up.calendar.chooseDates"),
    showTitle: true,
    showSubtitle: true,
    mode: "single",
    startText: t$1("up.common.start"),
    endText: t$1("up.common.end"),
    customList: [],
    color: "#3c9cff",
    minDate: 0,
    maxDate: 0,
    defaultDate: null,
    maxCount: Number.MAX_SAFE_INTEGER,
    // Infinity
    rowHeight: 56,
    formatter: null,
    showLunar: false,
    showMark: true,
    confirmText: t$1("up.common.confirm"),
    confirmDisabledText: t$1("up.common.confirm"),
    show: false,
    closeOnClickOverlay: false,
    readonly: false,
    showConfirm: true,
    maxRange: Number.MAX_SAFE_INTEGER,
    // Infinity
    rangePrompt: "",
    showRangePrompt: true,
    allowSameDay: false,
    rangeResultMode: "all",
    enableTime: false,
    timePrecision: "minute",
    defaultTime: "",
    round: 0,
    monthNum: 3,
    monthSwitch: false,
    showToday: true,
    todayColor: "",
    weekText: [t$1("up.week.one"), t$1("up.week.two"), t$1("up.week.three"), t$1("up.week.four"), t$1("up.week.five"), t$1("up.week.six"), t$1("up.week.seven")],
    forbidDays: [],
    forbidDaysToast: t$1("up.calendar.disabled"),
    monthFormat: "",
    pageInline: false
  }
};
const CalendarStrip = {
  calendarStrip: {
    modelValue: null,
    minDate: 0,
    maxDate: 0,
    color: "#3c9cff",
    weekText: [
      t$1("up.week.one"),
      t$1("up.week.two"),
      t$1("up.week.three"),
      t$1("up.week.four"),
      t$1("up.week.five"),
      t$1("up.week.six"),
      t$1("up.week.seven")
    ],
    fullCalendar: true,
    fullCalendarProps: {},
    fullMonthNum: 24,
    pullDownThreshold: 40,
    collapseAfterSelect: true,
    readonly: false,
    showToday: true,
    monthFormat: "",
    expandHint: "下拉展开月历",
    collapseHint: "上拉收起月历"
  }
};
const CarKeyboard = {
  // 车牌号键盘
  carKeyboard: {
    random: false
  }
};
const Card = {
  // card组件的props
  card: {
    full: false,
    title: "",
    titleColor: "#303133",
    titleSize: "15px",
    subTitle: "",
    subTitleColor: "#909399",
    subTitleSize: "13px",
    border: true,
    index: "",
    margin: "15px",
    borderRadius: "8px",
    headStyle: {},
    bodyStyle: {},
    footStyle: {},
    headBorderBottom: true,
    footBorderTop: true,
    thumb: "",
    thumbWidth: "30px",
    thumbCircle: false,
    padding: "15px",
    paddingHead: "",
    paddingBody: "",
    paddingFoot: "",
    showHead: true,
    showFoot: true,
    boxShadow: "none"
  }
};
const Cell = {
  // cell组件的props
  cell: {
    customClass: "",
    title: "",
    label: "",
    value: "",
    icon: "",
    disabled: false,
    border: true,
    center: false,
    url: "",
    linkType: "navigateTo",
    clickable: false,
    isLink: false,
    required: false,
    arrowDirection: "",
    iconStyle: {},
    rightIconStyle: {},
    rightIcon: "arrow-right",
    titleStyle: {},
    size: "",
    stop: true,
    name: ""
  }
};
const CellGroup = {
  // cell-group组件的props
  cellGroup: {
    title: "",
    border: true,
    customStyle: {}
  }
};
const Checkbox = {
  // checkbox组件
  checkbox: {
    name: "",
    shape: "",
    size: "",
    checkbox: false,
    disabled: "",
    activeColor: "",
    inactiveColor: "",
    iconSize: "",
    iconColor: "",
    label: "",
    labelSize: "",
    labelColor: "",
    labelDisabled: ""
  }
};
const CheckboxGroup = {
  // checkbox-group组件
  checkboxGroup: {
    name: "",
    value: [],
    shape: "square",
    disabled: false,
    activeColor: "#2979ff",
    inactiveColor: "#c8c9cc",
    size: 18,
    placement: "row",
    labelSize: 14,
    labelColor: "#303133",
    labelDisabled: false,
    iconColor: "#ffffff",
    iconSize: 12,
    iconPlacement: "left",
    borderBottom: false
  }
};
const CircleProgress = {
  // circleProgress 组件
  circleProgress: {
    percentage: 30
  }
};
const Code = {
  // code 组件
  code: {
    seconds: 60,
    startText: t$1("up.code.send"),
    changeText: t$1("up.code.resendAfter"),
    endText: t$1("up.code.resend"),
    keepRunning: false,
    uniqueKey: ""
  }
};
const CodeInput = {
  // codeInput 组件
  codeInput: {
    adjustPosition: true,
    maxlength: 6,
    dot: false,
    mode: "box",
    hairline: false,
    space: 10,
    value: "",
    focus: false,
    bold: false,
    color: "#606266",
    fontSize: 18,
    size: 35,
    disabledKeyboard: false,
    borderColor: "#c9cacc",
    disabledDot: true
  }
};
const Col = {
  // col 组件
  col: {
    span: 12,
    offset: 0,
    justify: "start",
    align: "stretch",
    textAlign: "left"
  }
};
const Collapse = {
  // collapse 组件
  collapse: {
    value: null,
    accordion: false,
    border: true
  }
};
const CollapseItem = {
  // collapseItem 组件
  collapseItem: {
    title: "",
    value: "",
    label: "",
    disabled: false,
    isLink: true,
    clickable: true,
    border: true,
    align: "left",
    name: "",
    icon: "",
    duration: 300,
    showRight: true,
    titleStyle: {},
    iconStyle: {},
    rightIconStyle: {},
    cellCustomStyle: {},
    cellCustomClass: ""
  }
};
const ColumnNotice = {
  // columnNotice 组件
  columnNotice: {
    text: "",
    icon: "volume",
    mode: "",
    color: "#f9ae3d",
    bgColor: "#fdf6ec",
    fontSize: 14,
    speed: 80,
    step: false,
    duration: 1500,
    disableTouch: true,
    justifyContent: "flex-start"
  }
};
const CountDown = {
  // u-count-down 计时器组件
  countDown: {
    time: 0,
    format: "HH:mm:ss",
    autoStart: true,
    millisecond: false
  }
};
const CountTo = {
  // countTo 组件
  countTo: {
    startVal: 0,
    endVal: 0,
    duration: 2e3,
    autoplay: true,
    decimals: 0,
    useEasing: true,
    decimal: ".",
    color: "#606266",
    fontSize: 22,
    bold: false,
    separator: ""
  }
};
const DatetimePicker = {
  // datetimePicker 组件
  datetimePicker: {
    show: false,
    popupMode: "bottom",
    showToolbar: true,
    value: "",
    title: "",
    mode: "datetime",
    maxDate: new Date((/* @__PURE__ */ new Date()).getFullYear() + 10, 0, 1).getTime(),
    minDate: new Date((/* @__PURE__ */ new Date()).getFullYear() - 10, 0, 1).getTime(),
    minHour: 0,
    maxHour: 23,
    minMinute: 0,
    maxMinute: 59,
    minSecond: 0,
    maxSecond: 59,
    filter: null,
    formatter: null,
    loading: false,
    itemHeight: 44,
    cancelText: t$1("up.common.cancel"),
    confirmText: t$1("up.common.confirm"),
    cancelColor: "#909193",
    confirmColor: "#3c9cff",
    visibleItemCount: 5,
    closeOnClickOverlay: false,
    defaultIndex: [],
    inputBorder: "surround",
    disabled: false,
    disabledColor: "",
    placeholder: t$1("up.common.pleaseChoose"),
    inputProps: {},
    pageInline: false
  }
};
const Divider = {
  // divider组件
  divider: {
    dashed: false,
    hairline: true,
    dot: false,
    textPosition: "center",
    text: "",
    textSize: 14,
    textColor: "#909399",
    lineColor: "#dcdfe6"
  }
};
const Empty = {
  // empty组件
  empty: {
    icon: "",
    text: "",
    textColor: "#c0c4cc",
    textSize: 14,
    iconColor: "#c0c4cc",
    iconSize: 90,
    mode: "data",
    width: 160,
    height: 160,
    show: true,
    marginTop: 0
  }
};
const Form = {
  // form 组件
  form: {
    model: {},
    rules: {},
    errorType: "message",
    borderBottom: true,
    labelPosition: "left",
    labelWidth: 45,
    labelAlign: "left",
    labelStyle: {}
  }
};
const FormItem = {
  // formItem 组件
  formItem: {
    label: "",
    prop: "",
    rules: [],
    borderBottom: "",
    labelPosition: "",
    labelWidth: "",
    rightIcon: "",
    leftIcon: "",
    required: false,
    leftIconStyle: ""
  }
};
const Gap = {
  // gap组件
  gap: {
    bgColor: "transparent",
    height: 20,
    marginTop: 0,
    marginBottom: 0,
    customStyle: {}
  }
};
const Guide = {
  // guide 组件
  guide: {
    show: false,
    list: [],
    storageKey: "up-guide-default",
    once: true,
    showSkip: true,
    skipText: "跳过",
    nextText: "下一步",
    finishText: "立即体验",
    indicator: true,
    bgColor: "#111111",
    zIndex: 10075
  }
};
const Grid = {
  // grid组件
  grid: {
    col: 3,
    border: false,
    align: "left"
  }
};
const GridItem = {
  // grid-item组件
  gridItem: {
    name: null,
    bgColor: "transparent"
  }
};
const {
  color: color$2
} = config;
const Icon = {
  // icon组件
  icon: {
    name: "",
    color: color$2["u-content-color"],
    size: "16px",
    bold: false,
    index: "",
    hoverClass: "",
    customPrefix: "uicon",
    label: "",
    labelPos: "right",
    labelSize: "15px",
    labelColor: color$2["u-content-color"],
    space: "3px",
    imgMode: "",
    width: "",
    height: "",
    top: 0,
    stop: false
  }
};
const Image = {
  // image组件
  image: {
    src: "",
    mode: "aspectFill",
    width: "300",
    height: "225",
    shape: "square",
    radius: 0,
    lazyLoad: true,
    showMenuByLongpress: true,
    loadingIcon: "photo",
    errorIcon: "error-circle",
    showLoading: true,
    showError: true,
    fade: true,
    webp: false,
    duration: 500,
    bgColor: "#f3f4f6"
  }
};
const IndexAnchor = {
  // indexAnchor 组件
  indexAnchor: {
    text: "",
    color: "#606266",
    size: 14,
    bgColor: "#f1f1f1",
    height: 32
  }
};
const IndexList = {
  // indexList 组件
  indexList: {
    inactiveColor: "#606266",
    activeColor: "#5677fc",
    indexList: [],
    sticky: true,
    customNavHeight: 0,
    safeBottomFix: false,
    itemMargin: "0rpx"
  }
};
const Input = {
  // index 组件
  input: {
    value: "",
    type: "text",
    fixed: false,
    disabled: false,
    disabledColor: "",
    clearable: false,
    password: false,
    maxlength: 140,
    placeholder: null,
    placeholderClass: "input-placeholder",
    placeholderStyle: "",
    showWordLimit: false,
    confirmType: "done",
    confirmHold: false,
    holdKeyboard: false,
    focus: false,
    autoBlur: false,
    disableDefaultPadding: false,
    cursor: -1,
    cursorSpacing: 30,
    selectionStart: -1,
    selectionEnd: -1,
    adjustPosition: true,
    inputAlign: "left",
    fontSize: "15px",
    color: "",
    prefixIcon: "",
    prefixIconStyle: "",
    suffixIcon: "",
    suffixIconStyle: "",
    border: "surround",
    readonly: false,
    shape: "square",
    formatter: null,
    cursorColor: "#53c21d",
    passwordVisibilityToggle: true
  }
};
const Keyboard = {
  // 键盘组件
  keyboard: {
    mode: "number",
    dotDisabled: false,
    tooltip: true,
    showTips: true,
    tips: "",
    showCancel: true,
    showConfirm: true,
    random: false,
    safeAreaInsetBottom: true,
    closeOnClickOverlay: true,
    show: false,
    overlay: true,
    zIndex: 10075,
    cancelText: t$1("up.common.cancel"),
    confirmText: t$1("up.common.confirm"),
    autoChange: false
  }
};
const Line = {
  // line组件
  line: {
    color: "#d6d7d9",
    length: "100%",
    direction: "row",
    hairline: true,
    margin: 0,
    dashed: false
  }
};
const LineProgress = {
  // lineProgress 组件
  lineProgress: {
    activeColor: "#19be6b",
    inactiveColor: "#ececec",
    percentage: 0,
    showText: true,
    height: 12,
    fromRight: false
  }
};
const {
  color: color$1
} = config;
const Link = {
  // link超链接组件props参数
  link: {
    color: color$1["u-primary"],
    fontSize: 15,
    underLine: false,
    href: "",
    mpTips: t$1("up.link.copyed"),
    lineColor: "",
    text: ""
  }
};
const List = {
  // list 组件
  list: {
    showScrollbar: false,
    lowerThreshold: 50,
    upperThreshold: 0,
    scrollTop: 0,
    offsetAccuracy: 10,
    enableFlex: false,
    pagingEnabled: false,
    scrollable: true,
    scrollIntoView: "",
    scrollWithAnimation: false,
    enableBackToTop: false,
    height: 0,
    width: 0,
    preLoadScreen: 1
  }
};
const ListItem = {
  // listItem 组件
  listItem: {
    anchor: ""
  }
};
const {
  color
} = config;
const LoadingIcon = {
  // loading-icon加载中图标组件
  loadingIcon: {
    show: true,
    color: color["u-tips-color"],
    textColor: color["u-tips-color"],
    vertical: false,
    mode: "spinner",
    size: 24,
    textSize: 15,
    text: "",
    timingFunction: "ease-in-out",
    duration: 1200,
    inactiveColor: ""
  }
};
const LoadingPage = {
  // loading-page组件
  loadingPage: {
    loadingText: t$1("up.common.loading2"),
    image: "",
    loadingMode: "circle",
    loading: false,
    bgColor: "",
    color: "#C8C8C8",
    fontSize: 19,
    iconSize: 28,
    loadingColor: "#C8C8C8",
    zIndex: 10
  }
};
const Loadmore = {
  // loadmore 组件
  loadmore: {
    status: "loadmore",
    bgColor: "transparent",
    icon: true,
    fontSize: 14,
    iconSize: 17,
    color: "#606266",
    loadingIcon: "spinner",
    loadmoreText: t$1("up.loadmoe.loadmore"),
    loadingText: t$1("up.common.loading2") + "...",
    nomoreText: t$1("up.loadmoe.nomore"),
    isDot: false,
    iconColor: "#b7b7b7",
    marginTop: 10,
    marginBottom: 10,
    height: "auto",
    line: false,
    lineColor: "#E6E8EB",
    dashed: false
  }
};
const Modal = {
  // modal 组件
  modal: {
    show: false,
    title: "",
    content: "",
    confirmText: t$1("up.common.confirm"),
    cancelText: t$1("up.common.cancel"),
    showConfirmButton: true,
    showCancelButton: false,
    confirmColor: "#2979ff",
    cancelColor: "#606266",
    buttonReverse: false,
    zoom: true,
    asyncClose: false,
    closeOnClickOverlay: false,
    negativeTop: 0,
    width: "650rpx",
    confirmButtonShape: "",
    duration: 400,
    contentTextAlign: "left",
    asyncCloseTip: t$1("up.common.inOperation") + "...",
    asyncCancelClose: false,
    contentStyle: {}
  }
};
const Navbar = {
  // navbar 组件
  navbar: {
    safeAreaInsetTop: true,
    placeholder: false,
    fixed: true,
    border: false,
    leftIcon: "arrow-left",
    leftText: "",
    rightText: "",
    rightIcon: "",
    title: "",
    titleColor: "",
    bgColor: "",
    titleWidth: "400rpx",
    height: "44px",
    leftIconSize: 20,
    leftIconColor: "",
    autoBack: false,
    titleStyle: ""
  }
};
const NoNetwork = {
  // noNetwork
  noNetwork: {
    tips: t$1("up.noNetwork.text"),
    zIndex: "",
    image: "data:image/png;base64,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"
  }
};
const NoticeBar = {
  // noticeBar
  noticeBar: {
    text: [],
    direction: "row",
    step: false,
    icon: "volume",
    mode: "",
    color: "#f9ae3d",
    bgColor: "#fdf6ec",
    speed: 80,
    fontSize: 14,
    duration: 2e3,
    disableTouch: true,
    url: "",
    linkType: "navigateTo",
    justifyContent: "flex-start"
  }
};
const Notify = {
  // notify组件
  notify: {
    top: 0,
    type: "primary",
    color: "#ffffff",
    bgColor: "",
    message: "",
    duration: 3e3,
    fontSize: 15,
    safeAreaInsetTop: false
  }
};
const NumberBox = {
  // 步进器组件
  numberBox: {
    name: "",
    value: 0,
    min: 1,
    max: Number.MAX_SAFE_INTEGER,
    step: 1,
    integer: false,
    disabled: false,
    disabledInput: false,
    asyncChange: false,
    inputWidth: 35,
    showMinus: true,
    showPlus: true,
    decimalLength: null,
    longPress: true,
    color: "",
    buttonWidth: 30,
    buttonSize: 30,
    buttonRadius: "0px",
    bgColor: "",
    disabledBgColor: "",
    inputBgColor: "",
    cursorSpacing: 100,
    disableMinus: false,
    disablePlus: false,
    iconStyle: "",
    miniMode: false
  }
};
const NumberKeyboard = {
  // 数字键盘
  numberKeyboard: {
    mode: "number",
    dotDisabled: false,
    random: false
  }
};
const Overlay = {
  // overlay组件
  overlay: {
    show: false,
    zIndex: 10070,
    duration: 300,
    opacity: 0.5
  }
};
const Parse = {
  // parse
  parse: {
    copyLink: true,
    errorImg: "",
    lazyLoad: false,
    loadingImg: "",
    pauseVideo: true,
    previewImg: true,
    setTitle: true,
    showImgMenu: true
  }
};
const Picker = {
  // picker
  picker: {
    show: false,
    popupMode: "bottom",
    showToolbar: true,
    title: "",
    columns: [],
    loading: false,
    itemHeight: 44,
    cancelText: t$1("up.common.cancel"),
    confirmText: t$1("up.common.confirm"),
    cancelColor: "#909193",
    confirmColor: "",
    visibleItemCount: 5,
    keyName: "text",
    valueName: "value",
    closeOnClickOverlay: false,
    defaultIndex: [],
    immediateChange: true,
    zIndex: 10076,
    disabled: false,
    disabledColor: "",
    placeholder: t$1("up.common.pleaseChoose"),
    inputProps: {},
    bgColor: "",
    round: 0,
    duration: 300,
    overlayOpacity: 0.5,
    pageInline: false
  }
};
const Popup = {
  // popup组件
  popup: {
    show: false,
    overlay: true,
    mode: "bottom",
    duration: 300,
    closeable: false,
    overlayStyle: {},
    closeOnClickOverlay: true,
    zIndex: 10075,
    safeAreaInsetBottom: true,
    safeAreaInsetTop: false,
    closeIconPos: "top-right",
    round: "20px",
    zoom: true,
    bgColor: "",
    overlayOpacity: 0.5,
    pageInline: false,
    touchable: false,
    minHeight: "200px",
    maxHeight: "600px"
  }
};
const Radio = {
  // radio组件
  radio: {
    name: "",
    shape: "",
    disabled: "",
    labelDisabled: "",
    activeColor: "",
    inactiveColor: "",
    iconSize: "",
    labelSize: "",
    label: "",
    labelColor: "",
    size: "",
    iconColor: "",
    placement: ""
  }
};
const RadioGroup = {
  // radio-group组件
  radioGroup: {
    value: "",
    disabled: false,
    shape: "circle",
    activeColor: "#2979ff",
    inactiveColor: "#c8c9cc",
    name: "",
    size: 18,
    placement: "row",
    label: "",
    labelColor: "#303133",
    labelSize: 14,
    labelDisabled: false,
    iconColor: "#ffffff",
    iconSize: 12,
    borderBottom: false,
    iconPlacement: "left",
    gap: "10px"
  }
};
const Rate = {
  // rate组件
  rate: {
    value: 1,
    count: 5,
    disabled: false,
    size: 18,
    inactiveColor: "",
    activeColor: "",
    gutter: 4,
    minCount: 1,
    allowHalf: false,
    activeIcon: "star-fill",
    inactiveIcon: "star",
    touchable: true
  }
};
const ReadMore = {
  // readMore
  readMore: {
    showHeight: 400,
    toggle: false,
    closeText: t$1("up.readMore.expand"),
    openText: t$1("up.readMore.fold"),
    color: "#2979ff",
    fontSize: 14,
    textIndent: "2em",
    name: ""
  }
};
const Row = {
  // row
  row: {
    gutter: 0,
    justify: "start",
    align: "center"
  }
};
const RowNotice = {
  // rowNotice
  rowNotice: {
    text: "",
    icon: "volume",
    mode: "",
    color: "#f9ae3d",
    bgColor: "#fdf6ec",
    fontSize: 14,
    speed: 80
  }
};
const ScrollList = {
  // scrollList
  scrollList: {
    indicatorWidth: 50,
    indicatorBarWidth: 20,
    indicator: true,
    indicatorColor: "#f2f2f2",
    indicatorActiveColor: "#3c9cff",
    indicatorStyle: ""
  }
};
const Search = {
  // search
  search: {
    shape: "round",
    bgColor: "",
    placeholder: t$1("up.search.placeholder"),
    clearabled: true,
    focus: false,
    showAction: true,
    actionStyle: {},
    actionText: t$1("up.common.search"),
    inputAlign: "left",
    inputStyle: {},
    disabled: false,
    borderColor: "transparent",
    searchIconColor: "#909399",
    searchIconSize: 22,
    color: "",
    placeholderColor: "",
    searchIcon: "search",
    iconPosition: "left",
    margin: "0",
    animation: false,
    value: "",
    maxlength: "-1",
    height: 32,
    label: null,
    adjustPosition: true,
    autoBlur: true
  }
};
const Section = {
  // u-section组件
  section: {
    title: "",
    subTitle: t$1("up.common.more"),
    right: true,
    fontSize: 15,
    bold: true,
    color: "#303133",
    subColor: "#909399",
    showLine: true,
    lineColor: "",
    arrow: true
  }
};
const Skeleton = {
  // skeleton
  skeleton: {
    loading: true,
    animate: true,
    rows: 0,
    rowsWidth: "100%",
    rowsHeight: 18,
    title: true,
    titleWidth: "50%",
    titleHeight: 18,
    avatar: false,
    avatarSize: 32,
    avatarShape: "circle"
  }
};
const Slider = {
  // slider组件
  slider: {
    value: 0,
    blockSize: 18,
    min: 0,
    max: 100,
    step: 1,
    activeColor: "#2979ff",
    inactiveColor: "#c0c4cc",
    blockColor: "#ffffff",
    showValue: false,
    disabled: false,
    blockStyle: {},
    useNative: false,
    height: "",
    innerStyle: {},
    vertical: false,
    size: "2px",
    length: "auto"
  }
};
const StatusBar = {
  // statusBar
  statusBar: {
    bgColor: "transparent",
    height: 0
  }
};
const Steps = {
  // steps组件
  steps: {
    direction: "row",
    current: 0,
    activeColor: "#3c9cff",
    inactiveColor: "#969799",
    activeIcon: "",
    inactiveIcon: "",
    dot: false
  }
};
const StepsItem = {
  // steps-item组件
  stepsItem: {
    title: "",
    desc: "",
    iconSize: 17,
    error: false
  }
};
const Sticky = {
  // sticky组件
  sticky: {
    offsetTop: 0,
    customNavHeight: 0,
    disabled: false,
    bgColor: "transparent",
    zIndex: "",
    index: ""
  }
};
const Subsection = {
  // subsection组件
  subsection: {
    list: [],
    current: 0,
    activeColor: "#3c9cff",
    inactiveColor: "#303133",
    mode: "button",
    fontSize: 12,
    bold: true,
    bgColor: "#eeeeef",
    keyName: "name",
    activeColorKeyName: "activeColorKey",
    inactiveColorKeyName: "inactiveColorKey",
    disabled: false
  }
};
const SwipeAction = {
  // swipe-action组件
  swipeAction: {
    autoClose: true
  }
};
const SwipeActionItem = {
  // swipeActionItem 组件
  swipeActionItem: {
    show: false,
    closeOnClick: true,
    name: "",
    disabled: false,
    threshold: 20,
    autoClose: true,
    options: [],
    duration: 300
  }
};
const Swiper = {
  // swiper 组件
  swiper: {
    list: [],
    indicator: false,
    indicatorActiveColor: "#FFFFFF",
    indicatorInactiveColor: "rgba(255, 255, 255, 0.35)",
    indicatorStyle: "",
    indicatorMode: "line",
    autoplay: true,
    current: 0,
    currentItemId: "",
    interval: 3e3,
    duration: 300,
    circular: false,
    previousMargin: 0,
    nextMargin: 0,
    acceleration: false,
    displayMultipleItems: 1,
    easingFunction: "default",
    keyName: "url",
    imgMode: "aspectFill",
    height: 130,
    bgColor: "#f3f4f6",
    radius: 4,
    loading: false,
    showTitle: false
  }
};
const SwipterIndicator = {
  // swiperIndicator 组件
  swiperIndicator: {
    length: 0,
    current: 0,
    indicatorActiveColor: "",
    indicatorInactiveColor: "",
    indicatorMode: "line"
  }
};
const Switch = {
  // switch
  switch: {
    loading: false,
    disabled: false,
    size: 25,
    activeColor: "#2979ff",
    inactiveColor: "#ffffff",
    dotActiveColor: "#ffffff",
    dotInactiveColor: "#ffffff",
    value: false,
    activeValue: true,
    inactiveValue: false,
    asyncChange: false,
    space: 0
  }
};
const Tabbar = {
  // tabbar
  tabbar: {
    value: null,
    safeAreaInsetBottom: true,
    border: true,
    zIndex: 1,
    activeColor: "#1989fa",
    inactiveColor: "#7d7e80",
    fixed: true,
    placeholder: true,
    borderColor: "",
    backgroundColor: "",
    styleType: "default",
    animationType: "none",
    activeBackgroundColor: "",
    inactiveBackgroundColor: "",
    itemShape: "default",
    iconScale: 1.1,
    textMode: "always"
  }
};
const TabbarItem = {
  //
  tabbarItem: {
    name: null,
    icon: "",
    activeIcon: "",
    inactiveIcon: "",
    badge: null,
    dot: false,
    text: "",
    badgeStyle: "top: 6px;right:2px;",
    mode: "",
    activeClass: "",
    inactiveClass: "",
    midButtonBgColor: "",
    midButtonIconColor: "",
    midButtonIconSize: 26,
    midButtonBoxShadow: "",
    midButtonInnerBoxShadow: "",
    midButtonOffsetY: -10
  }
};
const Tabs = {
  //
  tabs: {
    duration: 300,
    list: [],
    lineColor: "",
    activeStyle: {
      color: "#303133"
    },
    inactiveStyle: {
      color: "#606266"
    },
    lineWidth: 20,
    lineHeight: 3,
    lineBgSize: "cover",
    itemStyle: {
      height: "44px"
    },
    scrollable: true,
    current: 0,
    keyName: "name",
    iconStyle: {},
    shapeMode: ""
  }
};
const Tag = {
  // tag 组件
  tag: {
    type: "primary",
    disabled: false,
    size: "medium",
    shape: "square",
    text: "",
    bgColor: "",
    color: "",
    borderColor: "",
    closeColor: "#C6C7CB",
    name: "",
    plainFill: false,
    plain: false,
    closable: false,
    show: true,
    icon: "",
    iconColor: "",
    textSize: "",
    height: "",
    padding: "",
    borderRadius: "",
    autoBgColor: 0
  }
};
const Text = {
  // text 组件
  text: {
    type: "",
    show: true,
    text: "",
    prefixIcon: "",
    suffixIcon: "",
    mode: "",
    href: "",
    format: "",
    call: false,
    openType: "",
    bold: false,
    block: false,
    lines: "",
    color: "",
    size: 15,
    iconStyle: {
      fontSize: "15px"
    },
    decoration: "none",
    margin: 0,
    lineHeight: "",
    align: "left",
    wordWrap: "normal",
    flex1: true
  }
};
const Textarea = {
  // textarea 组件
  textarea: {
    value: "",
    placeholder: "",
    placeholderClass: "textarea-placeholder",
    placeholderStyle: "",
    height: 70,
    confirmType: "done",
    disabled: false,
    count: false,
    focus: false,
    autoHeight: false,
    fixed: false,
    cursorSpacing: 0,
    cursor: "",
    showConfirmBar: true,
    selectionStart: -1,
    selectionEnd: -1,
    adjustPosition: true,
    disableDefaultPadding: false,
    holdKeyboard: false,
    maxlength: 140,
    border: "surround",
    formatter: null
  }
};
const Toast = {
  // toast组件
  toast: {
    zIndex: 10090,
    loading: false,
    message: "",
    icon: "",
    type: "",
    loadingMode: "",
    show: "",
    overlay: false,
    position: "center",
    params: {},
    duration: 2e3,
    isTab: false,
    url: "",
    callback: null,
    back: false
  }
};
const Toolbar = {
  // toolbar 组件
  toolbar: {
    show: true,
    cancelText: t$1("up.common.cancel"),
    confirmText: t$1("up.common.confirm"),
    cancelColor: "#909193",
    confirmColor: "",
    title: ""
  }
};
const Tooltip = {
  // tooltip 组件
  tooltip: {
    text: "",
    copyText: "",
    size: 14,
    color: "#606266",
    bgColor: "transparent",
    direction: "top",
    zIndex: 10071,
    showCopy: true,
    buttons: [],
    overlay: true,
    showToast: true,
    popupBgColor: "",
    triggerMode: "longpress",
    forcePosition: {},
    show: false
  }
};
const Transition = {
  // transition动画组件的props
  transition: {
    show: false,
    mode: "fade",
    duration: "300",
    timingFunction: "ease-out"
  }
};
const Upload = {
  // upload组件
  upload: {
    accept: "image",
    extension: [],
    capture: ["album", "camera"],
    compressed: true,
    camera: "back",
    maxDuration: 60,
    uploadIcon: "camera-fill",
    uploadIconColor: "#D3D4D6",
    useBeforeRead: false,
    previewFullImage: true,
    maxCount: 52,
    disabled: false,
    imageMode: "aspectFill",
    name: "",
    sizeType: ["original", "compressed"],
    multiple: false,
    deletable: true,
    maxSize: Number.MAX_VALUE,
    fileList: [],
    uploadText: "",
    width: 80,
    height: 80,
    previewImage: true,
    autoDelete: false,
    autoUpload: false,
    autoUploadApi: "",
    autoUploadAuthUrl: "",
    autoUploadDriver: "",
    autoUploadHeader: {},
    getVideoThumb: false,
    customAfterAutoUpload: false,
    videoPreviewObjectFit: "cover"
  }
};
const props$j = {
  ...ActionSheet,
  ...Album,
  ...Alert,
  ...Avatar,
  ...AvatarGroup,
  ...Backtop,
  ...Badge,
  ...Button,
  ...Calendar,
  ...CalendarStrip,
  ...CarKeyboard,
  ...Card,
  ...Cell,
  ...CellGroup,
  ...Checkbox,
  ...CheckboxGroup,
  ...CircleProgress,
  ...Code,
  ...CodeInput,
  ...Col,
  ...Collapse,
  ...CollapseItem,
  ...ColumnNotice,
  ...CountDown,
  ...CountTo,
  ...DatetimePicker,
  ...Divider,
  ...Empty,
  ...Form,
  ...FormItem,
  ...Gap,
  ...Guide,
  ...Grid,
  ...GridItem,
  ...Icon,
  ...Image,
  ...IndexAnchor,
  ...IndexList,
  ...Input,
  ...Keyboard,
  ...Line,
  ...LineProgress,
  ...Link,
  ...List,
  ...ListItem,
  ...LoadingIcon,
  ...LoadingPage,
  ...Loadmore,
  ...Modal,
  ...Navbar,
  ...NoNetwork,
  ...NoticeBar,
  ...Notify,
  ...NumberBox,
  ...NumberKeyboard,
  ...Overlay,
  ...Parse,
  ...Picker,
  ...Popup,
  ...Radio,
  ...RadioGroup,
  ...Rate,
  ...ReadMore,
  ...Row,
  ...RowNotice,
  ...ScrollList,
  ...Search,
  ...Section,
  ...Skeleton,
  ...Slider,
  ...StatusBar,
  ...Steps,
  ...StepsItem,
  ...Sticky,
  ...Subsection,
  ...SwipeAction,
  ...SwipeActionItem,
  ...Swiper,
  ...SwipterIndicator,
  ...Switch,
  ...Tabbar,
  ...TabbarItem,
  ...Tabs,
  ...Tag,
  ...Text,
  ...Textarea,
  ...Toast,
  ...Toolbar,
  ...Tooltip,
  ...Transition,
  ...Upload
};
function setConfig$1(configs) {
  shallowMerge(config, configs.config || {});
  shallowMerge(props$j, configs.props || {});
  shallowMerge(color$3, configs.color || {});
  shallowMerge(zIndex, configs.zIndex || {});
}
if (typeof index$1 !== "undefined" && index$1 && index$1.upuiParams) {
  index$1.__f__("log", "at node_modules/uview-plus/libs/config/props.js:210", "setting uview-plus");
  let temp = index$1.upuiParams();
  if (temp.httpIns) {
    temp.httpIns(http);
  }
  if (temp.options) {
    setConfig$1(temp.options);
  }
}
const props$i = defineMixin({
  props: {
    // 是否展示modal
    show: {
      type: Boolean,
      default: () => props$j.modal.show
    },
    // 标题
    title: {
      type: [String],
      default: () => props$j.modal.title
    },
    // 弹窗内容
    content: {
      type: String,
      default: () => props$j.modal.content
    },
    // 确认文案
    confirmText: {
      type: String,
      default: () => props$j.modal.confirmText
    },
    // 取消文案
    cancelText: {
      type: String,
      default: () => props$j.modal.cancelText
    },
    // 是否显示确认按钮
    showConfirmButton: {
      type: Boolean,
      default: () => props$j.modal.showConfirmButton
    },
    // 是否显示取消按钮
    showCancelButton: {
      type: Boolean,
      default: () => props$j.modal.showCancelButton
    },
    // 确认按钮颜色
    confirmColor: {
      type: String,
      default: () => props$j.modal.confirmColor
    },
    // 取消文字颜色
    cancelColor: {
      type: String,
      default: () => props$j.modal.cancelColor
    },
    // 对调确认和取消的位置
    buttonReverse: {
      type: Boolean,
      default: () => props$j.modal.buttonReverse
    },
    // 是否开启缩放效果
    zoom: {
      type: Boolean,
      default: () => props$j.modal.zoom
    },
    // 是否异步关闭，只对确定按钮有效
    asyncClose: {
      type: Boolean,
      default: () => props$j.modal.asyncClose
    },
    // 是否允许点击遮罩关闭modal
    closeOnClickOverlay: {
      type: Boolean,
      default: () => props$j.modal.closeOnClickOverlay
    },
    // 给一个负的margin-top，往上偏移，避免和键盘重合的情况
    negativeTop: {
      type: [String, Number],
      default: () => props$j.modal.negativeTop
    },
    // modal宽度，不支持百分比，可以数值，px，rpx单位
    width: {
      type: [String, Number],
      default: () => props$j.modal.width
    },
    // 确认按钮的样式，circle-圆形，square-方形，如设置，将不会显示取消按钮
    confirmButtonShape: {
      type: String,
      default: () => props$j.modal.confirmButtonShape
    },
    // 弹窗动画过度时间
    duration: {
      type: [Number],
      default: props$j.modal.duration
    },
    // 文案对齐方式
    contentTextAlign: {
      type: String,
      default: () => props$j.modal.contentTextAlign
    },
    // 异步确定时如果点击了取消时候的提示文案
    asyncCloseTip: {
      type: String,
      default: () => props$j.modal.asyncCloseTip
    },
    // 是否异步关闭，只对取消按钮有效
    asyncCancelClose: {
      type: Boolean,
      default: () => props$j.modal.asyncCancelClose
    },
    // 内容样式
    contentStyle: {
      type: Object,
      default: () => props$j.modal.contentStyle
    }
  }
});
const _sfc_main = {
  name: "u-modal",
  mixins: [mpMixin, mixin, props$i],
  data() {
    return {
      loading: false
    };
  },
  watch: {
    show(n2) {
      if (n2 && this.loading)
        this.loading = false;
    }
  },
  emits: ["confirm", "cancel", "close", "update:show", "cancelOnAsync"],
  computed: {
    contentStyleCpu() {
      let style = this.contentStyle;
      style.paddingTop = `${this.title ? 12 : 25}px`;
      return style;
    }
  },
  methods: {
    addUnit,
    // 点击确定按钮
    confirmHandler() {
      if (this.asyncClose) {
        this.loading = true;
      } else {
        this.$emit("update:show", false);
      }
      this.$emit("confirm");
    },
    // 点击取消按钮
    cancelHandler() {
      if (this.asyncClose && this.loading) {
        if (this.asyncCloseTip) {
          index$1.showToast({
            title: this.asyncCloseTip,
            icon: "none"
          });
        }
        this.$emit("cancelOnAsync");
      } else {
        if (!this.asyncCancelClose) {
          this.$emit("update:show", false);
        }
      }
      this.$emit("cancel");
    },
    // 点击遮罩
    // 从原理上来说，modal的遮罩点击，并不是真的点击到了遮罩
    // 因为modal依赖于popup的中部弹窗类型，中部弹窗比较特殊，虽有然遮罩，但是为了让弹窗内容能flex居中
    // 多了一个透明的遮罩，此透明的遮罩会覆盖在灰色的遮罩上，所以实际上是点击不到灰色遮罩的，popup内部在
    // 透明遮罩的子元素做了.stop处理，所以点击内容区，也不会导致误触发
    clickHandler() {
      if (this.closeOnClickOverlay) {
        this.$emit("update:show", false);
        this.$emit("close");
      }
    }
  }
};
if (!Array) {
  const _easycom_u_line2 = resolveComponent("u-line");
  const _easycom_u_loading_icon2 = resolveComponent("u-loading-icon");
  const _easycom_u_popup2 = resolveComponent("u-popup");
  (_easycom_u_line2 + _easycom_u_loading_icon2 + _easycom_u_popup2)();
}
const _easycom_u_line = () => "../node-modules/uview-plus/components/u-line/u-line.js";
const _easycom_u_loading_icon = () => "../node-modules/uview-plus/components/u-loading-icon/u-loading-icon.js";
const _easycom_u_popup = () => "../node-modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_line + _easycom_u_loading_icon + _easycom_u_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return e({
    a: _ctx.title
  }, _ctx.title ? {
    b: t$2(_ctx.title)
  } : {}, {
    c: t$2(_ctx.content),
    d: _ctx.contentTextAlign,
    e: s$1($options.contentStyleCpu),
    f: _ctx.$slots.confirmButton
  }, _ctx.$slots.confirmButton ? {} : e({
    g: _ctx.showCancelButton
  }, _ctx.showCancelButton ? {
    h: t$2(_ctx.cancelText),
    i: _ctx.cancelColor,
    j: n$1(_ctx.showCancelButton && !_ctx.showConfirmButton && "u-modal__button-group__wrapper--only-cancel"),
    k: o$1((...args) => $options.cancelHandler && $options.cancelHandler(...args), "2a")
  } : {}, {
    l: _ctx.showConfirmButton && _ctx.showCancelButton
  }, _ctx.showConfirmButton && _ctx.showCancelButton ? {
    m: p$1({
      direction: "column"
    })
  } : {}, {
    n: _ctx.showConfirmButton
  }, _ctx.showConfirmButton ? e({
    o: $data.loading
  }, $data.loading ? {} : {
    p: t$2(_ctx.confirmText),
    q: _ctx.confirmColor
  }, {
    r: n$1(!_ctx.showCancelButton && _ctx.showConfirmButton && "u-modal__button-group__wrapper--only-confirm"),
    s: o$1((...args) => $options.confirmHandler && $options.confirmHandler(...args), "5e")
  }) : {}, {
    t: _ctx.buttonReverse ? "row-reverse" : "row"
  }), {
    v: $options.addUnit(_ctx.width),
    w: n$1(_ctx.customClass),
    x: o$1($options.clickHandler, "d8"),
    y: p$1({
      mode: "center",
      zoom: _ctx.zoom,
      show: _ctx.show,
      customStyle: {
        borderRadius: "6px",
        overflow: "hidden",
        marginTop: `-${$options.addUnit(_ctx.negativeTop)}`
      },
      closeOnClickOverlay: _ctx.closeOnClickOverlay,
      safeAreaInsetBottom: false,
      duration: _ctx.duration
    })
  });
}
const _easycom_u_modal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-12b77a26"]]);
const createLifeCycleHook = (lifecycle, flag2 = 0) => (hook, target = getCurrentInstance()) => {
  !isInSSRComponentSetup && injectHook(lifecycle, hook, target);
};
const onShow = /* @__PURE__ */ createLifeCycleHook(
  ON_SHOW,
  1 | 2
  /* HookFlags.PAGE */
);
const onHide = /* @__PURE__ */ createLifeCycleHook(
  ON_HIDE,
  1 | 2
  /* HookFlags.PAGE */
);
const onLaunch = /* @__PURE__ */ createLifeCycleHook(
  ON_LAUNCH,
  1
  /* HookFlags.APP */
);
const onLoad = /* @__PURE__ */ createLifeCycleHook(
  ON_LOAD,
  2
  /* HookFlags.PAGE */
);
const easycom = {
  autoscan: true,
  custom: {
    "^u-(.*)": "uview-plus/components/u-$1/u-$1.vue"
  }
};
const pages = [
  {
    path: "pages/entry/index",
    style: {
      navigationBarTitleText: "启动中"
    }
  },
  {
    path: "pages/auth-login/index",
    style: {
      navigationBarTitleText: "登录"
    }
  },
  {
    path: "pages/auth-register/index",
    style: {
      navigationBarTitleText: "注册"
    }
  },
  {
    path: "uni_modules/uni-id-pages/pages/login/login-withpwd",
    style: {
      navigationBarTitleText: "登录"
    }
  },
  {
    path: "uni_modules/uni-id-pages/pages/login/login-withoutpwd",
    style: {
      navigationBarTitleText: "登录"
    }
  },
  {
    path: "uni_modules/uni-id-pages/pages/register/register",
    style: {
      navigationBarTitleText: "注册"
    }
  },
  {
    path: "uni_modules/uni-id-pages/pages/register/register-by-email",
    style: {
      navigationBarTitleText: "邮箱注册"
    }
  },
  {
    path: "uni_modules/uni-id-pages/pages/retrieve/retrieve",
    style: {
      navigationBarTitleText: "找回密码"
    }
  },
  {
    path: "uni_modules/uni-id-pages/pages/userinfo/userinfo",
    style: {
      navigationBarTitleText: "用户资料"
    }
  },
  {
    path: "pages/family-guide/index",
    style: {
      navigationBarTitleText: "家庭引导"
    }
  },
  {
    path: "pages/family-create/index",
    style: {
      navigationBarTitleText: "创建家庭"
    }
  },
  {
    path: "pages/clothes/index",
    style: {
      navigationBarTitleText: "我的衣物"
    }
  },
  {
    path: "pages/clothes-create/index",
    style: {
      navigationBarTitleText: "新增衣物"
    }
  },
  {
    path: "pages/clothes-detail/index",
    style: {
      navigationBarTitleText: "衣物详情"
    }
  },
  {
    path: "pages/closets/index",
    style: {
      navigationBarTitleText: "我的衣橱"
    }
  },
  {
    path: "pages/closet-create/index",
    style: {
      navigationBarTitleText: "新建衣橱"
    }
  },
  {
    path: "pages/home/index",
    style: {
      navigationBarTitleText: "我的衣橱"
    }
  },
  {
    path: "pages/profile/index",
    style: {
      navigationBarTitleText: "我的"
    }
  }
];
const tabBar = {
  color: "#7a8678",
  selectedColor: "#314033",
  backgroundColor: "#fbfaf7",
  borderStyle: "black",
  list: [
    {
      pagePath: "pages/home/index",
      text: "首页",
      iconPath: "static/tabbar/yun.png",
      selectedIconPath: "static/tabbar/yun1.png"
    },
    {
      pagePath: "pages/closets/index",
      text: "衣橱",
      iconPath: "static/tabbar/storage.png",
      selectedIconPath: "static/tabbar/storage1.png"
    },
    {
      pagePath: "pages/clothes/index",
      text: "衣物",
      iconPath: "static/tabbar/obj.png",
      selectedIconPath: "static/tabbar/obj1.png"
    },
    {
      pagePath: "pages/profile/index",
      text: "我的",
      iconPath: "static/tabbar/fn.png",
      selectedIconPath: "static/tabbar/fn1.png"
    }
  ]
};
const uniIdRouter = {
  loginPage: "pages/auth-login/index"
};
const globalStyle = {
  navigationBarTextStyle: "black",
  navigationBarTitleText: "我的衣橱",
  navigationBarBackgroundColor: "#f7f4ee",
  backgroundColor: "#f7f4ee"
};
const pagesJson = {
  easycom,
  pages,
  tabBar,
  uniIdRouter,
  globalStyle
};
var define_process_env_UNI_SECURE_NETWORK_CONFIG_default = [];
function t(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
function n(e2, t2, n2) {
  return e2(n2 = { path: t2, exports: {}, require: function(e3, t3) {
    return function() {
      throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
    }(null == t3 && n2.path);
  } }, n2.exports), n2.exports;
}
var s = n(function(e2, t2) {
  var n2;
  e2.exports = (n2 = n2 || function(e3, t3) {
    var n3 = Object.create || /* @__PURE__ */ function() {
      function e4() {
      }
      return function(t4) {
        var n4;
        return e4.prototype = t4, n4 = new e4(), e4.prototype = null, n4;
      };
    }(), s2 = {}, r2 = s2.lib = {}, i2 = r2.Base = { extend: function(e4) {
      var t4 = n3(this);
      return e4 && t4.mixIn(e4), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
        t4.$super.init.apply(this, arguments);
      }), t4.init.prototype = t4, t4.$super = this, t4;
    }, create: function() {
      var e4 = this.extend();
      return e4.init.apply(e4, arguments), e4;
    }, init: function() {
    }, mixIn: function(e4) {
      for (var t4 in e4)
        e4.hasOwnProperty(t4) && (this[t4] = e4[t4]);
      e4.hasOwnProperty("toString") && (this.toString = e4.toString);
    }, clone: function() {
      return this.init.prototype.extend(this);
    } }, o2 = r2.WordArray = i2.extend({ init: function(e4, n4) {
      e4 = this.words = e4 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e4.length;
    }, toString: function(e4) {
      return (e4 || c2).stringify(this);
    }, concat: function(e4) {
      var t4 = this.words, n4 = e4.words, s3 = this.sigBytes, r3 = e4.sigBytes;
      if (this.clamp(), s3 % 4)
        for (var i3 = 0; i3 < r3; i3++) {
          var o3 = n4[i3 >>> 2] >>> 24 - i3 % 4 * 8 & 255;
          t4[s3 + i3 >>> 2] |= o3 << 24 - (s3 + i3) % 4 * 8;
        }
      else
        for (i3 = 0; i3 < r3; i3 += 4)
          t4[s3 + i3 >>> 2] = n4[i3 >>> 2];
      return this.sigBytes += r3, this;
    }, clamp: function() {
      var t4 = this.words, n4 = this.sigBytes;
      t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e3.ceil(n4 / 4);
    }, clone: function() {
      var e4 = i2.clone.call(this);
      return e4.words = this.words.slice(0), e4;
    }, random: function(t4) {
      for (var n4, s3 = [], r3 = function(t5) {
        t5 = t5;
        var n5 = 987654321, s4 = 4294967295;
        return function() {
          var r4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
          return r4 /= 4294967296, (r4 += 0.5) * (e3.random() > 0.5 ? 1 : -1);
        };
      }, i3 = 0; i3 < t4; i3 += 4) {
        var a3 = r3(4294967296 * (n4 || e3.random()));
        n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
      }
      return new o2.init(s3, t4);
    } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e4) {
      for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
        var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
        s3.push((i3 >>> 4).toString(16)), s3.push((15 & i3).toString(16));
      }
      return s3.join("");
    }, parse: function(e4) {
      for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
        n4[s3 >>> 3] |= parseInt(e4.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
      return new o2.init(n4, t4 / 2);
    } }, u2 = a2.Latin1 = { stringify: function(e4) {
      for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
        var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
        s3.push(String.fromCharCode(i3));
      }
      return s3.join("");
    }, parse: function(e4) {
      for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3++)
        n4[s3 >>> 2] |= (255 & e4.charCodeAt(s3)) << 24 - s3 % 4 * 8;
      return new o2.init(n4, t4);
    } }, l2 = a2.Utf8 = { stringify: function(e4) {
      try {
        return decodeURIComponent(escape(u2.stringify(e4)));
      } catch (e5) {
        throw new Error("Malformed UTF-8 data");
      }
    }, parse: function(e4) {
      return u2.parse(unescape(encodeURIComponent(e4)));
    } }, h2 = r2.BufferedBlockAlgorithm = i2.extend({ reset: function() {
      this._data = new o2.init(), this._nDataBytes = 0;
    }, _append: function(e4) {
      "string" == typeof e4 && (e4 = l2.parse(e4)), this._data.concat(e4), this._nDataBytes += e4.sigBytes;
    }, _process: function(t4) {
      var n4 = this._data, s3 = n4.words, r3 = n4.sigBytes, i3 = this.blockSize, a3 = r3 / (4 * i3), c3 = (a3 = t4 ? e3.ceil(a3) : e3.max((0 | a3) - this._minBufferSize, 0)) * i3, u3 = e3.min(4 * c3, r3);
      if (c3) {
        for (var l3 = 0; l3 < c3; l3 += i3)
          this._doProcessBlock(s3, l3);
        var h3 = s3.splice(0, c3);
        n4.sigBytes -= u3;
      }
      return new o2.init(h3, u3);
    }, clone: function() {
      var e4 = i2.clone.call(this);
      return e4._data = this._data.clone(), e4;
    }, _minBufferSize: 0 });
    r2.Hasher = h2.extend({ cfg: i2.extend(), init: function(e4) {
      this.cfg = this.cfg.extend(e4), this.reset();
    }, reset: function() {
      h2.reset.call(this), this._doReset();
    }, update: function(e4) {
      return this._append(e4), this._process(), this;
    }, finalize: function(e4) {
      return e4 && this._append(e4), this._doFinalize();
    }, blockSize: 16, _createHelper: function(e4) {
      return function(t4, n4) {
        return new e4.init(n4).finalize(t4);
      };
    }, _createHmacHelper: function(e4) {
      return function(t4, n4) {
        return new d2.HMAC.init(e4, n4).finalize(t4);
      };
    } });
    var d2 = s2.algo = {};
    return s2;
  }(Math), n2);
}), r = s, i = (n(function(e2, t2) {
  var n2;
  e2.exports = (n2 = r, function(e3) {
    var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [];
    !function() {
      for (var t4 = 0; t4 < 64; t4++)
        a2[t4] = 4294967296 * e3.abs(e3.sin(t4 + 1)) | 0;
    }();
    var c2 = o2.MD5 = i2.extend({ _doReset: function() {
      this._hash = new r2.init([1732584193, 4023233417, 2562383102, 271733878]);
    }, _doProcessBlock: function(e4, t4) {
      for (var n3 = 0; n3 < 16; n3++) {
        var s3 = t4 + n3, r3 = e4[s3];
        e4[s3] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8);
      }
      var i3 = this._hash.words, o3 = e4[t4 + 0], c3 = e4[t4 + 1], p2 = e4[t4 + 2], f2 = e4[t4 + 3], g2 = e4[t4 + 4], m2 = e4[t4 + 5], y2 = e4[t4 + 6], _2 = e4[t4 + 7], w2 = e4[t4 + 8], v2 = e4[t4 + 9], I2 = e4[t4 + 10], S2 = e4[t4 + 11], b2 = e4[t4 + 12], k2 = e4[t4 + 13], A2 = e4[t4 + 14], T2 = e4[t4 + 15], C2 = i3[0], P2 = i3[1], O2 = i3[2], E2 = i3[3];
      C2 = u2(C2, P2, O2, E2, o3, 7, a2[0]), E2 = u2(E2, C2, P2, O2, c3, 12, a2[1]), O2 = u2(O2, E2, C2, P2, p2, 17, a2[2]), P2 = u2(P2, O2, E2, C2, f2, 22, a2[3]), C2 = u2(C2, P2, O2, E2, g2, 7, a2[4]), E2 = u2(E2, C2, P2, O2, m2, 12, a2[5]), O2 = u2(O2, E2, C2, P2, y2, 17, a2[6]), P2 = u2(P2, O2, E2, C2, _2, 22, a2[7]), C2 = u2(C2, P2, O2, E2, w2, 7, a2[8]), E2 = u2(E2, C2, P2, O2, v2, 12, a2[9]), O2 = u2(O2, E2, C2, P2, I2, 17, a2[10]), P2 = u2(P2, O2, E2, C2, S2, 22, a2[11]), C2 = u2(C2, P2, O2, E2, b2, 7, a2[12]), E2 = u2(E2, C2, P2, O2, k2, 12, a2[13]), O2 = u2(O2, E2, C2, P2, A2, 17, a2[14]), C2 = l2(C2, P2 = u2(P2, O2, E2, C2, T2, 22, a2[15]), O2, E2, c3, 5, a2[16]), E2 = l2(E2, C2, P2, O2, y2, 9, a2[17]), O2 = l2(O2, E2, C2, P2, S2, 14, a2[18]), P2 = l2(P2, O2, E2, C2, o3, 20, a2[19]), C2 = l2(C2, P2, O2, E2, m2, 5, a2[20]), E2 = l2(E2, C2, P2, O2, I2, 9, a2[21]), O2 = l2(O2, E2, C2, P2, T2, 14, a2[22]), P2 = l2(P2, O2, E2, C2, g2, 20, a2[23]), C2 = l2(C2, P2, O2, E2, v2, 5, a2[24]), E2 = l2(E2, C2, P2, O2, A2, 9, a2[25]), O2 = l2(O2, E2, C2, P2, f2, 14, a2[26]), P2 = l2(P2, O2, E2, C2, w2, 20, a2[27]), C2 = l2(C2, P2, O2, E2, k2, 5, a2[28]), E2 = l2(E2, C2, P2, O2, p2, 9, a2[29]), O2 = l2(O2, E2, C2, P2, _2, 14, a2[30]), C2 = h2(C2, P2 = l2(P2, O2, E2, C2, b2, 20, a2[31]), O2, E2, m2, 4, a2[32]), E2 = h2(E2, C2, P2, O2, w2, 11, a2[33]), O2 = h2(O2, E2, C2, P2, S2, 16, a2[34]), P2 = h2(P2, O2, E2, C2, A2, 23, a2[35]), C2 = h2(C2, P2, O2, E2, c3, 4, a2[36]), E2 = h2(E2, C2, P2, O2, g2, 11, a2[37]), O2 = h2(O2, E2, C2, P2, _2, 16, a2[38]), P2 = h2(P2, O2, E2, C2, I2, 23, a2[39]), C2 = h2(C2, P2, O2, E2, k2, 4, a2[40]), E2 = h2(E2, C2, P2, O2, o3, 11, a2[41]), O2 = h2(O2, E2, C2, P2, f2, 16, a2[42]), P2 = h2(P2, O2, E2, C2, y2, 23, a2[43]), C2 = h2(C2, P2, O2, E2, v2, 4, a2[44]), E2 = h2(E2, C2, P2, O2, b2, 11, a2[45]), O2 = h2(O2, E2, C2, P2, T2, 16, a2[46]), C2 = d2(C2, P2 = h2(P2, O2, E2, C2, p2, 23, a2[47]), O2, E2, o3, 6, a2[48]), E2 = d2(E2, C2, P2, O2, _2, 10, a2[49]), O2 = d2(O2, E2, C2, P2, A2, 15, a2[50]), P2 = d2(P2, O2, E2, C2, m2, 21, a2[51]), C2 = d2(C2, P2, O2, E2, b2, 6, a2[52]), E2 = d2(E2, C2, P2, O2, f2, 10, a2[53]), O2 = d2(O2, E2, C2, P2, I2, 15, a2[54]), P2 = d2(P2, O2, E2, C2, c3, 21, a2[55]), C2 = d2(C2, P2, O2, E2, w2, 6, a2[56]), E2 = d2(E2, C2, P2, O2, T2, 10, a2[57]), O2 = d2(O2, E2, C2, P2, y2, 15, a2[58]), P2 = d2(P2, O2, E2, C2, k2, 21, a2[59]), C2 = d2(C2, P2, O2, E2, g2, 6, a2[60]), E2 = d2(E2, C2, P2, O2, S2, 10, a2[61]), O2 = d2(O2, E2, C2, P2, p2, 15, a2[62]), P2 = d2(P2, O2, E2, C2, v2, 21, a2[63]), i3[0] = i3[0] + C2 | 0, i3[1] = i3[1] + P2 | 0, i3[2] = i3[2] + O2 | 0, i3[3] = i3[3] + E2 | 0;
    }, _doFinalize: function() {
      var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
      n3[r3 >>> 5] |= 128 << 24 - r3 % 32;
      var i3 = e3.floor(s3 / 4294967296), o3 = s3;
      n3[15 + (r3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), n3[14 + (r3 + 64 >>> 9 << 4)] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
      for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
        var l3 = c3[u3];
        c3[u3] = 16711935 & (l3 << 8 | l3 >>> 24) | 4278255360 & (l3 << 24 | l3 >>> 8);
      }
      return a3;
    }, clone: function() {
      var e4 = i2.clone.call(this);
      return e4._hash = this._hash.clone(), e4;
    } });
    function u2(e4, t4, n3, s3, r3, i3, o3) {
      var a3 = e4 + (t4 & n3 | ~t4 & s3) + r3 + o3;
      return (a3 << i3 | a3 >>> 32 - i3) + t4;
    }
    function l2(e4, t4, n3, s3, r3, i3, o3) {
      var a3 = e4 + (t4 & s3 | n3 & ~s3) + r3 + o3;
      return (a3 << i3 | a3 >>> 32 - i3) + t4;
    }
    function h2(e4, t4, n3, s3, r3, i3, o3) {
      var a3 = e4 + (t4 ^ n3 ^ s3) + r3 + o3;
      return (a3 << i3 | a3 >>> 32 - i3) + t4;
    }
    function d2(e4, t4, n3, s3, r3, i3, o3) {
      var a3 = e4 + (n3 ^ (t4 | ~s3)) + r3 + o3;
      return (a3 << i3 | a3 >>> 32 - i3) + t4;
    }
    t3.MD5 = i2._createHelper(c2), t3.HmacMD5 = i2._createHmacHelper(c2);
  }(Math), n2.MD5);
}), n(function(e2, t2) {
  var n2;
  e2.exports = (n2 = r, void function() {
    var e3 = n2, t3 = e3.lib.Base, s2 = e3.enc.Utf8;
    e3.algo.HMAC = t3.extend({ init: function(e4, t4) {
      e4 = this._hasher = new e4.init(), "string" == typeof t4 && (t4 = s2.parse(t4));
      var n3 = e4.blockSize, r2 = 4 * n3;
      t4.sigBytes > r2 && (t4 = e4.finalize(t4)), t4.clamp();
      for (var i2 = this._oKey = t4.clone(), o2 = this._iKey = t4.clone(), a2 = i2.words, c2 = o2.words, u2 = 0; u2 < n3; u2++)
        a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
      i2.sigBytes = o2.sigBytes = r2, this.reset();
    }, reset: function() {
      var e4 = this._hasher;
      e4.reset(), e4.update(this._iKey);
    }, update: function(e4) {
      return this._hasher.update(e4), this;
    }, finalize: function(e4) {
      var t4 = this._hasher, n3 = t4.finalize(e4);
      return t4.reset(), t4.finalize(this._oKey.clone().concat(n3));
    } });
  }());
}), n(function(e2, t2) {
  e2.exports = r.HmacMD5;
})), o = n(function(e2, t2) {
  e2.exports = r.enc.Utf8;
}), a = n(function(e2, t2) {
  var n2;
  e2.exports = (n2 = r, function() {
    var e3 = n2, t3 = e3.lib.WordArray;
    function s2(e4, n3, s3) {
      for (var r2 = [], i2 = 0, o2 = 0; o2 < n3; o2++)
        if (o2 % 4) {
          var a2 = s3[e4.charCodeAt(o2 - 1)] << o2 % 4 * 2, c2 = s3[e4.charCodeAt(o2)] >>> 6 - o2 % 4 * 2;
          r2[i2 >>> 2] |= (a2 | c2) << 24 - i2 % 4 * 8, i2++;
        }
      return t3.create(r2, i2);
    }
    e3.enc.Base64 = { stringify: function(e4) {
      var t4 = e4.words, n3 = e4.sigBytes, s3 = this._map;
      e4.clamp();
      for (var r2 = [], i2 = 0; i2 < n3; i2 += 3)
        for (var o2 = (t4[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) << 16 | (t4[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255) << 8 | t4[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255, a2 = 0; a2 < 4 && i2 + 0.75 * a2 < n3; a2++)
          r2.push(s3.charAt(o2 >>> 6 * (3 - a2) & 63));
      var c2 = s3.charAt(64);
      if (c2)
        for (; r2.length % 4; )
          r2.push(c2);
      return r2.join("");
    }, parse: function(e4) {
      var t4 = e4.length, n3 = this._map, r2 = this._reverseMap;
      if (!r2) {
        r2 = this._reverseMap = [];
        for (var i2 = 0; i2 < n3.length; i2++)
          r2[n3.charCodeAt(i2)] = i2;
      }
      var o2 = n3.charAt(64);
      if (o2) {
        var a2 = e4.indexOf(o2);
        -1 !== a2 && (t4 = a2);
      }
      return s2(e4, t4, r2);
    }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
  }(), n2.enc.Base64);
});
const c = "FUNCTION", u = "OBJECT", l = "CLIENT_DB", h = "pending", d = "fulfilled", p = "rejected";
function f(e2) {
  return Object.prototype.toString.call(e2).slice(8, -1).toLowerCase();
}
function g(e2) {
  return "object" === f(e2);
}
function m(e2) {
  return "function" == typeof e2;
}
function y(e2) {
  return function() {
    try {
      return e2.apply(e2, arguments);
    } catch (e3) {
      console.error(e3);
    }
  };
}
const _ = "REJECTED", w = "NOT_PENDING";
class v {
  constructor({ createPromise: e2, retryRule: t2 = _ } = {}) {
    this.createPromise = e2, this.status = null, this.promise = null, this.retryRule = t2;
  }
  get needRetry() {
    if (!this.status)
      return true;
    switch (this.retryRule) {
      case _:
        return this.status === p;
      case w:
        return this.status !== h;
    }
  }
  exec() {
    return this.needRetry ? (this.status = h, this.promise = this.createPromise().then((e2) => (this.status = d, Promise.resolve(e2)), (e2) => (this.status = p, Promise.reject(e2))), this.promise) : this.promise;
  }
}
function I(e2) {
  return e2 && "string" == typeof e2 ? JSON.parse(e2) : e2;
}
const S = true, b = "mp-weixin", A = I(define_process_env_UNI_SECURE_NETWORK_CONFIG_default), T = b, C = I('{"address":["127.0.0.1","172.17.224.1","192.168.1.3"],"servePort":7000,"debugPort":9000,"initialLaunchType":"local","skipFiles":["<node_internals>/**","E:/HBuilderX.4.57.2025032507/HBuilderX/plugins/unicloud/**/*.js"]}'), P = I('[{"provider":"aliyun","spaceName":"my-closet-app","spaceId":"mp-da7724ea-3e73-4aec-af28-d255a2a4f62e","clientSecret":"eDqzGLPlr5+jFbHQlIcMVA==","endpoint":"https://api.next.bspapp.com","failoverEndpoint":""}]') || [];
let E = "";
try {
  E = "__UNI__3EC23B9";
} catch (e2) {
}
let L = {};
function U(e2, t2 = {}) {
  var n2, s2;
  return n2 = L, s2 = e2, Object.prototype.hasOwnProperty.call(n2, s2) || (L[e2] = t2), L[e2];
}
const N = ["invoke", "success", "fail", "complete"], D = U("_globalUniCloudInterceptor");
function M(e2, t2) {
  D[e2] || (D[e2] = {}), g(t2) && Object.keys(t2).forEach((n2) => {
    N.indexOf(n2) > -1 && function(e3, t3, n3) {
      let s2 = D[e3][t3];
      s2 || (s2 = D[e3][t3] = []), -1 === s2.indexOf(n3) && m(n3) && s2.push(n3);
    }(e2, n2, t2[n2]);
  });
}
function q(e2, t2) {
  D[e2] || (D[e2] = {}), g(t2) ? Object.keys(t2).forEach((n2) => {
    N.indexOf(n2) > -1 && function(e3, t3, n3) {
      const s2 = D[e3][t3];
      if (!s2)
        return;
      const r2 = s2.indexOf(n3);
      r2 > -1 && s2.splice(r2, 1);
    }(e2, n2, t2[n2]);
  }) : delete D[e2];
}
function F(e2, t2) {
  return e2 && 0 !== e2.length ? e2.reduce((e3, n2) => e3.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
}
function K(e2, t2) {
  return D[e2] && D[e2][t2] || [];
}
function j(e2) {
  M("callObject", e2);
}
const $ = U("_globalUniCloudListener"), B = "response", W = "needLogin", H = "refreshToken", J = "failover", z = "clientdb", V = "cloudfunction", G = "cloudobject";
function Q(e2) {
  return $[e2] || ($[e2] = []), $[e2];
}
function Y(e2, t2) {
  const n2 = Q(e2);
  n2.includes(t2) || n2.push(t2);
}
function X(e2, t2) {
  const n2 = Q(e2), s2 = n2.indexOf(t2);
  -1 !== s2 && n2.splice(s2, 1);
}
function Z(e2, t2) {
  const n2 = Q(e2);
  for (let e3 = 0; e3 < n2.length; e3++) {
    (0, n2[e3])(t2);
  }
}
let ee, te = false;
function ne() {
  return ee || (ee = new Promise((e2) => {
    te && e2(), function t2() {
      if ("function" == typeof getCurrentPages) {
        const t3 = getCurrentPages();
        t3 && t3[0] && (te = true, e2());
      }
      te || setTimeout(() => {
        t2();
      }, 30);
    }();
  }), ee);
}
function se(e2) {
  const t2 = {};
  for (const n2 in e2) {
    const s2 = e2[n2];
    m(s2) && (t2[n2] = y(s2));
  }
  return t2;
}
class re extends Error {
  constructor(e2) {
    const t2 = e2.message || e2.errMsg || "unknown system error";
    super(t2), this.errMsg = t2, this.code = this.errCode = e2.code || e2.errCode || "SYSTEM_ERROR", this.errSubject = this.subject = e2.subject || e2.errSubject, this.cause = e2.cause, this.requestId = e2.requestId;
  }
  toJson(e2 = 0) {
    if (!(e2 >= 10))
      return e2++, { errCode: this.errCode, errMsg: this.errMsg, errSubject: this.errSubject, cause: this.cause && this.cause.toJson ? this.cause.toJson(e2) : this.cause };
  }
}
var ie = { request: (e2) => index$1.request(e2), uploadFile: (e2) => index$1.uploadFile(e2), setStorageSync: (e2, t2) => index$1.setStorageSync(e2, t2), getStorageSync: (e2) => index$1.getStorageSync(e2), removeStorageSync: (e2) => index$1.removeStorageSync(e2), clearStorageSync: () => index$1.clearStorageSync(), connectSocket: (e2) => index$1.connectSocket(e2) };
function oe(e2) {
  return e2 && oe(e2.__v_raw) || e2;
}
function ae() {
  return { token: ie.getStorageSync("uni_id_token") || ie.getStorageSync("uniIdToken"), tokenExpired: ie.getStorageSync("uni_id_token_expired") };
}
function ce({ token: e2, tokenExpired: t2 } = {}) {
  e2 && ie.setStorageSync("uni_id_token", e2), t2 && ie.setStorageSync("uni_id_token_expired", t2);
}
let ue, le;
function he() {
  return ue || (ue = wx$1.canIUse("getAppBaseInfo") && wx$1.canIUse("getDeviceInfo") ? { ...index$1.getAppBaseInfo(), ...index$1.getDeviceInfo() } : index$1.getSystemInfoSync()), ue;
}
function de() {
  let e2, t2;
  try {
    if (index$1.getLaunchOptionsSync) {
      if (index$1.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
        return;
      const { scene: n2, channel: s2 } = index$1.getLaunchOptionsSync();
      e2 = s2, t2 = n2;
    }
  } catch (e3) {
  }
  return { channel: e2, scene: t2 };
}
let pe = {};
function fe() {
  const e2 = index$1.getLocale && index$1.getLocale() || "en";
  if (le)
    return { ...pe, ...le, locale: e2, LOCALE: e2 };
  const t2 = he(), { deviceId: n2, osName: s2, uniPlatform: r2, appId: i2 } = t2, o2 = ["appId", "appLanguage", "appName", "appVersion", "appVersionCode", "appWgtVersion", "browserName", "browserVersion", "deviceBrand", "deviceId", "deviceModel", "deviceType", "osName", "osVersion", "romName", "romVersion", "ua", "hostName", "hostVersion", "uniPlatform", "uniRuntimeVersion", "uniRuntimeVersionCode", "uniCompilerVersion", "uniCompilerVersionCode"];
  for (const e3 in t2)
    Object.hasOwnProperty.call(t2, e3) && -1 === o2.indexOf(e3) && delete t2[e3];
  return le = { PLATFORM: r2, OS: s2, APPID: i2, DEVICEID: n2, ...de(), ...t2 }, { ...pe, ...le, locale: e2, LOCALE: e2 };
}
var ge = { sign: function(e2, t2) {
  let n2 = "";
  return Object.keys(e2).sort().forEach(function(t3) {
    e2[t3] && (n2 = n2 + "&" + t3 + "=" + e2[t3]);
  }), n2 = n2.slice(1), i(n2, t2).toString();
}, wrappedRequest: function(e2, t2) {
  return new Promise((n2, s2) => {
    t2(Object.assign(e2, { complete(e3) {
      e3 || (e3 = {});
      const t3 = e3.data && e3.data.header && e3.data.header["x-serverless-request-id"] || e3.header && e3.header["request-id"];
      if (!e3.statusCode || e3.statusCode >= 400) {
        const n3 = e3.data && e3.data.error && e3.data.error.code || "SYS_ERR", r3 = e3.data && e3.data.error && e3.data.error.message || e3.errMsg || "request:fail";
        return s2(new re({ code: n3, message: r3, requestId: t3 }));
      }
      const r2 = e3.data;
      if (r2.error)
        return s2(new re({ code: r2.error.code, message: r2.error.message, requestId: t3 }));
      r2.result = r2.data, r2.requestId = t3, delete r2.data, n2(r2);
    } }));
  });
}, toBase64: function(e2) {
  return a.stringify(o.parse(e2));
} };
var me = class {
  constructor(e2) {
    ["spaceId", "clientSecret"].forEach((t2) => {
      if (!Object.prototype.hasOwnProperty.call(e2, t2))
        throw new Error(`${t2} required`);
    }), this.config = Object.assign({}, { endpoint: 0 === e2.spaceId.indexOf("mp-") ? "https://api.next.bspapp.com" : "https://api.bspapp.com" }, e2), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = ie, this._getAccessTokenPromiseHub = new v({ createPromise: () => this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e3) => {
      if (!e3.result || !e3.result.accessToken)
        throw new re({ code: "AUTH_FAILED", message: "获取accessToken失败" });
      this.setAccessToken(e3.result.accessToken);
    }), retryRule: w });
  }
  get hasAccessToken() {
    return !!this.accessToken;
  }
  setAccessToken(e2) {
    this.accessToken = e2;
  }
  requestWrapped(e2) {
    return ge.wrappedRequest(e2, this.adapter.request);
  }
  requestAuth(e2) {
    return this.requestWrapped(e2);
  }
  request(e2, t2) {
    return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e2) : this.requestWrapped(e2).catch((t3) => new Promise((e3, n2) => {
      !t3 || "GATEWAY_INVALID_TOKEN" !== t3.code && "InvalidParameter.InvalidToken" !== t3.code ? n2(t3) : e3();
    }).then(() => this.getAccessToken()).then(() => {
      const t4 = this.rebuildRequest(e2);
      return this.request(t4, true);
    })) : this.getAccessToken().then(() => {
      const t3 = this.rebuildRequest(e2);
      return this.request(t3, true);
    }));
  }
  rebuildRequest(e2) {
    const t2 = Object.assign({}, e2);
    return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = ge.sign(t2.data, this.config.clientSecret), t2;
  }
  setupRequest(e2, t2) {
    const n2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
    return "auth" !== t2 && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = ge.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
  }
  getAccessToken() {
    return this._getAccessTokenPromiseHub.exec();
  }
  async authorize() {
    await this.getAccessToken();
  }
  callFunction(e2) {
    const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
    return this.request({ ...this.setupRequest(t2), timeout: e2.timeout });
  }
  getOSSUploadOptionsFromPath(e2) {
    const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
    return this.request(this.setupRequest(t2));
  }
  uploadFileToOSS({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: i2 }) {
    return new Promise((o2, a2) => {
      const c2 = this.adapter.uploadFile({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e3) {
        e3 && e3.statusCode < 400 ? o2(e3) : a2(new re({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
      }, fail(e3) {
        a2(new re({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
      } });
      "function" == typeof i2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
        i2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
      });
    });
  }
  reportOSSUpload(e2) {
    const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
    return this.request(this.setupRequest(t2));
  }
  async uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", cloudPathAsRealPath: s2 = false, onUploadProgress: r2, config: i2 }) {
    if ("string" !== f(t2))
      throw new re({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
    if (!(t2 = t2.trim()))
      throw new re({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
    if (/:\/\//.test(t2))
      throw new re({ code: "INVALID_PARAM", message: "cloudPath不合法" });
    const o2 = i2 && i2.envType || this.config.envType;
    if (s2 && ("/" !== t2[0] && (t2 = "/" + t2), t2.indexOf("\\") > -1))
      throw new re({ code: "INVALID_PARAM", message: "使用cloudPath作为路径时，cloudPath不可包含“\\”" });
    const a2 = (await this.getOSSUploadOptionsFromPath({ env: o2, filename: s2 ? t2.split("/").pop() : t2, fileId: s2 ? t2 : void 0 })).result, c2 = "https://" + a2.cdnDomain + "/" + a2.ossPath, { securityToken: u2, accessKeyId: l2, signature: h2, host: d2, ossPath: p2, id: g2, policy: m2, ossCallbackUrl: y2 } = a2, _2 = { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: l2, Signature: h2, host: d2, id: g2, key: p2, policy: m2, success_action_status: 200 };
    if (u2 && (_2["x-oss-security-token"] = u2), y2) {
      const e3 = JSON.stringify({ callbackUrl: y2, callbackBody: JSON.stringify({ fileId: g2, spaceId: this.config.spaceId }), callbackBodyType: "application/json" });
      _2.callback = ge.toBase64(e3);
    }
    const w2 = { url: "https://" + a2.host, formData: _2, fileName: "file", name: "file", filePath: e2, fileType: n2 };
    if (await this.uploadFileToOSS(Object.assign({}, w2, { onUploadProgress: r2 })), y2)
      return { success: true, filePath: e2, fileID: c2 };
    if ((await this.reportOSSUpload({ id: g2 })).success)
      return { success: true, filePath: e2, fileID: c2 };
    throw new re({ code: "UPLOAD_FAILED", message: "文件上传失败" });
  }
  getTempFileURL({ fileList: e2 } = {}) {
    return new Promise((t2, n2) => {
      Array.isArray(e2) && 0 !== e2.length || n2(new re({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" })), this.getFileInfo({ fileList: e2 }).then((n3) => {
        t2({ fileList: e2.map((e3, t3) => {
          const s2 = n3.fileList[t3];
          return { fileID: e3, tempFileURL: s2 && s2.url || e3 };
        }) });
      });
    });
  }
  async getFileInfo({ fileList: e2 } = {}) {
    if (!Array.isArray(e2) || 0 === e2.length)
      throw new re({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
    const t2 = { method: "serverless.file.resource.info", params: JSON.stringify({ id: e2.map((e3) => e3.split("?")[0]).join(",") }) };
    return { fileList: (await this.request(this.setupRequest(t2))).result };
  }
};
var ye = { init(e2) {
  const t2 = new me(e2), n2 = { signInAnonymously: function() {
    return t2.authorize();
  }, getLoginState: function() {
    return Promise.resolve(false);
  } };
  return t2.auth = function() {
    return n2;
  }, t2.customAuth = t2.auth, t2;
} };
const _e = "undefined" != typeof location && "http:" === location.protocol ? "http:" : "https:";
var we;
!function(e2) {
  e2.local = "local", e2.none = "none", e2.session = "session";
}(we || (we = {}));
var ve = function() {
}, Ie = n(function(e2, t2) {
  var n2;
  e2.exports = (n2 = r, function(e3) {
    var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [], c2 = [];
    !function() {
      function t4(t5) {
        for (var n4 = e3.sqrt(t5), s4 = 2; s4 <= n4; s4++)
          if (!(t5 % s4))
            return false;
        return true;
      }
      function n3(e4) {
        return 4294967296 * (e4 - (0 | e4)) | 0;
      }
      for (var s3 = 2, r3 = 0; r3 < 64; )
        t4(s3) && (r3 < 8 && (a2[r3] = n3(e3.pow(s3, 0.5))), c2[r3] = n3(e3.pow(s3, 1 / 3)), r3++), s3++;
    }();
    var u2 = [], l2 = o2.SHA256 = i2.extend({ _doReset: function() {
      this._hash = new r2.init(a2.slice(0));
    }, _doProcessBlock: function(e4, t4) {
      for (var n3 = this._hash.words, s3 = n3[0], r3 = n3[1], i3 = n3[2], o3 = n3[3], a3 = n3[4], l3 = n3[5], h2 = n3[6], d2 = n3[7], p2 = 0; p2 < 64; p2++) {
        if (p2 < 16)
          u2[p2] = 0 | e4[t4 + p2];
        else {
          var f2 = u2[p2 - 15], g2 = (f2 << 25 | f2 >>> 7) ^ (f2 << 14 | f2 >>> 18) ^ f2 >>> 3, m2 = u2[p2 - 2], y2 = (m2 << 15 | m2 >>> 17) ^ (m2 << 13 | m2 >>> 19) ^ m2 >>> 10;
          u2[p2] = g2 + u2[p2 - 7] + y2 + u2[p2 - 16];
        }
        var _2 = s3 & r3 ^ s3 & i3 ^ r3 & i3, w2 = (s3 << 30 | s3 >>> 2) ^ (s3 << 19 | s3 >>> 13) ^ (s3 << 10 | s3 >>> 22), v2 = d2 + ((a3 << 26 | a3 >>> 6) ^ (a3 << 21 | a3 >>> 11) ^ (a3 << 7 | a3 >>> 25)) + (a3 & l3 ^ ~a3 & h2) + c2[p2] + u2[p2];
        d2 = h2, h2 = l3, l3 = a3, a3 = o3 + v2 | 0, o3 = i3, i3 = r3, r3 = s3, s3 = v2 + (w2 + _2) | 0;
      }
      n3[0] = n3[0] + s3 | 0, n3[1] = n3[1] + r3 | 0, n3[2] = n3[2] + i3 | 0, n3[3] = n3[3] + o3 | 0, n3[4] = n3[4] + a3 | 0, n3[5] = n3[5] + l3 | 0, n3[6] = n3[6] + h2 | 0, n3[7] = n3[7] + d2 | 0;
    }, _doFinalize: function() {
      var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
      return n3[r3 >>> 5] |= 128 << 24 - r3 % 32, n3[14 + (r3 + 64 >>> 9 << 4)] = e3.floor(s3 / 4294967296), n3[15 + (r3 + 64 >>> 9 << 4)] = s3, t4.sigBytes = 4 * n3.length, this._process(), this._hash;
    }, clone: function() {
      var e4 = i2.clone.call(this);
      return e4._hash = this._hash.clone(), e4;
    } });
    t3.SHA256 = i2._createHelper(l2), t3.HmacSHA256 = i2._createHmacHelper(l2);
  }(Math), n2.SHA256);
}), Se = Ie, be = n(function(e2, t2) {
  e2.exports = r.HmacSHA256;
});
const ke = () => {
  let e2;
  if (!Promise) {
    e2 = () => {
    }, e2.promise = {};
    const t3 = () => {
      throw new re({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
    };
    return Object.defineProperty(e2.promise, "then", { get: t3 }), Object.defineProperty(e2.promise, "catch", { get: t3 }), e2;
  }
  const t2 = new Promise((t3, n2) => {
    e2 = (e3, s2) => e3 ? n2(e3) : t3(s2);
  });
  return e2.promise = t2, e2;
};
function Ae(e2) {
  return void 0 === e2;
}
function Te(e2) {
  return "[object Null]" === Object.prototype.toString.call(e2);
}
function Ce(e2 = "") {
  return e2.replace(/([\s\S]+)\s+(请前往云开发AI小助手查看问题：.*)/, "$1");
}
function Pe(e2 = 32) {
  const t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n2 = t2.length;
  let s2 = "";
  for (let r2 = 0; r2 < e2; r2++)
    s2 += t2.charAt(Math.floor(Math.random() * n2));
  return s2;
}
var Oe;
function Ee(e2) {
  const t2 = (n2 = e2, "[object Array]" === Object.prototype.toString.call(n2) ? e2 : [e2]);
  var n2;
  for (const e3 of t2) {
    const { isMatch: t3, genAdapter: n3, runtime: s2 } = e3;
    if (t3())
      return { adapter: n3(), runtime: s2 };
  }
}
!function(e2) {
  e2.WEB = "web", e2.WX_MP = "wx_mp";
}(Oe || (Oe = {}));
const xe = { adapter: null, runtime: void 0 }, Le = ["anonymousUuidKey"];
class Ue extends ve {
  constructor() {
    super(), xe.adapter.root.tcbObject || (xe.adapter.root.tcbObject = {});
  }
  setItem(e2, t2) {
    xe.adapter.root.tcbObject[e2] = t2;
  }
  getItem(e2) {
    return xe.adapter.root.tcbObject[e2];
  }
  removeItem(e2) {
    delete xe.adapter.root.tcbObject[e2];
  }
  clear() {
    delete xe.adapter.root.tcbObject;
  }
}
function Re(e2, t2) {
  switch (e2) {
    case "local":
      return t2.localStorage || new Ue();
    case "none":
      return new Ue();
    default:
      return t2.sessionStorage || new Ue();
  }
}
class Ne {
  constructor(e2) {
    if (!this._storage) {
      this._persistence = xe.adapter.primaryStorage || e2.persistence, this._storage = Re(this._persistence, xe.adapter);
      const t2 = `access_token_${e2.env}`, n2 = `access_token_expire_${e2.env}`, s2 = `refresh_token_${e2.env}`, r2 = `anonymous_uuid_${e2.env}`, i2 = `login_type_${e2.env}`, o2 = "device_id", a2 = `token_type_${e2.env}`, c2 = `user_info_${e2.env}`;
      this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: r2, loginTypeKey: i2, userInfoKey: c2, deviceIdKey: o2, tokenTypeKey: a2 };
    }
  }
  updatePersistence(e2) {
    if (e2 === this._persistence)
      return;
    const t2 = "local" === this._persistence;
    this._persistence = e2;
    const n2 = Re(e2, xe.adapter);
    for (const e3 in this.keys) {
      const s2 = this.keys[e3];
      if (t2 && Le.includes(e3))
        continue;
      const r2 = this._storage.getItem(s2);
      Ae(r2) || Te(r2) || (n2.setItem(s2, r2), this._storage.removeItem(s2));
    }
    this._storage = n2;
  }
  setStore(e2, t2, n2) {
    if (!this._storage)
      return;
    const s2 = { version: n2 || "localCachev1", content: t2 }, r2 = JSON.stringify(s2);
    try {
      this._storage.setItem(e2, r2);
    } catch (e3) {
      throw e3;
    }
  }
  getStore(e2, t2) {
    try {
      if (!this._storage)
        return;
    } catch (e3) {
      return "";
    }
    t2 = t2 || "localCachev1";
    const n2 = this._storage.getItem(e2);
    if (!n2)
      return "";
    if (n2.indexOf(t2) >= 0) {
      return JSON.parse(n2).content;
    }
    return "";
  }
  removeStore(e2) {
    this._storage.removeItem(e2);
  }
}
const De = {}, Me = {};
function qe(e2) {
  return De[e2];
}
class Fe {
  constructor(e2, t2) {
    this.data = t2 || null, this.name = e2;
  }
}
class Ke extends Fe {
  constructor(e2, t2) {
    super("error", { error: e2, data: t2 }), this.error = e2;
  }
}
const je = new class {
  constructor() {
    this._listeners = {};
  }
  on(e2, t2) {
    return function(e3, t3, n2) {
      n2[e3] = n2[e3] || [], n2[e3].push(t3);
    }(e2, t2, this._listeners), this;
  }
  off(e2, t2) {
    return function(e3, t3, n2) {
      if (n2 && n2[e3]) {
        const s2 = n2[e3].indexOf(t3);
        -1 !== s2 && n2[e3].splice(s2, 1);
      }
    }(e2, t2, this._listeners), this;
  }
  fire(e2, t2) {
    if (e2 instanceof Ke)
      return console.error(e2.error), this;
    const n2 = "string" == typeof e2 ? new Fe(e2, t2 || {}) : e2;
    const s2 = n2.name;
    if (this._listens(s2)) {
      n2.target = this;
      const e3 = this._listeners[s2] ? [...this._listeners[s2]] : [];
      for (const t3 of e3)
        t3.call(this, n2);
    }
    return this;
  }
  _listens(e2) {
    return this._listeners[e2] && this._listeners[e2].length > 0;
  }
}();
function $e(e2, t2) {
  je.on(e2, t2);
}
function Be(e2, t2 = {}) {
  je.fire(e2, t2);
}
function We(e2, t2) {
  je.off(e2, t2);
}
const He = "loginStateChanged", Je = "loginStateExpire", ze = "loginTypeChanged", Ve = "anonymousConverted", Ge = "refreshAccessToken";
var Qe;
!function(e2) {
  e2.ANONYMOUS = "ANONYMOUS", e2.WECHAT = "WECHAT", e2.WECHAT_PUBLIC = "WECHAT-PUBLIC", e2.WECHAT_OPEN = "WECHAT-OPEN", e2.CUSTOM = "CUSTOM", e2.EMAIL = "EMAIL", e2.USERNAME = "USERNAME", e2.NULL = "NULL";
}(Qe || (Qe = {}));
class Ye {
  constructor() {
    this._fnPromiseMap = /* @__PURE__ */ new Map();
  }
  async run(e2, t2) {
    let n2 = this._fnPromiseMap.get(e2);
    return n2 || (n2 = new Promise(async (n3, s2) => {
      try {
        await this._runIdlePromise();
        const s3 = t2();
        n3(await s3);
      } catch (e3) {
        s2(e3);
      } finally {
        this._fnPromiseMap.delete(e2);
      }
    }), this._fnPromiseMap.set(e2, n2)), n2;
  }
  _runIdlePromise() {
    return Promise.resolve();
  }
}
class Xe {
  constructor(e2) {
    this._singlePromise = new Ye(), this._cache = qe(e2.env), this._baseURL = `https://${e2.env}.ap-shanghai.tcb-api.tencentcloudapi.com`, this._reqClass = new xe.adapter.reqClass({ timeout: e2.timeout, timeoutMsg: `请求在${e2.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] });
  }
  _getDeviceId() {
    if (this._deviceID)
      return this._deviceID;
    const { deviceIdKey: e2 } = this._cache.keys;
    let t2 = this._cache.getStore(e2);
    return "string" == typeof t2 && t2.length >= 16 && t2.length <= 48 || (t2 = Pe(), this._cache.setStore(e2, t2)), this._deviceID = t2, t2;
  }
  async _request(e2, t2, n2 = {}) {
    const s2 = { "x-request-id": Pe(), "x-device-id": this._getDeviceId() };
    if (n2.withAccessToken) {
      const { tokenTypeKey: e3 } = this._cache.keys, t3 = await this.getAccessToken(), n3 = this._cache.getStore(e3);
      s2.authorization = `${n3} ${t3}`;
    }
    return this._reqClass["get" === n2.method ? "get" : "post"]({ url: `${this._baseURL}${e2}`, data: t2, headers: s2 });
  }
  async _fetchAccessToken() {
    const { loginTypeKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2, tokenTypeKey: s2 } = this._cache.keys, r2 = this._cache.getStore(e2);
    if (r2 && r2 !== Qe.ANONYMOUS)
      throw new re({ code: "INVALID_OPERATION", message: "非匿名登录不支持刷新 access token" });
    const i2 = await this._singlePromise.run("fetchAccessToken", async () => (await this._request("/auth/v1/signin/anonymously", {}, { method: "post" })).data), { access_token: o2, expires_in: a2, token_type: c2 } = i2;
    return this._cache.setStore(s2, c2), this._cache.setStore(t2, o2), this._cache.setStore(n2, Date.now() + 1e3 * a2), o2;
  }
  isAccessTokenExpired(e2, t2) {
    let n2 = true;
    return e2 && t2 && (n2 = t2 < Date.now()), n2;
  }
  async getAccessToken() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
    return this.isAccessTokenExpired(n2, s2) ? this._fetchAccessToken() : n2;
  }
  async refreshAccessToken() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2, loginTypeKey: n2 } = this._cache.keys;
    return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.setStore(n2, Qe.ANONYMOUS), this.getAccessToken();
  }
  async getUserInfo() {
    return this._singlePromise.run("getUserInfo", async () => (await this._request("/auth/v1/user/me", {}, { withAccessToken: true, method: "get" })).data);
  }
}
const Ze = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], et = { "X-SDK-Version": "1.3.5" };
function tt$1(e2, t2, n2) {
  const s2 = e2[t2];
  e2[t2] = function(t3) {
    const r2 = {}, i2 = {};
    n2.forEach((n3) => {
      const { data: s3, headers: o3 } = n3.call(e2, t3);
      Object.assign(r2, s3), Object.assign(i2, o3);
    });
    const o2 = t3.data;
    return o2 && (() => {
      var e3;
      if (e3 = o2, "[object FormData]" !== Object.prototype.toString.call(e3))
        t3.data = { ...o2, ...r2 };
      else
        for (const e4 in r2)
          o2.append(e4, r2[e4]);
    })(), t3.headers = { ...t3.headers || {}, ...i2 }, s2.call(e2, t3);
  };
}
function nt() {
  const e2 = Math.random().toString(16).slice(2);
  return { data: { seqId: e2 }, headers: { ...et, "x-seqid": e2 } };
}
class st {
  constructor(e2 = {}) {
    var t2;
    this.config = e2, this._reqClass = new xe.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `请求在${this.config.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] }), this._cache = qe(this.config.env), this._localCache = (t2 = this.config.env, Me[t2]), this.oauth = new Xe(this.config), tt$1(this._reqClass, "post", [nt]), tt$1(this._reqClass, "upload", [nt]), tt$1(this._reqClass, "download", [nt]);
  }
  async post(e2) {
    return await this._reqClass.post(e2);
  }
  async upload(e2) {
    return await this._reqClass.upload(e2);
  }
  async download(e2) {
    return await this._reqClass.download(e2);
  }
  async refreshAccessToken() {
    let e2, t2;
    this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
    try {
      e2 = await this._refreshAccessTokenPromise;
    } catch (e3) {
      t2 = e3;
    }
    if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
      throw t2;
    return e2;
  }
  async _refreshAccessToken() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: r2 } = this._cache.keys;
    this._cache.removeStore(e2), this._cache.removeStore(t2);
    let i2 = this._cache.getStore(n2);
    if (!i2)
      throw new re({ message: "未登录CloudBase" });
    const o2 = { refresh_token: i2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", o2);
    if (a2.data.code) {
      const { code: e3 } = a2.data;
      if ("SIGN_PARAM_INVALID" === e3 || "REFRESH_TOKEN_EXPIRED" === e3 || "INVALID_REFRESH_TOKEN" === e3) {
        if (this._cache.getStore(s2) === Qe.ANONYMOUS && "INVALID_REFRESH_TOKEN" === e3) {
          const e4 = this._cache.getStore(r2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e4, refresh_token: t3 });
          return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
        }
        Be(Je), this._cache.removeStore(n2);
      }
      throw new re({ code: a2.data.code, message: `刷新access token失败：${a2.data.code}` });
    }
    if (a2.data.access_token)
      return Be(Ge), this._cache.setStore(e2, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
    a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
  }
  async getAccessToken() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
    if (!this._cache.getStore(n2))
      throw new re({ message: "refresh token不存在，登录状态异常" });
    let s2 = this._cache.getStore(e2), r2 = this._cache.getStore(t2), i2 = true;
    return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, r2) && (i2 = false), (!s2 || !r2 || r2 < Date.now()) && i2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: r2 };
  }
  async request(e2, t2, n2) {
    const s2 = `x-tcb-trace_${this.config.env}`;
    let r2 = "application/x-www-form-urlencoded";
    const i2 = { action: e2, env: this.config.env, dataVersion: "2019-08-16", ...t2 };
    let o2;
    if (-1 === Ze.indexOf(e2) && (this._cache.keys, i2.access_token = await this.oauth.getAccessToken()), "storage.uploadFile" === e2) {
      o2 = new FormData();
      for (let e3 in o2)
        o2.hasOwnProperty(e3) && void 0 !== o2[e3] && o2.append(e3, i2[e3]);
      r2 = "multipart/form-data";
    } else {
      r2 = "application/json", o2 = {};
      for (let e3 in i2)
        void 0 !== i2[e3] && (o2[e3] = i2[e3]);
    }
    let a2 = { headers: { "content-type": r2 } };
    n2 && n2.timeout && (a2.timeout = n2.timeout), n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
    const c2 = this._localCache.getStore(s2);
    c2 && (a2.headers["X-TCB-Trace"] = c2);
    const { parse: u2, inQuery: l2, search: h2 } = t2;
    let d2 = { env: this.config.env };
    u2 && (d2.parse = true), l2 && (d2 = { ...l2, ...d2 });
    let p2 = function(e3, t3, n3 = {}) {
      const s3 = /\?/.test(t3);
      let r3 = "";
      for (let e4 in n3)
        "" === r3 ? !s3 && (t3 += "?") : r3 += "&", r3 += `${e4}=${encodeURIComponent(n3[e4])}`;
      return /^http(s)?\:\/\//.test(t3 += r3) ? t3 : `${e3}${t3}`;
    }(_e, "//tcb-api.tencentcloudapi.com/web", d2);
    h2 && (p2 += h2);
    const f2 = await this.post({ url: p2, data: o2, ...a2 }), g2 = f2.header && f2.header["x-tcb-trace"];
    if (g2 && this._localCache.setStore(s2, g2), 200 !== Number(f2.status) && 200 !== Number(f2.statusCode) || !f2.data)
      throw new re({ code: "NETWORK_ERROR", message: "network request error" });
    return f2;
  }
  async send(e2, t2 = {}, n2 = {}) {
    const s2 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
    if (("ACCESS_TOKEN_DISABLED" === s2.data.code || "ACCESS_TOKEN_EXPIRED" === s2.data.code) && -1 === Ze.indexOf(e2)) {
      await this.oauth.refreshAccessToken();
      const s3 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
      if (s3.data.code)
        throw new re({ code: s3.data.code, message: Ce(s3.data.message) });
      return s3.data;
    }
    if (s2.data.code)
      throw new re({ code: s2.data.code, message: Ce(s2.data.message) });
    return s2.data;
  }
  setRefreshToken(e2) {
    const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
  }
}
const rt = {};
function it(e2) {
  return rt[e2];
}
class ot {
  constructor(e2) {
    this.config = e2, this._cache = qe(e2.env), this._request = it(e2.env);
  }
  setRefreshToken(e2) {
    const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
  }
  setAccessToken(e2, t2) {
    const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
    this._cache.setStore(n2, e2), this._cache.setStore(s2, t2);
  }
  async refreshUserInfo() {
    const { data: e2 } = await this._request.send("auth.getUserInfo", {});
    return this.setLocalUserInfo(e2), e2;
  }
  setLocalUserInfo(e2) {
    const { userInfoKey: t2 } = this._cache.keys;
    this._cache.setStore(t2, e2);
  }
}
class at {
  constructor(e2) {
    if (!e2)
      throw new re({ code: "PARAM_ERROR", message: "envId is not defined" });
    this._envId = e2, this._cache = qe(this._envId), this._request = it(this._envId), this.setUserInfo();
  }
  linkWithTicket(e2) {
    if ("string" != typeof e2)
      throw new re({ code: "PARAM_ERROR", message: "ticket must be string" });
    return this._request.send("auth.linkWithTicket", { ticket: e2 });
  }
  linkWithRedirect(e2) {
    e2.signInWithRedirect();
  }
  updatePassword(e2, t2) {
    return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e2 });
  }
  updateEmail(e2) {
    return this._request.send("auth.updateEmail", { newEmail: e2 });
  }
  updateUsername(e2) {
    if ("string" != typeof e2)
      throw new re({ code: "PARAM_ERROR", message: "username must be a string" });
    return this._request.send("auth.updateUsername", { username: e2 });
  }
  async getLinkedUidList() {
    const { data: e2 } = await this._request.send("auth.getLinkedUidList", {});
    let t2 = false;
    const { users: n2 } = e2;
    return n2.forEach((e3) => {
      e3.wxOpenId && e3.wxPublicId && (t2 = true);
    }), { users: n2, hasPrimaryUid: t2 };
  }
  setPrimaryUid(e2) {
    return this._request.send("auth.setPrimaryUid", { uid: e2 });
  }
  unlink(e2) {
    return this._request.send("auth.unlink", { platform: e2 });
  }
  async update(e2) {
    const { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 } = e2, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 });
    this.setLocalUserInfo(a2);
  }
  async refresh() {
    const e2 = await this._request.oauth.getUserInfo();
    return this.setLocalUserInfo(e2), e2;
  }
  setUserInfo() {
    const { userInfoKey: e2 } = this._cache.keys, t2 = this._cache.getStore(e2);
    ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e3) => {
      this[e3] = t2[e3];
    }), this.location = { country: t2.country, province: t2.province, city: t2.city };
  }
  setLocalUserInfo(e2) {
    const { userInfoKey: t2 } = this._cache.keys;
    this._cache.setStore(t2, e2), this.setUserInfo();
  }
}
class ct {
  constructor(e2) {
    if (!e2)
      throw new re({ code: "PARAM_ERROR", message: "envId is not defined" });
    this._cache = qe(e2);
    const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, r2 = this._cache.getStore(t2), i2 = this._cache.getStore(n2), o2 = this._cache.getStore(s2);
    this.credential = { refreshToken: r2, accessToken: i2, accessTokenExpire: o2 }, this.user = new at(e2);
  }
  get isAnonymousAuth() {
    return this.loginType === Qe.ANONYMOUS;
  }
  get isCustomAuth() {
    return this.loginType === Qe.CUSTOM;
  }
  get isWeixinAuth() {
    return this.loginType === Qe.WECHAT || this.loginType === Qe.WECHAT_OPEN || this.loginType === Qe.WECHAT_PUBLIC;
  }
  get loginType() {
    return this._cache.getStore(this._cache.keys.loginTypeKey);
  }
}
class ut extends ot {
  async signIn() {
    this._cache.updatePersistence("local"), await this._request.oauth.getAccessToken(), Be(He), Be(ze, { env: this.config.env, loginType: Qe.ANONYMOUS, persistence: "local" });
    const e2 = new ct(this.config.env);
    return await e2.user.refresh(), e2;
  }
  async linkAndRetrieveDataWithTicket(e2) {
    const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: r2, ticket: e2 });
    if (i2.refresh_token)
      return this._clearAnonymousUUID(), this.setRefreshToken(i2.refresh_token), await this._request.refreshAccessToken(), Be(Ve, { env: this.config.env }), Be(ze, { loginType: Qe.CUSTOM, persistence: "local" }), { credential: { refreshToken: i2.refresh_token } };
    throw new re({ message: "匿名转化失败" });
  }
  _setAnonymousUUID(e2) {
    const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.setStore(t2, e2), this._cache.setStore(n2, Qe.ANONYMOUS);
  }
  _clearAnonymousUUID() {
    this._cache.removeStore(this._cache.keys.anonymousUuidKey);
  }
}
class lt extends ot {
  async signIn(e2) {
    if ("string" != typeof e2)
      throw new re({ code: "PARAM_ERROR", message: "ticket must be a string" });
    const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e2, refresh_token: this._cache.getStore(t2) || "" });
    if (n2.refresh_token)
      return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), Be(He), Be(ze, { env: this.config.env, loginType: Qe.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new ct(this.config.env);
    throw new re({ message: "自定义登录失败" });
  }
}
class ht extends ot {
  async signIn(e2, t2) {
    if ("string" != typeof e2)
      throw new re({ code: "PARAM_ERROR", message: "email must be a string" });
    const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token: i2, access_token_expire: o2 } = s2;
    if (r2)
      return this.setRefreshToken(r2), i2 && o2 ? this.setAccessToken(i2, o2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Be(He), Be(ze, { env: this.config.env, loginType: Qe.EMAIL, persistence: this.config.persistence }), new ct(this.config.env);
    throw s2.code ? new re({ code: s2.code, message: `邮箱登录失败: ${s2.message}` }) : new re({ message: "邮箱登录失败" });
  }
  async activate(e2) {
    return this._request.send("auth.activateEndUserMail", { token: e2 });
  }
  async resetPasswordWithToken(e2, t2) {
    return this._request.send("auth.resetPasswordWithToken", { token: e2, newPassword: t2 });
  }
}
class dt extends ot {
  async signIn(e2, t2) {
    if ("string" != typeof e2)
      throw new re({ code: "PARAM_ERROR", message: "username must be a string" });
    "string" != typeof t2 && (t2 = "", console.warn("password is empty"));
    const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: Qe.USERNAME, username: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token_expire: i2, access_token: o2 } = s2;
    if (r2)
      return this.setRefreshToken(r2), o2 && i2 ? this.setAccessToken(o2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Be(He), Be(ze, { env: this.config.env, loginType: Qe.USERNAME, persistence: this.config.persistence }), new ct(this.config.env);
    throw s2.code ? new re({ code: s2.code, message: `用户名密码登录失败: ${s2.message}` }) : new re({ message: "用户名密码登录失败" });
  }
}
class pt {
  constructor(e2) {
    this.config = e2, this._cache = qe(e2.env), this._request = it(e2.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), $e(ze, this._onLoginTypeChanged);
  }
  get currentUser() {
    const e2 = this.hasLoginState();
    return e2 && e2.user || null;
  }
  get loginType() {
    return this._cache.getStore(this._cache.keys.loginTypeKey);
  }
  anonymousAuthProvider() {
    return new ut(this.config);
  }
  customAuthProvider() {
    return new lt(this.config);
  }
  emailAuthProvider() {
    return new ht(this.config);
  }
  usernameAuthProvider() {
    return new dt(this.config);
  }
  async signInAnonymously() {
    return new ut(this.config).signIn();
  }
  async signInWithEmailAndPassword(e2, t2) {
    return new ht(this.config).signIn(e2, t2);
  }
  signInWithUsernameAndPassword(e2, t2) {
    return new dt(this.config).signIn(e2, t2);
  }
  async linkAndRetrieveDataWithTicket(e2) {
    this._anonymousAuthProvider || (this._anonymousAuthProvider = new ut(this.config)), $e(Ve, this._onAnonymousConverted);
    return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e2);
  }
  async signOut() {
    if (this.loginType === Qe.ANONYMOUS)
      throw new re({ message: "匿名用户不支持登出操作" });
    const { refreshTokenKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e2);
    if (!s2)
      return;
    const r2 = await this._request.send("auth.logout", { refresh_token: s2 });
    return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.removeStore(n2), Be(He), Be(ze, { env: this.config.env, loginType: Qe.NULL, persistence: this.config.persistence }), r2;
  }
  async signUpWithEmailAndPassword(e2, t2) {
    return this._request.send("auth.signUpWithEmailAndPassword", { email: e2, password: t2 });
  }
  async sendPasswordResetEmail(e2) {
    return this._request.send("auth.sendPasswordResetEmail", { email: e2 });
  }
  onLoginStateChanged(e2) {
    $e(He, () => {
      const t3 = this.hasLoginState();
      e2.call(this, t3);
    });
    const t2 = this.hasLoginState();
    e2.call(this, t2);
  }
  onLoginStateExpired(e2) {
    $e(Je, e2.bind(this));
  }
  onAccessTokenRefreshed(e2) {
    $e(Ge, e2.bind(this));
  }
  onAnonymousConverted(e2) {
    $e(Ve, e2.bind(this));
  }
  onLoginTypeChanged(e2) {
    $e(ze, () => {
      const t2 = this.hasLoginState();
      e2.call(this, t2);
    });
  }
  async getAccessToken() {
    return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
  }
  hasLoginState() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
    return this._request.oauth.isAccessTokenExpired(n2, s2) ? null : new ct(this.config.env);
  }
  async isUsernameRegistered(e2) {
    if ("string" != typeof e2)
      throw new re({ code: "PARAM_ERROR", message: "username must be a string" });
    const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e2 });
    return t2 && t2.isRegistered;
  }
  getLoginState() {
    return Promise.resolve(this.hasLoginState());
  }
  async signInWithTicket(e2) {
    return new lt(this.config).signIn(e2);
  }
  shouldRefreshAccessToken(e2) {
    this._request._shouldRefreshAccessTokenHook = e2.bind(this);
  }
  getUserInfo() {
    return this._request.send("auth.getUserInfo", {}).then((e2) => e2.code ? e2 : { ...e2.data, requestId: e2.seqId });
  }
  getAuthHeader() {
    const { refreshTokenKey: e2, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2);
    return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
  }
  _onAnonymousConverted(e2) {
    const { env: t2 } = e2.data;
    t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
  }
  _onLoginTypeChanged(e2) {
    const { loginType: t2, persistence: n2, env: s2 } = e2.data;
    s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
  }
}
const ft = function(e2, t2) {
  t2 = t2 || ke();
  const n2 = it(this.config.env), { cloudPath: s2, filePath: r2, onUploadProgress: i2, fileType: o2 = "image" } = e2;
  return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
    const { data: { url: a2, authorization: c2, token: u2, fileId: l2, cosFileId: h2 }, requestId: d2 } = e3, p2 = { key: s2, signature: c2, "x-cos-meta-fileid": h2, success_action_status: "201", "x-cos-security-token": u2 };
    n2.upload({ url: a2, data: p2, file: r2, name: s2, fileType: o2, onUploadProgress: i2 }).then((e4) => {
      201 === e4.statusCode ? t2(null, { fileID: l2, requestId: d2 }) : t2(new re({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e4.data}` }));
    }).catch((e4) => {
      t2(e4);
    });
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, gt = function(e2, t2) {
  t2 = t2 || ke();
  const n2 = it(this.config.env), { cloudPath: s2 } = e2;
  return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
    t2(null, e3);
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, mt = function({ fileList: e2 }, t2) {
  if (t2 = t2 || ke(), !e2 || !Array.isArray(e2))
    return { code: "INVALID_PARAM", message: "fileList必须是非空的数组" };
  for (let t3 of e2)
    if (!t3 || "string" != typeof t3)
      return { code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" };
  const n2 = { fileid_list: e2 };
  return it(this.config.env).send("storage.batchDeleteFile", n2).then((e3) => {
    e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.delete_list, requestId: e3.requestId });
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, yt = function({ fileList: e2 }, t2) {
  t2 = t2 || ke(), e2 && Array.isArray(e2) || t2(null, { code: "INVALID_PARAM", message: "fileList必须是非空的数组" });
  let n2 = [];
  for (let s3 of e2)
    "object" == typeof s3 ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是包含fileID和maxAge的对象" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : "string" == typeof s3 ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是字符串" });
  const s2 = { file_list: n2 };
  return it(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e3) => {
    e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.download_list, requestId: e3.requestId });
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, _t = async function({ fileID: e2 }, t2) {
  const n2 = (await yt.call(this, { fileList: [{ fileID: e2, maxAge: 600 }] })).fileList[0];
  if ("SUCCESS" !== n2.code)
    return t2 ? t2(n2) : new Promise((e3) => {
      e3(n2);
    });
  const s2 = it(this.config.env);
  let r2 = n2.download_url;
  if (r2 = encodeURI(r2), !t2)
    return s2.download({ url: r2 });
  t2(await s2.download({ url: r2 }));
}, wt = function({ name: e2, data: t2, query: n2, parse: s2, search: r2, timeout: i2 }, o2) {
  const a2 = o2 || ke();
  let c2;
  try {
    c2 = t2 ? JSON.stringify(t2) : "";
  } catch (e3) {
    return Promise.reject(e3);
  }
  if (!e2)
    return Promise.reject(new re({ code: "PARAM_ERROR", message: "函数名不能为空" }));
  const u2 = { inQuery: n2, parse: s2, search: r2, function_name: e2, request_data: c2 };
  return it(this.config.env).send("functions.invokeFunction", u2, { timeout: i2 }).then((e3) => {
    if (e3.code)
      a2(null, e3);
    else {
      let t3 = e3.data.response_data;
      if (s2)
        a2(null, { result: t3, requestId: e3.requestId });
      else
        try {
          t3 = JSON.parse(e3.data.response_data), a2(null, { result: t3, requestId: e3.requestId });
        } catch (e4) {
          a2(new re({ message: "response data must be json" }));
        }
    }
    return a2.promise;
  }).catch((e3) => {
    a2(e3);
  }), a2.promise;
}, vt = { timeout: 15e3, persistence: "session" }, It = {};
class St {
  constructor(e2) {
    this.config = e2 || this.config, this.authObj = void 0;
  }
  init(e2) {
    switch (xe.adapter || (this.requestClient = new xe.adapter.reqClass({ timeout: e2.timeout || 5e3, timeoutMsg: `请求在${(e2.timeout || 5e3) / 1e3}s内未完成，已中断` })), this.config = { ...vt, ...e2 }, true) {
      case this.config.timeout > 6e5:
        console.warn("timeout大于可配置上限[10分钟]，已重置为上限数值"), this.config.timeout = 6e5;
        break;
      case this.config.timeout < 100:
        console.warn("timeout小于可配置下限[100ms]，已重置为下限数值"), this.config.timeout = 100;
    }
    return new St(this.config);
  }
  auth({ persistence: e2 } = {}) {
    if (this.authObj)
      return this.authObj;
    const t2 = e2 || xe.adapter.primaryStorage || vt.persistence;
    var n2;
    return t2 !== this.config.persistence && (this.config.persistence = t2), function(e3) {
      const { env: t3 } = e3;
      De[t3] = new Ne(e3), Me[t3] = new Ne({ ...e3, persistence: "local" });
    }(this.config), n2 = this.config, rt[n2.env] = new st(n2), this.authObj = new pt(this.config), this.authObj;
  }
  on(e2, t2) {
    return $e.apply(this, [e2, t2]);
  }
  off(e2, t2) {
    return We.apply(this, [e2, t2]);
  }
  callFunction(e2, t2) {
    return wt.apply(this, [e2, t2]);
  }
  deleteFile(e2, t2) {
    return mt.apply(this, [e2, t2]);
  }
  getTempFileURL(e2, t2) {
    return yt.apply(this, [e2, t2]);
  }
  downloadFile(e2, t2) {
    return _t.apply(this, [e2, t2]);
  }
  uploadFile(e2, t2) {
    return ft.apply(this, [e2, t2]);
  }
  getUploadMetadata(e2, t2) {
    return gt.apply(this, [e2, t2]);
  }
  registerExtension(e2) {
    It[e2.name] = e2;
  }
  async invokeExtension(e2, t2) {
    const n2 = It[e2];
    if (!n2)
      throw new re({ message: `扩展${e2} 必须先注册` });
    return await n2.invoke(t2, this);
  }
  useAdapters(e2) {
    const { adapter: t2, runtime: n2 } = Ee(e2) || {};
    t2 && (xe.adapter = t2), n2 && (xe.runtime = n2);
  }
}
var bt = new St();
function kt(e2, t2, n2) {
  void 0 === n2 && (n2 = {});
  var s2 = /\?/.test(t2), r2 = "";
  for (var i2 in n2)
    "" === r2 ? !s2 && (t2 += "?") : r2 += "&", r2 += i2 + "=" + encodeURIComponent(n2[i2]);
  return /^http(s)?:\/\//.test(t2 += r2) ? t2 : "" + e2 + t2;
}
class At {
  get(e2) {
    const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
    return new Promise((e3, i2) => {
      ie.request({ url: kt("https:", t2), data: n2, method: "GET", header: s2, timeout: r2, success(t3) {
        e3(t3);
      }, fail(e4) {
        i2(e4);
      } });
    });
  }
  post(e2) {
    const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
    return new Promise((e3, i2) => {
      ie.request({ url: kt("https:", t2), data: n2, method: "POST", header: s2, timeout: r2, success(t3) {
        e3(t3);
      }, fail(e4) {
        i2(e4);
      } });
    });
  }
  upload(e2) {
    return new Promise((t2, n2) => {
      const { url: s2, file: r2, data: i2, headers: o2, fileType: a2 } = e2, c2 = ie.uploadFile({ url: kt("https:", s2), name: "file", formData: Object.assign({}, i2), filePath: r2, fileType: a2, header: o2, success(e3) {
        const n3 = { statusCode: e3.statusCode, data: e3.data || {} };
        200 === e3.statusCode && i2.success_action_status && (n3.statusCode = parseInt(i2.success_action_status, 10)), t2(n3);
      }, fail(e3) {
        n2(new Error(e3.errMsg || "uploadFile:fail"));
      } });
      "function" == typeof e2.onUploadProgress && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((t3) => {
        e2.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
      });
    });
  }
}
const Tt = { setItem(e2, t2) {
  ie.setStorageSync(e2, t2);
}, getItem: (e2) => ie.getStorageSync(e2), removeItem(e2) {
  ie.removeStorageSync(e2);
}, clear() {
  ie.clearStorageSync();
} };
var Ct = { genAdapter: function() {
  return { root: {}, reqClass: At, localStorage: Tt, primaryStorage: "local" };
}, isMatch: function() {
  return true;
}, runtime: "uni_app" };
bt.useAdapters(Ct);
const Pt = bt, Ot = Pt.init;
Pt.init = function(e2) {
  e2.env = e2.spaceId;
  const t2 = Ot.call(this, e2);
  t2.config.provider = "tencent", t2.config.spaceId = e2.spaceId;
  const n2 = t2.auth;
  return t2.auth = function(e3) {
    const t3 = n2.call(this, e3);
    return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e4) => {
      var n3;
      t3[e4] = (n3 = t3[e4], function(e5) {
        e5 = e5 || {};
        const { success: t4, fail: s2, complete: r2 } = se(e5);
        if (!(t4 || s2 || r2))
          return n3.call(this, e5);
        n3.call(this, e5).then((e6) => {
          t4 && t4(e6), r2 && r2(e6);
        }, (e6) => {
          s2 && s2(e6), r2 && r2(e6);
        });
      }).bind(t3);
    }), t3;
  }, t2.customAuth = t2.auth, t2;
};
var Et = Pt;
async function xt(e2, t2) {
  const n2 = `http://${e2}:${t2}/system/ping`;
  try {
    const e3 = await (s2 = { url: n2, timeout: 500 }, new Promise((e4, t3) => {
      ie.request({ ...s2, success(t4) {
        e4(t4);
      }, fail(e5) {
        t3(e5);
      } });
    }));
    return !(!e3.data || 0 !== e3.data.code);
  } catch (e3) {
    return false;
  }
  var s2;
}
async function Lt(e2, t2) {
  let n2;
  for (let s2 = 0; s2 < e2.length; s2++) {
    const r2 = e2[s2];
    if (await xt(r2, t2)) {
      n2 = r2;
      break;
    }
  }
  return { address: n2, port: t2 };
}
const Ut = { "serverless.file.resource.generateProximalSign": "storage/generate-proximal-sign", "serverless.file.resource.report": "storage/report", "serverless.file.resource.delete": "storage/delete", "serverless.file.resource.getTempFileURL": "storage/get-temp-file-url" };
var Rt = class {
  constructor(e2) {
    if (["spaceId", "clientSecret"].forEach((t2) => {
      if (!Object.prototype.hasOwnProperty.call(e2, t2))
        throw new Error(`${t2} required`);
    }), !e2.endpoint)
      throw new Error("集群空间未配置ApiEndpoint，配置后需要重新关联服务空间后生效");
    this.config = Object.assign({}, e2), this.config.provider = "dcloud", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.adapter = ie;
  }
  async request(e2, t2 = true) {
    const n2 = t2;
    return e2 = n2 ? await this.setupLocalRequest(e2) : this.setupRequest(e2), Promise.resolve().then(() => n2 ? this.requestLocal(e2) : ge.wrappedRequest(e2, this.adapter.request));
  }
  requestLocal(e2) {
    return new Promise((t2, n2) => {
      this.adapter.request(Object.assign(e2, { complete(e3) {
        if (e3 || (e3 = {}), !e3.statusCode || e3.statusCode >= 400) {
          const t3 = e3.data && e3.data.code || "SYS_ERR", s2 = e3.data && e3.data.message || "request:fail";
          return n2(new re({ code: t3, message: s2 }));
        }
        t2({ success: true, result: e3.data });
      } }));
    });
  }
  setupRequest(e2) {
    const t2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), n2 = { "Content-Type": "application/json" };
    n2["x-serverless-sign"] = ge.sign(t2, this.config.clientSecret);
    const s2 = fe();
    n2["x-client-info"] = encodeURIComponent(JSON.stringify(s2));
    const { token: r2 } = ae();
    return n2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: t2, dataType: "json", header: JSON.parse(JSON.stringify(n2)) };
  }
  async setupLocalRequest(e2) {
    const t2 = fe(), { token: n2 } = ae(), s2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now(), clientInfo: t2, token: n2 }), { address: r2, servePort: i2 } = this.__dev__ && this.__dev__.debugInfo || {}, { address: o2 } = await Lt(r2, i2);
    return { url: `http://${o2}:${i2}/${Ut[e2.method]}`, method: "POST", data: s2, dataType: "json", header: JSON.parse(JSON.stringify({ "Content-Type": "application/json" })) };
  }
  callFunction(e2) {
    const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
    return this.request(t2, false);
  }
  getUploadFileOptions(e2) {
    const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
    return this.request(t2);
  }
  reportUploadFile(e2) {
    const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
    return this.request(t2);
  }
  uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
    if (!t2)
      throw new re({ code: "CLOUDPATH_REQUIRED", message: "cloudPath不可为空" });
    let r2;
    return this.getUploadFileOptions({ cloudPath: t2 }).then((t3) => {
      const { url: i2, formData: o2, name: a2 } = t3.result;
      return r2 = t3.result.fileUrl, new Promise((t4, r3) => {
        const c2 = this.adapter.uploadFile({ url: i2, formData: o2, name: a2, filePath: e2, fileType: n2, success(e3) {
          e3 && e3.statusCode < 400 ? t4(e3) : r3(new re({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          r3(new re({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof s2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
          s2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }).then(() => this.reportUploadFile({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
      t3.success ? n3({ success: true, filePath: e2, fileID: r2 }) : s3(new re({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
    }));
  }
  deleteFile({ fileList: e2 }) {
    const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e2 }) };
    return this.request(t2).then((e3) => {
      if (e3.success)
        return e3.result;
      throw new re({ code: "DELETE_FILE_FAILED", message: "删除文件失败" });
    });
  }
  getTempFileURL({ fileList: e2, maxAge: t2 } = {}) {
    if (!Array.isArray(e2) || 0 === e2.length)
      throw new re({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
    const n2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e2, maxAge: t2 }) };
    return this.request(n2).then((e3) => {
      if (e3.success)
        return { fileList: e3.result.fileList.map((e4) => ({ fileID: e4.fileID, tempFileURL: e4.tempFileURL })) };
      throw new re({ code: "GET_TEMP_FILE_URL_FAILED", message: "获取临时文件链接失败" });
    });
  }
};
var Nt = { init(e2) {
  const t2 = new Rt(e2), n2 = { signInAnonymously: function() {
    return Promise.resolve();
  }, getLoginState: function() {
    return Promise.resolve(false);
  } };
  return t2.auth = function() {
    return n2;
  }, t2.customAuth = t2.auth, t2;
} }, Dt = n(function(e2, t2) {
  e2.exports = r.enc.Hex;
});
function Mt() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e2) {
    var t2 = 16 * Math.random() | 0;
    return ("x" === e2 ? t2 : 3 & t2 | 8).toString(16);
  });
}
function qt(e2 = "", t2 = {}) {
  const { data: n2, functionName: s2, method: r2, headers: i2, signHeaderKeys: o2 = [], config: a2 } = t2, c2 = String(Date.now()), u2 = Mt(), l2 = Object.assign({}, i2, { "x-from-app-id": a2.spaceAppId, "x-from-env-id": a2.spaceId, "x-to-env-id": a2.spaceId, "x-from-instance-id": c2, "x-from-function-name": s2, "x-client-timestamp": c2, "x-alipay-source": "client", "x-request-id": u2, "x-alipay-callid": u2, "x-trace-id": u2 }), h2 = ["x-from-app-id", "x-from-env-id", "x-to-env-id", "x-from-instance-id", "x-from-function-name", "x-client-timestamp"].concat(o2), [d2 = "", p2 = ""] = e2.split("?") || [], f2 = function(e3) {
    const t3 = e3.signedHeaders.join(";"), n3 = e3.signedHeaders.map((t4) => `${t4.toLowerCase()}:${e3.headers[t4]}
`).join(""), s3 = Se(e3.body).toString(Dt), r3 = `${e3.method.toUpperCase()}
${e3.path}
${e3.query}
${n3}
${t3}
${s3}
`, i3 = Se(r3).toString(Dt), o3 = `HMAC-SHA256
${e3.timestamp}
${i3}
`, a3 = be(o3, e3.secretKey).toString(Dt);
    return `HMAC-SHA256 Credential=${e3.secretId}, SignedHeaders=${t3}, Signature=${a3}`;
  }({ path: d2, query: p2, method: r2, headers: l2, timestamp: c2, body: JSON.stringify(n2), secretId: a2.accessKey, secretKey: a2.secretKey, signedHeaders: h2.sort() });
  return { url: `${a2.endpoint}${e2}`, headers: Object.assign({}, l2, { Authorization: f2 }) };
}
function Ft({ url: e2, data: t2, method: n2 = "POST", headers: s2 = {}, timeout: r2 }) {
  return new Promise((i2, o2) => {
    ie.request({ url: e2, method: n2, data: "object" == typeof t2 ? JSON.stringify(t2) : t2, header: s2, dataType: "json", timeout: r2, complete: (e3 = {}) => {
      const t3 = s2["x-trace-id"] || "";
      if (!e3.statusCode || e3.statusCode >= 400) {
        const { message: n3, errMsg: s3, trace_id: r3 } = e3.data || {};
        return o2(new re({ code: "SYS_ERR", message: n3 || s3 || "request:fail", requestId: r3 || t3 }));
      }
      i2({ status: e3.statusCode, data: e3.data, headers: e3.header, requestId: t3 });
    } });
  });
}
function Kt(e2, t2) {
  const { path: n2, data: s2, method: r2 = "GET" } = e2, { url: i2, headers: o2 } = qt(n2, { functionName: "", data: s2, method: r2, headers: { "x-alipay-cloud-mode": "oss", "x-data-api-type": "oss", "x-expire-timestamp": String(Date.now() + 6e4) }, signHeaderKeys: ["x-data-api-type", "x-expire-timestamp"], config: t2 });
  return Ft({ url: i2, data: s2, method: r2, headers: o2 }).then((e3) => {
    const t3 = e3.data || {};
    if (!t3.success)
      throw new re({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
    return t3.data || {};
  }).catch((e3) => {
    throw new re({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
  });
}
function jt(e2 = "") {
  const t2 = e2.trim().replace(/^cloud:\/\//, ""), n2 = t2.indexOf("/");
  if (n2 <= 0)
    throw new re({ code: "INVALID_PARAM", message: "fileID不合法" });
  const s2 = t2.substring(0, n2), r2 = t2.substring(n2 + 1);
  return s2 !== this.config.spaceId && console.warn("file ".concat(e2, " does not belong to env ").concat(this.config.spaceId)), r2;
}
function $t(e2 = "") {
  return "cloud://".concat(this.config.spaceId, "/").concat(e2.replace(/^\/+/, ""));
}
class Bt {
  constructor(e2) {
    this.config = e2;
  }
  signedURL(e2, t2 = {}) {
    const n2 = `/ws/function/${e2}`, s2 = this.config.wsEndpoint.replace(/^ws(s)?:\/\//, ""), r2 = Object.assign({}, t2, { accessKeyId: this.config.accessKey, signatureNonce: Mt(), timestamp: "" + Date.now() }), i2 = [n2, ["accessKeyId", "authorization", "signatureNonce", "timestamp"].sort().map(function(e3) {
      return r2[e3] ? "".concat(e3, "=").concat(r2[e3]) : null;
    }).filter(Boolean).join("&"), `host:${s2}`].join("\n"), o2 = ["HMAC-SHA256", Se(i2).toString(Dt)].join("\n"), a2 = be(o2, this.config.secretKey).toString(Dt), c2 = Object.keys(r2).map((e3) => `${e3}=${encodeURIComponent(r2[e3])}`).join("&");
    return `${this.config.wsEndpoint}${n2}?${c2}&signature=${a2}`;
  }
}
class Wt {
  constructor(e2) {
    this.config = e2;
  }
  signedURL(e2, t2 = {}) {
    const n2 = `/ws/sse/function/${e2}`, s2 = this.config.endpoint.replace(/^http(s)?:\/\//, ""), r2 = Object.assign({}, t2, { accessKeyId: this.config.accessKey, signatureNonce: Mt(), timestamp: "" + Date.now() }), i2 = ["accessKeyId", "authorization", "signatureNonce", "timestamp"].sort().map(function(e3) {
      return r2[e3] ? "".concat(e3, "=").concat(r2[e3]) : null;
    }).filter(Boolean).join("&"), o2 = [n2.replace("/ws", ""), i2, `host:${s2}`].join("\n"), a2 = ["HMAC-SHA256", Se(o2).toString(Dt)].join("\n"), c2 = be(a2, this.config.secretKey).toString(Dt), u2 = Object.keys(r2).map((e3) => `${e3}=${encodeURIComponent(r2[e3])}`).join("&");
    return `${this.config.endpoint}${n2}?${u2}&signature=${c2}`;
  }
}
var Ht = class {
  constructor(e2) {
    if (["spaceId", "spaceAppId", "accessKey", "secretKey"].forEach((t2) => {
      if (!Object.prototype.hasOwnProperty.call(e2, t2))
        throw new Error(`${t2} required`);
    }), e2.endpoint) {
      if ("string" != typeof e2.endpoint)
        throw new Error("endpoint must be string");
      if (!/^https:\/\//.test(e2.endpoint))
        throw new Error("endpoint must start with https://");
      e2.endpoint = e2.endpoint.replace(/\/$/, "");
    }
    this.config = Object.assign({}, e2, { endpoint: e2.endpoint || `https://${e2.spaceId}.api-hz.cloudbasefunction.cn`, wsEndpoint: e2.wsEndpoint || `wss://${e2.spaceId}.api-hz.cloudbasefunction.cn` }), this._websocket = new Bt(this.config), this._sse = new Wt(this.config);
  }
  callFunction(e2) {
    return function(e3, t2) {
      const { name: n2, data: s2, async: r2 = false, timeout: i2 } = e3, o2 = "POST", a2 = { "x-to-function-name": n2 };
      r2 && (a2["x-function-invoke-type"] = "async");
      const { url: c2, headers: u2 } = qt("/functions/invokeFunction", { functionName: n2, data: s2, method: o2, headers: a2, signHeaderKeys: ["x-to-function-name"], config: t2 });
      return Ft({ url: c2, data: s2, method: o2, headers: u2, timeout: i2 }).then((e4) => {
        let t3 = 0;
        if (r2) {
          const n3 = e4.data || {};
          t3 = "200" === n3.errCode ? 0 : n3.errCode, e4.data = n3.data || {}, e4.errMsg = n3.errMsg;
        }
        if (0 !== t3)
          throw new re({ code: t3, message: e4.errMsg, requestId: e4.requestId });
        return { errCode: t3, success: 0 === t3, requestId: e4.requestId, result: e4.data };
      }).catch((e4) => {
        throw new re({ code: e4.errCode, message: e4.errMsg, requestId: e4.requestId });
      });
    }(e2, this.config);
  }
  uploadFileToOSS({ url: e2, filePath: t2, fileType: n2, formData: s2, onUploadProgress: r2 }) {
    return new Promise((i2, o2) => {
      const a2 = ie.uploadFile({ url: e2, filePath: t2, fileType: n2, formData: s2, name: "file", success(e3) {
        e3 && e3.statusCode < 400 ? i2(e3) : o2(new re({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
      }, fail(e3) {
        o2(new re({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
      } });
      "function" == typeof r2 && a2 && "function" == typeof a2.onProgressUpdate && a2.onProgressUpdate((e3) => {
        r2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
      });
    });
  }
  async uploadFile({ filePath: e2, cloudPath: t2 = "", fileType: n2 = "image", onUploadProgress: s2 }) {
    if ("string" !== f(t2))
      throw new re({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
    if (!(t2 = t2.trim()))
      throw new re({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
    if (/:\/\//.test(t2))
      throw new re({ code: "INVALID_PARAM", message: "cloudPath不合法" });
    const r2 = await Kt({ path: "/".concat(t2.replace(/^\//, ""), "?post_url") }, this.config), { file_id: i2, upload_url: o2, form_data: a2 } = r2, c2 = a2 && a2.reduce((e3, t3) => (e3[t3.key] = t3.value, e3), {});
    return this.uploadFileToOSS({ url: o2, filePath: e2, fileType: n2, formData: c2, onUploadProgress: s2 }).then(() => ({ fileID: i2 }));
  }
  async getTempFileURL({ fileList: e2 }) {
    return new Promise((t2, n2) => {
      (!e2 || e2.length < 0) && t2({ code: "INVALID_PARAM", message: "fileList不能为空数组" }), e2.length > 50 && t2({ code: "INVALID_PARAM", message: "fileList数组长度不能超过50" });
      const s2 = [];
      for (const n3 of e2) {
        let e3;
        "string" !== f(n3) && t2({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
        try {
          e3 = jt.call(this, n3);
        } catch (t3) {
          console.warn(t3.errCode, t3.errMsg), e3 = n3;
        }
        s2.push({ file_id: e3, expire: 600 });
      }
      Kt({ path: "/?download_url", data: { file_list: s2 }, method: "POST" }, this.config).then((e3) => {
        const { file_list: n3 = [] } = e3;
        t2({ fileList: n3.map((e4) => ({ fileID: $t.call(this, e4.file_id), tempFileURL: e4.download_url })) });
      }).catch((e3) => n2(e3));
    });
  }
  async connectWebSocket(e2) {
    const { name: t2, query: n2 } = e2;
    return ie.connectSocket({ url: this._websocket.signedURL(t2, n2), complete: () => {
    } });
  }
  requestSSE(e2) {
    const { name: t2, data: n2 } = e2;
    return ie.request({ method: "POST", url: this._sse.signedURL(t2), data: n2, header: { "content-type": "application/json" }, dataType: "json" });
  }
};
var Jt = { init: (e2) => {
  e2.provider = "alipay";
  const t2 = new Ht(e2);
  return t2.auth = function() {
    return { signInAnonymously: function() {
      return Promise.resolve();
    }, getLoginState: function() {
      return Promise.resolve(true);
    } };
  }, t2;
} };
function zt({ data: e2 }) {
  let t2;
  t2 = fe();
  const n2 = JSON.parse(JSON.stringify(e2 || {}));
  if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
    const { token: e3 } = ae();
    e3 && (n2.uniIdToken = e3);
  }
  return n2;
}
const Vt = { enable: false, interval: 0, space: {} };
let Gt = null, Qt = 0, Yt = false;
function Xt() {
  return Array.isArray(P) && P.length ? P[0] : {};
}
function Zt(e2) {
  return `${e2}_${Xt().spaceId || "default"}`;
}
function en() {
  if (Gt)
    return Gt;
  try {
    const e2 = ie.getStorageSync(Zt("UNICLOUD_FAILOVER_CONFIG"));
    if (g(e2))
      return Gt = e2, e2;
  } catch (e2) {
  }
  return null;
}
function tn(e2) {
  Qt = e2;
  try {
    ie.setStorageSync(Zt("UNICLOUD_FAILOVER_LAST_REQUEST"), e2);
  } catch (e3) {
  }
}
function nn(e2) {
  if (null === e2 || e2 < 0)
    return false;
  if (0 === e2)
    return true;
  const t2 = function() {
    if (Qt)
      return Qt;
    try {
      const e3 = ie.getStorageSync(Zt("UNICLOUD_FAILOVER_LAST_REQUEST"));
      if (e3 && "number" == typeof e3)
        return Qt = e3, e3;
    } catch (e3) {
    }
    return 0;
  }();
  if (!t2)
    return true;
  return Date.now() - t2 >= e2;
}
async function sn() {
  const e2 = Xt(), { failoverEndpoint: t2 } = e2;
  if (!t2)
    return null;
  if (Yt)
    return en();
  Yt = true;
  try {
    const e3 = `${t2}/.unicloud/failover-cfg.json`, n2 = await ie.request({ url: e3, method: "GET", dataType: "json", timeout: 5e3 });
    if (tn(Date.now()), 200 !== n2.statusCode || !g(n2.data))
      return null;
    const s2 = { ...Vt, ...n2.data }, { enable: r2 = false, interval: i2 = 0, space: o2 = {} } = s2, a2 = en(), c2 = a2 && a2.enable, u2 = function(e4, t3) {
      if (!e4)
        return t3.enable;
      if (e4.enable !== t3.enable)
        return true;
      if (e4.interval !== t3.interval)
        return true;
      if (t3._lastModifiedAt && e4._lastModifiedAt !== t3._lastModifiedAt)
        return true;
      if (JSON.stringify(e4.space) !== JSON.stringify(t3.space))
        return true;
      return false;
    }(a2, s2);
    return function(e4) {
      try {
        Gt = e4, e4 && e4.enable ? ie.setStorageSync(Zt("UNICLOUD_FAILOVER_CONFIG"), e4) : (ie.removeStorageSync(Zt("UNICLOUD_FAILOVER_CONFIG")), ie.removeStorageSync(Zt("UNICLOUD_FAILOVER_LAST_REQUEST")));
      } catch (e5) {
      }
    }({ enable: r2, interval: i2, space: o2, _lastModifiedAt: n2.data._lastModifiedAt || Date.now() }), u2 && Z(J, { isEnabled: r2, hasStatusChanged: c2 !== r2, failoverSpace: o2 }), s2;
  } catch (e3) {
    return en();
  } finally {
    Yt = false;
  }
}
async function rn(e2 = {}) {
  await this.__dev__.initLocalNetwork();
  const { localAddress: t2, localPort: n2 } = this.__dev__, s2 = Xt(), r2 = { aliyun: "aliyun", tencent: "tcb", alipay: "alipay", dcloud: "dcloud" }[s2.provider], i2 = s2.spaceId, o2 = `http://${t2}:${n2}/system/check-function`, a2 = `http://${t2}:${n2}/cloudfunctions/${e2.name}`;
  return new Promise((t3, n3) => {
    ie.request({ method: "POST", url: o2, data: { name: e2.name, platform: T, provider: r2, spaceId: i2 }, timeout: 3e3, success(e3) {
      t3(e3);
    }, fail() {
      t3({ data: { code: "NETWORK_ERROR", message: "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下，自动切换为已部署的云函数。" } });
    } });
  }).then(({ data: e3 } = {}) => {
    const { code: t3, message: n3 } = e3 || {};
    return { code: 0 === t3 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
  }).then(({ code: t3, message: n3 }) => {
    if (0 !== t3) {
      switch (t3) {
        case "MODULE_ENCRYPTED":
          console.error(`此云函数（${e2.name}）依赖加密公共模块不可本地调试，自动切换为云端已部署的云函数`);
          break;
        case "FUNCTION_ENCRYPTED":
          console.error(`此云函数（${e2.name}）已加密不可本地调试，自动切换为云端已部署的云函数`);
          break;
        case "ACTION_ENCRYPTED":
          console.error(n3 || "需要访问加密的uni-clientDB-action，自动切换为云端环境");
          break;
        case "NETWORK_ERROR":
          console.error(n3 || "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下");
          break;
        case "SWITCH_TO_CLOUD":
          break;
        default: {
          const e3 = `检测本地调试服务出现错误：${n3}，请检查网络环境或重启客户端再试`;
          throw console.error(e3), new Error(e3);
        }
      }
      return this._callCloudFunction(e2);
    }
    return new Promise((t4, n4) => {
      const s3 = zt.call(this, { data: e2.data });
      ie.request({ method: "POST", url: a2, data: { provider: r2, platform: T, param: s3 }, timeout: e2.timeout, success: ({ statusCode: e3, data: s4 } = {}) => !e3 || e3 >= 400 ? n4(new re({ code: s4.code || "SYS_ERR", message: s4.message || "request:fail" })) : t4({ result: s4 }), fail(e3) {
        n4(new re({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
      } });
    });
  });
}
const on = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "，云函数[{functionName}]在云端不存在，请检查此云函数名称是否正确以及该云函数是否已上传到服务空间", mode: "append" }];
var an = /[\\^$.*+?()[\]{}|]/g, cn = RegExp(an.source);
function un(e2, t2, n2) {
  return e2.replace(new RegExp((s2 = t2) && cn.test(s2) ? s2.replace(an, "\\$&") : s2, "g"), n2);
  var s2;
}
const hn = "request", dn = "response", pn = "both", fn = { code: 2e4, message: "System error" }, gn = { code: 20101, message: "Invalid client" };
function _n(e2) {
  const { errSubject: t2, subject: n2, errCode: s2, errMsg: r2, code: i2, message: o2, cause: a2 } = e2 || {};
  return new re({ subject: t2 || n2 || "uni-secure-network", code: s2 || i2 || fn.code, message: r2 || o2, cause: a2 });
}
let ts;
function os({ secretType: e2 } = {}) {
  return e2 === hn || e2 === dn || e2 === pn;
}
function as({ name: e2, data: t2 = {} } = {}) {
  return "app" === T;
}
function cs({ provider: e2, spaceId: t2, functionName: n2 } = {}) {
  const { appId: s2, uniPlatform: r2, osName: i2 } = he();
  let o2 = r2;
  "app" === r2 && (o2 = i2);
  const a2 = function({ provider: e3, spaceId: t3 } = {}) {
    const n3 = A;
    if (!n3)
      return {};
    e3 = /* @__PURE__ */ function(e4) {
      return "tencent" === e4 ? "tcb" : e4;
    }(e3);
    const s3 = n3.find((n4) => n4.provider === e3 && n4.spaceId === t3);
    return s3 && s3.config;
  }({ provider: e2, spaceId: t2 });
  if (!a2 || !a2.accessControl || !a2.accessControl.enable)
    return false;
  const c2 = a2.accessControl.function || {}, u2 = Object.keys(c2);
  if (0 === u2.length)
    return true;
  const l2 = function(e3, t3) {
    let n3, s3, r3;
    for (let i3 = 0; i3 < e3.length; i3++) {
      const o3 = e3[i3];
      o3 !== t3 ? "*" !== o3 ? o3.split(",").map((e4) => e4.trim()).indexOf(t3) > -1 && (s3 = o3) : r3 = o3 : n3 = o3;
    }
    return n3 || s3 || r3;
  }(u2, n2);
  if (!l2)
    return false;
  if ((c2[l2] || []).find((e3 = {}) => e3.appId === s2 && (e3.platform || "").toLowerCase() === o2.toLowerCase()))
    return true;
  throw console.error(`此应用[appId: ${s2}, platform: ${o2}]不在云端配置的允许访问的应用列表内，参考：https://uniapp.dcloud.net.cn/uniCloud/secure-network.html#verify-client`), _n(gn);
}
function us({ functionName: e2, result: t2, logPvd: n2 }) {
  if (this.__dev__.debugLog && t2 && t2.requestId) {
    const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e2, requestId: t2.requestId });
    console.log(`[${n2}-request]${s2}[/${n2}-request]`);
  }
}
function ls(e2) {
  const t2 = e2.callFunction, n2 = function(n3) {
    const s2 = n3.name;
    n3.data = zt.call(e2, { data: n3.data });
    const r2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], i2 = os(n3), o2 = as(n3), a2 = i2 || o2;
    return t2.call(this, n3).then((e3) => (e3.errCode = 0, !a2 && us.call(this, { functionName: s2, result: e3, logPvd: r2 }), Promise.resolve(e3)), (e3) => (!a2 && us.call(this, { functionName: s2, result: e3, logPvd: r2 }), e3 && e3.message && (e3.message = function({ message: e4 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
      for (let s3 = 0; s3 < n4.length; s3++) {
        const { rule: r3, content: i3, mode: o3 } = n4[s3], a3 = e4.match(r3);
        if (!a3)
          continue;
        let c2 = i3;
        for (let e5 = 1; e5 < a3.length; e5++)
          c2 = un(c2, `{$${e5}}`, a3[e5]);
        for (const e5 in t3)
          c2 = un(c2, `{${e5}}`, t3[e5]);
        return "replace" === o3 ? c2 : e4 + c2;
      }
      return e4;
    }({ message: `[${n3.name}]: ${e3.message}`, formatter: on, extraInfo: { functionName: s2 } })), Promise.reject(e3)));
  };
  e2.callFunction = function(t3) {
    const { provider: s2, spaceId: r2 } = e2.config, i2 = t3.name;
    let o2, a2;
    if (t3.data = t3.data || {}, e2.__dev__.debugInfo && !e2.__dev__.debugInfo.forceRemote && P ? (e2._callCloudFunction || (e2._callCloudFunction = n2, e2._callLocalFunction = rn), o2 = rn) : o2 = n2, o2 = o2.bind(e2), as(t3))
      ;
    else if (function({ name: e3, data: t4 = {} }) {
      return "uni-id-co" === e3 && "secureNetworkHandshakeByWeixin" === t4.method;
    }(t3))
      a2 = o2.call(e2, t3);
    else if (os(t3)) {
      a2 = new ts({ secretType: t3.secretType, uniCloudIns: e2 }).wrapEncryptDataCallFunction(n2.bind(e2))(t3);
    } else if (cs({ provider: s2, spaceId: r2, functionName: i2 })) {
      a2 = new ts({ secretType: t3.secretType, uniCloudIns: e2 }).wrapVerifyClientCallFunction(n2.bind(e2))(t3);
    } else
      a2 = o2(t3);
    return Object.defineProperty(a2, "result", { get: () => (console.warn("当前返回结果为Promise类型，不可直接访问其result属性，详情请参考：https://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), a2.then((e3) => e3);
  };
}
ts = class {
  constructor() {
    throw _n({ message: `Platform ${T} is not enabled, please check whether secure network module is enabled in your manifest.json` });
  }
};
const hs = Symbol("CLIENT_DB_INTERNAL");
function ds(e2, t2) {
  return e2.then = "DoNotReturnProxyWithAFunctionNamedThen", e2._internalType = hs, e2.inspect = null, e2.__v_raw = void 0, new Proxy(e2, { get(e3, n2, s2) {
    if ("_uniClient" === n2)
      return null;
    if ("symbol" == typeof n2)
      return e3[n2];
    if (n2 in e3 || "string" != typeof n2) {
      const t3 = e3[n2];
      return "function" == typeof t3 ? t3.bind(e3) : t3;
    }
    return t2.get(e3, n2, s2);
  } });
}
function ps(e2) {
  return { on: (t2, n2) => {
    e2[t2] = e2[t2] || [], e2[t2].indexOf(n2) > -1 || e2[t2].push(n2);
  }, off: (t2, n2) => {
    e2[t2] = e2[t2] || [];
    const s2 = e2[t2].indexOf(n2);
    -1 !== s2 && e2[t2].splice(s2, 1);
  } };
}
const fs = ["db.Geo", "db.command", "command.aggregate"];
function gs(e2, t2) {
  return fs.indexOf(`${e2}.${t2}`) > -1;
}
function ms(e2) {
  switch (f(e2 = oe(e2))) {
    case "array":
      return e2.map((e3) => ms(e3));
    case "object":
      return e2._internalType === hs || Object.keys(e2).forEach((t2) => {
        e2[t2] = ms(e2[t2]);
      }), e2;
    case "regexp":
      return { $regexp: { source: e2.source, flags: e2.flags } };
    case "date":
      return { $date: e2.toISOString() };
    default:
      return e2;
  }
}
function ys(e2) {
  return e2 && e2.content && e2.content.$method;
}
class _s {
  constructor(e2, t2, n2) {
    this.content = e2, this.prevStage = t2 || null, this.udb = null, this._database = n2;
  }
  toJSON() {
    let e2 = this;
    const t2 = [e2.content];
    for (; e2.prevStage; )
      e2 = e2.prevStage, t2.push(e2.content);
    return { $db: t2.reverse().map((e3) => ({ $method: e3.$method, $param: ms(e3.$param) })) };
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
  getAction() {
    const e2 = this.toJSON().$db.find((e3) => "action" === e3.$method);
    return e2 && e2.$param && e2.$param[0];
  }
  getCommand() {
    return { $db: this.toJSON().$db.filter((e2) => "action" !== e2.$method) };
  }
  get isAggregate() {
    let e2 = this;
    for (; e2; ) {
      const t2 = ys(e2), n2 = ys(e2.prevStage);
      if ("aggregate" === t2 && "collection" === n2 || "pipeline" === t2)
        return true;
      e2 = e2.prevStage;
    }
    return false;
  }
  get isCommand() {
    let e2 = this;
    for (; e2; ) {
      if ("command" === ys(e2))
        return true;
      e2 = e2.prevStage;
    }
    return false;
  }
  get isAggregateCommand() {
    let e2 = this;
    for (; e2; ) {
      const t2 = ys(e2), n2 = ys(e2.prevStage);
      if ("aggregate" === t2 && "command" === n2)
        return true;
      e2 = e2.prevStage;
    }
    return false;
  }
  getNextStageFn(e2) {
    const t2 = this;
    return function() {
      return ws({ $method: e2, $param: ms(Array.from(arguments)) }, t2, t2._database);
    };
  }
  get count() {
    return this.isAggregate ? this.getNextStageFn("count") : function() {
      return this._send("count", Array.from(arguments));
    };
  }
  get remove() {
    return this.isCommand ? this.getNextStageFn("remove") : function() {
      return this._send("remove", Array.from(arguments));
    };
  }
  get() {
    return this._send("get", Array.from(arguments));
  }
  get add() {
    return this.isCommand ? this.getNextStageFn("add") : function() {
      return this._send("add", Array.from(arguments));
    };
  }
  update() {
    return this._send("update", Array.from(arguments));
  }
  end() {
    return this._send("end", Array.from(arguments));
  }
  get set() {
    return this.isCommand ? this.getNextStageFn("set") : function() {
      throw new Error("JQL禁止使用set方法");
    };
  }
  _send(e2, t2) {
    const n2 = this.getAction(), s2 = this.getCommand();
    if (s2.$db.push({ $method: e2, $param: ms(t2) }), S) {
      const e3 = s2.$db.find((e4) => "collection" === e4.$method), t3 = e3 && e3.$param;
      t3 && 1 === t3.length && "string" == typeof e3.$param[0] && e3.$param[0].indexOf(",") > -1 && console.warn("检测到使用JQL语法联表查询时，未使用getTemp先过滤主表数据，在主表数据量大的情况下可能会查询缓慢。\n- 如何优化请参考此文档：https://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- 如果主表数据量很小请忽略此信息，项目发行时不会出现此提示。");
    }
    return this._database._callCloudFunction({ action: n2, command: s2 });
  }
}
function ws(e2, t2, n2) {
  return ds(new _s(e2, t2, n2), { get(e3, t3) {
    let s2 = "db";
    return e3 && e3.content && (s2 = e3.content.$method), gs(s2, t3) ? ws({ $method: t3 }, e3, n2) : function() {
      return ws({ $method: t3, $param: ms(Array.from(arguments)) }, e3, n2);
    };
  } });
}
function vs({ path: e2, method: t2 }) {
  return class {
    constructor() {
      this.param = Array.from(arguments);
    }
    toJSON() {
      return { $newDb: [...e2.map((e3) => ({ $method: e3 })), { $method: t2, $param: this.param }] };
    }
    toString() {
      return JSON.stringify(this.toJSON());
    }
  };
}
function Is(e2, t2 = {}) {
  return ds(new e2(t2), { get: (e3, t3) => gs("db", t3) ? ws({ $method: t3 }, null, e3) : function() {
    return ws({ $method: t3, $param: ms(Array.from(arguments)) }, null, e3);
  } });
}
class Ss extends class {
  constructor({ uniClient: e2 = {}, isJQL: t2 = false } = {}) {
    this._uniClient = e2, this._authCallBacks = {}, this._dbCallBacks = {}, e2._isDefault && (this._dbCallBacks = U("_globalUniCloudDatabaseCallback")), t2 || (this.auth = ps(this._authCallBacks)), this._isJQL = t2, Object.assign(this, ps(this._dbCallBacks)), this.env = ds({}, { get: (e3, t3) => ({ $env: t3 }) }), this.Geo = ds({}, { get: (e3, t3) => vs({ path: ["Geo"], method: t3 }) }), this.serverDate = vs({ path: [], method: "serverDate" }), this.RegExp = vs({ path: [], method: "RegExp" });
  }
  getCloudEnv(e2) {
    if ("string" != typeof e2 || !e2.trim())
      throw new Error("getCloudEnv参数错误");
    return { $env: e2.replace("$cloudEnv_", "") };
  }
  _callback(e2, t2) {
    const n2 = this._dbCallBacks;
    n2[e2] && n2[e2].forEach((e3) => {
      e3(...t2);
    });
  }
  _callbackAuth(e2, t2) {
    const n2 = this._authCallBacks;
    n2[e2] && n2[e2].forEach((e3) => {
      e3(...t2);
    });
  }
  multiSend() {
    const e2 = Array.from(arguments), t2 = e2.map((e3) => {
      const t3 = e3.getAction(), n2 = e3.getCommand();
      if ("getTemp" !== n2.$db[n2.$db.length - 1].$method)
        throw new Error("multiSend只支持子命令内使用getTemp");
      return { action: t3, command: n2 };
    });
    return this._callCloudFunction({ multiCommand: t2, queryList: e2 });
  }
  startTransaction() {
    throw new Error("JQL 事务仅支持在云端使用");
  }
  commit() {
    throw new Error("JQL 事务仅支持在云端使用");
  }
  rollback() {
    throw new Error("JQL 事务仅支持在云端使用");
  }
} {
  _parseResult(e2) {
    return this._isJQL ? e2.result : e2;
  }
  _callCloudFunction({ action: e2, command: t2, multiCommand: n2, queryList: s2 }) {
    function r2(e3, t3) {
      if (n2 && s2)
        for (let n3 = 0; n3 < s2.length; n3++) {
          const r3 = s2[n3];
          r3.udb && "function" == typeof r3.udb.setResult && (t3 ? r3.udb.setResult(t3) : r3.udb.setResult(e3.result.dataList[n3]));
        }
    }
    const i2 = this, o2 = this._isJQL ? "databaseForJQL" : "database";
    function a2(e3) {
      return i2._callback("error", [e3]), F(K(o2, "fail"), e3).then(() => F(K(o2, "complete"), e3)).then(() => (r2(null, e3), Z(B, { type: z, content: e3 }), Promise.reject(e3)));
    }
    const c2 = F(K(o2, "invoke")), u2 = this._uniClient;
    return c2.then(() => u2.callFunction({ name: "DCloud-clientDB", type: l, data: { action: e2, command: t2, multiCommand: n2 } })).then((e3) => {
      const { code: t3, message: n3, token: s3, tokenExpired: c3, systemInfo: u3 = [] } = e3.result;
      if (u3)
        for (let e4 = 0; e4 < u3.length; e4++) {
          const { level: t4, message: n4, detail: s4 } = u3[e4], r3 = console[t4] || console.log;
          let i3 = "[System Info]" + n4;
          s4 && (i3 = `${i3}
详细信息：${s4}`), r3(i3);
        }
      if (t3) {
        return a2(new re({ code: t3, message: n3, requestId: e3.requestId }));
      }
      e3.result.errCode = e3.result.errCode || e3.result.code, e3.result.errMsg = e3.result.errMsg || e3.result.message, s3 && c3 && (ce({ token: s3, tokenExpired: c3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: c3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: c3 }]), Z(H, { token: s3, tokenExpired: c3 }));
      const l2 = [{ prop: "affectedDocs", tips: "affectedDocs不再推荐使用，请使用inserted/deleted/updated/data.length替代" }, { prop: "code", tips: "code不再推荐使用，请使用errCode替代" }, { prop: "message", tips: "message不再推荐使用，请使用errMsg替代" }];
      for (let t4 = 0; t4 < l2.length; t4++) {
        const { prop: n4, tips: s4 } = l2[t4];
        if (n4 in e3.result) {
          const t5 = e3.result[n4];
          Object.defineProperty(e3.result, n4, { get: () => (console.warn(s4), t5) });
        }
      }
      return function(e4) {
        return F(K(o2, "success"), e4).then(() => F(K(o2, "complete"), e4)).then(() => {
          r2(e4, null);
          const t4 = i2._parseResult(e4);
          return Z(B, { type: z, content: t4 }), Promise.resolve(t4);
        });
      }(e3);
    }, (e3) => {
      /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e3.message) && console.warn("clientDB未初始化，请在web控制台保存一次schema以开启clientDB");
      return a2(new re({ code: e3.code || "SYSTEM_ERROR", message: e3.message, requestId: e3.requestId }));
    });
  }
}
const bs = "token无效，跳转登录页面", ks$1 = "token过期，跳转登录页面", As = { TOKEN_INVALID_TOKEN_EXPIRED: ks$1, TOKEN_INVALID_INVALID_CLIENTID: bs, TOKEN_INVALID: bs, TOKEN_INVALID_WRONG_TOKEN: bs, TOKEN_INVALID_ANONYMOUS_USER: bs }, Ts = { "uni-id-token-expired": ks$1, "uni-id-check-token-failed": bs, "uni-id-token-not-exist": bs, "uni-id-check-device-feature-failed": bs }, Cs = { ...As, ...Ts, default: "用户未登录或登录状态过期，自动跳转登录页面" };
function Ps(e2, t2) {
  let n2 = "";
  return n2 = e2 ? `${e2}/${t2}` : t2, n2.replace(/^\//, "");
}
function Os(e2 = [], t2 = "") {
  const n2 = [], s2 = [];
  return e2.forEach((e3) => {
    true === e3.needLogin ? n2.push(Ps(t2, e3.path)) : false === e3.needLogin && s2.push(Ps(t2, e3.path));
  }), { needLoginPage: n2, notNeedLoginPage: s2 };
}
function Es(e2) {
  return e2.split("?")[0].replace(/^\//, "");
}
function xs() {
  return function(e2) {
    let t2 = e2 && e2.$page && e2.$page.fullPath;
    return t2 ? ("/" !== t2.charAt(0) && (t2 = "/" + t2), t2) : "";
  }(function() {
    const e2 = getCurrentPages();
    return e2[e2.length - 1];
  }());
}
function Ls() {
  return Es(xs());
}
function Us(e2 = "", t2 = {}) {
  if (!e2)
    return false;
  if (!(t2 && t2.list && t2.list.length))
    return false;
  const n2 = t2.list, s2 = Es(e2);
  return n2.some((e3) => e3.pagePath === s2);
}
const Rs = !!pagesJson.uniIdRouter;
const { loginPage: Ns, routerNeedLogin: Ds, resToLogin: Ms, needLoginPage: qs, notNeedLoginPage: Fs, loginPageInTabBar: Ks } = function({ pages: t2 = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: r2 = {} } = pagesJson) {
  const { loginPage: i2, needLogin: o2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = Os(t2), { needLoginPage: l2, notNeedLoginPage: h2 } = function(e2 = []) {
    const t3 = [], n3 = [];
    return e2.forEach((e3) => {
      const { root: s3, pages: r3 = [] } = e3, { needLoginPage: i3, notNeedLoginPage: o3 } = Os(r3, s3);
      t3.push(...i3), n3.push(...o3);
    }), { needLoginPage: t3, notNeedLoginPage: n3 };
  }(n2);
  return { loginPage: i2, routerNeedLogin: o2, resToLogin: a2, needLoginPage: [...c2, ...l2], notNeedLoginPage: [...u2, ...h2], loginPageInTabBar: Us(i2, r2) };
}();
if (qs.indexOf(Ns) > -1)
  throw new Error(`Login page [${Ns}] should not be "needLogin", please check your pages.json`);
function js(e2) {
  const t2 = Ls();
  if ("/" === e2.charAt(0))
    return e2;
  const [n2, s2] = e2.split("?"), r2 = n2.replace(/^\//, "").split("/"), i2 = t2.split("/");
  i2.pop();
  for (let e3 = 0; e3 < r2.length; e3++) {
    const t3 = r2[e3];
    ".." === t3 ? i2.pop() : "." !== t3 && i2.push(t3);
  }
  return "" === i2[0] && i2.shift(), "/" + i2.join("/") + (s2 ? "?" + s2 : "");
}
function $s(e2, t2) {
  return new RegExp(t2).test(e2);
}
function Bs({ redirect: e2 }) {
  const t2 = Es(e2), n2 = Es(Ns);
  return Ls() !== n2 && t2 !== n2;
}
function Ws({ api: e2, redirect: t2 } = {}) {
  if (!t2 || !Bs({ redirect: t2 }))
    return;
  const n2 = function(e3, t3) {
    return "/" !== e3.charAt(0) && (e3 = "/" + e3), t3 ? e3.indexOf("?") > -1 ? e3 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3;
  }(Ns, t2);
  Ks ? "navigateTo" !== e2 && "redirectTo" !== e2 || (e2 = "switchTab") : "switchTab" === e2 && (e2 = "navigateTo");
  const s2 = { navigateTo: index$1.navigateTo, redirectTo: index$1.redirectTo, switchTab: index$1.switchTab, reLaunch: index$1.reLaunch };
  setTimeout(() => {
    s2[e2]({ url: n2 });
  }, 0);
}
function Hs({ url: e2 } = {}) {
  const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
    const { token: e3, tokenExpired: t3 } = ae();
    let n3;
    if (e3) {
      if (t3 < Date.now()) {
        const e4 = "uni-id-token-expired";
        n3 = { errCode: e4, errMsg: Cs[e4] };
      }
    } else {
      const e4 = "uni-id-check-token-failed";
      n3 = { errCode: e4, errMsg: Cs[e4] };
    }
    return n3;
  }();
  if (function(e3) {
    const t3 = Es(js(e3));
    return !(Fs.indexOf(t3) > -1) && (qs.indexOf(t3) > -1 || Ds.some((n3) => $s(t3, n3) || $s(e3, n3)));
  }(e2) && n2) {
    n2.uniIdRedirectUrl = e2;
    if (Q(W).length > 0)
      return setTimeout(() => {
        Z(W, n2);
      }, 0), t2.abortLoginPageJump = true, t2;
    t2.autoToLoginPage = true;
  }
  return t2;
}
function Js() {
  const e2 = xs(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = Hs({ url: e2 });
  t2 || n2 && Ws({ api: "redirectTo", redirect: e2 });
}
function zs() {
  Js();
  const e2 = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
  for (let t2 = 0; t2 < e2.length; t2++) {
    const n2 = e2[t2];
    index$1.addInterceptor(n2, { invoke(e3) {
      const { abortLoginPageJump: t3, autoToLoginPage: s2 } = Hs({ url: e3.url });
      return t3 ? e3 : s2 ? (Ws({ api: n2, redirect: js(e3.url) }), false) : e3;
    } });
  }
}
function Vs() {
  this.onResponse((e2) => {
    const { type: t2, content: n2 } = e2;
    let s2 = false;
    switch (t2) {
      case "cloudobject":
        s2 = function(e3) {
          if ("object" != typeof e3)
            return false;
          const { errCode: t3 } = e3 || {};
          return t3 in Cs;
        }(n2);
        break;
      case "clientdb":
        s2 = function(e3) {
          if ("object" != typeof e3)
            return false;
          const { errCode: t3 } = e3 || {};
          return t3 in As;
        }(n2);
    }
    s2 && function(e3 = {}) {
      const t3 = Q(W);
      ne().then(() => {
        const n3 = xs();
        if (n3 && Bs({ redirect: n3 }))
          return t3.length > 0 ? Z(W, Object.assign({ uniIdRedirectUrl: n3 }, e3)) : void (Ns && Ws({ api: "navigateTo", redirect: n3 }));
      });
    }(n2);
  });
}
function Gs(e2) {
  e2.onNeedLogin = function(e3) {
    Y(W, e3);
  }, e2.offNeedLogin = function(e3) {
    X(W, e3);
  }, Rs && (U("_globalUniCloudStatus").needLoginInit || (U("_globalUniCloudStatus").needLoginInit = true, ne().then(() => {
    zs.call(e2);
  }), Ms && Vs.call(e2)));
}
function Qs(e2) {
  e2.onFailover = function(e3) {
    Y(J, e3);
  }, e2.offFailover = function(e3) {
    X(J, e3);
  }, e2.refreshFailoverConfig = function() {
    return e2.config, tn(0), sn();
  }, e2.clearFailoverConfig = function() {
    !function() {
      Gt = null, Qt = 0;
      try {
        ie.removeStorageSync(Zt("UNICLOUD_FAILOVER_CONFIG")), ie.removeStorageSync(Zt("UNICLOUD_FAILOVER_LAST_REQUEST"));
      } catch (e3) {
      }
    }();
  };
}
function Ys(e2) {
  !function(e3) {
    e3.onResponse = function(e4) {
      Y(B, e4);
    }, e3.offResponse = function(e4) {
      X(B, e4);
    };
  }(e2), Gs(e2), function(e3) {
    e3.onRefreshToken = function(e4) {
      Y(H, e4);
    }, e3.offRefreshToken = function(e4) {
      X(H, e4);
    };
  }(e2), Qs(e2);
}
const Xs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Zs = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
function er(e2) {
  return decodeURIComponent(function(e3) {
    if (e3 = String(e3).replace(/[\t\n\f\r ]+/g, ""), !Zs.test(e3))
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    var t2;
    e3 += "==".slice(2 - (3 & e3.length));
    for (var n2, s2, r2 = "", i2 = 0; i2 < e3.length; )
      t2 = Xs.indexOf(e3.charAt(i2++)) << 18 | Xs.indexOf(e3.charAt(i2++)) << 12 | (n2 = Xs.indexOf(e3.charAt(i2++))) << 6 | (s2 = Xs.indexOf(e3.charAt(i2++))), r2 += 64 === n2 ? String.fromCharCode(t2 >> 16 & 255) : 64 === s2 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
    return r2;
  }(e2).split("").map(function(e3) {
    return "%" + ("00" + e3.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function tr() {
  const e2 = ae().token || "", t2 = e2.split(".");
  if (!e2 || 3 !== t2.length)
    return { uid: null, role: [], permission: [], tokenExpired: 0 };
  let n2;
  try {
    n2 = JSON.parse(er(t2[1]));
  } catch (e3) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + e3.message);
  }
  return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
}
var nr = n(function(e2, t2) {
  Object.defineProperty(t2, "__esModule", { value: true });
  const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
  function r2(e3, t3) {
    return e3.tempFiles.forEach((e4, n3) => {
      e4.name || (e4.name = e4.path.substring(e4.path.lastIndexOf("/") + 1)), t3 && (e4.fileType = t3), e4.cloudPath = Date.now() + "_" + n3 + e4.name.substring(e4.name.lastIndexOf("."));
    }), e3.tempFilePaths || (e3.tempFilePaths = e3.tempFiles.map((e4) => e4.path)), e3;
  }
  function i2(e3, t3, { onChooseFile: s3, onUploadProgress: r3 }) {
    return t3.then((e4) => {
      if (s3) {
        const t4 = s3(e4);
        if (void 0 !== t4)
          return Promise.resolve(t4).then((t5) => void 0 === t5 ? e4 : t5);
      }
      return e4;
    }).then((t4) => false === t4 ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e4, t5, s4 = 5, r4) {
      (t5 = Object.assign({}, t5)).errMsg = n2;
      const i3 = t5.tempFiles, o2 = i3.length;
      let a2 = 0;
      return new Promise((n3) => {
        for (; a2 < s4; )
          c2();
        function c2() {
          const s5 = a2++;
          if (s5 >= o2)
            return void (!i3.find((e5) => !e5.url && !e5.errMsg) && n3(t5));
          const u2 = i3[s5];
          e4.uploadFile({ provider: u2.provider, filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, cloudPathAsRealPath: u2.cloudPathAsRealPath, onUploadProgress(e5) {
            e5.index = s5, e5.tempFile = u2, e5.tempFilePath = u2.path, r4 && r4(e5);
          } }).then((e5) => {
            u2.url = e5.fileID, s5 < o2 && c2();
          }).catch((e5) => {
            u2.errMsg = e5.errMsg || e5.message, s5 < o2 && c2();
          });
        }
      });
    }(e3, t4, 5, r3));
  }
  t2.initChooseAndUploadFile = function(e3) {
    return function(t3 = { type: "all" }) {
      return "image" === t3.type ? i2(e3, function(e4) {
        const { count: t4, sizeType: n3, sourceType: i3 = ["album", "camera"], extension: o2 } = e4;
        return new Promise((e5, a2) => {
          index$1.chooseImage({ count: t4, sizeType: n3, sourceType: i3, extension: o2, success(t5) {
            e5(r2(t5, "image"));
          }, fail(e6) {
            a2({ errMsg: e6.errMsg.replace("chooseImage:fail", s2) });
          } });
        });
      }(t3), t3) : "video" === t3.type ? i2(e3, function(e4) {
        const { camera: t4, compressed: n3, maxDuration: i3, sourceType: o2 = ["album", "camera"], extension: a2 } = e4;
        return new Promise((e5, c2) => {
          index$1.chooseVideo({ camera: t4, compressed: n3, maxDuration: i3, sourceType: o2, extension: a2, success(t5) {
            const { tempFilePath: n4, duration: s3, size: i4, height: o3, width: a3 } = t5;
            e5(r2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: i4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: o3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
          }, fail(e6) {
            c2({ errMsg: e6.errMsg.replace("chooseVideo:fail", s2) });
          } });
        });
      }(t3), t3) : i2(e3, function(e4) {
        const { count: t4, extension: n3 } = e4;
        return new Promise((e5, i3) => {
          let o2 = index$1.chooseFile;
          if ("undefined" != typeof wx$1 && "function" == typeof wx$1.chooseMessageFile && (o2 = wx$1.chooseMessageFile), "function" != typeof o2)
            return i3({ errMsg: s2 + " 请指定 type 类型，该平台仅支持选择 image 或 video。" });
          o2({ type: "all", count: t4, extension: n3, success(t5) {
            e5(r2(t5));
          }, fail(e6) {
            i3({ errMsg: e6.errMsg.replace("chooseFile:fail", s2) });
          } });
        });
      }(t3), t3);
    };
  };
}), sr = t(nr);
const rr = "manual";
function ir(e2) {
  return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {}, mixinDatacomError: null }), created() {
    this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
      var e3 = [];
      return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
        e3.push(this[t2]);
      }), e3;
    }, (e3, t2) => {
      if (this.loadtime === rr)
        return;
      let n2 = false;
      const s2 = [];
      for (let r2 = 2; r2 < e3.length; r2++)
        e3[r2] !== t2[r2] && (s2.push(e3[r2]), n2 = true);
      e3[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
    });
  }, methods: { onMixinDatacomPropsChange(e3, t2) {
  }, mixinDatacomEasyGet({ getone: e3 = false, success: t2, fail: n2 } = {}) {
    this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomError = null, this.mixinDatacomGet().then((n3) => {
      this.mixinDatacomLoading = false;
      const { data: s2, count: r2 } = n3.result;
      this.getcount && (this.mixinDatacomPage.count = r2), this.mixinDatacomHasMore = s2.length < this.pageSize;
      const i2 = e3 ? s2.length ? s2[0] : void 0 : s2;
      this.mixinDatacomResData = i2, t2 && t2(i2);
    }).catch((e4) => {
      this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e4, this.mixinDatacomError = e4, n2 && n2(e4);
    }));
  }, mixinDatacomGet(t2 = {}) {
    let n2;
    t2 = t2 || {}, n2 = "undefined" != typeof __uniX && __uniX ? e2.databaseForJQL(this.spaceInfo) : e2.database(this.spaceInfo);
    const s2 = t2.action || this.action;
    s2 && (n2 = n2.action(s2));
    const r2 = t2.collection || this.collection;
    n2 = Array.isArray(r2) ? n2.collection(...r2) : n2.collection(r2);
    const i2 = t2.where || this.where;
    i2 && Object.keys(i2).length && (n2 = n2.where(i2));
    const o2 = t2.field || this.field;
    o2 && (n2 = n2.field(o2));
    const a2 = t2.foreignKey || this.foreignKey;
    a2 && (n2 = n2.foreignKey(a2));
    const c2 = t2.groupby || this.groupby;
    c2 && (n2 = n2.groupBy(c2));
    const u2 = t2.groupField || this.groupField;
    u2 && (n2 = n2.groupField(u2));
    true === (void 0 !== t2.distinct ? t2.distinct : this.distinct) && (n2 = n2.distinct());
    const l2 = t2.orderby || this.orderby;
    l2 && (n2 = n2.orderBy(l2));
    const h2 = void 0 !== t2.pageCurrent ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = void 0 !== t2.pageSize ? t2.pageSize : this.mixinDatacomPage.size, p2 = void 0 !== t2.getcount ? t2.getcount : this.getcount, f2 = void 0 !== t2.gettree ? t2.gettree : this.gettree, g2 = void 0 !== t2.gettreepath ? t2.gettreepath : this.gettreepath, m2 = { getCount: p2 }, y2 = { limitLevel: void 0 !== t2.limitlevel ? t2.limitlevel : this.limitlevel, startWith: void 0 !== t2.startwith ? t2.startwith : this.startwith };
    return f2 && (m2.getTree = y2), g2 && (m2.getTreePath = y2), n2 = n2.skip(d2 * (h2 - 1)).limit(d2).get(m2), n2;
  } } };
}
function or(e2) {
  return function(t2, n2 = {}) {
    n2 = function(e3, t3 = {}) {
      return e3.customUI = t3.customUI || e3.customUI, e3.parseSystemError = t3.parseSystemError || e3.parseSystemError, Object.assign(e3.loadingOptions, t3.loadingOptions), Object.assign(e3.errorOptions, t3.errorOptions), "object" == typeof t3.secretMethods && (e3.secretMethods = t3.secretMethods), e3;
    }({ customUI: false, loadingOptions: { title: "加载中...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
    const { customUI: s2, loadingOptions: r2, errorOptions: i2, parseSystemError: o2 } = n2, a2 = !s2;
    return new Proxy({}, { get(s3, c2) {
      switch (c2) {
        case "toString":
          return "[object UniCloudObject]";
        case "toJSON":
          return {};
      }
      return function({ fn: e3, interceptorName: t3, getCallbackArgs: n3 } = {}) {
        return async function(...s4) {
          const r3 = n3 ? n3({ params: s4 }) : {};
          let i3, o3;
          try {
            return await F(K(t3, "invoke"), { ...r3 }), i3 = await e3(...s4), await F(K(t3, "success"), { ...r3, result: i3 }), i3;
          } catch (e4) {
            throw o3 = e4, await F(K(t3, "fail"), { ...r3, error: o3 }), o3;
          } finally {
            await F(K(t3, "complete"), o3 ? { ...r3, error: o3 } : { ...r3, result: i3 });
          }
        };
      }({ fn: async function s4(...l2) {
        let h2;
        a2 && index$1.showLoading({ title: r2.title, mask: r2.mask });
        const d2 = { name: t2, type: u, data: { method: c2, params: l2 } };
        "object" == typeof n2.secretMethods && function(e3, t3) {
          const n3 = t3.data.method, s5 = e3.secretMethods || {}, r3 = s5[n3] || s5["*"];
          r3 && (t3.secretType = r3);
        }(n2, d2);
        let p2 = false;
        try {
          h2 = await e2.callFunction(d2);
        } catch (e3) {
          p2 = true, h2 = { result: new re(e3) };
        }
        const { errSubject: f2, errCode: g2, errMsg: m2, newToken: y2 } = h2.result || {};
        if (a2 && index$1.hideLoading(), y2 && y2.token && y2.tokenExpired && (ce(y2), Z(H, { ...y2 })), g2) {
          let e3 = m2;
          if (p2 && o2) {
            e3 = (await o2({ objectName: t2, methodName: c2, params: l2, errSubject: f2, errCode: g2, errMsg: m2 })).errMsg || m2;
          }
          if (a2)
            if ("toast" === i2.type)
              index$1.showToast({ title: e3, icon: "none" });
            else {
              if ("modal" !== i2.type)
                throw new Error(`Invalid errorOptions.type: ${i2.type}`);
              {
                const { confirm: t3 } = await async function({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3 } = {}) {
                  return new Promise((i3, o3) => {
                    index$1.showModal({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3, success(e5) {
                      i3(e5);
                    }, fail() {
                      i3({ confirm: false, cancel: true });
                    } });
                  });
                }({ title: "提示", content: e3, showCancel: i2.retry, cancelText: "取消", confirmText: i2.retry ? "重试" : "确定" });
                if (i2.retry && t3)
                  return s4(...l2);
              }
            }
          const n3 = new re({ subject: f2, code: g2, message: m2, requestId: h2.requestId });
          throw n3.detail = h2.result, Z(B, { type: G, content: n3 }), n3;
        }
        return Z(B, { type: G, content: h2.result }), h2.result;
      }, interceptorName: "callObject", getCallbackArgs: function({ params: e3 } = {}) {
        return { objectName: t2, methodName: c2, params: e3 };
      } });
    } });
  };
}
function ar(e2) {
  return U("_globalUniCloudSecureNetworkCache__{spaceId}".replace("{spaceId}", e2.config.spaceId));
}
async function cr({ openid: e2, callLoginByWeixin: t2 = false } = {}) {
  const n2 = ar(this);
  if (e2 && t2)
    throw new Error("[SecureNetwork] openid and callLoginByWeixin cannot be passed at the same time");
  if (e2)
    return n2.mpWeixinOpenid = e2, {};
  const s2 = await new Promise((e3, t3) => {
    index$1.login({ success(t4) {
      e3(t4.code);
    }, fail(e4) {
      t3(new Error(e4.errMsg));
    } });
  }), r2 = this.importObject("uni-id-co", { customUI: true });
  return await r2.secureNetworkHandshakeByWeixin({ code: s2, callLoginByWeixin: t2 }), n2.mpWeixinCode = s2, { code: s2 };
}
async function ur(e2) {
  const t2 = ar(this);
  return t2.initPromise || (t2.initPromise = cr.call(this, e2).then((e3) => e3).catch((e3) => {
    throw delete t2.initPromise, e3;
  })), t2.initPromise;
}
function lr(e2) {
  return function({ openid: t2, callLoginByWeixin: n2 = false } = {}) {
    return ur.call(e2, { openid: t2, callLoginByWeixin: n2 });
  };
}
function hr(e2) {
  !function(e3) {
    pe = e3;
  }(e2);
}
function dr(e2) {
  const t2 = wx$1.canIUse("getAppBaseInfo"), n2 = { getAppBaseInfo: t2 ? index$1.getAppBaseInfo : index$1.getSystemInfo, getPushClientId: index$1.getPushClientId };
  return function(s2) {
    return new Promise((r2, i2) => {
      t2 && "getAppBaseInfo" === e2 ? r2(n2[e2]()) : n2[e2]({ ...s2, success(e3) {
        r2(e3);
      }, fail(e3) {
        i2(e3);
      } });
    });
  };
}
class pr extends class {
  constructor() {
    this._callback = {};
  }
  addListener(e2, t2) {
    this._callback[e2] || (this._callback[e2] = []), this._callback[e2].push(t2);
  }
  on(e2, t2) {
    return this.addListener(e2, t2);
  }
  removeListener(e2, t2) {
    if (!t2)
      throw new Error('The "listener" argument must be of type function. Received undefined');
    const n2 = this._callback[e2];
    if (!n2)
      return;
    const s2 = function(e3, t3) {
      for (let n3 = e3.length - 1; n3 >= 0; n3--)
        if (e3[n3] === t3)
          return n3;
      return -1;
    }(n2, t2);
    n2.splice(s2, 1);
  }
  off(e2, t2) {
    return this.removeListener(e2, t2);
  }
  removeAllListener(e2) {
    delete this._callback[e2];
  }
  emit(e2, ...t2) {
    const n2 = this._callback[e2];
    if (n2)
      for (let e3 = 0; e3 < n2.length; e3++)
        n2[e3](...t2);
  }
} {
  constructor() {
    super(), this._uniPushMessageCallback = this._receivePushMessage.bind(this), this._currentMessageId = -1, this._payloadQueue = [];
  }
  init() {
    return Promise.all([dr("getAppBaseInfo")(), dr("getPushClientId")()]).then(([{ appId: e2 } = {}, { cid: t2 } = {}] = []) => {
      if (!e2)
        throw new Error("Invalid appId, please check the manifest.json file");
      if (!t2)
        throw new Error("Invalid push client id");
      this._appId = e2, this._pushClientId = t2, this._seqId = Date.now() + "-" + Math.floor(9e5 * Math.random() + 1e5), this.emit("open"), this._initMessageListener();
    }, (e2) => {
      throw this.emit("error", e2), this.close(), e2;
    });
  }
  async open() {
    return this.init();
  }
  _isUniCloudSSE(e2) {
    if ("receive" !== e2.type)
      return false;
    const t2 = e2 && e2.data && e2.data.payload;
    return !(!t2 || "UNI_CLOUD_SSE" !== t2.channel || t2.seqId !== this._seqId);
  }
  _receivePushMessage(e2) {
    if (!this._isUniCloudSSE(e2))
      return;
    const t2 = e2 && e2.data && e2.data.payload, { action: n2, messageId: s2, message: r2 } = t2;
    this._payloadQueue.push({ action: n2, messageId: s2, message: r2 }), this._consumMessage();
  }
  _consumMessage() {
    for (; ; ) {
      const e2 = this._payloadQueue.find((e3) => e3.messageId === this._currentMessageId + 1);
      if (!e2)
        break;
      this._currentMessageId++, this._parseMessagePayload(e2);
    }
  }
  _parseMessagePayload(e2) {
    const { action: t2, messageId: n2, message: s2 } = e2;
    "end" === t2 ? this._end({ messageId: n2, message: s2 }) : "message" === t2 && this._appendMessage({ messageId: n2, message: s2 });
  }
  _appendMessage({ messageId: e2, message: t2 } = {}) {
    this.emit("message", t2);
  }
  _end({ messageId: e2, message: t2 } = {}) {
    this.emit("end", t2), this.close();
  }
  _initMessageListener() {
    index$1.onPushMessage(this._uniPushMessageCallback);
  }
  _destroy() {
    index$1.offPushMessage(this._uniPushMessageCallback);
  }
  toJSON() {
    return { appId: this._appId, pushClientId: this._pushClientId, seqId: this._seqId };
  }
  close() {
    this._destroy(), this.emit("close");
  }
}
async function fr(e2) {
  const t2 = e2.__dev__;
  if (!t2.debugInfo)
    return;
  const { address: n2, servePort: s2 } = t2.debugInfo, { address: r2 } = await Lt(n2, s2);
  if (r2)
    return t2.localAddress = r2, void (t2.localPort = s2);
  const i2 = console["warn"];
  let o2 = "";
  if ("remote" === t2.debugInfo.initialLaunchType ? (t2.debugInfo.forceRemote = true, o2 = "当前客户端和HBuilderX不在同一局域网下（或其他网络原因无法连接HBuilderX），uniCloud本地调试服务不对当前客户端生效。\n- 如果不使用uniCloud本地调试服务，请直接忽略此信息。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。") : o2 = "无法连接uniCloud本地调试服务，请检查当前客户端是否与主机在同一局域网下。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。", o2 += "\n- 如果在HBuilderX开启的状态下切换过网络环境，请重启HBuilderX后再试\n- 检查系统防火墙是否拦截了HBuilderX自带的nodejs\n- 检查是否错误的使用拦截器修改uni.request方法的参数", 0 === T.indexOf("mp-") && (o2 += "\n- 小程序中如何使用uniCloud，请参考：https://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), !t2.debugInfo.forceRemote)
    throw new Error(o2);
  i2(o2);
}
function gr(e2) {
  e2._initPromiseHub || (e2._initPromiseHub = new v({ createPromise: function() {
    let t2 = Promise.resolve();
    var n2;
    n2 = 1, t2 = new Promise((e3) => {
      setTimeout(() => {
        e3();
      }, n2);
    });
    const s2 = e2.auth();
    return t2.then(() => s2.getLoginState()).then((e3) => e3 ? Promise.resolve() : s2.signInAnonymously());
  } }));
}
const mr = { tcb: Et, tencent: Et, aliyun: ye, private: Nt, dcloud: Nt, alipay: Jt };
let yr = new class {
  init(e2) {
    let t2 = {};
    const n2 = mr[e2.provider];
    if (!n2)
      throw new Error("未提供正确的provider参数");
    t2 = n2.init(e2), function(e3) {
      const t3 = {};
      e3.__dev__ = t3, t3.debugLog = "mp-harmony" === T;
      const n3 = C;
      n3 && !n3.code && (t3.debugInfo = n3);
      const s2 = new v({ createPromise: function() {
        return fr(e3);
      } });
      t3.initLocalNetwork = function() {
        return s2.exec();
      };
    }(t2), gr(t2), ls(t2), function(e3) {
      const t3 = e3.uploadFile;
      e3.uploadFile = function(e4) {
        return t3.call(this, e4);
      };
    }(t2), function(e3) {
      e3.database = function(t3) {
        if (t3 && Object.keys(t3).length > 0)
          return e3.init(t3).database();
        if (this._database)
          return this._database;
        const n3 = Is(Ss, { uniClient: e3 });
        return this._database = n3, n3;
      }, e3.databaseForJQL = function(t3) {
        if (t3 && Object.keys(t3).length > 0)
          return e3.init(t3).databaseForJQL();
        if (this._databaseForJQL)
          return this._databaseForJQL;
        const n3 = Is(Ss, { uniClient: e3, isJQL: true });
        return this._databaseForJQL = n3, n3;
      };
    }(t2), function(e3) {
      e3.getCurrentUserInfo = tr, e3.chooseAndUploadFile = sr.initChooseAndUploadFile(e3), Object.assign(e3, { get mixinDatacom() {
        return ir(e3);
      } }), e3.SSEChannel = pr, e3.initSecureNetworkByWeixin = lr(e3), e3.setCustomClientInfo = hr, e3.importObject = or(e3);
    }(t2);
    return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e3) => {
      if (!t2[e3])
        return;
      const n3 = t2[e3];
      t2[e3] = function() {
        return n3.apply(t2, Array.from(arguments));
      }, t2[e3] = (/* @__PURE__ */ function(e4, t3) {
        return function(n4) {
          let s2 = false;
          if ("callFunction" === t3) {
            const e5 = n4 && n4.type || c;
            s2 = e5 !== c;
          }
          const r2 = "callFunction" === t3 && !s2, i2 = this._initPromiseHub.exec();
          n4 = n4 || {};
          const { success: o2, fail: a2, complete: u2 } = se(n4), l2 = i2.then(() => s2 ? Promise.resolve() : F(K(t3, "invoke"), n4)).then(() => e4.call(this, n4)).then((e5) => s2 ? Promise.resolve(e5) : F(K(t3, "success"), e5).then(() => F(K(t3, "complete"), e5)).then(() => (r2 && Z(B, { type: V, content: e5 }), Promise.resolve(e5))), (e5) => s2 ? Promise.reject(e5) : F(K(t3, "fail"), e5).then(() => F(K(t3, "complete"), e5)).then(() => (Z(B, { type: V, content: e5 }), Promise.reject(e5))));
          if (!(o2 || a2 || u2))
            return l2;
          l2.then((e5) => {
            o2 && o2(e5), u2 && u2(e5), r2 && Z(B, { type: V, content: e5 });
          }, (e5) => {
            a2 && a2(e5), u2 && u2(e5), r2 && Z(B, { type: V, content: e5 });
          });
        };
      }(t2[e3], e3)).bind(t2);
    }), t2.init = this.init, t2;
  }
}();
(() => {
  const e2 = Array.isArray(P) ? P.length : 0, t2 = function() {
    const e3 = Xt(), t3 = en();
    return t3 && t3.enable && g(t3.space) ? t3.space : e3;
  }();
  if (1 === e2)
    yr = yr.init(t2), yr._isDefault = true;
  else {
    const t3 = ["database", "getCurrentUserInfo", "importObject"];
    let n2;
    n2 = e2 > 0 ? "应用有多个服务空间，请通过uniCloud.init方法指定要使用的服务空间" : "应用未关联服务空间，请在uniCloud目录右键关联服务空间", [...["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile"], ...t3].forEach((e3) => {
      yr[e3] = function() {
        if (console.error(n2), -1 === t3.indexOf(e3))
          return Promise.reject(new re({ code: "SYS_ERR", message: n2 }));
        console.error(n2);
      };
    });
  }
  if (Object.assign(yr, { get mixinDatacom() {
    return ir(yr);
  } }), Ys(yr), yr.addInterceptor = M, yr.removeInterceptor = q, yr.interceptObject = j, "web" === T)
    ;
  !function() {
    const { failoverEndpoint: e3 } = Xt();
    if (!e3)
      return;
    sn().catch((e4) => {
      console.error("请求故障切换配置失败：", e4);
    });
    const t3 = { fail() {
      const e4 = en();
      nn(e4 && e4.interval || 0) && sn().catch((e5) => {
        console.error("请求故障切换配置失败：", e5);
      });
    } };
    M("callFunction", t3), M("database", t3), M("uploadFile", t3);
  }();
})();
var _r = yr;
let timeout = null;
function debounce(func2, wait = 500, immediate = false) {
  if (timeout !== null)
    clearTimeout(timeout);
  if (immediate) {
    const callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
    if (callNow)
      typeof func2 === "function" && func2();
  } else {
    timeout = setTimeout(() => {
      typeof func2 === "function" && func2();
    }, wait);
  }
}
let flag;
function throttle(func2, wait = 500, immediate = true) {
  if (immediate) {
    if (!flag) {
      flag = true;
      typeof func2 === "function" && func2();
      setTimeout(() => {
        flag = false;
      }, wait);
    }
  } else if (!flag) {
    flag = true;
    setTimeout(() => {
      flag = false;
      typeof func2 === "function" && func2();
    }, wait);
  }
}
function add(arg1, arg2) {
  var r1, r2, m2;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e2) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e2) {
    r2 = 0;
  }
  m2 = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m2 + arg2 * m2) / m2;
}
function sub(arg1, arg2) {
  var r1, r2, m2, n2;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e2) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e2) {
    r2 = 0;
  }
  m2 = Math.pow(10, Math.max(r1, r2));
  n2 = r1 >= r2 ? r1 : r2;
  return Math.abs(((arg1 * m2 - arg2 * m2) / m2).toFixed(n2));
}
function mul(a2, b2) {
  var c2 = 0, d2 = a2.toString(), e2 = b2.toString();
  try {
    c2 += d2.split(".")[1].length;
  } catch (f2) {
  }
  try {
    c2 += e2.split(".")[1].length;
  } catch (f2) {
  }
  return Number(d2.replace(".", "")) * Number(e2.replace(".", "")) / Math.pow(10, c2);
}
function div(a2, b2) {
  var c2, d2, e2 = 0, f2 = 0;
  try {
    e2 = a2.toString().split(".")[1].length;
  } catch (g2) {
  }
  try {
    f2 = b2.toString().split(".")[1].length;
  } catch (g2) {
  }
  return c2 = Number(a2.toString().replace(".", "")), d2 = Number(b2.toString().replace(".", "")), xyutil.mul(c2 / d2, Math.pow(10, f2 - e2));
}
const calc = {
  add,
  sub,
  mul,
  div
};
let platform = "none";
platform = "vue3";
platform = "mp";
platform = "weixin";
const platform$1 = platform;
let params = {
  loaded: false
};
const loadFont = () => {
  if (config.loadFontOnce) {
    params.loaded = true;
  }
  index$1.loadFontFace({
    global: true,
    // 是否全局生效。微信小程序 '2.10.0'起支持全局生效，需在 app.vue 中调用。
    family: "uicon-iconfont",
    source: 'url("' + config.iconUrl + '")',
    success() {
    },
    fail() {
    }
  });
  if (config.customIcon.family) {
    index$1.loadFontFace({
      global: true,
      // 是否全局生效。微信小程序 '2.10.0'起支持全局生效，需在 app.vue 中调用。
      family: config.customIcon.family,
      source: 'url("' + config.customIcon.url + '")',
      success() {
      },
      fail() {
      }
    });
  }
  return true;
};
const fontUtil = {
  params,
  loadFont
};
const DEFAULT_LIGHT_THEME_COLORS = Object.freeze({
  primary: "#3c9cff",
  info: "#909399",
  warning: "#f9ae3d",
  error: "#f56c6c",
  success: "#5ac725",
  mainColor: "#303133",
  contentColor: "#606266",
  tipsColor: "#909193",
  lightColor: "#c0c4cc",
  borderColor: "#dadbde",
  bgColor: "#f3f4f6",
  disabledColor: "#c8c9cc",
  primaryDark: "#398ade",
  primaryDisabled: "#9acafc",
  primaryLight: "#ecf5ff",
  warningDark: "#f1a532",
  warningDisabled: "#f9d39b",
  warningLight: "#fdf6ec",
  successDark: "#53c21d",
  successDisabled: "#a9e08f",
  successLight: "#f5fff0",
  errorDark: "#e45656",
  errorDisabled: "#f7b2b2",
  errorLight: "#fef0f0",
  infoDark: "#767a82",
  infoDisabled: "#c4c6c9",
  infoLight: "#f4f4f5"
});
const DEFAULT_DARK_THEME_COLORS = Object.freeze({
  primary: "#3c9cff",
  info: "#909399",
  warning: "#f9ae3d",
  error: "#f56c6c",
  success: "#5ac725",
  mainColor: "#f5f5f5",
  contentColor: "#d1d5db",
  tipsColor: "#9ca3af",
  lightColor: "#6b7280",
  borderColor: "#3a3a3c",
  bgColor: "#1f1f1f",
  disabledColor: "#4b5563",
  primaryDark: "#5aa8ff",
  primaryDisabled: "#4c6f92",
  primaryLight: "#10243a",
  warningDark: "#ffbf66",
  warningDisabled: "#8a6a3a",
  warningLight: "#3d2f1b",
  successDark: "#7ad94b",
  successDisabled: "#5f7f4f",
  successLight: "#1f3316",
  errorDark: "#ff8a8a",
  errorDisabled: "#8d5858",
  errorLight: "#3a2222",
  infoDark: "#b0b3b8",
  infoDisabled: "#5f6368",
  infoLight: "#2f3238"
});
const DEFAULT_THEME_EXTRA_VARS = Object.freeze({
  light: Object.freeze({
    "--up-table2-header-bg-color": "#f5f7fa",
    "--up-table2-zebra-bg-color": "#fafafa",
    "--up-table2-highlight-bg-color": "#f5f7fa",
    "--up-gap-bg-color": "#f3f4f6",
    "--up-skeleton-bg-color": "#f1f2f4",
    "--up-skeleton-shimmer-color": "#e6e6e6",
    "--up-swipe-action-button-bg-color": "#c7c6cd",
    "--up-index-list-indicator-bg-color": "#c9c9c9",
    "--up-calendar-month-mark-color": "rgba(231, 232, 234, 0.83)"
  }),
  dark: Object.freeze({
    "--up-table2-header-bg-color": "#2a2d33",
    "--up-table2-zebra-bg-color": "#23262b",
    "--up-table2-highlight-bg-color": "#2f3440",
    "--up-gap-bg-color": "#111111",
    "--up-skeleton-bg-color": "#2f3135",
    "--up-skeleton-shimmer-color": "rgba(255, 255, 255, 0.12)",
    "--up-swipe-action-button-bg-color": "#4b5563",
    "--up-index-list-indicator-bg-color": "#4b5563",
    "--up-calendar-month-mark-color": "rgba(255, 255, 255, 0.04)"
  })
});
const themeState = {
  preference: "system",
  mode: "light",
  version: 0,
  vars: {}
};
const THEME_MODE_STORAGE_KEY = "u-theme-mode";
const THEME_MODE_SYSTEM = "system";
const THEME_MODE_MANUAL = ["light", "dark"];
const LIGHT_THEME_TOKEN_FIELD_MAP = Object.freeze({
  "primary": "primary",
  "primary-dark": "primaryDark",
  "primary-disabled": "primaryDisabled",
  "primary-light": "primaryLight",
  "warning": "warning",
  "warning-dark": "warningDark",
  "warning-disabled": "warningDisabled",
  "warning-light": "warningLight",
  "success": "success",
  "success-dark": "successDark",
  "success-disabled": "successDisabled",
  "success-light": "successLight",
  "error": "error",
  "error-dark": "errorDark",
  "error-disabled": "errorDisabled",
  "error-light": "errorLight",
  "info": "info",
  "info-dark": "infoDark",
  "info-disabled": "infoDisabled",
  "info-light": "infoLight",
  "main-color": "mainColor",
  "content-color": "contentColor",
  "tips-color": "tipsColor",
  "light-color": "lightColor",
  "border-color": "borderColor",
  "bg-color": "bgColor",
  "disabled-color": "disabledColor"
});
const LIGHT_THEME_FIELD_TOKEN_MAP = Object.freeze(
  Object.fromEntries(
    Object.entries(LIGHT_THEME_TOKEN_FIELD_MAP).map(([token, field]) => [field, token])
  )
);
const runtimeThemeOverrideState = {
  color: /* @__PURE__ */ Object.create(null),
  configColor: /* @__PURE__ */ Object.create(null)
};
let cachedLightThemeColors = null;
let hasRegisterThemeListener = false;
let currentThemePreference = THEME_MODE_SYSTEM;
function normalizeThemeMode(theme = "light") {
  return theme === "dark" ? "dark" : "light";
}
function normalizeThemePreference(mode = THEME_MODE_SYSTEM) {
  if (THEME_MODE_MANUAL.includes(mode))
    return mode;
  return THEME_MODE_SYSTEM;
}
function getLightBridgeVar(token, fallback) {
  return `var(--up-light-${token}, ${fallback})`;
}
function clearOverrideBucket(bucket) {
  Object.keys(bucket).forEach((key) => {
    delete bucket[key];
  });
}
function normalizeLightThemeToken(token = "") {
  if (typeof token !== "string")
    return "";
  if (token.indexOf("up-") === 0)
    return token.slice(3);
  if (token.indexOf("u-") === 0)
    return token.slice(2);
  return token;
}
function isLightThemeConfigColorKey(token = "") {
  return token.indexOf("up-") === 0 || token.indexOf("u-") === 0;
}
function syncThemeColorOverrideState({
  color: colorOverrides,
  configColor: configColorOverrides,
  reset = false
} = {}) {
  if (reset) {
    clearOverrideBucket(runtimeThemeOverrideState.color);
    clearOverrideBucket(runtimeThemeOverrideState.configColor);
  }
  if (colorOverrides && typeof colorOverrides === "object") {
    Object.keys(LIGHT_THEME_FIELD_TOKEN_MAP).forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(colorOverrides, field))
        return;
      const value = colorOverrides[field];
      if (typeof value === "string" && value) {
        runtimeThemeOverrideState.color[field] = true;
        return;
      }
      delete runtimeThemeOverrideState.color[field];
    });
  }
  if (configColorOverrides && typeof configColorOverrides === "object") {
    Object.keys(configColorOverrides).forEach((key) => {
      const token = normalizeLightThemeToken(key);
      if (!Object.prototype.hasOwnProperty.call(LIGHT_THEME_TOKEN_FIELD_MAP, token))
        return;
      const value = configColorOverrides[key];
      if (typeof value === "string" && value) {
        const overrideKey = isLightThemeConfigColorKey(key) ? key : `up-${token}`;
        runtimeThemeOverrideState.configColor[overrideKey] = true;
        return;
      }
      delete runtimeThemeOverrideState.configColor[key];
      delete runtimeThemeOverrideState.configColor[`u-${token}`];
      delete runtimeThemeOverrideState.configColor[`up-${token}`];
    });
  }
}
function getExplicitRuntimeColorValue(token, runtimeColorMap = {}) {
  const field = LIGHT_THEME_TOKEN_FIELD_MAP[token];
  if (!field)
    return "";
  if (runtimeThemeOverrideState.color[field]) {
    const value = color$3[field];
    if (typeof value === "string" && value)
      return value;
  }
  const upKey = `up-${token}`;
  const uKey = `u-${token}`;
  if (!runtimeThemeOverrideState.configColor[upKey] && !runtimeThemeOverrideState.configColor[uKey])
    return "";
  const upValue = runtimeColorMap[upKey];
  const uValue = runtimeColorMap[uKey];
  if (runtimeThemeOverrideState.configColor[upKey] && typeof upValue === "string" && upValue)
    return upValue;
  if (runtimeThemeOverrideState.configColor[uKey] && typeof uValue === "string" && uValue)
    return uValue;
  return "";
}
function readThemePreferenceFromStorage() {
  try {
    if (typeof index$1 !== "undefined" && typeof index$1.getStorageSync === "function") {
      const mode = index$1.getStorageSync(THEME_MODE_STORAGE_KEY);
      return normalizeThemePreference(mode);
    }
  } catch (e2) {
  }
  return THEME_MODE_SYSTEM;
}
function writeThemePreferenceToStorage(mode) {
  try {
    if (typeof index$1 !== "undefined" && typeof index$1.setStorageSync === "function") {
      index$1.setStorageSync(THEME_MODE_STORAGE_KEY, mode);
    }
  } catch (e2) {
  }
}
function getSystemTheme() {
  let theme = "light";
  try {
    if (typeof index$1 !== "undefined" && typeof index$1.getAppBaseInfo === "function") {
      const appBaseInfo = index$1.getAppBaseInfo() || {};
      if (appBaseInfo.theme) {
        theme = appBaseInfo.theme;
      }
    }
    if (typeof index$1 !== "undefined" && typeof index$1.getSystemInfoSync === "function") {
      const systemInfo = index$1.getSystemInfoSync() || {};
      if (systemInfo.theme) {
        theme = systemInfo.theme;
      }
    }
  } catch (e2) {
    theme = "light";
  }
  return normalizeThemeMode(theme);
}
function getCurrentLightThemeColors() {
  const runtimeColorMap = config.color || {};
  const lightThemeColors = {
    ...DEFAULT_LIGHT_THEME_COLORS
  };
  Object.keys(LIGHT_THEME_TOKEN_FIELD_MAP).forEach((token) => {
    const explicitValue = getExplicitRuntimeColorValue(token, runtimeColorMap);
    if (!explicitValue)
      return;
    lightThemeColors[LIGHT_THEME_TOKEN_FIELD_MAP[token]] = explicitValue;
  });
  return lightThemeColors;
}
function getThemeColorsByMode(mode) {
  if (!cachedLightThemeColors) {
    cachedLightThemeColors = getCurrentLightThemeColors();
  }
  const themeMode = normalizeThemeMode(mode);
  if (themeMode === "dark") {
    return {
      ...DEFAULT_DARK_THEME_COLORS,
      primary: cachedLightThemeColors.primary,
      info: cachedLightThemeColors.info,
      warning: cachedLightThemeColors.warning,
      error: cachedLightThemeColors.error,
      success: cachedLightThemeColors.success
    };
  }
  return {
    ...cachedLightThemeColors
  };
}
function buildConfigColorMap(themeColors) {
  return {
    "u-primary": themeColors.primary,
    "u-primary-dark": themeColors.primaryDark,
    "u-primary-disabled": themeColors.primaryDisabled,
    "u-primary-light": themeColors.primaryLight,
    "u-warning": themeColors.warning,
    "u-warning-dark": themeColors.warningDark,
    "u-warning-disabled": themeColors.warningDisabled,
    "u-warning-light": themeColors.warningLight,
    "u-success": themeColors.success,
    "u-success-dark": themeColors.successDark,
    "u-success-disabled": themeColors.successDisabled,
    "u-success-light": themeColors.successLight,
    "u-error": themeColors.error,
    "u-error-dark": themeColors.errorDark,
    "u-error-disabled": themeColors.errorDisabled,
    "u-error-light": themeColors.errorLight,
    "u-info": themeColors.info,
    "u-info-dark": themeColors.infoDark,
    "u-info-disabled": themeColors.infoDisabled,
    "u-info-light": themeColors.infoLight,
    "u-main-color": themeColors.mainColor,
    "u-content-color": themeColors.contentColor,
    "u-tips-color": themeColors.tipsColor,
    "u-light-color": themeColors.lightColor,
    "u-border-color": themeColors.borderColor,
    "u-bg-color": themeColors.bgColor,
    "u-disabled-color": themeColors.disabledColor,
    "up-primary": themeColors.primary,
    "up-primary-dark": themeColors.primaryDark,
    "up-primary-disabled": themeColors.primaryDisabled,
    "up-primary-light": themeColors.primaryLight,
    "up-warning": themeColors.warning,
    "up-warning-dark": themeColors.warningDark,
    "up-warning-disabled": themeColors.warningDisabled,
    "up-warning-light": themeColors.warningLight,
    "up-success": themeColors.success,
    "up-success-dark": themeColors.successDark,
    "up-success-disabled": themeColors.successDisabled,
    "up-success-light": themeColors.successLight,
    "up-error": themeColors.error,
    "up-error-dark": themeColors.errorDark,
    "up-error-disabled": themeColors.errorDisabled,
    "up-error-light": themeColors.errorLight,
    "up-info": themeColors.info,
    "up-info-dark": themeColors.infoDark,
    "up-info-disabled": themeColors.infoDisabled,
    "up-info-light": themeColors.infoLight,
    "up-main-color": themeColors.mainColor,
    "up-content-color": themeColors.contentColor,
    "up-tips-color": themeColors.tipsColor,
    "up-light-color": themeColors.lightColor,
    "up-border-color": themeColors.borderColor,
    "up-bg-color": themeColors.bgColor,
    "up-disabled-color": themeColors.disabledColor
  };
}
function buildAliasCssVars(vars = {}) {
  const aliasVars = {};
  Object.keys(vars).forEach((key) => {
    if (typeof key !== "string")
      return;
    if (key.indexOf("--up-") === 0) {
      aliasVars[key.replace("--up-", "--u-")] = vars[key];
      return;
    }
    if (key.indexOf("--u-") === 0) {
      aliasVars[key.replace("--u-", "--up-")] = vars[key];
    }
  });
  return aliasVars;
}
function buildThemeCssVars(themeColors, mode = "light") {
  const themeMode = normalizeThemeMode(mode);
  const isDark = themeMode === "dark";
  const useBridge = !isDark;
  const runtimeColorMap = config.color || {};
  const defaultExtraVars = DEFAULT_THEME_EXTRA_VARS[themeMode] || DEFAULT_THEME_EXTRA_VARS.light;
  const pageBgColor = themeColors.bgColor || (isDark ? "#1f1f1f" : "#f3f4f6");
  const hoverBgColor = runtimeColorMap["up-hover-bg-color"] || runtimeColorMap["u-hover-bg-color"] || (isDark ? "#343741" : "#e7ebf0");
  const navbarBgColor = runtimeColorMap["up-navbar-bg-color"] || runtimeColorMap["u-navbar-bg-color"] || (isDark ? "#1c1c1e" : "#ffffff");
  const resolveLightTokenValue = (token, fallback) => {
    if (!useBridge)
      return fallback;
    const explicitValue = getExplicitRuntimeColorValue(token, runtimeColorMap);
    return explicitValue || getLightBridgeVar(token, fallback);
  };
  const resolvedMainColor = resolveLightTokenValue("main-color", themeColors.mainColor);
  const resolvedContentColor = resolveLightTokenValue("content-color", themeColors.contentColor);
  const resolvedTipsColor = resolveLightTokenValue("tips-color", themeColors.tipsColor);
  const resolvedLightColor = resolveLightTokenValue("light-color", themeColors.lightColor);
  const resolvedBorderColor = resolveLightTokenValue("border-color", themeColors.borderColor);
  const resolvedBgColor = resolveLightTokenValue("bg-color", themeColors.bgColor);
  const resolvedDisabledColor = resolveLightTokenValue("disabled-color", themeColors.disabledColor);
  const resolvedPrimary = resolveLightTokenValue("primary", themeColors.primary);
  const resolvedPrimaryDark = resolveLightTokenValue("primary-dark", themeColors.primaryDark);
  const resolvedPrimaryDisabled = resolveLightTokenValue("primary-disabled", themeColors.primaryDisabled);
  const resolvedPrimaryLight = resolveLightTokenValue("primary-light", themeColors.primaryLight);
  const resolvedWarning = resolveLightTokenValue("warning", themeColors.warning);
  const resolvedWarningDark = resolveLightTokenValue("warning-dark", themeColors.warningDark);
  const resolvedWarningDisabled = resolveLightTokenValue("warning-disabled", themeColors.warningDisabled);
  const resolvedWarningLight = resolveLightTokenValue("warning-light", themeColors.warningLight);
  const resolvedSuccess = resolveLightTokenValue("success", themeColors.success);
  const resolvedSuccessDark = resolveLightTokenValue("success-dark", themeColors.successDark);
  const resolvedSuccessDisabled = resolveLightTokenValue("success-disabled", themeColors.successDisabled);
  const resolvedSuccessLight = resolveLightTokenValue("success-light", themeColors.successLight);
  const resolvedError = resolveLightTokenValue("error", themeColors.error);
  const resolvedErrorDark = resolveLightTokenValue("error-dark", themeColors.errorDark);
  const resolvedErrorDisabled = resolveLightTokenValue("error-disabled", themeColors.errorDisabled);
  const resolvedErrorLight = resolveLightTokenValue("error-light", themeColors.errorLight);
  const resolvedInfo = resolveLightTokenValue("info", themeColors.info);
  const resolvedInfoDark = resolveLightTokenValue("info-dark", themeColors.infoDark);
  const resolvedInfoDisabled = resolveLightTokenValue("info-disabled", themeColors.infoDisabled);
  const resolvedInfoLight = resolveLightTokenValue("info-light", themeColors.infoLight);
  const coreVars = {
    "--u-main-color": resolvedMainColor,
    "--u-content-color": resolvedContentColor,
    "--u-tips-color": resolvedTipsColor,
    "--u-light-color": resolvedLightColor,
    "--u-border-color": resolvedBorderColor,
    "--u-bg-color": resolvedBgColor,
    "--u-hover-bg-color": hoverBgColor,
    "--u-disabled-color": resolvedDisabledColor,
    "--u-primary": resolvedPrimary,
    "--u-primary-dark": resolvedPrimaryDark,
    "--u-primary-disabled": resolvedPrimaryDisabled,
    "--u-primary-light": resolvedPrimaryLight,
    "--u-warning": resolvedWarning,
    "--u-warning-dark": resolvedWarningDark,
    "--u-warning-disabled": resolvedWarningDisabled,
    "--u-warning-light": resolvedWarningLight,
    "--u-success": resolvedSuccess,
    "--u-success-dark": resolvedSuccessDark,
    "--u-success-disabled": resolvedSuccessDisabled,
    "--u-success-light": resolvedSuccessLight,
    "--u-error": resolvedError,
    "--u-error-dark": resolvedErrorDark,
    "--u-error-disabled": resolvedErrorDisabled,
    "--u-error-light": resolvedErrorLight,
    "--u-info": resolvedInfo,
    "--u-info-dark": resolvedInfoDark,
    "--u-info-disabled": resolvedInfoDisabled,
    "--u-info-light": resolvedInfoLight,
    "--up-main-color": resolvedMainColor,
    "--up-content-color": resolvedContentColor,
    "--up-tips-color": resolvedTipsColor,
    "--up-light-color": resolvedLightColor,
    "--up-border-color": resolvedBorderColor,
    "--up-bg-color": resolvedBgColor,
    "--up-hover-bg-color": hoverBgColor,
    "--up-disabled-color": resolvedDisabledColor,
    "--up-primary": resolvedPrimary,
    "--up-primary-dark": resolvedPrimaryDark,
    "--up-primary-disabled": resolvedPrimaryDisabled,
    "--up-primary-light": resolvedPrimaryLight,
    "--up-warning": resolvedWarning,
    "--up-warning-dark": resolvedWarningDark,
    "--up-warning-disabled": resolvedWarningDisabled,
    "--up-warning-light": resolvedWarningLight,
    "--up-success": resolvedSuccess,
    "--up-success-dark": resolvedSuccessDark,
    "--up-success-disabled": resolvedSuccessDisabled,
    "--up-success-light": resolvedSuccessLight,
    "--up-error": resolvedError,
    "--up-error-dark": resolvedErrorDark,
    "--up-error-disabled": resolvedErrorDisabled,
    "--up-error-light": resolvedErrorLight,
    "--up-info": resolvedInfo,
    "--up-info-dark": resolvedInfoDark,
    "--up-info-disabled": resolvedInfoDisabled,
    "--up-info-light": resolvedInfoLight,
    "--up-page-bg-color": pageBgColor,
    "--up-card-bg-color": isDark ? "#1c1c1e" : "#ffffff",
    "--up-navbar-bg-color": navbarBgColor
  };
  const extraVars = {};
  Object.keys(runtimeColorMap).forEach((key) => {
    if (typeof key !== "string")
      return;
    const isThemeToken = key.indexOf("up-") === 0 || key.indexOf("u-") === 0;
    if (!isThemeToken)
      return;
    const cssVarName = `--${key}`;
    if (Object.prototype.hasOwnProperty.call(coreVars, cssVarName))
      return;
    const value = runtimeColorMap[key];
    if (typeof value === "string" && value) {
      extraVars[cssVarName] = value;
    }
  });
  return {
    ...coreVars,
    ...defaultExtraVars,
    ...buildAliasCssVars(defaultExtraVars),
    ...extraVars,
    ...buildAliasCssVars(extraVars)
  };
}
function getThemeVars(mode) {
  if (mode) {
    return buildThemeCssVars(getThemeColorsByMode(mode), mode);
  }
  if (themeState.vars && Object.keys(themeState.vars).length > 0) {
    return { ...themeState.vars };
  }
  return buildThemeCssVars(getThemeColorsByMode(themeState.mode), themeState.mode);
}
function hasActiveRuntimePage() {
  try {
    if (typeof getCurrentPages === "function") {
      const pages2 = getCurrentPages();
      return Array.isArray(pages2) && pages2.length > 0;
    }
  } catch (e2) {
  }
  return false;
}
function trySetNavigationBarColor(options) {
  if (typeof index$1 === "undefined" || typeof index$1.setNavigationBarColor !== "function")
    return;
  if (!hasActiveRuntimePage())
    return;
  try {
    const result = index$1.setNavigationBarColor(options);
    if (result && typeof result.catch === "function") {
      result.catch(() => {
      });
    }
  } catch (e2) {
  }
}
function applyNativeThemeUI(mode, themeColors, themeVars = {}) {
  var _a, _b;
  if (typeof index$1 === "undefined")
    return;
  if (config.nativeThemeSync !== true)
    return;
  const isDark = normalizeThemeMode(mode) === "dark";
  const pageBg = (themeColors == null ? void 0 : themeColors.bgColor) || (isDark ? "#1f1f1f" : "#f3f4f6");
  const navBg = (themeVars == null ? void 0 : themeVars["--up-navbar-bg-color"]) || (themeVars == null ? void 0 : themeVars["--u-navbar-bg-color"]) || ((_a = config.color) == null ? void 0 : _a["up-navbar-bg-color"]) || ((_b = config.color) == null ? void 0 : _b["u-navbar-bg-color"]) || (isDark ? "#1c1c1e" : "#ffffff");
  trySetNavigationBarColor({
    frontColor: isDark ? "#ffffff" : "#000000",
    backgroundColor: navBg,
    animation: {
      duration: 0,
      timingFunc: "linear"
    }
  });
  if (typeof index$1.setBackgroundColor === "function") {
    index$1.setBackgroundColor({
      backgroundColor: pageBg,
      backgroundColorTop: pageBg,
      backgroundColorBottom: pageBg
    });
  }
  trySetTabBarStyle({
    color: isDark ? "#8e8e93" : "#909399",
    selectedColor: isDark ? "#f2f2f7" : "#303133",
    backgroundColor: isDark ? "#111111" : "#ffffff",
    borderStyle: isDark ? "white" : "black"
  });
}
function applyTheme(mode = "light") {
  const themeMode = normalizeThemeMode(mode);
  const themeColors = getThemeColorsByMode(themeMode);
  const themeVars = buildThemeCssVars(themeColors, themeMode);
  index.shallowMerge(color$3, {
    primary: themeColors.primary,
    primaryDark: themeColors.primaryDark,
    primaryDisabled: themeColors.primaryDisabled,
    primaryLight: themeColors.primaryLight,
    info: themeColors.info,
    infoDark: themeColors.infoDark,
    infoDisabled: themeColors.infoDisabled,
    infoLight: themeColors.infoLight,
    default: themeColors.info,
    warning: themeColors.warning,
    warningDark: themeColors.warningDark,
    warningDisabled: themeColors.warningDisabled,
    warningLight: themeColors.warningLight,
    error: themeColors.error,
    errorDark: themeColors.errorDark,
    errorDisabled: themeColors.errorDisabled,
    errorLight: themeColors.errorLight,
    success: themeColors.success,
    successDark: themeColors.successDark,
    successDisabled: themeColors.successDisabled,
    successLight: themeColors.successLight,
    mainColor: themeColors.mainColor,
    contentColor: themeColors.contentColor,
    tipsColor: themeColors.tipsColor,
    lightColor: themeColors.lightColor,
    borderColor: themeColors.borderColor,
    bgColor: themeColors.bgColor,
    disabledColor: themeColors.disabledColor
  });
  index.shallowMerge(config.color, buildConfigColorMap(themeColors));
  config.themeMode = themeMode;
  themeState.preference = currentThemePreference;
  themeState.mode = themeMode;
  themeState.vars = { ...themeVars };
  themeState.version = Number(themeState.version || 0) + 1;
  applyNativeThemeUI(themeMode, themeColors, themeVars);
  if (typeof index$1 !== "undefined" && index$1.$u && index$1.$u.theme) {
    index$1.$u.theme.mode = themeState.mode;
    if (Object.prototype.hasOwnProperty.call(index$1.$u.theme, "colors")) {
      delete index$1.$u.theme.colors;
    }
    index$1.$u.theme.vars = { ...themeState.vars };
    index$1.$u.theme.version = themeState.version;
  }
  if (typeof index$1 !== "undefined" && typeof index$1.$emit === "function") {
    index$1.$emit("uThemeChange", {
      mode: themeState.mode,
      colors: { ...themeColors },
      version: themeState.version,
      vars: { ...themeState.vars }
    });
  }
  return themeState;
}
function setTheme(mode = "light") {
  currentThemePreference = normalizeThemeMode(mode);
  writeThemePreferenceToStorage(currentThemePreference);
  return applyTheme(currentThemePreference);
}
function setThemePreference(mode = THEME_MODE_SYSTEM) {
  currentThemePreference = normalizeThemePreference(mode);
  writeThemePreferenceToStorage(currentThemePreference);
  if (currentThemePreference === THEME_MODE_SYSTEM) {
    return applyTheme(getSystemTheme());
  }
  return applyTheme(currentThemePreference);
}
function getThemePreference() {
  return currentThemePreference;
}
function refreshThemeFromConfig() {
  cachedLightThemeColors = getCurrentLightThemeColors();
  if (themeState.version > 0) {
    applyTheme(themeState.mode);
  }
}
function initThemeSystem() {
  if (typeof index$1 === "undefined")
    return;
  if (!cachedLightThemeColors) {
    cachedLightThemeColors = getCurrentLightThemeColors();
  }
  currentThemePreference = readThemePreferenceFromStorage();
  if (currentThemePreference === THEME_MODE_SYSTEM) {
    applyTheme(getSystemTheme());
  } else {
    applyTheme(currentThemePreference);
  }
  if (!hasRegisterThemeListener && typeof index$1.onThemeChange === "function") {
    index$1.onThemeChange((res = {}) => {
      if (currentThemePreference === THEME_MODE_SYSTEM) {
        applyTheme(res.theme);
      }
    });
    hasRegisterThemeListener = true;
  }
}
const rootToastState = {
  ref: null
};
const rootNotifyState = {
  ref: null
};
function normalizeRootToastOptions(options = {}) {
  const toastOptions = typeof options === "string" ? { message: options } : options && typeof options === "object" ? { ...options } : {};
  if (!toastOptions.message && toastOptions.title) {
    toastOptions.message = toastOptions.title;
  }
  return toastOptions;
}
function setRootToastRef(ref2 = null) {
  rootToastState.ref = ref2 || null;
}
function rootToast(options = {}) {
  const toastOptions = normalizeRootToastOptions(options);
  const toastRef = rootToastState.ref;
  if (toastRef && typeof toastRef.show === "function") {
    toastRef.show(toastOptions);
    return;
  }
  if (!toastOptions.message)
    return;
  if (typeof index$1 !== "undefined" && typeof index$1.showToast === "function") {
    index$1.showToast({
      title: toastOptions.message,
      icon: "none",
      duration: Number(toastOptions.duration) || 2e3
    });
  }
}
function normalizeRootNotifyOptions(options = {}) {
  const notifyOptions = typeof options === "string" ? { message: options } : options && typeof options === "object" ? { ...options } : {};
  if (!notifyOptions.message && notifyOptions.title) {
    notifyOptions.message = notifyOptions.title;
  }
  return notifyOptions;
}
function setRootNotifyRef(ref2 = null) {
  rootNotifyState.ref = ref2 || null;
}
function rootNotify(options = {}) {
  const notifyOptions = normalizeRootNotifyOptions(options);
  const notifyRef = rootNotifyState.ref;
  if (notifyRef && typeof notifyRef.show === "function") {
    notifyRef.show(notifyOptions);
    return;
  }
  if (!notifyOptions.message)
    return;
  if (typeof index$1 !== "undefined" && typeof index$1.showToast === "function") {
    index$1.showToast({
      title: notifyOptions.message,
      icon: "none",
      duration: Number(notifyOptions.duration) || 3e3
    });
  }
}
let themeType = ["primary", "success", "error", "warning", "info"];
function setConfig(configs) {
  var _a, _b;
  const settings2 = configs || {};
  index.shallowMerge(config, settings2.config || {});
  index.shallowMerge(props$j, settings2.props || {});
  index.shallowMerge(color$3, settings2.color || {});
  index.shallowMerge(zIndex, settings2.zIndex || {});
  syncThemeColorOverrideState({
    color: settings2.color,
    configColor: (_a = settings2 == null ? void 0 : settings2.config) == null ? void 0 : _a.color
  });
  const shouldRefreshTheme = !!settings2.color || !!((_b = settings2 == null ? void 0 : settings2.config) == null ? void 0 : _b.color) || themeState.version > 0;
  if (shouldRefreshTheme) {
    refreshThemeFromConfig();
  }
}
index.setConfig = setConfig;
const $u = {
  route,
  date: index.timeFormat,
  // 另名date
  colorGradient: colorGradient$1.colorGradient,
  hexToRgb: colorGradient$1.hexToRgb,
  rgbToHex: colorGradient$1.rgbToHex,
  colorToRgba: colorGradient$1.colorToRgba,
  test,
  type: themeType,
  http,
  config,
  // uview-plus配置信息相关，比如版本号
  zIndex,
  debounce,
  throttle,
  calc,
  mixin,
  mpMixin,
  // props,
  ...index,
  color: color$3,
  platform: platform$1,
  theme: themeState,
  setTheme,
  setThemePreference,
  getThemePreference,
  getSystemTheme,
  getThemeVars,
  getThemeTabBarStyle,
  applyNativeThemeUI: applyNativeThemeUI$1,
  rootToast,
  setRootToastRef,
  rootNotify,
  setRootNotifyRef
};
function defineGlobalThemeHelpers(Vue) {
  var _a;
  const globalProperties = (_a = Vue == null ? void 0 : Vue.config) == null ? void 0 : _a.globalProperties;
  if (!globalProperties)
    return;
  Object.defineProperty(globalProperties, "upThemeIsDark", {
    configurable: true,
    get() {
      return getThemeIsDark();
    }
  });
  Object.defineProperty(globalProperties, "upThemeVars", {
    configurable: true,
    get() {
      return getThemeVarsForStyle();
    }
  });
  Object.defineProperty(globalProperties, "upThemePageStyle", {
    configurable: true,
    get() {
      return getThemePageStyle();
    }
  });
  Object.defineProperty(globalProperties, "upThemeCardStyle", {
    configurable: true,
    get() {
      return getThemeCardStyle();
    }
  });
  globalProperties.upThemeVar = function(varName, fallbackColor) {
    return getThemeVar(varName, fallbackColor);
  };
  globalProperties.upApplyNativeThemeUI = function() {
    return applyNativeThemeUI$1();
  };
}
const install = (Vue, upuiParams = "") => {
  if (upuiParams) {
    index$1.upuiParams = upuiParams;
    let temp = upuiParams();
    if (temp.httpIns) {
      temp.httpIns(http);
    }
    if (temp.options) {
      setConfig(temp.options);
    }
  }
  index$1.$u = $u;
  initThemeSystem();
  if (Vue && Vue.config && Vue.config.globalProperties) {
    Vue.config.globalProperties.$u = $u;
    defineGlobalThemeHelpers(Vue);
  }
  if (Vue && typeof Vue.mixin === "function") {
    Vue.mixin(mixin);
  }
};
const uviewPlus = {
  install
};
const props$h = defineMixin({
  props: {
    // 是否显示组件
    show: {
      type: Boolean,
      default: () => props$j.loadingIcon.show
    },
    // 颜色
    color: {
      type: String,
      default: () => props$j.loadingIcon.color
    },
    // 提示文字颜色
    textColor: {
      type: String,
      default: () => props$j.loadingIcon.textColor
    },
    // 文字和图标是否垂直排列
    vertical: {
      type: Boolean,
      default: () => props$j.loadingIcon.vertical
    },
    // 模式选择，circle-圆形，spinner-花朵形，semicircle-半圆形
    mode: {
      type: String,
      default: () => props$j.loadingIcon.mode
    },
    // 图标大小，单位默认px
    size: {
      type: [String, Number],
      default: () => props$j.loadingIcon.size
    },
    // 文字大小
    textSize: {
      type: [String, Number],
      default: () => props$j.loadingIcon.textSize
    },
    // 文字内容
    text: {
      type: [String, Number],
      default: () => props$j.loadingIcon.text
    },
    // 动画模式
    timingFunction: {
      type: String,
      default: () => props$j.loadingIcon.timingFunction
    },
    // 动画执行周期时间
    duration: {
      type: [String, Number],
      default: () => props$j.loadingIcon.duration
    },
    // mode=circle时的暗边颜色
    inactiveColor: {
      type: String,
      default: () => props$j.loadingIcon.inactiveColor
    }
  }
});
const props$g = defineMixin({
  props: {
    // 背景颜色（默认transparent）
    bgColor: {
      type: String,
      default: () => props$j.gap.bgColor
    },
    // 分割槽高度，单位px（默认30）
    height: {
      type: [String, Number],
      default: () => props$j.gap.height
    },
    // 与上一个组件的距离
    marginTop: {
      type: [String, Number],
      default: () => props$j.gap.marginTop
    },
    // 与下一个组件的距离
    marginBottom: {
      type: [String, Number],
      default: () => props$j.gap.marginBottom
    }
  }
});
const props$f = defineMixin({
  props: {
    // 是否显示遮罩
    show: {
      type: Boolean,
      default: () => props$j.overlay.show
    },
    // 层级z-index
    zIndex: {
      type: [String, Number],
      default: () => props$j.overlay.zIndex
    },
    // 遮罩的过渡时间，单位为ms
    duration: {
      type: [String, Number],
      default: () => props$j.overlay.duration
    },
    // 不透明度值，当做rgba的第四个参数
    opacity: {
      type: [String, Number],
      default: () => props$j.overlay.opacity
    }
  }
});
const props$e = defineMixin({
  props: {
    color: {
      type: String,
      default: () => props$j.line.color
    },
    // 长度，竖向时表现为高度，横向时表现为长度，可以为百分比，带px单位的值等
    length: {
      type: [String, Number],
      default: () => props$j.line.length
    },
    // 线条方向，col-竖向，row-横向
    direction: {
      type: String,
      default: () => props$j.line.direction
    },
    // 是否显示细边框
    hairline: {
      type: Boolean,
      default: () => props$j.line.hairline
    },
    // 线条与上下左右元素的间距，字符串形式，如"30px"、"20px 30px"
    margin: {
      type: [String, Number],
      default: () => props$j.line.margin
    },
    // 是否虚线，true-虚线，false-实线
    dashed: {
      type: Boolean,
      default: () => props$j.line.dashed
    }
  }
});
const props$d = defineMixin({
  props: {
    // 是否展示弹窗
    show: {
      type: Boolean,
      default: () => props$j.popup.show
    },
    // 是否显示遮罩
    overlay: {
      type: Boolean,
      default: () => props$j.popup.overlay
    },
    // 弹出的方向，可选值为 top bottom right left center
    mode: {
      type: String,
      default: () => props$j.popup.mode
    },
    // 动画时长，单位ms
    duration: {
      type: [String, Number],
      default: () => props$j.popup.duration
    },
    // 是否显示关闭图标
    closeable: {
      type: Boolean,
      default: () => props$j.popup.closeable
    },
    // 自定义遮罩的样式
    overlayStyle: {
      type: [Object, String],
      default: () => props$j.popup.overlayStyle
    },
    // 点击遮罩是否关闭弹窗
    closeOnClickOverlay: {
      type: Boolean,
      default: () => props$j.popup.closeOnClickOverlay
    },
    // 层级
    zIndex: {
      type: [String, Number],
      default: () => props$j.popup.zIndex
    },
    // 是否为iPhoneX留出底部安全距离
    safeAreaInsetBottom: {
      type: Boolean,
      default: () => props$j.popup.safeAreaInsetBottom
    },
    // 是否留出顶部安全距离（状态栏高度）
    safeAreaInsetTop: {
      type: Boolean,
      default: () => props$j.popup.safeAreaInsetTop
    },
    // 自定义关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角
    closeIconPos: {
      type: String,
      default: () => props$j.popup.closeIconPos
    },
    // 是否显示圆角
    round: {
      type: [Boolean, String, Number],
      default: () => props$j.popup.round
    },
    // mode=center，也即中部弹出时，是否使用缩放模式
    zoom: {
      type: Boolean,
      default: () => props$j.popup.zoom
    },
    // 弹窗背景色，设置为transparent可去除白色背景
    bgColor: {
      type: String,
      default: () => props$j.popup.bgColor
    },
    // 遮罩的透明度，0-1之间
    overlayOpacity: {
      type: [Number, String],
      default: () => props$j.popup.overlayOpacity
    },
    // 是否页面内展示
    pageInline: {
      type: Boolean,
      default: () => props$j.popup.pageInline
    },
    // 是否页开启手势滑动
    touchable: {
      type: Boolean,
      default: () => props$j.popup.touchable
    },
    // 手势滑动最小高度
    minHeight: {
      type: [String],
      default: () => props$j.popup.minHeight
    },
    // 手势滑动最大高度
    maxHeight: {
      type: [String],
      default: () => props$j.popup.maxHeight
    }
  }
});
const props$c = defineMixin({
  props: {
    // 组件状态，loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
    status: {
      type: String,
      default: () => props$j.loadmore.status
    },
    // 组件背景色
    bgColor: {
      type: String,
      default: () => props$j.loadmore.bgColor
    },
    // 是否显示加载中的图标
    icon: {
      type: Boolean,
      default: () => props$j.loadmore.icon
    },
    // 字体大小
    fontSize: {
      type: [String, Number],
      default: () => props$j.loadmore.fontSize
    },
    // 图标大小
    iconSize: {
      type: [String, Number],
      default: () => props$j.loadmore.iconSize
    },
    // 字体颜色
    color: {
      type: String,
      default: () => props$j.loadmore.color
    },
    // 加载中状态的图标，spinner-花朵状图标，circle-圆圈状，semicircle-半圆
    loadingIcon: {
      type: String,
      default: () => props$j.loadmore.loadingIcon
    },
    // 加载前的提示语
    loadmoreText: {
      type: String,
      default: () => props$j.loadmore.loadmoreText
    },
    // 加载中提示语
    loadingText: {
      type: String,
      default: () => props$j.loadmore.loadingText
    },
    // 没有更多的提示语
    nomoreText: {
      type: String,
      default: () => props$j.loadmore.nomoreText
    },
    // 在“没有更多”状态下，是否显示粗点
    isDot: {
      type: Boolean,
      default: () => props$j.loadmore.isDot
    },
    // 加载中图标的颜色
    iconColor: {
      type: String,
      default: () => props$j.loadmore.iconColor
    },
    // 上边距
    marginTop: {
      type: [String, Number],
      default: () => props$j.loadmore.marginTop
    },
    // 下边距
    marginBottom: {
      type: [String, Number],
      default: () => props$j.loadmore.marginBottom
    },
    // 高度，单位px
    height: {
      type: [String, Number],
      default: () => props$j.loadmore.height
    },
    // 是否显示左边分割线
    line: {
      type: Boolean,
      default: () => props$j.loadmore.line
    },
    // 线条颜色
    lineColor: {
      type: String,
      default: () => props$j.loadmore.lineColor
    },
    // 是否虚线，true-虚线，false-实线
    dashed: {
      type: Boolean,
      default: () => props$j.loadmore.dashed
    }
  }
});
const buttonMixin = defineMixin({
  props: {
    lang: String,
    sessionFrom: String,
    sendMessageTitle: String,
    sendMessagePath: String,
    sendMessageImg: String,
    showMessageCard: Boolean,
    appParameter: String,
    formType: String,
    openType: String
  }
});
const openType = defineMixin({
  props: {
    openType: String
  },
  methods: {
    onGetUserInfo(event) {
      this.$emit("getuserinfo", event.detail);
    },
    onContact(event) {
      this.$emit("contact", event.detail);
    },
    onGetPhoneNumber(event) {
      this.$emit("getphonenumber", event.detail);
    },
    onError(event) {
      this.$emit("error", event.detail);
    },
    onLaunchApp(event) {
      this.$emit("launchapp", event.detail);
    },
    onOpenSetting(event) {
      this.$emit("opensetting", event.detail);
    }
  }
});
const props$b = defineMixin({
  props: {
    // 是否细边框
    hairline: {
      type: Boolean,
      default: () => props$j.button.hairline
    },
    // 按钮的预置样式，info，primary，error，warning，success
    type: {
      type: String,
      default: () => props$j.button.type
    },
    // 按钮尺寸，large，normal，small，mini
    size: {
      type: String,
      default: () => props$j.button.size
    },
    // 按钮形状，circle（两边为半圆），square（带圆角）
    shape: {
      type: String,
      default: () => props$j.button.shape
    },
    // 按钮是否镂空
    plain: {
      type: Boolean,
      default: () => props$j.button.plain
    },
    // 是否禁止状态
    disabled: {
      type: Boolean,
      default: () => props$j.button.disabled
    },
    // 是否加载中
    loading: {
      type: Boolean,
      default: () => props$j.button.loading
    },
    // 加载中提示文字
    loadingText: {
      type: [String, Number],
      default: () => props$j.button.loadingText
    },
    // 加载状态图标类型
    loadingMode: {
      type: String,
      default: () => props$j.button.loadingMode
    },
    // 加载图标大小
    loadingSize: {
      type: [String, Number],
      default: () => props$j.button.loadingSize
    },
    // 开放能力，具体请看uniapp稳定关于button组件部分说明
    // https://uniapp.dcloud.io/component/button
    openType: {
      type: String,
      default: () => props$j.button.openType
    },
    // 用于 <form> 组件，点击分别会触发 <form> 组件的 submit/reset 事件
    // 取值为submit（提交表单），reset（重置表单）
    formType: {
      type: String,
      default: () => props$j.button.formType
    },
    // 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
    // 只微信小程序、QQ小程序有效
    appParameter: {
      type: String,
      default: () => props$j.button.appParameter
    },
    // 指定是否阻止本节点的祖先节点出现点击态，微信小程序有效
    hoverStopPropagation: {
      type: Boolean,
      default: () => props$j.button.hoverStopPropagation
    },
    // 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。只微信小程序有效
    lang: {
      type: String,
      default: () => props$j.button.lang
    },
    // 会话来源，open-type="contact"时有效。只微信小程序有效
    sessionFrom: {
      type: String,
      default: () => props$j.button.sessionFrom
    },
    // 会话内消息卡片标题，open-type="contact"时有效
    // 默认当前标题，只微信小程序有效
    sendMessageTitle: {
      type: String,
      default: () => props$j.button.sendMessageTitle
    },
    // 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
    // 默认当前分享路径，只微信小程序有效
    sendMessagePath: {
      type: String,
      default: () => props$j.button.sendMessagePath
    },
    // 会话内消息卡片图片，open-type="contact"时有效
    // 默认当前页面截图，只微信小程序有效
    sendMessageImg: {
      type: String,
      default: () => props$j.button.sendMessageImg
    },
    // 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，
    // 用户点击后可以快速发送小程序消息，open-type="contact"时有效
    showMessageCard: {
      type: Boolean,
      default: () => props$j.button.showMessageCard
    },
    // 额外传参参数，用于小程序的data-xxx属性，通过target.dataset.name获取
    dataName: {
      type: String,
      default: () => props$j.button.dataName
    },
    // 节流，一定时间内只能触发一次
    throttleTime: {
      type: [String, Number],
      default: () => props$j.button.throttleTime
    },
    // 按住后多久出现点击态，单位毫秒
    hoverStartTime: {
      type: [String, Number],
      default: () => props$j.button.hoverStartTime
    },
    // 手指松开后点击态保留时间，单位毫秒
    hoverStayTime: {
      type: [String, Number],
      default: () => props$j.button.hoverStayTime
    },
    // 按钮文字，之所以通过props传入，是因为slot传入的话
    // nvue中无法控制文字的样式
    text: {
      type: [String, Number],
      default: () => props$j.button.text
    },
    // 按钮图标
    icon: {
      type: String,
      default: () => props$j.button.icon
    },
    // 按钮图标
    iconColor: {
      type: String,
      default: () => props$j.button.icon
    },
    // 按钮颜色，支持传入linear-gradient渐变色
    color: {
      type: String,
      default: () => props$j.button.color
    },
    // 停止冒泡
    stop: {
      type: Boolean,
      default: () => props$j.button.stop
    }
  }
});
const props$a = defineMixin({
  props: {
    // 标签类型info、primary、success、warning、error
    type: {
      type: String,
      default: () => props$j.tag.type
    },
    // 不可用
    disabled: {
      type: [Boolean, String],
      default: () => props$j.tag.disabled
    },
    // 标签的大小，large，medium，mini
    size: {
      type: String,
      default: () => props$j.tag.size
    },
    // tag的形状，circle（两边半圆形）, square（方形，带圆角）
    shape: {
      type: String,
      default: () => props$j.tag.shape
    },
    // 标签文字
    text: {
      type: [String, Number],
      default: () => props$j.tag.text
    },
    // 背景颜色，默认为空字符串，即不处理
    bgColor: {
      type: String,
      default: () => props$j.tag.bgColor
    },
    // 标签字体颜色，默认为空字符串，即不处理
    color: {
      type: String,
      default: () => props$j.tag.color
    },
    // 标签的边框颜色
    borderColor: {
      type: String,
      default: () => props$j.tag.borderColor
    },
    // 关闭按钮图标的颜色
    closeColor: {
      type: String,
      default: () => props$j.tag.closeColor
    },
    // 点击时返回的索引值，用于区分例遍的数组哪个元素被点击了
    name: {
      type: [String, Number],
      default: () => props$j.tag.name
    },
    // // 模式选择，dark|light|plain
    // mode: {
    // 	type: String,
    // 	default: 'light'
    // },
    // 镂空时是否填充背景色
    plainFill: {
      type: Boolean,
      default: () => props$j.tag.plainFill
    },
    // 是否镂空
    plain: {
      type: Boolean,
      default: () => props$j.tag.plain
    },
    // 是否可关闭
    closable: {
      type: Boolean,
      default: () => props$j.tag.closable
    },
    // 是否显示
    show: {
      type: Boolean,
      default: () => props$j.tag.show
    },
    // 内置图标，或绝对路径的图片
    icon: {
      type: String,
      default: () => props$j.tag.icon
    },
    // 图标颜色
    iconColor: {
      type: String,
      default: () => props$j.tag.iconColor
    },
    // 自定义尺寸字体大小
    textSize: {
      type: String,
      default: () => props$j.tag.textSize
    },
    // 自定义尺寸高度
    height: {
      type: String,
      default: () => props$j.tag.height
    },
    // 自定义尺寸padding
    padding: {
      type: String,
      default: () => props$j.tag.padding
    },
    // 自定义尺寸
    borderRadius: {
      type: String,
      default: () => props$j.tag.borderRadius
    },
    // 自动计算背景色
    autoBgColor: {
      type: Number,
      default: () => props$j.tag.autoBgColor
    }
  }
});
const props$9 = defineMixin({
  props: {
    // 内置图标名称，或图片路径，建议绝对路径
    icon: {
      type: String,
      default: () => props$j.empty.icon
    },
    // 提示文字
    text: {
      type: String,
      default: () => props$j.empty.text
    },
    // 文字颜色
    textColor: {
      type: String,
      default: () => props$j.empty.textColor
    },
    // 文字大小
    textSize: {
      type: [String, Number],
      default: () => props$j.empty.textSize
    },
    // 图标的颜色
    iconColor: {
      type: String,
      default: () => props$j.empty.iconColor
    },
    // 图标的大小
    iconSize: {
      type: [String, Number],
      default: () => props$j.empty.iconSize
    },
    // 选择预置的图标类型
    mode: {
      type: String,
      default: () => props$j.empty.mode
    },
    //  图标宽度，单位px
    width: {
      type: [String, Number],
      default: () => props$j.empty.width
    },
    // 图标高度，单位px
    height: {
      type: [String, Number],
      default: () => props$j.empty.height
    },
    // 是否显示组件
    show: {
      type: Boolean,
      default: () => props$j.empty.show
    },
    // 组件距离上一个元素之间的距离，默认px单位
    marginTop: {
      type: [String, Number],
      default: () => props$j.empty.marginTop
    }
  }
});
const props$8 = defineMixin({
  props: {
    // 图片地址
    src: {
      type: String,
      default: () => props$j.image.src
    },
    // 裁剪模式
    mode: {
      type: String,
      default: () => props$j.image.mode
    },
    // 宽度，单位任意
    width: {
      type: [String, Number],
      default: () => props$j.image.width
    },
    // 高度，单位任意
    height: {
      type: [String, Number],
      default: () => props$j.image.height
    },
    // 图片形状，circle-圆形，square-方形
    shape: {
      type: String,
      default: () => props$j.image.shape
    },
    // 圆角，单位任意
    radius: {
      type: [String, Number],
      default: () => props$j.image.radius
    },
    // 是否懒加载，微信小程序、App、百度小程序、字节跳动小程序
    lazyLoad: {
      type: Boolean,
      default: () => props$j.image.lazyLoad
    },
    // 开启长按图片显示识别微信小程序码菜单
    showMenuByLongpress: {
      type: Boolean,
      default: () => props$j.image.showMenuByLongpress
    },
    // 加载中的图标，或者小图片
    loadingIcon: {
      type: String,
      default: () => props$j.image.loadingIcon
    },
    // 加载失败的图标，或者小图片
    errorIcon: {
      type: String,
      default: () => props$j.image.errorIcon
    },
    // 是否显示加载中的图标或者自定义的slot
    showLoading: {
      type: Boolean,
      default: () => props$j.image.showLoading
    },
    // 是否显示加载错误的图标或者自定义的slot
    showError: {
      type: Boolean,
      default: () => props$j.image.showError
    },
    // 是否需要淡入效果
    fade: {
      type: Boolean,
      default: () => props$j.image.fade
    },
    // 只支持网络资源，只对微信小程序有效
    webp: {
      type: Boolean,
      default: () => props$j.image.webp
    },
    // 过渡时间，单位ms
    duration: {
      type: [String, Number],
      default: () => props$j.image.duration
    },
    // 背景颜色，用于深色页面加载图片时，为了和背景色融合
    bgColor: {
      type: String,
      default: () => props$j.image.bgColor
    }
  }
});
const props$7 = defineMixin({
  props: {
    // 标题
    title: {
      type: [String, Number],
      default: () => props$j.cell.title
    },
    // 标题下方的描述信息
    label: {
      type: [String, Number],
      default: () => props$j.cell.label
    },
    // 右侧的内容
    value: {
      type: [String, Number],
      default: () => props$j.cell.value
    },
    // 左侧图标名称，或者图片链接(本地文件建议使用绝对地址)
    icon: {
      type: String,
      default: () => props$j.cell.icon
    },
    // 是否禁用cell
    disabled: {
      type: Boolean,
      default: () => props$j.cell.disabled
    },
    // 是否显示下边框
    border: {
      type: Boolean,
      default: () => props$j.cell.border
    },
    // 内容是否垂直居中(主要是针对右侧的value部分)
    center: {
      type: Boolean,
      default: () => props$j.cell.center
    },
    // 点击后跳转的URL地址
    url: {
      type: String,
      default: () => props$j.cell.url
    },
    // 链接跳转的方式，内部使用的是uView封装的route方法，可能会进行拦截操作
    linkType: {
      type: String,
      default: () => props$j.cell.linkType
    },
    // 是否开启点击反馈(表现为点击时加上灰色背景)
    clickable: {
      type: Boolean,
      default: () => props$j.cell.clickable
    },
    // 是否展示右侧箭头并开启点击反馈
    isLink: {
      type: Boolean,
      default: () => props$j.cell.isLink
    },
    // 是否显示表单状态下的必填星号(此组件可能会内嵌入input组件)
    required: {
      type: Boolean,
      default: () => props$j.cell.required
    },
    // 右侧的图标箭头
    rightIcon: {
      type: String,
      default: () => props$j.cell.rightIcon
    },
    // 右侧箭头的方向，可选值为：left，up，down
    arrowDirection: {
      type: String,
      default: () => props$j.cell.arrowDirection
    },
    // 左侧图标样式
    iconStyle: {
      type: [Object, String],
      default: () => {
        return props$j.cell.iconStyle;
      }
    },
    // 右侧箭头图标的样式
    rightIconStyle: {
      type: [Object, String],
      default: () => {
        return props$j.cell.rightIconStyle;
      }
    },
    // 标题的样式
    titleStyle: {
      type: [Object, String],
      default: () => {
        return props$j.cell.titleStyle;
      }
    },
    // 单位元的大小，可选值为large
    size: {
      type: String,
      default: () => props$j.cell.size
    },
    // 点击cell是否阻止事件传播
    stop: {
      type: Boolean,
      default: () => props$j.cell.stop
    },
    // 标识符，cell被点击时返回
    name: {
      type: [Number, String],
      default: () => props$j.cell.name
    }
  }
});
const icons = {
  "uicon-level": "",
  "uicon-column-line": "",
  "uicon-checkbox-mark": "",
  "uicon-folder": "",
  "uicon-movie": "",
  "uicon-star-fill": "",
  "uicon-star": "",
  "uicon-phone-fill": "",
  "uicon-phone": "",
  "uicon-apple-fill": "",
  "uicon-chrome-circle-fill": "",
  "uicon-backspace": "",
  "uicon-attach": "",
  "uicon-cut": "",
  "uicon-empty-car": "",
  "uicon-empty-coupon": "",
  "uicon-empty-address": "",
  "uicon-empty-favor": "",
  "uicon-empty-permission": "",
  "uicon-empty-news": "",
  "uicon-empty-search": "",
  "uicon-github-circle-fill": "",
  "uicon-rmb": "",
  "uicon-person-delete-fill": "",
  "uicon-reload": "",
  "uicon-order": "",
  "uicon-server-man": "",
  "uicon-search": "",
  "uicon-fingerprint": "",
  "uicon-more-dot-fill": "",
  "uicon-scan": "",
  "uicon-share-square": "",
  "uicon-map": "",
  "uicon-map-fill": "",
  "uicon-tags": "",
  "uicon-tags-fill": "",
  "uicon-bookmark-fill": "",
  "uicon-bookmark": "",
  "uicon-eye": "",
  "uicon-eye-fill": "",
  "uicon-mic": "",
  "uicon-mic-off": "",
  "uicon-calendar": "",
  "uicon-calendar-fill": "",
  "uicon-trash": "",
  "uicon-trash-fill": "",
  "uicon-play-left": "",
  "uicon-play-right": "",
  "uicon-minus": "",
  "uicon-plus": "",
  "uicon-info": "",
  "uicon-info-circle": "",
  "uicon-info-circle-fill": "",
  "uicon-question": "",
  "uicon-error": "",
  "uicon-close": "",
  "uicon-checkmark": "",
  "uicon-android-circle-fill": "",
  "uicon-android-fill": "",
  "uicon-ie": "",
  "uicon-IE-circle-fill": "",
  "uicon-google": "",
  "uicon-google-circle-fill": "",
  "uicon-setting-fill": "",
  "uicon-setting": "",
  "uicon-minus-square-fill": "",
  "uicon-plus-square-fill": "",
  "uicon-heart": "",
  "uicon-heart-fill": "",
  "uicon-camera": "",
  "uicon-camera-fill": "",
  "uicon-more-circle": "",
  "uicon-more-circle-fill": "",
  "uicon-chat": "",
  "uicon-chat-fill": "",
  "uicon-bag-fill": "",
  "uicon-bag": "",
  "uicon-error-circle-fill": "",
  "uicon-error-circle": "",
  "uicon-close-circle": "",
  "uicon-close-circle-fill": "",
  "uicon-checkmark-circle": "",
  "uicon-checkmark-circle-fill": "",
  "uicon-question-circle-fill": "",
  "uicon-question-circle": "",
  "uicon-share": "",
  "uicon-share-fill": "",
  "uicon-shopping-cart": "",
  "uicon-shopping-cart-fill": "",
  "uicon-bell": "",
  "uicon-bell-fill": "",
  "uicon-list": "",
  "uicon-list-dot": "",
  "uicon-zhihu": "",
  "uicon-zhihu-circle-fill": "",
  "uicon-zhifubao": "",
  "uicon-zhifubao-circle-fill": "",
  "uicon-weixin-circle-fill": "",
  "uicon-weixin-fill": "",
  "uicon-twitter-circle-fill": "",
  "uicon-twitter": "",
  "uicon-taobao-circle-fill": "",
  "uicon-taobao": "",
  "uicon-weibo-circle-fill": "",
  "uicon-weibo": "",
  "uicon-qq-fill": "",
  "uicon-qq-circle-fill": "",
  "uicon-moments-circel-fill": "",
  "uicon-moments": "",
  "uicon-qzone": "",
  "uicon-qzone-circle-fill": "",
  "uicon-baidu-circle-fill": "",
  "uicon-baidu": "",
  "uicon-facebook-circle-fill": "",
  "uicon-facebook": "",
  "uicon-car": "",
  "uicon-car-fill": "",
  "uicon-warning-fill": "",
  "uicon-warning": "",
  "uicon-clock-fill": "",
  "uicon-clock": "",
  "uicon-edit-pen": "",
  "uicon-edit-pen-fill": "",
  "uicon-email": "",
  "uicon-email-fill": "",
  "uicon-minus-circle": "",
  "uicon-minus-circle-fill": "",
  "uicon-plus-circle": "",
  "uicon-plus-circle-fill": "",
  "uicon-file-text": "",
  "uicon-file-text-fill": "",
  "uicon-pushpin": "",
  "uicon-pushpin-fill": "",
  "uicon-grid": "",
  "uicon-grid-fill": "",
  "uicon-play-circle": "",
  "uicon-play-circle-fill": "",
  "uicon-pause-circle-fill": "",
  "uicon-pause": "",
  "uicon-pause-circle": "",
  "uicon-eye-off": "",
  "uicon-eye-off-outline": "",
  "uicon-gift-fill": "",
  "uicon-gift": "",
  "uicon-rmb-circle-fill": "",
  "uicon-rmb-circle": "",
  "uicon-kefu-ermai": "",
  "uicon-server-fill": "",
  "uicon-coupon-fill": "",
  "uicon-coupon": "",
  "uicon-integral": "",
  "uicon-integral-fill": "",
  "uicon-home-fill": "",
  "uicon-home": "",
  "uicon-hourglass-half-fill": "",
  "uicon-hourglass": "",
  "uicon-account": "",
  "uicon-plus-people-fill": "",
  "uicon-minus-people-fill": "",
  "uicon-account-fill": "",
  "uicon-thumb-down-fill": "",
  "uicon-thumb-down": "",
  "uicon-thumb-up": "",
  "uicon-thumb-up-fill": "",
  "uicon-lock-fill": "",
  "uicon-lock-open": "",
  "uicon-lock-opened-fill": "",
  "uicon-lock": "",
  "uicon-red-packet-fill": "",
  "uicon-photo-fill": "",
  "uicon-photo": "",
  "uicon-volume-off-fill": "",
  "uicon-volume-off": "",
  "uicon-volume-fill": "",
  "uicon-volume": "",
  "uicon-red-packet": "",
  "uicon-download": "",
  "uicon-arrow-up-fill": "",
  "uicon-arrow-down-fill": "",
  "uicon-play-left-fill": "",
  "uicon-play-right-fill": "",
  "uicon-rewind-left-fill": "",
  "uicon-rewind-right-fill": "",
  "uicon-arrow-downward": "",
  "uicon-arrow-leftward": "",
  "uicon-arrow-rightward": "",
  "uicon-arrow-upward": "",
  "uicon-arrow-down": "",
  "uicon-arrow-right": "",
  "uicon-arrow-left": "",
  "uicon-arrow-up": "",
  "uicon-skip-back-left": "",
  "uicon-skip-forward-right": "",
  "uicon-rewind-right": "",
  "uicon-rewind-left": "",
  "uicon-arrow-right-double": "",
  "uicon-arrow-left-double": "",
  "uicon-wifi-off": "",
  "uicon-wifi": "",
  "uicon-empty-data": "",
  "uicon-empty-history": "",
  "uicon-empty-list": "",
  "uicon-empty-page": "",
  "uicon-empty-order": "",
  "uicon-empty-wifi": "",
  "uicon-man": "",
  "uicon-woman": "",
  "uicon-man-add": "",
  "uicon-man-add-fill": "",
  "uicon-man-delete": "",
  "uicon-man-delete-fill": "",
  "uicon-zh": "",
  "uicon-en": ""
};
const props$6 = defineMixin({
  props: {
    // 图标类名
    name: {
      type: String,
      default: () => props$j.icon.name
    },
    // 图标颜色，可接受主题色
    color: {
      type: String,
      default: () => props$j.icon.color
    },
    // 字体大小，单位px
    size: {
      type: [String, Number],
      default: () => props$j.icon.size
    },
    // 是否显示粗体
    bold: {
      type: Boolean,
      default: () => props$j.icon.bold
    },
    // 点击图标的时候传递事件出去的index（用于区分点击了哪一个）
    index: {
      type: [String, Number],
      default: () => props$j.icon.index
    },
    // 触摸图标时的类名
    hoverClass: {
      type: String,
      default: () => props$j.icon.hoverClass
    },
    // 自定义扩展前缀，方便用户扩展自己的图标库
    customPrefix: {
      type: String,
      default: () => props$j.icon.customPrefix
    },
    // 图标右边或者下面的文字
    label: {
      type: [String, Number],
      default: () => props$j.icon.label
    },
    // label的位置，只能右边或者下边
    labelPos: {
      type: String,
      default: () => props$j.icon.labelPos
    },
    // label的大小
    labelSize: {
      type: [String, Number],
      default: () => props$j.icon.labelSize
    },
    // label的颜色
    labelColor: {
      type: String,
      default: () => props$j.icon.labelColor
    },
    // label与图标的距离
    space: {
      type: [String, Number],
      default: () => props$j.icon.space
    },
    // 图片的mode
    imgMode: {
      type: String,
      default: () => props$j.icon.imgMode
    },
    // 用于显示图片小图标时，图片的宽度
    width: {
      type: [String, Number],
      default: () => props$j.icon.width
    },
    // 用于显示图片小图标时，图片的高度
    height: {
      type: [String, Number],
      default: () => props$j.icon.height
    },
    // 用于解决某些情况下，让图标垂直居中的用途
    top: {
      type: [String, Number],
      default: () => props$j.icon.top
    },
    // 是否阻止事件传播
    stop: {
      type: Boolean,
      default: () => props$j.icon.stop
    }
  }
});
const props$5 = defineMixin({
  props: {
    // 分组标题
    title: {
      type: String,
      default: () => props$j.cellGroup.title
    },
    // 是否显示外边框
    border: {
      type: Boolean,
      default: () => props$j.cellGroup.border
    }
  }
});
const props$4 = defineMixin({
  props: {
    // 是否展示组件
    show: {
      type: Boolean,
      default: () => props$j.transition.show
    },
    // 使用的动画模式
    mode: {
      type: String,
      default: () => props$j.transition.mode
    },
    // 动画的执行时间，单位ms
    duration: {
      type: [String, Number],
      default: () => props$j.transition.duration
    },
    // 使用的动画过渡函数
    timingFunction: {
      type: String,
      default: () => props$j.transition.timingFunction
    }
  }
});
const getClassNames = (name) => ({
  enter: `u-${name}-enter u-${name}-enter-active`,
  "enter-to": `u-${name}-enter-to u-${name}-enter-active`,
  leave: `u-${name}-leave u-${name}-leave-active`,
  "leave-to": `u-${name}-leave-to u-${name}-leave-active`
});
const transitionMixin = {
  methods: {
    // 组件被点击发出事件
    clickHandler() {
      this.$emit("click");
    },
    // vue版本的组件进场处理
    async vueEnter() {
      const classNames = getClassNames(this.mode);
      this.status = "enter";
      this.$emit("beforeEnter");
      this.inited = true;
      this.display = true;
      this.classes = classNames.enter;
      await nextTick$1();
      {
        await sleep(20);
        this.$emit("enter");
        this.transitionEnded = false;
        this.$emit("afterEnter");
        this.classes = classNames["enter-to"];
      }
    },
    // 动画离场处理
    async vueLeave() {
      if (!this.display)
        return;
      const classNames = getClassNames(this.mode);
      this.status = "leave";
      this.$emit("beforeLeave");
      this.classes = classNames.leave;
      await nextTick$1();
      {
        this.transitionEnded = false;
        this.$emit("leave");
        setTimeout(this.onTransitionEnd, this.duration);
        this.classes = classNames["leave-to"];
      }
    },
    // 完成过渡后触发
    onTransitionEnd() {
      if (this.transitionEnded)
        return;
      this.transitionEnded = true;
      this.$emit(this.status === "leave" ? "afterLeave" : "afterEnter");
      if (!this.show && this.display) {
        this.display = false;
        this.inited = false;
      }
    }
  }
};
const props$3 = defineMixin({
  props: {
    bgColor: {
      type: String,
      default: () => props$j.statusBar.bgColor
    },
    // 状态栏获取得高度
    height: {
      type: Number,
      default: () => props$j.statusBar.height
    }
  }
});
const props$2 = defineMixin({
  props: {}
});
const props$1 = defineMixin({
  props: {
    // 绑定的值
    modelValue: {
      type: [String, Number],
      default: () => props$j.input.value
    },
    // number-数字输入键盘，app-vue下可以输入浮点数，app-nvue和小程序平台下只能输入整数
    // idcard-身份证输入键盘，微信、支付宝、百度、QQ小程序
    // digit-带小数点的数字键盘，App的nvue页面、微信、支付宝、百度、头条、QQ小程序
    // text-文本输入键盘
    type: {
      type: String,
      default: () => props$j.input.type
    },
    // 如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true，
    // 兼容性：微信小程序、百度小程序、字节跳动小程序、QQ小程序
    fixed: {
      type: Boolean,
      default: () => props$j.input.fixed
    },
    // 是否禁用输入框
    disabled: {
      type: Boolean,
      default: () => props$j.input.disabled
    },
    // 禁用状态时的背景色
    disabledColor: {
      type: String,
      default: () => props$j.input.disabledColor
    },
    // 是否显示清除控件
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否仅在聚焦时显示清除控件
    onlyClearableOnFocused: {
      type: Boolean,
      default: true
    },
    // 是否密码类型
    password: {
      type: Boolean,
      default: () => props$j.input.password
    },
    // 最大输入长度，设置为 -1 的时候不限制最大长度
    maxlength: {
      type: [String, Number],
      default: () => props$j.input.maxlength
    },
    // 	输入框为空时的占位符
    placeholder: {
      type: String,
      default: () => props$j.input.placeholder
    },
    // 指定placeholder的样式类，注意页面或组件的style中写了scoped时，需要在类名前写/deep/
    placeholderClass: {
      type: String,
      default: () => props$j.input.placeholderClass
    },
    // 指定placeholder的样式
    placeholderStyle: {
      type: [String, Object],
      default: () => props$j.input.placeholderStyle
    },
    // 是否显示输入字数统计，只在 type ="text"或type ="textarea"时有效
    showWordLimit: {
      type: Boolean,
      default: () => props$j.input.showWordLimit
    },
    // 设置右下角按钮的文字，有效值：send|search|next|go|done，兼容性详见uni-app文档
    // https://uniapp.dcloud.io/component/input
    // https://uniapp.dcloud.io/component/textarea
    confirmType: {
      type: String,
      default: () => props$j.input.confirmType
    },
    // 点击键盘右下角按钮时是否保持键盘不收起，H5无效
    confirmHold: {
      type: Boolean,
      default: () => props$j.input.confirmHold
    },
    // focus时，点击页面的时候不收起键盘，微信小程序有效
    holdKeyboard: {
      type: Boolean,
      default: () => props$j.input.holdKeyboard
    },
    // 自动获取焦点
    // 在 H5 平台能否聚焦以及软键盘是否跟随弹出，取决于当前浏览器本身的实现。nvue 页面不支持，需使用组件的 focus()、blur() 方法控制焦点
    focus: {
      type: Boolean,
      default: () => props$j.input.focus
    },
    // 键盘收起时，是否自动失去焦点，目前仅App3.0.0+有效
    autoBlur: {
      type: Boolean,
      default: () => props$j.input.autoBlur
    },
    // 是否去掉 iOS 下的默认内边距，仅微信小程序，且type=textarea时有效
    disableDefaultPadding: {
      type: Boolean,
      default: () => props$j.input.disableDefaultPadding
    },
    // 指定focus时光标的位置
    cursor: {
      type: [String, Number],
      default: () => props$j.input.cursor
    },
    // 输入框聚焦时底部与键盘的距离
    cursorSpacing: {
      type: [String, Number],
      default: () => props$j.input.cursorSpacing
    },
    // 光标起始位置，自动聚集时有效，需与selection-end搭配使用
    selectionStart: {
      type: [String, Number],
      default: () => props$j.input.selectionStart
    },
    // 光标结束位置，自动聚集时有效，需与selection-start搭配使用
    selectionEnd: {
      type: [String, Number],
      default: () => props$j.input.selectionEnd
    },
    // 键盘弹起时，是否自动上推页面
    adjustPosition: {
      type: Boolean,
      default: () => props$j.input.adjustPosition
    },
    // 输入框内容对齐方式，可选值为：left|center|right
    inputAlign: {
      type: String,
      default: () => props$j.input.inputAlign
    },
    // 输入框字体的大小
    fontSize: {
      type: [String, Number],
      default: () => props$j.input.fontSize
    },
    // 输入框字体颜色
    color: {
      type: String,
      default: () => props$j.input.color
    },
    // 输入框前置图标
    prefixIcon: {
      type: String,
      default: () => props$j.input.prefixIcon
    },
    // 前置图标样式，对象或字符串
    prefixIconStyle: {
      type: [String, Object],
      default: () => props$j.input.prefixIconStyle
    },
    // 输入框后置图标
    suffixIcon: {
      type: String,
      default: () => props$j.input.suffixIcon
    },
    // 后置图标样式，对象或字符串
    suffixIconStyle: {
      type: [String, Object],
      default: () => props$j.input.suffixIconStyle
    },
    // 边框类型，surround-四周边框，bottom-底部边框，none-无边框
    border: {
      type: String,
      default: () => props$j.input.border
    },
    // 是否只读，与disabled不同之处在于disabled会置灰组件，而readonly则不会
    readonly: {
      type: Boolean,
      default: () => props$j.input.readonly
    },
    // 输入框形状，circle-圆形，square-方形
    shape: {
      type: String,
      default: () => props$j.input.shape
    },
    // 用于处理或者过滤输入框内容的方法
    formatter: {
      type: [Function, null],
      default: () => props$j.input.formatter
    },
    // 是否忽略组件内对文本合成系统事件的处理
    ignoreCompositionEvent: {
      type: Boolean,
      default: true
    },
    // 光标颜色
    cursorColor: {
      type: String,
      default: () => props$j.input.cursorColor
    },
    // 密码类型可见性切换
    passwordVisibilityToggle: {
      type: Boolean,
      default: () => props$j.input.passwordVisibilityToggle
    }
  }
});
const props = defineMixin({
  props: {
    // 输入框的内容
    value: {
      type: [String, Number],
      default: () => props$j.textarea.value
    },
    // 输入框的内容
    modelValue: {
      type: [String, Number],
      default: () => props$j.textarea.value
    },
    // 输入框为空时占位符
    placeholder: {
      type: [String, Number],
      default: () => props$j.textarea.placeholder
    },
    // 指定placeholder的样式类，注意页面或组件的style中写了scoped时，需要在类名前写/deep/
    placeholderClass: {
      type: String,
      default: () => props$j.textarea.placeholderClass
    },
    // 指定placeholder的样式
    placeholderStyle: {
      type: [String, Object],
      default: () => props$j.textarea.placeholderStyle
    },
    // 输入框高度
    height: {
      type: [String, Number],
      default: () => props$j.textarea.height
    },
    // 设置键盘右下角按钮的文字，仅微信小程序，App-vue和H5有效
    confirmType: {
      type: String,
      default: () => props$j.textarea.confirmType
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: () => props$j.textarea.disabled
    },
    // 是否显示统计字数
    count: {
      type: Boolean,
      default: () => props$j.textarea.count
    },
    // 是否自动获取焦点，nvue不支持，H5取决于浏览器的实现
    focus: {
      type: Boolean,
      default: () => props$j.textarea.focus
    },
    // 是否自动增加高度
    autoHeight: {
      type: Boolean,
      default: () => props$j.textarea.autoHeight
    },
    // 如果textarea是在一个position:fixed的区域，需要显示指定属性fixed为true
    fixed: {
      type: Boolean,
      default: () => props$j.textarea.fixed
    },
    // 指定光标与键盘的距离
    cursorSpacing: {
      type: Number,
      default: () => props$j.textarea.cursorSpacing
    },
    // 指定focus时的光标位置
    cursor: {
      type: [String, Number],
      default: () => props$j.textarea.cursor
    },
    // 是否显示键盘上方带有”完成“按钮那一栏，
    showConfirmBar: {
      type: Boolean,
      default: () => props$j.textarea.showConfirmBar
    },
    // 光标起始位置，自动聚焦时有效，需与selection-end搭配使用
    selectionStart: {
      type: Number,
      default: () => props$j.textarea.selectionStart
    },
    // 光标结束位置，自动聚焦时有效，需与selection-start搭配使用
    selectionEnd: {
      type: Number,
      default: () => props$j.textarea.selectionEnd
    },
    // 键盘弹起时，是否自动上推页面
    adjustPosition: {
      type: Boolean,
      default: () => props$j.textarea.adjustPosition
    },
    // 是否去掉 iOS 下的默认内边距，只微信小程序有效
    disableDefaultPadding: {
      type: Boolean,
      default: () => props$j.textarea.disableDefaultPadding
    },
    // focus时，点击页面的时候不收起键盘，只微信小程序有效
    holdKeyboard: {
      type: Boolean,
      default: () => props$j.textarea.holdKeyboard
    },
    // 最大输入长度，设置为 -1 的时候不限制最大长度
    maxlength: {
      type: [String, Number],
      default: () => props$j.textarea.maxlength
    },
    // 边框类型，surround-四周边框，bottom-底部边框
    border: {
      type: String,
      default: () => props$j.textarea.border
    },
    // 用于处理或者过滤输入框内容的方法
    formatter: {
      type: [Function, null],
      default: () => props$j.textarea.formatter
    },
    // 是否忽略组件内对文本合成系统事件的处理
    ignoreCompositionEvent: {
      type: Boolean,
      default: true
    }
  }
});
exports._easycom_u_modal = _easycom_u_modal;
exports._easycom_u_toast = _easycom_u_toast;
exports._export_sfc = _export_sfc;
exports._r = _r;
exports.addStyle = addStyle;
exports.addUnit = addUnit;
exports.buttonMixin = buttonMixin;
exports.colorGradient = colorGradient;
exports.computed = computed;
exports.config = config;
exports.createSSRApp = createSSRApp;
exports.deepMerge = deepMerge$1;
exports.e = e;
exports.f = f$1;
exports.fontUtil = fontUtil;
exports.formValidate = formValidate;
exports.genLightColor = genLightColor;
exports.getThemeVar = getThemeVar;
exports.getWindowInfo = getWindowInfo;
exports.icons = icons;
exports.index = index$1;
exports.initVueI18n = initVueI18n;
exports.mixin = mixin;
exports.mpMixin = mpMixin;
exports.n = n$1;
exports.o = o$1;
exports.onHide = onHide;
exports.onLaunch = onLaunch;
exports.onLoad = onLoad;
exports.onShow = onShow;
exports.openType = openType;
exports.p = p$1;
exports.pagesJson = pagesJson;
exports.props = props$h;
exports.props$1 = props$g;
exports.props$10 = props$7;
exports.props$11 = props$6;
exports.props$12 = props$5;
exports.props$13 = props$4;
exports.props$14 = props$3;
exports.props$15 = props$2;
exports.props$16 = props$1;
exports.props$17 = props;
exports.props$2 = props$f;
exports.props$3 = props$e;
exports.props$4 = props$d;
exports.props$5 = props$c;
exports.props$6 = props$b;
exports.props$7 = props$a;
exports.props$8 = props$9;
exports.props$9 = props$8;
exports.reactive = reactive;
exports.ref = ref;
exports.resolveComponent = resolveComponent;
exports.s = s$1;
exports.sleep = sleep;
exports.sr = sr$1;
exports.t = t$2;
exports.t$1 = t$1;
exports.test = test;
exports.throttle = throttle;
exports.transitionMixin = transitionMixin;
exports.unref = unref;
exports.uviewPlus = uviewPlus;
exports.wx$1 = wx$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map
