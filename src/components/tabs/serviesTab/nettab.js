import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import { Tabs, Icon, Modal } from 'antd-mobile';

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

class NetTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal1: false,
            normInd: 0,// 指标id
            newNormInd: 0,
            timeId: 0,
            tablekpiId: 4,
            netData: [],
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
                    title: '资源服务率',
                    unit: '（%）',
                    tablekpiId: 4
                }, {
                    title: '资源利用率',
                    unit: '（%）',
                    tablekpiId: 3
                }, {
                    title: '稳定性指数',
                    unit: '（N/A）',
                    tablekpiId: 5
                }, {
                    title: '能力指数',
                    unit: '（N/A）',
                    tablekpiId: 2
                }, {
                    title: '性能指数',
                    unit: '（N/A）',
                    tablekpiId: 1
                }, {
                    title: '相关事件',
                    unit: '（N/A）',
                    tablekpiId: -1
                }, {
                    title: '综合健康指数',
                    unit: '（N/A）',
                    tablekpiId: 6
                }
            ],
            curKpiName: '资源服务率'
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
            this.getAxios();
        })
    }
    getAxios() {
        const { NetItemId } = this.props;
        axios.get('/kpiDing/resourceHostTableSortDesc', {
            params: {
                webTimeType: this.state.timeId,
                kpiId: this.state.tablekpiId,
                hostId: NetItemId == 0 ? sessionStorage.getItem('NetItemId') : NetItemId
            }
        }).then(res => {
            this.setState({
                netData: res.data
            })
        })
    }
    componentDidMount() {
        this.getAxios();
    }

    render() {
        const { networkData } = this.props;
        const { tabs, normSele, normInd, newNormInd, curKpiName, netData, modal1 } = this.state;
        return (<div className='dialogSource'>
            <div className='dialogHeader'>
                <div>
                    <Icon type='left' onClick={() => {
                        $('.serviseBlock3').hide();
                        $('.homePageHeader').show();
                        $('.footer').show();
                        $('.networkBox').show();
                    }
                    } />
                </div>
                <div>业务系统资源</div>
                <div></div>
            </div>
            <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} onChange={(tab, index) => this.gettime(tab, index)}>
                {
                    tabs.map((item, index) => {
                        return <div style={{ height: '100%', paddingTop: '10px' }} key={index}>
                            <div className='dialogbg'>
                                <p className='sourceTitle'>服务器资源摘要</p>
                                <i></i>
                                <p>通过预测基线和基础指标，可计算服务器的资源服务率、资源利用率等资源相关指标，基于这些指标，可以评估资源的综合健康水平。关于预测基线的信息，参考预测基线</p>
                            </div>
                            <div className='dialogbg'>
                                <p className='sourceTitle'>{curKpiName}</p>
                                <p>描述内容：{curKpiName}</p>
                                <Icon type="down" size='md' className='seleIcon' onClick={this.showModal('modal1')} />
                                <div style={{height: '354px'}}>
                                    <ReactEcharts
                                        option={
                                            {
                                                title: {
                                                    text: `${sessionStorage.getItem('netName') == 'undefined' && networkData.length>0?networkData[0].name:sessionStorage.getItem('netName')}`,
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
                                                            color: '#000'
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
                                                    data: netData.time,
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
                                                    name: '单位' + netData.unit,
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
                                                        data: netData.value,
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
                                                this.getAxios()
                                            })
                                        }}>取消</div>
                                        <div className='primary' onClick={() => {
                                            this.onClose('modal1')()
                                            this.setState({
                                                normInd: newNormInd
                                            }, () => {
                                                this.getAxios()
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
                                                    this.setState({ newNormInd: index, curKpiName: item.title, tablekpiId: item.tablekpiId })
                                                }} >
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

export default NetTab;