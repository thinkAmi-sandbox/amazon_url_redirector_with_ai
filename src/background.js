/**
 * Amazon URL Redirector
 *
 * This extension redirects various Amazon URL patterns to the canonical
 * https://www.amazon.co.jp/dp/<ASIN> format.
 */

/**
 * Checks if a URL matches the canonical Amazon product URL pattern
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is already in canonical format
 */
function isCanonicalAmazonUrl(url) {
	const canonicalPattern =
		/^https:\/\/www\.amazon\.co\.jp\/dp\/[A-Z0-9]{10}(\/?|\?.*\/?)?$/;
	return canonicalPattern.test(url);
}

/**
 * Extracts ASIN from various Amazon URL patterns
 * @param {string} url - The Amazon URL to process
 * @returns {string|null} - The extracted ASIN or null if not found
 */
function extractAsin(url) {
	// Parse the URL
	try {
		const urlObj = new URL(url);

		// Only process amazon.co.jp domain
		if (!urlObj.hostname.includes("amazon.co.jp")) {
			return null;
		}

		// Check various URL patterns to extract ASIN
		const patterns = [
			// /exec/obidos/ASIN/<ASIN>
			/\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/,
			// /o/ASIN/<ASIN>
			/\/o\/ASIN\/([A-Z0-9]{10})/,
			// /exec/obidos/ISBN=<ASIN>
			/\/exec\/obidos\/ISBN=([A-Z0-9]{10})/,
			// /exec/obidos/ISBN%3D<ASIN>
			/\/exec\/obidos\/ISBN%3D([A-Z0-9]{10})/,
			// /o/ISBN=<ASIN>
			/\/o\/ISBN=([A-Z0-9]{10})/,
			// /exec/obidos/tg/detail/-/<ASIN>
			/\/exec\/obidos\/tg\/detail\/-\/([A-Z0-9]{10})/,
			// /exec/obidos/tg/detail/-/Elements-Style/<ASIN>
			/\/exec\/obidos\/tg\/detail\/-\/[^\/]+\/([A-Z0-9]{10})/,
			// /o/tg/detail/-/<ASIN>
			/\/o\/tg\/detail\/-\/([A-Z0-9]{10})/,
			// /o/tg/detail/-/Elements-Style/<ASIN>
			/\/o\/tg\/detail\/-\/[^\/]+\/([A-Z0-9]{10})/,
			// /gp/product/<ASIN>
			/\/gp\/product\/([A-Z0-9]{10})/,
			// /gp/product/product-description/<ASIN>
			/\/gp\/product\/product-description\/([A-Z0-9]{10})/,
			// /Elements-Style/dp/<ASIN>
			/\/[^\/]+\/dp\/([A-Z0-9]{10})/,
			// /Elements-Style/dp/product-description/<ASIN>
			/\/[^\/]+\/dp\/product-description\/([A-Z0-9]{10})/,
			// /%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0Rust-%E7%AC%AC2%E7%89%88-Jim-Blandy/dp/<ASIN>
			/\/[^\/]+\/dp\/([A-Z0-9]{10})\//,
		];

		// Try each pattern
		for (const pattern of patterns) {
			const match = url.match(pattern);
			if (match?.[1]) {
				return match[1];
			}
		}

		// Check for dp/<ASIN> pattern (already canonical but might have extra path components)
		const dpPattern = /\/dp\/([A-Z0-9]{10})/;
		const dpMatch = url.match(dpPattern);
		if (dpMatch?.[1]) {
			return dpMatch[1];
		}

		return null;
	} catch (error) {
		console.error("Error parsing URL:", error);
		return null;
	}
}

/**
 * Creates a canonical Amazon URL from an ASIN
 * @param {string} asin - The ASIN to use
 * @returns {string} - The canonical Amazon URL
 */
function createCanonicalUrl(asin) {
	return `https://www.amazon.co.jp/dp/${asin}`;
}

// We'll use the declarativeNetRequest API for redirects instead of navigation listeners

// Set up static declarative rules for common Amazon URL patterns
chrome.runtime.onInstalled.addListener(() => {
	// Create rules for common Amazon URL patterns
	const rules = [
		// /exec/obidos/ASIN/<ASIN>
		{
			id: 1,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter:
					"https://www\\.amazon\\.co\\.jp/exec/obidos/ASIN/([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /o/ASIN/<ASIN>
		{
			id: 2,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter: "https://www\\.amazon\\.co\\.jp/o/ASIN/([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /exec/obidos/ISBN=<ASIN>
		{
			id: 3,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter:
					"https://www\\.amazon\\.co\\.jp/exec/obidos/ISBN=([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /exec/obidos/ISBN%3D<ASIN>
		{
			id: 4,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter:
					"https://www\\.amazon\\.co\\.jp/exec/obidos/ISBN%3D([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /o/ISBN=<ASIN>
		{
			id: 5,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter: "https://www\\.amazon\\.co\\.jp/o/ISBN=([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /exec/obidos/tg/detail/-/<ASIN>
		{
			id: 6,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter:
					"https://www\\.amazon\\.co\\.jp/exec/obidos/tg/detail/-/([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /exec/obidos/tg/detail/-/Elements-Style/<ASIN>
		{
			id: 7,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter:
					"https://www\\.amazon\\.co\\.jp/exec/obidos/tg/detail/-/[^/]+/([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /o/tg/detail/-/<ASIN>
		{
			id: 8,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter:
					"https://www\\.amazon\\.co\\.jp/o/tg/detail/-/([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /o/tg/detail/-/Elements-Style/<ASIN>
		{
			id: 9,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter:
					"https://www\\.amazon\\.co\\.jp/o/tg/detail/-/[^/]+/([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /gp/product/<ASIN>
		{
			id: 10,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter:
					"https://www\\.amazon\\.co\\.jp/gp/product/([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /gp/product/product-description/<ASIN>
		{
			id: 11,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter:
					"https://www\\.amazon\\.co\\.jp/gp/product/product-description/([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /<title>/dp/<ASIN>
		{
			id: 12,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter: "https://www\\.amazon\\.co\\.jp/[^/]+/dp/([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /<title>/dp/product-description/<ASIN>
		{
			id: 13,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter:
					"https://www\\.amazon\\.co\\.jp/[^/]+/dp/product-description/([A-Z0-9]{10}).*",
				resourceTypes: ["main_frame"],
			},
		},
		// /dp/<ASIN>?* (URLs with query parameters, with or without trailing slash)
		{
			id: 14,
			priority: 1,
			action: {
				type: "redirect",
				redirect: {
					regexSubstitution: "https://www.amazon.co.jp/dp/\\1",
				},
			},
			condition: {
				regexFilter: "https://www\\.amazon\\.co\\.jp/dp/([A-Z0-9]{10})\\?.*",
				resourceTypes: ["main_frame"],
			},
		},
	];

	// Update the dynamic rules
	chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: rules.map((rule) => rule.id), // Remove any existing rules
		addRules: rules,
	});
});
