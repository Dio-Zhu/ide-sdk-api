import EventHelper from "../EventHelper";

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
export function getModalContext(options){
    let {callback} = options;
    let eventName = "modal.getContext";
    let eventData = null;
    let eventContext = null;
    let callbackName = "modal.context";
    EventHelper.request({eventName,eventData,eventContext,callbackName,callback});
}

/**
 * 关闭全局弹窗
 */
export function modalClose(){
    let eventName = "modal.close";
    EventHelper.request({eventName});
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
export function modalOpen(options){
  let eventName = "modal.open";
  let eventData = options;
  EventHelper.request({eventName,eventData});
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
export function setModalConfig(options){
  let eventName = "modal.setConfig";
  let eventData = options;
  EventHelper.request({eventName,eventData});
}
