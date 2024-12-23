import React, { useState } from 'react';
import AdminNew from './admin-new';
import { Tabs } from 'antd';
import AdminTable from './admin-table';
import { UnorderedListOutlined, UserAddOutlined } from '@ant-design/icons';

const AdminManagement = () => {

  const [activeTab, setActiveTab] = useState('list');

  const items = [
    {
      key: 'new',
      label: 'Admin Oluştur',
      children: <AdminNew labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} />,
      icon: <UserAddOutlined style={{ fontSize: '18px' }} />
    },
    {
      key: 'list',
      label: 'Adminler Listesi',
      children: <AdminTable />,
      icon: <UnorderedListOutlined style={{ fontSize: '18px' }} />
    }
  ];

  return (
    <Tabs 
      activeKey={activeTab}
      onChange={(key) => setActiveTab(key)}
      items={items} 
      tabBarGutter={25}
      centered
      defaultActiveKey="list"
    />
  );
};

export default AdminManagement;
