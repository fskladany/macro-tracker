(function (window, document) {

    window.MacroAdder.Templating = {
        function_generate_dropdown_food_items,
        generateHistoryRows
    };

    function onCellClick(entries, entry) {

        let user_date = prompt("Change date to: (YYYY-MM-DD HH:MM)");
        if (user_date == null) {
            return;
        }

        // To avoid setting time to same timestamp, add the milliseconds delta to the new date
        const millis = new Date().getTime() - parseInt(new Date().getTime());
        const new_date = new Date(user_date).getTime() + millis;
        if (new_date == "Invalid Date" || isNaN(new_date)) {
            alert("Invalid date format!");
            return;
        }

        var found_edit = false;

        const filter_history_by_row_id = entries.filter(historic_entry => {
            const filter_opt = 'hrow-' + historic_entry['ts']
            return filter_opt != this['id']
        })
        console.log(filter_history_by_row_id);
        if (filter_history_by_row_id.length == entries.length) {
            entry['ts'] = new_date;
            alert("Entry date changed to: " + new Date(new_date).toLocaleString());
            filter_history_by_row_id.push(entry)
            console.log(filter_history_by_row_id);
            localStorage.setItem('macroEntries', JSON.stringify(filter_history_by_row_id));
            window.MacroAdder.Repaint.frontend_repaint_WindowStatHistory_table_repaint();
        } else {
            alert("Original entry not found, no changes applied!");
        }
    }


    function generateHistoryRows(entries, range_time) {
        const now = new Date().getTime();
        var row_item_counter = 0;
        const generated_rows = [];
        entries.forEach(entry => {
            row_item_counter++;
            const row = document.createElement('tr');
            /* Row structure is: [#] [Date] [Carbs] [Protein] [Fat] [Comment] [Edit Button] */

            // # column
            cell = row.insertCell();
            cell.textContent = "#" + row_item_counter;

            // Date column
            cell = row.insertCell();
            cell.textContent = window.MacroAdder.Calc.get_userfirendly_timestring(entry.ts);

            // Carbs column
            cell = row.insertCell();
            cell.textContent = entry.carbs ?? '';

            // Protein column
            cell = row.insertCell();
            cell.textContent = entry.protein ?? '';

            // Fat column
            cell = row.insertCell();
            cell.textContent = entry.fat ?? '';

            // Note column
            cell = row.insertCell();
            cell.textContent = entry.comment ?? '';

            // Button column
            button = document.createElement('button');
            button.textContent = 'Edit';
            button.id = 'hrow-' + entry.ts;
            button.onclick = () => onCellClick(entries, entry);

            cell = row.insertCell();
            cell.append(button);

            row.append(cell);
            generated_rows.push(row);

        });
        return generated_rows;
    }

    function function_generate_dropdown_food_items() {
        return Object.keys(window.IngredientItems).map(foodKey => {
            const itemData = window.IngredientItems[foodKey];

            if (foodKey.startsWith('_')) return;
            const item = document.createElement('article');
            item.className = 'ct-item';

            item.dataset.foodKey = foodKey;
            // thumbnail (optional fallback)
            image_src = 'res/' + foodKey + '.png';
            var img = document.createElement('img');

            const request = new XMLHttpRequest();
            request.open("HEAD", image_src, false); // `false` makes the request synchronous
            request.send(null);

            if (request.status === 200) {
                img.src = image_src;
                img.style.maxWidth = '80px';
                img.style.maxHeight = '80px';
            } else {
                img.src = 'res/unknown.png';
                img.style.maxWidth = '50px';
                img.style.maxHeight = '50px';
            }
            img.className = 'ct-item-thumb';
            img.classList.add('ct-img');

            img.alt = itemData.name;

            const content = document.createElement('section');
            content.className = 'ct-item-content';

            const multiplier = itemData.servingSize || 100;

            content.innerHTML = `
            <div>
                <b>${itemData.name}</b>
            </div>
            <div>${multiplier}g</div>
        `;
            item.appendChild(content);
            item.appendChild(img);

            return item;
        });
    }

})(window, document);
