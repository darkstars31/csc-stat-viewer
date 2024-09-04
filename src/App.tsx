import * as React from "react";
import "./index.css";
import { Router } from "./Router";
import { DataContextProvider } from "./DataContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLoadingError } from "./pages/appLoadingError";
import { Header } from "./header-nav/header";
import { SeasonAndMatchTypeSelector } from "./header-nav/seasonAndMatchTypeSelector";
import ScrollToHashElement from "./common/components/scrollToHashElement";

export const queryClient = new QueryClient();
const env: string = process.env.NODE_ENV!;
console.info(env);

declare global {
	interface Window {
		debug: any;
		beta: any;
	}
}

window.debug = false;
window.beta = false;

function App() {
	return (
		<div className="bg-midnight1 text-white scroll-none">
			<QueryClientProvider client={queryClient}>
				<DataContextProvider>
					<AppLoadingError />
					<ScrollToHashElement />
					<div className="fixed sticky top-0 z-10">
						<Header />
						<SeasonAndMatchTypeSelector />
					</div>
					<div>
						<Router />
					</div>
				</DataContextProvider>
			</QueryClientProvider>
		</div>
	);
}

export default App;
