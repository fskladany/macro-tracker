(function (window, document) {
     window.canvasFrame = null;
     const flowConnections = []; // { fromAnchorId, toAnchorId, pathElement }
     let htmlPathElement = null;
     let currentSourceAnchorId = null;
     let animationFrameId = null; // To keep track of the animation frame

     /* ---------- Integration with draggable ---------- */
     function clickDragUpkeepingPressure(e) {
          const draggingSourceElement = e.target.closest && e.target.closest('.anchor');
          if (draggingSourceElement) {
               draggingSourceWindow = draggingSourceElement.closest('.ui-window');
               if (!draggingSourceWindow) {
                    alert("No dragging source window found C");
                    return false;
               }
               console.log("Starting drag from anchor", draggingSourceElement);
               console.log("Dragging source window", draggingSourceWindow);
               document.body.classList.add("dragging-anchor");
               drawingLineFromUpkeepingPressure(draggingSourceElement, draggingSourceWindow, e);
               return true; // handled
          }
          alert("No dragging source element found B");
          return false;
     }

     /* ---------- Connection workflow ---------- */
     function drawingLineFromUpkeepingPressure(draggingSourceElement, draggingSourceWindow, origEvent) {
          const fromAnchorId = draggingSourceElement.id;
          if (flowConnections.some(f => f.fromAnchorId === fromAnchorId || f.toAnchorId === fromAnchorId)) {
               alert("Anchor already connected");
               return;
          }

          currentSourceAnchorId = fromAnchorId;

          htmlPathElement = createPathElement();
          htmlPathElement.classList.add("temporary");
          canvasFrame.appendChild(htmlPathElement);

          window.addEventListener('pointermove', followPointer);
          window.addEventListener('touchmove', followPointer);
          window.addEventListener('pointerup', finishConnection);
          window.addEventListener('touchend', finishConnection);
          window.addEventListener('touchcancel', finishConnection);

          followPointer(origEvent);
     }

     function createPathElement() {
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.classList.add('flow-line');
          return p;
     }

     function getAnchorPosition(anchorId) {
          let anchorElement = document.querySelector(`.anchor#${CSS.escape(anchorId)}`);
          if (!anchorElement || !canvasFrame) return null;

          // Find parent .ui-window for this anchor
          let parentWindowElement = anchorElement.closest('.ui-window');
          if (parentWindowElement && parentWindowElement.classList.contains('hidden')) {
               // Fallback to start menu anchor if parent window is hidden
               anchorElement = document.querySelector('#startMenuToggle');
               if (!anchorElement) return null;
          }
          const canvasRect = canvasFrame.getBoundingClientRect();
          const anchorRect = anchorElement.getBoundingClientRect();
          return {
               x: anchorRect.left + anchorRect.width / 2 - canvasRect.left,
               y: anchorRect.top + anchorRect.height / 2 - canvasRect.top
          };
     }

     function setPathElementAttributes(pathElement, fromX, fromY, toX, toY) {
          const cp1x = (fromX + toX) / 2;
          const cp1y = fromY;
          const cp2x = (fromX + toX) / 2;
          const cp2y = toY;
          pathElement.setAttribute('d', `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`);
     }

     function followPointer(e) {
          if (e.type.startsWith('touch')) {
               e.preventDefault(); // Prevent scrolling on touch
          }
          
          if (!htmlPathElement || !currentSourceAnchorId) {
               alert("No path element or source anchor to follow");
               return;
          }

          if (animationFrameId) {
               cancelAnimationFrame(animationFrameId);
          }
          animationFrameId = requestAnimationFrame(() => {
               const fromPos = getAnchorPosition(currentSourceAnchorId);
               if (!fromPos || !canvasFrame) {
                    alert("Could not get from position or canvas frame");
                    return;
               }
               const canvasRect = canvasFrame.getBoundingClientRect();
               const clientX = e.touches ? e.touches[0].clientX : e.clientX;
               const clientY = e.touches ? e.touches[0].clientY : e.clientY;
               setPathElementAttributes(htmlPathElement, fromPos.x, fromPos.y, clientX - canvasRect.left, clientY - canvasRect.top);
               animationFrameId = null;
          });
     }

     function finishConnection(e) {
          if (animationFrameId) {
               cancelAnimationFrame(animationFrameId);
               animationFrameId = null;
          }

          window.removeEventListener('pointermove', followPointer);
          window.removeEventListener('pointerup', finishConnection);
          window.removeEventListener('touchmove', followPointer);
          window.removeEventListener('touchend', finishConnection);
          window.removeEventListener('touchcancel', finishConnection);

          document.body.classList.remove("dragging-anchor");

          const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
          const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

          const hitElements = document.elementsFromPoint(clientX, clientY);
          alert("Hit elements: " + hitElements.map(el => el.className).join(', '));
          const targetAnchorElement = hitElements.find(el => el.classList && el.classList.contains('anchor'));

          if (targetAnchorElement) {
               alert("Has target anchor", targetAnchorElement);
               const toAnchorId = targetAnchorElement.id;
               if (toAnchorId === currentSourceAnchorId || flowConnections.some(f => f.fromAnchorId === toAnchorId || f.toAnchorId === toAnchorId)) {
                    alert(`Invalid connection: same anchor ${currentSourceAnchorId} anchor or already connected ${toAnchorId}`);
                    htmlPathElement.remove();
                    htmlPathElement = null;
                    currentSourceAnchorId = null;
                    return;
               }

               const fromPos = getAnchorPosition(currentSourceAnchorId);
               const toPos = getAnchorPosition(toAnchorId);
               setPathElementAttributes(htmlPathElement, fromPos.x, fromPos.y, toPos.x, toPos.y);
               lockFlowConnection(htmlPathElement, currentSourceAnchorId, toAnchorId);
               saveFlowConnections();

               htmlPathElement = null;
               currentSourceAnchorId = null;
          } else {
               alert("No target anchor found, cancelling connection");
               htmlPathElement.remove();
               htmlPathElement = null;
               currentSourceAnchorId = null;
          }
     }

     function lockFlowConnection(pathElement, fromAnchorId, toAnchorId) {
          pathElement.classList.remove('temporary', 'dragging-anchor');
          pathElement.dataset.fromAnchorId = fromAnchorId;
          pathElement.dataset.toAnchorId = toAnchorId;
          if (!flowConnections.some(f => f.fromAnchorId === fromAnchorId && f.toAnchorId === toAnchorId)) {
               flowConnections.push({ fromAnchorId, toAnchorId, pathElement });
          }
          pathElement.addEventListener('mouseup', () => removeFlowConnectionByElement(pathElement));
     }

     /* ---------- Flow management ---------- */
     function removeFlowConnectionByElement(pathElement) {
          if (!pathElement) return;

          const fromAnchorId = pathElement.dataset.fromAnchorId;
          const toAnchorId = pathElement.dataset.toAnchorId;

          if (!pathElement.classList.contains('clicked-path')) {
               pathElement.classList.add('clicked-path');
               return true;
          }


          pathElement.classList.remove('clicked-path');
          const idx = flowConnections.findIndex(f => f.fromAnchorId === fromAnchorId && f.toAnchorId === toAnchorId);
          if (idx !== -1) {
               flowConnections.splice(idx, 1);
               alert("removing now");

               pathElement.remove();

               saveFlowConnections();
               window.demonstrateFlowPresence();
          }
     }

     function getFlowParentWindowFrom(flow) {
          anchorElem = document.getElementById(flow.fromAnchorId);
          closestParentWindowA = anchorElem.closest('.ui-window');
          return closestParentWindowA;
     }
     function getFlowParentWindowTo(flow) {
          anchorElem = document.getElementById(flow.toAnchorId);
          closestParentWindowA = anchorElem.closest('.ui-window');
          return closestParentWindowA;
     }

     // Update all flows for a given window (by window id)
     function updateFlowsForWindow(windowId) {

          
          if (animationFrameId) {
               cancelAnimationFrame(animationFrameId);
          }

          const windowElement = document.getElementById(windowId);
          if (!windowElement) {
               alert("Zero element window found for id: " + windowId);
               return;
          }

          const anchorElements = windowElement.querySelectorAll(`.anchor`);

          // This seems to cause problems
          //animationFrameId = requestAnimationFrame(() => {
               anchorElements.forEach(anchorEl => {
                    const anchorId = anchorEl.id;
                    flowConnections.forEach(f => {
                         if (f.fromAnchorId == anchorId || f.toAnchorId == anchorId) {
                              console.log(`found relationship on ${windowId} from: ${f.fromAnchorId} to ${f.toAnchorId}`);

                              var closestParentWindowA = getFlowParentWindowFrom(f);
                              var closestParentWindowB = getFlowParentWindowTo(f);


                              if (closestParentWindowA && closestParentWindowA.classList.contains('oneDirectionalWindow')) {
                                   f.pathElement.classList.add('oscillating');
                                   setTimeout(() => { f.pathElement.classList.remove('oscillating'); }, 3000);
                              }
                              if (closestParentWindowB && closestParentWindowB.classList.contains('oneDirectionalWindow')) {
                                   f.pathElement.classList.add('oscillating');
                                   setTimeout(() => { f.pathElement.classList.remove('oscillating'); }, 3000);
                              }

                              const fromPos = getAnchorPosition(f.fromAnchorId);
                              const toPos = getAnchorPosition(f.toAnchorId);
                              if (fromPos && toPos) setPathElementAttributes(f.pathElement, fromPos.x, fromPos.y, toPos.x, toPos.y);
                              else (alert("fromPos or toPos missing!"));
                         }
                    });
               });
               animationFrameId = null;
          //});
     }

     function saveFlowConnections() {
          const storageKey = window.Sync.getStorageKey('flows');
          localStorage.setItem(storageKey, JSON.stringify(flowConnections.map(f => ({ fromAnchorId: f.fromAnchorId, toAnchorId: f.toAnchorId }))));
     }

     function processFlowList(flowList) {
          var deferred = new Array();
          flowList.forEach(f => {
               const fromAnchorElement = document.querySelector(`.anchor#${f.fromAnchorId}`);
               const toAnchorElement = document.querySelector(`.anchor#${f.toAnchorId}`);
               if (fromAnchorElement && toAnchorElement) {
                    const pathElement = createPathElement();
                    const fromPos = getAnchorPosition(f.fromAnchorId);
                    const toPos = getAnchorPosition(f.toAnchorId);
                    setPathElementAttributes(pathElement, fromPos.x, fromPos.y, toPos.x, toPos.y);
                    lockFlowConnection(pathElement, f.fromAnchorId, f.toAnchorId);
                    window.canvasFrame.appendChild(pathElement);
               } else {
                    console.log(`Deferred loading relationship flow from: ${f.fromAnchorId} to ${f.toAnchorId}`);
                    deferred.push(f);
               }

          });
          return deferred;

     }

     function loadFlowConnections() {
          flowConnections.length = 0;
          const storageKey = window.Sync.getStorageKey('flows');
          const stored = localStorage.getItem(storageKey);
          window.canvasFrame.innerHTML = ''; // Clear existing paths
          if (stored) {
               const arr = JSON.parse(stored);
               var deferred = processFlowList(arr);

               setTimeout(() => {
                    var failed = processFlowList(deferred);
                    if (failed.length == 0) {
                         console.log("deferred flow loading succeeded!");
                    }
                    else {
                         failed.forEach(flow => {
                              console.log(`Failed relationship from: ${flow.fromAnchorId} to ${flow.toAnchorId}`);
                         });
                    }

               }, 1000);
          }


     }

     /* ---------- Expose integration functions ---------- */
     window.onDragStartIntegration = clickDragUpkeepingPressure;
     window.updateFlowsForWindow = updateFlowsForWindow;
     window.saveFlowConnections = saveFlowConnections;
     window.loadFlowConnections = loadFlowConnections;
     window.getAnchorPosition = getAnchorPosition;

}(window, document));
