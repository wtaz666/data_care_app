import React, { Component } from 'react';
import $ from 'jquery';
import '../tab.scss';
import Axios from 'axios';
import { Tabs, Icon, Modal } from 'antd-mobile';
import SourceTableDetail from 'components/sourcePage/sourceTableDetail';
import SourceTableDetail2 from 'components/sourcePage/sourceTableDetail2';
import SourceTableDetail3 from 'components/sourcePage/sourceTableDetail3';
import SourceTableDetail4 from 'components/sourcePage/sourceTableDetail4';
import SourcePageCharts from 'components/sourcePage/sourcePageCharts';

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

class SourceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal1: false,
            normInd: 0,// 指标id
            newNormInd: 0,
            timeId: 0,
            rankData: [],// 资源 - 四个分类
            resourceGetAllCount: [],// 资源 - 所有
            tabs: [
                { title: '实时' },
                { title: '今日' },
                { title: '本周' },
                { title: '本月' },
                { title: `具体时间` },
            ],
            nowTimeData:'具体时间',
            normSele: [
                {
                    title: '综合健康指数占比',
                    unit: '（%）'
                }, {
                    title: '综合健康指数较差情况',
                    unit: '（%）'
                }, {
                    title: '综合健康指数一般情况',
                    unit: '（%）'
                }, {
                    title: '综合健康指数良好情况',
                    unit: '（%）'
                }, {
                    title: '综合健康指数优秀情况',
                    unit: '（%）'
                }
            ],
            normSeleTit:'综合健康指数占比'
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
    gettime = (tab, i)=>{
        if (i === 0) {
            i = 6
        } else if (i === 1) {
            i = 0
        } else if (i === 2) {
            i = 2
        } else if (i === 3) {
            i = 3
        }
        this.setState({
            timeId: i
        },()=>{
            this.getAxios();
        })
    }
    getAxios() {
        // 资源 - 所有
        Axios.get('/kpiDing/resourceGetAllCount', {
            params: {
                webTimeType: this.state.timeId
            }
        }).then(res => {
            this.setState({
                resourceGetAllCount: res.data.res
            })
        })
        // 资源 较差-一般-良好-优秀
        Axios.get('/kpiDing/resourceGetAllCountAndRanking', {
            params: {
                webTimeType: this.state.nowTimeData !== '具体时间' ? null : this.state.timeId,
                // timeStart: this.state.nowTimeData !=== '任选时段' ? sessionStorage.getItem('oldTime') : null,
                // timeEnd: this.state.nowTimeData !== '任选时段' ? sessionStorage.getItem('nowTime') : null,
                rankingId: this.state.normInd !== 0 ? this.state.normInd : 1
            }
        }).then(res => {
            this.setState({
                rankData: res.data
            })
        })
    }
    componentDidMount() {
        this.getAxios();
    }

    render() {
        const { tabs, normSele, normInd, newNormInd, normSeleTit, resourceGetAllCount, rankData, modal1 } = this.state;
        return (<div className='dialogSource'>
            <div className='dialogHeader'>
                <div>
                    <Icon type='left' onClick={() => {
                        $('.serviseBlock1').hide();
                        $('.homePageHeader').show();
                        $('.footer').show();
                        $('.serviseBox').show();
                    }
                    } />
                </div>
                <div>服务端资源</div>
                <div></div>
            </div>
            <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} onChange={(tab,index)=>this.gettime(tab,index)}>
                {
                    tabs.map((item, index) => {
                        return <div style={{ height: '100%', paddingTop: '10px' }} key={index}>
                            <div className='dialogbg'>
                                <p className='sourceTitle'>服务端资源摘要</p>
                                <i></i>
                                <p>系统核心资源，包括业务系统、以及承载业务系统的服务器等</p>
                            </div>
                            <div className='dialogbg'>
                                <p className='sourceTitle'>{normSeleTit}</p>
                                <p>系统核心资源，包括业务系统、以及承载业务系统</p>
                                <Icon type="down" size='md' className='seleIcon' onClick={this.showModal('modal1')} />
                                {
                                    normInd === 0 ? <SourcePageCharts
                                        data={resourceGetAllCount}
                                    /> : ''
                                }
                                {
                                    normInd === 1 ?
                                        <SourceTableDetail allData={resourceGetAllCount} data={rankData} />
                                        : ''
                                }
                                {
                                    normInd === 2 ?
                                        <SourceTableDetail2 allData={resourceGetAllCount} data={rankData} />
                                        : ''
                                }
                                {
                                    normInd === 3 ?
                                        <SourceTableDetail3 allData={resourceGetAllCount} data={rankData} />
                                        : ''
                                }
                                {
                                    normInd === 4 ?
                                        <SourceTableDetail4 allData={resourceGetAllCount} data={rankData} />
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
                                            },()=>{
                                                this.getAxios()
                                            })
                                        }}>取消</div>
                                        <div className='primary' onClick={() => {
                                            this.onClose('modal1')()
                                            this.setState({
                                                normInd: newNormInd
                                            },()=>{
                                                this.getAxios()
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
                                                return <li key={index} className={index === newNormInd ? 'active' : ''} onClick={() => this.setState({ newNormInd: index,normSeleTit: item.title})}>
                                                    <div></div>
                                                    <div>
                                                        {item.title}<br />
                                                        {item.unit}
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

export default SourceTab;