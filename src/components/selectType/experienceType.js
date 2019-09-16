import React, { Component } from 'react';
import { SegmentedControl, WingBlank, Button, Icon, Tabs, Checkbox, List, Badge } from 'antd-mobile';
import { Select, Tree } from 'antd';
import { Toast } from 'antd-mobile';
import axios from 'axios';
import $ from 'jquery';

class ExperienceType extends Component {
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
            netArrName:[],
            expandedKeys: [],
            selectedKeys: [],
            seleAppNumber: 0
        }
    }
    seleChange = (e) => {
        if (e === '端到端') {
            this.setState({
                ind: 2,
                businessType:2,
            }, () => {
                $('.duanToduan').show();
                $('.fuWuDuan').hide();
                $('.sourceSeleBtn').attr('value', 2)
            })
        } else if (e === '服务端') {
            this.setState({
                businessType:0,
                ind: 1
            }, () => {
                $('.duanToduan').hide();
                $('.fuWuDuan').show();
                $('.sourceSeleBtn').attr('value', 1)
            })
        } else {
            this.setState({
                businessType:2,
                ind: 0
            }, () => {
                $('.duanToduan').hide();
                $('.fuWuDuan').hide();
                $('.sourceSeleBtn').attr('value', 0)
            })
        }
    }
    clickApp = (appId, itemId, name) => {
        let number = itemId;
        let newArr = this.state.appArr;
        if ($.inArray(number, newArr) == -1) {
            newArr.push(number)
        } else {
            newArr.splice($.inArray(number, newArr), 1)
        }

        this.setState({
            AppItemId: itemId,
            appName: name,
            ind: 1,
            seleAppNumber: newArr.length,
            appArr: newArr,
            // netArr: []
        }, () => {
            // 此处所有的复选框改为不选中状态
        })
    }
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

        // 端到端
        axios.get('/adminController/selectNodeIdList').then(res => {
            this.setState({
                nodeList: res.data,
            }, () => {
                sessionStorage.setItem('sourceId', this.state.nodeList[0].id)
                sessionStorage.setItem('sourceName', this.state.nodeList[0].name)
            })
        })
        axios.get('/contrast/appnames').then(res => {
            this.setState({
                BusinessApp: res.data,
                appList: res.data
            }, () => {
                sessionStorage.setItem('goalId', this.state.appList[0].source_data_id)
                sessionStorage.setItem('goalName', this.state.appList[0].res_name)
            })
        })
    }
    // 源 node
    sourceChange(id) {
        sessionStorage.setItem('sourceId', id)
    }
    // 目的 app
    goalChange(id) {
        sessionStorage.setItem('goalId', id)
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
        // this.setState({ checkedKeys });
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
            return <Tree.TreeNode key={item.key} {...item}/>;
        });
    componentDidMount() {
        this.getAxios();
    }
    render() {
        const { ind, BusinessNet, BusinessApp, nodeList, appList, seleAppNumber } = this.state;
        // const { leftIndex } = this.props;
        const tabs = [
            { title: seleAppNumber == 0 ? '业务系统' : <Badge text={seleAppNumber}>业务系统</Badge> },
            { title: '服务器' }
        ];
        return <div className='seleType_cont'>
            <WingBlank size="lg" className="sc-example">
                <h4 className='sourceTitle'>空间选择</h4>
                <SegmentedControl selectedIndex={ind * 1} values={['全局', '服务端', '端到端']} onValueChange={this.seleChange} />
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
                <div className='duanToduan' style={{ display: 'none' }}>
                    <div className='nodeToApp' style={{ display: 'block' }}>
                        <p>源</p>
                        <Select defaultValue="请选择" style={{ width: '100%' }} notFoundContent='无数据' className='sorceName' onChange={this.sourceChange}>
                            {
                                nodeList.length > 0 && nodeList.map((item, index) => {
                                    return <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                        <p>目的</p>
                        <Select defaultValue="请选择" style={{ width: '100%' }} notFoundContent='无数据' className='goalName' onChange={this.goalChange}>
                            {
                                appList.length > 0 && appList.map((item, index) => {
                                    return <Select.Option key={index} value={item.source_data_id}>{item.res_name}</Select.Option>
                                })
                            }
                        </Select>
                    </div>
                </div>
            </WingBlank>
            <div className='sourceSeleBtn' value={0}>
                <Button inline onClick={() => {
                    $('.seleType').hide();
                }}>取消</Button>
                <Button type="primary" inline onClick={() => {
                    this.setState({
                        ind: $('.sourceSeleBtn').attr('value')
                    }, () => {
                        if (BusinessApp && BusinessApp.length > 0) {
                            this.props.getTypeVal({
                                typeVal: $('.sourceSeleBtn').attr('value'),
                                AppItemId: this.state.AppItemId == 0 ? BusinessApp[0].source_data_id : this.state.AppItemId,
                                NetItemId: this.state.NetItemId == 0 ? BusinessNet[0].hostId : this.state.NetItemId,
                                businessType: this.state.businessType
                            })
                            if (this.state.ind == 0) {
                                sessionStorage.setItem('AppItemId', this.state.AppItemId == 0 ? BusinessApp[0].source_data_id : this.state.AppItemId)
                                sessionStorage.setItem('NetItemId', this.state.NetItemId == 0 ? BusinessNet[0].hostId : this.state.NetItemId)
                                sessionStorage.setItem('appName', this.state.appName == '' ? BusinessApp[0].res_name : this.state.appName)
                                sessionStorage.setItem('netName', this.state.netName == '' ? BusinessNet[0].hostName : this.state.netName)
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
                                } else {
                                    if (this.state.businessType == 0) {
                                        sessionStorage.setItem('appIdArr', this.state.appArr);
                                    } else {
                                        sessionStorage.setItem('appIdArr', this.state.netArr);
                                        sessionStorage.setItem('appIdArrName', this.state.netArrName);
                                    }
                                    $('.seleType').hide();
                                }
                            } else if (this.state.ind == 2) {
                                sessionStorage.removeItem('AppItemId')
                                sessionStorage.removeItem('NetItemId')
                                sessionStorage.removeItem('appName')
                                sessionStorage.removeItem('netName')
                                sessionStorage.removeItem('businessType') 
                                if ($('.sorceName .ant-select-selection-selected-value').attr('title') == '请选择' || $('.goalName .ant-select-selection-selected-value').attr('title') == '请选择') {
                                    Toast.info('请选择源和目的', 1)
                                    $('.seleType').show();
                                } else {
                                    sessionStorage.setItem('sourceName', $('.sorceName .ant-select-selection-selected-value').attr('title'))
                                    sessionStorage.setItem('goalName', $('.goalName .ant-select-selection-selected-value').attr('title'))
                                    $('.seleType').hide();
                                }
                            }
                        }
                    })
                }}>确定</Button>
            </div>
        </div>
    }

}

export default ExperienceType;