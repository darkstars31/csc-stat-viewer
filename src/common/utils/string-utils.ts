export const nth = (n: string | number) => {
    return ["st", "nd", "rd"][((Number(n) + 90) % 100 - 10) % 10 - 1] || "th";
};

export const calculatePercentage = (value: number, total: number, decimals?: number) => ((value/total)*100).toFixed(decimals || 2);