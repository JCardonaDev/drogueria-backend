const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { sintomas, productos } = req.body;

  if (!sintomas || !productos) {
    return res.status(400).json({ 
      error: 'Faltan parámetros: sintomas y productos' 
    });
  }

  try {
    // Llamar a la API de Claude
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Eres un asistente farmacéutico experto. Un paciente presenta los siguientes síntomas:

"${sintomas}"

Tenemos estos productos disponibles en la droguería:
${JSON.stringify(productos, null, 2)}

Por favor:
1. Analiza los síntomas descritos
2. Recomienda SOLO los productos de nuestra lista que sean más apropiados
3. Explica brevemente por qué cada producto es útil para estos síntomas
4. Ordena por prioridad (más importante primero)

Responde ÚNICAMENTE en formato JSON así:
{
  "diagnostico_preliminar": "breve descripción",
  "recomendaciones": [
    {
      "producto": "nombre exacto del producto",
      "razon": "por qué es útil",
      "prioridad": "alta/media/baja"
    }
  ],
  "advertencia": "si debe consultar médico"
}

No incluyas markdown, solo el JSON.`
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const textoRespuesta = response.data.content[0].text.trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '');
    
    const resultado = JSON.parse(textoRespuesta);

    res.json(resultado);

  } catch (error) {
    console.error('Error al consultar IA:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Error al procesar la consulta',
      details: error.message 
    });
  }
});

module.exports = router;