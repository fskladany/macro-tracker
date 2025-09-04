(function(window, document) {
// Function to make elements draggable
     function dragElement(element) {
          let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
          const dragMouseDown = function (e) {
               e = e || window.event;
               e.preventDefault();
               pos3 = e.clientX;
               pos4 = e.clientY;
               document.onmouseup = closeDragElement;
               document.onmousemove = elementDrag;
          }

          const elementDrag = function (e) {
               e = e || window.event;
               e.preventDefault();
               pos1 = pos3 - e.clientX;
               pos2 = pos4 - e.clientY;
               pos3 = e.clientX;
               pos4 = e.clientY;
               element.style.top = (element.offsetTop - pos2) + "px";
               element.style.left = (element.offsetLeft - pos1) + "px";
          }

          const closeDragElement = function () {
               document.onmouseup = null;
               document.onmousemove = null;
          }

          if (document.getElementById(element.id + "Header")) {
               document.getElementById(element.id + "Header").onmousedown = dragMouseDown;
          } else {
               element.onmousedown = dragMouseDown;
          }
     }
     
     window.UiNode = {
          dragElement
     };
     
})(window, document);