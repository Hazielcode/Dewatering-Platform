import auditModel from '../models/auditModel.js';

class AuditService {
  /**
   * Registra una acción en el audit trail
   */
  async log(req, action, entity, entityId, oldData = null, newData = null) {
    try {
      const userId = req.user ? req.user.userId : null;
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await auditModel.createLog(userId, action, entity, entityId, oldData, newData, ipAddress);
    } catch (error) {
      console.error('[Dewatering] Falla en audit log:', error.message);
    }
  }
}

export default new AuditService();
