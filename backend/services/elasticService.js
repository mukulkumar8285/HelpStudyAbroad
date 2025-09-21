require("dotenv").config();
const { Client } = require("@elastic/elasticsearch");
const { get, set } = require("./cacheService");

const es = new Client({
  node: process.env.ES_URL || "http://127.0.0.1:9200",
  headers: {
    Accept: "application/vnd.elasticsearch+json; compatible-with=8",
  },
});

async function testConnection() {
  try {
    const info = await es.info();
    console.log("Elasticsearch connected:", info.body.cluster_name);
  } catch (err) {
    console.error("Elasticsearch connection error:", err);
  }
}
testConnection();

const bulkIndex = async (courses) => {
  if (!courses || courses.length === 0) return;

  const body = courses.flatMap((c) => [
    { index: { _index: "courses", _id: c._id.toString() } },
    c,
  ]);

  try {
    const { body: bulkResponse } = await es.bulk({ refresh: true, body });
    if (bulkResponse.errors) {
      console.error("Bulk indexing had errors:", bulkResponse.items);
    } else {
      console.log(`Indexed ${courses.length} courses successfully.`);
    }
  } catch (err) {
    console.error("Elasticsearch bulk indexing error:", err);
  }
};

const search = async ({ q, category, instructor }) => {
  const cacheKey = `search:${q || ""}:${category || ""}:${instructor || ""}`;

  const cached = await get(cacheKey);
  if (cached) return JSON.parse(cached);

  const must = [];
  if (q)
    must.push({ multi_match: { query: q, fields: ["title", "description"] } });
  if (category) must.push({ match: { category } });
  if (instructor) must.push({ match: { instructor } });

  try {
    const { body } = await es.search({
      index: "courses",
      query: { bool: { must } },
    });

    const results = (body.hits?.hits || []).map((h) => h._source);

    await set(cacheKey, JSON.stringify(results), 60);

    return results;
  } catch (err) {
    console.error("Elasticsearch search error:", err);
    return [];
  }
};

module.exports = { es, bulkIndex, search };
