import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import axios from 'axios';
import { Table } from 'antd';
import listIcon from 'images/applistIcon.svg';
import ReactEcharts from 'echarts-for-react';
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

class ExperienceHost extends Component {
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
            ],
            tabs2: [
                { title: '分析' }
            ],
            normSele: [
                {
                    title: 'Apdex',
                    unit: '(N/A)'
                }, {
                    title: '每报文字节数',
                    unit: ''
                }, {
                    title: '上行每报文字节数',
                    unit: ''
                }, {
                    title: '下行每报文字节数',
                    unit: ''
                }, {
                    title: '平均在线时长',
                    unit: ''
                }, {
                    title: '每访问报文数',
                    unit: ''
                }, {
                    title: '每访问字节数',
                    unit: ''
                }
            ],
            curKpiName: 'Apdex',
            accessUnit: '(N/A)',
            businessData: [],
            viewUnits: {},
            flowUnits: {},
            viewData: {},
            flowData: {},
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
                    title: 'Apdex(N/A)',
                    key: 1,
                    dataIndex: 'apdex',
                    align: 'center'
                }, {
                    title: '每报文字节数',
                    key: 2,
                    dataIndex: 'busEveryData',
                    align: 'center'
                }, {
                    title: '上行每报文字节数',
                    key: 3,
                    dataIndex: 'upEveryPacketByte',
                    align: 'center'
                }, {
                    title: '下行每报文字节数',
                    key: 4,
                    dataIndex: 'downEveryPacketByte',
                    align: 'center'
                }, {
                    title: '平均在线时长',
                    key: 5,
                    dataIndex: 'onlineTime',
                    align: 'center'
                }, {
                    title: '每访问报文数',
                    key: 6,
                    dataIndex: 'numberOfPackets',
                    align: 'center'
                }, {
                    title: '每访问字节数',
                    key: 7,
                    dataIndex: 'numberOfByte',
                    align: 'center'
                }
            ],
            newTitle: '',
            pageNum: 1,
            pageSizel: 1000,
            clickTab: 0,
            tableData: [],
            apdexData: [],
            zhaiyaoData: []
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
                    title: 'Apdex',
                    unit: '(N/A)'
                }, {
                    clickImg: lrlconClick,
                    img: lrlcon,
                    title: '每报文字节数',
                    unit: flowUnits.PacketByteUnit
                }, {
                    clickImg: clocklconClick,
                    img: clocklcon,
                    title: '上行每报文字节数',
                    unit: flowUnits.PacketByteUnit
                }, {
                    clickImg: barlconClick,
                    img: barlcon,
                    title: '下行每报文字节数',
                    unit: flowUnits.PacketByteUnit
                }, {
                    clickImg: onelconClick,
                    img: onelcon,
                    title: '平均在线时长',
                    unit: '(' + viewUnits.timeUnit + ')'
                }, {
                    clickImg: threelconClick,
                    img: threelcon,
                    title: '每访问报文数',
                    unit: viewUnits.numberOfPacketsUnit
                }, {
                    clickImg: linelconClick,
                    img: linelcon,
                    title: '每访问字节数',
                    unit: viewUnits.numberOfByteUnit
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
            this.businessAxios();
            this.getZhaiyData();
            this.setTableData();
        })
    }
    // 单位和数据
    businessAxios() {
        axios.get('/performance/getAppPerformanceZhong', {
            params: {
                timeId: this.state.timeId,
                pageSize: 10000,
                hostId: this.props.id
            }
        }).then(res => {
            let detailsMap = res.data.detailsMap;
            this.setState({
                apdexData: detailsMap.apdex,
                businessData: detailsMap.apdex
            })
        })

        axios.get('/performance/getAppTrafficListZhong', {
            params: {
                timeId: this.state.timeId,
                pageSize: 10000,
                hostId: this.props.id
            }
        }).then(res => {
            let unitMap = res.data.unitMap;
            let detailsMap = res.data.detailsMap;
            this.setState({
                viewUnits: {
                    timeUnit: unitMap.onlineTimeUnit,
                    numberOfPacketsUnit: unitMap.numberOfPacketsUnit,
                    numberOfByteUnit: unitMap.numberOfByteUnit
                },
                viewData: {
                    onlineTime: detailsMap.onlineTime,
                    numberOfPackets: detailsMap.numberOfPackets,
                    numberOfByte: detailsMap.numberOfByte
                },
                accessUnit: '(N/A)',
                pageTime: res.data.time
            })
        })

        axios.get('/performance/getAppPacketRateZhong', {
            params: {
                timeId: this.state.timeId,
                pageSize: 10000,
                hostId: this.props.id
            }
        }).then(res => {
            let detailsMap = res.data.detailsMap;
            this.setState({
                flowUnits: {
                    PacketByteUnit: res.data.PacketByteUnit
                },
                flowData: {
                    busEveryData: detailsMap.bus_every_packet_byte_valAvg,
                    upEveryPacketByte: detailsMap.upEveryPacketByte,
                    downEveryPacketByte: detailsMap.downEveryPacketByte
                }
            })
        })
    }
    getZhaiyData(){
        axios.get('/kpiDing/hostDetailPacketRate',{
            params:{
                webTimeType: this.state.timeId,
                hostId: this.props.id
            }
        }).then(res=>{
            // console.log(res.data)
            this.setState({
                zhaiyaoData: res.data
            })
        })
    }
     // 表格
     setTableData() {
        axios.get('/AppIsNewController/userExperienceNewApp', {
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
    UNSAFE_componentWillMount() {
        this.setState({
            timeId: 6,
            clickTab: 0,
            newNormInd: 0,
            normal: 0,
            curKpiName: 'Apdex',
        }, () => {
            this.businessAxios();
            this.getZhaiyData();
            this.setTableData();
        })
    }
    render() {
        const { tabs, tabs2, normSele, normInd, newNormInd, curKpiName, modal1, tableColumns, tableData, zhaiyaoData, newTitle, clickTab } = this.state;
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
                <div>服务器用户体验</div>
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
                                        <span>服务器用户体验摘要</span>
                                    </div>
                                    <i></i>
                                    <ul className="hostData">
                                        <li>
                                            <p>总报文速率</p>
                                            <p>{zhaiyaoData.sumPacket}</p>
                                        </li>
                                        <li>
                                            <p>上行每报文字节数</p>
                                            <p>{zhaiyaoData.upEveryPacketByte}</p>
                                        </li>
                                        <li>
                                            <p>下行每报文字节数</p>
                                            <p>{zhaiyaoData.downEveryPacketByte}</p>
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
                                                        data: this.state.businessData,
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
                                        initialPage={0}
                                        swipeable={false}
                                        useOnPan={true}
                                    >
                                        <div className='tables'>
                                            <Table
                                                columns={tableColumns}
                                                dataSource={tableData}
                                                scroll={{ x: 800 }}
                                                bordered={true}
                                                className='tableCont'
                                            />
                                        </div>
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
                                                    const { newNormInd, viewData, flowData, apdexData, flowUnits, viewUnits } = this.state;
                                                    if (newNormInd == 0) {
                                                        this.setState({
                                                            accessUnit: '(N/A)',
                                                            businessData: apdexData
                                                        })
                                                    } else if (newNormInd == 1) {
                                                        this.setState({
                                                            accessUnit: flowUnits.PacketByteUnit,
                                                            businessData: flowData.busEveryData
                                                        })
                                                    } else if (newNormInd == 2) {
                                                        this.setState({
                                                            accessUnit: flowUnits.PacketByteUnit,
                                                            businessData: flowData.upEveryPacketByte
                                                        })
                                                    } else if (newNormInd == 3) {
                                                        this.setState({
                                                            accessUnit: flowUnits.PacketByteUnit,
                                                            businessData: flowData.downEveryPacketByte
                                                        })
                                                    } else if (newNormInd == 4) {
                                                        this.setState({
                                                            accessUnit: '(' + viewUnits.timeUnit + ')',
                                                            businessData: viewData.onlineTime
                                                        })
                                                    } else if (newNormInd == 5) {
                                                        this.setState({
                                                            accessUnit: viewUnits.numberOfPacketsUnit,
                                                            businessData: viewData.numberOfPackets
                                                        })
                                                    } else if (newNormInd == 6) {
                                                        this.setState({
                                                            accessUnit: viewUnits.numberOfByteUnit,
                                                            businessData: viewData.numberOfByte
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
                                                    }}
                                                    >
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

export default ExperienceHost;