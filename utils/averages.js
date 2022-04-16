const averagesObject = (reviews) => {
  const averages = {
    overallScore: 0,
    features: 0,
    easyToUse: 0,
    customerSupport: 0,
    valueForMoney: 0,
    distribution: 0,
  };

  for (key in averages) {
    const keyArray = reviews
      .filter((review) => review.content[key])
      .map((review) => {
        return review.content[key];
      });

    if (keyArray.length == 0) {
      continue;
    }

    const keyAverage = keyArray.reduce((acc, value) => {
      return acc + value;
    }, 0);
    if (isNaN(keyAverage)) {
      continue;
    } else {
      averages[key] = Math.round(keyAverage / keyArray.length);
    }
  }

  return averages;
};

const getOverallReviewScore = (reviews) => {
  const averages = averagesObject(reviews);
  return Math.round(
    Object.values(averages).reduce((acc, value) => {
      return acc + value;
    }) / Object.values(averages).length
  );
};

module.exports = {
  averagesObject,
  getOverallReviewScore,
};
