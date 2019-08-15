import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import { Tabs, Icon, Modal } from 'antd-mobile';
import { DateRangePicker } from 'element-react';

import lrlconClick from '../../../images/selectIcons/lrIcon_click.svg';
import lrlcon from '../../../images/selectIcons/lrIcon_normal.svg';
import twolconClick from '../../../images/selectIcons/twoIcon_click.svg';
import twolcon from '../../../images/selectIcons/twoIcon_normal.svg';
import clocklconClick from '../../../images/selectIcons/clockIcon_click.svg';
import clocklcon from '../../../images/selectIcons/clockIcon_normal.svg';
import barlconClick from '../../../images/selectIcons/barIcon_click.svg';
import barlcon from '../../../images/selectIcons/barIcon_normal.svg';

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
            value1: null,
            modal1: false,
            normInd: 0,// 指标id
            newNormInd: 0,
            timeId: 6,
            tablekpiId: 4,
            appData: [],
            tabs: [
                { title: '实时' },
                { title: '今日' },
                { title: '本周' },
                { title: '本月' },
                { title: `具体时间` },
            ],
            nowTimeData: '具体时间',
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
                }, {
                    clickImg: barlconClick,
                    img: barlcon,
                    title: '资源的正常率',
                    unit: '（%）'
                }
            ],
            curKpiName: '在线时长',
            onlineSvalue: [],
            onlineStime: [],
            OnlineTimeData: [],
            oldTime: this.getFormatDate(new Date(new Date().getTime() - 2 * 60 * 60 * 1000)),
            nowTime: this.getFormatDate(new Date()),
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
    // 获取时间
    getFormatDate(timeDate) {
        var year = timeDate.getFullYear();       //年
        var month = timeDate.getMonth() + 1;     //月
        var day = timeDate.getDate();            //日
        var hh = timeDate.getHours();            //时
        var mm = timeDate.getMinutes();          //分
        var clock = year + "-";
        if (month < 10) clock += "0";
        clock += month + "-";
        if (day < 10) clock += "0";
        clock += day + "_";
        if (hh < 10) clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm;
        return (clock);
    }
    gettime = (tab, i) => {
        if (i === 0) {//最近两小时
            this.setState({
                oldTime: this.getFormatDate(new Date(new Date().getTime() - 2 * 60 * 60 * 1000)),
                nowTime: this.getFormatDate(new Date()),
                timeId: 6
            }, () => {
                if (this.state.normInd == 0) {
                    this.getOnlineTime()
                } else if (this.state.normInd == 1) {
                    this.getServies()
                } else if (this.state.normInd == 2) {
                    this.getRuse()
                }
            })
        } else if (i === 1) {// 今日
            this.setState({
                oldTime: this.getFormatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)),
                nowTime: this.getFormatDate(new Date()),
                timeId: 0
            }, () => {
                if (this.state.normInd == 0) {
                    this.getOnlineTime()
                } else if (this.state.normInd == 1) {
                    this.getServies()
                } else if (this.state.normInd == 2) {
                    this.getRuse()
                }
            })
        } else if (i === 2) {// 本周
            this.setState({
                oldTime: this.getFormatDate(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)),
                nowTime: this.getFormatDate(new Date()),
                timeId: 2
            }, () => {
                if (this.state.normInd == 0) {
                    this.getOnlineTime()
                } else if (this.state.normInd == 1) {
                    this.getServies()
                } else if (this.state.normInd == 2) {
                    this.getRuse()
                }
            })
        } else if (i === 3) {// 本月
            this.setState({
                oldTime: this.getFormatDate(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)),
                nowTime: this.getFormatDate(new Date()),
                timeId: 3
            }, () => {
                if (this.state.normInd == 0) {
                    this.getOnlineTime()
                } else if (this.state.normInd == 1) {
                    this.getServies()
                } else if (this.state.normInd == 2) {
                    this.getRuse()
                }
            })
        }
    }
    // 在线时长
    getOnlineTime() {
        axios.get('/performance/dropDown', {
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
        axios.get('/kpiDing/appOnlineDistribution', {
            params: {
                timeStart: sessionStorage.getItem('oldTime') ? sessionStorage.getItem('oldTime') : this.state.oldTime,
                timeEnd: sessionStorage.getItem('nowTime') ? sessionStorage.getItem('nowTime') : this.state.nowTime,
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
                timeStart: sessionStorage.getItem('oldTime') ? sessionStorage.getItem('oldTime') : this.state.oldTime,
                timeEnd: sessionStorage.getItem('nowTime') ? sessionStorage.getItem('nowTime') : this.state.nowTime,
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
    componentDidMount() {
        this.getOnlineTime();
    }

    render() {
        const { selectData, type } = this.props;
        const { tabs, normSele, normInd, newNormInd, curKpiName, appData, modal1, onlineStime, onlineSvalue, OnlineTimeData, value1 } = this.state;
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
                <div>{type == 0 ? '业务系统资源' : type == 1 ? '业务系统服务在线' : ''}</div>
                <div></div>
            </div>
            {/* <DateRangePicker
                value={value1}
                placeholder="444"
                isShowTime={true}
                onChange={date => {
                    console.debug('DateRangePicker1 changed: ', date)
                    this.setState({ value1: date })
                }}
            /> */}
            <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} onChange={(tab, index) => this.gettime(tab, index)}>
                {
                    tabs.map((item, index) => {
                        return <div style={{ height: '100%', paddingTop: '10px' }} key={index}>
                            {
                                type == 0 ? <div className='dialogbg'>
                                    <p className='sourceTitle'>业务系统资源摘要</p>
                                    <i></i>
                                    <p>通过预测基线和基础指标，可计算服务器的资源服务率、资源利用率等资源相关指标，基于这些指标，可以评估资源的综合健康水平。关于预测基线的信息，参考预测基线</p>
                                </div>
                                    : type == 1 ? <div className='dialogbg'>
                                        <p className='sourceTitle'>业务系统服务在线摘要</p>
                                        <i></i>
                                        <p>业务系统服务在线摘要业务系统服务在线摘要业务系统服务在线摘要业务系统服务在线摘要业务系统服务在线摘要</p>
                                    </div> : ''
                            }
                            <div className='dialogbg'>
                                <p className='sourceTitle'>{curKpiName}</p>
                                <p>描述内容：{curKpiName}</p>
                                <Icon type="down" size='md' className='seleIcon' onClick={this.showModal('modal1')} />
                                {
                                    type == 0
                                        ? <div style={{ height: '354px' }}>
                                            <ReactEcharts
                                                option={
                                                    {
                                                        title: {
                                                            text: `${sessionStorage.getItem('appName') == 'undefined' && selectData.length > 0 ? selectData[0].name : sessionStorage.getItem('appName')}`,
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
                                                            formatter: (params) => {
                                                                return `<div style="height:80px;border-radius:5px;background:#fff;box-shadow:0 0 10px 5px #aaa;font-size: 12px;padding: 6px 20px;box-sizing:border-box">
                                                                <p>${params[0].axisValueLabel}</p>
                                                                <p>${params[0].seriesName} ${params[0].data}</p>
                                                            </div>`
                                                            },
                                                        },
                                                        grid: {
                                                            left: '4%',
                                                            right: '2%',
                                                            top: 60,
                                                            bottom: 60,
                                                            containLabel: true
                                                        },
                                                        legend: {
                                                            bottom: 5,
                                                            data: [this.state.curKpiName]
                                                        },
                                                        xAxis: {
                                                            type: 'category',
                                                            data: appData.time,
                                                            boundaryGap: this.state.tablekpiId > 0 ? false : true,
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
                                                            name: '单位' + appData.unit,
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
                                                                type: this.state.tablekpiId > 0 ? 'line' : 'bar',
                                                                smooth: true,
                                                                showSymbol: false,
                                                                symbol: 'circle',
                                                                symbolSize: 6,
                                                                data: appData.value,
                                                                itemStyle: {
                                                                    normal: {
                                                                        color: 'rgb(82, 108, 255)'
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
                                        : type == 1
                                            ? normInd == 0 ?// 在线时长
                                                <div style={{ height: '354px' }}>
                                                    <ReactEcharts
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
                                                                    data: [this.state.title]
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
                                                                        name: '访问量',
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
                                                    <div style={{ height: '354px' }}>
                                                        <ReactEcharts
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
                                                                        name: '',
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
                                                        <div style={{ height: '354px' }}>
                                                            <div className="double_top_title">
                                                                <div><span>{this.state.rusePercent}</span>的时段过度利用</div>
                                                            </div>
                                                            <div style={{ height: '300px' }}>
                                                                <ReactEcharts
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
                                            : ''
                                }

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
                                                normInd: newNormInd
                                            }, () => {
                                                if (this.state.normInd == 0) {
                                                    this.getOnlineTime()
                                                } else if (this.state.normInd == 1) {
                                                    this.getServies()
                                                } else if (this.state.normInd == 2) {
                                                    this.getRuse()
                                                }
                                            })
                                        }}>确定</div>
                                    </div>,
                                    //  onPress: () => { console.log('ok'); ();}
                                }]}
                                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                            // afterClose={() => { alert('afterClose'); }}
                            >
                                <div className='normStyle'>
                                    <p>
                                        选择指标：
                                    </p>
                                    <ul>
                                        {
                                            normSele.map((item, index) => {
                                                return <li key={index} className={index === newNormInd ? 'active' : ''} onClick={() => {
                                                    this.setState({ newNormInd: index, curKpiName: item.title })
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
        );
    }
}

export default AppTab;