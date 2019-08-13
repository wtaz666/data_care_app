import React, { Component } from 'react';
import './index.scss';
import $ from 'jquery';
import axios from 'axios';
import SourceTabs from '../../components/tabs/sourceTab/sourcetab';
import AppTabs from '../../components/tabs/appTab/apptab';
import NetTabs from '../../components/tabs/netTab/nettab';

class Index extends Component {
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
                        <div className='contBlock'>全局资源2</div>
                        <div className='contBlock'>全局资源3</div>
                        <div className='contBlock'>全局资源4</div>
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='applicationBox'>
                            <div className='contBlock' onClick={() => {
                                $('.serviseBlock2').show();
                                $('.homePageHeader').hide();
                                $('.footer').hide();
                                $('.applicationBox').hide();
                                this.appAxios();
                            }}>业务系统资源1</div>
                            <div className='contBlock'>业务系统资源2</div>
                            <div className='contBlock'>业务系统资源3</div>
                            <div className='contBlock'>业务系统资源4</div>
                        </div>
                        : this.props && typeVal == 2 ?
                            <div className='networkBox'>
                                <div className='contBlock' onClick={() => {
                                    $('.serviseBlock3').show();
                                    $('.homePageHeader').hide();
                                    $('.footer').hide();
                                    $('.serviseBox').hide();
                                    $('.networkBox').hide();
                                }}>服务器资源1</div>
                                <div className='contBlock'>服务器资源2</div>
                                <div className='contBlock'>服务器资源3</div>
                                <div className='contBlock'>服务器资源4</div>
                            </div>
                            : <div className='serviseBox'>
                                <div className='contBlock' onClick={() => {
                                    $('.serviseBlock1').show();
                                    $('.homePageHeader').hide();
                                    $('.footer').hide();
                                    $('.serviseBox').hide();
                                }}>全局资源1</div>
                                <div className='contBlock'>全局资源2</div>
                                <div className='contBlock'>全局资源3</div>
                                <div className='contBlock'>全局资源4</div>
                            </div>
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
                            : <div className='serviseBlock1'>
                                <SourceTabs />
                            </div>
            }


        </div>);
    }
}

export default Index;