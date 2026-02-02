import { Routes } from '@angular/router';
import { Home } from './pages/logged/home/home';
import { Loggin } from './pages/no-logged/loggin/loggin';
import { SignUp } from './pages/no-logged/sign-up/sign-up';
import { ProductDetailComponent } from './pages/logged/product-detail-component/product-detail-component';
import { Menu } from './pages/logged/menu/menu';
import { About } from './pages/logged/about/about';
import { Coupon } from './pages/logged/coupon/coupon';
import { ProductCoupon } from './pages/logged/produt-coupon/product-coupon';
import { authGuard } from './guard/auth.guard';
import { ActivateAccount } from './pages/no-logged/activate-account/activate-account';
import { SearchProduct } from './pages/logged/search-product/search-product';
import { UserProfileComponent } from './pages/logged/user.profile.component/user.profile.component';
import { CouponProductComponent } from './pages/logged/coupon.product.component/coupon.product.component';

export const routes: Routes = [
    {
        path: "home",
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: "",
        component: Loggin
    },
    {
        path: "signUp",
        component: SignUp
    },
    {
        path: "product/:id",
        component: ProductDetailComponent,
        canActivate: [authGuard]
    },
    {
        path: "menu",
        component: Menu,
        canActivate: [authGuard]
    },
    {
        path: "about",
        component: About,
        canActivate: [authGuard]
    },
    {
        path: "coupon",
        component: Coupon,
        canActivate: [authGuard]
    },
    {
        path: "coupon/:id",
        component: ProductCoupon,
        canActivate: [authGuard]
    },
    {
        path: "activate",
        component: ActivateAccount
    },
    {
        path: "search",
        component: SearchProduct,
        canActivate: [authGuard]
    },
    {
        path: "user",
        component: UserProfileComponent,
        canActivate: [authGuard]
    },
    { 
        path: 'coupon/product/:id/:code', 
        component: CouponProductComponent,
        canActivate: [authGuard]
    }
];
