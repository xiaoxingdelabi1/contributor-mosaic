# Contributor Mosaic

一个纯前端在线工具，用于生成 GitHub 贡献者头像墙。

## 功能特性

### 核心功能

- **自动获取贡献者** - 输入 GitHub 仓库地址（如 `owner/repo`），自动拉取所有贡献者列表
- **实时预览** - 头像以网格形式展示，参数调整即时重绘
- **自定义样式**
  - 列数设置
  - 头像尺寸
  - 间距调整
  - 圆角大小
  - 背景颜色
  - 内边距
- **多格式导出**
  - 下载 PNG 图片
  - 复制 HTML 代码（可直接嵌入网页）
  - 复制 Markdown 代码（可直接用于 README）

### 其他特性

- 支持 GitHub Token 认证（用于私有仓库或提高 API 限额）
- 响应式设计，适配移动端
- 隐私友好 - 所有操作在浏览器本地完成，不收集任何数据
- 无需服务器，可部署到 GitHub Pages

## 使用方法

### 在线使用

- **在线访问**：[https://xiaoxingdelabi1.github.io/contributor-mosaic](https://xiaoxingdelabi1.github.io/contributor-mosaic)
- **本地使用**：直接打开 `index.html` 即可使用

### 操作步骤

1. 输入 GitHub 仓库地址，格式为 `owner/repo`
   - 例如：`vuejs/vue`、`facebook/react`
   - 也支持完整 URL：`https://github.com/vuejs/vue`

2. 点击「获取贡献者」按钮

3. 调整样式参数，实时预览效果

4. 选择导出方式：
   - **下载 PNG** - 保存为图片文件
   - **复制 HTML** - 生成 flex 布局代码
   - **复制 Markdown** - 生成表格格式代码

### 高级选项

如果需要访问私有仓库或提高 API 限额，可以添加 GitHub Token：

1. 点击「高级选项」展开
2. 输入你的 GitHub Personal Access Token
3. Token 仅在当前浏览器会话中使用，不会上传到任何服务器

## 技术栈

- HTML5 - 页面结构
- CSS3 - 布局、响应式设计
- JavaScript (ES6) - 核心逻辑
  - GitHub REST API 调用
  - Canvas API 绘制头像网格
  - 图片导出功能

无任何第三方依赖，纯原生实现。

## 部署

### GitHub Pages

1. Fork 本仓库
2. 进入仓库 Settings → Pages
3. 选择 main 分支作为源
4. 访问生成的 GitHub Pages 链接

### 本地运行

```bash
# Python
python -m http.server 8080

# Node.js
npx serve
```

然后访问 http://localhost:8080

## 注意事项

- GitHub API 对未认证请求有速率限制（每小时 60 次）
- 建议添加 GitHub Token 以获得更高的请求限额（每小时 5000 次）
- 跨域问题：部分头像可能因 CORS 限制无法加载

## 许可证

MIT License

## 支持项目

如果这个工具对你有帮助，欢迎 Star 支持！

### 赞赏支持

如果你觉得这个工具很有用，也可以通过以下方式支持作者：

<p align="center">
  <img src="zanshangma.jpg" alt="赞赏码" width="300" />
</p>

**赞赏说明**：
- 扫描上方二维码可以支持作者
- 你的支持将帮助我继续改进这个工具
- 任何金额的支持都非常感谢！

感谢你的支持！
