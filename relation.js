(function (window, document) {
     let svg = null;
     const flows = []; // { fromId, toId, pathEl }
     let tempFlow = null;
     let currentSource = null;
          let animationFrameId = null; // To keep track of the animation frame

     document.addEventListener("DOMContentLoaded", () => {
          svg = document.querySelector(".flow-canvas");
          loadFlows(); // load saved flows on page load
     });

     /* ---------- Integration with draggable ---------- */
     function onDragStartIntegration(e) {
          const anchorEl = e.target.closest && e.target.closest('.anchor');
          if (anchorEl) {
               document.body.classList.add("dragging-anchor");
               startConnectionFromAnchor(anchorEl, e);
               return true; // handled
          }
          return false;
     }

     /* ---------- Connection workflow ---------- */
     function startConnectionFromAnchor(anchorEl, origEvent) {
          const fromId = anchorEl.dataset.id;
          if (flows.some(f => f.fromId === fromId || f.toId === fromId)) {
               // Not necessary
               // anchorEl.classList.add('active');
               // setTimeout(() => anchorEl.classList.remove('active'), 250);
               return;
          }

          currentSource = fromId;
          tempFlow = createPath();
          tempFlow.classList.add("temporary");
          svg.appendChild(tempFlow);

          window.addEventListener('pointermove', followPointer);
          window.addEventListener('pointerup', finishConnection);

          followPointer(origEvent);
     }

     function createPath() {
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.classList.add('flow-line');
          return p;
     }

     function getAnchorPosition(id) {
          const anchor = document.querySelector(`.anchor[data-id="${CSS.escape(id)}"]`);
          if (!anchor || !svg) return null;
          const svgRect = svg.getBoundingClientRect();
          const r = anchor.getBoundingClientRect();
          return {
               x: r.left + r.width / 2 - svgRect.left,
               y: r.top + r.height / 2 - svgRect.top
          };
     }

     function drawFlow(pathEl, fromX, fromY, toX, toY) {
          const cp1x = (fromX + toX) / 2;
          const cp1y = fromY;
          const cp2x = (fromX + toX) / 2;
          const cp2y = toY;
          pathEl.setAttribute('d', `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`);
     }

     function followPointer(e) {
          if (!tempFlow || !currentSource) return;

          // Cancel any pending frame to avoid drawing with stale data
          if (animationFrameId) {
               cancelAnimationFrame(animationFrameId);
          }
          // Schedule the path update for the next animation frame
          animationFrameId = requestAnimationFrame(() => {
               const fromPos = getAnchorPosition(currentSource);
               if (!fromPos || !svg) return;
               const svgRect = svg.getBoundingClientRect();
               drawFlow(tempFlow, fromPos.x, fromPos.y, e.clientX - svgRect.left, e.clientY - svgRect.top);
               animationFrameId = null; // Reset after execution
          });
     }

     function finishConnection(e) {
          // Cancel any scheduled frame as we are finishing the connection
          if (animationFrameId) {
               cancelAnimationFrame(animationFrameId);
               animationFrameId = null;
          }

          window.removeEventListener('pointermove', followPointer);
          window.removeEventListener('pointerup', finishConnection);
          document.body.classList.remove("dragging-anchor");

          const hitEls = document.elementsFromPoint(e.clientX, e.clientY);
          const targetAnchor = hitEls.find(el => el.classList && el.classList.contains('anchor'));

          if (targetAnchor) {
               alert("Has target anchor", targetAnchor);
               const toId = targetAnchor.dataset.id;
               if (toId === currentSource || flows.some(f => f.fromId === toId || f.toId === toId)) {
                    tempFlow.remove();
                    tempFlow = null;
                    currentSource = null;
                    return;
               }

               const fromPos = getAnchorPosition(currentSource);
               const toPos = getAnchorPosition(toId);
               drawFlow(tempFlow, fromPos.x, fromPos.y, toPos.x, toPos.y);
               lockFlow(tempFlow, currentSource, toId);
               saveFlows();
  
               //This does not seem necessary
               //document.querySelector(`[data-id="${currentSource}"]`)?.classList.remove('active');
               //document.querySelector(`[data-id="${toId}"]`)?.classList.add('active');

               tempFlow = null;
               currentSource = null;
          } else {
               tempFlow.remove();
               tempFlow = null;
               currentSource = null;
          }
     }

     function lockFlow(pathEl, fromId, toId) {
          pathEl.classList.remove('temporary', 'dragging-anchor');
          // Add data attributes to the path for easier identification
          pathEl.dataset.fromId = fromId;
          pathEl.dataset.toId = toId;
          // Check if the flow already exists before pushing
          if (!flows.some(f => f.fromId === fromId && f.toId === toId)) {
               flows.push({ fromId, toId, pathEl });
          }
          pathEl.addEventListener('click', () => removeFlowByElement(pathEl));
     }

     /* ---------- Flow management ---------- */
     function removeFlowByElement(pathEl) {
          if (!pathEl) return;

          const fromId = pathEl.dataset.fromId;
          const toId = pathEl.dataset.toId;


          if (!pathEl.classList.contains('clicked-path')){
               pathEl.classList.add('clicked-path');
               return true;
          }

          pathEl.classList.remove('clicked-path');
          
          // Find the index of the flow using the reliable fromId and toId
          const idx = flows.findIndex(f => f.fromId === fromId && f.toId === toId);

          if (idx !== -1) {
               flows.splice(idx, 1); // Remove from the array
               pathEl.remove(); // Remove from the DOM
               saveFlows(); // Save the changes
          }
     }

     function redrawAllFlows() {
          if (animationFrameId) {
               cancelAnimationFrame(animationFrameId);
          }
          animationFrameId = requestAnimationFrame(() => {
               flows.forEach(f => {
                    const fromP = getAnchorPosition(f.fromId);
                    const toP = getAnchorPosition(f.toId);
                    if (fromP && toP) drawFlow(f.pathEl, fromP.x, fromP.y, toP.x, toP.y);
               });
               animationFrameId = null;
          });
     }

     function updateFlowsForNode(nodeId) {
          flows.forEach(f => {
               if (f.fromId === nodeId || f.toId === nodeId) {
                    const fromP = getAnchorPosition(f.fromId);
                    const toP = getAnchorPosition(f.toId);
                    if (fromP && toP) drawFlow(f.pathEl, fromP.x, fromP.y, toP.x, toP.y);
               }
          });
     }

     function saveFlows() {
          localStorage.setItem("flows", JSON.stringify(flows.map(f => ({ fromId: f.fromId, toId: f.toId }))));
     }

     function loadFlows() {
          // Clear existing flows to prevent duplication on reload
          flows.length = 0;
          const stored = localStorage.getItem("flows");
          if (stored) {
               const arr = JSON.parse(stored);
               arr.forEach(f => {
                    const fromAnchor = document.querySelector(`.anchor[data-id="${f.fromId}"]`);
                    const toAnchor = document.querySelector(`.anchor[data-id="${f.toId}"]`);
                    if (fromAnchor && toAnchor) {
                         const pathEl = createPath();
                         
                         const fromPos = getAnchorPosition(f.fromId);
                         const toPos = getAnchorPosition(f.toId);
                         drawFlow(pathEl, fromPos.x, fromPos.y, toPos.x, toPos.y);
                         lockFlow(pathEl, f.fromId, f.toId);
                         svg.appendChild(pathEl);
                    }
               });
          }
     }
     window.addEventListener('resize', redrawAllFlows, true);
     /* ---------- Expose integration functions ---------- */
     window.onDragStartIntegration = onDragStartIntegration;
     window.updateFlowsForNode = updateFlowsForNode;
     window.saveFlows = saveFlows;
     window.loadFlows = loadFlows;

}(window, document));
