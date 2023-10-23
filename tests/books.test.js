process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require('../db');

// Sample books data for testing
const sampleBooks = [
  {
    isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    year: 2017
  },
  {
    isbn: "0060256656",
    amazon_url: "http://a.co/d/givingtree",
    author: "Shel Silverstein",
    language: "english",
    pages: 64,
    publisher: "Harper & Row",
    title: "The Giving Tree",
    year: 1964
  },
  {
    isbn: "0399226907",
    amazon_url: "http://a.co/d/hungrycaterpillar",
    author: "Eric Carle",
    language: "english",
    pages: 32,
    publisher: "Philomel Books",
    title: "The Very Hungry Caterpillar",
    year: 1969
  },
  {
    isbn: "0316236446",
    amazon_url: "http://a.co/d/alligatorpurse",
    author: "Nadine Bernard Westcott",
    language: "english",
    pages: 32,
    publisher: "Little, Brown Books for Young Readers",
    title: "The Lady with the Alligator Purse",
    year: 1988
  }
];

// Specific book object for testing the update route
const updatedBookData = {
  isbn: "0691161518",
  amazon_url: "http://a.co/eobPtX2",
  author: "Matthew Lane",
  language: "english",
  pages: 264,
  publisher: "Princeton University Press",
  title: "Updated Title",
  year: 2024,
};

// Function to add sample books to the test database
async function setupSampleBooks() {
  for (let book of sampleBooks) {
    await db.query(`
      INSERT INTO books 
        (isbn, amazon_url, author, language, pages, publisher, title, year) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [book.isbn, book.amazon_url, book.author, book.language, book.pages, book.publisher, book.title, book.year]
    );
  }
}

// Before each test, setup the sample books data
beforeEach(async () => {
  await setupSampleBooks();
});


// 1. GET /books
describe("GET /books", () => {
  test("Gets a list of books", async () => {
    const response = await request(app).get("/books");
    expect(response.statusCode).toBe(200);
    expect(response.body.books).toHaveLength(4);  // We added 4 sample books
  });
});

// After each test, clean up the test database
afterEach(async () => {
  await db.query('DELETE FROM books');
});

afterAll(async () => {
  await db.end(); // close db connection
});


// 2. GET /books/:id
describe("GET /books/:id", () => {
  test("Gets a single book", async () => {
    const response = await request(app).get(`/books/${sampleBooks[0].isbn}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toHaveProperty("isbn", sampleBooks[0].isbn);
  });

  test("Responds with 404 for invalid ISBN", async () => {
    const response = await request(app).get(`/books/1234567890`);  // Invalid ISBN
    expect(response.statusCode).toBe(404);
  });
});

// 3. POST /books
describe("POST /books", () => {
  test("Creates a new book", async () => {
    const newBook = {
      isbn: "0123456789",
      amazon_url: "http://a.co/d/newbook",
      author: "Test Author",
      language: "english",
      pages: 100,
      publisher: "Test Publisher",
      title: "Test Title",
      year: 2023
    };

    const response = await request(app).post("/books").send(newBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.book).toHaveProperty("isbn", "0123456789");
  });

  test("Prevents creating book with invalid data", async () => {
    const newBook = {
      isbn: "0123456789",
      amazon_url: "http://a.co/d/newbook",
      author: "Test Author",
      pages: 100,  
      title: "Test Title",
      year: 2023
    };

    const response = await request(app).post("/books").send(newBook);
    expect(response.statusCode).toBe(400);
  });
});

// 4. PUT /books/:isbn
describe("PUT /books/:isbn", () => {
  test("Updates a single book", async () => {
    const isbnToUpdate = sampleBooks[0].isbn;
    const requestUrl = `/books/${isbnToUpdate}`;

    const response = await request(app).put(requestUrl).send(updatedBookData);

    // Check the response status code
    expect(response.statusCode).toBe(200);

    // Check that the updated book's title and year match the expected values
    expect(response.body.book.title).toBe(updatedBookData.title);
    expect(response.body.book.year).toBe(updatedBookData.year);
  })
});

// 5. DELETE /books/:isbn
describe("DELETE /books/:isbn", () => {
  test("Deletes a single book", async () => {
    const response = await request(app).delete(`/books/${sampleBooks[0].isbn}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Book deleted" });
  });

  test("Responds with 404 for deleting book with invalid ISBN", async () => {
    const response = await request(app).delete(`/books/1234567890`);  // Invalid ISBN
    expect(response.statusCode).toBe(404);
  });
});
