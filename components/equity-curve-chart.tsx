"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	ComposedChart,
	Line,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

interface FundData {
	date: string;
	nav: number;
	nifty: number;
	drawdown: number;
}

interface EquityCurveChartProps {
	data: FundData[];
}

function formatDate(date: Date | undefined) {
	if (!date) {
		return "";
	}
	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function isValidDate(date: Date | undefined) {
	if (!date) {
		return false;
	}
	return !isNaN(date.getTime());
}

export function EquityCurveChart({ data }: EquityCurveChartProps) {
	const [startDate, setStartDate] = useState<Date | undefined>();
	const [endDate, setEndDate] = useState<Date | undefined>();
	const [startOpen, setStartOpen] = useState(false);
	const [endOpen, setEndOpen] = useState(false);
	const [startMonth, setStartMonth] = useState<Date | undefined>();
	const [endMonth, setEndMonth] = useState<Date | undefined>();
	const [startValue, setStartValue] = useState("");
	const [endValue, setEndValue] = useState("");

	useEffect(() => {
		if (data && data.length > 0) {
			// Set default date range to show all data
			const start = new Date(data[0].date);
			const end = new Date(data[data.length - 1].date);
			setStartDate(start);
			setEndDate(end);
			setStartMonth(start);
			setEndMonth(end);
			setStartValue(formatDate(start));
			setEndValue(formatDate(end));
		}
	}, [data]);

	if (!data || data.length === 0) {
		return (
			<div className="h-[400px] w-full border rounded-lg p-4 flex items-center justify-center">
				<p className="text-gray-500">Loading chart data...</p>
			</div>
		);
	}

	// Filter data based on selected date range
	const getFilteredData = () => {
		if (!startDate || !endDate) return data;
		
		return data.filter(item => {
			const itemDate = new Date(item.date);
			return itemDate >= startDate && itemDate <= endDate;
		});
	};

	const filteredData = getFilteredData();

	return (
		<div className="space-y-6">
			<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
				<h1 className="text-3xl font-light" style={{ fontFamily: 'serif', color: 'rgb(148 92 57)' }}>
					Equity Curve
				</h1>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-muted/30 p-4 border">
					{/* Start Date Picker */}
					<div className="flex flex-col gap-2">
						<Label htmlFor="start-date" className="text-sm font-medium text-foreground">From</Label>
						<div className="relative flex gap-2">
							<Input
								id="start-date"
								value={startValue}
								placeholder="Select start date"
								className="bg-background pr-10 w-48 border-border focus:border-primary"
								onChange={(e) => {
									const date = new Date(e.target.value);
									setStartValue(e.target.value);
									if (isValidDate(date)) {
										setStartDate(date);
										setStartMonth(date);
									}
								}}
								onKeyDown={(e) => {
									if (e.key === "ArrowDown") {
										e.preventDefault();
										setStartOpen(true);
									}
								}}
							/>
							<Popover open={startOpen} onOpenChange={setStartOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										className="absolute top-1/2 right-2 size-6 -translate-y-1/2 hover:bg-primary/20"
									>
										<CalendarIcon className="size-3.5 text-muted-foreground" />
										<span className="sr-only">Select start date</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto overflow-hidden p-0 border-border"
									align="end"
									alignOffset={-8}
									sideOffset={10}
								>
									<Calendar
										mode="single"
										selected={startDate}
										captionLayout="dropdown"
										month={startMonth}
										onMonthChange={setStartMonth}
										onSelect={(date) => {
											setStartDate(date);
											setStartValue(formatDate(date));
											setStartOpen(false);
										}}
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					{/* End Date Picker */}
					<div className="flex flex-col gap-2">
						<Label htmlFor="end-date" className="text-sm font-medium text-foreground">To</Label>
						<div className="relative flex gap-2">
							<Input
								id="end-date"
								value={endValue}
								placeholder="Select end date"
								className="bg-background pr-10 w-48 border-border focus:border-primary"
								onChange={(e) => {
									const date = new Date(e.target.value);
									setEndValue(e.target.value);
									if (isValidDate(date)) {
										setEndDate(date);
										setEndMonth(date);
									}
								}}
								onKeyDown={(e) => {
									if (e.key === "ArrowDown") {
										e.preventDefault();
										setEndOpen(true);
									}
								}}
							/>
							<Popover open={endOpen} onOpenChange={setEndOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										className="absolute top-1/2 right-2 size-6 -translate-y-1/2 hover:bg-primary/20"
									>
										<CalendarIcon className="size-3.5 text-muted-foreground" />
										<span className="sr-only">Select end date</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto overflow-hidden p-0 border-border"
									align="end"
									alignOffset={-8}
									sideOffset={10}
								>
									<Calendar
										mode="single"
										selected={endDate}
										captionLayout="dropdown"
										month={endMonth}
										onMonthChange={setEndMonth}
										onSelect={(date) => {
											setEndDate(date);
											setEndValue(formatDate(date));
											setEndOpen(false);
										}}
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>
				</div>
			</div>

			<div className="h-[500px] w-full border border-border bg-card shadow-sm p-6">
				<ResponsiveContainer width="100%" height="100%">
					<ComposedChart data={filteredData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
						<XAxis
							dataKey="date"
							tick={{ fontSize: 12, fill: '#6b7280' }}
							tickFormatter={(value) =>
								new Date(value).toLocaleDateString(
									"en-US",
									{ month: "short", year: "2-digit" }
								)
							}
							axisLine={{ stroke: '#d1d5db' }}
							tickLine={{ stroke: '#d1d5db' }}
						/>
						<YAxis
							tick={{ fontSize: 12, fill: '#6b7280' }}
							domain={["auto", "auto"]}
							axisLine={{ stroke: '#d1d5db' }}
							tickLine={{ stroke: '#d1d5db' }}
						/>
						<Tooltip
							formatter={(value: number, name: string) => [
								name === "Drawdown %"
									? `${(value / 5).toFixed(2)}%`
									: `${value.toFixed(2)}`,
								name,
							]}
							labelFormatter={(label) =>
								new Date(label).toLocaleDateString(
									"en-US",
									{
										month: "long",
										day: "numeric",
										year: "numeric",
									}
								)
							}
							contentStyle={{
								backgroundColor: 'white',
								border: '1px solid #d1d5db',
								borderRadius: '0px',
								boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
							}}
						/>
						<Legend 
							wrapperStyle={{
								paddingTop: '20px'
							}}
						/>
						<Line
							type="monotone"
							dataKey="nav"
							name="NAV"
							stroke="#22c55e"
							strokeWidth={3}
							dot={false}
						/>
						<Area
							type="monotone"
							dataKey="drawdown"
							name="Drawdown %"
							stroke="#ef4444"
							fill="#fecaca"
							fillOpacity={0.2}
							strokeWidth={2}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}