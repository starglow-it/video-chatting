let loginTabId = null,
  previousTabId = null;

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
              "https://my.chatruume.com/api/profile/templates",
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer " + accessToken,
                },
              }
            );
            const nextResponse = await fetch(
              "https://my.chatruume.com/api/templates?skip=0&limit=2&roomType=featured&draft=false",
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer " + accessToken,
                },
              }
            );

            const roomList = await response.json();
            const nextResponseData = await nextResponse.json();

            if (sender.tab) {
              await chrome.tabs.sendMessage(sender.tab.id, {
                action: "roomListResponse",
                roomList: roomList.result.list,
                latestFeaturedRoom: nextResponseData.result.list[0].id,
              });
            } else {
              await chrome.runtime.sendMessage({
                action: "roomListResponse",
                roomList: roomList.result.list,
                latestFeaturedRoom: nextResponseData.result.list[0].id,
              });
            }
          } catch (error) {
            console.log(error);
          }
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

          let templateId = message.templateId;

          if (message.isFeatured) {
            const response = await fetch(
              `https://my.chatruume.com/api/profile/templates/add/${message.templateId}`,
              {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + accessToken,
                  "Content-Type": "application/json",
                  Accept: "*/*",
                  "Accept-Encoding": "gzip, deflate, br",
                },
              }
            );

            const data = await response.json();

            templateId = data.result.id;
          }

          const response = await fetch(
            "https://my.chatruume.com/api/meetings",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate, br",
              },
              body: JSON.stringify({
                templateId: templateId,
              }),
            }
          );

          const resData = await response.json();

          const link = resData.result.customLink || templateId;

          if (sender.tab) {
            await chrome.tabs.sendMessage(sender.tab.id, {
              action: "completeCreatingMeeting",
              success: true,
              roomId: link,
            });
          } else {
            await chrome.runtime.sendMessage({
              action: "completeCreatingMeeting",
              success: true,
              roomId: link,
            });
          }
        }
      );
    } catch (error) {
      console.log("Error creating new room: ", error);
    }
  } else if (message.action === "enterRoom") {
    chrome.tabs.create({
      url: `https://my.chatruume.com/room/${message.roomId}`,
    });
  } else if (message.action === "saveCookie") {
    try {
      const res = await fetch("https://my.chatruume.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: message.email,
          password: message.password,
        }),
      });

      const response = await res.json();

      if (response.success) {
        const accessTokenCookie = {
          url: "https://my.chatruume.com", // Replace with your desired domain
          name: "accessToken",
          value: response.result.accessToken.token,
          expirationDate: response.result.accessToken.expiresAt,
        };

        const refreshTokenCookie = {
          url: "https://my.chatruume.com", // Replace with your desired domain
          name: "refreshToken",
          value: response.result.refreshToken.token,
          expirationDate: response.result.refreshToken.expiresAt,
        };

        chrome.cookies.set(accessTokenCookie);

        chrome.cookies.set(refreshTokenCookie);

        chrome.runtime.sendMessage({
          action: "reloadPage",
        });
      } else {
        const errorMessage = response.error.message;

        chrome.runtime.sendMessage({
          action: "displayErrorMessage",
          error: errorMessage,
        });
      }
    } catch (error) {
      console.log("Error signing in: ", error);
    }
  } else if (message.action === "startGoogleLogin") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        previousTabId = tabs[0].id;
      }
      // Now open the login page in a new tab
      chrome.tabs.create(
        { url: "https://my.chatruume.com/login?google-signin" },
        function (tab) {
          // No need to save the login tab ID unless you want to refer to it later
          loginTabId = tab;
        }
      );
    });
  }

  return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url.includes("dashboard")) {
    chrome.cookies.get(
      { url: "https://my.chatruume.com", name: "accessToken" },
      function (cookie) {
        if (cookie) {
          chrome.storage.sync.set({ accessToken: cookie.value });
        }
      }
    );
    chrome.cookies.get(
      { url: "https://my.chatruume.com", name: "refreshToken" },
      function (cookie) {
        if (cookie) {
          chrome.storage.sync.set({ refreshToken: cookie.value });
        }
      }
    );
  } else if (
    loginTabId &&
    changeInfo.url &&
    changeInfo.url.includes("https://my.chatruume.com/dashboard")
  ) {
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

chrome.runtime.setUninstallURL("https://my.chatruume.com/welcome", function () {
  if (chrome.runtime.lastError) {
    console.log("Error setting uninstall URL: ", chrome.runtime.lastError);
  } else {
    console.log("Uninstall URL set.");
  }
});
