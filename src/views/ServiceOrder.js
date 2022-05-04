import React, { useState, useEffect } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CDataTable,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CFormGroup,
  CLabel,
} from "@coreui/react";
import request from "../services/request";
const ServiceOrder = () => {
  const [serviceOrder, setServiceOrder] = useState([]);
  useEffect(() => {
    let fetchData = async () => {
      let result = await request.request('/api/serviceorder', '', 'GET')
      setServiceOrder(result.data)
    }
    fetchData()
  }, [])
  const convertTime = (t) => {
    let tm = new Date(t)
    console.log(tm, t)
    return tm.toDateString()
  }
  return (
    <CCard accentColor="success">
      <CCardHeader>
        <CRow>
          <CCol>
            <h3>Service Order</h3>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol xs="12">
            <CDataTable
              items={serviceOrder}
              fields={fields}
              striped
              border
              itemsPerPage={10}
              pagination
              scopedSlots={{
                no: (item, index) => (
                  <td>{index + 1}</td>
                ),
                createdAt: (item) => (
                  <td>{convertTime(item.createdAt)}</td>
                ),
              }}
            />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};
export default ServiceOrder;

const fields = [
  { key: "no", label: "No", _style: { width: "5%" } },
  { key: "idServiceOrder", label: "Order ID", _style: { width: "7%" } },
  { key: "idCustomer", label: "Customer ID", _style: { width: "8%" } },
  { key: "nameService", label: "Name Service", _style: { width: "10%" } },
  { key: "nameCustomer", label: "Name Customer", _style: { width: "10%" } },
  { key: "address", label: "Address", _style: { width: "20%" } },
  { key: "time", label: "Time", _style: { width: "10%" } },
  { key: "price", label: "Price", _style: { width: "7%" } },
  { key: "promoPrice", label: "Promo Price", _style: { width: "8%" } },
  { key: "createdAt", label: "Order Date", _style: { width: "10%" } },
  // { key: "actions", _style: { width: "5%" } },
];
