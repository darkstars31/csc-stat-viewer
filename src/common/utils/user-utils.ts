import Cookies from "js-cookie";

export const isUserInScope = ( scope: string) => {
    const jwt = Cookies.get("jwt");
    if(!jwt) {
        return false
    }
    try{
        const decoded = atob(jwt?.split(".")[1] ?? undefined)
        const userData: Record<string, any> = JSON.parse(decoded);
        return userData?.scopes?.includes(scope);
    } catch {
        return false
    }
}