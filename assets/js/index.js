/* ------------------------------------ Toolkit ------------------------------------ */
// StorageHelper
function StorageHelper(app) {
    this.app = app;
}
StorageHelper.prototype.setItem = function (key, value) {
    key = this.app + "_" + key;
    localStorage.setItem(key, value);
}
StorageHelper.prototype.getItem = function (key) {
    key = key = this.app + "_" + key;
    return localStorage.getItem(key);
}
StorageHelper.prototype.removeItems = function () {
    console.log(arguments);
    for (var i in arguments) {
        var key = this.app + "_" + arguments[i];
        localStorage.removeItem(key);
    }
}
StorageHelper.prototype.clear = function () {
    for (var key in localStorage) {
        if (key.match(this.app)) localStorage.removeItem(key);
    }
}
const storageHelper = new StorageHelper("livecloud");
// 
function showView(ele, displayName) {
    if (!ele) throw "Element not exists";
    if (displayName) ele.style.display = displayName;
    else ele.style.display = ele.getAttribute("visible-display") || "inline-block";
}
function enableView(ele, enable) {
    if (!ele) throw "Element not exists";
    if (enable) {
        ele.removeAttribute("disabled");
        ele.classList.remove("cus-disabled");
    } else {
        ele.setAttribute("disabled", "true");
        ele.classList.add("cus-disabled");
    }
}
/**
 * @param {String} str 
 */
function isEmpty(str) {
    if (typeof str !== "string") return true;
    if (str.replace(/(^s*)|(s*$)/g, "").length == 0) return true;
    return false;
}
/**
 * Search Parent Element
 */
function parentByClass(ele, className) {
    if (!ele) return false;
    var parent = ele.parentNode;
    if (parent.classList.contains(className)) return parent;
    if (parent.nodeName === "body") return null;
    return parentByClass(parent, className);
}
/**
 * Analyze Url, Get Parma
 * @param {String} variable - QueryString
 */
function getQueryVariable(variable) {
    var url = window.location.href;
    var x = url.indexOf("?") + 1;
    url = url.substring(x);
    if (!url) return false;
    var arr = url.split("&");
    for (let i = 0; i < arr.length; i++) {
        let cur = arr[i].split("=");
        if (cur[0] === variable) return cur[1];
    }
    return false;
}
/**
 * Choose A Element Fullscreen
 * @param {Element} ele 
 */
function fullScreen(ele) {
    const func =
        ele.requestFullscreen ||
        ele.mozRequestFullScreen ||
        ele.webkitRequestFullscreen ||
        ele.msRequestFullscreen;
    func.call(ele);
}
/**
 * generate request headers and return
 */
function getHeaders() {
    var nowTime = Date.now();
    return (config.user ? {
        "timestamp": nowTime,
        "uid": +getYouUid(),
        "sign": config.firebaseLogin ? md5Sign(storageHelper.getItem("uid"), nowTime) : 1111,
        "Content-Type": "application/json",
        "authorization": storageHelper.getItem("token")
    } : { "timestamp": nowTime })
}
/* ------------------------------------ Config ------------------------------------ */

/* ------------------------------------ Config ------------------------------------ */
var config = {

}
/* ------------------------------------ Firebase Init ------------------------------------ */
// const firebase = {
//     apiKey: "AIzaSyCmVAuNQzatDlvwHhXh7rZHqC3fQN-Rmus",
//     authDomain: "vfun-c8eb3.firebaseapp.com",
//     databaseURL: "https://vfun-c8eb3.firebaseio.com",
//     projectId: "vfun-c8eb3",
//     storageBucket: "vfun-c8eb3.appspot.com",
//     messagingSenderId: "664474724178",
//     appId: "1:664474724178:web:58bd300cc5715027d07c8b",
//     measurementId: "G-VG1FQN1KRR"
// };
// firebase.initializeApp(firebaseConfig);
// function anonymousLogin() {
//     firebase.auth().signInAnonymously().catch(function (error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         println(`Anonymous Login Failed : ${errorCode} -> ${errorMessage}`, null, "error");
//     });
// }
// firebase.auth().onAuthStateChanged(function (user) {
//     println("firebase.auth().onAuthSateChangeed => ", user, "success");
//     config.user = user;
//     showView(views.waitStranger);
//     initView(user && !user.isAnonymous);
//     if (user) {
//         if (user.isAnonymous) {
//             login();
//             println("Signin by anonymous.", null, "warn");
//         } else connectSocket(); // Connect Our Socket Server.
//     } else {
//         anonymousLogin();
//     }
// });
/* ------------------------------------ MD5 ------------------------------------ */
function md5Login(firebaseUid, requestTime) {
    var key = "fjsihaueoewhdasewrjZgflokejiOKkjhjwiyeKNHJd2342";
    var str = firebaseUid + requestTime + key;
    return hex_md5(str).toUpperCase();
}
function md5Sign(timestamp, uid) {
    var mid = "1122010";
    var key = "fjsihaueoewhdasewrjZgflokejiOKkjhjwiyeKNHJd2342";
    var str = mid + timestamp + uid + key;
    return hex_md5(str).toUpperCase();
}
/* ------------------------------------ Login ------------------------------------ */
function getRegion(){
    var re = /^(?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wy-z](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i;
  
    let foo = re.exec(navigator.language);
    let bar = re.exec(navigator.language);
  
    console.log(`region ${foo[5]}`); // 'region AT'
    console.log(`region ${bar[5]}`); // 'region CN'
    return bar[5];
  }
  /**
   * When Firebase Login Success, Call The Function.
   */
  function login(successTips, failedTips){
    var url = `https://${config.domain}/vFun2/user/login`;
    var nowTime = Date.now();
    var dataObj = {
      deviceType: 4,
      requestTime: nowTime,
      loginId: config.user.uid,
      nickName: config.user.displayName,
      sign: md5Login(config.user.uid, nowTime),
      appId: 410,
      appKey: "fjsihaueoewh36585489848jhjjoidfggeeu342",
      thirdType: 6,
      regionCode: getRegion()
    }
}