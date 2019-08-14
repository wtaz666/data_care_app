import './index.less'
import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import loading from "../../images/loading1.gif";
import { Button, Pagination, Table, Input } from "element-react";

export default class DetailedList extends Component {
    constructor() {
        super();
        this.state = {
            recvId: '',
            sourceDataId: null,
            eventTypeId: null,
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
            // 控制展开收起
            listFlag1: false,
            listFlag2: false,
            listFlag3: false,
            listFlag4: false,
            listFlag5: false,
            listFlag6: false,
            activeId: 0 // 时间time
        }
    }

    // 获取时间
    gettime = (i, e) => {
        $('.timeTitleActive').removeClass('timeTitleActive');
        if ($(e.target.parentNode)[0].tagName === 'SPAN') {
            $(e.target).addClass('timeTitleActive');
        } else if ($(e.target.parentNode)[0].tagName === 'BUTTON') {
            $(e.target.parentNode).addClass('timeTitleActive');
        }
        if (i == 0) {
            i = 6
        } else if (i == 1) {
            i = 0
        } else if (i == 2) {
            i = 1
        } else if (i == 3) {
            i = 2
        } else if (i == 4) {
            i = 3
        } else if (i == 5) {
            i = 4
        } else if (i == 6) {
            i = 5
        }

        const { location } = this.props;
        this.setState({
            time: i,
            shownum: 1,
            datanum: 0,
            sourceDataId: null,
            eventTypeId: null,
            status: location.state ? location.state.status? location.state.status: this.state.status : null,
            eventRankingId: null,
            eventCrtlId: null,
            eventSortId: null
        }, () => {
            location.state = {
                id: null,
                type: null,
                timeType: null,
                rankId: null
            }
            this.getAxios()
        })
    };

    // 点击>展示列表
    showmList1 = (e) => {
        this.setState({
            listFlag1: !this.state.listFlag1,
            listFlag2: false,
            listFlag3: false,
            listFlag4: false,
            listFlag5: false,
            listFlag6: false
        })
        if ($(e.target).siblings('div').css.display = 'none') {
            $(e.target).siblings('div').css.display = 'block'
        } else {
            $(e.target).siblings('div').css.display = 'none'
        }
    }
    showmList2 = (e) => {
        this.setState({
            listFlag2: !this.state.listFlag2,
            listFlag1: false,
            listFlag3: false,
            listFlag4: false,
            listFlag5: false,
            listFlag6: false
        })
        if ($(e.target).siblings('div').css.display = 'none') {
            $(e.target).siblings('div').css.display = 'block'
        } else {
            $(e.target).siblings('div').css.display = 'none'
        }
    }
    showmList3 = (e) => {
        this.setState({
            listFlag3: !this.state.listFlag3,
            listFlag1: false,
            listFlag2: false,
            listFlag4: false,
            listFlag5: false,
            listFlag6: false
        })
        if ($(e.target).siblings('div').css.display = 'none') {
            $(e.target).siblings('div').css.display = 'block'
        } else {
            $(e.target).siblings('div').css.display = 'none'
        }
    }
    showmList4 = (e) => {
        this.setState({
            listFlag4: !this.state.listFlag4,
            listFlag1: false,
            listFlag2: false,
            listFlag3: false,
            listFlag5: false,
            listFlag6: false
        })
        if ($(e.target).siblings('div').css.display = 'none') {
            $(e.target).siblings('div').css.display = 'block'
        } else {
            $(e.target).siblings('div').css.display = 'none'
        }
    }
    showmList5 = (e) => {
        this.setState({
            listFlag5: !this.state.listFlag5,
            listFlag1: false,
            listFlag2: false,
            listFlag3: false,
            listFlag4: false,
            listFlag6: false
        })
        if ($(e.target).siblings('div').css.display = 'none') {
            $(e.target).siblings('div').css.display = 'block'
        } else {
            $(e.target).siblings('div').css.display = 'none'
        }
    }
    showmList6 = (e) => {
        this.setState({
            listFlag6: !this.state.listFlag6,
            listFlag1: false,
            listFlag2: false,
            listFlag3: false,
            listFlag4: false,
            listFlag5: false
        })
        if ($(e.target).siblings('div').css.display = 'none') {
            $(e.target).siblings('div').css.display = 'block'
        } else {
            $(e.target).siblings('div').css.display = 'none'
        }
    }

    // 点击'重置'
    resetData = () => {
        const { location } = this.props;
        location.state = {}
        this.setState({
            shownum: 1,
            sourceDataId: null,
            eventTypeId: null,
            status: null,
            eventRankingId: null,
            eventCrtlId: null,
            eventSortId: null
        })
        this.getAxios();
    }

    // 表格数据
    test() {
        const { location } = this.props;
        this.setState({
            activeId: location.state ? location.state.timeType + 1 : 0,
            sourceDataId: location.state ? location.state.id : this.state.sourceDataId,
            eventTypeId: location.state ? location.state.type : this.state.eventTypeId,
            eventRankingId: location.state ? location.state.rankId : this.state.eventRankingId,
            status: location.state ? location.state.status : this.state.status,
            time: location.state ? location.state.timeType : this.state.time
            // time: location.state && (this.state.time !== location.state.timeType) ? location.state.timeType : this.state.time
        })
    }

    // 筛选列表内容
    filterColumn = (e) => {
        $(e.target).parent('div').hide();
        var obj = $(e.target).attr('value');
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

    // 获取数据
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

    // 点击列表其他内容收起列表
    heng = () => {
        $(".el-icon-arrow-down").click(function (e) {
            $(".canFloatList").show();
            e.stopPropagation();//阻止冒泡
        });
        $(document).click(function (e) {
            $(".canFloatList").hide();
            e.stopPropagation();
        });
    }


    componentDidMount() {
        this.test();
        this.getAxios();
        this.heng();
    }

    render() {
        let styleObj = {
            paddingLeft: this.state.isCollapse ? "0" : "2.1rem",
        };
        let styleObj1 = {
            paddingLeft: this.state.isCollapse ? "0rem" : "2.05rem",
            backgroundColor: 'rgb(82, 108, 255)'
        };
        const { listFlag1, listFlag2, listFlag3, listFlag4, listFlag5, listFlag6, activeId } = this.state;
        return (
            <div className='eventList'>
              
                <div className="inner_bar" style={styleObj1}>
                    <div className="bar_group clearfix">
                       
                        <div className="date fr">
                            <span className="wrapper">
                                {
                                    this.state.timedata.map((tab, i) =>
                                        <Button key={i}
                                            onClick={this.gettime.bind(this, i)}
                                            className={i === activeId ? 'timeTitleActive' : ''}
                                        >
                                            {tab}
                                        </Button>
                                    )
                                }
                            </span>
                        </div>
                    </div>
                </div>
                {/* 事件列表 */}
                <div className='eventPageList' style={styleObj}>
                    <div className='eventPageContList'>
                        <div className="main_list">
                            {/* 自己写的表头 */}
                            {
                                this.state.fullscreen ? '' : <ul className='eventTableHead'>
                                    <li>事件ID</li>
                                    <li>事件源 <i className="el-icon-arrow-down" onClick={this.showmList1}></i>
                                        {
                                            listFlag1 ? <div className='canFloatList'>
                                                {
                                                    this.state.getEventAppNames.map((item, index) => (
                                                        <p key={index} value={item.id + '_' + item.idName} onClick={this.filterColumn}>{item.name}</p>
                                                    ))
                                                }
                                            </div> : ''}
                                    </li>
                                    <li>事件名称</li>
                                    {/* <li>事件分类 <i className="el-icon-arrow-down" onClick={this.showmList2}></i>
                                        {
                                            listFlag2 ? <div className='canFloatList'>
                                                {
                                                    this.state.getDcEventSort.map((item, index) => (
                                                        <p key={index} value={item.id + '_' + item.idName} onClick={this.filterColumn}>{item.name}</p>
                                                    ))
                                                }
                                            </div> : ''}
                                    </li> */}
                                    <li>事件级别 <i className="el-icon-arrow-down" onClick={this.showmList3}></i>
                                        {
                                            listFlag3 ? <div className='canFloatList'>
                                                {
                                                    this.state.getDcEventRanking.map((item, index) => (
                                                        <p key={index} value={item.id + '_' + item.idName} onClick={this.filterColumn}>{item.name}</p>
                                                    ))
                                                }
                                            </div> : ''}
                                    </li>
                                    <li>类型 <i className="el-icon-arrow-down" onClick={this.showmList4}></i>
                                        {
                                            listFlag4 ? <div className='canFloatList'>
                                                {
                                                    this.state.getDcEventType.map((item, index) => (
                                                        <p key={index} value={item.id + '_' + item.idName} onClick={this.filterColumn}>{item.name}</p>
                                                    ))
                                                }
                                            </div> : ''}
                                    </li>
                                    <li>触发时间</li>
                                    <li>关闭时间</li>
                                    <li>事件状态 <i className="el-icon-arrow-down" onClick={this.showmList5}></i>
                                        {
                                            listFlag5 ? <div className='canFloatList'>
                                                {
                                                    this.state.getDcEventStatus.map((item, index) => (
                                                        <p key={index} value={item.id + '_' + item.idName} onClick={this.filterColumn}>{item.name}</p>
                                                    ))
                                                }
                                            </div> : ''}
                                    </li>
                                    <li>操作状态 <i className="el-icon-arrow-down" onClick={this.showmList6}></i>
                                        {
                                            listFlag6 ? <div className='canFloatList'>
                                                {
                                                    this.state.getDcEventCrtl.map((item, index) => (
                                                        <p key={index} value={item.id + '_' + item.idName} onClick={this.filterColumn}>{item.name}</p>
                                                    ))
                                                }
                                            </div> : ''}
                                    </li>
                                </ul>
                            }
                            {
                                this.state.fullscreen ? <img src={loading} /> :
                                    <Table
                                        style={{ width: '100%' }}
                                        filterMultiple={false}
                                        columns={
                                            [
                                                {
                                                    label: "",
                                                    prop: "eventId",
                                                    minWidth: '60',
                                                    align: 'left'
                                                },
                                                {
                                                    label: "",
                                                    prop: "resName",
                                                    minWidth: '145',
                                                    align: 'left'
                                                },
                                                {
                                                    label: "",
                                                    prop: "eventName",
                                                    minWidth: '145',
                                                    align: 'left'
                                                },
                                                // {
                                                //     label: "",
                                                //     prop: 'sort[name]',
                                                //     minWidth: '100',
                                                //     align: 'left',
                                                //     render: (data) => {
                                                //         if (data.sort.name == "异常事件") {
                                                //             return <span>{data.sort.name}</span>
                                                //         } else if (data.sort.name == "故障或服务无效事件") {
                                                //             return <span>{data.sort.name}</span>
                                                //         } else if (data.sort.name == "显著性差异事件") {
                                                //             return <span>{data.sort.name}</span>
                                                //         } else if (data.sort.name == "服务脆弱点事件") {
                                                //             return <span>{data.sort.name}</span>
                                                //         } else if (data.sort.name == "非常规访问流量事件") {
                                                //             return <span>{data.sort.name}</span>
                                                //         }
                                                //     }
                                                // },
                                                {
                                                    label: "",
                                                    prop: "tag",
                                                    minWidth: '85',
                                                    align: 'left',
                                                    render: (data) => {
                                                        if (data.ranking.name == '提示') {
                                                            return <span>{data.ranking.name}</span>
                                                        } else if (data.ranking.name == '一般') {
                                                            return <span>{data.ranking.name}</span>
                                                        } else if (data.ranking.name == '紧急') {
                                                            return <span>{data.ranking.name}</span>
                                                        } else if (data.ranking.name == '非常紧急') {
                                                            return <span>{data.ranking.name}</span>
                                                        }
                                                    }
                                                },
                                                {
                                                    label: "",
                                                    prop: "type[name]",
                                                    minWidth: '80',
                                                    align: 'left',
                                                    render: (data) => {
                                                        if (data.type.id == 1) {
                                                            return <span>{data.type.name}</span>
                                                        } else if (data.type.id == 2) {
                                                            return <span>{data.type.name}</span>
                                                        } else if (data.type.id == 3) {
                                                            return <span>{data.type.name}</span>
                                                        } else if (data.type.id == 4) {
                                                            return <span>{data.type.name}</span>
                                                        }
                                                    }
                                                }, {
                                                    label: "",
                                                    prop: "startTime",
                                                    minWidth: '120',
                                                    align: 'left'
                                                },
                                                {
                                                    label: "",
                                                    prop: "endTime",
                                                    minWidth: '120',
                                                    align: 'left'
                                                }, {
                                                    label: "",
                                                    prop: "eventStatus",
                                                    minWidth: '85',
                                                    align: 'left',
                                                    render: (data) => {
                                                        if (data.eventStatus == 1) {
                                                            return <span>CLOSED</span>
                                                        } else if (data.eventStatus == 0) {
                                                            return <span>OPEN</span>
                                                        }
                                                    }
                                                },
                                                {
                                                    label: "",
                                                    prop: "eventCrtlId",
                                                    minWidth: '80',
                                                    align: 'left',
                                                    render: (data) => {
                                                        if (data.ctrl.name == "已关闭") {
                                                            return <Link to={{ pathname: '/main/eventDetail', state: { id: data.eventId, activeId: this.state.activeId, typeId: data.eventTypeId, eventCrtlId: data.eventCrtlId } }} replace>
                                                                <Button type="text" style={{ width: '80px',textAlign:'center', color: '#fff', padding: '6px 0px', backgroundColor: 'rgb(228, 228, 228)' }}>
                                                                    {data.ctrl.name}</Button>
                                                            </Link>
                                                        } else if (data.ctrl.name == "未查看") {
                                                            return <Link to={{ pathname: '/main/eventDetail', state: { id: data.eventId, activeId: this.state.activeId, typeId: data.eventTypeId, eventCrtlId: data.eventCrtlId } }}>
                                                                <Button type="text" style={{ width: '80px',textAlign:'center', color: '#fff', padding: '6px 0px', backgroundColor: 'rgb(82, 108, 255)' }}>
                                                                    {data.ctrl.name}
                                                                </Button>
                                                            </Link>
                                                        } else if (data.ctrl.name == "未关闭") {
                                                            return <Link to={{ pathname: '/main/eventDetail', state: { id: data.eventId, activeId: this.state.activeId, typeId: data.eventTypeId, eventCrtlId: data.eventCrtlId } }}>
                                                                <Button type="text" style={{ width: '80px',textAlign:'center', color: '#fff', padding: '6px 0px', backgroundColor: 'rgb(82, 108, 255)' }}>
                                                                    {data.ctrl.name}
                                                                </Button>
                                                            </Link>
                                                        } else if (data.ctrl.name == "强制关闭") {
                                                            return <Link to={{ pathname: '/main/eventDetail', state: { id: data.eventId, activeId: this.state.activeId, typeId: data.eventTypeId, eventCrtlId: data.eventCrtlId } }}>
                                                                <Button type="text" style={{ width: '80px',textAlign:'center', color: '#fff', padding: '6px 0px', backgroundColor: 'rgb(228, 228, 228)' }}>
                                                                    {data.ctrl.name}
                                                                </Button>
                                                            </Link>
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                        border={false}
                                        stripe={true}
                                        data={this.state.data}
                                        emptyText={this.state.data.length == 0?'暂无数据':'数据正在加载中...'}
                                    />
                            }
                            <div className="clearfix">
                                <div className="fr paginationStyle">
                                    <Pagination
                                        layout="total, sizes, prev, pager, next, jumper"
                                        total={this.state.datanum}
                                        pageSizes={[10, 20, 30, 40]}
                                        pageSize={this.state.showdata}
                                        currentPage={this.state.shownum}
                                        onSizeChange={(num) => {
                                            this.a(num)
                                        }}
                                        onCurrentChange={(currentPage) => {
                                            this.b(currentPage)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
