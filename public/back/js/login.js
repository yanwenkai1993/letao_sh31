$(function () {
  $('#form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      //校验用户名
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            max: 12,
            min: 2,
            message: '用户名必须2-12位'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
          message:'密码不能为空'
          },
          stringLength:{
            max:20,
            min:6,
            message:'密码必须由6-20位'
          }
        }
      }
    }
  })
 //阻止表单自己提交，使用ajax提交
 $('#form').on('success.form.bv',function(e){
  e.preventDefault()//阻止了表单提交

   //使用ajax提交
   $.ajax({
     type:'post',
     url:'/employee/employeeLogin',
     data:$('#form').serialize(),
     dataType:'json',
     success: function(info){
       console.log(info);
       if(info.error===1000){
         alert('用户名不存在')
       }
       if(info.error===1001){
         alert('密码错误')
       }
       if(info.success){
         location.href='index.html'
       }
     }
   })
 })
  //重置表单
  $('[type=reset]').click(function(){
    $('#form').data('bootstrapValidator').resetForm()
  })

})