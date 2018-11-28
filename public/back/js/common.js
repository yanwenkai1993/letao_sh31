$( document ).ajaxStart(function() {
  // 开启进度条
  NProgress.start();
})

$( document ).ajaxStop(function() {
  // 模拟网络延迟
  setTimeout(function() {
    // 关闭进度条
    NProgress.done();
  }, 5000)
});





$(function () {
  $('.classify').click(function () {
    $(this).next().stop().slideToggle()
  })

  $('.icon_left').click(function () {
    $('.lt_info').toggleClass('heid')
    $('.lt_title').toggleClass('heid')
    $('.lt_sidebar').toggleClass('heid')
  })

  $('.icon_right').click(function () {
    $('#myModal').modal('show')
  })
  //点击退出按钮退出模态框，销毁登录状态
  $('#logoutBtn').click(function () {
    $.ajax({
      type: 'get',
      url: '/employee/employeeLogout',
      success: function (info) {
        console.log(info);
        if (info.success) {
          location.href = 'login.html'
        }
      }
    })
  })
})

//进度条效果

 


 
    // Nprogress.done();
