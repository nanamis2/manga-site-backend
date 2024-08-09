/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const { MANGA } = require('@consumet/extensions');

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;


app.get('/manga/search/:name', async (req, res) => {
  const mangaProvider = new MANGA.Mangasee123();
  try {
    const data = await mangaProvider.search(req.params.name);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/manga/:mangaId', async (req, res) => {
  const mangaProvider = new MANGA.Mangasee123();
  try {
    const data = await mangaProvider.fetchMangaInfo(req.params.mangaId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/chapter/getPages/:chapterId', async (req, res) => {
  const mangaProvider = new MANGA.Mangasee123();
  try {
    const data = await mangaProvider.fetchChapterPages(req.params.chapterId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});