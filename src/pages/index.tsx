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
				<meta
					property="og:url"
					content="https://yellowpage-phonebook.netlify.app/"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="YellowPage" />
				<meta
					property="og:description"
					content="Online people's contact dictionary"
				/>
				<meta
					property="og:image"
					content="https://yellowpage-phonebook.netlify.app/apple-touch-icon.png"
				/>

				<meta name="twitter:card" content="summary_large_image" />
				<meta
					property="twitter:domain"
					content="yellowpage-phonebook.netlify.app"
				/>
				<meta
					property="twitter:url"
					content="https://yellowpage-phonebook.netlify.app/"
				/>
				<meta name="twitter:title" content="YellowPage" />
				<meta
					name="twitter:description"
					content="Online people's contact dictionary"
				/>
				<meta
					name="twitter:image"
					content="https://yellowpage-phonebook.netlify.app/apple-touch-icon.png"
				/>
			</Head>
			<main>
				<Phonebook />
			</main>
		</>
	);
}
