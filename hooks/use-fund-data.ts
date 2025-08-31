"use client";

export interface FundData {
	date: string;
	Focused: number;
	NIFTY50: number;
	Drawdown: number;
}

export async function getFundData(): Promise<FundData[]> {
	const response = await fetch("/api/fund-data");
	if (!response.ok) {
		throw new Error("Failed to fetch fund data");
	}
	return response.json();
}
