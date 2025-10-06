window.recipeIngredients = {

     // Example templates
     // add {verified: true} to permit copilot templating

     _1: { name: "--- protein ---", servingSize: 0 },
     boiledEgg: {
          name: 'boiled egg', servingSize: 50,
          subIngredients: {
               0: "egg",
               1: "salt"
          },
          instructions: "Boil the egg for 8-10 minutes. Cool, peel, and season with salt.",
     },

     boiledRice: {
          name: 'boiled rice', servingSize: 500,
          subIngredients: {
               0: "rice"
          },
          instructions: "Cook rice according to package instructions.",
     },


     grilledChicken: {
          name: 'grilled chicken', servingSize: 400,
          subIngredients: {
               0: "chicken",
               1: ["rice", "frenchFries"],
               2: "oil",
               3: "salt",
               4: "pepper"
          },
          instructions: "Marinate chicken with oil, salt, and pepper. Grill until cooked through.",
     },

     grilledBeef: {
          name: 'grilled beef', servingSize: 500,
          subIngredients: {
               0: "beef",
               1: "oil",
               2: "salt",
               3: "pepper",
               4: "garlic",
               5: "mushrooms"
          },
          instructions: "Preheat pan to scorching heat to induce maillard reaction. Marinate beef with oil, salt, pepper, and garlic. Grill to desired doneness.",
          variants: {
               'rare': { servingSize: 180 },
               'medium': { servingSize: 200 },
               'well-done': {
                    servingSize: 220,
                    subIngredients: { // this may not work as intended
                         5: null
                    }
               }

          }
     }
     // Add more templates as needed
};