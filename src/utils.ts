import type { InputValidation, Pledge } from "./types";

export function isDate(value: unknown): value is Date {
	return value instanceof Date && !isNaN(value.getTime());
}

export function calcPercentage(backed: number, total: number): string {
	const percentage = backed >= total ? 1 : backed / total;
	return `${percentage * 100}%`;
}

export function daysPassed(today: Date, firstVisit: Date): number {
	const diffInMs = Math.abs(today.getTime() - firstVisit.getTime());
	const msPerDay = 1000 * 60 * 60 * 24;

	return Math.floor(diffInMs / msPerDay);
}

export function pledgesTotal(pledgesArr: Pledge[]): number {
	return pledgesArr.reduce((pledgeTotal, currPledge) => {
		const total = currPledge.amountArr.reduce(
			(totalAmount, currAmount) => totalAmount + currAmount,
			0,
		);
		return pledgeTotal + total;
	}, 0);
}

export function updatedPledgesLeft(
	id: string,
	pledgesLeft: number,
	pledgesArr: Pledge[],
): number {
	const total = pledgesArr.find((pledge) => pledge.id === id);
	if (!total) return pledgesLeft;
	const updatedPledgesLeft = pledgesLeft - total.amountArr.length;
	return updatedPledgesLeft <= 0 ? 0 : updatedPledgesLeft;
}

export function validateInput(
	value: string,
	minimumAmount: number,
): InputValidation {
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
