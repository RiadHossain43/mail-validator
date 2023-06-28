const trimQuery = (data) => {
  let { page, size, sort } = data;
  page = !parseInt(page) || parseInt(page < 1) ? 1 : parseInt(page);
  size =
    parseInt(size) < 1 || parseInt(size) > 30 || !parseInt(size)
      ? 10
      : parseInt(size);
  sort = sort ? sort : "-createdAt";
  let isObject = (object) => object !== null && typeof object === "object";
  function deepTrim(obj) {
    const keys = Object.keys(obj);
    for (let key of keys) {
      if (isObject(obj[key])) {
        deepTrim(obj[key]);
      } else {
        obj[key] = obj[key] === "null" ? null : obj[key];
        obj[key] = obj[key] === "undefined" ? undefined : obj[key];
      }
    }
    return obj;
  }

  return { ...deepTrim(data), page, size, sort };
};
exports.secureQuery = async (req, res, next) => {
  req.query = trimQuery(req.query);
  next();
};
