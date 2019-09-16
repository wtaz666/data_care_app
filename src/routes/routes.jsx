// import Home from "containers/home";
// import Event from 'containers/event';
// import Inform from 'containers/inform';
// import Alarm from 'containers/alarm';
import Index from "containers";
import RegApp from 'containers/regapp'; // 业务定制
import Login from 'containers/login';
import Mypage from "containers/mypage";
import UserPage from "containers/mypage/user.jsx";

const RouteConfig = [
    {
        path: "/index",
        component: Index,
        name: "动态"
    }, {
        path: "/regapp",
        component: RegApp,
        name: "业务定制"
    }, {
        path: "/login",
        component: Login,
        name: "登录页"
    }, {
        path: "/my",
        component: Mypage,
        name: "我的",
        children: [{
            path: "/my/user",
            component: UserPage,
            name: "用户列表",
        }]
    }
]

export default RouteConfig;