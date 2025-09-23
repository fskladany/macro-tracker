(function (window, document) {
     let canvasFrame = null;
     const flowConnections = []; // { fromAnchorId, toAnchorId, pathElement }
     let htmlPathElement = null;
     let currentSourceAnchorId = null;
     let animationFrameId = null; // To keep track of the animation frame

     document.addEventListener("DOMContentLoaded", () => {
          canvasFrame = document.querySelector(".flow-canvas");
          loadFlowConnections(); // load saved flows on page load
     });

     /* ---------- Integration with draggable ---------- */
     function clickDragUpkeepingPressure(e) {
          const draggingSourceElement = e.target.closest && e.target.closest('.anchor');
          if (draggingSourceElement) {
               draggingSourceWindow = draggingSourceElement.closest('.ui-window');
               if (!draggingSourceWindow){
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
          const fromAnchorId = draggingSourceElement.dataset.id;
          if (flowConnections.some(f => f.fromAnchorId === fromAnchorId || f.toAnchorId === fromAnchorId)) {
               alert("Anchor already connected");
               return;
          }

          currentSourceAnchorId = fromAnchorId;

          htmlPathElement = createPathElement();
          htmlPathElement.classList.add("temporary");
          canvasFrame.appendChild(htmlPathElement);

          window.addEventListener('pointermove', followPointer);
          window.addEventListener('pointerup', finishConnection);

          followPointer(origEvent);
     }

     function createPathElement() {
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.classList.add('flow-line');
          return p;
     }

     function getAnchorPosition(anchorId) {
          let anchorElement = document.querySelector(`.anchor[data-id="${CSS.escape(anchorId)}"]`);
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
               setPathElementAttributes(htmlPathElement, fromPos.x, fromPos.y, e.clientX - canvasRect.left, e.clientY - canvasRect.top);
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
          document.body.classList.remove("dragging-anchor");

          const hitElements = document.elementsFromPoint(e.clientX, e.clientY);
          const targetAnchorElement = hitElements.find(el => el.classList && el.classList.contains('anchor'));

          if (targetAnchorElement) {
               alert("Has target anchor", targetAnchorElement);
               const toAnchorId = targetAnchorElement.dataset.id;
               if (toAnchorId === currentSourceAnchorId || flowConnections.some(f => f.fromAnchorId === toAnchorId || f.toAnchorId === toAnchorId)) {
                    alert("Invalid connection: same anchor or already connected");
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

     // Update all flows for a given window (by window id)
     function updateFlowsForWindow(windowId) {
          if (animationFrameId) {
               cancelAnimationFrame(animationFrameId);
          }
          animationFrameId = requestAnimationFrame(() => {
               const windowElement = document.getElementById(windowId);
               if (!windowElement) {
                    alert("Zero element window found for id: " + windowId);
                    return;
               }
               const anchorElements = windowElement.querySelectorAll('.anchor');
               anchorElements.forEach(anchorEl => {
                    const anchorId = anchorEl.dataset.id;
                    flowConnections.forEach(f => {
                         if (f.fromAnchorId === anchorId || f.toAnchorId === anchorId) {
                              const fromPos = getAnchorPosition(f.fromAnchorId);
                              const toPos = getAnchorPosition(f.toAnchorId);
                              if (fromPos && toPos) setPathElementAttributes(f.pathElement, fromPos.x, fromPos.y, toPos.x, toPos.y);
                         }
                    });
               });
               animationFrameId = null;
          });
     }

     function saveFlowConnections() {
          
          localStorage.setItem("flows", JSON.stringify(flowConnections.map(f => ({ fromAnchorId: f.fromAnchorId, toAnchorId: f.toAnchorId }))));
     }

     function loadFlowConnections() {
          flowConnections.length = 0;
          const stored = localStorage.getItem("flows");
          canvasFrame.innerHTML = ''; // Clear existing paths
          if (stored) {
               const arr = JSON.parse(stored);
               arr.forEach(f => {
                    const fromAnchorElement = document.querySelector(`.anchor[data-id="${f.fromAnchorId}"]`);
                    const toAnchorElement = document.querySelector(`.anchor[data-id="${f.toAnchorId}"]`);
                    if (fromAnchorElement && toAnchorElement) {
                         const pathElement = createPathElement();
                         const fromPos = getAnchorPosition(f.fromAnchorId);
                         const toPos = getAnchorPosition(f.toAnchorId);
                         setPathElementAttributes(pathElement, fromPos.x, fromPos.y, toPos.x, toPos.y);
                         lockFlowConnection(pathElement, f.fromAnchorId, f.toAnchorId);
                         canvasFrame.appendChild(pathElement);
                    }
               });
          }
     }

     /* ---------- Expose integration functions ---------- */
     window.onDragStartIntegration = clickDragUpkeepingPressure;
     window.updateFlowsForWindow = updateFlowsForWindow;
     window.saveFlowConnections = saveFlowConnections;
     window.loadFlowConnections = loadFlowConnections;

}(window, document));
