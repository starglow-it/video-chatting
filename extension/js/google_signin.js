async function waitForElement(query) {
    let element = document.querySelector(query);
    while(!element) {
        await new Promise(resolve => {setTimeout(resolve)});
        element = document.querySelector(query);
    }

    return element;
}

async function simulateClick(element) {
    element.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
  }


window.addEventListener("load", async () => {
    if (!window.hasLoadedContentScript) {
      window.hasLoadedContentScript = true;
      const loginWithGoogleSpan = await waitForElement('span.MuiTypography-root.MuiTypography-body1');
      await simulateClick(loginWithGoogleSpan.parentElement)
    }
  });
