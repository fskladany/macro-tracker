(function (window, document) {

     
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

     function commitIngredientState(){
          alert(window.Recipe.commitDishState());
     }

     window.Hermes = {
          applyIngredientIntent: applyIngredientIntent,
          CommitIngredientState: commitIngredientState
         
     };

})(window, document);