const recommendation = async (req, res) => {
  const { topics, skillLevel } = req.body;

  try {
    // ===== Placeholder for Gemini API call =====
    // Replace this with a real API request when available
    // Example:
    // const response = await axios.post("https://gemini.ai/recommend", {
    //   topics,
    //   skillLevel,
    //   apiKey: process.env.GEMINI_API_KEY
    // });

    // Mock response
    const mockRecommendations = [
      {
        title: "Introduction to JavaScript",
        topic: "JavaScript",
        skillLevel: "Beginner",
        link: "https://example.com/course/javascript",
      },
      {
        title: "Advanced React Techniques",
        topic: "React",
        skillLevel: "Advanced",
        link: "https://example.com/course/react",
      },
      {
        title: "Data Structures in Python",
        topic: "Python",
        skillLevel: "Intermediate",
        link: "https://example.com/course/python",
      },
    ];

    // Filter mock data based on input (optional)
    const filteredRecommendations = mockRecommendations.filter(
      (course) =>
        (!topics || topics.includes(course.topic)) &&
        (!skillLevel || course.skillLevel === skillLevel)
    );

    res.json({ recommendations: filteredRecommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get recommendations" });
  }
};

module.exports = { recommendation };
