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
      width: 114,
      render: (h, params) => {
        var color = ''
        var text = ''+ params.row.status;
        if(params.row.status===0){
          text = '未返号';
        }else if(params.row.status===1){
          color = '#ff7700';
          text = '已返号';
        }else if(params.row.status===3){     
          text = '返码时断线';
        }else if(params.row.status===103 || params.row.status===119){
          color = 'green';
          text = '已返码';
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