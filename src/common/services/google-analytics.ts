import ReactGA from "react-ga4";

export const gaCategories = {
    Profile: "Profile",
}

export const gaEvent = (category: string, action: string, user?: Object | null) => {
    ReactGA.send({
        category, 
        action,
        user,
    });
}