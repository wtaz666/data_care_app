import React, { Component } from 'react';
import $ from 'jquery';
import { Button, WingBlank, SegmentedControl, Icon } from 'antd-mobile';

class AppType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ind: 0,
            clickAppId: 0,
            clickNetId: 0,
            AppItemId: 0,
            NetItemId: 0
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
            ind: 0
        }, () => {
            sessionStorage.setItem('appName', name)
        })
    }
    clickNet = (appId, itemId, name) => {
        this.setState({
            clickNetId: appId,
            NetItemId: itemId,
            ind: 1
        }, () => {
            sessionStorage.setItem('netName', name)
        })
    }
    render() {
        const { ind, clickAppId, clickNetId } = this.state;
        const { serviseApp, serviseNet, leftIndex } = this.props;
        return <div className='seleType_cont'>
            <WingBlank size="lg" className="sc-example">
                <h4 className='sourceTitle'>空间选择</h4>
                <SegmentedControl selectedIndex={ind * 1} values={['业务系统', '服务器']} onValueChange={this.seleChange} />
                <ul className='appBox' style={{ display: 'block' }}>
                    {
                        serviseApp.map((item, index) => {
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
                业务系统在线服务端
                    {/* {
                        networkData.map((item, index) => {
                            return <li key={index} onClick={() => this.clickNet(index, item.id, name)}>
                                {item.name}
                                {index == clickNetId ? <span>
                                    <Icon type='check' color='rgba(57, 126, 253, 1)' />
                                </span> : ''}
                            </li>
                        })
                    } */}
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
                    if (serviseApp && serviseApp.length > 0 && leftIndex == 1) {
                        this.props.getTypeVal({
                            typeVal: $('.sourceSeleBtn').attr('value'),
                            AppItemId: this.state.AppItemId == 0 ? serviseApp[0].id : this.state.AppItemId,
                            // NetItemId: this.state.NetItemId == 0 ? serviseNet[0].id : this.state.NetItemId
                        })
                        sessionStorage.setItem('AppItemId', this.state.AppItemId == 0 ? serviseApp[0].id : this.state.AppItemId)
                        // sessionStorage.setItem('NetItemId', this.state.NetItemId == 0 ? serviseNet[0].id : this.state.NetItemId)
                    }
                }}>确定</Button>
            </div>
        </div>
    }
}

export default AppType;