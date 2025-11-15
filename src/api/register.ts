
// Este archivo actuaría como una Función Serverless de Vercel.
// En un proyecto real, se instalarían tipos como `@vercel/node`.
// import type { VercelRequest, VercelResponse } from '@vercel/node';

// La lógica de la base de datos usaría un cliente como `@vercel/postgres`.
// import { sql } from '@vercel/postgres';

/**
 * @param {object} request - El objeto de solicitud entrante.
 * @param {object} response - El objeto de respuesta del servidor.
 */
export default async function handler(request, response) {
  // Solo permitir solicitudes POST
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ message: `Method ${request.method} Not Allowed` });
  }

  try {
    const {
      full_name,
      email,
      institution,
      phone,
      commission_id,
      work_title,
      work_summary
    } = JSON.parse(request.body);

    // Validación básica en el lado del servidor
    if (!full_name || !email || !institution || !commission_id || !work_title || !work_summary) {
      return response.status(400).json({ message: 'Faltan campos obligatorios en la solicitud.' });
    }

    // --- LÓGICA DE LA BASE DE DATOS IRÍA AQUÍ ---
    // Este es un ejemplo conceptual de cómo se vería con @vercel/postgres.
    // Para que esto funcione, la base de datos debe estar conectada al proyecto de Vercel.
    /*
    await sql`
      INSERT INTO registrations (
        full_name, 
        email, 
        institution, 
        phone, 
        commission_id, 
        work_title, 
        work_summary
      )
      VALUES (
        ${full_name}, 
        ${email}, 
        ${institution}, 
        ${phone}, 
        ${commission_id}, 
        ${work_title}, 
        ${work_summary}
      );
    `;
    */
    
    // Simulación: Imprimir en la consola del servidor para depuración
    console.log('Datos recibidos para insertar en la base de datos:', {
      full_name, email, institution, phone, commission_id, work_title, work_summary
    });

    // Enviar una respuesta de éxito
    return response.status(201).json({ message: 'Inscripción registrada con éxito.' });

  } catch (error) {
    console.error('Error al procesar la inscripción:', error);
    // Asegúrate de parsear el body si es un string
    if (error instanceof SyntaxError) {
        return response.status(400).json({ message: 'Cuerpo de la solicitud mal formado.' });
    }
    return response.status(500).json({ message: 'Error interno del servidor.' });
  }
}
