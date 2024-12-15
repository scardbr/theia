const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const API_URL = "https://api.webflow.com/v2/sites/67007189f88db2ea542024b5/pages";
  const API_TOKEN = process.env.WEBFLOW_API_TOKEN; // Token seguro como variable de entorno

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "accept-version": "2.0.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data); // Responder con los datos al frontend
  } catch (error) {
    console.error("Error al obtener las páginas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
