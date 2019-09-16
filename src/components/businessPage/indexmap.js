import React, { Component } from 'react';
import $ from 'jquery';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

class IndexMap extends Component {
    constructor(props){
        super(props);
        this.state={
            mapMax: 1,
            mapMin: 0
        }
    }
    initMap() {
        //引入北京地图
        $.get('beijing.json', (beijingJson) => {
            echarts.registerMap('beijing', beijingJson);
        });
        window.addEventListener("resize", () => {
        });
    }
    componentDidMount() {
        this.initMap(); // 地图
    }
    render() {
        const { mapData } = this.props;
        if (Object.keys(mapData).length === 0) {
            // mapData为空 ,默认数据
            return <div className='mapBox'>
                <div>暂无数据</div>
            </div>
        } else {
            //有数据了
            const pData = {
                CityDetails: mapData.CityDetails ? mapData.CityDetails : '',  // 区域点
                UrbanArea: mapData.UrbanArea,  //
                mapMax: mapData.max ? String(mapData.max[0].value) : this.state.mapMax, // 图例最大值
                mapMin: mapData.min ? mapData.min[0].value : this.state.mapMin, // 图例最小值
                maxMeasure: mapData.max ? String(mapData.max[0].measure) : '',
                minMeasure: mapData.min ? String(mapData.min[0].measure) : '',
                mapData: mapData
            }
            return (
                <div className='mapBox'>
                    <ReactEcharts
                    style={{height: '350px'}}
                        option={
                            {
                                background: '#f0f0f0',
                                title: {
                                    text: "地理区域流量图",
                                    left: 10,
                                    top: 20,
                                    textStyle: {
                                        color: 'rgba(56, 56, 56, 1)',
                                        fontSize: '14',
                                        fontWeight: 'normal'
                                    }
                                },
                                tooltip: {
                                    padding: 0,
                                    enterable: true,
                                    transitionDuration: 1,
                                    textStyle: {
                                        color: '#000',
                                        decoration: 'none',
                                    },
                                    confine: true,
                                    formatter: (params) => {
                                        let nodeName = '';
                                        let nodeRatio = '';
                                        let nodeTraffic = '';
                                        let nodeMaxValue = '';
                                        let nodeStr = '';
                                        let len = '';
                                        var bgStyle = 'width: 20px;height:20px;display: inline-block;margin-right:10px;';
                                        if (params.dataIndex >= 0 && mapData.CityDetails) {
                                            if (mapData.CityDetails[params.dataIndex]) {
                                                nodeName = mapData.CityDetails[params.dataIndex].nodeValue;
                                                nodeRatio = mapData.CityDetails[params.dataIndex].nodeValue;
                                                nodeTraffic = mapData.CityDetails[params.dataIndex].nodeValue;
                                               nodeMaxValue = mapData.CityDetails[params.dataIndex].value;
                                                 nodeStr = mapData.CityDetails[params.dataIndex].str;

                                                if (mapData.CityDetails[params.dataIndex].nodeValue ? mapData.CityDetails[params.dataIndex].nodeValue.length === 1 : false) {
                                                    if (nodeRatio[0].nodeRatio > 0 && nodeRatio[0].nodeRatio < this.state.mapMin) {
                                                        bgStyle += 'background: #6A85FF;'
                                                    } else if (nodeRatio[0].nodeRatio > this.state.mapMin && nodeRatio[0].nodeRatio <= 50) {
                                                        bgStyle += 'background: #4D6BFF;'
                                                    } else if (nodeRatio[0].nodeRatio > 50 && nodeRatio[0].nodeRatio < 100) {
                                                        bgStyle += 'background: #284EFF;'
                                                    } else if (nodeRatio[0].nodeRatio === 100) {
                                                        bgStyle += 'background: #0B35FF;'
                                                    }
                                                    len = `
                                                <ul style="padding-left:70px;padding-top:10px">
                                                    <li style="line-height: 20px">
                                                        <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                            ${nodeRatio[0].nodeRatio}% ${nodeTraffic[0].nodeTraffic} ${nodeName[0].nodeName}
                                                        </span>
                                                    </li>
                                                </ul>
                                                `
                                                } else if (mapData.CityDetails[params.dataIndex].nodeValue ? mapData.CityDetails[params.dataIndex].nodeValue.length === 2 : false) {
                                                    if (nodeRatio[0].nodeRatio > 0 && nodeRatio[0].nodeRatio < this.state.mapMin) {
                                                        bgStyle += 'background: #6A85FF;'
                                                    } else if (nodeRatio[0].nodeRatio > this.state.mapMin && nodeRatio[0].nodeRatio <= 50) {
                                                        bgStyle += 'background: #4D6BFF;'
                                                    } else if (nodeRatio[0].nodeRatio > 50 && nodeRatio[0].nodeRatio < 100) {
                                                        bgStyle += 'background: #284EFF;'
                                                    } else if (nodeRatio[0].nodeRatio === 100) {
                                                        bgStyle += 'background: #0B35FF;'
                                                    } else if (nodeRatio[1].nodeRatio > 0 && nodeRatio[1].nodeRatio < this.state.mapMin) {
                                                        bgStyle += 'background: #6A85FF;'
                                                    } else if (nodeRatio[1].nodeRatio > this.state.mapMin && nodeRatio[1].nodeRatio <= 50) {
                                                        bgStyle += 'background: #4D6BFF;'
                                                    } else if (nodeRatio[1].nodeRatio > 50 && nodeRatio[1].nodeRatio < 100) {
                                                        bgStyle += 'background: #284EFF;'
                                                    } else if (nodeRatio[1].nodeRatio === 100) {
                                                        bgStyle += 'background: #0B35FF;'
                                                    }
                                                    len = `
                                                <ul style="padding-left:70px;padding-top:10px">
                                                    <li style="line-height: 20px">
                                                        <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                            ${nodeRatio[0].nodeRatio}% ${nodeTraffic[0].nodeTraffic} ${nodeName[0].nodeName}
                                                        </span>
                                                    </li>
                                                    <li style="line-height: 20px">
                                                        <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                            ${nodeRatio[1].nodeRatio}% ${nodeTraffic[1].nodeTraffic} ${nodeName[1].nodeName}
                                                        </span>
                                                    </li>
                                                </ul>
                                                `
                                                } else if (mapData.CityDetails[params.dataIndex].nodeValue ? mapData.CityDetails[params.dataIndex].nodeValue.length === 3 : false) {
                                                    if (nodeRatio[0].nodeRatio > 0 && nodeRatio[0].nodeRatio < this.state.mapMin) {
                                                        bgStyle += 'background: #6A85FF;'
                                                    } else if (nodeRatio[0].nodeRatio > this.state.mapMin && nodeRatio[0].nodeRatio <= 50) {
                                                        bgStyle += 'background: #4D6BFF;'
                                                    } else if (nodeRatio[0].nodeRatio > 50 && nodeRatio[0].nodeRatio < 100) {
                                                        bgStyle += 'background: #284EFF;'
                                                    } else if (nodeRatio[0].nodeRatio === 100) {
                                                        bgStyle += 'background: #0B35FF;'
                                                    } else if (nodeRatio[1].nodeRatio > 0 && nodeRatio[1].nodeRatio < this.state.mapMin) {
                                                        bgStyle += 'background: #6A85FF;'
                                                    } else if (nodeRatio[1].nodeRatio > this.state.mapMin && nodeRatio[1].nodeRatio <= 50) {
                                                        bgStyle += 'background: #4D6BFF;'
                                                    } else if (nodeRatio[1].nodeRatio > 50 && nodeRatio[1].nodeRatio < 100) {
                                                        bgStyle += 'background: #284EFF;'
                                                    } else if (nodeRatio[1].nodeRatio === 100) {
                                                        bgStyle += 'background: #0B35FF;'
                                                    } else if (nodeRatio[2].nodeRatio > 0 && nodeRatio[2].nodeRatio < this.state.mapMin) {
                                                        bgStyle += 'background: #6A85FF;'
                                                    } else if (nodeRatio[2].nodeRatio > this.state.mapMin && nodeRatio[2].nodeRatio <= 50) {
                                                        bgStyle += 'background: #4D6BFF;'
                                                    } else if (nodeRatio[2].nodeRatio > 50 && nodeRatio[2].nodeRatio < 100) {
                                                        bgStyle += 'background: #284EFF;'
                                                    } else if (nodeRatio[2].nodeRatio === 100) {
                                                        bgStyle += 'background: #0B35FF;'
                                                    }
                                                    len = `
                                                <ul style="padding-left:70px;padding-top:10px">
                                                    <li style="line-height: 20px">
                                                        <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                            ${nodeRatio[0].nodeRatio}% ${nodeTraffic[0].nodeTraffic} ${nodeName[0].nodeName}
                                                        </span>
                                                    </li>
                                                    <li style="line-height: 20px">
                                                        <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                            ${nodeRatio[1].nodeRatio}% ${nodeTraffic[1].nodeTraffic} ${nodeName[1].nodeName}
                                                        </span>
                                                    </li>
                                                    <li style="line-height: 20px">
                                                        <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                            ${nodeRatio[2].nodeRatio}% ${nodeTraffic[2].nodeTraffic} ${nodeName[2].nodeName}
                                                        </span>
                                                    </li>
                                                </ul>
                                                `
                                                } else if (mapData.CityDetails[params.dataIndex].nodeValue ? mapData.CityDetails[params.dataIndex].nodeValue.length === 4 : false) {
                                                    if (nodeRatio[0].nodeRatio > 0 && nodeRatio[0].nodeRatio < this.state.mapMin) {
                                                        bgStyle += 'background: #6A85FF;'
                                                    } else if (nodeRatio[0].nodeRatio > this.state.mapMin && nodeRatio[0].nodeRatio <= 50) {
                                                        bgStyle += 'background: #4D6BFF;'
                                                    } else if (nodeRatio[0].nodeRatio > 50 && nodeRatio[0].nodeRatio < 100) {
                                                        bgStyle += 'background: #284EFF;'
                                                    } else if (nodeRatio[0].nodeRatio === 100) {
                                                        bgStyle += 'background: #0B35FF;'
                                                    } else if (nodeRatio[1].nodeRatio > 0 && nodeRatio[1].nodeRatio < this.state.mapMin) {
                                                        bgStyle += 'background: #6A85FF;'
                                                    } else if (nodeRatio[1].nodeRatio > this.state.mapMin && nodeRatio[1].nodeRatio <= 50) {
                                                        bgStyle += 'background: #4D6BFF;'
                                                    } else if (nodeRatio[1].nodeRatio > 50 && nodeRatio[1].nodeRatio < 100) {
                                                        bgStyle += 'background: #284EFF;'
                                                    } else if (nodeRatio[1].nodeRatio === 100) {
                                                        bgStyle += 'background: #0B35FF;'
                                                    } else if (nodeRatio[2].nodeRatio > 0 && nodeRatio[2].nodeRatio < this.state.mapMin) {
                                                        bgStyle += 'background: #6A85FF;'
                                                    } else if (nodeRatio[2].nodeRatio > this.state.mapMin && nodeRatio[2].nodeRatio <= 50) {
                                                        bgStyle += 'background: #4D6BFF;'
                                                    } else if (nodeRatio[2].nodeRatio > 50 && nodeRatio[2].nodeRatio < 100) {
                                                        bgStyle += 'background: #284EFF;'
                                                    } else if (nodeRatio[2].nodeRatio === 100) {
                                                        bgStyle += 'background: #0B35FF;'
                                                    } else if (nodeRatio[3].nodeRatio > 0 && nodeRatio[3].nodeRatio < this.state.mapMin) {
                                                        bgStyle += 'background: #6A85FF;'
                                                    } else if (nodeRatio[3].nodeRatio > this.state.mapMin && nodeRatio[3].nodeRatio <= 50) {
                                                        bgStyle += 'background: #4D6BFF;'
                                                    } else if (nodeRatio[3].nodeRatio > 50 && nodeRatio[3].nodeRatio < 100) {
                                                        bgStyle += 'background: #284EFF;'
                                                    } else if (nodeRatio[3].nodeRatio === 100) {
                                                        bgStyle += 'background: #0B35FF;'
                                                    }
                                                    len = `
                                                <ul style="padding-left:70px;padding-top:10px">
                                                    <li style="line-height: 20px">
                                                        <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                            ${nodeRatio[0].nodeRatio}% ${nodeTraffic[0].nodeTraffic} ${nodeName[0].nodeName}
                                                        </span>
                                                    </li>
                                                    <li style="line-height: 20px">
                                                        <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                            ${nodeRatio[1].nodeRatio}% ${nodeTraffic[1].nodeTraffic} ${nodeName[1].nodeName}
                                                        </span>
                                                    </li>
                                                    <li style="line-height: 20px">
                                                        <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                            ${nodeRatio[2].nodeRatio}% ${nodeTraffic[2].nodeTraffic} ${nodeName[2].nodeName}
                                                        </span>
                                                    </li>
                                                    <li style="line-height: 20px">
                                                        <span style="${bgStyle}"></span><span style="padding-top: -4px">
                                                            ${nodeRatio[3].nodeRatio}% ${nodeTraffic[3].nodeTraffic} ${nodeName[3].nodeName}
                                                        </span>
                                                    </li>
                                                </ul>
                                                `
                                                }

                                            }
                                        }
                                        if (!params.name ) {
                                            return;
                                        } else if ( params.data && params.data.name !== undefined) {
                                            var res =
                                                `
                                            <div style="height:190px;width:auto;border-radius:5px;background:#fff;box-shadow:0 0 10px 5px #aaa;font-size: 12px">
                                                <div style="height:110px;width:100%;border-radius:5px;background:#fff">
                                                    <div style="padding-top:10px">
                                                        <span style="line-height:30px;margin-left:20px;margin-right: 10px">${params.data.name}</span>
                                                        <span>时间段:${params.data.time}&nbsp;&nbsp;&nbsp;</span>
                                                    </div>
                                                    <div style="padding-top:10px;margin-left:20px;">
                                                        <span>总流量：${nodeMaxValue}${nodeStr}</span>
                                                    </div>
                                                    ${len}
                                                </div>
                                            </div>
                                            `;
                                            return res;
                                        }
                                    }
                                },
                                visualMap: {
                                    show: true,
                                    min: pData.mapMin,
                                    max: pData.mapMax,
                                    left: '10px',
                                    bottom: '10px',
                                    text: ['高 ' + pData.maxMeasure, '低' + pData.minMeasure], // 文本，默认为数值文本
                                    textStyle: {
                                        color: 'rgba(56, 56, 56, 1)'
                                    },
                                    calculable: true,
                                    seriesIndex: [1],
                                    inRange: {
                                        color: ['#6A85FF', '#4D6BFF', '#284EFF', '#0B35FF'] // 蓝
                                    }
                                },
                                geo: {
                                    show: true,
                                    map: 'beijing',
                                    label: {
                                        normal: {
                                            show: false
                                        },
                                        emphasis: {
                                            show: false,
                                        }
                                    },
                                    roam: false,
                                    itemStyle: {
                                        normal: {
                                            areaColor: '#AEBCFF',
                                            borderColor: '#3B5077',
                                        },
                                        emphasis: {
                                            areaColor: '#2B91B7',
                                        }
                                    }
                                },
                                series: [
                                    {
                                        name: '散点',
                                        type: 'map',
                                        coordinateSystem: 'geo',
                                        data: pData.UrbanArea,
                                        label: {
                                            normal: {
                                                formatter: '{b}',
                                                position: 'right',
                                                show: true
                                            },
                                            emphasis: {
                                                show: false
                                            }
                                        },
                                        itemStyle: {
                                            normal: {
                                                color: '#05C3F9'
                                            }
                                        }
                                    },
                                    {
                                        type: 'map',
                                        map: 'beijing',
                                        geoIndex: 0,
                                        aspectScale: 0.75, //长宽比
                                        showLegendSymbol: false, // 存在legend时显示
                                        label: {
                                            normal: {
                                                show: true
                                            },
                                            emphasis: {
                                                show: false,
                                                textStyle: {
                                                    color: 'rgba(56, 56, 56, 1)'
                                                }
                                            }
                                        },
                                        roam: false,
                                        itemStyle: {
                                            normal: {
                                                areaColor: '#031525',
                                                borderColor: '#3B5077',
                                            },
                                            emphasis: {
                                                areaColor: '#2B91B7'
                                            }
                                        },
                                        animation: false,
                                        data: pData.CityDetails
                                    }
                                ]
                            }
                        }
                    />
                </div>
            );
        }
    }
}

export default IndexMap;