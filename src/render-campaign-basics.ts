export function renderCampaignBasics(
	title: string,
	summary: string,
	description: string[],
): void {
	const headerTitle = document.querySelector<HTMLElement>(
		".campaign-header__title",
	);
	const campaignSummary = document.querySelector<HTMLElement>(
		".campaign-header__text",
	);
	const infoTitle = document.querySelector<HTMLElement>(
		".campaign-info__title",
	);

	if (!headerTitle || !campaignSummary || !infoTitle) return;

	const descriptionFragment = document.createDocumentFragment();

	headerTitle.innerText = title;
	campaignSummary.innerText = summary;
	description.forEach((paragraph) => {
		const paragraphEl = document.createElement("p");
		paragraphEl.classList.add("campaign-info__text");
		paragraphEl.textContent = paragraph;
		descriptionFragment.appendChild(paragraphEl);
	});
	infoTitle.after(descriptionFragment);
}
