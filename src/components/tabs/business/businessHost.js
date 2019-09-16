import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import axios from 'axios';
import listIcon from 'images/applistIcon.svg';
import ReactEcharts from 'echarts-for-react';
import { Table } from 'antd';
import { Tabs, Icon, Modal } from 'antd-mobile';
import FChart from '../../businessPage/fc_chart';
import IndexMap from 'components/businessPage/indexmap.js'

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

class BusinessHost extends Component {
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
                { title: '地图' },
                { title: '分层视图' },
            ],
            clickTab: 0,
            clickTab2: 0,
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
            viewUnits: {},
            flowUnits: {},
            viewData: {},
            hostViewData: {},
            flowData: {},
            mapData: [],
            fcData: [],
            newTitle: [],
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
            // this.getDscAxios();
            this.businessAxios();
            this.mapReq();
            this.getFcDate();
            this.setTableData();
        })
    }
    // 单位和数据
    businessAxios() {
        axios.get('/kpiDing/hostDetailView', {
            params: {
                webTimeType: this.state.timeId,
                hostId: this.props.id,
            }
        }).then(res => {
            let data = res.data;
            this.setState({
                hostViewData: data
            })
        })
        axios.get('/kpiDing/hostDetailViewTable', {
            params: {
                webTimeType: this.state.timeId,
                hostId: this.props.id,
                pageSize: 10000
            }
        }).then(res => {
            // console.log(res.data)
            // let unitMap = res.data.unitMap;
            let detailsMap = res.data.detailsMap;
            this.setState({
                viewUnits: {
                    accessUnit: res.data.viewUnit,
                    requestTotalUnit: res.data.requestUnit,
                    requestSuccessUnit: res.data.reponseUnit
                },
                viewData: {
                    access: detailsMap.view,
                    requestTotal: detailsMap.request,
                    requestSuccess: detailsMap.reponse
                },
                accessUnit: res.data.viewUnit,
                businessData: detailsMap.view,
                pageTime: res.data.time
            })
        })

        axios.get('/kpiDing/hostDetailFlowTable', {
            params: {
                webTimeType: this.state.timeId,
                hostId: this.props.id,
                pageSize: 10000
            }
        }).then(res => {
            let unitMap = res.data.unitMap;
            let detailsMap = res.data.detailsMap;
            this.setState({
                flowUnits: {
                    flowUnit: unitMap.flowUnit,
                    upFlowUnit: unitMap.upFlowUnit,
                    downFlowUnit: unitMap.downFlowUnit,
                    zhanBiUnit: unitMap.zhanbiUnit,
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
    // 查看指标
    normClick(index, title) {
        this.setState({
            newNormInd: index,
            curKpiName: title
        })
    }
    // map
    mapReq() {
        axios.get('/ScreenMonitor/getRegionalView', {
            params: {
                hostId: this.props.id,
                webTimeType: this.state.timeId
            }
        }).then(res => {
            this.setState({
                mapData: res.data
            })
        })
    };
    getFcDate() {
        //分层视图
        axios.get('/performance/layeredApplication', {
            params: {
                timeId: this.state.timeId,
                count: 1,
                hostId: this.props.id,
                kpiId: 31
            }
        }).then(res => {
            this.setState({
                fcData: res.data
            })
        })
    }
    setTableData() {
        axios.get('/AppIsNewController/throughputNewApp', {
            params: {
                timeId: this.state.timeId,
                hostId: this.props.id,
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
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            timeId: 6,
            clickTab: 0,
            normal: 0,
            newNormInd: 0,
            clickTab2: 0,
            curKpiName: '访问量'
        }, () => {
            this.businessAxios();
            this.mapReq();
            this.getFcDate();
            this.setTableData();
        })
    }
    componentDidMount(){
        this.businessAxios();
        this.mapReq();
        this.getFcDate();
        this.setTableData();
    }

    render() {
        // const { selectData, type } = this.props;
        const { tabs, normSele, normInd, newNormInd, curKpiName, modal1, clickTab, tabs2, mapData, fcData, timeId, tableColumns, tableData, newTitle, clickTab2 } = this.state;
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
                <div>服务器业务吞吐量</div>
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
                                        <span>服务器访问量</span>
                                    </div>
                                    <i></i>
                                    <ul className="hostData">
                                        <li>
                                            <p>访问量</p>
                                            <p>{this.state.hostViewData.viewCount}</p>
                                        </li>
                                        <li>
                                            <p>访问量总量</p>
                                            <p>{this.state.hostViewData.accessSum}</p>
                                        </li>
                                        <li>
                                            <p>请求响应量</p>
                                            <p>{this.state.hostViewData.reponseCount}</p>
                                        </li>
                                    </ul>
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
                                                    text: this.props.name,
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
                                                    top: 50,
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
                                                        type: 'line',
                                                        smooth: true,
                                                        showSymbol: false,
                                                        // symbol: 'circle',
                                                        // symbolSize: 6,
                                                        data: this.state.businessData,
                                                        itemStyle: {
                                                            normal: {
                                                                color: 'rgb(82, 108, 255)'
                                                            }
                                                        },
                                                        // barWidth: '20',
                                                        // lineStyle: {
                                                        //     normal: {
                                                        //         width: 3
                                                        //     }
                                                        // }
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
                                        <IndexMap mapData={mapData} />
                                        <FChart data={fcData} timeId={timeId} id={this.props.id} />
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

export default BusinessHost;