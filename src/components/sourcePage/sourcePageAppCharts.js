import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class EventPageCharts extends Component {
    render() {
        const { data } = this.props;
        return (<div className=''>
            <div style={{ height: '300px' }}>
                <ReactEcharts
                    option={
                        {
                            title: {
                                text: '所有\n100%',
                                left: 'center',
                                top: '45%',
                                textStyle: {
                                    color: '#031f2d',
                                    align: 'center',
                                    fontWeight: 'normal'
                                }
                            },
                            series: ((data[3] && data[3].zhanbi) || (data[2] && data[2].zhanbi) || (data[1] && data[1].zhanbi) || (data[0] && data[0].zhanbi)) === 0 ?
                                [{
                                    name: '未关闭事件',
                                    type: 'pie', // 环形图的type和饼图相同
                                    radius: [80, 100],// 饼图的半径，第一个为内半径，第二个为外半径
                                    avoidLabelOverlap: true,
                                    color: ['#AEAEAE'],
                                    labelLine: { // 关闭指示线
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: [
                                        {
                                            value: 100
                                        }
                                    ]
                                }] : [
                                    {
                                        name: '未关闭事件',
                                        type: 'pie', // 环形图的type和饼图相同
                                        radius: [80, 100],// 饼图的半径，第一个为内半径，第二个为外半径
                                        avoidLabelOverlap: true,
                                        color: ['#EF651F', '#FFE11C', '#6BCB8B', '#2AB06F'],
                                        label: {
                                            normal: {  // 正常的样式
                                                show: true,
                                                position: 'left',
                                                color: 'black',
                                                textStyle: {
                                                    fontSize: '14'
                                                }
                                            },
                                            emphasis: { // 选中时候的样式
                                                show: true,
                                                color: ['#EF651F', '#FFE11C', '#6BCB8B', '#2AB06F']
                                            }
                                        },  //提示文字
                                        labelLine: {
                                            normal: {
                                                show: false
                                            }
                                        },
                                        data: [
                                            {
                                                value: data[0] ? data[0].zhanbi : '',
                                                name: data[0] ? data[0].zhanbi !== 0 ? data[0].name : '' : '',
                                                label: {
                                                    normal: {
                                                        formatter: () => {
                                                            return data[0] && (data[0].zhanbi > 0) ? data[0].zhanbi + '%\n' + data[0].name : ''
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                value: data[1] ? data[1].zhanbi : '',
                                                name: data[1] ? data[1].zhanbi !== 0 ? data[1].name : '' : '',
                                                label: {
                                                    normal: {
                                                        formatter: () => {
                                                            return data[1] && (data[1].zhanbi > 0) ? data[1].zhanbi + '%\n' + data[1].name : ''
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                value: data[2] ? data[2].zhanbi : '',
                                                name: data[2] ? data[2].zhanbi !== 0 ? data[2].name : '' : '',
                                                label: {
                                                    normal: {
                                                        formatter: () => {
                                                            return data[2] && (data[2].zhanbi > 0) ? data[2].zhanbi + '%\n' + data[2].name : ''
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                value: data[3] ? data[3].zhanbi : '',
                                                name: data[3] ? data[3].zhanbi !== 0 ? data[3].name : '' : '',
                                                label: {
                                                    normal: {
                                                        formatter: () => {
                                                            return data[3] && (data[3].zhanbi > 0) ? data[3].zhanbi + '%\n' + data[3].name : ''
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                ]
                        }
                    }
                />
            </div>
            <ul className='zhanbigrid'>
                <li><b></b>{data[0] ? data[0].name : ''}<span>{data[0] ? data[0].zhanbi + '%' : ''}</span></li>
                <li><b></b>{data[1] ? data[1].name : ''}<span>{data[1] ? data[1].zhanbi + '%' : ''}</span></li>
                <li><b></b>{data[2] ? data[2].name : ''}<span>{data[2] ? data[2].zhanbi + '%' : ''}</span></li>
                <li><b></b>{data[3] ? data[3].name : ''}<span>{data[3] ? data[3].zhanbi + '%' : ''}</span></li>
            </ul>
        </div>
        );
    }
}

export default EventPageCharts;