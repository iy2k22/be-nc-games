const db = require("../db/connection");
const resCodes = require("../res_codes.json");

const readCategories = async () => {
  const result = await db.query(`SELECT * FROM categories;`);
  return result.rows;
};

const checkExists = async (id, type) => {
  const doesExist = await db.query(
    `SELECT ${type}_id FROM ${type}s WHERE ${type}_id=$1;`,
    [id]
  );
  return Boolean(doesExist.rows[0]);
};

const readReview = async (review_id) => {
  const doesExist = await checkExists(review_id, "review");
  if (!doesExist) return resCodes.NOT_FOUND;
  const result = await db.query(`SELECT reviews.*, COUNT(comments.comment_id) AS comment_count
  FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id
  WHERE reviews.review_id=$1
  GROUP BY reviews.review_id
  ORDER BY reviews.review_id asc;`, [
    review_id,
  ]);
  const newResult = {...(result.rows[0])};
  newResult.comment_count = Number(newResult.comment_count);
  return newResult;
};

const readReviews = async (
  category,
  sort_by = "created_at",
  order = "desc"
) => {
  const query = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,
  COUNT(comments.comment_id) AS comment_count
  FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id
  ${category ? 'WHERE reviews.category = $1' : ''}
  GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order};`
  const result = category ? await db.query(query, [category]) : await db.query(query);
  if (!(result.rows[0])) return resCodes.NO_REVIEWS;
  return result.rows.map((review) => {
    const newReview = { ...review };
    newReview.comment_count = Number(newReview.comment_count);
    return newReview;
  })
};

const readCommentsByReview = async (review_id) => {
  const doesExist = await checkExists(review_id, "review");
  if (!doesExist) return resCodes.NOT_FOUND;
  const result = await db.query(
    `SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at desc;`,
    [review_id]
  );
  if (!result.rows.length) return resCodes.NO_COMMENTS_FOR_REVIEW;
  return result.rows;
};

const putCommentOnReview = async (comment) => {
  const doesExist = await checkExists(comment.review_id, "review");
  if (!doesExist) return resCodes.NOT_FOUND;
  await db.query(
    `INSERT INTO comments (body, author, review_id)
  VALUES ($1, $2, $3);`,
    [comment.body, comment.username, comment.review_id]
  );
  return {
    username: comment.username,
    body: comment.body,
  };
};

const changeVotes = async (review_id, votes) => {
  const doesExist = await checkExists(review_id, "review");
  if (!doesExist) return resCodes.NOT_FOUND;
  let sign = "+";
  if (votes < 0) {
    sign = "-";
    votes *= -1;
  }
  const query = `UPDATE reviews
  SET votes=votes${sign}$1
  WHERE review_id=$2
  RETURNING *;`;
  const result = await db.query(query, [votes, review_id]);
  return result.rows[0];
};

const removeComment = async (comment_id) => {
  const doesExist = await checkExists(comment_id, "comment");
  if (!doesExist) return resCodes.NOT_FOUND;
  await db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
};

const readUsers = async () => {
  const result = await db.query(`SELECT * FROM users;`);
  return result.rows;
};

module.exports = {
  readCategories,
  readReview,
  readReviews,
  readCommentsByReview,
  putCommentOnReview,
  changeVotes,
  removeComment,
  readUsers,
};
