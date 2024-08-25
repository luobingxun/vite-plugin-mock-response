function App() {
  const fetchInfo = async (url, method) => {
    return await fetch(url, { method }).then(res => res.json());
  };

  return (
    <>
      <button
        onClick={() => {
          console.log(fetchInfo('/users', 'get'));
        }}
      >
        请求users数据
      </button>
      <button
        onClick={() => {
          console.log(fetchInfo('/post_info', 'POST'));
        }}
      >
        请求post_info数据
      </button>
      <button
        onClick={() => {
          console.log(fetchInfo('/info', 'get'));
        }}
      >
        请求info数据
      </button>

      <button
        onClick={() => {
          console.log(fetchInfo('/test', 'get'));
        }}
      >
        请求test数据
      </button>

      <button
        onClick={() => {
          console.log(fetchInfo('/demo', 'get'));
        }}
      >
        请求demo数据
      </button>
    </>
  );
}

export default App;
