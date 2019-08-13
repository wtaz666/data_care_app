import React, { Component } from 'react';
import { Tabs } from 'antd-mobile';
import { Input, Select } from 'antd';
import './index.scss';
import $ from 'jquery';
import axios from 'axios';
import EventTab from '../../components/tabs/eventTab/throughput';

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeId: 0,
            activeId:null,
            typeId:null,
            tabs: [
                { title: '实时' },
                { title: '今日' },
                { title: '本周' },
                { title: '本月' },
                { title: `具体时间` },
            ],
            recvId: '',
            sourceDataId: null,
            eventSortId: null,
            eventRankingId: null, // 事件等级
            eventCrtlId: null, // 操作状态
            eventTypeId: null, // 事件类型
            status: null,

            getDcEventSort: [], // 事件分类列表
            getDcEventRanking: [], // 事件级别列表
            getDcEventType: [], // 类型列表
            getDcEventStatus: [], // 事件状态
            getDcEventCrtl: [], // 操作列表
            getEventAppNames: [],//事件源列表

            filterId: null,// 筛选时的id
            filterType: '', // 筛选时的type

            fullscreen: true,
            isIndeterminate: true,
            toggleCollapse: false,
            //有关于时间选项
            time: 6, // 页面初始时间
            timedata: ['最近两小时', '今日', '昨日', '本周', '本月', '本年', '历史至今'],
            data: [],
            //显示多少条
            showdata: 10,
            //当前显示的第几页
            shownum: 1,
            //不会变的总条数
            Unchangednum: 0,
            //总条数
            datanum: 0,
            //总的分页数
            totalnum: 2,
            id: 0,
            activeId: 0 // 时间time
        }

    }
    //获取数据
    getAxios = () => {
        setTimeout(() => {
            // 1.列表数据
            axios.get('/event/getDcEvents', {
                params: {
                    webTimeType: this.state.time,
                    pageSize: this.state.showdata,
                    pageNum: this.state.shownum,
                    sourceDataId: this.state.sourceDataId,
                    eventTypeId: this.state.eventTypeId,
                    eventStatus: this.state.status,
                    eventSortId: this.state.eventSortId,
                    eventRankingId: this.state.eventRankingId,
                    eventCrtlId: this.state.eventCrtlId
                }
            }).then(res => {
                let alldata = res.data.list;
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
            // 2.事件分类
            axios.get('/event/getDcEventSort').then(res => {
                this.setState({
                    getDcEventSort: res.data
                })
            })

            // 3.事件级别
            axios.get('/event/getDcEventRanking').then(res => {
                this.setState({
                    getDcEventRanking: res.data
                })
            })

            // 4.类型列表
            axios.get('/event/getDcEventType').then(res => {
                this.setState({
                    getDcEventType: res.data
                })
            })

            // 5.事件状态
            axios.get('/event/getDcEventStatus').then(res => {
                this.setState({
                    getDcEventStatus: res.data
                })
            })

            // 6.操作列表
            axios.get('/event/getDcEventCrtl').then(res => {
                this.setState({
                    getDcEventCrtl: res.data
                })
            })
            // 7. 事件源列表
            axios.get('/event/getEventAppNames').then(res => {
                this.setState({
                    getEventAppNames: res.data
                })
            })
        }, 0)

    }
    //获取年月日
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
        const { location } = this.props;
        this.setState({
            timeId: i,
            time: i,
            sourceDataId: null,
            eventTypeId: null,
           // status: location.state ? location.state.status? location.state.status: this.state.status : null,
            status:null,
            eventRankingId: null,
            eventCrtlId: null,
            eventSortId: null,
            eventStatus: null,   
        }, () => {
            /*location.state = {
                id: null,
                type: null,
                timeType: null,
                rankId: null
            }*/
            this.getAxios()
        })
    }
    componentDidMount() {
       // this.test();
        this.getAxios();
        //this.heng();
    }
    filterColumn = (e) => {
        var obj = e;
        if (obj !== null) {
            this.setState({
                filterId: obj.split('_')[0],
                filterType: obj.split('_')[1]
            })
            setTimeout(() => {
                if (this.state.filterType === 'eventSortId') {
                    this.setState({
                        eventSortId: this.state.filterId,
                        pageNum: 1
                    })
                } else if (this.state.filterType === 'eventTypeId') {
                    this.setState({
                        eventTypeId: this.state.filterId,
                        pageNum: 1
                    })
                } else if (this.state.filterType === 'eventRankingId') {
                    this.setState({
                        eventRankingId: this.state.filterId,
                        pageNum: 1
                    })
                } else if (this.state.filterType === 'eventStatus') {
                    this.setState({
                        status: this.state.filterId,
                        pageNum: 1
                    })
                } else if (this.state.filterType === 'eventCrtlId') {
                    this.setState({
                        eventCrtlId: this.state.filterId,
                        pageNum: 1
                    })
                } else if (this.state.filterType === 'sourceDataId') {
                    this.setState({
                        sourceDataId: this.state.filterId,
                        pageNum: 1
                    })
                }
                // this.test();
                this.getAxios();
            })
        }
        else {
            // this.test();
            this.getAxios();
        }
    }

    render() {
        const InputGroup = Input.Group;
        const { Option } = Select;
        const { tabs,data,activeId,} = this.state;
        return (
            <div className='event-content'>
                <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} onChange={(tab, index) => this.gettime(tab, index)}>
                    {
                        tabs.map((item, index) => {
                            return <div style={{ height: '100%', padding: '10px' }} key={index}>
                                <div className='tab-header'>
                                    <div className='inputGroup'>
                                        <InputGroup compact>
                                            <Select defaultValue="名称"value={"名称"}onChange={this.filterColumn}>
                                                {
                                                    this.state.getDcEventSort.map((item, index) => (
                                                        <Option key={index} value={item.id + '_' + item.idName}>{item.name}</Option>
                                                    ))
                                                }
                                            </Select>
                                            <Select defaultValue="状态" value={"状态"}onChange={this.filterColumn}>
                                                {
                                                    this.state.getDcEventStatus.map((item, index) => (
                                                        <Option key={index} value={item.id + '_' + item.idName} >{item.name}</Option>
                                                    ))
                                                }
                                            </Select>
                                            <Select defaultValue="操作"value={"操作"} onChange={this.filterColumn}>
                                                {
                                                    this.state.getDcEventCrtl.map((item, index) => (
                                                        <Option key={index} value={item.id + '_' + item.idName}>{item.name}</Option>
                                                    ))
                                                }
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
                                <div className='tab-cont'>
                                   { 
                                       data.map((data, index) =>{
                                        return  <div key={index} className='contBok' onClick={() => {
                                                sessionStorage.setItem('id', data.eventId)
                                                sessionStorage.setItem('activeId', activeId)
                                                sessionStorage.setItem('typeId', data.eventTypeId)
                                                sessionStorage.setItem('eventCrtlId', data.eventCrtlId)
                                                $('.eventTab').show();
                                                $('.homePageHeader').hide();
                                                $('.footer').hide();
                                                $('.am-tabs-top').hide();   
                                                this.child.getdetailData();  
                                             
                                        }}>
                                            <div className={data.ctrl.name == "未查看"?'eventState':'color1'}>{data.eventStatus == 1?'CLOSE':'OPEN'}</div>
                                            <div className='eventCont'>
    
                                                <span className='eventID'>ID:{data.eventId}</span>
                                                <span className='eventText'>{data.eventName}</span>
    
                                                <span className={data.ctrl.name == "未查看"?'contColor':'handleState'}>{data.ctrl.name}</span>
                                            </div>
                                        </div>
                                        })
                                   }
                                   
                                        
                                </div>
                            </div>
                        })
                    }
                </Tabs>
                <div className='eventTab'>
                    <EventTab ref={r => this.child = r} />
                </div>
            

            </div>

        );
    }
}

export default Event;