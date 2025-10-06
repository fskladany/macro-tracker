(function (window, document) {



     function handleIngredientSelection() {
          
          const selectionKey = JSON.parse(document.getElementById('shoppingPurposeKey').value);

          if (selectionKey == "") return;

          const ingredientKey = selectionKey.foodKey;
          const variantKey = selectionKey.variantKey;

          var variants = window.MacroIngredients[ingredientKey].variants;
          if (!variants) {
               variants = {"normal": {}}
          } 
          
          const variantSelectorElem = document.getElementById('ingredientVariant');
          
          while (variantSelectorElem.hasChildNodes()) {
               variantSelectorElem.removeChild(variantSelectorElem.firstChild);
          }
          Object.keys(variants).forEach(nextVariantName => {
               const elemOption = document.createElement('option');
               elemOption.textContent = '[' + nextVariantName + ']';
               if (nextVariantName == variantKey){
                    elemOption.selected=true;
               }
               variantSelectorElem.appendChild(elemOption);

          });
          
          for(var i = 0;i < variantSelectorElem.options.length;i++){
               if(variantSelectorElem.options[i].value == variantKey ){
                    variantSelectorElem.options[i].selected = true;
               }
          }
     }

     function applyIngredientIntent (intent) {
          const purposeKeyEl = document.getElementById('shoppingPurposeKey');
          const variantEl = document.getElementById('ingredientVariant');
          const sourceAreaEl = document.getElementById('SourceAreaName');
          const priceEl = document.getElementById('shoppingPrice');
          const periodEl = document.getElementById('shoppingBuyPeriod');
  
          if (!purposeKeyEl.value) {
               console.log("Please select an ingredient first.");
               return;
          }
  
          const selection = JSON.parse(purposeKeyEl.value);
          const ingredient = selection.foodKey;
          const variant = variantEl.options[variantEl.selectedIndex]?.text || 'default';
          const sourceArea = sourceAreaEl.options[sourceAreaEl.selectedIndex]?.text;
          const price = priceEl.value;
          const buyPeriod = periodEl.value;
  
          var message = `Intent: ${intent}\n` +
                        `  - Ingredient: ${ingredient}\n` +
                        `  - Variant: ${variant}\n` +
                        `  - Source: ${sourceArea}\n` +
                        `  - Price: ${price}\n`;
                        
          if (intent == "bought"){
               message += "  - Bough on:  " + new Date() + '\n';
               message += `  - Next buy  ${buyPeriod} hours later\n`;
               message += `  - Estimated expiration buy  ${buyPeriod / 2} hours later`;
               
          }

          if (intent == "commited"){
               message += `  - Time to buy: ${buyPeriod} hours`;
          }
          
          alert(message);
     }

     var RealIngredients = new Array();

     function createCookButton (actionButton, recipeIngredientKey, ingredientNameElem, ingredientConfigurationKey, ingredientProcessItem){
 
          actionButton.textContent = 'Cook';
          actionButton.classList.add('toggle-cook');
          actionButton.dataset.cookingStart=null;
                         
          const recipeCookTime = 30;
          var totalCookedMinutes = 0;

          const simulationRatio = 30;
          actionButton.dataset.remainingCookMinutes = recipeCookTime;

          actionButton.onclick = function() {
               let cookingStartTime = null;
               console.log("Remaining cook minutes:", actionButton.dataset.remainingCookMinutes);

               const now = new Date();
               if (actionButton.classList.contains('cooking')) {
                    actionButton.classList.remove('cooking');
                    const startTime = new Date(actionButton.dataset.cookingStart);
                    const elapsedMs = now - startTime;
                    const elapsedMinutes = Math.floor( elapsedMs / 1000 / 60);
                    const displayRemaining = Math.max(0, actionButton.dataset.remainingCookMinutes - elapsedMinutes);
                    
               } else {          
                    actionButton.textContent = 'Finish';
                    actionButton.classList.add('cooking');

                    if (actionButton.dataset.cookingStart == "null" ){
                         actionButton.dataset.cookingStart = new Date();
                    } else{
                         const minuteDelta = recipeCookTime - parseFloat(actionButton.dataset.remainingCookMinutes);
                         actionButton.dataset.cookingStart = new Date( Date.now() - recipeCookTime /2 );

                    }
                    recurseUpdate();
                    
               }

               function recurseUpdate() {

                    function cooldownTimer(time){
                         setTimeout(function() {
                              ingredientNameElem.textContent = "♨ " + recipeIngredientKey;
                         }, time);
                    }
                    const startTime = new Date(actionButton.dataset.cookingStart);
                    var elapsedMs = Date.now() - startTime;
                    elapsedMs*=simulationRatio;
                    const minutes = elapsedMs / 60000;

                    console.log(`Adding heat to ${recipeIngredientKey} cooking iteration ms:  ${elapsedMs}`);
                    ingredientNameElem.textContent = "🔥 " + recipeIngredientKey;
                    if (actionButton.classList.contains('cooking')) {
                         const newMinutes = parseFloat(actionButton.dataset.remainingCookMinutes) - minutes;
                         actionButton.textContent = 'Pause (' + newMinutes.toFixed(1) + 'm left)';
                         

                         if (newMinutes  <= 0) {
                              actionButton.classList.remove('cooking');
                              ingredientProcessItem.classList.add('done-cooking');
                              actionButton.textContent = 'Done!';
                              ingredientNameElem.textContent = "♨️ " + recipeIngredientKey;
                              ingredientConfigurationKey['cooked'] = true;
                              ingredientProcessItem.dataset.configuration = JSON.stringify(ingredientConfigurationKey);
                              cooldownTimer(1000*60*15/simulationRatio); // 15 minutes, calc: food.weight * 100c * pan weight ... complicated
                              return true;
                         }
                         setTimeout(recurseUpdate, 1000); // Update every 1 second for demo
                    }
                    else {
                         
                         console.log("paused cooking:" +elapsedMs);
                         
                         if (elapsedMs>1000*60){
                              console.log("Subtracting " + minutes + " minutes from cook time");
                              actionButton.dataset.remainingCookMinutes -= elapsedMs/60000;
                         }
                         ingredientNameElem.textContent = "♨️ " + recipeIngredientKey;

                         cooldownTimer(1000*60*5/simulationRatio);

                         actionButton.textContent = 'Resume (' + parseFloat(actionButton.dataset.remainingCookMinutes).toFixed(1) + 'm left)';
                         console.log("Elapsed ms:", elapsedMs);
                    }
               }
                          
                              
          };
               
     }

     function LoadRecipeContent(recipeDivId) {
        
          const fakeIngredients = [];
          fakeIngredients.push(...RealIngredients);
          document.getElementById(recipeDivId).innerHTML = '';

          fakeIngredients.forEach (recipeIngredientKey => {
               const ingredientProcessItem = document.createElement('div');
               const ingredientConfigurationKey = {};
               ingredientProcessItem.className = 'ingredient-process-item';
          
               const ingredientName = document.createElement('span');
               ingredientName.textContent = recipeIngredientKey;
               ingredientProcessItem.appendChild(ingredientName);

               ingredientConfigurationKey['name'] = recipeIngredientKey;

               const availableIngredientActions = document.createElement('div');
               availableIngredientActions.className = 'ingredient-actions';

               const amountLabel = document.createElement('label');
               amountLabel.for="unique-key";
               amountLabel.innerText="Amount:";
               
              
               
               

               if (recipeIngredientKey === 'Mushrooms') {
                    const actionButton = document.createElement('button');
                    ingredientName.textContent += ' (not available)';
                    actionButton.className = 'subtle';
                    ingredientProcessItem.classList.add('not-available');
                    actionButton.textContent = 'Find Hunting Locations';
                    actionButton.onclick = function() {
                         toggleWindow('shoppingWindow');
                    };
                    availableIngredientActions.appendChild(actionButton);
                    ingredientProcessItem.appendChild(availableIngredientActions);
                    document.getElementById(recipeDivId).appendChild(ingredientProcessItem);
                    return; // Skip adding other buttons for unavailable ingredient
               }

               else if (recipeIngredientKey === 'Spice Mix') {
                    const actionButton = document.createElement('button');
                    actionButton.className = 'subtle';
                    actionButton.textContent = 'Open Sub-recipe';
                    actionButton.onclick = function() {
                         alert('Opening sub-recipe...');
                    };
                    availableIngredientActions.appendChild(actionButton);
               }


               for (let j = 0; j < 3; j++) {
                    const actionButton = document.createElement('button');
                    actionButton.className = 'subtle';

                    if (j === 0) {
                         actionButton.textContent = 'Instructions';
                         const instructionText = window.recipeIngredients[recipeIngredientKey];
                         if (!instructionText){
                              actionButton.textContent = 'Instructions (not available)';
                              actionButton.disabled=true;
                         }
                         actionButton.onclick = function() {
                              alert(instructionText['instructions']);
                              
                         };
                    } else if (j === 1){
                         createCookButton(actionButton, recipeIngredientKey, ingredientName, ingredientConfigurationKey, ingredientProcessItem);
                    }
                     else if (j === 2) {
                         actionButton.textContent = 'Skip';
                         actionButton.onclick = function(){
                              ingredientProcessItem.innerHTML = "";
                              ingredientProcessItem.textContent = recipeIngredientKey + " (skipped)";
                              ingredientProcessItem.classList.add("skipped-recipe-item");
                              ingredientConfigurationKey['skipped'] = true;
                              ingredientProcessItem.dataset.configuration = JSON.stringify(ingredientConfigurationKey);
                         }
                    }

                    
                    availableIngredientActions.appendChild(actionButton);
               }

                const amountElem = document.createElement('input');
               amountElem.type='number';
               amountElem.id="unique-key";
               amountElem.value=1;
               amountElem.placeholder="1=100g";
               amountElem.step=0.1;
               amountElem.style="width: 100px";
               amountElem.classList.add("inputAmount");
               
               const ttlDisplay = document.createElement('span');
               ttlDisplay.className = 'ttl-display';
               ttlDisplay.textContent = 'TTL: 48h';

               ingredientProcessItem.dataset.configuration = JSON.stringify(ingredientConfigurationKey);
               availableIngredientActions.appendChild(ttlDisplay);
               ingredientProcessItem.appendChild(availableIngredientActions);
               ingredientProcessItem.appendChild(amountLabel);
               ingredientProcessItem.appendChild(amountElem);
               document.getElementById(recipeDivId).appendChild(ingredientProcessItem);
               
          })

     }


     function LoadRecipeItemSelection(templateSelectId) {
          const select = document.getElementById(templateSelectId);
          Object.keys(window.recipeIngredients).forEach(key => {
               var variants = window.recipeIngredients[key].variants;
               if (!variants) {
                    variants = {"normal": {}}
               } 

               Object.keys(variants).forEach(variantKey => {
                    const elemOption = document.createElement('option');
                    elemOption.value = JSON.stringify({foodKey: key, variantKey: variantKey});
                    var servingSize = window.recipeIngredients[key].servingSize;
                    if (servingSize == 0) elemOption.disabled = true;
                    if (!servingSize && servingSize != 0) servingSize = 100;
                    elemOption.textContent = window.recipeIngredients[key].name;

                    if (servingSize != 0) {
                         if (variantKey != "normal"){
                              elemOption.textContent += ' [' + variantKey + ']';
                         }

                         elemOption.textContent += ' (' + servingSize + 'g)';
                    }
                    select.appendChild(elemOption);


               })

               
          });
     }

     function addRealIngredient() {
   
          const ingredientOptionValue = JSON.parse(document.getElementById('recipeIngredientSelect').value);

          if (Object.keys(ingredientOptionValue).length === 0) {
               alert("Select recipe ingredient");
               return;
          }

          const ingredientKey = ingredientOptionValue.foodKey;
          const variantKey = ingredientOptionValue.variantKey;
          recipeIngredient = window.recipeIngredients[ingredientKey];
          if (!recipeIngredient) {
               alert("Recipe for ingredient " + ingredientKey + " not found.");
               return;
          }
          //if (!RealIngredients.includes(window.recipeIngredients[ingredientKey].name)) {
          //     RealIngredients.push(window.recipeIngredients[ingredientKey].name);
          //}
           if (variantKey != "normal"){

               RealIngredients.push(ingredientKey + "(" + variantKey + ")");
           }
           else{
               RealIngredients.push(ingredientKey);

           }

           
          LoadRecipeContent('ingredientProcessList');
     }

     function addRawIngredient(ingredientKey) {
          RealIngredients.push(ingredientKey);
          LoadRecipeContent('ingredientProcessList');
     }

     function commitDishState(){
          list = new Array();
          qr = document.querySelectorAll('.ingredient-process-item');
          qr.forEach(ingredientProcessItem => {
               var configuration = JSON.parse(ingredientProcessItem.dataset.configuration);

               if (!configuration['skipped']){
                    const amount = ingredientProcessItem.querySelector('input.inputAmount').value;
              
                    configuration = {
                         ...configuration,
                         amount: amount,
                         ttlLabel: ingredientProcessItem.querySelector('span.ttl-display').innerText,
                    }
               }
               list.push({
                    ...configuration
               });
          })
          return JSON.stringify(list);

     }

     window.Recipe = {
          handleIngredientSelection: handleIngredientSelection,
          applyIngredientIntent: applyIngredientIntent,
          LoadRecipeItemSelection: LoadRecipeItemSelection,
          LoadRecipeContent: LoadRecipeContent,
          addRealIngredient: addRealIngredient,
          addRawIngredient: addRawIngredient,
          commitDishState: commitDishState
     };

})(window, document);