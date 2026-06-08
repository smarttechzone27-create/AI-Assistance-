export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const {
      name,
      email,
      phone
    } = req.body;

    const hubspotResponse = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${process.env.HUBSPOT_SERVICE_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          properties: {
            firstname: name,
            email: email,
            phone: phone
          }
        })
      }
    );

    const data =
      await hubspotResponse.json();

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
