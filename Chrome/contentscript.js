var scrollChecker = "";

if(document.webkitVisibilityState === "visible") {

  scrollChecker = setInterval(function() {    
      var reqURL = "http://jonaslund.com/works/selfsurfing/scroll.txt?" + Math.floor(Math.random()*880000);
      var http = new XMLHttpRequest();
      http.open("GET", reqURL, true);
      http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {        
          var scrollDistance = http.responseText;
          console.log(scrollDistance);
          window.scroll(0,scrollDistance);
        }
      };
      http.send();
  }, 2000);
}

document.addEventListener("webkitvisibilitychange", function() { 
  console.log("changed");
  if(document.webkitVisibilityState === "visible") {

    if(!scrollChecker) {
      scrollChecker = setInterval(function() {    
          var http = new XMLHttpRequest();
          var reqURL = "http://jonaslund.com/works/selfsurfing/scroll.txt?" + Math.floor(Math.random()*880000);
          http.open("GET", reqURL, true);
          http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {        
              var scrollDistance = http.responseText;
              console.log(scrollDistance);
              window.scroll(0,scrollDistance);
            }
          };
          http.send();
      }, 2000);
    }

  } else {
    if(scrollChecker) {
      clearInterval(scrollChecker);
      scrollChecker = null;
    }
  }

}, false);