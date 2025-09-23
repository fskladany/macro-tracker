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
          
          console.log(message);
          alert(message);
     }

     window.Shopper = {
          handleIngredientSelection: handleIngredientSelection,
          applyIngredientIntent: applyIngredientIntent
     };

})(window, document);