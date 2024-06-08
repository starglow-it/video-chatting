var userName,
  roomList,
  roomId,
  roomName,
  currentRoomId,
  isRoomSelected = false,
  isPageCalendar = false;

var iconURL = chrome.runtime.getURL("icons/logo_1000.svg");

const observer = new MutationObserver(async (mutationsList, observer) => {
  if (document.body.innerHTML.includes("Join with Google Meet")) {
    await injectButton();
  }
});

async function waitForElement(selector) {
  let element = document.querySelector(selector);

  while (!element) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    element = document.querySelector(selector);
  }

  return element;
}

// This function injects the 'Make it a ChatRuume meeting' button
async function injectButton() {
    const joinMeetingBtnContainer = findClosestParentDiv("Join with Google Meet");
    const locationContainer = findClosestParentDiv("View map");
    const chatruumeMeetingLinkElem = locationContainer.querySelector('a');

    if (!document.querySelector(".chatruume-meeting") && chatruumeMeetingLinkElem) {
      // Create the container div for the ChatRuume button
      const chatRuumeContainer = document.createElement("div");
      chatRuumeContainer.className = "chatruume-meeting";

      const btnContainer = document.createElement("div");
      btnContainer.className = "chatruume-btn-container";

      const btnWrapper = document.createElement("div");
      btnWrapper.className = "chatruume-btn-wrapper";

      const chatRuumeButton = document.createElement("button");
      chatRuumeButton.id = "chatruume-btn";
      chatRuumeButton.className = "page-calendar-chatruume-btn";
      chatRuumeButton.textContent = "Join with Ruume Meeting";

      chatRuumeButton.addEventListener("click", function () {
        window.open(chatruumeMeetingLinkElem.getAttribute('href'), '_blank')
      });

      btnWrapper.appendChild(chatRuumeButton);
      btnContainer.appendChild(btnWrapper);
      chatRuumeContainer.appendChild(btnContainer);

      // Insert the new ChatRuume container next to the Google Meet button
      joinMeetingBtnContainer.appendChild(chatRuumeContainer);
    }
  }


function findClosestParentDiv(text) {
    var walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_TEXT, 
        { acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } }, 
        false
    );

    var node;
    while(node = walker.nextNode()) {
        if(node.textContent.includes(text)) {
            var parent = node.parentNode;
            while(parent) {
                if(parent.tagName.toLowerCase() === 'div') {
                    return parent;
                }
                parent = parent.parentNode;
            }
        }
    }
    return null;
}

window.addEventListener("load", async () => {
  if (!window.hasLoadedContentScript) {
    window.hasLoadedContentScript = true;

    observer.observe(document.body, { attributes: true, childList: true });
  }

  console.log('3');
});
