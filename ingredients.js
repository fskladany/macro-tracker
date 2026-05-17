window.MacroIngredients = templates = {

     // Example templates
     // add {verified: true} to permit copilot templating
     _0:              { name: "--- sports ---", servingSize: 0 },
     running:         { name: 'running (400kcal)', protein: -25, carbs: -75, servingSize: 100 },
     

     _1:              { name: "--- protein ---", servingSize: 0 },
     egg:             { name: 'egg', carbs: 0.7, protein: 12.6, fat: 9.6,     servingSize: 50 },
     chicken:         { name: 'chicken', carbs: 0.3, protein: 31, fat: 3,
          variants: {
               "raw": { protein: 22 },
               "cooked": {}
          }
     },
     beef:            { name: 'beef', fat: 8, protein: 26, carbs: 0, servingSize: 100 },
     groundBeef:      { name: 'ground beef', fat: 15, protein: 26, carbs: 0, servingSize: 100,
          variants: { 
                '15% fat' : {fat: 15}, '30% fat': {fat: 30, protein: 18}
          }
     },

     ham:             { name: 'ham (Hyza)', fat: 19.1, carbs: 2, protein: 11.3},

      
     _2:              { name: "--- fat ---", servingSize: 0 },
     sausage:         { carbs: 1.4, protein: 13.5, fat: 21.5, name: 'sausage (Fresh)', servingSize: 200 },
     cheddar:         { name: 'cheddar (Labas)', fat: 31, protein: 25, servingSize: 30},
     butter:          { name: 'butter', fat: 81, protein: 0.9, carbs: 0.1, servingSize: 10 },
     oil:             { name: 'oil', fat: 100, protein: 0, carbs: 0, servingSize: 10 },
     mayo:            { name: 'mayonnaise', fat: 70, protein: 1, carbs: 1, servingSize: 15 },

     _3:              { name: "--- carbs ---", servingSize: 0 },
     instantRice:     { name: 'Instant rice', carbs: 75, protein: 9.3, fat: 6.5, servingSize: 50, salt: 0.25, waterInfusionRatio: 3,
          variants: { 'Dr. Oetker': {} }
     },
     cinnamonShells: { name: 'Cinnamon shells', fat: 3.9, carbs: 74, protein: 9.1, salt: 0.25, servingSize: 150,
          variants: { "Fresh": {} }
      },
     chocolateOrbs:  { name: 'Chocolate orbs', fat: 5.7, carbs: 75, protein: 7.8, fiber: -1, salt: 0.51, servingSize: 150,
          variants: { 
               "Fresh": {}
          }
     },
     
     spaghetti:       { name: 'Spaghetti', fat: 1.4, carbs: 69, fiber: 3.1, protein: 14.5, servingSize: 500,
          variants: { 'Favourites (Kaufland)': {} }
      },
     
     potato:          { name: 'Potato', carbs: 20, protein: 2.6, fat: 0.4, },
     oats:            { name: 'Oats', carbs: 62, fat: 5.7, protein: 12, servingSize: 50 },
     rice:            { name: 'Rice (Máyna)', carbs: 77, protein: 8, fat: 0.3,
                      variants: {
                        "raw": {},
                        "boiled 75% water": { carbs: 77/4, protein: 8/4, fat: 0.3/4, waterInfusionRatio: 3},
                      }
     },
     bread:           { name: 'bread (Vamex)', carbs: 41.5, protein: 8.3, fat: 1.3, servingSize: 60 },
     cornflakes:      { name: "cornflakes (Kellogg's)", fat: 1.2, protein: 7.5, carbs: 84, servingSize: 30 },
     fruitFilPierogi: { name: "Fruit-filled pirohy (plum jam)", carbs: 35, protein: 5, fat: 3.5, servingSize: 150},
     fries:           { name: 'french fries', carbs: 20, protein: 3.5, fat: 14.8,     },
     breadRoll:       { name: "bread roll (Vamex)", fat: 5, protein: 10.8, carbs: 67.7, servingSize: 50 },
     pasta:           { name: "pasta (generic)", fat: 1.5, protein: 13, carbs: 75.3 },

     _4:              { name: "--- fiber boost ---", servingSize: 0 },
     splitPeas:       { name: 'Split peas', carbs: 40, protein: 23, fat: 1.4, servingSize: 500,
          variants: { 'yellow': {} }
     },
     whiteBeans:      { name: 'Beans (white)', carbs: 60, protein: 22.5, fat: 0.9, fiber: 15.2, servingSize: 500,
          variants: { 'normal': {}, 'canned': { carbs: 14, protein: 5.2, fat: 0.3, fiber: 3.5 } }
     },
     carrot:          { name: 'carrot', carbs: 9.6, protein: 0.9, fat: 0.2,   servingSize: 80 },
     cucumber:        { name: 'cucumber', carbs: 3.6, protein: 0.7, fat: 0.1, servingSize: 100 },
     tomato:          { name: 'tomato', carbs: 3.9, protein: 0.9, fat: 0.2,   servingSize: 100 },
     lettuce:         { name: 'lettuce', carbs: 2.9, protein: 1.4, fat: 0.2,  servingSize: 50 },
     mushrooms:       { name: 'mushrooms', carbs: 3.3, protein: 3.1, fat: 0.3, servingSize: 100 },
     garlic:          { name: 'garlic', carbs: 33, protein: 6.4, fat: 0.5,     servingSize: 10 },

     _5:              { name: "--- quick dishes & snacks ---", servingSize: 0 },
     porkSauce:       { name: "pork sauce (Lunter)", servingSize: 150, fat: 25, carbs: 5.8, protein: 8.1 },
     butter:          { fat: 66, cabs: 33, name: 'butter and honey', servingSize: 20 },
     arashidNut:      { name: "arashid nut", fat: 50, carbs: 6.6, protein: 26, salt: 0.78, fiber: 12 },
     pistachioNut:    { name: "pistachio nut", fat: 50, carbs: 8.9, protein: 24, salt: 1.4, fiber: 9.4 },
     cannedGoulash:   { name: "canned goulash (viva?)", servingSize: 400, fat: 4.3, carbs: 4.1, protein: 4.8, salt: 1.2, waterInfusionRatio: 4.71 },
     apple:           { name: 'apple', carbs: 13.8, protein: 0.3, servingSize: 140 },
     banana:          { name: 'banana', carbs: 23, protein: 1.1, fat: 0.3,     servingSize: 120 },
     orange:          { name: 'orange', carbs: 11.8, protein: 0.9, fat: 0.1, servingSize: 130 },

     _6:              { name: "--- dishes ---", servingSize: 0 },

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
     },

     _7: { name: "--- spices & extras ---", servingSize: 0 },
     salt:            { name: 'salt', servingSize: 10, salt: 100 },
     pepper:          { name: 'pepper', servingSize: 10, fiber: 0.1},

     // Add more templates as needed
};
