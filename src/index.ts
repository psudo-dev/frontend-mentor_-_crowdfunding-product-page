import "../css/style.css";

interface Stats {
	totalBacked: number;
	totalFunding: number;
	totalBackers: number;
	daysLeft: number;
}

interface Option {
	id: string;
	title: string;
	minimumPledge: number;
	description: string;
	pledgesLeft: number;
}

interface Campaign {
	title: string;
	summary: string;
	description: string[];
	stats: Stats;
	options: Option[];
}

interface InputValidation {
	valid: boolean;
	message: string;
}

async function fetchCampaignData(): Promise<Campaign | null> {
	try {
		const response = await fetch("/campaign.json");
		if (!response.ok) {
			throw new Error(
				`Erro ao buscar dados: ${response.status} ${response.statusText}`,
			);
		}
		const json = (await response.json()) as Campaign;
		return json;
	} catch (error) {
		console.error(error);
		return null;
	}
}

interface Pledge {
	id: string;
	amountArr: number[];
}

interface UserData {
	firstVisit: string;
	bookmarked: boolean;
	pledgesArr: Pledge[];
}

const menuToggle = document.querySelector<HTMLElement>(".header__menu-toggle");
const menuOpenIcon = document.querySelector<HTMLElement>(".header__menu-open");
const menuCloseIcon = document.querySelector<HTMLElement>(
	".header__menu-close",
);
const menu = document.querySelector<HTMLElement>(".header__menu");
const headerOverlay = document.querySelector<HTMLElement>(".header__overlay");
const backThisProjectBtn = document.querySelector<HTMLElement>(
	".campaign-header__back-button",
);
const bookmarkBtn = document.querySelector<HTMLElement>(
	".campaign-header__bookmark-button",
);
const bookmarkText = document.querySelector<HTMLElement>(
	".campaign-header__bookmark-text",
);
const campaignModal = document.querySelector<HTMLElement>(".campaign-modal");
const closeModalBtn = document.querySelector<HTMLElement>(
	".campaign-modal__close-button",
);
const form = document.querySelector<HTMLElement>(".campaign-modal__form");
const successModal = document.querySelector<HTMLElement>(".success-modal");
const successModalBtn = document.querySelector<HTMLElement>(
	".success-modal__button",
);

await initCampaignPage();

function isDate(value: unknown): value is Date {
	return value instanceof Date && !isNaN(value.getTime());
}

function isPledge(value: unknown): value is Pledge {
	if (!(typeof value === "object") || !value) return false;
	if (!("id" in value) || !("amountArr" in value)) return false;

	return (
		typeof value.id === "string" &&
		Array.isArray(value.amountArr) &&
		value.amountArr.every((amount) => typeof amount === "number")
	);
}

function isUserData(value: unknown): value is UserData {
	if (!(typeof value === "object") || !value) return false;
	if (
		!("firstVisit" in value) ||
		!("bookmarked" in value) ||
		!("pledgesArr" in value)
	)
		return false;
	return (
		typeof value.firstVisit === "string" &&
		typeof value.bookmarked === "boolean" &&
		Array.isArray(value.pledgesArr) &&
		value.pledgesArr.every((pledge) => isPledge(pledge))
	);
}

function renderProjectBasics(
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

function renderStats(stats: Stats, userData: UserData): void {
	const statsTotalBacked = document.querySelector<HTMLElement>(
		".stats__total-backed",
	);
	const statsTotalFunding = document.querySelector<HTMLElement>(
		".stats__total-funding",
	);
	const statsTotalBackers = document.querySelector<HTMLElement>(
		".stats__total-backers",
	);
	const statsDaysLeft =
		document.querySelector<HTMLElement>(".stats__days-left");
	const progressBar = document.querySelector<HTMLElement>(
		".campaign-stats__progress-bar",
	);

	if (
		!statsTotalBacked ||
		!statsTotalFunding ||
		!statsTotalBackers ||
		!statsDaysLeft ||
		!progressBar
	)
		return;

	const { totalBacked, totalFunding, totalBackers, daysLeft } = stats;
	const { firstVisit, pledgesArr } = userData;

	const formatter = new Intl.NumberFormat("en-US");

	const userTotal = pledgesTotal(pledgesArr);
	const newTotalBacked = totalBacked + userTotal;

	const userBacked = pledgesArr.length > 0 ? 1 : 0;
	const newTotalBackers = totalBackers + userBacked;

	const todayDate = new Date();
	const firstVisitDate = new Date(firstVisit);
	let daysDiff: number;
	if (!isDate(firstVisitDate)) {
		console.error("Invalid Date Format for userData");
		daysDiff = 0;
	} else {
		daysDiff = daysPassed(todayDate, firstVisitDate);
	}

	const percentage = calcPercentage(newTotalBacked, totalFunding);

	statsTotalBacked.textContent = formatter.format(newTotalBacked);
	statsTotalFunding.textContent = formatter.format(totalFunding);
	statsTotalBackers.textContent = formatter.format(newTotalBackers);
	statsDaysLeft.textContent = `${daysLeft - daysDiff}`;
	progressBar.style.width = percentage;
}

function calcPercentage(backed: number, total: number): string {
	const percentage = backed >= total ? 1 : backed / total;
	return `${percentage * 100}%`;
}

function daysPassed(today: Date, firstVisit: Date): number {
	const diffInMs = Math.abs(today.getTime() - firstVisit.getTime());
	const msPerDay = 1000 * 60 * 60 * 24;

	return Math.floor(diffInMs / msPerDay);
}

function pledgesTotal(pledgesArr: Pledge[]): number {
	return pledgesArr.reduce((pledgeTotal, currPledge) => {
		const total = currPledge.amountArr.reduce(
			(totalAmount, currAmount) => totalAmount + currAmount,
			0,
		);
		return pledgeTotal + total;
	}, 0);
}

function updatePledgeCounter(pledgeOption: string): void {
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

function renderOptions(options: Option[], pledgesArr: Pledge[]): void {
	const campaignOptions =
		document.querySelector<HTMLElement>(".campaign-options");
	if (!campaignOptions) return;

	const optionsFragment = document.createDocumentFragment();
	const optionTemplate = document.createElement("template");
	optionTemplate.innerHTML = `<li class="campaign-options__item card">
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

	options.forEach((option) => {
		const { id, title, minimumPledge, description, pledgesLeft } = option;

		const clone = optionTemplate.content.cloneNode(true) as HTMLElement;
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
		const button = clone.querySelector<HTMLElement>(".card__button");

		if (
			!card ||
			!cardTitle ||
			!subtitlePledge ||
			!cardDescription ||
			!cardReward ||
			!rewardQuantity ||
			!button
		)
			return;

		const newPledgesLeft = updatedPledgesLeft(id, pledgesLeft, pledgesArr);

		card.id = `${id}-option`;
		cardTitle.textContent = title;
		subtitlePledge.textContent = minimumPledge.toString();
		cardDescription.textContent = description;
		cardReward.id = `${id}-reward`;
		rewardQuantity.textContent = `${newPledgesLeft}`;

		button?.addEventListener("click", () => {
			openModal(campaignModal);
			optionChecked(id);
		});

		if (newPledgesLeft === 0) disableCard(card);

		optionsFragment.appendChild(clone);
	});
	campaignOptions.appendChild(optionsFragment);
}

function disableCard(card: HTMLElement): void {
	const reward = card.querySelector<HTMLElement>(".card__reward");
	if (!reward) return;

	const button = card.querySelector<HTMLElement>(".card__button");
	const span = document.createElement("span");
	span.classList.add("sr-only");
	span.textContent = "Sold out — ";

	card.classList.add("card--disabled");
	reward.prepend(span);
	if (button instanceof HTMLButtonElement) {
		button.disabled = true;
		button.textContent = "Out of stock";
		button.setAttribute("aria-describedby", `${reward.id}`);
	}
}

function updatedPledgesLeft(
	id: string,
	pledgesLeft: number,
	pledgesArr: Pledge[],
): number {
	const total = pledgesArr.find((pledge) => pledge.id === id);
	if (!total) return pledgesLeft;
	return pledgesLeft - total.amountArr.length;
}

function renderForm(options: Option[], pledgesArr: Pledge[]): void {
	const campaignForm = document.querySelector<HTMLElement>(
		".campaign-modal__form",
	);
	if (!campaignForm) return;

	const formFragment = document.createDocumentFragment();
	const formOptionTemplate = document.createElement("template");
	formOptionTemplate.innerHTML = `<div class="card campaign-modal__form-option">
            <div class="card__option">
              <input type="radio" name="pledge-option"class="card__radio">
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
                  <input class="card__pledge-field" type="text" inputmode="numeric"
                    name="pledge-amount">
                </div>
                <button class="card__pledge-button" type="submit">Continue</button>
                <span class="card__pledge-error"></span>
              </div>
            </div>
          </div>`;

	options.forEach((option) => {
		const { id, title, minimumPledge, description, pledgesLeft } = option;

		const clone = formOptionTemplate.content.cloneNode(true) as HTMLElement;
		const card = clone.querySelector<HTMLElement>(".card");
		const radioButton =
			clone.querySelector<HTMLInputElement>(".card__radio");
		const label = clone.querySelector<HTMLElement>(".card__label");
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
		const pledgeLabel =
			clone.querySelector<HTMLElement>(".card__pledge-text");

		const pledgeInputWrapper = clone.querySelector<HTMLElement>(
			".card__pledge-input",
		);
		const pledgeInput = clone.querySelector<HTMLInputElement>(
			".card__pledge-field",
		);
		const submitButton = clone.querySelector<HTMLButtonElement>(
			".card__pledge-button",
		);
		const errorField = clone.querySelector<HTMLElement>(
			".card__pledge-error",
		);

		if (
			!card ||
			!radioButton ||
			!label ||
			!cardTitle ||
			!subtitlePledge ||
			!cardDescription ||
			!cardReward ||
			!rewardQuantity ||
			!pledgeLabel ||
			!pledgeInputWrapper ||
			!pledgeInput ||
			!submitButton ||
			!errorField
		)
			return;

		const newPledgesLeft = updatedPledgesLeft(id, pledgesLeft, pledgesArr);
		const optionStatusId = `${id}-status`;
		const pledgeAmountId = `pledge-amount-${id}`;

		card.id = `${id}-form`;
		radioButton.id = id;
		radioButton.setAttribute("aria-describedby", optionStatusId);
		label.setAttribute("for", id);
		cardTitle.textContent = title;
		subtitlePledge.textContent = minimumPledge.toString();
		cardDescription.textContent = description;
		cardReward.id = optionStatusId;
		rewardQuantity.textContent = `${newPledgesLeft}`;
		pledgeLabel.setAttribute("for", pledgeAmountId);
		pledgeInput.id = pledgeAmountId;
		pledgeInput.setAttribute("value", minimumPledge.toString());

		if (newPledgesLeft === 0) disableCard(card);

		formFragment.appendChild(clone);
	});
	campaignForm.appendChild(formFragment);

	const formCards = campaignForm.querySelectorAll<HTMLElement>(".card");
	formCards.forEach((card) => {
		const radioButton =
			card.querySelector<HTMLInputElement>(".card__radio");
		const pledgeInputWrapper = card.querySelector<HTMLElement>(
			".card__pledge-input",
		);
		const pledgeInput = card.querySelector<HTMLInputElement>(
			".card__pledge-field",
		);
		const submitButton = card.querySelector<HTMLButtonElement>(
			".card__pledge-button",
		);
		const errorField = card.querySelector<HTMLElement>(
			".card__pledge-error",
		);

		if (
			!radioButton ||
			!pledgeInputWrapper ||
			!pledgeInput ||
			!submitButton ||
			!errorField
		)
			return;

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
			submitButton.classList.toggle(
				"card__pledge-button--error",
				!result.valid,
			);

			if (isOutsideInput)
				inputError(result, pledgeInputWrapper, errorField);
			if (result.valid) isOutsideInput = false;
		});

		card.addEventListener("click", () => {
			radioButton.checked = true;
		});
	});
}

function renderCampaign(data: Campaign, userData: UserData): void {
	const { title, summary, description, stats, options } = data;
	const { bookmarked, pledgesArr } = userData;

	renderProjectBasics(title, summary, description);
	renderStats(stats, userData);
	renderOptions(options, pledgesArr);
	renderForm(options, pledgesArr);

	if (bookmarked && bookmarkText) {
		bookmarkText.textContent = "Bookmarked";
		bookmarkBtn?.classList.add("bookmarked");
	}
}

async function initCampaignPage(): Promise<void> {
	const data = await fetchCampaignData();
	const userData = getUserData();
	if (data && userData) {
		renderCampaign(data, userData);
	}
}

function getUserData(): UserData | null {
	const response = localStorage.getItem("userData");
	if (!response) {
		const userData: UserData = {
			firstVisit: new Date().toISOString(),
			bookmarked: false,
			pledgesArr: [],
		};
		setUserData(userData);
		return userData;
	} else {
		const data = JSON.parse(response);
		if (isUserData(data)) return data;
		else {
			console.error("Invalid User Data");
			return null;
		}
	}
}

function setUserData(userData: UserData): void {
	localStorage.setItem("userData", JSON.stringify(userData));
}

function toggleMenu(): void {
	const isExpanded = menuToggle?.ariaExpanded === "true";
	menuToggle?.setAttribute("aria-expanded", String(!isExpanded));

	menuOpenIcon?.classList.toggle("header__menu-open--hidden", !isExpanded);
	menuCloseIcon?.classList.toggle("header__menu-close--visible", !isExpanded);
	menu?.classList.toggle("header__menu--visible", !isExpanded);
	headerOverlay?.classList.toggle("header__overlay--visible", !isExpanded);
}

menuToggle?.addEventListener("click", toggleMenu);

headerOverlay?.addEventListener("click", toggleMenu);

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
	bookmarkBtn.classList.toggle("bookmarked");
});

function clickedOutside(modal: HTMLElement, e: MouseEvent): boolean | null {
	if (!(modal instanceof HTMLDialogElement)) return null;
	const rect = modal.getBoundingClientRect();
	const clickedOutside =
		e.clientY < rect.top ||
		e.clientY > rect.bottom ||
		e.clientX < rect.left ||
		e.clientX > rect.right;
	return clickedOutside;
}

campaignModal?.addEventListener("click", (e) => {
	if (clickedOutside(campaignModal, e)) {
		closeModal(campaignModal);
		uncheckRadio();
	}
});

function uncheckRadio(): void {
	const radioButton = document.querySelector<HTMLInputElement>(
		".card__radio:checked",
	);
	if (!radioButton) return;
	radioButton.checked = false;
}

closeModalBtn?.addEventListener("click", () => {
	closeModal(campaignModal);
	uncheckRadio();
});

function optionChecked(id: string) {
	const radio = document.querySelector<HTMLElement>(`#${id}`);
	if (!(radio instanceof HTMLInputElement)) return;
	radio.checked = true;
	radio.focus();
	radio.scrollIntoView({ behavior: "smooth", block: "center" });
}

function validateInput(value: string, minimumAmount: number): InputValidation {
	const isNumber = /^\d+$/;
	if (value === "")
		return { valid: false, message: "Please enter a pledge amount." };
	if (Number(value) < minimumAmount)
		return {
			valid: false,
			message: `Please enter $${minimumAmount} or more.`,
		};
	if (!isNumber.test(value))
		return { valid: false, message: "Please enter a whole number." };
	return { valid: true, message: "" };
}

function inputError(
	result: InputValidation,
	inputWrapper: HTMLElement,
	errorField: HTMLElement,
): void {
	inputWrapper?.classList.toggle("card__pledge-input--error", !result.valid);
	errorField.classList.toggle("card__pledge-error--visible", !result.valid);
	errorField.textContent = result.message;
}

form?.addEventListener("submit", async (e) => {
	e.preventDefault();

	const radioButton = document.querySelector<HTMLInputElement>(
		".card__radio:checked",
	);
	if (!radioButton) return;
	const pledgeOption = radioButton.id;
	const amountInput = form.querySelector<HTMLInputElement>(
		`#pledge-amount-${pledgeOption}`,
	);
	if (!amountInput) return;
	const pledgeAmount = amountInput.value;

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

	radioButton.checked = false;

	openModal(successModal);
});

function openModal(modal: HTMLElement | null): void {
	if (!(modal instanceof HTMLDialogElement)) return;
	modal.classList.add("campaign-container");
	modal.showModal();
}

function closeModal(modal: HTMLElement | null): void {
	if (!(modal instanceof HTMLDialogElement)) return;
	modal.classList.remove("campaign-container");
	modal.close();
}

successModalBtn?.addEventListener("click", () => {
	closeModal(successModal);
});

successModal?.addEventListener("click", (e) => {
	if (clickedOutside(successModal, e)) closeModal(successModal);
});
