console.log("Background script running");

// Updated regex to handle all URL patterns in productContext.md
const dpAsinRegex = /^https:\/\/www\.amazon\.co\.jp\/dp\//;

const asinRegex =
	/https:\/\/www\.amazon\.co\.jp\/(?:exec\/obidos\/(?:ASIN|ISBN[=%])?|o\/(?:ASIN|ISBN=|tg\/detail\/-\/)|gp\/product(?:\/product-description)?|dp(?:\/product-description)?|[^\/]+\/dp(?:\/product-description)?)\/([A-Z0-9]+)/;


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log(tab);
	console.log(changeInfo);
	if (
		changeInfo.status === "complete" &&
		tab &&
		tab.url &&
		tab.url.startsWith("https://www.amazon.co.jp/")
	) {
		if (!dpAsinRegex.test(tab.url)) {
			console.log('pass')
			if (asinRegex.test(tab.url)) {
				console.log("URL doesn't match the expected pattern. Redirecting...");
				const asinMatch = tab.url.match(asinRegex);

				console.log(asinMatch)
				if (asinMatch?.[1]) {
					const asin = asinMatch[1];
					const redirectURL = `https://www.amazon.co.jp/dp/${asin}`;
					console.log(`Redirecting to ${redirectURL}`);
					chrome.tabs.update(tabId, { url: redirectURL });
				}
			}
		}
	}
});
