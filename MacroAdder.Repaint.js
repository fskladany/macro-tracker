(function (window, document) {


    function frontend_repaint_WindowMacroAdder_dropdown_templates() {
        const root = document.getElementById('search-Element-container');
        const dropdown = root.querySelector('.search-Element-dropdown-container');
        const itemsContainer = dropdown.querySelector('.search-Element-Dropdown-Items-Section');
        items = window.MacroAdder.Templating.function_generate_dropdown_food_items()
        itemsContainer.innerHTML = '';
        itemsContainer.append(...items);
    }


 // Function to update the table with entries
     function frontend_repaint_WindowStatHistory_table_repaint() {
        range_time =(document.getElementById('fullEatingHistoryCheckbox').checked == false) ? 24 : 10E6; 

        var entries = JSON.parse(localStorage.getItem('macroEntries')) || [];
        entries = window.MacroAdder.Calc.function_filter_cut_time_window(entries, range_time);
        entries.sort((a, b) => new Date(b.ts) - new Date(a.ts));

        const historyTable = document.querySelector('#historyEntriesBody');
        historyTable.innerHTML = ''; // Clear existing rows
        // Add each entry to the table
        rows = window.MacroAdder.Templating.generateHistoryRows(entries, range_time);
        historyTable.append(...rows);
    }


    function frontend_repaint_WindowStatConsumption_totals_today(carbs, protein, fat, calories) {
        scaledDailyGoals = window.MacroAdder.Calc.function_pure_scaled_goals(window.MacroAdder.Calc.dayWindowHours / 16);
        console.log("sdg:" + JSON.stringify(scaledDailyGoals));
        console.log({ carbs, protein, fat, calories });
        

        frontend_repaint_WindowStatHistory_treshold_element_label('totalCalories', calories, scaledDailyGoals.calories);
        frontend_repaint_WindowStatHistory_treshold_element_label('totalCarbs', carbs, scaledDailyGoals.carbs);
        frontend_repaint_WindowStatHistory_treshold_element_label('totalProtein', protein, scaledDailyGoals.protein);
        frontend_repaint_WindowStatHistory_treshold_element_label('totalFat', fat, scaledDailyGoals.fat);
    }

    function frontend_repaint_WindowStatConsumption_deficit_today(carbs, protein, fat, calories) {
        const tresholds = window.MacroAdder.Calc.compute_deficit_json(carbs, protein, fat, calories);

        const calorieDeficit = tresholds.calorieDeficit;
        const proteinDeficit = tresholds.proteinDeficit;
        const fatDeficit = tresholds.fatDeficit;
        const carbDeficit = tresholds.carbDeficit;

        console.log("Deficits: " + JSON.stringify({carbs, protein, fat, calories}));

        frontend_repaint_WindowStatHistory_treshold_element_label('deficitCalories', -calorieDeficit, scaledDailyGoals.calories);
        frontend_repaint_WindowStatHistory_treshold_element_label('deficitProtein', -proteinDeficit, scaledDailyGoals.protein);
        frontend_repaint_WindowStatHistory_treshold_element_label('deficitFat', -fatDeficit, scaledDailyGoals.fat);
        frontend_repaint_WindowStatHistory_treshold_element_label('deficitCarbs', -carbDeficit, scaledDailyGoals.carbs);
    }


    function frontend_repaint_WindowStatConsumption_window() {
        const entries_list = JSON.parse(localStorage.getItem('macroEntries') || []);

        //find a better variable naem for this
        const totals16 = window.MacroAdder.Calc.function_filter_cut_time_window(entries_list, 16);
        const totals32 = window.MacroAdder.Calc.function_filter_cut_time_window(entries_list, 40);

        const sum_macros_day = window.MacroAdder.Calc.get_entries_sum(totals16);
        const sum_macros_48 = window.MacroAdder.Calc.get_entries_sum(totals32);


        console.log("sum_macros_day: " + JSON.stringify(sum_macros_day));
        console.log("sum_macros_48: " + JSON.stringify(sum_macros_48));
        frontend_repaint_WindowStatConsumption_totals_today(sum_macros_day.carbs, sum_macros_day.protein, sum_macros_day.fat, sum_macros_day.calories);
        frontend_repaint_WindowStatConsumption_deficit_today(sum_macros_48.carbs, sum_macros_48.protein, sum_macros_48.fat, sum_macros_48.calories);

    }

    function frontend_repaint_WindowStatHistory_undo_entry() {
        frontend_repaint_WindowStatHistory_table_repaint();
        frontend_repaint_WindowStatConsumption_window();
    }

    function frontend_repaint_WindowStatHistory_paste_entries() {
        frontend_repaint_WindowStatHistory_table_repaint();
        frontend_repaint_WindowStatConsumption_window();
    }

    // Function to update the total with a threshold
    function frontend_repaint_WindowStatHistory_treshold_element_label(elementId, total, goal) {
        const element = document.getElementById(elementId);
        element.textContent = total.toFixed(0);
        const percentage = (total / goal) * 100;

        // Reset class
        element.className = '';

        // Change color based on the percentage of the goal reached
        if (percentage >= 100) {
            element.classList.add('color-goal-reached');
        }
        else if (percentage >= 50) {
            element.classList.add('color-halfway-there');
        }
    }

    function function_template_WindowMacroAdder_form(ingredientKeyName) {
        if (!window.IngredientItems[ingredientKeyName]) return;
        ingredientValues = window.IngredientItems[ingredientKeyName];

        const multiplierInput =
            parseFloat(document.getElementById('multiplier').value);

        const multiplier =
            multiplierInput || ((ingredientValues.servingSize || 100) / 100);

        const carbs = (ingredientValues.carbs || 0) * multiplier;
        const protein = (ingredientValues.protein || 0) * multiplier;
        const fat = (ingredientValues.fat || 0) * multiplier;

        const totalWeight = multiplier * (ingredientValues.servingSize || 100);

        const comment =
            `${ingredientValues.name} (${totalWeight.toFixed(0)}g` + `)`;

        return { carbs, protein, fat, comment };
    }


    function frontend_repaint_WindowMacroAdder_form_values(ingredientKeyName, bypass_multiplier_change) {

        const { carbs, protein, fat, comment } = function_template_WindowMacroAdder_form(ingredientKeyName, bypass_multiplier_change);

        let servingSize = parseInt(window.IngredientItems[ingredientKeyName].servingSize) || 100;

        if (!servingSize || servingSize === 0) {
            servingSize = 100;
        }

        if (!bypass_multiplier_change) {
            document.getElementById('multiplier').value = servingSize / 100;
        }

        document.getElementById('carbs').value = carbs.toFixed(2);
        document.getElementById('protein').value = protein.toFixed(2);
        document.getElementById('fat').value = fat.toFixed(2);
        document.getElementById('comment').value = comment;

        document.querySelector('.search-Element-base-image').src="res/" + ingredientKeyName + ".png";
    }

    function frontend_assert_WindowMacroAdder_serving_size(foodKey) {
        const multiplier = parseFloat(document.getElementById('multiplier').value);
        if (isNaN(multiplier)) {
            document.getElementById('multiplier').value = entry.multiplier || 1;
        }
    }

    // Optionally expose a global object for integration
    // How does this expose objects?
    window.MacroAdder.Repaint = {
        frontend_repaint_WindowStatHistory_table_repaint,
        frontend_repaint_WindowStatConsumption_totals_today,
        frontend_repaint_WindowStatConsumption_deficit_today,
        frontend_repaint_WindowStatConsumption_window,
        frontend_repaint_WindowStatHistory_undo_entry,
        frontend_repaint_WindowStatHistory_paste_entries,
        frontend_repaint_WindowMacroAdder_form_values,
        frontend_assert_WindowMacroAdder_serving_size,
        frontend_repaint_WindowMacroAdder_dropdown_templates
        // ...add more exports as needed...
    };
})(window, document);
