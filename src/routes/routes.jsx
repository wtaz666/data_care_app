// import Home from "containers/home";
import Index from "containers";
import Event from 'containers/event';
import Inform from 'containers/inform';
import Alarm from 'containers/alarm';
import RegApp from 'containers/regapp'; // 业务定制
import Login from 'containers/login';
import Mypage from "containers/mypage";

const RouteConfig = [ 
    {
        path: "/index",
        component: Index,
        name: "动态"
    },{
        path: "/event",
        component: Event,
        name: "事件"
    },{
        path: "/inform",
        component: Inform,
        name: "通知"
    },{
        path: "/alarm",
        component: Alarm,
        name: "报警"
    },{
        path: "/regapp",
        component: RegApp,
        name: "业务定制"
    },{
        path: "/login",
        component: Login,
        name: "登录页"
    },{
        path: "/my",
        component: Mypage,
        name: "我的"
    }
]

export default RouteConfig;