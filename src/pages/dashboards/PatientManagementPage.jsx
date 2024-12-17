import React from 'react'
import { useSelector } from 'react-redux'

import PatientDashboard from '../../components/patient/PatientDashboard'
import CreateReservationForm from '../../components/patient/CreateReservationForm'


const PatientManagementPage = () => {

  const { currentOperation } = useSelector(state => state.misc)
  
  return (
    <>
      {currentOperation === 'new' && <CreateReservationForm />}
      <PatientDashboard />
    </>
  )
}

export default PatientManagementPage