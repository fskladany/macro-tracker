(function (window, document) {

    window.MacroAdder.Act = {
        user_add_record,
        hookDropdownEvents,
        hookDropdownListItemEvents,
        frontend_handle_WindowMacroAdder_reselection,
        user_paste_entries,
        user_undo_last_entry,
        user_bundle_item,
        user_bundle_undo,
        user_bundle_clear,
        user_export_caloric_history,
        user_record_bundle
    };
    window.userSelection = null; // Global variable to store the current selection

    // Function to add an entry
    function user_add_record() {
        //alert("User selection: " + window.userSelection);
        if (!window.userSelection) {
            alert("No ingredient selected! Please select an ingredient before adding an entry.");
            return false;
        }

        if (!window.IngredientItems[window.userSelection ]) {
            alert("Selected ingredient not found in IngredientItems! Please check your selection.");
            return false;
        }

        const entry=parse_macro_entry_values(); 
        var entries = JSON.parse(localStorage.getItem('macroEntries'));


        entries.push(entry);
        localStorage.setItem('macroEntries', JSON.stringify(entries));
        window.MacroAdder.Repaint.frontend_repaint_WindowStatHistory_table_repaint();
        window.MacroAdder.Repaint.frontend_repaint_WindowStatConsumption_window();
    }

    function parse_macro_entry_values(){

        if (!window.userSelection) {
            alert("No ingredient selected! Please select an ingredient before adding an entry.");
            throw new Error("No ingredient selected");
        }

        if (!window.IngredientItems[window.userSelection ]) {
            alert("Selected ingredient not found in IngredientItems! Please check your selection.")
            return false;
        }

        const ingredient = window.IngredientItems[window.userSelection];
        
        // here an opportunity to ditch ... ah nevermind, user can modify values...
        var carbs = parseFloat(document.getElementById('carbs').value) || 0;
        var protein = parseFloat(document.getElementById('protein').value) || 0;
        var fat = parseFloat(document.getElementById('fat').value) || 0;
        const amount = parseFloat(document.getElementById('multiplier').value) || 1;
        carbs *= amount;
        fat *= amount;
        protein *= amount;

        
        const appendComment = document.getElementById('comment').value;

        var comment =  ingredient.name + "(" + amount*100 + 'g)';
        comment += appendComment ? ' - ' + appendComment: '';
        var entries = JSON.parse(localStorage.getItem('macroEntries')) || [];
        var weight = parseFloat(document.getElementById('multiplier').value) || 1;
        const ts = new Date().getTime();

        return { ts, carbs, protein, fat, comment, weight};
    }

    function user_record_bundle() {
        var bundle_entries = JSON.parse(localStorage.getItem('bundleEntries'));
        var entries = JSON.parse(localStorage.getItem('macroEntries'));


        const delta_to_now = 1 + new Date().getTime() - bundle_entries[0].ts;
        bundle_entries.forEach(item => {
            item.ts += delta_to_now;
        })
        
        bundle_entries=bundle_entries.sort((a,b) => b.ts - a.ts); // sort descending by timestamp
        bundle_entries.unshift({skip:true, comment: "---begin-bundle---", ts: bundle_entries[0].ts-10});
        bundle_entries.push({skip: true, comment: "---end-bundle---", ts: bundle_entries[bundle_entries.length-1].ts+10});

  

        entries.push(...bundle_entries);
        entries=entries.sort((b,a) => b.ts - a.ts); // sort descending by timestamp

        localStorage.setItem('macroEntries', JSON.stringify(entries));
        window.MacroAdder.Repaint.frontend_repaint_WindowStatHistory_table_repaint();
        window.MacroAdder.Repaint.frontend_repaint_WindowStatConsumption_window();
    }
    // Function to add an entry
    function user_bundle_item() {
        if (!window.userSelection) {
            alert("No ingredient selected! Please select an ingredient before adding an entry.");
            return false;
        }

        if (!window.IngredientItems[window.userSelection ]) {
            alert("Selected ingredient not found in IngredientItems! Please check your selection.");
            return false;
        }

        const { ts, carbs, protein, fat, comment, weight } = parse_macro_entry_values();

        const entry = { ts, carbs, protein, fat, comment, weight: weight };
        const entries = JSON.parse(localStorage.getItem('bundleEntries')) || [];
        entries.push(entry);
        localStorage.setItem('bundleEntries', JSON.stringify(entries));
        
        window.MacroAdder.Repaint.frontend_repaint_WindowBundle_repaint();
    }

    // Function to add an entry
    function user_bundle_clear() {
        var entries = JSON.parse(localStorage.getItem('bundleEntries')) || [];
        entries = [];
        localStorage.setItem('bundleEntries', JSON.stringify(entries));
        
        window.MacroAdder.Repaint.frontend_repaint_WindowBundle_repaint();
    }

    // Function to add an entry
    function user_bundle_undo() {
        var entries = JSON.parse(localStorage.getItem('bundleEntries')) || [];
        entries=entries.sort((b,a) => b.ts - a.ts); // sort descending by timestamp
        entries.pop()
        localStorage.setItem('bundleEntries', JSON.stringify(entries));
        
        window.MacroAdder.Repaint.frontend_repaint_WindowBundle_repaint();
    }

    function hookDropdownEvents() {
        const root = document.getElementById('search-Element-container');
        if (!root) return;

        const selectHeader = root.querySelector('.search-Element-base-option');
        const dropdown = root.querySelector('.search-Element-dropdown-container');

        if (!selectHeader || !dropdown) return;

        const searchInput = dropdown.querySelector('input');

        selectHeader.addEventListener('click', () => {
            dropdown.classList.toggle('search-Element-condition-opened');
            if (dropdown.classList.contains('search-Element-condition-opened') && searchInput) {
                searchInput.focus();
            }
        });
    }

    function frontend_handle_WindowMacroAdder_reselection(ingredientKeyName) {

        if (!ingredientKeyName) return;
        if (!window.IngredientItems[ingredientKeyName]) return;
        window.userSelection = ingredientKeyName; // Store the selected ingredient key globally for access in other functions

        window.MacroAdder.Repaint.frontend_repaint_WindowMacroAdder_form_values(ingredientKeyName);

    }


    function hookDropdownListItemEvents() {
        const root = document.getElementById('search-Element-container');
        const dropdown = root.querySelector('.search-Element-dropdown-container');
        const selected = root.querySelector('.search-Element-base-option div');
        if (!root) return;

        const searchInput = dropdown.querySelector('input');
        const itemsContainer = dropdown.querySelector('.search-Element-Dropdown-Items-Section');
        items = itemsContainer.querySelectorAll('.ct-item');


        items.forEach(item => {
            
            item.addEventListener('click', () => {
                console.log("Clicked item with foodKey: ", item);
                selected.textContent = item.dataset.foodKey;
                dropdown.classList.remove('search-Element-condition-opened');
                if (searchInput) searchInput.value = '';
                frontend_handle_WindowMacroAdder_reselection(item.dataset.foodKey);

            });
        });


        if (!itemsContainer) return;
        // reset list
        itemsContainer.innerHTML = '';
        itemsContainer.append(...items);

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
   function user_export_caloric_history() {
        const entries = JSON.parse(localStorage.getItem('macroEntries')) || [];
        navigator.clipboard.writeText(JSON.stringify(entries));
        alert("Copied to clipboard text: " + JSON.stringify(entries));
   }

    function user_paste_entries() {
        let entries_string = prompt("Paste entries JSON", "");
          if (entries_string != null) {
               const entries = JSON.parse(entries_string) || [];
               // Save back to local storage
               localStorage.setItem('macroEntries', JSON.stringify(entries));

          }
        window.MacroAdder.Repaint.frontend_repaint_WindowStatHistory_paste_entries();
    }

    function user_undo_last_entry() {
        var entries = JSON.parse(localStorage.getItem('macroEntries')) || [];
        entries=entries.sort((b,a) => b.ts - a.ts); // sort descending by timestamp
        entries.pop();         
        localStorage.setItem('macroEntries', JSON.stringify(entries));
        window.MacroAdder.Repaint.frontend_repaint_WindowStatHistory_undo_entry();
        alert("Removed entry: " + JSON.stringify(poppedEntry)); 
    }

})(window, document);
