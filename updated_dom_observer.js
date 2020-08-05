// selenium version
//var targetNode = arguments[0]; // selenium version
//var checkInterval = arguments[1];
//var resultClassName = arguments[2];  // bespoke name for the class to be used by resultElement  // selenium version
//var resultAttributeName = arguments[3]; // bespoke name for the data attribute to be used by resultElement // selenium version

/* Manual script testing */
//Test page: https://gpe-satellite-1.pnpd.co.uk/monaco-grand-prix/hospitality-vip/
var cssSelector = "#a-page"
var targetNode = document.querySelector(cssSelector);
var checkInterval = 5000;
var resultClassName = "dom-result"; // bespoke name for the class to be used by resultElement
var resultAttributeName = "data-dom-result"; // bespoke name for the data attribute to be used by resultElement


console.log("OK.... Selected element: " + cssSelector);

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
            
        console.log(currentMutationCount);
        currentMutationCount += 1;
        //debugger;
        break;

      case "attributes":
        console.log(
          "An attribute was modified. " + "\n" +
            "Affected Element's (Target) outerHTML: " + "\n" +
            mutation.target.outerHTML.substring(0,300) + "\n" +
            "OldValue: " + "\n" +
            mutation.oldValue + "\n"
        );
        console.log(currentMutationCount);
        currentMutationCount += 1;
        //debugger;
        break;
    }
  });
}

createResultElement();

/* create the result element to be checked by selenium. */
function createResultElement() {
  //debugger;

  if (!targetNode) {
    throw "**Error** The specified 'targetNode' element could not be found. Check that targetNode's selector is correct";
  }

  var existingResultSpan = targetNode.getElementsByClassName(resultClassName);

  switch (existingResultSpan.length) {
    case 0:
    // if no element
      var newResultSpan = document.createElement("SPAN");
      newResultSpan.setAttribute("class", resultClassName);
      newResultSpan.setAttribute(resultAttributeName, "false");
      targetNode.appendChild(newResultSpan);
      startObserver();
      break;
    case 1:
    // if single instance of element do nothing
      existingResultSpan = existingResultSpan[0];
      var domResult = existingResultSpan.getAttribute(resultAttributeName);

      if (domResult == "true") {
        console.log(
          "** Doing Nothing ** a successful result already exists. Element: " +
            existingResultSpan.outerHTML
        );
      } else {
        console.log("Result element already exists but is set to false - ignoring");
      } break;
    default:
    // do nothing
      console.log("** More than 1 instance of the Dom Result element exists on this page **");
  }
}

var startCount = currentMutationCount;

/* after timeoutInterval check if the mutation count has changed. Initiate the 'stop' function if no changes */
function checkDomIsSettled() {
  console.log("running checkDomIsSettled");
  var endCount = currentMutationCount;

  if (startCount == endCount) {
    console.log(
      " ** Complete! No more mutations detected. We are done here. ** startCount: " +
        startCount +
        " / endCount: " +
        endCount
    );
    stopCheckingDom();
    updateResultElementToTrue();
  } else {
    console.log(
      " Mutations found. Updating startCount. startCount: " +
        startCount +
        " / endCount: " +
        endCount
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

/* update the result data attribute on the result element to true */
function updateResultElementToTrue() {
  var newResultSpan = targetNode.getElementsByClassName(resultClassName)[0];
  console.log("set element to true " + newResultSpan);
  newResultSpan.setAttribute(resultAttributeName, "true"); //newResultSpan.appendChild(newResultSpan);
}

/* start the mutation observer. attached it at the global level (i.e. window) so that it can be found on subsequent runs */
function startObserver() {
  console.log("* Starting new mutation observer... *");
  var config = { attributes: true, childList: true, subtree: true, attributeOldValue: true };  // mutations to observe
  window.observer = new MutationObserver(callback); // Start observing the target node for configured mutations
  window.observer.observe(targetNode, config);
  window.domTimerInterval = setInterval(checkDomIsSettled, checkInterval); // selenium version
}
