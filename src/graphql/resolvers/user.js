module.exports =  {
  Query: {
    users: async (_, __, { db }) => {
      try {
        const result = await db.query({
          text: `SELECT * FROM users`
        });
        if (result.rows && result.rowCount > 0) {
          return result.rows.map(user => {
            return {
              id: user.id,
              user_name: user.user_name
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

    user: async (_, { id }, { db }) => {
      try {
        const result = await db.query({
          text: `SELECT * FROM users WHERE id = $1`,
          values: [id]
        });
        if (result.rows[0]) {
          return {
            id: result.rows[0].id,
            user_name: result.rows[0].user_name
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

  User: {
    // messages: (user, args, { models }) => {
    //   return Object.values(models.messages).filter(
    //     message => message.userId === user.id,
    //   );
    // },
  },
};