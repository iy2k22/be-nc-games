const db = require("../db/connection");

const readCategories = async () => {
  const result = await db.query(`SELECT * FROM categories;`);
  return result.rows;
};

const checkReviewExists = async (review_id) => {
  const doesExist = await db.query(
    `SELECT review_id FROM reviews WHERE review_id=$1;`,
    [review_id]
  );
  return Boolean(doesExist.rows[0]);
};

const readReview = async (review_id) => {
  const doesExist = await checkReviewExists(review_id);
  if (!doesExist) {
    return false;
  }
  const result = await db.query(`SELECT * FROM reviews WHERE review_id=$1;`, [
    review_id,
  ]);
  return result.rows;
};

module.exports = {
  readCategories,
  readReview,
};
