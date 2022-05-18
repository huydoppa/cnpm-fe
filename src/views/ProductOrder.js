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
import request from '../services/request'
import Swal from 'sweetalert2'
const ProductOrder = () => {
  const [productOrderAll, setProductOrderAll] = useState([]);
  const [productOrder, setProductOrder] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [productOrderSelected, setProductOrderSelected] = useState({});
  const [productOrderType, setProductOrderType] = useState(PRODUCTORDERTYPE[0]);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [isUpdate, setIsUpdate] = useState(0)
  useEffect(() => {
    let fetchData = async () => {
      try {
        let result = await request.request('/api/productorder?sort=createdAt DESC', '', 'GET')
        setProductOrderAll(result.data)
        
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [isUpdate])
  useEffect(() => {
    console.log(productOrderAll)
    let p = productOrderAll.filter(e => e.status === productOrderType)
    
    setProductOrder(p)
  }, [productOrderType, productOrderAll])

  const convertTime = (t) => {
    let tm = new Date(t)
    return tm.toDateString()
  }

  const handleClickDetail = async (t) => {
    try {
      let pd = await request.request(`/api/productorderdetail?idProductOrder=${t.idProductOrder}`, {}, 'GET')
      setProductOrderSelected(t)
      console.log(pd)
      setOrderDetail(pd.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <CCard accentColor="success">
      <CCardHeader>
        <CRow>
          <CCol>
            <h3>Product Order</h3>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CTabs>
          <CNav variant="tabs">
            {PRODUCTORDERTYPE.map((p) => (
              <CNavItem>
                <CNavLink onClick={() => setProductOrderType(p)}>{p}</CNavLink>
              </CNavItem>
            ))}
          </CNav>
        </CTabs>
        <CRow>
          <CCol xs="12">
            <CDataTable
              items={productOrder}
              fields={fields}
              striped
              border
              itemsPerPage={5}
              pagination
              scopedSlots={{
                actions: (item) => (
                  <td>
                    <CButton
                      onClick={() => {
                        handleClickDetail(item)
                        setProductOrderSelected(item);
                        setShowModalDetail(true);
                      }}
                      color="primary"
                    >
                      Detail
                    </CButton>
                  </td>
                ),
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

        <CModal show={showModalDetail} size="xl">
          <CModalHeader>
            <h3>Product Detail</h3>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setShowModalDetail(false);
                setProductOrderSelected({});
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </CModalHeader>
          <CModalBody style={{ padding: "20px" }}>
            <CRow>
              <CCol xs="0" lg="3"></CCol>
              <CCol xs="12" lg="8">
                <CFormGroup row style={{ margin: "0px" }}>
                  <CCol md="3">
                    <CLabel style={{ fontWeight: "bold" }}>Order ID</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      {productOrderSelected.idProductOrder}
                    </p>
                  </CCol>
                </CFormGroup>
                <CFormGroup row style={{ margin: "0px" }}>
                  <CCol md="3">
                    <CLabel style={{ fontWeight: "bold" }}>Name</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      {productOrderSelected.name}
                    </p>
                  </CCol>
                </CFormGroup>
                <CFormGroup row style={{ margin: "0px" }}>
                  <CCol md="3">
                    <CLabel style={{ fontWeight: "bold" }}>phone</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      {productOrderSelected.phone}
                    </p>
                  </CCol>
                </CFormGroup>
                <CFormGroup row style={{ margin: "0px" }}>
                  <CCol md="3">
                    <CLabel style={{ fontWeight: "bold" }}>Address</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      {productOrderSelected.address}
                    </p>
                  </CCol>
                </CFormGroup>
                <CFormGroup row style={{ margin: "0px" }}>
                  <CCol md="3">
                    <CLabel style={{ fontWeight: "bold" }}>Total Price</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">
                      {productOrderSelected.totalPrice}
                    </p>
                  </CCol>
                </CFormGroup>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs="12">
                <CDataTable
                  items={orderDetail || []}
                  fields={productFields}
                  striped
                  border
                  itemsPerPage={20}
                  pagination
                  scopedSlots={{
                    no: (item, index) => (
                      <td>{index + 1}</td>
                    )
                  }}
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            {productOrderType === "pending" && (
              <>
                <CButton color="info"
                  onClick={async () => {
                    Swal.fire({
                      title: 'Are you sure?',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, it has been delivered!'
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        let result = await request.request(`/api/productOrder/${productOrderSelected.id}`,
                          { status: 'delivered' },
                          "PATCH"
                        )
                        setIsUpdate(isUpdate + 1)
                        setShowModalDetail(false)
                        Swal.fire(
                          'Delivered!',
                          'success'
                        )
                      }
                    })

                  }}>
                  delivered
                </CButton>
                <CButton
                  color="danger"
                  onClick={async () => {
                    Swal.fire({
                      title: 'Are you sure?',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, cancel it!'
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        let result = await request.request(`/api/productOrder/${productOrderSelected.id}`,
                          { status: 'cancel' },
                          "PATCH"
                        )
                        setIsUpdate(isUpdate + 1)
                        setShowModalDetail(false)
                        Swal.fire(
                          'Canceled!',
                          'success'
                        )
                      }
                    })
                  }}
                >
                  cancel
                </CButton>
              </>
            )}
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard >
  );
};
export default ProductOrder;
const productFields = [
  { key: "no", label: "No", _style: { width: "5%" } },
  { key: "idProduct", label: "Product Order ID", _style: { width: "20%" } },
  { key: "name", label: "Product Name", _style: { width: "20%" } },
  { key: "price", label: "Price", _style: { width: "20%" } },
  { key: "amount", label: "Amount", _style: { width: "20%" } },
];
const fields = [
  { key: "no", label: "No", _style: { width: "5%" } },
  { key: "idProductOrder", label: "Order ID", _style: { width: "10%" } },
  { key: "idCustomer", label: "Customer ID", _style: { width: "10%" } },
  { key: "name", label: "Name", _style: { width: "10%" } },
  { key: "address", label: "Address", _style: { width: "20%" } },
  { key: "totalPrice", label: "Total Price", _style: { width: "10%" } },
  { key: "createdAt", label: "Order Date", _style: { width: "10%" } },
  { key: "actions", _style: { width: "5%" } },
];
const PRODUCTORDERTYPE = ["pending", "delivered", "cancel"];