import React, { useState } from "react";
import {
	FiPlus,
	FiSearch,
	FiClock,
	FiEdit2,
	FiCalendar,
	FiTrendingUp,
	FiTarget,
	FiTag,
	FiStar,
	FiBookmark,
	FiActivity,
	FiZap,
	FiCoffee,
	FiSun,
	FiMoon,
} from "react-icons/fi";
import { BsPinFill } from "react-icons/bs";

function RightDashboardBar() {
	const [searchTerm, setSearchTerm] = useState("");
	const notes = [
		{
			id: 1,
			title: "Meeting Notes - Q1 Planning",
			preview:
				"Discussed project timelines, resource allocation, and key deliverables...",
			lastUpdated: "2 hours ago",
			pinned: true,
			category: "Work",
			wordCount: 342,
		},
		{
			id: 2,
			title: "Recipe Ideas",
			preview:
				"Pasta with roasted vegetables, homemade pizza dough recipe...",
			lastUpdated: "Yesterday",
			pinned: false,
			category: "Personal",
			wordCount: 156,
		},
		{
			id: 3,
			title: "Book Recommendations",
			preview: "The Seven Husbands of Evelyn Hugo was incredible...",
			lastUpdated: "3 days ago",
			pinned: false,
			category: "Reading",
			wordCount: 89,
		},
		{
			id: 4,
			title: "Travel Plans - Summer 2025",
			preview: "Potential destinations: Japan (cherry blossom season)...",
			lastUpdated: "1 week ago",
			pinned: true,
			category: "Travel",
			wordCount: 234,
		},
	];

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 17) return "Good afternoon";
		return "Good evening";
	};

	const filteredNotes = notes.filter(
		(note) =>
			note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			note.preview.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const pinnedNotes = filteredNotes.filter((note) => note.pinned);
	const recentNotes = filteredNotes.filter((note) => !note.pinned);

	// Calculate stats
	const totalWords = notes.reduce((sum, note) => sum + note.wordCount, 0);
	const categories = [...new Set(notes.map((note) => note.category))];
	const todaysNotes = notes.filter(
		(note) =>
			note.lastUpdated.includes("hour") || note.lastUpdated === "Today",
	).length;

	const quickTemplates = [
		{ icon: FiEdit2, name: "Daily Journal", color: "text-primary" },
		{ icon: FiTarget, name: "Goal Setting", color: "text-success" },
		{ icon: FiBookmark, name: "Reading Notes", color: "text-warning" },
		{ icon: FiCalendar, name: "Meeting Notes", color: "text-info" },
	];

	const recentActivity = [
		{
			action: "Created",
			note: "Meeting Notes - Q1 Planning",
			time: "2h ago",
		},
		{ action: "Updated", note: "Recipe Ideas", time: "1d ago" },
		{
			action: "Pinned",
			note: "Travel Plans - Summer 2025",
			time: "3d ago",
		},
		{ action: "Created", note: "Book Recommendations", time: "1w ago" },
	];

	return (
		<div
			className="bg-white border-start position-fixed top-0 end-0 h-100 overflow-auto"
			style={{ width: "320px", zIndex: 999 }}
		>
			<div className="p-3">
				{/* Stats Overview */}
				<div className="mb-4">
					<h5 className="h6 mb-3 text-muted text-uppercase fw-semibold">
						Overview
					</h5>
					<div className="row g-2">
						<div className="col-6">
							<div className="card bg-primary bg-opacity-10 border-0">
								<div className="card-body p-3 text-center">
									<FiEdit2
										className="text-primary mb-1"
										size={20}
									/>
									<div className="fw-bold">
										{notes.length}
									</div>
									<small className="text-muted">
										Total Notes
									</small>
								</div>
							</div>
						</div>
						<div className="col-6">
							<div className="card bg-success bg-opacity-10 border-0">
								<div className="card-body p-3 text-center">
									<FiActivity
										className="text-success mb-1"
										size={20}
									/>
									<div className="fw-bold">{totalWords}</div>
									<small className="text-muted">
										Total Words
									</small>
								</div>
							</div>
						</div>
					</div>
					<div className="row g-2 mt-1">
						<div className="col-6">
							<div className="card bg-warning bg-opacity-10 border-0">
								<div className="card-body p-3 text-center">
									<BsPinFill
										className="text-warning mb-1"
										size={18}
									/>
									<div className="fw-bold">
										{pinnedNotes.length}
									</div>
									<small className="text-muted">Pinned</small>
								</div>
							</div>
						</div>
						<div className="col-6">
							<div className="card bg-info bg-opacity-10 border-0">
								<div className="card-body p-3 text-center">
									<FiZap
										className="text-info mb-1"
										size={20}
									/>
									<div className="fw-bold">{todaysNotes}</div>
									<small className="text-muted">Today</small>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Templates */}
				<div className="mb-4">
					<h5 className="h6 mb-3 text-muted text-uppercase fw-semibold">
						Quick Templates
					</h5>
					<div className="d-grid gap-2">
						{quickTemplates.map((template, index) => (
							<button
								key={index}
								className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-start"
							>
								<template.icon
									className={`me-2 ${template.color}`}
									size={16}
								/>
								{template.name}
							</button>
						))}
					</div>
				</div>

				{/* Categories */}
				<div className="mb-4">
					<h5 className="h6 mb-3 text-muted text-uppercase fw-semibold">
						Categories
					</h5>
					<div className="d-flex flex-wrap gap-1">
						{categories.map((category, index) => (
							<span
								key={index}
								className="badge bg-light text-dark border"
							>
								<FiTag size={12} className="me-1" />
								{category}
							</span>
						))}
					</div>
				</div>

				{/* Recent Activity */}
				<div className="mb-4">
					<h5 className="h6 mb-3 text-muted text-uppercase fw-semibold">
						Recent Activity
					</h5>
					<div className="list-group list-group-flush">
						{recentActivity.map((activity, index) => (
							<div
								key={index}
								className="list-group-item border-0 px-0 py-2"
							>
								<div className="d-flex align-items-start">
									<div className="flex-shrink-0 me-2">
										<div className="rounded-circle bg-light p-1">
											<FiActivity
												size={12}
												className="text-muted"
											/>
										</div>
									</div>
									<div className="flex-grow-1">
										<div className="small">
											<span className="fw-semibold">
												{activity.action}
											</span>{" "}
											{activity.note}
										</div>
										<small className="text-muted">
											{activity.time}
										</small>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Writing Goal */}
				<div className="mb-4">
					<h5 className="h6 mb-3 text-muted text-uppercase fw-semibold">
						Daily Goal
					</h5>
					<div className="card bg-light border-0">
						<div className="card-body p-3">
							<div className="d-flex align-items-center mb-2">
								<FiTarget className="text-primary me-2" />
								<span className="small fw-semibold">
									Writing Goal
								</span>
							</div>
							<div
								className="progress mb-2"
								style={{ height: "6px" }}
							>
								<div
									className="progress-bar bg-primary"
									style={{ width: "68%" }}
								></div>
							</div>
							<small className="text-muted">
								340 / 500 words today
							</small>
						</div>
					</div>
				</div>

				{/* Productivity Tips */}
				<div className="mb-4">
					<h5 className="h6 mb-3 text-muted text-uppercase fw-semibold">
						Tip of the Day
					</h5>
					<div
						className="card bg-gradient"
						style={{
							background:
								"linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
						}}
					>
						<div className="card-body p-3 text-white">
							<div className="d-flex align-items-center mb-2">
								<FiSun className="me-2" />
								<span className="small fw-semibold">
									Productivity Tip
								</span>
							</div>
							<p className="small mb-0">
								Try the Pomodoro Technique: Write for 25
								minutes, then take a 5-minute break. It helps
								maintain focus and prevents burnout!
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default RightDashboardBar;
