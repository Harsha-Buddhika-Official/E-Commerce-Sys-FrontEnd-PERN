import { useEffect, useState } from "react";
import { getTokenExpiryTime, isTokenExpired } from "../features/auth/utils/token.utils";

const TOKEN_KEY = "admin_token";

function formatRemainingTime(milliseconds) {
	if (milliseconds <= 0) {
		return "00:00";
	}

	const totalSeconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${String(minutes).padStart(2, "0")}:
${String(seconds).padStart(2, "0")}`.replace("\n", "");
}

const TimeoutOverlay = () => {
	const [remainingTime, setRemainingTime] = useState("");

	useEffect(() => {
		const updateRemainingTime = () => {
			const token = localStorage.getItem(TOKEN_KEY);

			if (!token || isTokenExpired(token)) {
				setRemainingTime("");
				return;
			}

			const expiryTime = getTokenExpiryTime(token);
			setRemainingTime(formatRemainingTime(expiryTime - Date.now()));
		};

		updateRemainingTime();

		const timer = setInterval(updateRemainingTime, 1000);

		return () => clearInterval(timer);
	}, []);

	if (!remainingTime) {
		return null;
	}

	return (
		<div
			className="hidden sm:inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/70"
			aria-label="Admin session remaining time"
			title="Time left before automatic logout"
		>
			Session {remainingTime}
		</div>
	);
};

export default TimeoutOverlay;
