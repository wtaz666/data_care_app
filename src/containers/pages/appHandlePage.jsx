import React, { Component } from 'react';
import '../home/index.scss';
import $ from 'jquery';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import listIcon from 'images/applistIcon.svg';
import AllHandle from 'components/tabs/apphandle/allHandle';
import HandleApp from 'components/tabs/apphandle/handleApp';
import HandleHost from 'components/tabs/apphandle/handleHost';

class AppHandlePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appBar: [],
            netBar: [],
            listData: [],
            singleRes: [],
            PerformanceData: []

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
    appData = () => {
        var arrRes = []
        sessionStorage.getItem('appIdArr').split(',').map((item) => {
            axios.get('/ScreenMonitor/getSingleResponse', {
                params: {
                    appSourceDataId: item,
                    webTimeType: 5,
                }
            }).then(res => {
                arrRes.push(res.data);
                this.setState({
                    singleRes: arrRes,
                })
            })
        })
        this.setState({
            listData: sessionStorage.getItem('appIdArr').split(','),
            listDataName: sessionStorage.getItem('appIdArrName').split(',')
        })
    }
    netData = () => {
        var arrRes = [] 
        sessionStorage.getItem('appIdArr').split(',').map((item) => {
            axios.get('/kpiDing/hostDetailPerformance', {
                params: {
                    hostId: item,
                    webTimeType: 5,
                }
            }).then(res => {
                arrRes.push(res.data);
                this.setState({
                    PerformanceData: arrRes,
                })
            })
        })
        this.setState({
            listData: sessionStorage.getItem('appIdArr').split(','),
            listDataName: sessionStorage.getItem('appIdArrName').split(',')
        })
    }
    UNSAFE_componentWillReceiveProps(props) {
        if (props.typeVal == 0) {
        } else if (props.typeVal == 1) {
            if (sessionStorage.getItem('businessType') == 0) {
                this.appData()
            } else {
                this.netData()
            }
        }
    }
    render() {
        const { typeVal, threeStatus } = this.props;
        const { listData, singleRes, listDataName, PerformanceData } = this.state;
        return (<div className='dynamicPage'>
            {
                this.props && typeVal == 0 ?
                    <div className='applicationBox'>
                        <div className='contBlock' onClick={() => {
                            $('.serviseBlock1').css({ display: 'flex', flexDirection: 'column' });
                            $('.homePageHeader').hide();
                            $('.footer').hide();
                            $('.applicationBox').hide();
                        }}>
                            <div className='title'>
                                <img src={listIcon} alt='' className='icon' />
                                <span>全局响应率</span>
                            </div>
                            <div className='dashboard' style={{ width: '86px', height: '86px' }}>
                                <ReactEcharts
                                    style={{ height: '86px' }}
                                    option={{
                                        title: {
                                            x: "center"
                                        },
                                        tooltip: {
                                            show: true,
                                            backgroundColor: '#F7F9FB',
                                            borderColor: '#92DAFF',
                                            borderWidth: '1px',
                                            textStyle: {
                                                color: 'black'
                                            },
                                            formatter: function (param) {
                                                return '<em style="color:' + param.color + ';">' + param.value + '</em> %'
                                            }
                                        },
                                        series: [{
                                            name: '业务系统稳定性',
                                            type: 'gauge',
                                            min: 0,
                                            max: 100,
                                            axisLine: {
                                                show: true,
                                                lineStyle: {
                                                    width: 10,
                                                    shadowBlur: 0,
                                                    color: [
                                                        [0.2, '#DC172A'],
                                                        [0.4, '#EA7F5F'],
                                                        [0.6, '#FFE11C'],
                                                        [0.8, '#6BCB8B'],
                                                        [1, '#6BCB8B']
                                                    ]
                                                }
                                            },
                                            axisTick: {
                                                show: true,
                                                splitNumber: 1,
                                                lineStyle: {
                                                }
                                            },
                                            splitLine: {
                                                show: true,
                                                length: 10,
                                                lineStyle: {       // 控制线条样式
                                                    width: 1
                                                }
                                            },
                                            axisLabel: {
                                                show: false,
                                                formatter: function (e) {
                                                },
                                                textStyle: {
                                                    fontSize: 12,
                                                    fontWeight: ""
                                                }
                                            },
                                            pointer: {
                                                show: true,
                                                width: 2,
                                                length: '60%'
                                            },
                                            detail: {
                                                formatter: function (param) {
                                                    var level = '';
                                                    if (param < 20) {
                                                        level = '差'
                                                    } else if (param < 40) {
                                                        level = '一般'
                                                    } else if (param < 60) {
                                                        level = '中等'
                                                    } else if (param < 80) {
                                                        level = '良好'
                                                    } else if (param <= 100) {
                                                        level = '优秀'
                                                    } else {
                                                        level = '暂无';
                                                    }
                                                    return level;
                                                },
                                                offsetCenter: [0, 30],
                                                textStyle: {
                                                    fontSize: 12
                                                }
                                            },
                                            data: [{
                                                name: "",
                                                value: [threeStatus.responseRate]
                                            }]
                                        }]
                                    }} />
                            </div>
                        </div>
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='networkBox'>
                            {
                                sessionStorage.getItem('businessType') == 0 ? // 业务系统
                                    listData.map((item, ind) => {
                                        return <div className='contBlock' key={ind} onClick={() => {
                                            this.setState({
                                                id: item,
                                            }, () => {
                                                $('.serviseBlock2').css({ display: 'flex', flexDirection: 'column' });
                                                $('.homePageHeader').hide();
                                                $('.footer').hide();
                                                $('.serviseBox').hide();
                                                $('.networkBox').hide();
                                            })
                                        }}>
                                            <div className='title'>
                                                <img src={listIcon} alt='' className='icon' />
                                                <span>{listDataName[ind]}</span>
                                            </div>
                                            <p className='flexStyle'><span>响应率</span>{
                                                singleRes[ind] ? <span>{singleRes[ind].response.value}{singleRes[ind].response.measure}</span> : ''
                                            }</p>
                                            <div className='chartBox'>
                                                <div style={{ width: singleRes[ind] ? singleRes[ind].response.value < 100 ? singleRes[ind].response.value / singleRes[ind].max * 100 + '%' : '100%' : '0%' }}></div>
                                            </div>
                                        </div>
                                    })
                                    // 服务器
                                    : sessionStorage.getItem('businessType') == 1 ?
                                        listData.map((item, ind) => {
                                            return <div className='contBlock' key={ind} onClick={() => {
                                                this.setState({
                                                    id: item,
                                                    // name: item.hostName
                                                }, () => {
                                                    $('.serviseBlock2').css({ display: 'flex', flexDirection: 'column' });
                                                    $('.homePageHeader').hide();
                                                    $('.footer').hide();
                                                    $('.serviseBox').hide();
                                                    $('.networkBox').hide();
                                                })
                                            }}>
                                                <div className='title'>
                                                    <img src={listIcon} alt='' className='icon' />
                                                    <span>{listDataName[ind]}</span>
                                                </div>
                                                <div className='xiangyinglv'>
                                                    <ul><li><p>响应率</p><span>{PerformanceData[ind] ? PerformanceData[ind].xiangying : ''}</span></li>
                                                        <li><p>响应时延</p><span>{PerformanceData[ind] ? PerformanceData[ind].xiangyingshiyan : ''}</span></li>
                                                        <li><p>建立连接时长</p><span>{PerformanceData[ind] ? PerformanceData[ind].createTime : ''}</span></li>
                                                        <li><p>关闭连接时长</p><span>{PerformanceData[ind] ? PerformanceData[ind].clostRate : ''}</span></li></ul>
                                                </div>

                                            </div>
                                        }) : ''
                            }
                        </div>
                        : ''
            }
            {
                this.props && typeVal == 0 ?
                    <div className='serviseBlock1'>
                        <AllHandle />
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='serviseBlock2'>
                            {
                                sessionStorage.getItem('businessType') == 0
                                    ? <HandleApp id={this.state.id} name={this.state.name} />
                                    : <HandleHost id={this.state.id}/>
                            }
                        </div> : ''
            }
        </div>
        );
    }
}

export default AppHandlePage;