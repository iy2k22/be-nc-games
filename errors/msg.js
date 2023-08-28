module.exports = {
  INVALID_ID: (type) => {
    return {
      status: 400,
      msg: `error: ${type} id must be a number`,
    };
  },
  NOT_FOUND: (id, type) => {
    return {
      status: 404,
      msg: `error: ${type} with id ${id} does not exist`,
    };
  },
  NO_COMMENTS_FOR_REVIEW: (id) => {
    return {
      status: 404,
      msg: `error: no comments for review with id ${id}`,
    };
  },
  DOES_NOT_HAVE_PROP: (prop) => {
    return {
      status: 400,
      msg: `error: request doesn't have '${prop}' property`,
    };
  },
  INVALID_TYPE: (prop, type) => {
    return {
      status: 400,
      msg: `error: '${prop}' must be a ${type}`,
    };
  },
  NO_REVIEWS: {
    status: 404,
    msg: 'error: no reviews found'
  }
};
