var serverconfig = {
    // baseurl: "https://www.jsecode.com:1680/api/",
    baseurl: "https://www.jsecode.com:1692/api/",
    // baseurl: "http://192.168.16.204:1700/",
    interface: {
        "login": "user/login",
        "getVerify": "check/getVerify",
        "userGetUserByToken": "user/getUserByToken",
        "userModifyPassword": "user/modifyPassword", //重置密码
        // --系统设置 功能菜单管理--
        "maintenanceGetMaintenanceTree": "maintenance/getMaintenanceTree",
        "maintenanceSaveMaintenance": "maintenance/saveMaintenance",
        "maintenanceDeleteMaintenance": "maintenance/deleteMaintenance",
        "maintenanceSelectMaintenance": "maintenance/selectMaintenance",
        "maintenanceUpdateMaintenance": "maintenance/updateMaintenance",
        // --系统设置 公共角色--
        "roleCommonRoleList": "role/commonRole/list",
        "roleCommonRoleSaveCommonRole": "role/commonRole/saveCommonRole",
        "roleCommonRoleUpdateCommonRole": "role/commonRole/updateCommonRole",
        "roleCommonRoleDeleteCommonRole": "role/commonRole/deleteCommonRole",
        "roleCommonRoleSelectCommonRole": "role/commonRole/selectCommonRole",
        // --系统设置 组织角色--
        "roleOrganRoleDeleteOrganRole": "role/organRole/deleteOrganRole",
        "roleOrganRoleList": "role/organRole/list",
        "roleOrganRoleSelectOrganRole": "role/organRole/selectOrganRole",
        "roleOrganRoleSaveOrganRole": "role/organRole/saveOrganRole",
        "roleOrganRoleUpdateOrganRole": "role/organRole/updateOrganRole",
        "roleOrganRoleUserTree": "role/organRoleUser/tree",
        "roleOrganRoleUserAddUser": "role/organRoleUser/addUser",
        // --系统设置 系统用户--
        "findUserListForRole": "user/findUserListForRole", //查询用户树
        "userAddUser": "user/addUser", //新增用户
        "userRemoveUser": "user/removeUser", //删除用户
        "userAdminModifyUserInfo": "user/adminModifyUserInfo", //编辑用户
        "updateAccountStatus": "user/updateAccountStatus", //锁定解锁
        "roleOrganRoleTree": "role/organRole/tree",
        "uploadFacUser": "appUser/uploadFacUser",
        "exportFacUserTemplate": "appUser/exportFacUserTemplate",
        // --系统设置 组织机构--
        "orgSaveOrg": "org/saveOrg", //新增部门
        "orgDeleteOrg": "org/deleteOrg", //删除部门
        "orgUpdateOrg": "org/updateOrg", //编辑部门
        "orgGetOrgTree": "org/getOrgTree", //查询部门树
        "orgSelectOrg": "org/selectOrg", //查询部门详情
        "getOrgList": "org/getOrgList", //机构列表查询
        // --维修单位管理 优惠券配置--
        "queryCouponInfo": "coupon/queryCouponInfo",
        "updateCouponInfo": "coupon/updateCouponInfo",
        "addCouponInfo": "coupon/addCouponInfo",
        "couponDeleteByIds": "coupon/deleteByIds",
        //--人员单位关联配置--
        "queryUserFacRelation": "factory/queryUserFacRelation",
        "addUserFacRelation": "factory/addUserFacRelation",
        "queryUserByCommonRole": "user/queryUserByCommonRole",
        "userDeleteByIds": "factory/deleteByIds",
        "queryFactoryInfo": "factory/queryFactoryInfo",
        "deleteRelByUserId": "factory/deleteRelByUserId",

        // --案件管理 案件管理--
        "caseQueryCaseList": "caseInfo/queryCaseList",
        "caseAddRepairProcessDetail": "caseInfo/addRepairProcessDetail",
        "caseQuerySendRepairProcess": "caseInfo/querySendRepairProcess",
        "caseQueryProcessDetail": "caseInfo/queryProcessDetail",
        "queryCaseRepairList": "caseInfo/queryCaseInfo",
        "queryCaseRepairDetail": "caseInfo/queryCaseDetail",
        "updateCaseInfo": "caseInfo/updateCaseInfo",
        "custWish": "sendRepair/custWish",
        "recomRepair": "sendRepair/recomRepair",
        "addLossInfo": "caseInfo/addLossInfo",
        "deleteLossInfo": "caseInfo/deleteLossInfo",
        "updateLossInfo": "caseInfo/updateLossInfo",
        "queryLossInfo": "caseInfo/queryLossInfo",
        "queryLossDic": "caseInfo/queryLossDic",
        "queryOrgFactoryInfo": "factory/queryOrgFactoryInfo",
        "querySendRepairOperLog": "sendRepair/querySendRepairOperLog",
        "updateCaseRepairCom": "appCase/updateCaseRepairCom",


        // --问题反馈--
        "queryProblem": "problemFeedBack/queryProblem",
        "updateProblem": "problemFeedBack/updateProblem",
        "deleteProblem": "problemFeedBack/deleteProblem",

        //--报表相关接口--
        "queryDetailedList": "caseInfo/queryDetailedList",
        "surveyorSendRepairSta": "sta/surveyorSendRepairSta",
        "sendRepairOrgSta": "sta/sendRepairOrgSta",
        "sendRepairZgSta": "sta/sendRepairZgSta",
        "sendRepairFacSta": "sta/sendRepairFacSta",

        //--人员片区相关接口--
        "queryUserOrgRelation": "org/queryUserOrgRelation",
        "addUserOrgRelation": "org/addUserOrgRelation",
        "deleteRelByUserIds": "org/deleteRelByUserId",
        "userRelationdeleteByIds": "org/deleteByIds",
        "findUserList": "user/findUserList"

    }
}
var pagesize = 20;