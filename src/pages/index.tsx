import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Phonebook from "./phonebook/Phonebook";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<>
			<Head>
				<title>YellowPage</title>
				<meta name="description" content="Online people's contact dictionary" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main>
				<Phonebook />
			</main>
		</>
	);
}
