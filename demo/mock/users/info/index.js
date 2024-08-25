export default [
  {
    url: '/info',
    status: 200,
    method: 'GET',
    response: (req, res) => {
      return {
        code: 0,
        message: '请求成功',
        data: [
          {
            id: 7114,
            username: '吴晓鹏',
            email: 'xiaopeng.wu@xyuqing.com',
            wx_id: '',
            create_user: 'bjzh2！@#￥！@#￥！@￥',
            updated_at: '2024-07-16 13:49:55',
            wx_openid: '',
            wechat_group: '',
            feishu_group: '',
            contact_type: 1,
            feishu_url: '',
            feishu_openid: '',
            dingtalk_group: '',
            dingtalk_sign: '',
            dingtalk_url: '',
            created_at: '2024-05-30 22:12:41',
            mobile: '',
            group_name: ''
          }
        ]
      };
    }
  }
];
