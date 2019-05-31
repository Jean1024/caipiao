const CaipiaoMachine = require("./caipiao")
const dataurl = "http://f.apiplus.net/dlt.json"
const config = require('./config')


const machine = new CaipiaoMachine(dataurl,config)
machine.getData().getPriceInfo().getHtml().getMyPriceHtml().sendMail()

