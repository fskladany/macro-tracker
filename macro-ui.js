(function( window, document ) {

    function undoLastEntry() {
      // Get the current list of entries from localStorage
      let entries = JSON.parse(localStorage.getItem('macroEntries')) || [];

      // Check if there are any entries to undo
      if (entries.length > 0) {
        // Remove the last entry
        entries.shift()

        // Save the updated entries back to localStorage
        localStorage.setItem('macroEntries', JSON.stringify(entries));

        // Update the table and totals to reflect the change
        displayHistoryTable();
        updateDailyTotals();
      } else {
        alert("No entries to undo.");
      }
    }

    function calculateDailyTotals(entries) {
      const dailyTotals = {};
      entries.sort((a, b) => new Date(b.ts) - new Date(a.ts));
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

      return dailyTotals;
    }


    function makeDayOverviewTable(dailyTotals) {
      const table = document.createElement('table');
      const thead = table.createTHead();
      const headerRow = thead.insertRow();
      const headers = ['Date', 'Mass (sum g)', 'Protein (g)', 'Calories (kcal)'];

      headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
      });

      const tbody = table.createTBody();

      Object.keys(dailyTotals).forEach(date => {
        const row = tbody.insertRow();
        const totals = dailyTotals[date];
        row.insertCell().textContent = date;
        const caloreis = row.insertCell().textContent = (totals.carbs * 1 + totals.fat * 1.1 + totals.protein * 1.35).toFixed(0);
        const prot = row.insertCell()
        prot.textContent = totals.protein.toFixed(0);
        if (totals.protein >= dailyGoals.protein) {
          prot.textContent = "✅";
        }

        const calories = row.insertCell()
        calories.textContent = dailyTotals[date].calories.toFixed(0); // Add calories
        if (totals.calories >= dailyGoals.calories) {
          calories.textContent = "✅";
        }
      });

      return table;
    }

    function DisplayDailyTotals() {
      const entries = JSON.parse(localStorage.getItem('macroEntries')) || [];
      const dailyTotals = calculateDailyTotals(entries);
      const dayOverviewTable = makeDayOverviewTable(dailyTotals);
      const dayListOverview = document.getElementById('dayListOverview');
      dayListOverview.innerHTML = ''; // Clear any existing table
      dayListOverview.appendChild(dayOverviewTable);
    }
})( window, document );