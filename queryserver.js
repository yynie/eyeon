/* node.js 作为后台在ali从库上执行数据库查询
* 需要安装 cnpm install mysql -g， 可选安装 cnpm install @types/mysql -g
* 使用express做框架  cnpm install express -g
* 要上传json数据  cnpm install body-parser -g
* moment 处理时间容易一点   cnpm install moment -g
*/
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql  =require("mysql");
var moment = require('moment'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** 跨越代码 上线可以屏掉 利用nginx代理*/
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

/** 这个后端只做C站从库的只读查询 */
var base = "/qserver/";
var poolrdonly = mysql.createPool({  
  host: '106.14.9.175',  
  user: 'mysql',  
  password: 'MySQL56Meng',  
  database: 'vaddservice',  
  port: '3188'
}); 

//get vcpapi/v1/history?query={"apikey":"490b748b4390c4ce34bca948413ff8b9","subid":"","page":"1","pagesize":"30","startfrom":"2018-05-08","endto":"2018-05-14"}
app.get(base+'vcpapi/v1/history', function(req, res){
  console.log("get vcpapi/v1/history?query=" + JSON.stringify(req.query));
  var apikey =req.query.apikey;
  var subid = req.query.subid;
  var page = parseInt(req.query.page);
  if((page === undefined) || isNaN(page) || (page < 1)){
    page = 1;
  }
  var pagesize = parseInt(req.query.pagesize);
  var startfrom = req.query.startfrom;
  var endto = req.query.endto;
  var retdata = {
    err:String,
    items:Array,
    total:0
  }
  //console.log("startfrom="+startfrom)
  if(apikey === undefined || apikey.trim().length === 0 || isNaN(pagesize) 
      || startfrom === undefined || startfrom.trim().length === 0 
      || endto.trim().length === 0 || endto === undefined){
    retdata.err="参数错误";
    res.status(200).json(retdata);
    return;
  }
  var end = moment(endto).subtract(-1,'days').format('YYYY-MM-DD');
  if(endto.trim().length === 0 || endto === undefined|| endto === null){
    retdata.err="参数错误";
    res.status(200).json(retdata);
    return;
  }
  if(pagesize === 0){
    retdata.items=[];
    res.status(200).json(retdata);
    return;
  }
  

  var sql = 'SELECT count(1) as total FROM t_verifytask WHERE apikey=\''+apikey+'\'';
  var sqlold = 'SELECT count(1) as total FROM t_verifytaskfail WHERE apikey=\''+apikey+'\'';
  if(subid !== undefined && subid.trim().length>0){
    sql += ' AND subid=\''+subid+'\'';
    sqlold += ' AND subid=\''+subid+'\'';
  }
  sql += ' AND createtime>timestamp(\''+startfrom+'\') AND createtime<timestamp(\''+end+'\')';
  sqlold += ' AND createtime>timestamp(\''+startfrom+'\') AND createtime<timestamp(\''+end+'\')';
  var sqlunion = sql + ' UNION ALL ' + sqlold;
  //console.log(sqlunion);
  poolrdonly.getConnection(function(err,conn){
    if(err){
      res.status(500).json({error:err});
    }else{
      conn.query(sqlunion,function(err,results,fields){
        if(err){
          conn.release();
          res.status(500).json({error:err});
        }else{
          retdata.total=results[0]['total']+results[1]['total'];
          //console.log(retdata.total);
          if(retdata.total === 0){
            conn.release();
            retdata.items=[];
            res.status(200).json(retdata);
          }else{
            var offset = (page - 1) * pagesize;
            sql = sql.replace('count(1) as total','phonenum,createtime,verifysms,verifycode,status,updatetime');
            sqlold = sqlold.replace('count(1) as total','phonenum,createtime,verifysms,verifycode,status,updatetime');
            sqlunion = sql + ' UNION ALL ' + sqlold + ' ORDER BY createtime desc LIMIT ' + offset + "," + pagesize;
            //console.log(sqlunion);
            conn.query(sqlunion,function(err,results,fields){ 
              conn.release();
              if(err){
                res.status(500).json({error:err});
              }else{
                retdata.items=[...results];
                //console.log(JSON.stringify(retdata.items));
                res.status(200).json(retdata);
              }
            })
          }
        }
      })
    }
  })
});

var server = app.listen(3000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("vcpweb-query-backend http://%s:%s", host, port)
 
})