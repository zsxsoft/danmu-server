danmu-server
================

弹幕服务器。

项目可直接在Windows和Linux上运行。Mac未测试。

## 功能特色
- 房间功能，可用一个端口为多个不同的弹幕客户端提供服务
- 搜索弹幕功能，可随时搜索弹幕
- 黑名单功能，可封禁用户
   - 在开启新浪微博登录的情况下封禁新浪微博（扩展）
   - 在默认配置下根据Canvas指纹 + IP + User-Agent共同计算
- 可设置关键词替换、关键词拦截
- 记录用户的每一条弹幕（MySQL）
- 易于部署，简单高效


## 部署方式

 1. 下载并安装[iojs](https://iojs.org/cn/)、[MariaDB](https://mariadb.org/)和[Memcached(Linux)](http://memcached.org/)。Windows用户请自行查找适合的Memcached版本，如不使用自动封号和新浪微博可不安装。另外，[Node](https://nodejs.org)和[MySQL](https://www.mysql.com/)也同样支持。
 2. 配置MariaDB，创建数据库等，不需要创建数据表。
 3. 修改``config.js``，使其参数与环境相符。如果要用阿里云的OCS服务则需要在``config.js``里把``cache/type``调整为``aliyun``然后再``npm install aliyun-sdk``。
 4. 切换到``cmd``或``sh``，``cd``到程序所在目录执行``npm install``，安装程序依赖库。
 5. 现在，你可以直接``npm start``启动。

## 网页接口

### GET / 
可以直接发布最简单的弹幕。

### GET /advanced
可以发布高级弹幕（需要密码）

### GET /manage
可以进行后台管理

## 配置说明
可以修改config.js来修改配置。以下标为const的配置运行时不可在后台管理修改。
### rooms: Array
#### const rooms[].display: string
房间的显示名称
#### const rooms[].table: string
房间在数据库内存储使用的数据表（或类似概念）
#### const rooms[].connectpassword: string
客户端连接密码，参见[danmu-client](https://github.com/zsxsoft/danmu-client)
#### const rooms[].managepassword: string
后台管理密码，见网页接口的/manage
#### const rooms[].advancedpassword: string
高级弹幕密码，见网页接口的/advanced
#### rooms[].blockusers: Array
屏蔽用户列表，需要在/manage里配置
#### rooms[].maxlength: int
队列最大长度
#### rooms[].openstate: bool
房间开关
#### rooms[].textlength: int
弹幕最大长度
### const database: Object
#### type: string
数据库类型，目前可选mysql或none
#### server: string
（MySQL）数据库主机
#### username: string
（MySQL）数据库用户名
#### password: string
（MySQL）数据库密码
#### port: int
（MySQL）数据库端口
#### db: string
（MySQL）数据库
### websocket: Object
#### interval: int
弹幕推送到客户端时间间隔
#### singlesize: int
每次弹幕发送数量
### const http: Object
#### port: int
服务器HTTP端口
#### headers: Object
每次请求携带的HTTP头
#### sessionKey: string
防Session冲突用的SessionKey，随意填写即可。
### const cache: Object
#### type: string
缓存类型，支持memcached和aliyun。后者需要npm install aliyun-sdk
#### host: string
缓存服务器地址，可用socket
#### auth: bool
是否打开身份验证
#### authUser: string
身份验证账号
#### authPassword: string
身份验证密码
### const ext: Object
通过直接清空该对象内的内容，你可以直接停用新浪微博扩展和自动封号扩展。

## 搭配项目

- [danmu-client](https://github.com/zsxsoft/danmu-client)
- [screen-controller](https://github.com/zsxsoft/screen-controller)

## 负载测试

环境：
> Linux 3.10.0-123.9.3.el7.x86_64

> Intel(R) Xeon(R) CPU E5-2630 @ 2.30GHz

> 512MB

> node v0.12.1

> mariadb-server.x86_64 1:5.5.41-2.el7_0

> 阿里云杭州机房D，一个福州联通客户端连接。缓存选用OCS。 

> ab -n 6000 -c 1000 -v 4  -p "post.txt" -C "weibo=嘛就这样;connect.sid=啊啊" -T "application/x-www-form-urlencoded" http://127.0.0.1:3000/post

默认配置，开启新浪微博登录，开启自动封禁。QPS 225.38 / 241.58
		
默认配置，关闭新浪微博登录，关闭自动封禁。QPS 461.97 / 431.51

默认配置，删除日志输出，关闭新浪微博登录，关闭自动封禁。QPS 720.89 / 812.66


环境：
 > iojs v1.8.1
 
默认配置，开启新浪微博登录，开启自动封禁。QPS 444.42 / 536.25

默认配置，关闭新浪微博登录，关闭自动封禁。QPS 633.99 / 865.28

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