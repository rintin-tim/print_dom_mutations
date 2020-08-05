
/* Manual script testing */
//Test page: https://www.amazon.co.uk/gp/product/B07F3BY75M
//var cssSelector = "#a-page"
var cssSelector = "div[role='main']"
var targetNode = document.querySelector(cssSelector);
var checkInterval = 5000;
var resultClassName = "dom-result"; // bespoke name for the class to be used by resultElement
var resultAttributeName = "data-dom-result"; // bespoke name for the data attribute to be used by resultElement


if (targetNode) {
  console.log("Target element found: " + cssSelector); 
} else {
  throw new Error("Target element cound not be found: " + cssSelector); 
}


var currentMutationCount = 0; // Callback function to execute when mutations are observed

var callback = function callback(mutationsList, observer) {
  //debugger;
  mutationsList.forEach(function(mutation) {
    switch (mutation.type) {
      case "childList":        
        console.log(
          "A child node has been added or removed. " + "\n" +
            "Parent's outerHTML: " + "\n" +
            mutation.target.outerHTML.substring(0,300) + " ..." + "\n"      
        );
        
        if (mutation.addedNodes) { 
          mutation.addedNodes.forEach (function (currentValue) { 
            console.log ( 
              "Added nodeName: " + "\n" +
              currentValue.nodeName  
            ); 
          })
        }

        if (mutation.removedNodes) { 
          mutation.removedNodes.forEach(function (currentValue) { 
            console.log ( 
              "Removed nodeName: " + "\n" +
              currentValue.nodeName  
            ); 
          })
        }
            
        currentMutationCount += 1;
        //debugger;
        break;

      case "attributes":
        console.log(
          "An attribute was modified. " + "\n" +
            "Modified element: " + "\n" +
            mutation.target.outerHTML.substring(0,300) + "\n" +
            "Previous attribute value: " + "\n" +
            mutation.oldValue + "\n"
        );
        //console.log(currentMutationCount);
        console.log("Total Mutations: " + (currentMutationCount + 1));
        currentMutationCount += 1;
        //debugger;
        break;
    }
  });
}


var startCount = currentMutationCount;

/* after timeoutInterval check if the mutation count has changed. Initiate the 'stop' function if no changes */
function checkDomIsSettled() {
  console.log("Checking if DOM is settled...");
  var endCount = currentMutationCount;

  if (startCount == endCount) {
    console.log(
      " ** Complete! No more mutations detected. We are done here. ** Total mutations found: " + endCount
    );
    stopCheckingDom();
   // updateResultElementToTrue();
  } else {
    console.log(
      "DOM not settled. New mutations found. Checking again in " + checkInterval + "ms"
    );

    startCount = currentMutationCount;
  }
}

/* clear the timeoutInterval and disconnect the observer */
function stopCheckingDom() {
  clearInterval(window.domTimerInterval); // Later, you can stop observing
  console.log("disconnecting observer");
  window.observer.disconnect();
}

/* start the mutation observer. attached it at the global level (i.e. window) so that it can be found on subsequent runs */
function startObserver() {
  console.log("* Starting new mutation observer... *");
  var config = { attributes: true, childList: true, subtree: true, attributeOldValue: true };  // mutations to observe
  window.observer = new MutationObserver(callback); // Start observing the target node for configured mutations
  window.observer.observe(targetNode, config);
  window.domTimerInterval = setInterval(checkDomIsSettled, checkInterval); // selenium version
}

startObserver();
