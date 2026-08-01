import { fetchCampaignData, getUserData, setUserData } from "./data";
import {
	clickedOutside,
	closeModal,
	openModal,
	uncheckRadio,
} from "./modal-utils";
import { getFormCardElements } from "./render-form";
import { renderStats } from "./render-stats";
import { inputError, updatePledgeCounter } from "./render-utils";
import { validateInput } from "./utils";

export function setupListeners(): void {
	const backThisProjectBtn = document.querySelector<HTMLElement>(
		".campaign-header__back-button",
	);
	const bookmarkBtn = document.querySelector<HTMLElement>(
		".campaign-header__bookmark-button",
	);
	const campaignModal =
		document.querySelector<HTMLElement>(".campaign-modal");
	const closeModalBtn = document.querySelector<HTMLElement>(
		".campaign-modal__close-button",
	);
	const bookmarkText = document.querySelector<HTMLElement>(
		".campaign-header__bookmark-text",
	);
	const successModal = document.querySelector<HTMLElement>(".success-modal");
	const successModalBtn = document.querySelector<HTMLElement>(
		".success-modal__button",
	);
	const form = document.querySelector<HTMLElement>(".campaign-modal__form");

	backThisProjectBtn?.addEventListener("click", () => {
		openModal(campaignModal);
	});

	bookmarkBtn?.addEventListener("click", () => {
		const userData = getUserData();
		if (!userData || !bookmarkText) return;

		if (bookmarkText.textContent === "Bookmark") {
			bookmarkText.textContent = "Bookmarked";
			userData.bookmarked = true;
			setUserData(userData);
		} else {
			bookmarkText.textContent = "Bookmark";
			userData.bookmarked = false;
			setUserData(userData);
		}
		bookmarkBtn.classList.toggle("bookmarked", userData.bookmarked);
		bookmarkBtn.setAttribute("aria-pressed", `${userData.bookmarked}`);
	});

	campaignModal?.addEventListener("click", (e) => {
		if (clickedOutside(campaignModal, e)) closeModal(campaignModal);
	});

	closeModalBtn?.addEventListener("click", () => {
		closeModal(campaignModal);
	});

	campaignModal?.addEventListener("close", () => {
		uncheckRadio();
	});

	successModalBtn?.addEventListener("click", () => {
		closeModal(successModal);
	});

	successModal?.addEventListener("click", (e) => {
		if (clickedOutside(successModal, e)) closeModal(successModal);
	});

	const formCards = form?.querySelectorAll<HTMLElement>(".card");
	formCards?.forEach((card) => {
		const cardElements = getFormCardElements(card);

		if (!cardElements) return;

		const {
			radioInput,
			pledgeInputWrapper,
			pledgeInput,
			submitButton,
			errorField,
		} = cardElements;

		const minimumAmount = Number(pledgeInput.value);
		let isOutsideInput = false;

		pledgeInput.addEventListener("blur", (e) => {
			const value = (e.target as HTMLInputElement).value;
			isOutsideInput = true;
			const result = validateInput(value, minimumAmount);

			inputError(result, pledgeInputWrapper, errorField);

			if (!result.valid) {
				errorField.id = `${pledgeInput.id}-error`;
				pledgeInput.setAttribute("aria-invalid", "true");
				pledgeInput.setAttribute("aria-describedby", errorField.id);
			} else {
				errorField.removeAttribute("id");
				pledgeInput.removeAttribute("aria-invalid");
				pledgeInput.removeAttribute("aria-describedby");
			}
		});

		pledgeInput.addEventListener("input", (e) => {
			const value = (e.target as HTMLInputElement).value;
			const result = validateInput(value, minimumAmount);

			submitButton.disabled = !result.valid;

			if (isOutsideInput)
				inputError(result, pledgeInputWrapper, errorField);
			if (result.valid) isOutsideInput = false;
		});

		card.addEventListener("click", (e) => {
			const target = e.target as HTMLElement;
			if (target.closest("input, button, label")) return;
			radioInput.checked = true;
		});
	});

	form?.addEventListener("submit", async (e) => {
		e.preventDefault();

		const radioInput = document.querySelector<HTMLElement>(
			".card__radio:checked",
		);
		if (!(radioInput instanceof HTMLInputElement)) return;

		const pledgeOption = radioInput.id;
		const pledgeInput = form.querySelector<HTMLElement>(
			`#pledge-amount-${pledgeOption}`,
		);

		if (!(pledgeInput instanceof HTMLInputElement)) return;

		const pledgeAmount = pledgeInput.value;

		const data = await fetchCampaignData();
		const userData = getUserData();

		if (!data || !userData) return;

		const index = userData.pledgesArr.findIndex(
			(pledge) => pledge.id === pledgeOption,
		);
		if (index !== -1) {
			userData.pledgesArr[index].amountArr.push(Number(pledgeAmount));
		} else {
			userData.pledgesArr.push({
				id: pledgeOption,
				amountArr: [Number(pledgeAmount)],
			});
		}
		setUserData(userData);

		renderStats(data.stats, userData);
		updatePledgeCounter(pledgeOption);

		closeModal(campaignModal);

		radioInput.checked = false;

		openModal(successModal);
	});
}
