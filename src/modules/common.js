import EventHelper from "../EventHelper";

/**
 * 给出信息提示
 * @param {object} options
 * {
 *  content   提示内容
 *  type  提示类型"info"(默认)|"success"|"error"|"warning"
 * }
 */
export function alert(options){
    let {content,type} = options;
    let eventName = "alert";
    let eventData = {
        type:type||"info",
        content:content
    };
    EventHelper.request({eventName,eventData});
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
export function updateTreeData(options){
    let {treeData,clearFocus,undoHistory} = options;
    let eventName = "updateTreeData";
    let eventData = {treeData,clearFocus,undoHistory};
    EventHelper.request({eventName,eventData});
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
export function getTreeData(options){
    let {msgId,msgData,callback} = options;
    let eventName = 'getTreeData';
    let eventData = {msgId,msgData};
    let callbackName = 'treeData';
    EventHelper.request({eventName,eventData,callbackName,callback});
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
export function getPanelState(options){
    let {callback} = options;
    let eventName = 'getPanelState';
    let eventData = null;
    let callbackName = 'panelState';
    EventHelper.request({eventName,eventData,callbackName,callback});
}

/**
 * 设置全局的面板状态
 * @param {object} options
 * {
 *     leftVisible:true,  //左侧面板的显示状态
 *     rightVisible:true  //右侧面板的显示状态
 * }
 */
export function setPanelState(options){
    let eventName = "setPanelState";
    let eventData = options;
    EventHelper.request({eventName,eventData});
}

/**
 * 打开全局确认框
 * @param {*} options
 *  {
 *   title:'',  //弹窗标题
 *   content:'', //提示内容
 * }
 */

export function confirmOpen (options) {
    let eventName = "confirm.open";
    let eventData = options;
    EventHelper.request({eventName,eventData});

}

/**
 * 关闭确认提示框
 * @param {object} options //需要携带的参数
 */
export function confirmClose (options) {
    let eventName = "confirm.close";
    let eventData = options;
    EventHelper.request({eventName,eventData});
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
export function onConfirmClose(options) {
    let {callback} = options;
    let eventName = 'confirm.closed';
    EventHelper.listen({eventName,callback});
}
