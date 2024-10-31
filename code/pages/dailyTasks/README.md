# 每日任务页面 (dailyTasks.vue)

## 描述
每日任务页面用于展示用户的当日任务列表，并允许用户切换任务的完成状态。完成任务后，用户可以获得相应的福币奖励，未完成的任务则不会增加福币。页面通过云函数获取任务数据，并在任务状态更改时实时更新福币余额。

## 页面结构与功能
1. **任务列表展示**：显示当天的所有任务，每个任务项包括：
   - **任务编号**：任务的序号，通常显示在任务条目左侧。
   - **任务名称**：任务的简要描述，如“登录”或“完成一篇笔记”。
   - **任务奖励**：显示该任务的奖励福币数量，通常在任务名称右侧附带福币图标。
   - **任务状态**：显示任务的当前状态（“已完成”或“未完成”），并且用户可以通过点击切换任务状态。

2. **任务状态切换**：
   - 用户点击任务条目可以切换任务状态。
   - 当任务被标记为“已完成”时，页面会自动调用云函数更新任务状态，并将任务奖励福币添加至用户余额中。
   - 如果用户取消任务完成状态，相应的福币会从用户余额中扣除。

## 数据获取与更新
页面通过调用 `getDailyTasks` 云函数来获取当天的任务列表，并通过 `updateTaskStatus` 云函数更新任务完成状态和用户福币余额。

## 相关云函数

### getDailyTasks 云函数
获取当前用户的每日任务列表。
- **输入**：
  - `user_id`：用户 ID，用于查询该用户的任务数据。
- **输出**：
  - `tasks`：任务列表，包括任务的名称、奖励、完成状态。
- **逻辑**：
  - 查询 `dailytasks` 集合，获取当前用户当天的所有任务。
  - 返回包含任务名称、奖励福币、完成状态的数据列表。

### updateTaskStatus 云函数
更新任务的完成状态，并根据状态变更调整用户的福币余额。

- **输入**：
  - `task_id`：任务 ID，用于标识需要更新的任务。
  - `user_id`：用户 ID，确保任务归属于当前用户。
  - `completed`：任务的新状态（布尔值），`true` 表示已完成，`false` 表示未完成。
- **输出**：
  - 更新后的福币余额。
- **逻辑**：
  - 查询 `dailytasks` 集合，将指定任务的完成状态更新为传入的 `completed `值。
  - 若任务状态更改为“已完成”，则增加用户福币；若取消完成状态，则扣除对应福币。
  - 更新 `leaderboard `集合中的用户福币余额，并返回新余额。

## 页面交互逻辑
- **切换任务状态**：用户点击任务条目时，会触发 `toggleTaskStatus` 方法，该方法调用 `updateTaskStatus` 云函数，将任务状态切换为“已完成”或“未完成”。云函数会自动更新用户的福币余额，前端显示新的余额。
- **任务状态实时更新**：在任务完成或取消时，页面会立即更新显示用户的最新福币余额和任务状态，使用户能实时查看变动，并且当所有每日任务都完成时，返回给“myFub”（我的福币）页面，并更新该页面的“今日任务未完成”-->“今日任务已完成”按钮状态。
## 注意事项
- **每日任务初始化**：当数据库中没有当日任务数据时，`initializeDailyTasks` 云函数需要运行，为用户创建当天的默认任务。该函数可以在用户首次访问页面时调用。
- **任务奖励逻辑**：更新任务状态时，确保福币余额正确加减。避免用户通过重复完成/取消任务刷取福币。
- **数据完整性**：在更新任务状态之前，确认 `dailytasks` 和 `leaderboard` 集合中有对应的用户和任务记录，以避免数据异常。
## 小结
每日任务页面的核心功能是展示用户当天的任务列表，并允许用户切换任务完成状态。每当任务完成或取消，用户的福币余额会实时更新，提供直观的反馈体验。云函数实现了数据的获取与更新，确保福币奖励的准确性和及时性。