export const nth = (n: string | number) => {
    return ["st", "nd", "rd"][((Number(n) + 90) % 100 - 10) % 10 - 1] || "th";
};