(function(window, document) {

    function loadMainMacroWindow(retries = 5) {
        const WindowMacroAdder = document.getElementById('ct-templateSelect');

        if (!WindowMacroAdder) {
            if (retries > 0) {
                setTimeout(() => loadMainMacroWindow(retries - 1), 500);
            } else {
                console.error("Could not load WindowMacroAdder");
            }
            return;
        }

        window.MacroAdder.Repaint.load_dropdown_template_items();
        window.MacroAdder.Act.hookDropdownEvents();
        window.MacroAdder.Act.hookDropdownListItemEvents();
    }

     // Optionally expose a global object for integration
     // How does this expose objects?
     window.MacroAdder.Init = {
          loadMainMacroWindow
          // ...add more exports as needed...
     };
})(window, document);
