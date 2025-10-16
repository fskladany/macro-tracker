(function (window, document) {
    const STORAGE_KEYS = ['macroEntries', 'windowState', 'flows', 'businessDailyGoals'];
    let currentUser = null;
    let lastSyncTimestamp = new Date(0).toISOString();

    function getStorageKey(key, user = null) {
        const targetUser = user || currentUser;
        if (!targetUser) {
            console.error("No user selected for storage operation.");
            return key; // Fallback
        }
        return `${targetUser}_${key}`;
    }

    function getUsers() {
        // This is now just a local cache, server is the source of truth.
        return JSON.parse(localStorage.getItem('sync_users') || '["default"]');
    }

    function saveUsers(users) {
        // Update the local cache of users
        localStorage.setItem('sync_users', JSON.stringify(users));
    }

    async function addUser() {
        const newUser = prompt("Enter new username:");
        if (newUser && newUser.trim() !== "") {
            // Optimistically update UI, then sync.
            // The server will create the user on first push.
            const users = getUsers();
            if (!users.includes(newUser)) {
                users.push(newUser);
                saveUsers(users);
                populateUserDropdown(users);
                await switchUser(newUser);
            } else {
                alert("User already exists.");
            }
        }
    }

    async function switchUser(username) {
        if (!username) return;
        currentUser = username;
        localStorage.setItem('sync_currentUser', currentUser);
        alert(`Switched to user: ${username}. Reloading application state.`);
        // No need to call sync here, just reload.
        window.location.reload();
    }

    function populateUserDropdown(users, retries = 5) {
        const userSelect = document.getElementById('userSelect');
        if (!userSelect) {
            if (retries > 0) {
                // If the element isn't loaded, retry in a moment.
                setTimeout(() => populateUserDropdown(users, retries - 1), 500);
            } else {
                console.error("Could not find #userSelect element after multiple retries.");
            }
            return;
        }

        userSelect.innerHTML = '';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            if (user === currentUser) {
                option.selected = true;
            }
            userSelect.appendChild(option);
        });
    }

    async function syncWithServer() {
        const syncStatus = document.getElementById('syncStatus');
        syncStatus.textContent = 'Syncing...';

        // 1. Push local data to server
        const localData = {};
        STORAGE_KEYS.forEach(key => {
            localData[key] = localStorage.getItem(getStorageKey(key));
        });

        try {
            const pushResponse = await fetch('/api/sync/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: currentUser,
                    last_updated: lastSyncTimestamp,
                    data: localData
                })
            });

            if (pushResponse.status === 409) { // Conflict
                const conflictData = await pushResponse.json();
                alert(conflictData.message);
                // Overwrite local with server data on conflict
                handlePulledData(conflictData.server_data.data, currentUser);
            } else if (!pushResponse.ok) {
                throw new Error(`Push failed: ${pushResponse.statusText}`);
            }

            // 2. Pull all users' data from server
            const pullResponse = await fetch('/api/sync/pull');
            if (!pullResponse.ok) throw new Error(`Pull failed: ${pullResponse.statusText}`);
            
            const allUsersData = await pullResponse.json();
            
            // Update the canonical list of users
            const serverUsers = Object.keys(allUsersData);
            saveUsers(serverUsers);
            populateUserDropdown(serverUsers);

            // 3. Update local cache for all users
            for (const user in allUsersData) {
                handlePulledData(allUsersData[user].data, user);
            }
            
            lastSyncTimestamp = new Date().toISOString();
            localStorage.setItem('sync_lastSync', lastSyncTimestamp);
            syncStatus.textContent = `Last sync: ${new Date(lastSyncTimestamp).toLocaleTimeString()}`;
            alert('Sync successful!');
            window.location.reload();

        } catch (error) {
            console.error('Sync failed:', error);
            syncStatus.textContent = `Sync failed: ${error.message}`;
            alert(`Sync failed: ${error.message}`);
        }
    }

    function handlePulledData(userData, user) {
        STORAGE_KEYS.forEach(key => {
            const storageKey = getStorageKey(key, user);
            if (userData[key]) {
                localStorage.setItem(storageKey, userData[key]);
            } else {
                localStorage.removeItem(storageKey);
            }
        });
    }

    function init() {
        currentUser = localStorage.getItem('sync_currentUser') || 'default';
        lastSyncTimestamp = localStorage.getItem('sync_lastSync') || new Date(0).toISOString();
        
        const users = getUsers(); // Load from local cache initially
        if (!users.includes(currentUser)) {
            currentUser = 'default';
            localStorage.setItem('sync_currentUser', currentUser);
        }
        
        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.textContent = `Last sync: ${new Date(lastSyncTimestamp).toLocaleTimeString()}`;
        }
        
        populateUserDropdown(users);
    }

    window.Sync = {
        init,
        addUser,
        switchUser,
        syncWithServer,
        getStorageKey,
        getCurrentUser: () => currentUser
    };

}(window, document));
