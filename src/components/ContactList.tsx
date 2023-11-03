"use client";
import ContactCard from "@/components/ContactCard";
import { css } from "@emotion/css";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_PHONES = gql`
	query GetPhoneList(
		$where: phone_bool_exp
		$distinct_on: [phone_select_column!]
		$limit: Int = 10
		$offset: Int = 0
		$order_by: [phone_order_by!]
	) {
		phone(
			where: $where
			distinct_on: $distinct_on
			limit: $limit
			offset: $offset
			order_by: $order_by
		) {
			contact {
				last_name
				first_name
				id
			}
			number
		}
	}
`;

export default function ContactList() {
	const { data, loading, error } = useQuery(GET_PHONES);

	if (loading) {
		console.log(loading);
	}

	if (error) {
		console.error(error);
	}

	const phones = data?.phone;
	const [favoriteContacts, setFavoriteContacts] = useState(() => {
		const storedFavorites = localStorage.getItem("favoriteContacts");
		return storedFavorites ? JSON.parse(storedFavorites) : [];
	});

	const toggleFavorite = (contactId: string) => {
		if (favoriteContacts.includes(contactId)) {
			// Remove from favorites
			setFavoriteContacts(
				favoriteContacts.filter((id: string) => id !== contactId)
			);
		} else {
			// Add to favorites
			setFavoriteContacts([...favoriteContacts, contactId]);
		}
	};

	useEffect(() => {
		// Save favorite contacts to Local Storage when the list changes
		localStorage.setItem("favoriteContacts", JSON.stringify(favoriteContacts));
	}, [favoriteContacts]);

	return (
		<div
			className={css`
				display: flex;
				flex-direction: column;
				gap: 8px;
			`}
		>
			{phones?.map((i: any) => (
				<ContactCard
					key={i.contact.id}
					contactName={i.contact.first_name + " " + i.contact.last_name}
					contactNumber={i.number}
					isFavourite={favoriteContacts.includes(i.contact.id)}
					toggleFavorite={() => toggleFavorite(i.contact.id)}
				/>
			))}
		</div>
	);
}
