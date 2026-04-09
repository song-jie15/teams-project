import axios from "axios";

// 创建实例
const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 3000,
  headers: { 'X-Custom-Header': 'foobar' }
});

// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    //config是请求配置对象
    //再发送请求之前应该做什么（如果是登录用户的话 在请求头中添加token信息）
    if(sessionStorage.getItem('token')){
        config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  function (response) {
    //2xx状态码都会触发该函数
    //响应成功处理
    //response:AxiosResponsed对象  代表的是axios封装的响应对象
    return response.data;//api接口返回的数据
  },
  function (error) {
    //超出2xx: 范围状态码都会触发该函数
    //1xx:请求已发送  服务器正在处理
    //2xx:请求成功
    //3xx:重定向
    //4xx:客户端错误
    //5xx:服务器错误
    //响应错误处理
    console.log(error.response.status);
    //未登录
    if (error.response.status === 401) {
      //跳转到登录页面
      window.location.href = '/login';
    }else if (error.response.status === 403) {
      //跳转到403页面
      window.location.href = '/403';
    } else if (error.response.status === 404) {
      //跳转到404页面
      window.location.href = '/404';
    }else if (error.response.status === 500) {
      //跳转到500页面
      window.location.href = '/500';
    }
    return Promise.reject(error);
  }
);

export default instance;