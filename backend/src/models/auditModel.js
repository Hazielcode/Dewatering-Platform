import { query } from '../config/db.js';

class AuditModel {
  async createLog(userId, action, entity, entityId, oldData, newData, ipAddress) {
    const sql = `
      INSERT INTO audit_logs (user_id, action, entity, entity_id, old_data, new_data, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const result = await query(sql, [
      userId || null,
      action,
      entity,
      entityId || null,
      oldData ? JSON.stringify(oldData) : null,
      newData ? JSON.stringify(newData) : null,
      ipAddress || null
    ]);
    return result.rows[0];
  }

  async findAll(filters = {}) {
    let sql = `
      SELECT a.*, u.email as user_email, u.full_name as user_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filters.entity) {
      sql += ` AND a.entity = $${idx++}`;
      params.push(filters.entity);
    }
    if (filters.action) {
      sql += ` AND a.action = $${idx++}`;
      params.push(filters.action);
    }
    if (filters.user_id) {
      sql += ` AND a.user_id = $${idx++}`;
      params.push(filters.user_id);
    }
    if (filters.from) {
      sql += ` AND a.created_at >= $${idx++}`;
      params.push(filters.from);
    }
    if (filters.to) {
      sql += ` AND a.created_at <= $${idx++}`;
      params.push(filters.to);
    }

    sql += ` ORDER BY a.created_at DESC LIMIT $${idx}`;
    params.push(filters.limit || 100);

    const result = await query(sql, params);
    return result.rows;
  }

  async getStats() {
    const [totalRes, byActionRes, last24hRes] = await Promise.all([
      query(`SELECT COUNT(*)::int as total FROM audit_logs;`),
      query(`SELECT action, COUNT(*)::int as count FROM audit_logs GROUP BY action ORDER BY count DESC;`),
      query(`SELECT COUNT(*)::int as count FROM audit_logs WHERE created_at >= NOW() - INTERVAL '24 hours';`)
    ]);

    return {
      total: totalRes.rows[0].total,
      byAction: byActionRes.rows,
      last24h: last24hRes.rows[0].count,
    };
  }
}

export default new AuditModel();
