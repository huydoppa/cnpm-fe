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
  CInput,
  CInputFile
} from "@coreui/react";
import request from '../services/request'
import helper from '../services/helper'
import Swal from 'sweetalert2'

const ProductManagement = () => {
  const [productAll, setProductAll] = useState([])
  const [product, setProduct] = useState([]);
  const [productSelected, setProductSelected] = useState({});
  const [productType, setProductType] = useState(PRODUCTTYPE[0]);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [mode, setMode] = useState("VIEW");
  const [input, setInput] = useState("")
  const [isUpdate, setIsUpdate] = useState(0)

  useEffect(() => {
    try {
      let fetchData = async () => {
        let data = [], step = 30;
        for (let i = 0; i < 10; i++) {
          let result = await request.request(`/api/product?skip=${i * step}&limit=30`, '', 'GET')
          if (result.data && result.data.length > 0) {
            data.push(...result.data)
            if (result.data.length < 30) break
          } else break;
        }
        setProductAll(data)
      }
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }, [isUpdate])

  useEffect(() => {
    let p = productAll.filter(e => e.type === productType)
    setProduct(p)
  }, [productAll, productType])

  const handleChangeProduct = (name, value) => {
    let p = { ...productSelected }
    p[name] = value
    setProductSelected(p)
  }
  const handleValidate = () => {
    let result = true;
    for (let f of fields) {
      if (f.key !== 'no' && f.key !== 'actions' && f.key !== 'sale')
        if (!productSelected[f.key]) {
          helper.toast('error', 'Missing ' + f.label)
          result = false
        }
    }
    if (!productSelected.image) {
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
            <h3>Product Management</h3>
          </CCol>
          <CCol>
            <CButton
              color="success"
              className="card-header-actions"
              onClick={() => {
                setMode("CREATE");
                setProductSelected({ type: productType })
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
            <div class="input-group-text">ProductID</div>
          </div>
          <input type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value) }}
            class="form-control" id="inlineFormInputGroupUsername2" placeholder="ProductID" />
          <CButton color="secondary"
            onClick={() => {
              let r = productAll.filter(p => p.idProduct.includes(input.toUpperCase()) && p.type === productType)
              setProduct(r)
            }}
          >Search</CButton>
        </div>
        <CTabs>
          <CNav variant="tabs">
            {PRODUCTTYPE.map((p) => (
              <CNavItem>
                <CNavLink onClick={() => setProductType(p)}>{p}</CNavLink>
              </CNavItem>
            ))}
          </CNav>
        </CTabs>
        <CRow>
          <CCol xs="12">
            <CDataTable
              items={product}
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
                amount: (item) => (
                  <td>
                    {item.amount}
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
                        setProductSelected(item);
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
              <h3>Product Detail</h3>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setShowModalDetail(false);
                  setMode("VIEW");
                  setProductSelected({});
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
                    style={{
                      border: "1px solid #bbb",
                      boxShadow: "0px 0px 5px #888",
                      maxHeight: "400px",
                    }}
                    src={
                      productSelected.image
                        ? productSelected.image
                        : "https://thailamlandscape.vn/wp-content/uploads/2017/10/no-image.png"
                    }
                  />
                  {mode !== "VIEW" && (
                    <CInputFile
                      onChange={async (e) => {
                        let formData = new FormData();
                        formData.append('file', e.target.files[0])
                        let result = await request.upload(formData)
                        if (result.e) return helper.toast('error', 'upload error')
                        handleChangeProduct('image', result.location)
                      }}
                    />
                  )}
                </CCol>
                <CCol xs="12" lg="6" style={{ padding: "10px 20px" }}>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel style={{ fontWeight: "bold" }}>ProductID</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      {mode === "VIEW" ? (
                        <p className="form-control-static">
                          {productSelected.idProduct}
                        </p>
                      ) : (
                        <CInput
                          id="text-input"
                          name="text-input"
                          value={productSelected.idProduct}
                          placeholder="Text"
                          onChange={(e) => handleChangeProduct("idProduct", e.target.value)}
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
                          {productSelected.name}
                        </p>
                      ) : (
                        <CInput
                          id="text-input"
                          name="text-input"
                          value={productSelected.name}
                          placeholder="Text"
                          onChange={(e) => handleChangeProduct("name", e.target.value)}
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
                          {productSelected.price}
                        </p>
                      ) : (
                        <CInput
                          type="number"
                          id="text-input"
                          name="text-input"
                          value={productSelected.price}
                          placeholder="Number"
                          onChange={(e) => handleChangeProduct("price", e.target.value)}
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
                          {productSelected.promoPrice}
                        </p>
                      ) : (
                        <CInput
                          type="number"
                          id="text-input"
                          name="text-input"
                          value={productSelected.promoPrice}
                          placeholder="Number"
                          onChange={(e) => handleChangeProduct("promoPrice", e.target.value)}
                        />
                      )}
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel style={{ fontWeight: "bold" }}>Amount</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      {mode === "VIEW" ? (
                        <p className="form-control-static">
                          {productSelected.amount}
                        </p>
                      ) : (
                        <CInput
                          type="number"
                          id="text-input"
                          name="text-input"
                          value={productSelected.amount}
                          placeholder="Number"
                          onChange={(e) => handleChangeProduct("amount", e.target.value)}
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
                          {productSelected.desc}
                        </p>
                      ) : (
                        <CInput
                          id="text-input"
                          name="text-input"
                          value={productSelected.desc}
                          placeholder="Text"
                          onChange={(e) => handleChangeProduct("description", e.target.value)}
                        />
                      )}
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel style={{ fontWeight: "bold" }}>Type</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <p className="form-control-static">
                        {mode !== "CREATE" ? productSelected.type : productType}
                      </p>
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
                          let result = await request.request('/api/product/' + productSelected.id,
                            productSelected, "DELETE")
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
                    let result = await request.request('/api/product/' + productSelected.id,
                      productSelected, "PATCH")
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
                    let result = await request.request('/api/product', productSelected)
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
export default ProductManagement;

const fields = [
  { key: "no", label: "No", _style: { width: "5%" } },
  { key: "idProduct", label: "Product ID", _style: { width: "15%" } },
  { key: "name", label: "Name", _style: { width: "20%" } },
  { key: "price", label: "Price", _style: { width: "20%" } },
  { key: "promoPrice", label: "Promo Price", _style: { width: "20%" } },
  { key: "sale", label: "Sale", _style: { width: "10%" } },
  { key: "amount", label: "Amount", _style: { width: "10%" } },
  { key: "actions", _style: { width: "10%" } },
];
const PRODUCTTYPE = ["Thuc an", "Quan Ao", "Chuong", "Phu kien", "Dung cu ve sinh", "Thuoc", "Do choi", "Lam dep"];