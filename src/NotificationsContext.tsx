import * as React from "react";
import { useFetchTwitchStreamData } from "./dao/StatApiDao";

export type Notification = {
	id: number | string;
	title: string;
	subText?: string;
	imageUrl?: string;
	href?: string;
	shouldNewTab?: boolean;
};

const useNotificationsContextProvider = () => {
	const { data: twitchStreams = [] } = useFetchTwitchStreamData([
		"csconfederation",
		"csconfederation_b",
		"csconfederation_c",
		"dripcsc",
		"teamupsetti",
		"cscacademics"
	]);

	const notifications: Notification[] = [
		// This is a test notification, only uncomment in development { id: 0, imageUrl: "", title: "Test Notification", subText: "This is subtext" },
		...twitchStreams.flatMap(stream => ({
			id: stream.id,
			title: stream.user_name.concat(" is Live"),
			href: `https://www.twitch.tv/${stream.user_name}`,
			subText: stream.title,
			shouldNewTab: true,
			imageUrl: stream.thumbnail_url.replace("{width}", "160").replace("{height}", "90"),
		})),
	];

	const addNotification = (notification: Notification) => {
		if(!notifications.some(n => n.id === notification.id)){
			notifications.push(notification);
		}
	};

	const removeNotification = (notification: Notification) => {
		notifications.splice(notifications.indexOf(notification), 1);
	}

	return {
		addNotification,
		removeNotification,
		notifications,
	};
};

const notificationsContext = React.createContext<ReturnType<typeof useNotificationsContextProvider> | undefined>(
	undefined,
);

export const useNotificationsContext = () => {
	const context = React.useContext(notificationsContext);

	if (!context) {
		throw new Error("NotificationsContext must be used within the NotificationsContextProvider");
	}

	return context;
};

export const NotificationsProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
	return (
		<notificationsContext.Provider value={useNotificationsContextProvider()}>
			{children}
		</notificationsContext.Provider>
	);
};
