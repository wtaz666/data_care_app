import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class EventTableDetail extends Component {
    render() {
        const { data, allData } = this.props;
        if ((data.rankingId !== null) && (data.rankingId !== 1)) {
            return null;
        }
        let greyBg = '#AEAEAE';
        let useBg = '#EF651F';
        return <div>
            <div style={{ height: '300px' }}>
                <ReactEcharts
                    option={
                        {
                            series: [
                                ((allData[3] && allData[3].width) || (allData[2] && allData[2].width) || (allData[1] && allData[1].width) || (allData[0] && allData[0].width)) !== 0 ? {
                                    name: '中层',
                                    type: 'pie',
                                    radius: [50, 85],
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
                                                    color: useBg
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
                                                    color: 'transparent'
                                                }
                                            }
                                        }
                                    ]
                                } : {
                                        name: '中层',
                                        type: 'pie',
                                        radius: [50, 85],
                                        center: ['50%', '50%'],
                                        labelLine: {
                                            normal: {
                                                show: false
                                            }
                                        }
                                    },
                                (allData[0] && allData[0].width) > 0 ? {
                                    name: '小层',
                                    type: 'pie',
                                    radius: [50, 70],
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
                                                    color: useBg
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
                                                    color: greyBg
                                                }
                                            }
                                        }
                                    ]
                                } : {
                                        name: '小层',
                                        type: 'pie',
                                        radius: [50, 70],
                                        color: [greyBg, greyBg, greyBg, greyBg],
                                        center: ['50%', '50%'],
                                        labelLine: {
                                            normal: {
                                                show: false
                                            }
                                        },
                                        data: [
                                            { value: 100 }
                                        ]
                                    },
                                ((data.data[0] && data.data[0].width) || (data.data[1] && data.data[1].width)) !== 0 ? {
                                    name: '外层',
                                    type: 'pie',
                                    radius: [90, 110],
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
                                        show: false
                                    },
                                    data: [
                                        {
                                            value: data.data[0] ? data.data[0].width : '',
                                            name: data.data[0] ? data.data[0].width !== 0 ? data.data[0].name : '' : '',
                                            itemStyle: {
                                                normal: {
                                                    color: '#F07133'
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
                                                    color: '#F17D45'
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

                                        }, {
                                            value: allData[1] ? allData[1].width : 0,
                                            itemStyle: {
                                                normal: {
                                                    color: 'transparent'
                                                }
                                            }
                                        }, {
                                            value: allData.urgent ? allData.urgent.width : 0,
                                            itemStyle: {
                                                normal: {
                                                    color: 'transparent'
                                                }
                                            }
                                        }, {
                                            value: allData.urgentMost ? allData.urgentMost.width : 0,
                                            itemStyle: {
                                                normal: {
                                                    color: 'transparent'
                                                }
                                            }
                                        }
                                    ]
                                } : {
                                        name: '外层',
                                        type: 'pie',
                                        radius: [90, 110],
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
                <h3>较差</h3>
                <p>共计   {allData[0] ? allData[0].width + '%' : ''}</p>
            </div>
        </div>
    }
}

export default EventTableDetail;