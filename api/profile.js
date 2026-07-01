export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: "username required" });

  const API_KEY = process.env.RAPIDAPI_KEY;
  const headers = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "instagram120.p.rapidapi.com",
    "Content-Type": "application/json",
  };

  try {
    const [userRes, postsRes] = await Promise.all([
      fetch("https://instagram120.p.rapidapi.com/api/instagram/userInfo", {
        method: "POST", headers, body: JSON.stringify({ username }),
      }),
      fetch("https://instagram120.p.rapidapi.com/api/instagram/posts", {
        method: "POST", headers, body: JSON.stringify({ username }),
      }),
    ]);

    const userData = await userRes.json();
    const postsData = await postsRes.json();

    const user = userData?.data?.user || userData?.user || userData?.data || userData;
    const items = postsData?.data?.items || postsData?.items || postsData?.data || [];

    res.status(200).json({ user, posts: Array.isArray(items) ? items : [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
