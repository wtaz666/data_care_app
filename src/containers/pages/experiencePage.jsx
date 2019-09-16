import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import '../home/index.scss';
import './index.scss';
import { Toast } from 'antd-mobile';
import ReactEcharts from 'echarts-for-react';
import listIcon from 'images/applistIcon.svg';
import ExperienceAll from 'components/tabs/experience/experienceAll';
import ExperienceApp from 'components/tabs/experience/experienceApp';
import ExperienceHost from 'components/tabs/experience/experienceHost';
import ExperienceDToD from 'components/tabs/experience/experienceDToD';

class ExperiencePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageViewData: [],
            listData: [],
            listDataName:[],
            id: 0,
            name: ''
        }
    }
    businessAllData() {
        axios.get('/ScreenMonitor/apdexIndex', {
            params: {
                webTimeType: 5
            }
        }).then(res => {
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
        var arr = []
        sessionStorage.getItem('appIdArr').split(',').map((item) => {
            axios.get('/performance/dropDown', {
                params: {
                    timeId: 5,
                    kpiId: 6,
                    appSourceDataId: item
                }
            }).then((res) => {
                arr.push(res.data);
                this.setState({
                    listData: arr
                })
            })
        })
    }
    netData = () => {
        var arr = []
        sessionStorage.getItem('appIdArr').split(',').map((item) => {
            axios.get('/kpiDing/hostDetailViewTable', {
                params: {
                    webTimeType: 5,
                    hostId: item,
                    pageNum: 1,
                    pageSize: 10000
                }
            }).then((res) => {
                arr.push(res.data);
                this.setState({
                    listData: arr,
                    listDataName: sessionStorage.getItem('appIdArrName').split(',')
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
        const { pageViewData, listData ,listDataName} = this.state;
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
                                <span>全局用户体验</span>
                            </div>
                            <div className='apdexCharts'>
                                <div style={{ height: '60px' }}>
                                    <ReactEcharts
                                        style={{ height: '60px' }}
                                        option={{
                                            tooltip: {
                                                show: false
                                            },
                                            legend: {
                                                x: '42%',
                                                bottom: '0',
                                                textStyle: {
                                                    color: 'rgba(166, 166, 166, 1)',
                                                },
                                                data: ['Apdex']
                                            },
                                            grid: {
                                                top: 40,
                                                left: 32,
                                                right: 20
                                            },
                                            xAxis: [{
                                                type: 'category',
                                                boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
                                                axisLine: {
                                                    lineStyle: {
                                                        color: '#fff',
                                                        width: 0
                                                    },
                                                },
                                                splitLine: {     //网格线
                                                    show: false
                                                },
                                                axisLabel: {
                                                    fontSize: 10
                                                },
                                                axisTick: {
                                                    show: false
                                                },
                                                data: pageViewData.time
                                            }],
                                            yAxis: [{
                                                type: "value",
                                                name: "单位" + pageViewData.unit,
                                                max: 1,
                                                nameTextStyle: {
                                                    color: "transparent"
                                                },
                                                splitLine: {
                                                    show: false
                                                },
                                                axisLine: {
                                                    show: false,
                                                    lineStyle: {
                                                        color: '#transparent'
                                                    }
                                                },
                                                axisTick: {
                                                    show: false
                                                },
                                                splitArea: {
                                                    show: false
                                                },
                                            }],
                                            series: [{
                                                name: 'Apdex',
                                                type: 'line',
                                                smooth: true,
                                                symbol: 'circle',
                                                symbolSize: 5,
                                                showSymbol: false,
                                                lineStyle: {
                                                    normal: {
                                                        width: 1
                                                    }
                                                },
                                                areaStyle: {
                                                    normal: {
                                                        color: 'rgb(51,65,126)',
                                                        shadowBlur: 10
                                                    }
                                                },
                                                itemStyle: {
                                                    normal: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [{
                                                                offset: 0, color: '#3854CB' // 0% 处的颜色
                                                            }, {
                                                                offset: 1, color: 'rgba(56,84,203, .37)' // 100% 处的颜色
                                                            }]
                                                        },
                                                        borderWidth: 12
                                                    }
                                                },
                                                data: pageViewData.value
                                            }
                                            ]
                                        }} />
                                </div>
                                <ul className='colorBlock'>
                                    <li><span></span></li>
                                    <li><span></span></li>
                                    <li><span></span></li>
                                    <li><span></span></li>
                                </ul>
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
                                                // id: ind,
                                                // name: ind
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
                                                <span>{item.appName}</span>
                                            </div>
                                            <div style={{ height: '60px' }}>
                                                <ReactEcharts
                                                    style={{ height: '60px' }}
                                                    option={
                                                        {
                                                                tooltip: {},
                                                                legend: {
                                                                    x: '40%',
                                                                    bottom: '0',
                                                                    textStyle: {
                                                                        color: '#333',
                                                                    },
                                                                    data: ['Apdex']
                                                                },
                                                                grid: {
                                                                    top: 10,
                                                                    right: 10,
                                                                    bottom: 20,
                                                                    left: 20,
                                                                },
                                                                xAxis: {
                                                                    type: 'category',
                                                                    data: this.state.pageTime,
                                                                    boundaryGap: true,
                                                                    splitLine: {
                                                                        show: false,
                                                                    },
                                                                    axisTick: {
                                                                        show: false
                                                                    },
                                                                    axisLine: {
                                                                        show: false
                                                                    }
                                                                },
                                                                yAxis: {
                                                                    show: false,
                                                                    name: '单位',
                                                                    type: 'value',
                                                                    splitLine: {
                                                                        show: false,
                                                                    },
                                                                    axisTick: {
                                                                        show: false
                                                                    },
                                                                    axisLine: {
                                                                        lineStyle: {
                                                                            color: 'rgb(82, 108, 255)'
                                                                        }
                                                                    },
                                                                },
                                                                series: [
                                                                    {
                                                                        name: 'Apdex',
                                                                        type: 'line',
                                                                        smooth: true,
                                                                        showSymbol: false,
                                                                        data: item.value,
                                                                        itemStyle: {
                                                                            normal: {
                                                                                color: 'rgb(82, 108, 255)'
                                                                            }
                                                                        }
                                                                    }]
                                                            }
                                                        } />
                                            </div>
                                        </div>
                                    })
                                    // 服务器
                                    : sessionStorage.getItem('businessType') == 1 ?
                                        listData.map((item, ind) => {
                                            return <div className='contBlock' key={ind} onClick={() => {
                                                this.setState({
                                                    id: item.page.hostId,
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
                                                    <span>{listDataName[ind]}</span>
                                                </div>
                                                <ReactEcharts
                                                    style={{ height: '60px' }}
                                                    option={
                                                        {
                                                            tooltip: {
                                                                show: false
                                                            },
                                                            legend: {
                                                                x: '42%',
                                                                bottom: '0',
                                                                textStyle: {
                                                                    color: 'rgba(57, 126, 253, 1)',
                                                                },
                                                                data: ['每访问字节数']
                                                            },
                                                            grid: {
                                                                top: 40,
                                                                left: 32,
                                                                right: 20
                                                            },
                                                            xAxis: [{
                                                                type: 'category',
                                                                boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
                                                                axisLine: {
                                                                    lineStyle: {
                                                                        color: '#fff',
                                                                        width: 0
                                                                    },
                                                                },
                                                                splitLine: {     //网格线
                                                                    show: false
                                                                },
                                                                axisLabel: {
                                                                    fontSize: 10
                                                                },
                                                                axisTick: {
                                                                    show: false
                                                                },
                                                                data: item.time
                                                            }],
                                                            yAxis: [{
                                                                show: false,
                                                                type: "value",
                                                                name: "单位" + item.value2Unit,
                                                                max: 1,
                                                                nameTextStyle: {
                                                                    color: "transparent"
                                                                },
                                                                splitLine: {
                                                                    show: false
                                                                },
                                                                axisLine: {
                                                                    show: false
                                                                },
                                                                axisTick: {
                                                                    show: false
                                                                },
                                                                splitArea: {
                                                                    show: false
                                                                },
                                                            }],
                                                            series: [{
                                                                name: '每访问字节数',
                                                                type: 'bar',
                                                                itemStyle:{
                                                                    normal:{
                                                                        color: 'rgba(57, 126, 253, 1)'
                                                                    }
                                                                },
                                                                data: item.detailsMap?item.detailsMap.value2:''
                                                            }]
                                                        }
                                                    }
                                                />
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
                                    <span>端到端用户体验</span>
                                    <p >源：<span>{sessionStorage.getItem('sourceName')}</span>目的：<span>{sessionStorage.getItem('goalName')}</span></p>
                                </div>
                            </div>
                        </div>
            }
            {
                this.props && typeVal == 0 ? // 全局
                    <div className='serviseBlock1'>
                        <ExperienceAll />
                    </div>
                    : this.props && typeVal == 1 ? // 服务端
                        <div className='serviseBlock2'>
                            {
                                sessionStorage.getItem('businessType') == 0
                                    ? <ExperienceApp id={this.state.id} name={this.state.name} />
                                    : <ExperienceHost id={this.state.id} />
                            }
                        </div> : <div className='serviseBlock3'> {/* 端到端 */}
                            <ExperienceDToD />
                        </div>
            }
        </div>);
    }
}

export default ExperiencePage;