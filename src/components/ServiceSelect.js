import React, {useEffect, useState} from 'react';
import Select, { InputActionMeta } from 'react-select';

function ServiceSelect({services, selectedServices, setServicesForEvent}) {
  console.log('services', services);
  
  const [serviceOptions, setServiceOptions] = useState([])
  const [selectedServicesOptions, setSelectedServicesOptions] = useState([])

  const [menuIsOpen, setMenuIsOpen] = useState();
  const [selectedValue, setSelectedValue] = useState([])

  const onInputChange = (
    inputValue,
    { action, prevInputValue }
  ) => {
    if (action === 'input-change') return inputValue;
    if (action === 'menu-close') {
      if (prevInputValue) setMenuIsOpen(true);
      else setMenuIsOpen(undefined);
    }
    return prevInputValue;
  };

  const handleChange = (e) => {
    let tmpValue = Array.isArray(e) ? e.map(x => x.value) : []
    let _selectedServicesOptions = []
    for (let i = 0; i < tmpValue.length; i++) {
      _selectedServicesOptions.push({value: tmpValue[i], label: tmpValue[i]})
    }
    setServicesForEvent(_selectedServicesOptions)
  }

  return (
    <Select
      isMulti
      defaultValue={selectedServices}
      isClearable
      isSearchable
      onInputChange={onInputChange}
      onChange={handleChange}
      name="service"
      options={services}
      menuIsOpen={menuIsOpen}
    />
  );
};

export default ServiceSelect;