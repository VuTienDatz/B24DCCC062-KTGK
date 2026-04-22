import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Space, Popconfirm, Tag, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import FormKhoaHoc from './components/FormKhoaHoc';
import type { KhoaHocParams } from '@/models/quanlykhoahoc';

const { Option } = Select;

const QuanLyKhoaHoc = () => {
  const { data, getDataKhoaHoc, setVisibleForm, setIsEdit, setRow, deleteKhoaHoc } = useModel('quanlykhoahoc');
  const [searchText, setSearchText] = useState('');
  const [filterInstructor, setFilterInstructor] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    getDataKhoaHoc();
  }, []);

  const handleDelete = (record: KhoaHocParams) => {
    deleteKhoaHoc(record.id);
  };

  const columns = [
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Số lượng HV',
      dataIndex: 'studentCount',
      key: 'studentCount',
      sorter: (a: KhoaHocParams, b: KhoaHocParams) => a.studentCount - b.studentCount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        switch (status) {
          case 'OPEN': return <Tag color="green">Đang mở</Tag>;
          case 'ENDED': return <Tag color="red">Đã kết thúc</Tag>;
          case 'PAUSED': return <Tag color="gold">Tạm dừng</Tag>;
          default: return status;
        }
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: KhoaHocParams) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => {
              setRow(record);
              setIsEdit(true);
              setVisibleForm(true);
            }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khóa học này không?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  let filteredData = data;
  if (searchText) {
    filteredData = filteredData.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
  }
  if (filterInstructor) {
    filteredData = filteredData.filter(item => item.instructor === filterInstructor);
  }
  if (filterStatus) {
    filteredData = filteredData.filter(item => item.status === filterStatus);
  }

  // Danh sach giang vien cho bo loc
  const danhSachGiangVien = Array.from(new Set(data.map(item => item.instructor)));

  return (
    <Card title="Quản lý khóa học trực tuyến">
      <Space style={{ marginBottom: 16 }} wrap>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setIsEdit(false);
            setRow(undefined);
            setVisibleForm(true);
          }}
        >
          Thêm mới
        </Button>
        <Input 
          placeholder="Tìm kiếm theo tên khóa học" 
          prefix={<SearchOutlined />} 
          onChange={e => setSearchText(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />
        <Select 
          placeholder="Lọc theo giảng viên" 
          allowClear 
          onChange={setFilterInstructor}
          style={{ width: 200 }}
        >
          {danhSachGiangVien.map(gv => <Option key={gv} value={gv}>{gv}</Option>)}
        </Select>
        <Select 
          placeholder="Lọc theo trạng thái" 
          allowClear 
          onChange={setFilterStatus}
          style={{ width: 150 }}
        >
          <Option value="OPEN">Đang mở</Option>
          <Option value="ENDED">Đã kết thúc</Option>
          <Option value="PAUSED">Tạm dừng</Option>
        </Select>
      </Space>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id" 
      />

      <FormKhoaHoc />
    </Card>
  );
};

export default QuanLyKhoaHoc;
