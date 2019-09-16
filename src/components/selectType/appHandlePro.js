import React, { Component } from 'react';
import { SegmentedControl, WingBlank, Button, Toast, Tabs, Checkbox, List, Badge } from 'antd-mobile';
import { Tree } from 'antd';
import axios from 'axios';
import $ from 'jquery';

class AppHandlePro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ind: 0,
            AppItemId: 0,
            NetItemId: 0,
            nodeList: [],
            appList: [],
            BusinessNet: [],
            BusinessApp: [],
            appName: '',
            netName: '',
            businessType: 0,
            appArr: [],
            netArr: [],
            appArrName:[], 
            netArrName:[],
            treeData: [],
            expandedKeys: [],
            selectedKeys: [],
            seleAppNumber: 0
        }
    }
    seleChange = (e) => {
        if (e === '服务端') {
            $('.fuWuDuan').show();
            $('.sourceSeleBtn').attr('value', 1)
        } else {
            $('.fuWuDuan').hide();
            $('.sourceSeleBtn').attr('value', 0)
        }
    }
    clickApp = (_appId, itemId, name) => {
        let newArrName = this.state.appArrName;
        let Name = name ;
        let number = itemId;
        let newArr = this.state.appArr;
        if ($.inArray(number, newArr) == -1) {
            newArr.push(number)
            newArrName.push(Name)
        } else {
            newArr.splice($.inArray(number, newArr), 1)
            newArrName.splice($.inArray(Name, newArrName), 1)
        }
        this.setState({
            AppItemId: itemId,
            appName: name,
            ind: 1,
            seleAppNumber: newArr.length,
            appArr: newArr,
            appArrName:newArrName
        }, () => {
            // 此处所有的复选框改为不选中状态
        })
    }
    // 服务端数据
    getAxios() {
        // 服务端 渲染列表
        axios.get('/performance/appList', {
            params: {
                timeId: 5,
                pageSize: 10000
            }
        }).then(res => {
            var newArr = [];
            res.data.ratList.map((item, ind) => {
                if (item.list) {
                    var childs = []
                    item.list.map((i, index) => {
                        childs.push({
                            key: i.hostId + '-' + index + '-' + i.hostName,
                            title: i.hostName
                        })
                    })
                    newArr.push({
                        key: item.appId + '_' + ind + '_' + item.appName,
                        title: item.appName,
                        children: childs
                    })
                } else {
                    newArr.push({
                        key: item.appId + '_' + ind + '_' + item.appName,
                        title: item.appName
                    })
                }
            })
            this.setState({
                BusinessNet: newArr
            })
        })

        axios.get('/contrast/appnames').then(res => {
            this.setState({
                BusinessApp: res.data
            })
        })
    }
    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
        });
    };

    onCheck = (checkedKeys, info) => {
        var newArr = [];
        var newArrName = []
        checkedKeys.map((item) => {
            if (item.indexOf('_') == -1) {
                newArr.push(item.split('-')[0])
            }
        })
        checkedKeys.map((item) => {
            if (item.indexOf('_') == -1) {
                newArrName.push(item.split('-')[2])
            }
        })
        this.setState({
            netArr: newArr,
            netArrName:newArrName
        })
    };
    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </Tree.TreeNode>
                );
            }
            return <Tree.TreeNode key={item.key} {...item} />;
        });
    componentDidMount() {
        this.getAxios();
    }
    render() {
        const { ind, BusinessNet, BusinessApp, nodeList, appList, seleAppNumber } = this.state;
        const tabs = [
            { title: seleAppNumber == 0 ? '业务系统' : <Badge text={seleAppNumber}>业务系统</Badge> },
            { title: '服务器' }
        ];
        return <div className='seleType_cont'>
            <WingBlank size="lg" className="sc-example">
                <h4 className='sourceTitle'>空间选择</h4>
                <SegmentedControl selectedIndex={ind * 1} values={['全局', '服务端']} onValueChange={this.seleChange} />
                <div className='fuWuDuan' style={{ display: 'none' }}>
                    <Tabs tabs={tabs}
                        initialPage={0}
                        swipeable={false}
                        useOnPan={true}
                        onChange={(tab, i) => { this.setState({ businessType: i, ind: 1 }) }}
                    >
                        <List className='appBox' style={{ display: 'block' }}>
                            {
                                BusinessApp.map((item, index) => {
                                    return <Checkbox.CheckboxItem key={index} onChange={() => this.clickApp(index, item.source_data_id, item.res_name)}>
                                        {item.res_name}
                                    </Checkbox.CheckboxItem>
                                })
                            }
                        </List>
                        <List className='serivesBox' style={{ display: 'block' }}>
                            <Tree
                                checkable
                                onExpand={this.onExpand}
                                expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}
                                selectedKeys={this.state.selectedKeys}
                            >
                                {this.renderTreeNodes(BusinessNet)}
                            </Tree>
                        </List>
                    </Tabs>
                </div>
            </WingBlank>
            <div className='sourceSeleBtn' value={0}>
                <Button inline onClick={() => {
                    $('.seleType').hide();
                }}>取消</Button>
                <Button type="primary" inline onClick={() => {
                    this.setState({
                        ind: $('.sourceSeleBtn').attr('value')
                    })
                    if (BusinessApp && BusinessApp.length > 0) {
                        this.props.getTypeVal({
                            businessType:this.state.businessType,
                            typeVal: $('.sourceSeleBtn').attr('value')
                        })
                        if (this.state.ind == 0) {
                            // 全局
                            $('.seleType').hide();
                        } else if (this.state.ind == 1) {
                            sessionStorage.removeItem('AppItemId')
                            sessionStorage.removeItem('NetItemId')
                            sessionStorage.removeItem('appName')
                            sessionStorage.removeItem('netName')
                            sessionStorage.setItem('businessType', this.state.businessType);
                            if (this.state.appArr.length == 0 && this.state.netArr.length == 0) {
                                Toast.info('请选择业务系统或服务器', 1)
                                $('.seleType').show();
                            } else{
                                if (this.state.businessType == 0) {
                                    sessionStorage.setItem('appIdArr', this.state.appArr);
                                    sessionStorage.setItem('appIdArrName', this.state.appArrName);
                                } else {
                                    sessionStorage.setItem('appIdArr', this.state.netArr);
                                    sessionStorage.setItem('appIdArrName', this.state.netArrName);
                                }
                                $('.seleType').hide();
                            }
                        }
                    }
                }}>确定</Button>
            </div>
        </div>
    }

}

export default AppHandlePro;