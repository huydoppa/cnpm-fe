import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <span className="ml-1">Team 9 &copy;</span>
      </div>
      <div className="mfs-auto">
        <a href="javascript:alert('github')" target="_blank" rel="noopener noreferrer">Github</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
