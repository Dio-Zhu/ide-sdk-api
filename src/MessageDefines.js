const MessageDefines = {
    //------通用事件监听消息类型-------
    EVENT_INPUT :"ide.event.in",

    //------通用事件发送消息类型-------
    EVENT_OUTPUT :"ide.event.out",

    //------内部iframe的事件监听----
    LISTEN_DOCUMENT_CLICK :"ide.document.click",//document.click监听
    LISTEN_KEYDOWN_ESC :"ide.keydown.esc",//ESC键监听

    //------自定义面板消息类型(发送)-------
    MESSAGE_PANE_DATA :"pane.data@",
    MESSAGE_PANE_CONTEXT :"pane.context@",
    MESSAGE_PANE_SHOW :"pane.show@",
    MESSAGE_PANE_HIDE :"pane.hide@",

    //------自定义面板消息类型(接收)-------
    LISTEN_PANE_GET_DATA :"pane.getData@",
    LISTEN_PANE_GET_CONTEXT :"pane.getContext@",
    LISTEN_PANE_UPDATE_DATA :"pane.updateData@",

    //------DragAndDrop监听消息类型-------
    LISTEN_DND_LOADED :"ide.dnd.loaded",
    LISTEN_DND_CHOOSED :"ide.dnd.elementChoosed",
    LISTEN_DND_UNCHOOSED :"ide.dnd.elementUnChoosed",
    LISTEN_DND_INSERT :"ide.dnd.elementInsert",
    LISTEN_DND_MOVE :"ide.dnd.elementMove",
    LISTEN_DND_REMOVE :"ide.dnd.elementRemove",
    LISTEN_DND_DRAG_START :"ide.dnd.elementStart",
    LISTEN_DND_DRAG_STOP :"ide.dnd.elementStop",
    LISTEN_DND_BUTTON_CLICK :"ide.dnd.buttonClick",

    //------DragAndDrop发送消息类型-------
    MESSAGE_DND_INIT :"ide.dnd.init",
    MESSAGE_DND_CHOOSE :"ide.dnd.choose",
    MESSAGE_DND_UNCHOOSE :"ide.dnd.unChoose",
    MESSAGE_DND_DRAG_START :"ide.dnd.dragStart",
    MESSAGE_DND_DRAG_STOP :"ide.dnd.dragStop",
};

export default MessageDefines;