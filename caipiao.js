const http = require("http");
const nodemailer = require("nodemailer");
class CaipiaoMachine{
    constructor(url,key) {
        this.dataurl = url
        this.key = key
        this.queueList = [() => console.log('开始抓取数据!')]
        setImmediate(async () => {
            for (let todo of this.queueList) {
              await todo()
            }
        })
    }
    /**
     * 
     * @return {Promise} promise对象
     */
    setData() {
        const _this = this
        return () => new Promise((resolve, reject) => {
            let str = "";
            http.get(_this.dataurl, function(res) {
                res.on("data", function(data) {
                    str += data;
                });
                //接收完成
                res.on("end", function() {
                    _this.data = str
                    resolve(str);
                });
                res.on("error", function(e) {
                    reject(e);
                });
            });
        });
    }
    getData(){
        this.queueList.push(this.setData())
        return this
    }
    /**
     * @description 发送邮件
     * 
     * @param {String} html html字符串
     */
    sendMail(){
        const _this = this
        this.queueList.push(() => new Promise((resolve,reject) =>{
            console.log("开始发送邮件....")
            let transporter = nodemailer.createTransport({
                // host: 'smtp.ethereal.email',
                service: "qq", // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
                port: 465, // SMTP 端口
                secureConnection: true, // 使用了 SSL
                auth: {
                    user: "376327918@qq.com",
                    // 这里密码不是qq密码，是你设置的smtp授权码
                    pass: _this.key
                }
            });
            let mailOptions = {
                from: '"木木" <376327918@qq.com>', // sender address
                to: "1737923789@qq.com", // list of receivers
                subject: "彩票来了", // Subject line
                // 发送text或者html格式
                // text: "test", // plain text body
                html: _this._html // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                resolve()
                console.log("邮件发送成功!");
            });
        }))
        return this
    }
    /**
     * @description 根据json数据生成html
     * 
     * @param {Object} obj json
     */
    getHtml(){
        const _this = this
        this.queueList.push(() => {
            const obj = (typeof _this.data) === "string" ? JSON.parse(_this.data): _this.data
            if(obj.data){
                console.log("抓取数据成功!")
                const _newest = obj.data[0]
                _this._html = `<h3>
                    <p>大乐透${_newest.expect}期开奖号码为：<b style="color:red;">${_newest.opencode}</b></p>
                        <p> 开奖时间：${_newest.opentime}</p>
                    <h3> `
                console.log("生成HTML结构")
            }else{
                console.log("抓取数据失败!")
            }
        })
        return this
    }
}

module.exports = CaipiaoMachine
