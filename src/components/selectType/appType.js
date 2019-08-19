import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Button, WingBlank, SegmentedControl, Icon } from 'antd-mobile';

class AppType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ind: 0,
            clickAppId: 0,
            clickNetId: 0,
            AppItemId: 0,
            NetItemId: 0,
            appName: '',
            netName: '',
            serviesNet:[],
            serviesApp:[]
        }
    }
    seleChange = (e) => {
        if (e === '服务器') {
            $('.serivesBox').show();
            $('.appBox').hide();
            $('.sourceSeleBtn').attr('value', 1)
        } else if (e === '业务系统') {
            $('.serivesBox').hide();
            $('.appBox').show();
            $('.sourceSeleBtn').attr('value', 0)
        } else {
            $('.sourceSeleBtn').attr('value', 0)
        }
    }
    clickApp = (appId, itemId, name) => {
        this.setState({
            clickAppId: appId,
            AppItemId: itemId,
            appName: name,
            ind: 0
        })
    }
    clickNet = (appId, itemId, name) => {
        this.setState({
            clickNetId: appId,
            NetItemId: itemId,
            netName: name,
            ind: 1
        })
    }
    // 服务在线接口
    serviesApp() {
        axios.get('/contrast/appnames').then(res => {
            this.setState({
                serviesApp: res.data
            }, () => {
                sessionStorage.setItem('AppItemId', this.state.serviesApp[0].source_data_id)
                sessionStorage.setItem('appName', this.state.serviesApp[0].res_name)
                // 放请求
            })
        })
    }
    serviesNet(){
        axios.get('/kpiDing/hostTableOnLineList').then(res=>{
            this.setState({
                serviesNet: res.data.hostList
            })
        })
    }
    componentDidMount(){
        this.serviesApp();
        this.serviesNet();
    }
    render() {
        const { ind, clickAppId, clickNetId, serviesApp, serviesNet } = this.state;
        return <div className='seleType_cont'>
            <WingBlank size="lg" className="sc-example">
                <h4 className='sourceTitle'>空间选择</h4>
                <SegmentedControl selectedIndex={ind * 1} values={['业务系统', '服务器']} onValueChange={this.seleChange} />
                <ul className='appBox' style={{ display: 'block' }}>
                    {
                        serviesApp.map((item, index) => {
                            return <li key={index} onClick={() => this.clickApp(index, item.source_data_id, item.res_name)}>
                                {item.res_name}
                                {index == clickAppId ? <span>
                                    <Icon type='check' color='rgba(57, 126, 253, 1)' />
                                </span> : ''}
                            </li>
                        })
                    }
                </ul>
                <ul className='serivesBox'>
                    {
                        serviesNet.map((item, index) => {
                            return <li key={index} onClick={() => this.clickNet(index, item.hostId, item.hostName)}>
                                {item.hostName}
                                {index == clickNetId ? <span>
                                    <Icon type='check' color='rgba(57, 126, 253, 1)' />
                                </span> : ''}
                            </li>
                        })
                    }
                </ul>
            </WingBlank>
            <div className='sourceSeleBtn' value={0}>
                <Button inline onClick={() => {
                    $('.seleType').hide();
                }}>取消</Button>
                <Button type="primary" inline onClick={() => {
                    $('.seleType').hide();
                    this.setState({
                        ind: $('.sourceSeleBtn').attr('value')
                    })
                    if (serviesApp && serviesApp.length > 0) {
                        this.props.getTypeVal({
                            typeVal: $('.sourceSeleBtn').attr('value'),
                            AppItemId: this.state.AppItemId == 0 ? serviesApp[0].id : this.state.AppItemId,
                            NetItemId: this.state.NetItemId == 0 ? serviesNet[0].hostId : this.state.NetItemId
                        })
                        sessionStorage.setItem('AppItemId', this.state.AppItemId == 0 ? serviesApp[0].id : this.state.AppItemId)
                        sessionStorage.setItem('NetItemId', this.state.NetItemId == 0 ? serviesNet[0].hostId : this.state.NetItemId)
                        sessionStorage.setItem('appName', this.state.appName == '' ? serviesApp[0].res_name : this.state.appName)
                        sessionStorage.setItem('netName', this.state.netName == '' ? serviesNet[0].hostName : this.state.netName)
                    }
                }}>确定</Button>
            </div>
        </div>
    }
}

export default AppType;