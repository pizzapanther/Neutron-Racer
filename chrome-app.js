function launch_main_window (launchData) {
  var width = 1100;
  var height = 870;
  
  if (width > screen.availWidth) {
    width = screen.availWidth;
  }
  
  if (height > screen.availHeight) {
    height = screen.availHeight;
  }
  
  chrome.app.window.create('app.html', {
    resizable: true,
    id: "nracer-main",
    bounds: {
      width: width,
      height: height
    }
  });
}

chrome.app.runtime.onLaunched.addListener(launch_main_window);
