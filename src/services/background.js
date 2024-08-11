chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
      chrome.storage.local.get(['trackedSites'], (result) => {
        const trackedSites = result.trackedSites || [];
  
        const category = classifyURL(tab.url);
  
        trackedSites.push({ url: tab.url, category, timestamp: new Date().toISOString() });
  
        chrome.storage.local.set({ trackedSites });
      });
    }
});
  

function classifyURL(url) {
    if (url.includes('youtube.com') || url.includes('netflix.com')) {
      return 'Entertainment';
    } else if (url.includes('stackoverflow.com') || url.includes('w3schools.com')) {
      return 'Study';
    } else if (url.includes('twitch.tv')) {
      return 'Video Games';
    } else {
      return 'Other';
    }
  }