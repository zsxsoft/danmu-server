module.exports = {
	"rooms": {
		"default": {
			"display": "默认",
			"table": "room_default", // 数据表
			"connectpassword": "123456", // 客户端连接密码
			"managepassword": "123456", // 管理密码
			"keyword": {
				"block": "testkeyword", // 拦截关键词
				"replacement": "keyword2" // 替换关键词
			},
			"blockusers": [ // 封禁用户
				"test"
			],
			"maxlength": 100 // 队列最大长度
		}
	},
	"database": {
		"type": "mysql", // 数据库类型
		"server": "127.0.0.1", // 数据库地址
		"username": "root", // 数据库用户名
		"password": "123456", // 数据库密码
		"port": "3306", // 数据库端口
		"db": "danmu", // 数据库
	},
	"websocket": {
		"interval": 10, // 弹幕发送间隔
		"singlesize": 5 // 每次弹幕发送数量
	},
	"http": {
		"port": 3000 // 服务器端口
	},
	"env": {
		"childprocess": false // 多进程（child_process），在BAE上请关闭
	}
}