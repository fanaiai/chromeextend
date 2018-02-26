///集合取交集  
Array.intersect = function () {  
    var result = new Array();  
    var obj = {};  
    for (var i = 0; i < arguments.length; i++) {  
        for (var j = 0; j < arguments[i].length; j++) {  
            var str = arguments[i][j];  
            if (!obj[str]) {  
                obj[str] = 1;  
            }  
            else {  
                obj[str]++;  
                if (obj[str] == arguments.length)  
                {  
                    result.push(str);  
                }  
            }//end else  
        }//end for j  
    }//end for i  
    return result;  
}  
  
//集合去掉重复  
Array.prototype.uniquelize = function () {  
    var tmp = {},  
        ret = [];  
    for (var i = 0, j = this.length; i < j; i++) {  
        if (!tmp[this[i]]) {  
            tmp[this[i]] = 1;  
            ret.push(this[i]);  
        }  
    }  
  
    return ret;  
}  
//并集  
Array.union = function () {  
    var arr = new Array();  
    var obj = {};  
    for (var i = 0; i < arguments.length; i++) {  
        for (var j = 0; j < arguments[i].length; j++)  
        {  
            var str=arguments[i][j];  
            if (!obj[str])  
            {  
                obj[str] = 1;  
                arr.push(str);  
            }  
        }//end for j  
    }//end for i  
    return arr;  
}  
  
//2个集合的差集 在arr不存在  
Array.prototype.minus = function (arr) {  
    var result = new Array();  
    var obj = {};  
    for (var i = 0; i < arr.length; i++) {  
        obj[JSON.stringify(arr[i])] = 1;  
    }  
    for (var j = 0; j < this.length; j++) {  
        if (!obj[JSON.stringify(this[j])])  
        {  
            obj[JSON.stringify(this[j])] = 1;  
            result.push(this[j]);  
        }  
    }  
    return result;  
}; 
Array.prototype.includeItem = function (obj) {  
	var result=-1;
    for (var i = 0; i < this.length; i++) {  
        if(JSON.stringify(this[i])==JSON.stringify(obj)){
        	result=i;
        	break;
        }
    }  
    return result;
}; 