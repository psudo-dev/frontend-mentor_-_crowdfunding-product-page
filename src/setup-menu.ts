export function setupMenu(): void {
	const menuToggle = document.querySelector<HTMLElement>(
		".header__menu-toggle",
	);
	const menuOpenIcon =
		document.querySelector<HTMLElement>(".header__menu-open");
	const menuCloseIcon = document.querySelector<HTMLElement>(
		".header__menu-close",
	);
	const menu = document.querySelector<HTMLElement>(".header__menu");
	const headerOverlay =
		document.querySelector<HTMLElement>(".header__overlay");

	function toggleMenu(): void {
		const isExpanded = menuToggle?.ariaExpanded === "true";
		menuToggle?.setAttribute("aria-expanded", String(!isExpanded));

		menuOpenIcon?.classList.toggle(
			"header__menu-open--visible",
			isExpanded,
		);
		menuCloseIcon?.classList.toggle(
			"header__menu-close--visible",
			!isExpanded,
		);
		menu?.classList.toggle("header__menu--visible", !isExpanded);
		headerOverlay?.classList.toggle(
			"header__overlay--visible",
			!isExpanded,
		);
	}

	menuToggle?.addEventListener("click", toggleMenu);

	headerOverlay?.addEventListener("click", toggleMenu);
}
