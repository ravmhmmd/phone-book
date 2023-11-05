import ContactCard from "@/components/ContactCard";
import { css } from "@emotion/css";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_FAVORITE_CONTACTS = gql`
	query GetFavoriteContacts($where: contact_bool_exp) {
		contact(where: $where) {
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

const GET_REGULAR_CONTACTS = gql`
	query GetRegularContacts(
		$limit: Int
		$offset: Int
		$where: contact_bool_exp
	) {
		contact(limit: $limit, offset: $offset, where: $where) {
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

const PAGE_SIZE = 10;

interface ContactListProps {
	clickCardHandler: (id: number) => void;
	searchValue: string;
}

export default function ContactList({
	clickCardHandler,
	searchValue,
}: ContactListProps) {
	const [favoriteContacts, setFavoriteContacts] = useState(() => {
		const storedFavorites = localStorage.getItem("favoriteContacts");
		return storedFavorites ? JSON.parse(storedFavorites) : [];
	});

	const [page, setPage] = useState(1);

	const { data: favoriteData, loading: favoriteLoading } = useQuery(
		GET_FAVORITE_CONTACTS,
		{
			variables: {
				where: {
					id: { _in: favoriteContacts },
				},
			},
		}
	);

	const { data: regularData, loading: regularLoading } = useQuery(
		GET_REGULAR_CONTACTS,
		{
			variables: {
				limit: PAGE_SIZE,
				offset: (page - 1) * PAGE_SIZE,
				where: {
					id: { _nin: favoriteContacts },
					first_name: { _ilike: `%${searchValue}%` }, // Add this filter
				},
			},
		}
	);

	if (favoriteLoading || regularLoading) {
		console.log(favoriteLoading || regularLoading);
	}

	const favoriteContactsData = favoriteData?.contact || [];
	const regularContactsData = regularData?.contact || [];

	const toggleFavorite = (contactId: string) => {
		if (favoriteContacts.includes(contactId)) {
			setFavoriteContacts(
				favoriteContacts.filter((id: string) => id !== contactId)
			);
		} else {
			setFavoriteContacts([...favoriteContacts, contactId]);
		}
		setPage(1);
	};

	useEffect(() => {
		localStorage.setItem("favoriteContacts", JSON.stringify(favoriteContacts));
	}, [favoriteContacts]);

	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 8px;
				justify-content: center;
			`}
		>
			<div
				className={css`
					color: var(--Dark-Grey, #2d2d2d);
					font-family: Poppins;
					font-size: 18px;
					font-style: bold;
					font-weight: 700;
					line-height: normal;
					@media (min-width: 576px) {
						font-size: 24px;
					}
					margin-top: 12px;
				`}
			>
				Favorites
			</div>
			{favoriteContactsData.map((contact: any) => (
				<ContactCard
					key={contact.id}
					contactId={contact.id}
					contactName={`${contact.first_name} ${contact.last_name}`}
					contactNumber={contact.phones[0].number}
					isFavourite={true}
					toggleFavorite={() => toggleFavorite(contact.id)}
					clickCardHandler={clickCardHandler}
				/>
			))}
			<div
				className={css`
					color: var(--Dark-Grey, #2d2d2d);
					font-family: Poppins;
					font-size: 18px;
					font-style: bold;
					font-weight: 700;
					line-height: normal;
					@media (min-width: 576px) {
						font-size: 24px;
					}
					margin-top: 24px;
				`}
			>
				All Contact
			</div>
			{regularContactsData.map((contact: any) => (
				<ContactCard
					key={contact.id}
					contactId={contact.id}
					contactName={`${contact.first_name} ${contact.last_name}`}
					contactNumber={contact.phones[0].number}
					isFavourite={favoriteContacts.includes(contact.id)}
					toggleFavorite={() => toggleFavorite(contact.id)}
					clickCardHandler={clickCardHandler}
				/>
			))}

			{/* pagination nav */}
			<div
				className={css`
					display: flex;
					justify-content: center;
					align-items: center;
					margin-top: 24px;
					font-family: Poppins;
					margin: auto;
				`}
			>
				<button
					onClick={() => setPage(page - 1)}
					disabled={page === 1}
					className={css`
						margin: 8px;
						background-color: ${page === 1 ? "#ccc" : "#f4ce14"};
						color: ${page === 1 ? "#888" : "var(--Dark-Grey, #2d2d2d)"};
						border-radius: 12px;
						cursor: ${page === 1 ? "not-allowed" : "pointer"};
						font-size: 14px;
						padding: 12px 16px;
						@media (min-width: 576px) {
							padding: 12px 24px;
						}
						font-family: Poppins;
					`}
				>
					&lt;
				</button>
				<div
					className={css`
						margin: 8px;
						background-color: var(--Dark-Grey, #2d2d2d);
						color: #f4ce14;
						border-radius: 12px;
						padding: 12px 16px;
						@media (min-width: 576px) {
							padding: 12px 24px;
						}
						font-size: 14px;
						text-align: center;
					`}
				>
					{page}
				</div>
				<button
					onClick={() => setPage(page + 1)}
					disabled={regularContactsData.length < PAGE_SIZE}
					className={css`
						margin: 8px;
						background-color: ${regularContactsData.length < PAGE_SIZE
							? "#ccc"
							: "#f4ce14"};
						color: ${regularContactsData.length < PAGE_SIZE
							? "#888"
							: "var(--Dark-Grey, #2d2d2d)"};
						border-radius: 12px;
						cursor: ${regularContactsData.length < PAGE_SIZE
							? "not-allowed"
							: "pointer"};
						font-size: 14px;
						padding: 12px 16px;
						@media (min-width: 576px) {
							padding: 12px 24px;
						}
						font-family: Poppins;
					`}
				>
					&gt;
				</button>
			</div>
		</div>
	);
}
