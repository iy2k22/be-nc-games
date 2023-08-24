const db = require("../db/connection");
const resCodes = require('../res_codes.json');

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
    return resCodes.REVIEW_NOT_FOUND;
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

const readCommentsByReview = async (review_id) => {
  const doesExist = await checkReviewExists(review_id);
  if (!doesExist)
    return resCodes.REVIEW_NOT_FOUND;
  const result = await db.query(`SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at desc;`, [review_id]);
  if (!result.rows.length)
    return resCodes.NO_COMMENTS_FOR_REVIEW;
  return result.rows;
}

const putCommentOnReview = async (comment) => {
  const doesExist = await checkReviewExists(comment.review_id);
  if (!doesExist) return resCodes.REVIEW_NOT_FOUND;
  await db.query(
    `INSERT INTO comments (body, author, review_id)
  VALUES ($1, $2, $3);`,
    [comment.body, comment.username, comment.review_id]
  );
  return {
    username: comment.username,
    body: comment.body
  };
};

module.exports = {
  readCategories,
  readReview,
  readReviews,
  readCommentsByReview,
  putCommentOnReview
};
