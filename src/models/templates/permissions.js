const { omitDeep } = require("../../common/helper");
/**
 * Every users given an access policy gets a read permission to the specified
 * workspace, the permissions more precisely means to manage administrative authorities
 * on the features where it's required. Permission checks will apply only in the access
 * controlling places. Apis or actions that don't require any authoretive process are out
 * of this scope and open to all users to consume.
 */
const permissions = {
  workspace: {
    description: "This will enable admin permissions on work space",
    canManageUsers: {
      type: Boolean,
      default: false,
      description: "Allwes to manage users",
    },
    canEditInformations: {
      type: Boolean,
      default: false,
      description: "Allwes to edit info",
    },
  },
  testCases: {
    description: "This will enable admin permissions on test cases",
    canManageTestCases: {
      type: Boolean,
      default: false,
      description: "Allwes to test cases",
    },
    executions: {
      description: "This will enagle admin permissions on executions",
      canManageRuns: {
        type: Boolean,
        default: false,
        description: "Allwes to manage runs",
      },
      canExecuteRuns: {
        type: Boolean,
        default: false,
        description: "Allwes to manage runs",
      },
    },
    collections: {
      description: "This will enagle admin permissions on collections",
      canManageCollections: {
        type: Boolean,
        default: false,
        description: "Allwes to manage collections",
      },
    },
  },
};
module.exports = {
  permissions: omitDeep(permissions, "description"),
  permissionsWithDescription: permissions,
};
