import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import axios from 'axios';
import listIcon from 'images/applistIcon.svg';
import ReactEcharts from 'echarts-for-react';
import { Table } from 'antd';
import { Tabs, Icon, Modal } from 'antd-mobile';

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

class businessDToD extends Component {
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
                { title: '排名' },
            ],
            tableColumns: [
                {
                    title: '时间',
                    dataIndex: 'time',
                    key: 0,
                    align: 'center',
                    width: 150
                },
                {
                    title: '访问量（s）',
                    key: 1,
                    dataIndex: 'access',
                    align: 'center'
                }, {
                    title: '请求量（%）',
                    key: 2,
                    dataIndex: 'requestTotal',
                    align: 'center'
                }, {
                    title: '请求响应量（%）',
                    key: 3,
                    dataIndex: 'requestSuccess',
                    align: 'center'
                }, {
                    title: '流量（%）',
                    key: 4,
                    dataIndex: 'flow',
                    align: 'center'
                }, {
                    title: '下行流量（%）',
                    key: 5,
                    dataIndex: 'downFlow',
                    align: 'center'
                }, {
                    title: '上行流量（%）',
                    key: 6,
                    dataIndex: 'upFlow',
                    align: 'center'
                }, {
                    title: '下行流量百分比（%）',
                    key: 7,
                    dataIndex: 'zhanBi',
                    align: 'center'
                }
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
            singleAccess: [],
            viewUnits: {},
            flowUnits: {},
            viewData: {},
            flowData: {},
            clickTab: 0,
            clickTab2: 0,
            tableData: [],
            rankData: [],
            pageNum: 1,
            pageSize: 1000
        }
    }
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        let { viewUnits, flowUnits } = this.state;
        this.setState({
            [key]: true,
            normSele: [
                {
                    clickImg: twolconClick,
                    img: twolcon,
                    title: '访问量',
                    unit: viewUnits.accessUnit
                }, {
                    clickImg: lrlconClick,
                    img: lrlcon,
                    title: '请求量',
                    unit: viewUnits.requestTotalUnit
                }, {
                    clickImg: clocklconClick,
                    img: clocklcon,
                    title: '请求响应量',
                    unit: viewUnits.requestSuccessUnit
                }, {
                    clickImg: barlconClick,
                    img: barlcon,
                    title: '流量',
                    unit: flowUnits.flowUnit
                }, {
                    clickImg: onelconClick,
                    img: onelcon,
                    title: '下行流量',
                    unit: flowUnits.upFlowUnit
                }, {
                    clickImg: threelconClick,
                    img: threelcon,
                    title: '上行流量',
                    unit: flowUnits.downFlowUnit
                }, {
                    clickImg: linelconClick,
                    img: linelcon,
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
            clickTab: i
        }, () => {
            this.getDscAxios();
            this.businessAxios();
            this.setTableData();
            //this.getbarData();
        })
    }
    // 业务吞吐量
    getDscAxios() {
        axios.get('/ScreenMonitor/getSingleAccess', {
            params: {
                nodeSourceDataId: sessionStorage.getItem('sourceId'), // 源 node
                appSourceDataId: sessionStorage.getItem('goalId'), // 目的 app
                timeId: this.state.timeId,
            }
        }).then(res => {
            this.setState({
                singleAccess: res.data
            })
        })
        axios.get('/performance/appViews', {
            params: {
                timeId: this.state.timeId,
                nodeSourceDataId: sessionStorage.getItem('sourceId'), // 源 node
                appSourceDataId: sessionStorage.getItem('goalId') // 目的 app
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
    //排名
    getbarData() {
        axios.get('/AppIsNewController/resourceAppTableSortNewApp', {
            params: {
                timeId: this.state.timeId,
                //key: this.state.lineName,

            }
        }).then(res => {
            this.setState({
                rankData: res.data
            })
        });
    }
    // 单位和数据
    businessAxios() {
        axios.get('/performance/getAppTrafficListZhong', {
            params: {
                timeId: this.state.timeId,
                nodeSourceDataId: sessionStorage.getItem('sourceId'), // 源 node
                appSourceDataId: sessionStorage.getItem('goalId') // 目的 app
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
                nodeSourceDataId: sessionStorage.getItem('sourceId'), // 源 node
                appSourceDataId: sessionStorage.getItem('goalId') // 目的 app
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
        this.setState({
            newNormInd: index,
            curKpiName: title
        })
    }
    // 表格
    setTableData() {
        axios.get('/AppIsNewController/throughputNewApp', {
            params: {
                timeId: this.state.timeId,
                nodeSourceDataId: sessionStorage.getItem('sourceId'), // 源 node
                appSourceDataId: sessionStorage.getItem('goalId'), // 目的 app
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
    UNSAFE_componentWillReceiveProps() {
        this.setState({
            timeId: 6,
            clickTab: 0,
            clickTab2: 0,
            normal: 0,
            newNormInd: 0,
            curKpiName: '访问量'
        }, () => {
            this.getDscAxios();
            this.businessAxios();
            this.setTableData();
            //this.getbarData();
        })
    }
    componentDidMount() {
        this.getDscAxios();
        this.businessAxios();
        this.setTableData();
       //this.getbarData();
    }
    render() {
        const { tabs, rankData, normSele, normInd, newNormInd, curKpiName, modal1, singleAccess, clickTab, tabs2, tableColumns, tableData, newTitle, clickTab2 } = this.state;
        return (<div className='dialogSource'>
            <div className='dialogHeader'>
                <div>
                    <Icon type='left' onClick={() => {
                        $('.serviseBlock3').hide();
                        $('.serviseBlock2').hide();
                        $('.serviseBlock3').hide();
                        $('.homePageHeader').show();
                        $('.footer').show();
                        $('.businessDtoD').show();
                    }
                    } />
                </div>
                <div>端到端业务吞吐量</div>
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
                        tabs.map((_item, index) => {
                            return <div style={{ height: '100%' }} key={index}>
                                <p className='dTodTitle'>源：<span>{sessionStorage.getItem('sourceName')}</span>       目的：<span>{sessionStorage.getItem('goalName')}</span></p>
                                <div className='dialogbg'>
                                    <div className='sourceTitle'>
                                        <img src={listIcon} alt='' className='zhaiyao' />
                                        <span>端到端访问量动态</span>
                                    </div>
                                    <i></i>
                                    <p style={{ fontSize: '12px' }}>
                                        在此时间段，端到端访问量
                                    </p>
                                    <div className='selectItemNum'>
                                        {
                                            singleAccess.access ? <span>{singleAccess.access.value}{singleAccess.access.measure}</span> : ''
                                        }
                                        {
                                            singleAccess.access ?
                                                <div className='leaderProgress'>
                                                    <div className='progressBar' style={{ width: singleAccess.access.value > 0 ? singleAccess.access.value / singleAccess.max * 100 + '%' : '0%' }}></div>
                                                </div> : ''
                                        }
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
                                        option={
                                            {
                                                title: {
                                                    text: `${sessionStorage.getItem('sourceName')}-${sessionStorage.getItem('goalName')}`,
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
                                        <div className='kongBox'></div>
                                       
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
                                                    curKpiName
                                                })
                                            }}>取消</div>
                                            <div className='primary' onClick={() => {
                                                //this.getbarData();
                                                this.onClose('modal1')()
                                                this.setState({
                                                    clickTab2: 0,
                                                    normInd: newNormInd,
                                                    curKpiName: newTitle
                                                }, () => {
                                                    const { newNormInd, viewData, flowData, viewUnits, flowUnits } = this.state;
                                                    if (newNormInd == 0) {
                                                        this.setState({
                                                            accessUnit: viewUnits.accessUnit,
                                                            businessData: viewData.access
                                                        })
                                                    } else if (newNormInd == 1) {
                                                        this.setState({
                                                            accessUnit: viewUnits.requestTotalUnit,
                                                            businessData: viewData.requestTotal
                                                        })
                                                    } else if (newNormInd == 2) {
                                                        this.setState({
                                                            accessUnit: viewUnits.requestSuccessUnit,
                                                            businessData: viewData.requestSuccess
                                                        })
                                                    } else if (newNormInd == 3) {
                                                        this.setState({
                                                            accessUnit: flowUnits.flowUnit,
                                                            businessData: flowData.flow
                                                        })
                                                    } else if (newNormInd == 4) {
                                                        this.setState({
                                                            accessUnit: flowUnits.upFlowUnit,
                                                            businessData: flowData.upFlow
                                                        })
                                                    } else if (newNormInd == 5) {
                                                        this.setState({
                                                            accessUnit: flowUnits.downFlowUnit,
                                                            businessData: flowData.downFlow
                                                        })
                                                    } else if (newNormInd == 6) {
                                                        this.setState({
                                                            accessUnit: flowUnits.zhanbiUnit,
                                                            businessData: flowData.zhanBi
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

export default businessDToD;