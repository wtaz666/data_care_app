import React, { Component } from 'react';
import { SegmentedControl, WingBlank, Button, Icon, Tabs } from 'antd-mobile';
import { Select } from 'antd';
import axios from 'axios';
import $ from 'jquery';

class BusinessType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ind: 0,
            clickAppId: 0,
            clickNetId: 0,
            AppItemId: 0,
            NetItemId: 0,
            nodeList: [],
            appList: [],
            BusinessNet: [],
            BusinessApp: []
        }
    }
    seleChange = (e) => {
        if (e === '端到端') {
            $('.duanToduan').show();
            $('.fuWuDuan').hide();
            $('.sourceSeleBtn').attr('value', 2)
        } else if (e === '服务端') {
            $('.duanToduan').hide();
            $('.fuWuDuan').show();
            $('.sourceSeleBtn').attr('value', 1)
        } else {
            $('.duanToduan').hide();
            $('.fuWuDuan').hide();
            $('.sourceSeleBtn').attr('value', 0)
        }
    }
    clickApp = (appId, itemId, name) => {
        this.setState({
            clickAppId: appId,
            // AppItemId: itemId,
            ind: 1
        }, () => {
            // $('.sourceSeleBtn').attr('value', 1)
            // sessionStorage.setItem('appName', name)
        })
    }
    clickNet = (appId, itemId, name) => {
        this.setState({
            clickNetId: appId,
            // NetItemId: itemId,
            ind: 1
        }, () => {
            // $('.sourceSeleBtn').attr('value', 2)
            // sessionStorage.setItem('netName', name)
        })
    }
    getAxios() {
        // 服务端
        axios.get('/kpiDing/hostTableOnLineList').then(res => {
            this.setState({
                BusinessNet: res.data.hostList
            })
        })

        // 端到端
        axios.get('/adminController/selectNodeIdList').then(res => {
            this.setState({
                nodeList: res.data,
            })
        })
        axios.get('/contrast/appnames').then(res => {
            this.setState({
                BusinessApp: res.data,
                appList: res.data
            })
        })
    }
    componentDidMount() {
        this.getAxios();
    }
    render() {
        const { ind, clickAppId, clickNetId, BusinessNet, BusinessApp, nodeList, appList } = this.state;
        // const { leftIndex } = this.props;
        const tabs = [
            { title: '业务系统'},
            { title: '服务器'}
          ];          
        return <div className='seleType_cont'>
            <WingBlank size="lg" className="sc-example">
                <h4 className='sourceTitle'>空间选择</h4>
                <SegmentedControl selectedIndex={ind * 1} values={['全局', '服务端', '端到端']} onValueChange={this.seleChange} />
                <div className='fuWuDuan' style={{ display: 'none' }}>
                    <Tabs tabs={tabs}
                        initialPage={0}
                    >
                        <ul className='appBox' style={{ display: 'block' }}>
                        {
                            BusinessApp.map((item, index) => {
                                return <li key={index} onClick={() => this.clickApp(index, item.source_data_id, item.res_name)}>
                                    {item.res_name}
                                    {index == clickAppId ? <span>
                                        <Icon type='check' color='rgba(57, 126, 253, 1)' />
                                    </span> : ''}
                                </li>
                            })
                        }
                    </ul>
                    <ul className='serivesBox' style={{ display: 'block' }}>
                        {
                            BusinessNet.map((item, index) => {
                                return <li key={index} onClick={() => this.clickNet(index, item.hostId, item.hostName)}>
                                    {item.hostName}
                                    {index == clickNetId ? <span>
                                        <Icon type='check' color='rgba(57, 126, 253, 1)' />
                                    </span> : ''}
                                </li>
                            })
                        }
                    </ul>
                    </Tabs>
                </div>
                <div className='duanToduan' style={{ display: 'none' }}>
                    <div className='nodeToApp' style={{ display: 'block' }}>
                        <p>源</p>
                        <Select defaultValue="请选择" style={{ width: '100%' }} notFoundContent='无数据'>
                            {
                                nodeList.length > 0 && nodeList.map((item, index) => {
                                    return <Select.Option key={index} id={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                        <p>目的</p>
                        <Select defaultValue="请选择" style={{ width: '100%' }} notFoundContent='无数据'>
                            {
                                appList.length > 0 && appList.map((item, index) => {
                                    return <Select.Option key={index} id={item.source_data_id}>{item.res_name}</Select.Option>
                                })
                            }
                        </Select>
                    </div>
                </div>
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
                    if (BusinessApp && BusinessApp.length > 0) {
                        this.props.getTypeVal({
                            typeVal: $('.sourceSeleBtn').attr('value'),
                            AppItemId: this.state.AppItemId == 0 ? BusinessApp[0].id : this.state.AppItemId,
                            NetItemId: this.state.NetItemId == 0 ? BusinessNet[0].id : this.state.NetItemId
                        })
                        sessionStorage.setItem('AppItemId', this.state.AppItemId == 0 ? BusinessApp[0].id : this.state.AppItemId)
                        sessionStorage.setItem('NetItemId', this.state.NetItemId == 0 ? BusinessNet[0].id : this.state.NetItemId)
                    }
                }}>确定</Button>
            </div>
        </div>
    }

}

export default BusinessType;