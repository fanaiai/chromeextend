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
Array.prototype.deleteArray = function (delarray) {  
    for(var i=this.length-1;i>=0;i--){
        (function(that,item,j){
            if(delarray.includeItem(item)>-1){
            that.splice(j,1);
            }
        })(this,this[i],i)
        
    }
}; 
function getQuery(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
function getExtractInfo(paths){
        var infolist=[];
        $.each(paths,function(i,ele){
            var csspatharry=ele.css_selecter;
            var name=ele.name;
            var type=ele.extratype;
            var attr_name=ele.attr_name;
            $.each(csspatharry,function(j,pathobj){
                var path=pathobj.pathstring;
                var $el=$(path);
                var info={
                    name:name,
                    type:type,
                    attr_name:attr_name || '--',
                    path:path
                }
                if(type=='txt'){
                    info.value=$el.text();
                    info.type_name='提取文本';
                }
                else{
                    info.value=$el.attr(attr_name);
                    info.type_name='提取属性';
                }
                infolist.unshift(info);
            })
        })
        return infolist;
    }