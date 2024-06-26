export const nth = (n: string | number) => {
    return ["st", "nd", "rd"][((Number(n) + 90) % 100 - 10) % 10 - 1] || "th";
};

export const calculatePercentage = (value: number, total: number, decimals?: number) => ((value/total)*100).toFixed(decimals ?? 2);

export const getCssColorGradientBasedOnPercentage = (percentage: number | string) => {
    let colorClass = '';
    if (+percentage >= 90) {
        colorClass = 'from-green-500 to-green-800'; // Gradient from green-500 to green-900 for percentages >= 90%
    } else if (+percentage >= 80) {
        colorClass = 'from-green-400 to-green-700'; // Gradient from green-400 to green-800 for percentages >= 80%
    } else if (+percentage >= 70) {
        colorClass = 'from-green-300 to-green-600'; // Gradient from green-300 to green-700 for percentages >= 70%
    } else if (+percentage >= 60) {
        colorClass = 'from-green-200 to-green-500'; // Gradient from green-200 to green-600 for percentages >= 60%
    } else if (+percentage >= 50) {
        colorClass = 'from-green-100 to-green-400'; // Gradient from green-100 to green-500 for percentages >= 50%
    } else if (+percentage >= 40) {
        colorClass = 'from-yellow-300 to-yellow-600'; // Gradient from yellow-300 to yellow-700 for percentages >= 40%
    } else if (+percentage >= 30) {
        colorClass = 'from-yellow-200 to-yellow-500'; // Gradient from yellow-200 to yellow-600 for percentages >= 30%
    } else if (+percentage >= 20) {
        colorClass = 'from-yellow-100 to-yellow-400'; // Gradient from yellow-100 to yellow-500 for percentages >= 20%
    } else if (+percentage >= 10) {
        colorClass = 'from-red-400 to-red-700'; // Gradient from red-400 to red-800 for percentages >= 10%
    } else {
        colorClass = 'from-red-300 to-red-600'; // Gradient from red-300 to red-700 for percentages < 10%
    }
    return `bg-clip-text text-transparent bg-gradient-to-r ${colorClass}`;
}