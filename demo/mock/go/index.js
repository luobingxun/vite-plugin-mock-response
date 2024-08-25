export default [
  {
    url: '/test',
    status: 200,
    method: 'GET',
    response: (req, res) => {
      return {
        code: 0,
        message: '请求成功',
        data: [
          {
            name: 'John',
            age: 34,
            adrress: '上海市asdasd'
          }
        ]
      };
    }
  }
];
