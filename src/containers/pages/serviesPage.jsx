import React, { Component } from 'react';
import '../home/index.scss';
import $ from 'jquery';
import axios from 'axios';
import listIcon from 'images/applistIcon.svg';
import AppTabs from 'components/tabs/serviesTab/apptab';
import NetTabs from 'components/tabs/serviesTab/serviesNet';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appBar: [],
            netBar: []
        }
    }
    getAppBar() {
        axios.get('/kpiDing/appConTable', {
            params: {
                // webTimeType: 6,
                kpiId: 49, // 在线时长
                nodeSourceDataId: 704
            }
        }).then(res => {
            var list = res.data.result.map((item) => {
                if (item.appname == sessionStorage.getItem('appName')) {
                    return item;
                }
            })
            this.setState({
                appBar: list
            })
        })
    }
    getNetBar() {
        axios.get('/kpiDing/hostTableOnLineList', {
            params: {
                // webTimeType: this.state.nowTimeData !== '任选时段' ? null : this.state.time,
                isUp: true
            }
        }).then(res => {
            var list = res.data.hostList.map((item) => {
                if (item.hostName == sessionStorage.getItem('netName')) {
                    return item;
                }
            })
            this.setState({
                netBar: list
            })
        })
    }
    UNSAFE_componentWillReceiveProps() {
        this.getNetBar();
        this.getAppBar();
    }
    render() {
        const { typeVal, AppItemId, NetItemId, selectData, serviesNet } = this.props;
        return (<div className='dynamicPage'>
            {
                this.props && typeVal == 0 ?
                    <div className='applicationBox'>
                        <div className='contBlock' onClick={() => {
                            $('.serviseBlock2').css({ display: 'flex', flexDirection: 'column' });
                            $('.homePageHeader').hide();
                            $('.footer').hide();
                            $('.applicationBox').hide();
                        }}>
                            <div className='title'>
                                <img src={listIcon} alt='' className='icon' />
                                <span>{sessionStorage.getItem('appName')}</span>
                            </div>
                            <ul>
                                {
                                    this.state.appBar.filter(item => item).length > 0
                                        ?this.state.appBar.map((k, y) => {
                                            return k && k !== 'undefined' ? <li key={y} >
                                                <div className="list_item" style={{ width: k.zhanbi > 50 ? (k.zhanbi) + '%' : '100%' }}>
                                                    <div className="fl">在线时长</div>
                                                    <div className="fr">{k.showValue}</div>
                                                </div>
                                                <div className="list_inner_box">
                                                    <div className="list_chart" style={{ width: k.zhanbi > 0 ? (k.zhanbi) + '%' : '0.01%', background: 'rgb(157, 174, 255)' }}>
                                                    </div>
                                                </div>
                                            </li>
                                                : ''
                                        }) 
                                        : <li>
                                        <div className="list_item">
                                            <div className="fl">在线时长</div>
                                            <div className="fr">0</div>
                                        </div>
                                        <div className="list_inner_box">
                                        </div>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='networkBox'>
                            <div className='contBlock' onClick={() => {
                                $('.serviseBlock3').css({ display: 'flex', flexDirection: 'column' });
                                $('.homePageHeader').hide();
                                $('.footer').hide();
                                $('.serviseBox').hide();
                                $('.networkBox').hide();
                            }}>
                                <div className='title'>
                                    <img src={listIcon} alt='' className='icon' />
                                    <span>{sessionStorage.getItem('netName')}</span>
                                </div>
                                {
                                    this.state.netBar.map((k, y) => {
                                        return k && k !== 'undefined' ? <ul key={y} className='menuList'>
                                            <li>
                                                <p>在线状态：<span className='bg'>{k.hostStatus}</span></p>
                                            </li>
                                            <li>
                                                <div>持续时长：</div>
                                                <div className='bg'>{k.hostOnlineTime}</div>
                                            </li>
                                        </ul> : ''
                                    })
                                }
                            </div>
                        </div>
                        : ''
            }
            {
                this.props && typeVal == 0 ?
                    <div className='serviseBlock2'>
                        <AppTabs AppItemId={AppItemId} selectData={selectData} />
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='serviseBlock3'>
                            <NetTabs NetItemId={NetItemId} serviesNet={serviesNet} />
                        </div> : ''
            }
        </div>);
    }
}

export default Index;