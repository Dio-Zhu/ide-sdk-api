import EventHelper from "../EventHelper";

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
export function getContextData(options){
    let {paneKey,callback} = options||{};
    let eventName = paneKey?"dnd.getContextData@"+paneKey:"dnd.getContextData";
    let eventData = null;
    let callbackName = paneKey?"dnd.contextData@"+paneKey:"dnd.contextData";
    EventHelper.request({eventName,eventData,callbackName,callback});
}

/**
 * 在画布中抓取元素开始拖拽时，通过此方法通知画布以外区域，正在拖拽中。
 * 此方法在 画布 中使用
 * @param options
 */
export function canvasIsDragStart(options){
    let eventName = "dnd.canvasIsDragStart";
    let eventData = null;
    EventHelper.request({eventName,eventData});
}
/**
 * 在画布中释放元素停止拖拽时，通过此方法通知画布以外区域，已停止拖拽。
 * 此方法在 画布 中使用
 * @param options
 */
export function canvasIsDragStop(options){
    let eventName = "dnd.canvasIsDragStop";
    let eventData = null;
    EventHelper.request({eventName,eventData});
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
export function dragStartToCanvas(options){
    let {paneKey,uiType,uiData,modelType,modelData} = options||{};
    let eventName = "dnd.dragStartToCanvas@"+paneKey;
    let eventData = {uiType,uiData,modelType,modelData};
    EventHelper.request({eventName,eventData});
}

/**
 * 在自定义面板中停止拖拽时，通过此方法通知画布区域。
 * 此方法在 自定义面板 中使用
 * @param options
 * {
 *      paneKey//必填，自定义面板的key值
 * }
 */
export function dragStopToCanvas(options){
    let {paneKey} = options||{};
    let eventName = "dnd.dragStopToCanvas@"+paneKey;
    let eventData = null;
    EventHelper.request({eventName,eventData});
}

/**
 * 在画布中监听，自定义面板开始拖拽的事件。
 * 此方法在 画布 中使用
 * @param options
 */
export function onDragStartToCanvas(options){
    let {callback} = options||{};
    let eventName = 'dnd.onDragStartToCanvas';
    EventHelper.listen({eventName,callback});
}

/**
 * 在画布中监听，自定义面板停止拖拽的事件。
 * 此方法在 画布 中使用
 * @param options
 */
export function onDragStopToCanvas(options){
    let {callback} = options||{};
    let eventName = 'dnd.onDragStopToCanvas';
    EventHelper.listen({eventName,callback});
}

/**
 * 在画布中操作层级结构，将指定节点设置为选中状态
 * 此方法在 画布 中使用
 * @param options
 * {
 *     nid //层级中的指定节点nid
 * }
 */
export function selectNode(options){
    let {nid} = options||{};
    let eventName = "dnd.selectNode";
    let eventData = {nid};
    EventHelper.request({eventName,eventData});
}
/**
 * 在画布中操作层级结构，将当前节点设置为取消选中状态
 * 此方法在 画布 中使用
 * @param options
 */
export function unSelectNode(options){
    let eventName = "dnd.unSelectNode";
    let eventData = null;
    EventHelper.request({eventName,eventData});
}

/**
 * 在画布中操作层级结构，插入指定节点
 * 此方法在 画布 中使用
 * @param options
 */
export function insertNode(options){
    let {
        uiType,//ui类型标识
        uiData = {
            source:{},//ui原始/初始化数据对象
            isPart:false, //是否为部件ui
            // isExt:false  //是否为扩展ui
        },
        targetNid,
        targetParam,//来自目标dom节点的uiparams属性的值
        position
    } = options||{};
    let eventName = "dnd.insertNode";
    let eventData = {
        uiType,//ui类型标识
        uiData:{
            source:{},//ui原始/初始化数据对象
            isPart:false, //是否为部件ui
            // isExt:false  //是否为扩展ui
        },
        targetNid,
        targetParam,//来自目标dom节点的uiparams属性的值
        position
    };
    EventHelper.request({eventName,eventData});
}
/**
 * 在画布中操作层级结构，移动节点
 * 此方法在 画布 中使用
 * @param options
 */
export function moveNode(options){
    let {
        nid ,
        targetNid,
        targetParams,//来自目标dom节点的uiparams属性的值
        position,
    } = options||{};
    let eventName = "dnd.moveNode";
    let eventData = {
        nid ,
        targetNid,
        targetParams,//来自目标dom节点的uiparams属性的值
        position
    };
    EventHelper.request({eventName,eventData});
}

/**
 * 在画布中操作层级结构，删除节点
 * 此方法在 画布 中使用
 * @param options
 * {
 *     nid //节点的nid
 * }
 */
export function deleteNode(options){
    let {nid} = options||{};
    let eventName = "dnd.deleteNode";
    let eventData = {nid};
    EventHelper.request({eventName,eventData});
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
export function onChooseNode(options){
    let {callback} = options||{};
    let eventName = 'dnd.onChooseNode';
    EventHelper.listen({eventName,callback});
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
export function onUnChooseNode(options){
    let {callback} = options||{};
    let eventName = 'dnd.onUnChooseNode';
    EventHelper.listen({eventName,callback});
}

export function buttonClick(options){
    let {nid,buttonKey} = options||{};
    let eventName = "dnd.buttonClick";
    let eventData = {nid,buttonKey};
    EventHelper.request({eventName,eventData});
}
