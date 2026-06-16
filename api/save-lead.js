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
      phone,
      source
    } = req.body;

    // SAVE TO HUBSPOT

    const hubspotResponse = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          Authorization:
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

    const hubspotData =
      await hubspotResponse.json();

    // SEND EMAIL ALERT USING RESEND

    await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Zila Leads <onboarding@resend.dev>",

          to: [
            "stechzautomation@gmail.com"
          ],

          subject:
            "🔥 New Lead Captured by Zila",

          html: `
            <h2>New Lead Captured</h2>

            <p><strong>Name:</strong> ${name}</p>

            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Phone:</strong> ${phone}</p>

            <p><strong>Source:</strong> ${source}</p>

            <hr>

            <p>
              This lead was collected
              automatically by Zila.
            </p>
          `
        })
      }
    );

    return res.status(200).json({
      success: true,
      hubspotData
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
