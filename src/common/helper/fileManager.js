const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../../.config/awsS3");
const { v4: uuidv4 } = require("uuid");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { APIError } = require("./error/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

class FileManager {
  constructor(connection) {
    this.connection = connection;
  }
  _isValidFile(filename) {
    const validExtensions = [".jpg", ".png", ".jpeg"];
    let flag = false;
    validExtensions.forEach((ext) => {
      if (filename?.endsWith(ext)) flag = true;
    });
    return flag;
  }
  async generateUploadUrl(filename) {
    if (!this._isValidFile(filename))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "A valid file name is required."
      );
    const filenameSplited = filename?.split("/");
    const originalFilename = filenameSplited[filenameSplited.length - 1];
    const originalFilenameSplited = originalFilename?.split(".");
    const fileName =
      "alice-public-media" +
      "/" +
      `${uuidv4()}.${
        originalFilenameSplited[originalFilenameSplited.length - 1]
      }`;
    const params = {
      Bucket: process.env.AWS_RESOURCE_BUCKET,
      Key: fileName,
    };
    const uploadUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand(params),
      {
        expiresIn: 3 * 3600,
      }
    );
    return {
      uploadUrl,
      metaInfo: {
        Name: originalFilename,
        ...params,
      },
    };
  }
  async deleteFile(fileinformation) {
    const params = {
      Bucket: fileinformation.Bucket,
      Key: fileinformation.Key,
    };
    const command = new DeleteObjectCommand(params);
    const response = await s3Client.send(command);
    return fileinformation;
  }
}
module.exports = { FileManager };
