/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const { MANGA, ANIME } = require('@consumet/extensions');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use('/proxy', createProxyMiddleware({
  target: 'https://ec.netmagcdn.com:2228',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy/hls-playback': '/hls-playback',
    '^/proxy/subtitle': '/subtitle',
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Origin', 'https://ec.netmagcdn.com:2228');
  },
}));

app.use('/proxy-subtitle', createProxyMiddleware({
  target: 'https://s.megastatics.com',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy-subtitle': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Origin', 'https://s.megastatics.com');
  },
}));


app.get('/anime/search/:name', async (req, res) => {
  const animeProvider = new ANIME.Zoro();
  try {
    const data = await animeProvider.search(req.params.name);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/anime/getanimeinfo/:animeId', async (req, res) => {
  const animeProvider = new ANIME.Zoro();
  try {
    const data = await animeProvider.fetchAnimeInfo(req.params.animeId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/anime/getepisodeinfo/:episodeId', async (req, res) => {
  const animeProvider = new ANIME.Zoro();
  try {
    const data = await animeProvider.fetchEpisodeSources(req.params.episodeId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/anime/getrecentlyadded', async (req, res) => {
  const animeProvider = new ANIME.Zoro();
  try {
    const data = await animeProvider.fetchRecentlyAdded();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/anime/getmostfavorite', async (req, res) => {
  const animeProvider = new ANIME.Zoro();
  try {
    const data = await animeProvider.fetchMostFavorite();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



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