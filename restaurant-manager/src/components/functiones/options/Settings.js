import React from 'react'

function settings() {
  return (
    <div>
        <div>Tax settings</div> {/* Used in: invoices,  */}
        <div>Company name</div>
        <div>Company ID</div>
        <div>Units of measurement</div> {/* Options metric([kg/L], [gr/ml], [gr/dl]) */}
    </div>
  )
}

export default settings