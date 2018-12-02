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
  $('#fileupload').fileupload({
    dataType: "json",
    // done 表示文件上传完成的回调函数
    done: function( e, data ) {
      //console.log( data );
      //console.log( data.result ); // 后台返回的对象

      var picObj = data.result; // 后台返回的数据
      // 获取图片地址, 设置给 img src
      var picUrl = picObj.picAddr;
      $('#imgBox img').attr("src", picUrl);

      // 给隐藏域设置图片地址
      $('[name="brandLogo"]').val( picUrl );

      // 调用updateStatus更新 隐藏域 校验状态成 VALID
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
    }
  });


  // 5. 添加表单校验功能
  $('#form').bootstrapValidator({
    // 重置排除项, 都校验, 不排除
    excluded: [],

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 指定校验字段
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
  });


  // 6. 注册表单校验成功事件, 阻止默认的表单提交, 通过ajax提交
  $('#form').on("success.form.bv", function( e ) {

    e.preventDefault(); // 阻止默认的提交

    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 添加成功
          // 关闭模态框
          $('#addModal').modal("hide");
          // 页面重新渲染, 重新渲染第一页
          Page = 1;
          render();

          // 重置表单内容和状态, resetForm(true) 表示内容和状态都重置
          $('#form').data("bootstrapValidator").resetForm( true );

          // 由于下拉菜单和图片不是表单元素, 需要手动重置
          $('#dropdownText').text("请选择一级分类");
          $('#imgBox img').attr("src", "./images/none.png");
        }
      }
    })

  })


})