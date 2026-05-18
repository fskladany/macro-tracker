window.RecipeItems = {
     _1:              { name: "--- dishes ---", servingSize: 0 },

     grilledChicken: {
          name: 'grilled chicken', 
          isRecipe: true, // e.g. has sub-items eval
          servingSize: 300,
          subItems: [
               { key: 'chicken', amount: 150, waterInfusionRatio: -0.5 }, // 150g chicken, dried out by 50%
               { key: 'boiledRice', amount: 150 },          // 50g raw rice, boiled in 2x water
               { key: 'oil', amount: 10 },
               { key: 'salt', amount: 0.005 },
               { key: 'pepper', amount: 0.002 }
          ],
          instructions: "Marinate chicken with oil, salt, and pepper. Grill until cooked through."
     },

     grilledBeefWithRice: {
          name: 'grilled beef with rice',
          servingSize: 300,
          subItems: [
               { key: 'grilledBeef', amount: 120, waterInfusionRatio: -0.01 }, // account for extra 1% weight loss due to reheating
               { key: 'boiledRice', amount: 50, waterInfusionRatio: 0.01 },    // account for extra 10g due to rehydration
               { key: 'mushrooms', amount: 50},
               { key: 'garlic', amount: 0.5 },
          ],
          instructions: "Prepare grilled beef and boiled rice. Serve together."
     },

     grilledBeef: {
          name: 'grilled beef', 
          servingSize: 250,
          subItems: [
               { key: 'beef', amount: 150, waterInfusionRatio: -0.2 }, // 150g beef, dried out by 20%
               { key: 'oil', amount: 10 },
               { key: 'salt', amount: 0.005 },
               { key: 'pepper', amount: 0.005 },
              

          ],
          instructions: "Preheat pan to scorching heat to induce maillard reaction. Marinate beef with oil, salt, pepper, and garlic. Grill to desired doneness."
     },

     boiledEgg: {
          name: 'boiled egg', servingSize: 50,
          subItems: [
               { key: "egg", amount: 1 },
               { key: "salt", amount: 0.05 }
          ],
          instructions: "Boil the egg for 8-10 minutes. Cool, peel, and season with salt.",
     },

     boiledRice: {
          name: 'boiled rice', servingSize: 500,
          waterInfusionRatio: 3,

          subItems: [
               { key: "rice", amount: 2.5 }

          ],
          instructions: "Cook rice according to package instructions.",
     },

     spaghettiWithSausage: {
          name: 'spaghetti with sausage', servingSize: 500,
          subItems: [
               { key: "spaghetti", amount: 200 },
               { key: "garlic", amount: 50 },
               { key: "tomato", amount: 100 },
               { key: "salt", amount: 3 },
               { key: "pepper", amount: 3 },
               { key: "sausage", amount: 100 }
          ],
          instructions: "Cook spaghetti according to package instructions. Brown sausage in a pan and combine."
     }
}