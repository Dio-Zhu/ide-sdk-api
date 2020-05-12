import EventHelper from "../EventHelper";

/**
 * 设置当前属性的值
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     value    //属性的值
 * }
 */
export function setValue(options){
  let {iframeId,value} = options;
  if(!iframeId)return;
  let eventName = "imd.setValue@"+iframeId;
  let eventData = value;
  EventHelper.request({eventName,eventData});
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
export function getValue(options){
  let {iframeId,callback} = options;
  if(!iframeId)return;
  let eventName = "imd.getValue@"+iframeId;
  let callbackName = "imd.value@"+iframeId;
  EventHelper.request({eventName,callbackName,callback});
}

/**
 *  关闭弹出窗口
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 * }
 */
export function close(options){
  let {iframeId} = options;
  if(!iframeId)return;
  let eventName = "imd.close@"+iframeId;
  EventHelper.request({eventName});
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
export function getContext(options){
  let {iframeId,callback} = options;
  if(!iframeId)return;
  let eventName = "imd.getContext@"+iframeId;
  let callbackName = "imd.context@"+iframeId;
  EventHelper.request({eventName,callbackName,callback});
}

/**
 * 更新弹窗的配置信息
 * @param {object} options
 * {
 *      caption:''       //弹窗的标题
 * }
 */
export function updateConfig(options){
  let {iframeId,...otherOptions} = options;
  if(!iframeId)return;
  let eventName = "imd.updateConfig@"+iframeId;
  let eventData = otherOptions;
  EventHelper.request({eventName,eventData});
}

/**
 *  当窗口被打开时触发
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     callback:function(eventData,eventContext){}//获取返回结果的回调
 * }
 */
export function onOpen(options) {
  let {iframeId,callback} = options;
  if(!iframeId)return;
  let eventName = 'imd.clickOpen@'+iframeId;
  EventHelper.listen({eventName,callback});
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
export function onCancel(options) {
  let {iframeId,callback} = options;
  if(!iframeId)return;
  let eventName = 'imd.clickCancel@'+iframeId;
  EventHelper.listen({eventName,callback});
}

/**
 *  当窗口"确认"按钮被点击时触发
 * @param {object} options
 * {
 *     iframeId，//必须参数，对应注册的iframeId值
 *     callback:function(eventData,eventContext){}//获取返回结果的回调
 * }
 */
export function onOk(options) {
  let {iframeId,callback} = options;
  if(!iframeId)return;
  let eventName = 'imd.clickOk@'+iframeId;
  EventHelper.listen({eventName,callback});
}
