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
                    console.log("Clicked on interactive element, not dragging.");
                    return; // do nothing, prevent drag
               }

               document.querySelectorAll(".draggable.active")
                    .forEach(el => el.classList.remove("active"));

               // highlight the clicked one
               element.classList.add("active");
             
               

               e.preventDefault();
               pos3 = e.clientX;
               pos4 = e.clientY;
               document.onmouseup = exitDragDurationDepressurize;
               document.ontouchcancel = exitDragDurationDepressurize;
               document.ontouchend = exitDragDurationDepressurize;
               
               document.onmousemove = elementMoveDragAfterClick;
               document.ontouchmove = elementMoveDragAfterClick;
               
          }

          const elementMoveDragAfterClick = function (e) {
               e = e || window.event;
               e.preventDefault();
               pos1 = pos3 - e.clientX;
               pos2 = pos4 - e.clientY;
               pos3 = e.clientX;
               pos4 = e.clientY;
               element.style.top = (element.offsetTop - pos2) + "px";
               element.style.left = (element.offsetLeft - pos1) + "px";

               const draggingSourceElement = e.target.closest && e.target.closest('.draggable');

               if (draggingSourceElement && draggingSourceElement.id == "startMenuList") {
                    // do nothing, this is the menu
               }
               else if (draggingSourceElement) {
                    //alert("Dragging element " + draggingSourceElement.id);
                    updateFlowsForWindow(draggingSourceElement.id);
               }
               else{
                    console.log("element e.target ", e.target.id, " has no close ui-window but I hold in memory that I started dragging ", element.id);
               }
               
          }

          const exitDragDurationDepressurize = function () {
               document.onmouseup = null;
               document.onmousemove = null;
          }

          if (document.getElementById(element.id + "Header")) {
               document.getElementById(element.id + "Header").onmousedown = dragMouseDown;
          } else {
               element.addEventListener('mousedown', dragMouseDown);
               element.addEventListener('touchstart', dragMouseDown);
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

          document.addEventListener('keydown', function (event) {
               if (event.key === 'Meta') {
                    toggleWindow('startMenuList');
                    
               }

               if (event.key === 'Control') {
                    toggleWindow('startMenuList');
               }

               if (event.key === 'ArrowUp') {
                    tabindex-=1;
               }

               if (event.key === 'ArrowDown') {
                    toggleWindow('startMenuList');
               }

          });
     }

     window.KeyboardPermission = {
          SetKeyboardEvents
               // ...add more exports as needed...
     };

     function addCloseButtonToWindow(farElement) {
          const windowElement = farElement.closest('.ui-window');
          if (!windowElement) {
               console.warn("No parent .ui-window found for element:", farElement);
               return;
          }

          if (!windowElement.querySelector('.close-btn')) {
               const closeBtn = document.createElement('button');
               closeBtn.classList.add('close-btn');
               closeBtn.textContent = '❎';

               closeBtn.onclick = function() {
                    toggleWindow(windowElement.id);
                  
               };

               farElement.appendChild(closeBtn);
          }
     }

     window.Fluency = {
          addCloseButtonToWindow: addCloseButtonToWindow
     };

})(window, document);