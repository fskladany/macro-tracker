(function (window, document) {

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
        console.log("Returning deficits: " + JSON.stringify({ calorieDeficit, proteinDeficit, fatDeficit, carbDeficit }));
        return {
            calorieDeficit: -calorieDeficit,
            proteinDeficit: -proteinDeficit,
            fatDeficit: -fatDeficit,
            carbDeficit: -carbDeficit,
        }
    }


    function function_filter_cut_time_window(entries_list, hours) {
        const ts = new Date().getTime();
        return entries_list.filter(entry => {
            return ts - new Date(entry.ts).getTime() < hours * 60 * 60 * 1000
        });
    }


    function get_entries_sum(entries_list) {
        // Using array.acumulator array.reduce((accumulator, currentValue) => ..., initialValue)

        return entries_list.reduce((totals, entry) => {
            totals.carbs += parseFloat(entry.carbs);
            totals.protein += parseFloat(entry.protein);
            totals.fat += parseFloat(entry.fat);
            totals.calories += (parseFloat(entry.carbs) + parseFloat(entry.protein)) * 4 + parseFloat(entry.fat) * 9;
            return totals;
        }, { carbs: 0, protein: 0, fat: 0, calories: 0 });
    }

    // Optionally expose a global object for integration
    // How does this expose objects?
    window.MacroAdder.Calc = {
        function_pure_scaled_goals,
        compute_deficit_json,
        function_filter_cut_time_window,
        get_entries_sum
    };

}) (window, document);
