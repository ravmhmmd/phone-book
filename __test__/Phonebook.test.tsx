import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Phonebook from "../src/pages/phonebook/Phonebook";
import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";

const GET_CONTACT_QUERY = gql`
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

const mocks = [
	{
		request: {
			query: GET_CONTACT_QUERY,
			variables: {
				distinct_on: [],
				limit: 10,
				offset: 0,
				order_by: [],
				where: {},
			},
		},
		result: {
			data: {
				contact: [
					{
						created_at: "2023-11-05T12:00:00Z",
						first_name: "Wahyu",
						id: 1,
						last_name: "Adit",
						phones: [
							{
								number: "1234567890",
							},
						],
					},
					{
						created_at: "2023-11-06T12:00:00Z",
						first_name: "Iskandar",
						id: 2,
						last_name: "Putra",
						phones: [
							{
								number: "9876543210",
							},
						],
					},
				],
			},
		},
	},
];

test("Render Phonebook component", () => {
	render(
		<MockedProvider mocks={mocks} addTypename={false}>
			<Phonebook />
		</MockedProvider>
	);

	const phonebookComponent = screen.getByTestId("phonebook");
	expect(phonebookComponent).toBeInTheDocument();
});

test('Open Add Contact Modal when clicking "Add People"', () => {
	render(
		<MockedProvider mocks={mocks} addTypename={false}>
			<Phonebook />
		</MockedProvider>
	);

	const addPeopleButton = screen.getByTestId("add-contact-btn");
	fireEvent.click(addPeopleButton);

	const addContactModal = screen.getByTestId("add-contact-title");
	expect(addContactModal).toBeInTheDocument();
});
