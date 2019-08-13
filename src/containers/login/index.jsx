import React, { Component } from 'react';
import { Button, InputItem, Checkbox } from 'antd-mobile';
import './index.scss';
import axios from 'axios'
import $ from 'jquery'


class Login extends Component {
    enterlogin = (event) => {
        if (event.keyCode === 13) {//回车键的键值为13
            this.userLogin()  //调用登录按钮的登录事件
        }
    }
    userLogin = () => {
        let username = $('#username').val();
        let password = $('#password').val();
        const params = new URLSearchParams();
        //用户名 密码 post 参数
        params.append('account', username);
        params.append('password', password);
        axios.post('/mLogin/login', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then(res => {
                let data = res.data;
                let user = data.content;
                let code = data.code;
                let userName = data.name;
                if (code < 0) {
                    alert('帐号密码不正确');
                    $('#username').val('');
                    $('#password').val('');
                } else if (code === 9) {
                    window.location.href = '/#/main/auditor';
                    sessionStorage.setItem('user', '9');
                } else if (code === 200) {
                    sessionStorage.setItem('user', user);
                    sessionStorage.setItem('userName', userName);
                    window.location.href = '/regapp'
                }
            });
    };
    getTitle() {
        axios.get('/contrast/getTitle').then(res => {
            let data = res.data;
            document.title = 'Datacare';
            if (data.startsWith('Datacare Node')) {
                sessionStorage.setItem('isCenter', 0)
            } else if (data.startsWith('Datacare Center')) {
                sessionStorage.setItem('isCenter', 1)
            }
        })
    }
    componentDidMount() {
        this.getTitle()
    }
    render() {
        return (
            <div className='login'>
                <div>
                    <InputItem
                        ref={el => this.autoFocusInst = el}
                        placeholder='账号'
                        id="username"
                    ></InputItem>
                    <InputItem
                        onKeyUp={this.enterlogin}
                        id="password"
                        type="password"
                        placeholder='密码'
                    ></InputItem>
                    <Checkbox>记住密码</Checkbox>
                </div>
                <Button type='primary' className='loginBtn btn1' onClick={this.userLogin}>登录</Button>
            </div>
        );
    }
}

export default Login;