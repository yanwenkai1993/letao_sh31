// 一进入页面就发送ajax请求，请求数据

$(function () {
  //发送ajax请求，请求数据渲染到页面
  var page = 1
  var pageSize = 5


  //声明一个空数组用来存放用于提交的图片对象
  var picArr = []
  //只要操作页面就要渲染页面所谓我们封装一个函数，来渲染页面
  //一开始就调用一下渲染页面
  render()

  function render() {
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: page,
        pageSize: pageSize,
      },
      dataType: 'json',
      success: function (info) {

        //添加到页面上
        var htmlStr = template("productTmp1", info);
        $('tbody').html(htmlStr);
        //在数据返回的时候动态渲染分页


        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, //指定当前版本号
          currentPage: info.page, //当前页
          totalPage: Math.ceil(info.total / info.size), //总页数，数据的总条数/当前一页的条数
          //给每个页码注册点击事件
          onPageclicked: function (a, c, b, page) {
            //更新当前页
            page = page
            //渲染页面
            render()
          }
        })
      }
    })
  }

  //点击按钮显示模态框
  $('#idBtn').click(function () {
    $('#productModal').modal('show')

    //发送ajax请求渲染添加分类列表
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 100,
      },
      dataType: 'json',
      success: function (info) {
        $('.dropdown-menu').html(template('productTmp2', info))
      }
    })

  })

  //给下拉列表的a注册点击事件
  $('.dropdown-menu').on('click', 'a', function () {
    //获取当前的内容赋值给ul
    var txt = $(this).text()
    $('#dropdownText').text(txt)
    //获取id
    var id = $(this).data('id')
    //赋值给隐藏域
    $('[name="brandId"]').val(id)
    //将隐藏域的表单校验改成，valid
    $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID')

  })
  //使用插件配置文件上传
  $('#fileupload').fileupload({
    //返回的数据
    dataType: 'json',
    //文件上传完成时候的回调函数
    done: function (e, data) {
      console.log(data.result);
      var picObj = data.result;
      //将上传的图片对象添加到数组中
      picArr.unshift(picObj)

      //图片地址
      var picUrl = picObj.picAddr
      //将每次上传完成的图片，显示在结构的最前面

      $('#imgBox').prepend('<img src="' + picUrl + '" style="width: 100px;">')

  //然后在判断一下，数组中图片地址的长度超过三张，就将最后一张移除
  if(picArr.length > 3){
    picArr.pop();//删除最后一张图片地址
    //图片也要在页面上不显示
    $('#imgBox img:last-of-type').remove()//删除最后一张图片

  }
  //如果文件上传满了3张，当前的转态就改成VALID
  if(picArr.length === 3){
    $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID')
  }
    }
  })
//添加表单校验效果
$('#form').bootstrapValidator({
  // 重置排除项, 都校验, 不排除
  excluded: [],

  // 配置校验图标
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok', // 校验成功
    invalid: 'glyphicon glyphicon-remove', // 校验失败
    validating: 'glyphicon glyphicon-refresh' // 校验中
  },

  // 配置校验字段
  fields: {
    brandId: {
      validators: {
        notEmpty: {
          message: "请选择二级分类"
        }
      }
    },
    proName: {
      validators: {
        notEmpty: {
          message: "请输入商品名称"
        }
      }
    },
    proDesc: {
      validators: {
        notEmpty: {
          message: "请输入商品描述"
        }
      }
    },
    num: {
      validators: {
        notEmpty: {
          message: "请输入商品库存"
        },
        //正则校验
        // \d  0-9
        // ?   0次或1次
        // +   1次或多次
        // *   0次或多次
        // {n,m}  出现n次到m次
        // {n}  出现n次
        regexp: {
          regexp: /^[1-9]\d*$/,
          message: '商品库存格式, 必须是非零开头的数字'
        }
      }
    },
    size: {
      validators: {
        notEmpty: {
          message: "请输入商品尺码"
        },
        //正则校验
        regexp: {
          regexp: /^\d{2}-\d{2}$/,
          message: '尺码格式, 必须是 xx-xx格式, xx为两位数字, 例如 36-44'
        }
      }
    },
    oldPrice: {
      validators: {
        notEmpty: {
          message: "请输入商品原价"
        }
      }
    },
    price: {
      validators: {
        notEmpty: {
          message: "请输入商品现价"
        }
      }
    },
    picStatus: {
      validators: {
        notEmpty: {
          message: "请上传3张图片"
        }
      }
    }
  }
});
//阻止表单校验

})