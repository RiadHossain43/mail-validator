const { StatusCodes } = require("http-status-codes");
const { EmailValidationsCRUD } = require("../services");
const { Filters, formatListResponse } = require("../../common/helper");
exports.createEmailValidations = async (req, res, next) => {
  try {
    const emailValidationsCrud = new EmailValidationsCRUD();
    const data = {
      ...req.body,
      createdBy: req.accessControl.user?._id,
    };
    const emailValidations = await emailValidationsCrud.createEmailValidations(
      data
    );
    return res.status(StatusCodes.CREATED).json({
      message: "Email validation created.",
      details: { emailValidations },
    });
  } catch (error) {
    next(error);
  }
};
exports.listEmailValidations = async (req, res, next) => {
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["prompt", "response"],
    })
      .build()
      .query();
    let query = { ...filter };
    const emailValidationsCrud = new EmailValidationsCRUD();
    const result = await emailValidationsCrud.listEmailValidations(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "Email validation(s) retrived.",
      details: {
        emailValidations: formatListResponse(result).data,
        pagination: formatListResponse(result).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.getEmailValidation = async (req, res, next) => {
  try {
    const emailValidationsCrud = new EmailValidationsCRUD();
    const emailValidation = await emailValidationsCrud.getEmailValidation({
      _id: req.params.id,
    });
    return res.status(StatusCodes.OK).json({
      message: "Email validation retrived.",
      details: { emailValidation },
    });
  } catch (error) {
    next(error);
  }
};
exports.editEmailValidation = async (req, res, next) => {
  try {
    const emailValidationsCrud = new EmailValidationsCRUD();
    const emailValidation = await emailValidationsCrud.editEmailValidation(
      req.params.id,
      req.body
    );
    return res.status(StatusCodes.OK).json({
      message: "Email validation updated.",
      details: { emailValidation },
    });
  } catch (error) {
    next(error);
  }
};
exports.softRemoveEmailValidation = async (req, res, next) => {
  try {
    const emailValidationsCrud = new EmailValidationsCRUD();
    const result = await emailValidationsCrud.softRemoveEmailValidation(
      req.body.records
    );
    return res.status(StatusCodes.OK).json({
      message: "Email validation(s) moved to trash.",
      details: { result, records: req.body.records },
    });
  } catch (error) {
    next(error);
  }
};
exports.restoreEmailValidation = async (req, res, next) => {
  try {
    const emailValidationsCrud = new EmailValidationsCRUD();
    const result = await emailValidationsCrud.restoreEmailValidation(
      req.body.records
    );
    return res.status(StatusCodes.OK).json({
      message: "Email validation(s) restored.",
      details: { result, records: req.body.records },
    });
  } catch (error) {
    next(error);
  }
};
exports.hardRemoveEmailValidation = async (req, res, next) => {
  try {
    const emailValidationsCrud = new EmailValidationsCRUD();
    const result = await emailValidationsCrud.hardRemoveEmailValidation(
      req.body.records
    );
    return res.status(StatusCodes.OK).json({
      message: "Email validation(s) removed.",
      details: { result, records: req.body.records },
    });
  } catch (error) {
    next(error);
  }
};
