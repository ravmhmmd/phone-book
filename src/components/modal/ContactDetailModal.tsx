import { gql, useMutation, useQuery } from "@apollo/client";
import { css } from "@emotion/css";
import { AiOutlineClose } from "react-icons/ai";

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

	let contactData: any;
	if (data && data.contact_by_pk) {
		contactData = data.contact_by_pk;
	}

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
					{contactData && (
						<div
							className={css`
								color: #fff;
								font-size: 18px;
								font-weight: 400;
							`}
						>
							{contactData.first_name} {contactData.last_name}
						</div>
					)}
				</div>
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
					{contactData &&
						contactData.phones.map((i: any, idx: any) => (
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
									{contactData.phones.length > 1
										? `Number ${idx + 1}`
										: "Number"}
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
					{contactData && (
						<div
							className={css`
								color: #fff;
								font-size: 18px;
								font-weight: 400;
							`}
						>
							{dateFormatter(contactData.created_at)}
						</div>
					)}
				</div>
			</div>
			<div
				className={css`
					width: 100%;
					display: flex;
					gap: 16px;
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
			</div>
		</div>
	);
}
