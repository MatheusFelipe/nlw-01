import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('points_items', table => {
    table.increments('id').primary();
    table.integer('point_id').references('id').inTable('points').notNullable();
    table.integer('item_id').references('id').inTable('points').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists('points_items');
}
