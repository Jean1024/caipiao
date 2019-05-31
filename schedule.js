const schedule = require('node-schedule')
const CaipiaoMachine = require("./caipiao")
const dataurl = "http://f.apiplus.net/dlt.json"
const config = require('./config')

function scheduleCronstyle(){
    // 每周一、三、六开奖
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [1, 3, 6];
    rule.hour = 21;
    rule.minute = 0;

    schedule.scheduleJob(rule, function(){
        console.log('scheduleCronstyle:' + new Date());
        const machine = new CaipiaoMachine(dataurl,config)
        machine.getData().getPriceInfo().getHtml().getMyPriceHtml().sendMail()
    }); 
}

scheduleCronstyle();
