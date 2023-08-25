const app = require("../app");
const runSeed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
beforeEach(() => runSeed(testData));

describe("GET non-existent endpoint", () => {
  test("returns 404", () => {
    return request(app).get("/api/a").expect(404);
  });
});

describe("GET /api/categories", () => {
  test("returns 200", () => {
    return request(app).get("/api/categories").expect(200);
  });
  test("returns an object", async () => {
    const result = await request(app).get("/api/categories");
    expect(typeof result.body).toBe("object");
  });
  test("returns an object containing categories", async () => {
    const result = await request(app).get("/api/categories");
    expect(result.body.hasOwnProperty("categories")).toBe(true);
  });
  test("categories is an array containing categories", async () => {
    const result = await request(app).get("/api/categories");
    expect(Array.isArray(result.body.categories)).toBe(true);
  });
  test('categories element contains keys "slug" and "description"', async () => {
    const result = await request(app).get("/api/categories");
    result.body.categories.forEach((category) => {
      expect(category.hasOwnProperty("slug")).toBe(true);
      expect(category.hasOwnProperty("description")).toBe(true);
    });
  });
  test('"slug" and "description" keys have string values', async () => {
    const result = await request(app).get("/api/categories");
    result.body.categories.forEach((category) => {
      expect(typeof category.slug).toBe("string");
      expect(typeof category.description).toBe("string");
    });
  });
  test("returns correct data", async () => {
    const result = await request(app).get("/api/categories");
    expect(result.body.categories).toEqual(testData.categoryData);
  });
});

describe("GET /api", () => {
  test("returns status code 200", () => {
    return request(app).get("/api").expect(200);
  });
  test('returns an object with key "endpoints"', async () => {
    const result = await request(app).get("/api");
    expect(result.body.hasOwnProperty("endpoints")).toBe(true);
  });
  test("returns an object with available endpoints", async () => {
    const result = await request(app).get("/api");
    ["GET /api", "GET /api/categories", "GET /api/reviews"].forEach(
      (endpoint) => {
        expect(result.body.endpoints.hasOwnProperty(endpoint)).toBe(true);
      }
    );
  });
  test('all endpoints have a key of "description"', async () => {
    const result = await request(app).get("/api");
    for (endpoint in result.body.endpoints)
      expect(
        result.body.endpoints[endpoint].hasOwnProperty("description")
      ).toBe(true);
  });
  test('every endpoint expect "/api" has properties of "queries" and "exampleResponse"', async () => {
    const result = await request(app).get("/api");
    for (endpoint in result.body.endpoints)
      if (endpoint !== "GET /api")
        ["queries", "exampleResponse"].forEach((prop) => {
          expect(result.body.endpoints[endpoint].hasOwnProperty(prop)).toBe(
            true
          );
        });
  });
  test("returns correct data", async () => {
    const result = await request(app).get("/api");
    expect(result.body.endpoints).toEqual(require("../endpoints.json"));
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("returns a status code of 200", async () => {
    return request(app).get("/api/reviews/3").expect(200);
  });
  test('returned object has key of "review"', async () => {
    const result = await request(app).get("/api/reviews/3");
    expect(result.body.hasOwnProperty("review")).toBe(true);
  });
  test('"review" is an object', async () => {
    const result = await request(app).get("/api/reviews/3");
    expect(typeof result.body.review).toBe("object");
  });
  test('"review" has correct properties', async () => {
    const result = await request(app).get("/api/reviews/3");
    [
      "review_id",
      "title",
      "review_body",
      "designer",
      "review_img_url",
      "votes",
      "category",
      "owner",
      "created_at",
    ].forEach((prop) => {
      expect(result.body.review.hasOwnProperty(prop)).toBe(true);
    });
  });
  describe("keys have values of correct types", () => {
    test("review_id is a number", async () => {
      const result = await request(app).get("/api/reviews/3");
      expect(typeof result.body.review.review_id).toBe("number");
    });
    test("title is a string", async () => {
      const result = await request(app).get("/api/reviews/3");
      expect(typeof result.body.review.title).toBe("string");
    });
    test("desginer is a string", async () => {
      const result = await request(app).get("/api/reviews/3");
      expect(typeof result.body.review.designer).toBe("string");
    });
    test("owner is a string", async () => {
      const result = await request(app).get("/api/reviews/3");
      expect(typeof result.body.review.owner).toBe("string");
    });
    test("review_img_url is a string", async () => {
      const result = await request(app).get("/api/reviews/3");
      expect(typeof result.body.review.review_img_url).toBe("string");
    });
    test("review_body is a string", async () => {
      const result = await request(app).get("/api/reviews/3");
      expect(typeof result.body.review.review_body).toBe("string");
    });
    test("category is a string", async () => {
      const result = await request(app).get("/api/reviews/3");
      expect(typeof result.body.review.category).toBe("string");
    });
    test("votes is a number", async () => {
      const result = await request(app).get("/api/reviews/3");
      expect(typeof result.body.review.votes).toBe("number");
    });
    test("created_at is a string", async () => {
      const result = await request(app).get("/api/reviews/3");
      expect(typeof result.body.review.created_at).toBe("string");
    });
  });
  test("returns 400 if an id that is not a number is passed in", async () => {
    return request(app).get("/api/reviews/test").expect(400);
  });
  test("returns 404 on a review id that doesn't exist", async () => {
    return request(app).get("/api/reviews/1023").expect(404);
  });
});

describe("GET /api/reviews", () => {
  test("returns 200", async () => {
    return request(app).get("/api/reviews").expect(200);
  })
  test("returns an object", async () => {
    const result = await request(app).get("/api/reviews");
    expect(typeof result.body).toBe("object");
  })
  test("object has property \"reviews\"", async () => {
    const result = await request(app).get("/api/reviews");
    expect(result.body.hasOwnProperty("reviews")).toBe(true);
  })
  test("reviews key has array value", async () => {
    const result = await request(app).get("/api/reviews");
    expect(Array.isArray(result.body.reviews)).toBe(true);
  })
  test("array contains objects", async () => {
    const result = await request(app).get("/api/reviews");
    result.body.reviews.forEach((review) => {
      expect(typeof review).toBe("object");
    })
  })
  test("object has correct properties", async () => {
    const result = await request(app).get("/api/reviews");
    result.body.reviews.forEach((review) => {
      [
        'owner',
        'title',
        'review_id',
        'category',
        'review_img_url',
        'created_at',
        'votes',
        'designer',
        'comment_count'
      ].forEach((prop) => {
        expect(review.hasOwnProperty(prop)).toBe(true);
      })
    })
  })
  test("object has values of correct types", async () => {
    const result = await request(app).get("/api/reviews");
    const types = {
      owner: 'string',
      title: 'string',
      review_id: 'number',
      category: 'string',
      review_img_url: 'string',
      created_at: 'string',
      votes: 'number',
      designer: 'string',
      comment_count: 'number'
    }
    result.body.reviews.forEach((review) => {
      for (prop in types) {
        expect(typeof review[prop]).toBe(types[prop]);
      }
    })
  })
})

describe("GET /api/reviews/:review_id/comments", () => {
  const review_id = 3;
  test("returns 200", () => {
    return request(app).get(`/api/reviews/${review_id}/comments`).expect(200);
  })
  test("returns an object", async () => {
    const result = await request(app).get(`/api/reviews/${review_id}/comments`);
    expect(typeof result.body).toBe("object");
  })
  test("returns object with property comment", async () => {
    const result = await request(app).get(`/api/reviews/${review_id}/comments`);
    expect(result.body.hasOwnProperty("comments")).toBe(true);
  })
  test("comment is an array", async () => {
    const result = await request(app).get(`/api/reviews/${review_id}/comments`);
    expect(Array.isArray(result.body.comments)).toBe(true);
  })
  test("array contains objects", async () => {
    const result = await request(app).get(`/api/reviews/${review_id}/comments`);
    result.body.comments.forEach((comment) => {
      expect(typeof comment).toBe("object");
    })
  })
  test("object contains correct properties", async () => {
    const result = await request(app).get(`/api/reviews/${review_id}/comments`);
    result.body.comments.forEach((comment) => {
      [
        "comment_id",
        "votes",
        "created_at",
        "author",
        "body",
        "review_id"
      ].forEach((prop) => {
        expect(comment.hasOwnProperty(prop)).toBe(true);
      })
    })
  })
  test("props have correct types", async () => {
    const result = await request(app).get(`/api/reviews/${review_id}/comments`);
    result.body.comments.forEach((comment) => {
      expect(typeof comment.comment_id).toBe("number");
      expect(typeof comment.votes).toBe("number");
      expect(typeof comment.created_at).toBe("string");
      expect(typeof comment.author).toBe("string");
      expect(typeof comment.body).toBe("string");
      expect(typeof comment.review_id).toBe("number");
    })
  })
  test("review id is correct", async () => {
    const result = await request(app).get(`/api/reviews/${review_id}/comments`);
    result.body.comments.forEach((comment) => {
      expect(comment.review_id).toBe(review_id);
    })
  })
  test("review with non-existent id returns 404", async () => {
    const bad_id = 1023;
    const result = await request(app).get(`/api/reviews/${bad_id}/comments`);
    expect(result.status).toBe(404);
    expect(result.body.msg).toBe(`error: review with id ${bad_id} does not exist`);
  })
  test("review that doesn't have comments returns 404", async () => {
    const bad_id = 5;
    const result = await request(app).get(`/api/reviews/${bad_id}/comments`);
    expect(result.status).toBe(404);
    expect(result.body.msg).toBe(`error: no comments for review with id ${bad_id}`);
  })
  test("returns 400 when invalid id passed in", () => {
    return request(app).get('/api/reviews/a/comments').expect(400);
  })
})

describe("POST /api/reviews/:review_id/comment", () => {
  const comment = {
    username: 'mallionaire',
    body: 'test'
  };
  test("returns 201", () => {
    return request(app).post('/api/reviews/3/comments').send(comment).expect(201);
  })
  test("returns an object", async () => {
    const result = await request(app).post('/api/reviews/3/comments').send(comment);
    expect(typeof result.body).toBe('object');
  })
  test("object has a key of comment", async () => {
    const result = await request(app).post('/api/reviews/3/comments').send(comment);
    expect(result.body.hasOwnProperty('comment')).toBe(true);
  })
  test("comment key has object value", async () => {
    const result = await request(app).post('/api/reviews/3/comments').send(comment);
    expect(typeof result.body.comment).toBe('object');
  })
  test("comment has key of username", async () => {
    const result = await request(app).post('/api/reviews/3/comments').send(comment);
    expect(result.body.comment.hasOwnProperty('username')).toBe(true);
  })
  test("comment has key of body", async () => {
    const result = await request(app).post('/api/reviews/3/comments').send(comment);
    expect(result.body.comment.hasOwnProperty('body')).toBe(true);
  })
  test("username is a string", async () => {
    const result = await request(app).post('/api/reviews/3/comments').send(comment);
    expect(typeof result.body.comment.username).toBe('string');
  })
  test("body is a string", async () => {
    const result = await request(app).post('/api/reviews/3/comments').send(comment);
    expect(typeof result.body.comment.body).toBe('string');
  })
  test("returns 400 when passed review id that doesn't exist", async () => {
    const result = await request(app).post('/api/reviews/1023/comments').send(comment);
    expect(result.status).toBe(404);
    expect(result.body.msg).toBe("error: review with id 1023 does not exist");
  })
  test("returns 400 when passed an invalid review id", async () => {
    const result = await request(app).post('/api/reviews/a/comments').send(comment);
    expect(result.status).toBe(400);
    expect(result.body.msg).toBe("error: review id must be a number");
  })
  test("returns 400 when passed object that doesn't have username prop", async () => {
    const result = await request(app).post('/api/reviews/1/comments').send({
      body: 'a'
    })
    expect(result.status).toBe(400);
    expect(result.body.msg).toBe("error: request doesn't have 'username' property");
  })
  test("returns 400 when passed object that doesn't have body prop", async () => {
    const result = await request(app).post('/api/reviews/1/comments').send({
      username: 'a'
    })
    expect(result.status).toBe(400);
    expect(result.body.msg).toBe("error: request doesn't have 'body' property");
  })
  test("returns 400 when username isn't a string", async () => {
    const result = await request(app).post('/api/reviews/1/comments').send({
      username: 1,
      body: 'a'
    })
    expect(result.status).toBe(400);
    expect(result.body.msg).toBe("error: 'username' must be a string");
  })
  test("returns 400 when body isn't a string", async () => {
    const result = await request(app).post('/api/reviews/1/comments').send({
      username: '1',
      body: 2
    })
    expect(result.status).toBe(400);
    expect(result.body.msg).toBe("error: 'body' must be a string");
  })
  test("returns 400 when passed username that isn't registered", async () => {
    const result = await request(app).post('/api/reviews/2/comments').send({
      username: 'a',
      body: 'a'
    });
    expect(result.status).toBe(400);
    expect(result.body.msg).toBe("error: user not registered");
  })
})

describe("PATCH /api/reviews/:review_id", () => {
  const votes = {
    inc_votes: 10
  }
  test("returns 200", () => {
    return request(app).patch("/api/reviews/1").send(votes).expect(200);
  })
  test("returns object", async () => {
    const result = await request(app).patch("/api/reviews/1").send(votes);
    expect(typeof result.body).toBe("object");
  })
  test("returned object has review property", async () => {
    const result = await request(app).patch("/api/reviews/1").send(votes);
    expect(result.body.hasOwnProperty('review')).toBe(true);
  })
  test("review property is an object", async () => {
    const result = await request(app).patch('/api/reviews/1').send(votes);
    expect(typeof result.body.review).toBe("object");
  })
  test("review object has correct properties and value types", async () => {
    const result = await request(app).patch('/api/reviews/1').send(votes);
    const review = result.body.review;
    const key_types = {
      review_id: "number",
      title: "string",
      category: "string",
      designer: "string",
      owner: "string",
      review_body: "string",
      review_img_url: "string",
      created_at: "string",
      votes: "number"
    }
    for (key in key_types) {
      expect(review.hasOwnProperty(key)).toBe(true);
      expect(typeof review[key]).toBe(key_types[key]);
    }
  })
  test("returns correct review id", async () => {
    const id = 2;
    const result = await request(app).patch(`/api/reviews/${id}`).send(votes);
    const review = result.body.review;
    expect(review.review_id).toBe(id);
  })
  describe("vote incrementing", () => {
    const id = 4;
    test("votes increase when passed positive value", async () => {
      const votes1 = (await request(app).get(`/api/reviews/${id}`)).body.review.votes;
      const votes2 = (await request(app).patch(`/api/reviews/${id}`).send(votes)).body.review.votes;
      expect(votes2).toBe(votes1 + votes.inc_votes);
    })
    test("votes decrease when passed negative value", async () => {
      const votes1 = (await request(app).get(`/api/reviews/${id}`)).body.review.votes;
      const votes2 = (await request(app).patch(`/api/reviews/${id}`).send({ inc_votes: -20 })).body.review.votes;
      expect(votes2).toBe(votes1 - 20);
    })
    test("votes don't change when passed 0", async () => {
      const votes1 = (await request(app).get(`/api/reviews/${id}`)).body.review.votes;
      const votes2 = (await request(app).patch(`/api/reviews/${id}`).send({ inc_votes: 0 })).body.review.votes;
      expect(votes2).toBe(votes1);
    })
  })
  test("returns 400 when passed invalid id", () => {
    return request(app).patch('/api/reviews/a').expect(400);
  })
  test("returns 400 when passed object that doesn't have inc_votes", () => {
    return request(app).patch('/api/reviews/5').send({}).expect(400);
  })
  test("returns 400 when inc_votes isn't a number", () => {
    return request(app).patch('/api/reviews/3').send({ inc_votes: 'a' }).expect(400);
  })
  test("returns 404 when passed a review id that doesn't exist", () => {
    return request(app).patch('/api/reviews/998').send({ inc_votes: 2 }).expect(404);
  })
})

describe("DELETE /api/comments/:comment_id", () => {
  test("returns 204 and doesn't send an object", async () => {
    const result = await request(app).delete('/api/comments/5');
    expect(result.status).toBe(204);
    expect(result.body).toEqual({});
  })
  test("returns 404 when passed a review that doesn't exist", async () => {
    return request(app).delete('/api/comments/13').expect(404);
  })
  test("returns 400 when passed invalid review id", () => {
    return request(app).delete('/api/comments/a').expect(400);
  })
})

describe.only("GET /api/users", () => {
  test("returns 200", () => {
    return request(app).get('/api/users').expect(200);
  })
  test("returns an object", async () => {
    const result = await request(app).get('/api/users');
    expect(typeof result.body).toBe("object");
  })
  test("returns an object with a key of users", async () => {
    const result = await request(app).get('/api/users');
    expect(result.body.hasOwnProperty('users')).toBe(true);
  })
  test("users is an array", async () => {
    const result = await request(app).get('/api/users');
    expect(Array.isArray(result.body.users)).toBe(true);
  })
  test("users is an array of objects", async () => {
    const result = await request(app).get('/api/users');
    result.body.users.forEach((user) => {
      expect(typeof user).toBe("object");
    })
  })
  test("user objects have correct properties", async () => {
    const result = await request(app).get('/api/users');
    result.body.users.forEach((user) => {
      [
        'username',
        'name',
        'avatar_url'
      ].forEach((prop) => {
        expect(user.hasOwnProperty(prop)).toBe(true);
      })
    })
  })
  test("user properties have correct types", async () => {
    const result = await request(app).get('/api/users');
    result.body.users.forEach((user) => {
      [
        'username',
        'name',
        'avatar_url'
      ].forEach((prop) => {
        expect(typeof user[prop]).toBe("string");
      })
    })
  })
})