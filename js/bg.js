addExtensionListeners();
check();
setTimeout(check,60*60*1000/* once an hour */);

var firstIframe,secondIframe;

function check(){
    firstIframe = document.createElement("iframe");
    document.body.appendChild(firstIframe);
    firstIframe.src = "https://developers.google.com/profile/status";
}
function addExtensionListeners(){
    chrome.extension.onMessage.addListener(function(message, sender, cb){
        switch (message.type){
            case "GROUP_LIST":
                processGroupList(message, sender, cb);
                break;

            default:break;
        }
    });
}

function processGroupList(message){

}
