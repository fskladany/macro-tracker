(function (window, document) {
     // Function to make elements draggable
     function dragElement(element) {
          let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
          const dragMouseDown = function (e) {
               e = e || window.event;
               // Disable dragging if clicked on button, input[text|number], or select dropdown
               const target = e.target;
               const tagName = target.tagName.toLowerCase();
               const type = target.type ? target.type.toLowerCase() : '';
               console.log('Clicked element:', tagName, type);

               if (target.classList.contains('anchor')) {
                    console.log("This is an anchor node!");
                    onDragStartIntegration(e);
                    return;
               } 

               if (!target.classList.contains('.flow-line')){
                     document.querySelectorAll('.clicked-path').forEach(e => e.classList.remove('clicked-path'));
               }
               
               if (
                    tagName === 'button' ||
                    (tagName === 'input' && (type === 'text' || type === 'number')) ||
                    tagName === 'select'
               ) {
                    return; // do nothing, prevent drag
               }

               document.querySelectorAll(".draggable.active")
                    .forEach(el => el.classList.remove("active"));

                    // highlight the clicked one
               element.classList.add("active");

               

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
                  element.querySelectorAll('.anchor').forEach(anchor => {
                    updateFlowsForNode(anchor.dataset.id);
               });
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

     function SetKeyboardEvents() {
          // Add event listener for Enter key on the addEntryWindow
          document.getElementById('addEntryWindow').addEventListener('keydown', function (event) {
          if (event.key === 'Enter') {
               window.MacroTracker.addEntry();
          }
          });
     }

     window.KeyboardPermission = {
          SetKeyboardEvents
               // ...add more exports as needed...
     };

})(window, document);