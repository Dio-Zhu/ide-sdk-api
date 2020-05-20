import EventHelper from "../EventHelper";

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
export function getData(options){
  let {paneKey,callback} = options;
  if(!paneKey)return;
  let eventName = "pane.getData@"+paneKey;
  let callbackName = "pane.data@"+paneKey;
  EventHelper.request({eventName,callbackName,callback});
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
export function getContext(options){
  let {paneKey,callback} = options;
  if(!paneKey)return;
  let eventName = "pane.getContext@"+paneKey;
  let callbackName = "pane.context@"+paneKey;
  EventHelper.request({eventName,callbackName,callback});
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
export function updateData(options){
  let {paneKey,tplNode,undoHistory} = options;
  if(!paneKey)return;
  let eventName = "pane.updateData@"+paneKey;
  let eventData = {tplNode,undoHistory}
  EventHelper.request({eventName,eventData});
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
export function onDataChange(options) {
  let {paneKey,callback} = options;
  if(!paneKey)return;
  let eventName = 'pane.data@'+paneKey;
  EventHelper.listen({eventName,callback});
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
export function onDeleteData(options) {
  let {paneKey,callback} = options;
  if(!paneKey)return;
  let eventName = 'pane.deleteData@'+paneKey;
  EventHelper.listen({eventName,callback});
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
export function onContextChange(options) {
  let {paneKey,callback} = options;
  if(!paneKey)return;
  let eventName = 'pane.context@'+paneKey;
  EventHelper.listen({eventName,callback});
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
export function onShow(options) {
  let {paneKey,callback} = options;
  if(!paneKey)return;
  let eventName = 'pane.show@'+paneKey;
  EventHelper.listen({eventName,callback});
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
export function onHide(options) {
  let {paneKey,callback} = options;
  if(!paneKey)return;
  let eventName = 'pane.hide@'+paneKey;
  EventHelper.listen({eventName,callback});
}
