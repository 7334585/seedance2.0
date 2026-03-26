import { getDatabase } from '../database/index.js';
import * as settingsService from './settingsService.js';

function normalizeSessionId(sessionId) {
  return String(sessionId || '').trim();
}

function mapAccount(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name || '',
    sessionId: row.session_id,
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listUserAccounts(userId) {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT *
    FROM jimeng_session_accounts
    WHERE user_id = ?
    ORDER BY is_default DESC, id ASC
  `).all(userId);

  return rows.map(mapAccount);
}

export function createUserAccount(userId, payload) {
  const db = getDatabase();
  const sessionId = normalizeSessionId(payload.sessionId);
  const name = String(payload.name || '').trim();

  if (!sessionId) {
    throw new Error('SessionID 不能为空');
  }

  const exists = db.prepare(`
    SELECT id FROM jimeng_session_accounts
    WHERE user_id = ? AND session_id = ?
  `).get(userId, sessionId);

  if (exists) {
    throw new Error('该 SessionID 已存在');
  }

  const hasAny = db.prepare(`
    SELECT id FROM jimeng_session_accounts
    WHERE user_id = ?
    LIMIT 1
  `).get(userId);

  const isDefault = hasAny ? 0 : 1;

  const result = db.prepare(`
    INSERT INTO jimeng_session_accounts (user_id, name, session_id, is_default, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(userId, name, sessionId, isDefault);

  return getUserAccountById(userId, Number(result.lastInsertRowid));
}

export function getUserAccountById(userId, accountId) {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT *
    FROM jimeng_session_accounts
    WHERE id = ? AND user_id = ?
  `).get(accountId, userId);

  return row ? mapAccount(row) : null;
}

export function updateUserAccount(userId, accountId, payload) {
  const db = getDatabase();
  const existing = getUserAccountById(userId, accountId);

  if (!existing) {
    throw new Error('SessionID 账号不存在');
  }

  const nextName = payload.name !== undefined ? String(payload.name || '').trim() : existing.name;
  const nextSessionId = payload.sessionId !== undefined
    ? normalizeSessionId(payload.sessionId)
    : existing.sessionId;

  if (!nextSessionId) {
    throw new Error('SessionID 不能为空');
  }

  const duplicated = db.prepare(`
    SELECT id FROM jimeng_session_accounts
    WHERE user_id = ? AND session_id = ? AND id != ?
  `).get(userId, nextSessionId, accountId);

  if (duplicated) {
    throw new Error('该 SessionID 已存在');
  }

  db.prepare(`
    UPDATE jimeng_session_accounts
    SET name = ?,
        session_id = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(nextName, nextSessionId, accountId, userId);

  return getUserAccountById(userId, accountId);
}

export function setDefaultAccount(userId, accountId) {
  const db = getDatabase();
  const existing = getUserAccountById(userId, accountId);

  if (!existing) {
    throw new Error('SessionID 账号不存在');
  }

  const transaction = db.transaction(() => {
    db.prepare(`
      UPDATE jimeng_session_accounts
      SET is_default = 0,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(userId);

    db.prepare(`
      UPDATE jimeng_session_accounts
      SET is_default = 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(accountId, userId);
  });

  transaction();
  return getUserAccountById(userId, accountId);
}

export function deleteUserAccount(userId, accountId) {
  const db = getDatabase();
  const existing = getUserAccountById(userId, accountId);

  if (!existing) {
    throw new Error('SessionID 账号不存在');
  }

  const transaction = db.transaction(() => {
    db.prepare(`
      DELETE FROM jimeng_session_accounts
      WHERE id = ? AND user_id = ?
    `).run(accountId, userId);

    if (existing.isDefault) {
      const next = db.prepare(`
        SELECT id FROM jimeng_session_accounts
        WHERE user_id = ?
        ORDER BY id ASC
        LIMIT 1
      `).get(userId);

      if (next) {
        db.prepare(`
          UPDATE jimeng_session_accounts
          SET is_default = 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(next.id);
      }
    }
  });

  transaction();
  return { success: true };
}

export async function testSessionId(sessionId) {
  const normalized = normalizeSessionId(sessionId);
  if (!normalized) {
    throw new Error('SessionID 不能为空');
  }

  return settingsService.testSessionId(normalized);
}

export function resolveEffectiveSession(userId) {
  const db = getDatabase();
  const userDefault = db.prepare(`
    SELECT *
    FROM jimeng_session_accounts
    WHERE user_id = ? AND is_default = 1
    LIMIT 1
  `).get(userId);

  if (userDefault?.session_id) {
    return {
      source: 'user_default',
      sessionId: userDefault.session_id,
      account: mapAccount(userDefault),
    };
  }

  const legacyGlobal = settingsService.getLegacyGlobalSessionId();
  if (legacyGlobal) {
    return {
      source: 'legacy_global',
      sessionId: legacyGlobal,
      account: null,
    };
  }

  const envSessionId = process.env.VITE_DEFAULT_SESSION_ID || '';
  if (envSessionId) {
    return {
      source: 'env_default',
      sessionId: envSessionId,
      account: null,
    };
  }

  return {
    source: 'none',
    sessionId: '',
    account: null,
  };
}

export default {
  listUserAccounts,
  createUserAccount,
  getUserAccountById,
  updateUserAccount,
  setDefaultAccount,
  deleteUserAccount,
  testSessionId,
  resolveEffectiveSession,
};
