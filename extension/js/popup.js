let roomList = [],
  roomId = null,
  selectedYear = new Date().getFullYear(),
  selectedMonth = new Date().getMonth() + 1,
  selectedDay = new Date().getUTCDate(),
  selectedStartTime = new Date().getUTCHours().toString() + new Date().getUTCMinutes().toString(),
  selectedEndTime = new Date().getUTCHours().toString() + new Date().getUTCMinutes().toString(),
  selectedMeridiem = 'am',
  selectedTimeZone = '00';

document.addEventListener("DOMContentLoaded", function () {
  const scheduleMeetingBtn = document.getElementById("scheduleMeeting");
  const enterMeetingBtn = document.getElementById("enterMeeting");
  const singInBtn = document.getElementById("signinMeeting");
  const googleLoginField = document.getElementById('google-login');
  const signInForm = document.getElementById('signin-form');
  const loggedInDiv = document.getElementById("logged-in");
  const notLoggedInDiv = document.getElementById("not-logged-in");
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessageField = document.getElementById('error-message');
  const registerLink = document.getElementById('register');
  const confirmBtn = document.getElementById('confirmBtn');
  const forgotPasswordSpan = document.getElementById('forgot-password');

  renderCal();

  /*
    Fetch Room list and render badges
  */

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'roomListResponse') {
      const roomListDiv = document.querySelector('.room-list');
      roomList = message.roomList;
      for (const room of roomList) {
        const spanElement = document.createElement("span");

        spanElement.setAttribute("class", "badge");
        spanElement.setAttribute("data-value", room.id);
        spanElement.textContent = room.name;
        spanElement.addEventListener('click', function (e) {
          const roomNameElem = document.getElementById('room-name');
          document.querySelectorAll('.badge').forEach(element => {
            element.classList.remove('active');
          })
          e.target.classList.add('active');
          roomNameElem.textContent = ' (' + room.name + ')';
          roomId = room.id;
        })
        roomListDiv.appendChild(spanElement);
      }
    } else if (message.action === 'completeCreatingMeeting') {
      document.getElementById('loading').style.display = 'none';
        chrome.runtime.sendMessage({
          action: 'enterRoom',
          roomId: roomId
        });
    }
  })

  /*
     Conditionally Render based on token existence
  */
  chrome.cookies.get(
    { url: "https://stg-my.chatruume.com", name: "accessToken" },
    function (cookie) {
      if (cookie) {
        notLoggedInDiv.style.display = "none";
        chrome.runtime.sendMessage({
          action: 'fetchRoomList'
        });
      } else {
        loggedInDiv.style.display = "none";
      }
    }
  );


  /*
     Event Listeners
  */
  googleLoginField.addEventListener('click', function () {
    chrome.runtime.sendMessage({
      action: 'startGoogleLogin'
    })
  });

  signInForm.addEventListener("submit", async function () {
    chrome.runtime.sendMessage({ action: 'saveCookie', email: emailInput.value, password: passwordInput.value });
    document.getElementById('signin-loading').style.display = 'block';
  });

  confirmBtn
    .addEventListener("click", function () {
      selectedDay = $('.calendar li.active').text() || selectedDay;

      const start = formatTimeString(selectedYear, selectedMonth + 1, selectedDay, selectedStartTime, selectedMeridiem, selectedTimeZone);
      const end = formatTimeString(selectedYear, selectedMonth + 1, selectedDay, selectedEndTime, selectedMeridiem, selectedTimeZone);

      chrome.tabs.create({
        url: `https://calendar.google.com/calendar/u/0/r/eventedit?dates=${start}/${end}&trp=true`,
      });

      chrome.storage.local.set({ roomId: roomId })

    });

  registerLink.addEventListener('click', function () {
    chrome.tabs.create({
      url: 'https://stg-my.chatruume.com/register'
    })
  })

  forgotPasswordSpan.addEventListener('click', function () {
    chrome.tabs.create({
      url: 'https://stg-my.chatruume.com/login?forgot-password'
    })
  })

  enterMeetingBtn.addEventListener("click", function () {
    if (roomId) {
      const loading = document.getElementById('loading');
      chrome.runtime.sendMessage({
        action: 'createMeeting',
        templateId: roomId
      });
      loading.style.display = 'block';
    } else {
      chrome.tabs.create({
        url: "https://stg-my.chatruume.com/dashboard",
      });
    }
  });

  /*
      Error message logic
  */
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'displayErrorMessage') {
      errorMessageField.textContent = 'wrong credential.';
      document.getElementById('signin-loading').style.display = 'none';
    } else if (message.action === 'reloadPage') {
      location.reload();
    }
  })


  /*
      Dynamic Collapse Script
  */
  $('dropdown input[type="checkbox"]').change(function () {
    if ($(this).prop('checked')) {
      $(this).next().next().css({
        maxHeight: $(this).next().next()[0].scrollHeight + 'px'
      });
    } else {
      $(this).next().next().css({
        maxHeight: '0px'
      });
    }
  })
});


/**
 * Format time string function
 */
function formatTimeString(year, month, date, timeString, period, timezoneOffset) {
  const hours = parseInt(timeString.slice(0, 2));
  const minutes = parseInt(timeString.slice(2, 4));

  // Convert hours to 24-hour format
  let hours24 = hours;
  if (period === 'pm' && hours !== 12) {
    hours24 += 12;
  } else if (period === 'am' && hours === 12) {
    hours24 = 0;
  }

  // Adjust time based on timezone offset
  const offsetHours = parseInt(timezoneOffset);
  hours24 -= offsetHours;

  // Create a Date object in GMT+0.00 timezone
  const dateObj = new Date(Date.UTC(year, month - 1, date, hours24, minutes));

  // Format the components into the final string format
  const formattedString = dateObj.toISOString().replace(/[-:]/g, '').slice(0, -5) + 'Z';

  return formattedString;
}



/*
    Rendering calendar function
*/
function renderCal() {
  $('.calendar li').remove();
  $('.calendar ul').append('<li>mo</li><li>tu</li><li>we</li><li>th</li><li>fr</li><li>sa</li> <li>su</li>');
  selectedYear = parseInt($('#year .selected').attr('data-value'));
  selectedMonth = parseInt($('#month .selected').attr('data-value'));
  selectedMeridiem = $('#meridiem .selected').attr('data-value');
  selectedTimeZone = $('#timezone .selected').attr('data-value');
  selectedStartTime = $('#start-time .selected').attr('data-value');
  selectedEndTime = $('#end-time .selected').attr('data-value');
  days = numDays(selectedMonth, selectedYear), // get number of days in the month
    fDay = firstDay(selectedMonth, selectedYear) - 1, // find what day of the week the 1st lands on
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // month names

  for (var i = 0; i < fDay; i++) { // place the first day of the month in the correct position
    $('<li>&nbsp;</li>').appendTo('.calendar ul');
  }

  for (var i = 1; i <= days; i++) { // write out the days
    const liElem = $('<li></li>').html(i);
    liElem.click(function () {
      $('.calendar li').removeClass('active');
      $(this).addClass('active');
    });

    $('.calendar ul').append(liElem);
  }

  function firstDay(month, year) {
    return new Date(year, month, 1).getDay();
  }

  function numDays(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }
}



/*
    Custom select element script
*/

function toggleCustomSelect(event) {
  // Close all open custom selects first
  for (const customSelect of document.querySelectorAll('.custom-select')) {
    if (customSelect !== event.currentTarget) {
      customSelect.classList.remove('open');
    }
  }
  // Then toggle the current one
  event.currentTarget.classList.toggle('open');
}

function selectOption(event) {
  let option = event.target;
  let customSelect = option.closest('.custom-select');
  let trigger = customSelect.querySelector('.custom-select__trigger span');

  // Change the text of the select trigger to match the selected option
  trigger.textContent = option.textContent;

  // Update the selected option
  customSelect.querySelectorAll('.custom-option').forEach((opt) => opt.classList.remove('selected'));
  option.classList.add('selected');

  // Close the dropdown after selection
  customSelect.classList.remove('open');

  event.stopPropagation();

  if (customSelect.id === 'year' || customSelect.id === 'month') { renderCal(); }
}

function setupCustomSelects() {
  document.querySelectorAll('.custom-select-wrapper').forEach((wrapper) => {
    let customSelect = wrapper.querySelector('.custom-select');
    let options = wrapper.querySelectorAll('.custom-option');
    // Toggle dropdown
    customSelect.addEventListener('click', toggleCustomSelect);

    // Select an option
    options.forEach((option) => {
      option.addEventListener('click', selectOption);
    });
  });
}

function closeAllCustomSelects(event) {
  if (!event.target.closest('.custom-select')) {
    document.querySelectorAll('.custom-select').forEach((select) => {
      select.classList.remove('open');
    });
  }
}

setupCustomSelects();

window.addEventListener('click', closeAllCustomSelects);

document.querySelectorAll('.custom-select').forEach((select) => {
  select.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});



