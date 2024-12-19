import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { Dialog } from 'primereact/dialog';
import { Menu } from 'primereact/menu';
import { Badge } from 'primereact/badge';
import { Clock, Calendar, User, Building2 } from 'lucide-react';
import PropTypes from 'prop-types';

const AppointmentCard = ({ appointment }) => {
  const getStatusColor = (status) => {
    const statusMap = {
      'Bekliyor': 'bg-yellow-100 text-yellow-800',
      'Onaylandı': 'bg-green-100 text-green-800',
      'İptal Edildi': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateDaysLeft = (appointmentDate) => {
    const today = new Date();
    const appointmentDay = new Date(appointmentDate);
    const timeDiff = appointmentDay - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft === 0) return { text: 'Bugün', color: 'text-red-600' };
    if (daysLeft === 1) return { text: 'Yarın', color: 'text-orange-600' };
    if (daysLeft <= 7) return { text: `${daysLeft} gün kaldı`, color: 'text-blue-600' };
    return { text: appointmentDay.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }), color: 'text-gray-600' };
  };

  const daysInfo = calculateDaysLeft(appointment.date);

  return (
    <Card className="mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className={`font-medium ${daysInfo.color}`}>{daysInfo.text}</span>
          </div>
          <Badge value={appointment.status} severity={getStatusColor(appointment.status)} />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900">{appointment.doctor}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{appointment.department}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{appointment.time || '14:30'}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button
            label="Detaylar"
            className="p-button-outlined p-button-info"
            size="small"
          />
          <Button
            label="İptal Et"
            className="p-button-danger"
            size="small"
          />
        </div>
      </div>
    </Card>
  );
};

const PatientDashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeDialog, setActiveDialog] = useState(null);

  // Örnek hasta verisi
  const [patient] = useState({
    name: 'Ahmet Yılmaz',
    id: '12345678901',
    birthDate: '01.01.1980',
    bloodType: 'A Rh+',
    phone: '0555 555 5555',
    email: 'ahmet@email.com'
  });

  // Örnek randevu verisi
  const [appointments] = useState([
    {
      id: 1,
      date: '2024-12-10',
      doctor: 'Dr. Mehmet Öz',
      department: 'Kardiyoloji',
      status: 'Bekliyor',
      time: '10:00'
    },
    {
      id: 2,
      date: '2024-12-15',
      doctor: 'Dr. Ayşe Demir',
      department: 'Dermatoloji',
      status: 'Onaylandı',
      time: '14:30'
    }
  ]);

  // Mobil görünümde kullanılacak menü öğeleri
  const mobileMenuItems = [
    {
      label: 'Profil Bilgileri',
      icon: 'pi pi-user',
      command: () => setActiveDialog('profile')
    },
    {
      label: 'Randevu Al',
      icon: 'pi pi-calendar-plus',
      command: () => setActiveDialog('appointment')
    }
  ];

  const dateBodyTemplate = (rowData) => {
    const date = new Date(rowData.date);
    return (
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span>{date.toLocaleDateString('tr-TR', { 
          day: 'numeric', 
          month: 'long',
          year: 'numeric'
        })}</span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Badge value={rowData.status} severity={
        rowData.status === 'Bekliyor' ? 'warning' :
        rowData.status === 'Onaylandı' ? 'success' :
        'danger'
      } />
    );
  };

  const actionsBodyTemplate = () => {
    return (
      <div className="flex space-x-2">
        <Button
          label="Detaylar"
          className="p-button-outlined p-button-info"
          size="small"
        />
        <Button
          label="İptal Et"
          className="p-button-danger"
          size="small"
        />
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Mobil Header */}
      <div className="sticky top-0 z-50 bg-white shadow-md p-4 md:hidden">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar 
              image="/assets/images/user.jpg"
              size="xlarge" 
              shape="circle"
            />
            <span className="font-semibold">{patient.name}</span>
          </div>
          <Button 
            icon="pi pi-bars" 
            className="p-button-text" 
            onClick={() => setShowMenu(true)}
          />
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="p-4">
        {/* Desktop Profil Kartı */}
        <div className="hidden md:block mb-6">
          <Card className="bg-white shadow-md">
            <div className="flex items-center gap-6">
              <Avatar 
                image="/api/placeholder/150/150"
                size="xlarge" 
                shape="circle"
              />
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p>TC: {patient.id}</p>
                    <p>Doğum Tarihi: {patient.birthDate}</p>
                  </div>
                  <div>
                    <p>Kan Grubu: {patient.bloodType}</p>
                    <p>Tel: {patient.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions - Mobil */}
        <div className="grid grid-cols-2 gap-3 mb-6 md:hidden">
          <Button 
            label="Randevu Al" 
            icon="pi pi-calendar-plus"
            className="p-button-raised"
            onClick={() => setActiveDialog('appointment')}
          />
          <Button 
            label="Sonuçlarım" 
            icon="pi pi-file"
            className="p-button-raised p-button-secondary"
          />
        </div>

        {/* Ana TabView */}
        <TabView className="bg-white shadow-md rounded-lg">
          {/* Randevular Tab */}
          <TabPanel header="Randevular" leftIcon="pi pi-calendar">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Randevularım</h2>
                  <p className="text-gray-600 text-sm mt-1">Yaklaşan randevularınızı görüntüleyin ve yönetin</p>
                </div>
                <Button 
                  label="Yeni Randevu" 
                  icon="pi pi-calendar-plus"
                  className="hidden md:inline-flex"
                />
              </div>

              {/* Mobil görünüm */}
              <div className="md:hidden space-y-4">
                {appointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>

              {/* Desktop görünüm */}
              <div className="hidden md:block">
                <DataTable 
                  value={appointments}
                  className="shadow-sm"
                  stripedRows
                  showGridlines
                  responsiveLayout="scroll"
                >
                  <Column 
                    header="Tarih" 
                    body={dateBodyTemplate}
                    sortable 
                  />
                  <Column 
                    field="doctor" 
                    header="Doktor" 
                    sortable
                  />
                  <Column 
                    field="department" 
                    header="Bölüm"
                    sortable
                  />
                  <Column 
                    field="status" 
                    header="Durum" 
                    body={statusBodyTemplate}
                    sortable
                  />
                  <Column 
                    header="İşlemler" 
                    body={actionsBodyTemplate} 
                    className="w-48"
                  />
                </DataTable>
              </div>
            </div>
          </TabPanel>

          {/* Sağlık Kayıtları Tab */}
          <TabPanel header="Kayıtlar" leftIcon="pi pi-file" className="mb-2">
            <div className="grid grid-cols-1 gap-4 p-4">
              <Card title="Son Sonuçlar" className="shadow-sm">
                <div className="flex flex-col gap-2">
                  {/* Mobil-uyumlu dosya kartları */}
                  <div className="p-3 bg-gray-50 rounded flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <i className="pi pi-file text-blue-500"></i>
                      <div className="flex flex-col">
                        <span className="font-medium">Kan Tahlili</span>
                        <span className="text-sm text-gray-500">01.12.2024</span>
                      </div>
                    </div>
                    <Button icon="pi pi-download" className="p-button-text p-button-sm" />
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <i className="pi pi-file text-blue-500"></i>
                      <div className="flex flex-col">
                        <span className="font-medium">MR Sonucu</span>
                        <span className="text-sm text-gray-500">25.11.2024</span>
                      </div>
                    </div>
                    <Button icon="pi pi-download" className="p-button-text p-button-sm" />
                  </div>
                </div>
              </Card>
            </div>
          </TabPanel>

          {/* Sağlık Göstergeleri Tab */}
          <TabPanel header="Ölçümler" leftIcon="pi pi-chart-line" className="mb-2">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="Tansiyon Takibi" className="shadow-sm">
                  <Chart 
                    type="line" 
                    data={{
                      labels: ['Oca', 'Şub', 'Mar', 'Nis'],
                      datasets: [{
                        label: 'Tansiyon',
                        data: [120, 118, 122, 119],
                        fill: false,
                        borderColor: '#2196F3'
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      height: '200px'
                    }}
                  />
                </Card>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>

      {/* Mobil Menu */}
      <Menu 
        model={mobileMenuItems} 
        popup 
        visible={showMenu} 
        onHide={() => setShowMenu(false)}
        className="w-screen max-w-xs"
      />

      {/* Mobil Dialog'lar */}
      <Dialog 
        visible={activeDialog === 'profile'} 
        onHide={() => setActiveDialog(null)}
        header="Profil Bilgileri"
        className="w-full md:w-6/12 lg:w-4/12"
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-4 mb-4">
          <Avatar 
                image="/api/placeholder/80/80" 
                size="large" 
                shape="circle"
              />
              <div>
                <h3 className="text-xl font-semibold">{patient.name}</h3>
                <p className="text-gray-600">{patient.id}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <p><span className="font-medium">Doğum Tarihi:</span> {patient.birthDate}</p>
              <p><span className="font-medium">Kan Grubu:</span> {patient.bloodType}</p>
              <p><span className="font-medium">Telefon:</span> {patient.phone}</p>
              <p><span className="font-medium">E-posta:</span> {patient.email}</p>
            </div>
          </div>
      </Dialog>
    </div>
  );
};

// PropTypes tanımlamaları
AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    doctor: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    time: PropTypes.string
  }).isRequired
};

export default PatientDashboard;