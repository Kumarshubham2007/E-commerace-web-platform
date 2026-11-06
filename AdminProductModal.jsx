import React, { useEffect, useRef, useState } from 'react';
import { X, Save, Plus, AlertCircle } from 'lucide-react';
import { productsApi } from '../services/api';
import { useToast } from './Toast';

export const AdminProductModal = ({ isOpen, onClose, productToEdit, onSaved }) => {
  const dialogRef = useRef(null);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    compareAtPrice: '',
    category: 'Electronics',
    brand: '',
    countInStock: 10,
    image: '',
    description: '',
    isFeatured: false,
    specs: '',
  });

  // Populate form on edit
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        price: productToEdit.price || '',
        compareAtPrice: productToEdit.compareAtPrice || '',
        category: productToEdit.category || 'Electronics',
        brand: productToEdit.brand || '',
        countInStock: productToEdit.countInStock !== undefined ? productToEdit.countInStock : 10,
        image: productToEdit.image || '',
        description: productToEdit.description || '',
        isFeatured: Boolean(productToEdit.isFeatured),
        specs: productToEdit.specs
          ? typeof productToEdit.specs === 'object'
            ? JSON.stringify(productToEdit.specs, null, 2)
            : productToEdit.specs
          : '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        compareAtPrice: '',
        category: 'Electronics',
        brand: '',
        countInStock: 10,
        image: '',
        description: '',
        isFeatured: false,
        specs: '',
      });
    }
    setError('');
  }, [productToEdit, isOpen]);

  // Modern Web Guidance: Native <dialog> handling
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price || !formData.image || !formData.category) {
      setError('Please fill in Name, Price, Category, and Image URL');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        category: formData.category,
        brand: formData.brand || null,
        countInStock: parseInt(formData.countInStock, 10),
        image: formData.image,
        description: formData.description,
        isFeatured: formData.isFeatured,
        specs: formData.specs ? formData.specs : null,
      };

      if (productToEdit) {
        await productsApi.updateProduct(productToEdit.id, payload);
        addToast('Product updated successfully', 'success');
      } else {
        await productsApi.createProduct(payload);
        addToast('Product created successfully', 'success');
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="product-dialog-title"
      className="p-0 rounded-3xl shadow-2xl max-w-2xl w-full bg-white text-slate-800 backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm border border-slate-200 outline-none m-auto"
    >
      <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h2 id="product-dialog-title" className="text-xl font-bold text-slate-900">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill out the details below to update the storefront catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              name="name"
              required
              autoFocus
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="299.99"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Compare At Price ($) (Optional)
              </label>
              <input
                type="number"
                name="compareAtPrice"
                step="0.01"
                min="0"
                value={formData.compareAtPrice}
                onChange={handleChange}
                placeholder="349.99"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none bg-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Footwear">Footwear</option>
                <option value="Apparel">Apparel</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Sony"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="countInStock"
                min="0"
                required
                value={formData.countInStock}
                onChange={handleChange}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Main Image URL *
            </label>
            <input
              type="url"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the product features, specs, and materials..."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Mark as Featured Product (Highlights on Homepage)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

