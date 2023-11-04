import { css } from "@emotion/css";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { MdDelete } from "react-icons/md";

interface AddContactProps {
	closeModalHandler: () => void;
}

const ADD_CONTACT_WITH_PHONES = gql`
	mutation AddContactWithPhones(
		$first_name: String!
		$last_name: String!
		$phones: [phone_insert_input!]!
	) {
		insert_contact(
			objects: {
				first_name: $first_name
				last_name: $last_name
				phones: { data: $phones }
			}
		) {
			returning {
				first_name
				last_name
				id
				phones {
					number
				}
			}
		}
	}
`;

export default function AddContactModal({
	closeModalHandler,
}: AddContactProps) {
	const [numCount, setNumCount] = useState(1);
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [phoneNumbers, setPhoneNumbers] = useState([""]);

	const [addContactMutation] = useMutation(ADD_CONTACT_WITH_PHONES, {
		update: (cache, { data }) => {
			// Add the new contact to the cache
			const newContact = data.insert_contact.returning[0];
			cache.modify({
				fields: {
					contact(existingContacts = []) {
						const newContactRef = cache.writeFragment({
							data: newContact,
							fragment: gql`
								fragment NewContact on contact {
									id
								}
							`,
						});
						return [newContactRef, ...existingContacts];
					},
				},
			});
		},
	});
	const renderPhoneInputFields = () => {
		return phoneNumbers.map((number, index) => (
			<div
				key={index}
				className={css`
					display: flex;
					flex-direction: column;
					gap: 2px;
				`}
			>
				<div
					className={css`
						color: var(--White, #f5f7f8);
					`}
				>
					{phoneNumbers.length > 1 ? `Number ${index + 1}` : "Number"}
				</div>
				<div
					className={css`
						display: flex;
						width: 100%;
						gap: 8px;
					`}
				>
					<input
						type="text"
						placeholder="Insert phone number"
						value={number}
						onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
						className={css`
							border-radius: 10px;
							border: 1px solid var(--Light-Grey, #9da1aa);
							background: #fff;
							padding: 6px 18px;
							color: var(--Dark-Grey, #2d2d2d);
							font-family: Poppins;
							font-size: 14px;
							font-weight: 400;
							line-height: normal;
							@media (min-width: 576px) {
								font-size: 16px;
							}
							width: 100%;
						`}
					/>
					{phoneNumbers.length > 1 && (
						<button
							className={css`
								cursor: pointer;
								background-color: #d72626;
								color: #fff;
								border: none;
								border-radius: 10px;
								padding: 6px;
								font-size: 24px;
								display: flex;
								justify-content: center;
								align-items: center;
							`}
							onClick={() => removePhoneField(index)}
						>
							<MdDelete />
						</button>
					)}
				</div>
			</div>
		));
	};

	const addPhoneField = () => {
		setNumCount(numCount + 1);
		setPhoneNumbers([...phoneNumbers, ""]); //
	};

	const removePhoneField = (index: any) => {
		if (numCount > 1) {
			setNumCount(numCount - 1);
			const updatedPhoneNumbers = [...phoneNumbers];
			updatedPhoneNumbers.splice(index, 1);
			setPhoneNumbers(updatedPhoneNumbers);
		}
	};

	const handlePhoneNumberChange = (index: any, newValue: any) => {
		const updatedPhoneNumbers = [...phoneNumbers];
		updatedPhoneNumbers[index] = newValue;
		setPhoneNumbers(updatedPhoneNumbers);
	};

	const handleSave = () => {
		const variables = {
			first_name,
			last_name,
			phones: phoneNumbers.map((number) => ({ number })),
		};

		addContactMutation({
			variables,
		})
			.then((response) => {
				console.log("Mutation response:", response);
				closeModalHandler();
			})
			.catch((error) => {
				console.error("Mutation error:", error);
			});
	};

	return (
		<div
			className={css`
				background: var(--Dark-Grey, #2d2d2d);
				padding: 36px 12px 98px 12px;
				color: #000;
				box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
				font-family: Poppins;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 16px;
				width: 100%;
				height: 100%;
				@media (min-width: 768px) {
					width: 75%;
					height: 75%;
					padding: 36px 48px;
					border-radius: 12px;
				}
				max-height: 100%;
				overflow-y: auto;
			`}
		>
			<div
				className={css`
					font-size: 20px;
					font-style: bold;
					font-weight: 700;
					line-height: normal;
					@media (min-width: 576px) {
						font-size: 22px;
					}
					color: #f4ce14;
					margin-bottom: 12px;
				`}
			>
				Add New People
			</div>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					gap: 8px;
					width: 100%;
				`}
			>
				<div
					className={css`
						display: flex;
						flex-direction: column;
						gap: 2px;
					`}
				>
					<div
						className={css`
							color: var(--White, #f5f7f8);
						`}
					>
						First Name
					</div>
					<input
						type="text"
						placeholder="Insert first name"
						onChange={(e) => setFirstName(e.target.value)}
						className={css`
							border-radius: 10px;
							border: 1px solid var(--Light-Grey, #9da1aa);
							background: #fff;
							padding: 6px 18px;
							color: var(--Dark-Grey, #2d2d2d);
							font-family: Poppins;
							font-size: 14px;
							font-weight: 400;
							line-height: normal;
							@media (min-width: 576px) {
								font-size: 16px;
							}
						`}
					/>
				</div>
				<div
					className={css`
						display: flex;
						flex-direction: column;
						gap: 2px;
					`}
				>
					<div
						className={css`
							color: var(--White, #f5f7f8);
						`}
					>
						Last Name
					</div>
					<input
						type="text"
						placeholder="Insert last name"
						onChange={(e) => setLastName(e.target.value)}
						className={css`
							border-radius: 10px;
							border: 1px solid var(--Light-Grey, #9da1aa);
							background: #fff;
							padding: 6px 18px;
							color: var(--Dark-Grey, #2d2d2d);
							font-family: Poppins;
							font-size: 14px;
							font-weight: 400;
							line-height: normal;
							@media (min-width: 576px) {
								font-size: 16px;
							}
						`}
					/>
				</div>
				<div
					className={css`
						display: flex;
						flex-direction: column;
						gap: 2px;
						margin-top: 24px;
					`}
				>
					<div
						className={css`
							display: flex;
							justify-content: space-between;
							width: 100%;
							align-items: center;
						`}
					>
						<div
							className={css`
								color: var(--White, #f5f7f8);
							`}
						>
							Phone Number
						</div>
						<div
							className={css`
								color: var(--White, #f5f7f8);
								text: 12px;
								color: #f4ce14;
								cursor: pointer;
							`}
							onClick={addPhoneField}
						>
							+ Add Field
						</div>
					</div>
					<div className={css``}>{renderPhoneInputFields()}</div>
				</div>
			</div>
			<div
				className={css`
					display: flex;
					gap: 16px;
					justify-content: center;
					align-items: center;
					width: 100%;
					margin-top: 24px;
				`}
			>
				<div
					className={css`
						cursor: pointer;
						padding: 12px 24px;
						background-color: #d72626;
						color: #fff;
						border-radius: 12px;
						box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
						width: 120px;
						text-align: center;
						font-size: 14px;
						font-weight: 500;
						line-height: normal;
						@media (min-width: 576px) {
							font-size: 16px;
						}
					`}
					onClick={closeModalHandler}
				>
					Cancel
				</div>
				<div
					className={css`
						cursor: pointer;
						padding: 12px 24px;
						background-color: #f4ce14;
						color: var(--Dark-Grey, #2d2d2d);
						border-radius: 12px;
						box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
						width: 120px;
						text-align: center;
						font-size: 14px;
						font-weight: 400;
						line-height: normal;
						@media (min-width: 576px) {
							font-size: 16px;
						}
					`}
					onClick={handleSave}
				>
					Save
				</div>
			</div>
		</div>
	);
}
