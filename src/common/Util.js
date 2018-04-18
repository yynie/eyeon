let util = {

};

export default util;

util.title = function (title) {
    window.document.title = title;    
};

util.isInArray = function (arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
};

util.indexOfArray = function (arr,val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) return i;
    }
    return -1;
};

util.removeFromArray = function (arr,val) {
    var index = util.indexOfArray(arr,val);
    if (index > -1) {
        arr.splice(index, 1);
    }
};
util.isExpired = function (start,now,duration){
  if(now > start){
    return ((start + duration) <= now);
  }
  return true; //时间错乱直接返号过期
}