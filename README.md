

```markdown
# MDN Scraper API

A simple Express API that fetches content from MDN (Mozilla Developer Network) based on category and topic queries. Optionally, it translates the content to Indonesian using the Google Translate API.

## Features

- Search MDN articles by category and/or topic.
- Scrape and extract relevant content from MDN pages.
- Option to translate content to Indonesian.
- Simple RESTful API endpoint.

## Prerequisites

- Node.js (version 12 or higher)
- npm

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

Start the server:

```bash
node index.js
```

The server will run on [http://localhost:5000](http://localhost:5000).

### API Endpoint

#### GET /api/mdn

Fetch MDN content based on query parameters.

**Query Parameters:**

- `q` (required): The query string in one of two formats:
  - `category` (e.g., `javascript`) to fetch a list of topics for that category.
  - `category?topic` (e.g., `javascript?array`) to fetch a specific topic.
- `lang` (optional): Language code. Use `id` for Indonesian. Defaults to English.

**Examples:**

- Get topics for a category:

  ```
  GET http://localhost:5000/api/mdn?q=javascript
  ```

- Get a specific topic with translation to Indonesian:

  ```
  GET http://localhost:5000/api/mdn?q=javascript?array&lang=id
  ```

## Dependencies

- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Cheerio](https://cheerio.js.org/)
- [CORS](https://www.npmjs.com/package/cors)
- [@vitalets/google-translate-api](https://www.npmjs.com/package/@vitalets/google-translate-api)

## License

This project is licensed under the MIT License.
```
