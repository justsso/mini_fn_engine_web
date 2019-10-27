import React, {Component} from 'react';
import {Layout, Table, Input, Button, Popconfirm, Form} from "antd";
import EditableCell from "./Components/EditableCell/EditableCell";
import axios from 'axios';

const {Header, Content} = Layout;
const EditableContext = React.createContext();
const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props} key={index}/>
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class Index extends Component {

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'packageName',
                dataIndex: 'packageName',
                width: '30%',
                editable: true,
            },
            {
                title: 'className',
                dataIndex: 'className',
            },
            {
                title: 'functionId',
                dataIndex: 'functionId',
            },
            {
                title: '作者',
                dataIndex: 'auth'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];

        this.state = {
            dataSource: [
                {
                    key: '0',
                    name: 'Edward King 0',
                    age: '32',
                    address: 'London, Park Lane no. 0',
                },
                {
                    key: '1',
                    name: 'Edward King 1',
                    age: '32',
                    address: 'London, Park Lane no. 1',
                },
            ],
            count: 2,
        };
    }

    componentDidMount() {
        axios.get('/find/function').then(res => {
            console.log(res.data.body, 67);
            this.setState({
                dataSource: res.data.body,
                count: res.data.body.length
            })
        })
    }

    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        this.setState({dataSource: dataSource.filter(item => item.key !== key)});
    };

    handleAdd = () => {
        const {count, dataSource} = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({dataSource: newData});
    };


    render() {
        const {dataSource} = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <Layout>
                <Header style={{background: '#f5f5f5'}}>
                    <header>
                        <h1>mini_fn_engine</h1>
                    </header>
                </Header>
                <Content style={{background: '#fff'}}>
                    <div style={{padding: "30px"}}>
                        <Button onClick={this.handleAdd} type="primary" style={{marginBottom: 16}}>
                            Add a row
                        </Button>
                        <Table
                            components={components}
                            rowClassName={() => 'editable-row'}
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                        />
                    </div>
                </Content>
            </Layout>
        )
    }


}

export default Index;
