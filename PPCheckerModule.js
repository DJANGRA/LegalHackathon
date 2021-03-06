function PPDiffObject(domain, lastUpdated) {
    this.domain = domain;
    this.lastUpdated = lastUpdated;
    this.track = 0;
    this.files = new Array();
}

function DiffFile(domain, filename, url) {
    this.filename = filename;
    this.url = url;
    this.domain = domain;
    this.sha = null;
    this.old = null;
    this.current = null;
    this.head = null;
}

/* A Client module for interacting with the TOSDR github repo and the privacy policies of different sites*/

var PPClient = {
    
    /**url builders**/
    commits_url: function (domain, filename, lastUpdated) {
        return 'https://api.github.com/repos/tosdr/tosback2/commits?path=crawl/' + domain + '/' + filename + '&until=' + lastUpdated;
    },
    
    content_url: function (domain, filename, sha) {
        return 'https://api.github.com/repos/tosdr/tosback2/contents/crawl/' + domain + '/' + filename + '?ref=' + sha;
    },
    
    /** GET request for commits */
    get_commits: function (domain, filename, lastUpdated, callback) {
        
        var req = new XMLHttpRequest();
        req.open("GET", this.commits_url(domain, filename, lastUpdated), true);
        req.onload = function (e) {
            if (req.readyState === 4 && req.status === 200) {
                //send a parsed json object as
                callback(JSON.parse(req.responseText));
            }
            else {
                console.error(req.statusText);
            }
        };
        
        req.send();
    
    },
    
    get_file: function (domain, filename, sha, callback) {
      
      
        var req = new XMLHttpRequest();
        req.open("GET", this.content_url(domain, filename, sha), true);
        req.setRequestHeader("Accept", "application/vnd.github.VERSION.raw");
        req.onload = function (e) {
            if (req.readyState === 4 && req.status === 200) {
                callback(req.responseText);
            }
              
            else {
                console.error(req.statusText);
            }
        };
        
        req.send();
        
    },

    /* pass in a pre-loaded diffobject that contains (1) domain name; (2) last updated; and (3) an array of DiffFiles where each file is pre-loaded with
    (a) a filename and (b) a url */
    
    get_commits_for_each_file: function(diffobject, callback) {
    
        diffobject.files.forEach(function(aFile) {
            
            PPClient.get_commits(domain, aFile.filename, function(json) {
                if(json.length > 0) {       
                    aFile.sha = json[0].sha;
                    aFile.domain = domain;
                    callback(diffobject, aFile);
                }
            });
        
        });
    },
    
    get_new_and_old_file: function(aFile, callback) { 
        
        PPClient.get_file(aFile.domain, aFile.filename, aFile.sha, function(result) {
            aFile.old = result;
            PPClient.get_current_file(aFile, callback);      
        });
    },
    
    get_current_file: function(myFile, callback) {
    
        var date = new Date();
        var formatted_date = date.toISOString();
        var req = new XMLHttpRequest();
        req.open("GET", this.commits_url(myFile.domain, myFile.filename, formatted_date), true);
        req.onload = function (e) {
            if (req.readyState === 4 && req.status === 200) {
                //send a parsed json object as
                var json = JSON.parse(req.responseText);
                
                if(json.length > 0) {      
                    
                    PPClient.get_file(myFile.domain, myFile.filename, json[0].sha, function(response) {
                        
                          myFile.current = response;
                          callback(myFile);
                        
                    });
                }
                
            }
            else {
                console.error(req.statusText);
            }
        };
        
        req.send();
    },
};


/* Simulation function purely for testing purposes */


/* Pass in a PPDiffObject and populate the files array from a locally stored xml rules file, triggering the completion handler when done, passing back the 
diff_object */
/* TO DO
function populateObject(diff_object, completionHandler) {
    
    var req = new XMLHttpRequest();
    var resource = 'rules/' + domain + '.xml';
    req.responseType = "document";
    xmlHttpRequest.open("GET",  chrome.extension.getURL(resource, true));
    xmlHttpRequest.onreadystatechange = function(e) {
        
        var files = req.responseXML.getElementsByTagName("docname");
        
        files.forEach(function(json_file_obj) {
            
            var fileName = json_file_obj.getAttribute("name") + '.txt';
            var url = json_file_obj.firstChild.getAttribute("name");
            var file = new DiffFile(fileName, url);
            diff_obj.files.push(file);
        }
                              
        completionHandler(diff_obj);
        
    }        
    
    xmlHttpRequest.send(null);
}

/*
/  Request a PPDiffObject.  
/  First check the localstorage for object where formatted as <key>:<last_updated>,<track_integer>
/  If object exists, callback passing the object
/  Else, check a pre-populated array for the domain name.  
/  If domain name exists, pass an object with last_updated = today and track_integer = 0.  (Otherwise don't do anything)
*/
/*TODO
function requestPPDiffObject(domain, completionHandler) {
    
    //first ask local storage if the object exists
    chrome.storage.local.get(domain, function(items) {
    
        if (items[domain]) {
            var components = items[domain].split(",");
            var obj = new PPDiffObject(domain,components[0]);
            obj.track = components[1];
            completionHandler(obj);
        }
        
        else {
        
            var trackable_sites = ["www.amazon.com","www.google.com"]; //list trackable sites in an array
            
            if(trackable_sites.indexOf(domain) != -1) {
            
                var date = new Date();
                var iso_date = date.toISOString;
                var obj = new PPDiffObject(domain,iso_date);
                obj.track = 0;
                completionHandler(obj);
                
            } 
        
    });
}*/
