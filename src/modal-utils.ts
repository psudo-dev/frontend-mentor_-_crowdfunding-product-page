export function openModal(modal: HTMLElement | null): void {
	if (!(modal instanceof HTMLDialogElement)) return;
	modal.showModal();
}

export function closeModal(modal: HTMLElement | null): void {
	if (!(modal instanceof HTMLDialogElement)) return;
	modal.close();
}

export function clickedOutside(
	modal: HTMLElement,
	e: MouseEvent,
): boolean | null {
	if (!(modal instanceof HTMLDialogElement)) return null;
	const rect = modal.getBoundingClientRect();
	const clickedOutside =
		e.clientY < rect.top ||
		e.clientY > rect.bottom ||
		e.clientX < rect.left ||
		e.clientX > rect.right;
	return clickedOutside;
}

export function uncheckRadio(): void {
	const radioButton = document.querySelector<HTMLInputElement>(
		".card__radio:checked",
	);
	if (!radioButton) return;
	radioButton.checked = false;
}

export function checkRadio(id: string) {
	const radio = document.querySelector<HTMLElement>(`#${id}`);
	if (!(radio instanceof HTMLInputElement)) return;
	radio.checked = true;
	radio.focus();
	radio.scrollIntoView({ behavior: "smooth", block: "center" });
}
