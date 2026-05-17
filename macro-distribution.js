(function(window, document) {
     const ingredients = window.MacroIngredients;
     var dailyGoals = {
          carbs: 320,          // Example goal
          protein: 160,      // Example goal
          fat: 60,               // Example goal
          calories: 2500,     // Example goal
          fiber: 50,
          salt: 1.5
     }


     // Function to add an entry
     function addEntry() {
          const carbs = parseFloat(document.getElementById('carbs').value) || 0;
          const protein = parseFloat(document.getElementById('protein').value) || 0;
          const fat = parseFloat(document.getElementById('fat').value) || 0;
          const comment = document.getElementById('comment').value;
          const ts = new Date().getTime();

          let type = "eat";
          if (comment.toLowerCase().includes('kcal')) {
               type = "sport";
          }
          const entry = { ts, carbs, protein, fat, comment, type: type };
          const storageKey = window.Sync.getStorageKey('macroEntries');
          const entries = JSON.parse(localStorage.getItem(storageKey)) || [];
          entries.push(entry);
          localStorage.setItem(storageKey, JSON.stringify(entries));
          displayHistoryTable();
          updateDailyTotals();
     }

     // Function to update the table with entries
          function displayHistoryTable() {
          const storageKey = window.Sync.getStorageKey('macroEntries');
          const entries = JSON.parse(localStorage.getItem(storageKey)) || [];
          entries.sort((a, b) => new Date(b.ts) - new Date(a.ts));

          let whistle_index = entries.length;
          entries.forEach ((entry) => {
               whistle_index--;
               entry['index'] = whistle_index;
          })
          // Save back to local storage
          localStorage.setItem(storageKey, JSON.stringify(entries));

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

               if (!entry['type']) {
                    entry['type'] = "Unaction";
               }
               comment = entry['type'] + ": " + entry['comment'];
               entry = { index: entry['index'], date: d_date, carbs: entry['carbs'], protein: entry['protein'], fat: entry['fat'], comment: comment };
               index = entry['index'];
               
               
               
               // Iterate over each entry value
               const cell = row.insertCell();
               cell.textContent = "#" + index;
               cell.id="hrow-" + entry['ts']

               cell.onclick= function() {
                    let user_date = prompt("Change date to: (YYYY-MM-DD HH:MM)", long_date);

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
                         localStorage.setItem(storageKey, JSON.stringify(updated_entries));
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
          const storageKey = window.Sync.getStorageKey('macroEntries');
          const entries_list = JSON.parse(localStorage.getItem(storageKey)) || [];
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

          const calorieDeficit = totalCalories < dailyGoals.calories? dailyGoals.calories - totalCalories : 0;
          const proteinDeficit = totalProtein < dailyGoals.protein? dailyGoals.protein - totalProtein : 0;
          const fatDeficit = totalFat < dailyGoals.fat? dailyGoals.fat - totalFat : 0;
          const carbDeficit = totalCarbs < dailyGoals.carbs? dailyGoals.carbs - totalCarbs : 0;

          updateTotalWithThreshold('totalCalories', totalCalories, dailyGoals.calories);
          updateTotalWithThreshold('totalCarbs', totalCarbs, dailyGoals.carbs);
          updateTotalWithThreshold('totalProtein', totalProtein, dailyGoals.protein);
          updateTotalWithThreshold('totalFat', totalFat, dailyGoals.fat);

          updateTotalWithThreshold('deficitCalories', -calorieDeficit, dailyGoals.calories);
          updateTotalWithThreshold('deficitProtein', -proteinDeficit, dailyGoals.protein);
          updateTotalWithThreshold('deficitFat', -fatDeficit, dailyGoals.fat);
          updateTotalWithThreshold('deficitCarbs', -carbDeficit, dailyGoals.carbs);

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
               totalCalories += (parseFloat(entry.carbs) + parseFloat(entry.protein)) * 4 + parseFloat(entry.fat) * 9 ;
          });

          totalWeight = (totalCarbs) * 1 + totalProtein * 1.35 + totalFat * 1.1;
          const totalEnergy = totalWeight * 0.004184;
          const kineticMass = totalWeight * 0.25; // body uses 25% of energy for potential movement
          const freeEnergy = totalEnergy * 0.25; // body uses 75% of energy to maintain potential movement
          
          document.getElementById('t24energy').textContent = totalWeight.toFixed(0) + "g (" + totalEnergy.toFixed(2) + "MJ)";
          document.getElementById('t24kinetics').textContent = kineticMass.toFixed(0) + "g (" + freeEnergy.toFixed(2) + "MJ [kg⋅m²/s²])";
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

          const storageKey = window.Sync.getStorageKey('macroEntries');
          let entries = JSON.parse(localStorage.getItem(storageKey) || []);
          const dailyTotals = {};
          entries.sort((a, b) => new Date(b.ts) - new Date(a.ts));

          const dayDelta = 24 * 60 * 60 * 1000;
          // Get the last 28 days
          entries = entries.filter(entry => {
               const entryDate = new Date(entry.ts);
               return entryDate >= new Date(Date.now() - 28 * dayDelta);
          });

          const monthlyCaloricReference = 28 * dailyGoals.calories;
          let monthlyCaloricDefficit = monthlyCaloricReference;

          entries.forEach(entry => {
               const { ts, carbs, protein, fat } = entry;
               const date = new Date(ts).toISOString().split('T')[0]
               // Initialize the object for the date if it doesn't exist
               if (!dailyTotals[date]) {
                    dailyTotals[date] = { carbs: 0, protein: 0, fat: 0, calories: 0, weight: 0 };
               }

               const verCarbs = Number(carbs) || 0;
               const verProtein = Number(protein) || 0;
               const verFat = Number(fat) || 0;
               const verCalories = ((Number(carbs) || 0) + (Number(protein) || 0)) * 4 + (Number(fat) || 0) * 9;

               monthlyCaloricDefficit -= verCalories;

               // Add checks to ensure the properties are numbers
               dailyTotals[date].carbs += verCarbs;
               dailyTotals[date].protein += verProtein;
               dailyTotals[date].fat += verFat;
               // Calculate calories and weight
               dailyTotals[date].calories += verCalories;
               dailyTotals[date].weight += (Number(carbs) || 0) + (Number(protein) || 0) * 1.35 + (Number(fat) || 0) * 1.1;
          });

          caloricDeficitSpan = document.querySelector("#caloricDeficit28Window");
          caloricDeficitSpan.textContent = monthlyCaloricDefficit.toFixed(0) + " kcal";


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
          const storageKey = window.Sync.getStorageKey('macroEntries');
          const entries = JSON.parse(localStorage.getItem(storageKey)) || [];
          const poppedEntry = entries.shift();
          alert("Removed entry: " + JSON.stringify(poppedEntry));
          localStorage.setItem(storageKey, JSON.stringify(entries));
          displayHistoryTable();
          updateDailyTotals();
     }

     function pasteEntries() {
               let entries_string = prompt("Paste entries JSON", "");
               if (entries_string != null) {
                    const entries = JSON.parse(entries_string) || [];
                    const storageKey = window.Sync.getStorageKey('macroEntries');
                    // Save back to local storage
                    localStorage.setItem(storageKey, JSON.stringify(entries));

               }
               displayHistoryTable();
               updateDailyTotals();
          }

     function getEntriesJSON() {
          const storageKey = window.Sync.getStorageKey('macroEntries');
          var entries = localStorage.getItem(storageKey);
          // Copy the text inside the text field
          navigator.clipboard.writeText(entries);

           alert("Copied the text: " + entries);

}
function hookDropdownEvents() {
    const root = document.getElementById('ct-customTemplateSelect');
    if (!root) return;

    const selectHeader = root.querySelector('.ct-selected');
    const dropdown = root.querySelector('.ct-select-dropdown');

    if (!selectHeader || !dropdown) return;

    const searchInput = dropdown.querySelector('input');

    selectHeader.addEventListener('click', () => {
        dropdown.classList.toggle('ct-opened');
        if (dropdown.classList.contains('ct-opened') && searchInput) {
            searchInput.focus();
        }
    });
}


function makeFoodItemTemplate(templateKey, variantKey = "normal") {

    const base = structuredClone(ingredients[templateKey]);
    if (!base) return;

    const variants = base.variants || {};

     if (variantKey !== "normal" && variants[variantKey]) {
         const v = variants[variantKey];

         for (const k in v) {
             base[k] = v[k];
         }
     }

    const multiplierInput =
        parseFloat(document.getElementById('multiplier').value);

    const waterRatio =
        parseFloat(document.getElementById('waterRatio').value) || 0;

    const multiplier =
        multiplierInput || ((base.servingSize || 100) / 100);

    const dilutionFactor = 1 + waterRatio;

    const carbs = (base.carbs || 0) * multiplier;
    const protein = (base.protein || 0) * multiplier;
    const fat = (base.fat || 0) * multiplier;

    const totalWeight = (100 * multiplier) * dilutionFactor;

    const variantText =
        variantKey !== "normal" ? ` ${variantKey}` : '';

    const comment =
        `${base.name}${variantText} (${totalWeight.toFixed(0)}g` +
        `${waterRatio ? `, water ratio 1:${waterRatio}` : ''})`;

    document.getElementById('carbs').value = carbs.toFixed(2);
    document.getElementById('protein').value = protein.toFixed(2);
    document.getElementById('fat').value = fat.toFixed(2);
    document.getElementById('comment').value = comment;
}
function handleFoodItemSelection(foodKey, variantKey = "normal", bypass = false) {

    if (!foodKey) return;

    let multiplier = ingredients[foodKey].servingSize;

    if (!multiplier && multiplier != 0) {
        multiplier = 100;
    }

    if (bypass !== true) {
        document.getElementById('multiplier').value = multiplier / 100;
    }

    if (multiplier != 0) {
        makeFoodItemTemplate(foodKey, variantKey);
    }
}

function LoadFoodItemTemplates() {

    const root = document.getElementById('ct-customTemplateSelect');
    if (!root) return;

    const dropdown = root.querySelector('.ct-select-dropdown');
    const itemsContainer = dropdown.querySelector('.ct-items');
    const selected = root.querySelector('.ct-selected div');
    const searchInput = dropdown.querySelector('input');

    if (!itemsContainer) return;

    // reset list
    itemsContainer.innerHTML = '';

    Object.keys(window.MacroIngredients).forEach(foodKey => {

        const itemData = window.MacroIngredients[foodKey];

        // skip category separators
        if (foodKey.startsWith('_')) return;

        // 🚫 SKIP RECIPES (ingredients only mode)
        if (itemData.subItems) return;

        const variants = itemData.variants || { normal: {} };

        Object.keys(variants).forEach(variantKey => {

            const variant = variants[variantKey] || {};
            const merged = { ...itemData, ...variant };

            const multiplier = merged.servingSize || 100;

            const item = document.createElement('section');
            item.className = 'ct-item';

            item.dataset.foodKey = foodKey;
            item.dataset.variantKey = variantKey;

            // thumbnail (optional fallback)
            const img = document.createElement('img');
            img.className = 'ct-item-thumb';
            img.src = merged.image || 'https://placehold.co/32x32';
            img.alt = merged.name;

            const content = document.createElement('section');
            content.className = 'ct-item-content';

            content.innerHTML = `
                <div>
                    <b>${merged.name}</b>
                    ${variantKey !== 'normal' ? ` [${variantKey}]` : ''}
                </div>
                <div>${multiplier}g</div>
            `;

            item.appendChild(img);
            item.appendChild(content);

            // selection
            item.addEventListener('click', () => {

                selected.textContent =
                    merged.name +
                    (variantKey !== 'normal' ? ` [${variantKey}]` : '');

                dropdown.classList.remove('ct-opened');

                if (searchInput) searchInput.value = '';

                handleFoodItemSelection(foodKey, variantKey);
            });

            itemsContainer.appendChild(item);
        });
    });

    // search (bind once)
    if (searchInput && !searchInput.dataset.bound) {

        searchInput.dataset.bound = "1";

        searchInput.addEventListener('input', () => {

            const q = searchInput.value.toLowerCase();

            itemsContainer.querySelectorAll('.ct-item').forEach(el => {
                el.style.display =
                    el.textContent.toLowerCase().includes(q)
                        ? ''
                        : 'none';
            });
        });
    }
}

     function editGoal(nutrient) {
          const currentValue = dailyGoals[nutrient];
          let newValue = prompt(`Enter new daily goal for ${nutrient} (current: ${currentValue})`, currentValue);
          if (newValue !== null) {
               newValue = parseInt(newValue);
               if (!isNaN(newValue) && newValue > 0) {
                    dailyGoals[nutrient] = newValue;
                    const storageKey = window.Sync.getStorageKey('businessDailyGoals');
                    localStorage.setItem(storageKey, JSON.stringify(dailyGoals));
                    updateDailyTotals();
               } else {
                    alert("Please enter a valid positive number.");
               }
          }
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
          handleFoodItemSelection,
          editGoal,
          hookDropdownEvents
          // ...add more exports as needed...
     };
})(window, document);
