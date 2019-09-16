import React, { Component } from 'react';
import { Tabs } from 'antd-mobile';
import './index.scss';
import $ from 'jquery';
import axios from 'axios';
import InformTab from '../../components/tabs/informTab/throughput';
class Inform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [
                { title: '已读' },
                { title: '未读' },
            ],
            leftIndexId: 2,//导航栏index
            data: [],
            data2: [],
            eventCrtlId: 3,
        }
    }
    //获取已读的数据和未读的数据
    getInformType = (_tab, i) => {
        if (i === 0) {
            this.setState({
                eventCrtlId: 3,
                pageNum: 1
            }, () => {
                if (this.props.LeftIndex == 2) {
                    this.getAxios();
                } else if (this.props.LeftIndex == 3) {
                    this.getAxios();
                } else if (this.props.LeftIndex == 4) {
                    this.getAxios();
                }
            })
        } else if (i === 1) {
            this.setState({
                eventCrtlId: 2,
                pageNum: 1
            }, () => {
                if (this.props.LeftIndex == 2) {
                    this.getAxios();
                } else if (this.props.LeftIndex == 3) {
                    this.getAxios();
                } else if (this.props.LeftIndex == 4) {
                    this.getAxios();
                }
            })
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        if (props.LeftIndex == 2) {
            this.getAxios();
        } else if (props.LeftIndex == 3) {
            this.getAxios();
        } else if (props.LeftIndex == 4) {
            this.getAxios();
        }
    }
    //获取业务吞吐量的通知
    getAxios = () => {
        axios.get('/event/getDcEvents', {
            params: {
                eventCrtlId: this.state.eventCrtlId,
                webTimeType: 1,
            }
        }).then(res => {
            let alldata1 = res.data.list;
            axios.get('/event/getDcEvents', {
                params: {
                    eventCrtlId: this.state.eventCrtlId,
                    webTimeType: 6,
                }
            }).then(res => {
                let alldata2 = res.data.list;
                let alldata = [...alldata1, ...alldata2].sort(function (a, b) {
                    return a.name > b.name;
                });
                if (alldata.length > 0) {
                    this.setState({
                        fullscreen: false,
                        data: alldata,
                        datanum: res.data.total
                    })
                } else {
                    this.setState({
                        fullscreen: false,
                        data: [],
                        datanum: 0
                    })
                }
            })
        })
    }
    componentDidMount() {
        this.getAxios()
    }
    render() {
        const { tabs, } = this.state;
        return (
            <div className='inform-content'>
                <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} onChange={(tab, index) => this.getInformType(tab, index)}>
                    {tabs.map((_item, index) => {
                        return <div style={{ height: '100%', padding: '10px' }} key={index}>
                            {
                                this.state.data.map((item, index) => (
                                    <div className='informNews' key={index}
                                        onClick={() => {
                                            sessionStorage.setItem('id', item.eventId)
                                            // sessionStorage.setItem('activeId', activeId)
                                            sessionStorage.setItem('typeId', item.eventTypeId)
                                            sessionStorage.setItem('eventCrtlId', item.eventCrtlId)
                                            $('.informTab').show();
                                            $('.homePageHeader').hide();
                                            $('.footer').hide();
                                            $('.am-tabs-top').hide();
                                            this.child.getdetailData();

                                        }}>
                                        <div className='informNews-left'>紧急</div>
                                        <div className='informNews-right'>
                                            <b>故障通知</b>
                                            <i></i>
                                            <p>北京市幼升小管理系统应用访问量波动较大，发生
                                                    时间{item.endTime}</p>
                                        </div>
                                    </div>

                                ))
                            }
                            {
                                this.state.data2.map((item, index) => (
                                    <div className='informNews' key={index}>
                                        <div className='informNews-left'>紧急</div>
                                        <div className='informNews-right'>
                                            <b>故障通知</b>
                                            <i></i>
                                            <p>北京市幼升小管理系统应用访问量波动较大，发生
                                                    时间{item.endTime}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    })
                    }
                </Tabs>
                <div className='informTab'>
                    <InformTab ref={r => this.child = r} />
                </div>
            </div>
        );
    }
}
export default Inform;