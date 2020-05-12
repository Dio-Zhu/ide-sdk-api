import MessageHelper from './MessageHelper';
import MessageDefines from './MessageDefines';

const _EVENT_INPUT_CALLBACKS = {};
const _EVENT_OUTPUT_CALLBACKS = {};
const _EVENT_QUEUE = {};

const EventHelper = {
    uuid(){
        return new Date().getTime()+"_"+Math.round(Math.random()*1000)
    },
    //发送事件给内部窗口
    sendEventIn(options){
        let {iframeId,eventName,eventData,eventContext} = options;
        if(!eventName)return;
        let message = {};
        message.type = MessageDefines.EVENT_OUTPUT;//注意：相对设计器而言是往外部输出事件
        message.eventName = eventName;
        if(eventData!==undefined) message.eventData = eventData;
        if(eventContext!==undefined) message.eventContext = eventContext;
        return MessageHelper.sendMessageIn(iframeId,message);
    },
    //发送事件给外部窗口
    sendEventOut(options){
        let {eventName,eventData,eventContext} = options;
        if(!eventName)return;
        let message = {};
        message.type = MessageDefines.EVENT_INPUT;//注意：相对设计器而言是外部输入事件
        message.eventName = eventName;
        if(eventData!==undefined&&eventData!==null)message.eventData = eventData;
        if(eventContext!==undefined&&eventContext!==null)message.eventContext = eventContext;
        return MessageHelper.sendMessageOut(message);
    },
    //维持事件的监听
    keep(){
        MessageHelper.keepMessage();//保障消息通道正常
        // MessageHelper.addMessageListen(MessageDefines.EVENT_INPUT,EventHelper._receiveInputEventMessage);//监听输入类型事件
        MessageHelper.addMessageListen(MessageDefines.EVENT_OUTPUT,EventHelper._receiveOutputEventMessage);//监听输出类型事件
    },
    //请求事件(内部向外部发送)
    request(options){
        let {eventName,eventData,eventContext,callbackName,callback} = options;
        if(!eventName)return;
        EventHelper.keep();
        let _queueId = EventHelper.uuid();
        if(callbackName){//存在回调事件名则绑定回调事件监听
            EventHelper._pushQueue(_queueId,callback);
            EventHelper._addEventListen(callbackName+"."+_queueId,function(eventDataOut,eventContextOut){
                let {_queueId} = eventContextOut||{};
                let queueCallback = EventHelper._popQueue(_queueId)
                typeof queueCallback == 'function' && queueCallback(eventDataOut,eventContextOut);
                EventHelper._removeEventListen(callbackName+"."+_queueId,"output");
            },"output");
        }
        EventHelper.sendEventOut({
            eventName:eventName,
            eventData:eventData,
            eventContext:Object.assign({},eventContext,{_queueId:_queueId})
        });
    },
    //响应事件(外部向内部发送)
    response(options){
        let {eventName,eventData,eventContext} = options;
        EventHelper.sendEventIn({eventName,eventData,eventContext})
    },
    //监听事件
    listen(options){
      let {eventName,callback} = options;
      EventHelper.keep();
      EventHelper._addEventListen(eventName,callback,"output");
    },
    //取消监听事件
    unlisten(options){
      let {eventName} = options;
      EventHelper._removeEventListen(eventName,"output");
    },
    //添加事件的监听
    _addEventListen(eventName,callback,inputOrOutput){
        if(!eventName)return;
        switch (inputOrOutput) {
            case "input":
                _EVENT_INPUT_CALLBACKS[eventName] = callback;
                break;
            case "output":
                _EVENT_OUTPUT_CALLBACKS[eventName] = callback;
                break
        }
    },
    //移除事件的监听(支持多事件名)
    _removeEventListen(eventNames,inputOrOutput){
        if(Array.isArray(eventNames)&&eventNames.length>0){//移除多个事件
            for(let i in eventNames){
                switch (inputOrOutput) {
                    case "input":
                        delete _EVENT_INPUT_CALLBACKS[eventNames[i]];
                        break;
                    case "output":
                        delete _EVENT_OUTPUT_CALLBACKS[eventNames[i]];
                        break;
                }

            }
        }else{//移除单个事件
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
    _receiveInputEventMessage(message){
        if(!message&&!message.eventName)return;
        if(message.type!== MessageDefines.EVENT_INPUT)return;
        const eventCallback = _EVENT_INPUT_CALLBACKS[message.eventName];
        if (typeof eventCallback == 'function') {
            try{
                eventCallback(message.eventData,message.eventContext);
            }catch (err) {
                console.error('处理事件消息失败',err);
            }
        }
    },
    //接收事件消息的回调
    _receiveOutputEventMessage(message){
        if(!message&&!message.eventName)return;
        if(message.type!== MessageDefines.EVENT_OUTPUT)return;
        let {_queueId} = message.eventContext||{}
        let eventCallback = null;
        if(_queueId){//有队列ID则取对应队列下的事件回调函数
          eventCallback = _EVENT_OUTPUT_CALLBACKS[message.eventName+'.'+_queueId];
        };
        if(!eventCallback){//队列回调函数不存在则取对应事件回调函数
          eventCallback = _EVENT_OUTPUT_CALLBACKS[message.eventName];
        }
        if (typeof eventCallback == 'function') {
            try{
                eventCallback(message.eventData,message.eventContext);
            }catch (err) {
                console.error('处理事件消息失败',err);
            }
        }
    },
    //入队列
    _pushQueue(queueId,callback){
        _EVENT_QUEUE[queueId] = callback;
    },
    //出队列
    _popQueue(queueId){
        let callback = _EVENT_QUEUE[queueId];
        delete _EVENT_QUEUE[queueId];
        return callback;
    }
};
export default EventHelper;
