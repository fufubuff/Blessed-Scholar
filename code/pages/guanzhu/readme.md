# 用户关注别人页面

## 描述（要和研小圈的内容联系,先弄了框架）

该页面用于展示用户的关注列表，用户可以通过标签切换不同的视图，包括“互关”、“关注”和“粉丝”。页面以简洁的布局显示用户信息，增强用户体验。

## 页面功能

- **标签切换**：用户可以点击不同的标签切换视图，展示不同类型的用户（互关、关注、粉丝）。
- **用户信息展示**：每个用户的头像、姓名和简介都清晰可见，同时显示用户的关注状态。

## 数据获取与更新

- 页面加载时会调用 `getUserData` 方法，从云数据库获取用户信息。
- 数据存储在 `users` 数组中，用于展示在页面上。
- 同时将关注别人的数量与Index页面的你正在关注联系。

## 相关云函数

- `getUserData`：该云函数从用户集合中获取用户数据，返回用户的头像、姓名、简介等信息。

## 页面交互逻辑

- `tabClick(tab)`：该方法用于处理标签点击事件，根据当前点击的标签更新 `activeTab` 状态，并可根据需要添加不同标签的数据获取逻辑。
- `mounted()`：在组件挂载时自动调用 `getUserData` 方法，确保页面加载时能够显示最新的用户数据。

