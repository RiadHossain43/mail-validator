const { logger } = require("./logger");

class Filters {
  constructor(data, options = { searchFields: [] }) {
    this.qry = data.query;
    this.queryStr = JSON.stringify(data.query);
    this.searchFields = options.searchFields;
    this.connection = data.tenant;
  }
  dotNotate(obj, target, prefix) {
    target = target || {};
    prefix = prefix || "";
    Object.keys(obj).forEach((key) => {
      if (key[0] === "$" && prefix) {
        return (target[prefix.slice(0, prefix.length - 1)] = obj);
      }
      if (typeof obj[key] === "object" && obj[key] !== null) {
        this.dotNotate(obj[key], target, prefix + key + ".");
      } else {
        return (target[prefix + key] = obj[key]);
      }
    });
    this.qry = { ...target };
    this.queryStr = JSON.stringify(target);
    return this;
  }
  formatOperators() {
    let currentString = JSON.stringify(this.qry);
    this.queryStr = currentString.replace(
      /\b(or|gt|gte|lt|options|lte|elemMatch|in|nin|ne|equals|all|regex)\b/g,
      (key) => `$${key}`
    );
    return this;
  }
  removeOptions() {
    let removeItems = ["page", "size", "sort"];
    removeItems.forEach((item) => delete this.qry[item]);
    return this;
  }
  trim() {
    this.removeOptions();
    return this;
  }
  async search() {
    if (!this.qry.clientSearch || !this.searchFields.length) {
      delete this.qry["clientSearch"];
      this.queryStr = JSON.stringify(this.qry);
      return this;
    }
    let searchQuery = this.qry.$or || [];
    this.qry.$or = [
      ...searchQuery,
      ...this.searchFields.map((field) => {
        return {
          [field]: {
            $regex: this.qry.clientSearch && this.qry.clientSearch,
            $options: "i",
          },
        };
      }),
    ];
    delete this.qry["clientSearch"];
    this.queryStr = JSON.stringify(this.qry);
    return this;
  }
  build() {
    /**
     * Sequence of function call matters here, if correct sequence is not maintained
     * search feature along with some other will break.
     */
    this.trim();
    this.formatOperators();
    this.dotNotate(JSON.parse(this.queryStr));
    this.search();
    return this;
  }
  queryString() {
    return this.queryStr;
  }
  query() {
    logger.info("currently used filter:", { ...JSON.parse(this.queryStr) });
    return JSON.parse(this.queryStr);
  }
}
exports.Filters = Filters;
