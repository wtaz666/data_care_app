import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import '../home/index.scss';
import listIcon from '../../images/applistIcon.svg';
import BusinessAll from '../../components/tabs/business/businessAll';
import BusinessApp from '../../components/tabs/business/businessApp';
import BusinessDToD from '../../components/tabs/business/businessDToD';

class BusinessPage extends Component {
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
                            this.getDscAxios();
                            this.businessAxios();
                        }}>
                            <div className='title'>
                                <img src={listIcon} alt='' className='icon' />
                                <span>业务吞吐量全局1</span>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    : this.props && typeVal == 1 ?
                        <div className='applicationBox'>
                            <div className='contBlock' onClick={() => {
                                $('.serviseBlock2').show();
                                $('.homePageHeader').hide();
                                $('.footer').hide();
                                $('.serviseBox').hide();
                                $('.applicationBox').hide();
                                this.getDscAxios();
                                this.businessAxios();
                            }}>
                                <div className='title'>
                                    <img src={listIcon} alt='' className='icon' />
                                    <span>{sessionStorage.getItem('appName')}</span>
                                </div>
                            </div>
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
                this.props && typeVal == 0 ? // 全局
                    <div className='serviseBlock1'>
                        <BusinessAll />
                    </div>
                    : this.props && typeVal == 1 ? // 服务端
                        <div className='serviseBlock2'>
                            <BusinessApp NetItemId={NetItemId} networkData={networkData} />
                        </div> : <div className='serviseBlock3'> {/* 端到端 */}
                            <BusinessDToD/>
                        </div>
            }
        </div>);
    }
}

export default BusinessPage;