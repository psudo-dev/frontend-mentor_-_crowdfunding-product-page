export interface Stats {
	totalBacked: number;
	totalFunding: number;
	totalBackers: number;
	daysLeft: number;
}

export interface Option {
	id: string;
	title: string;
	minimumPledge: number;
	description: string;
	pledgesLeft: number;
}

export interface Campaign {
	title: string;
	summary: string;
	description: string[];
	stats: Stats;
	options: Option[];
}

export interface InputValidation {
	valid: boolean;
	message: string;
}

export interface Pledge {
	id: string;
	amountArr: number[];
}

export interface UserData {
	firstVisit: string;
	bookmarked: boolean;
	pledgesArr: Pledge[];
}

export type Prefix = "option" | "form";
