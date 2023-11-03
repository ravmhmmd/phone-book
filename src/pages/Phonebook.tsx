"use client";
import { css } from "@emotion/css";
import ContactList from "@/components/ContactList";
import ClientOnly from "@/components/ClientOnly";

// const breakpoints = [576, 768, 992, 1200];

export default function Phonebook() {
	return (
		<div
			className={css`
				width: 100%;
				display: flex
				justify-content: center;
				background: var(--White, #f5f7f8);
			`}
		>
			{/* header */}
			<div
				className={css`
					background-color: #f4ce14;
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;
					padding: 16px 24px;
					position: fixed;
					top: 0;
					box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
					@media (min-width: 576px) {
						padding: 16px 64px;
					}
					@media (min-width: 768px) {
						padding: 16px 124px;
					}
					@media (min-width: 992px) {
						padding: 16px 164px;
					}
				`}
			>
				<div
					className={css`
						color: var(--Dark-Grey, #2d2d2d);
						font-family: Poppins;
						font-size: 24px;
						font-style: bold;
						font-weight: 700;
						line-height: normal;
						@media (min-width: 576px) {
							font-size: 36px;
						}
					`}
				>
					YellowPage
				</div>
				<div
					className={css`
						color: var(--Dark-Grey, #2d2d2d);
						text-align: right;
						font-family: Poppins;
						font-size: 24px;
						font-style: normal;
						font-weight: 700;
						line-height: normal;
						cursor: pointer;
						display: none;
						@media (min-width: 576px) {
							display: block;
						}
					`}
				>
					+ Add People
				</div>
				<div
					className={css`
						color: var(--Dark-Grey, #2d2d2d);
						text-align: right;
						font-family: Poppins;
						font-size: 28px;
						font-style: normal;
						font-weight: 700;
						line-height: normal;
						cursor: pointer;
						display: block;
						@media (min-width: 576px) {
							display: none;
						}
					`}
				>
					+
				</div>
			</div>
			{/* body */}
			<div
				className={css`
					display: flex;
					flex-direction: column;
					width: 80%;
					margin: auto;
					min-height: 100vh;
					margin-bottom: 56px;
				`}
			>
				{/* searchbar */}
				<input
					type="text"
					placeholder="Search people..."
					className={css`
						border-radius: 10px;
						border: 1px solid var(--Light-Grey, #9da1aa);
						background: #fff;
						margin-top: 124px;
						margin-bottom: 24px;
						padding: 6px 18px;
						color: var(--Dark-Grey, #2d2d2d);
						font-family: Poppins;
						font-size: 18px;
						font-style: normal;
						font-weight: 300;
						line-height: normal;
						box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
					`}
				/>
				<ClientOnly>
					<ContactList />
				</ClientOnly>
			</div>
			{/* footer */}
			<div
				className={css`
					background: var(--Dark-Grey, #2d2d2d);
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					padding: 24px 0;
					bottom: 0;
				`}
			>
				<div
					className={css`
						color: var(--Yellow, #f4ce14);
						font-family: Poppins;
						font-size: 16px;
						font-style: normal;
						font-weight: 700;
						line-height: normal;
						@media (min-width: 576px) {
							font-size: 18px;
						}
					`}
				>
					YellowPage
				</div>
				<div
					className={css`
						color: var(--White, #f5f7f8);
						font-family: Poppins;
						font-size: 14px;
						font-style: normal;
						font-weight: 300;
						line-height: normal;
						margin-left: 8px;
						@media (min-width: 576px) {
							font-size: 16px;
						}
					`}
				>
					© 2023 by rayhanrav
				</div>
			</div>
		</div>
	);
}
