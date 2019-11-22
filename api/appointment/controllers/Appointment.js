"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Retrieve records.
   * @return {Array}
   */
  async find(ctx) {
    const { organization } = ctx.state.user;

    ctx.query = {
      ...ctx.query,
      organization: organization.id,
    };

    const entities = await strapi.services.appointment.find(ctx.query);

    return entities.map(entity =>
      sanitizeEntity(entity, { model: strapi.models.appointment }),
    );
  },

  /**
   * Retrieve a record.
   * @return {Object}
   */

  async findOne(ctx) {
    const appointment = await strapi.services.appointment.findOne(ctx.params);
    // Ensure that the appointment belongs to the user's organization
    const organization = ctx.state.user.organization.id;

    if (
      appointment &&
      (!appointment.organization ||
        appointment.organization.id !== organization)
    ) {
      return ctx.unauthorized("You are not allowed to perform this action.");
    }
    return sanitizeEntity(appointment, { model: strapi.models.appointment });
  },

  /**
   * Count records.
   * @return {Number}
   */
  count(ctx) {
    const { organization } = ctx.state.user;

    ctx.query = {
      ...ctx.query,
      organization: organization.id,
    };

    return strapi.services.appointment.count(ctx.query);
  },

  /**
   * Create a record.
   *
   * @return {Object}
   */
  async create(ctx) {
    const organization = ctx.state.user.organization.id;
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.appointment.create(
        { ...data, organization },
        { files },
      );
    } else {
      entity = await strapi.services.appointment.create({
        ...ctx.request.body,
        organization,
      });
    }
    return sanitizeEntity(entity, { model: strapi.models.appointment });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */
  async update(ctx) {
    const appointment = await strapi.services.appointment.findOne(ctx.params);
    // Ensure that the appointment belongs to the user's organization
    const organization = ctx.state.user.organization.id;

    if (
      appointment &&
      (!appointment.organization ||
        appointment.organization.id !== organization)
    ) {
      return ctx.unauthorized("You are not allowed to perform this action.");
    }

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.appointment.update(ctx.params, data, {
        files,
      });
    } else {
      entity = await strapi.services.appointment.update(
        ctx.params,
        ctx.request.body,
      );
    }

    return sanitizeEntity(entity, { model: strapi.models.appointment });
  },

  /**
   * Delete a record.
   *
   * @return {Object}
   */
  async delete(ctx) {
    const appointment = await strapi.services.appointment.findOne(ctx.params);
    // Ensure that the appointment belongs to the user's organization
    const organization = ctx.state.user.organization.id;

    if (
      appointment &&
      (!appointment.organization ||
        appointment.organization.id !== organization)
    ) {
      return ctx.unauthorized("You are not allowed to perform this action.");
    }

    const entity = await strapi.services.appointment.delete(ctx.params);
    return sanitizeEntity(entity, { model: strapi.models.appointment });
  },
};
