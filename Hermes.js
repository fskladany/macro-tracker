(function (window, document) {

     function ingredientAvailable(ingredientKey) {
          return false;
     }
     function applyIngredientIntent (intent) {
          window.Recipe.applyIngredientIntent(intent);
     }

     function commitIngredientState(){
          alert(window.Recipe.commitDishState());
     }

     window.Hermes = {
          applyIngredientIntent: applyIngredientIntent,
          CommitIngredientState: commitIngredientState,
          ingredientAvailable: ingredientAvailable
         
     };

})(window, document);