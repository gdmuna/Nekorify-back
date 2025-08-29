/**
 * 权限组
 * @typedef {Object} GroupMeta
 * @property {string} label - 权限组名称
 * @property {number} level - 权限组等级
 * @property {string[]} [belongs] - 所属上级权限组
 */

const groupMeta = {
    "gdmu/Nekorify-admin": {
        label: "Nekorify管理员",
        level: 1,
        belongs: ["gdmu-na"],
    },
    "gdmu/NA-presidency": {
        label: "网络协会 - 会长团",
        level: 1,
        belongs: ["gdmu-na"],
    },
    "gdmu/ACM-presidency": {
        label: "ACM协会 - 会长团",
        level: 1,
        belongs: ["gdmu-acm"],
    },
    "gdmu/NA-minister": {
        label: "网络协会 - 部长",
        level: 2,
        belongs: ["gdmu-na"],
    },
    "gdmu/ACM-minister": {
        label: "ACM协会 - 部长",
        level: 2,
        belongs: ["gdmu-acm"],
    },
    "gdmu/NA-BI": {
        label: "网络协会 - BI部",
        level: 3,
        belongs: ["gdmu-na"],
    },
    "gdmu/NA-scientific": {
        label: "网络协会 - 科研部",
        level: 3,
        belongs: ["gdmu-na"],
    },
    "gdmu/NA-academic": {
        label: "网络协会 - 学术部",
        level: 3,
        belongs: ["gdmu-na"],
    },
    "gdmu/NA-publicity": {
        label: "网络协会 - 宣传部",
        level: 3,
        belongs: ["gdmu-na"],
    },
    "gdmu/ACM-teacher": {
        label: "ACM协会- 教研部",
        level: 3,
        belongs: ["gdmu-acm"],
    },
    "gdmu/ACM-publicity": {
        label: "ACM协会 - 宣传部",
        level: 3,
        belongs: ["gdmu-acm"],
    },
    "gdmu/ACM-technology": {
        label: "ACM协会 - 技术维护组",
        level: 3,
        belongs: ["gdmu-acm"],
    },
    "gdmu/gdmu-na": {
        label: "网络协会",
        level: 4
    },
    "gdmu/gdmu-acm": {
        label: "ACM协会",
        level: 4
    },
    // "gdmu/gdmu-dch": { 
    // label: "大创会",
    //  level: 4 
    // },
    "gdmu/grade2019": {
        label: "2019级",
        level: 5
    },
    "gdmu/grade2020": {
        label: "2020级",
        level: 5
    },
    "gdmu/grade2021": {
        label: "2021级",
        level: 5
    },
    "gdmu/grade2022": {
        label: "2022级",
        level: 5
    },
    "gdmu/grade2023": {
        label: "2023级",
        level: 5
    },
    "gdmu/grade2024": {
        label: "2024级",
        level: 5
    },
    "gdmu/grade2025": {
        label: "2025级",
        level: 5
    },
};

module.exports = groupMeta;
