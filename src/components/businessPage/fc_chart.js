import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';

class FChart extends Component {
    constructor() {
        super()
        this.state = {
            nameList: [],
            strAll: []
        }
    }
    //分层视图 请求数据
    getFcDate() {
        //分层视图
            let data = this.props.data;
            let name = {};
            let nameList = [];
            data.key.map((k, y) => {
                name = {
                    name: k,
                };
                nameList.push(name)

            });
            this.setState({
                nameList: nameList,
                strAll: data.value,
            })
    }
    UNSAFE_componentWillReceiveProps(){
        this.getFcDate();
    }
    componentDidMount(){
        this.getFcDate();
    }
    render() {
        return (
            <div className="fc_chart">
                <ReactEcharts
                style={{height: '350px'}}
                    option={
                        {
                            grid: {
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            tooltip: {
                                confine: true,
                                trigger: 'item',
                                backgroundColor: 'rgba(255,255,255,1)',
                                padding: [20, 20],
                                textStyle: {
                                    color: '#7588E4',
                                },
                                formatter: (params) => {
                                    // console.log(params);
                                    if (!params.value) {
                                        return
                                    } else {
                                        let res = `
                                        <div>${params.name}</div>
                                        <div>${params.data.showValue.value}${params.data.showValue.measure}</div>
                                        `
                                        return res
                                    }
                                }
                            },
                            series: {
                                type: 'sankey',
                                layout: 'none',
                                nodeWidth: 20,
                                nodeGap: 20,
                                data: this.state.nameList,
                                links: this.state.strAll,
                                label: {
                                    position: 'bottom'
                                }
                            }
                        }
                    }
                    // onEvents={onEvents}
                />
            </div>
        );
    }
}

export default FChart;