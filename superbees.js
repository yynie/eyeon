
var readline = require('readline');//cnpm install readline -g
var request = require('request'); //cnpm install request -g

var app = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var DOMAIN = '192.168.20.120';//'localhost';
var PORT = '10088';
var phones = ['460001234567890','460015216260744','460015378819048','460025216269999'];
var URL_BASE = '';
var excuteId = null;
var bees = [
  {job:'get-task', taskcode:null, step:0, data:null},
  {job:'get-task', taskcode:null, step:0, data:null},
//  {job:'get-task', taskcode:null, step:0, data:null},
//  {job:'get-task', taskcode:null, step:0, data:null},
];
var currentBee = 0;

var bogus0 = [
  {from:"10658080",recv:"绑定验证码为:751170(有效期30分钟)或者直接点击激活链接http://u.cmread.com/VjUjQFA【中国移动　咪咕阅读】"},
  {from:"10086",recv:"尊敬的客户，您好！您于2017年11月25日14点49分点播了由咪咕数媒公司提供的阅读业务，资费5元。如有费用疑问可在1小时内发送125983676到10086901，我们将进行核查处理。【中国移动】"},
  {send:"125983676",sendto:"10086901",sendok:1},
  {from:"10086",recv:"您好！您的意见已收到，本次您该业务将不扣除费用。感谢使用，中国移动"}
]

var bogus1 = [
  {from:"10658080",recv:"绑定一号小蜜蜂验证码为:000000(有效期30分钟)或者直接点击激活链接http://u.cmread.com/VjUjQFA【中国移动　咪咕阅读】"},
  {from:"10086",recv:"一号小蜜蜂，您好！您于2017年11月25日14点49分点播了由咪咕数媒公司提供的阅读业务，资费5元。如有费用疑问可在1小时内发送125983676到10086901，我们将进行核查处理。【中国移动】"},
  {send:"125983676一号小蜜蜂",sendto:"00000000",sendok:1},
  {from:"10086",recv:"您好！一号小蜜蜂，本次您该业务将不扣除费用。感谢使用，中国移动"}
]

var bogusarr = [
  bogus0,bogus1
]

app.setPrompt('SuperBees> ');
app.question("Input Domain <" + DOMAIN + ">?",function(answer){
  if(answer.trim().length>0){
    DOMAIN = answer.trim();
  }
  console.log("Domain:"+DOMAIN);
  app.question("Input Port <" + PORT + ">?",function(answer){
    if(answer.trim().length>0){
      PORT = answer.trim();
    }
    console.log("Port:"+PORT);
    URL_BASE = "http://"+DOMAIN+":"+PORT+"/vaddservice"
    console.log("url start with:"+URL_BASE);
    app.question("start ?(Y/n)",function(answer){
      if(answer.trim() === 'Y'){
        kickOff();
        app.prompt();
      }else{
        app.close();
      }
    })
  })
});

app.on('line', function(line) {
  switch(line.trim()) {
  case 'quit':
  case 'exit':
    app.close();
  break;
  default:
    console.log('unknown cmd!');
  break;
  }
  app.prompt();
});

app.on('close', function() {
  console.log('bye bye!');
  if(excuteId !== null){
    clearInterval(excuteId);
  }
  process.exit(0);
});

function kickOff(){
  console.log('kickOff');
  excuteId = setInterval(function(){
    var imsi = phones[currentBee];
    var TAG = "Bee("+currentBee+")["+imsi+"]::";
    switch(bees[currentBee].job) {
    case 'get-task':
    console.log(TAG + "check task");
    request(URL_BASE + "/pntapi/v4/packtasks?force=true&imsi="+imsi, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
        //console.log("json="+JSON.stringify(json));
        if(json.state === '200000'){
          if(('result' in json) && ('taskcode' in json.result)){
            bees[currentBee].taskcode = json.result.taskcode;
            bees[currentBee].job = 'working';
            bees[currentBee].step = 0;
            var mydata = bogusarr[currentBee%2];
            bees[currentBee].data = genTaskData(mydata,bees[currentBee].step);
            console.log(TAG + "got one task");
          }else{
            console.log(TAG + "no task");
          }
          currentBee = (currentBee + 1)%bees.length;
          app.prompt();
        }else{
          forceQuit(json.statemsg);
        }
      }else{
        forceQuit(error);
      }
    })
    break;
    case 'working':
    console.log(TAG + "working step="+bees[currentBee].step);
    request(
      { url: URL_BASE + "/pntapi/v4/packtasks/taskcode/" + bees[currentBee].taskcode + "/commit?imsi=" + imsi,
        method: "POST",json: true,headers: {"Content-Type": "application/json"},
        body: bees[currentBee].data
      },
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          if(body.state === '200000'){
            bees[currentBee].step ++;
            var mydata = bogusarr[currentBee%2];
            bees[currentBee].data = genTaskData(mydata,bees[currentBee].step);
            if(bees[currentBee].data === null){
              console.log(TAG + "finish task("+bees[currentBee].taskcode+")");
              bees[currentBee].step = 0;
              bees[currentBee].taskcode = null;
              bees[currentBee].job = 'get-task';
            }
            currentBee = (currentBee + 1)%bees.length;
            app.prompt();
          }else{
            console.log(TAG + "working step("+bees[currentBee].step+") failed");
            forceQuit(body.statemsg);
          }
        }else{
          forceQuit(error);
        }
    });
    break;
    }
  },10*1000);
}

function genTaskData(mydata,step){
  if(step < mydata.length){
    return mydata[step];
  }
  return null;
}
function forceQuit(error){
  console.error("forceQuit:"+error);
  app.close();
}

// var DOMAIN = "http://192.168.20.120:10088/vaddservice/";
// var phones = ['460001234567890','460015216260744','460015378819048','460025216269999'];

// request(DOMAIN + "pntapi/v1/verifytasks?imsi="+phones[0], function (error, response, body) {
//   console.log("error:"+error) 
//   console.log("response:"+response) 
//   if (!error && response.statusCode == 200) {
//     console.log(body) 
//   }
// })