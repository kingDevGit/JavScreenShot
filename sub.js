
module.exports = {

function isStr(str){
    return (str !== null && (typeof str === "string"));
}
function isObj(obj){
    return (obj !== null && (typeof obj === "object"));
}
function isFunc(func){
    return (func !== null && (typeof func === "function"));
}

function getObj(str) {
    //return document.getElementById(str);
    return $("#" + str)[0];
}
function print(temp, showAllTheProperty) {
    if(temp === undefined){
        output_ta.value += "[undefined]";
    } else {
        if (typeof showAllTheProperty === "boolean" && showAllTheProperty === true && typeof temp === "object") {
            var str = "";
            for (var property in temp) {
                str += "  " + property + " : " + temp[property] + "\n";
            }
            output_ta.value += str.substr(0, str.length - 1); // remove the last \n
        } else {
            output_ta.value += temp.toString();
        }
    }
    //console.log(temp);
    output_ta.scrollTop = output_ta.scrollHeight;
}
function println(temp, showAllTheProperty) {
    print(temp, showAllTheProperty);
    print("\n");
}
function clear() {
    output_ta.value = "";
}
function printDivider() {
    print("--------------------------------------------------------------------------\n");
}

Element.prototype.getElementById = function(id){
    for(var name in this.children){
        var ele = this.children[name];
        if(ele.id === id)
            return ele;
    }
};

//判斷字串開頭是否為指定的字
//回傳: bool
String.prototype.startsWith = function(prefix)
{
    return (this.substr(0, prefix.length) === prefix);
};

//判斷字串結尾是否為指定的字
//回傳: bool
String.prototype.endsWith = function(suffix)
{
    return (this.substr(this.length - suffix.length) === suffix);
};

//判斷字串是否包含指定的字
//回傳: bool
String.prototype.contains = function(txt)
{
    return (this.indexOf(txt) >= 0);
};


String.prototype.findBetween = function (kw1, kw2) {
    var len1 = kw1.length;
    var index1 = this.indexOf(kw1);
    var index2 = this.indexOf(kw2, index1 + len1);
    if(index1 === -1) return;
    if(index2 === -1) return this.substring(index1 + len1);
    else return this.substring(index1 + len1, index2);
};


};