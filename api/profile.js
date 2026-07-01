export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { username } = req.body || req.query || {};
  if (!username) return res.status(400).json({ error: "username required" });

  const API_KEY = process.env.RAPIDAPI_KEY;
  const headers = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "instagram120.p.rapidapi.com",
    "Content-Type": "application/json",
  };

  try {
    const userRes = await fetch("https://instagram120.p.rapidapi.com/api/instagram/userInfo", {
      method: "POST",
      headers,
      body: JSON.stringify({ username }),
    });

    const userData = await userRes.json();

    const user = userData?.result?.[0]?.user || userData?.data?.user || userData?.user || userData;;

    let posts = [];
    if (user && !user.is_private) {
      try {
        const postsRes = await fetch("https://instagram120.p.rapidapi.com/api/instagram/posts", {
          method: "POST",
          headers,
          body: JSON.stringify({ username }),
        });
        const postsData = await postsRes.json();
        const items = postsData?.data?.items || postsData?.items || postsData?.data || [];
        posts = Array.isArray(items) ? items : [];
      } catch (e) {}
    }

    res.status(200).json({ user, posts, raw: userData });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
  }
