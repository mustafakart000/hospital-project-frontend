import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Plus } from "lucide-react";
import { Calendar, User, Users, FileText } from "lucide-react";
import DoctorProfile from "./DoctorProfile";
import DoctorAppointments from "./DoctorAppointments";
import DoctorPatients from "./DoctorPatients";
import DoctorPrescriptions from "./DoctorPrescriptions";
import CreateReservationForm from "../patient/CreateReservationForm";
import { useSelector } from "react-redux";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
};

const DoctorPanel = () => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');
  const doctorId = useSelector(state => state.auth.user.id);

  const handleCreate = (values) => {
    console.log("Yeni randevu eklendi:", values);
    setIsCreateModalVisible(false);
  };

  const tabs = [
    { id: 'appointments', label: 'Randevular', icon: Calendar, component: DoctorAppointments },
    { id: 'prescriptions', label: 'Reçeteler', icon: FileText, component: DoctorPrescriptions },
    { id: 'patients', label: 'Hastalar', icon: Users, component: DoctorPatients },
    { id: 'profile', label: 'Profil', icon: User, component: DoctorProfile },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doktor Yönetim Paneli</h1>
            <p className="mt-1 text-sm text-gray-500">
              Randevularınızı, hastalarınızı ve reçetelerinizi yönetin
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalVisible(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Randevu
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Toplam Randevu"
            value="128"
            icon={Calendar}
            color="bg-blue-500"
          />
          <StatCard
            title="Aktif Hastalar"
            value="84"
            icon={Users}
            color="bg-green-500"
          />
          <StatCard
            title="Bugünkü Randevular"
            value="12"
            icon={Calendar}
            color="bg-purple-500"
          />
          <StatCard
            title="Bekleyen Reçeteler"
            value="6"
            icon={FileText}
            color="bg-orange-500"
          />
        </div>

        {/* Main Content with Left Navigation */}
        <div className="flex gap-8">
          {/* Left Navigation */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {tabs.map(({ id, component: Component }) => (
              activeTab === id && <Component key={id} doctorId={doctorId} />
            ))}
          </div>
        </div>

        {/* Reservation Modal */}
        <CreateReservationForm
          visible={isCreateModalVisible}
          onCancel={() => setIsCreateModalVisible(false)}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
};

export default DoctorPanel;