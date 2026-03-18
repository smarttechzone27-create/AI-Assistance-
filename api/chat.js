export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  // If no message provided, return 400
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Add CORS header so Carrd can call this API
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Simulate AI reply by echoing the user message
    const reply = `You said: ${message}`;

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
