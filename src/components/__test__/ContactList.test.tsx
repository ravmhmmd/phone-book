import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MockedProvider } from "@apollo/client/testing";
import ContactList from "../ContactList";
import { act } from "react-dom/test-utils";
import { gql } from "@apollo/client";

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

const favoriteContactsMock = {
	request: {
		query: GET_FAVORITE_CONTACTS,
		variables: {},
	},
	result: {
		data: {
			contact: [
				{
					created_at: "2023-11-01",
					first_name: "Rahmat",
					id: 1,
					last_name: "Dady",
					phones: [{ number: "1234567890" }],
				},
			],
		},
	},
};

const regularContactsMock = {
	request: {
		query: GET_REGULAR_CONTACTS,
		variables: {
			limit: 10,
			offset: 0,
		},
	},
	result: {
		data: {
			contact: [
				{
					created_at: "2023-11-02",
					first_name: "Putra",
					id: 2,
					last_name: "Indomaret",
					phones: [{ number: "9876543210" }],
				},
			],
		},
	},
};

const mocks = [favoriteContactsMock, regularContactsMock];

describe("ContactList component", () => {
	it("render favorite contacts list", async () => {
		act(() => {
			render(
				<MockedProvider mocks={mocks} addTypename={false}>
					<ContactList clickCardHandler={() => {}} searchValue="" />
				</MockedProvider>
			);
		});

		await new Promise((resolve) => setTimeout(resolve, 0));

		const favoriteContactsHeading = screen.getByText("Favorites");
		expect(favoriteContactsHeading).toBeInTheDocument();
	});

	it("render regular contacts list", async () => {
		act(() => {
			render(
				<MockedProvider mocks={mocks} addTypename={false}>
					<ContactList clickCardHandler={() => {}} searchValue="" />
				</MockedProvider>
			);
		});

		await new Promise((resolve) => setTimeout(resolve, 0));

		const regularContactsHeading = screen.getByText("All Contact");
		expect(regularContactsHeading).toBeInTheDocument();
	});

	it("handle pagination buttons", async () => {
		act(() => {
			render(
				<MockedProvider mocks={mocks} addTypename={false}>
					<ContactList clickCardHandler={() => {}} searchValue="" />
				</MockedProvider>
			);
		});

		await new Promise((resolve) => setTimeout(resolve, 0));

		const previousPageButton = screen.getByText("<");
		const nextPageButton = screen.getByText(">");
		fireEvent.click(previousPageButton);
	});
});
