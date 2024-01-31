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

  chrome.cookies.get(
    { url: "https://stg-my.chatruume.com", name: "accessToken" },
    function (cookie) {
      console.log(cookie);
      if (cookie) {
        notLoggedInDiv.style.display = "none";
      } else {
        loggedInDiv.style.display = "none";
      }
    }
  );

  googleLoginField.addEventListener('click', function() {
    // const client = google.accounts.oauth2.initTokenClient({
    //         client_id: '539436979316-p97bn16seanblh660ii9ef4g35msqpm6.apps.googleusercontent.com',
    //         scope: 'email profile',
    //         callback: res => {
    //           // handleSuccess(res.access_token);
    //           alert(res.access_token);
    //           console.log(res.access_token)
    //         },
    //         error_callback: err => {
    //           console.log(err.message);
    //         },
    //       });
    //       client.requestAccessToken();

    // chrome.identity.getAuthToken({ interactive: true }, function(token) {
    //   if (chrome.runtime.lastError) {
    //     console.error(chrome.runtime.lastError.message);
    //     return;
    //   }
  
    //   if (token) {
    //     // Use the token to make API requests
    //     chrome.runtime.sendMessage({ action: "getUserInfo", token: token });
    //   } else {
    //     console.error('The OAuth Token was null');
    //   }
    // });

    chrome.runtime.sendMessage({
      action: 'startGoogleLogin'
    })
  });

  signInForm.addEventListener("submit", async function () {
    chrome.runtime.sendMessage({action: 'saveCookie', email: emailInput.value, password: passwordInput.value})
  });

  scheduleMeetingBtn.addEventListener("click", function () {
    chrome.tabs.create({
      url: "https://calendar.google.com/calendar/render?action=TEMPLATE",
    });
  });

  registerLink.addEventListener('click', function() {
    chrome.tabs.create({
      url: 'https://stg-my.chatruume.com/register'
    })
  })

  enterMeetingBtn.addEventListener("click", function () {
    chrome.tabs.create({
      url: "https://stg-my.chatruume.com/dashboard",
    });
  });

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'displayErrorMessage') {
      errorMessageField.textContent = message.error;
    } else if (message.action === 'reloadPage') {
      location.reload();
    }
  })

});
