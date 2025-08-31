import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export interface FundData {
	date: string;
	nav: number;
	nifty: number;
	drawdown: number;
}

async function loadFundData(): Promise<FundData[]> {
	try {
		// Read the CSV file
		const csvPath = path.join(process.cwd(), "data", "funddata.csv");
		const fileContent = await fs.readFile(csvPath, "utf-8");

		// Split into lines and remove header
		const lines = fileContent.split("\n").filter((line) => line.trim());
		const data = lines.slice(1); // Remove header

		// Process each line into structured data
		const processedData = data.map((line) => {
			const [dateStr, niftyStr] = line.split(",");

			// Parse the date (assuming DD-MM-YYYY format)
			const [day, month, year] = dateStr
				.split("-")
				.map((num) => parseInt(num));
			const formattedDate = `${year}-${month
				.toString()
				.padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

			// Parse values
			const nav = parseFloat(niftyStr);

			return {
				date: formattedDate,
				nav: nav,
				nifty: nav,
				drawdown: 0, // Will calculate after sorting
			};
		});

		// Sort by date in ascending order
		const sortedData = processedData.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

		// Calculate cumulative loss runs (drawdown)
		let peak = sortedData[0]?.nav || 0;
		let currentDrawdown = 0;

		const finalData = sortedData.map((item) => {
			// Update peak if current NAV is higher or equal (reaches last high)
			if (item.nav >= peak) {
				peak = item.nav;
				currentDrawdown = 0; // Reset drawdown when reaching last high
			} else {
				// Calculate drawdown as negative percentage from peak, scaled by 5x for visibility
				currentDrawdown = -((peak - item.nav) / peak) * 100 * 5;
			}

			return {
				...item,
				drawdown: currentDrawdown,
			};
		});

		return finalData;
	} catch (error) {
		console.error("Error loading fund data:", error);
		return [];
	}
}

export async function GET() {
	const data = await loadFundData();
	return NextResponse.json(data);
}
