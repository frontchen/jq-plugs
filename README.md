# jq-plugs
# table
```js
    var Tables = new mwTable('table');//id
    var page = new mwPage('page');
    mwTables.init(columns);
    page.init();
    page.on('changePage', function (page) {
        pageIndex = page
    
    })
    
     var params = {
            url: url,
            data: data
        }
        mwUnits.getData(params).then(
         function (res) {
          
             $("#MaskCloud").css("display", "none")
             var pages = {
                 pageIndex,
                     pageSize: res.PageNumber,
                     pageTotal: Math.ceil(res.Count / res.PageNumber),
                     pageNumber: res.Count
             }
             page.init(pages)
             datas = res;
             datas.Data = JSON.parse(res.Data);
            console.log(datas);
             var datass = datas.Data;

             if (datass == null || datass.length == 0) {
                 $(".mw-table-body").html(createNoData());
             }
             if (datas.Result == 1 && datass.length > 0) {

                 var len = 20 - datas.Data.length;
                 if (len > 0) {
                     for (var i = 0; i < len; i++) {
                         datas.Data.push({})
                     }
                 }

                 mwTables.renderTable(datass);



             }

             if (datas.Result == 2) {
                 webConfigs.MessageBox(datas.Message).Show();
                 return;
             }
         },
         function (err) {
             $("#MaskCloud").css("display", "none")
             webConfigs.MessageBox("服务器繁忙，请稍后再试！").Show();
             return;
         }
         );
```
```cascader
  var goodsCascader = new mwCascader('goods-cascader');
    goodsCascader.init({
        placeholder: '商品信息',
        trigger: 'hover',
        width: "135",
    });
    //Cascader ajax options
    var cascaderAjax = {
        className: {

            url: webConfigs.webApiPath() + 'InitialPolicy/GetCustomerClassId',
            data: { 'iData': JSON.stringify({ iPageIndex: 1 }) },

        },
        brandName: {

            url: webConfigs.webApiPath() + 'InitialPolicy/GetCustomerBrandId',
            data: {},

        },
        goodsInfo: {

            url: webConfigs.webApiPath() + 'InitialPolicy/GetCustomerProduct',
            data: {},

        }
    };
    var dataList = {};//新增商品数据集合
    function goodsRender(obj, cb) {
        var depth = obj._depth + 1
        var options;
        switch (depth) {
            case 1:
                options = cascaderAjax.className;
                options.data = { 'iData': JSON.stringify({ iPageIndex: 1, BasePolicyInfoModel: BasePolicyInfoModel }) }
                break;
            case 2:
                options = cascaderAjax.brandName;
                options.data = { 'iData': JSON.stringify({ iPageIndex: 1, BasePolicyInfoModel: BasePolicyInfoModel, ClassId: obj._id }) }
                break;
            case 3:
                options = cascaderAjax.goodsInfo;
                options.data = { 'iData': JSON.stringify({ iPageIndex: 1, BasePolicyInfoModel: BasePolicyInfoModel, ClassId: obj._pid, BrandId: obj._id }) }
                break;
        }

        mwUnits.getData(options).then(
             function (res) {
                 if (res) {
                      
                     var data = JSON.parse(res.Data)
                     $.each(data, function (i, v) {
                         switch (depth) {
                             case 1:
                                 v._label = v.ClassName
                                 v._value = v.ClassId
                                 v._id = v.ClassId
                                 v._depth = depth
                                 v._pid = 0;
                                 v._count = v.FirstChildCount * 1 || 0;
                                 break;
                             case 2:
                                 v._label = v.BrandName
                                 v._value = v.BrandId
                                 v._id = v.BrandId
                                 v._depth = depth
                                 v._pid = obj._id;
                                 //
                                 v._count = v.SecondChildCount * 1 || 0;
                                 break;
                             case 3:
                                 var label = mwUnits.template('${className} ${brandName} ${stardName} ${modelName} ${gradeName} ${colorName} ${unitName}', {
                                     className: v.ClassName || '',
                                     brandName: v.BrandName || '',
                                     stardName: v.StardName || '',
                                     modelName: v.ModelName || '',
                                     gradeName: v.GradeName || '',
                                     colorName: v.ColorName || '',
                                     unitName: (v.GoodsUnitName || (v.UnitName || '')) + ' ' + formatUnitName(v.UnitAttrValues)
                                 })
                                 v._label = label
                                 v._value = v.ProductId
                                 v._id = v.ProductId
                                 v._depth = depth
                                 v._pid = obj._id;
                                 v._count = 0;
                                 break;
                         }

                     })
                     switch (depth) {
                         case 1:
                             data.unshift({
                                 _label: '<span style="color:#ccc;font-size:12px;">(品名)</span>',
                                 _value: '0000',
                                 _id: '0000',
                                 _depth: depth,
                                 _pid: 0,
                                 _count: 0
                             })
                             break;
                         case 2:
                             data.unshift({
                                 _label: '<span style="color:#ccc;font-size:12px;">品牌</span>',
                                 _value: '0000',
                                 _id: '0000',
                                 _depth: depth,
                                 _pid: obj._id,
                                 _count: 0
                             })
                             break;
                     }
                    
                     cb && cb(data)
                 }
             },
             function (err) {
                 console.log(['err', err]);
             }
         )
    }
   

    goodsCascader.on('on-change', function (val) {
        //if (val.length == 3) {
        var length=val.length-1;
        dataList = val[length];
        //}
        console.log(['on-change', val]);
    });
    goodsCascader.on('on-disable-child', function (val) {
        console.log(['on-disable-child', val]);
        goodsRender(val, function (data) {
            goodsCascader.renderChildList(val, data);
        });
    });

```
```select
 //初始化 客户名称下拉框
    var customerSelect = new erpSelects('customer-select');
    var CustomerConfigs = {
        url: 'BasePolicy/GetCustomerGroupListByPage',
        placeholder: '客户名称',
        data: { 'iData': JSON.stringify({ iPageIndex: 1 }) },
        resultObj: {
            labels: {
                groupid: 'GroupId',
                kind: 'Kind'

            },
            values: {
                Snm: 'Snm',
            }
        },
        nextGetData: function (obj) {
            //Type等于1,Status:状态等于0,CustomerId:客户Id,Flag:客户类别(群组:0,客户:1),iPageIndex:页索引,SearchName:模糊搜索字段

            if ($.isEmptyObject($(obj).data())) {
                $("#product-select .erp-select-ul").empty();
                $("#product-select.erp-select-input").val("");
                $("#product-select").css("pointer-events", 'none');
                customerSelect.clearProps();
                productSelect.clearProps();
            } else {
                $("#product-select .erp-select-ul").empty();
                $("#product-select .erp-select-input").val("");
                productSelect.clearProps();
                $("#product-select").css("pointer-events", 'all');
                ProductConfigs.data = {
                    'iData': JSON.stringify({
                        Type: Types,
                        Status: Status,
                        CustomerId: $(obj).data('groupid'),
                        Flag: $(obj).data("kind"),
                        iPageIndex: 1
                    })
                }
                productSelect.getData(ProductConfigs);
            }


        },
        searchCallback: function (config, obj) {
            searchCustomer(config, obj)
        },
        isTotal: true,
        isSearch: true,


    };

    function searchCustomer(config, obj) {
        CustomerConfigs.data = {
            'iData': JSON.stringify(
                {
                    iPageIndex: 1,
                    Type: '0',
                    CustomerName: $('#customer-select input').val()
                })
        }
        customerSelect.getData(CustomerConfigs);
    }

    customerSelect.init(CustomerConfigs);
    GetCustomerAll()
    //客户名称查询
    function GetCustomerAll() {


        customerSelect.getData(CustomerConfigs);
    }

    customerSelect.scrollData(CustomerConfigs);
```
