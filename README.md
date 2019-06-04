# Nodejs

[![Gitter](https://badges.gitter.im/hfcx-nodejs/community.svg)](https://gitter.im/hfcx-nodejs/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)  [![Build Status](https://travis-ci.org/Jean1024/caipiao.svg?branch=master)](https://travis-ci.org/Jean1024/caipiao) 

**定时发送最新一期开奖数据，以及自己自选的号码的中奖信息** 

**Important:** 如果你希望在自己的电脑上构建 Caipiao，请使用 [master branch](https://github.com/Jean1024/caipiao/tree/master)

![qq20160428-0 2x](https://github.com/Jean1024/caipiao/blob/master/out.jpg)

## 应用特性 ([更新日志](https://github.com/Jean1024/caipiao/commits/master))

-  **获取彩票开奖数据**
-  **邮件发送**
-  **号码比对** 

## 如何使用

在下载和运行这个项目之前，你需要在电脑上安装 [Git](https://git-scm.com) 和 [Node.js](https://nodejs.org/en/download/) (来自 [npm](https://www.npmjs.com/))。在命令行中输入:

``` bash
# 下载仓库
git clone https://github.com/Jean1024/caipiao.git
# 进入仓库
cd caipiao
```
编辑`config.json`文件
```json
{
    "from": "376327918@qq.com",
    "nickname": "木木",
    "to": "1737923789@qq.com,456465555@qq.com",
    "key": "puyxxxxxxxxxxxjh",
    "subject": "彩票来了",
    "codelist": [
        {
            "front": [6, 18, 19, 27, 31],
            "back": [6, 7]
        },
        {
            "front": [3, 5, 7, 16, 25],
            "back": [5, 8]
        },
        {
            "front": [5, 6, 22, 25, 32],
            "back": [5, 10]
        }
    ]
}
```
**tips**
- *from: 自己的qq邮箱*
- *nickname: 昵称*
- *to: 收件人，以`,`分割*
- *codelist: 为自选号码*
- *subject: 邮件标题*
- *key值请填写自己qq邮箱的SMTP密码* 
- *邮箱> 设置> 账户> SMTP服务> 开启*
- **以上信息为虚拟信息，请填写自己的信息以使软件正常使用**

``` bash
# 安装依赖, 运行应用
npm install && npm start
```

**提示:** 如果 `npm install` 下载缓慢，你可以使用 [淘宝镜像(cnpm)](http://npm.taobao.org/) 替代 npm 。


#### 项目使用 [MIT](LICENSE.md) 许可

*Nodejs CaiPiao* 是个开源项目发布的产品。平时玩乐使用，与体彩中心没有任何联系。
