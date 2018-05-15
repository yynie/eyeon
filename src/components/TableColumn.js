export const historyColumns = () => {
  return [
    {
      key: 'phonenum',
      title: '号码',
      fixed: 'left',
      width: 112
    },
    {
      key: 'createtime',
      title: '创建于',
      width: 150
    },
    {
      key: 'status',
      title: '状态',
      width: 116,
      render: (h, params) => {
        var color = ''
        var text = '';
        var S_RECVD = 0x0002;
        var S_RECVD2VCP = 0x0004;
        var S_SENT = 0x0008;
        var S_CONCLUDED = 0x0010;
        var S_FEE = 0x0040;
        var S_RECVD_TIMEOUT = 0x0080;
        if(params.row.status===0){
          text = '未取号';
        }else if(params.row.status===1){
          color = '#ff7700';
          text = '取号';
        }else if((S_RECVD === (params.row.status & S_RECVD)) && (S_RECVD2VCP !== (params.row.status & S_RECVD2VCP))){
          text = '返码时断线';
        }else if(S_RECVD_TIMEOUT === (params.row.status & S_RECVD_TIMEOUT)){
          text = '返码超时';
        }else{
          if(S_SENT === (params.row.status & S_SENT)){
            text = '发信成功'
          }
          if(S_RECVD2VCP === (params.row.status & S_RECVD2VCP)){
            // if(text !== ''){
            //   text+='|';
            // }
            text = '已返码';
          }
          if(S_FEE === (params.row.status & S_FEE)){
            color = 'green';
            text += ' ￥'
          }
        } 

        return h('span', {
                style: {
                    fontSize:'13px',
                    marginLeft:'10px',
                    color: color
                }
            },text)
      }
    },
    {
      key: 'verifysms',
      title: '最后一条短信',
      width: 680
    },
    {
      key: 'verifycode',
      title: '验证码？',
      width: 92
    },
    {
      key: 'updatetime',
      title: '更新于',
      width: 150
    },
  ]
};