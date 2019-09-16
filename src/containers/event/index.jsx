import React, { Component } from 'react';
import { Tabs } from 'antd-mobile';
import { Input, Select, Button, Drawer, } from 'antd';
import { Icon } from 'antd-mobile';
import './index.scss';
import $ from 'jquery';
import axios from 'axios';
import EventTab from '../../components/tabs/eventTab/throughput';
import shaixuan from '../../images/shaixuan.svg';

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            top: 1,
            timeId: 0,
            activeId: null,
            typeId: null,
            tabs: [
                { title: '实时' },
                { title: '今日' },
                { title: '本周' },
                { title: '本月' },
            ],
            recvId: '',
            eventNameId: 0,//事件名称ID
            leftIndexId: 2,//导航栏index
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
            getEventName: [], //事件名称列表


            filterId: null,// 筛选时的id
            filterType: '', // 筛选时的type
            //筛选器的title
            eventSortName:'分类',
            eventRanKingName:'级别',
            eventStatusName:'状态',
            eventCrtlName:'操作',
            sourceDataName:'事件源',

            fullscreen: true,
            isIndeterminate: true,
            toggleCollapse: false,
            //有关于时间选项
            time: 6, // 页面初始时间
            timedata: ['最近两小时', '今日', '昨日', '本周', '本月', '本年', '历史至今'],
            data: [],
            //显示多少条
            showdata: 100,
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
    //抽屉开关
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    //筛选器的分类
    getEventSort=()=>{
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
    }
    //获取业务吞吐量数据
    getAxios = () => {
        setTimeout(() => {
            let leftIndexID = sessionStorage.getItem('leftIndexID') ? sessionStorage.getItem('leftIndexID') : this.state.leftIndexId;
            if (leftIndexID == 2) {
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
            }else if (leftIndexID == 3) {
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
          }
           
        }, 0)
    }
    //获取年月日
    gettime = (_tab, i) => {
        if (i === 0) {
            i = 6
        } else if (i === 1) {
            i = 1
        } else if (i === 2) {
            i = 2
        } else if (i === 3) {
            i = 3
        }

        this.setState({
            timeId: i,
            time: i,
            sourceDataId: null,
            eventTypeId: null,
            // status: location.state ? location.state.status? location.state.status: this.state.status : null,
            status: null,
            eventRankingId: null,
            eventCrtlId: null,
            eventSortId: null,
            eventStatus: null,
        }, () => {
            this.getAxios()
        })
    }
    UNSAFE_componentWillReceiveProps(props) {
        if (props.BusinessType == 0) {
            this.setState({
                eventTypeId: 0,
                pageNum: 1
            },()=>{
                this.getAxios();
            })
        } else if (props.BusinessType == 1) {
            this.setState({
                eventTypeId: 1,
                pageNum: 1
            },()=>{
                this.getAxios();
            })
        } else if (props.BusinessType == 2) {
            this.setState({
                eventTypeId: null,
                pageNum: 1
            },()=>{
                this.getAxios();
            })
        }
    }
    componentDidMount() {
        // this.test();
        this.getAxios();
        //this.heng();
        this.getEventSort();
    }
    resetData = () => {
        
        this.setState({
            shownum: 1,
            sourceDataId: null,
            eventTypeId: null,
            status: null,
            eventRankingId: null,
            eventCrtlId: null,
            eventSortId: null,
            eventStatus: null,
            eventSortName:'分类',
            eventRanKingName:'级别',
            eventStatusName:'状态',
            eventCrtlName:'操作',
            sourceDataName:'事件源',
        },()=>{
            this.getAxios();
        })
    }
    filterColumn = (e) => {
       var obj = e;
        if (obj !== null) {
            this.setState({
                filterId: obj.split('_')[0],
                filterType: obj.split('_')[1],
                 eventNameId: obj.split('_')[0]
            })
            setTimeout(() => {
                if (this.state.filterType === 'eventSortId') {
                   let newarr=this.state.getDcEventSort.filter(item => item.id==obj.split('_')[0])
                    this.setState({
                        eventSortId: this.state.filterId,
                        eventSortName:newarr[0].name,
                        pageNum: 1
                    })
                } else if (this.state.filterType === 'eventTypeId') {
                   // let newarr_1=this.state.getDcEventType.filter(item => item.id==obj.split('_')[0])
                    this.setState({
                        eventTypeId: this.state.filterId,
                        pageNum: 1
                    })
                } else if (this.state.filterType === 'eventRankingId') {
                    let newarr_2=this.state.getDcEventRanking.filter(item => item.id==obj.split('_')[0])
                    this.setState({
                        eventRankingId: this.state.filterId,
                        eventRanKingName:newarr_2[0].name,
                        pageNum: 1
                    })
                } else if (this.state.filterType === 'eventStatus') {
                    let newarr_3=this.state.getDcEventStatus.filter(item => item.id==obj.split('_')[0])
                    this.setState({
                        status: this.state.filterId,
                        eventStatusName:newarr_3[0].name,
                        pageNum: 1
                    })
                } else if (this.state.filterType === 'eventCrtlId') {
                    let newarr_4=this.state.getDcEventCrtl.filter(item => item.id==obj.split('_')[0])
                    this.setState({
                        eventCrtlId: this.state.filterId,
                        eventCrtlName:newarr_4[0].name,
                        pageNum: 1
                    })
                } else if (this.state.filterType === 'sourceDataId') {
                    let newarr_5=this.state.getEventAppNames.filter(item => item.id==obj.split('_')[0])
                    this.setState({
                        sourceDataId: this.state.filterId,
                        sourceDataName:newarr_5[0].name,
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
    filterEvent = (e) => {
        var obj = $(e.target).attr('value');
         if (obj !== null) {
             this.setState({
                 filterId: obj.split('_')[0],
                 filterType: obj.split('_')[1],
             })
             setTimeout(() => {
                 if (this.state.filterType === 'eventRankingId') {
                     this.setState({
                         eventRankingId: this.state.filterId,
                         pageNum: 1
                     })
                 } 
                 this.getAxios();
             })
         }
         else {
             this.getAxios();
         }
     }
    render() {
        const useBgNotice = '#FFE11C',
            useBgNormal = '#EA755F',
            useBgUrgent = '#EA7F5F',
            useBgurgentMost = '#DC172A';
        const InputGroup = Input.Group;
        const { Option } = Select;
        const { tabs, data, activeId, } = this.state;
        return (
            <div className='event-content'>
                <div className='tab-header'>
                    <div  className='tab-select'onClick={this.showDrawer}><p>筛选</p><img src={shaixuan}/></div>
                    <Drawer
                        width={'85%'}
                        onClose={this.onClose}
                        closable={false}
                        visible={this.state.visible}
                    >
                        <div className='drawerTitle'>
                            <div>
                                <Icon type='left' onClick={this.onClose} />
                            </div>
                            <div>筛选</div>
                            <div></div>
                        </div>
                        <p>条件</p>
                        <div className='inputGroup'>
                            <InputGroup compact>
                                <Select value={this.state.eventSortName} onChange={this.filterColumn}>
                                    {
                                        this.state.getDcEventSort.map((item, index) => (
                                            <Option key={index} value={item.id + '_' + item.idName} >{item.name}</Option>
                                        ))
                                    }
                                </Select>
                                <Select value={this.state.eventStatusName} onChange={this.filterColumn}>
                                    {
                                        this.state.getDcEventStatus.map((item, index) => (
                                            <Option key={index} value={item.id + '_' + item.idName} >{item.name}</Option>
                                        ))
                                    }
                                </Select>
                                <Select value={this.state.eventCrtlName} onChange={this.filterColumn}>
                                    {
                                        this.state.getDcEventCrtl.map((item, index) => (
                                            <Option key={index} value={item.id + '_' + item.idName} >{item.name}</Option>
                                        ))
                                    }
                                </Select>
                                <Select value={this.state.eventRanKingName} onChange={this.filterColumn} >
                                    {
                                        this.state.getDcEventRanking.map((item, index) => (
                                            <Option key={index} value={item.id + '_' + item.idName} >{item.name}</Option>
                                        ))
                                    }
                                </Select>
                                <Select value={this.state.sourceDataName} onChange={this.filterColumn} >
                                    {
                                        this.state.getEventAppNames.map((item, index) => (
                                            <Option key={index} value={item.id + '_' + item.idName+'_'+index} >{item.name}</Option>
                                        ))
                                    }
                                </Select>
                            </InputGroup>
                        </div>
                        <p>等级筛选</p>
                        <div className='color-box clear_float'>
                            <ul className='clear_float'> 
                                {
                                    this.state.getDcEventRanking.map((item, index) => (
                                        <li key={index} >
                                            {item.id === 1 ? <div className='smallbox' style={{ backgroundColor: useBgNotice }} value={item.id + '_' + item.idName} onClick={this.filterEvent}></div> : ''}
                                            {item.id === 2 ? <div className='smallbox' style={{ backgroundColor: useBgNormal }} value={item.id + '_' + item.idName} onClick={this.filterEvent}></div> : ''}
                                            {item.id === 3 ? <div className='smallbox' style={{ backgroundColor: useBgUrgent }} value={item.id + '_' + item.idName} onClick={this.filterEvent}></div> : ''}
                                            {item.id === 4 ? <div className='smallbox' style={{ backgroundColor: useBgurgentMost }} value={item.id + '_' + item.idName} onClick={this.filterEvent}></div> : ''}<p>{item.name}</p></li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className='sourceSeleBtn'>
                            <Button  onClick={() => {
                                 this.resetData();
                                 //this.onClose();
                            }}>重置</Button>
                            <Button  onClick={this.onClose}>确认</Button>
                        </div>
                    </Drawer>
                </div>

                <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} onChange={(tab, index) => this.gettime(tab, index)}>
                    {
                        tabs.map((_item, index) => {
                            return <div className='eventTab1' style={{ height: '100%', padding: '0px 10px 0px 10px' }} key={index}>
                                <div className='tab-cont'>
                                    { 
                                        data.map((data, index) => {
                                            return <div key={index} className='contBok' onClick={() => {
                                                sessionStorage.setItem('id', data.eventId)
                                                sessionStorage.setItem('activeId', activeId)
                                                sessionStorage.setItem('typeId', data.eventTypeId)
                                                sessionStorage.setItem('eventCrtlId', data.eventCrtlId)
                                                $('.eventTab').show();
                                                $('.eventTab').scrollTop = 0;
                                                $('.homePageHeader').hide();
                                                $('.footer').hide();
                                                $('.am-tabs-top').hide();
                                                $('.tab-header').hide();
                                                this.child.getdetailData();
                                            }}>
                                                {data.eventRankingId === 1 ? <div className='eventState' style={{ backgroundColor: useBgNotice }}>{data.eventStatus == 1 ? 'CLOSE' : 'OPEN'}</div> : ''}
                                                {data.eventRankingId === 2 ? <div className='eventState' style={{ backgroundColor: useBgNormal }}>{data.eventStatus == 1 ? 'CLOSE' : 'OPEN'}</div> : ''}
                                                {data.eventRankingId === 3 ? <div className='eventState' style={{ backgroundColor: useBgUrgent }}>{data.eventStatus == 1 ? 'CLOSE' : 'OPEN'}</div> : ''}
                                                {data.eventRankingId === 4 ? <div className='eventState' style={{ backgroundColor: useBgurgentMost }}>{data.eventStatus == 1 ? 'CLOSE' : 'OPEN'}</div> : ''}
                                                <div className='eventCont'>
                                                    <span className='eventID'>ID:{data.eventId}</span>
                                                    <span className='eventText'>{data.eventName}</span>
                                                    <span className={data.ctrl.name == "未查看" ? 'contColor' : 'handleState'}>{data.ctrl.name}</span>
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