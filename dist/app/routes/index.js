"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const category_routes_1 = require("../modules/category/category.routes");
const product_routes_1 = require("../modules/product/product.routes");
const order_routes_1 = require("../modules/order/order.routes");
const coupon_routes_1 = require("../modules/coupon/coupon.routes");
const sslcommerz_routes_1 = require("../modules/sslcommerz/sslcommerz.routes");
const brand_routes_1 = require("../modules/brand/brand.routes");
const meta_route_1 = require("../modules/meta/meta.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/brand',
        route: brand_routes_1.BrandRoutes,
    },
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: '/category',
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: '/product',
        route: product_routes_1.ProductRoutes,
    },
    {
        path: '/order',
        route: order_routes_1.OrderRoutes,
    },
    {
        path: '/coupon',
        route: coupon_routes_1.CouponRoutes,
    },
    {
        path: '/ssl',
        route: sslcommerz_routes_1.SSLRoutes,
    },
    {
        path: '/meta',
        route: meta_route_1.MetaRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
