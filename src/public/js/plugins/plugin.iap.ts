/**
 * Created by Ian on 2015/5/20.
 */
///<reference path="../../tsd/typings/jquery/jquery.d.ts" />
module RomanySoftPlugins{

    export module IAP {
        // 内置购买的插件/商品/通用处理方式
        export class Product{
            enable: boolean = true;       // 是否可用, 默认可用
            inAppStore: boolean = true;   // 是否在AppStore中已经配置存在
            id: string = "";              // 唯一ID标识
            name: string = "";            // 产品英文名称(缺省)
            description: string = "";     // 产品内置描述(缺省)
            type: string = "";            // 产品类型
            quantity: number = 0;         // 产品数量
            price: string = "0.99$";      // 产品单价
            imageUrl: string = "";        // 产品截图
            uiShow: boolean = true;       // 是否在UI上有显示
            bundleIds: string[] = [];     // 打包产品包括, 适用于捆绑销售
            comment: string = "";         // 备注内容


            static create(cloneObj: {}):Product {
                var t = new this();
                if(cloneObj instanceof Object){
                    for(var k in cloneObj){
                        if (k in t && (typeof t[k] == typeof  cloneObj[k])){
                            t[k] = cloneObj[k];
                        }
                    }
                }

                return t;
            }
        }


        interface IAPServices{

            addProduct(product: Product):boolean;                               // 添加商品
            removeProduct(id: string):boolean;                                  // 根据商品id，删除商品

            getProduct(id: string): Product;

            getProductName(id: string, cb_delegate: Function): string;          // 获取商品的名称，通过cb_delegate来获得国际化的名称
            getProductDescription(id: string, cb_delegate: Function): string;   // 获取商品的描述信息，通过cb_delegate来获得国际化的描述
            getProductQuantity(id: string, cb_delegate: Function):number;       // 获取商品的数量

            getAllEnableInAppStoreProducts():Product[];                         // 获取可用的，在应用商店注册的商品
            getAllEnableInAppStoreProductIds(): string[];                       // 获取所有内置可用插件的，在应用商店中注册的
            getAllEnableProducts():Product[];                                   // 获取所有可用的商品
            getAllEnableProductIds(): string[];                                 // 获取所有内置的可用的插件ID，包括应用于应用商店中的

            getInBundleProductList(id: string): Product[];                      // 获取包含指定Product的直接或者间接产品

            getProductIsPurchased(id: string, cb_delegate: Function): boolean;   // 获取商品是否已经购买，通过cb_delegate 来处理细节
            getProductPurchasedCount(id: string, cb_delegate: Function): number; // 获取商品已经购买的数量

            syncProductWithAppStore(id: string, cb_delegate: Function): void;   // 根据应用商店同步商品的信息

            updateProductByIdWhitAppStore(id: string, info: any ,cb_delegate: Function): void;   // 根据应用商店对产品的描述Info来更新商品的特性

        }


        export class IAP$Helper implements IAPServices{
            productList: Product[] = [];        // 商品列表

            addProduct(product: Product):boolean{
                var find_product = this.getProduct(product.id);
                if(null == find_product){
                    this.productList.push(product);
                    return true;
                }

                return false;
            }

            removeProduct(id: string):boolean{
                var find_product = this.getProduct(id);
                if(null != find_product){
                    this.productList.splice($.inArray(find_product, this.productList), 1);
                    return true;
                }

                return false;
            }



            getProduct(id: string): Product{
                var p = null;

                $.each(this.productList, function(index, product){
                    if(product.id == id){
                        p = product; return false;
                    }
                });

                return p;
            }

            getProductName(id: string, cb_delegate: Function): string{
                var name = "";

                var product = this.getProduct(id);
                if (null == product) return name;

                name = product.name;
                cb_delegate && (name = cb_delegate(id));
                return name;
            }

            getProductDescription(id: string, cb_delegate: Function): string{
                var description = "";

                var product = this.getProduct(id);
                if (null == product) return description;

                description = product.description;
                cb_delegate && (description = cb_delegate(id));
                return description;
            }

            getProductQuantity(id: string, cb_delegate: Function):number{
                var _quantity = 0;
                var product = this.getProduct(id);
                if (null == product) return _quantity;

                _quantity = product.quantity;
                cb_delegate && (_quantity = cb_delegate(id));
                return _quantity;

            }

            getAllEnableInAppStoreProducts():Product[]{
                var list: Product[] = [];
                $.each(this.productList, function(index, product){
                    if(product.enable && product.inAppStore){
                        list.push(product);
                    }
                });

                return list;
            }

            getAllEnableInAppStoreProductIds(): string[]{
                var idList: string[] = [];
                $.each(this.productList, function(index, product){
                    if(product.enable && product.inAppStore){
                        idList.push(product.id);
                    }
                });
                return idList;
            }

            getAllEnableProducts():Product[]{
                var list: Product[] = [];
                $.each(this.productList, function(index, product){
                    if(product.enable){
                        list.push(product);
                    }
                });

                return list;
            }

            getAllEnableProductIds(): string[]{
                var idList: string[] = [];
                $.each(this.productList, function(index, product){
                    if(product.enable){
                        idList.push(product.id);
                    }
                });
                return idList;
            }

            getInBundleProductList(id: string): Product[]{
                var list: Product[] = [];

                $.each(this.productList, function(index, product){
                    if(product.enable){
                        if($.inArray(id, product.bundleIds) > -1){
                            list.push(product);
                        }
                    }
                });

                return list;
            }

            getProductIsPurchased(id: string, cb_delegate: Function): boolean{
                var t = this;
                var b$ = window.BS.b$;
                var b_inAppStore = b$.App.getSandboxEnable();

                var idList = b_inAppStore ? t.getAllEnableInAppStoreProductIds() : t.getAllEnableProductIds();
                if($.inArray(id, idList) > -1){
                    var default_fun = function(id){
                        try{
                            var self_count = b_inAppStore ? b$.IAP.getUseableProductCount(id) : t.getProductQuantity(id, null);
                            if(self_count >= 1){
                                return true;
                            }

                            var hasPurchased = false;
                            var assBundleProductList = t.getInBundleProductList(id);
                            $.each(assBundleProductList, function(index, product){
                                if(t.getProductIsPurchased(product.id, null)){
                                    hasPurchased = true;
                                }
                            });

                            return hasPurchased;
                        }catch(e){console.error(e)}

                        return false;
                    };

                    var fnc = cb_delegate || default_fun;
                    return fnc(id);
                }
                console.warn(id + " no found.");

                return false;
            }

            getProductPurchasedCount(id: string, cb_delegate: Function): number{
                var t = this;
                var idList = t.getAllEnableInAppStoreProductIds();
                if($.inArray(id, idList) > -1){
                    var default_fun = function(id){
                        try{
                            var b$ = window.BS.b$;
                            var self_count = b$.IAP.getUseableProductCount(id);
                            return self_count;
                        }catch(e){console.error(e)}

                        return 0;
                    };

                    var fnc = cb_delegate || default_fun;
                    return fnc(id);
                }
                console.warn(id + " no found.");
                return 0;
            }

            syncProductWithAppStore(id: string, cb_delegate: Function): void{
                var t = this;
                var default_func = function(id){
                    var product = t.getProduct(id);
                    try{
                        var b$ = window.BS.b$;
                        if(product.enable && product.inAppStore){
                            product.quantity = b$.IAP.getUseableProductCount(id);
                            product.price = b$.IAP.getPrice(id);
                        }
                    }catch (e){}

                    cb_delegate && cb_delegate(product);
                };

                default_func(id);
            }

            updateProductByIdWhitAppStore(id: string, info: any ,cb_delegate: Function): void{
                var product = this.getProduct(id);
                if(product.enable && product.inAppStore){
                    product.price = info.price;
                    //product.description = info.description; //不在这里处理描述问题
                }

                cb_delegate && cb_delegate();
            }
        }
    }


}