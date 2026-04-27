export const PRIORITIES = {
  LOW: { label: "低", value: "low", color: "#52c41a" },
  MEDIUM: { label: "中", value: "medium", color: "#faad14" },
  HIGH: { label: "高", value: "high", color: "#ff4d4f" },
  URGENT: { label: "紧急", value: "urgent", color: "#722ed1" },
};

export const DEFAULT_COLORS = [
  "#52c41a",
  "#1890ff",
  "#722ed1",
  "#eb2f96",
  "#fa8c16",
  "#a0d911",
  "#13c2c2",
  "#2f54eb",
];

export const DEFAULT_USERS = [
  { id: "user-1", name: "张三", avatar: "张" },
  { id: "user-2", name: "李四", avatar: "李" },
  { id: "user-3", name: "王五", avatar: "王" },
  { id: "user-4", name: "赵六", avatar: "赵" },
];

export const DEFAULT_TAGS = [
  { id: "tag-1", name: "前端", color: "#1890ff" },
  { id: "tag-2", name: "后端", color: "#52c41a" },
  { id: "tag-3", name: "设计", color: "#722ed1" },
  { id: "tag-4", name: "Bug", color: "#ff4d4f" },
  { id: "tag-5", name: "优化", color: "#faad14" },
];

export const DEFAULT_COLUMNS = [
  { id: "column-1", title: "待办", cardIds: ["card-1", "card-2"] },
  { id: "column-2", title: "进行中", cardIds: ["card-3"] },
  { id: "column-3", title: "已完成", cardIds: ["card-4"] },
];

export const DEFAULT_CARDS = {
  "card-1": {
    id: "card-1",
    title: "设计用户界面原型",
    description: "完成首页和详情页的 UI 设计",
    assignee: "user-3",
    priority: "high",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tags: ["tag-3"],
    subtasks: [
      { id: "sub-1", title: "绘制线框图", completed: true },
      { id: "sub-2", title: "设计高保真原型", completed: false },
      { id: "sub-3", title: "准备设计规范", completed: false },
    ],
    comments: [
      {
        id: "comment-1",
        userId: "user-1",
        content: "需要和产品确认需求",
        createdAt: Date.now() - 86400000,
      },
    ],
    createdAt: Date.now() - 86400000 * 2,
  },
  "card-2": {
    id: "card-2",
    title: "修复登录页面 Bug",
    description: "修复密码重置功能无法使用的问题",
    assignee: "user-1",
    priority: "urgent",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tags: ["tag-4"],
    subtasks: [
      { id: "sub-4", title: "复现问题", completed: true },
      { id: "sub-5", title: "修复代码", completed: false },
    ],
    comments: [],
    createdAt: Date.now() - 86400000,
  },
  "card-3": {
    id: "card-3",
    title: "开发用户管理 API",
    description: "实现用户增删改查的后端接口",
    assignee: "user-2",
    priority: "medium",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tags: ["tag-2"],
    subtasks: [
      { id: "sub-6", title: "设计数据库结构", completed: true },
      { id: "sub-7", title: "编写 API 接口", completed: true },
      { id: "sub-8", title: "编写单元测试", completed: false },
    ],
    comments: [
      {
        id: "comment-2",
        userId: "user-3",
        content: "需要考虑权限控制",
        createdAt: Date.now() - 43200000,
      },
    ],
    createdAt: Date.now() - 86400000 * 3,
  },
  "card-4": {
    id: "card-4",
    title: "代码审查",
    description: "审查新功能的代码质量",
    assignee: "user-4",
    priority: "low",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tags: ["tag-5"],
    subtasks: [
      { id: "sub-9", title: "检查代码规范", completed: true },
      { id: "sub-10", title: "运行自动化测试", completed: true },
    ],
    comments: [
      {
        id: "comment-3",
        userId: "user-2",
        content: "代码已通过审查",
        createdAt: Date.now() - 86400000,
      },
    ],
    createdAt: Date.now() - 86400000 * 5,
  },
};
