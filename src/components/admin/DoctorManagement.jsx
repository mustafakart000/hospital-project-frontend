import React, { useState } from 'react';
import DoctorRegistration from './DoctorRegistration';
import { Tabs } from 'antd';
import DoctorTable from './doctors-table';
import { UnorderedListOutlined, UserAddOutlined } from '@ant-design/icons';

const DoctorManagement = () => {

  const [activeTab, setActiveTab] = useState('list');

  const items = [
    {
      key: 'new',
      label: 'Doktor Oluştur',
      children: <DoctorRegistration labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} setActiveTab={setActiveTab} />,
      icon: <UserAddOutlined style={{ fontSize: '18px' }} />
    },
    {
      key: 'list',
      label: 'Doktorlar Listesi',
      children: <DoctorTable activeTab={activeTab}/>,
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

export default DoctorManagement;
