import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'

function ReceiptItem() {
  return (
    <div>
        <ListGroup.Item className="d-flex justify-content-between align-items-start">
          <div className='ms-2 me-auto' id='itemContent'>
            <div className='fw-bold'>
              Subheading
            </div>
            Content for list item
          </div>
          <Badge bg='primary' className='rounded-pill'>14</Badge>
        </ListGroup.Item>
    </div>
  )
}

export default ReceiptItem