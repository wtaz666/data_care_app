import React, { Component } from 'react';
import '../home/index.scss';
import $ from 'jquery';
// import axios from 'axios';
import AppTabs from '../../components/tabs/serviesTab/apptab';
import NetTabs from '../../components/tabs/serviesTab/nettab';

class Index extends Component {
    appAxios() {
        // const { AppItemId } = this.props;
        // axios.get('/kpiDing/resourceAppTableSortDesc', {
        //     params: {
        //         webTimeType: 6,
        //         kpiId: 4,
        //         appSourceDataId: AppItemId == 0 ? sessionStorage.getItem('AppItemId') : AppItemId
        //     }
        // }).then(res => {
        //     this.setState({
        //         appData: res.data
        //     })
        // })
    }
    render() {
        const { typeVal, AppItemId, NetItemId, selectData, networkData } = this.props;
        return (<div className='dynamicPage'>
            {
                this.props && typeVal == 0 ?
                    <div className='applicationBox'>
                        <div className='contBlock' onClick={() => {
                            $('.serviseBlock2').show();
                            $('.homePageHeader').hide();
                            $('.footer').hide();
                            $('.applicationBox').hide();
                            this.appAxios();
                        }}>业务系统服务在线1</div>
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='networkBox'>
                            <div className='contBlock' onClick={() => {
                                $('.serviseBlock3').show();
                                $('.homePageHeader').hide();
                                $('.footer').hide();
                                $('.serviseBox').hide();
                                $('.networkBox').hide();
                            }}>服务器服务在线1</div>
                        </div>
                        : <div className='applicationBox'>
                            <div className='contBlock' onClick={() => {
                                $('.serviseBlock2').show();
                                $('.homePageHeader').hide();
                                $('.footer').hide();
                                $('.applicationBox').hide();
                                this.appAxios();
                            }}>业务系统服务在线1</div>
                        </div>
            }
            {
                this.props && typeVal == 0 ?
                    <div className='serviseBlock2'>
                        <AppTabs AppItemId={AppItemId} selectData={selectData} type={1} />
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='serviseBlock3'>
                            <NetTabs NetItemId={NetItemId} networkData={networkData} type={1} />
                        </div> : <div className='serviseBlock2'>
                            <AppTabs AppItemId={AppItemId} selectData={selectData} type={1} />
                        </div>
            }
        </div>);
    }
}

export default Index;