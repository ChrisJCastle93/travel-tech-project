const { averagesObject, getOverallReviewScore} = require("../public/javascripts/averages");

const reviews = [
  {
    content: {
      proBullets: [Array],
      conBullets: [Array],
      reviewTitle: ''
    },
    __v: 0
  },
  {
    content: {
      proBullets: [Array],
      conBullets: [Array],
      reviewTitle: ''
    },
    __v: 0
  },
  {
    content: {
      proBullets: [Array],
      conBullets: [Array],
      overallScore: 4,
      features: 3,
      customerSupport: 5,
      distribution: 3,
      reviewTitle: 'TITLE'
    },
    __v: 0
  }
]

describe("The overall review score", () => {
  it("should be a number", () => {
    expect(getOverallReviewScore(reviews)).toEqual(expect.any(Number));
  });
});

describe("The overall review score", () => {
  it("should be a number between 0 and 5", () => {
    expect(getOverallReviewScore(reviews)).toBeGreaterThanOrEqual(0);
    expect(getOverallReviewScore(reviews)).toBeLessThanOrEqual(5);
  });
});

describe("The average scores object", () => {
  it("should have keys equal to schema", () => {
    expect(averagesObject(reviews)).toHaveProperty('overallScore', 'features', 'easyToUse', 'customerSupport', 'valueForMoney', 'distribution');
  });
});

describe("Values on the average scores object", () => {
  it("should be between 0 and 5", () => {
    const obj = [
      {
        content: {
          overallScore: 4
        }
      }
    ]
    expect(averagesObject(obj).overallScore).toBe(4);
  });
});