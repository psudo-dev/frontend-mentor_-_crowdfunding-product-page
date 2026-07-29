import "../css/style.css";

const menuToggle = document.querySelector(".header__menu-toggle");
const menuOpenIcon = document.querySelector(".header__menu-open");
const menuCloseIcon = document.querySelector(".header__menu-close");
const menu = document.querySelector(".header__menu");
const headerOverlay = document.querySelector(".header__overlay");
const backThisProjectBtn = document.querySelector(
	".project-header__back-button",
);
const bookmarkBtn = document.querySelector(".project-header__bookmark-button");
const bookmarkText = document.querySelector(".project-header__bookmark-text");
const projectModal = document.querySelector(
	".project-modal",
) as HTMLDialogElement;
const closeModalBtn = document.querySelector(".project-modal__close-button");
const projectOptions = document.querySelectorAll(".project-options__item");
// const bambooRadio = document.querySelector("#bamboo") as HTMLInputElement;
// const blackRadio = document.querySelector("#black") as HTMLInputElement;
// const mahoganyRadio = document.querySelector("#mahogany") as HTMLInputElement;
const form = document.querySelector<HTMLFormElement>(".project-modal__form");
const successModal = document.querySelector(
	".success-modal",
) as HTMLDialogElement;
const successModalBtn = document.querySelector(".success-modal__button");
const cardElements = document.querySelectorAll(".card");

menuToggle?.addEventListener("click", () => {
	const isExpanded = menuToggle.ariaExpanded === "true";
	menuToggle.setAttribute("aria-expanded", String(!isExpanded));

	menuOpenIcon?.classList.toggle("header__menu-open--hidden", !isExpanded);
	menuCloseIcon?.classList.toggle("header__menu-close--visible", !isExpanded);
	menu?.classList.toggle("header__menu--visible", !isExpanded);
	headerOverlay?.classList.toggle("header__overlay--visible", !isExpanded);
});

headerOverlay?.addEventListener("click", () => {
	const isExpanded = menuToggle?.ariaExpanded === "true";
	menuToggle?.setAttribute("aria-expanded", String(!isExpanded));

	menuOpenIcon?.classList.toggle("header__menu-open--hidden", !isExpanded);
	menuCloseIcon?.classList.toggle("header__menu-close--visible", !isExpanded);
	menu?.classList.toggle("header__menu--visible", !isExpanded);
	headerOverlay?.classList.toggle("header__overlay--visible", !isExpanded);
});

backThisProjectBtn?.addEventListener("click", () => {
	projectModal.classList.add("project-container");
	projectModal.showModal();
});

bookmarkBtn?.addEventListener("click", () => {
	if (bookmarkText?.textContent === "Bookmark")
		bookmarkText.textContent = "Bookmarked";
	else if (bookmarkText?.textContent === "Bookmarked")
		bookmarkText.textContent = "Bookmark";
	bookmarkBtn.classList.toggle("bookmarked");
});

cardElements.forEach((card) => {
	const reward = card.querySelector<HTMLElement>(".card__reward");
	const rewardLeft = card.querySelector<HTMLElement>(
		".card__reward-quantity",
	);
	const button = card.querySelector<HTMLElement>(".card__button");

	if (!reward || !rewardLeft) return;

	const span = document.createElement("span");
	span.classList.add("sr-only");
	span.textContent = "Sold out — ";

	const quantity = Number(rewardLeft?.textContent);

	if (quantity === 0) {
		card.classList.add("card--disabled");
		reward?.prepend(span);
		if (button instanceof HTMLButtonElement) {
			button.disabled = true;
			button.textContent = "Out of stock";
			button.setAttribute("aria-describedby", `${reward?.id}`);
		}
	}

	rewardLeft?.addEventListener("change", (e) => {
		const value = Number((e.target as HTMLElement).textContent);

		if (value === 0) {
			card.classList.add("card--disabled");
			reward?.prepend(span);
			if (button instanceof HTMLButtonElement) {
				button.disabled = true;
				button.textContent = "Out of stock";
				button.setAttribute("aria-describedby", `${reward?.id}`);
			}
		}
	});
});

projectModal.addEventListener("click", (e) => {
	const rect = projectModal.getBoundingClientRect();
	const clickedOutside =
		e.clientY < rect.top ||
		e.clientY > rect.bottom ||
		e.clientX < rect.left ||
		e.clientX > rect.right;

	if (clickedOutside) {
		projectModal.classList.remove("project-container");
		projectModal.close();

		const checked = document.querySelector(
			".card__radio:checked",
		) as HTMLInputElement;
		checked.checked = false;
	}
});

closeModalBtn?.addEventListener("click", () => {
	projectModal.classList.remove("project-container");
	projectModal.close();

	const checked = document.querySelector(
		".card__radio:checked",
	) as HTMLInputElement;
	checked.checked = false;
});

function optionChecked(title: string, option: string) {
	if (title.includes(option)) {
		const radio = document.querySelector<HTMLElement>(`#${option}`);
		if (!(radio instanceof HTMLInputElement)) return;
		radio.checked = true;
		radio.focus();
		radio.scrollIntoView({ behavior: "smooth", block: "center" });
	}
}

projectOptions.forEach((option) => {
	const cardTitle = option
		.querySelector(".card__title")
		?.textContent.toLowerCase();

	if (!cardTitle) return;

	const button = option.querySelector(".card__button");
	button?.addEventListener("click", () => {
		projectModal.classList.add("project-container");
		projectModal.showModal();

		optionChecked(cardTitle, "bamboo");
		optionChecked(cardTitle, "black");
		optionChecked(cardTitle, "mahogany");
	});
});

const formOptions = document.querySelectorAll<HTMLElement>(
	".project-modal__form-option",
);

function validateInput(
	value: string,
	minimumAmount: number,
): { valid: boolean; message: string } {
	if (value === "")
		return { valid: false, message: "Please enter a pledge amount." };
	if (Number(value) < minimumAmount)
		return {
			valid: false,
			message: `Please enter $${minimumAmount} or more.`,
		};
	if (!/^\d+$/.test(value))
		return { valid: false, message: "Please enter a whole number." };
	return { valid: true, message: "" };
}

formOptions.forEach((option) => {
	const inputWrapper = option.querySelector(".card__pledge-input");
	const inputField = option.querySelector<HTMLInputElement>(
		".card__pledge-field",
	);
	const submitButton = option.querySelector<HTMLButtonElement>(
		".card__pledge-button",
	);
	const radioButton = option.querySelector<HTMLInputElement>(".card__radio");
	const errorField = option.querySelector(".card__pledge-error");
	const minimumAmount = Number(inputField?.value);

	if (!errorField || !submitButton) return;

	let isOutsideInput = false;

	inputField?.addEventListener("blur", (e) => {
		const value = (e.target as HTMLInputElement).value;
		isOutsideInput = true;
		const result = validateInput(value, minimumAmount);

		inputWrapper?.classList.toggle(
			"card__pledge-input--error",
			!result.valid,
		);
		errorField.classList.toggle(
			"card__pledge-error--visible",
			!result.valid,
		);
		errorField.textContent = result.message;

		if (!result.valid) {
			errorField.id = `${inputField.id}-error`;
			inputField.setAttribute("aria-invalid", "true");
			inputField.setAttribute("aria-describedby", errorField.id);
		} else {
			errorField.removeAttribute("id");
			inputField.removeAttribute("aria-invalid");
			inputField.removeAttribute("aria-describedby");
		}
	});

	inputField?.addEventListener("input", (e) => {
		const value = (e.target as HTMLInputElement).value;

		const result = validateInput(value, minimumAmount);

		submitButton.disabled = !result.valid;
		submitButton.classList.toggle(
			"card__pledge-button--error",
			!result.valid,
		);

		if (isOutsideInput) {
			inputWrapper?.classList.toggle(
				"card__pledge-input--error",
				!result.valid,
			);
			errorField.classList.toggle(
				"card__pledge-error--visible",
				!result.valid,
			);
			errorField.textContent = result.message;
		}
		if (result.valid) isOutsideInput = false;
	});

	option.addEventListener("click", () => {
		if (radioButton) radioButton.checked = true;
	});
});

form?.addEventListener("submit", (e) => {
	e.preventDefault();

	const formData = new FormData(form);
	const pledgeOption = formData.get("pledge-option");
	const pledgeAmount = formData.get("pledge-amount");

	projectModal.classList.remove("project-container");
	projectModal.close();

	const checked = document.querySelector(
		".card__radio:checked",
	) as HTMLInputElement;
	checked.checked = false;

	successModal.classList.add("project-container");
	successModal.showModal();
});

successModalBtn?.addEventListener("click", () => {
	successModal.classList.remove("project-container");
	successModal.close();
});

successModal.addEventListener("click", (e) => {
	const rect = successModal.getBoundingClientRect();
	const clickedOutside =
		e.clientY < rect.top ||
		e.clientY > rect.bottom ||
		e.clientX < rect.left ||
		e.clientX > rect.right;

	if (clickedOutside) {
		successModal.classList.remove("project-container");
		successModal.close();
	}
});

const userData = {
	firstVisitDate: "2026-07-29T14:32:00.000Z",
	bookmarked: false,
	pledges: [{ optionId: "bamboo", amount: 25 }],
};
