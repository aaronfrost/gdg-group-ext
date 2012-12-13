var urls = {
    "profile": "https://developers.google.com/profile/status"
    ,"chapter": "https://developers.google.com/groups/chapter/" /* This is a partial match*/
    ,"event" : "https://developers.google.com/events/"
};
//if I am in the iframe
if(window!=window.parent){
    var href = window.location.href;
    if(href.indexOf(urls.profile) > -1){
        passBackChapterList();
    }else if(href.indexOf(urls.chapter) > -1){
        getNextMeetingForGroup();
    }else if(href.indexOf(urls.event) > -1){
        modEventWindow();
    }
}



function passBackChapterList(){
//    alert("passing back group list");

    $(function(){
//        debugger;
        var list = [];
        $("#chapter-list > span > a").each(function(k,v){
            list.push({name:$(this).text(),href: "https://developers.google.com"+$(this).attr("href")})
        });
        //give the list back to the extension, where the BG is listening
        chrome.extension.sendMessage(undefined,{type:"GROUP_LIST",data:list});
    });


}

function getNextMeetingForGroup(){
    var events;
    setTimeout(function(){
        events = $("a.fc-event");
        getTimeForEvent(events,0);
    }, 4000);

    function getTimeForEvent(events, index){

        try{

//            debugger;
            if(index < events.length){
                var event = events[index];
                var eventurl = "https://developers.google.com"+$(event).attr("href");
                eventurl+= "#"+ new Date().getTime(); /*Add something so the request doesn't cache*/
                $.get(eventurl, function(r){

                    var e = $(r).find("section#event-details-beta > section:eq(0) > header");
                    var dateString = $(e).attr("content");
                    var date = new Date(dateString);

                    if(date.getTime() > (new Date().getTime() - (1000*60*120)) ){
                        var hiddenButton = $(r).find("#event-socialbar div.hidden");
                        var hiddenId = hiddenButton.attr("id");
                        var attending = false;
                        if(hiddenId.indexOf("not-") >= 0){
                            attending = true;
                        }
                        chrome.extension.sendMessage(undefined, {type:"NEXT_EVENT", date:date, event:eventurl, attending: attending});
                    }else{
                        getTimeForEvent(events, ++index);
                    }

                });

            }else{
                //alert("tryingelse");
                chrome.extension.sendMessage(undefined, {type:"CLEAR_NEXT_EVENT"});
                chrome.extension.sendMessage(undefined, {type:"REMOVE_BADGE"});
            }


        }catch(e){
            alert("ERROR GETTING TIME FOR EVENT:\n---------------------------------------\n" +e);
        }

    }
}
//Popup
function modEventWindow(){
    document.querySelector("body.events #event-details-beta").style.width = "35%";
    document.querySelector("#gc-topnav").style.display = "none";
    document.querySelector("#sandbar").style.display = "none";

    document.querySelector("#gc-appbar").style.padding = "4px 7px";
    document.querySelector("#gc-main").style.padding = "0 10px";

    flashAttendanceButton();

}
//Popup
function flashAttendanceButton(){
    var count = 0;
    var notButton = $('#event-socialbar > div[id|="not"]');
    notButton.click(function(){
        chrome.extension.sendMessage(undefined, {type:"REMOVE_BADGE"});
    });
    setInterval(function(){
        notButton.css('border','3px dotted '+(count++%2?"red":"white"));
    }, 400);
}