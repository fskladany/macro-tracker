(function (window, document) {

    window.MacroAdder.Calc = {
        function_pure_scaled_goals,
        compute_deficit_json,
        function_filter_cut_time_window,
        sum_entry_sequence,
        get_userfirendly_timestring,
        function_scale_macro_template
    };

    var dailyGoals = {
        carbs: 320,          // Example goal
        protein: 160,      // Example goal
        fat: 60,               // Example goal
        calories: 2500,     // Example goal
        fiber: 50,
        salt: 1.5
    };

    const dayWindowHours = 16;
    const deficitWindowHours = 40;


    function function_pure_scaled_goals(time_factor) {
        return {
            carbs: dailyGoals.carbs * time_factor,
            protein: dailyGoals.protein * time_factor,
            fat: dailyGoals.fat * time_factor,
            calories: dailyGoals.calories * time_factor,
            fiber: dailyGoals.fiber * time_factor,
            salt: dailyGoals.salt * time_factor
        };
    }

    function get_userfirendly_timestring(ts) {
        if (!ts) return "No data";
        const time_delta = new Date().getTime() - ts;
        var long_date = new Date(ts).toLocaleString();
        console.log(long_date)

        minutes = Math.floor((time_delta / (60 * 1000)) % 60);
        hours = Math.floor(time_delta / (60 * 60 * 1000));
        const pad = (num) => ("0" + num).slice(-2);
        if (time_delta < 60 * 1000)
            return "just now";
        else if (time_delta < 2 * 60 * 1000) {
            return 'a minute ago';
        }
        else if (time_delta < 60 * 60 * 1000) {
            return minutes + ' minutes ago';
        } else if (time_delta < 4 * 60 * 60 * 1000) {
            grammar_hour = (hours > 1 ? ' hours' : ' hour');
            grammar_minute = (minutes > 1 ? ' minutes' : ' minute');
            return hours + grammar_hour + ' and ' + minutes + grammar_minute + ' ago';
        } 
        
        return entry_timestring;
    }

    function compute_deficit_json(carbs, protein, fat, calories) {
        scaledDailyGoals = function_pure_scaled_goals(deficitWindowHours / 40);

        var calorieDeficit = scaledDailyGoals.calories - calories;
        var proteinDeficit = scaledDailyGoals.protein - protein;
        var fatDeficit = scaledDailyGoals.fat - fat;
        var carbDeficit = scaledDailyGoals.carbs - carbs;
        if (calorieDeficit < 0) calorieDeficit = 0;
        if (proteinDeficit < 0) proteinDeficit = 0;
        if (fatDeficit < 0) fatDeficit = 0;
        if (carbDeficit < 0) carbDeficit = 0;

        return {
            calorieDeficit: calorieDeficit,
            proteinDeficit: proteinDeficit,
            fatDeficit: fatDeficit,
            carbDeficit: carbDeficit,
        }
    }

    function function_scale_macro_template(ingredientKeyName, multiplierInput) {
        if (!window.IngredientItems[ingredientKeyName]) return;
        ingredientValues = window.IngredientItems[ingredientKeyName];

        const multiplier =
            multiplierInput || ((ingredientValues.servingSize || 100) / 100);

        const carbs = (ingredientValues.carbs || 0) * multiplier;
        const protein = (ingredientValues.protein || 0) * multiplier;
        const fat = (ingredientValues.fat || 0) * multiplier;

        const totalWeight = multiplier * 100;

        const comment =
            `${ingredientValues.name} (${totalWeight.toFixed(0)}g` + `)`;

        return { carbs, protein, fat, comment };
    }

    function function_filter_cut_time_window(entries_list, hours) {
        const ts = new Date().getTime();
        return entries_list.filter(entry => {
            return ts - new Date(entry.ts).getTime() < hours * 60 * 60 * 1000
        });
    }


    function sum_entry_sequence(entries_list) {
        // Using array.acumulator array.reduce((accumulator, currentValue) => ..., initialValue)

        return entries_list.reduce((totals, entry) => {
            if (entry.skip==true){
                return totals;
            }
            totals.carbs += parseFloat(entry.carbs);
            totals.protein += parseFloat(entry.protein);
            totals.fat += parseFloat(entry.fat);
            totals.calories += (parseFloat(entry.carbs) + parseFloat(entry.protein)) * 4 + parseFloat(entry.fat) * 9;
            totals.comment += entry.comment + "; ";
            totals.weight += parseFloat(entry.weight) || 0;
            return totals;
        }, { carbs: 0, protein: 0, fat: 0, calories: 0, comment: "", weight: 0 });
    }

})(window, document);
