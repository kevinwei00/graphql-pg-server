module.exports = {
  Query: {
    messages: async (_, __, { db }) => {
      try {
        const result = await db.query({
          text: `SELECT * FROM messages`
        });
        if (result.rows && result.rowCount > 0) {
          return result.rows.map(message => {
            return {
              id: message.id,
              text: message.text
            }
          })
        }
        else {
          return [];
        }
      } catch (err) {
        return err;
      }
    },

    message: async (_, { id }, { db }) => {
      try {
        const result = await db.query({
          text: `SELECT * FROM messages WHERE id = $1`,
          values: [id]
        });
        if (result.rows[0]) {
          return {
            id: result.rows[0].id,
            text: result.rows[0].text
          }
        }
        else {
          return null;
        }
      } catch (err) {
        return err;
      }
    }
  },

  Mutation: {
    createMessage: async (_, { input }, { db }) => {
      // connect a single client for transactional integrity
      const { text, user_id } = input;
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');
        const result = await client.query({
          text: `INSERT INTO messages(text) VALUES($1) RETURNING *`,
          values: [text]
        });
        const id = result.rows[0].id;
        await client.query({
          text: `INSERT INTO users_messages(user_id, message_id) VALUES($1, $2)`,
          values: [user_id, id]
        });
        await client.query('COMMIT');
        return { id, text };
      } catch (err) {
        await client.query('ROLLBACK')
        return err;
      } finally {
        client.release();
      }
    },

    deleteMessage: async (_, { id }, { db }) => {
      // connect a single client for transactional integrity
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');
        await client.query({
          text: `DELETE FROM users_messages WHERE message_id = $1`,
          values: [id]
        });
        await client.query({
          text: `DELETE FROM messages WHERE id = $1`,
          values: [id]
        });
        await client.query('COMMIT');
        return true;
      } catch (err) {
        await client.query('ROLLBACK')
        return err;
      } finally {
        client.release();
      }
    },
  },

  Message: {
    user: async (message, _, { db }) => {
      try {
        const result = await db.query({
          text: `SELECT user_id, user_name FROM users
                 JOIN users_messages ON users.id = users_messages.user_id
                 JOIN messages ON users_messages.message_id = messages.id
                 WHERE message_id = $1`,
          values: [message.id]
        });
        if (result.rows[0]) {
          return {
            id: result.rows[0].user_id,
            user_name: result.rows[0].user_name
          }
        }
        else {
          return null;
        }
      } catch (err) {
        return err;
      }
    },
  },
};