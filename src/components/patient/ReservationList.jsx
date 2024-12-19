import React from "react";
import { Row, Col, Spin } from "antd";
import ReservationCard from "./ReservationCard";
import PropTypes from 'prop-types';

const ReservationList = ({ reservations, loading, onDelete, onEdit }) => {
  return (
    <Spin spinning={loading} tip="Yükleniyor..." size="large">
      <Row gutter={[16, 16]} justify="center">
        {reservations.map((res) => (
          <Col xs={24} sm={12} md={8} lg={6} key={res.id}>
            <ReservationCard
              reservation={res}
              onDelete={onDelete}
              onEdit={() => onEdit(res)}
            />
          </Col>
        ))}
      </Row>
    </Spin>
  );
};

ReservationList.propTypes = {
  reservations: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default ReservationList;
