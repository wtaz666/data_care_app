import React, { Component } from 'react';
import './index.scss';
import $ from 'jquery';
import axios from 'axios';
import SourceTabs from '../../components/tabs/sourceTab/sourcetab';
import AppTabs from '../../components/tabs/serviesTab/apptab';
import NetTabs from '../../components/tabs/serviesTab/nettab';

class Index extends Component {
    constructor(props){
        super(props);
        this.state={
            listData: []
        }
    }
    appAxios(){
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
    netAxios(){
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
    get(){
        axios.get('/kpiDing/resourceAppAhdexSort', {
            params: {
                // webTimeType: 6,
                isUp: true
            }
        }).then(res => {
            var list = res.data.appList.map((item)=>{
                    console.log(item.name.split('. ')[1])
                if(item.name.split('.')[1] == sessionStorage.getItem('netName')){
                    return item;
                }
            })
            this.setState({
                listData: list
            })
            console.log(this.state.listData)
        })
    }
    componentDidMount(){
    }
    render() {
        const { typeVal, AppItemId, NetItemId, selectData, networkData } = this.props;
        return (<div className='dynamicPage'>
            {
                this.props && typeVal == 0 ?
                    <div className='serviseBox'>
                        <div className='contBlock' onClick={() => {
                            $('.serviseBlock1').show();
                            $('.homePageHeader').hide();
                            $('.footer').hide();
                            $('.serviseBox').hide();
                        }}>全局资源1</div>
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='applicationBox'>
                            <div className='contBlock' onClick={() => {
                                $('.serviseBlock2').show();
                                $('.homePageHeader').hide();
                                $('.footer').hide();
                                $('.applicationBox').hide();
                                this.appAxios();
                            }}>
                            {
                                sessionStorage.getItem('appName')
                            }
                            </div>
                        </div>
                        : this.props && typeVal == 2 ?
                            <div className='networkBox'>
                                <div className='contBlock' onClick={() => {
                                    $('.serviseBlock3').show();
                                    $('.homePageHeader').hide();
                                    $('.footer').hide();
                                    $('.serviseBox').hide();
                                    $('.networkBox').hide();
                                    this.get();
                                    this.netAxios();
                                }}>
                                {
                                    sessionStorage.getItem('netName')
                                }
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