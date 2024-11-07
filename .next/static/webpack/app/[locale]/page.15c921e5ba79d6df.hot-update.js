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

/***/ "(app-pages-browser)/./src/components/molecules/caroussel.tsx":
/*!************************************************!*\
  !*** ./src/components/molecules/caroussel.tsx ***!
  \************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Carousel; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _barrel_optimize_names_ChevronLeft_ChevronRight_lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! __barrel_optimize__?names=ChevronLeft,ChevronRight!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/chevron-left.js\");\n/* harmony import */ var _barrel_optimize_names_ChevronLeft_ChevronRight_lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! __barrel_optimize__?names=ChevronLeft,ChevronRight!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/chevron-right.js\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\nfunction Carousel(param) {\n    let { items, ItemComponent } = param;\n    _s();\n    const [visibleItems, setVisibleItems] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(4);\n    const [currentItems, setCurrentItems] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(items);\n    const updateVisibleItems = ()=>{\n        if (window.innerWidth < 640) {\n            setVisibleItems(1);\n        } else if (window.innerWidth < 900) {\n            setVisibleItems(2);\n        } else if (window.innerWidth < 1200) {\n            setVisibleItems(3);\n        } else {\n            setVisibleItems(4);\n        }\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        updateVisibleItems();\n        window.addEventListener(\"resize\", updateVisibleItems);\n        return ()=>window.removeEventListener(\"resize\", updateVisibleItems);\n    }, []);\n    const prevSlide = ()=>{\n        setCurrentItems((prevItems)=>{\n            const lastItem = prevItems.pop();\n            if (lastItem) {\n                return [\n                    lastItem,\n                    ...prevItems\n                ];\n            }\n            return prevItems;\n        });\n    };\n    const nextSlide = ()=>{\n        setCurrentItems((prevItems)=>{\n            const [firstItem, ...rest] = prevItems;\n            return [\n                ...rest,\n                firstItem\n            ];\n        });\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"relative flex flex-row justify-around items-center mx-auto w-full max-w-[1400px] p-10 gap-4\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                className: \"relative right-0 top-[-50px] flex items-center justify-center bg-deep_blue text-white p-2 rounded-full\",\n                onClick: prevSlide,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ChevronLeft_ChevronRight_lucide_react__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n                    className: \"text-gray-400 group-hover:text-white\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\caroussel.tsx\",\n                    lineNumber: 57,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\caroussel.tsx\",\n                lineNumber: 53,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex justify-evenly w-full gap-12\",\n                children: currentItems.slice(0, visibleItems).map((item, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ItemComponent, {\n                        bookSrc: item.bookSrc,\n                        value: item.value,\n                        code: item.code\n                    }, index, false, {\n                        fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\caroussel.tsx\",\n                        lineNumber: 61,\n                        columnNumber: 11\n                    }, this))\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\caroussel.tsx\",\n                lineNumber: 59,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                className: \"relative left-0 top-[-50px] flex items-center justify-center bg-deep_blue text-white p-2 rounded-full\",\n                onClick: nextSlide,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_ChevronLeft_ChevronRight_lucide_react__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                    className: \"text-gray-200 group-hover:text-white\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\caroussel.tsx\",\n                    lineNumber: 73,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\caroussel.tsx\",\n                lineNumber: 69,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\felip\\\\projects\\\\hetgroteconflict.nl\\\\src\\\\components\\\\molecules\\\\caroussel.tsx\",\n        lineNumber: 52,\n        columnNumber: 5\n    }, this);\n}\n_s(Carousel, \"ZwTZ/1fNe9nf1ebv7XRLNVxnZcE=\");\n_c = Carousel;\nvar _c;\n$RefreshReg$(_c, \"Carousel\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL21vbGVjdWxlcy9jYXJvdXNzZWwudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQzRDO0FBQ2E7QUFPMUMsU0FBU0ksU0FBWSxLQUdqQjtRQUhpQixFQUNsQ0MsS0FBSyxFQUNMQyxhQUFhLEVBQ0ksR0FIaUI7O0lBSWxDLE1BQU0sQ0FBQ0MsY0FBY0MsZ0JBQWdCLEdBQUdSLCtDQUFRQSxDQUFTO0lBQ3pELE1BQU0sQ0FBQ1MsY0FBY0MsZ0JBQWdCLEdBQUdWLCtDQUFRQSxDQUFNSztJQUV0RCxNQUFNTSxxQkFBcUI7UUFDekIsSUFBSUMsT0FBT0MsVUFBVSxHQUFHLEtBQUs7WUFDM0JMLGdCQUFnQjtRQUNsQixPQUFPLElBQUlJLE9BQU9DLFVBQVUsR0FBRyxLQUFLO1lBQ2xDTCxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJSSxPQUFPQyxVQUFVLEdBQUcsTUFBTTtZQUNuQ0wsZ0JBQWdCO1FBQ2xCLE9BQU87WUFDTEEsZ0JBQWdCO1FBQ2xCO0lBQ0Y7SUFFQVAsZ0RBQVNBLENBQUM7UUFDUlU7UUFDQUMsT0FBT0UsZ0JBQWdCLENBQUMsVUFBVUg7UUFDbEMsT0FBTyxJQUFNQyxPQUFPRyxtQkFBbUIsQ0FBQyxVQUFVSjtJQUNwRCxHQUFHLEVBQUU7SUFFTCxNQUFNSyxZQUFZO1FBQ2hCTixnQkFBZ0IsQ0FBQ087WUFDZixNQUFNQyxXQUFXRCxVQUFVRSxHQUFHO1lBQzlCLElBQUlELFVBQVU7Z0JBQ1osT0FBTztvQkFBQ0E7dUJBQWFEO2lCQUFVO1lBQ2pDO1lBQ0EsT0FBT0E7UUFDVDtJQUNGO0lBRUEsTUFBTUcsWUFBWTtRQUNoQlYsZ0JBQWdCLENBQUNPO1lBQ2YsTUFBTSxDQUFDSSxXQUFXLEdBQUdDLEtBQUssR0FBR0w7WUFDN0IsT0FBTzttQkFBSUs7Z0JBQU1EO2FBQVU7UUFDN0I7SUFDRjtJQUNBLHFCQUNFLDhEQUFDRTtRQUFJQyxXQUFVOzswQkFDYiw4REFBQ0M7Z0JBQ0NELFdBQVU7Z0JBQ1ZFLFNBQVNWOzBCQUVULDRFQUFDZCxvR0FBV0E7b0JBQUNzQixXQUFVOzs7Ozs7Ozs7OzswQkFFekIsOERBQUNEO2dCQUFJQyxXQUFVOzBCQUNaZixhQUFha0IsS0FBSyxDQUFDLEdBQUdwQixjQUFjcUIsR0FBRyxDQUFDLENBQUNDLE1BQU1DLHNCQUM5Qyw4REFBQ3hCO3dCQUVDeUIsU0FBU0YsS0FBS0UsT0FBTzt3QkFDckJDLE9BQU9ILEtBQUtHLEtBQUs7d0JBQ2pCQyxNQUFNSixLQUFLSSxJQUFJO3VCQUhWSDs7Ozs7Ozs7OzswQkFPWCw4REFBQ0w7Z0JBQ0NELFdBQVU7Z0JBQ1ZFLFNBQVNOOzBCQUVULDRFQUFDakIsb0dBQVlBO29CQUFDcUIsV0FBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJaEM7R0FuRXdCcEI7S0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2NvbXBvbmVudHMvbW9sZWN1bGVzL2Nhcm91c3NlbC50c3g/NGY5ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBjbGllbnRcIjtcclxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBDaGV2cm9uTGVmdCwgQ2hldnJvblJpZ2h0IH0gZnJvbSBcImx1Y2lkZS1yZWFjdFwiO1xyXG5cclxuaW50ZXJmYWNlIENhcm91c2VsUHJvcHM8VD4ge1xyXG4gIGl0ZW1zOiBUW107XHJcbiAgSXRlbUNvbXBvbmVudDogUmVhY3QuQ29tcG9uZW50VHlwZTxUPjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2Fyb3VzZWw8VD4oe1xyXG4gIGl0ZW1zLFxyXG4gIEl0ZW1Db21wb25lbnQsXHJcbn06IENhcm91c2VsUHJvcHM8VD4pOiBKU1guRWxlbWVudCB7XHJcbiAgY29uc3QgW3Zpc2libGVJdGVtcywgc2V0VmlzaWJsZUl0ZW1zXSA9IHVzZVN0YXRlPG51bWJlcj4oNCk7XHJcbiAgY29uc3QgW2N1cnJlbnRJdGVtcywgc2V0Q3VycmVudEl0ZW1zXSA9IHVzZVN0YXRlPFRbXT4oaXRlbXMpO1xyXG5cclxuICBjb25zdCB1cGRhdGVWaXNpYmxlSXRlbXMgPSAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCA2NDApIHtcclxuICAgICAgc2V0VmlzaWJsZUl0ZW1zKDEpO1xyXG4gICAgfSBlbHNlIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDkwMCkge1xyXG4gICAgICBzZXRWaXNpYmxlSXRlbXMoMik7XHJcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgMTIwMCkge1xyXG4gICAgICBzZXRWaXNpYmxlSXRlbXMoMyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZXRWaXNpYmxlSXRlbXMoNCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHVwZGF0ZVZpc2libGVJdGVtcygpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdXBkYXRlVmlzaWJsZUl0ZW1zKTtcclxuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB1cGRhdGVWaXNpYmxlSXRlbXMpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3QgcHJldlNsaWRlID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgc2V0Q3VycmVudEl0ZW1zKChwcmV2SXRlbXMpID0+IHtcclxuICAgICAgY29uc3QgbGFzdEl0ZW0gPSBwcmV2SXRlbXMucG9wKCk7XHJcbiAgICAgIGlmIChsYXN0SXRlbSkge1xyXG4gICAgICAgIHJldHVybiBbbGFzdEl0ZW0sIC4uLnByZXZJdGVtc107XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHByZXZJdGVtcztcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG5leHRTbGlkZSA9ICgpOiB2b2lkID0+IHtcclxuICAgIHNldEN1cnJlbnRJdGVtcygocHJldkl0ZW1zKSA9PiB7XHJcbiAgICAgIGNvbnN0IFtmaXJzdEl0ZW0sIC4uLnJlc3RdID0gcHJldkl0ZW1zO1xyXG4gICAgICByZXR1cm4gWy4uLnJlc3QsIGZpcnN0SXRlbV07XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGZsZXggZmxleC1yb3cganVzdGlmeS1hcm91bmQgaXRlbXMtY2VudGVyIG14LWF1dG8gdy1mdWxsIG1heC13LVsxNDAwcHhdIHAtMTAgZ2FwLTRcIj5cclxuICAgICAgPGJ1dHRvblxyXG4gICAgICAgIGNsYXNzTmFtZT1cInJlbGF0aXZlIHJpZ2h0LTAgdG9wLVstNTBweF0gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctZGVlcF9ibHVlIHRleHQtd2hpdGUgcC0yIHJvdW5kZWQtZnVsbFwiXHJcbiAgICAgICAgb25DbGljaz17cHJldlNsaWRlfVxyXG4gICAgICA+XHJcbiAgICAgICAgPENoZXZyb25MZWZ0IGNsYXNzTmFtZT1cInRleHQtZ3JheS00MDAgZ3JvdXAtaG92ZXI6dGV4dC13aGl0ZVwiIC8+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1ldmVubHkgdy1mdWxsIGdhcC0xMlwiPlxyXG4gICAgICAgIHtjdXJyZW50SXRlbXMuc2xpY2UoMCwgdmlzaWJsZUl0ZW1zKS5tYXAoKGl0ZW0sIGluZGV4KSA9PiAoXHJcbiAgICAgICAgICA8SXRlbUNvbXBvbmVudFxyXG4gICAgICAgICAgICBrZXk9e2luZGV4fVxyXG4gICAgICAgICAgICBib29rU3JjPXtpdGVtLmJvb2tTcmN9XHJcbiAgICAgICAgICAgIHZhbHVlPXtpdGVtLnZhbHVlfVxyXG4gICAgICAgICAgICBjb2RlPXtpdGVtLmNvZGV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICkpfVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGJ1dHRvblxyXG4gICAgICAgIGNsYXNzTmFtZT1cInJlbGF0aXZlIGxlZnQtMCB0b3AtWy01MHB4XSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiZy1kZWVwX2JsdWUgdGV4dC13aGl0ZSBwLTIgcm91bmRlZC1mdWxsXCJcclxuICAgICAgICBvbkNsaWNrPXtuZXh0U2xpZGV9XHJcbiAgICAgID5cclxuICAgICAgICA8Q2hldnJvblJpZ2h0IGNsYXNzTmFtZT1cInRleHQtZ3JheS0yMDAgZ3JvdXAtaG92ZXI6dGV4dC13aGl0ZVwiIC8+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJDaGV2cm9uTGVmdCIsIkNoZXZyb25SaWdodCIsIkNhcm91c2VsIiwiaXRlbXMiLCJJdGVtQ29tcG9uZW50IiwidmlzaWJsZUl0ZW1zIiwic2V0VmlzaWJsZUl0ZW1zIiwiY3VycmVudEl0ZW1zIiwic2V0Q3VycmVudEl0ZW1zIiwidXBkYXRlVmlzaWJsZUl0ZW1zIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicHJldlNsaWRlIiwicHJldkl0ZW1zIiwibGFzdEl0ZW0iLCJwb3AiLCJuZXh0U2xpZGUiLCJmaXJzdEl0ZW0iLCJyZXN0IiwiZGl2IiwiY2xhc3NOYW1lIiwiYnV0dG9uIiwib25DbGljayIsInNsaWNlIiwibWFwIiwiaXRlbSIsImluZGV4IiwiYm9va1NyYyIsInZhbHVlIiwiY29kZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/molecules/caroussel.tsx\n"));

/***/ })

});