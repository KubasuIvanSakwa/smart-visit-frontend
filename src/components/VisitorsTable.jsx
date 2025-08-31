import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Search, Edit3, MoreVertical } from 'lucide-react';

const VisitorsTable = ({ visitors = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 5;

  // Filter visitors based on search term
  const filteredVisitors = visitors.filter(visitor =>
    (visitor.name || `${visitor.first_name} ${visitor.last_name}` || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visitor.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visitor.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visitor.purpose || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVisitors = filteredVisitors.slice(startIndex, startIndex + itemsPerPage);

  // Generate avatar with initials
  const getAvatar = (name) => {
    if (!name) return null;
    const initials = name.split(' ').map(n => n[0]).join('');
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ];
    const colorIndex = name.length % colors.length;
    
    return (
      <div className={`w-8 h-8 rounded-full flex-shrink-0 ${colors[colorIndex]} flex items-center justify-center text-white text-xs font-medium`}>
        {initials}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'IM': { text: 'In Meeting', class: 'bg-blue-100 text-blue-800' },
      'CI': { text: 'Checked In', class: 'bg-green-100 text-green-800' },
      'CO': { text: 'Checked Out', class: 'bg-gray-100 text-gray-800' },
      'W': { text: 'Waiting', class: 'bg-yellow-100 text-yellow-800' }
    };

    const config = statusConfig[status] || statusConfig['CO'];
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        <span className="hidden sm:inline">{config.text}</span>
        <span className="sm:hidden">{status}</span>
      </span>
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedVisitors.map(v => v.id));
    }
    setSelectAll(!selectAll);
  };

  const handleItemSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="rounded-lg shadow-md lg:mt-[-10rem]">
      {/* Search Header */}
      <h4 className='font-bold text-xl pl-3'>Visitors</h4>
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container with proper scrolling */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{minWidth: '600px'}}>
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4 w-10">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <label className="sr-only">Select all</label>
                  </div>
                </th>
                <th scope="col" className="px-3 py-3 min-w-[200px] sm:min-w-0">
                  <span className="hidden sm:inline">Visitor Details</span>
                  <span className="sm:hidden">Visitor</span>
                </th>
                <th scope="col" className="px-3 py-3 hidden md:table-cell">
                  Company
                </th>
                <th scope="col" className="px-3 py-3 hidden lg:table-cell">
                  Purpose
                </th>
                <th scope="col" className="px-3 py-3 min-w-[80px]">
                  <span className="hidden sm:inline">Check In/Out</span>
                  <span className="sm:hidden">Time</span>
                </th>
                <th scope="col" className="px-3 py-3 min-w-[70px]">
                  Status
                </th>
                <th scope="col" className="px-3 py-3 w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedVisitors.map((visitor) => (
                <tr key={visitor.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        checked={selectedItems.includes(visitor.id)}
                        onChange={() => handleItemSelect(visitor.id)}
                      />
                      <label className="sr-only">Select visitor</label>
                    </div>
                  </td>
                  <th scope="row" className="px-3 py-4 font-medium text-gray-900">
                    <div className="flex items-center space-x-3">
                      {getAvatar(visitor.first_name && visitor.last_name ? `${visitor.first_name} ${visitor.last_name}` : visitor.name)}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{visitor.first_name && visitor.last_name ? `${visitor.first_name} ${visitor.last_name}` : visitor.name}</div>
                        <div className="text-sm text-gray-500 truncate">{visitor.email}</div>
                        {/* Show company on mobile in visitor details */}
                        <div className="md:hidden text-xs text-gray-400 truncate mt-1">{visitor.company}</div>
                      </div>
                    </div>
                  </th>
                  <td className="px-3 py-4 hidden md:table-cell">
                    <div className="truncate">{visitor.company}</div>
                  </td>
                  <td className="px-3 py-4 hidden lg:table-cell">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 truncate">{visitor.purpose}</div>
                      <div className="text-gray-500">{visitor.check_in_time ? new Date(visitor.check_in_time).toLocaleDateString() : ''}</div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-xs">
                      <div className="text-green-600">
                        <span className="hidden sm:inline">In: </span>
                        <span className="sm:hidden">I: </span>
                        {visitor.check_in_time ? new Date(visitor.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                      </div>
                      <div className="text-red-600">
                        <span className="hidden sm:inline">Out: </span>
                        <span className="sm:hidden">O: </span>
                        {visitor.check_out_time ? new Date(visitor.check_out_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    {getStatusBadge(visitor.status)}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {/* Mobile-Friendly Pagination */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-gray-900">{Math.min(startIndex + itemsPerPage, filteredVisitors.length)}</span> of{' '}
            <span className="font-semibold text-gray-900">{filteredVisitors.length}</span> Results
          </div>
          
          <div className="flex justify-center sm:justify-end">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 py-1 text-sm leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              
              <div className="flex">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center px-3 py-1 text-sm leading-tight border ${
                        page === currentPage
                          ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                          : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-3 py-1 text-sm leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorsTable;