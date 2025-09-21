require("dotenv").config();
const { Client } = require("@elastic/elasticsearch");
const { get, set } = require("./cacheService");

const es = new Client({
  node: "http://172.25.33.154:9200",
  // headers: {
  //   Accept: "application/vnd.elasticsearch+json; compatible-with=8",
  // },
});

async function testConnection() {
  try {
    const info = await es.info();
    console.log("Elasticsearch connected:", info.cluster_name);
  } catch (err) {
    console.error("Elasticsearch connection error:", err);
  }
}
testConnection();

const bulkIndex = async (courses) => {
  if (!courses || courses.length === 0) return;

  const body = courses.flatMap((c) => [
    { index: { _index: "courses", _id: c._id.toString() } },
    {
      Program_Name: c.Program_Name,
      University: c.University,
      Description: c.Description,
      Level: c.Level,
      Duration_Months: c.Duration_Months,
      Language: c.Language,
      Cost_USD_Per_Year: c.Cost_USD_Per_Year,
      Application_Deadline: c.Application_Deadline,
      Program_Type: c.Program_Type,
      Subject_Area: c.Subject_Area,
    },
  ]);

  try {
    const bulkResponse = await es.bulk({ refresh: true, body });
    const items = bulkResponse.body?.items || [];

    if (bulkResponse.body?.errors) {
      console.error("Bulk indexing had errors:");
      items.forEach((item) => {
        if (item.index && item.index.error) {
          console.error(item.index._id, item.index.error);
        }
      });
    } else {
      console.log(`Indexed ${courses.length} courses successfully.`);
    }
  } catch (err) {
    console.error("Elasticsearch bulk indexing error:", err);
  }
};

const search = async ({
  Program_Name,
  University,
  Description,
  Level,
  Program_Type,
  Subject_Area,
}) => {
  const must = [];

  if (Program_Name) must.push({ match: { Program_Name } });
  if (University) must.push({ match: { University } });
  if (Description) must.push({ match: { Description } });
  if (Level) must.push({ match: { Level } });
  if (Program_Type) must.push({ match: { Program_Type } });
  if (Subject_Area) must.push({ match: { Subject_Area } });

  try {
    const result = await es.search({
      index: "courses",
      query: { bool: { must } },
    });

    const hits = result.hits?.hits || [];
    return hits.map((h) => h._source);
  } catch (err) {
    console.error("Elasticsearch search error:", err.meta?.body || err);
    return [];
  }
};

module.exports = { search };

module.exports = { es, bulkIndex, search };
