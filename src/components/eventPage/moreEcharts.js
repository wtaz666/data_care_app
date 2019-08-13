import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class MoreEcharts extends Component {
    render() {
        const { listChildData } = this.props;
        return (
            <div className='detail_charts_box'>
                {
                    listChildData.length > 0 ? listChildData.map((item, index) => {
                        return item.listFirst ? <ReactEcharts
                            key={{ index }}
                            style={{ width: '100%', height: '300px' }}
                            option={
                                {
                                    backgroundColor: 'rgb(250, 250, 250)',
                                    grid: {
                                        top: 80,
                                        left: 65,
                                        right: 30
                                    },
                                    title: {
                                        text: `${item.name}`,
                                        left: 20,
                                        top: 14,
                                        textStyle: {
                                            color: 'rgb(102, 102, 102)',
                                            fontSize: '14',
                                            fontWeight: 'normal'
                                        }
                                    },
                                    legend: {
                                        selectedMode: false,
                                        bottom: '4%',
                                        textStyle: {
                                            color: 'rgb(102, 102, 102)',
                                        },
                                        data: [item.nameShow]
                                    },
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            lineStyle: {
                                                color: '#000'
                                            }
                                        },
                                        formatter: (params) => {
                                            if (params[0].data) {
                                                return `<div style="height:80px;border-radius:5px;background:#fff;box-shadow:0 0 10px 5px #aaa;font-size: 12px;padding: 6px 20px;box-sizing:border-box;color: #000">
                                                    <p>${params[0].axisValueLabel}</p>
                                                    <p>${params[0].seriesName} ${params[0].data}</p>
                                                </div>`
                                            } else {
                                                return;
                                            }
                                        },
                                        backgroundColor: 'rgba(255,255,255,1)',
                                        padding: [0],
                                        textStyle: {
                                            color: '#000',
                                        },
                                        extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                                    },
                                    xAxis: [{
                                        type: "category",
                                        axisLine: {
                                            show: false,
                                            lineStyle: {
                                                color: 'rgb(153, 153, 153)'
                                            }
                                        },
                                        axisLabel: {
                                            fontSize: 10
                                        },
                                        splitLine: {
                                            show: false
                                        },
                                        axisTick: {
                                            show: false
                                        },
                                        splitArea: {
                                            show: false
                                        },
                                        boundaryGap: true,
                                        data: item.time
                                    }],
                                    yAxis: [
                                        {
                                            type: "value",
                                            name: item.unitName,
                                            nameRotate: -0.1,
                                            nameTextStyle: {
                                                color: "rgb(153, 153, 153)"
                                            },
                                            max: item.errorHigh, // y轴最大值
                                            splitLine: {
                                                show: false
                                            },
                                            axisLine: {
                                                show: false,
                                                onZero: false,
                                                lineStyle: {
                                                    color: 'rgb(153, 153, 153)'
                                                }
                                            },
                                            axisTick: {
                                                show: false
                                            },
                                            splitArea: {
                                                show: false
                                            },
                                            axisLabel: {
                                                interval: 0
                                            }
                                        }],
                                    series: [
                                        {
                                            name: item.nameShow,
                                            symbol: "none",
                                            type: "line",
                                            itemStyle: {
                                                normal: {
                                                    color: {
                                                        type: 'linear',
                                                        x: 0,
                                                        y: 0,
                                                        x2: 0,
                                                        y2: 1,
                                                        colorStops: [{
                                                            offset: 0,
                                                            color: 'rgb(101, 133, 252)' // 0% 处的颜色
                                                        }]
                                                    }
                                                }
                                            },
                                            data: item.listFirst
                                        }, {
                                            name: item.nameShow,
                                            symbol: "none",
                                            type: "line",
                                            color: "#FC9DB2", //折线图颜色,搭配markArea为面积图
                                            lineStyle: { //折线的颜色
                                                color: "#FA5071"
                                            },
                                            markArea: {
                                                data: [
                                                    [{
                                                        xAxis: item.errorStart
                                                    }, {
                                                        xAxis: item.errorEnd
                                                    }]
                                                ]
                                            },
                                            markLine: {
                                                type: 'max',
                                                symbol: 'none',
                                                lineStyle: {
                                                    width: 3,
                                                    type: 'solid',
                                                    color: '#DC172A'
                                                },
                                                data: [
                                                    [
                                                        {
                                                            coord: [item.errorStart, item.errorHigh]
                                                        },
                                                        {
                                                            coord: [item.errorEnd, item.errorHigh]
                                                        }
                                                    ]
                                                ],
                                                label: {
                                                    normal: {
                                                        color: 'rgb(153, 153, 153)',
                                                        position: 'start',
                                                        formatter: () => {
                                                            // return '开始时间：' + item.time[item.errorStart];
                                                            return item.time[item.errorStart];
                                                        }
                                                    }
                                                }
                                            },
                                            data: item.listError
                                        }, item.listKongbai ? {
                                            type: 'line',
                                            color: "#DC172A", //折线图颜色,搭配markArea为面积图
                                            lineStyle: { //折线的颜色
                                                color: "#DC172A"
                                            },
                                            smooth: true, //是否平滑处理值0-1,true相当于0.5
                                            boundaryGap: false,
                                            markArea: {
                                                data: [
                                                    [{
                                                        xAxis: item.kongbaiTimeStart
                                                    }, {
                                                        xAxis: item.kongbaiTimeEnd
                                                    }]
                                                ]
                                            },
                                            markLine: {
                                                type: 'max',
                                                symbol: 'none',
                                                lineStyle: {
                                                    width: 3,
                                                    type: 'solid',
                                                    color: '#DC172A'
                                                },
                                                data: [
                                                    [{
                                                        coord: [item.kongbaiTimeStart, item.errorHigh]
                                                    },
                                                    {
                                                        coord: [item.kongbaiTimeEnd, item.errorHigh]
                                                    }
                                                    ]
                                                ],
                                                label: {
                                                    normal: {
                                                        color: 'rgb(153, 153, 153)',
                                                        position: 'middle',
                                                        formatter: () => {
                                                            return '结束时间：' + item.kongbaiTimeEnd;
                                                        }
                                                    }
                                                }
                                            }
                                        } : {
                                                type: 'line',
                                                data: []
                                            },
                                        item.listEnd ? {
                                            name: item.nameShow,
                                            symbol: "none",
                                            type: "line",
                                            stack: "总量",
                                            barMaxWidth: 25,
                                            barGap: "5%",
                                            itemStyle: {
                                                normal: {
                                                    color: {
                                                        type: 'linear',
                                                        x: 0,
                                                        y: 0,
                                                        x2: 0,
                                                        y2: 1,
                                                        colorStops: [{
                                                            offset: 0,
                                                            color: 'rgb(101, 133, 252)' // 0% 处的颜色
                                                        }]
                                                    }
                                                }
                                            },
                                            data: item.listEnd
                                        } : {
                                                type: 'line',
                                                data: []
                                            }
                                    ]
                                }
                            }
                        />
                            : <ReactEcharts
                                key={index}
                                style={{ width: '100%', height: '300px', marginBottom: '18px' }}
                                option={
                                    {
                                        backgroundColor: 'rgb(250, 250, 250)',
                                        grid: {
                                            top: 80,
                                            left: 65,
                                            right: 30
                                        },
                                        title: {
                                            // text: typeId == 1 ? `业务系统 - ${item.name}` : `服务器 - ${item.name}`,
                                            text: `服务器 - ${item.name}`,
                                            left: 20,
                                            top: 14,
                                            textStyle: {
                                                color: 'rgb(102, 102, 102)',
                                                fontSize: '14',
                                                fontWeight: 'normal'
                                            }
                                        },
                                        legend: {
                                            selectedMode: false,
                                            bottom: '4%',
                                            textStyle: {
                                                color: 'rgb(102, 102, 102)',
                                            },
                                            data: [item.nameDown, item.nameUp]
                                        },
                                        tooltip: {
                                            trigger: 'axis',
                                            axisPointer: {
                                                lineStyle: {
                                                    color: '#000'
                                                }
                                            },
                                            formatter: (params) => {
                                                if (params[0].data) {
                                                    return `<div style="height:100px;border-radius:5px;background:#fff;
                                                        box-shadow:0 0 10px 5px #aaa;font-size: 12px;padding: 6px 20px;
                                                        box-sizing:border-box">
                                                        <p>${params[0].axisValueLabel}</p>
                                                        <p>${params[0].seriesName} ${params[0].data}</p>
                                                        <p>${params[1].seriesName} ${params[1].data}</p>
                                                    </div>`
                                                }
                                            },
                                            backgroundColor: 'rgba(255,255,255,1)',
                                            padding: [0],
                                            textStyle: {
                                                color: '#000',
                                            },
                                            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                                        },
                                        xAxis: [{
                                            type: "category",
                                            axisLine: {
                                                show: false,
                                                lineStyle: {
                                                    color: 'rgb(153, 153, 153)'
                                                }
                                            },
                                            axisLabel: {
                                                fontSize: 10
                                            },
                                            splitLine: {
                                                show: false
                                            },
                                            axisTick: {
                                                show: false
                                            },
                                            splitArea: {
                                                show: false
                                            },
                                            boundaryGap: true,
                                            data: item.time
                                        }],
                                        yAxis: [
                                            {
                                                type: "value",
                                                name: item.unitName,
                                                nameRotate: -0.1,
                                                nameTextStyle: {
                                                    color: "rgb(153, 153, 153)"
                                                },
                                                max: item.errorHigh, // y轴最大值
                                                splitLine: {
                                                    show: false
                                                },
                                                axisLine: {
                                                    show: false,
                                                    onZero: false,
                                                    lineStyle: {
                                                        color: 'rgb(153, 153, 153)'
                                                    }
                                                },
                                                axisTick: {
                                                    show: false
                                                },
                                                splitArea: {
                                                    show: false
                                                },
                                                axisLabel: {
                                                    interval: 0
                                                }
                                            }],
                                        series: [
                                            // 1.请求访问量
                                            {
                                                name: item.nameDown,
                                                type: "bar",
                                                symbol: "none",
                                                stack: "总量",
                                                boundaryGap: true,
                                                barMaxWidth: 25,
                                                barGap: "5%",
                                                itemStyle: {
                                                    normal: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [{
                                                                offset: 0,
                                                                color: 'rgb(101, 133, 252)' // 0% 处的颜色
                                                            }]
                                                        }
                                                    }
                                                },
                                                data: item.listFirstDown,
                                            },
                                            // 1.请求响应量
                                            {
                                                name: item.nameUp,
                                                type: "bar",
                                                symbol: "none",
                                                stack: "总量",
                                                boundaryGap: true,
                                                itemStyle: {
                                                    normal: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [{
                                                                offset: 0,
                                                                color: '#DC172A' // 0% 处的颜色
                                                            }, {
                                                                offset: 1,
                                                                color: '#DC172A' // 100% 处的颜色
                                                            }]
                                                        }
                                                    }
                                                },
                                                data: item.listFirstUp
                                            },
                                            // 2.请求访问量
                                            {
                                                name: item.nameDown,
                                                type: "bar",
                                                symbol: "none",
                                                stack: "总量",
                                                // boundaryGap: false,
                                                itemStyle: {
                                                    normal: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [{
                                                                offset: 0,
                                                                color: 'rgb(101, 133, 252)' // 0% 处的颜色
                                                            }]
                                                        }
                                                    }
                                                },
                                                markLine: {
                                                    type: 'max',
                                                    symbol: 'none',
                                                    lineStyle: {
                                                        width: 3,
                                                        type: 'solid',
                                                        color: '#DC172A'
                                                    },
                                                    data: [
                                                        [
                                                            {
                                                                coord: [item.errorStart, item.errorHigh]
                                                            },
                                                            {
                                                                coord: [item.errorEnd, item.errorHigh]
                                                            }
                                                        ]
                                                    ],
                                                    label: {
                                                        normal: {
                                                            color: 'rgb(153, 153, 153)',
                                                            position: 'middle',
                                                            formatter: () => {
                                                                // return '开始时间：' + timeArr[startLen];
                                                                return item.time[item.errorStart];
                                                            }
                                                        }
                                                    }
                                                },
                                                data: item.listErrorDown
                                            },// 2.请求响应量
                                            {
                                                name: item.nameUp,
                                                type: "bar",
                                                symbol: "none",
                                                stack: "总量",
                                                // boundaryGap: false,
                                                itemStyle: {
                                                    normal: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [{
                                                                offset: 0,
                                                                color: '#DC172A' // 0% 处的颜色
                                                            }, {
                                                                offset: 1,
                                                                color: '#DC172A' // 100% 处的颜色
                                                            }]
                                                        }
                                                    }
                                                },
                                                data: item.listErrorUp
                                            },
                                            // 3.area粉色区域
                                            item.listKongbaiUp ? {
                                                type: 'bar',
                                                symbol: "none",
                                                color: "#FC9DB2", //折线图颜色,搭配markArea为面积图
                                                lineStyle: { //折线的颜色
                                                    color: "#FA5071"
                                                },
                                                smooth: true, //是否平滑处理值0-1,true相当于0.5
                                                boundaryGap: false,
                                                markArea: {
                                                    data: [
                                                        [{
                                                            xAxis: item.kongbaiTimeStart
                                                        }, {
                                                            xAxis: item.kongbaiTimeEnd
                                                        }]
                                                    ]
                                                },
                                                markLine: {
                                                    type: 'max',
                                                    symbol: 'none',
                                                    lineStyle: {
                                                        width: 3,
                                                        type: 'solid',
                                                        color: '#DC172A'
                                                    },
                                                    data: [
                                                        [{
                                                            coord: item.kongbaiTimeStart
                                                        },
                                                        {
                                                            coord: item.kongbaiTimeEnd
                                                        }
                                                        ]
                                                    ],
                                                    label: {
                                                        normal: {
                                                            color: 'rgb(153, 153, 153)',
                                                            position: 'middle',
                                                            formatter: () => {
                                                                return '结束时间：' + item.kongbaiTimeEnd;
                                                            }
                                                        }
                                                    }
                                                }
                                            } : {
                                                    type: 'line',
                                                    data: []
                                                },
                                            // 4.请求访问量
                                            item.listEndDown ? {
                                                name: item.nameDown,
                                                type: "bar",
                                                symbol: "none",
                                                stack: "总量",
                                                barMaxWidth: 25,
                                                barGap: "5%",
                                                // boundaryGap: false,
                                                itemStyle: {
                                                    normal: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [{
                                                                offset: 0,
                                                                color: 'rgb(101, 133, 252)' // 0% 处的颜色
                                                            }]
                                                        }
                                                    }
                                                },
                                                data: item.listEndDown
                                            } : {
                                                    type: 'line',
                                                    data: []
                                                },
                                            // 4.请求响应量
                                            item.listEndUp ? {
                                                name: item.nameUp,
                                                type: "bar",
                                                symbol: "none",
                                                stack: "总量",
                                                // boundaryGap: false,
                                                itemStyle: {
                                                    normal: {
                                                        color: {
                                                            type: 'linear',
                                                            x: 0,
                                                            y: 0,
                                                            x2: 0,
                                                            y2: 1,
                                                            colorStops: [{
                                                                offset: 0,
                                                                color: '#DC172A' // 0% 处的颜色
                                                            }, {
                                                                offset: 1,
                                                                color: '#DC172A' // 100% 处的颜色
                                                            }]
                                                        }
                                                    }
                                                },
                                                data: item.listEndUp
                                            } : {
                                                    type: 'line',
                                                    data: []
                                                }
                                        ]
                                    }
                                }
                            />
                    }) : ''
                }
            </div>
        )
    }
}

export default MoreEcharts;