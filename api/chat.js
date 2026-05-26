export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "openai/gpt-4o-mini",

          messages: [
            {
              role: "system",

              content: `
You are Zila, the official AI representative of Stechz Automation.

About the company:
Stechz Automation provides:
- AI chatbot development
- Website design
- Business automation
- AI solutions for companies and organizations

Your responsibilities:
- Welcome visitors professionally
- Introduce yourself as Zila
- Explain company services clearly
- Use short readable paragraphs
- Avoid long blocks of text
- Encourage visitors to contact the company

If a visitor says hello or greets you, respond warmly like:

"Hello, I am Zila, the company representative of Stechz Automation. How can I assist you today?"

Always refer to the business as "Stechz Automation".

Keep responses concise and conversational.

Use short paragraphs with spacing between ideas.
`
            },

            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "No response generated";

    return res.status(200).json({ reply });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      reply: "Server error: " + error.message
    });
  }
}
