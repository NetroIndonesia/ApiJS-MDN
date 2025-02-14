# MDN Scraper API

MDN Scraper API is a simple Express-based application that retrieves content from Mozilla Developer Network (MDN) based on category or topic queries. It can also translate content to Indonesian using the Google Translate API.

---

## 🚀 Features

- **🔍 Search by Category/Topic:** Query MDN articles with category or category-topic combination.
- **🛠️ Content Extraction:** Scrape and extract relevant information from MDN pages.
- **🌐 Translation Support:** Translate scraped content to Indonesian.
- **📡 RESTful Interface:** Easy-to-use GET request interface.

---

## ⚙️ Prerequisites

- Node.js (v12+)
- npm (Node Package Manager)

---

## 🛠️ Installation

1. **Clone the Repository:**
    ```bash
    git clone <repository-url>
    ```

2. **Navigate to the Project Directory:**
    ```bash
    cd <project-directory>
    ```

3. **Install Dependencies:**
    ```bash
    npm install
    ```

---

## 🚀 Usage

### Start the Server:
```bash
node index.js
```

The server will run at: [http://localhost:5000](http://localhost:5000)

---

## 🌐 API Endpoint

### GET `/api/mdn`

Fetch content from MDN based on query parameters.

#### 🛠️ Query Parameters:

- **`q` (required)**: Query string with one of the following formats:
  - **Category** *(e.g., `javascript`)*: Fetch topics for that category.
  - **Category?Topic** *(e.g., `javascript?array`)*: Fetch specific topic content.
- **`lang` (optional)**: Language code *(default: `en`)*.
  - Use `id` for Indonesian translation.

---

### 📖 Example Requests:

#### 1️⃣ Get topics for a category:
```bash
GET http://localhost:5000/api/mdn?q=javascript
```

#### 2️⃣ Get a specific topic (with Indonesian translation):
```bash
GET http://localhost:5000/api/mdn?q=javascript?array&lang=id
```

---

## 🧩 Dependencies

- [Express](https://expressjs.com/) - Web framework for Node.js
- [Axios](https://axios-http.com/) - HTTP client for fetching content
- [Cheerio](https://cheerio.js.org/) - jQuery-like syntax for parsing HTML
- [CORS](https://www.npmjs.com/package/cors) - Cross-Origin Resource Sharing middleware
- [@vitalets/google-translate-api](https://www.npmjs.com/package/@vitalets/google-translate-api) - API for translation services

---

## ⚖️ License

This project is licensed under the MIT License.

