import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class EventTableDetail2 extends Component {
    render() {
        const { data, allData } = this.props;
        if ((data.rankingId !== null) && (data.rankingId !== 4)) {
            return null;
        }
        let greyBg = '#AEAEAE';
        let useBg = '#2AB06F';
        return <div>
            <div className='eventTopItems' style={{ height: '300px' }}>
                <ReactEcharts
                    id="eventTopEchartDetail"
                    option={
                        {
                            series: [
                                ((allData.urgentMost && allData.urgentMost.width) || (allData.urgent && allData.urgent.width) || (allData.normal && allData.normal.width) || (allData.notice && allData.notice.width)) !== 0 ? {
                                    name: '中层',
                                    type: 'pie',
                                    radius: [30, 65],
                                    center: ['50%', '50%'],
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: [
                                        {
                                            value: allData[0] ? allData[0].width : '',
                                            itemStyle: {
                                                normal: {
                                                    color: 'transparent'
                                                }
                                            }
                                        },
                                        {
                                            value: allData[1] ? allData[1].width : '',
                                            itemStyle: {
                                                normal: {
                                                    color: 'transparent'
                                                }
                                            }
                                        },
                                        {
                                            value: allData[2] ? allData[2].width : '',
                                            itemStyle: {
                                                normal: {
                                                    color: 'transparent'
                                                }
                                            }
                                        },
                                        {
                                            value: allData[3] ? allData[3].width : '',
                                            itemStyle: {
                                                normal: {
                                                    color: useBg
                                                }
                                            }
                                        }
                                    ]
                                } : {
                                        name: '中层',
                                        type: 'pie',
                                        radius: [30, 65],
                                        center: ['50%', '50%'],
                                        color: 'transparent',
                                        labelLine: {
                                            normal: {
                                                show: false
                                            }
                                        }
                                    },
                                (allData[3] && allData[3].width) > 0 ? {
                                    name: '小层',
                                    type: 'pie',
                                    radius: [30, 50],
                                    center: ['50%', '50%'],
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: [
                                        {
                                            value: allData[0] ? allData[0].width : '',
                                            itemStyle: {
                                                normal: {
                                                    color: greyBg
                                                }
                                            }
                                        },
                                        {
                                            value: allData[1] ? allData[1].width : '',
                                            itemStyle: {
                                                normal: {
                                                    color: greyBg
                                                }
                                            }
                                        },
                                        {
                                            value: allData[2] ? allData[2].width : '',
                                            itemStyle: {
                                                normal: {
                                                    color: greyBg
                                                }
                                            }
                                        },
                                        {
                                            value: allData[3] ? allData[3].width : '',
                                            itemStyle: {
                                                normal: {
                                                    color: useBg
                                                }
                                            }
                                        }
                                    ]
                                } : {
                                        name: '小层',
                                        type: 'pie',
                                        radius: [30, 50],
                                        center: ['50%', '50%'],
                                        color: ['#AEAEAE'],
                                        labelLine: {
                                            normal: {
                                                show: false
                                            }
                                        },
                                        data: [
                                            {
                                                value: 100
                                            }
                                        ]
                                    },
                                ((data.data[0] && data.data[0].width) || (data.data[1] && data.data[1].width)) !== 0 ?
                                    {
                                        name: '外层',
                                        type: 'pie',
                                        radius: [70, 90],
                                        avoidLabelOverlap: true,
                                        startAngle: 90,
                                        center: ['50%', '50%'],
                                        label: {
                                            normal: {
                                                position: 'outside',
                                                textStyle: {
                                                    color: '#000',
                                                    fontSize: 12
                                                }
                                            }
                                        },
                                        labelLine: {
                                            normal: {
                                                show: false
                                            }
                                        },
                                        data: [{
                                            value: allData[0] ? allData[0].width : 0,
                                            itemStyle: {
                                                normal: {
                                                    color: 'transparent'
                                                }
                                            }
                                        }, {
                                            value: allData[1] ? allData[1].width : 0,
                                            itemStyle: {
                                                normal: {
                                                    color: 'transparent'
                                                }
                                            }
                                        }, {
                                            value: allData[2] ? allData[2].width : 0,
                                            itemStyle: {
                                                normal: {
                                                    color: 'transparent'
                                                }
                                            }
                                        }, {
                                            value: data.data[0] ? data.data[0].width : '',
                                            name: data.data[0] ? data.data[0].width !== 0 ? data.data[0].name : '' : '',
                                            itemStyle: {
                                                normal: {
                                                    color: 'rgb(50, 200, 130)'
                                                }
                                            },
                                            label: {
                                                normal: {
                                                    formatter: () => {
                                                        return data.data[0].width > 0 ? data.data[0].width + '%\n' + data.data[0].name : ''
                                                    },
                                                    textStyle: {
                                                        fontSize: '12'
                                                    }
                                                }
                                            }
                                        }, {
                                            value: data.data[1] ? data.data[1].width : '',
                                            name: data.data[1] ? data.data[1].width !== 0 ? data.data[1].name : '' : '',
                                            itemStyle: {
                                                normal: {
                                                    color: '#33CE85'
                                                }
                                            },
                                            label: {
                                                normal: {
                                                    formatter: () => {
                                                        return data.data[1].width > 0 ? data.data[1].width + '%\n' + data.data[1].name : ''
                                                    },
                                                    textStyle: {
                                                        fontSize: '12'
                                                    }
                                                }
                                            }
                                        }
                                        ]
                                    } : {
                                        name: '最外层',
                                        type: 'pie',
                                        radius: [70, 90],
                                        avoidLabelOverlap: false,
                                        color: ['#AEAEAE'],
                                        startAngle: 90,
                                        center: ['50%', '50%']
                                    }
                            ]
                        }
                    }
                />
            </div>
            {/* 指标指数 */}
            <div className='normInfo'>
                <h3>优秀</h3>
                <p>共计   {allData[3] ? allData[3].width + '%' : ''}</p>
            </div>
        </div>
    }
}

export default EventTableDetail2;