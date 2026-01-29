import { Button, Card, Form, Input, List, Modal, Space, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

// Kiểu dữ liệu cho một todo
type TodoItem = {
	id: string;
	title: string;
};

const LOCAL_STORAGE_KEY = 'todoList';

// Đọc todoList từ localStorage
const loadTodos = (): TodoItem[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as TodoItem[];
		if (!Array.isArray(parsed)) return [];
		return parsed;
	} catch {
		return [];
	}
};

// Ghi todoList vào localStorage
const saveTodos = (todos: TodoItem[]) => {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
};

const TodoListPage: React.FC = () => {
	const [todos, setTodos] = useState<TodoItem[]>([]);
	const [form] = Form.useForm<{ title: string }>();
	const [editing, setEditing] = useState<TodoItem | null>(null);
	const [editForm] = Form.useForm<{ title: string }>();

	const title = useMemo(() => 'Todo List (lưu bằng localStorage)', []);

	// Khi component mount, đọc dữ liệu từ localStorage
	useEffect(() => {
		const initial = loadTodos();
		setTodos(initial);
	}, []);

	// Hàm tiện ích: cập nhật state + lưu localStorage
	const updateTodos = (next: TodoItem[]) => {
		setTodos(next);
		saveTodos(next);
	};

	// Thêm mới todo
	const handleAdd = (values: { title: string }) => {
		const newTodo: TodoItem = {
			id: Date.now().toString(),
			title: values.title.trim(),
		};
		const next = [...todos, newTodo];
		updateTodos(next);
		form.resetFields();
	};

	// Mở modal chỉnh sửa
	const openEdit = (item: TodoItem) => {
		setEditing(item);
		editForm.setFieldsValue({ title: item.title });
	};

	// Lưu chỉnh sửa
	const handleEditSave = (values: { title: string }) => {
		if (!editing) return;
		const next = todos.map((t) => (t.id === editing.id ? { ...t, title: values.title.trim() } : t));
		updateTodos(next);
		setEditing(null);
	};

	// Xóa todo
	const handleDelete = (id: string) => {
		const next = todos.filter((t) => t.id !== id);
		updateTodos(next);
	};

	return (
		<Card title={title}>
			<Space direction='vertical' style={{ width: '100%' }} size={16}>
				<Typography.Paragraph>
					<b>Yêu cầu:</b> Đọc/hiển thị danh sách todo từ <code>localStorage</code>, cho phép thêm mới, chỉnh sửa và xóa.
				</Typography.Paragraph>

				{/* Form thêm mới todo */}
				<Card size='small' title='Thêm công việc mới'>
					<Form form={form} layout='inline' onFinish={handleAdd}>
						<Form.Item
							name='title'
							rules={[
								{ required: true, message: 'Vui lòng nhập nội dung công việc!' },
								{ whitespace: true, message: 'Nội dung không được chỉ có khoảng trắng.' },
							]}
							style={{ flex: 1, marginRight: 8 }}
						>
							<Input placeholder='Nhập nội dung công việc...' allowClear />
						</Form.Item>
						<Form.Item>
							<Button type='primary' htmlType='submit'>
								Thêm
							</Button>
						</Form.Item>
					</Form>
				</Card>

				{/* Danh sách todo đọc từ localStorage */}
				<Card size='small' title='Danh sách công việc'>
					{todos.length === 0 ? (
						<Typography.Text type='secondary'>Chưa có công việc nào.</Typography.Text>
					) : (
						<List
							dataSource={todos}
							renderItem={(item) => (
								<List.Item
									actions={[
										<Button size='small' onClick={() => openEdit(item)}>
											Sửa
										</Button>,
										<Button size='small' danger onClick={() => handleDelete(item.id)}>
											Xóa
										</Button>,
									]}
								>
									<Typography.Text>{item.title}</Typography.Text>
								</List.Item>
							)}
						/>
					)}
				</Card>

				{/* Modal chỉnh sửa todo */}
				<Modal
					title='Chỉnh sửa công việc'
					visible={!!editing}
					onCancel={() => setEditing(null)}
					onOk={() => {
						editForm.submit();
					}}
					okText='Lưu'
					cancelText='Hủy'
					destroyOnClose
				>
					<Form form={editForm} layout='vertical' onFinish={handleEditSave}>
						<Form.Item
							name='title'
							label='Nội dung'
							rules={[
								{ required: true, message: 'Vui lòng nhập nội dung công việc!' },
								{ whitespace: true, message: 'Nội dung không được chỉ có khoảng trắng.' },
							]}
						>
							<Input placeholder='Nhập nội dung công việc...' />
						</Form.Item>
					</Form>
				</Modal>
			</Space>
		</Card>
	);
};

export default TodoListPage;


