$(function(){


  //模态框显示和隐藏
  $('.icon_right').click(function(){
    $('#logoutModal').modal('show')
  })
  //点击退出按钮退出模态框，完成退出功能
  $('#logoutBtn').click(function(){
   $.ajax({
     type:'get',
     url:"/employee/employeeLogout",
     dataType:'json',
     success: function(info){
       if(info.succsee){
         location.href='login.html';
       }
     }
    
  })

})