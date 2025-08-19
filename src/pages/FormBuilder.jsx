import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Eye, 
  Copy, 
  Type, 
  Mail, 
  Phone, 
  Calendar, 
  ToggleLeft, 
  List, 
  Upload, 
  AlignLeft,
  GripVertical
} from 'lucide-react';


const FormBuilder = () => {
  const [formFields, setFormFields] = useState([
    {
      id: '1',
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true
    },
    {
      id: '2',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true
    }
  ]);

  const [selectedField, setSelectedField] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formTitle, setFormTitle] = useState('Visitor Registration Form');

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: Type },
    { type: 'email', label: 'Email', icon: Mail },
    { type: 'tel', label: 'Phone', icon: Phone },
    { type: 'date', label: 'Date', icon: Calendar },
    { type: 'textarea', label: 'Long Text', icon: AlignLeft },
    { type: 'select', label: 'Dropdown', icon: List },
    { type: 'checkbox', label: 'Checkbox', icon: ToggleLeft },
    { type: 'file', label: 'File Upload', icon: Upload }
  ];

  const addField = (type) => {
    const newField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}`,
      required: false,
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined
    };
    setFormFields([...formFields, newField]);
    setSelectedField(newField);
  };

  const updateField = (fieldId, updates) => {
    setFormFields(fields =>
      fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  const deleteField = (fieldId) => {
    setFormFields(fields => fields.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const moveField = (fieldId, direction) => {
    const index = formFields.findIndex(field => field.id === fieldId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formFields.length - 1)
    ) {
      return;
    }

    const newFields = [...formFields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setFormFields(newFields);
  };

  const duplicateField = (fieldId) => {
    const field = formFields.find(f => f.id === fieldId);
    if (field) {
      const duplicatedField = {
        ...field,
        id: Date.now().toString(),
        label: `${field.label} (Copy)`
      };
      setFormFields([...formFields, duplicatedField]);
    }
  };

  const saveForm = () => {
    alert('Form saved successfully! In a real application, this would save to a backend.');
  };

  const renderFieldPreview = (field) => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            className={`${baseClasses} h-24 resize-none`}
            disabled
          />
        );
      case 'select':
        return (
          <select className={baseClasses} disabled>
            <option>Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled
            />
            <label className="text-gray-700">{field.label}</label>
          </div>
        );
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-500">Click to upload file</span>
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className={baseClasses}
            disabled
          />
        );
    }
  };

  if (showPreview) {
    return (
      <div className="min-h-screen gradient-bg p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Form Preview</h1>
            <button
              onClick={() => setShowPreview(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Back to Editor
            </button>
          </div>

          <div className="card-pos">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {formTitle}
            </h2>
            
            <form className="space-y-6">
              {formFields.map((field) => (
                <div key={field.id}>
                  {field.type !== 'checkbox' && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  )}
                  {renderFieldPreview(field)}
                </div>
              ))}
              
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                disabled
              >
                Submit Form
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Form Builder
            </h1>
            <p className="text-gray-600">
              Create custom visitor registration forms
            </p>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            
            <button
              onClick={saveForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg inline-flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Form</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Field Types Panel */}
          <div className="card-pos">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Field Types
            </h3>
            
            <div className="space-y-2">
              {fieldTypes.map((fieldType) => (
                <button
                  key={fieldType.type}
                  onClick={() => addField(fieldType.type)}
                  className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-blue-50  hover:border-blue-300 transition-colors group"
                >
                  <fieldType.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-700">
                    {fieldType.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Builder */}
          <div className="lg:col-span-2">
            <div className="card-pos">
              {/* Form Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-lg font-semibold"
                />
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {formFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`p-4 border-2 rounded-lg transition-colors cursor-pointer ${
                      selectedField?.id === field.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedField(field)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {field.label}
                        </span>
                        {field.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(field.id, 'up');
                          }}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(field.id, 'down');
                          }}
                          disabled={index === formFields.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          ↓
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateField(field.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteField(field.id);
                          }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {renderFieldPreview(field)}
                  </div>
                ))}
                
                {formFields.length === 0 && (
                  <div className="text-center py-12">
                    <Type className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No fields added yet. Select a field type from the left panel to get started.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Field Properties Panel */}
          <div className="card-pos">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Field Properties
            </h3>
            
            {selectedField ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={selectedField.label}
                    onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>
                
                {selectedField.type !== 'checkbox' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      value={selectedField.placeholder || ''}
                      onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedField.required}
                    onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    Required field
                  </label>
                </div>
                
                {selectedField.type === 'select' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options (one per line)
                    </label>
                    <textarea
                      value={selectedField.options?.join('\n') || ''}
                      onChange={(e) => updateField(selectedField.id, { 
                        options: e.target.value.split('\n').filter(o => o.trim()) 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 h-24"
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Edit className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  Select a field to edit its properties
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;