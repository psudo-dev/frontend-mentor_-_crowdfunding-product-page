import { disableCard, getCardElementIds } from "./render-utils";
import type { Prefix, Pledge, Option } from "./types";
import { updatedPledgesLeft } from "./utils";

export function renderCard(
	clone: HTMLElement,
	option: Option,
	pledgesArr: Pledge[],
	prefix: Prefix,
): void {
	const card = clone.querySelector<HTMLElement>(".card");
	const cardTitle = clone.querySelector<HTMLElement>(".card__title");
	const subtitlePledge = clone.querySelector<HTMLElement>(
		".card__subtitle-pledge",
	);
	const cardDescription =
		clone.querySelector<HTMLElement>(".card__description");
	const cardReward = clone.querySelector<HTMLElement>(".card__reward");
	const rewardQuantity = clone.querySelector<HTMLElement>(
		".card__reward-quantity",
	);

	if (
		!card ||
		!cardTitle ||
		!subtitlePledge ||
		!cardDescription ||
		!cardReward ||
		!rewardQuantity
	)
		return;

	const { id, title, minimumPledge, description, pledgesLeft } = option;
	const { cardId, rewardId } = getCardElementIds(id, prefix);

	const newPledgesLeft = updatedPledgesLeft(id, pledgesLeft, pledgesArr);

	card.id = cardId;
	cardTitle.textContent = title;
	subtitlePledge.textContent = minimumPledge.toString();
	cardDescription.textContent = description;
	cardReward.id = rewardId;
	rewardQuantity.textContent = `${newPledgesLeft}`;

	if (newPledgesLeft === 0) disableCard(card);
}
