import hash64 from './hash64'

const util = {
    guid() {
        return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
    },
    random(minNum, maxNum) {
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    },
    getCookie(name){
        let arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"); //匹配字段
        if (arr === document.cookie.match(reg)) {
            return unescape(arr[2]);
        }
        return null;
    },
    setCookie(name, value) {
        let days = 1000; //定义一天
        let exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        // 写入Cookie, toGMTString将时间转换成字符串
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toISOString();
    },
    readDataURL(file, next) {
        let reader = new FileReader();
        reader.onloadend = function(){
            next(this.result)
        }
        reader.readAsDataURL(file);
    },

    enhash64(s) {
        return hash64.encode(s)
    },
    dehash64(c) {
        return hash64.decode(c)
    }
}



export const guid = util.guid;
export const random = util.random;
export const getCookie = util.getCookie;
export const setCookie = util.setCookie;
export const readDataURL = util.readDataURL;


export const encodeHash64 = util.enhash64;
export const dehash64 = util.dehash64;
export const decodeHash64 = util.dehash64;

export default util;
