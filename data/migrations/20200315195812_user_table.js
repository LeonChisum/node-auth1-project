
exports.up = function(knex) {
  return knex.schema.createTable('users', user => {
      user.increments()
      user.text('username').unique().notNullable();
      user.text('password').unique().notNullable()
  })
  
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users')
};
