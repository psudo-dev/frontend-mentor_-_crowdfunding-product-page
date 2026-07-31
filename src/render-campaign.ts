import { fetchCampaignData, getUserData } from "./data";
import { renderCampaignBasics } from "./render-campaign-basics";
import { renderForm } from "./render-form";
import { renderOptions } from "./render-options";
import { renderStats } from "./render-stats";
import type { Campaign, UserData } from "./types";

function renderCampaign(data: Campaign, userData: UserData): void {
	const { title, summary, description, stats, options } = data;
	const { bookmarked, pledgesArr } = userData;

	renderCampaignBasics(title, summary, description);
	renderStats(stats, userData);
	renderOptions(options, pledgesArr);
	renderForm(options, pledgesArr);

	const bookmarkBtn = document.querySelector<HTMLElement>(
		".campaign-header__bookmark-button",
	);
	const bookmarkText = document.querySelector<HTMLElement>(
		".campaign-header__bookmark-text",
	);

	if (bookmarked && bookmarkText && bookmarkBtn) {
		bookmarkText.textContent = "Bookmarked";
		bookmarkBtn.classList.add("bookmarked");
		bookmarkBtn.setAttribute("aria-pressed", "true");
	}
}

export async function initCampaignPage(): Promise<void> {
	const data = await fetchCampaignData();
	const userData = getUserData();
	if (data && userData) {
		renderCampaign(data, userData);
	}
}
