var urls = {
    "profile": "https://developers.google.com/profile/status"
    ,"chapter": "https://developers.google.com/groups/chapter/" /* This is a partial match*/
};
$(function(){
    var href = window.location.href;
    if(href.indexOf(urls.profile) > -1){
        passBackChapterList();
    }else if(href.indexOf(urls.chapter) > -1){
        getNextMeetingForGroup();
    }
});

function passBackChapterList(){


}
function getNextMeetingForGroup(){


}