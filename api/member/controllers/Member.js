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

    const entities = await strapi.services.member.find(ctx.query);

    return entities.map(entity =>
      sanitizeEntity(entity, { model: strapi.models.member }),
    );
  },

  /**
   * Retrieve a record.
   * @return {Object}
   */

  async findOne(ctx) {
    const member = await strapi.services.member.findOne(ctx.params);
    // Ensure that the member belongs to the user's organization
    const organization = ctx.state.user.organization.id;

    if (
      member &&
      (!member.organization || member.organization.id !== organization)
    ) {
      return ctx.unauthorized("You are not allowed to perform this action.");
    }
    return sanitizeEntity(member, { model: strapi.models.member });
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

    return strapi.services.member.count(ctx.query);
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
      entity = await strapi.services.member.create(
        { ...data, organization },
        { files },
      );
    } else {
      entity = await strapi.services.member.create({
        ...ctx.request.body,
        organization,
      });
    }
    return sanitizeEntity(entity, { model: strapi.models.member });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */
  async update(ctx) {
    const member = await strapi.services.member.findOne(ctx.params);
    // Ensure that the member belongs to the user's organization
    const organization = ctx.state.user.organization.id;

    if (
      member &&
      (!member.organization || member.organization.id !== organization)
    ) {
      return ctx.unauthorized("You are not allowed to perform this action.");
    }

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.member.update(ctx.params, data, {
        files,
      });
    } else {
      entity = await strapi.services.member.update(
        ctx.params,
        ctx.request.body,
      );
    }

    return sanitizeEntity(entity, { model: strapi.models.member });
  },

  /**
   * Delete a record.
   *
   * @return {Object}
   */
  async delete(ctx) {
    const member = await strapi.services.member.findOne(ctx.params);
    // Ensure that the member belongs to the user's organization
    const organization = ctx.state.user.organization.id;

    if (
      member &&
      (!member.organization || member.organization.id !== organization)
    ) {
      return ctx.unauthorized("You are not allowed to perform this action.");
    }

    const entity = await strapi.services.member.delete(ctx.params);
    return sanitizeEntity(entity, { model: strapi.models.member });
  },
};
