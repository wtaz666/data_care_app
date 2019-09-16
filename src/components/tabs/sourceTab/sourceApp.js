import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import { Table } from 'antd';
import { Tabs, Icon, Modal } from 'antd-mobile';
import listIcon from 'images/applistIcon.svg';
import leftIcon from 'images/left_click.svg';

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

class NetTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal1: false,
            normInd: 0,// 指标id
            newNormInd: 0,
            timeId: 0,
            tablekpiId: 4,
            appData: [],
            rankData: [],
            rankId:[],
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
            clickTab: 0,
            normSele: [
                {
                    clickImg: twolconClick,
                    img: twolcon,
                    title: '资源服务率',
                    unit: '（%）',
                    tablekpiId: 4
                }, {
                    clickImg: lrlconClick,
                    img: lrlcon,
                    title: '资源利用率',
                    unit: '（%）',
                    tablekpiId: 3
                }, {
                    clickImg: clocklconClick,
                    img: clocklcon,
                    title: '稳定性指数',
                    unit: '（N/A）',
                    tablekpiId: 5
                }, {
                    clickImg: barlconClick,
                    img: barlcon,
                    title: '能力指数',
                    unit: '（N/A）',
                    tablekpiId: 2
                }, {
                    clickImg: onelconClick,
                    img: onelcon,
                    title: '性能指数',
                    unit: '（N/A）',
                    tablekpiId: 1
                }, {
                    clickImg: threelconClick,
                    img: threelcon,
                    title: '相关事件',
                    unit: '（个）',
                    tablekpiId: -1
                }, {
                    clickImg: linelconClick,
                    img: linelcon,
                    title: '综合健康指数',
                    unit: '（N/A）',
                    tablekpiId: 6
                }
            ],
            curKpiName: '资源服务率',
            lineData: [],
            tabData: [],
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
                    title: '资源服务率（%）',
                    key: 1,
                    dataIndex: 'rsrate',
                    align: 'center'
                }, {
                    title: '资源利用率（%）',
                    key: 2,
                    dataIndex: 'rusage',
                    align: 'center'
                }, {
                    title: '稳定性指数（N/A）',
                    key: 3,
                    dataIndex: 'asdex',
                    align: 'center'
                }, {
                    title: '能力指数（N/A）',
                    key: 4,
                    dataIndex: 'acdex',
                    align: 'center'
                }, {
                    title: '性能指数（N/A）',
                    key: 5,
                    dataIndex: 'apdex',
                    align: 'center'
                }, {
                    title: '相关事件（个）',
                    key: 6,
                    dataIndex: 'event',
                    align: 'center'
                }, {
                    title: '综合健康指数（N/A）',
                    key: 7,
                    dataIndex: 'ahdex',
                    align: 'center'
                }
            ],
            tableData: [],
            newTitle: '',
            lineName: 'null~service_rate~4'
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
            this.getAxios();
            this.getLineData();
            this.getbarData();
            this.setTableData();
        })
    }
    getAxios() {
        const { AppItemId } = this.props;
        axios.get('/kpiDing/resourceAppTableSortDesc', {
            params: {
                webTimeType: this.state.timeId,
                kpiId: this.state.tablekpiId,
                appSourceDataId: AppItemId == 0 ? sessionStorage.getItem('AppItemId') : AppItemId
            }
        }).then(res => {
            this.setState({
                appData: res.data
            })
        })

    }
    //排名
    getbarData() {
        axios.get('/AppIsNewController/resourceAppTableSortNewApp', {
            params: {
                timeId: this.state.timeId,
                appSourceDataId: sessionStorage.getItem('AppItemId'),
                //key: this.state.lineName,
                kpiId: this.state.tablekpiId,
            }
        }).then(res => {
            let newArr=res.data.filter(item=>item.pm>0)
            this.setState({
                rankData: res.data,
                rankId:newArr,
            })
        });
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
     // 表格
     setTableData() {
        axios.get('/AppIsNewController/resourceTableNewApp', {
            params: {
                timeId: this.state.timeId,
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            }
        }).then(res => {
            if (res.data.restList.length > 0) {
                this.setState({
                    tableData: res.data.restList,
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
                            title: '资源服务率（%）',
                            key: 1,
                            dataIndex: 'rsrate',
                            align: 'center'
                        }, {
                            title: '资源利用率（%）',
                            key: 2,
                            dataIndex: 'rusage',
                            align: 'center'
                        }, {
                            title: '稳定性指数（N/A）',
                            key: 3,
                            dataIndex: 'asdex',
                            align: 'center'
                        }, {
                            title: '能力指数（N/A）',
                            key: 4,
                            dataIndex: 'acdex',
                            align: 'center'
                        }, {
                            title: '性能指数（N/A）',
                            key: 5,
                            dataIndex: 'apdex',
                            align: 'center'
                        }, {
                            title: '相关事件（个）',
                            key: 6,
                            dataIndex: 'event',
                            align: 'center'
                        }, {
                            title: '综合健康指数（N/A）',
                            key: 7,
                            dataIndex: 'ahdex',
                            align: 'center'
                        }
                    ],
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
            curKpiName: '资源服务率',
            lineName: 'null~service_rate~4',
        }, () => {
            this.getAxios();
            this.getLineData();
            this.getbarData();
        })
    }

    render() {
        const { selectData, AppItemId } = this.props;
        const list1 = selectData.map((item) => {
            if (item.id == AppItemId) {
                return item;
            }
        })
        const { tabs,rankId, normSele, normInd, newNormInd, curKpiName, appData, modal1, clickTab, tableColumns, tableData, lineData, tabs2, clickTab2, newTitle, rankData } = this.state;
        return (<div className='dialogSource'>
            <div className='dialogHeader'>
                <div onClick={() => {
                    $('.serviseBlock2').hide();
                    $('.homePageHeader').show();
                    $('.footer').show();
                    $('.applicationBox').show();
                }}>
                    <img src={leftIcon} alt='' className='leftIcon' />
                </div>
                <div>业务系统资源</div>
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
                                        <span>业务系统资源摘要</span>
                                    </div>
                                    <i></i>
                                    <p>在此时间段，业务系统的综合健康指数</p>
                                    <ul className='sourceUl'>
                                        {
                                            list1.map((k, y) => {
                                                return k && k !== 'undefined' ? <li key={y} >
                                                    <div className="list_item" style={{ width: k.ahdexZhanBi > 50 ? (k.ahdexZhanBi) + '%' : '100%' }}>
                                                        <div className="fl">综合健康指数</div>
                                                        <div className="fr">{k.ahdexShowValue}</div>
                                                    </div>
                                                    <div className="list_inner_box">
                                                        <div className="list_chart" style={{ width: k.ahdexZhanBi > 0 ? (k.ahdexZhanBi) + '%' : '0.01%', background: 'rgb(157, 174, 255)' }}>
                                                        </div>
                                                    </div>
                                                </li> : ''
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className='dialogbg'>
                                    <p className='sourceTitle'>{curKpiName}</p>
                                    <p>描述内容：{curKpiName}</p>
                                    <div onClick={this.showModal('modal1')} className='seleIcon'>
                                        <span>切换指标</span>
                                        <Icon type="down" size='md' />
                                    </div>
                                    <div style={{ height: '354px' }}>
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
                                        <div className="chart_box">
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
                                        <div className="rank_chart">
                                            <p>当前业务系统排名：{rankId[0]?rankId[0].pm:''} 名</p>
                                            <p>排名柱状图</p>
                                            <ul >
                                                {rankData.map((k, y) => (
                                                    <li  key={y} >
                                                        <div className="list_item" style={{ width: k.zhanbi > 50 ? (k.zhanbi) + '%' : '100%' }}>
                                                            <div className="fl">{y+1}.{k.name}</div>
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
                                                    this.getAxios()
                                                })
                                            }}>取消</div>
                                            <div className='primary' onClick={() => {
                                                this.onClose('modal1')()
                                                this.setState({
                                                    normInd: newNormInd,
                                                    curKpiName: newTitle
                                                }, () => {
                                                    if (this.state.newNormInd == 0) {
                                                        this.setState({
                                                            lineName: 'null~service_rate~4'
                                                        })
                                                    } else if (this.state.newNormInd == 1) {
                                                        this.setState({
                                                            lineName: 'null~use_rate~3'
                                                        })
                                                    } else if (this.state.newNormInd == 2) {
                                                        this.setState({
                                                            lineName: 'null~asdex~5'
                                                        })

                                                    } else if (this.state.newNormInd == 3) {
                                                        this.setState({
                                                            lineName: 'null~acdex~2'
                                                        })

                                                    } else if (this.state.newNormInd == 4) {
                                                        this.setState({
                                                            lineName: 'null~apdex~1'
                                                        })

                                                    } else if (this.state.newNormInd == 5) {
                                                    } else if (this.state.newNormInd == 6) {
                                                        this.setState({
                                                            lineName: 'null~ahdex~6'
                                                        })
                                                    }
                                                    this.getLineData();
                                                    this.getAxios();
                                                    this.getbarData();
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
                                                        this.setState({ newNormInd: index, newTitle: item.title, tablekpiId: item.tablekpiId })
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

export default NetTab;