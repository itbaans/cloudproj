const { sql, pool, poolConnect } = require("../db2");

/**
 * Find a user by ID
 */
const findUserByUserId = async (userId) => {
  await poolConnect;
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query("SELECT username, email, joined_at FROM users WHERE id = @userId");
  return result.recordset[0];
};

/**
 * Find user by username
 */
const findUserByUsername = async (username) => {
  await poolConnect;
  const result = await pool.request()
    .input("username", sql.NVarChar(50), username)
    .query("SELECT 1 AS found FROM users WHERE username = @username");
  return result.recordset[0];
};

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
  await poolConnect;
  const result = await pool.request()
    .input("email", sql.NVarChar(100), email)
    .query("SELECT 1 AS found FROM users WHERE email = @email");
  return result.recordset[0];
};

/**
 * Find user by username OR email
 */
const findUserByUsernameOrEmail = async (usernameOrEmail) => {
  await poolConnect;
  const result = await pool.request()
    .input("usernameOrEmail", sql.NVarChar(100), usernameOrEmail)
    .query("SELECT * FROM users WHERE username = @usernameOrEmail OR email = @usernameOrEmail");
  return result.recordset[0];
};

/**
 * Create a new user
 * Returns id, username, email
 */
const createUser = async (username, email, hashedPassword, token) => {
  await poolConnect;
  const result = await pool.request()
    .input("username", sql.NVarChar(50), username)
    .input("email", sql.NVarChar(100), email)
    .input("password_hash", sql.NVarChar(sql.MAX), hashedPassword)
    .input("verification_token", sql.NVarChar(255), token)
    .query(`
      INSERT INTO users (username, email, password_hash, verification_token)
      OUTPUT inserted.id, inserted.username, inserted.email
      VALUES (@username, @email, @password_hash, @verification_token)
    `);
  return result.recordset[0];
};

/**
 * Find user by verification token
 */
const findUserByVerificationToken = async (token) => {
  await poolConnect;
  const result = await pool.request()
    .input("token", sql.NVarChar(255), token)
    .query("SELECT * FROM users WHERE verification_token = @token");
  return result.recordset[0];
};

/**
 * Mark user as verified
 */
const markUserAsVerified = async (userId) => {
  await poolConnect;
  await pool.request()
    .input("userId", sql.Int, userId)
    .query("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = @userId");
};

/**
 * Update last login timestamp
 */
const updateLastLogin = async (userId) => {
  await poolConnect;
  await pool.request()
    .input("userId", sql.Int, userId)
    .query("UPDATE users SET last_login = SYSDATETIME() WHERE id = @userId");
};

/**
 * Save graph metadata for user (cached graph structure)
 */
const saveGraphMetadata = async (userId, graphData) => {
  await poolConnect;
  const graphJson = JSON.stringify(graphData);
  await pool.request()
    .input("userId", sql.Int, userId)
    .input("graphData", sql.NVarChar(sql.MAX), graphJson)
    .query("UPDATE users SET graph_meta_data = @graphData WHERE id = @userId");
};

/**
 * Get cached graph metadata for user
 */
const getGraphMetadata = async (userId) => {
  await poolConnect;
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query("SELECT graph_meta_data FROM users WHERE id = @userId");

  const metadata = result.recordset[0]?.graph_meta_data;
  return metadata ? JSON.parse(metadata) : null;
};

/**
 * Clear graph metadata (invalidate cache)
 */
const clearGraphMetadata = async (userId) => {
  await poolConnect;
  await pool.request()
    .input("userId", sql.Int, userId)
    .query("UPDATE users SET graph_meta_data = NULL WHERE id = @userId");
};

module.exports = {
  findUserByUserId,
  findUserByUsername,
  findUserByEmail,
  findUserByUsernameOrEmail,
  findUserByVerificationToken,
  createUser,
  updateLastLogin,
  markUserAsVerified,
  saveGraphMetadata,
  getGraphMetadata,
  clearGraphMetadata,
};
