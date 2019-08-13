import React, { Component } from 'react';
import $ from 'jquery';
import Axios from 'axios';
import { Icon } from 'antd-mobile';
import { Affix } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { Button, Radio } from "element-react";
import MoreEcharts from 'components/eventPage/moreEcharts.js';
import exclamationMark from '../../../images/exclamationMark.svg';


class ThroughputTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            top: 1,
            time: 1,
            timedata: ['最近两小时', '今日', '昨日', '本周', '本月', '本年', '历史至今'],
            toggleCollapse: false,
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
    //数据请求
    getdetailData = () => {

        // 发起请求
        Axios.get('/event/getEventData', {
            params: {
                eventId: sessionStorage.getItem('id')
            }
        }).then(res => {
            this.setState({
                detailData: res.data.event,// 详情页信息
                listChildData: res.data.listChild,
                detailStatus: res.data.event.eventStatus,
                eventCrtlId: sessionStorage.getItem('eventCrtlId'),
                typeId: sessionStorage.getItem('typeId')
            })
            var detailChartsData;
            // 判断类型
            if (this.state.typeId == 1) { // 应用
                detailChartsData = res.data.app;
            } else if (this.state.typeId == 2) { // 服务器
                detailChartsData = res.data.host;
            }
            if (detailChartsData.listFirstUp) { // 2个图例
                this.setState({
                    // 详情页图表数据
                    listFirstUp: detailChartsData.listFirstUp,
                    listFirstDown: detailChartsData.listFirstDown,
                    listErrorUp: detailChartsData.listErrorUp,
                    listErrorDown: detailChartsData.listErrorDown,
                    listEndUp: detailChartsData.listEndUp,
                    listEndDown: detailChartsData.listEndDown,
                    listKongbaiUp: detailChartsData.listKongbaiUp ? detailChartsData.listKongbaiUp : null,
                    listKongbaiDown: detailChartsData.listKongbaiDown ? detailChartsData.listKongbaiDown : null,
                    timeArr: detailChartsData.time,
                    startLen: detailChartsData.errorStart,
                    endLen: detailChartsData.errorEnd,
                    errHigh: detailChartsData.errorHigh,
                    timeStart: detailChartsData.kongbaiTimeStart,
                    timeEnd: detailChartsData.kongbaiTimeEnd,
                    nameDown: detailChartsData.nameDown,
                    nameUp: detailChartsData.nameUp,
                    unitName: detailChartsData.unitName
                })
            } else { // 单个图例
                this.setState({
                    singleListFirst: detailChartsData.listFirst,
                    singleListError: detailChartsData.listError,
                    singleListTime: detailChartsData.time,
                    singleErrorStart: detailChartsData.errorStart,
                    singleErrorEnd: detailChartsData.errorEnd,
                    singleErrorHigh: detailChartsData.errorHigh,
                    singleNameShow: detailChartsData.nameShow,
                    singleUnitName: detailChartsData.unitName,
                    singleTimeStart: detailChartsData.kongbaiTimeStart,
                    singleTimeEnd: detailChartsData.kongbaiTimeEnd,
                    singleListEnd: detailChartsData.listEnd,
                    singlekongbai: detailChartsData.listKongbai
                })
            }
        })
    }
    componentDidMount() {
    }

    render() {

        const useBgNotice = '#FFE11C',
            useBgNormal = '#EA755F',
            useBgUrgent = '#EA7F5F',
            useBgurgentMost = '#DC172A';

        const { detailData, getCloseReason, selectId, statusFlag, operateFlag, timeArr, listEndDown, listEndUp, listErrorDown, listErrorUp, listFirstDown, listFirstUp, listKongbaiUp, listKongbaiDown, startLen, endLen, errHigh, timeStart, timeEnd, typeId, listChildData, detailStatus, singleListFirst, singleListError, singleListTime, singleErrorStart, singleErrorEnd, singleErrorHigh, singleNameShow, nameDown, nameUp, unitName, singleUnitName, singlekongbai, singleTimeEnd, singleTimeStart, singleListEnd, forceReason, eventCrtlId, eventFlag, otherData } = this.state;
        return (<div className='dialogThroughput'>
            <Affix offsetTop={this.state.top}>
                <div className='throughputHeader'>
                    <div>
                        <Icon type='left' onClick={() => {
                            $('.eventTab').hide();
                            $('.homePageHeader').show();
                            $('.footer').show();
                            $('.am-tabs-top').show();
                        }
                        } />
                    </div>
                    <div>{detailData.eventName}</div>
                    <div></div>
                </div>
            </Affix>
            <div className='eventbg'>
                <div>
                    <p className='eventTitle'>{detailData.eventName}</p>
                    <i></i>
                </div>
                <div>
                    <div>
                        <ul className='clear_float'>
                            <li>触发时间：{detailData.startTime}</li>
                            <li>结束时间：{detailData.endTime}</li>
                            <li>受影响的访问：{detailData.eventId}</li>
                            <li>状态&nbsp;&nbsp;&nbsp;<button className='eventbgbutton1' onClick={this.changeStatus}>{detailStatus === 1 ? 'CLOSE' : ''}{detailStatus === 0 ? 'OPEN' : ''}</button></li>
                            <li>关联的服务器：{listChildData.length}</li>
                            <li>等级：
                            {detailData.eventRankingId === 1 ? <div className='rankBox' style={{ backgroundColor: useBgNotice }}></div> : ''}
                                {detailData.eventRankingId === 2 ? <div className='rankBox' style={{ backgroundColor: useBgNormal }}></div> : ''}
                                {detailData.eventRankingId === 3 ? <div className='rankBox' style={{ backgroundColor: useBgUrgent }}></div> : ''}
                                {detailData.eventRankingId === 4 ? <div className='rankBox' style={{ backgroundColor: useBgurgentMost }}></div> : ''}
                            </li>
                        </ul>
                    </div>
                    <p className='eventDescribe'>
                        {eventCrtlId == 1 ? '该事件已系统关闭，查看原因？' : ''}
                        {eventCrtlId == 4 ? '该事件已强制关闭，查看原因？' : ''}
                        {eventCrtlId == 2 || eventCrtlId == 3 ? '该事件不是问题？那就强制关闭它' : ''}</p>

                    {eventCrtlId == 1 ? <button className='eventbgbutton2' onClick={this.changeSelectItem} >已关闭</button> : ''}
                    {eventCrtlId == 2 || eventCrtlId == 3 ? <button className='eventbgbutton2' onClick={this.changeSelectItem} style={{ background: '#b67eda' }}>强制关闭</button> : ''}
                    {eventCrtlId == 4 ? <button className='eventbgbutton2' onClick={this.changeSelectItem} style={{ color: '#fff' }}>强制关闭</button> : ''}

                </div>
                {/* 强制关闭  */}
                {
                    operateFlag ? detailStatus === 1 ? <div style={{ padding: '10px 0', borderTop: 'solid 1px rgb(242, 242, 242)', marginTop: '10px', boxSizing: 'border-box' }}>
                        <b>事件于 {detailData.endTime} {eventCrtlId == 4 ? '强制关闭' : '系统'} CLOSE。</b>
                        <p style={{ marginTop: '10px' }}>事件原因：{detailData.reason ? detailData.reason.info : forceReason}<br /></p>
                    </div>
                        : <div className='selectCont' >
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
            </div>

            <div className='eventbg2'>
                <p className='eventTitle'>服务端资源摘要</p>
                <p>系统核心资源，包括业务系统、以及承载业务系统</p>

                {
                    singleListFirst.length > 0 ? <div className='echarts_box' style={{ width: '100%', height: '300px' }}>
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
                        : <div className='echarts_box' style={{ width: '100%', height: '300px' }}>
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
            <div className='eventbg2'>
                <p className='eventTitle'>关联的服务器</p>
                {
                    listChildData.length > 0 ? <MoreEcharts listChildData={listChildData} /> : ''
                }

            </div>
        </div>


        )
    }

}
export default ThroughputTab;