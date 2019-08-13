import React, { Component } from 'react';
import $ from 'jquery';
import { Icon, Button, Drawer } from 'antd-mobile';
import { Link } from 'react-router-dom';
import clickImg from '../images/click.svg';
import clickGreyImg from '../images/click_grey.svg';
import computerImg from '../images/computer.svg';
import computerGreyImg from '../images/computer_grey.svg';
import goupImg from '../images/goup.svg';
import goupGreyImg from '../images/goup_grey.svg';
import miaozhunImg from '../images/miaozhun.svg';
import miaozhunGreyImg from '../images/miaozhun_grey.svg';
import myImg from '../images/my.svg';
import myGreyImg from '../images/my_grey.svg';
import axios from 'axios';
import Home from 'containers/home';
import Event from 'containers/event';
import SerivePage from 'containers/servies/serviesPage.jsx'
import SourceType from '../components/selectType/sourceType';
import AppType from '../components/selectType/appType';
import BusinessType from '../components/selectType/businessType';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftList: [
                {
                    name: '资源注册状态'
                }, {
                    name: '服务在线'
                }, {
                    name: '业务吞吐量'
                }, {
                    name: '应用处理性能'
                }, {
                    name: '客户体验'
                }, {
                    name: '其他'
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
            serviseApp: [],
            serviseNet: []
        }
    }
    tabFoot = (i, e) => {
        if (i === 0) {
            // this.props.history.push('/home')
            $('.div1').show();
            $('.div2').hide();
            $('.div3').hide();
            $('.div4').hide();
            // $('.div5').hide();
            $('.foot1').attr('src', clickImg);
            $('.foot2').attr('src', computerGreyImg);
            $('.foot3').attr('src', goupGreyImg);
            $('.foot4').attr('src', miaozhunGreyImg);
            // $('.foot5').attr('src', myGreyImg);
            $('.footer li').removeClass('active');
            $('.footName1').addClass('active');

        } else if (i === 1) {
            // this.props.history.push('/inform')
            $('.div1').hide();
            $('.div2').show();
            $('.div3').hide();
            $('.div4').hide();
            // $('.div5').hide();
            $('.foot1').attr('src', clickGreyImg);
            $('.foot2').attr('src', computerImg);
            $('.foot3').attr('src', goupGreyImg);
            $('.foot4').attr('src', miaozhunGreyImg);
            // $('.foot5').attr('src', myGreyImg);
            $('.footer li').removeClass('active');
            $('.footName2').addClass('active');
        } else if (i === 2) {
            $('.div1').hide();
            $('.div2').hide();
            $('.div3').show();
            $('.div4').hide();
            // $('.div5').hide();
            $('.foot1').attr('src', clickGreyImg);
            $('.foot2').attr('src', computerGreyImg);
            $('.foot3').attr('src', goupImg);
            $('.foot4').attr('src', miaozhunGreyImg);
            // $('.foot5').attr('src', myGreyImg);
            $('.footer li').removeClass('active');
            $('.footName3').addClass('active');
        } else if (i === 3) {
            $('.div1').hide();
            $('.div2').hide();
            $('.div3').hide();
            $('.div4').show();
            // $('.div5').hide();
            $('.foot1').attr('src', clickGreyImg);
            $('.foot2').attr('src', computerGreyImg);
            $('.foot3').attr('src', goupGreyImg);
            $('.foot4').attr('src', miaozhunImg);
            // $('.foot5').attr('src', myGreyImg);
            $('.footer li').removeClass('active');
            $('.footName4').addClass('active');
        } else if (i === 4) {
            $('.div1').hide();
            $('.div2').hide();
            $('.div3').hide();
            $('.div4').hide();
            // $('.div5').show();
            $('.foot1').attr('src', clickGreyImg);
            $('.foot2').attr('src', computerGreyImg);
            $('.foot3').attr('src', goupGreyImg);
            $('.foot4').attr('src', miaozhunGreyImg);
            // $('.foot5').attr('src', myImg);
            $('.footer li').removeClass('active');
            $('.footName5').addClass('active');
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
            if (this.state.title == '资源注册状态') {
                this.sourceAxios()
            } else if (this.state.title == '服务在线') {
                this.serviesAxios()
            }
        })
    }
    onOpenChange = () => {
        this.setState({ open: !this.state.open });
    }
    getTypeVal(res) {
        this.setState({ // 将传递来的值赋值给this.state中的值
            typeVal: res.typeVal,
            AppItemId: res.AppItemId,
            NetItemId: res.NetItemId,
        })
    }
    // 获取header列表数据
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
    serviesAxios() {
        axios.get('/contrast/appnames').then(res => {
            this.setState({
                serviseApp: res.data
            }, () => {
                sessionStorage.setItem('AppItemId', this.state.serviseApp[0].source_data_id)
                sessionStorage.setItem('appName', this.state.serviseApp[0].res_name)
                // 放请求
            })
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
    componentDidMount() {
        this.sourceAxios()
    }
    render() {
        const { leftList, title, open, leftIndex, typeVal, selectData, networkData, AppItemId, NetItemId, serviseApp, serviseNet } = this.state;
        const sidebar = (<div className='showLeftCheck'>
            <div className='showLeftCont'>
                <div className='loginCont'>
                    <Icon type="left" size='md' color='#fff' onClick={this.onOpenChange} />
                    <div className='headImg' onClick={() => {
                        window.location.href = '/my'
                    }}>
                        <div></div>
                    </div>
                    <span className='userName'>用户：{sessionStorage.getItem('userName')}</span>
                    <span className='infoStatus'>{sessionStorage.getItem('userName')}</span>
                    <p onClick={this.exitUser}>退出登录</p>
                </div>
                <ul className='leftList'>
                    {
                        leftList.map((item, index) => {
                            return <li key={index} onClick={() => this.tabTitle(item.name, index)} className={index === leftIndex ? 'leftActive' : ''}>
                                <img src={myGreyImg} alt='图片不存在' />
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
                        // enableDragHandle
                        // contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                        sidebar={sidebar}
                        open={open}
                        onOpenChange={this.onOpenChange}
                    >
                        <div className='homePageHeader'>
                            <div><Icon type="ellipsis" onClick={this.onOpenChange} /></div>
                            <div>{title}</div>
                            <div>
                                <Icon type="search" style={{ marginRight: '16px' }} />
                                <Button type="primary" onClick={() => {
                                    $('.seleType').show();
                                }}>
                                    {
                                        leftIndex === 0 ? typeVal === 0 ? '资源' : typeVal === 1 ? '业务系统' : typeVal === 2 ? '服务器' : '' : ''
                                    }
                                    {
                                        leftIndex === 1 ? typeVal === 0 ? '业务系统' : typeVal === 1 ? '服务器' : '业务系统' : ''
                                    }
                                    {
                                        leftIndex === 2 ? typeVal === 0 ? '全局' : typeVal === 1 ? '服务端' : '端到端' : ''
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
                                        <div className='div1'><SerivePage typeVal={typeVal} AppItemId={AppItemId} NetItemId={NetItemId} selectData={selectData} networkData={networkData} /></div>
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
                                    <li onClick={() => this.tabFoot(0)} className='footName1 active' style={{ marginLeft: 'calc(50% - 37px)' }}>
                                        <Link to='/index' style={{ marginLeft: 0 }}>
                                            <div>
                                                <img src={clickImg} alt='图片不见了' className='foot1' />
                                            </div>
                                            <span>动态</span>
                                        </Link>
                                    </li>
                                </ul>
                                // ---------------------------------------------------------------------
                                : title === '服务在线' ?
                                    <ul className='footer'>
                                        <li onClick={() => this.tabFoot(0)} className='footName1 active' style={{ marginLeft: 'calc(50% - 37px)' }}>
                                            <Link to='/index' style={{ marginLeft: 0 }}>
                                                <div>
                                                    <img src={clickImg} alt='图片不见了' className='foot1' />
                                                </div>
                                                <span>动态</span>
                                            </Link>
                                        </li>
                                    </ul>
                                    : title === '业务吞吐量' ?
                                        <ul className='footer'>
                                            <li onClick={() => this.tabFoot(0)} className='footName1 active'>
                                                <Link to='/index'>
                                                    <div>
                                                        <img src={clickImg} alt='图片不见了' className='foot1' />
                                                    </div>
                                                    <span>动态</span>
                                                </Link>
                                            </li>
                                            <li onClick={() => this.tabFoot(1)} className='footName2'>
                                                <a href='javasccript:;' >
                                                    <div>
                                                        <img src={computerGreyImg} alt='图片不见了' className='foot2' />
                                                    </div>
                                                    <span>事件</span>
                                                </a>
                                            </li>
                                            <li onClick={() => this.tabFoot(2)} className='footName3'>
                                                <a href='javasccript:;' >
                                                    <div>
                                                        <img src={goupGreyImg} alt='图片不见了' className='foot3' />
                                                    </div>
                                                    <span>通知</span>
                                                </a>
                                            </li>
                                            <li onClick={() => this.tabFoot(3)} className='footName4'>
                                                <a href='javasccript:;'>
                                                    <div>
                                                        <img src={miaozhunGreyImg} alt='图片不见了' className='foot4' />
                                                    </div>
                                                    <span>报警</span>
                                                </a>
                                            </li>
                                        </ul>
                                        : <ul className='footer'>
                                            <li onClick={() => this.tabFoot(0)} className='footName1 active'>
                                                <a href='/index'>
                                                    <div>
                                                        <img src={clickImg} alt='图片不见了' className='foot1' />
                                                    </div>
                                                    <span>动态</span>
                                                </a>
                                            </li>
                                            <li onClick={() => this.tabFoot(1)} className='footName2'>
                                                <a href='/index'>
                                                    <div>
                                                        <img src={computerGreyImg} alt='图片不见了' className='foot2' />
                                                    </div>
                                                    <span>事件</span>
                                                </a>
                                            </li>
                                            <li onClick={() => this.tabFoot(2)} className='footName3'>
                                                <a href='/index'>
                                                    <div>
                                                        <img src={goupGreyImg} alt='图片不见了' className='foot3' />
                                                    </div>
                                                    <span>通知</span>
                                                </a>
                                            </li>
                                            <li onClick={() => this.tabFoot(3)} className='footName4'>
                                                <a href='/index'>
                                                    <div>
                                                        <img src={miaozhunGreyImg} alt='图片不见了' className='foot4' />
                                                    </div>
                                                    <span>报警</span>
                                                </a>
                                            </li>
                                        </ul>
                        }

                    </Drawer>
                </div>
                {/* 点击header'端到端'出现 */}
                {
                    leftIndex == 0 ? <div className='seleType'>
                        <SourceType getTypeVal={this.getTypeVal.bind(this)} selectData={selectData} networkData={networkData} leftIndex={leftIndex} />
                    </div> : leftIndex == 1 ? <div className='seleType'>
                        <AppType getTypeVal={this.getTypeVal.bind(this)} serviseApp={serviseApp} serviseNet={serviseNet} leftIndex={leftIndex} />
                    </div> : leftIndex == 2 ? <div className='seleType'>
                        <BusinessType getTypeVal={this.getTypeVal.bind(this)} leftIndex={leftIndex} />
                    </div> : ''
                }
            </div>
        );
    }
}

export default Homepage;