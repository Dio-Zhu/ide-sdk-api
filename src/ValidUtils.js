export function validRequied(funcName,paramName,paramValue){
    if(paramValue){
        return true;
    }else{
        console.log("[IdeApi]参数校验失败，方法："+funcName+"，缺少必要参数："+paramName);
        return false;
    }
}