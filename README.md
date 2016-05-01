danmu-server
================
[![David deps](https://david-dm.org/zsxsoft/danmu-server.svg)](https://david-dm.org/zsxsoft/danmu-server)

弹幕服务器。

## 功能特色
- 跨平台；
- 房间功能；
- 后台管理；
- 弹幕记录与搜索（需要开启数据库）；
- 黑名单功能；
- 关键词替换、拦截功能；
- 弹幕记录；
- 扩展；
   - 新浪微博登录扩展（需要开启缓存）；
   - 自动封禁功能扩展（需要开启缓存）；
- 删除单条弹幕功能；
- 易于部署，简单高效。

## 后台截图
![后台截图](http://zsxsoft.github.io/danmu-server/management.png)

## 一些警告

稳定版请于[Release](https://github.com/zsxsoft/danmu-server/releases)手动下载。


## 部署方式

### 检查环境

#### Nodejs
 必须安装[Nodejs](https://nodejs.org/)。支持``node 4.0``以上版本。

 强烈推荐使用最新版本Nodejs（截至写文档时，最新稳定版为``5.5.4``）。

#### 数据库
 如使用``csv``，可无视此节。

 默认使用``MySQL``数据库。如需使用，需检查[MariaDB](https://mariadb.org/)或[MySQL](https://www.mysql.com/)的安装状态。支持``5.0+``。安装完成后，请创建相应的数据库。

 如使用``MongoDB``数据库，请检查[MongoDB](https://www.mongodb.org/)的安装状态。然后需要在安装完成后执行：``npm install mongodb``。

#### 缓存

 如不使用新浪微博与自动封禁功能，可无视此节。

 默认使用``memcached``。如需使用，请检查[Memcached(Linux)](http://memcached.org/)的安装状态。``Windows``用户请自行查找适合的``Memcached``版本。

 如果要用[阿里云开放缓存服务OCS](http://www.aliyun.com/product/ocs/)，需要在安装完成后执行：``npm install aliyun-sdk``。

### 直接安装
 1. 配置MariaDB，创建数据库等，不需要创建数据表。
 2. 修改``config.js``，使其参数与环境相符。
 3. 切换到命令行或终端，``cd``到程序所在目录执行``npm install``，安装程序依赖库。
 4. 现在，你可以直接``npm start``启动。

### Docker安装

直接用``Docker``安装的话，镜像内是含``MariaDB``的。如果不需要，请根据``Dockerfile``内的提示手动删除。
 1. [安装Docker](http://yeasy.gitbooks.io/docker_practice/content/install/index.html)。
 2. ``config.js``调整配置。
 3. ``docker build -t="zsxsoft/danmu-server:" . && docker run -t -i -p 3000:3000 "zsxsoft/danmu-server"``

### DaoCloud安装
在[DaoCloud](https://www.daocloud.io)下安装，如使用服务集成的MySQL的话，请根据``Dockerfile``内的提示手动删除``MariaDB``相关内容。不需要修改数据库信息，程序会自行检测。

## 升级
### 1.0.5 -> 1.0.6-pre
* 在每个房间内增加hostname配置，类型为数组，用于将房间与域名绑定

## 网页接口

### GET /
可以直接发布最简单的弹幕。

### GET /advanced
可以发布高级弹幕（需要密码）

### GET /manage
可以进行后台管理

### GET /realtime
可以实时接收弹幕并直接删除或封禁（需要密码）

## 配置说明

以下标有``*``的配置项，运行时不可在后台修改。

```javascript
	"rooms": {
		"房间1": {
			* "hostname": ["test.zsxsoft.com", "localhost", "127.0.0.1"], 
			* "display": "房间显示名",
			* "table": "对应MySQL的数据表、MongoDB的集合", 
			"connectpassword": "客户端连接密码",
			"managepassword": "管理密码",
			"advancedpassword": "高级弹幕密码",  
			"keyword": {
				"block": /强制屏蔽关键词，正则格式。/
				"replacement": /替换关键词，正则格式/,
				"ignore": /忽略词，正则格式/
			},
			"blockusers": [
				"默认封禁用户列表"
			],
			"maxlength": 弹幕堆积队列最大长度, 
			"textlength": 每条弹幕最大长度, 
			* "image": {
				* "regex": /图片弹幕解析正则，正则格式，不要修改/ig,
				* "lifetime": 每个图片给每条弹幕增加的存货时间 
			},
			"permissions": { // 普通用户允许的弹幕权限
				"send": 弹幕开关；关闭后无论普通用户还是高级权限都完全禁止弹幕。, 
				"style": 弹幕样式开关, 
				"color": 颜色开关, 
				"textStyle": CSS开关, 
				"height": 高度开关, 
				"lifeTime": 显示时间开关, 
			}
		},
		"房间ID2": {
			// 同上
		}
	},
	* "database": { // 数据库
		* "type": "数据库类型（mysql / mongo / csv / none）",
		* "server": " 数据库地址（mysql / mongo）",
		* "username": "数据库用户名（mysql / mongo）",
		* "password": "数据库密码（mysql / mongo）",
		* "port": "数据库端口（mysql / mongo）",
		* "db": "数据库（mysql / mongo）", 
		* "retry": 24小时允许断线重连最大次数，超过则自动退出程序。24小时以第一次断线时间计。（mysql）,
		* "timeout": 数据库重连延时及Ping（mysql）, 
		* "savedir": "指定文件保存位置（csv）",
	},
	"websocket": {
		"interval": 弹幕发送间隔
		"singlesize": 每次弹幕发送数量
	},
	* "http": {
		* "port": 服务器HTTP端口, 
		* "headers": {}, // HTTP头
		* "sessionKey": "随便写点，防冲突的"
	},
	* "cache": {
		* "type": "缓存类型（memcached / aliyun）", 
		* "host": "缓存服务器地址，可用socket", 
		* "auth": 打开身份验证,  
		* "authUser": 身份验证账号,
		* "authPassword": 身份验证密码,
	},
	"ext": {
		// 扩展
	}
}
```

## 常见问题
### 数据库相关
``{ [Error: Connection lost: The server closed the connection.] fatal: true, code: 'PROTOCOL_CONNECTION_LOST' }``

请把MySQL的``wait_timeout``设置得大一些。

## 搭配项目

- [danmu-client](https://github.com/zsxsoft/danmu-client)
- [screen-controller](https://github.com/zsxsoft/screen-controller)

## 负载测试

此处测试已过时
<del>
    <p>测试命令：ab -n 6000 -c 1000 -v 4  -p "post.txt" -T "application/x-www-form-urlencoded" http://127.0.0.1:3000/post</p>
    <p>环境：Linux 3.10.0-123.9.3.el7.x86_64 / Intel(R) Xeon(R) CPU E5-2630 @ 2.30GHz / 512MB / node v0.12.1 / mariadb-server.x86_64 1:5.5.41-2.el7_0 / 阿里云杭州机房D，一个客户端连接，OCS </p>
    <p>默认配置，开启新浪微博登录，开启自动封禁。QPS 225.38 / 241.58</p>
    <p>默认配置，关闭新浪微博登录，关闭自动封禁。QPS 461.97 / 431.51</p>
    <p>默认配置，删除日志输出，关闭新浪微博登录，关闭自动封禁。QPS 720.89 / 812.66</p>

    <p>环境：iojs v1.8.1</p>
    <p>默认配置，开启新浪微博登录，开启自动封禁。QPS 444.42 / 536.25</p>
    <p>默认配置，关闭新浪微博登录，关闭自动封禁。QPS 633.99 / 865.28</p>
</del>
## 流程图

![流程图](http://zsxsoft.github.io/danmu-server/route.png)

## 协议
The MIT License (MIT)

## 博文
[弹幕服务器及搭配之透明弹幕客户端研究结题报告](http://blog.zsxsoft.com/post/15)

[弹幕服务器及搭配之透明弹幕客户端研究中期报告](http://blog.zsxsoft.com/post/14)

[弹幕服务器及搭配之透明弹幕客户端研究开题报告](http://blog.zsxsoft.com/post/13)

## 开发者
zsx - http://www.zsxsoft.com / 博客 - http://blog.zsxsoft.com
