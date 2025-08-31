"use client";

import { TrailingReturnsTable } from "@/components/trailing-returns-table";
import { EquityCurveChart } from "@/components/equity-curve-chart";
import { useEffect, useState } from "react";

interface FundData {
	date: string;
	nav: number;
	nifty: number;
	drawdown: number;
}

export default function PortfolioPage() {
	const [fundData, setFundData] = useState<FundData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('/api/fund-data');
				if (!response.ok) {
					throw new Error('Failed to fetch fund data');
				}
				const data: FundData[] = await response.json();
				setFundData(data);
			} catch (error) {
				console.error('Error fetching fund data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	if (isLoading) {
		return (
			<div className="w-full py-6 flex items-center justify-center">
				<p className="text-gray-500">Loading portfolio data...</p>
			</div>
		);
	}

	return (
		<div className="w-full min-w-0 py-8 px-6 space-y-8">
			{/* Trailing Returns Section */}
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-light" style={{ fontFamily: 'serif', color: 'rgb(148 92 57)' }}>
						Trailing Returns
					</h1>
				</div>

				<TrailingReturnsTable data={fundData} />

				<div className="text-sm text-muted-foreground bg-muted/30 p-3 border-l-4 border-primary">
					<strong>Note:</strong> Returns above 1 year are annualized
				</div>
			</div>

			{/* Equity Curve Chart Section */}
			<EquityCurveChart data={fundData} />
		</div>
	);
}
