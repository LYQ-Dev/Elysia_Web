import { useMemo, useState } from "react";

import styles from "./HeroBackground.module.css";

interface HeroBackgroundProps {
	className?: string;
}

interface TiltCell {
	rotateX: number;
	rotateY: number;
}

const GRID_SIZE = 5;
const CENTER_INDEX = Math.floor(GRID_SIZE / 2);

export default function HeroBackground({ className = "" }: HeroBackgroundProps) {
	const [tilt, setTilt] = useState({ x: 0, y: 0 });

	const cells = useMemo<TiltCell[]>(() => {
		const result: TiltCell[] = [];

		for (let row = 0; row < GRID_SIZE; row += 1) {
			for (let col = 0; col < GRID_SIZE; col += 1) {
				result.push({
					rotateX: (CENTER_INDEX - row) * 10,
					rotateY: (col - CENTER_INDEX) * 5,
				});
			}
		}

		return result;
	}, []);

	const handleMouseLeave = () => {
		setTilt({ x: 0, y: 0 });
	};

	const rootClassName = [styles.container, className].filter(Boolean).join(" ");

	return (
		<div className={rootClassName} onMouseLeave={handleMouseLeave}>
			<div className={`${styles.canvas} canvas`} aria-hidden="true">
				{cells.map((cell, index) => (
					<span
						key={`${cell.rotateX}-${cell.rotateY}-${index}`}
						className={`${styles.tracker} tracker`}
						onMouseEnter={() => setTilt({ x: cell.rotateX, y: cell.rotateY })}
					/>
				))}
			</div>

			<div
				className={`${styles.card} ${styles.noselect}`}
				style={{
					transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(0deg)`,
				}}
			>
				<div className={styles.grain} aria-hidden="true" />
			</div>
		</div>
	);
}
