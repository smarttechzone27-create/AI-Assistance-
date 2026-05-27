export default async function handler(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS
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

    const { message, messages } = req.body;

const conversationMessages =
  messages ||
  [
    {
      role: "user",
      content: message
    }
  ];

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

          ...conversationMessages [

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
- Explain company services clearly
- Use short readable paragraphs
- Avoid long blocks of text
- Encourage visitors to contact the company

Do not repeatedly introduce yourself in every response.

Only introduce yourself if the visitor asks who you are or during the first greeting.

Always refer to the business as "Stechz Automation".

Keep responses concise and conversational.

Use short paragraphs with spacing between ideas.
`
            },

            ...messages
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "No response generated";

    return res.status(200).json({
      reply
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      reply: "Server error: " + error.message
    });
  }
}
