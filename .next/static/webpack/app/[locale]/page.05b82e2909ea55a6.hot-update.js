"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/[locale]/page",{

/***/ "(app-pages-browser)/./src/components/molecules/book-carousel-item.tsx":
/*!*********************************************************!*\
  !*** ./src/components/molecules/book-carousel-item.tsx ***!
  \*********************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BookCarouselItem: function() { return /* binding */ BookCarouselItem; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/image */ \"(app-pages-browser)/./node_modules/next/dist/api/image.js\");\n/* harmony import */ var _download_menubar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./download-menubar */ \"(app-pages-browser)/./src/components/molecules/download-menubar.tsx\");\n/* harmony import */ var _atoms_country_flag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../atoms/country-flag */ \"(app-pages-browser)/./src/components/atoms/country-flag.tsx\");\n\n\n\n\nfunction BookCarouselItem(param) {\n    let { key, bookSrc, code, value } = param;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex flex-col text-primary gap-4\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_image__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n                src: \"/book-covers/\".concat(bookSrc),\n                alt: \"Book of \".concat(value, \" cover\"),\n                width: 233,\n                height: 327,\n                className: \"rounded-xl transition-all duration-500 ease-in-out cursor-pointer\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\book-carousel-item.tsx\",\n                lineNumber: 19,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex gap-3\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                        children: \"value:\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\book-carousel-item.tsx\",\n                        lineNumber: 27,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"flex gap-2\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_atoms_country_flag__WEBPACK_IMPORTED_MODULE_3__.CountryFlag, {\n                                countryCode: code\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\book-carousel-item.tsx\",\n                                lineNumber: 29,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                children: value\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\book-carousel-item.tsx\",\n                                lineNumber: 30,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\book-carousel-item.tsx\",\n                        lineNumber: 28,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\book-carousel-item.tsx\",\n                lineNumber: 26,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_download_menubar__WEBPACK_IMPORTED_MODULE_2__.DownloadMenubar, {\n                buttonStyle: \"secondary\",\n                selectedLanguage: {\n                    label: value,\n                    value: value\n                }\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\book-carousel-item.tsx\",\n                lineNumber: 33,\n                columnNumber: 7\n            }, this)\n        ]\n    }, key, true, {\n        fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\book-carousel-item.tsx\",\n        lineNumber: 18,\n        columnNumber: 5\n    }, this);\n}\n_c = BookCarouselItem;\nvar _c;\n$RefreshReg$(_c, \"BookCarouselItem\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL21vbGVjdWxlcy9ib29rLWNhcm91c2VsLWl0ZW0udHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUErQjtBQUNzQjtBQUNEO0FBUTdDLFNBQVNHLGlCQUFpQixLQUtiO1FBTGEsRUFDL0JDLEdBQUcsRUFDSEMsT0FBTyxFQUNQQyxJQUFJLEVBQ0pDLEtBQUssRUFDYSxHQUxhO0lBTS9CLHFCQUNFLDhEQUFDQztRQUFjQyxXQUFVOzswQkFDdkIsOERBQUNULGtEQUFLQTtnQkFDSlUsS0FBSyxnQkFBd0IsT0FBUkw7Z0JBQ3JCTSxLQUFLLFdBQWlCLE9BQU5KLE9BQU07Z0JBQ3RCSyxPQUFPO2dCQUNQQyxRQUFRO2dCQUNSSixXQUFVOzs7Ozs7MEJBRVosOERBQUNEO2dCQUFJQyxXQUFVOztrQ0FDYiw4REFBQ0s7a0NBQUU7Ozs7OztrQ0FDSCw4REFBQ047d0JBQUlDLFdBQVU7OzBDQUNiLDhEQUFDUCw0REFBV0E7Z0NBQUNhLGFBQWFUOzs7Ozs7MENBQzFCLDhEQUFDUTswQ0FBR1A7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFHUiw4REFBQ04sOERBQWVBO2dCQUNkZSxhQUFZO2dCQUNaQyxrQkFBa0I7b0JBQUVDLE9BQU9YO29CQUFPQSxPQUFPQTtnQkFBTTs7Ozs7OztPQWpCekNIOzs7OztBQXFCZDtLQTVCZ0JEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9jb21wb25lbnRzL21vbGVjdWxlcy9ib29rLWNhcm91c2VsLWl0ZW0udHN4P2M5MGUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEltYWdlIGZyb20gXCJuZXh0L2ltYWdlXCI7XHJcbmltcG9ydCB7IERvd25sb2FkTWVudWJhciB9IGZyb20gXCIuL2Rvd25sb2FkLW1lbnViYXJcIjtcclxuaW1wb3J0IHsgQ291bnRyeUZsYWcgfSBmcm9tIFwiLi4vYXRvbXMvY291bnRyeS1mbGFnXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIGlCb29rQ2Fyb3VzZWxJdGVtIHtcclxuICBrZXk6IG51bWJlcjtcclxuICBib29rU3JjOiBzdHJpbmc7XHJcbiAgdmFsdWU6IHN0cmluZztcclxuICBjb2RlOiBzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIEJvb2tDYXJvdXNlbEl0ZW0oe1xyXG4gIGtleSxcclxuICBib29rU3JjLFxyXG4gIGNvZGUsXHJcbiAgdmFsdWUsXHJcbn06IGlCb29rQ2Fyb3VzZWxJdGVtKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYga2V5PXtrZXl9IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgdGV4dC1wcmltYXJ5IGdhcC00XCI+XHJcbiAgICAgIDxJbWFnZVxyXG4gICAgICAgIHNyYz17YC9ib29rLWNvdmVycy8ke2Jvb2tTcmN9YH1cclxuICAgICAgICBhbHQ9e2BCb29rIG9mICR7dmFsdWV9IGNvdmVyYH1cclxuICAgICAgICB3aWR0aD17MjMzfVxyXG4gICAgICAgIGhlaWdodD17MzI3fVxyXG4gICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQteGwgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNTAwIGVhc2UtaW4tb3V0IGN1cnNvci1wb2ludGVyXCJcclxuICAgICAgLz5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0zXCI+XHJcbiAgICAgICAgPHA+dmFsdWU6PC9wPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMlwiPlxyXG4gICAgICAgICAgPENvdW50cnlGbGFnIGNvdW50cnlDb2RlPXtjb2RlfSAvPlxyXG4gICAgICAgICAgPHA+e3ZhbHVlfTwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxEb3dubG9hZE1lbnViYXJcclxuICAgICAgICBidXR0b25TdHlsZT1cInNlY29uZGFyeVwiXHJcbiAgICAgICAgc2VsZWN0ZWRMYW5ndWFnZT17eyBsYWJlbDogdmFsdWUsIHZhbHVlOiB2YWx1ZSB9fVxyXG4gICAgICAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiSW1hZ2UiLCJEb3dubG9hZE1lbnViYXIiLCJDb3VudHJ5RmxhZyIsIkJvb2tDYXJvdXNlbEl0ZW0iLCJrZXkiLCJib29rU3JjIiwiY29kZSIsInZhbHVlIiwiZGl2IiwiY2xhc3NOYW1lIiwic3JjIiwiYWx0Iiwid2lkdGgiLCJoZWlnaHQiLCJwIiwiY291bnRyeUNvZGUiLCJidXR0b25TdHlsZSIsInNlbGVjdGVkTGFuZ3VhZ2UiLCJsYWJlbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/molecules/book-carousel-item.tsx\n"));

/***/ })

});