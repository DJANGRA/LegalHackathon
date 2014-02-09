window.onload= function () {
    
    var domain = document.location.hostname;
    
    chrome.notifications.onButtonClicked.addListener(function(notificationId,buttonIndex) {
            
        //0 = YES Button
        if(buttonIndex == 0) {

            PPClient.get_new_and_old_file($.parseJSON(notificationId), function(aFile) {
               
                chrome.tabs.create(null, function(tab) {
                    
                    var diff_body = HtmlDiff.formatTextDiff(aFile.old, aFile.current);
                    
                }
            });
                            
                            
        }
    });
                            
    requestPPDiffObject(domain, function(obj) {
    
        if(obj) {
        
            if(obj.track == 0) {
                trackNotification(obj);
            }
            
            if(obj.track == 1) {
                
                PPClient.get_commits_for_each_file(obj, function(diffobject, file) {
                   
                    var title = file.filename.slice(0, -4);
                    var options = {
                            type: "list",
                            title: "Differences in " + diffobject.domain;
                            message: "Do you want to see the changes of " + title + "?",
                            iconUrl: "url_to_small_icon",
                            buttons: [{ title: "Yes", iconUrl: "This is item 1."},
                                      { title: "No", iconUrl: "This is item 2."}]
            
                    };
                    
                    chrome.notifications.create(JSON.stringify(file), options, null);
                    
                });
            }
            
        }
    });
    
};


var updateNotification = function() {
