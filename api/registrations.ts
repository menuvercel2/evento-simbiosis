import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    // Configurar headers de CORS
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Origin', '*');

    if (request.method !== 'GET') {
        return response.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const result = await sql`
      SELECT 
        r.id,
        r.full_name,
        r.email,
        r.institution,
        r.phone,
        c.name as commission_name,
        r.work_title,
        r.work_summary,
        r.created_at
      FROM registrations r
      LEFT JOIN commissions c ON r.commission_id = c.id
      ORDER BY r.created_at DESC
    `;

        return response.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error: any) {
        console.error('Error fetching registrations:', error);
        return response.status(500).json({
            success: false,
            message: 'Error creating listing',
            error: error.message
        });
    }
}
