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
import SourcePageAppCharts from 'components/sourcePage/sourcePageAppCharts';

import lrlconClick from '../../../images/selectIcons/lrIcon_click.svg';
import lrlcon from '../../../images/selectIcons/lrIcon_normal.svg';
import twolconClick from '../../../images/selectIcons/twoIcon_click.svg';
import twolcon from '../../../images/selectIcons/twoIcon_normal.svg';
import clocklconClick from '../../../images/selectIcons/clockIcon_click.svg';
import clocklcon from '../../../images/selectIcons/clockIcon_normal.svg';
import onelconClick from '../../../images/selectIcons/oneIcon_click.svg';
import onelcon from '../../../images/selectIcons/oneIcon_normal.svg';
import barlconClick from '../../../images/selectIcons/barIcon_click.svg';
import barlcon from '../../../images/selectIcons/barIcon_normal.svg';

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
            allCount: 0,
            modal1: false,
            normInd: 0,// 指标id
            newNormInd: 0,
            timeId: 0,
            rankData: [],// 资源 - 四个分类
            resourceGetAllCount: [],// 资源 - 所有
            appdata:[],//业务系统所有
            netdata:[],//服务器所有
            tabs: [
                { title: '实时' },
                { title: '今日' },
                { title: '本周' },
                { title: '本月' },
            ],
            tabs2: [
                { title: '业务系统' },
                { title: '服务器' },
            ],
            clickTab2: 0,
            normSele: [
                {
                    clickImg: twolconClick,
                    img: twolcon,
                    title: '综合健康指数占比',
                    unit: '（%）'
                }, {
                    clickImg: lrlconClick,
                    img: lrlcon,
                    title: '综合健康指数较差情况',
                    unit: '（%）'
                }, {
                    clickImg: clocklconClick,
                    img: clocklcon,
                    title: '综合健康指数一般情况',
                    unit: '（%）'
                }, {
                    clickImg: barlconClick,
                    img: barlcon,
                    title: '综合健康指数良好情况',
                    unit: '（%）'
                }, {
                    clickImg: onelconClick,
                    img: onelcon,
                    title: '综合健康指数优秀情况',
                    unit: '（%）'
                }
            ],
            normSeleTit: '综合健康指数占比'
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
        }, () => {
            this.getAxios();
        })
    }
    getAxios() {
        //业务系统-所有
        Axios.get('/AppIsNewController/resourceGetAllCountAndRankingNewApp', {
            params: {
                webTimeType: this.state.timeId
            }
        }).then(res => {
            this.setState({
                appdata:res.data,
            })
        })
        //服务器-所有
        Axios.get('/AppIsNewController/resourceGetAllCountAndRankingNewApp', {
            params: {
                webTimeType: this.state.timeId,
                hostId:0,
            }
        }).then(res => {
            this.setState({
                netdata:res.data,
            })
        })
        // 资源 - 所有
        Axios.get('/kpiDing/resourceGetAllCount', {
            params: {
                webTimeType: this.state.timeId
            }
        }).then(res => {
            this.setState({
                resourceGetAllCount: res.data.res,
                allCount: res.data.allCount
            })
        })
        // 资源 较差-一般-良好-优秀
        Axios.get('/kpiDing/resourceGetAllCountAndRanking', {
            params: {
                webTimeType: this.state.timeId,
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
        const { tabs, tabs2, clickTab2, normSele, normInd, newNormInd, normSeleTit, resourceGetAllCount, rankData, modal1, allCount,appdata,netdata } = this.state;
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
            <div className='icanfly'>
                <Tabs tabs={tabs} initialPage={0} animated={false} swipeable={false} useOnPan={true} onChange={(tab, index) => this.gettime(tab, index)}>
                    {
                        tabs.map((item, index) => {
                            return <div style={{ height: '100%', paddingTop: '10px' }} key={index}>
                                <div className='dialogbg'>
                                    <p className='sourceTitle'>服务器综合健康指数</p>
                                    <i></i>
                                    <p>在此时间段，服务器的综合健康指数</p>
                                    <div className="sourceCount">
                                        <div className='tboty-left'>
                                            <ul>
                                                <li>资源总量</li>
                                            </ul>
                                            <ul><li>{allCount}</li></ul>
                                        </div>
                                        <div className="tboty-right">
                                            <ul>
                                                <li>{resourceGetAllCount[3] ? resourceGetAllCount[3].name : ''}</li>
                                                <li>{resourceGetAllCount[2] ? resourceGetAllCount[2].name : ''}</li>
                                                <li>{resourceGetAllCount[1] ? resourceGetAllCount[1].name : ''}</li>
                                                <li>{resourceGetAllCount[0] ? resourceGetAllCount[0].name : ''}</li>
                                            </ul>
                                            <ul>
                                                <li>{resourceGetAllCount[3] ? resourceGetAllCount[3].count : ''}</li>
                                                <li>{resourceGetAllCount[2] ? resourceGetAllCount[2].count : ''}</li>
                                                <li>{resourceGetAllCount[1] ? resourceGetAllCount[1].count : ''}</li>
                                                <li>{resourceGetAllCount[0] ? resourceGetAllCount[0].count : ''}</li>
                                            </ul>

                                        </div>
                                    </div>
                                </div>
                                <div className='dialogbg'>
                                    <p className='sourceTitle'>{normSeleTit}</p>
                                    <p>系统核心资源，包括业务系统、以及承载业务系统</p>
                                    <div onClick={this.showModal('modal1')} className='seleIcon'>
                                        <span>切换指标</span>
                                        <Icon type="down" size='md' />
                                    </div>
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
                                <div className='tab2'>
                                    <Tabs tabs={tabs2}
                                        initialPage={clickTab2}
                                        page={clickTab2}
                                        swipeable={false}
                                        useOnPan={true}
                                        onChange={(tab, index) => this.setState({ clickTab2: index })}
                                    >
                                        <div className='tables'>
                                        <SourcePageAppCharts
                                            data={appdata}
                                        />
                                        </div>
                                        <div className="tables">
                                        <SourcePageAppCharts
                                            data={netdata}
                                        />
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
                                                    normInd: newNormInd
                                                }, () => {
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
                                                    return <li key={index} className={index === newNormInd ? 'active' : ''} onClick={() => this.setState({ newNormInd: index, normSeleTit: item.title })}>
                                                        {
                                                            index === newNormInd ? <div><img src={item.img} alt='图片不存在' /> </div> : <div><img src={item.clickImg} alt='图片不存在' /> </div>
                                                        }
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
        </div>
        );
    }
}

export default SourceTab;