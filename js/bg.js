addExtensionListeners();
check();
setInterval(check,60*60*1000/* once an hour */);
//setInterval(check,60*1000/* once a minute */);

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
        switch (message.type){
            case "GROUP_LIST":
                document.body.removeChild(firstIframe);
                delete firstIframe;
                processGroupList(message, 0);
                break;

            default:break;
        }
    });
}

function processGroupList(message, index){
    alert("Processing Group List");
    var list = message.data;
    secondIframe = document.createElement("iframe");
    document.body.appendChild(secondIframe);
    secondIframe.src = message.data[index].href;

}
