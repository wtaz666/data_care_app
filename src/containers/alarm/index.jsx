import React, { Component } from 'react';
import { Tabs } from 'antd-mobile';
import { Input, Select } from 'antd';
import './index.scss';
import $ from 'jquery';
import axios from 'axios';
class Alarm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [
                { title: '全部' },
                { title: '告警' },
                { title: '预警' },
                { title: '异常' },
                { title: '故障' },
            ],
        }

    }
    render() {
        const InputGroup = Input.Group;
        const { Option } = Select;
        const { tabs, } = this.state;
        return (
            <div className='alarm-content'>
                <div className='tab-header'>
                    <div className='inputGroup'>
                        <InputGroup compact>
                            <Select defaultValue="状态" value={"状态"} >
                                <Option value='全部'>全部</Option>
                                <Option value='持续警报'>持续警报</Option>
                                <Option value='警报解除'>警报解除</Option>
                            </Select>
                        </InputGroup>
                    </div>
                    <div className='color-box'>
                        <span className='smallbox'></span>
                        <span className='smallbox'></span>
                        <span className='smallbox'></span>
                        <span className='smallbox'></span>
                    </div>
                </div>
                <Tabs tabs={tabs} initialPage={0} animated={false}  swipeable={false} useOnPan={true}>
                    {
                        tabs.map((_item, index) => {
                            return <div style={{ height: '100%', padding: '0px 10px 0px 10px' }} key={index}>
                                <div className='alarmNews'>
                                    <div className='alarmNews-left'><div className='circle'>持续</div></div>
                                    <div className='alarmNews-right'>
                                        <div className='content-top'><b>故障</b>
                                            <p>北京市幼升小管理系统</p></div>
                                        <div className='content-bottom'><ul>
                                            <li>内容：应用访问量波动较大</li>
                                            <li>开始时间：2019-8-7-12:35:26</li>
                                            <li>解除时间：2019-8-7-12:35:26</li></ul></div>
                                    </div>
                                </div>
                                <div className='alarmNews'>
                                    <div className='alarmNews-left'><div className='circle'>持续</div></div>
                                    <div className='alarmNews-right'>
                                        <div className='content-top'><b>故障</b>
                                            <p>北京市幼升小管理系统</p></div>
                                        <div className='content-bottom'><ul>
                                            <li>内容：应用访问量波动较大</li>
                                            <li>开始时间：2019-8-7-12:35:26</li>
                                            <li>解除时间：2019-8-7-12:35:26</li></ul></div>
                                    </div>
                                </div>
                                <div className='alarmNews'>
                                    <div className='alarmNews-left'><div className='circle'>持续</div></div>
                                    <div className='alarmNews-right'>
                                        <div className='content-top'><b>故障</b>
                                            <p>北京市幼升小管理系统</p></div>
                                        <div className='content-bottom'><ul>
                                            <li>内容：应用访问量波动较大</li>
                                            <li>开始时间：2019-8-7-12:35:26</li>
                                            <li>解除时间：2019-8-7-12:35:26</li></ul></div>
                                    </div>
                                </div>
                                <div className='alarmNews'>
                                    <div className='alarmNews-left'><div className='circle'>持续</div></div>
                                    <div className='alarmNews-right'>
                                        <div className='content-top'><b>故障</b>
                                            <p>北京市幼升小管理系统</p></div>
                                        <div className='content-bottom'><ul>
                                            <li>内容：应用访问量波动较大</li>
                                            <li>开始时间：2019-8-7-12:35:26</li>
                                            <li>解除时间：2019-8-7-12:35:26</li></ul></div>
                                    </div>
                                </div>
                                <div className='alarmNews'>
                                    <div className='alarmNews-left'><div className='circle'>持续</div></div>
                                    <div className='alarmNews-right'>
                                        <div className='content-top'><b>故障</b>
                                            <p>北京市幼升小管理系统</p></div>
                                        <div className='content-bottom'><ul>
                                            <li>内容：应用访问量波动较大</li>
                                            <li>开始时间：2019-8-7-12:35:26</li>
                                            <li>解除时间：2019-8-7-12:35:26</li></ul></div>
                                    </div>
                                </div>
                                <div className='alarmNews'>
                                    <div className='alarmNews-left'><div className='circle'>持续</div></div>
                                    <div className='alarmNews-right'>
                                        <div className='content-top'><b>故障</b>
                                            <p>北京市幼升小管理系统</p></div>
                                        <div className='content-bottom'><ul>
                                            <li>内容：应用访问量波动较大</li>
                                            <li>开始时间：2019-8-7-12:35:26</li>
                                            <li>解除时间：2019-8-7-12:35:26</li></ul></div>
                                    </div>
                                </div>
                            </div>


                        })
                    }
                </Tabs>
            </div>
        );
    }
}

export default Alarm;