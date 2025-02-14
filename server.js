const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const { translate } = require("@vitalets/google-translate-api");

const app = express();
app.use(cors());

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateContent(text, targetLang = "id", attempt = 0) {
  try {
    const res = await translate(text, { to: targetLang });
    return res.text;
  } catch (error) {
    console.error("Translation error:", error);
    if (error.name === "TooManyRequestsError" && attempt < 3) {
      await sleep(1000 * (attempt + 1));
      return await translateContent(text, targetLang, attempt + 1);
    }
    return text;
  }
}

async function translateTopic(topic, targetLang = "id") {
  const translatedTopic = { ...topic };
  translatedTopic.title = await translateContent(topic.title, targetLang);
  translatedTopic.summary = await translateContent(topic.summary, targetLang);
  translatedTopic.content = [];
  for (let text of topic.content) {
    const translatedText = await translateContent(text, targetLang);
    translatedTopic.content.push(translatedText);
    await sleep(200);
  }
  return translatedTopic;
}

async function getMDNContent(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let container = $("main#content");
    if (!container.length) container = $("#content");
    if (!container.length) container = $(".main-page-content");
    if (!container.length) container = $("body");
    const contentArray = [];
    container.find("p, h1, h2, h3, pre").each((i, el) => {
      let text = $(el).text().trim();
      let cleanedText = text.replace(/<\/?[^>]+(>|$)/g, "").trim();
      if (!cleanedText || cleanedText.length < 30) return;
      if (/Previous|Next|See also|Help improve MDN/i.test(cleanedText)) return;
      if (cleanedText.startsWith("<") && cleanedText.endsWith(">")) return;
      if (/body\s*\{/.test(cleanedText) ||
          /header\s*\{/.test(cleanedText) ||
          /section\s*\{/.test(cleanedText) ||
          /article\s*\{/.test(cleanedText) ||
          /button\s*\{/.test(cleanedText)) return;
      contentArray.push(cleanedText);
    });
    return contentArray.length
      ? contentArray
      : ["Konten tidak ditemukan atau struktur halaman berubah."];
  } catch (error) {
    console.error("Error fetching MDN content:", error.message);
    return ["Failed to fetch content from MDN."];
  }
}

app.get("/api/mdn", async (req, res) => {
  const langParam = req.query.lang ? req.query.lang.toLowerCase() : "en";
  const locale = "en-US";
  const isEnglish = langParam !== "id";
  let query = req.query.q;
  if (!query) {
    return res.status(400).json({
      error: isEnglish
        ? "Query cannot be empty. Format: category?topic"
        : "Query tidak boleh kosong. Format: kategori?topik",
    });
  }
  query = decodeURIComponent(query);
  if (query.indexOf("?") === -1) {
    const category = query.trim().toLowerCase();
    try {
      const searchUrl = `https://developer.mozilla.org/api/v1/search?q=${category}&locale=${locale}`;
      const { data } = await axios.get(searchUrl);
      const documents = data.documents.filter((doc) =>
        doc.mdn_url.toLowerCase().includes(`/${category}/`)
      );
      if (!documents.length) {
        return res.status(404).json({
          error: isEnglish
            ? "Category not found on MDN."
            : "Kategori tidak ditemukan di MDN.",
        });
      }
      let topics = await Promise.all(
        documents.map(async (doc) => {
          const fullUrl = `https://developer.mozilla.org${doc.mdn_url}`;
          const content = await getMDNContent(fullUrl);
          return {
            title: doc.title,
            summary: doc.summary,
            content: content,
          };
        })
      );
      if (!isEnglish) {
        topics = await Promise.all(
          topics.map(async (topic) => {
            return await translateTopic(topic, "id");
          })
        );
      }
      return res.json({
        message: isEnglish
          ? `List of topics for category ${category}`
          : `Daftar topik untuk kategori ${category}`,
        topics: topics,
      });
    } catch (error) {
      console.error("Error searching MDN:", error.message);
      return res.status(500).json({
        error: isEnglish
          ? "An error occurred on the server while searching for the category."
          : "Terjadi kesalahan pada server saat mencari kategori.",
      });
    }
  } else {
    let [category, keyword] = query.split("?");
    if (!category || !keyword) {
      return res.status(400).json({
        error: isEnglish
          ? "Invalid query format. Use: category?topic"
          : "Format query salah. Gunakan format: kategori?topik",
      });
    }
    keyword = keyword.replace(/^["']|["']$/g, "").trim();
    category = category.trim().toLowerCase();
    try {
      const searchUrl = `https://developer.mozilla.org/api/v1/search?q=${keyword}&locale=${locale}`;
      const { data } = await axios.get(searchUrl);
      const documents = data.documents;
      const matchedDoc = documents.find(
        (doc) =>
          doc.mdn_url.toLowerCase().includes(`/${category}/`) ||
          doc.mdn_url.toLowerCase().includes(keyword.toLowerCase())
      );
      if (!matchedDoc) {
        return res.status(404).json({
          error: isEnglish
            ? "Topic not found on MDN."
            : "Topik tidak ditemukan di MDN.",
        });
      }
      const fullUrl = `https://developer.mozilla.org${matchedDoc.mdn_url}`;
      const content = await getMDNContent(fullUrl);
      let topicObj = {
        title: matchedDoc.title,
        summary: matchedDoc.summary,
        content: content,
      };
      if (!isEnglish) {
        topicObj = await translateTopic(topicObj, "id");
      }
      return res.json(topicObj);
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        error: isEnglish
          ? "An error occurred on the server."
          : "Terjadi kesalahan pada server.",
      });
    }
  }
});

app.listen(5000, () => {
  console.log("Server berjalan di http://localhost:5000");
});
