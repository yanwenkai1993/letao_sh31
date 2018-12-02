//一进页面发送ajax请求，渲染页面


$(function () {
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页条数

  var picArr = []; // 专门用于存储所有用于提交的图片对象

  // 1. 一进入页面, 发送ajax请求, 渲染商品列表
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        $('tbody').html(template('productTmp1', info))

        //在数据返回的时候渲染页面
        $('#paginator').bootstrapPaginator({
          //指定当前版本号
          bootstrapMajorVersion: 3,
          //当前页
          currentPage: info.page,
          //总页数
          totalPages: Math.ceil(info.total / info.size),
          //注册点击事件
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


  //点击按钮显示模态框

  $('#idBtn').click(function () {
    //模态框显示
    $('#addModal').modal('show')
  })

  //渲染二级列表
  $.ajax({
    type: 'get',
    url: '/category/querySecondCategoryPaging',
    data: {
      page: 1,
      pageSize: 100
    },
    dataType: 'json',
    success: function (info) {
      $('.dropdown-menu').html(template('productTmp2', info))
    }
  })

  //给下拉列表的每个A注册点击事件

  $('.dropdown-menu').on("click", "a", function () {
    // 获取文本, 赋值给按钮
    var txt = $(this).text()
    $('#dropdownText').text(txt)

    // 获取id, 赋值给隐藏域
    var id = $(this).data("id")
    $('[name="brandId"]').val(id)

    // 将隐藏域的校验状态, 更新成 VALID
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
  })
  //配置文件上传插件
  $('#fileupload').fileupload({
    //返回的数据类型
    dataType: 'json',
    //文件上传完成后的回调函数
    done: function (e, data) {
      //接收后台返回的结果
      var picObj = data.result
      //将上传的图片对象添加到数组的最前面
      picArr.unshift(picObj)

      //图片地址
      var picUrl = picObj.picAddr
      //将每次上传完成的图片，显示在结构最前面
      $('#imgBox').prepend('<img src="' + picUrl + '" style="width:100px;">')
      //判断一下，如果超过3张就将最后一张移除

      if (picArr.length > 3) {
        //删除最后一张
        picArr.pop()
        //结构上也要删除最后一张
        $('#imgBox img:last-of-type').remove()
      }

      //如果文件上传满了3张，当前的校验状态，也要跟新
     if(picArr.length===3){
       $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID')
     }
    }
  })

  //添加表单校验
  $('#form').bootstrapValidator({
    //重置排除项，都校验，不排除隐藏项
   
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

  })

  //注册一个表单校验完成事件，阻止表单默认提交，使用ajax提交
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault()

    //集中表单中所以的数据
    var paramsStr = $('#form').serialize()

    //还要拼接上所有图片的数据
    paramsStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    paramsStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    paramsStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

    //一起提交
    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data: paramsStr,
      dataType: 'json',
      success: function (info) {
        //判断一下，如果成功了就关闭模态框，重新渲染第一页
        if (info.success) {
          //关闭模态框
          $('#addModal').modal('hide')
          currentPage = 1
          render()
          //重置表单和状态
          $('#form').data('bootstrapValidator').resetForm(true)

          //按钮的文本和图片需要手动重置
          $('#dropdownText').text('请选择二级分类')
          $('#imgBox img').remove()

          //数组页需要清空
          picArr = []

        }
      }
    })


  })


})