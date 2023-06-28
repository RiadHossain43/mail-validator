const { APIError } = require("../../common/helper/error/apiError");
const { Workspaces } = require("./chats");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class WorkAccess extends Workspaces {
  constructor() {
    super();
  }
  async inviteMember(data) {
    const accessPolicy = new this.AccessPolicies({
      workspaceRef: data.workspaceRef,
      userRef: data.userRef,
      permissions: data.permissions,
    });
    return accessPolicy.save();
  }
  async isExisting(query) {
    const accessPolicy = await this.AccessPolicies.findOne(query);
    if (!accessPolicy)
      return {
        status: false,
        data: null,
      };
    return {
      status: true,
      data: accessPolicy,
    };
  }
  async getAccessPolicy(query) {
    let exist = await this.isExisting(query);
    if (!exist.status)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No access policy found with the given query."
      );
    return exist.data;
  }
  async listAccesses(query) {
    let pagination = await this.AccessPolicies.paginate(query);
    return pagination;
  }
  async modifyAccess(workspaceId, data) {
    const accessPolicy = await this.getAccessPolicy({
      workspareRef: workspaceId,
      userRef: data.memberId,
    });
    accessPolicy.permissions = data.permissions;
    return accessPolicy.save();
  }
  async removeMember(workspaceId, memberId) {
    const accessPolicy = await this.getAccessPolicy({
      workspareRef: workspaceId,
      userRef: memberId,
    });
    if (accessPolicy) {
      return this.AccessPolicies.deleteOne({ _id: accessPolicy._id });
    }
  }
}
module.exports = { WorkAccess };
