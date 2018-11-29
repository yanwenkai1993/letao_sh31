// 一进页面就发送ajax请求，用户是否登陆
$.ajax({
  type: 'get',
  url: '/employee/checkRootLogin',
  success: function (info) {
    if (info.error === 400) {
      location.href = 'login.html'
    }
  }
})