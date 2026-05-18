(function(window, document) {

    window.MacroAdder.Init = {
        loadMainMacroWindow
    };

    function loadMainMacroWindow(retries = 5) {
        const WindowMacroAdder = document.getElementById('search-Element-Bar');

        if (!WindowMacroAdder) {
            if (retries > 0) {
                setTimeout(() => loadMainMacroWindow(retries - 1), 500);
            } else {
                console.error("Could not load WindowMacroAdder");
            }
            return;
        }

        window.MacroAdder.Repaint.frontend_repaint_WindowMacroAdder_dropdown_templates();
        window.MacroAdder.Repaint.frontend_repaint_WindowBundle_repaint();
        window.MacroAdder.Act.hookDropdownEvents();
        window.MacroAdder.Act.hookDropdownListItemEvents();
    }

})(window, document);
