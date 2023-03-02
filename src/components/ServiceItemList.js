import { useEffect, useState } from 'react';
import ServiceItem from './ServiceItem'
import services from "../services"

function ServiceItemList ({setServices}) {
  
  const [serviceItemList, setServiceItemList] = useState([])
  
  function handleChangeServiceName(event, index) {
    let _serviceItemList = [...serviceItemList]
    _serviceItemList[index] = {value: event.target.value, label: event.target.value}
    setServiceItemList(_serviceItemList)
    let _services = [...services, ..._serviceItemList]
    setServices(_services)
  }

  function handleRemoveService(index) {
    let _serviceItemList = [...serviceItemList]
    _serviceItemList.splice(index, 1)
    setServiceItemList(_serviceItemList)
    let _services = [...services, ..._serviceItemList]
    setServices(_services)
  }

  function handleAddService() {
    let _serviceItemList = [...serviceItemList]
    _serviceItemList.push({value: "New Service", label: "New Service"})
    setServiceItemList(_serviceItemList)
    let _services = [...services, ..._serviceItemList]
    console.log('_services', _services)
    setServices(_services)
  }

  return (
    <div>
      <h3 className="text-center mt-5 mb-3">Services</h3>
      <ul>
        <li className="mb-2">General Cleaning</li>
        <li className="mb-2">Wash Clothes</li>
        <li className="mb-2">Maintenance</li>
        {serviceItemList.map((item, index) => (
          <li key={index}><ServiceItem name={item.value} index={index} onChange={handleChangeServiceName} onAdd={handleAddService} onRemove={handleRemoveService} /></li>
        ))}
      </ul>
      <div className="d-flex justify-content-center">
        <button type="button" className="btn btn-secondary" onClick={handleAddService}>Add Service</button>
      </div>
    </div>
  
  )

}

export default ServiceItemList;