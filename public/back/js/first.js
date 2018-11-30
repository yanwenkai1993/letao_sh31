$(function () {
  var currentPage = 1
  var pageSize = 5


  //一进页面发送ajax请求
  render()


  function render() {
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize,
      },
      dataType: 'json',
      success: function (info) {
        $('tbody').html(template('firstTmp', info))


        //在ajax请求发送回来的时候渲染分页
        $('#paginator').bootstrapPaginator({
          //确认版本
          bootstrapMajorVersion: 3,
          currentPage: info.page, //当前页数
          //总页数
          totalPages: Math.ceil(info.total / info.size),
          //给页码添加点击事件
          onPageClicked: function (a, b, c, page) {
            //更新当前页
            currentPage = page
            //从新渲染页面
            render()
          }
        })
      }
    })
  }
  $('#idBtn').click(function() {
    $('#addModal').modal("show") // 显示
  });

  //进行表单校验
  $('#form').bootstrapValidator({
      // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:'请输入一级分类'
          }
        }
      }
    }
  })
   //阻止表单提交。发送ajax提交
   $('#form').on('success.form.bv',function(e){
     e.preventDefault()

     //发送ajax提交
     $.ajax({
       type:'post',
       url:'/category/addTopCategory',
       data:$('#form').serialize(),
       dataType:'json',
       success:function(info){
         if(info.success){
           //关闭模态框
           $('#addModal').modal("hide")
           //重新渲染页面，要渲染第一页
           currentPage=1
           render()


           //c重置表单
           $('#form').data('bootstrapValidator').resetForm(true)
         }
       }
     })
   })



  // 3. 进行表单校验
  // $('#form').bootstrapValidator({

  //   // 配置校验图标
  //   feedbackIcons: {
  //     valid: 'glyphicon glyphicon-ok',    // 校验成功
  //     invalid: 'glyphicon glyphicon-remove',   // 校验失败
  //     validating: 'glyphicon glyphicon-refresh'  // 校验中
  //   },

  //   // 校验字段
  //   fields: {    // input框中需要配置 name
  //     categoryName: {
  //       validators: {
  //         notEmpty: {
  //           message: "请输入一级分类名称"
  //         }
  //       }
  //     }
  //   }
  // });


  // 4. 注册表单校验成功事件, 阻止默认的提交, 通过  ajax 提交
  // $('#form').on("success.form.bv", function( e ) {
  //   e.preventDefault(); // 阻止默认的提交

  //   // 通过ajax提交
  //   $.ajax({
  //     type: "post",
  //     url: "/category/addTopCategory",
  //     data: $('#form').serialize(),
  //     dataType: "json",
  //     success: function( info ) {
  //       console.log( info );
  //       if ( info.success ) {
  //         // 关闭模态框
  //         $('#addModal').modal("hide");
  //         // 重新渲染页面, 渲染第一页
  //         currentPage = 1;
  //         render();

  //         // 重置表单的内容 和 状态
  //         // resetForm( true ); 表示内容和状态都重置
  //         // resetForm();   表示只重置状态
  //         $('#form').data("bootstrapValidator").resetForm(true)
  //       }
  //     }
  //   })
  // })

})