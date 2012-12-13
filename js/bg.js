addExtensionListeners();
clearOutNextEvent();
check();
//setInterval(check,60*60*1000/* once an hour */);
setInterval(check,60*1000/* once a minute */);

var firstIframe,secondIframe;


function check(){
    console.log("checking bg");
    firstIframe = document.createElement("iframe");
    document.body = document.createElement("body");
    document.body.appendChild(firstIframe);
    firstIframe.src = "https://developers.google.com/profile/status";
}
function addExtensionListeners(){

    chrome.extension.onMessage.addListener(function(message, sender, cb){
//        alert("bg casing");
        switch (message.type){
            case "GROUP_LIST":
                document.body.removeChild(firstIframe);
                delete firstIframe;
                processGroupList(message, 0);
                break;
            case "NEXT_EVENT":
                storeNextEvent(message);
                addBadgeIfNotGoingYet(message);
                break;
            case "GET_NEXT_EVENT":
                getNextEventAndCallback(cb, message, sender);
                break;
            case "REMOVE_BADGE":
                removeBadge();
                break;
            case "CLEAR_NEXT_EVENT":
                clearNextEvent();
                break;
            default:break;
        }
    });
}

function processGroupList(message, index){
    if(message.data.length){

        console.log("Processing Group List");
        var list = message.data;
        secondIframe = document.createElement("iframe");
        document.body.appendChild(secondIframe);
        secondIframe.src = message.data[index].href;
    }
    console.log("The user has no GDG Group. Have them join a group please.");
}

function storeNextEvent(message){
    console.log("Storing next", message);
    localStorage.setItem("NEXT_EVENT_DATE", message.date);
    localStorage.setItem("NEXT_EVENT_URL", message.event);
    localStorage.setItem("NEXT_EVENT_ATTENDING", message.attending);

}

function clearNextEvent(){
    console.log("CLEARING TEXT");
    localStorage.removeItem("NEXT_EVENT_DATE");
    localStorage.removeItem("NEXT_EVENT_URL");
    localStorage.removeItem("NEXT_EVENT_ATTENDING");

}

function addBadgeIfNotGoingYet(message){
    var eventDate = new Date(message.date);
    var now = new Date();
    //if we are within 48 hours of the event happening
    if( (eventDate.getTime() - now.getTime()) < (1000*60*60*48/*48 hours*/) && !message.attending ){
        chrome.browserAction.setBadgeText({text:"!"});
        chrome.browserAction.setBadgeBackgroundColor({color:"#FF0000"})
    }else{
        removeBadge();
    }
}

function getNextEventAndCallback(cb, message, sender){
    if($.isFunction(cb)){
        cb({
            date: localStorage.getItem("NEXT_EVENT_DATE")
            ,url: localStorage.getItem("NEXT_EVENT_URL")
            ,attending: localStorage.getItem("NEXT_EVENT_ATTENDING")
        });
    }
}

function removeBadge(){
    chrome.browserAction.setBadgeText({text:""});
}

function clearOutNextEvent(){
    removeBadge();
    clearNextEvent();
}