import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import '../home/index.scss';
import './index.scss';
import { Toast } from 'antd-mobile';
import ReactEcharts from 'echarts-for-react';
import listIcon from '../../images/applistIcon.svg';
import BusinessAll from '../../components/tabs/business/businessAll';
import BusinessApp from '../../components/tabs/business/businessApp';
import BusinessHost from '../../components/tabs/business/businessHost';
import BusinessDToD from '../../components/tabs/business/businessDToD';

class BusinessPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageViewData: [],
            listData: [],
            idData:[],
            id: 0,
            name: ''
        }
    }
    businessAllData() {
        axios.get('/kpiDing/accDynamics').then(res => {
            this.setState({
                pageViewData: res.data
            })
        })
    }
    dtodData() {
        axios.get('/ScreenMonitor/getAccessDynamics', {
            params: {
                nodeSourceDataId: sessionStorage.getItem('sourceId'), // 源 node
                appSourceDataId: sessionStorage.getItem('goalId') // 目的 app
            }
        }).then(res => {
            this.setState({
                pageViewData: res.data
            })
        })
    }
    appData = () => {
        var arrRes = []
        sessionStorage.getItem('appIdArr').split(',').map((item) => {
            axios.get('/AppIsNewController/appHostNewApp', {
                params: {
                    appSourceDataId: item,
                    timeId: 5,
                }
            }).then(res => {
                arrRes.push(res.data);
                this.setState({
                    listData: arrRes,
                    idData:sessionStorage.getItem('appIdArr').split(','),
                })
            })
        })
       
    }
    netData = () => {
        var arrRes = []
        sessionStorage.getItem('appIdArr').split(',').map((item) => {
            axios.get('/AppIsNewController/appHostNewApp', {
                params: {
                    hostId: item,
                    timeId: 5,
                }
            }).then(res => {
                arrRes.push(res.data);
                this.setState({
                    listData: arrRes,
                    idData:sessionStorage.getItem('appIdArr').split(','),
                })
            })
        })
    }
    UNSAFE_componentWillReceiveProps(props) {
        if (props.typeVal == 0) {
            this.businessAllData()
        } else if (props.typeVal == 1) {
            if (sessionStorage.getItem('businessType') == 0) {
                this.appData()
            } else {
                this.netData()
            }
        } else if (props.typeVal == 2) {
            this.dtodData()
        }
    }
    componentDidMount() {
        this.businessAllData()
    }
    render() {
        const { pageViewData, listData ,idData} = this.state;
        const { typeVal } = this.props;
        return (<div className='dynamicPage'>
            {
                this.props && typeVal == 0 ?
                    <div className='businessAllPage'>
                        <div className='contBlock' onClick={() => {
                            $('.serviseBlock1').css({ display: 'flex', flexDirection: 'column' });
                            $('.homePageHeader').hide();
                            $('.footer').hide();
                            $('.businessAllPage').hide();
                        }}>
                            <div className='title'>
                                <img src={listIcon} alt='' className='icon' />
                                <span>全局访问量动态</span>
                            </div>
                            <div style={{ height: '60px' }}>
                                <ReactEcharts
                                    style={{ height: '60px' }}
                                    option={{
                                        grid: {
                                            borderWidth: 0,
                                            top: 1,
                                            right: 1,
                                            bottom: 20,
                                            left: 1,
                                        },
                                        legend: {
                                            itemWidth: 18,
                                            itemHeight: 8,
                                            x: '10%',
                                            bottom: '0',
                                            textStyle: {
                                                color: 'rgba(166, 166, 166, 1)',
                                                fontSize: 10
                                            },
                                            data: ['来自互联网应用访问量', '来自内网应用访问量']
                                        },
                                        calculable: true,
                                        xAxis: [{
                                            show: false
                                        }, {
                                            show: false
                                        }],
                                        yAxis: {
                                            show: false
                                        },
                                        series: [
                                            {
                                                name: "来自内网应用访问量",
                                                type: "bar",
                                                itemStyle: {
                                                    normal: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [{
                                                                offset: 0, color: 'rgba(57, 126, 253, 1)' // 0% 处的颜色
                                                            }, {
                                                                offset: 1, color: 'rgba(57, 126, 253, 1)' // 100% 处的颜色
                                                            }]
                                                        },
                                                    }
                                                },
                                                data: pageViewData.unKnown
                                            }, {
                                                name: "来自互联网应用访问量",
                                                type: "bar",
                                                xAxisIndex: 1,
                                                // barGap: "5%",
                                                itemStyle: {
                                                    normal: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [{
                                                                offset: 0, color: 'rgba(255, 235, 59, 1)' // 0% 处的颜色
                                                            }, {
                                                                offset: 1,
                                                                color: 'rgba(255, 235, 59, 1)',
                                                                // opacity: .37 // 100% 处的颜色
                                                            }]
                                                        }
                                                    }
                                                },
                                                data: pageViewData.known
                                            }]
                                    }} />
                            </div>
                        </div>
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='applicationBox'>
                            {/* {
                                sessionStorage.getItem('appIdArr') == '' ? Toast.loading('Loading...') : ''
                            } */}
                            {
                                sessionStorage.getItem('businessType') == 0 ? // 业务系统
                                    listData.map((item, ind) => {
                                        return <div className='contBlock' key={ind} onClick={() => {
                                            this.setState({
                                                id: idData[ind],
                                                name: item.appname
                                            }, () => {
                                                $('.serviseBlock2').css({ display: 'flex', flexDirection: 'column' });
                                                $('.homePageHeader').hide();
                                                $('.footer').hide();
                                                $('.serviseBox').hide();
                                                $('.applicationBox').hide();
                                            })
                                        }}>
                                            <div className='title'>
                                                <img src={listIcon} alt='' className='icon' />
                                                <span>{item.name}</span>
                                            </div>
                                            <p className='flexStyle'><span>访问量</span><span>{item.value}(次/min)</span></p>
                                            <div className='chartBox'>
                                                <div style={{ width: item.zhanbi + '%' }}></div>
                                            </div>
                                        </div>
                                    })
                                    // 服务器
                                    : sessionStorage.getItem('businessType') == 1 ?
                                        listData.map((item, ind) => {
                                            return <div className='contBlock' key={ind} onClick={() => {
                                                this.setState({
                                                    id: idData[ind],
                                                    // name: item.hostName
                                                }, () => {
                                                    $('.serviseBlock2').css({ display: 'flex', flexDirection: 'column' });
                                                    $('.homePageHeader').hide();
                                                    $('.footer').hide();
                                                    $('.serviseBox').hide();
                                                    $('.applicationBox').hide();
                                                })
                                            }}>
                                                <div className='title'>
                                                    <img src={listIcon} alt='' className='icon' />
                                                    <span>{item.name}</span>
                                                </div>
                                                <p className='flexStyle'><span>访问量</span><span>{item.value}(次/min)</span></p>
                                                <div className='chartBox'>
                                                    <div style={{ width: item.zhanbi + '%' }}></div>
                                                </div>
                                            </div>
                                        }) : ''
                            }
                        </div>
                        : <div className='businessDtoD'> {/* 端到端*/}
                            <p className='dTodTitle'>源：<span>{sessionStorage.getItem('sourceName')}</span>       目的：<span>{sessionStorage.getItem('goalName')}</span></p>
                            <div className='contBlock' onClick={() => {
                                $('.serviseBlock3').css({ display: 'flex', flexDirection: 'column' });
                                $('.homePageHeader').hide();
                                $('.footer').hide();
                                $('.serviseBox').hide();
                                $('.businessDtoD').hide();
                            }}>
                                <div className='title'>
                                    <img src={listIcon} alt='' className='icon' />
                                    <span>端到端访问量动态</span>
                                </div>
                                <div style={{ height: '60px' }}>
                                    <ReactEcharts
                                        style={{ height: '60px' }}
                                        option={{
                                            grid: {
                                                borderWidth: 0,
                                                top: 1,
                                                right: 1,
                                                bottom: 20,
                                                left: 1,
                                            },
                                            legend: {
                                                itemWidth: 18,
                                                itemHeight: 8,
                                                x: '10%',
                                                bottom: '0',
                                                textStyle: {
                                                    color: 'rgba(166, 166, 166, 1)',
                                                    fontSize: 10
                                                },
                                                data: ['来自外网的业务系统访问量', '来自内网应用访问量']
                                            },
                                            calculable: true,
                                            xAxis: [{
                                                show: false
                                            }, {
                                                show: false
                                            }],
                                            yAxis: {
                                                show: false
                                            },
                                            series: [
                                                {
                                                    name: "来自外网的业务系统访问量",
                                                    type: "bar",
                                                    stack: "总量",
                                                    itemStyle: {
                                                        normal: {
                                                            color: {
                                                                type: 'linear',
                                                                x: 0,
                                                                y: 0,
                                                                x2: 0,
                                                                y2: 1,
                                                                colorStops: [{
                                                                    offset: 0, color: '#D7AF6F' // 0% 处的颜色
                                                                }, {
                                                                    offset: 1, color: '#E4CBA0' // 100% 处的颜色
                                                                }]
                                                            }
                                                        }
                                                    },
                                                    data: pageViewData.value2
                                                },
                                                {
                                                    name: "来自内网应用访问量",
                                                    type: "bar",
                                                    stack: "总量",
                                                    barMaxWidth: 25,
                                                    barGap: "5%",
                                                    itemStyle: {
                                                        normal: {
                                                            color: {
                                                                type: 'linear',
                                                                x: 0,
                                                                y: 0,
                                                                x2: 0,
                                                                y2: 1,
                                                                colorStops: [{
                                                                    offset: 0, color: 'rgb(56,84,203)' // 0% 处的颜色
                                                                }, {
                                                                    offset: 1, color: 'rgba(56,84,203, .37)' // 100% 处的颜色
                                                                }]
                                                            }
                                                        }
                                                    },
                                                    data: pageViewData.value1,
                                                }]
                                        }} />
                                </div>
                            </div>
                        </div>
            }
            {
                this.props && typeVal == 0 ? // 全局
                    <div className='serviseBlock1'>
                        <BusinessAll />
                    </div>
                    : this.props && typeVal == 1 ? // 服务端
                        <div className='serviseBlock2'>
                            {
                                sessionStorage.getItem('businessType') == 0
                                    ? <BusinessApp id={this.state.id} name={this.state.name} />
                                    : <BusinessHost id={this.state.id} />
                            }
                        </div> : <div className='serviseBlock3'> {/* 端到端 */}
                            <BusinessDToD />
                        </div>
            }
        </div>);
    }
}

export default BusinessPage;