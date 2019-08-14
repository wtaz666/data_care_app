import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import BusinessApp from '../../components/tabs/business/businessApp';
import BusinessNet from '../../components/tabs/business/businessNet';

class BusinessPage extends Component {
   // 业务吞吐量
   businessAxios(){
        axios.get('/performance/getAppTrafficListZhong',{
            params:{
                // timeId: this.state.timeId,
                // appSourceDataId: AppItemId == 0 ? sessionStorage.getItem('AppItemId') : AppItemId,
                // nodeSourceDataId: 
            }
        }).then(res=>{
            console.log(res.data)
        })
    }
    componentDidMount(){
        this.businessAxios();
    }
    render() {
        const { typeVal, AppItemId, NetItemId, selectData, networkData } = this.props;
        return (<div className='dynamicPage'>
            {
                this.props && typeVal == 0 ?
                    <div className='applicationBox'>
                        <div className='contBlock' onClick={() => {
                            $('.serviseBlock1').show();
                            $('.homePageHeader').hide();
                            $('.footer').hide();
                            $('.applicationBox').hide();
                        }}>业务吞吐量全局1</div>
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='networkBox'>
                            <div className='contBlock' onClick={() => {
                                $('.serviseBlock2').show();
                                $('.homePageHeader').hide();
                                $('.footer').hide();
                                $('.serviseBox').hide();
                                $('.networkBox').hide();
                            }}>业务吞吐量服务器1</div>
                        </div>
                        : <div className='applicationBox'>
                            <div className='contBlock' onClick={() => {
                                $('.serviseBlock3').show();
                                $('.homePageHeader').hide();
                                $('.footer').hide();
                                $('.applicationBox').hide();
                                this.appAxios();
                            }}>业务吞吐量端到端1</div>
                        </div>
            }
            {
                this.props && typeVal == 0 ?
                    <div className='serviseBlock1'>
                        <BusinessApp/>
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='serviseBlock2'>
                            <BusinessNet NetItemId={NetItemId} networkData={networkData}/>
                        </div> : <div className='serviseBlock3'>
                            {/* <AppTabs type={1} /> */}
                        </div>
            }
            </div>);
    }
}

export default BusinessPage;