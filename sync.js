(function (window, document) {
    const STORAGE_KEYS = [
        'macroEntries',
        'windowState',
        'flows',
        'businessDailyGoals'
    ];

    // Single-user mode (no switching, no registry)
    const CURRENT_USER = 'default';

    function getStorageKey(key) {
        // Backwards-compatible flattening:
        // old data may still exist under "user_key"
        return `${CURRENT_USER}_${key}`;
    }

    function loadMainMacroWindow(retries = 10) {
        const addEntryWindow = document.getElementById('ct-templateSelect');

        if (!addEntryWindow) {
            if (retries > 0) {
                setTimeout(() => loadMainMacroWindow(retries - 1), 500);
            } else {
                console.error("Could not load addEntryWindow");
            }
            return;
        }

        window.MacroTracker.LoadFoodItemTemplates('ct-templateSelect');
        window.MacroTracker.displayHistoryTable();
        window.MacroTracker.updateDailyTotals();
        window.MacroTracker.hookDropdownEvents();
        window.MacroTracker.DisplayDailyTotals();

        window.KeyboardPermission.SetKeyboardEvents();

    }

    function init() {
        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.textContent = 'Local mode (no sync)';
        }

        loadMainMacroWindow();
    }

    window.Sync = {
        init,
        getStorageKey: () => (key) => `${CURRENT_USER}_${key}`
    };

}(window, document));