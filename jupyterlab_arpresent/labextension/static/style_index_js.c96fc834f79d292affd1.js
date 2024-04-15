"use strict";
(self["webpackChunkjupyterlab_arpresent"] = self["webpackChunkjupyterlab_arpresent"] || []).push([["style_index_js"],{

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./style/index.js":
/*!************************!*\
  !*** ./style/index.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.css */ "./style/base.css");



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./style/base.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/base.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #263238;
  color: white;
}

h1,
h2,
h3,
h4,
h5 {
  font-weight: normal;
} */

header {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

form {
  max-width: 450px;
  margin: 30px auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 40%);
  border-radius: 8px;
  padding: 20px;
}

input {
  display: block;
  width: 100%;
  border-radius: 8px;
  border: 2px solid transparent;
  height: 34px;
  padding: 5px;
  background: #e6eaec;
  color: inherit;
  font-family: inherit;
}

input::placeholder {
  color: #837c7c;
}

.join-form-input {
  margin-bottom: 20px;
}

.input-container {
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.btn-primary {
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 6px 14px;
  background-color: #1565c0;
  color: white;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
}

form h2,
.conference-section h2 {
  margin-bottom: 20px;
}

.btn-danger {
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 6px 14px;
  background-color: #f44336;
  color: white;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
}

/* TODO: don't need this */
.conference-section {
  padding: 20px 30px;
  max-width: 960px;
  margin: 0 auto;
}

.main-grid-container {
  width: auto;
  padding: 2rem 6rem;
}

.main-grid-view {
  display: flex;
  flex: 1 1 0;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: auto 1rem;
  flex-wrap: wrap;
  gap: 3rem;
}

.overflow {
  overflow-y: auto;
}

/* .conference-section h2 {
  text-align: center;
  font-size: 32px;
  padding-bottom: 10px;
  border-bottom: 1px solid #546e7a;
} */

.main-grid-container h2 {
  text-align: center;
  font-size: 32px;
  padding-bottom: 10px;
  border-bottom: 1px solid #546e7a;
}

.peers-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(min-content, 1fr));
  place-items: center;
  grid-gap: 10px;
}

.peer-tile {
  position: relative;
}

.peer-hand-raised-icon {
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 2rem;
  right: 2rem;
  fill: #f37726;
}

.peer-video {
  height: 250px;
  width: 250px;
  border-radius: 8px;
  object-fit: cover;
  z-index: 0;
}

.local.peer-video {
  transform: scaleX(-1);
}

.peer-name {
  font-size: 14px;
  text-align: center;
}

.peer-container {
  padding: 10px;
}

.ar-video {
  width: 1280px;
  height: 720px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 10px;
  position: absolute;
  z-index: 0;
}

.ar-canvas {
  width: 250px;
  height: 250px;
  border-radius: 8px;
  object-fit: cover;
  position: absolute;
  z-index: 2;
}

.presentation-container {
  display: flex;
}

.presentation-video-container {
  flex: 0 0 80%;
}

.presentation-video {
  width: 100%;
  border-radius: 10%;
  object-fit: cover;
}

.peers-container-sidebar {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  height: 80%;
  justify-content: space-around;
  align-items: center;
}

.control-bar {
  display: flex;
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 15px;
  justify-content: center;
  z-index: 10;
}

.control-bar > *:not(:first-child) {
  margin-left: 8px;
}

.btn-control {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid #37474f;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  text-align: center;
  background-color: #607d8b;
  box-shadow: 0 0 10px rgba(0, 0, 0, 40%);
  color: whitesmoke;
  cursor: pointer;
}

.hide {
  display: none;
}

.separator {
  font-size: 12px;
}

.sidebar-widget .sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-widget .sidebar-description {
  width: 100%;
  border-bottom: var(--jp-border-width) solid var(--jp-border-color2);
  padding: 1em;
  flex-grow: 0;
}

.sidebar-widget .sidebar-list {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: start;
  gap: 10px;
  height: 100%;
}

.sidebar-widget .sidebar-list .model-list-item {
  width: 100%;
  justify-content: left;
  text-transform: capitalize;
}

.sidebar-widget .sidebar-list .model-list-item:disabled {
  color: var(--jp-ui-font-color3);
}

.model-list-item-selected {
  font-weight: bold;
  background-color: var(--jp-layout-color2) !important;
}

.sidebar-widget .sidebar-parent {
  height: 100%;
}

.sidebar-widget .sidebar-buttons {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  flex-grow: 0;
  border-bottom: var(--jp-border-width) solid var(--jp-border-color2);
  border-top: var(--jp-border-width) solid var(--jp-border-color2);
}

.presenter-container-main {
  display: flex;
  padding: 4rem;
  gap: 6rem;
  background-origin: padding-box;
}

.presenter-container {
  flex: 1 1 0;
}

.presenter-video {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.peer-sidepane-list {
  display: flex;
  flex-direction: column;
  flex: 0 1 0;
}

.peer-hand-raised {
  outline: thick solid #f37726;
}

.icon {
  scale: 0.8;
  fill: whitesmoke;
}

@keyframes breathe {
  0% {
    transform: scale(0.7);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.7);
    opacity: 0.8;
  }
}

.icon-breathe {
  animation: breathe 3s infinite alternate;
  fill: #f37726;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  animation: spin 3s linear infinite;
  height: 1rem;
  width: 1rem;
}
`, "",{"version":3,"sources":["webpack://./style/base.css"],"names":[],"mappings":"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","sourcesContent":["/* * {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,\n    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  background-color: #263238;\n  color: white;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5 {\n  font-weight: normal;\n} */\n\nheader {\n  padding: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\nform {\n  max-width: 450px;\n  margin: 30px auto;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 40%);\n  border-radius: 8px;\n  padding: 20px;\n}\n\ninput {\n  display: block;\n  width: 100%;\n  border-radius: 8px;\n  border: 2px solid transparent;\n  height: 34px;\n  padding: 5px;\n  background: #e6eaec;\n  color: inherit;\n  font-family: inherit;\n}\n\ninput::placeholder {\n  color: #837c7c;\n}\n\n.join-form-input {\n  margin-bottom: 20px;\n}\n\n.input-container {\n  margin-bottom: 20px;\n  display: flex;\n  align-items: baseline;\n  gap: 5px;\n}\n\n.btn-primary {\n  border: 1px solid transparent;\n  border-radius: 4px;\n  padding: 6px 14px;\n  background-color: #1565c0;\n  color: white;\n  font-family: inherit;\n  font-size: 14px;\n  cursor: pointer;\n}\n\nform h2,\n.conference-section h2 {\n  margin-bottom: 20px;\n}\n\n.btn-danger {\n  border: 1px solid transparent;\n  border-radius: 4px;\n  padding: 6px 14px;\n  background-color: #f44336;\n  color: white;\n  font-family: inherit;\n  font-size: 14px;\n  cursor: pointer;\n}\n\n/* TODO: don't need this */\n.conference-section {\n  padding: 20px 30px;\n  max-width: 960px;\n  margin: 0 auto;\n}\n\n.main-grid-container {\n  width: auto;\n  padding: 2rem 6rem;\n}\n\n.main-grid-view {\n  display: flex;\n  flex: 1 1 0;\n  justify-content: center;\n  height: 100%;\n  width: 100%;\n  margin: auto 1rem;\n  flex-wrap: wrap;\n  gap: 3rem;\n}\n\n.overflow {\n  overflow-y: auto;\n}\n\n/* .conference-section h2 {\n  text-align: center;\n  font-size: 32px;\n  padding-bottom: 10px;\n  border-bottom: 1px solid #546e7a;\n} */\n\n.main-grid-container h2 {\n  text-align: center;\n  font-size: 32px;\n  padding-bottom: 10px;\n  border-bottom: 1px solid #546e7a;\n}\n\n.peers-container {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(min-content, 1fr));\n  place-items: center;\n  grid-gap: 10px;\n}\n\n.peer-tile {\n  position: relative;\n}\n\n.peer-hand-raised-icon {\n  width: 2rem;\n  height: 2rem;\n  position: absolute;\n  top: 2rem;\n  right: 2rem;\n  fill: #f37726;\n}\n\n.peer-video {\n  height: 250px;\n  width: 250px;\n  border-radius: 8px;\n  object-fit: cover;\n  z-index: 0;\n}\n\n.local.peer-video {\n  transform: scaleX(-1);\n}\n\n.peer-name {\n  font-size: 14px;\n  text-align: center;\n}\n\n.peer-container {\n  padding: 10px;\n}\n\n.ar-video {\n  width: 1280px;\n  height: 720px;\n  border-radius: 8px;\n  object-fit: cover;\n  margin-bottom: 10px;\n  position: absolute;\n  z-index: 0;\n}\n\n.ar-canvas {\n  width: 250px;\n  height: 250px;\n  border-radius: 8px;\n  object-fit: cover;\n  position: absolute;\n  z-index: 2;\n}\n\n.presentation-container {\n  display: flex;\n}\n\n.presentation-video-container {\n  flex: 0 0 80%;\n}\n\n.presentation-video {\n  width: 100%;\n  border-radius: 10%;\n  object-fit: cover;\n}\n\n.peers-container-sidebar {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  gap: 10px;\n  height: 80%;\n  justify-content: space-around;\n  align-items: center;\n}\n\n.control-bar {\n  display: flex;\n  position: sticky;\n  bottom: 0;\n  width: 100%;\n  padding: 15px;\n  justify-content: center;\n  z-index: 10;\n}\n\n.control-bar > *:not(:first-child) {\n  margin-left: 8px;\n}\n\n.btn-control {\n  font-size: 12px;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  border: 2px solid #37474f;\n  width: 64px;\n  height: 64px;\n  border-radius: 50%;\n  text-align: center;\n  background-color: #607d8b;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 40%);\n  color: whitesmoke;\n  cursor: pointer;\n}\n\n.hide {\n  display: none;\n}\n\n.separator {\n  font-size: 12px;\n}\n\n.sidebar-widget .sidebar-container {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.sidebar-widget .sidebar-description {\n  width: 100%;\n  border-bottom: var(--jp-border-width) solid var(--jp-border-color2);\n  padding: 1em;\n  flex-grow: 0;\n}\n\n.sidebar-widget .sidebar-list {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  align-items: start;\n  gap: 10px;\n  height: 100%;\n}\n\n.sidebar-widget .sidebar-list .model-list-item {\n  width: 100%;\n  justify-content: left;\n  text-transform: capitalize;\n}\n\n.sidebar-widget .sidebar-list .model-list-item:disabled {\n  color: var(--jp-ui-font-color3);\n}\n\n.model-list-item-selected {\n  font-weight: bold;\n  background-color: var(--jp-layout-color2) !important;\n}\n\n.sidebar-widget .sidebar-parent {\n  height: 100%;\n}\n\n.sidebar-widget .sidebar-buttons {\n  display: flex;\n  gap: 1rem;\n  padding: 0.5rem;\n  flex-grow: 0;\n  border-bottom: var(--jp-border-width) solid var(--jp-border-color2);\n  border-top: var(--jp-border-width) solid var(--jp-border-color2);\n}\n\n.presenter-container-main {\n  display: flex;\n  padding: 4rem;\n  gap: 6rem;\n  background-origin: padding-box;\n}\n\n.presenter-container {\n  flex: 1 1 0;\n}\n\n.presenter-video {\n  width: 100%;\n  height: 100%;\n  border-radius: 8px;\n}\n\n.peer-sidepane-list {\n  display: flex;\n  flex-direction: column;\n  flex: 0 1 0;\n}\n\n.peer-hand-raised {\n  outline: thick solid #f37726;\n}\n\n.icon {\n  scale: 0.8;\n  fill: whitesmoke;\n}\n\n@keyframes breathe {\n  0% {\n    transform: scale(0.7);\n    opacity: 0.8;\n  }\n  50% {\n    transform: scale(1.1);\n    opacity: 1;\n  }\n  100% {\n    transform: scale(0.7);\n    opacity: 0.8;\n  }\n}\n\n.icon-breathe {\n  animation: breathe 3s infinite alternate;\n  fill: #f37726;\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n.spinner {\n  animation: spin 3s linear infinite;\n  height: 1rem;\n  width: 1rem;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./style/base.css":
/*!************************!*\
  !*** ./style/base.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./base.css */ "./node_modules/css-loader/dist/cjs.js!./style/base.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ })

}]);
//# sourceMappingURL=style_index_js.c96fc834f79d292affd1.js.map