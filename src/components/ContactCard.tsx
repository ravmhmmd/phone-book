"use client";
import { css } from "@emotion/css";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";

interface ContactProps {
	contactName: string;
	contactNumber: number;
	isFavourite: boolean;
	toggleFavorite: () => void;
}

export default function ContactCard({
	contactName,
	contactNumber,
	isFavourite,
	toggleFavorite,
}: ContactProps) {
	return (
		<div
			className={css`
				border-radius: 12px;
				box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 8px 36px;
				margin: 4px 0;
				cursor: pointer;
				${isFavourite
					? "background: var(--Dark-Grey, #2d2d2d);"
					: "border: 1px solid var(--Light-Grey, #9da1aa); background: #fff;"}
			`}
		>
			<div
				className={css`
					display: flex;
					flex-direction: column;
				`}
			>
				<div
					className={css`
						font-family: Poppins;
						font-size: 18px;
						font-style: normal;
						font-weight: 600;
						line-height: normal;
						${isFavourite
							? "color: var(--Yellow, #f4ce14);"
							: "color: var(--Dark-Grey, #2d2d2d);"}
					`}
				>
					{contactName}
				</div>
				<div
					className={css`
						font-family: Poppins;
						font-size: 14px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						${isFavourite
							? "color: var(--White, #f5f7f8);"
							: "color: var(--Dark-Grey, #2d2d2d);"}
					`}
				>
					{contactNumber}
				</div>
			</div>
			<div onClick={toggleFavorite}>
				{isFavourite ? (
					<BsFillBookmarkFill
						className={css`
							width: 24px;
							height: 24px;
							color: var(--Yellow, #f4ce14);
							cursor: pointer;
						`}
					/>
				) : (
					<BsBookmark
						className={css`
							width: 24px;
							height: 24px;
							color: var(--Dark-Grey, #2d2d2d);
							cursor: pointer;
						`}
					/>
				)}
			</div>
		</div>
	);
}