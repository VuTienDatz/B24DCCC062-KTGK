import { useState } from 'react';
import { message } from 'antd';

export interface KhoaHocParams {
  id: string;
  name: string;
  instructor: string;
  studentCount: number;
  status: string; // 'OPEN' | 'ENDED' | 'PAUSED'
  description: string;
}

export default () => {
	const [data, setData] = useState<KhoaHocParams[]>([]);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<KhoaHocParams>();

	const initialData: KhoaHocParams[] = [
    {
      id: "kh01",
      name: "Khóa học Lập trình Web Frontend với ReactJS",
      instructor: "Nguyễn Văn A",
      studentCount: 35,
      status: "OPEN",
      description: "<p>Khóa học cung cấp kiến thức nền tảng và nâng cao về ReactJS, kèm dự án thực tế.</p>"
    },
    {
      id: "kh02",
      name: "Khóa học Lập trình Backend với Node.js",
      instructor: "Trần Thị B",
      studentCount: 150,
      status: "ENDED",
      description: "<p>Học cách xây dựng API mạnh mẽ với Express và MongoDB.</p>"
    },
    {
      id: "kh03",
      name: "Thiết kế UI/UX theo chuẩn Figma 2024",
      instructor: "Lê Văn C",
      studentCount: 0,
      status: "PAUSED",
      description: "<p>Khóa học tập trung vào tư duy thiết kế, phù hợp cho người mới bắt đầu.</p>"
    },
    {
      id: "kh04",
      name: "Khóa học Python cơ bản cho Phân Tích Dữ Liệu",
      instructor: "Nguyễn Văn A",
      studentCount: 88,
      status: "OPEN",
      description: "<p>Học Numpy, Pandas, Matplotlib và phân tích các bộ dữ liệu siêu lớn.</p>"
    }
  ];

	const getDataKhoaHoc = () => {
		const dataLocal = localStorage.getItem('khoaHocData');
		if (dataLocal && dataLocal !== '[]') {
			setData(JSON.parse(dataLocal));
		} else {
			setData(initialData);
      localStorage.setItem('khoaHocData', JSON.stringify(initialData));
		}
	};

  const addKhoaHoc = (values: KhoaHocParams) => {
    if (data.some(item => item.name.toLowerCase() === values.name.toLowerCase())) {
      message.error('Tên khóa học đã tồn tại!');
      return false;
    }
    const newData = [values, ...data];
    setData(newData);
    localStorage.setItem('khoaHocData', JSON.stringify(newData));
    message.success('Thêm khóa học thành công!');
    return true;
  }

  const editKhoaHoc = (values: KhoaHocParams) => {
    if (data.some(item => item.id !== values.id && item.name.toLowerCase() === values.name.toLowerCase())) {
      message.error('Tên khóa học đã tồn tại!');
      return false;
    }
    const newData = data.map(item => item.id === values.id ? values : item);
    setData(newData);
    localStorage.setItem('khoaHocData', JSON.stringify(newData));
    message.success('Cập nhật khóa học thành công!');
    return true;
  }

  const deleteKhoaHoc = (id: string) => {
    const item = data.find(i => i.id === id);
    if (!item) return false;
    if (item.studentCount > 0) {
      message.error('Chỉ được xóa khóa học chưa có học viên!');
      return false;
    }
    const newData = data.filter(item => item.id !== id);
    setData(newData);
    localStorage.setItem('khoaHocData', JSON.stringify(newData));
    message.success('Xóa khóa học thành công!');
    return true;
  }

	return {
		data,
		visibleForm,
		setVisibleForm,
		row,
		setRow,
		isEdit,
		setIsEdit,
		getDataKhoaHoc,
    addKhoaHoc,
    editKhoaHoc,
    deleteKhoaHoc
	};
};
