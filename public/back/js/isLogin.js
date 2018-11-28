//一进页面，就发送ajax请求，查询是否是用户登录，如果没有登录，返回到登录页面

$.ajax({
  type:'get',
  url:'/employee/checkRootLogin',
  dataType:'json',
  success: function(info){
    console.log(info);
    if(info.error===400){
      location.href='login.html'
    }
    
  }
})