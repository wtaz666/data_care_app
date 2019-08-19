import React, { Component } from 'react';
import $ from 'jquery'
import { SegmentedControl } from 'antd-mobile';
import { Button, Select } from 'antd';
import axios from 'axios';
import './index.scss'

class RegApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appList: [],
            nodeList: []
        }
    }
    showBox(e) {
        if (e == '端到端') {
            $('.nodeToApp').show()
        } else {
            $('.nodeToApp').hide()
        }
    }
    getAxios() {
        axios.get('/adminController/selectNodeIdList').then(res => {
            this.setState({
                nodeList: res.data,
            })
        })
        axios.get('/contrast/appnames').then(res => {
            this.setState({
                appList: res.data
            })
        })
    }
    goHomePage = () =>{
        $('.leadpage').show();
        $('.regpage').hide();
    }
    componentDidMount() {
        this.getAxios();
    }
    render() {
        const { appList, nodeList } = this.state;
        return (
            <div className='regBox'>
                <div className='regpage'>
                    <div className='bgBox'></div>
                    <div className='descBox'>
                        <h4>业务定制</h4>
                        <p>为了给您提供个性化的建议并计算您的数据，我们需要了解您经常需要查看的内容。</p>
                    </div>
                    <div className='areaBox'>
                        <p>您经常查看的<span>空间区域</span></p>
                        <div>
                            <SegmentedControl selectedIndex={0} values={['全局', '服务端', '端到端']} onValueChange={this.showBox} />
                            <div className='nodeToApp'>
                                <p>源</p>
                                <Select defaultValue="请选择" style={{ width: '50%' }} notFoundContent='无数据'>
                                    {
                                        nodeList.length>0 && nodeList.map((item, index) => {
                                            return <Select.Option key={index} id={item.id}>{item.name}</Select.Option>
                                        })
                                    }
                                </Select>
                                <p>目的</p>
                                <Select defaultValue="请选择" style={{ width: '50%' }} notFoundContent='无数据'>
                                    {
                                        appList.length>0 && appList.map((item, index) => {
                                            return <Select.Option key={index} id={item.source_data_id}>{item.res_name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className='regBtn'>
                        <Button type="primary" style={{ marginRight: '20px' }} className='goOutBtn' onClick={()=>{
                            $('.leadpage').show();
                            $('.regpage').hide();
                        }}>跳过</Button>
                        <Button icon="arrow-right" className='okBtn' onClick={this.goHomePage}>确定</Button>
                    </div>
                </div>
                
                <div className='leadpage'>
                    <div className='bgBox'></div>
                    <div className='descBox'>
                        <h4>业务定制成功</h4>
                        <p>现在，业务程序为您量身定制，准备好开始使用DATACARE吧！</p>
                    </div>
                    <div className='regBtn'>
                        <Button icon="arrow-left" className='goOutBtn' onClick={()=>{
                            window.location.href='/regapp'
                        }}>返回上级</Button>
                        <Button icon="arrow-right" className='okBtn' onClick={()=>{
                            window.location.href='/index'
                        }}>开始使用</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegApp;