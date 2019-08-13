import React from "react";
import { Switch , Route, Redirect } from "react-router-dom";

class RouterMap extends React.Component {
    render(){
        const { routes } = this.props;
        const defaultRoute = <Route path ="/" exact key={"0"} component = {()=><Redirect to="/login" />} />
        return <Switch>
            {
                routes.length && routes.map((itm, ind) =>{
                    return <Route key = { ind } path = { itm.path } render = {(RouterConfig) =>{
                        const Component = itm.component;
                        const Children = itm.children === undefined ? [] : itm.children
                        return <Component routes = {Children} {...RouterConfig}></Component>
                    }}></Route>
                }).concat([defaultRoute])
            }
      </Switch>
    }
}
export default RouterMap;