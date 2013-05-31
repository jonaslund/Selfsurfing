//the transmission becomes the creation becomes the work
on = null;

chrome.browserAction.onClicked.addListener(function(tab) {   
  console.log("clicked");

  //check if running already
  if(on) {
    clearInterval(requestUpdates);  
    chrome.browserAction.setIcon({path: 'icon.png'});
    chrome.browserAction.setTitle({title: "Start Selfsurfing"});

    on = null;
  } else {
    chrome.browserAction.setIcon({path: 'icon_on.png'});
    chrome.browserAction.setTitle({title: "Selfsurfing is running"});

    var reqURL = "http://jonaslund.biz/works/selfsurfing/json.txt?" + Math.floor(Math.random()*888000);
    var http = new XMLHttpRequest();
    http.open("GET", reqURL, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");    
    http.onreadystatechange = function() {
      if(http.readyState == 4 && http.status == 200) {        
        var tabs = JSON.parse(http.responseText);

        var createData = {};
        chrome.windows.create(createData, function (window) { 
          winID = window.id;          

          for (var i = 0; i < tabs.length; i++) {                
            var createProps = {};
            createProps.windowId = winID;
            createProps.url = tabs[i].url;
            createProps.active = tabs[i].active;
            createProps.index = tabs[i].index;

            chrome.tabs.create(createProps, function(tab) {
            });
          };

          //start update checking  
          on = 1;
          requestUpdates = setInterval(function() {             
            var http = new XMLHttpRequest();
            var reqURL2 = "http://jonaslund.biz/works/selfsurfing/json.txt?" + Math.floor(Math.random()*888000);

            http.open("GET", reqURL2, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");    
            http.onreadystatechange = function() {
              if(http.readyState == 4 && http.status == 200) {        
                var serverTabs = JSON.parse(http.responseText);

                  var queryInfo = {};
                  queryInfo.windowId = winID;
                  chrome.tabs.query(queryInfo, function(clientTabs) {
                                
                    for (var i = 0; i < serverTabs.length; i++) {
                      //check serverTabs vs clientTabs
                      var serverURL = serverTabs[i].url,
                          serverIndex = serverTabs[i].index,
                          serverActive = serverTabs[i].active;

                      //update/create    
                      //get client with serverIndex
                      var clientObj = findObjectByAttribute(clientTabs, "index", serverIndex);
                      
                      if(clientObj) {
                        if(serverURL === clientObj.url) {
                          //no change
                        } else {
                          //update client tab
                          var updateProps = {};                    
                          updateProps.url = serverURL;
                          updateProps.active = serverTabs[i].active;
                        
                          chrome.tabs.update(clientObj.id, updateProps);
                        }

                        //focus
                        if(serverActive) {
                          if(!clientObj.active) {
                            var updateProps = {};
                                updateProps.active = true;
                            
                                chrome.tabs.update(clientObj.id, updateProps);
                                chrome.tabs.executeScript(clientObj.id, {file: "contentscript.js"});
                              
                          }
                        }

                      } else {
                        //create new tab with serverTabs.url;
                        var createProps = {};
                        createProps.windowId = winID;
                        createProps.url = serverURL;
                        createProps.active = serverTabs[i].active;

                        chrome.tabs.create(createProps);
                      }

                    };

                    //remove
                    for (var i = 0; i < clientTabs.length; i++) {
                      var clientIndex = clientTabs[i].index;
                      var serverObj = findObjectByAttribute(serverTabs, "index", clientIndex);

                      if(!serverObj) {
                        chrome.tabs.remove(clientTabs[i].id);
                      }
                    };
                  
                  });
              }
            }
            http.send();
          }, 1000);

        });
      } else {
        //failed loading t2sp.net
        //chrome.browserAction.setIcon({path: 'icon.png'});
        //chrome.browserAction.setTitle({title: "Start Selfsurfing"});

      }
    }
    http.send();
    
    chrome.windows.onRemoved.addListener(function(removedID) {      
      if(removedID === winID) {

        if(on) {
          clearInterval(requestUpdates);
          on = null;
        }

        chrome.browserAction.setIcon({path: 'icon.png'});
        chrome.browserAction.setTitle({title: "Start Selfsurfing"});        
      }
      
    });

  }
});



function findObjectByAttribute (items, attribute, value) {  
  for (var i = 0; i < items.length; i++) {
    if (items[i][attribute] === value) {
      return items[i];
    }
  }
  return null;
}
