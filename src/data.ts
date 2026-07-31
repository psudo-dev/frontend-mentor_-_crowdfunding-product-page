import type { Campaign, Pledge, UserData } from "./types";

export async function fetchCampaignData(): Promise<Campaign | null> {
	try {
		const response = await fetch("/campaign.json");
		if (!response.ok) {
			throw new Error(
				`Error fetching JSON: ${response.status} ${response.statusText}`,
			);
		}
		const json = (await response.json()) as Campaign;
		return json;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export function isPledge(value: unknown): value is Pledge {
	if (!(typeof value === "object") || !value) return false;
	if (!("id" in value) || !("amountArr" in value)) return false;

	return (
		typeof value.id === "string" &&
		Array.isArray(value.amountArr) &&
		value.amountArr.every((amount) => typeof amount === "number")
	);
}

export function isUserData(value: unknown): value is UserData {
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

export function getUserData(): UserData | null {
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

export function setUserData(userData: UserData): void {
	localStorage.setItem("userData", JSON.stringify(userData));
}
