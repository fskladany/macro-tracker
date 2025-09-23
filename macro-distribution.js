(function(window, document) {
     const ingredients = window.MacroIngredients;
     const dailyGoals = window.BusinessPermission.dailyGoals;

     // Function to add an entry
     function addEntry() {
          const confirm = "I promise";
          const gate_keeper = prompt('Type "' + confirm + '" to confirm adding an entry.', "Gatekeeper");
          if (gate_keeper != confirm) {
               alert("Entry not added. Confirmation text did not match.");
               return;
          }

          const carbs = parseFloat(document.getElementById('carbs').value) || 0;
          const protein = parseFloat(document.getElementById('protein').value) || 0;
          const fat = parseFloat(document.getElementById('fat').value) || 0;
          const comment = document.getElementById('comment').value;
          const ts = new Date().getTime();
          const entry = { ts, carbs, protein, fat, comment };
          const entries = JSON.parse(localStorage.getItem('macroEntries')) || [];
          entries.push(entry);
          localStorage.setItem('macroEntries', JSON.stringify(entries));
          displayHistoryTable();
          updateDailyTotals();
     }

     // Function to update the table with entries
          function displayHistoryTable() {
          const entries = JSON.parse(localStorage.getItem('macroEntries')) || [];
          entries.sort((a, b) => new Date(b.ts) - new Date(a.ts));

          let whistle_index = entries.length;
          entries.forEach ((entry) => {
               whistle_index--;
               entry['index'] = whistle_index;
          })
          // Save back to local storage
          localStorage.setItem('macroEntries', JSON.stringify(entries));

          const historyTable = document.getElementById('historyEntries');

          // Sort entries by date in descending order
          entries.sort((a, b) => new Date(b.ts) - new Date(a.ts));

          // Clear all rows except the header
          historyTable.innerHTML = historyTable.rows[0].innerHTML;

          // Add each entry to the table

          entries.forEach(entry => {

               const row = historyTable.insertRow();
               delete entry["fiber"] // legacy data workaround
               delete entry["date"]
               // Convert entry object to an array of its values
               let tsdate = new Date(entry.ts)
               var d_date;
               var long_date = new Date(entry.ts).toLocaleString();

               if (new Date().getTime() - entry.ts < 24 * 60 * 60 * 1000) {
                    const pad = num => ("0" + num).slice(-2);
                    let hours = tsdate.getHours()
                    let minutes = tsdate.getMinutes()
                    d_date = pad(hours) + ":" + pad(minutes) 
               } else if (document.getElementById('fullEatingHistoryCheckbox').checked == false) {
                         return;
               } else {
                    d_date = long_date;
               }
                    
               entry = { date: d_date, ...entry }
               index = entry['index'];
               
               
               
               // Iterate over each entry value
               const cell = row.insertCell();
               cell.textContent = "#" + index;
               cell.id="hrow-" + entry['ts']

               cell.onclick= function() {
                    let user_date = prompt("Change date to: (YYYY-MM-DD HH:SS)", long_date);

                    var new_ts = new Date(user_date).getTime();
                    if (user_date == null) {
                         return;
                    }
                    if (isNaN(new_ts)) {
                         alert("invalid date");
                         return;
                    } 

                    const meal_number = entries.filter(entry=>{return entry.ts== new_ts;}).length;

                    if (meal_number > 0 ) {
                         alert("conflicting time!");
                         return;
                    }

                    var found_edit = false;
                    const updated_entries = entries.filter(static_entry => {
                         const filter_opt = 'hrow-' + static_entry['ts']
                         if (filter_opt == this['id']){ alert('found'); found_edit=true; }
                         return filter_opt != this['id']
                    })
                    if (found_edit){
                         updated_entries.push({ ...entry,     date: d_date, ts: new_ts,})
                         localStorage.setItem('macroEntries', JSON.stringify(updated_entries));
                         displayHistoryTable();
                    }     

               }

          
          delete entry["index"]
          delete entry["ts"]
          const entryValues = Object.values(entry);
               
               entryValues.forEach((value, index) => {
                    const cell = row.insertCell();
                    // Check if the current cell is not the comment cell
                    // Assuming comment is the last in the entry object, hence the last index
                    if (index < entryValues.length - 1 && index != 0) {
                         cell.textContent = value + 'g'; // Add 'g' for gram
                    } else {
                         cell.textContent = value; // No 'g' for the comment
                    }
               });
          });
     }

     // Function to update the total with a threshold
               function updateTotalWithThreshold(elementId, total, goal) {
                    const element = document.getElementById(elementId);
                    element.textContent = total.toFixed(0);
                    const percentage = (total / goal) * 100;

                    // Reset class
                    element.className = '';

                    // Change color based on the percentage of the goal reached
                    if (percentage >= 100) {
                         element.classList.add('goal-reached');
                    }
                    else if (percentage >= 50) {
                         element.classList.add('halfway-there');
                    }


          }
     

     // Function to update the daily stats in the sidebar
     function updateDailyTotals() {
          const today = new Date().toISOString().split('T')[0];
          const entries_list = JSON.parse(localStorage.getItem('macroEntries')) || [];
          let totalCarbs = 0, totalProtein = 0, totalFat = 0;
          let totalWeight = 0; // More accurate total weight
          let totalCalories = 0; // Total calories


          const ts = new Date().getTime();
          const todaysEntries = entries_list.filter(entry => {
               return new Date(entry.ts).toISOString().split('T')[0] == today
          });

          const totals24 = entries_list.filter(entry => {

               return ts - new Date(entry.ts).getTime() < 24 * 60 * 60 * 1000
          });


          // Calculate total weight and calories
          todaysEntries.forEach(entry => {
               totalCarbs += parseFloat(entry.carbs);
               totalProtein += parseFloat(entry.protein);
               totalFat += parseFloat(entry.fat);
               // Calculate calories
               totalCalories += (parseFloat(entry.carbs) + parseFloat(entry.protein)) * 4 + parseFloat(entry.fat) * 9;
          });


          // Calculate a more accurate weight using the approximations
          totalWeight = (totalCarbs) * 1 + totalProtein * 1.35 + totalFat * 1.1;

          updateTotalWithThreshold('totalCalories', totalCalories, dailyGoals.calories);
          updateTotalWithThreshold('totalCarbs', totalCarbs, dailyGoals.carbs);
          updateTotalWithThreshold('totalProtein', totalProtein, dailyGoals.protein);
          updateTotalWithThreshold('totalFat', totalFat, dailyGoals.fat);

          totalWeight = 0
          totalCalories = 0
          totalCarbs = 0
          totalProtein = 0
          totalFat = 0
          // Calculate total weight and calories, 24h
          totals24.forEach(entry => {
               totalCarbs += parseFloat(entry.carbs);
               totalProtein += parseFloat(entry.protein);
               totalFat += parseFloat(entry.fat);
               // Calculate calories
               totalCalories += (parseFloat(entry.carbs) + parseFloat(entry.protein)) * 4 + parseFloat(entry.fat) * 9;
          });

          totalWeight = (totalCarbs) * 1 + totalProtein * 1.35 + totalFat * 1.1;

          document.getElementById('t24weight').textContent = totalWeight.toFixed(0);
          //updateTotalWithThreshold('t24calories', totalCalories, dailyGoals.calories);
          document.getElementById('t24calories').textContent = totalCalories.toFixed(0);

          DisplayDailyTotals();
     }

     function insertMonthlyTrailTable() {
          const table = document.createElement('table');
          const thead = table.createTHead();
          const headerRow = thead.insertRow();
          const headers = ['Date', 'Protein (g)', 'Calories (kcal)', 'Weight (g)' ];

          headers.forEach(headerText => {
               const header = document.createElement('th');
               header.textContent = headerText;
               headerRow.appendChild(header);
          });

          const tbody = table.createTBody();

          var entries = JSON.parse(localStorage.getItem('macroEntries')) || [];
          const dailyTotals = {};
          entries.sort((a, b) => new Date(b.ts) - new Date(a.ts));

          const dayDelta = 24 * 60 * 60 * 1000;
          // Get the last 28 days
          /*entries = entries.filter(entry => {
               const entryDate = new Date(entry.ts);
               return entryDate >= new Date(Date.now() - 28 * dayDelta);
          });*/

          entries.forEach(entry => {
               const { ts, carbs, protein, fat } = entry;
               const date = new Date(ts).toISOString().split('T')[0]
               // Initialize the object for the date if it doesn't exist
               if (!dailyTotals[date]) {
                    dailyTotals[date] = { carbs: 0, protein: 0, fat: 0, calories: 0, weight: 0 };
               }
               // Add checks to ensure the properties are numbers
               dailyTotals[date].carbs += Number(carbs) || 0;
               dailyTotals[date].protein += Number(protein) || 0;
               dailyTotals[date].fat += Number(fat) || 0;
               // Calculate calories and weight
               dailyTotals[date].calories += ((Number(carbs) || 0) + (Number(protein) || 0)) * 4 + (Number(fat) || 0) * 9;
               dailyTotals[date].weight += (Number(carbs) || 0) + (Number(protein) || 0) * 1.35 + (Number(fat) || 0) * 1.1;
          });


          Object.keys(dailyTotals).forEach(date => {
               const totals = dailyTotals[date];
               
               const row = tbody.insertRow();
               row.insertCell().textContent = date;

               // Row Protein
               const prot = row.insertCell()
               prot.textContent = totals.protein.toFixed(0);
               if (totals.protein >= dailyGoals.protein) {
                    prot.textContent = "✅" + totals.protein.toFixed(0);
               }

               // Row Calories
               const calories = row.insertCell()
               calories.textContent = totals.calories.toFixed(0); // Add calories
               if (totals.calories >= dailyGoals.calories) {
                    calories.textContent = "✅" + totals.calories.toFixed(0);
               }

               // Row Weight
               row.insertCell().textContent = (totals.carbs * 1 + totals.fat * 1.1 + totals.protein * 1.35).toFixed(0);
               


          });

          return table;
     }



     function DisplayDailyTotals() {
          // Implementation for displaying daily totals

          const monthly_trail_table = insertMonthlyTrailTable();
          const elem_table_parent = document.getElementById('monthlyTrailTableWrapper');
          elem_table_parent.innerHTML = ''; // Clear any existing table
          elem_table_parent.appendChild(monthly_trail_table);
     }

     function undoLastEntry() {
          const entries = JSON.parse(localStorage.getItem('macroEntries')) || [];
          entries.shift();
          localStorage.setItem('macroEntries', JSON.stringify(entries));
          displayHistoryTable();
          updateDailyTotals();
     }

     function pasteEntries() {
               let entries_string = prompt("Paste entries JSON", "");
               if (entries_string != null) {
                    const entries = JSON.parse(entries_string) || [];
                    // Save back to local storage
                    localStorage.setItem('macroEntries', JSON.stringify(entries));

               }
               displayHistoryTable();
               updateDailyTotals();
          }

     function getEntriesJSON() {
          var entries = localStorage.getItem('macroEntries');
          // Copy the text inside the text field
          navigator.clipboard.writeText(entries);

           alert("Copied the text: " + entries);

}



     function makeFoodItemTemplate(templateKey, variantKey) {
          const ingredientTemplateData = structuredClone(ingredients[templateKey]);
          const variants = ingredientTemplateData['variants'];
          if (variantKey != "normal"){
               var variantUpdateData = variants[variantKey];
               if ( variantUpdateData == null){
                    alert("Did not find variant data");
               }
               Object.keys(variantUpdateData).forEach(copyKey => {
                    ingredientTemplateData[copyKey] = variantUpdateData[copyKey];
               })
          }
          
          const multiplierInput = document.getElementById('multiplier').value;
          const multiplier = multiplierInput || (ingredientTemplateData.servingSize || 100) / 100;
          if (ingredientTemplateData) {
               const resulting_carbs = ingredientTemplateData.carbs * multiplier || 0;
               const resulting_protein = ingredientTemplateData.protein * multiplier || 0;
               const resulting_fat = ingredientTemplateData.fat * multiplier || 0;
               const variant_string_name = variantKey == "normal" ? "" : variantKey;
               const resulting_comment = `${ingredientTemplateData.name} ${variant_string_name} (${(100 * multiplier).toFixed(0)}g)`;
               
               document.getElementById('carbs').value = resulting_carbs.toFixed(2);
               document.getElementById('protein').value = resulting_protein.toFixed(2);
               document.getElementById('fat').value = resulting_fat.toFixed(2);
               document.getElementById('comment').value = resulting_comment;
          }
     }

 
     function handleFoodItemSelection(bypass = false) {
          const selectionKey = JSON.parse(document.getElementById('templateSelect').value);
          if (selectionKey == "") return;

          const foodKey = selectionKey.foodKey;
          const variantKey = selectionKey.variantKey;

          var multiplier = ingredients[foodKey].servingSize;
          if (!multiplier && multiplier != 0) multiplier = 100;
          if (bypass !== true) {
               document.getElementById('multiplier').value = multiplier / 100;
          }
          if (multiplier != 0) {
               makeFoodItemTemplate(foodKey, variantKey);
          }
     }

     function LoadFoodItemTemplates(templateSelectId) {
          const select = document.getElementById(templateSelectId);
          Object.keys(ingredients).forEach(key => {
               var variants = ingredients[key].variants;
               if (!variants) {
                    variants = {"normal": {}}
               } 

               Object.keys(variants).forEach(variantKey => {
                    const elemOption = document.createElement('option');
                    elemOption.value = JSON.stringify({foodKey: key, variantKey: variantKey});
                    var multiplier = ingredients[key].servingSize;
                    if (multiplier == 0) elemOption.disabled = true;
                    if (!multiplier && multiplier != 0) multiplier = 100;
                    elemOption.textContent = ingredients[key].name;


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


     // Optionally expose a global object for integration
     // How does this expose objects?
     window.MacroTracker = {
          displayHistoryTable,
          updateDailyTotals,
          DisplayDailyTotals,
          AddEntry: addEntry,
          UndoLastEntry: undoLastEntry,
          pasteEntries,
          getEntriesJSON,
          LoadFoodItemTemplates,
          handleFoodItemSelection
          // ...add more exports as needed...
     };
})(window, document);
