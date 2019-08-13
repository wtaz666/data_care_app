import React, { Component } from 'react';
import { Icon } from 'antd-mobile';
import './index.scss'

class Mypage extends Component {
    render() {
        return (
            <div className='myPage'>
                <div className='loginCont'>
                    <Icon type="left" size='md' color='#fff' onClick={() => {
                        window.location.href = '/index'
                    }}/>
                    <div className='headImg' onClick={() => {
                        window.location.href = '/my'
                    }}>
                        <div></div>
                    </div>
                    <p className='userName'>{sessionStorage.getItem('userName')}</p>
                    <p className='infoStatus'>{sessionStorage.getItem('userName')}</p>
                </div>
                <ul className="list">
                    <li>
                        <span>姓名</span>
                        <div>
                            <span>张三</span>
                        </div>
                    </li>
                    <li>
                        <span>性别</span>
                        <div>
                            <span>男</span>
                        </div>
                    </li>
                    <li>
                        <span>手机</span>
                        <div>
                            <span>13456789101</span>
                            <Icon type="right" />
                        </div>
                    </li>
                    <li>
                        <span>邮箱</span>
                        <div>
                            <span>1343749@qq.com</span>
                            <Icon type="right" />
                        </div>
                    </li>
                    <li>
                        <span>职务</span>
                        <div>
                            <span>管理员</span>
                        </div>
                    </li>
                    <li>
                        <span>用户列表</span>
                        <div>
                            <Icon type="right" />
                        </div>
                    </li>
                    <li>
                        <span>关注定制</span>
                        <div>
                            <Icon type="right" />
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Mypage;