/*
* Ferney Duran 10/2025
*/

/**
 * Realiza una petición HTTP POST al endpoint indicado.
 * Serializa la respuesta como JSON y retorna un objeto de resultado estandarizado.
 * @param {string} url - URL completa del endpoint destino.
 * @param {string} body - Cuerpo de la petición serializado como JSON string.
 * @param {object} [headers={}] - Cabeceras adicionales (p. ej. Authorization Bearer).
 * @returns {Promise<{success: boolean, data?: any, error?: string}>} Resultado de la operación.
 */
const apiPost = async (url, body = {}, headers = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'User-Agent': 'ReactNative',
        'Accept': 'application/json',
        ...headers, // Puedes enviar tokens u otras cabeceras personalizadas
      },
      body:body, 
    });
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`La respuesta del servidor no es un JSON válido.`);
    }

    return { success: true, data };

  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default apiPost;