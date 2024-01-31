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

          await chrome.tabs.sendMessage(sender.tab.id, {
            action: "roomListResponse",
            roomList: roomList.result.list,
          });
        }
      );
    } catch (error) {
      console.log("Error fetching room list: ", error);
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

          await chrome.tabs.sendMessage(sender.tab.id, {
            action: "completeCreatingMeeting",
            success: true,
          });

          const res = await response.json();
        }
      );
    } catch (error) {
      console.log("Error creating new room: ", error);
    }
  } else if (message.action === "enterRoom") {
    chrome.tabs.create({
      url: `https://stg-my.chatruume.com/room/${message.roomId}`,
    });
  } else if (message.action === 'saveCookie') {
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
    console.log(message);
    console.log(res);

    const response = await res.json();

    console.log(response)

    if ( response.success ) {
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

      chrome.cookies.set(accessTokenCookie, (cookie) => {
        console.log('AccessToken cookie successfully set', cookie);
      })

      chrome.cookies.set(refreshTokenCookie, (cookie) => {
        console.log('RefreshToken cookie successfully set', cookie);
      })

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
  } 
  else if (message.action === 'startGoogleLogin') {
      // const client = google.accounts.oauth2.initTokenClient({
      //   client_id: '539436979316-oqfebgmndsqkhv37ch1l0gnnh8hd3e1v.apps.googleusercontent.com',
      //   scope: 'email profile',
      //   callback: res => {
      //     // handleSuccess(res.access_token);
      //     alert(res.access_token);
      //     console.log(res.access_token)
      //   },
      //   error_callback: err => {
      //     console.log(err.message);
      //   },
      // });
      // client.requestAccessToken();
    // } else {
    //   console.log('Failed to login to Google');
    // }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        previousTabId = tabs[0].id;
      }

      // Now open the login page in a new tab
      chrome.tabs.create({ url: 'https://stg-my.chatruume.com/login' }, function(tab) {
        // No need to save the login tab ID unless you want to refer to it later
        loginTabId = tab
      });
    });
  }

  return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url.includes("dashboard")) {
    // Close the tab
    // chrome.tabs.remove(tabId);
    // Retrieve and store access token
    chrome.cookies.get(
      { url: "https://stg-my.chatruume.com", name: "accessToken" },
      function (cookie) {
        if (cookie) {
          chrome.storage.sync.set({ accessToken: cookie.value }, function () {
            console.log("Access token saved");
          });
        }
      }
    );
    chrome.cookies.get(
      { url: "https://stg-my.chatruume.com", name: "refreshToken" },
      function (cookie) {
        if (cookie) {
          chrome.storage.sync.set({ refreshToken: cookie.value }, function () {
            console.log("Refresh token saved");
          });
        }
      }
    );
  } else if (loginTabId && changeInfo.url && changeInfo.url.includes('https://stg-my.chatruume.com/dashboard')) {
    // Close the login tab
    chrome.tabs.remove(tabId, function() {
      if (previousTabId) {
        // Switch back to the previous tab
        chrome.tabs.update(previousTabId, {active: true});
      }
    });
  }
});


