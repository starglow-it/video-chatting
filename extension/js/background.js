let loginTabId = null, previousTabId = null;

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  let accessToken, refreshToken;

  if (message.action === "fetchRoomList") {
    // Perform the fetch and retrieve the room list
    try {
      await chrome.storage.sync.get(
        ["accessToken", "refreshToken"],
        async function (data) {
          try {
            accessToken = data.accessToken;
            refreshToken = data.refreshToken;
            const response = await fetch(
              "https://stg-my.chatruume.com/api/profile/templates",
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer " + accessToken,
                },
              }
            );
  
            const roomList = await response.json();
    
            if (sender.tab) {
              await chrome.tabs.sendMessage(sender.tab.id, {
                action: "roomListResponse",
                roomList: roomList.result.list,
              });
            } else {
              await chrome.runtime.sendMessage({ action: "roomListResponse", roomList: roomList.result.list });
  
            }
          } catch (error) {
            console.error(error);            
          }
        }
      );
    } catch (error) {
      console.error("Error fetching room list: ", error);
    }
  } else if (message.action === "createMeeting") {
    try {
      await chrome.storage.sync.get(
        ["accessToken", "refreshToken"],
        async function (data) {
          accessToken = data.accessToken;
          refreshToken = data.refreshToken;

          const response = await fetch(
            "https://stg-my.chatruume.com/api/meetings",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate, br",
              },
              body: JSON.stringify({
                templateId: message.templateId,
              }),
            }
          );
          
          if (sender.tab) {
            await chrome.tabs.sendMessage(sender.tab.id, {
              action: "completeCreatingMeeting",
              success: true,
            });
          } else {
            await chrome.runtime.sendMessage({
              action: 'completeCreatingMeeting',
              success: true
            });
          }

          const res = await response.json();
        }
      );
    } catch (error) {
      console.error("Error creating new room: ", error);
    }
  } else if (message.action === "enterRoom") {
    chrome.tabs.create({
      url: `https://stg-my.chatruume.com/room/${message.roomId}`,
    });
  } else if (message.action === 'saveCookie') {
    try {
      const res = await fetch('https://stg-my.chatruume.com/api/auth/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: message.email,
          password: message.password
        })
      })
  
      const response = await res.json();
  
      if (response.success) {
        const accessTokenCookie = {
          url: 'https://stg-my.chatruume.com', // Replace with your desired domain
          name: 'accessToken',
          value: response.result.accessToken.token,
          expirationDate: response.result.accessToken.expiresAt
        }
  
        const refreshTokenCookie = {
          url: 'https://stg-my.chatruume.com', // Replace with your desired domain
          name: 'refreshToken',
          value: response.result.refreshToken.token,
          expirationDate: response.result.refreshToken.expiresAt
        }
  
        chrome.cookies.set(accessTokenCookie);
  
        chrome.cookies.set(refreshTokenCookie)
  
        chrome.runtime.sendMessage({
          action: 'reloadPage'
        })
      } else {
        const errorMessage = response.error.message;
  
        chrome.runtime.sendMessage({
          action: 'displayErrorMessage',
          error: errorMessage
        })
  
      }
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  } else if (message.action === 'startGoogleLogin') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        previousTabId = tabs[0].id;
      }
      // Now open the login page in a new tab
      chrome.tabs.create({ url: 'https://stg-my.chatruume.com/login?google-signin' }, function (tab) {
        // No need to save the login tab ID unless you want to refer to it later
        loginTabId = tab
      });
    });
  } 

  return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url.includes("dashboard")) {
    chrome.cookies.get(
      { url: "https://stg-my.chatruume.com", name: "accessToken" },
      function (cookie) {
        if (cookie) {
          chrome.storage.sync.set({ accessToken: cookie.value });
        }
      }
    );
    chrome.cookies.get(
      { url: "https://stg-my.chatruume.com", name: "refreshToken" },
      function (cookie) {
        if (cookie) {
          chrome.storage.sync.set({ refreshToken: cookie.value });
        }
      }
    );
  } else if (loginTabId && changeInfo.url && changeInfo.url.includes('https://stg-my.chatruume.com/dashboard')) {
    // Close the login tab
    chrome.tabs.remove(tabId, function () {
      loginTabId = null;
      if (previousTabId) {
        // Switch back to the previous tab
        chrome.tabs.update(previousTabId, { active: true });
      }
    });
  }
});


