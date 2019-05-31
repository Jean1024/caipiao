const http = require("http");
const nodemailer = require("nodemailer");
class CaipiaoMachine{
    constructor(url,config) {
        this.dataurl = url
        this.config = config
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
                    pass: _this.config.key
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
    
    /**
     * @description 根据json数据生成html
     * 
     * @param {Object} obj json
     */
    getMyPriceHtml(){
        this.queueList.push(() => {
            let _str = ``
            this.config.codelist.forEach((item,i) => {
                _str += `
                    <h3>
                        <p>
                            第${i + 1}注【${item.front.join(',')} + ${item.back.join(',')}】 <b style="color:red;">${item.money}</b>
                        </p>
                    <h3>`
            });
            this._html += _str
        })
        return this
    }
    /**
     * @description 获取中奖信息
     */
    getPriceInfo(){
        this.queueList.push(() => {
            this.config.codelist.map(item => {
                item.chosen = this.compareCode(item)
                item.money = this.getReward(item.chosen)
            })
        })
        return this
    }
    /**
     * 
     * @param {Object} obj 您的号码
     */
    compareCode(obj){
        let code = (typeof this.data) === 'string' ? JSON.parse(this.data) : this.data
        code = code.data[0]['opencode'].split("+")
        let front = code[0].split(",").map(item => {
            return parseInt(item)
        })
        let back = code[1].split(",").map(item => {
            return parseInt(item)
        })
        let samefront = obj.front.filter(v => front.includes(v))
        let sameback = obj.back.filter(v => back.includes(v))
        return [samefront,sameback]
    }
    /**
     * 
     * @param {Array} 选中的号码
     * 
     * @return {Object} 中奖信息
     */
    getReward(codeArr){
        const len1 = codeArr[0]['length']
        const len2 = codeArr[1]['length']
        if(len1 === 5 && len2 === 2){
            return '一等奖'
        }else if(len1 === 5 && len2 === 1){
            return '二等奖'
        }else if(len1 === 5 && len2 === 0){
            return '三等奖[10000]'
        }else if(len1 === 4 && len2 === 2){
            return '四等奖[3000]'
        }else if(len1 === 4 && len2 === 1){
            return '五等奖[300]'
        }else if(len1 === 3 && len2 === 2){
            return '六等奖[200]'
        }else if(len1 === 4 && len2 === 0){
            return '七等奖[100]'
        }else if((len1 === 3 && len2 === 1) || (len1 === 2 && len2 === 2)){
            return '八等奖[15]'
        }else if((len1 === 3 && len2 === 0) || (len1 === 2 && len2 === 1) || (len1 === 1 && len2 === 2) || (len1 === 0 && len2 === 2)){
            return '九等奖[5]'
        }else{
            return '未中奖'
        }
    }
}

module.exports = CaipiaoMachine
