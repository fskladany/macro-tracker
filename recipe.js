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

     function LoadRecipeContent(recipeDivId) {
          cont = `				<!-- Ingredient Row 1: Simple -->
			<div class="ingredient-process-item">
				<span>Rice (Basmati)</span>
				<div class="ingredient-actions">
					<button class="subtle" onclick="alert('No instructions for Rice')">Instructions</button>
					<button class="subtle toggle-cook">Cook</button>
					<button class="subtle">Skip</button>
					<span class="ttl-display hidden">TTL: 48h</span>
				</div>
			</div>
			<!-- Ingredient Row 2: Simple -->
			<div class="ingredient-process-item">
				<span>Beef (15% fat)</span>
				<div class="ingredient-actions">
					<button class="subtle" onclick="alert('No instructions for Beef')">Instructions</button>
					<button class="subtle toggle-cook">Cook</button>
					<button class="subtle">Skip</button>
					<span class="ttl-display hidden">TTL: 48h</span>
				</div>
			</div>
			<!-- Ingredient Row 3: Sub-recipe -->
			<div class="ingredient-process-item">
				<span>Spice Mix</span>
				<div class="ingredient-actions">
					<button class="subtle" onclick="alert('Opening sub-recipe...')">Open Sub-recipe</button>
					<button class="subtle toggle-cook">Cook</button>
					<button class="subtle">Skip</button>
					<span class="ttl-display hidden">TTL: 48h</span>
				</div>
			</div>
			<!-- Ingredient Row 4: Unavailable -->
			<div class="ingredient-process-item not-available">
				<span>Mushrooms (not available)</span>
				<div class="ingredient-actions">
					<button class="subtle" onclick="toggleWindow('shoppingWindow')">Find
						Hunting Locations</button>
				</div>
			</div>`;

          const fakeIngredients = ['Rice', 'Beef', 'Spice Mix', 'Mushrooms'];
          document.getElementById(recipeDivId).innerHTML = '';
          
          // For demonstration, create 4 sample ingredient items
          for (let i=0; i<4; i++) {
               const ingredientProcessItem = document.createElement('div');
               ingredientProcessItem.className = 'ingredient-process-item';
          
               const ingredientName = document.createElement('span');
               ingredientName.textContent = fakeIngredients[i];
               ingredientProcessItem.appendChild(ingredientName);

               const availableIngredientActions = document.createElement('div');
               availableIngredientActions.className = 'ingredient-actions';

               if (fakeIngredients[i] === 'Mushrooms') {
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
                    continue; // Skip adding other buttons for unavailable ingredient
               }

               else if (fakeIngredients[i] === 'Spice Mix') {
                    const actionButton = document.createElement('button');
                    actionButton.className = 'subtle';
                    actionButton.textContent = 'Open Sub-recipe';
                    actionButton.onclick = function() {
                         alert('Opening sub-recipe...');
                    };
                    availableIngredientActions.appendChild(actionButton);
               }

                 else if (fakeIngredients[i] === 'Beef') {
                    const actionButton = document.createElement('select');
                    actionButton.innerHTML = '<option>15% fat</option>';
                    actionButton.innerHTML += '<option>30% fat</option>';
                    availableIngredientActions.appendChild(actionButton);
               }

               for (let j = 0; j < 3; j++) {
                    const actionButton = document.createElement('button');
                    actionButton.className = 'subtle';

                 

                    if (j === 0) {
                         actionButton.textContent = 'Instructions';
                         actionButton.onclick = function() {
                              alert('No instructions available.');
                         };
                    } else if (j === 1) {
                         actionButton.textContent = 'Cook';
                         actionButton.classList.add('toggle-cook');
                    } else if (j === 2) {
                         actionButton.textContent = 'Skip';
                    }
                    availableIngredientActions.appendChild(actionButton);
               }

               const ttlDisplay = document.createElement('span');
               ttlDisplay.className = 'ttl-display hidden';
               ttlDisplay.textContent = 'TTL: 48h';
               availableIngredientActions.appendChild(ttlDisplay);
               ingredientProcessItem.appendChild(availableIngredientActions);
               document.getElementById(recipeDivId).appendChild(ingredientProcessItem);
          }

          
         

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
                    var multiplier = window.recipeIngredients[key].servingSize;
                    if (multiplier == 0) elemOption.disabled = true;
                    if (!multiplier && multiplier != 0) multiplier = 100;
                    elemOption.textContent = window.recipeIngredients[key].name;

                    if (multiplier != 0) {
                         if (variantKey != "normal"){
                              elemOption.textContent += ' [' + variantKey + ']';
                         }
                         
                         elemOption.textContent += ' (' + multiplier + 'g)';
                    }
                    select.appendChild(elemOption);


               })

               
          });
     }

     window.Shopper = {
          handleIngredientSelection: handleIngredientSelection,
          applyIngredientIntent: applyIngredientIntent,
          LoadRecipeItemSelection: LoadRecipeItemSelection,
          LoadRecipeContent: LoadRecipeContent
     };

})(window, document);