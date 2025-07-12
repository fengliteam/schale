---
title: Windows 11/10 桌面图标中间突然出现小对勾✅
categories: BUG FIX
tags:
  - Microsoft
  - Windows
id: win11-green-checkmark
date: 2025-07-11 17:55:10
updated: 2025-07-11 17:55:10
cover: "封面图URL (为空默认随机内置封面 /public/assets/images/banner)"
recommend: true # 是否推荐文章
top: false # 是否置顶文章
hide: false # 是否隐藏文章
---

最近我的Windows 11 （23H2）遇到了桌面上的图标突然出现绿色小对勾，但之前从未遇到过。
![问题](/assets/images/post/check.webp)
## 网上解决方法

### 方法一：关闭OneDrive图标状态覆盖
1. 右键点击桌面空白处，选择"显示更多选项"
2. 选择"OneDrive" > "设置"
3. 在"设置"选项卡中，取消勾选"在文件资源管理器中使用图标显示同步状态"
4. 点击"确定"保存设置

### 方法二：重置图标缓存
1. 按Win+R打开运行对话框
2. 输入`cmd`并按Ctrl+Shift+Enter以管理员身份运行命令提示符
3. 依次执行以下命令：
```
taskkill /f /im explorer.exe
cd /d %userprofile%\AppData\Local
attrib -h IconCache.db
del IconCache.db
start explorer.exe
```
4. 重启电脑后检查问题是否解决

### 方法三：检查文件属性
1. 右键点击有绿色对勾的图标
2. 选择"属性"
3. 在"常规"选项卡中，检查"属性"部分是否有"只读"勾选
4. 如果有，取消勾选并点击"确定"

## 个人情况
1. 我没用动过任何设置
2. 我是刚从“Prison Architect”监狱建筑师游戏（全屏模式）退出回桌面发现的

### 实测解决方式
- 方式一
   桌面点击“刷新”
![刷新](/assets/images/post/F5.webp)
- 方式二
   桌面界面按下 ```F5``` 键
   [PS：部分键盘请按住FN+5应该能达到]


#### ⚠️注意⚠️
- 部分内容可能存在错误，请自行判断
- 部分操作仅供参考，可能包含主观意见