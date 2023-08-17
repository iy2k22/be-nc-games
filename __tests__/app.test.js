const app = require('../app');
const runSeed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const request = require('supertest');
beforeEach(() => runSeed(testData));

describe("GET non-existent endpoint", () => {
    test("returns 404", () => {
        return request(app).get('/api/a').expect(404);
    })
})

describe("GET /api/categories", () => {
    test("returns 200", () => {
        return request(app).get('/api/categories').expect(200);
    });
    test("returns an object", async () => {
        const result = await request(app).get('/api/categories');
        expect(typeof result.body).toBe("object");
    })
    test("returns an object containing categories", async () => {
        const result = await request(app).get('/api/categories');
        expect(result.body.hasOwnProperty('categories')).toBe(true);
    })
    test("categories is an array containing categories", async () => {
        const result = await request(app).get('/api/categories');
        expect(Array.isArray(result.body.categories)).toBe(true);
    })
    test("categories element contains keys \"slug\" and \"description\"", async () => {
        const result = await request(app).get('/api/categories');
        result.body.categories.forEach((category) => {
            expect(category.hasOwnProperty("slug")).toBe(true);
            expect(category.hasOwnProperty("description")).toBe(true);
        })
    })
    test("\"slug\" and \"description\" keys have string values", async () => {
        const result = await request(app).get('/api/categories');
        result.body.categories.forEach((category) => {
            expect(typeof category.slug).toBe("string");
            expect(typeof category.description).toBe("string");
        })
    })
    test("returns correct data", async () => {
        const result = await request(app).get('/api/categories');
        expect(result.body.categories).toEqual(testData.categoryData);
    })
})