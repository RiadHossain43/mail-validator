exports.formatResponse = async (req, res, next) => {
  const originJson = res.json;
  res.json = (jsonData) => {
    if (!jsonData.message) throw Error("Message is required in response");
    if (!jsonData.details)
      throw Error("Details scope is required for data transfer.");
    const fixedResponse = {
      message: jsonData.message,
      statusCode: res.statusCode,
    };
    originJson.call(res, { ...jsonData, ...fixedResponse });
  };
  next();
};
