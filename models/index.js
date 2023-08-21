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
  if (!doesExist)
    return false;
  const result = await db.query(`SELECT * FROM reviews WHERE review_id=$1;`, [
    review_id,
  ]);
  return result.rows;
};

const readReviews = async () => {
  const result =
    await db.query(`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,
  COUNT(comments.comment_id) AS comment_count
  FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at desc;`);
  return result.rows.map((review) => {
    const newReview = {...review};
    newReview.comment_count = Number(newReview.comment_count);
    return newReview;
  })
};

module.exports = {
  readCategories,
  readReview,
  readReviews
};
