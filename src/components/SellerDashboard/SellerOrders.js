import React, { useState } from 'react'
import SellerOrder from './SellerOrder'
import ProcessOrder from './ProcessOrder';


const SellerOrders = (props) => {

  const [processOrder, setProcessOrder] = useState({ tab: false, order: {} })

  function setEditProduct(order) {
    setProcessOrder({ tab: true, order: order });
  }
  function backToOrders() {
    setProcessOrder({ tab: false, order: {} });
  }
  function updateOrderStatus(id) {
    props.updateOrderStatus(id);
    setProcessOrder(prev => ({
      tab: prev.tab,
      order: {
        ...prev.order,
        status: prev.order.status + 1
      }
    }))
  }

  return (
    <div>
      {processOrder.tab ? (
        <ProcessOrder order={processOrder.order} backToOrders={backToOrders} updateOrderStatus={updateOrderStatus} />
      ) : (
        <div className='space-y-6'>
          {props.orders.map((order, index) => (
            <SellerOrder key={index} order={order} setProcess={setEditProduct} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SellerOrders