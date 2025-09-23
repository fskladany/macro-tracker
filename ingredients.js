window.MacroIngredients = templates = {

               // Example templates
               // add {verified: true} to permit copilot templating

               _1:              { name: "--- protein ---", servingSize: 0 },
               egg:             { name: 'egg', carbs: 0.7, protein: 12.6, fat: 9.6,     servingSize: 50 },
               chicken:         { name: 'chicken', carbs: 0.3, protein: 31, fat: 3 },
               beef:            { name: 'beef', fat: 8, protein: 26, carbs: 0, servingSize: 100 },
               fish:            { name: 'fish', fat: 3, protein: 17.1, carbs: 0.16, servingSize: 170,     },
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
               potato:          { name: 'potato', carbs: 20, protein: 2.6, fat: 0.4, },
               oats:            { name: 'oats', carbs: 62, fat: 5.7, protein: 12, servingSize: 50 },
               rice:            { name: 'rice raw (Máyna)', carbs: 77, protein: 8, fat: 0.3 },
               bread:           { name: 'bread (Vamex)', carbs: 41.5, protein: 8.3, fat: 1.3, servingSize: 60 },
               orange:          { name: 'orange', carbs: 11.8, protein: 0.9, fat: 0.1, servingSize: 130 },
               fruitFilPierogi: { name: "Fruit-filled pirohy (plum jam)", carbs: 35, protein: 5, fat: 3.5, servingSize: 150},

               fries:           { name: 'french fries', carbs: 20, protein: 3.5, fat: 14.8,     },
               breadRoll:       { name: "bread roll (Vamex)", fat: 5, protein: 10.8, carbs: 67.7, servingSize: 50 },
               pasta:           { name: "pasta (generic)", fat: 1.5, protein: 13, carbs: 75.3 },
               cornflakes:      { name: "cornflakes (Kellogg's)", fat: 1.2, protein: 7.5, carbs: 84, servingSize: 30 },

               apple:           { name: 'apple', carbs: 13.8, protein: 0.3, servingSize: 140 },
               banana:          { name: 'banana', carbs: 23, protein: 1.1, fat: 0.3,     servingSize: 120 },


               _4:              { name: "--- side dishes ---", servingSize: 0 },
               porkSauce:       { name: "pork sauce (Lunter)", servingSize: 150, fat: 25, carbs: 5.8, protein: 8.1 },
               butter:          { fat: 66, cabs: 33, name: 'butter and honey', servingSize: 20 },


               // Add more templates as needed
          };