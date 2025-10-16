(function (window, document) {
     // Function to make elements draggable
     function dragElement(elementId) {
          let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

          const element = document.getElementById(elementId);

          if (!element) {
               alert (`Element ${elementId} not found!`);
               return false;
          }

          const dragMouseDown = function (e) {
               e = e || window.event;
               // Disable dragging if clicked on button, input[text|number], or select dropdown
               const target = e.target;
               const tagName = target.tagName.toLowerCase();
               const type = target.type ? target.type.toLowerCase() : '';
               // console.log('Clicked element:', tagName, type);

               if (target.classList.contains('anchor')) {
                    console.log("This is an anchor node!");
                    onDragStartIntegration(e);
                    return;
               } 

               if (!target.classList.contains('.flow-line')){
                     document.querySelectorAll('.clicked-path').forEach(e => e.classList.remove('clicked-path'));
               }
               
               if (
                    tagName === 'button' || tagName === 'textarea' ||
                    (tagName === 'input' && (type === 'text' || type === 'number')) ||
                    tagName === 'select'
               ) {
                    if (e.target.id == "startMenuToggle"){
                         console.log("permitting drag for startmenutoggle");
                         
                    } else {
                         console.log("Clicked on interactive element, not dragging.");
                         return; // do nothing, prevent drag
                    }
               }

               document.querySelectorAll(".draggable.active")
                    .forEach(el => el.classList.remove("active"));

               // highlight the clicked one
               element.classList.add("active");
             
               
               if (e.type.startsWith('touch')) {
                    e.preventDefault(); // Prevent scrolling on touch
               }
               
               pos3 = e.touches ? e.touches[0].clientX : e.clientX;
               pos4 = e.touches ? e.touches[0].clientY : e.clientY;
               document.onmouseup = exitDragDurationDepressurize;
               document.ontouchcancel = exitDragDurationDepressurize;
               document.ontouchend = exitDragDurationDepressurize;
               
               document.onmousemove = elementMoveDragAfterClick;
               document.ontouchmove = elementMoveDragAfterClick;
               
          }

          const elementMoveDragAfterClick = function (e) {
               e = e || window.event;
               e.preventDefault();
               
               const clientX = e.touches ? e.touches[0].clientX : e.clientX;
               const clientY = e.touches ? e.touches[0].clientY : e.clientY;

               pos1 = pos3 - clientX;
               pos2 = pos4 - clientY;
               pos3 = clientX;
               pos4 = clientY;
               element.style.top = (element.offsetTop - pos2) + "px";
               element.style.left = (element.offsetLeft - pos1) + "px";

               const draggingSourceElement = e.target.closest && e.target.closest('.draggable');

               if (draggingSourceElement && draggingSourceElement.id == "startMenu") {
                    const windows = document.querySelectorAll('.hidden.ui-window');
                    
                    windows.forEach (window => {
                         updateFlowsForWindow(window.id);
                    });
                    
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
               document.ontouchend = null;
               document.ontouchcancel = null;
               document.ontouchmove = null;
               
          }


          element.addEventListener('mousedown', dragMouseDown);
          // TODO: perhaps should be touchmove
          element.addEventListener('touchstart', dragMouseDown);
          
          
     }

     window.UiNode = {
          dragElement
     };

     function SetKeyboardEvents() {
          // Add event listener for Enter key on the addEntryWindow
          document.getElementById('addEntryWindow').addEventListener('keydown', function (event) {
               if (event.key === 'Enter') {
                    window.MacroTracker.AddEntry();
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
               closeBtn.textContent = '㆝';

               closeBtn.onclick = function() {
                    toggleWindow(windowElement.id);
                  
               };

               farElement.prepend(closeBtn);
          }
     }

     window.Fluency = {
          addCloseButtonToWindow: addCloseButtonToWindow
     };

})(window, document);