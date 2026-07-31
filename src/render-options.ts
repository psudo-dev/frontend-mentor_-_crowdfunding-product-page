import { checkRadio, openModal } from "./modal-utils";
import { renderCard } from "./render-card";
import type { Pledge, Option } from "./types";

const optionTemplate = document.createElement("template");
optionTemplate.innerHTML = /*html*/ `
	<li class="campaign-options__item card">
		<div class="card__header">
			<h3 class="card__title"></h3>
			<span class="card__subtitle">Pledge $<span class="card__subtitle-pledge"></span> or more</span>
		</div>
		<p class="card__description"></p>
		<p class="card__reward">
			<span class="card__reward-quantity"></span>
			left
		</p>
		<button class="card__button" type="button">Select Reward</button>
	</li>`;

export function renderOptions(options: Option[], pledgesArr: Pledge[]): void {
	const campaignOptions =
		document.querySelector<HTMLElement>(".campaign-options");
	const campaignModal =
		document.querySelector<HTMLElement>(".campaign-modal");

	if (!campaignOptions || !campaignModal) return;

	const optionsFragment = document.createDocumentFragment();

	options.forEach((option) => {
		const clone = optionTemplate.content.cloneNode(true) as HTMLElement;
		const button = clone.querySelector<HTMLElement>(".card__button");

		if (!button) return;

		const rewardId = `${option.id}-option-status`;

		renderCard(clone, option, pledgesArr, "option");
		button.setAttribute("aria-describedby", rewardId);

		button.addEventListener("click", () => {
			openModal(campaignModal);
			checkRadio(option.id);
		});

		optionsFragment.appendChild(clone);
	});
	campaignOptions.appendChild(optionsFragment);
}
