//Example page: https://www.amazon.co.uk/gp/product/B07F3BY75M
var cssSelector = "#a-page"  // CSS selector for the web element under observervation (targetNode).
var targetNode = document.querySelector(cssSelector);
var checkInterval = 5000;  // The time to wait for DOM changes in the web element under observation

var currentMutationCount = 0; // The number of DOM mutations found. + 1 for each callback triggered
var startCount = currentMutationCount;  // Compared to currentMutationCount (to identify if mutations have been added)

if (targetNode) {
  console.log("Target element found: " + cssSelector); 
} else {
  throw new Error("Target element cound not be found: " + cssSelector); 
}

var callback = function callback(mutationsList, observer) {
    mutationsList.forEach(function(mutation) {
    switch (mutation.type) {
      case "childList":        
        console.log(
          "A child node has been added or removed. " + "\n" +
            "Parent's outerHTML: " + "\n" +
            mutation.target.outerHTML.substring(0,300) + " ..." + "\n"  // outerHTML truncated to 300 characters      
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
        printTotalMutations(mutation.type)
        break;

      case "attributes":
        console.log(
          "An attribute was modified. " + "\n" +
            "Modified element: " + "\n" +
            mutation.target.outerHTML.substring(0,300) + "\n" +
            "Previous attribute value: " + "\n" +
            mutation.oldValue + "\n"
        );
        currentMutationCount += 1;
        printTotalMutations(mutation.type)
        break;
    }
  });
}

function printTotalMutations(mutationType) {
  console.log("New mutation: "+ "'" + mutationType + "' | " + " Total Mutations: " + (currentMutationCount));
}

// after timeoutInterval, check if the mutation count has changed. Initiate the 'stop' function if no changes 
function checkDomIsSettled() {
  console.log("Checking if DOM is settled...");
  var endCount = currentMutationCount;

  if (startCount == endCount) {
    console.log(
      " ** Complete! No more mutations detected. We are done here. Total mutations found: " + endCount + " **"
    );
    stopCheckingDom();
  } else {
    console.log(
      "DOM not settled. New mutations found. Checking again in " + checkInterval + "ms"
    );
    startCount = currentMutationCount;
  }
}

/* clear the timeoutInterval and disconnect the observer */
function stopCheckingDom() {
  clearInterval(window.domTimerInterval); 
  console.log("disconnecting observer");
  window.observer.disconnect();
}

// start the mutation observer. attach it at the global level (i.e. window)
function startObserver() {
  console.log("* Starting new mutation observer... *");
  var config = { attributes: true, childList: true, subtree: true, attributeOldValue: true};  // mutations to observe
  window.observer = new MutationObserver(callback); // Start observing the target node for configured mutations
  window.observer.observe(targetNode, config);
  window.domTimerInterval = setInterval(checkDomIsSettled, checkInterval); 
}

startObserver();
