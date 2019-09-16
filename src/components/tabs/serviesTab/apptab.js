import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import axios from 'axios';
import { Table, Pagination } from 'antd';
import listIcon from 'images/applistIcon.svg';
import ReactEcharts from 'echarts-for-react';
import { Tabs, Icon, Modal } from 'antd-mobile';

import lrlconClick from '../../../images/selectIcons/lrIcon_click.svg';
import lrlcon from '../../../images/selectIcons/lrIcon_normal.svg';
import twolconClick from '../../../images/selectIcons/twoIcon_click.svg';
import twolcon from '../../../images/selectIcons/twoIcon_normal.svg';
import clocklconClick from '../../../images/selectIcons/clockIcon_click.svg';
import clocklcon from '../../../images/selectIcons/clockIcon_normal.svg';
function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

class AppTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal1: false,
            normInd: 0,// 指标id
            newNormInd: 0,
            timeId: 6,
            tabs: [
                { title: '实时' },
                { title: '今日' },
                { title: '本周' },
                { title: '本月' },
            ],
            tabs2: [
                { title: '分析' },
                { title: '基线' },
                { title: '排名' }
            ],
            normSele: [
                {
                    clickImg: twolconClick,
                    img: twolcon,
                    title: '在线时长',
                    unit: '（s）'
                }, {
                    clickImg: lrlconClick,
                    img: lrlcon,
                    title: '在线服务率',
                    unit: '（%）'
                }, {
                    clickImg: clocklconClick,
                    img: clocklcon,
                    title: '资源的利用水平',
                    unit: '（%）'
                }
            ],
            curKpiName: '在线时长',
            onlineSvalue: [],
            onlineStime: [],
            OnlineTimeData: [],
            ruseTime: [],
            tableColumns: [
                {
                    title: '时间',
                    dataIndex: 'time',
                    key: 0,
                    align: 'center',
                    width: 150,
                    fixed: 'left'
                },
                {
                    title: '在线时长(s)',
                    dataIndex: 'dropDowns',
                    key: 1,
                    align: 'center'
                    // width: 80
                },
                {
                    title: '在线服务率(%)',
                    dataIndex: 'appOnlineDistributions',
                    key: 2,
                    align: 'center'
                    // width: 80
                },
                {
                    title: '资源的利用水平(%)',
                    dataIndex: 'appOnlineDistributions',
                    key: 3,
                    align: 'center'
                    // width: 80
                }
            ],
            tableData: [],
            pageNum: 1,
            pageSize: 1000,
            clickTab: 0,
            newTitle: '',
            clickTab2: 0,
            lineData: [],
            lineName: 'null~service_rate~4',
            lineFlag: false,
            tablekpiId: 49,
            rankData: [],
            rankId: [],
        }
    }
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }
    //排名
    getbarData() {
        axios.get('/AppIsNewController/appConTableNewApp', {
            params: {
                timeId: this.state.timeId,
                appSourceDataId: sessionStorage.getItem('AppItemId'),
                kpiId: this.state.tablekpiId,
            }
        }).then(res => {
            let newArr = res.data.filter(item => item.pm > 0)
            this.setState({
                rankData: res.data,
                rankId: newArr,
            })
        });
    }
    gettime = (tab, i) => {
        var newId = '';
        if (i === 0) {
            newId = 6
        } else if (i === 1) {
            newId = 0
        } else if (i === 2) {
            newId = 2
        } else if (i === 3) {
            newId = 3
        }
        this.setState({
            timeId: newId,
            clickTab: i,
            clickTab2: 0
        }, () => {
            if (this.state.normInd == 0) {
                this.getOnlineTime()
            } else if (this.state.normInd == 1) {
                this.getServies()
            } else if (this.state.normInd == 2) {
                this.getRuse()
            }
            if (!this.state.lineFlag) {
                this.getLineData();
                this.getbarData();
            }
            this.setTableData();
        })

    }
    // 在线时长
    getOnlineTime() {
        axios.get('/AppIsNewController/dropDownNewApp', {
            params: {
                timeId: this.state.timeId,
                appSourceDataId: sessionStorage.getItem('AppItemId'),
                kpiId: 5
            }
        }).then(res => {
            let data = res.data;
            this.setState({
                OnlineTimeData: data
            })
        })
    }
    // 资源服务率
    getServies() {
        axios.get('/AppIsNewController/appOnlineDistributionNewApp', {
            params: {
                timeId: this.state.timeId,
                appSourceDataId: sessionStorage.getItem('AppItemId'),
            }
        }).then(res => {
            let resData = $.isEmptyObject(res.data);
            if (resData == true) {
                return
            } else {
                let time = res.data.time;
                let value = res.data.value;
                let startTime = time[0];
                let endTime = time[time.length - 1];
                this.setState({
                    onlineSvalue: value,
                    onlineStime: time,
                    onlineStartTime: startTime,
                    onlineEndTime: endTime,
                })
            }
        })
    }
    //资源利用率
    getRuse() {
        axios.get('/kpiDing/resourceAppByCl', {
            params: {
                timeId: this.state.timeId,
                kpiId: 3,
                appSourceDataId: sessionStorage.getItem('singleSystemId'),
            }
        }).then(res => {
            let resData = $.isEmptyObject(res.data);
            if (resData == true) {
                return
            } else {
                let data = res.data;
                let percent = data.percent;
                let RuseTime = data.time;
                let RuseY = data.value;
                let startTime = RuseTime[0];
                let endTime = RuseTime[RuseTime.length - 1];
                this.setState({
                    ruseStartTime: startTime,
                    ruseEndTime: endTime,
                    // ruseTime:str1,
                    ruseValue: RuseY,
                    rusePercent: percent,
                })
            }
        })
    }
    //应用系统状态
    getData() {
        //应用状态
        axios.get('/resOnline/appOnlineCount', {
            params: {
                webTimeType: this.state.time
            }
        }).then(res => {
            let data = res.data
            let appCount = data.appCount;
            let appOnlineCount = data.appOnlineCount
            let styleappOnlineCount = appOnlineCount / appCount * 100 + '%';
            $('.inner_change').css('width', styleappOnlineCount)
            $('.top_change').css('width', styleappOnlineCount)
            this.setState({
                appOnlineCount: appOnlineCount,
                appCount: appCount,
            })
        });
    }
    // 表格
    setTableData() {
        axios.get('/AppIsNewController/ServerOnline', {
            params: {
                timeId: this.state.timeId,
                appSourceDataId: sessionStorage.getItem('AppItemId'),
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            }
        }).then(res => {
            this.setState({
                tableData: res.data.appList,
                allTotal: res.data.page.pageCount
            })
        })
    }
    // 基线
    getLineData() {
        axios.get('/kpiDing/forecastAppDesc', {
            params: {
                timeId: this.state.timeId,
                appSourceDataId: sessionStorage.getItem('AppItemId'),
                key: this.state.lineName
            }
        }).then(res => {
            this.setState({
                lineData: res.data
            })
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.AppItemId !== nextProps.AppItemId) {
            this.setState({
                clickTab: 0,
                clickTab2: 0,
                timeId: 6,
                normInd: 0,
                newNormInd: 0,
                curKpiName: '在线时长',
                lineName: '49~online_time~null'
            }, () => {
                this.getOnlineTime();
                this.getData();
                this.setTableData();
                this.getLineData();
                this.getbarData()
            })
        }
    }
    componentDidMount() {
        this.getOnlineTime();
        this.getData();
        this.setTableData();
        this.getLineData();
        this.getbarData();
    }
    render() {
        const { rankData, rankId, tabs, tabs2, normSele, normInd, newNormInd, curKpiName, clickTab, clickTab2, modal1, OnlineTimeData, tableColumns, tableData, newTitle, lineFlag, lineData } = this.state;
        return (<div className='dialogSource'>
            <div className='dialogHeader'>
                <div>
                    <Icon type='left' onClick={() => {
                        $('.serviseBlock2').hide();
                        $('.homePageHeader').show();
                        $('.footer').show();
                        $('.applicationBox').show();
                    }
                    } />
                </div>
                <div>业务系统服务在线</div>
                <div></div>
            </div>
            <div className='icanfly'>
                <Tabs
                    tabs={tabs}
                    initialPage={clickTab}
                    page={clickTab}
                    animated={false}
                    swipeable={false}
                    useOnPan={true}
                    onChange={(tab, index) => this.gettime(tab, index)}
                >
                    {
                        tabs.map((item, index) => {
                            return <div style={{ height: '100%', paddingTop: '10px' }} key={index}>
                                <div className='dialogbg'>
                                    <div className='sourceTitle'>
                                        <img src={listIcon} alt='' className='zhaiyao' />
                                        <span>业务系统服务在线摘要</span>
                                    </div>
                                    <i></i>
                                    <p>在此时间段，业务系统在线数量</p>
                                    <div className="choice_box ">
                                        <div className="top_change">{this.state.appOnlineCount}</div>
                                        <div className="bg_bar">
                                            <div className="inner_change" ></div>
                                        </div>
                                        <div className="bottom_change">{this.state.appCount}</div>
                                    </div>
                                </div>
                                <div className='dialogbg'>
                                    <p className='sourceTitle'>{curKpiName}</p>
                                    <p>描述内容：{curKpiName}</p>
                                    <div onClick={this.showModal('modal1')} className='seleIcon'>
                                        <span>切换指标</span>
                                        <Icon type="down" size='md' />
                                    </div>
                                    {
                                        normInd == 0 ?// 在线时长
                                            <div style={{ height: '400px' }}>
                                                <ReactEcharts
                                                    style={{ height: '400px' }}
                                                    option={
                                                        {
                                                            tooltip: {
                                                                confine: true,
                                                                trigger: 'axis',
                                                                axisPointer: {
                                                                    lineStyle: {
                                                                        color: '#7588E4'
                                                                    }
                                                                },
                                                                backgroundColor: 'rgba(255,255,255,1)',
                                                                padding: [20, 20],
                                                                textStyle: {
                                                                    color: '#7588E4',
                                                                },
                                                                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                                                            },
                                                            grid: {
                                                                left: '2%',
                                                                right: '2%',
                                                                top: 60,
                                                                bottom: 60,
                                                                containLabel: true
                                                            },
                                                            legend: {
                                                                bottom: 5,
                                                                data: ['在线时长']
                                                            },
                                                            xAxis: {
                                                                type: 'category',
                                                                data: OnlineTimeData ? OnlineTimeData.time : '',
                                                                boundaryGap: true,
                                                                splitLine: {
                                                                    show: false,

                                                                },
                                                                axisTick: {
                                                                    show: false
                                                                },
                                                                axisLine: {
                                                                    lineStyle: {
                                                                        color: '#609ee9'
                                                                    }
                                                                },
                                                                axisLabel: {
                                                                    margin: 10,
                                                                    textStyle: {
                                                                        fontSize: 10
                                                                    }
                                                                }
                                                            },
                                                            yAxis: {
                                                                name: OnlineTimeData ? OnlineTimeData.unit : '',
                                                                type: 'value',
                                                                splitLine: {
                                                                    lineStyle: {
                                                                        color: ['#D4DFF5']
                                                                    }
                                                                },
                                                                axisTick: {
                                                                    show: false
                                                                },
                                                                axisLine: {
                                                                    lineStyle: {
                                                                        color: '#609ee9'
                                                                    }
                                                                },
                                                                axisLabel: {
                                                                    margin: 10,
                                                                    textStyle: {
                                                                        fontSize: 12
                                                                    }
                                                                }
                                                            },
                                                            series: [
                                                                {
                                                                    name: '在线时长',
                                                                    type: 'bar',
                                                                    smooth: true,
                                                                    showSymbol: false,
                                                                    symbol: 'circle',
                                                                    symbolSize: 6,
                                                                    data: OnlineTimeData ? OnlineTimeData.value : '',

                                                                    itemStyle: {
                                                                        normal: {
                                                                            color: '#58c8da'
                                                                        }
                                                                    },
                                                                    lineStyle: {
                                                                        normal: {
                                                                            width: 3
                                                                        }
                                                                    }
                                                                }]
                                                        }
                                                    }
                                                />
                                            </div>
                                            : normInd == 1 ?// 在线服务率
                                                <div style={{ height: '400px' }}>
                                                    <ReactEcharts
                                                        style={{ height: '370px' }}
                                                        option={
                                                            {
                                                                grid: {
                                                                    top: '1%',
                                                                    left: '3%',
                                                                    right: '4%',
                                                                    bottom: '1%',
                                                                    // containLabel: true
                                                                },
                                                                xAxis: [{
                                                                    show: false,
                                                                    type: 'category',
                                                                    data: this.state.onlineStime,
                                                                }],
                                                                yAxis: [{
                                                                    show: false,
                                                                    type: 'value',
                                                                    max: 0.5,
                                                                }],
                                                                series: [{
                                                                    name: '在线服务率',
                                                                    type: 'bar',
                                                                    barWidth: '100%',
                                                                    itemStyle: {
                                                                        normal: {
                                                                            color: (data) => {
                                                                                if (data.data > 1) {
                                                                                    return `rgb(40, 50, 92)`
                                                                                } else {
                                                                                    return `rgb(233, 39, 58)`
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    data: this.state.onlineSvalue
                                                                }]
                                                            }
                                                        }
                                                    />
                                                    <div className="clearfix">
                                                        <div className="left_time">
                                                            {this.state.onlineStartTime}
                                                        </div>
                                                        <div className="right_time">
                                                            {this.state.onlineEndTime}
                                                        </div>
                                                    </div>
                                                </div>
                                                : normInd == 2 ? //资源利用水平
                                                    <div style={{ height: '400px' }}>
                                                        <div className="double_top_title">
                                                            <div><span>{this.state.rusePercent}</span>的时段过度利用</div>
                                                        </div>
                                                        <div style={{ height: '350px' }}>
                                                            <ReactEcharts
                                                                style={{ height: '350px' }}
                                                                option={
                                                                    {
                                                                        backgroundColor: 'rgb(40, 50, 92)',
                                                                        grid: {
                                                                            top: '2%',
                                                                            left: '0',
                                                                            right: '0',
                                                                            bottom: '2px',
                                                                        },
                                                                        xAxis: [
                                                                            {
                                                                                type: 'category',
                                                                                data: this.state.ruseTime,
                                                                                axisLabel: {
                                                                                    marginRight: 50,
                                                                                    // marginLeft:'20px',
                                                                                    textStyle: {
                                                                                        color: '#fff',
                                                                                    },
                                                                                    fontSize: '4px',
                                                                                },
                                                                            }
                                                                        ],
                                                                        yAxis: [
                                                                            {
                                                                                type: 'value',
                                                                                show: false,
                                                                                max: 100
                                                                            }
                                                                        ],
                                                                        series: [
                                                                            {
                                                                                name: '',
                                                                                type: 'bar',
                                                                                barWidth: '100%',
                                                                                itemStyle: {
                                                                                    normal: {
                                                                                        color: (data) => {
                                                                                            if (data.data < 100) {
                                                                                                return `rgb(40, 50, 92)`
                                                                                            } else {
                                                                                                return `rgb(233, 39, 58)`
                                                                                            }
                                                                                        },
                                                                                        borderWidth: 1,
                                                                                        borderColor: this.state.ruseValue < 100 ? 'rgb(40, 50, 92)' : 'rgb(233, 39, 58)'
                                                                                    }
                                                                                },
                                                                                data: this.state.ruseValue,
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            />
                                                        </div>
                                                        <div className="clearfix">
                                                            <span className="fl">{this.state.ruseStartTime}</span>
                                                            <span className="fr">{this.state.ruseEndTime}</span>
                                                        </div>
                                                    </div>
                                                    : ''
                                    }
                                </div>
                                <div className='tab2'>
                                    <Tabs tabs={tabs2}
                                        initialPage={clickTab2}
                                        page={clickTab2}
                                        swipeable={false}
                                        useOnPan={true}
                                        onChange={(tab, index) => this.setState({ clickTab2: index })}
                                    >
                                        <div className='tables'>
                                            <Table
                                                columns={tableColumns}
                                                dataSource={tableData}
                                                bordered={true}
                                                scroll={{ x: 800 }}
                                                className='tableCont'
                                            />
                                        </div>
                                        {
                                            lineFlag ? <div className='kongBox'></div>
                                                : <div className="chart_box">
                                                    <ReactEcharts
                                                        option={
                                                            {
                                                                grid: {
                                                                    top: 30,
                                                                    left: 40, //grid 组件离容器左侧的距离。
                                                                    right: 20, //grid 组件离容器右侧的距离。
                                                                    bottom: 60, //grid 组件离容器下侧的距离。
                                                                },
                                                                legend: {
                                                                    data: [this.state.curKpiName, '预测基准线'],
                                                                    icon: 'roundRect',
                                                                    bottom: -5
                                                                },
                                                                tooltip: {
                                                                    trigger: 'axis',
                                                                    axisPointer: {
                                                                        lineStyle: {
                                                                            color: '#999'
                                                                        }
                                                                    },
                                                                    backgroundColor: 'rgba(255,255,255,1)',
                                                                    padding: [20, 20],
                                                                    textStyle: {
                                                                        color: '#666666',
                                                                    },
                                                                    extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                                                                },
                                                                xAxis: [{
                                                                    // name: lineData.dayUnit,
                                                                    axisLine: {
                                                                        show: false
                                                                    },
                                                                    axisTick: {
                                                                        show: false,
                                                                        alignWithLabel: true
                                                                    },
                                                                    type: 'category',
                                                                    data: lineData.time
                                                                }],
                                                                yAxis: [
                                                                    {
                                                                        type: 'value', //坐标轴类型。'value' 数值轴，适用于连续数据;'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据;'time' 时间轴;'log' 对数轴.
                                                                        name: '单位' + (lineData.unit), //坐标轴名称。
                                                                        splitLine: {
                                                                            lineStyle: {
                                                                                color: '#f2f2f2' //分隔线颜色设置
                                                                            }
                                                                        },
                                                                        axisLine: {
                                                                            show: false
                                                                        },
                                                                        axisTick: {
                                                                            show: false,
                                                                            alignWithLabel: true
                                                                        },

                                                                    }],
                                                                dataZoom: {
                                                                    show: true,
                                                                    start: 0,
                                                                    end: 20,
                                                                    height: 20,
                                                                    bottom: 20,
                                                                    // filterMode: 'empty'
                                                                },
                                                                series: [
                                                                    {
                                                                        name: this.state.curKpiName,
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

                                                                        itemStyle: {
                                                                            normal: {
                                                                                color: '#666666',
                                                                            }
                                                                        },
                                                                        data: lineData.doubleNows
                                                                    },
                                                                    {
                                                                        name: '预测基准线',
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
                                                                        itemStyle: {
                                                                            normal: {
                                                                                color: '#9955cc',
                                                                            }
                                                                        },
                                                                        data: lineData.doubleFs
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    />
                                                </div>
                                        }
                                        {
                                            lineFlag ? <div className='kongBox'></div>
                                                : <div className="rank_chart">
                                                    <p>当前业务系统排名：{rankId[0] ? rankId[0].pm : ''} 名</p>
                                                    <p>排名柱状图</p>
                                                    <ul >
                                                        {rankData.map((k, y) => (
                                                            <li key={y} >
                                                                <div className="list_item" style={{ width: k.zhanbi > 50 ? (k.zhanbi) + '%' : '100%' }}>
                                                                    <div className="fl">{y + 1}.{k.name}</div>
                                                                    <div className="fr">{k.value}</div>
                                                                </div>
                                                                <div className="list_inner_box">
                                                                    <div className="list_chart" style={{ width: k.zhanbi > 0 ? (k.zhanbi) + '%' : '0.01%', background: 'rgba(57, 126, 253, 1)' }}>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                        }
                                    </Tabs>
                                </div>
                                <Modal
                                    visible={modal1}
                                    transparent
                                    maskClosable={false}
                                    onClose={this.onClose('modal1')}
                                    title={<div className='seleType_head'>
                                        <b></b>
                                        指标选择
                                    <Icon type='cross' size='md' color='#fff' onClick={() => {
                                            this.onClose('modal1')()
                                        }} />
                                    </div>}
                                    footer={[{
                                        text: <div className='sourceSeleBtn'>
                                            <div onClick={() => {
                                                this.onClose('modal1')()
                                                this.setState({
                                                    normInd,
                                                }, () => {
                                                    if (this.state.normInd == 0) {
                                                        this.getOnlineTime()
                                                    } else if (this.state.normInd == 1) {
                                                        this.getServies()
                                                    } else if (this.state.normInd == 2) {
                                                        this.getRuse()
                                                    }
                                                })
                                            }}>取消</div>
                                            <div className='primary' onClick={() => {
                                                this.onClose('modal1')()
                                                this.setState({
                                                    normInd: newNormInd,
                                                    curKpiName: newTitle
                                                }, () => {
                                                    if (this.state.newNormInd == 0) {// 在线时长
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: false,
                                                            lineName: '49~online_time~null',
                                                            tablekpiId: 49
                                                        }, () => {
                                                            this.getLineData();
                                                            this.getbarData();
                                                            this.getOnlineTime()
                                                        })
                                                    } else if (this.state.newNormInd == 1) { // 在线服务率 -- 资源服务率
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: false,
                                                            lineName: '49~online_time~null',
                                                            tablekpiId: null,
                                                        }, () => {
                                                            this.getLineData();
                                                            this.getbarData();
                                                            this.getServies()
                                                        })
                                                    } else if (this.state.newNormInd == 2) { // 资源利用率
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: true,
                                                        }, () => {
                                                            this.getLineData();
                                                            this.getRuse()
                                                        })
                                                    }
                                                })
                                            }}>确定</div>
                                        </div>,
                                    }]}
                                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                                >
                                    <div className='normStyle'>
                                        <p>
                                            选择指标：
                                    </p>
                                        <ul>
                                            {
                                                normSele.map((item, index) => {
                                                    return <li key={index} className={index === newNormInd ? 'active' : ''} onClick={() => {
                                                        this.setState({
                                                            newNormInd: index,
                                                            newTitle: item.title
                                                        })
                                                    }} >
                                                        {
                                                            index === newNormInd ? <div><img src={item.img} alt='图片不存在' /> </div> : <div><img src={item.clickImg} alt='图片不存在' /> </div>
                                                        }
                                                        <div>
                                                            {item.title}
                                                            <span>{item.unit}</span>
                                                        </div>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                </Modal>
                            </div>
                        })
                    }
                </Tabs>
            </div>
        </div>
        );
    }
}

export default AppTab;