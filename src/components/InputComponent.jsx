import React from 'react'

function InputComponent({ label, type, value, onChange, required, logo, name, disabled }) {
  return (
    <div>
        <label className="flex items-center 0-2 text-sm font-medium text-gray-700 mb-2">
            {logo}
            <span className='pl-1'>{label} {required && <span className='text-red-500'>*</span>}</span>
        </label>
        <input
            name={name}  
            type={type}
            value={value}
            onChange={onChange}  
            required={required}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
            placeholder={`Enter your ${label.toLowerCase()}`}
        />
    </div>
  )
}

export default InputComponent