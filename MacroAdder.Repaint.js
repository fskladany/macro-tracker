(function (window, document) {

    window.MacroAdder.Repaint = {
        frontend_repaint_WindowStatHistory_table_repaint,
        frontend_repaint_WindowStatConsumption_totals_today,
        frontend_repaint_WindowStatConsumption_deficit_today,
        frontend_repaint_WindowStatConsumption_window,
        frontend_repaint_WindowStatHistory_undo_entry,
        frontend_repaint_WindowStatHistory_paste_entries,
        frontend_repaint_WindowMacroAdder_form_values,
        frontend_repaint_WindowMacroAdder_dropdown_templates,
        frontend_repaint_WindowBundle_repaint
    };

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
        range_time = (document.getElementById('fullEatingHistoryCheckbox').checked == false) ? 24 : 10E6;

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

        console.log("Deficits: " + JSON.stringify({ carbs, protein, fat, calories }));

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

        const sum_macros_day = window.MacroAdder.Calc.sum_entry_sequence(totals16);
        const sum_macros_48 = window.MacroAdder.Calc.sum_entry_sequence(totals32);


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

    function frontend_repaint_WindowMacroAdder_form_values(ingredientKeyName) {
        const multiplierInput = parseFloat(document.getElementById('multiplier').value);
        const { carbs, protein, fat, comment } = window.MacroAdder.Calc.function_scale_macro_template(ingredientKeyName, multiplierInput);

        let servingSize = parseInt(window.IngredientItems[ingredientKeyName].servingSize) || 100;

        document.getElementById('carbs').value = carbs.toFixed(2);
        document.getElementById('protein').value = protein.toFixed(2);
        document.getElementById('fat').value = fat.toFixed(2);
        document.getElementById('multiplier').value = servingSize / 100;   
        document.getElementById('comment').value = "";
        document.querySelector('.search-Element-base-image').src = "res/" + ingredientKeyName + ".png";
    }

    function frontend_repaint_WindowBundle_repaint() {
        const entries = JSON.parse(localStorage.getItem('bundleEntries')) || [];
        MacroAdder.Calc.sum_entry_sequence(entries);

        const { carbs, protein, fat, comment, weight } = MacroAdder.Calc.sum_entry_sequence(entries);

        document.getElementById('carbs_bundle').value = carbs.toFixed(2);
        document.getElementById('protein_bundle').value = protein.toFixed(2);
        document.getElementById('fat_bundle').value = fat.toFixed(2);
        document.getElementById('comment_bundle').value = comment;
        document.getElementById('weight_bundle').value = weight.toFixed(2);
    }

    function frontend_repaint_WindowBundle_clear() {
        const entries = JSON.parse(localStorage.getItem('bundleEntries')) || [];
        MacroAdder.Calc.sum_entry_sequence(entries);

        const { carbs, protein, fat, comment } = MacroAdder.Calc.sum_entry_sequence(entries);

        document.getElementById('carbs_bundle').value = carbs.toFixed(2);
        document.getElementById('protein_bundle').value = protein.toFixed(2);
        document.getElementById('fat_bundle').value = fat.toFixed(2);
        document.getElementById('comment_bundle').value = comment;
    }


})(window, document);
