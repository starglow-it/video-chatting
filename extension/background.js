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
  }
});
