//发送ajax请求动态创建数据
$(function () {



  //page和pagesize不能写死需要根据数据动态创建
  var currentPage = 1
  var pageSize = 5

  var currentId; // 当前的用户id
  var isDelete; // 修改的状态

  render();
  //封装一个函数用来渲染页面
  function render() {
    $.ajax({
      type: 'get',
      url: '/user/queryUser',
      data: {
        page: currentPage,
        pageSize: pageSize,
      },
      dataType: 'json',
      success: function (info) {
        $('tbody').html(template("tmp", info))


        //分页插件在ajax请求数据回来的时候渲染分页
        $('#paginator').bootstrapPaginator({
          //版本号
          bootstrapMajorVersion: 3,
          //当前页
          currentPage: info.page,
          //总页数
          totalPages: Math.ceil(info.total / info.size),
          //给每个页码添加点击事件  4个参数前面三个可以随便写
          onPageClicked: function (a, b, c, page) {
            //让当前页的值赋等于点击的页码
            currentPage = page
            //重新渲染页面
            render()
          }

        })
      }

    })
  }

  //点击按钮显示模态框
  $('tbody').on('click', '.btn', function () {
    $('#userModal').modal('show');

    //获取当前元素父亲的id
    currentId = $(this).parent().data('id')
    //根据按钮的类名，觉定用户修改成什么按钮
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1
  })

  $('#usertBtn').click(function () {
    $.ajax({
      type: 'post',
      url: '/user/updateUser',
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: 'json',
      success: function (info) {
        if (info.success) {
          //关闭模态框
          $('#userModal').modal('hide')
          //重新渲染页面
          render()
        }
      }

    })
  })


})