import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import axios from 'axios';
import { Table } from 'antd';
import listIcon from 'images/applistIcon.svg';
import ReactEcharts from 'echarts-for-react';
import { Tabs, Icon, Modal } from 'antd-mobile';
import sadFace from 'images/sadFace.svg';
import pingFace from 'images/normalFace.svg';
import happyFace from 'images/smailFace.svg';


import lrlconClick from '../../../images/selectIcons/lrIcon_click.svg';
import lrlcon from '../../../images/selectIcons/lrIcon_normal.svg';
import twolconClick from '../../../images/selectIcons/twoIcon_click.svg';
import twolcon from '../../../images/selectIcons/twoIcon_normal.svg';
import clocklconClick from '../../../images/selectIcons/clockIcon_click.svg';
import clocklcon from '../../../images/selectIcons/clockIcon_normal.svg';
import barlconClick from '../../../images/selectIcons/barIcon_click.svg';
import barlcon from '../../../images/selectIcons/barIcon_normal.svg';
import onelconClick from '../../../images/selectIcons/oneIcon_click.svg';
import onelcon from '../../../images/selectIcons/oneIcon_normal.svg';
import threelconClick from '../../../images/selectIcons/threeIcon_click.svg';
import threelcon from '../../../images/selectIcons/threeIcon_normal.svg';
import linelconClick from '../../../images/selectIcons/lineIcon_click.svg';
import linelcon from '../../../images/selectIcons/lineIcon_normal.svg';
import lrIconClick from 'images/selectIcons/lrIcon_click.svg';
import lrIconNormal from 'images/selectIcons/lrIcon_normal.svg';
import upIconClick from 'images/selectIcons/upIcon_click.svg';
import upIconNormal from 'images/selectIcons/upIcon_normal.svg';
import downIconClick from 'images/selectIcons/downIcon_click.svg';
import downIconNormal from 'images/selectIcons/downIcon_normal.svg';

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
class AllHandle extends Component {
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
                { title: '历史分布特征' }
            ],
            normSele: [
                {
                    title: '响应率',
                    unit: '（%）'
                }, {
                    title: '响应时延',
                    unit: '（ms）'
                }, {
                    title: '关闭连接时长',
                    unit: '（ms）'
                }, {
                    title: '数据包往返时间',
                    unit: '（ms）'
                }, {
                    title: '建立连接成功率',
                    unit: '（%）'
                }, {
                    title: '保持建立连接成功率',
                    unit: '（%）'
                }, {
                    title: '关闭连接成功率',
                    unit: '（%）'
                }, {
                    title: '总报文速率',
                    unit: ''
                }, {
                    title: '上行报文速率',
                    unit: ''
                }, {
                    title: '下行报文速率',
                    unit: ''
                }
            ],
            curKpiName: '响应率',
            xiangyingUnit: '(%)',
            handleData: [],
            rateUnits: {},
            PerformanceData: {},
            rateData: {},
            tableColumns: [
                {
                    title: '时间',
                    dataIndex: 'time',
                    key: 0,
                    align: 'center',
                    width: 150,
                    fixed:'left'
                },
                {
                    title: '响应率(%)',
                    dataIndex: 'xiangying',
                    key: 1,
                    align: 'center',
                },
                {
                    title: '响应时延(ms)',
                    dataIndex: 'xiangyingshiyan',
                    key: 2,
                    align: 'center',
                },
                {
                    title: '关闭连接时长(ms)',
                    dataIndex: 'access',
                    key: 3,
                    align: 'center',
                },
                {
                    title: '数据包往返时间(ms)',
                    dataIndex: 'wangfanTime',
                    key: 4,
                    align: 'center',
                },
                {
                    title: '建立连接成功率(%)',
                    dataIndex: 'createRate',
                    key: 5,
                    align: 'center',
                },
                {
                    title: '保持建立连接成功率(%)',
                    dataIndex: 'keepAlivedRate',
                    key: 6,
                    align: 'center',
                },
                {
                    title: '关闭连接成功率(%)',
                    dataIndex: 'clostRate',
                    key: 7,
                    align: 'center',
                },
                {
                    title: '总报文速率',
                    dataIndex: 'sumRateData',
                    key: 8,
                    align: 'center',
                },
                {
                    title: '上行报文速率',
                    dataIndex: 'upData',
                    key: 9,
                    align: 'center',
                },
                {
                    title: '下行报文速率',
                    dataIndex: 'downData',
                    key: 10,
                    align: 'center',
                }
            ],
            tableData: [],
            threeStatus: [],
            pageNum: 1,
            pageSize: 1000,
            clickTab: 0,
            newTitle: '',
            clickTab2: 0,
            lineData: [],
            lineName: 'null~service_rate~4',
            lineFlag: true,
            distributionData: []
        }
    }
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        let { rateUnits } = this.state;
        this.setState({
            [key]: true,
            normSele: [
                {
                    clickImg: twolconClick,
                    img: twolcon,
                    title: '响应率',
                    unit: '(%)'
                }, {
                    clickImg: lrlconClick,
                    img: lrlcon,
                    title: '响应时延',
                    unit: '(ms)'
                }, {
                    clickImg: clocklconClick,
                    img: clocklcon,
                    title: '关闭连接时长',
                    unit: '(ms)'
                }, {
                    clickImg: barlconClick,
                    img: barlcon,
                    title: '数据包往返时间',
                    unit: '(ms)'
                }, {
                    clickImg: onelconClick,
                    img: onelcon,
                    title: '建立连接成功率',
                    unit: '(%)'
                }, {
                    clickImg: threelconClick,
                    img: threelcon,
                    title: '保持建立连接成功率',
                    unit: '(%)'
                }, {
                    clickImg: linelconClick,
                    img: linelcon,
                    title: '关闭连接成功率',
                    unit: '(%)'
                }, {
                    clickImg: lrIconClick,
                    img: lrIconNormal,
                    title: '总报文速率',
                    unit: rateUnits.rateUnit
                }, {
                    clickImg: upIconClick,
                    img: upIconNormal,
                    title: '上行报文速率',
                    unit: rateUnits.upUnit
                }, {
                    clickImg: downIconClick,
                    img: downIconNormal,
                    title: '下行报文速率',
                    unit: rateUnits.downUnit
                }
            ],
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
            this.businessAxios();
            this.getdashed();
            this.setTableData();
            this.getLineData();
        })
    }
    // 响应时延
    getdashed() {
        axios.get('http://192.168.0.144:8080/ScreenMonitor/responseRateResponseDelayStability', {
            params: {
                webTimeType: this.state.timeId
            }
        }).then(res => {
            this.setState({
                threeStatus: res.data
            })
        })
    }
    // 单位和数据
    businessAxios() {
        axios.get('http://192.168.0.144:8080/performance/getAppPerformanceZhong', {
            params: {
                webTimeType: this.state.timeId,
                pageSize: 10000
            }
        }).then(res => {
            let detailsMap = res.data.detailsMap;
            this.setState({
                PerformanceData: {
                    xiangying: detailsMap.xiangying,
                    xiangyingshiyan: detailsMap.xiangyingshiyan,
                    closeTime: detailsMap.closeTime,
                    wangfanTime: detailsMap.wangfanTime,
                    createRate: detailsMap.createRate,
                    keepAlivedRate: detailsMap.keepAlivedRate,
                    clostRate: detailsMap.clostRate
                },
                xiangyingUnit: '(%)',
                handleData: detailsMap.xiangying,
                pageTime: res.data.time
            })
        })

        axios.get('http://192.168.0.144:8080/performance/getAppPacketRateZhong', {
            params: {
                timeId: this.state.timeId,
                pageSize: 10000
            }
        }).then(res => {
            let detailsMap = res.data.detailsMap;
            this.setState({
                rateUnits: {
                    rateUnit: res.data.sumUnit,
                    upUnit: res.data.upUnit,
                    downUnit: res.data.downUnit
                },
                rateData: {
                    sumRateData: detailsMap.sumPacket,
                    upData: detailsMap.upPacket,
                    downData: detailsMap.downPacket
                }
            })
        })
    }
    // 表格
    setTableData() {
        axios.get('http://192.168.0.144:8080/AppIsNewController/appProcessingPerformanceNewApp', {
            params: {
                timeId: this.state.timeId,
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            }
        }).then(res => {
            if (res.data.appList.length > 0) {
                this.setState({
                    tableData: res.data.appList
                })
            }
        })
    }
    tabNormId(index, title) {
        this.setState({
            newNormInd: index,
            newTitle: title
        })
    }
        // 基线
        getLineData() {
            axios.get('http://192.168.0.144:8080/kpiDing/forecastAppDesc', {
                params: {
                    timeId: this.state.timeId,
                    // appSourceDataId: this.props.id,
                    key: this.state.lineName
                }
            }).then(res => {
                this.setState({
                    lineData: res.data
                })
            });
            axios.get('http://192.168.0.144:8080/kpiDing/forecastAppTimeDistribution',{
                params:{
                    timeId:this.state.timeId,
                    // appSourceDataId: this.props.id,
                    key: this.state.lineName
                }
            }).then(res=>{
                this.setState({
                    distributionData: res.data
                })
            })
        }
    UNSAFE_componentWillMount() {
        this.setState({
            timeId: 6,
            clickTab: 0,
            clickTab2: 0,
            normal: 0,
            newNormInd: 0,
            curKpiName: '响应率',
            lineFlag: true,
            xiangyingUnit: '(%)',
        }, () => {
            this.getdashed();
            this.businessAxios();
            this.setTableData();
            this.getLineData();
        })
    }
    render() {
        const { tabs, tabs2, normSele, normInd, newNormInd, curKpiName, modal1, tableColumns, tableData, threeStatus, newTitle, clickTab, clickTab2, lineFlag, distributionData, lineData } = this.state;
        return (<div className='dialogSource'>
            <div className='dialogHeader'>
                <div>
                    <Icon type='left' onClick={() => {
                        $('.serviseBlock1').hide();
                        $('.homePageHeader').show();
                        $('.footer').show();
                        $('.applicationBox').show();
                    }
                    } />
                </div>
                <div>全局应用处理能力</div>
                <div></div>
            </div>
            <div className='icanfly'>
                <Tabs tabs={tabs} initialPage={clickTab} page={clickTab} animated={false} swipeable={false} useOnPan={true} onChange={(tab, index) => this.gettime(tab, index)}>
                    {
                        tabs.map((item, index) => {
                            return <div style={{ height: '100%', paddingTop: '10px' }} key={index}>
                                <div className='dialogbg'>
                                    <div className='sourceTitle'>
                                        <img src={listIcon} alt='' className='zhaiyao' />
                                        <span>全局延时响应</span>
                                    </div>
                                    <i></i>
                                    <div className="shiyanBox">
                                        <div className='appXysy'>
                                            {
                                                threeStatus.responseDelayGrade === '优' ? <img src={happyFace} alt='' /> : <img src='' alt='' />
                                            }
                                            {
                                                threeStatus.responseDelayGrade === '良' ? <img src={pingFace} alt='' /> : <img src='' alt='' />
                                            }
                                            {
                                                threeStatus.responseDelayGrade === '差' ? <img src={sadFace} alt='' /> : <img src='' alt='' />
                                            }
                                        </div>
                                        <div className='title'>
                                            <p>响应时延</p>
                                            <p>{threeStatus.responseDelay}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='dialogbg'>
                                    <p className='sourceTitle'>{curKpiName}</p>
                                    <p>描述内容：{curKpiName}</p>
                                    <div onClick={this.showModal('modal1')} className='seleIcon'>
                                        <span>切换指标</span>
                                        <Icon type="down" size='md' />
                                    </div>
                                    <ReactEcharts
                                        style={{ height: '350px' }}
                                        option={
                                            {
                                                title: {
                                                    text: ``,
                                                    left: 0,
                                                    top: 0,
                                                    textStyle: {
                                                        color: 'rgb(102, 102, 102)',
                                                        fontSize: '12',
                                                        fontWeight: 'normal'
                                                    }
                                                },
                                                tooltip: {
                                                    trigger: 'axis',
                                                    axisPointer: {
                                                        lineStyle: {
                                                            color: 'rgb(82, 108, 255)'
                                                        }
                                                    },
                                                    formatter: (params) => {
                                                        return `<div style="height:80px;border-radius:5px;background:#fff;box-shadow:0 0 10px 5px #aaa;font-size: 12px;padding: 6px 20px;box-sizing:border-box">
                                                                <p>${params[0].axisValueLabel}</p>
                                                                <p>${params[0].seriesName} ${params[0].data}</p>
                                                            </div>`
                                                    },
                                                    backgroundColor: 'rgba(255,255,255,1)',
                                                    padding: [5, 0, 5, 0],
                                                    textStyle: {
                                                        color: '#000',
                                                    },
                                                    extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                                                },
                                                legend: {
                                                    x: '40%',
                                                    bottom: '12',
                                                    textStyle: {
                                                        color: '#333',
                                                    },
                                                    data: [this.state.curKpiName]
                                                },
                                                grid: {
                                                    left: 40,
                                                    right: 10,
                                                    top: 60,
                                                    bottom: 60
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
                                                        lineStyle: {
                                                            color: 'rgb(82, 108, 255)'
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
                                                    name: '单位' + this.state.xiangyingUnit,
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
                                                            color: 'rgb(82, 108, 255)'
                                                        }
                                                    },
                                                    axisLabel: {
                                                        margin: 10,
                                                        textStyle: {
                                                            fontSize: 12
                                                        },
                                                        formatter: function (value) {
                                                            if (value >= 10000 && value < 10000000) {
                                                                value = value / 10000 + "w";
                                                            }
                                                            return value;
                                                        }
                                                    }
                                                },
                                                series: [
                                                    {
                                                        name: this.state.curKpiName,
                                                        type: 'line',
                                                        smooth: true,
                                                        showSymbol: false,
                                                        data: this.state.handleData,
                                                        itemStyle: {
                                                            normal: {
                                                                color: 'rgb(82, 108, 255)'
                                                            }
                                                        }
                                                    }]
                                            }
                                        }
                                    />
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
                                            lineFlag ? <div className='kongBox'>您选择的指标无基线数据</div>
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
                                            lineFlag ? <div className='kongBox'>您选择的指标无分布特征数据</div>
                                                : <div><div className="hot_box">
                                                    <ReactEcharts
                                                        option={
                                                            {
                                                                title: {
                                                                    subtext: '预测基线的时间分布特征',
                                                                    left: 'center',
                                                                    top: '10'
                                                                },
                                                                tooltip: {
                                                                    position: 'top',
                                                                    // trigger: 'axis',
                                                                    axisPointer: {
                                                                        lineStyle: {
                                                                            color: '#000'
                                                                        }
                                                                    },
                                                                    backgroundColor: 'rgba(255,255,255,1)',
                                                                    padding: [20, 20],
                                                                    textStyle: {
                                                                        color: '#7588E4',
                                                                    },
                                                                    extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)',
                                                                    formatter: (params) => {
                                                                        // console.log(params);
                                                                        let res = `<div>${this.state.curKpiName}: ${params.data[3]}</div>`;
                                                                        return res
                                                                    }
                                                                },
                                                                grid: {
                                                                    top: 40,
                                                                    left: 40,
                                                                    right: '5%',
                                                                    bottom: 60
                                                                },
                                                                xAxis: {
                                                                    name: '',
                                                                    type: 'category',
                                                                    axisLine: {
                                                                        show: false
                                                                    },
                                                                    axisTick: {
                                                                        show: false,
                                                                        alignWithLabel: true
                                                                    },
                                                                    data: distributionData.xNames
                                                                },
                                                                yAxis: {
                                                                    // name: '单位()',
                                                                    type: 'category',
                                                                    axisLine: {
                                                                        show: false
                                                                    },
                                                                    axisTick: {
                                                                        show: false,
                                                                        alignWithLabel: true
                                                                    },
                                                                    data: distributionData.yNames
                                                                },
                                                                visualMap: {
                                                                    min: 1,
                                                                    max: distributionData.max ? distributionData.max.value : '',
                                                                    calculable: true,
                                                                    orient: 'horizontal',
                                                                    left: '10',
                                                                    // right: '10%',
                                                                    bottom: '1%',
                                                                    itemHeight: document.body.clientWidth - 150,
                                                                    text: [distributionData.max ? distributionData.max.showValue : '', '0'],// 文本，默认为数值文本
                                                                    //color:['#20a0ff','#D2EDFF'],
                                                                    calculable: false,
                                                                    color: ["#2f5ec4", "#3462c6", "#3664c6", "#3b68c8", '#3e6bc9  ', '#4470cb', '#4873cc', '#4974cc', '#4974cc', '#4c76cd', '#557ed0', '#5780d0', '#5c84d2', '#6188d3', '#658cd5', '#668dd5', '#6d93d7', '#7296d8', '#7297d9', '#8eaee1', '#91b1e2', '#92b2e3', '#99b8e5', '#9cbae6', '#a6c3e9', '#a9c5ea', '#b5cfed', '#b9d3ef', '#c5ddf2', '#c9e0f4', '#d6ebf7', '#d9eef9', '#def2fa']
                                                                },
                                                                series: distributionData.avgValue,
                                                                label: {
                                                                    normal: {
                                                                        show: true
                                                                    }
                                                                },
                                                                itemStyle: {
                                                                    emphasis: {
                                                                        shadowBlur: 10,
                                                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    />
                                                </div></div>
                                        }
                                    </Tabs>
                                </div>
                                <div>
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
                                                    curKpiName
                                                })
                                            }}>取消</div>
                                            <div className='primary' onClick={() => {
                                                this.onClose('modal1')()
                                                this.setState({
                                                    normInd: newNormInd,
                                                    curKpiName: newTitle
                                                }, () => {
                                                    const { newNormInd, PerformanceData, rateData, rateUnits } = this.state;
                                                    if (newNormInd == 0) {
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: true,
                                                            xiangyingUnit: '(%)',
                                                            handleData: PerformanceData.xiangying
                                                        })
                                                    } else if (newNormInd == 1) {
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: false,
                                                            lineName: '44~response_count~null',
                                                            xiangyingUnit: '(ms)',
                                                            handleData: PerformanceData.xiangyingshiyan
                                                        }, () => {
                                                            this.getLineData();
                                                        })
                                                    } else if (newNormInd == 2) {
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: true,
                                                            xiangyingUnit: '(ms)',
                                                            handleData: PerformanceData.closeTime
                                                        })
                                                    } else if (newNormInd == 3) {
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: false,
                                                            lineName: '45~packet_delay_time~null',
                                                            xiangyingUnit: '(ms)',
                                                            handleData: PerformanceData.wangfanTime
                                                        }, () => {
                                                            this.getLineData();
                                                        })
                                                    } else if (newNormInd == 4) {
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: false,
                                                            lineName: '48~build_connect_time~null',
                                                            xiangyingUnit: '(%)',
                                                            handleData: PerformanceData.createRate
                                                        }, () => {
                                                            this.getLineData();
                                                        })
                                                    } else if (newNormInd == 5) {
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: true,
                                                            xiangyingUnit: '(%)',
                                                            handleData: PerformanceData.keepAlivedRate
                                                        })
                                                    } else if (newNormInd == 6) {
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: true,
                                                            xiangyingUnit: '(%)',
                                                            handleData: PerformanceData.clostRate
                                                        })
                                                    } else if (newNormInd == 7) {
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: true,
                                                            xiangyingUnit: rateUnits.rateUnit,
                                                            handleData: rateData.sumRateData
                                                        })
                                                    } else if (newNormInd == 8) {
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: false,
                                                            lineName: '14~up_second_packet~null',
                                                            xiangyingUnit: rateUnits.upUnit,
                                                            handleData: rateData.upData
                                                        }, () => {
                                                            this.getLineData();
                                                        })
                                                    } else if (newNormInd == 9) {
                                                        this.setState({
                                                            clickTab2: 0,
                                                            lineFlag: false,
                                                            lineName: '15~down_second_packet~null',
                                                            xiangyingUnit: rateUnits.downUnit,
                                                            handleData: rateData.downData
                                                        }, () => {
                                                            this.getLineData();
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
                                                        this.tabNormId(index, item.title)
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

export default AllHandle;