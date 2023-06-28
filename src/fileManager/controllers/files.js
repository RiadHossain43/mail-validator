const { StatusCodes } = require("http-status-codes");
const { FileManager } = require("../../common/helper/fileManager");
exports.uploadUrl = async (req, res, next) => {
  let filemanager = new FileManager();
  try {
    let filename = req.header("x-file-name");
    const results = await filemanager.generateUploadUrl(filename);
    res.status(StatusCodes.OK).json({
      message: "Upload url retrived.",
      details: {
        ...results,
      },
    });
  } catch (error) {
    next(error);
  }
};
