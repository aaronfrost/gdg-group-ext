var urls = {
    "profile": "https://developers.google.com/profile/status"
    ,"chapter": "https://developers.google.com/groups/chapter/" /* This is a partial match*/
};
$(function(){
    //if I am in the iframe

        var href = window.location.href;
        if(href.indexOf(urls.profile) > -1){
            passBackChapterList();
        }else if(href.indexOf(urls.chapter) > -1){
            getNextMeetingForGroup();
        }

});

function passBackChapterList(){
    alert("passing back group list");
    var list = [];
    $("#chapter-list > span > a").each(function(k,v){
        list.push({name:$(this).text(),href: "https://developers.google.com"+$(this).attr("href")})
    });
    //give the list back to the extension, where the BG is listening
    chrome.extension.sendMessage(undefined,{type:"GROUP_LIST",data:list});

}
function getNextMeetingForGroup(){
    var events;
    setTimeout(function(){
        events = $("a.fc-event");
        getTimeForEvent(events,0);
    }, 4000);

    function getTimeForEvent(events, index){
        var event = events[index];
        $.get("https://developers.google.com"+$(event).attr("href"), function(r){
            var dateString = $(r).find("section#event-details-beta > section:eq(0) > header").attr("content");
            var date = new Date(dateString);

            if(date.getTime() > (new Date().getTime() - (1000*60*120)) ){

            }

        });
    }
}