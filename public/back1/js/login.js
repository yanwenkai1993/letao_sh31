$(function () {

  $('#form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置校验字符
    fields: {
      username: {
        validators: {
          notEmpty: {
            message: "用户名不能为空"
          },
          stringLength: {
            min: 2,
            max: 12,
            message: "用户名长度必须6-12位"
          },
          callback: {
            message:"用户名不存在"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: '密码不能为空'
          },
          stringLength: {
            min: 6,
            max: 20,
            message: '密码长度必须6-12位'
          },
          callback: {
            message:"密码错误"
          }
        }
      }
    }
  })

  $('#form').on('success.form.bv', function (e) {
    //阻止表单的提交，使用ajax提交
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/employee/employeeLogin',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function (info) {
        console.log(info);
        if (info.error === 1000) {
         $('#form').data('bootstrapValidator').updateStatus('username','INVALID','callback')
          return
        }
        if (info.error === 1001) {
          $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback')
          return
        }
        if(info.success){
          location.href='index.html'
        }
      }
    })
  })

  //重置提交页面
  $('[type = reset]').click(function () {
    $('#form').data('bootstrapValidator').resetForm()
  })


})