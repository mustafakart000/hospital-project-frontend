import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import PatientDashboard from '../../components/patient/PatientDashboard'

const PatientManagementPage = () => {
  const currentOperation = useSelector(state => state.misc.currentOperation)
  
  useEffect(() => {
    // Değerin gelip gelmediğini kontrol edelim
    console.log("currentOperation değeri:", currentOperation)
    console.log("currentOperation tipi:", typeof currentOperation)
  }, [currentOperation])

  return (
    <>
      <PatientDashboard />
    </>
  )
}

export default PatientManagementPage