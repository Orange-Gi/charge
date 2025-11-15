import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      const data = await authApi.login(values);
      const token = data.access_token ?? data.token;
      if (data.user && token) {
        login(data.user, token);
        message.success('登录成功');
        navigate('/dashboard');
      } else {
        throw new Error('返回数据不完整');
      }
    } catch (error) {
      console.error(error);
      message.error('登录失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, rgba(11,99,206,0.1) 0%, rgba(42,209,210,0.1) 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{ maxWidth: 420, width: '100%', borderRadius: 20 }}
        title={
          <Space direction="vertical" size={0}>
            <Typography.Text type="secondary">智能充电管理平台</Typography.Text>
            <Typography.Title level={4} style={{ margin: 0 }}>
              欢迎回来
            </Typography.Title>
          </Space>
        }
      >
        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              icon={<LockOutlined />}
            >
              登录
            </Button>
          </Form.Item>
          <Typography.Text type="secondary">
            尚无账号？<Link to="/register">立即注册</Link>
          </Typography.Text>
        </Form>
      </Card>
    </div>
  );
}
