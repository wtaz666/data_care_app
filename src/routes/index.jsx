import React from "react";
import RouterMap from "routes/map";
import RouteConfig from "routes/routes";
// import { Switch , Route } from "react-router-dom";

class RouterViews extends React.Component {
    render(){
        const { routes } = this.props;
        return <RouterMap routes = {routes ? routes : RouteConfig } />
    }
}
export default RouterViews;