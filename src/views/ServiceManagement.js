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
  CFormGroup,
  CLabel,
  CInput,
  CInputFile
} from "@coreui/react";
import request from '../services/request'
import helper from '../services/helper'
import Swal from 'sweetalert2'

const ServiceManagement = () => {
  const [Service, setService] = useState([]);
  const [serviceSelected, setServiceSelected] = useState({});
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [isUpdate, setIsUpdate] = useState(0)
  const [mode, setMode] = useState("VIEW");
  const [input, setInput] = useState("")
  useEffect(() => {
    let fetchData = async () => {
      let result = await request.request('/api/service', '', 'GET')
      setService(result.data)
    }
    fetchData()
  }, [isUpdate])
  const handleChangeService = (name, value) => {
    let p = { ...serviceSelected }
    p[name] = value
    setServiceSelected(p)
  }
  const handleValidate = () => {
    let result = true;
    for (let f of fields) {
      if (f.key !== 'no' && f.key !== 'actions' && f.key !== 'sale')
        if (!serviceSelected[f.key]) {
          helper.toast('error', 'Missing ' + f.label)
          result = false
        }
    }
    if (!serviceSelected.image) {
      helper.toast('error', 'Missing Image')
      result = false
    }
    return result
  }
  return (
    <CCard accentColor="success">
      <CCardHeader>
        <CRow>
          <CCol>
            <h3>Service Management</h3>
          </CCol>
          <CCol>
            <CButton color="success" className="card-header-actions"
              onClick={() => {
                setMode('CREATE')
                setServiceSelected({})
                setShowModalDetail(true);
              }}
            >
              Create
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <div class="input-group mb-2 mr-sm-2" style={{ width: "300px" }}>
          <div class="input-group-prepend">
            <div class="input-group-text">ServiceID</div>
          </div>
          <input type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value) }}
            class="form-control" id="inlineFormInputGroupUsername2" placeholder="ServiceID" />
          <CButton color="secondary"
            onClick={() => {
              let r = Service.filter(p => p.idService.includes(input.toUpperCase()))
              setService(r)
            }}
          >Search</CButton>
        </div>
        <CRow>
          <CCol xs="12">
            <CDataTable
              items={Service}
              fields={fields}
              striped
              border
              itemsPerPage={5}
              pagination
              scopedSlots={{
                no: (item, index) => (
                  <td>{index + 1}</td>
                ),
                sale: (item) => (
                  <td>
                    <h4>
                      <CBadge color="danger">
                        {Math.floor(
                          100 - (item.promoPrice / item.price) * 100
                        ) + "%"}
                      </CBadge>
                    </h4>
                  </td>
                ),
                price: (item) => (
                  <td>
                    {item.price}
                  </td>
                ),
                promoPrice: (item) => (
                  <td>
                    {item.promoPrice}
                  </td>
                ),
                actions: (item) => (
                  <td>
                    <CButton
                      onClick={() => {
                        setMode("VIEW")
                        setServiceSelected(item);
                        setShowModalDetail(true);
                      }}
                      color="primary"
                    >
                      Detail
                    </CButton>
                  </td>
                ),
              }}
            />
          </CCol>
        </CRow>

        {showModalDetail &&
          <CModal show={showModalDetail} size="xl">
            <CModalHeader>
              <h3>Service Detail</h3>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setShowModalDetail(false);
                  setMode("VIEW");
                  setServiceSelected({})
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol xs="12" lg="6" style={{ borderRight: "1px solid #bbb" }}>
                  <img
                    width="100%"
                    src={serviceSelected.image ? serviceSelected.image : "https://thailamlandscape.vn/wp-content/uploads/2017/10/no-image.png"}
                    style={{
                      border: "1px solid #bbb",
                      boxShadow: "0px 0px 5px #888",
                      maxHeight: "400px"
                    }}
                  />
                  {mode !== "VIEW" && (
                    <CInputFile
                      onChange={async (e) => {
                        let formData = new FormData();
                        formData.append('file', e.target.files[0])
                        let result = await request.upload(formData)
                        if (result.e) return helper.toast('error', 'upload error')
                        handleChangeService('image', result.location)
                      }}
                    />
                  )}
                </CCol>
                <CCol xs="12" lg="6" style={{ padding: "10px 20px" }}>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel style={{ fontWeight: "bold" }}>ServiceID</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      {mode === "VIEW" ? (
                        <p className="form-control-static">
                          {serviceSelected.idService}
                        </p>
                      ) : (
                        <CInput
                          id="text-input"
                          name="text-input"
                          value={serviceSelected.idService}
                          placeholder="Text"
                          onChange={(e) => handleChangeService("idService", e.target.value)}
                        />
                      )}
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel style={{ fontWeight: "bold" }}>Name</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      {mode === "VIEW" ? (
                        <p className="form-control-static">
                          {serviceSelected.name}
                        </p>
                      ) : (
                        <CInput
                          id="text-input"
                          name="text-input"
                          value={serviceSelected.name}
                          placeholder="Text"
                          onChange={(e) => handleChangeService("name", e.target.value)}
                        />
                      )}
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel style={{ fontWeight: "bold" }}>Supplier</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      {mode === "VIEW" ? (
                        <p className="form-control-static">
                          {serviceSelected.supplier}
                        </p>
                      ) : (
                        <CInput
                          id="text-input"
                          name="text-input"
                          value={serviceSelected.supplier}
                          placeholder="Text"
                          onChange={(e) => handleChangeService("supplier", e.target.value)}
                        />
                      )}
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel style={{ fontWeight: "bold" }}>Address</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      {mode === "VIEW" ? (
                        <p className="form-control-static">
                          {serviceSelected.address}
                        </p>
                      ) : (
                        <CInput
                          id="text-input"
                          name="text-input"
                          value={serviceSelected.address}
                          placeholder="Text"
                          onChange={(e) => handleChangeService("address", e.target.value)}
                        />
                      )}
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel style={{ fontWeight: "bold" }}>Price</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      {mode === "VIEW" ? (
                        <p className="form-control-static">
                          {serviceSelected.price}
                        </p>
                      ) : (
                        <CInput
                          type="number"
                          id="text-input"
                          name="text-input"
                          value={serviceSelected.price}
                          placeholder="Number"
                          onChange={(e) => handleChangeService("price", e.target.value)}
                        />
                      )}
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel style={{ fontWeight: "bold" }}>Promo Price</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      {mode === "VIEW" ? (
                        <p className="form-control-static">
                          {serviceSelected.promoPrice}
                        </p>
                      ) : (
                        <CInput
                          type="number"
                          id="text-input"
                          name="text-input"
                          value={serviceSelected.promoPrice}
                          placeholder="Number"
                          onChange={(e) => handleChangeService("promoPrice", e.target.value)}
                        />
                      )}
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel style={{ fontWeight: "bold" }}>Description</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      {mode === "VIEW" ? (
                        <p className="form-control-static">
                          {serviceSelected.description}
                        </p>
                      ) : (
                        <CInput
                          id="text-input"
                          name="text-input"
                          type="textarea"
                          value={serviceSelected.description}
                          placeholder="text"
                          onChange={(e) => handleChangeService("description", e.target.value)}
                        />
                      )}
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              {mode === "VIEW" && (
                <>
                  <CButton color="primary" onClick={() => setMode("EDIT")}>
                    Edit
                  </CButton>

                  <CButton
                    color="danger"
                    onClick={async () => {
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          let result = await request.request('/api/service/' + serviceSelected.id,
                            serviceSelected, "DELETE")
                          if (result.e) return helper.toast('error', 'error')
                          setIsUpdate(isUpdate + 1)
                          setShowModalDetail(false)
                          Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                          )
                        }
                      })
                    }}
                  >
                    Delete
                  </CButton>
                </>
              )}
              {mode === "EDIT" && (
                <>
                  <CButton color="success" onClick={async () => {
                    if (!handleValidate()) return
                    let result = await request.request('/api/service/' + serviceSelected.id,
                      serviceSelected, "PATCH")
                    if (result.e) return helper.toast('error', 'error')
                    setIsUpdate(isUpdate + 1)
                    setShowModalDetail(false)
                    helper.toast('success', 'Update successfully!!!')
                  }}>
                    Update
                  </CButton>
                </>
              )}
              {mode === "CREATE" && (
                <>
                  <CButton color="success" onClick={async () => {
                    if (!handleValidate()) return
                    let result = await request.request('/api/service', serviceSelected)
                    if (result.e) return helper.toast('error', 'error')
                    setIsUpdate(isUpdate + 1)
                    setShowModalDetail(false)
                    helper.toast('success', 'Create successfully!!!')
                  }}>
                    Create
                  </CButton>
                </>
              )}
            </CModalFooter>
          </CModal>
        }
      </CCardBody>
    </CCard>
  );
};
export default ServiceManagement;

const fields = [
  { key: "no", label: "No", _style: { width: "5%" } },
  { key: "idService", label: "Service ID", _style: { width: "15%" } },
  { key: "name", label: "Name", _style: { width: "15%" } },
  { key: "supplier", label: "Supplier", _style: { width: "15%" } },
  { key: "address", label: "Address", _style: { width: "20%" } },
  { key: "price", label: "Price", _style: { width: "15%" } },
  { key: "promoPrice", label: "Promo Price", _style: { width: "15%" } },
  { key: "sale", label: "Sale", _style: { width: "10%" } },
  { key: "actions", _style: { width: "10%" } },
];