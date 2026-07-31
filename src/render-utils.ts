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
	inputWrapper?.classList.toggle("card__pledge-input--error", !result.valid);
	errorField.classList.toggle("card__pledge-error--visible", !result.valid);
	errorField.textContent = result.message;
}

export function getCardElementIds(id: string, prefix: Prefix) {
	return {
		cardId: `${id}-${prefix}`,
		rewardId: `${id}-${prefix}-status`,
	};
}
