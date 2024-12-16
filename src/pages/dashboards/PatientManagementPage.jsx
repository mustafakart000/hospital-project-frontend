import React from 'react'
import { useSelector } from 'react-redux'
import NewReservation from '../../components/patient/NewReservation'
import PatientDashboard from '../../components/patient/PatientDashboard'


const PatientManagementPage = () => {

  const { currentOperation } = useSelector(state => state.misc)
  
  return (
    <>
      {currentOperation === 'new' && <NewReservation />}
      <PatientDashboard />
    </>
  )
}

export default PatientManagementPage