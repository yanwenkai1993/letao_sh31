$(function () {

  var page = 1
  var pageSize = 5

  //一进页面发送ajax请求
  //封装一个函数用于渲染页面
  render()

  function render() {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: page,
        pageSize: pageSize,
      },
      dataType: 'json',
      success: function (info) {

        $('tbody').html(template('secondTmp', info))

        //数据返回时渲染页面
        $('#paginator').bootstrapPaginator({
          //指定版本号
          bootstrapMajorVersion: 3,
          //当前页数
          page: info.page,
          //总页数
          totalPage: Math.ceil(info.toatl / info.size),
          //给页码添加点击事件
          onPageClicked: function (a, b, c, page) {
            //更新当前页
            page = page
            //重新渲染页面
            render()
          }
        })
      }
    })
  }


  //点击按钮让模态框显示
  $("#idBtn").click(function () {
    $('#secondModal').modal('show');
    //动态获取分类数据
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 200
      },
      dataType: 'json',
      success: function (info) {
        console.log(info)
        $('.dropdown-menu').html(template('secondTmp2', info))
      }
    })

  })








  $('.dropdown-menu').on("click", 'a', function () {
    // 获取文本值
    var txt = $(this).text();
    // 设置给按钮
    $('#dropdownText').text(txt);

    // 获取 id
    var id = $(this).data("id");
    // 设置给隐藏域
    $('[name="categoryId"]').val(id);

    // 调用updateStatus更新 隐藏域 校验状态成 VALID
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")
  });


  //配置文件上传插件，让插件发送异步请求
  $('#fileId').fileupload({
    dataType: 'json',
    done: function (e, data) {


      //后台返回的数据
      var picObj = data.result
      //获取图片地址，设置给 img src 
      var picUrl = picObj.picAddr
      $('#imgBox img').attr('src', picUrl)
      $('[name="brandLogo"]').val(picUrl);
      //调用插件完成更新 隐藏域 校验状态成 VALID
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
    }
  })

  //添加表单校验功能
  $('#form').bootstrapValidator({
    //重置排除想，然隐藏域也能校验
    excluded: [],
    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  })



  //阻止表单校验，使用ajax发送请求
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault()
    //发送ajax请求
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:$('#form').serialize(),//因为图片已经把地址赋值给了隐藏域所以可以使用表单序列化提交
      dataType:'json',
      success:function(info){
        console.log(info)
        if(info.success){
          //关闭模态框
          $('#secondModal').modal("hide")
          //重新渲染第一页
          paga=1
          render();
          //重置表单
          $('#form').data('bootstrapValidator').resetForm(true)
        }
      }
    })
  })

  

})