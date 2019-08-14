import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import { Tabs, Icon, Modal } from 'antd-mobile';
import { DateRangePicker } from 'element-react';

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

class BusinessApp extends Component {
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
                { title: `具体时间` },
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
        if (i === 0) {//最近两小时

        } else if (i === 1) {// 今日
        }
    }
    // 业务吞吐量
    getDscAxios() {
        axios.get('/performance/appViews', {
            params: {
                timeId: this.state.time
            }
        }).then(res => {
            let data = res.data;
            let Increase = data.Increase;
            // if (Increase < 0) {
            //     this.setState({
            //         arrowViews: 'fr glyphicon glyphicon-arrow-down',
            //         arrowStyle1: '#33cc00'
            //     })
            // } else if (Increase > 0) {
            //     this.setState({
            //         arrowViews: 'fr glyphicon glyphicon-arrow-up',
            //         arrowStyle1: '#ff0000'
            //     })
            // }
            this.setState({
                historicalAverageViews: data.historicalAverage,
                measureViews: data.measure,
                todayViews: data.today,
                IncreaseViews: Math.abs(Increase),
            })
        })
    }
    componentDidMount() {
        this.getDscAxios();
    }

    render() {
        const { selectData, type } = this.props;
        const { tabs, normSele, normInd, newNormInd, curKpiName, appData, modal1, onlineStime, onlineSvalue, OnlineTimeData, value1 } = this.state;
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
                <div>业务系统业务吞吐量</div>
                <div></div>
            </div>
            <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} onChange={(tab, index) => this.gettime(tab, index)}>
                {
                    tabs.map((item, index) => {
                        return <div style={{ height: '100%', paddingTop: '10px' }} key={index}>
                            <div className='dialogbg'>
                                <p className='sourceTitle'>业务系统访问量</p>
                                <div className="inner_flown">
                                    <div className="first_list1">
                                        <div>{this.state.todayViews}{this.state.measureViews}</div>
                                        <div>{this.state.IncreaseViews}%</div>
                                    </div>
                                    <div className="sec_list1" onClick={this.viewShowBox}></div>
                                    <div className="three_list1" onClick={this.lineBox2}></div>
                                    <div className="history_list1">
                                        预测基线：{this.state.historicalAverageViews}{this.state.measureViews}</div>
                                </div>
                            </div>
                            <div className='dialogbg'>
                                <p className='sourceTitle'>{curKpiName}</p>
                                <p>描述内容：{curKpiName}</p>
                                <Icon type="down" size='md' className='seleIcon' onClick={this.showModal('modal1')} />
                                {
                                    normInd == 0 ? '0'
                                        : normInd == 1 ? '1'
                                            : normInd == 2 ? '2'
                                                : ''
                                }

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
                                                if (this.state.normInd == 0) {
                                                    // this.getOnlineTime()
                                                } else if (this.state.normInd == 1) {
                                                    // this.getServies()
                                                } else if (this.state.normInd == 2) {
                                                    // this.getRuse()
                                                }
                                            })
                                        }}>取消</div>
                                        <div className='primary' onClick={() => {
                                            this.onClose('modal1')()
                                            this.setState({
                                                normInd: newNormInd
                                            }, () => {
                                                if (this.state.normInd == 0) {
                                                    // this.getOnlineTime()
                                                } else if (this.state.normInd == 1) {
                                                    // this.getServies()
                                                } else if (this.state.normInd == 2) {
                                                    // this.getRuse()
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
                                                    this.setState({ newNormInd: index, curKpiName: item.title })
                                                }} >
                                                    <div></div>
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
        );
    }
}

export default BusinessApp;