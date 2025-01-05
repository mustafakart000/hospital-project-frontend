import React, { useState } from 'react';
import { Tabs } from 'antd';
import PatientRegistration from '../../components/patient/PatientRegistration';
import PatientTable from '../../components/patient/PatientTable';
import { UnorderedListOutlined, UserAddOutlined } from '@ant-design/icons';

const PatientManagementPage = () => {
  const [activeTab, setActiveTab] = useState('list');

  const items = [
    {
      key: 'new',
      label: 'Hasta Oluştur',
      children: <PatientRegistration labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} setActiveTab={setActiveTab} />, 
      icon: <UserAddOutlined style={{ fontSize: '18px' }} />
    },
    {
      key: 'list',
      label: 'Hasta Listesi',
      children: <PatientTable activeTab={activeTab} />, 
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

export default PatientManagementPage;