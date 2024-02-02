var userName,
  roomList,
  roomId,
  currentRoomId,
  isRoomSelected = false;

async function waitForElement(selector) {
  let element = document.querySelector(selector);

  while (!element) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    element = document.querySelector(selector);
  }

  return element;
}

async function getUserName() {
  const divElements = document.getElementsByTagName("div");
  let targetDivElement;

  for (let i = 0; i < divElements.length; i++) {
    if (divElements[i].textContent.trim() === "Google Account") {
      targetDivElement = divElements[i];
      break;
    }
  }

  // Retrieve the next sibling element if the target div was found
  let nextElement;
  if (targetDivElement) {
    nextElement = targetDivElement.nextElementSibling;
  }

  userName = nextElement.textContent;
}

// This function injects the 'Make it a ChatRuume meeting' button
async function injectButton() {
  const googleMeetingButton = await waitForElement(
    'div[jsname="WwTOGd"][jscontroller="rJx97b"]'
  );
  if (!document.querySelector(".chatruume-meeting")) {
    // Create the container div for the ChatRuume button
    const chatRuumeContainer = document.createElement("div");
    chatRuumeContainer.className = "chatruume-meeting";

    // Create the inner divs and elements
    const iconWrapper = document.createElement("div");
    iconWrapper.className = "chatruume-icon-wrapper";

    const iconSpan = document.createElement("span");
    iconSpan.className = "chatruume-icon";

    const iconURL = await chrome.runtime.getURL("icons/icon16.png");

    iconSpan.style.background = `url('${iconURL}') 0px 0px no-repeat`;

    iconWrapper.appendChild(iconSpan);
    chatRuumeContainer.appendChild(iconWrapper);

    const btnContainer = document.createElement("div");
    btnContainer.className = "chatruume-btn-container";

    const btnWrapper = document.createElement("div");
    btnWrapper.className = "chatruume-btn-wrapper";

    const chatRuumeButton = document.createElement("button");
    chatRuumeButton.id = "chatruume-btn";
    chatRuumeButton.textContent = "Make it a Ruume Meeting";

    chatRuumeButton.addEventListener("click", function () {
      const roomId = document
        .querySelector('span[class="custom-option selected"]')
        .getAttribute("data-value");
      const roomName = document.querySelector(
        'span[class="custom-option selected"]'
      ).textContent;

      const selectElem = document.querySelector(
        'div[class="custom-select-wrapper"]'
      );

      if (this.textContent === "Make it a Ruume Meeting") {

        chrome.runtime.sendMessage({
          action: "createMeeting",
          templateId: roomId,
        });

        selectElem.style.display = "none";

        chatRuumeButton.textContent = `Join Ruume Meeting (${roomName})`;

        injectRoomReselectBtn();
        fillMeetingDetails();
      } else {
        chrome.runtime.sendMessage({
          action: "enterRoom",
          roomId: roomId,
        });
      }
    });

    btnWrapper.appendChild(chatRuumeButton);
    btnContainer.appendChild(btnWrapper);
    chatRuumeContainer.appendChild(btnContainer);

    // Insert the new ChatRuume container next to the Google Meet button
    googleMeetingButton.parentNode.insertBefore(
      chatRuumeContainer,
      googleMeetingButton.nextSibling
    );
  }
}

async function injectRoomSelect(roomList) {
  const customSelectWrapper = document.createElement("div");
  customSelectWrapper.className = "custom-select-wrapper";

  const customSelect = document.createElement("div");
  customSelect.className = "custom-select";

  
  const customOptions = document.createElement("div");
  customOptions.className = "custom-options";
  
  let selectedRoomName = '';

  for (let i = 0; i < roomList.length; i++) {
    const option = document.createElement("span");
    option.className = "custom-option";
    if ((roomId && roomId === roomList[i].id) || (!roomId && i === 0)) {
      option.classList.add('selected');
      selectedRoomName = roomList[i].name;
    } 
    option.setAttribute("data-value", roomList[i].id);
    option.textContent = roomList[i].name;
    customOptions.appendChild(option);
  }

  const customSelectTrigger = document.createElement("div");
  customSelectTrigger.className = "custom-select__trigger";
  customSelectTrigger.innerHTML = `<span>${selectedRoomName}</span><div class="arrow"></div>`;
  
  customSelect.appendChild(customSelectTrigger);
  customSelect.appendChild(customOptions);

  customSelectWrapper.appendChild(customSelect);

  const chatruumeBtnWrapper = await waitForElement(".chatruume-btn-wrapper");
  const parentElement = chatruumeBtnWrapper.parentElement;

  parentElement.insertBefore(
    customSelectWrapper,
    chatruumeBtnWrapper.nextSibling
  );

  document.addEventListener("click", function (e) {
    const isDropdownButton = e.target.matches("[data-dropdown-button]");
    if (!isDropdownButton && e.target.closest("[data-dropdown]") != null)
      return;

    let currentDropdown;
    if (isDropdownButton) {
      currentDropdown = e.target.closest("[data-dropdown]");
      currentDropdown.classList.toggle("active");
    }

    document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
      if (dropdown === currentDropdown) return;
      dropdown.classList.remove("active");
    });
  });

  document
    .querySelector(".custom-select-wrapper")
    .addEventListener("click", function () {
      this.querySelector(".custom-select").classList.toggle("open");
    });

  for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener("click", function () {
      if (!this.classList.contains("selected")) {
        this.parentNode
          .querySelector(".custom-option.selected")
          .classList.remove("selected");
        this.classList.add("selected");
        this.closest(".custom-select").querySelector(
          ".custom-select__trigger span"
        ).textContent = this.textContent;
      }
    });
  }

  window.addEventListener("click", function (e) {
    const select = document.querySelector(".custom-select");
    if (select && !select.contains(e.target)) {
      select.classList.remove("open");
    }
  });
}
async function injectRoomReselectBtn(roomList) {
  const reselectContainer = document.createElement("div");
  reselectContainer.className = "chatruume-meeting";

  const btnContainer = document.createElement("div");
  btnContainer.className = "chatruume-btn-container";

  const btnWrapper = document.createElement("div");
  btnWrapper.className = "reselect-btn-wrapper";

  const reselectBtn = document.createElement("button");
  reselectBtn.id = "chatruume-btn";
  reselectBtn.className = 'reselect';
  reselectBtn.textContent = "Reselect room";

  const chatruumeBtnWrapper = document.querySelector(".chatruume-btn-wrapper");
  const parentElement = chatruumeBtnWrapper.parentElement;

  btnWrapper.appendChild(reselectBtn);
  btnContainer.appendChild(btnWrapper);
  reselectContainer.appendChild(btnContainer);

  parentElement.insertBefore(
    reselectContainer,
    chatruumeBtnWrapper.nextSibling
  );

  reselectBtn.addEventListener("click", function () {
    const selectElem = document.querySelector(
      'div[class="custom-select-wrapper"]'
    );
    const chatruumeBtn = document.getElementById("chatruume-btn");
    const locationField = document.querySelector('[id="c52"]');
    const descriptionField = document.querySelector('[id="T2Ybvb0"]');

    selectElem.style.display = "block";
    reselectContainer.remove();

    locationField.value = "";
    descriptionField.innerHTML = "";
    chatruumeBtn.textContent = "Make it a Ruume Meeting";
  });
}

async function fillTitleField() {
  const titleField = await waitForElement('[id="xTiIn"]');

  await getUserName();

  titleField.value = `${userName}'s Ruume Meeting`;
}

// This function autofills the meeting details
async function fillMeetingDetails() {
  const locationField = await waitForElement('[id="c52"]');
  const descriptionField = await waitForElement('[id="T2Ybvb0"]');

  const roomId = document
    .querySelector('span[class="custom-option selected"]')
    .getAttribute("data-value");

  locationField.value = "https://stg-my.chatruume.com/room/" + roomId;
  await descriptionField.dispatchEvent(new Event("input", { bubbles: true }));
  descriptionField.innerHTML = `${userName} is inviting you to a scheduled Ruume Meeting. <br><br> Join Ruume Meeting <br> https://stg-my.chatruume.com/room/${roomId}`;
}

async function fetchRoomList(accessToken, refreshToken) {
  if (accessToken) {
    try {
      const response = await fetch(
        "https://stg-my.chatruume.com/api/profile/templates",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      const roomList = await response.json().result.list;

      return roomList;
    } catch (error) {
      console.error("Error fetching room list: ", error);
    }
  }
}

window.addEventListener("load", async () => {
  let roomList;
  if (!window.hasLoadedContentScript) {
    window.hasLoadedContentScript = true;

    chrome.storage.local.get(['roomId'], function(result) {
      roomId = result.roomId
    })

    chrome.runtime.sendMessage({ action: "fetchRoomList" });

    chrome.runtime.onMessage.addListener(
      async (message, sender, sendResponse) => {
        if (message.action === "roomListResponse") {
          if (message.roomList) {
            roomList = message.roomList;
            await injectRoomSelect(roomList);
          }
        }
      }
    );

    await injectButton();
    await fillTitleField();
  }
});
