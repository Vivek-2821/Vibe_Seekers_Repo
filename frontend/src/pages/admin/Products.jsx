import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Check,
  Star,
  Eye,
  EyeOff,
  AlertCircle,
  Search,
  CheckCircle2,
  Percent,
  Tag,
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'TSHIRTS',
    price: '',
    mrp: '',
    discountPercent: '',
    description: '',
    fabricDetails: '',
    colors: '',
    gsm: '',
    washingInstructions: '',
    collectionName: '',
    newArrival: false,
    bestSeller: false,
    isBestSeller: false,
    active: true,
  });

  // Size-wise stocks: S, M, L, XL, XXL
  const [sizeStocks, setSizeStocks] = useState({
    S: 10,
    M: 20,
    L: 25,
    XL: 15,
    XXL: 8,
  });

  // Images state
  const [existingImages, setExistingImages] = useState([]); // from API
  const [newImageFiles, setNewImageFiles] = useState([]); // file objects
  const [newImagePreviews, setNewImagePreviews] = useState([]); // blob URLs

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/admin/products');
      setProducts(res.data.data || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'TSHIRTS',
      price: '',
      mrp: '',
      discountPercent: '',
      description: '',
      fabricDetails: '',
      colors: 'Acid Black, Vintage White',
      gsm: '240 GSM',
      washingInstructions: 'Machine wash cold inside-out with like colors. Do not iron directly on print.',
      collectionName: '',
      newArrival: true,
      bestSeller: false,
      isBestSeller: false,
      active: true,
    });
    setSizeStocks({ S: 10, M: 20, L: 25, XL: 15, XXL: 8 });
    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    const calculatedDiscount = product.discountPercent || (product.mrp && product.price && Number(product.mrp) > Number(product.price)
      ? Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)
      : '');

    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      mrp: product.mrp || '',
      discountPercent: calculatedDiscount,
      description: product.description,
      fabricDetails: product.fabricDetails || '',
      colors: product.colors || '',
      gsm: product.gsm || '',
      washingInstructions: product.washingInstructions || '',
      collectionName: product.collectionName || '',
      newArrival: product.newArrival ?? product.isNewArrival ?? false,
      bestSeller: product.bestSeller ?? product.isBestSeller ?? false,
      isBestSeller: product.bestSeller ?? product.isBestSeller ?? false,
      active: product.active ?? product.isActive ?? true,
    });

    const stockMap = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
    product.sizeStocks?.forEach((s) => {
      stockMap[s.size] = s.stock;
    });
    setSizeStocks(stockMap);

    setExistingImages(product.images || []);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleMrpChange = (val) => {
    const numMrp = parseFloat(val);
    const numDisc = parseFloat(formData.discountPercent);

    if (val === '' || isNaN(numMrp) || numMrp <= 0) {
      setFormData(prev => ({ ...prev, mrp: val }));
      return;
    }

    if (!isNaN(numDisc) && numDisc >= 0 && numDisc < 100) {
      const calculatedPrice = Math.round(numMrp * (1 - numDisc / 100));
      setFormData(prev => ({ ...prev, mrp: val, price: calculatedPrice }));
    } else if (formData.price) {
      const p = parseFloat(formData.price);
      if (numMrp > p && p > 0) {
        const disc = Math.round(((numMrp - p) / numMrp) * 100);
        setFormData(prev => ({ ...prev, mrp: val, discountPercent: disc }));
      } else {
        setFormData(prev => ({ ...prev, mrp: val }));
      }
    } else {
      setFormData(prev => ({ ...prev, mrp: val }));
    }
  };

  const handleDiscountChange = (val) => {
    const numDisc = parseFloat(val);
    const numMrp = parseFloat(formData.mrp);
    const numPrice = parseFloat(formData.price);

    if (val === '' || isNaN(numDisc)) {
      setFormData(prev => ({ ...prev, discountPercent: '' }));
      return;
    }

    if (numDisc < 0 || numDisc >= 100) return;

    if (!isNaN(numMrp) && numMrp > 0) {
      const calculatedPrice = Math.round(numMrp * (1 - numDisc / 100));
      setFormData(prev => ({ ...prev, discountPercent: val, price: calculatedPrice }));
    } else if (!isNaN(numPrice) && numPrice > 0) {
      const calculatedMrp = Math.round(numPrice / (1 - numDisc / 100));
      setFormData(prev => ({ ...prev, discountPercent: val, mrp: calculatedMrp }));
    } else {
      setFormData(prev => ({ ...prev, discountPercent: val }));
    }
  };

  const handlePriceChange = (val) => {
    const numPrice = parseFloat(val);
    const numMrp = parseFloat(formData.mrp);

    if (!isNaN(numPrice) && !isNaN(numMrp) && numMrp > numPrice && numPrice > 0) {
      const disc = Math.round(((numMrp - numPrice) / numMrp) * 100);
      setFormData(prev => ({ ...prev, price: val, discountPercent: disc }));
    } else if (!isNaN(numPrice) && !isNaN(numMrp) && numPrice >= numMrp) {
      setFormData(prev => ({ ...prev, price: val, discountPercent: 0 }));
    } else {
      setFormData(prev => ({ ...prev, price: val }));
    }
  };

  const applyDiscountPreset = (percent) => {
    handleDiscountChange(percent.toString());
  };

  const handleFileDropOrSelect = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    if (!files.length) return;

    const validFiles = [];
    const previews = [];

    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setModalError('Only JPG, PNG, and WEBP formats allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setModalError('Each file must be under 5MB.');
        return;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setNewImageFiles((prev) => [...prev, ...validFiles]);
    setNewImagePreviews((prev) => [...prev, ...previews]);
    setModalError('');
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const setExistingPrimary = (imageId) => {
    setExistingImages((prev) =>
      prev.map((img) => ({
        ...img,
        primary: img.id === imageId,
      }))
    );
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!formData.name || !formData.price || !formData.description) {
      setModalError('Please fill in product name, price, and description.');
      return;
    }

    if (!editingId && existingImages.length === 0 && newImageFiles.length === 0) {
      setModalError('Please upload at least one photo for this streetwear piece.');
      return;
    }

    setSubmitting(true);

    try {
      const sizeStockArray = Object.entries(sizeStocks).map(([size, stock]) => ({
        size,
        stock: Number(stock) || 0,
      }));

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        mrp: formData.mrp ? Number(formData.mrp) : null,
        discountPercent: formData.discountPercent !== '' ? Number(formData.discountPercent) : null,
        description: formData.description,
        fabricDetails: formData.fabricDetails,
        colors: formData.colors,
        gsm: formData.gsm,
        washingInstructions: formData.washingInstructions,
        collectionName: formData.collectionName,
        newArrival: formData.newArrival ?? formData.isNewArrival ?? false,
        isNewArrival: formData.newArrival ?? formData.isNewArrival ?? false,
        bestSeller: formData.bestSeller ?? formData.isBestSeller ?? false,
        isBestSeller: formData.bestSeller ?? formData.isBestSeller ?? false,
        active: formData.active ?? formData.isActive ?? true,
        isActive: formData.active ?? formData.isActive ?? true,
        sizeStocks: sizeStockArray,
        existingImages: existingImages.map((img, idx) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          publicId: img.publicId,
          primary: img.primary,
          displayOrder: idx,
        })),
      };

      const multipartData = new FormData();
      multipartData.append('productData', JSON.stringify(payload));
      newImageFiles.forEach((file) => {
        multipartData.append(editingId ? 'newImages' : 'images', file);
      });

      if (editingId) {
        await axiosInstance.put(`/api/admin/products/${editingId}`, multipartData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessToast(`Product "${formData.name}" updated successfully.`);
      } else {
        await axiosInstance.post('/api/admin/products', multipartData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessToast(`Product "${formData.name}" added to catalog.`);
      }

      setIsModalOpen(false);
      fetchProducts();
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      console.error('Failed to save product', err);
      setModalError(err.response?.data?.message || 'Failed to save product. Check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This removes it permanently.`)) {
      return;
    }
    try {
      await axiosInstance.delete(`/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSuccessToast(`Product "${name}" deleted.`);
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-0.5">
            Streetwear Products & Media ({products.length})
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-vibe-accent hover:bg-vibe-accentHover text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-vibe-accent/20"
        >
          <Plus size={18} /> Add New Streetwear Item
        </button>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-vibe-accent"
          />
        </div>

        <div className="flex gap-2">
          {['', 'TSHIRTS', 'HOODIES', 'JACKETS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                filterCategory === cat
                  ? 'bg-vibe-accent text-white border-vibe-accent'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {cat || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] font-bold border-b border-zinc-800">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Sizes & Stock</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No streetwear products match your query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.primaryImageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded-lg bg-zinc-950 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{p.name}</p>
                          <p className="text-[11px] text-zinc-500 font-mono">slug: {p.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded text-[10px] font-bold uppercase tracking-wider">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>₹{Number(p.price).toLocaleString('en-IN')}</span>
                        {(p.discountPercent > 0 || (p.mrp && Number(p.mrp) > Number(p.price))) && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                            {p.discountPercent || Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      {p.mrp && Number(p.mrp) > Number(p.price) && (
                        <div className="text-[11px] text-zinc-500 line-through">MRP: ₹{Number(p.mrp).toLocaleString('en-IN')}</div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {p.sizeStocks?.map((s) => (
                          <span
                            key={s.size}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              s.stock <= 3
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {s.size}:{s.stock}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                            (p.active ?? p.isActive ?? true) ? 'text-emerald-400' : 'text-zinc-500'
                          }`}
                        >
                          {(p.active ?? p.isActive ?? true) ? <Eye size={12} /> : <EyeOff size={12} />}
                          {(p.active ?? p.isActive ?? true) ? 'Active' : 'Hidden'}
                        </span>
                        {(p.newArrival ?? p.isNewArrival) && (
                          <span className="text-[10px] text-vibe-accent font-bold uppercase tracking-wider">
                            ★ Fresh Drop
                          </span>
                        )}
                        {(p.bestSeller ?? p.isBestSeller) && (
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                            ★ Best Seller
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-2 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl relative">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X size={22} />
            </button>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-vibe-accent">
                {editingId ? 'Edit Product' : 'Add New Streetwear'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white mt-0.5">
                {editingId ? `Update: ${formData.name}` : 'Create Streetwear Piece'}
              </h2>
            </div>

            {modalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Acid Washed Cyber Tee"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                  >
                    <option value="TSHIRTS">T-Shirts (Oversized Tees)</option>
                    <option value="HOODIES">Hoodies (Fleece)</option>
                    <option value="JACKETS">Jackets (Cargo / Coach)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Fabric & Fit Details
                  </label>
                  <input
                    type="text"
                    value={formData.fabricDetails}
                    onChange={(e) => setFormData({ ...formData, fabricDetails: e.target.value })}
                    placeholder="240 GSM French Terry | Boxy Fit"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Available Colors (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Acid Black, Vintage White, Olive"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    GSM (Weight Specification)
                  </label>
                  <input
                    type="text"
                    value={formData.gsm}
                    onChange={(e) => setFormData({ ...formData, gsm: e.target.value })}
                    placeholder="e.g. 240 GSM or 400 GSM Fleece"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Collection Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.collectionName}
                    onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })}
                    placeholder="e.g. Acid Wash Drop 01"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Washing & Care Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.washingInstructions}
                    onChange={(e) => setFormData({ ...formData, washingInstructions: e.target.value })}
                    placeholder="Machine wash cold inside-out. Flat dry in shade."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                  />
                </div>

                {/* PRICING & DISCOUNT SUITE */}
                <div className="col-span-1 sm:col-span-2 bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Tag size={14} className="text-vibe-accent" />
                      Pricing & Discount
                    </span>
                    {formData.mrp && formData.price && Number(formData.mrp) > Number(formData.price) && (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        Save ₹{(Number(formData.mrp) - Number(formData.price)).toLocaleString('en-IN')} ({formData.discountPercent || Math.round(((formData.mrp - formData.price) / formData.mrp) * 100)}% OFF)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* MRP / Original Price */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                        MRP / Original Price (₹)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        value={formData.mrp}
                        onChange={(e) => handleMrpChange(e.target.value)}
                        placeholder="e.g. 1999"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-vibe-accent"
                      />
                    </div>

                    {/* Discount Percentage Option */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center justify-between">
                        <span>Discount %</span>
                        <span className="text-[10px] text-zinc-500 font-normal">Auto-calculates</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="99"
                          value={formData.discountPercent}
                          onChange={(e) => handleDiscountChange(e.target.value)}
                          placeholder="e.g. 25"
                          className="w-full bg-zinc-900 border border-amber-500/40 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Final Selling Price */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center justify-between">
                        <span>Selling Price (₹) *</span>
                        <span className="text-[10px] text-emerald-400 font-normal">Final</span>
                      </label>
                      <input
                        type="number"
                        step="1"
                        required
                        min="1"
                        value={formData.price}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        placeholder="e.g. 1499"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-vibe-accent"
                      />
                    </div>
                  </div>

                  {/* Quick Discount Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase mr-1">Quick Presets:</span>
                    {[10, 15, 20, 25, 30, 40, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyDiscountPreset(pct)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
                          Number(formData.discountPercent) === pct
                            ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                            : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                        }`}
                      >
                        {pct}% OFF
                      </button>
                    ))}
                    {formData.discountPercent !== '' && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            discountPercent: '',
                            price: prev.mrp || prev.price
                          }));
                        }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Full Streetwear Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of aesthetics, graphics, washing instructions..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                ></textarea>
              </div>

              {/* Size-wise stock quantities */}
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white block">
                  Size-wise Stock Inventory
                </span>
                <div className="grid grid-cols-5 gap-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <div key={sz}>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                        Size {sz}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={sizeStocks[sz]}
                        onChange={(e) =>
                          setSizeStocks({ ...sizeStocks, [sz]: Number(e.target.value) })
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center text-xs text-white font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* DIRECT MULTI-IMAGE UPLOADER */}
              <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-950/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Product Photos (Drag & Drop or Select)
                  </span>
                  <span className="text-[11px] text-zinc-400">JPG, PNG, WEBP (Max 5MB)</span>
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileDropOrSelect(e);
                  }}
                  className="border-2 border-dashed border-zinc-800 hover:border-vibe-accent rounded-xl p-6 text-center transition-colors cursor-pointer bg-zinc-900/40"
                >
                  <input
                    type="file"
                    multiple
                    id="productImagesPicker"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileDropOrSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="productImagesPicker"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-white"
                  >
                    <Upload size={28} className="text-vibe-accent" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Drop photos here or click to browse
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Upload high-res streetwear angles (front, back, model fit, close-up)
                    </span>
                  </label>
                </div>

                {/* Previews Grid (Existing + Newly Selected) */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                  {/* Existing Images */}
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 group bg-zinc-900"
                    >
                      <img src={img.imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 flex gap-1">
                        <button
                          type="button"
                          onClick={() => setExistingPrimary(img.id)}
                          className={`p-1 rounded ${
                            img.primary ? 'bg-amber-500 text-black' : 'bg-black/60 text-white'
                          }`}
                          title="Set as Primary Cover"
                        >
                          <Star size={12} className={img.primary ? 'fill-current' : ''} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded"
                        title="Delete image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}

                  {/* New Image Previews */}
                  {newImagePreviews.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-vibe-accent group bg-zinc-900"
                    >
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-vibe-accent text-white text-[9px] font-bold px-1 rounded">
                        New
                      </span>
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col sm:flex-row gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-white">
                  <input
                    type="checkbox"
                    checked={formData.newArrival ?? formData.isNewArrival ?? false}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked, isNewArrival: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 text-vibe-accent focus:ring-vibe-accent"
                  />
                  <span>Mark as Fresh Drop (New Arrival)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-white">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller ?? formData.isBestSeller ?? false}
                    onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked, isBestSeller: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 text-vibe-accent focus:ring-vibe-accent"
                  />
                  <span>Mark as Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-white">
                  <input
                    type="checkbox"
                    checked={formData.active ?? formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-zinc-700 text-vibe-accent focus:ring-vibe-accent"
                  />
                  <span>Product is Active & Visible in Storefront</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-vibe-accent hover:bg-vibe-accentHover disabled:bg-zinc-800 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-vibe-accent/20"
                >
                  {submitting ? 'Saving to Database...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
