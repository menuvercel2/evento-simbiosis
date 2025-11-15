import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';


/**
 * Valida el formato del email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida los datos de entrada
 */
function validateRegistrationData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.full_name || data.full_name.trim().length < 3) {
    errors.push('El nombre completo debe tener al menos 3 caracteres.');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('El email no es válido.');
  }

  if (!data.institution || data.institution.trim().length < 3) {
    errors.push('La institución debe tener al menos 3 caracteres.');
  }

  if (!data.commission_id || !Number.isInteger(data.commission_id)) {
    errors.push('Debe seleccionar una comisión válida.');
  }

  if (!data.work_title || data.work_title.trim().length < 5) {
    errors.push('El título del trabajo debe tener al menos 5 caracteres.');
  }

  if (!data.work_summary || data.work_summary.trim().length < 50) {
    errors.push('El resumen del trabajo debe tener al menos 50 caracteres.');
  }

  if (data.work_summary && data.work_summary.length > 5000) {
    errors.push('El resumen del trabajo no puede exceder 5000 caracteres.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Handler principal para el registro de inscripciones
 */
export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Solo permitir solicitudes POST
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ 
      success: false,
      message: `Método ${request.method} no permitido` 
    });
  }

  try {
    // Parsear el body
    let body: any;
    
    if (typeof request.body === 'string') {
      body = JSON.parse(request.body);
    } else {
      body = request.body;
    }

    const {
      full_name,
      email,
      institution,
      phone,
      commission_id,
      work_title,
      work_summary
    } = body;

    // Validar datos
    const validation = validateRegistrationData({
      full_name,
      email,
      institution,
      phone,
      commission_id,
      work_title,
      work_summary
    });

    if (!validation.valid) {
      return response.status(400).json({ 
        success: false,
        message: 'Errores de validación',
        errors: validation.errors 
      });
    }

    // Verificar si la comisión existe
    const commissionCheck = await sql`
      SELECT id FROM commissions WHERE id = ${commission_id}
    `;

    if (commissionCheck.rows.length === 0) {
      return response.status(400).json({ 
        success: false,
        message: 'La comisión seleccionada no existe.' 
      });
    }

    // Verificar si el email ya está registrado
    const emailCheck = await sql`
      SELECT id FROM registrations WHERE email = ${email.toLowerCase()}
    `;

    if (emailCheck.rows.length > 0) {
      return response.status(409).json({ 
        success: false,
        message: 'Este email ya está registrado. Por favor, use otro email.' 
      });
    }

    // Insertar el registro en la base de datos
    const result = await sql`
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
        ${full_name.trim()}, 
        ${email.toLowerCase().trim()}, 
        ${institution.trim()}, 
        ${phone?.trim() || null}, 
        ${commission_id}, 
        ${work_title.trim()}, 
        ${work_summary.trim()}
      )
      RETURNING id, full_name, email, created_at
    `;

    const insertedRecord = result.rows[0];

    console.log('✅ Registro exitoso:', {
      id: insertedRecord.id,
      email: insertedRecord.email,
      timestamp: insertedRecord.created_at
    });

    // Enviar respuesta de éxito
    return response.status(201).json({ 
      success: true,
      message: 'Inscripción registrada con éxito.',
      data: {
        id: insertedRecord.id,
        full_name: insertedRecord.full_name,
        email: insertedRecord.email,
        created_at: insertedRecord.created_at
      }
    });

  } catch (error: any) {
    console.error('❌ Error al procesar la inscripción:', error);

    // Error de sintaxis JSON
    if (error instanceof SyntaxError) {
      return response.status(400).json({ 
        success: false,
        message: 'Cuerpo de la solicitud mal formado.' 
      });
    }

    // Error de base de datos
    if (error.code) {
      console.error('Código de error de BD:', error.code);
      
      // Violación de constraint único (email duplicado)
      if (error.code === '23505') {
        return response.status(409).json({ 
          success: false,
          message: 'Este email ya está registrado.' 
        });
      }
    }

    // Error genérico del servidor
    return response.status(500).json({ 
      success: false,
      message: 'Error interno del servidor. Por favor, intente nuevamente.' 
    });
  }
}
