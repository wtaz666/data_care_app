import React, { Component } from 'react';
import './index.scss';
import $ from 'jquery';
import axios from 'axios';
import listIcon from 'images/applistIcon.svg';
import SourceTabs from 'components/tabs/sourceTab/sourcetab';
import AppTabs from 'components/tabs/sourceTab/sourceApp';
import NetTabs from 'components/tabs/sourceTab/sourceNet';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appBar: [],
            netBar: [],
            allCount: 0,
            allData: [],
            appFlag: false,
            netFlag: false
        }
    }
    appAxios() {
        const { AppItemId } = this.props;
        axios.get('/kpiDing/resourceAppTableSortDesc', {
            params: {
                webTimeType: 6,
                kpiId: 4,
                appSourceDataId: AppItemId == 0 ? sessionStorage.getItem('AppItemId') : AppItemId
            }
        }).then(res => {
            this.setState({
                appData: res.data
            })
        })
        // NetItemId
    }
    netAxios() {
        const { NetItemId } = this.props;
        axios.get('/kpiDing/resourceHostTableSortDesc', {
            params: {
                webTimeType: 6,
                kpiId: 4,
                hostId: NetItemId == 0 ? sessionStorage.getItem('NetItemId') : NetItemId
            }
        }).then(res => {
            this.setState({
                netData: res.data
            })
        })
    }
    getAppBar() {
        axios.get('/kpiDing/resourceAppAhdexSort', {
            params: {
                // webTimeType: 6,
                isUp: true
            }
        }).then(res => {
            if (res.data.appList && res.data.appList.length > 0) {
                var list = res.data.appList.map((item) => {
                    if (item.name.split('. ')[1] == sessionStorage.getItem('appName')) {
                        return item;
                    }
                })
                list.map((i)=>{
                    if(i){
                        this.setState({
                            appFlag: true
                        })
                    }
                })
                this.setState({
                    appBar: list
                })
            }
        })
    }
    getNetBar() {
        axios.get('/kpiDing/resourceHostAhdexSort', {
            params: {
                // webTimeType: this.state.nowTimeData !== '任选时段' ? null : this.state.time,
                isUp: true
            }
        }).then(res => {
            let data = res.data.res;
            if (data == null) {
                this.setState({
                    netBar: [],
                })
            } else {
                var list = data.map((item) => {
                    if (item.name.split('. ')[1] == sessionStorage.getItem('netName')) {
                        return item;
                    }
                })
                list.map((i)=>{
                    if(i){
                        this.setState({
                            netFlag: true
                        })
                    }
                })
                this.setState({
                    netBar: list
                })
            }
        })
    }
    sourceAllData() {
        axios.get('/kpiDing/resourceGetAllCount').then(res => {
            this.setState({
                allData: res.data.res,
                allCount: res.data.allCount
            })
        })
    }
    UNSAFE_componentWillReceiveProps(state) {
        this.getNetBar();
        this.getAppBar();
    }
    componentDidMount() {
        this.sourceAllData();
    }
    render() {
        const { allCount, allData, appFlag, netFlag } = this.state;
        const { typeVal, AppItemId, NetItemId, selectData, networkData } = this.props;
        return (<div className='dynamicPage'>
            {
                this.props && typeVal == 0 ?
                    <div className='serviseBox'>
                        <div className='contBlock' onClick={() => {
                            $('.serviseBlock1').css({ display: 'flex', flexDirection: 'column' });
                            $('.homePageHeader').hide();
                            $('.footer').hide();
                            $('.serviseBox').hide();
                        }}>
                            <div className='title'>
                                <img src={listIcon} alt='' className='icon' />
                                <span>资源总数：{allCount}</span>
                            </div>
                            <ul className='sourceCont'>
                                {
                                    allData.map((item, ind) => {
                                        return item.width > 0 ? <li key={ind}>
                                            <p>
                                                <span>{item.name}</span>
                                                <span>{item.width}(%)</span>
                                            </p>
                                            <div>
                                                <div style={{ width: item.width + '%' }}>
                                                </div>
                                            </div>
                                        </li> : ''
                                    })
                                }

                            </ul>
                        </div>
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='applicationBox'>
                            <div className='contBlock' onClick={() => {
                                $('.serviseBlock2').css({ display: 'flex', flexDirection: 'column' });
                                $('.homePageHeader').hide();
                                $('.footer').hide();
                                $('.applicationBox').hide();
                                this.appAxios();
                            }}>
                                <div className='title'>
                                    <img src={listIcon} alt='' className='icon' />
                                    <span>{sessionStorage.getItem('appName')}</span>
                                </div>
                                <ul>
                                    {
                                        !appFlag ? <li className="clearfix">
                                            <div className="list_item">
                                                <div className="fl">综合健康指数</div>
                                                <div className="fr">0</div>
                                            </div>
                                            <div className="list_inner_box">
                                                <div className="list_chart">
                                                </div>
                                            </div>
                                        </li>
                                            : this.state.appBar.map((k, y) => {
                                                return k && k !== 'undefined' ? <li className="clearfix" key={y} >
                                                    <div className="list_item" style={{ width: k.zhanbi > 50 ? (k.zhanbi) + '%' : '100%' }}>
                                                        <div className="fl">综合健康指数</div>
                                                        <div className="fr">{k.showValue}</div>
                                                    </div>
                                                    <div className="list_inner_box">
                                                        <div className="list_chart" style={{ width: k.zhanbi > 0 ? (k.zhanbi) + '%' : '0.01%', background: 'rgb(157, 174, 255)' }}>
                                                        </div>
                                                    </div>
                                                </li> : ''
                                            })
                                    }
                                </ul>
                            </div>
                        </div>
                        : this.props && typeVal == 2 ?
                            <div className='networkBox'>
                                <div className='contBlock' onClick={() => {
                                    $('.serviseBlock3').css({ display: 'flex', flexDirection: 'column' });
                                    $('.homePageHeader').hide();
                                    $('.footer').hide();
                                    $('.serviseBox').hide();
                                    $('.networkBox').hide();
                                    this.netAxios();
                                }}>
                                    <div className='title'>
                                        <img src={listIcon} alt='' className='icon' />
                                        <span>{sessionStorage.getItem('netName')}</span>
                                    </div>
                                    <ul>
                                        {
                                            !netFlag ? <li className="clearfix">
                                                <div className="list_item">
                                                    <div className="fl">综合健康指数</div>
                                                    <div className="fr">0</div>
                                                </div>
                                                <div className="list_inner_box">
                                                    <div className="list_chart">
                                                    </div>
                                                </div>
                                            </li>
                                                : this.state.netBar.map((k, y) => {
                                                    return k && k !== 'undefined' ? <li className="clearfix" key={y} >
                                                        <div className="list_item" style={{ width: k.zhanbi > 50 ? (k.zhanbi) + '%' : '100%' }}>
                                                            <div className="fl">综合健康指数</div>
                                                            <div className="fr">{k.showValue}</div>
                                                        </div>
                                                        <div className="list_inner_box">
                                                            <div className="list_chart" style={{ width: k.zhanbi > 0 ? (k.zhanbi) + '%' : '0.01%', background: 'rgb(157, 174, 255)' }}>
                                                            </div>
                                                        </div>
                                                    </li> : ''
                                                })
                                        }
                                    </ul>
                                </div>
                            </div>
                            : ''
            }
            {
                this.props && typeVal == 0 ?
                    <div className='serviseBlock1'>
                        <SourceTabs />
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='serviseBlock2'>
                            <AppTabs AppItemId={AppItemId} selectData={selectData} type={0} />
                        </div>
                        : this.props && typeVal == 2 ?
                            <div className='serviseBlock3'>
                                <NetTabs NetItemId={NetItemId} networkData={networkData} type={0} />
                            </div>
                            : ''
            }


        </div>);
    }
}

export default Index;