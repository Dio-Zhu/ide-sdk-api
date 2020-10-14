const _LISTEN_CALLBACKS = {};//监听的回调堆栈
const MessageHelper = {
    //获取Iframe的窗口
    getIframeWindow(iframeId){
        let ifr = document.getElementById(iframeId);
        return ifr?ifr.contentWindow:null;
    },
    //发送消息给内部窗口
    sendMessageIn(iframeId,message){
        if(!message||!iframeId)return;
        let iframeWindow = MessageHelper.getIframeWindow(iframeId);
        if(iframeWindow){
            console.log('[消息>>>发送]'+iframeId,message);
            iframeWindow.postMessage(JSON.stringify(message),"*");
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
    sendMessageOut (message){
        window.parent.postMessage(JSON.stringify(message), "*");
    },
    //注册监听回调
    addMessageListen(listenName,callback){
        _LISTEN_CALLBACKS[listenName] = callback;
    },
    //注销监听回调
    removeMessageListen(listenName){
        delete _LISTEN_CALLBACKS[listenName];
    },
    //获取监听回调
    getMessageListen(listenName){
        return _LISTEN_CALLBACKS[listenName];
    },
    //消息监听开启
    startMessage(){
        MessageHelper.stopMessage();
        if (window.addEventListener) {
            window.addEventListener('message',MessageHelper._receiveMessage);
        } else {
            window.attachEvent('message',MessageHelper._receiveMessage);
        }
        MessageHelper._isMessageKeep_ = true;
    },
    //消息监听关闭
    stopMessage(){
        if (window.removeEventListener) {
            window.removeEventListener('message', MessageHelper._receiveMessage);
        }else{
            window.detachEvent('message',MessageHelper._receiveMessage);
        }
        delete MessageHelper._isMessageKeep_;
    },
    //消息监听维持
    keepMessage(){
        if(!MessageHelper._isMessageKeep_){
            MessageHelper.startMessage();
        }
    },
    //接收消息的回调
    _receiveMessage(event){
        if(event&&event.data && typeof event.data == 'string'){
            console.log("[消息>>>接收]",event);
            try{
                const data = JSON.parse(event.data);
                const callback = MessageHelper.getMessageListen(data.type);
                if (typeof callback == 'function') {
                    try{
                        callback(data);
                    }catch (err) {
                        console.error('处理消息失败',err);
                    }
                }
            }catch (e) {}
        }
    }
};
export default MessageHelper;
