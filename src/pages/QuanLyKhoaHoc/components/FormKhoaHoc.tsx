import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Modal } from 'antd';
import { useModel } from 'umi';
import TinyEditor from '@/components/TinyEditor';

const { Option } = Select;

const danhSachGiangVien = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Lê Văn C',
];

const FormKhoaHoc = () => {
  const { visibleForm, setVisibleForm, isEdit, row, addKhoaHoc, editKhoaHoc } = useModel('quanlykhoahoc');
  const [form] = Form.useForm();

  useEffect(() => {
    if (visibleForm) {
      if (isEdit && row) {
        form.setFieldsValue(row);
      } else {
        form.resetFields();
      }
    }
  }, [visibleForm, isEdit, row, form]);

  const onFinish = (values: any) => {
    let success = false;
    if (isEdit) {
      success = editKhoaHoc({ ...values, id: row?.id });
    } else {
      success = addKhoaHoc({ ...values, id: Math.random().toString(36).substring(7) });
    }
    if (success) {
      setVisibleForm(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Chỉnh sửa khóa học" : "Thêm mới khóa học"}
      visible={visibleForm}
      onCancel={() => setVisibleForm(false)}
      onOk={() => form.submit()}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ studentCount: 0, status: 'OPEN' }}
      >
        <Form.Item
          name="name"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học' },
            { max: 100, message: 'Tên khóa học tối đa 100 ký tự' }
          ]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>

        <Form.Item
          name="instructor"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
        >
          <Select placeholder="Chọn giảng viên">
            {danhSachGiangVien.map(gv => (
              <Option key={gv} value={gv}>{gv}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="studentCount"
          label="Số lượng học viên"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng học viên' }
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="OPEN">Đang mở</Option>
            <Option value="ENDED">Đã kết thúc</Option>
            <Option value="PAUSED">Tạm dừng</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả khóa học"
        >
          <TinyEditor />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormKhoaHoc;
