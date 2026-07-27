import "../css/style.css";

const projectModal = document.querySelector(
	".project-modal",
) as HTMLDialogElement;
const successModal = document.querySelector(
	".success-modal",
) as HTMLDialogElement;

projectModal?.close();
successModal?.close();
