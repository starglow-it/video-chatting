var userName,
  roomList,
  roomId,
  roomName,
  currentRoomId,
  isRoomSelected = false,
  isPageCalendar = false;

var iconURL = chrome.runtime.getURL("icons/logo_1000.svg");

const observer = new MutationObserver(async (mutationsList, observer) => {
  if (document.body.innerHTML.includes("Add Google Meet video conferencing")) {
    if (document.body.innerHTML.includes("Guest permissions")) {
      /**
       * Page Calendar Case
       */
      isPageCalendar = true;
      if (
        !document.querySelector("#chatruume-btn.page-calendar-chatruume-btn")
      ) {
        await injectButton();
        let n = 0;

        while (!roomList && n < 5) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          n++;
        }

        if (roomList && roomList.length) {
          await injectRoomSelect(roomList);
        }
        await fillTitleField();
      }

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

          iconSpan.style.background = `url('${iconURL}') 0px 0px no-repeat`;

          iconWrapper.appendChild(iconSpan);
          chatRuumeContainer.appendChild(iconWrapper);

          const btnContainer = document.createElement("div");
          btnContainer.className = "chatruume-btn-container";

          const btnWrapper = document.createElement("div");
          btnWrapper.className = "chatruume-btn-wrapper";

          const chatRuumeButton = document.createElement("button");
          chatRuumeButton.id = "chatruume-btn";
          chatRuumeButton.className = "page-calendar-chatruume-btn";
          chatRuumeButton.textContent = "Save it as a Ruume Meeting";

          chatRuumeButton.addEventListener("click", function () {
            let isFeatured = false;
            let roomName = "";

            let tempRoomId = document
              .querySelector('span[class="custom-option selected"]')
              ?.getAttribute("data-value");

            if (!tempRoomId) {
              tempRoomId = "64f25807bc78bed6bd7b84f5";
              isFeatured = true;
              roomName = "Central Perk";
            } else {
              roomName = document.querySelector(
                'span[class="custom-option selected"]'
              ).textContent;
            }
            const selectElem = document.querySelector(
              'div[class="custom-select-wrapper"]'
            );

            if (this.textContent === "Save it as a Ruume Meeting") {
              chrome.runtime.sendMessage({
                action: "createMeeting",
                templateId: tempRoomId,
                isFeatured: isFeatured,
              });

              if (selectElem) selectElem.style.display = "none";

              chatRuumeButton.textContent = `Join Ruume Meeting (${roomName})`;

              injectRoomReselectBtn();
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

        const closeBtn = await waitForElement('[jsname="gQ2Xie"]');
        closeBtn.addEventListener("click", () => {
          setTimeout(() => {
            // location.reload();
          }, 300);
        });
      }

      async function injectRoomSelect(roomList) {
        const customSelectWrapper = document.createElement("div");
        customSelectWrapper.className = "custom-select-wrapper";

        const customSelect = document.createElement("div");
        customSelect.className = "custom-select";

        const customOptions = document.createElement("div");
        customOptions.className = "custom-options";

        let selectedRoomName = "";

        for (let i = 0; i < roomList.length; i++) {
          const option = document.createElement("span");
          option.className = "custom-option";
          if ((roomId && roomId === roomList[i].id) || (!roomId && i === 0)) {
            option.classList.add("selected");
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

        const chatruumeBtnWrapper = await waitForElement(
          ".chatruume-btn-wrapper"
        );

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

          document
            .querySelectorAll("[data-dropdown].active")
            .forEach((dropdown) => {
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
                ?.classList.remove("selected");
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

      async function fillTitleField() {
        const titleField = await waitForElement('[id="xTiIn"]');

        await getUserName();

        // Only when the title is empty
        if (!titleField.value) {
          simulateKeyboardInput(titleField, `${userName}'s Ruume Meeting`)
        }
      }
    } else {
      /**
       * Modal Calendar Case
       */
      isPageCalendar = false;
      const overflowElem = await waitForElement('[jsname="fxaXHe"]');

      overflowElem.style.overflow = "none";
      if (!document.getElementById("chatruume-btn")) {
        await injectButton();

        if (roomList && roomList.length) {
          await injectRoomSelect(roomList);
        }
      }

      await fillTitleField();
    }
  }
});

async function simulateKeyboardInput(element, value) {
  element.value = value;

  await element.dispatchEvent(new Event("input", { bubbles: true }));
  await element.dispatchEvent(new Event("change", { bubbles: true }));
}

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
  try {
    const parentElement = await waitForElement('[aria-labelledby="tabEvent"]');

    if (parentElement) {
      // Create the container div for the ChatRuume button
      const chatRuumeContainer = document.createElement("div");
      chatRuumeContainer.className = "chatruume-meeting";

      // Create the inner divs and elements
      const iconWrapper = document.createElement("div");
      iconWrapper.className = "chatruume-icon-wrapper";

      const iconSpan = document.createElement("span");
      iconSpan.className = "chatruume-icon";

      iconSpan.style.background = `url('${iconURL}') 0px 0px no-repeat`;
      iconSpan.style.backgroundSize = `contain`;

      iconWrapper.appendChild(iconSpan);
      chatRuumeContainer.appendChild(iconWrapper);

      const btnContainer = document.createElement("div");
      btnContainer.className = "chatruume-btn-container";

      const btnWrapper = document.createElement("div");
      btnWrapper.className = "chatruume-btn-wrapper";

      const chatRuumeButton = document.createElement("button");
      chatRuumeButton.id = "chatruume-btn";
      chatRuumeButton.className = "chatruume-btn";
      chatRuumeButton.textContent = "Save it as a Ruume Meeting";

      chatRuumeButton.addEventListener("click", function () {
        roomId = document
          .querySelector('span[class="custom-option selected"]')
          ?.getAttribute("data-value");
        roomName = "";
        let isFeatured = false;

        if (!roomId) {
          roomId = "64f25807bc78bed6bd7b84f5";
          roomName = "Central Perk";
          isFeatured = true;
        } else {
          roomName = document.querySelector(
            'span[class="custom-option selected"]'
          ).textContent;
        }

        const selectElem = document.querySelector(
          'div[class="custom-select-wrapper"]'
        );

        if (this.textContent === "Save it as a Ruume Meeting") {
          chrome.runtime.sendMessage({
            action: "createMeeting",
            templateId: roomId,
            isFeatured: isFeatured,
          });
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
      parentElement.appendChild(chatRuumeContainer);
    }
  } catch (error) {
    console.log(error);
  }
}

async function injectRoomSelect(roomList) {
  const customSelectWrapper = document.createElement("div");
  customSelectWrapper.className = "custom-select-wrapper";

  const customSelect = document.createElement("div");
  customSelect.className = "custom-select";

  const customSelectTrigger = document.createElement("div");
  customSelectTrigger.className = "custom-select__trigger";
  customSelectTrigger.innerHTML = `<span>${roomList[0].name}</span><div class="arrow"></div>`;

  const customOptions = document.createElement("div");
  customOptions.className = "custom-options";

  const option1 = document.createElement("span");
  option1.className = "custom-option selected";
  option1.setAttribute("data-value", roomList[0].id);
  option1.textContent = roomList[0].name;
  customOptions.appendChild(option1);

  for (let i = 1; i < roomList.length; i++) {
    const option = document.createElement("span");
    option.className = "custom-option";
    option.setAttribute("data-value", roomList[i].id);
    option.textContent = roomList[i].name;
    customOptions.appendChild(option);
  }

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
    try {
      const select = document.querySelector(".custom-select");
      if (select && !select.contains(e.target)) {
        select.classList.remove("open");
      }
    } catch (error) {
      console.error(error);
    }
  });
}

async function injectRoomReselectBtn() {
  const reselectContainer = document.createElement("div");
  reselectContainer.className = "chatruume-meeting";

  const btnContainer = document.createElement("div");
  btnContainer.className = "chatruume-btn-container";

  const btnWrapper = document.createElement("div");
  btnWrapper.className = "reselect-btn-wrapper";

  const reselectBtn = document.createElement("button");
  reselectBtn.className = "chatruume-btn reselect";
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
    const locationField = document.querySelector(
      'input[jsname="YPqjbf"][placeholder="Add location"]'
    );
    const descriptionField = document.querySelector('[jsname="yrriRe"]');

    if (selectElem) selectElem.style.display = "block";
    reselectContainer.remove();

    simulateKeyboardInput(locationField, "");
    descriptionField.innerHTML = "";
    chatruumeBtn.textContent = "Save it as a Ruume Meeting";
  });
}

async function fillTitleField() {
  const titleField = await waitForElement(
    '[jsname="YPqjbf"][data-dragsource-ignore="true"]'
  );

  await getUserName();

  if (!titleField.value) {
    titleField.value = `${userName}'s Ruume Meeting`;
  }
}

// This function autofills the meeting details
async function fillMeetingDetails() {
  const locationField = await waitForElement(
    'input[jsname="YPqjbf"][placeholder="Add location"]'
  );
  const descriptionField = await waitForElement('[jsname="yrriRe"]');

  await simulateKeyboardInput(
    locationField,
    "https://my.chatruume.com/room/" + roomId
  );

  await descriptionField.dispatchEvent(new Event("input", { bubbles: true }));
  descriptionField.innerHTML = `${userName} is inviting you to a scheduled Ruume Meeting. <br><br> Join Ruume Meeting <br> https://my.chatruume.com/room/${roomId}`;
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "roomListResponse") {
    if (message.roomList) {
      roomList = message.roomList;
    }
  } else if (message.action === "completeCreatingMeeting") {
    roomId = message.roomId;
    fillMeetingDetails();

    if (!isPageCalendar) {
      setTimeout(() => {
        document
          .querySelectorAll('[jsname="c6xFrd"] [class="VfPpkd-Jh9lGc"]')[3]
          .click();
      }, 1000);
    }
  }
});

window.addEventListener("load", async () => {
  if (!window.hasLoadedContentScript) {
    window.hasLoadedContentScript = true;

    observer.observe(document.body, { attributes: true, childList: true });

    chrome.storage.local.get(["roomId"], function (result) {
      roomId = result.roomId;
    });

    chrome.runtime.sendMessage({ action: "fetchRoomList" });

    document.body.setAttribute("test-label", "");
  }
});
