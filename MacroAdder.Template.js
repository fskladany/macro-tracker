(function (window, document) {

    function onCellClick(entries, entry) {
   
        let user_date = prompt("Change date to: (YYYY-MM-DD HH:MM)");
        if (user_date == null) {
            return;
        }

        const millis = new Date().getTime() -  parseInt(new Date().getTime()) ;
        const new_date = new Date(user_date).getTime() + millis;
        if (new_date == "Invalid Date" || isNaN(new_date)) {
            alert("Invalid date format!");
            return;
        }

        var found_edit = false;

        const without_old_entry = entries.filter(historic_entry => {
            const filter_opt = 'hrow-' + historic_entry['ts']
            return filter_opt == this['id']
        })

        if (without_old_entry.length < entries.length) {
            entry['ts'] = new_date;
            alert("Entry date changed to: " + new Date(new_date).toLocaleString());
            without_old_entry.push(entry)
            localStorage.setItem('macroEntries', JSON.stringify(without_old_entry));
            window.MacroAdder.Repaint.frontend_repaint_WindowStatHistory_table_repaint();
        } else{
            alert("Original entry not found, no changes applied!");
        }
    }

    function get_userfirendly_timestring(ts) {
        if (!ts) return "No data";
        const time_delta = new Date().getTime() - ts;
        var long_date = new Date(ts).toLocaleString();
        console.log(long_date)

        minutes = Math.floor(time_delta / (60 * 1000));
        hours = Math.floor(time_delta / (60 * 60 * 1000));
        const pad = (num) => ("0" + num).slice(-2);
        if (time_delta < 60 * 1000)

            return "just now";
        else if (time_delta < 60 * 60 * 1000) {
            entry_timestring = pad(minutes) + 'min ago';
        } else if (time_delta < window.MacroAdder.Calc.dayWindowHours * 60 * 60 * 1000) {
            entry_timestring = pad(hours) + ":" + pad(minutes) + 'ago'
        } else {
            entry_timestring = long_date;
        }
        return entry_timestring;
    }

    function generateHistoryRows(entries, range_time) {
        const now = new Date().getTime();
        var index = 0;
        const rows = [];
        entries.forEach(entry => {
            index++;
            const row = document.createElement('tr');
          // Date column
            cell = row.insertCell();
            cell.textContent = "#" + index;

            // Date column
            cell = row.insertCell();
            cell.textContent = get_userfirendly_timestring(entry.ts);

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

            // Note column
            cell = row.insertCell();
            button=document.createElement('button');
            button.textContent = 'Edit';
            button.onclick = () => onCellClick(entries, entry);
            cell.append(button);

            
            row.append(cell);
            rows.push(row);
           
        });
        return rows;
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




    function function_generate_dropdown_food_items() {
        return Object.keys(window.IngredientItems).map(foodKey => {
            const itemData = window.IngredientItems[foodKey];

            if (foodKey.startsWith('_')) return;
            const item = document.createElement('article');
            item.className = 'ct-item';

            item.dataset.foodKey = foodKey;
           // thumbnail (optional fallback)
            image_src= 'res/' + foodKey + '.png';
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
        itemsContainer.appendChildrange(function_generate_dropdown_for_food_items());

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


    window.MacroAdder.Templating = {
        function_generate_dropdown_food_items: function_generate_dropdown_food_items,
        LoadFoodItemTemplates: LoadFoodItemTemplates,
        generateHistoryRows: generateHistoryRows,

    };
})(window, document);
