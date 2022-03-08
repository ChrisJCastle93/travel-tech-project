// Establish empty object with the keys that we're going to use to calculate averages.

// Set the key array length to 0, so we can increment it later

// Create a function that will calculate the averages of a set of reviews we give it. Within this function we will loop through the keys (overallScore, features etc) of the object we established above.

// We loop through each review using the first key (overallScore), looking for the value. We use filter and map to create an array of those values. Eg. Overall Scores = [3,4,3]. If for some reason, there are keys that have not been scored yet, we will skip to the next key from our averages object.

// Then, we take the array we created in the last step and run a reduce on it to get the sum, and then the average. We then insert the average of that key (overallScore) into the averages object we set at the start of the function.

// Once we have looped through all of the keys in averages, we will have an object that contains their average score for each of the keys present.

// The function ultimately returns the average of all metrics, across all the reviews left for a company, so will be our headline number.

const internalCalcs = (reviews) => {
  const averages = {
    overallScore: 0,
    features: 0,
    easyToUse: 0,
    customerSupport: 0,
    valueForMoney: 0,
    distribution: 0,
  };
  let keyArrayL = 0;
  for (key in averages) {
    const keyArray = reviews
      .filter((review) => review.content[key])
      .map((review) => {
        return review.content[key];
      });
    // console.log(key, keyArray)
    if (keyArray.length == 0) {
      continue;
    }
    const keyAverage = keyArray.reduce((acc, value) => {
      return (acc + value);
    }, 0);
    if (isNaN(keyAverage)) {
      continue;
    } else {
      keyArrayL++;
      averages[key] = Math.round(keyAverage/keyArray.length);
    }
  }
  const average =
    Math.round(Object.values(averages).reduce((acc, value) => {
      return acc + value;
    }) / keyArrayL)
  return {
    average,
    averages,
  };
};

const averagesObject = (reviews) => {
  // console.log('averages object =====>', internalCalcs(reviews).averages)
  return internalCalcs(reviews).averages;
};

const getOverallReviewScore = (reviews) => {
  // console.log('overall Review Score =====>', internalCalcs(reviews).average)
  return internalCalcs(reviews).average;
};

module.exports = {
  averagesObject,
  getOverallReviewScore
};
