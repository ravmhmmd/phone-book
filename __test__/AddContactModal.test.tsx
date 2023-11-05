import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddContactModal from "../src/components/modal/AddContactModal";
import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { act } from "react-dom/test-utils";

const GET_CONTACT_SIMILAR = gql`
	query GetContactList($where: contact_bool_exp) {
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

const mocks = [
	{
		request: {
			query: GET_CONTACT_SIMILAR,
			variables: {
				where: {
					first_name: "Wahyu",
					last_name: "Adit",
				},
			},
		},
		result: {
			data: {
				contact: [
					{
						created_at: "2023-11-05T09:01:07.16625+00:00",
						first_name: "Wahyu",
						id: 1,
						last_name: "Adit",
						phones: [
							{
								number: "11333355555577777777",
							},
						],
					},
				],
			},
		},
	},
];

describe("AddContactModal", () => {
	test("render AddContactModal", async () => {
		await act(async () => {
			render(
				<MockedProvider mocks={mocks} addTypename={false}>
					<AddContactModal closeModalHandler={() => {}} />
				</MockedProvider>
			);
		});

		expect(screen.getByTestId("add-contact-title")).toBeInTheDocument();
	});

	test("input first name and last name", async () => {
		await act(async () => {
			render(
				<MockedProvider mocks={mocks} addTypename={false}>
					<AddContactModal closeModalHandler={() => {}} />
				</MockedProvider>
			);
		});

		const firstNameInput = screen.getByPlaceholderText("Insert first name");
		const lastNameInput = screen.getByPlaceholderText("Insert last name");

		fireEvent.change(firstNameInput, { target: { value: "Wahyu" } });
		fireEvent.change(lastNameInput, { target: { value: "Adit" } });

		expect(firstNameInput).toHaveValue("Wahyu");
		expect(lastNameInput).toHaveValue("Adit");
	});

	test("add and remove phone number fields", async () => {
		await act(async () => {
			render(
				<MockedProvider mocks={mocks} addTypename={false}>
					<AddContactModal closeModalHandler={() => {}} />
				</MockedProvider>
			);
		});

		expect(screen.getAllByPlaceholderText("Insert phone number")).toHaveLength(
			1
		);

		const addFieldButton = screen.getByText("+ Add Field");
		fireEvent.click(addFieldButton);

		expect(screen.getAllByPlaceholderText("Insert phone number")).toHaveLength(
			2
		);

		const deleteButton = screen.getByTestId("delete-number-field-btn-1");
		fireEvent.click(deleteButton);

		expect(screen.getAllByPlaceholderText("Insert phone number")).toHaveLength(
			1
		);
	});

	test("display error message for invalid name format", async () => {
		await act(async () => {
			render(
				<MockedProvider mocks={mocks} addTypename={false}>
					<AddContactModal closeModalHandler={() => {}} />
				</MockedProvider>
			);
		});

		const saveButton = screen.getByText("Save");

		fireEvent.click(saveButton);

		const errorMessage = screen.getByText(
			"Invalid name format. Names must be fill, unique, and contain only letters."
		);

		expect(errorMessage).toBeInTheDocument();
	});
});
