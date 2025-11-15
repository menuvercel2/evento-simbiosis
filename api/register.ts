//src/api/register.ts

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
  console.log('🚀 === INICIO DE PETICIÓN DE REGISTRO ===');
  console.log('📋 Método:', request.method);
  console.log('🌐 URL:', request.url);

  // Solo permitir solicitudes POST
  if (request.method !== 'POST') {
    console.log('❌ Método no permitido:', request.method);
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({
      success: false,
      message: `Método ${request.method} no permitido`
    });
  }

  try {
    console.log('📦 Body recibido (tipo):', typeof request.body);
    console.log('📦 Body recibido (contenido):', JSON.stringify(request.body, null, 2));

    // Parsear el body
    let body: any;

    if (typeof request.body === 'string') {
      console.log('🔄 Parseando body como string...');
      body = JSON.parse(request.body);
    } else {
      console.log('✅ Body ya es objeto');
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

    console.log('📝 Datos extraídos:', {
      full_name,
      email,
      institution,
      phone,
      commission_id,
      work_title: work_title?.substring(0, 50),
      work_summary: work_summary?.substring(0, 50) + '...'
    });

    // Validar datos
    console.log('🔍 Iniciando validación...');
    const validation = validateRegistrationData({
      full_name,
      email,
      institution,
      phone,
      commission_id,
      work_title,
      work_summary
    });

    console.log('✔️ Resultado de validación:', validation);

    if (!validation.valid) {
      console.log('❌ Validación fallida:', validation.errors);
      return response.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: validation.errors
      });
    }

    // Verificar si la comisión existe
    console.log('🔍 Verificando comisión con ID:', commission_id);
    const commissionCheck = await sql`
      SELECT id FROM commissions WHERE id = ${commission_id}
    `;
    console.log('📊 Resultado de comisión:', commissionCheck.rows);

    if (commissionCheck.rows.length === 0) {
      console.log('❌ Comisión no encontrada');
      return response.status(400).json({
        success: false,
        message: 'La comisión seleccionada no existe.'
      });
    }

    // Verificar si el email ya está registrado
    console.log('🔍 Verificando email duplicado:', email.toLowerCase());
    const emailCheck = await sql`
      SELECT id FROM registrations WHERE email = ${email.toLowerCase()}
    `;
    console.log('📊 Resultado de email check:', emailCheck.rows);

    if (emailCheck.rows.length > 0) {
      console.log('❌ Email ya registrado');
      return response.status(409).json({
        success: false,
        message: 'Este email ya está registrado. Por favor, use otro email.'
      });
    }

    // Insertar el registro en la base de datos
    console.log('💾 Insertando registro en la base de datos...');
    console.log('💾 Datos a insertar:', {
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      institution: institution.trim(),
      phone: phone?.trim() || null,
      commission_id,
      work_title: work_title.trim(),
      work_summary_length: work_summary.trim().length
    });

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

    console.log('✅ Resultado del INSERT:', result.rows);

    const insertedRecord = result.rows[0];

    console.log('✅ Registro exitoso:', {
      id: insertedRecord.id,
      email: insertedRecord.email,
      timestamp: insertedRecord.created_at
    });

    // Enviar respuesta de éxito
    console.log('📤 Enviando respuesta de éxito');
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
    console.error('❌❌❌ ERROR CAPTURADO ❌❌❌');
    console.error('Tipo de error:', error.constructor.name);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    console.error('Error completo:', JSON.stringify(error, null, 2));

    if (error.code) {
      console.error('🔴 Código de error de BD:', error.code);
      console.error('🔴 Detalle:', error.detail);
      console.error('🔴 Hint:', error.hint);
    }

    // Error de sintaxis JSON
    if (error instanceof SyntaxError) {
      console.log('❌ Error de sintaxis JSON');
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
        console.log('❌ Violación de constraint único');
        return response.status(409).json({
          success: false,
          message: 'Este email ya está registrado.'
        });
      }
    }

    // Error genérico del servidor
    console.log('❌ Retornando error 500 genérico');
    return response.status(500).json({
      success: false,
      message: 'Error interno del servidor. Por favor, intente nuevamente.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    console.log('🏁 === FIN DE PETICIÓN DE REGISTRO ===\n');
  }
}
