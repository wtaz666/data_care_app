import './index.less';
import Axios from 'axios';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Button, Radio } from "element-react";
import bangzhu from '../../images/bangzhu.svg';
import NavBar from '../../components/navbar/index';
import MoreEcharts from '../../components/events/moreEcharts.js';
import exclamationMark from '../../images/exclamationMark.svg';
import OtherCharts from '../../components/events/otherEvent'

class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: 0,
            detailData: [],
            getSelectData: [],
            selectId: 0,
            statusFlag: false,// '系统状态'折叠
            operateFlag: false, // '操作'折叠
            eventFlag: false, // '相关事件'折叠
            seriesData: [], // 图表的series

            // 图表数据
            listFirstUp: [],
            listFirstDown: [],
            listErrorUp: [],
            listErrorDown: [],
            listEndUp: [],
            listEndDown: [],
            timeArr: [],
            otherChartData: [],
            startLen: 0,
            endLen: 0,
            errHigh: 0,
            nameDown: '',
            nameUp: '',

            // 单个图表数据
            singleListFirst: [],
            singleListError: [],
            singleListTime: [],
            singleErrorStart: 0,
            singleErrorEnd: 0,
            singleErrorHigh: 0,
            singleNameShow: '',

            typeId: null,// 判断是应用还是服务器
            listChildData: [], // 相同组件的数据
            forceReason: '',// 强制关闭的原因
            detailStatus: null, // 默认为 已关闭
            eventCrtlId: null, //判断操作状态
            otherData: []
        }
    }

    // 获取时间
    // 详情页的原因6个
    getCloseReason() {
        Axios.get('/event/getCloseReason').then(res => {
            this.setState({
                getCloseReason: res.data
            })
        })
    }
    // 单选框的切换
    changeSelectId = (selectId) => {
        this.setState({
            selectId
        })
        if (selectId == 7) { // id值为'其他'
            $('.textAreaInput').show();
        } else {
            $('.textAreaInput').hide();
        }
    }
    // 点击'系统状态'
    changeStatus = () => {
        this.setState({
            statusFlag: !this.state.statusFlag
        })
    }
    // 点击'操作'
    changeSelectItem = () => {
        this.setState({
            operateFlag: !this.state.operateFlag
        })
        if (this.state.operateFlag === false) {
            this.getCloseReason();
        }
    }

    // 点击'确认关闭' ->强制关闭
    forceCloseItem = (eventId) => {
        const { getCloseReason, selectId } = this.state;
        const reason = getCloseReason[selectId - 1] ? this.state.getCloseReason[selectId - 1].info : $('.textAreaInput').val();
        this.setState({
            forceReason: reason
        })
        if (selectId > 0) {
            this.setState({
                operateFlag: false,
                detailStatus: 1,
                eventCrtlId: 4
            }, () => this.forceReq(eventId, reason))
        }
    }

    // <强制关闭>的请求
    forceReq = (eventId, reason) => {
        Axios.get('/event/forceClose', {
            params: {
                eventId,
                info: reason
            }
        }).then(res => {
            this.setState({
                eventStatus: res.data ? 1 : 0// 1已关闭 0未关闭
            })
        })
    }

    // 获得已关闭的单个event
    getCloseEvent = () => {
        Axios.get('/event/getClosedEvent').then(res => {
            // console.log(res, '已关闭的单个event')
        })
    }

  

    // '相关事件'展开
    otherEvent = (e) => {
        this.setState({
            eventFlag: !this.state.eventFlag
        }, () => {
            if (this.state.eventFlag) {
                $('.lookOther_btn').css({'background-color':'#e4e4e4','border-color':'#e4e4e4'});
                this.otherEventData();
            }else{
                $('.lookOther_btn').css({'background-color':'#526cff'});
            }
        })  
    }

    // 相关事件_请求
    otherEventData = () => {
        Axios.get('/event/getManyErrorData', {
            params: {
                eventId: location.state ? location.state.id : sessionStorage.getItem('id')
            }
        }).then(res => {
            this.setState({
                otherData: res.data
            })
        })
    }

    componentDidMount() {
        this.getAxios();
    }
    render() {
        let styleObj = {
            paddingLeft: this.state.isCollapse ? "0" : "2.1rem",
            paddingTop: '6px'
        };
        const useBgNotice = '#FFE11C',
            useBgNormal = '#EA755F',
            useBgUrgent = '#EA7F5F',
            useBgurgentMost = '#DC172A';

        const { detailData, getCloseReason, selectId, statusFlag, operateFlag, timeArr, listEndDown, listEndUp, listErrorDown, listErrorUp, listFirstDown, listFirstUp, listKongbaiUp, listKongbaiDown, startLen, endLen, errHigh, timeStart, timeEnd, typeId, listChildData, detailStatus, singleListFirst, singleListError, singleListTime, singleErrorStart, singleErrorEnd, singleErrorHigh, singleNameShow, nameDown, nameUp, unitName, singleUnitName, singlekongbai, singleTimeEnd, singleTimeStart, singleListEnd, forceReason, eventCrtlId, eventFlag, otherData } = this.state;
        return (
            <div className='eventDetail'>
                {/* 页面列表 */}
                <div style={styleObj}>
                    <div className='eventTop'>
                        <h3>ID:{detailData.eventId}-{detailData.eventName}</h3>
                        <p>暂无</p>
                        <div style={{ display: 'flex', paddingTop: '10px' }}>
                            {/* 列表_top_left */}
                            <ul className='eventDetailList'>
                                <li>主机名：<b style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{detailData.resName}</b></li>
                                <li>触发时间：{detailData.startTime}</li>
                                <li>结束时间：{detailData.endTime}</li>
                                <li>等级：
                                    {detailData.eventRankingId === 1 ? <p style={{ color: useBgNotice }}><b className='color_block' style={{ backgroundColor: useBgNotice }}></b>提示</p> : ''}
                                    {detailData.eventRankingId === 2 ? <p style={{ color: useBgNormal }}><b className='color_block' style={{ backgroundColor: useBgNormal }}></b>一般</p> : ''}
                                    {detailData.eventRankingId === 3 ? <p style={{ color: useBgUrgent }}><b className='color_block' style={{ backgroundColor: useBgUrgent }}></b>紧急</p> : ''}
                                    {detailData.eventRankingId === 4 ? <p style={{ color: useBgurgentMost }}><b className='color_block' style={{ backgroundColor: useBgurgentMost }}></b>非常紧急</p> : ''}
                                </li>
                                <li>受影响的访问：暂无</li>
                                <li>受影响的业务系统：{listChildData.length}</li>
                                <li className='liStatusHover'>系统状态：<span onClick={this.changeStatus}>{detailStatus === 1 ? 'CLOSE' : ''}{detailStatus === 0 ? 'OPEN' : ''}</span></li>
                                <li><b style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'normal' }}>
                                    {eventCrtlId == 1 ? '该事件已系统关闭，查看原因？' : ''}
                                    {eventCrtlId == 4 ? '该事件已强制关闭，查看原因？' : ''}
                                    {eventCrtlId == 2 || eventCrtlId == 3 ? '该事件不是问题？那就强制关闭它' : ''}</b>
                                </li>
                                <li className='liOperateHover'>操作：
                                {eventCrtlId == 1 ? <span onClick={this.changeSelectItem} style={{ marginLeft: '38px' }}>已关闭</span> : ''}
                                    {eventCrtlId == 2 || eventCrtlId == 3 ? <span onClick={this.changeSelectItem} style={{ marginLeft: '38px',background:'#b67eda' }}>强制关闭</span> : ''}
                                    {eventCrtlId == 4 ? <span onClick={this.changeSelectItem} style={{ color: '#fff', marginLeft: '38px' }}>强制关闭</span> : ''}
                                </li>
                            </ul>
                            {
                                singleListFirst.length > 0 ? <div className='echarts_box' style={{ width: '76%', height: '300px' }}>
                                    <ReactEcharts
                                        style={{ width: '100%', height: '300px' }}
                                        option={
                                            {
                                                backgroundColor: 'rgb(250, 250, 250)',
                                                grid: {
                                                    top: 80,
                                                    left: 65,
                                                    right: 30
                                                },
                                                title: {
                                                    text: typeId == 1 ? `业务系统 - ${detailData.resName}` : `服务器 - ${detailData.resName}`,
                                                    left: 20,
                                                    top: 14,
                                                    textStyle: {
                                                        color: 'rgb(102, 102, 102)',
                                                        fontSize: '14',
                                                        fontWeight: 'normal'
                                                    }
                                                },
                                                legend: {
                                                    selectedMode: false,
                                                    bottom: '4%',
                                                    textStyle: {
                                                        color: 'rgb(102, 102, 102)',
                                                    },
                                                    data: [singleNameShow]
                                                },
                                                tooltip: {
                                                    trigger: 'axis',
                                                    axisPointer: {
                                                        lineStyle: {
                                                            color: '#000'
                                                        }
                                                    },
                                                    formatter: (params) => {
                                                        if (params[0].data) {
                                                            return `<div style="height:80px;border-radius:5px;background:#fff;box-shadow:0 0 10px 5px #aaa;font-size: 12px;padding: 6px 20px;box-sizing:border-box;color: #000">
                                                                <p>${params[0].axisValueLabel}</p>
                                                                <p>${params[0].seriesName} ${params[0].data}</p>
                                                            </div>`
                                                        } else {
                                                            return;
                                                        }

                                                    },
                                                    backgroundColor: 'rgba(255,255,255,1)',
                                                    padding: [0],
                                                    textStyle: {
                                                        color: '#000',
                                                    },
                                                    extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                                                },
                                                xAxis: [{
                                                    type: "category",
                                                    axisLine: {
                                                        show: false,
                                                        lineStyle: {
                                                            color: 'rgb(153, 153, 153)'
                                                        }
                                                    },
                                                    axisLabel: {
                                                        fontSize: 10
                                                    },
                                                    splitLine: {
                                                        show: false
                                                    },
                                                    axisTick: {
                                                        show: false
                                                    },
                                                    splitArea: {
                                                        show: false
                                                    },
                                                    boundaryGap: true,
                                                    data: singleListTime
                                                }],
                                                yAxis: [
                                                    {
                                                        type: "value",
                                                        name: `${singleUnitName}`,
                                                        nameRotate: -0.1,
                                                        nameTextStyle: {
                                                            color: "rgb(153, 153, 153)"
                                                        },
                                                        max: singleErrorHigh, // y轴最大值
                                                        splitLine: {
                                                            show: false
                                                        },
                                                        axisLine: {
                                                            show: false,
                                                            onZero: false,
                                                            lineStyle: {
                                                                color: 'rgb(153, 153, 153)'
                                                            }
                                                        },
                                                        axisTick: {
                                                            show: false
                                                        },
                                                        splitArea: {
                                                            show: false
                                                        },
                                                        axisLabel: {
                                                            interval: 0
                                                        }
                                                    }],
                                                series: [
                                                    {
                                                        name: singleNameShow,
                                                        type: "line",
                                                        symbol: "none",
                                                        color: '#FC9DB2',
                                                        markArea: {
                                                            data: [
                                                                [{
                                                                    xAxis: singleErrorStart
                                                                }, {
                                                                    xAxis: singleErrorEnd
                                                                }]
                                                            ]
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
                                                                        offset: 0,
                                                                        color: 'rgb(101, 133, 252)' // 0% 处的颜色
                                                                    }]
                                                                }
                                                            }
                                                        },
                                                        data: singleListFirst
                                                    }, {
                                                        name: singleNameShow,
                                                        type: "line",
                                                        symbol: "none",
                                                        color: "#FC9DB2", //折线图颜色,搭配markArea为面积图
                                                        lineStyle: { //折线的颜色
                                                            color: "#FA5071"
                                                        },
                                                        markArea: {
                                                            data: [
                                                                [{
                                                                    xAxis: singleErrorStart
                                                                }, {
                                                                    xAxis: singleErrorEnd
                                                                }]
                                                            ]
                                                        },
                                                        markLine: {// 这儿设置安全基线
                                                            type: 'max',
                                                            symbol: 'none',
                                                            lineStyle: {
                                                                width: 3,
                                                                type: 'solid',
                                                                color: '#DC172A'
                                                            },
                                                            data: [
                                                                [{
                                                                    coord: [singleErrorStart, singleErrorHigh]
                                                                },
                                                                {
                                                                    coord: [singleErrorEnd, singleErrorHigh]
                                                                }
                                                                ]
                                                            ],
                                                            label: {
                                                                normal: {
                                                                    color: 'rgb(153, 153, 153)',
                                                                    position: 'start',
                                                                    formatter: () => {
                                                                        // return '开始时间：' + singleListTime[singleErrorStart];
                                                                        return singleListTime[singleErrorStart];
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        data: singleListError
                                                    },
                                                    singlekongbai ? {
                                                        type: 'line',
                                                        symbol: "none",
                                                        color: "#DC172A", //折线图颜色,搭配markArea为面积图
                                                        lineStyle: { //折线的颜色
                                                            color: "#DC172A"
                                                        },
                                                        smooth: true, //是否平滑处理值0-1,true相当于0.5
                                                        boundaryGap: false,
                                                        markArea: {
                                                            data: [
                                                                [{
                                                                    xAxis: singleTimeStart
                                                                }, {
                                                                    xAxis: singleTimeEnd
                                                                }]
                                                            ]
                                                        },
                                                        markLine: {
                                                            symbol: "none",
                                                            lineStyle: {
                                                                width: 3,
                                                                type: 'solid',
                                                                color: '#999'
                                                            },
                                                            data: [
                                                                [{
                                                                    coord: [singleTimeStart, singleErrorHigh]
                                                                },
                                                                {
                                                                    coord: [singleTimeEnd, singleErrorHigh]
                                                                }
                                                                ]
                                                            ],
                                                            label: {
                                                                normal: {
                                                                    color: 'rgb(153, 153, 153)',
                                                                    position: 'middle',
                                                                    formatter: () => {
                                                                        return '结束时间：' + singleTimeEnd;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } : {
                                                            type: 'line',
                                                            data: []
                                                        },
                                                    singleListEnd ? {
                                                        name: singleNameShow,
                                                        type: "line",
                                                        symbol: "none",
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
                                                                        offset: 0,
                                                                        color: 'rgb(101, 133, 252)' // 0% 处的颜色
                                                                    }]
                                                                }
                                                            }
                                                        },
                                                        data: singleListEnd
                                                    } : {
                                                            type: 'line',
                                                            data: []
                                                        }
                                                ]
                                            }
                                        }
                                    />
                                </div>
                                    : <div className='echarts_box' style={{ width: '76%', height: '300px' }}>
                                        <ReactEcharts
                                            style={{ width: '100%', height: '300px' }}
                                            option={
                                                {
                                                    backgroundColor: 'rgb(250, 250, 250)',
                                                    grid: {
                                                        top: 80,
                                                        left: 65,
                                                        right: 30
                                                    },
                                                    title: {
                                                        text: typeId == 1 ? `业务系统 - ${detailData.resName}` : `服务器 - <${detailData.resName}>`,
                                                        left: 20,
                                                        top: 14,
                                                        textStyle: {
                                                            color: 'rgb(102, 102, 102)',
                                                            fontSize: '14',
                                                            fontWeight: 'normal'
                                                        }
                                                    },
                                                    legend: {
                                                        selectedMode: false,
                                                        bottom: '4%',
                                                        textStyle: {
                                                            color: 'rgb(102, 102, 102)',
                                                        },
                                                        data: [nameDown, nameUp]
                                                    },
                                                    tooltip: {
                                                        trigger: 'axis',
                                                        axisPointer: {
                                                            lineStyle: {
                                                                color: '#000'
                                                            }
                                                        },
                                                        formatter: (params) => {
                                                            if (params[0].data) {
                                                                return `<div style="height:100px;border-radius:5px;background:#fff;
                                                                box-shadow:0 0 10px 5px #aaa;font-size: 12px;padding: 6px 20px;
                                                                box-sizing:border-box">
                                                                <p>${params[0].axisValueLabel}</p>
                                                                <p>${params[0].seriesName} ${params[0].data}</p>
                                                                <p>${params[1].seriesName} ${params[1].data}</p>
                                                            </div>`
                                                            } else {
                                                                return;
                                                            }
                                                        },
                                                        backgroundColor: 'rgba(255,255,255,1)',
                                                        padding: [0],
                                                        textStyle: {
                                                            color: '#000',
                                                        },
                                                        extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                                                    },
                                                    xAxis: [{
                                                        type: "category",
                                                        axisLine: {
                                                            show: false,
                                                            lineStyle: {
                                                                color: 'rgb(153, 153, 153)'
                                                            }
                                                        },
                                                        axisLabel: {
                                                            fontSize: 10
                                                        },
                                                        splitLine: {
                                                            show: false
                                                        },
                                                        axisTick: {
                                                            show: false
                                                        },
                                                        splitArea: {
                                                            show: false
                                                        },
                                                        boundaryGap: true,
                                                        data: timeArr
                                                    }],
                                                    yAxis: [
                                                        {
                                                            type: "value",
                                                            name: `${unitName}`,
                                                            nameTextStyle: {
                                                                color: "rgb(153, 153, 153)"
                                                            },
                                                            max: errHigh, // y轴最大值
                                                            splitLine: {
                                                                show: false
                                                            },
                                                            axisLine: {
                                                                show: false,
                                                                onZero: false,
                                                                lineStyle: {
                                                                    color: 'rgb(153, 153, 153)'
                                                                }
                                                            },
                                                            axisTick: {
                                                                show: false
                                                            },
                                                            splitArea: {
                                                                show: false
                                                            },
                                                            axisLabel: {
                                                                interval: 0
                                                            }
                                                        }],
                                                    series: [
                                                        // 1.请求访问量
                                                        {
                                                            name: nameDown,
                                                            type: "bar",
                                                            symbol: "none",
                                                            stack: "总量",
                                                            boundaryGap: true,
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
                                                                            offset: 0,
                                                                            color: 'rgb(101, 133, 252)' // 0% 处的颜色
                                                                        }]
                                                                    }
                                                                }
                                                            },
                                                            data: listFirstDown,
                                                        },
                                                        // 1.请求响应量
                                                        {
                                                            name: nameUp,
                                                            type: "bar",
                                                            symbol: "none",
                                                            stack: "总量",
                                                            boundaryGap: true,
                                                            itemStyle: {
                                                                normal: {
                                                                    color: {
                                                                        type: 'linear',
                                                                        x: 0,
                                                                        y: 0,
                                                                        x2: 0,
                                                                        y2: 1,
                                                                        colorStops: [{
                                                                            offset: 0,
                                                                            color: '#DC172A' // 0% 处的颜色
                                                                        }, {
                                                                            offset: 1,
                                                                            color: '#DC172A' // 100% 处的颜色
                                                                        }]
                                                                    }
                                                                }
                                                            },
                                                            data: listFirstUp
                                                        },
                                                        // 2.请求访问量
                                                        {
                                                            name: nameDown,
                                                            type: "bar",
                                                            symbol: "none",
                                                            stack: "总量",
                                                            // boundaryGap: false,
                                                            itemStyle: {
                                                                normal: {
                                                                    color: {
                                                                        type: 'linear',
                                                                        x: 0,
                                                                        y: 0,
                                                                        x2: 0,
                                                                        y2: 1,
                                                                        colorStops: [{
                                                                            offset: 0,
                                                                            color: 'rgb(101, 133, 252)' // 0% 处的颜色
                                                                        }]
                                                                    }
                                                                }
                                                            },
                                                            markLine: {
                                                                type: 'max',
                                                                symbol: 'none',
                                                                lineStyle: {
                                                                    width: 3,
                                                                    type: 'solid',
                                                                    color: '#DC172A'
                                                                },
                                                                data: [
                                                                    [
                                                                        {
                                                                            coord: [startLen, errHigh]
                                                                        },
                                                                        {
                                                                            coord: [endLen, errHigh]
                                                                        }
                                                                    ]
                                                                ],
                                                                label: {
                                                                    normal: {
                                                                        color: 'rgb(153, 153, 153)',
                                                                        position: 'middle',
                                                                        formatter: () => {
                                                                            // return '开始时间：' + timeArr[startLen];
                                                                            return timeArr[startLen];
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            data: listErrorDown
                                                        },// 2.请求响应量
                                                        {
                                                            name: nameUp,
                                                            type: "bar",
                                                            symbol: "none",
                                                            stack: "总量",
                                                            // boundaryGap: false,
                                                            itemStyle: {
                                                                normal: {
                                                                    color: {
                                                                        type: 'linear',
                                                                        x: 0,
                                                                        y: 0,
                                                                        x2: 0,
                                                                        y2: 1,
                                                                        colorStops: [{
                                                                            offset: 0,
                                                                            color: '#DC172A' // 0% 处的颜色
                                                                        }, {
                                                                            offset: 1,
                                                                            color: '#DC172A' // 100% 处的颜色
                                                                        }]
                                                                    }
                                                                }
                                                            },
                                                            data: listErrorUp
                                                        },
                                                        // 3.area粉色区域
                                                        listKongbaiUp ? {
                                                            type: 'bar',
                                                            symbol: "none",
                                                            color: "#FC9DB2", //折线图颜色,搭配markArea为面积图
                                                            lineStyle: { //折线的颜色
                                                                color: "#FA5071"
                                                            },
                                                            smooth: true, //是否平滑处理值0-1,true相当于0.5
                                                            boundaryGap: false,
                                                            markArea: {
                                                                data: [
                                                                    [{
                                                                        xAxis: timeStart
                                                                    }, {
                                                                        xAxis: timeEnd
                                                                    }]
                                                                ]
                                                            },
                                                            markLine: {
                                                                type: 'max',
                                                                symbol: 'none',
                                                                lineStyle: {
                                                                    width: 3,
                                                                    type: 'solid',
                                                                    color: '#DC172A'
                                                                },
                                                                data: [
                                                                    [{
                                                                        coord: timeStart
                                                                    },
                                                                    {
                                                                        coord: timeEnd
                                                                    }
                                                                    ]
                                                                ],
                                                                label: {
                                                                    normal: {
                                                                        color: 'rgb(153, 153, 153)',
                                                                        position: 'middle',
                                                                        formatter: () => {
                                                                            return '结束时间：' + timeStart;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        } : {
                                                                type: 'line',
                                                                data: []
                                                            },
                                                        // 4.请求访问量
                                                        listEndDown ? {
                                                            name: nameDown,
                                                            type: "bar",
                                                            symbol: "none",
                                                            stack: "总量",
                                                            barMaxWidth: 25,
                                                            barGap: "5%",
                                                            // boundaryGap: false,
                                                            itemStyle: {
                                                                normal: {
                                                                    color: {
                                                                        type: 'linear',
                                                                        x: 0,
                                                                        y: 0,
                                                                        x2: 0,
                                                                        y2: 1,
                                                                        colorStops: [{
                                                                            offset: 0,
                                                                            color: 'rgb(101, 133, 252)' // 0% 处的颜色
                                                                        }]
                                                                    }
                                                                }
                                                            },
                                                            data: listEndDown
                                                        } : {
                                                                type: 'line',
                                                                data: []
                                                            },
                                                        // 4.请求响应量
                                                        listEndUp ? {
                                                            name: nameUp,
                                                            type: "bar",
                                                            symbol: "none",
                                                            stack: "总量",
                                                            // boundaryGap: false,
                                                            itemStyle: {
                                                                normal: {
                                                                    color: {
                                                                        type: 'linear',
                                                                        x: 0,
                                                                        y: 0,
                                                                        x2: 0,
                                                                        y2: 1,
                                                                        colorStops: [{
                                                                            offset: 0,
                                                                            color: '#DC172A' // 0% 处的颜色
                                                                        }, {
                                                                            offset: 1,
                                                                            color: '#DC172A' // 100% 处的颜色
                                                                        }]
                                                                    }
                                                                }
                                                            },
                                                            data: listEndUp
                                                        } : {
                                                                type: 'line',
                                                                data: []
                                                            }
                                                    ]
                                                }
                                            }
                                        />
                                    </div>

                            }
                        </div>
                        {/* 强制关闭  */}
                        {
                            operateFlag ? detailStatus === 1 ? <div style={{ padding: '10px 0', borderTop: 'solid 1px rgb(242, 242, 242)', marginTop: '10px', boxSizing: 'border-box' }}>
                                <b>事件于 {detailData.endTime} {eventCrtlId == 4 ?'强制关闭': '系统'} CLOSE。</b>
                                <p style={{ marginTop: '10px' }}>事件原因：{detailData.reason ? detailData.reason.info : forceReason}<br /></p>
                            </div>
                                : <div className='selectCont'>
                                    <b>请选择关闭事件的原因</b>
                                    <Radio.Group className='selectItems' value={selectId} onChange={this.changeSelectId.bind(this)}>
                                        {
                                            getCloseReason && getCloseReason.map((item, index) => {
                                                return <Radio key={index} value={item.id}>{item.info}</Radio>
                                            })
                                        }
                                        <Radio value={getCloseReason ? getCloseReason.length + 1 : 99}>其他</Radio>
                                    </Radio.Group>
                                    <input type='text' name='reason' style={{ display: 'none' }} className='textAreaInput' placeholder='请输入原因....' />
                                    <Button type="primary" onClick={() => this.forceCloseItem(location.state ? location.state.id : sessionStorage.getItem('id'))}>确认关闭</Button>
                                </div> : ''
                        }
                        {/* 系统状态 */}
                        {
                            statusFlag ? detailStatus === 1 ? <div style={{ height: '82px', borderTop: 'solid 1px rgb(242, 242, 242)', marginTop: '10px', display: 'flex', boxSizing: 'border-box' }}>
                                <img src={exclamationMark} style={{ width: '50px', height: '50px', marginRight: '20px', marginTop: '16px', marginLeft: '10px', boxSizing: 'border-box' }} />
                                <div>
                                    <b style={{ height: '40px', lineHeight: '40px' }}>当前事件状态为CLOSE</b>
                                    <p style={{ height: '40px', lineHeight: '40px' }}>DataCare能够自动判断系统是否已恢复正常，当系统状态恢复正常，相关事件状态自动转换到CLOSE状态。</p>
                                </div>
                            </div>
                                : <div style={{ height: '82px', borderTop: 'solid 1px rgb(242, 242, 242)', marginTop: '10px', display: 'flex', boxSizing: 'border-box' }}>
                                    <img src={exclamationMark} style={{ width: '50px', height: '50px', marginRight: '20px', marginTop: '16px', marginLeft: '10px', boxSizing: 'border-box' }} />
                                    <div>
                                        <b style={{ height: '40px', lineHeight: '40px' }}>当前事件状态为OPEN</b>
                                        <p style={{ height: '40px', lineHeight: '40px' }}>DataCare能够自动判断系统是否已恢复正常，当系统状态恢复正常，相关事件状态自动转换到CLOSE状态。</p>
                                    </div>
                                </div> : ''
                        }
                        <div className='lookOther'>
                            <Button onClick={this.otherEvent} className='lookOther_btn'>查看相关事件</Button>
                        </div>
                    </div>
                    {
                        eventFlag ? <OtherCharts data={otherData} resName={detailData.resName} eventName={detailData.eventName} /> : ''
                    }
                    <div className='eventBottom'>
                        <h3>{typeId == 1 ? '关联的服务器' : '受影响的业务系统'}</h3>
                        <p>{typeId == 1 ? `承载此业务系统的所有服务器的动态` : `承载此服务器的所有业务系统的动态`}</p>
                        {
                            listChildData.length > 0 ? <MoreEcharts listChildData={listChildData} /> : ''
                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default EventDetail;