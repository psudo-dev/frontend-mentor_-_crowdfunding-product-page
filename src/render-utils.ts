import type { InputValidation, Prefix } from "./types";

export function disableCard(card: HTMLElement): void {
	const reward = card.querySelector<HTMLElement>(".card__reward");
	if (!reward) return;

	const button = card.querySelector("button");
	const inputs = card.querySelectorAll("input");
	const span = document.createElement("span");
	span.classList.add("sr-only");
	span.textContent = "Sold out — ";
	card.classList.add("card--disabled");
	reward.prepend(span);
	if (button) {
		button.disabled = true;
		button.textContent = "Out of stock";
	}
	if (inputs) {
		inputs.forEach((input) => (input.disabled = true));
	}
}

export function updatePledgeCounter(pledgeOption: string): void {
	const optionCard = document.querySelector<HTMLElement>(
		`#${pledgeOption}-option`,
	);
	const formCard = document.querySelector<HTMLElement>(
		`#${pledgeOption}-form`,
	);
	const optionRewardQuantity = optionCard?.querySelector<HTMLElement>(
		".card__reward-quantity",
	);
	const formRewardQuantity = formCard?.querySelector<HTMLElement>(
		".card__reward-quantity",
	);

	if (
		!optionCard ||
		!formCard ||
		!optionRewardQuantity ||
		!formRewardQuantity
	)
		return;

	const newPledgesLeft = Number(optionRewardQuantity.textContent) - 1;
	optionRewardQuantity.textContent = `${newPledgesLeft}`;
	formRewardQuantity.textContent = `${newPledgesLeft}`;
	if (newPledgesLeft === 0) {
		disableCard(optionCard);
		disableCard(formCard);
	}
}

export function inputError(
	result: InputValidation,
	inputWrapper: HTMLElement,
	errorField: HTMLElement,
): void {
	inputWrapper.classList.toggle("card__pledge-input--error", !result.valid);
	errorField.classList.toggle("card__pledge-error--visible", !result.valid);
	errorField.textContent = result.message;
}

export function getCardElementIds(id: string, prefix: Prefix) {
	return {
		cardId: `${id}-${prefix}`,
		rewardId: `${id}-${prefix}-status`,
	};
}

export function campaignEnded(): void {
	const backButton = document.querySelector<HTMLElement>(
		".campaign-header__back-button",
	);
	const campaignEnded = document.querySelector<HTMLElement>(
		".campaign-stats__ended",
	);
	const campaignOptions =
		document.querySelector<HTMLElement>(".campaign-options");
	const optionButtons =
		campaignOptions?.querySelectorAll<HTMLElement>(".card__button");

	if (
		!(backButton instanceof HTMLButtonElement) ||
		!optionButtons ||
		!campaignEnded
	)
		return;

	backButton.textContent = "Campaign ended";
	backButton.setAttribute("aria-describedby", "campaign-ended");
	backButton.disabled = true;

	campaignEnded.classList.add("campaign-stats__ended--visible");

	optionButtons.forEach((button) => {
		if (!(button instanceof HTMLButtonElement)) return;

		button.setAttribute("aria-describedby", "campaign-ended");
		button.disabled = true;
	});
}

export function campaignSuccess(): void {
	const campaignEnded = document.querySelector<HTMLElement>(
		".campaign-stats__ended",
	);
	const campaignEndedTitle = document.querySelector<HTMLElement>(
		".campaign-stats__ended-title",
	);
	const campaignEndedText = document.querySelector<HTMLElement>(
		".campaign-stats__ended-text",
	);

	if (!campaignEnded || !campaignEndedTitle || !campaignEndedText) return;

	campaignEnded.classList.add("campaign-stats__ended--visible");
	campaignEndedTitle.textContent = "Project Successfully Funded!";
	campaignEndedTitle.classList.add("campaign-stats__ended-title--success");
	campaignEndedText.textContent =
		"Goal reached! Follow our updates to track the progress of the production and delivery.";
	campaignEndedText.classList.add("campaign-stats__ended-text--success");
}
