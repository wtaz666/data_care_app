import React, { Component } from 'react';
import $ from 'jquery';
import { Button, WingBlank, SegmentedControl, Icon } from 'antd-mobile';

class SourceType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ind: 0,
            clickAppId: 0,
            clickNetId: 0,
            AppItemId: 0,
            NetItemId: 0,
            appName: '',
            netName:''
        }
    }
    seleChange = (e) => {
        if (e === '服务器') {
            $('.serivesBox').show();
            $('.appBox').hide();
            $('.sourceSeleBtn').attr('value', 2)
        } else if (e === '业务系统') {
            $('.serivesBox').hide();
            $('.appBox').show();
            $('.sourceSeleBtn').attr('value', 1)
        } else {
            $('.serivesBox').hide();
            $('.appBox').hide();
            $('.sourceSeleBtn').attr('value', 0)
        }
    }
    clickApp = (appId, itemId, name) => {
        this.setState({
            clickAppId: appId,
            AppItemId: itemId,
            ind: 1,
            appName: name
        })
    }
    clickNet = (appId, itemId, name) => {
        this.setState({
            clickNetId: appId,
            NetItemId: itemId,
            ind: 2,
            netName: name
        })
    }
    render() {
        const { ind, clickAppId, clickNetId } = this.state;
        const { selectData, networkData, serviseApp, serviseNet } = this.props;
        return <div className='seleType_cont'>
            <WingBlank size="lg" className="sc-example">
                <h4 className='sourceTitle'>空间选择</h4>
                <SegmentedControl selectedIndex={ind * 1} values={['资源', '业务系统', '服务器']} onValueChange={this.seleChange} />
                <ul className='appBox'>
                    {
                        selectData.map((item, index) => {
                            return <li key={index} onClick={() => this.clickApp(index, item.id, item.name)}>
                                {item.name}
                                {index == clickAppId ? <span>
                                    <Icon type='check' color='rgba(57, 126, 253, 1)' />
                                </span> : ''}
                            </li>
                        })
                    }
                </ul>
                <ul className='serivesBox'>
                    {
                        networkData.map((item, index) => {
                            return <li key={index} onClick={() => this.clickNet(index, item.id, item.name)}>
                                {item.name}
                                {index == clickNetId ? <span>
                                    <Icon type='check' color='rgba(57, 126, 253, 1)' />
                                </span> : ''}
                            </li>
                        })
                    }
                </ul>
            </WingBlank>
            <div className='sourceSeleBtn'>
                <Button inline onClick={() => {
                    $('.seleType').hide();
                }}>取消</Button>
                <Button type="primary" inline onClick={() => {
                    $('.seleType').hide();
                    this.setState({
                        ind: $('.sourceSeleBtn').attr('value')
                    })
                    if (selectData && networkData && selectData.length > 0) {
                        this.props.getTypeVal({
                            typeVal: $('.sourceSeleBtn').attr('value'),
                            AppItemId: this.state.AppItemId == 0 ? selectData[0].id : this.state.AppItemId,
                            NetItemId: this.state.NetItemId == 0 ? networkData[0].id : this.state.NetItemId
                        })
                        sessionStorage.setItem('AppItemId', this.state.AppItemId == 0 ? selectData[0].id : this.state.AppItemId)
                        sessionStorage.setItem('NetItemId', this.state.NetItemId == 0 ? networkData[0].id : this.state.NetItemId)
                        sessionStorage.setItem('appName', this.state.appName == '' ? selectData[0].name : this.state.appName)
                        sessionStorage.setItem('netName', this.state.netName == '' ? networkData[0].name : this.state.netName)
                    }
                }}>确定</Button>
            </div>
        </div>
    }
}

export default SourceType;