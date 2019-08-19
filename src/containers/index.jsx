import React, { Component } from 'react';
import $ from 'jquery';
import { Icon, Button, Drawer } from 'antd-mobile';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Home from 'containers/home';
import Event from 'containers/event';
import headImg from 'images/headImg.png';
import menuIcon from 'images/menu.svg'
import SerivePage from 'containers/pages/serviesPage.jsx'
import BusinessPage from 'containers/pages/businessPage.jsx'
import SourceType from '../components/selectType/sourceType';
import AppType from '../components/selectType/appType';
import BusinessType from '../components/selectType/businessType';

// leftIcons
import sourceNor from '../images/leftIcons/source_normal.svg';
import sourceClick from '../images/leftIcons/source_click.svg';
import serviesNor from '../images/leftIcons/servies_normal.svg';
import serviesClick from '../images/leftIcons/servies_click.svg';
import businessNor from '../images/leftIcons/business_normal.svg';
import businessClick from '../images/leftIcons/business_click.svg';
import appNor from '../images/leftIcons/app_normal.svg';
import appClick from '../images/leftIcons/app_click.svg';
import userNor from '../images/leftIcons/user_normal.svg';
import userClick from '../images/leftIcons/user_click.svg';
import elseNor from '../images/leftIcons/else_normal.svg';
import elseClick from '../images/leftIcons/else_click.svg';

// footer
import homeNor from '../images/footerIcons/home_normal.svg';
import homeClick from '../images/footerIcons/home_click.svg';
import thingNor from '../images/footerIcons/thing_normal.svg';
import thingClick from '../images/footerIcons/thing_click.svg';
import informNor from '../images/footerIcons/inform_normal.svg';
import informClick from '../images/footerIcons/inform_click.svg';
import alarmNor from '../images/footerIcons/alarm_normal.svg';
import alarmClick from '../images/footerIcons/alarm_click.svg';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftList: [
                {
                    img: sourceNor,
                    clickImg: sourceClick,
                    name: '资源注册状态'
                }, {
                    img: serviesNor,
                    clickImg: serviesClick,
                    name: '服务在线'
                }, {
                    img: businessNor,
                    clickImg: businessClick,
                    name: '业务吞吐量'
                }, {
                    img: appNor,
                    clickImg: appClick,
                    name: '应用处理性能'
                }, {
                    img: userNor,
                    clickImg: userClick,
                    name: '客户体验'
                }, {
                    img: elseNor,
                    clickImg: elseClick,
                    name: '其他'
                }
            ],
            sourcefooter: [
                {
                    img: homeNor,
                    clickImg: homeClick,
                    name: '动态'
                }
            ],
            serviesfooter: [
                {
                    img: homeNor,
                    clickImg: homeClick,
                    name: '动态'
                }
            ],
            businessfooter: [
                {
                    img: homeNor,
                    clickImg: homeClick,
                    name: '动态'
                }, {
                    img: thingNor,
                    clickImg: thingClick,
                    name: '事件'
                }, {
                    img: informNor,
                    clickImg: informClick,
                    name: '通知'
                }, {
                    img: alarmNor,
                    clickImg: alarmClick,
                    name: '报警'
                }
            ],
            appfooter: [
                {
                    img: homeNor,
                    clickImg: homeClick,
                    name: '动态'
                }, {
                    img: thingNor,
                    clickImg: thingClick,
                    name: '事件'
                }, {
                    img: informNor,
                    clickImg: informClick,
                    name: '通知'
                }, {
                    img: alarmNor,
                    clickImg: alarmClick,
                    name: '报警'
                }
            ],
            userfooter: [
                {
                    img: homeNor,
                    clickImg: homeClick,
                    name: '动态'
                }, {
                    img: thingNor,
                    clickImg: thingClick,
                    name: '事件'
                }, {
                    img: informNor,
                    clickImg: informClick,
                    name: '通知'
                }, {
                    img: alarmNor,
                    clickImg: alarmClick,
                    name: '报警'
                }
            ],
            title: '业务吞吐量',
            leftIndex: 2,
            typeVal: 0,
            AppItemId: 0,
            NetItemId: 0,
            open: false,
            selectData: [],
            networkData: [],
            kpiId: null,
            footerIndex: 0,
            businessData: []
        }
    }
    tabFoot = (i, e) => {
        this.setState({
            footerIndex: i
        })
        if (i === 0) {
            $('.div1').show();
            $('.div2').hide();
            $('.div3').hide();
            $('.div4').hide();
        } else if (i === 1) {
            $('.div1').hide();
            $('.div2').show();
            $('.div3').hide();
            $('.div4').hide();
        } else if (i === 2) {
            $('.div1').hide();
            $('.div2').hide();
            $('.div3').show();
            $('.div4').hide();
        } else if (i === 3) {
            $('.div1').hide();
            $('.div2').hide();
            $('.div3').hide();
            $('.div4').show();
        } else if (i === 4) {
            $('.div1').hide();
            $('.div2').hide();
            $('.div3').hide();
            $('.div4').hide();
        }
    }
    tabTitle = (title, i) => {
        this.setState({
            title,
            leftIndex: i,
            typeVal: 0,
            ind: 0,
            open: !this.state.open
        }, () => {
            if (this.state.leftIndex == 0) {
                this.sourceAxios();
            }if (this.state.leftIndex == 1) {
                this.serviesApp();
            }
        })
    }
    onOpenChange = () => {
        this.setState({ open: !this.state.open });
    }
    getTypeVal(res) {// 将传递来的值赋值给this.state中的值
        this.setState({
            typeVal: res.typeVal,
            AppItemId: res.AppItemId,
            NetItemId: res.NetItemId,
        })
    }
    // 资源接口
    sourceAxios() {
        axios.get('/kpiDing/resourceAppTableSort', {
            params: {
                timeStart: this.state.pickerTime,
                isUp: 0,
                kpiId: this.state.kpiId,
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            }
        }).then(res => {
            let data = res.data.page.list;
            this.setState({
                selectData: data
            }, () => {
                if (this.state.selectData.length > 0) {
                    sessionStorage.setItem('AppItemId', this.state.AppItemId == 0 ? this.state.selectData[0].id : this.state.AppItemId)
                    sessionStorage.setItem('appName', this.state.appName ? this.state.selectData[0].name : this.state.appName)
                }

            })
        })

        axios.get('/kpiDing/resourceHostTableSort', {
            params: {
                timeStart: this.state.pickerTime,
                isUp: 0,
                kpiId: this.state.kpiId,
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            }
        }).then(res => {
            if (res.data.page) {
                let data = res.data.page.list;
                this.setState({
                    networkData: data
                }, () => {
                    if (this.state.networkData.length > 0) {
                        sessionStorage.setItem('NetItemId', this.state.NetItemId == 0 ? this.state.networkData[0].id : this.state.NetItemId)
                        sessionStorage.setItem('netName', this.state.netName ? this.state.networkData[0].name : this.state.netName)
                    }

                })
            }
        })
    }
    // 注销登录
    exitUser = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("curID");
        axios.get('/mLogin/Logout').then(res => {
            window.location.href = '/login'
        })
    }
    // 服务在线
    serviesApp() {
        axios.get('/contrast/appnames').then(res => {
            this.setState({
                serviesApp: res.data
            }, () => {
                sessionStorage.setItem('AppItemId', this.state.serviesApp[0].source_data_id)
                sessionStorage.setItem('appName', this.state.serviesApp[0].res_name)
                // 放请求
            })
        })
    }
    componentWillMount() {
        document.getElementById('root').scrollIntoView(true);
    }
    componentDidMount() {
        this.sourceAxios()
    }
    render() {
        const { leftList, title, open, leftIndex, typeVal, selectData, networkData, AppItemId, NetItemId,  footerIndex, sourcefooter, serviesfooter, appfooter, userfooter, businessfooter, businessData } = this.state;
        const sidebar = (<div className='showLeftCheck'>
            <div className='showLeftCont'>
                <div className='loginCont'>
                    <Icon type="left" size='md' color='#fff' onClick={this.onOpenChange} />
                    <div className='headImg' onClick={() => {
                        window.location.href = '/my'
                    }}>
                        <div>
                            <img src={headImg} alt="" />
                        </div>
                    </div>
                    <span className='userName'>用户：{sessionStorage.getItem('userName')}</span>
                    <span className='infoStatus'>{sessionStorage.getItem('userName')}</span>
                    <p onClick={this.exitUser}>退出登录</p>
                </div>
                <ul className='leftList'>
                    {
                        leftList.map((item, index) => {
                            return <li key={index} onClick={() => this.tabTitle(item.name, index)} className={index === leftIndex ? 'leftActive' : ''}>
                                {
                                    index === leftIndex ? <img src={item.clickImg} alt='图片不存在' /> : <img src={item.img} alt='图片不存在' />
                                }
                                <span>{item.name}</span>
                            </li>
                        })
                    }
                </ul>
            </div>
        </div>);
        return (
            <div className='homepage'>
                {/* 页面 */}
                <div className='homePageCont'>
                    <Drawer
                        className="my-drawer"
                        style={{ minHeight: document.documentElement.clientHeight }}
                        sidebar={sidebar}
                        open={open}
                        onOpenChange={this.onOpenChange}
                    >
                        <div className='homePageHeader'>
                            <div><img src={menuIcon} alt='' onClick={this.onOpenChange} /></div>
                            <div>{title}</div>
                            <div>
                                <Icon type="search" style={{ marginRight: '16px' }} />
                                <Button type="primary" onClick={() => {
                                    $('.seleType').show();
                                }}>
                                    {
                                        leftIndex === 0 ? typeVal == 0 ? '资源' : typeVal == 1 ? '业务系统' : typeVal == 2 ? '服务器' : '' : ''
                                    }
                                    {
                                        leftIndex === 1 ? typeVal == 0 ? '业务系统' : typeVal == 1 ? '服务器' : '业务系统' : ''
                                    }
                                    {
                                        leftIndex === 2 ? typeVal == 0 ? '全局' : typeVal == 1 ? '服务端' : '端到端' : ''
                                    }
                                </Button>
                            </div>
                        </div>
                        {
                            leftIndex == 0 ? <div className='pageCont'>
                                <div className='div1'><Home typeVal={typeVal} AppItemId={AppItemId} NetItemId={NetItemId} selectData={selectData} networkData={networkData} /></div>
                                {/* <div className='div2'><Event /></div>
                                <div className='div3'><Inform /></div>
                                <div className='div4'><Alarm /></div>
                                <div className='div5'><MyPage /></div> */}
                            </div>
                                : leftIndex == 1 ? <div className='pageCont'>
                                    <div className='div1'><SerivePage typeVal={typeVal} AppItemId={AppItemId} NetItemId={NetItemId} selectData={selectData} networkData={networkData} /></div>
                                    {/* <div className='div2'><Event /></div>
                                    <div className='div3'><Inform /></div>
                                    <div className='div4'><Alarm /></div>
                                    <div className='div5'><MyPage /></div> */}
                                </div>
                                    : leftIndex == 2 ? <div className='pageCont'>
                                        <div className='div1'><BusinessPage typeVal={typeVal} AppItemId={AppItemId} NetItemId={NetItemId} businessData={businessData}
                                        /></div>
                                        <div className='div2'><Event /></div>
                                        {/* <div className='div3'><Inform /></div>
                                <div className='div4'><Alarm /></div>
                                <div className='div5'><MyPage /></div> */}
                                    </div>
                                        : <div className='pageCont'>
                                            <div className='div1'><Home typeVal={typeVal} AppItemId={AppItemId} NetItemId={NetItemId} selectData={selectData} networkData={networkData} /></div>
                                            {/* <div className='div2'><Event /></div>
                                        <div className='div3'><Inform /></div>
                                        <div className='div4'><Alarm /></div>
                                        <div className='div5'><MyPage /></div> */}
                                        </div>
                        }
                        {
                            title === '资源注册状态' ?
                                <ul className='footer'>
                                    {
                                        sourcefooter.map((item, index) => {
                                            return <li onClick={() => this.tabFoot(index)} className={index == footerIndex ? ' active' : ''} key={index} style={{ marginLeft: 'calc(50% - 37px)' }}>
                                                <Link to='/index' style={{ marginLeft: 0 }}>
                                                    <div>
                                                        {
                                                            index == footerIndex
                                                                ? <img src={item.clickImg} alt='图片不见了' />
                                                                : <img src={item.img} alt='图片不见了' />
                                                        }
                                                    </div>
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        })
                                    }

                                </ul>
                                // ---------------------------------------------------------------------
                                : title === '服务在线' ?
                                    <ul className='footer'>
                                        {
                                            serviesfooter.map((item, index) => {
                                                return <li onClick={() => this.tabFoot(index)} className={index == footerIndex ? ' active' : ''} key={index} style={{ marginLeft: 'calc(50% - 37px)' }}>
                                                    <Link to='/index' style={{ marginLeft: 0 }}>
                                                        <div>
                                                            {
                                                                index == footerIndex
                                                                    ? <img src={item.clickImg} alt='图片不见了' />
                                                                    : <img src={item.img} alt='图片不见了' />
                                                            }
                                                        </div>
                                                        <span>{item.name}</span>
                                                    </Link>
                                                </li>
                                            })
                                        }
                                    </ul>
                                    : title === '业务吞吐量' ?
                                        <ul className='footer'>
                                            {
                                                businessfooter.map((item, index) => {
                                                    return <li onClick={() => this.tabFoot(index)} className={index == footerIndex ? ' active' : ''} key={index}>
                                                        <Link to='/index'>
                                                            <div>
                                                                {
                                                                    index == footerIndex
                                                                        ? <img src={item.clickImg} alt='图片不见了' />
                                                                        : <img src={item.img} alt='图片不见了' />
                                                                }
                                                            </div>
                                                            <span>{item.name}</span>
                                                        </Link>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                        : <ul className='footer'>
                                            {
                                                userfooter.map((item, index) => {
                                                    return <li onClick={() => this.tabFoot(index)} className={index == footerIndex ? ' active' : ''} key={index}>
                                                        <Link to='/index'>
                                                            <div>
                                                                {
                                                                    index == footerIndex
                                                                        ? <img src={item.clickImg} alt='图片不见了' />
                                                                        : <img src={item.img} alt='图片不见了' />
                                                                }
                                                            </div>
                                                            <span>{item.name}</span>
                                                        </Link>
                                                    </li>
                                                })
                                            }
                                        </ul>
                        }

                    </Drawer>
                </div>
                {/* 点击header'端到端'出现 */}
                <div className='seleType'>
                    {
                        leftIndex == 0 ?
                            <SourceType getTypeVal={this.getTypeVal.bind(this)} selectData={selectData} networkData={networkData} />
                            : leftIndex == 1 ?
                                <AppType getTypeVal={this.getTypeVal.bind(this)}/>
                                : leftIndex == 2 ?
                                    <BusinessType getTypeVal={this.getTypeVal.bind(this)} />
                                    : ''
                    }
                </div>
            </div>
        );
    }
}

export default Homepage;