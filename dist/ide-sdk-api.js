(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["IdeSdkApi"] = factory();
	else
		root["IdeSdkApi"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _MessageHelper = __webpack_require__(1);

var _MessageHelper2 = _interopRequireDefault(_MessageHelper);

var _MessageDefines = __webpack_require__(2);

var _MessageDefines2 = _interopRequireDefault(_MessageDefines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _EVENT_INPUT_CALLBACKS = {};
var _EVENT_OUTPUT_CALLBACKS = {};
var _EVENT_QUEUE = {};

var EventHelper = {
    uuid: function uuid() {
        return new Date().getTime() + "_" + Math.round(Math.random() * 1000);
    },

    //发送事件给内部窗口
    sendEventIn: function sendEventIn(options) {
        var iframeId = options.iframeId,
            eventName = options.eventName,
            eventData = options.eventData,
            eventContext = options.eventContext;

        if (!eventName) return;
        var message = {};
        message.type = _MessageDefines2.default.EVENT_OUTPUT; //注意：相对设计器而言是往外部输出事件
        message.eventName = eventName;
        if (eventData !== undefined) message.eventData = eventData;
        if (eventContext !== undefined) message.eventContext = eventContext;
        return _MessageHelper2.default.sendMessageIn(iframeId, message);
    },

    //发送事件给外部窗口
    sendEventOut: function sendEventOut(options) {
        var eventName = options.eventName,
            eventData = options.eventData,
            eventContext = options.eventContext;

        if (!eventName) return;
        var message = {};
        message.type = _MessageDefines2.default.EVENT_INPUT; //注意：相对设计器而言是外部输入事件
        message.eventName = eventName;
        if (eventData !== undefined && eventData !== null) message.eventData = eventData;
        if (eventContext !== undefined && eventContext !== null) message.eventContext = eventContext;
        return _MessageHelper2.default.sendMessageOut(message);
    },

    //维持事件的监听
    keep: function keep() {
        _MessageHelper2.default.keepMessage(); //保障消息通道正常
        // MessageHelper.addMessageListen(MessageDefines.EVENT_INPUT,EventHelper._receiveInputEventMessage);//监听输入类型事件
        _MessageHelper2.default.addMessageListen(_MessageDefines2.default.EVENT_OUTPUT, EventHelper._receiveOutputEventMessage); //监听输出类型事件
    },

    //请求事件(内部向外部发送)
    request: function request(options) {
        var eventName = options.eventName,
            eventData = options.eventData,
            eventContext = options.eventContext,
            callbackName = options.callbackName,
            callback = options.callback;

        if (!eventName) return;
        EventHelper.keep();
        var _queueId = EventHelper.uuid();
        if (callbackName) {
            //存在回调事件名则绑定回调事件监听
            EventHelper._pushQueue(_queueId, callback);
            EventHelper._addEventListen(callbackName + "." + _queueId, function (eventDataOut, eventContextOut) {
                var _ref = eventContextOut || {},
                    _queueId = _ref._queueId;

                var queueCallback = EventHelper._popQueue(_queueId);
                typeof queueCallback == 'function' && queueCallback(eventDataOut, eventContextOut);
                EventHelper._removeEventListen(callbackName + "." + _queueId, "output");
            }, "output");
        }
        EventHelper.sendEventOut({
            eventName: eventName,
            eventData: eventData,
            eventContext: Object.assign({}, eventContext, { _queueId: _queueId })
        });
    },

    //响应事件(外部向内部发送)
    response: function response(options) {
        var eventName = options.eventName,
            eventData = options.eventData,
            eventContext = options.eventContext;

        EventHelper.sendEventIn({ eventName: eventName, eventData: eventData, eventContext: eventContext });
    },

    //监听事件
    listen: function listen(options) {
        var eventName = options.eventName,
            callback = options.callback;

        EventHelper.keep();
        EventHelper._addEventListen(eventName, callback, "output");
    },

    //取消监听事件
    unlisten: function unlisten(options) {
        var eventName = options.eventName;

        EventHelper._removeEventListen(eventName, "output");
    },

    //添加事件的监听
    _addEventListen: function _addEventListen(eventName, callback, inputOrOutput) {
        if (!eventName) return;
        switch (inputOrOutput) {
            case "input":
                _EVENT_INPUT_CALLBACKS[eventName] = callback;
                break;
            case "output":
                _EVENT_OUTPUT_CALLBACKS[eventName] = callback;
                break;
        }
    },

    //移除事件的监听(支持多事件名)
    _removeEventListen: function _removeEventListen(eventNames, inputOrOutput) {
        if (Array.isArray(eventNames) && eventNames.length > 0) {
            //移除多个事件
            for (var i in eventNames) {
                switch (inputOrOutput) {
                    case "input":
                        delete _EVENT_INPUT_CALLBACKS[eventNames[i]];
                        break;
                    case "output":
                        delete _EVENT_OUTPUT_CALLBACKS[eventNames[i]];
                        break;
                }
            }
        } else {
            //移除单个事件
            switch (inputOrOutput) {
                case "input":
                    delete _EVENT_INPUT_CALLBACKS[eventNames];
                    break;
                case "output":
                    delete _EVENT_OUTPUT_CALLBACKS[eventNames];
                    break;
            }
        }
    },

    //接收事件消息的回调
    _receiveInputEventMessage: function _receiveInputEventMessage(message) {
        if (!message && !message.eventName) return;
        if (message.type !== _MessageDefines2.default.EVENT_INPUT) return;
        var eventCallback = _EVENT_INPUT_CALLBACKS[message.eventName];
        if (typeof eventCallback == 'function') {
            try {
                eventCallback(message.eventData, message.eventContext);
            } catch (err) {
                console.error('处理事件消息失败', err);
            }
        }
    },

    //接收事件消息的回调
    _receiveOutputEventMessage: function _receiveOutputEventMessage(message) {
        if (!message && !message.eventName) return;
        if (message.type !== _MessageDefines2.default.EVENT_OUTPUT) return;

        var _ref2 = message.eventContext || {},
            _queueId = _ref2._queueId;

        var eventCallback = null;
        if (_queueId) {
            //有队列ID则取对应队列下的事件回调函数
            eventCallback = _EVENT_OUTPUT_CALLBACKS[message.eventName + '.' + _queueId];
        };
        if (!eventCallback) {
            //队列回调函数不存在则取对应事件回调函数
            eventCallback = _EVENT_OUTPUT_CALLBACKS[message.eventName];
        }
        if (typeof eventCallback == 'function') {
            try {
                eventCallback(message.eventData, message.eventContext);
            } catch (err) {
                console.error('处理事件消息失败', err);
            }
        }
    },

    //入队列
    _pushQueue: function _pushQueue(queueId, callback) {
        _EVENT_QUEUE[queueId] = callback;
    },

    //出队列
    _popQueue: function _popQueue(queueId) {
        var callback = _EVENT_QUEUE[queueId];
        delete _EVENT_QUEUE[queueId];
        return callback;
    }
};
exports.default = EventHelper;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var _LISTEN_CALLBACKS = {}; //监听的回调堆栈
var MessageHelper = {
    //获取Iframe的窗口
    getIframeWindow: function getIframeWindow(iframeId) {
        var ifr = document.getElementById(iframeId);
        return ifr ? ifr.contentWindow : null;
    },

    //发送消息给内部窗口
    sendMessageIn: function sendMessageIn(iframeId, message) {
        if (!message || !iframeId) return;
        var iframeWindow = MessageHelper.getIframeWindow(iframeId);
        if (iframeWindow) {
            console.log('[消息>>>发送]' + iframeId, message);
            iframeWindow.postMessage(JSON.stringify(message), "*");
        }
        // else{
        //     console.log('[发送消息>>>]没有找到:'+iframeId,message);
        // }
        return true;
    },

    /**
     * 发送消息给外部窗口
     * @param message
     */
    sendMessageOut: function sendMessageOut(message) {
        window.parent.postMessage(JSON.stringify(message), "*");
    },

    //注册监听回调
    addMessageListen: function addMessageListen(listenName, callback) {
        _LISTEN_CALLBACKS[listenName] = callback;
    },

    //注销监听回调
    removeMessageListen: function removeMessageListen(listenName) {
        delete _LISTEN_CALLBACKS[listenName];
    },

    //获取监听回调
    getMessageListen: function getMessageListen(listenName) {
        return _LISTEN_CALLBACKS[listenName];
    },

    //消息监听开启
    startMessage: function startMessage() {
        MessageHelper.stopMessage();
        if (window.addEventListener) {
            window.addEventListener('message', MessageHelper._receiveMessage);
        } else {
            window.attachEvent('message', MessageHelper._receiveMessage);
        }
        MessageHelper._isMessageKeep_ = true;
    },

    //消息监听关闭
    stopMessage: function stopMessage() {
        if (window.removeEventListener) {
            window.removeEventListener('message', MessageHelper._receiveMessage);
        } else {
            window.detachEvent('message', MessageHelper._receiveMessage);
        }
        delete MessageHelper._isMessageKeep_;
    },

    //消息监听维持
    keepMessage: function keepMessage() {
        if (!MessageHelper._isMessageKeep_) {
            MessageHelper.startMessage();
        }
    },

    //接收消息的回调
    _receiveMessage: function _receiveMessage(event) {
        if (event && event.data && typeof event.data == 'string') {
            console.log("[消息>>>接收]", event);
            try {
                var data = JSON.parse(event.data);
                var callback = MessageHelper.getMessageListen(data.type);
                if (typeof callback == 'function') {
                    try {
                        callback(data);
                    } catch (err) {
                        console.error('处理消息失败', err);
                    }
                }
            } catch (e) {}
        }
    }
};
exports.default = MessageHelper;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var MessageDefines = {
    //------通用事件监听消息类型-------
    EVENT_INPUT: "ide.event.in",

    //------通用事件发送消息类型-------
    EVENT_OUTPUT: "ide.event.out",

    //------内部iframe的事件监听----
    LISTEN_DOCUMENT_CLICK: "ide.document.click", //document.click监听
    LISTEN_KEYDOWN_ESC: "ide.keydown.esc", //ESC键监听

    //------自定义面板消息类型(发送)-------
    MESSAGE_PANE_DATA: "pane.data@",
    MESSAGE_PANE_CONTEXT: "pane.context@",
    MESSAGE_PANE_SHOW: "pane.show@",
    MESSAGE_PANE_HIDE: "pane.hide@",

    //------自定义面板消息类型(接收)-------
    LISTEN_PANE_GET_DATA: "pane.getData@",
    LISTEN_PANE_GET_CONTEXT: "pane.getContext@",
    LISTEN_PANE_UPDATE_DATA: "pane.updateData@",

    //------DragAndDrop监听消息类型-------
    LISTEN_DND_LOADED: "ide.dnd.loaded",
    LISTEN_DND_CHOOSED: "ide.dnd.elementChoosed",
    LISTEN_DND_UNCHOOSED: "ide.dnd.elementUnChoosed",
    LISTEN_DND_INSERT: "ide.dnd.elementInsert",
    LISTEN_DND_MOVE: "ide.dnd.elementMove",
    LISTEN_DND_REMOVE: "ide.dnd.elementRemove",
    LISTEN_DND_DRAG_START: "ide.dnd.elementStart",
    LISTEN_DND_DRAG_STOP: "ide.dnd.elementStop",
    LISTEN_DND_BUTTON_CLICK: "ide.dnd.buttonClick",

    //------DragAndDrop发送消息类型-------
    MESSAGE_DND_INIT: "ide.dnd.init",
    MESSAGE_DND_CHOOSE: "ide.dnd.choose",
    MESSAGE_DND_UNCHOOSE: "ide.dnd.unChoose",
    MESSAGE_DND_DRAG_START: "ide.dnd.dragStart",
    MESSAGE_DND_DRAG_STOP: "ide.dnd.dragStop"
};

exports.default = MessageDefines;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _common = __webpack_require__(4);

var common = _interopRequireWildcard(_common);

var _modal = __webpack_require__(5);

var modal = _interopRequireWildcard(_modal);

var _iframemodal = __webpack_require__(6);

var iframemodal = _interopRequireWildcard(_iframemodal);

var _iframepane = __webpack_require__(8);

var iframepane = _interopRequireWildcard(_iframepane);

var _dragdrop = __webpack_require__(9);

var dragdrop = _interopRequireWildcard(_dragdrop);

var _EventHelper = __webpack_require__(0);

var _EventHelper2 = _interopRequireDefault(_EventHelper);

var _MessageHelper = __webpack_require__(1);

var _MessageHelper2 = _interopRequireDefault(_MessageHelper);

var _MessageDefines = __webpack_require__(2);

var _MessageDefines2 = _interopRequireDefault(_MessageDefines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = _extends({}, common, modal, {
  ifrPane: _extends({}, iframepane),
  ifrModal: _extends({}, iframemodal),
  dnd: _extends({}, dragdrop),
  EventHelper: _EventHelper2.default,
  MessageHelper: _MessageHelper2.default,
  MessageDefines: _MessageDefines2.default
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.alert = alert;
exports.updateTreeData = updateTreeData;
exports.getTreeData = getTreeData;
exports.getPanelState = getPanelState;
exports.setPanelState = setPanelState;
exports.confirmOpen = confirmOpen;
exports.confirmClose = confirmClose;
exports.onConfirmClose = onConfirmClose;
exports.getUIConfig = getUIConfig;

var _EventHelper = __webpack_require__(0);

var _EventHelper2 = _interopRequireDefault(_EventHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 给出信息提示
 * @param {object} options
 * {
 *  content   提示内容
 *  type  提示类型"info"(默认)|"success"|"error"|"warning"
 * }
 */
function alert(options) {
    var content = options.content,
        type = options.type;

    var eventName = "alert";
    var eventData = {
        type: type || "info",
        content: content
    };
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 全局更新视图树数据
 * @param {object} options
 * {
 *     treeData 必须参数，更新后的视图树数据
 *     clearFocus:false, //可选参数，默认false,是否清除画布拖拽选中状态的焦点框
 *     undoHistory:false,  //可选参数，默认false,是否将本次更新记录到撤销
 * }
 */
function updateTreeData(options) {
    var treeData = options.treeData,
        clearFocus = options.clearFocus,
        undoHistory = options.undoHistory;

    var eventName = "updateTreeData";
    var eventData = { treeData: treeData, clearFocus: clearFocus, undoHistory: undoHistory };
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 获取全局的视图树数据
 * @param {object} options
 * {
 *     msgId,               //唯一ID
 *     msgData,             //携带的参数
 *     callback:function(eventData,eventContext){  //获取返回结果的回调
 *         let {
 *              msgId,      //携带的唯一ID
 *              msgData,    //携带的附加信息
 *              treeData    //当前视图树数据
 *         } = eventData;
 *     }
 * }
 */
function getTreeData(options) {
    var msgId = options.msgId,
        msgData = options.msgData,
        callback = options.callback;

    var eventName = 'getTreeData';
    var eventData = { msgId: msgId, msgData: msgData };
    var callbackName = 'treeData';
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData, callbackName: callbackName, callback: callback });
}

/**
 * 获取全局的面板状态
 * @param {object} options
 * {
 *     callback:function(eventData,eventContext){  //获取返回结果的回调
 *         let {
 *              leftVisible, //左侧面板的显示状态
 *              rightVisible //右侧面板的显示状态
 *         } = eventData;
 *     }
 * }
 */
function getPanelState(options) {
    var callback = options.callback;

    var eventName = 'getPanelState';
    var eventData = null;
    var callbackName = 'panelState';
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData, callbackName: callbackName, callback: callback });
}

/**
 * 设置全局的面板状态
 * @param {object} options
 * {
 *     leftVisible:true,  //左侧面板的显示状态
 *     rightVisible:true  //右侧面板的显示状态
 * }
 */
function setPanelState(options) {
    var eventName = "setPanelState";
    var eventData = options;
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 打开全局确认框
 * @param {*} options
 *  {
 *   title:'',  //弹窗标题
 *   content:'', //提示内容
 * }
 */

function confirmOpen(options) {
    var eventName = "confirm.open";
    var eventData = options;
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 关闭确认提示框
 * @param {object} options //需要携带的参数
 */
function confirmClose(options) {
    var eventName = "confirm.close";
    var eventData = options;
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 当确认提示框关闭时触发
 * @param {object} options
 *{
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *          eventData = {
 *              clicktype: 'ok', //'ok'-点击确认、'cancel'-点击取消
 *              ... //confirmClose时传入的其它参数
 *          }
 *     }
 *}
 */
function onConfirmClose(options) {
    var callback = options.callback;

    var eventName = 'confirm.closed';
    _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

function getUIConfig(options) {
    var _ref = options || {},
        callback = _ref.callback,
        eventData = _ref.eventData;

    var eventName = "getUIConfig";
    var callbackName = "uiConfig";
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData, callbackName: callbackName, callback: callback });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModalContext = getModalContext;
exports.modalClose = modalClose;
exports.onModalClose = onModalClose;
exports.modalOpen = modalOpen;
exports.setModalConfig = setModalConfig;

var _EventHelper = __webpack_require__(0);

var _EventHelper2 = _interopRequireDefault(_EventHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 获取全局弹窗的上下文
 * @param {object} options
 * {
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *         let {
 *              tplNode, //当前选中数据节点
 *              tplTree, //当前视图数据树
 *              currApp, //当前应用信息
 *              currPage  //当前页面信息
 *         } = eventData;
 *     }
 * }
 */
function getModalContext(options) {
  var callback = options.callback;

  var eventName = "modal.getContext";
  var eventData = null;
  var eventContext = null;
  var callbackName = "modal.context";
  _EventHelper2.default.request({ eventName: eventName, eventData: eventData, eventContext: eventContext, callbackName: callbackName, callback: callback });
}

/**
 * 关闭全局弹窗
 * @param {object} options 需要携带的参数
 */
function modalClose(options) {
  var eventName = "modal.close";
  var eventData = options;
  _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}
/**
 * 当全局弹窗关闭时触发
 * @param {object} options
 *{
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *          //eventData为modalClose时传入的参数
 *     }
 *}
 */
function onModalClose(options) {
  var callback = options.callback;

  var eventName = 'modal.closed';
  _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}
/**
 * 打开全局弹窗
 * @param {object} options
 * {
 *  title:''            //弹窗标题
 *  url:''                      //弹窗加载的页面url
 *  iframeId: 'devIframeModal' //iframe的唯一id
 *  iframeWidth:'100%'
 *  iframeHeight:'100%'
 *  width:960           //弹窗宽度
 *  height:600          //弹窗高度
 *  bodyStyle:null      //弹窗内部区域样式
 *  modalContext:null //弹窗提供给iframe内部的上下文
 * }
 */
function modalOpen(options) {
  var eventName = "modal.open";
  var eventData = options;
  _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 设置全局弹窗的配置
 * @param {object} options
 * {
 *  title:''            //弹窗标题
 *  url:''                      //弹窗加载的页面url
 *  iframeId: 'devIframeModal' //iframe的唯一id
 *  iframeWidth:'100%'
 *  iframeHeight:'100%'
 *  width:960           //弹窗宽度
 *  height:600          //弹窗高度
 *  bodyStyle:null      //弹窗内部区域样式
 *  modalContext:null //弹窗提供给iframe内部的上下文
 * }
 */
function setModalConfig(options) {
  var eventName = "modal.setConfig";
  var eventData = options;
  _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setValue = setValue;
exports.getValue = getValue;
exports.close = close;
exports.open = open;
exports.getContext = getContext;
exports.updateConfig = updateConfig;
exports.onOpen = onOpen;
exports.onCancel = onCancel;
exports.onOk = onOk;

var _EventHelper = __webpack_require__(0);

var _EventHelper2 = _interopRequireDefault(_EventHelper);

var _ValidUtils = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * 设置当前属性的值
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     value    //属性的值
 * }
 */
function setValue(options) {
  var iframeId = options.iframeId,
      value = options.value;

  if (!(0, _ValidUtils.validRequied)('setValue', 'iframeId', iframeId)) return;
  var eventName = "imd.setValue@" + iframeId;
  var eventData = value;
  _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 获取当前属性值
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *         //eventData-当前属性值
 *     }
 * }
 */
function getValue(options) {
  var iframeId = options.iframeId,
      callback = options.callback;

  if (!(0, _ValidUtils.validRequied)('getValue', 'iframeId', iframeId)) return;
  var eventName = "imd.getValue@" + iframeId;
  var callbackName = "imd.value@" + iframeId;
  _EventHelper2.default.request({ eventName: eventName, callbackName: callbackName, callback: callback });
}

/**
 *  关闭弹出窗口
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 * }
 */
function close(options) {
  var iframeId = options.iframeId;

  if (!(0, _ValidUtils.validRequied)('close', 'iframeId', iframeId)) return;
  var eventName = "imd.close@" + iframeId;
  _EventHelper2.default.request({ eventName: eventName });
}

/**
 *  打开弹出窗口
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     openContext,//打开时需要携带给弹窗的上下文数据
 * }
 */
function open(options) {
  var iframeId = options.iframeId,
      openContext = options.openContext;

  if (!(0, _ValidUtils.validRequied)('open', 'iframeId', iframeId)) return;
  var eventName = "imd.open@" + iframeId;
  var eventData = { openContext: openContext };
  _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 *  获取当前窗口传递的上下文数据
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *        //eventData-上下文数据，即：MetaType.IframeModal里面配置的iframeContext的值
 *     }
 * }
 */
function getContext(options) {
  var iframeId = options.iframeId,
      callback = options.callback;

  if (!(0, _ValidUtils.validRequied)('getContext', 'iframeId', iframeId)) return;
  var eventName = "imd.getContext@" + iframeId;
  var callbackName = "imd.context@" + iframeId;
  _EventHelper2.default.request({ eventName: eventName, callbackName: callbackName, callback: callback });
}

/**
 * 更新弹窗的配置信息
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     caption:''       //弹窗的标题
 * }
 */
function updateConfig(options) {
  var iframeId = options.iframeId,
      otherOptions = _objectWithoutProperties(options, ["iframeId"]);

  if (!(0, _ValidUtils.validRequied)('updateConfig', 'iframeId', iframeId)) return;
  var eventName = "imd.updateConfig@" + iframeId;
  var eventData = otherOptions;
  _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 *  当窗口被打开时触发
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     callback:function(eventData,eventContext){}//获取返回结果的回调
 * }
 */
function onOpen(options) {
  var iframeId = options.iframeId,
      callback = options.callback;

  if (!(0, _ValidUtils.validRequied)('onOpen', 'iframeId', iframeId)) return;
  var eventName = 'imd.clickOpen@' + iframeId;
  _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

/**
 *  当窗口被取消关闭时触发
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     callback:function(eventData,eventContext){}//获取返回结果的回调
 *
 * }
 */
function onCancel(options) {
  var iframeId = options.iframeId,
      callback = options.callback;

  if (!(0, _ValidUtils.validRequied)('onCancel', 'iframeId', iframeId)) return;
  var eventName = 'imd.clickCancel@' + iframeId;
  _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

/**
 *  当窗口"确认"按钮被点击时触发
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     callback:function(eventData,eventContext){}//获取返回结果的回调
 * }
 */
function onOk(options) {
  var iframeId = options.iframeId,
      callback = options.callback;

  if (!(0, _ValidUtils.validRequied)('onOk', 'iframeId', iframeId)) return;
  var eventName = 'imd.clickOk@' + iframeId;
  _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validRequied = validRequied;
function validRequied(funcName, paramName, paramValue) {
    if (paramValue) {
        return true;
    } else {
        console.log("[IdeApi]参数校验失败，方法：" + funcName + "，缺少必要参数：" + paramName);
        return false;
    }
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = getData;
exports.getContext = getContext;
exports.updateData = updateData;
exports.onDataChange = onDataChange;
exports.onDeleteData = onDeleteData;
exports.onContextChange = onContextChange;
exports.onShow = onShow;
exports.onHide = onHide;

var _EventHelper = __webpack_require__(0);

var _EventHelper2 = _interopRequireDefault(_EventHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  获取当前元素的UI数据
 * @param {object} options
 *{
 *     paneKey，//必须参数，对应注册面板的key值
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *        let {
 *             tplTree:{},   //当前页面的数据
 *             tplNode:{}    //当前元素的数据
 *        } = eventData
 *     }
 *}
 */
function getData(options) {
  var paneKey = options.paneKey,
      callback = options.callback;

  if (!paneKey) return;
  var eventName = "pane.getData@" + paneKey;
  var callbackName = "pane.data@" + paneKey;
  _EventHelper2.default.request({ eventName: eventName, callbackName: callbackName, callback: callback });
}

/**
 *  获取当前上下文的信息
 * @param {object} options
 *{
 *     paneKey，//必须参数，对应注册面板的key值
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *        let {
 *            currApp:{}, //当前应用信息
 *            currPage:{} //当前页面信息
 *        } = eventData
 *     }
 *}
 */
function getContext(options) {
  var paneKey = options.paneKey,
      callback = options.callback;

  if (!paneKey) return;
  var eventName = "pane.getContext@" + paneKey;
  var callbackName = "pane.context@" + paneKey;
  _EventHelper2.default.request({ eventName: eventName, callbackName: callbackName, callback: callback });
}

/**
 *  更新当前元素的数据
 * @param {object} options
 *{
 *     paneKey，//必须参数，对应注册面板的key值
 *     tplNode:{}, //需要更新的当前节点数据
 *     undoHistory:false,  //可选，默认false,是否将本次更新记录到撤销历史
 *}
 */
function updateData(options) {
  var paneKey = options.paneKey,
      tplNode = options.tplNode,
      undoHistory = options.undoHistory;

  if (!paneKey) return;
  var eventName = "pane.updateData@" + paneKey;
  var eventData = { tplNode: tplNode, undoHistory: undoHistory };
  _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 *  当元素被切换/选中时会触发
 * @param {object} options
 *{
 *     paneKey，//必须参数，对应注册面板的key值
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *        let {
 *             tplTree:{},   //当前页面的数据
 *             tplNode:{}    //当前元素的数据
 *        } = eventData
 *}
 */
function onDataChange(options) {
  var paneKey = options.paneKey,
      callback = options.callback;

  if (!paneKey) return;
  var eventName = 'pane.data@' + paneKey;
  _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}
/**
 *  当元素被删除时会触发
 * @param {object} options
 *{
 *     paneKey，//必须参数，对应注册面板的key值
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *        let {
 *             tplTree:{}   //当前页面的数据
 *        } = eventData
 *}
 */
function onDeleteData(options) {
  var paneKey = options.paneKey,
      callback = options.callback;

  if (!paneKey) return;
  var eventName = 'pane.deleteData@' + paneKey;
  _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

/**
 *  当应用页面被切换/数据加载完成时会触发
 * @param {object} options
 *{
 *     paneKey，//必须参数，对应注册面板的key值
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *        let {
 *            currApp:{}, //当前应用信息
 *            currPage:{} //当前页面信息
 *        } = eventData
 *     }
 *}
 */
function onContextChange(options) {
  var paneKey = options.paneKey,
      callback = options.callback;

  if (!paneKey) return;
  var eventName = 'pane.context@' + paneKey;
  _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

/**
 * 当面板被显示时触发
 * @param {object} options
 *{
 *     paneKey，//必须参数，对应注册面板的key值
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *        let {
 *             tplTree:{},   //当前页面的数据
 *             tplNode:{}    //当前元素的数据
 *        } = eventData
 *     }
 *}
 */
function onShow(options) {
  var paneKey = options.paneKey,
      callback = options.callback;

  if (!paneKey) return;
  var eventName = 'pane.show@' + paneKey;
  _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

/**
 *  当面板被隐藏时触发
 * @param {object} options
 *{
 *     paneKey，//必须参数，对应注册面板的key值
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *        let {
 *             tplTree:{},   //当前页面的数据
 *             tplNode:{}    //当前元素的数据
 *        } = eventData
 *     }
 *}
 */
function onHide(options) {
  var paneKey = options.paneKey,
      callback = options.callback;

  if (!paneKey) return;
  var eventName = 'pane.hide@' + paneKey;
  _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getContextData = getContextData;
exports.canvasIsDragStart = canvasIsDragStart;
exports.canvasIsDragStop = canvasIsDragStop;
exports.dragStartToCanvas = dragStartToCanvas;
exports.dragStopToCanvas = dragStopToCanvas;
exports.onDragStartToCanvas = onDragStartToCanvas;
exports.onDragStopToCanvas = onDragStopToCanvas;
exports.selectNode = selectNode;
exports.unSelectNode = unSelectNode;
exports.insertNode = insertNode;
exports.moveNode = moveNode;
exports.deleteNode = deleteNode;
exports.onChooseNode = onChooseNode;
exports.onUnChooseNode = onUnChooseNode;
exports.buttonClick = buttonClick;

var _EventHelper = __webpack_require__(0);

var _EventHelper2 = _interopRequireDefault(_EventHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 获取当前上下文数据
 * 此方法在 画布 或自定义面板 中使用
 * @param options
 * {
 *     paneKey, //如果是在画布区域调用此方法，无需传递此参数，如果是在自定义面板里面调用此方法需要传递参数值为面板的key值。
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *          //eventData的内容说明，请参看：xxx
 *     }
 * }
 */
function getContextData(options) {
    var _ref = options || {},
        paneKey = _ref.paneKey,
        callback = _ref.callback;

    var eventName = paneKey ? "dnd.getContextData@" + paneKey : "dnd.getContextData";
    var eventData = null;
    var callbackName = paneKey ? "dnd.contextData@" + paneKey : "dnd.contextData";
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData, callbackName: callbackName, callback: callback });
}

/**
 * 在画布中抓取元素开始拖拽时，通过此方法通知画布以外区域，正在拖拽中。
 * 此方法在 画布 中使用
 * @param options
 */
function canvasIsDragStart(options) {
    var eventName = "dnd.canvasIsDragStart";
    var eventData = null;
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}
/**
 * 在画布中释放元素停止拖拽时，通过此方法通知画布以外区域，已停止拖拽。
 * 此方法在 画布 中使用
 * @param options
 */
function canvasIsDragStop(options) {
    var eventName = "dnd.canvasIsDragStop";
    var eventData = null;
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 在自定义面板中开始拖拽时，通过此方法通知画布区域。
 * 此方法在 自定义面板 中使用
 * @param options
 * {
 *     paneKey,     //必填，自定义面板的key值
 *     uiType,      //UI控件类型
 *     uiData       //UI控件数据
 *     modelType,   //模型类型
 *     modelData    //模型数据
 * }
 */
function dragStartToCanvas(options) {
    var _ref2 = options || {},
        paneKey = _ref2.paneKey,
        uiType = _ref2.uiType,
        uiData = _ref2.uiData,
        modelType = _ref2.modelType,
        modelData = _ref2.modelData;

    var eventName = "dnd.dragStartToCanvas@" + paneKey;
    var eventData = { uiType: uiType, uiData: uiData, modelType: modelType, modelData: modelData };
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 在自定义面板中停止拖拽时，通过此方法通知画布区域。
 * 此方法在 自定义面板 中使用
 * @param options
 * {
 *      paneKey//必填，自定义面板的key值
 * }
 */
function dragStopToCanvas(options) {
    var _ref3 = options || {},
        paneKey = _ref3.paneKey;

    var eventName = "dnd.dragStopToCanvas@" + paneKey;
    var eventData = null;
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 在画布中监听，自定义面板开始拖拽的事件。
 * 此方法在 画布 中使用
 * @param options
 * {
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *          //eventData的内容与dragStartToCanvas入参保持一致
 *     }
 * }
 */
function onDragStartToCanvas(options) {
    var _ref4 = options || {},
        callback = _ref4.callback;

    var eventName = 'dnd.onDragStartToCanvas';
    _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

/**
 * 在画布中监听，自定义面板停止拖拽的事件。
 * 此方法在 画布 中使用
 * @param options
 * {
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *              //无额外参数
 *     }
 * }
 */
function onDragStopToCanvas(options) {
    var _ref5 = options || {},
        callback = _ref5.callback;

    var eventName = 'dnd.onDragStopToCanvas';
    _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

/**
 * 在画布中操作层级结构，将指定节点设置为选中状态
 * 此方法在 画布 中使用
 * @param options
 * {
 *     nid //层级中的指定节点nid
 * }
 */
function selectNode(options) {
    var _ref6 = options || {},
        nid = _ref6.nid;

    var eventName = "dnd.selectNode";
    var eventData = { nid: nid };
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}
/**
 * 在画布中操作层级结构，将当前节点设置为取消选中状态
 * 此方法在 画布 中使用
 * @param options
 */
function unSelectNode(options) {
    var eventName = "dnd.unSelectNode";
    var eventData = null;
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 在画布中操作层级结构，插入指定节点
 * 此方法在 画布 中使用
 * @param options
 */
function insertNode(options) {
    var _ref7 = options || {},
        uiType = _ref7.uiType,
        _ref7$uiData = _ref7.uiData,
        uiData = _ref7$uiData === undefined ? {
        source: {}, //ui原始/初始化数据对象
        isPart: false //是否为部件ui
        // isExt:false  //是否为扩展ui
    } : _ref7$uiData,
        targetNid = _ref7.targetNid,
        targetParam = _ref7.targetParam,
        position = _ref7.position;

    var eventName = "dnd.insertNode";
    var eventData = {
        uiType: uiType, //ui类型标识
        uiData: uiData,
        targetNid: targetNid,
        targetParam: targetParam, //来自目标dom节点的uiparams属性的值
        position: position
    };
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}
/**
 * 在画布中操作层级结构，移动节点
 * 此方法在 画布 中使用
 * @param options
 */
function moveNode(options) {
    var _ref8 = options || {},
        nid = _ref8.nid,
        targetNid = _ref8.targetNid,
        targetParams = _ref8.targetParams,
        position = _ref8.position;

    var eventName = "dnd.moveNode";
    var eventData = {
        nid: nid,
        targetNid: targetNid,
        targetParams: targetParams, //来自目标dom节点的uiparams属性的值
        position: position
    };
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 在画布中操作层级结构，删除节点
 * 此方法在 画布 中使用
 * @param options
 * {
 *     nid //节点的nid
 * }
 */
function deleteNode(options) {
    var _ref9 = options || {},
        nid = _ref9.nid;

    var eventName = "dnd.deleteNode";
    var eventData = { nid: nid };
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/**
 * 在画布中监听，层级结构中的节点被选中时的事件。
 * 此方法在 画布 中使用
 * @param options
 * {
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *          let {
 *              nid //选中层级节点的nid
 *          } = eventData;
 *     }
 * }
 */
function onChooseNode(options) {
    var _ref10 = options || {},
        callback = _ref10.callback;

    var eventName = 'dnd.onChooseNode';
    _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

/**
 * 在画布中监听，层级结构中的节点被取消选中时的事件。
 * 此方法在 画布 中使用
 * @param options
 * {
 *     callback:function(eventData,eventContext){//获取返回结果的回调
 *
 *     }
 * }
 */
function onUnChooseNode(options) {
    var _ref11 = options || {},
        callback = _ref11.callback;

    var eventName = 'dnd.onUnChooseNode';
    _EventHelper2.default.listen({ eventName: eventName, callback: callback });
}

function buttonClick(options) {
    var _ref12 = options || {},
        nid = _ref12.nid,
        buttonKey = _ref12.buttonKey;

    var eventName = "dnd.buttonClick";
    var eventData = { nid: nid, buttonKey: buttonKey };
    _EventHelper2.default.request({ eventName: eventName, eventData: eventData });
}

/***/ })
/******/ ]);
});