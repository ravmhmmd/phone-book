import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactCard from "../ContactCard";

test("render favorite contact ContactCard", () => {
	render(
		<ContactCard
			contactId={1}
			contactName="Raja Safari"
			contactNumber={1231231231}
			isFavourite={true}
			toggleFavorite={() => {}}
			clickCardHandler={() => {}}
		/>
	);

	const contactName = screen.getByText("Raja Safari");
	const contactNumber = screen.getByText("1231231231");

	expect(contactName).toBeInTheDocument();
	expect(contactNumber).toBeInTheDocument();
	expect(screen.queryByTestId("favorite-icon")).toBeInTheDocument();
});

test("render regular contact ContactCard", () => {
	render(
		<ContactCard
			contactId={2}
			contactName="Iskandar Putra"
			contactNumber={1112223334}
			isFavourite={false}
			toggleFavorite={() => {}}
			clickCardHandler={() => {}}
		/>
	);

	const contactName = screen.getByText("Iskandar Putra");
	const contactNumber = screen.getByText("1112223334");

	expect(contactName).toBeInTheDocument();
	expect(contactNumber).toBeInTheDocument();
	expect(screen.queryByTestId("regular-icon")).toBeInTheDocument();
});

test("call clickCardHandler when click ContactCard", () => {
	const clickCardHandler = jest.fn();

	render(
		<ContactCard
			contactId={3}
			contactName="Wahyu Adit"
			contactNumber={5551234567}
			isFavourite={true}
			toggleFavorite={() => {}}
			clickCardHandler={clickCardHandler}
		/>
	);

	const card = screen.getByTestId("contact-card");
	fireEvent.click(card);

	expect(clickCardHandler).toHaveBeenCalledWith(3);
});
