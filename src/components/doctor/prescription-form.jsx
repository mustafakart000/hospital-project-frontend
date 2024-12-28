import { Modal } from 'antd'
import React from 'react'

const PrescriptionForm = () => {
  return (
    <div>
      <Modal
        open={true}
        onCancel={() => {}}
        onOk={() => {}}
      >
        <div>
          <h1>Reçete Oluştur</h1>
        </div>
      </Modal>
    </div>
  )
}

export default PrescriptionForm