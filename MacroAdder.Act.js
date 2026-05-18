(function (window, document) {


    function pasteEntries() {
        let entries_string = prompt("Paste entries JSON", "");
        if (entries_string != null) {
            const entries = JSON.parse(entries_string) || [];
            // Save back to local storage
            localStorage.setItem('macroEntries', JSON.stringify(entries));

        }
        window.MacroAdder.Repaint.displayHistoryTable();
        window.MacroAdder.Repaint.frontend_repaint_WindowStatConsumption_window();
    }

    // Function to add an entry
    function AddEntry() {
        var carbs = parseFloat(document.getElementById('carbs').value) || 0;
        var protein = parseFloat(document.getElementById('protein').value) || 0;
        var fat = parseFloat(document.getElementById('fat').value) || 0;
        var comment = document.getElementById('comment').value;
        const ts = new Date().getTime();

        const amount = parseFloat(document.getElementById('multiplier').value) || 1;
        carbs *= amount;
        fat *= amount;
        protein *= amount;
        comment += "*" + amount;

        let type = "eat";
        if (comment.toLowerCase().includes('kcal')) {
            type = "sport";
        }
        const entry = { ts, carbs, protein, fat, comment, type: type };
        const entries = JSON.parse(localStorage.getItem('macroEntries')) || [];
        entries.push(entry);
        localStorage.setItem('macroEntries', JSON.stringify(entries));
        window.MacroAdder.Repaint.displayHistoryTable();
        window.MacroAdder.Repaint.frontend_repaint_WindowStatConsumption_window();
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

    function frontend_handle_WindowMacroAdder_reselection(ingredientKeyName, bypass_multiplier_change = false) {

        if (!ingredientKeyName) return;
        if (!window.IngredientItems[ingredientKeyName]) return;

        window.MacroAdder.Repaint.frontend_repaint_WindowMacroAdder_form_values(ingredientKeyName, bypass_multiplier_change = true);

    }


    function hookDropdownListItemEvents() {
        const root = document.getElementById('ct-customTemplateSelect');
        const dropdown = root.querySelector('.ct-select-dropdown');
        const selected = root.querySelector('.ct-selected div');
        if (!root) return;

        const searchInput = dropdown.querySelector('input');
        const itemsContainer = dropdown.querySelector('.ct-items');
        items = itemsContainer.querySelectorAll('.ct-item');


        items.forEach(item => {
            
            item.addEventListener('click', () => {
                console.log("Clicked item with foodKey: ", item);
                selected.textContent = item.dataset.foodKey;
                dropdown.classList.remove('ct-opened');
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
        const poppedEntry = entries.pop();         
        localStorage.setItem('macroEntries', JSON.stringify(entries));
        window.MacroAdder.Repaint.frontend_repaint_WindowStatHistory_undo_entry();
        alert("Removed entry: " + JSON.stringify(poppedEntry)); 
    }

    // Optionally expose a global object for integration
    // How does this expose objects?
    window.MacroAdder.Act = {
        AddEntry,
        hookDropdownEvents,
        hookDropdownListItemEvents,
        frontend_handle_WindowMacroAdder_reselection,
        user_paste_entries,
        user_undo_last_entry,
        user_export_caloric_history,

        // ...add more exports as needed...
    };
})(window, document);
