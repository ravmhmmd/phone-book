import { gql, useMutation, useQuery } from "@apollo/client";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
// import { MdDelete } from "react-icons/md";

interface ContactDetailModalProps {
	contactId: number;
	closeBtnHandler: () => void;
}

const GET_CONTACT_DETAILS = gql`
	query GetContactDetail($id: Int!) {
		contact_by_pk(id: $id) {
			last_name
			id
			first_name
			created_at
			phones {
				number
			}
		}
	}
`;

const DELETE_CONTACT = gql`
	mutation MyMutation($id: Int!) {
		delete_contact_by_pk(id: $id) {
			first_name
			last_name
			id
		}
	}
`;

const EDIT_CONTACT = gql`
	mutation EditContactById($id: Int!, $_set: contact_set_input) {
		update_contact_by_pk(pk_columns: { id: $id }, _set: $_set) {
			id
			first_name
			last_name
			phones {
				number
			}
		}
	}
`;

const GET_CONTACT_SIMILAR = gql`
	query GetContactList(
		$distinct_on: [contact_select_column!]
		$limit: Int
		$offset: Int
		$order_by: [contact_order_by!]
		$where: contact_bool_exp
	) {
		contact(
			distinct_on: $distinct_on
			limit: $limit
			offset: $offset
			order_by: $order_by
			where: $where
		) {
			created_at
			first_name
			id
			last_name
			phones {
				number
			}
		}
	}
`;

export default function ContactDetailModal({
	contactId,
	closeBtnHandler,
}: ContactDetailModalProps) {
	const [deleteContact] = useMutation(DELETE_CONTACT, {
		update(cache: any, { data }) {
			cache.modify({
				fields: {
					contact(existingContacts = [], { readField }: any) {
						return existingContacts.filter(
							(contactRef) => contactId !== readField("id", contactRef)
						);
					},
				},
			});
		},
	});

	const dateFormatter = (date: any) => {
		const parsedDate = new Date(date);
		const year = parsedDate.getFullYear();
		const month = parsedDate.toLocaleString("default", { month: "long" });
		const day = parsedDate.getDate();
		const formattedDate = `${month} ${day}, ${year}`;
		return formattedDate;
	};

	const [editMode, setEditMode] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [tempFirstName, setTempFirstName] = useState("");
	const [tempLastName, setTempLastName] = useState("");
	const [phoneNumbers, setPhoneNumbers] = useState([]);
	const [createdAt, setCreatedAt] = useState("");
	const [errorMes, setErrorMes] = useState("");

	const { data, error, loading } = useQuery(GET_CONTACT_DETAILS, {
		variables: {
			id: contactId,
		},
	});

	if (error) {
		console.log(error);
	}

	if (loading) {
		console.log(loading);
	}

	useEffect(() => {
		if (data && data.contact_by_pk) {
			const contactData = data.contact_by_pk;
			setFirstName(contactData.first_name);
			setLastName(contactData.last_name);
			setPhoneNumbers(contactData.phones);
			setCreatedAt(contactData.created_at);
		}
	}, [data]);

	const [editContact] = useMutation(EDIT_CONTACT, {
		update(cache, { data }) {},
	});

	const deleteBtnHandler = () => {
		deleteContact({
			variables: {
				id: contactId,
			},
		})
			.then(() => {
				console.log("Contact deleted successfully");
				closeBtnHandler();
			})
			.catch((error) => {
				console.error("Error deleting contact:", error);
			});
	};

	const editBtnHandler = () => {
		setEditMode(true);
		console.log(firstName, lastName, phoneNumbers);
		setTempFirstName(firstName);
		setTempLastName(lastName);
	};

	const cancelEditBtnHandler = () => {
		setFirstName(tempFirstName);
		setLastName(tempLastName);
		setTempFirstName("");
		setTempLastName("");
		setErrorMes("");
		setEditMode(false);
	};

	const uniqueNameCheck = useQuery(GET_CONTACT_SIMILAR, {
		variables: {
			where: {
				first_name: { _eq: firstName },
				last_name: { _eq: lastName },
			},
		},
	});

	const isNameValid = (data: any) => {
		if (!firstName) {
			return false;
		}

		if (!data || data.loading || data.error) {
			return false;
		}

		const contacts = data.contact;
		const isUnique = contacts.length === 0 ? true : false;

		const firstNameHasSpecialCharacters = /[^a-zA-Z\s]/.test(firstName);
		const lastNameHasSpecialCharacters = /[^a-zA-Z\s]/.test(lastName);
		return (
			isUnique &&
			!firstNameHasSpecialCharacters &&
			!lastNameHasSpecialCharacters
		);
	};

	const isNameValidResult =
		!uniqueNameCheck.loading &&
		!uniqueNameCheck.error &&
		isNameValid(uniqueNameCheck.data);

	const saveEditBtnHandler = async () => {
		if (!isNameValidResult) {
			setErrorMes(
				"Invalid name format. Names must be fill, unique, and contain only letters."
			);
			return;
		}

		const updatedContact = {
			first_name: firstName,
			last_name: lastName,
		};

		editContact({
			variables: {
				id: contactId,
				_set: updatedContact,
			},
		})
			.then(() => {
				console.log("Contact details updated successfully");
				setTempFirstName("");
				setTempLastName("");
				setErrorMes("");
				setEditMode(false);
			})
			.catch((error) => {
				console.error("Error updating contact:", error);
			});
	};

	return (
		<div
			className={css`
				background: var(--Dark-Grey, #2d2d2d);
				padding: 36px 24px 98px 24px;
				box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
				font-family: Poppins;
				display: flex;
				flex-direction: column;
				align-items: center;
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
				align-items: stretch;
			`}
		>
			<div
				className={css`
					display: flex;
					flex-direction: column;
					width: 100%;
					height: 100%;
					gap: 32px;
				`}
			>
				<div
					className={css`
						display: flex;
						justify-content: space-between;
						width: 100%;
					`}
				>
					<div
						className={css`
							color: #f4ce14;
							font-size: 20px;
							font-weight: 700;
						`}
					>
						Contact Info
					</div>
					<div
						className={css`
							color: #f4ce14;
							font-size: 20px;
							cursor: pointer;
						`}
						onClick={closeBtnHandler}
					>
						<AiOutlineClose />
					</div>
				</div>
				{/* data - editMode false */}
				{!editMode && (
					<div
						className={css`
							display: flex;
							flex-direction: column;
							width: 100%;
							gap: 4px;
						`}
					>
						<div
							className={css`
								color: #f4ce14;
								font-size: 18px;
								font-weight: 600;
							`}
						>
							Name
						</div>
						{(firstName || lastName) && (
							<div
								className={css`
									color: #fff;
									font-size: 18px;
									font-weight: 400;
								`}
							>
								{firstName} {lastName}
							</div>
						)}
					</div>
				)}
				{/* data - editMode true */}
				{editMode && (
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
								value={firstName}
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
								value={lastName}
							/>
						</div>
						{errorMes && (
							<div
								className={css`
									color: #d72626;
								`}
							>
								{errorMes}
							</div>
						)}
					</div>
				)}
				<div
					className={css`
						display: flex;
						flex-direction: column;
						width: 100%;
						gap: 4px;
					`}
				>
					<div
						className={css`
							color: #f4ce14;
							font-size: 18px;
							font-weight: 600;
						`}
					>
						Phones
					</div>
					{phoneNumbers &&
						phoneNumbers.map((i: any, idx: any) => (
							<div
								key={idx}
								className={css`
									display: flex;
									width: 100%;
									gap: 16px;
								`}
							>
								<div
									className={css`
										color: #f4ce14;
										font-size: 18px;
										font-weight: 400;
									`}
								>
									{phoneNumbers.length > 1 ? `Number ${idx + 1}` : "Number"}
								</div>
								<div
									className={css`
										color: #f4ce14;
										font-size: 18px;
										font-weight: 600;
									`}
								>
									:
								</div>
								<div
									className={css`
										color: #fff;
										font-size: 18px;
										font-weight: 400;
									`}
								>
									{i.number}
								</div>
							</div>
						))}
				</div>
				{/* contact created date */}
				<div
					className={css`
						display: flex;
						width: 100%;
						gap: 8px;
					`}
				>
					<div
						className={css`
							color: #f4ce14;
							font-size: 18px;
							font-weight: 600;
						`}
					>
						People added at
					</div>
					{createdAt && (
						<div
							className={css`
								color: #fff;
								font-size: 18px;
								font-weight: 400;
							`}
						>
							{dateFormatter(createdAt)}
						</div>
					)}
				</div>
			</div>
			{/* buttons - editMode false */}
			{!editMode && (
				<div
					className={css`
						width: 100%;
						display: flex;
						flex-direction: column-reverse;
						gap: 8px;
					`}
				>
					<div
						className={css`
							width: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #d72626;
							padding: 12px 24px;
							color: #fff;
							box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
							border-radius: 12px;
							text-align: center;
							font-size: 14px;
							font-weight: 500;
							@media (min-width: 576px) {
								font-size: 16px;
							}
							cursor: pointer;
						`}
						onClick={deleteBtnHandler}
					>
						Delete Contact
					</div>
					<div
						className={css`
							width: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #f4ce14;
							padding: 12px 24px;
							color: var(--Dark-Grey, #2d2d2d);
							box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
							border-radius: 12px;
							text-align: center;
							font-size: 14px;
							font-weight: 500;
							@media (min-width: 576px) {
								font-size: 16px;
							}
							cursor: pointer;
						`}
						onClick={editBtnHandler}
					>
						Edit Contact
					</div>
				</div>
			)}
			{/* buttons - editMode true */}
			{editMode && (
				<div
					className={css`
						width: 100%;
						display: flex;
						flex-direction: column-reverse;
						gap: 8px;
					`}
				>
					<div
						className={css`
							width: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #d72626;
							padding: 12px 24px;
							color: #fff;
							box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
							border-radius: 12px;
							text-align: center;
							font-size: 14px;
							font-weight: 500;
							@media (min-width: 576px) {
								font-size: 16px;
							}
							cursor: pointer;
						`}
						onClick={cancelEditBtnHandler}
					>
						Cancel
					</div>
					<div
						className={css`
							width: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #f4ce14;
							padding: 12px 24px;
							color: var(--Dark-Grey, #2d2d2d);
							box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
							border-radius: 12px;
							text-align: center;
							font-size: 14px;
							font-weight: 500;
							@media (min-width: 576px) {
								font-size: 16px;
							}
							cursor: pointer;
						`}
						onClick={saveEditBtnHandler}
					>
						Save
					</div>
				</div>
			)}
		</div>
	);
}
