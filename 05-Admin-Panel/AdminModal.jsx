import React, { useState } from 'react';
import { 
  X, Package, ShoppingBag, Plus, Trash2, Edit2, Check, TrendingUp, 
  Users, DollarSign, CheckCircle2, Image, Tag, Percent, ArrowRight
} from 'lucide-react';

const PHOTO_PRESETS = [
  { name: 'Tomatoes', url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=85' },
  { name: 'Avocados', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=500&q=85' },
  { name: 'Carrots', url: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=500&q=85' },
  { name: 'Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=85' },
  { name: 'Oranges', url: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=500&q=85' },
  { name: 'Broccoli', url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=85' },
  { name: 'Greens', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=85' },
  { name: 'Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=85' },
  { name: 'Nuts', url: 'https://images.unsplash.com/photo-1505576399274-565b52d4ac71?auto=format&fit=crop&w=500&q=85' }
];

export default function AdminModal({ 
  isOpen, 
  onClose, 
  products, 
  orders, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}) {
  const [activeTab, setActiveTab] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // New product form state
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    discountPrice: '',
    unit: '500g / pack',
    stock: '30',
    tag: 'Fresh Harvest',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=85'
  });

  // Edit product inline form state
  const [editForm, setEditForm] = useState({
    price: '',
    discountPrice: '',
    stock: '',
    image: '',
    tag: ''
  });

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, ord) => sum + (parseFloat(ord.total) || 0), 0);

  // Apply discount percentage calculation to new product form
  const applyNewDiscountPercent = (percent) => {
    const regular = parseFloat(newProd.price);
    if (!regular || regular <= 0) return;
    if (percent === 0) {
      setNewProd({ ...newProd, discountPrice: '' });
    } else {
      const discounted = (regular * (1 - percent / 100)).toFixed(2);
      setNewProd({ ...newProd, discountPrice: discounted });
    }
  };

  // Apply discount percentage calculation to edit form
  const applyEditDiscountPercent = (percent) => {
    const regular = parseFloat(editForm.price);
    if (!regular || regular <= 0) return;
    if (percent === 0) {
      setEditForm({ ...editForm, discountPrice: '' });
    } else {
      const discounted = (regular * (1 - percent / 100)).toFixed(2);
      setEditForm({ ...editForm, discountPrice: discounted });
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    onAddProduct({
      ...newProd,
      price: Number(newProd.price),
      discountPrice: newProd.discountPrice ? Number(newProd.discountPrice) : null,
      stock: Number(newProd.stock) || 20
    });
    setNewProd({
      name: '',
      category: 'Vegetables',
      price: '',
      discountPrice: '',
      unit: '500g / pack',
      stock: '30',
      tag: 'Fresh Harvest',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=85'
    });
    setShowAddForm(false);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      stock: product.stock || '25',
      image: product.image || '',
      tag: product.tag || ''
    });
  };

  const saveEdit = (productId) => {
    if (onUpdateProduct) {
      onUpdateProduct(productId, {
        price: Number(editForm.price),
        discountPrice: editForm.discountPrice ? Number(editForm.discountPrice) : null,
        stock: Number(editForm.stock) || 0,
        image: editForm.image,
        tag: editForm.tag
      });
    }
    setEditingId(null);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 65, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        onClick={e => e.stopPropagation()} 
        style={{
          background: '#fcfdfa',
          color: '#1a3211',
          width: 'min(940px, calc(100% - 24px))',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e1e7db', paddingBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '1px', color: '#56831d', fontWeight: 700 }}>STORE MANAGEMENT</span>
            <h2 style={{ margin: '2px 0 0', fontFamily: 'Manrope, sans-serif', fontSize: '22px', color: '#142a0b' }}>
              GreenBasket Admin Control Panel
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#687761' }} aria-label="Close">
            <X size={22}/>
          </button>
        </div>

        {/* Top Analytics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '14px 0' }}>
          <div style={{ background: '#f2f6ec', padding: '12px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#dcedcf', padding: '8px', borderRadius: '8px', color: '#3d6c15' }}><Package size={18}/></div>
            <div>
              <small style={{ fontSize: '10px', color: '#67785e', display: 'block' }}>Products</small>
              <b style={{ fontSize: '16px', color: '#162e0c' }}>{products.length}</b>
            </div>
          </div>

          <div style={{ background: '#f2f6ec', padding: '12px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#dcedcf', padding: '8px', borderRadius: '8px', color: '#3d6c15' }}><ShoppingBag size={18}/></div>
            <div>
              <small style={{ fontSize: '10px', color: '#67785e', display: 'block' }}>Total Orders</small>
              <b style={{ fontSize: '16px', color: '#162e0c' }}>{orders.length}</b>
            </div>
          </div>

          <div style={{ background: '#f2f6ec', padding: '12px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#dcedcf', padding: '8px', borderRadius: '8px', color: '#3d6c15' }}><DollarSign size={18}/></div>
            <div>
              <small style={{ fontSize: '10px', color: '#67785e', display: 'block' }}>Total Sales</small>
              <b style={{ fontSize: '16px', color: '#162e0c' }}>${totalRevenue.toFixed(2)}</b>
            </div>
          </div>

          <div style={{ background: '#f2f6ec', padding: '12px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#dcedcf', padding: '8px', borderRadius: '8px', color: '#3d6c15' }}><Users size={18}/></div>
            <div>
              <small style={{ fontSize: '10px', color: '#67785e', display: 'block' }}>Customers</small>
              <b style={{ fontSize: '16px', color: '#162e0c' }}>{new Set(orders.map(o => o.customerPhone || o.customerName)).size || 1}</b>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', borderBottom: '1px solid #e1e7db', paddingBottom: '8px' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('products')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 600, 
              fontSize: '12px',
              background: activeTab === 'products' ? '#3d6e15' : '#e9eee2',
              color: activeTab === 'products' ? '#fff' : '#45593c'
            }}
          >
            Product Catalog ({products.length})
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('orders')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 600, 
              fontSize: '12px',
              background: activeTab === 'orders' ? '#3d6e15' : '#e9eee2',
              color: activeTab === 'orders' ? '#fff' : '#45593c'
            }}
          >
            Customer Orders ({orders.length})
          </button>
        </div>

        {/* Tab Content Area */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {activeTab === 'products' ? (
            <div>
              {/* Section Subheading & Add Product Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <b style={{ fontSize: '13px', color: '#274415' }}>Manage store items and live pricing</b>
                  <p style={{ margin: 0, fontSize: '11px', color: '#687b60' }}>
                    Add or update product photos, regular prices, and live discount deals.
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: showAddForm ? '#617457' : '#55871f', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '8px', 
                    padding: '7px 14px', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    cursor: 'pointer' 
                  }}
                >
                  <Plus size={14}/> {showAddForm ? 'Close Form' : 'Add New Product'}
                </button>
              </div>

              {/* Add New Product Form */}
              {showAddForm && (
                <form 
                  onSubmit={handleCreateProduct} 
                  style={{ 
                    background: '#f4f8ef', 
                    border: '1px solid #cddcc2', 
                    borderRadius: '14px', 
                    padding: '16px', 
                    marginBottom: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '4px', color: '#334c26' }}>
                        Item Name *
                      </label>
                      <input 
                        required 
                        placeholder="e.g. Organic Avocados" 
                        value={newProd.name} 
                        onChange={e => setNewProd({ ...newProd, name: e.target.value })} 
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid #bfd0b4', fontSize: '12px', background: '#fff' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '4px', color: '#334c26' }}>
                        Category *
                      </label>
                      <select 
                        value={newProd.category} 
                        onChange={e => setNewProd({ ...newProd, category: e.target.value })} 
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid #bfd0b4', fontSize: '12px', background: '#fff' }}
                      >
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Herbs & Greens">Herbs & Greens</option>
                        <option value="Dairy & Eggs">Dairy & Eggs</option>
                        <option value="Nuts & Seeds">Nuts & Seeds</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '4px', color: '#334c26' }}>
                        Unit / Packing
                      </label>
                      <input 
                        placeholder="500g / pack" 
                        value={newProd.unit} 
                        onChange={e => setNewProd({ ...newProd, unit: e.target.value })} 
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid #bfd0b4', fontSize: '12px', background: '#fff' }}
                      />
                    </div>
                  </div>

                  {/* Pricing & Discount Row */}
                  <div style={{ background: '#eaf2e3', padding: '12px', borderRadius: '10px', border: '1px solid #d2e2c6' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'flex-start' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '4px', color: '#274418' }}>
                          Regular Price ($) *
                        </label>
                        <input 
                          required 
                          type="number" 
                          step="0.01" 
                          placeholder="2.99" 
                          value={newProd.price} 
                          onChange={e => setNewProd({ ...newProd, price: e.target.value })} 
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid #b7cbb0', fontSize: '12px', background: '#fff' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, marginBottom: '4px', color: '#274418' }}>
                          <span>Discount Price ($)</span>
                          {newProd.discountPrice && newProd.price && Number(newProd.discountPrice) < Number(newProd.price) && (
                            <span style={{ color: '#2b6f10', fontWeight: 800 }}>
                              Save ${(Number(newProd.price) - Number(newProd.discountPrice)).toFixed(2)} ({Math.round((1 - newProd.discountPrice / newProd.price) * 100)}% OFF)
                            </span>
                          )}
                        </label>
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder="Leave blank for regular price" 
                          value={newProd.discountPrice} 
                          onChange={e => setNewProd({ ...newProd, discountPrice: e.target.value })} 
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid #b7cbb0', fontSize: '12px', background: '#fff' }}
                        />
                      </div>
                    </div>

                    {/* Quick Discount Price Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#4b663b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Percent size={12}/> Discount Buttons:
                      </span>
                      {[10, 15, 20, 25, 30, 50].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => applyNewDiscountPercent(pct)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #9dc76d',
                            background: '#dff0c9',
                            color: '#284d12',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {pct}% OFF
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => applyNewDiscountPercent(0)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid #d5dfce',
                          background: '#fff',
                          color: '#71846b',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Photo & Additional Details Row */}
                  <div style={{ background: '#eaf2e3', padding: '12px', borderRadius: '10px', border: '1px solid #d2e2c6' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      {/* Photo Live Preview Thumbnail */}
                      <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '4px', color: '#274418' }}>
                          Photo Preview
                        </label>
                        <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #bcd1b0', background: '#fff', display: 'grid', placeItems: 'center' }}>
                          {newProd.image ? (
                            <img src={newProd.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=85'; }}/>
                          ) : (
                            <Image size={24} color="#83977c"/>
                          )}
                        </div>
                      </div>

                      {/* Photo URL Input & Preset selector */}
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '4px', color: '#274418' }}>
                          Product Photo URL
                        </label>
                        <input 
                          placeholder="Paste image URL (https://...)" 
                          value={newProd.image} 
                          onChange={e => setNewProd({ ...newProd, image: e.target.value })} 
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', border: '1px solid #b7cbb0', fontSize: '12px', background: '#fff' }}
                        />

                        {/* Quick Photo Presets */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '7px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#4b663b' }}>Presets:</span>
                          {PHOTO_PRESETS.map(preset => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => setNewProd({ ...newProd, image: preset.url })}
                              style={{
                                padding: '3px 7px',
                                borderRadius: '5px',
                                border: newProd.image === preset.url ? '1.5px solid #437817' : '1px solid #c7d8be',
                                background: newProd.image === preset.url ? '#e3f3cf' : '#ffffff',
                                color: '#244512',
                                fontSize: '10px',
                                fontWeight: newProd.image === preset.url ? 700 : 500,
                                cursor: 'pointer'
                              }}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '4px', color: '#274418' }}>
                          Stock Quantity
                        </label>
                        <input 
                          type="number" 
                          placeholder="30" 
                          value={newProd.stock} 
                          onChange={e => setNewProd({ ...newProd, stock: e.target.value })} 
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #bfd0b4', fontSize: '11px', background: '#fff' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '4px', color: '#274418' }}>
                          Tag / Badge
                        </label>
                        <input 
                          placeholder="Fresh Harvest, Best Seller, Organic" 
                          value={newProd.tag} 
                          onChange={e => setNewProd({ ...newProd, tag: e.target.value })} 
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #bfd0b4', fontSize: '11px', background: '#fff' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)} 
                      style={{ background: '#e5ecdd', color: '#45593c', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      style={{ background: '#305814', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              )}

              {/* Product Catalog Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f1f5ec', textAlign: 'left', borderBottom: '1px solid #dbe5d4' }}>
                    <th style={{ padding: '9px 10px' }}>Product & Photo</th>
                    <th style={{ padding: '9px 10px' }}>Category</th>
                    <th style={{ padding: '9px 10px' }}>Price & Discount</th>
                    <th style={{ padding: '9px 10px' }}>Stock</th>
                    <th style={{ padding: '9px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const isEditing = editingId === p.id;
                    const hasDiscount = p.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.price);

                    return (
                      <React.Fragment key={p.id}>
                        <tr style={{ borderBottom: '1px solid #eef2e9', background: isEditing ? '#f8fbf4' : 'transparent' }}>
                          <td style={{ padding: '9px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #d2decb' }}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=85'; }}
                            />
                            <div>
                              <b style={{ color: '#162e0c' }}>{p.name}</b>
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                                <small style={{ color: '#6d7f66', fontSize: '10px' }}>{p.unit}</small>
                                {p.tag && (
                                  <span style={{ fontSize: '9px', background: '#e6f2d5', color: '#2b5013', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                                    {p.tag}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '9px 10px', color: '#455b3d' }}>
                            {p.category}
                          </td>

                          <td style={{ padding: '9px 10px' }}>
                            {hasDiscount ? (
                              <div>
                                <b style={{ color: '#275e0e', fontSize: '13px' }}>${Number(p.discountPrice).toFixed(2)}</b>
                                <span style={{ textDecoration: 'line-through', color: '#889b80', fontSize: '11px', marginLeft: '6px' }}>
                                  ${Number(p.price).toFixed(2)}
                                </span>
                                <span style={{ display: 'inline-block', marginLeft: '6px', fontSize: '10px', background: '#ffe4e6', color: '#9f1239', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                  -{Math.round((1 - p.discountPrice / p.price) * 100)}%
                                </span>
                              </div>
                            ) : (
                              <div>
                                <b style={{ color: '#18320e', fontSize: '13px' }}>${Number(p.price).toFixed(2)}</b>
                                <small style={{ display: 'block', color: '#82957a', fontSize: '10px' }}>Regular Price</small>
                              </div>
                            )}
                          </td>

                          <td style={{ padding: '9px 10px' }}>
                            <span style={{ color: (p.stock || 25) < 10 ? '#b91c1c' : '#2d4b1f', fontWeight: 600 }}>
                              {p.stock || 25} in stock
                            </span>
                          </td>

                          <td style={{ padding: '9px 10px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button 
                                onClick={() => isEditing ? setEditingId(null) : startEdit(p)}
                                style={{ 
                                  background: isEditing ? '#3e6a17' : '#eaf2e3', 
                                  color: isEditing ? '#fff' : '#2b4d13', 
                                  border: 'none', 
                                  borderRadius: '6px', 
                                  padding: '6px 10px', 
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Edit Live Pricing & Photo"
                              >
                                <Edit2 size={12}/> {isEditing ? 'Close' : 'Live Price'}
                              </button>
                              <button 
                                onClick={() => onDeleteProduct(p.id)}
                                style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer' }}
                                title="Delete Product"
                              >
                                <Trash2 size={13}/>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Inline Live Price & Photo Edit Row */}
                        {isEditing && (
                          <tr style={{ background: '#f5faf0', borderBottom: '2px solid #c9dec0' }}>
                            <td colSpan={5} style={{ padding: '12px 14px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#2b5013' }}>
                                    ⚡ Live Update Pricing, Discount & Photo for: {p.name}
                                  </span>
                                  {editForm.discountPrice && editForm.price && Number(editForm.discountPrice) < Number(editForm.price) && (
                                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#215c0a', background: '#dff2c9', padding: '2px 8px', borderRadius: '4px' }}>
                                      Live Discount: {Math.round((1 - editForm.discountPrice / editForm.price) * 100)}% OFF (Save ${(Number(editForm.price) - Number(editForm.discountPrice)).toFixed(2)})
                                    </span>
                                  )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px', color: '#314c22' }}>Regular Price ($)</label>
                                    <input 
                                      type="number" 
                                      step="0.01" 
                                      value={editForm.price} 
                                      onChange={e => setEditForm({ ...editForm, price: e.target.value })} 
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #b7cbb0', fontSize: '12px', background: '#fff' }}
                                    />
                                  </div>

                                  <div>
                                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px', color: '#314c22' }}>Discount Price ($)</label>
                                    <input 
                                      type="number" 
                                      step="0.01" 
                                      placeholder="No discount" 
                                      value={editForm.discountPrice} 
                                      onChange={e => setEditForm({ ...editForm, discountPrice: e.target.value })} 
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #b7cbb0', fontSize: '12px', background: '#fff' }}
                                    />
                                  </div>

                                  <div>
                                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px', color: '#314c22' }}>Stock Quantity</label>
                                    <input 
                                      type="number" 
                                      value={editForm.stock} 
                                      onChange={e => setEditForm({ ...editForm, stock: e.target.value })} 
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #b7cbb0', fontSize: '12px', background: '#fff' }}
                                    />
                                  </div>

                                  <div>
                                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px', color: '#314c22' }}>Tag / Badge</label>
                                    <input 
                                      value={editForm.tag} 
                                      onChange={e => setEditForm({ ...editForm, tag: e.target.value })} 
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #b7cbb0', fontSize: '12px', background: '#fff' }}
                                    />
                                  </div>
                                </div>

                                {/* Quick Discount Buttons in Inline Editor */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#4a6538' }}>Discount Buttons:</span>
                                  {[10, 15, 20, 25, 30, 50].map(pct => (
                                    <button
                                      key={pct}
                                      type="button"
                                      onClick={() => applyEditDiscountPercent(pct)}
                                      style={{
                                        padding: '3px 7px',
                                        borderRadius: '5px',
                                        border: '1px solid #9dc76d',
                                        background: '#dff0c9',
                                        color: '#284d12',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {pct}% OFF
                                    </button>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => applyEditDiscountPercent(0)}
                                    style={{
                                      padding: '3px 7px',
                                      borderRadius: '5px',
                                      border: '1px solid #d5dfce',
                                      background: '#fff',
                                      color: '#71846b',
                                      fontSize: '10px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Remove Discount
                                  </button>
                                </div>

                                {/* Photo update in Inline Editor */}
                                <div>
                                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px', color: '#314c22' }}>Photo URL</label>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <input 
                                      value={editForm.image} 
                                      onChange={e => setEditForm({ ...editForm, image: e.target.value })} 
                                      style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #b7cbb0', fontSize: '11px', background: '#fff' }}
                                    />
                                    {PHOTO_PRESETS.slice(0, 5).map(preset => (
                                      <button
                                        key={preset.name}
                                        type="button"
                                        onClick={() => setEditForm({ ...editForm, image: preset.url })}
                                        style={{
                                          padding: '3px 7px',
                                          borderRadius: '5px',
                                          border: '1px solid #c7d8be',
                                          background: '#fff',
                                          color: '#244512',
                                          fontSize: '10px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {preset.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                                  <button 
                                    type="button" 
                                    onClick={() => setEditingId(null)} 
                                    style={{ background: '#e5ecdd', color: '#45593c', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => saveEdit(p.id)} 
                                    style={{ background: '#2e5613', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 18px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f1f5ec', textAlign: 'left', borderBottom: '1px solid #dbe5d4' }}>
                    <th style={{ padding: '9px 10px' }}>Order ID</th>
                    <th style={{ padding: '9px 10px' }}>Customer</th>
                    <th style={{ padding: '9px 10px' }}>Address</th>
                    <th style={{ padding: '9px 10px' }}>Payment</th>
                    <th style={{ padding: '9px 10px' }}>Total</th>
                    <th style={{ padding: '9px 10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #eef2e9' }}>
                      <td style={{ padding: '9px 10px' }}>
                        <b>{o.id}</b>
                        <small style={{ display: 'block', color: '#74866c', fontSize: '10px' }}>{o.date}</small>
                      </td>
                      <td style={{ padding: '9px 10px' }}>
                        <b>{o.customerName}</b>
                        <small style={{ display: 'block', color: '#74866c', fontSize: '10px' }}>{o.customerPhone}</small>
                      </td>
                      <td style={{ padding: '9px 10px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.address}
                      </td>
                      <td style={{ padding: '9px 10px' }}>{o.paymentMethod}</td>
                      <td style={{ padding: '9px 10px' }}><b style={{ color: '#1a330e' }}>${Number(o.total).toFixed(2)}</b></td>
                      <td style={{ padding: '9px 10px' }}>
                        <span style={{ background: '#e0f2cd', color: '#316911', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700 }}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
