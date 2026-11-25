const { getDb } = require("./_firebase");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const db = getDb();

  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // Start of week (Monday)
    const d = new Date(now);
    const day = d.getDay();
    const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(d.setDate(diffToMon));
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Query Cards Count
    const cardsSnap = await db.collection("cards").get();
    let totalCards = 0;
    let activeCards = 0;
    let inactiveCards = 0;

    cardsSnap.forEach(doc => {
      totalCards++;
      const data = doc.data();
      if (data.active === true) {
        activeCards++;
      } else {
        inactiveCards++;
      }
    });

    // 2. Query Events
    const eventsSnap = await db.collection("events").get();
    let tapsToday = 0;
    let tapsThisWeek = 0;
    let tapsThisMonth = 0;
    let tapsAllTime = 0;
    let redirectsToday = 0;
    let redirectsThisWeek = 0;
    let redirectsThisMonth = 0;
    let redirectsAllTime = 0;

    const dailyMap = {};
    for (let i = 6; i >= 0; i--) {
      const past = new Date();
      past.setDate(past.getDate() - i);
      const k = past.toISOString().split("T")[0];
      dailyMap[k] = { date: k, taps: 0, redirects: 0 };
    }

    eventsSnap.forEach(doc => {
      const data = doc.data();
      const type = data.eventType;
      const ts = new Date(data.timestamp);
      const dateStr = data.date || ts.toISOString().split("T")[0];

      const isTap = type === "tap";
      const isRedirect = type === "redirect";

      if (isTap) tapsAllTime++;
      if (isRedirect) redirectsAllTime++;

      if (dailyMap[dateStr]) {
        if (isTap) dailyMap[dateStr].taps++;
        if (isRedirect) dailyMap[dateStr].redirects++;
      }

      if (dateStr === todayStr) {
        if (isTap) tapsToday++;
        if (isRedirect) redirectsToday++;
      }
      if (ts >= startOfWeek) {
        if (isTap) tapsThisWeek++;
        if (isRedirect) redirectsThisWeek++;
      }
      if (ts >= startOfMonth) {
        if (isTap) tapsThisMonth++;
        if (isRedirect) redirectsThisMonth++;
      }
    });

    return res.json({
      success: true,
      cards: {
        total: totalCards,
        active: activeCards,
        inactive: inactiveCards
      },
      events: {
        tapsToday,
        tapsThisWeek,
        tapsThisMonth,
        tapsAllTime,
        redirectsToday,
        redirectsThisWeek,
        redirectsThisMonth,
        redirectsAllTime,
        dailyChart: Object.values(dailyMap)
      }
    });
  } catch (err) {
    console.error("Error in api/stats:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
