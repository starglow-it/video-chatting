document.addEventListener("DOMContentLoaded", function () {
  const scheduleMeetingBtn = document.getElementById("scheduleMeeting");
  const enterMeetingBtn = document.getElementById("enterMeeting");
  const singInBtn = document.getElementById("signinMeeting");
  const loggedInDiv = document.getElementById("logged-in");
  const notLoggedInDiv = document.getElementById("not-logged-in");

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

  singInBtn.addEventListener("click", function () {
    chrome.tabs.create({ url: "https://stg-my.chatruume.com/login" });
  });

  scheduleMeetingBtn.addEventListener("click", function () {
    chrome.tabs.create({
      url: "https://calendar.google.com/calendar/render?action=TEMPLATE",
    });
  });

  enterMeetingBtn.addEventListener("click", function () {
    chrome.tabs.create({
      url: "https://stg-my.chatruume.com/dashboard",
    });
  });
});
