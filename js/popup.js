onload = function(){
    var me = this;
    chrome.extension.sendMessage(undefined,{type:"GET_NEXT_EVENT"},function(r){
        $("body > iframe").remove();
        $(".no-next-event").remove();
        if(r.url == null){
            $("body").append("<h4 class='no-next-event'>No Upcoming Meetings Scheduled</h4>");
        }else{
            var iframe = document.createElement("iframe");
            iframe.width = "600px";
            iframe.height = "500px";
            document.body.appendChild(iframe);
            iframe.src = r.url;
        }
    });

}