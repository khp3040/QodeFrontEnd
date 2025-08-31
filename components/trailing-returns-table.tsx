"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface FundData {
	date: string;
	nav: number;
	nifty: number;
	drawdown: number;
}

interface TrailingReturnsTableProps {
	data: FundData[];
}

// Helper function to calculate returns between two values
const calculateReturn = (current: number, previous: number): number => {
	return ((current - previous) / previous) * 100;
};

// Helper function to calculate annualized return
const calculateAnnualizedReturn = (current: number, previous: number, years: number): number => {
	return (Math.pow(current / previous, 1 / years) - 1) * 100;
};

// Helper function to find drawdown
const calculateDrawdown = (data: FundData[], fromIndex: number): number => {
	let maxDrawdown = 0;
	let peak = data[fromIndex]?.nav || 0;

	for (let i = fromIndex; i < data.length; i++) {
		if (data[i].nav > peak) {
			peak = data[i].nav;
		}
		const drawdown = ((data[i].nav - peak) / peak) * 100;
		if (drawdown < maxDrawdown) {
			maxDrawdown = drawdown;
		}
	}

	return maxDrawdown;
};

export function TrailingReturnsTable({ data }: TrailingReturnsTableProps) {
	if (!data || data.length === 0) {
		return (
			<div className="rounded-lg border bg-card p-4">
				<p className="text-center text-gray-500">Loading returns data...</p>
			</div>
		);
	}

	const latest = data[data.length - 1];
	const latestDate = new Date(latest.date);

	// Find data points for different periods - look for closest date before target
	const findDataByDaysBack = (days: number) => {
		const targetDate = new Date(latestDate);
		targetDate.setDate(targetDate.getDate() - days);

		// Find the closest date on or before the target date
		for (let i = data.length - 1; i >= 0; i--) {
			if (new Date(data[i].date) <= targetDate) {
				return data[i];
			}
		}
		return data[0];
	};

	const findDataByYearsBack = (years: number) => {
		const targetDate = new Date(latestDate);
		targetDate.setFullYear(targetDate.getFullYear() - years);

		// Find the closest date on or before the target date
		for (let i = data.length - 1; i >= 0; i--) {
			if (new Date(data[i].date) <= targetDate) {
				return data[i];
			}
		}
		return data[0];
	};

	// Get year-to-date data (January 1st of current year)
	const ytdDate = new Date(latestDate.getFullYear(), 0, 1);
	let ytdData = data[0];
	for (let i = 0; i < data.length; i++) {
		if (new Date(data[i].date) >= ytdDate) {
			ytdData = data[i];
			break;
		}
	}

	// Calculate returns for the fund only (single row)
	const fundReturns = {
		name: "Focused",
		ytd: calculateReturn(latest.nav, ytdData.nav),
		d1: calculateReturn(latest.nav, findDataByDaysBack(1).nav),
		w1: calculateReturn(latest.nav, findDataByDaysBack(7).nav),
		m1: calculateReturn(latest.nav, findDataByDaysBack(30).nav),
		m3: calculateReturn(latest.nav, findDataByDaysBack(90).nav),
		m6: calculateReturn(latest.nav, findDataByDaysBack(180).nav),
		y1: calculateReturn(latest.nav, findDataByYearsBack(1).nav),
		y3: calculateAnnualizedReturn(latest.nav, findDataByYearsBack(3).nav, 3),
		y5: calculateAnnualizedReturn(latest.nav, findDataByYearsBack(5).nav, 5),
		dd: (latest.drawdown / 5), // Reverse the 5x scaling from API
		maxdd: calculateDrawdown(data, 0),
	};

	const formatPercentage = (value: number): string => {
		return `${value >= 0 ? '' : ''}${value.toFixed(1)}%`;
	};

	const getCellColor = (value: number): string => {
		return value < 0 ? "text-red-500" : "text-green-500";
	};

	return (
		<div className="border bg-card shadow-sm overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-primary/10 hover:bg-primary/15">
						<TableHead className="w-[120px] font-semibold text-foreground">NAME</TableHead>
						<TableHead className="font-semibold text-foreground text-center">YTD</TableHead>
						<TableHead className="font-semibold text-foreground text-center">1D</TableHead>
						<TableHead className="font-semibold text-foreground text-center">1W</TableHead>
						<TableHead className="font-semibold text-foreground text-center">1M</TableHead>
						<TableHead className="font-semibold text-foreground text-center">3M</TableHead>
						<TableHead className="font-semibold text-foreground text-center">6M</TableHead>
						<TableHead className="font-semibold text-foreground text-center">1Y</TableHead>
						<TableHead className="font-semibold text-foreground text-center">3Y</TableHead>
						<TableHead className="font-semibold text-foreground text-center">5Y</TableHead>
						<TableHead className="font-semibold text-foreground text-center">DD</TableHead>
						<TableHead className="font-semibold text-foreground text-center">MAXDD</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow className="hover:bg-primary/5 transition-colors">
						<TableCell className="font-semibold text-foreground py-4">
							{fundReturns.name}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.ytd)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.ytd)}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.d1)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.d1)}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.w1)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.w1)}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.m1)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.m1)}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.m3)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.m3)}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.m6)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.m6)}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.y1)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.y1)}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.y3)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.y3)}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.y5)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.y5)}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.dd)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.dd)}
						</TableCell>
						<TableCell className={`${getCellColor(fundReturns.maxdd)} text-center font-medium py-4`}>
							{formatPercentage(fundReturns.maxdd)}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}