import React, { lazy } from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import MainChartExample from '../charts/MainChartExample.js'

const Dashboard = () => {
  return (
    <>
      <CCard>
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h3 id="traffic" className="card-title mb-0">Doanh Thu</h3>
            </CCol>
            <CCol sm="7" className="d-none d-md-block">
              <CButtonGroup className="float-right mr-3">
                {
                  ['Day', 'Week', 'Month'].map(value => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      active={value === 'Week'}
                    >
                      {value}
                    </CButton>
                  ))
                }
              </CButtonGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="12">
              <h4 id="traffic" className="card-title mb-0">99.000.000 VND</h4>
            </CCol>
          </CRow>
          <MainChartExample styles={{ height: '500px', marginTop: '40px' }} />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
