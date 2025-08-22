"use client"
import React, { useState } from 'react'
import AdminLayout from '../../AdminLayout'

const NewProductForm = () => {
    return (
       <AdminLayout>
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-semibold mb-6">New Product</h1>
                <form className="space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select className="mt-1 p-2 border border-gray-300 rounded w-full">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Images</label>
                        <input
                            type="file"
                            multiple
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <button type="submit" className="mt-4 py-2 px-6 bg-blue-600 text-white rounded">
                        Save Product
                    </button>
                </form>
            </div>
            </AdminLayout>
    )
}

export default NewProductForm
