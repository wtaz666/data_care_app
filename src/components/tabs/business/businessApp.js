import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import { Tabs, Icon, Modal } from 'antd-mobile';
import { DateRangePicker } from 'element-react';
import zhaiyao from 'images/zhaiyao.svg'

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

class BusinessApp extends Component {
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
            normSele: [
                {
                    title: '访问量',
                    unit: '（s）'
                }, {
                    title: '请求量',
                    unit: '（%）'
                }, {
                    title: '请求响应量',
                    unit: '（%）'
                }, {
                    title: '流量',
                    unit: '（%）'
                }, {
                    title: '下行流量',
                    unit: '（%）'
                }, {
                    title: '上行流量',
                    unit: '（%）'
                }, {
                    title: '下行流量百分比',
                    unit: '（%）'
                }
            ],
            curKpiName: '访问量',
            accessUnit: '',
            businessData: [],
            viewUnits: {},
            flowUnits: {},
            viewData: {},
            flowData: {}
        }
    }
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        let { viewUnits, flowUnits } = this.state;
        this.setState({
            [key]: true,
            normSele: [
                {
                    title: '访问量',
                    unit: viewUnits.accessUnit
                }, {
                    title: '请求量',
                    unit: viewUnits.requestTotalUnit
                }, {
                    title: '请求响应量',
                    unit: viewUnits.requestSuccessUnit
                }, {
                    title: '流量',
                    unit: flowUnits.flowUnit
                }, {
                    title: '下行流量',
                    unit: flowUnits.upFlowUnit
                }, {
                    title: '上行流量',
                    unit: flowUnits.downFlowUnit
                }, {
                    title: '下行流量百分比',
                    unit: flowUnits.zhanBiUnit
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
        if (i === 0) {
            i = 6
        } else if (i === 1) {
            i = 0
        } else if (i === 2) {
            i = 2
        } else if (i === 3) {
            i = 3
        }
        this.setState({
            timeId: i
        }, () => {
            this.getDscAxios();
            this.businessAxios();
        })
    }
    // 业务吞吐量
    getDscAxios() {
        axios.get('/performance/appViews', {
            params: {
                timeId: this.state.timeId,
                appSourceDataId: sessionStorage.getItem('AppItemId')
            }
        }).then(res => {
            let data = res.data;
            let Increase = data.Increase;
            this.setState({
                historicalAverageViews: data.historicalAverage,
                measureViews: data.measure,
                todayViews: data.today,
                IncreaseViews: Math.abs(Increase),
            })
        })
    }
    // 单位和数据
    businessAxios() {
        axios.get('/performance/getAppTrafficListZhong', {
            params: {
                timeId: this.state.timeId,
                appSourceDataId: sessionStorage.getItem('AppItemId')
                // appSourceDataId: AppItemId == 0 ? sessionStorage.getItem('AppItemId') : AppItemId
            }
        }).then(res => {
            let unitMap = res.data.unitMap;
            let detailsMap = res.data.detailsMap;
            this.setState({
                viewUnits: {
                    accessUnit: unitMap.accessUnit,
                    requestTotalUnit: unitMap.requestTotalUnit,
                    requestSuccessUnit: unitMap.requestSuccessUnit
                },
                viewData: {
                    access: detailsMap.access,
                    requestTotal: detailsMap.requestTotal,
                    requestSuccess: detailsMap.requestSuccess
                },
                accessUnit: unitMap.accessUnit,
                businessData: detailsMap.access,
                pageTime: res.data.time
            })
        })

        axios.get('/performance/getAppFlowListZhong', {
            params: {
                timeId: this.state.timeId,
                appSourceDataId: sessionStorage.getItem('AppItemId')
            }
        }).then(res => {
            let unitMap = res.data.unitMap;
            let detailsMap = res.data.detailsMap;
            this.setState({
                flowUnits: {
                    flowUnit: unitMap.flowUnit,
                    upFlowUnit: unitMap.upFlowUnit,
                    downFlowUnit: unitMap.downFlowUnit,
                    zhanBiUnit: unitMap.zhanBiUnit,
                },
                flowData: {
                    flow: detailsMap.flow,
                    upFlow: detailsMap.upFlow,
                    downFlow: detailsMap.downFlow,
                    zhanBi: detailsMap.zhanBi
                }
            })
        })
    }
    normClick(index, title) {
        const { viewUnits, viewData, flowUnits, flowData } = this.state;
        this.setState({
            newNormInd: index,
            curKpiName: title
        })
        if (index == 0) {
            this.setState({
                accessUnit: viewUnits.accessUnit,
                businessData: viewData.access
            })
        } else if (index == 1) {
            this.setState({
                accessUnit: viewUnits.requestTotalUnit,
                businessData: viewData.requestTotal
            })
        } else if (index == 2) {
            this.setState({
                accessUnit: viewUnits.flowUnit,
                businessData: viewData.flow
            })
        } else if (index == 3) {
            this.setState({
                accessUnit: flowUnits.requestSuccessUnit,
                businessData: flowData.requestSuccess
            })
        } else if (index == 4) {
            this.setState({
                accessUnit: flowUnits.upFlowUnit,
                businessData: flowData.upFlow
            })
        } else if (index == 5) {
            this.setState({
                accessUnit: flowUnits.downFlowUnit,
                businessData: flowData.downFlow
            })
        } else if (index == 5) {
            this.setState({
                accessUnit: flowUnits.zhanBiUnit,
                businessData: flowData.zhanBi
            })
        }
    }
    componentDidMount() {
        this.getDscAxios();
        this.businessAxios();
    }

    render() {
        // const { selectData, type } = this.props;
        const { tabs, normSele, normInd, newNormInd, curKpiName, modal1, value1 } = this.state;
        return (<div className='dialogSource'>
            <div className='dialogHeader'>
                <div>
                    <Icon type='left' onClick={() => {
                        $('.serviseBlock1').hide();
                        $('.serviseBlock2').hide();
                        $('.serviseBlock3').hide();
                        $('.homePageHeader').show();
                        $('.footer').show();
                        $('.applicationBox').show();
                    }
                    } />
                </div>
                <div>业务系统业务吞吐量</div>
                <div></div>
            </div>
            <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} onChange={(tab, index) => this.gettime(tab, index)}>
                {
                    tabs.map((item, index) => {
                        return <div style={{ height: '100%', paddingTop: '10px' }} key={index}>
                            <div className='dialogbg'>
                                <p className='sourceTitle'><img src={zhaiyao} alt='' className='zhaiyao' />业务系统访问量</p>
                                <div className="inner_flown">
                                    <div className="first_list1">
                                        <div>{this.state.todayViews}{this.state.measureViews}</div>
                                        <div>{this.state.IncreaseViews}%</div>
                                    </div>
                                    <div className="sec_list1" onClick={this.viewShowBox}></div>
                                    <div className="three_list1" onClick={this.lineBox2}></div>
                                    <div className="history_list1">
                                        预测基线：{this.state.historicalAverageViews}{this.state.measureViews}</div>
                                </div>
                            </div>
                            <div className='dialogbg'>
                                <p className='sourceTitle'>{curKpiName}</p>
                                <p>描述内容：{curKpiName}</p>
                                <Icon type="down" size='md' className='seleIcon' onClick={this.showModal('modal1')} />
                                {/* {
                                    normInd == 0 ? '0'
                                        : normInd == 1 ? '1'
                                            : normInd == 2 ? '2'
                                                : ''
                                } */}
                                <ReactEcharts
                                    option={
                                        {
                                            title: {
                                                text: `${sessionStorage.getItem('appName')}`,
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
                                                left: 60,
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
                                                name: '单位' + this.state.accessUnit,
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
                                                        fontSize: 14
                                                    }
                                                }
                                            },
                                            series: [
                                                {
                                                    name: this.state.curKpiName,
                                                    type: 'bar',
                                                    smooth: true,
                                                    showSymbol: false,
                                                    symbol: 'circle',
                                                    symbolSize: 6,
                                                    data: this.state.businessData,
                                                    itemStyle: {
                                                        normal: {
                                                            color: 'rgb(82, 108, 255)'
                                                        }
                                                    },
                                                    barWidth: '20',
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
                                                    // this.getOnlineTime()
                                                } else if (this.state.normInd == 1) {
                                                    // this.getServies()
                                                } else if (this.state.normInd == 2) {
                                                    // this.getRuse()
                                                }
                                            })
                                        }}>取消</div>
                                        <div className='primary' onClick={() => {
                                            this.onClose('modal1')()
                                            this.setState({
                                                normInd: newNormInd
                                            }, () => {
                                                this.businessAxios();
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
                                                return <li key={index} className={index === newNormInd ? 'active' : ''} onClick={() => this.normClick(index, item.title)} >
                                                    <div></div>
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

export default BusinessApp;