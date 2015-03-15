module.exports = {
	"manage": {
		"password": "123456", // 管理页面密码
	},
	"danmu": {
		"keyword": {
			"block": "testkeyword", // 拦截关键词
			"replacement": "keyword2" // 替换关键词
		},
		"blockusers": [ // 封禁用户
		],
		"check": false, // 审核开关
		"length": 100 // 队列最大长度
	},
	"database": {
		"type": "mysql", // 数据库类型
		"server": "127.0.0.1", // 数据库地址
		"username": "root", // 数据库用户名
		"password": "123456", // 数据库密码
		"db": "danmu", // 数据库
		"table": "danmu" // 数据表
	},
	"websocket": {
		"password": "clientpassword", // 客户端和服务端连接密码
		"interval": 100, // 弹幕发送间隔
		"singlesize": 10 // 每次弹幕发送数量
	},
	"http":{
		"port": 3000 // 服务器端口
	}
}