import Cookies from "js-cookie";

export const isUserInScope = ( scope: string) => {
    return false;
    // const jwt = Cookies.get("jwt") ?? "";
    // if(!jwt) {
    //     return false
    // }
    // const userData: Record<string, any> = JSON.parse(atob(jwt?.split(".")[1] ?? undefined));
    // return userData?.scopes?.includes(scope);
}