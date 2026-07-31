import type { Stats, UserData } from "./types";
import { calcPercentage, daysPassed, isDate, pledgesTotal } from "./utils";

export function renderStats(stats: Stats, userData: UserData): void {
	const statsTotalBacked = document.querySelector<HTMLElement>(
		".campaign-stats__total-backed",
	);
	const statsTotalFunding = document.querySelector<HTMLElement>(
		".campaign-stats__total-funding",
	);
	const statsTotalBackers = document.querySelector<HTMLElement>(
		".campaign-stats__total-backers",
	);
	const statsDaysLeft = document.querySelector<HTMLElement>(
		".campaign-stats__days-left",
	);
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
