$(function () {
  // 模态框显示
  $('.icon-right').click(function () {
    $('#myModal').modal('show')
  })
  //点击退出，发送ajax请求跳转到登陆页面，
  $('#logoutBtn').click(function () {
    //发送ajax请退出
    $.ajax({
      type: 'get',
      url: '/employee/employeeLogout',
      success: function (info) {
        if (info.success) {
          location.href = 'login.html'
        }
      }
    })
  })

  //侧边栏隐藏效果
  $('.icon-left').click(function () {

    $('.lt_offside').toggleClass('show')
    $('.lt_title').toggleClass('show')
    $('.headline').toggleClass('show')

  })
})
//进度条效果

  // 开启进度条
  NProgress.start();


$( document ).ajaxStop(function() {
  // 模拟网络延迟
  setTimeout(function() {
    // 关闭进度条
    NProgress.done();
  }, 2000)
});