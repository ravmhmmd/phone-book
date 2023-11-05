import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactDetailModal from "../ContactDetailModal";
import { gql } from "@apollo/client";
import { act } from "react-dom/test-utils";
import { MockedProvider } from "@apollo/client/testing";

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

const getContactDetailMock = {
	request: {
		query: GET_CONTACT_DETAILS,
		variables: {
			id: 1,
		},
	},
	result: {
		data: {
			contact_by_pk: {
				last_name: "Adit",
				id: 1,
				first_name: "Wahyu",
				created_at: "2023-11-05T09:01:07.16625+00:00",
				phones: [
					{
						number: "11333355555577777777",
					},
				],
			},
		},
	},
};

const mocks = [getContactDetailMock];

describe("ContactDetailModal", () => {
	it("render ContactDetailModal", async () => {
		act(() => {
			render(
				<MockedProvider mocks={mocks} addTypename={false}>
					<ContactDetailModal contactId={1} closeBtnHandler={() => {}} />
				</MockedProvider>
			);
		});

		await waitFor(() => {
			expect(screen.getByText("Wahyu Adit")).toBeInTheDocument();
			expect(screen.getByText("11333355555577777777")).toBeInTheDocument();
			expect(screen.getByText("People added at")).toBeInTheDocument();
		});
	});

	it("allows cancel edit", async () => {
		act(() => {
			render(
				<MockedProvider mocks={mocks} addTypename={false}>
					<ContactDetailModal contactId={1} closeBtnHandler={() => {}} />
				</MockedProvider>
			);
		});

		await waitFor(() => {
			expect(screen.getByText("Wahyu Adit")).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText("Edit Contact"));

		const firstNameInput = screen.getByPlaceholderText("Insert first name");
		fireEvent.change(firstNameInput, { target: { value: "Iskandar" } });
		expect(screen.getByDisplayValue("Iskandar")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Cancel"));

		await waitFor(() => {
			expect(screen.getByText("Wahyu Adit")).toBeInTheDocument();
		});
	});
});
