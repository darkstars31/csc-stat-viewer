// correlation-worker.js
function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  
  function standardDeviation(arr, arrMean) {
    const sqDiff = arr.map(n => Math.pow(n - arrMean, 2));
    const avgSqDiff = mean(sqDiff);
    return Math.sqrt(avgSqDiff * arr.length / (arr.length - 1));
}

  
  function correlation(x, y) {
    const xMean = mean(x);
    const yMean = mean(y);
    const xStdDev = standardDeviation(x, xMean);
    const yStdDev = standardDeviation(y, yMean);
  
    const n = x.length;
    let num = 0;
    for (let i = 0; i < n; i++) {
      num += ((x[i] - xMean) * (y[i] - yMean));
    }
  
    return num / ((n) * xStdDev * yStdDev);
}


onmessage = (event) => {
    const { playerData, tier, statsKeys, ratingKey } = event.data;
  
    // Filter the player data inside the worker
    const filteredPlayers = playerData.filter(player => player.tier.name === tier);
  
    const coefficients = statsKeys.map((stat) => {
      const ratings = filteredPlayers.map((p) => ratingKey === 'mmr' ? p.mmr : p.stats.rating);
      const statValues = filteredPlayers.map((p) => p.stats[stat]);
  
      if (ratings.length < 2 || statValues.length < 2) {
        return 0;
      }
      return correlation(ratings, statValues);
    });
  
    postMessage(coefficients);
  };
  