import React, { Component } from 'react';
import axios from 'axios';
import { Icon } from 'antd-mobile';
import './index.scss'
import $ from 'jquery';
import userIcon from 'images/userIcon.svg'

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: []
        }
    }
    componentDidMount() {
        axios.get('/adminController/getAllUser').then(res => {
            this.setState({
                userList: res.data
            })
        })
    }
    render() {
        const { userList } = this.state;
        return (
            <div className='user'>
                <div className='userHeader'>
                    <Icon type="left" size='md' color='rgba(57, 126, 253, 1)' onClick={() => {
                       $('.myCont').show();
                       $('.user').hide();
                    }} />
                    <span className='title'>用户列表</span>
                </div>
                <ul className='userList'>
                    {
                        userList.map((item, index) => {
                            return <li key={index}>
                                <img src={userIcon} alt='???' />
                                <span>{item.name}</span>
                            </li>
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default User;