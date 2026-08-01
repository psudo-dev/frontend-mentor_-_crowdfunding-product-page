import { renderCard } from "./render-card";
import { getCardElementIds } from "./render-utils";
import type { Pledge, Option } from "./types";

const formOptionTemplate = document.createElement("template");
formOptionTemplate.innerHTML = /*html*/ `
	<div class="card campaign-modal__form-option">
	<div class="card__option">
		<input type="radio" name="pledge-option" class="card__radio">
		<label class="card__label">
			<h3 class="card__title"></h3>
			<span class="card__subtitle">Pledge $<span class="card__subtitle-pledge"></span> or more</span>
		</label>
		<p class="card__description"></p>
		<p class="card__reward">
			<span class="card__reward-quantity"></span>
			left
		</p>
	</div>
	<span class="card__separator"></span>
	<div class="card__pledge-container">
		<label class="card__pledge-text">Enter your pledge</label>
		<div class="card__pledge">
			<div class="card__pledge-input">
				<span class="card__pledge-prefix">$</span>
				<input class="card__pledge-field" type="text" inputmode="numeric" name="pledge-amount">
			</div>
			<button class="card__pledge-button" type="submit">Continue</button>
			<span class="card__pledge-error"></span>
		</div>
	</div>
</div>`;

export function getFormCardElements(card: HTMLElement) {
	const radioInput = card.querySelector<HTMLElement>(".card__radio");
	const label = card.querySelector<HTMLElement>(".card__label");
	const pledgeInputWrapper = card.querySelector<HTMLElement>(
		".card__pledge-input",
	);
	const pledgeLabel = card.querySelector<HTMLElement>(".card__pledge-text");
	const pledgeInput = card.querySelector<HTMLElement>(".card__pledge-field");
	const submitButton = card.querySelector<HTMLElement>(
		".card__pledge-button",
	);
	const errorField = card.querySelector<HTMLElement>(".card__pledge-error");

	if (
		!(radioInput instanceof HTMLInputElement) ||
		!label ||
		!pledgeInputWrapper ||
		!pledgeLabel ||
		!(pledgeInput instanceof HTMLInputElement) ||
		!(submitButton instanceof HTMLButtonElement) ||
		!errorField
	)
		return null;

	return {
		radioInput,
		label,
		pledgeInputWrapper,
		pledgeLabel,
		pledgeInput,
		submitButton,
		errorField,
	};
}

export function renderForm(options: Option[], pledgesArr: Pledge[]): void {
	const campaignForm = document.querySelector<HTMLElement>(
		".campaign-modal__form",
	);
	if (!campaignForm) return;

	const formFragment = document.createDocumentFragment();

	options.forEach((option) => {
		const { id, minimumPledge } = option;

		const clone = formOptionTemplate.content.cloneNode(true) as HTMLElement;
		const card = getFormCardElements(clone);

		if (!card) return;

		renderCard(clone, option, pledgesArr, "form");

		const pledgeAmountId = `pledge-amount-${id}`;
		const { rewardId } = getCardElementIds(option.id, "form");

		card.radioInput.id = id;
		card.radioInput.setAttribute("aria-describedby", rewardId);
		card.label.setAttribute("for", id);
		card.pledgeLabel.setAttribute("for", pledgeAmountId);
		card.pledgeInput.id = pledgeAmountId;
		card.pledgeInput.setAttribute("value", minimumPledge.toString());

		formFragment.appendChild(clone);
	});
	campaignForm.appendChild(formFragment);
}
