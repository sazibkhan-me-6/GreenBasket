import React, { useState } from 'react';
import { 
  X, Package, ShoppingBag, Plus, Trash2, TrendingUp, Users, DollarSign, 
  CheckCircle2, Image as ImageIcon, Tag, Upload, Edit3, Percent, ArrowRight
} from 'lucide-react';

const PHOTO_PRESETS = [
  { label: 'Avocado', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=500&q=85' },
  { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=85' },
  { label: 'Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=85' },
  { label: 'Carrots', url: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=500&q=85' },
  { label: 'Strawberries', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=500&q=85' },
  { label: 'Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=85' },
  { label: 'Broccoli', url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=85' },
  { label: 'Farm Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=85' },
  { label: 'Chia Seeds', url: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=500&q=85' },
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
  const [editingProduct, setEditingProduct] = useState(null);

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    discountPrice: '',
    unit: '500g / pack',
    stock: '30',
    tag: 'Fresh Harvest',
    image: PHOTO_PRESETS[0].url
  });

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, ord) => sum + (parseFloat(ord.total) || 0), 0);

  // Apply quick discount buttons (e.g. 10%, 20%, 30%)
  const handleApplyDiscount = (percent, targetState, setTargetState) => {
    const regular = parseFloat(targetState.price);
    if (!regular || isNaN(regular)) return;
    
    if (percent === 0) {
      setTargetState({
        ...targetState,
        discountPrice: '',
        tag: targetState.tag.includes('OFF') ? 'Fresh Harvest' : targetState.tag
      });
      return;
    }

    const discounted = (regular * (1 - percent / 100)).toFixed(2);
    setTargetState({
      ...targetState,
      discountPrice: discounted,
      tag: `${percent}% OFF`
    });
  };

  // Image Upload via File input
  const handleFileUpload = (e, setTargetState) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTargetState(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    onAddProduct(newProd);
    setNewProd({
      name: '',
      category: 'Vegetables',
      price: '',
      discountPrice: '',
      unit: '500g / pack',
      stock: '30',
      tag: 'Fresh Harvest',
      image: PHOTO_PRESETS[0].url
    });
    setShowAddForm(false);
  };

  const handleSaveLiveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (onUpdateProduct) {
      onUpdateProduct(editingProduct);
    }
    setEditingProduct(null);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 65, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        onClick={e => e.stopPropagation()} 
        style={{
          background: '#fcfdfa',
          color: '#1a3211',
          width: 'min(980px, calc(100% - 24px))',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e1e7db', paddingBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '1px', color: '#56831d', fontWeight: 700 }}>STORE MANAGEMENT</span>
            <h2 style={{ margin: '2px 0 0', fontFamily: 'Manrope, sans-serif', fontSize: '22px', color: '#142e0a' }}>
              GreenBasket Admin Control Panel
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#687761' }} aria-label="Close">
            <X size={22}/>
          </button>
        </div>

        {/* Analytics Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '14px 0' }}>
          <div style={{ background: '#f2f6ec', padding: '12px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#dcedcf', padding: '8px', borderRadius: '8px', color: '#3d6c15' }}><Package size={18}/></div>
            <div>
              <small style={{ fontSize: '10px', color: '#67785e', display: 'block' }}>Products</small>
              <b style={{ fontSize: '16px' }}>{products.length}</b>
            </div>
          </div>

          <div style={{ background: '#f2f6ec', padding: '12px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#dcedcf', padding: '8px', borderRadius: '8px', color: '#3d6c15' }}><ShoppingBag size={18}/></div>
            <div>
              <small style={{ fontSize: '10px', color: '#67785e', display: 'block' }}>Total Orders</small>
              <b style={{ fontSize: '16px' }}>{orders.length}</b>
            </div>
          </div>

          <div style={{ background: '#f2f6ec', padding: '12px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#dcedcf', padding: '8px', borderRadius: '8px', color: '#3d6c15' }}><DollarSign size={18}/></div>
            <div>
              <small style={{ fontSize: '10px', color: '#67785e', display: 'block' }}>Total Sales</small>
              <b style={{ fontSize: '16px' }}>${totalRevenue.toFixed(2)}</b>
            </div>
          </div>

          <div style={{ background: '#f2f6ec', padding: '12px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#dcedcf', padding: '8px', borderRadius: '8px', color: '#3d6c15' }}><Users size={18}/></div>
            <div>
              <small style={{ fontSize: '10px', color: '#67785e', display: 'block' }}>Customers</small>
              <b style={{ fontSize: '16px' }}>{new Set(orders.map(o => o.customerPhone || o.customerName)).size || 1}</b>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #e1e7db', paddingBottom: '8px' }}>
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

        {/* Tab Content Body */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {activeTab === 'products' ? (
            <div>
              {/* Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <b style={{ fontSize: '13px', color: '#274319' }}>Manage store items and live pricing</b>
                  <span style={{ fontSize: '11px', color: '#67795d', display: 'block' }}>Add photos, update regular & discount prices, and manage stock</span>
                </div>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: showAddForm ? '#58734c' : '#75a828', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                >
                  <Plus size={14}/> {showAddForm ? 'Close Form' : 'Add New Product'}
                </button>
              </div>

              {/* Add New Product Form */}
              {showAddForm && (
                <form onSubmit={handleCreateProduct} style={{ background: '#f4f8ef', border: '1px solid #cddcc2', borderRadius: '14px', padding: '16px', marginBottom: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#314c22', marginBottom: '3px' }}>Item Name</label>
                      <input 
                        required 
                        placeholder="e.g. Organic Avocados" 
                        value={newProd.name} 
                        onChange={e => setNewProd({ ...newProd, name: e.target.value })} 
                        style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #c3d3b7', fontSize: '12px', background: '#fff' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#314c22', marginBottom: '3px' }}>Category</label>
                      <select 
                        value={newProd.category} 
                        onChange={e => setNewProd({ ...newProd, category: e.target.value })} 
                        style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #c3d3b7', fontSize: '12px', background: '#fff' }}
                      >
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Herbs & Greens">Herbs & Greens</option>
                        <option value="Dairy & Eggs">Dairy & Eggs</option>
                        <option value="Nuts & Seeds">Nuts & Seeds</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#314c22', marginBottom: '3px' }}>Unit / Packing</label>
                      <input 
                        placeholder="500g / pack" 
                        value={newProd.unit} 
                        onChange={e => setNewProd({ ...newProd, unit: e.target.value })} 
                        style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #c3d3b7', fontSize: '12px', background: '#fff' }}
                      />
                    </div>
                  </div>

                  {/* Pricing & Discount Row */}
                  <div style={{ marginTop: '12px', padding: '12px', background: '#eaf2e2', borderRadius: '10px', border: '1px solid #d0e0c5' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#274319', marginBottom: '3px' }}>
                          Regular Price ($) *
                        </label>
                        <input 
                          required 
                          type="number" 
                          step="0.01" 
                          placeholder="e.g. 2.99" 
                          value={newProd.price} 
                          onChange={e => setNewProd({ ...newProd, price: e.target.value })} 
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #b7cca9', fontSize: '12px', background: '#fff', fontWeight: 700 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#2d6812', marginBottom: '3px' }}>
                          Discount Price ($) <small style={{ fontWeight: 400, color: '#687e5e' }}>(Optional)</small>
                        </label>
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder="e.g. 2.49" 
                          value={newProd.discountPrice} 
                          onChange={e => {
                            const disc = e.target.value;
                            const reg = parseFloat(newProd.price);
                            let tag = newProd.tag;
                            if (reg && disc && parseFloat(disc) < reg) {
                              const pct = Math.round((1 - parseFloat(disc) / reg) * 100);
                              tag = `${pct}% OFF`;
                            }
                            setNewProd({ ...newProd, discountPrice: disc, tag });
                          }} 
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #7cb52b', fontSize: '12px', background: '#fff', fontWeight: 700, color: '#23590d' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#314c22', marginBottom: '3px' }}>Tag / Badge</label>
                        <input 
                          placeholder="Fresh Harvest" 
                          value={newProd.tag} 
                          onChange={e => setNewProd({ ...newProd, tag: e.target.value })} 
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #b7cca9', fontSize: '12px', background: '#fff' }}
                        />
                      </div>
                    </div>

                    {/* Quick Discount Price Buttons */}
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#446432' }}>Quick Discount Buttons:</span>
                      {[10, 15, 20, 30, 50].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleApplyDiscount(pct, newProd, setNewProd)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #94c449',
                            background: '#dcf1b5',
                            color: '#21470e',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {pct}% OFF
                        </button>
                      ))}
                      {newProd.discountPrice && (
                        <button
                          type="button"
                          onClick={() => handleApplyDiscount(0, newProd, setNewProd)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #d88',
                            background: '#fee',
                            color: '#900',
                            fontSize: '10px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Clear Discount
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Photo / Image Option Section */}
                  <div style={{ marginTop: '12px', padding: '12px', background: '#fff', borderRadius: '10px', border: '1px solid #d4e3cb' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      {/* Photo Thumbnail Preview */}
                      <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #c5d8ba', flexShrink: 0, background: '#f5f5f5' }}>
                        {newProd.image ? (
                          <img src={newProd.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        ) : (
                          <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#999' }}><ImageIcon size={20}/></div>
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#274319', marginBottom: '3px' }}>
                          Product Photo Option (Enter URL or Upload File)
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <input 
                            placeholder="Paste image URL (https://...)" 
                            value={newProd.image} 
                            onChange={e => setNewProd({ ...newProd, image: e.target.value })} 
                            style={{ flex: 1, padding: '7px 9px', borderRadius: '6px', border: '1px solid #c3d3b7', fontSize: '11px' }}
                          />
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#eaf4db', color: '#2d5c12', border: '1px solid #a8cf6a', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                            <Upload size={13}/> Upload File
                            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setNewProd)} style={{ display: 'none' }}/>
                          </label>
                        </div>

                        {/* Quick Preset Photos */}
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '9px', color: '#6d8262', fontWeight: 600 }}>Quick Preset Photos:</span>
                          {PHOTO_PRESETS.map(preset => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setNewProd(prev => ({ ...prev, image: preset.url }))}
                              style={{
                                padding: '2px 7px',
                                borderRadius: '4px',
                                border: '1px solid #cde0c0',
                                background: newProd.image === preset.url ? '#bde374' : '#f4f8ee',
                                color: '#1f3d10',
                                fontSize: '10px',
                                cursor: 'pointer',
                                fontWeight: newProd.image === preset.url ? 700 : 500
                              }}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock and Submit */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#314c22' }}>Stock Quantity:</span>
                      <input 
                        type="number" 
                        placeholder="30" 
                        value={newProd.stock} 
                        onChange={e => setNewProd({ ...newProd, stock: e.target.value })} 
                        style={{ width: '80px', padding: '6px 9px', borderRadius: '6px', border: '1px solid #c3d3b7', fontSize: '12px' }}
                      />
                    </div>
                    <button type="submit" style={{ background: '#2c5211', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 22px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      Save Product
                    </button>
                  </div>
                </form>
              )}

              {/* Quick Live Price / Product Edit Modal */}
              {editingProduct && (
                <div style={{ background: '#eef6e6', border: '2px solid #82b934', borderRadius: '14px', padding: '16px', marginBottom: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Edit3 size={16} color="#386b16"/>
                      <b style={{ fontSize: '13px', color: '#1e380f' }}>Live Pricing & Discount Editor: {editingProduct.name}</b>
                    </div>
                    <button onClick={() => setEditingProduct(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#687761' }}>
                      <X size={18}/>
                    </button>
                  </div>

                  <form onSubmit={handleSaveLiveEdit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px' }}>Regular Price ($)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          required 
                          value={editingProduct.price} 
                          onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #b3c9a6', fontSize: '12px', background: '#fff', fontWeight: 700 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#2d6812', marginBottom: '3px' }}>Discount Price ($)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder="e.g. 2.19" 
                          value={editingProduct.discountPrice || ''} 
                          onChange={e => {
                            const disc = e.target.value;
                            const reg = parseFloat(editingProduct.price);
                            let tag = editingProduct.tag;
                            if (reg && disc && parseFloat(disc) < reg) {
                              const pct = Math.round((1 - parseFloat(disc) / reg) * 100);
                              tag = `${pct}% OFF`;
                            }
                            setEditingProduct({ ...editingProduct, discountPrice: disc, tag });
                          }}
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #7cb52b', fontSize: '12px', background: '#fff', fontWeight: 700, color: '#23590d' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px' }}>Stock Qty</label>
                        <input 
                          type="number" 
                          value={editingProduct.stock || 20} 
                          onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #b3c9a6', fontSize: '12px', background: '#fff' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px' }}>Badge / Tag</label>
                        <input 
                          value={editingProduct.tag || ''} 
                          onChange={e => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #b3c9a6', fontSize: '12px', background: '#fff' }}
                        />
                      </div>
                    </div>

                    {/* Quick Discount Presets for Editor */}
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#446432' }}>Quick Discount:</span>
                      {[10, 15, 20, 25, 30, 50].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleApplyDiscount(pct, editingProduct, setEditingProduct)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #94c449',
                            background: '#dcf1b5',
                            color: '#21470e',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {pct}% OFF
                        </button>
                      ))}
                      {editingProduct.discountPrice && (
                        <button
                          type="button"
                          onClick={() => handleApplyDiscount(0, editingProduct, setEditingProduct)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #d88',
                            background: '#fee',
                            color: '#900',
                            fontSize: '10px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Clear Discount
                        </button>
                      )}
                    </div>

                    {/* Photo Editor */}
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img src={editingProduct.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}/>
                      <input 
                        value={editingProduct.image} 
                        onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        placeholder="Image URL"
                        style={{ flex: 1, padding: '6px 9px', borderRadius: '6px', border: '1px solid #b3c9a6', fontSize: '11px', background: '#fff' }}
                      />
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eaf4db', color: '#2d5c12', border: '1px solid #a8cf6a', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                        <Upload size={12}/> Change Photo
                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setEditingProduct)} style={{ display: 'none' }}/>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                      <button 
                        type="button" 
                        onClick={() => setEditingProduct(null)}
                        style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #c4d4bd', background: '#fff', color: '#455d3a', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        style={{ padding: '7px 18px', borderRadius: '8px', border: 'none', background: '#2c5211', color: '#fff', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                      >
                        Save Live Pricing
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table with Live Pricing & Photo Details */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f1f5ec', textAlign: 'left', borderBottom: '1px solid #dbe5d4' }}>
                    <th style={{ padding: '10px 10px' }}>Product & Photo</th>
                    <th style={{ padding: '10px 10px' }}>Category</th>
                    <th style={{ padding: '10px 10px' }}>Live Pricing</th>
                    <th style={{ padding: '10px 10px' }}>Stock</th>
                    <th style={{ padding: '10px 10px', textAlign: 'center' }}>Live Price Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const hasDiscount = p.discountPrice && Number(p.discountPrice) < Number(p.price);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #eef2e9' }}>
                        <td style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={p.image} alt={p.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #d2e0cb' }}/>
                          <div>
                            <b style={{ color: '#162e0c' }}>{p.name}</b>
                            <small style={{ display: 'block', color: '#74866c', fontSize: '10px' }}>{p.unit}</small>
                          </div>
                        </td>

                        <td style={{ padding: '8px 10px', color: '#42573a' }}>{p.category}</td>

                        <td style={{ padding: '8px 10px' }}>
                          {hasDiscount ? (
                            <div>
                              <b style={{ color: '#27680f', fontSize: '13px' }}>${Number(p.discountPrice).toFixed(2)}</b>
                              <del style={{ marginLeft: '6px', color: '#889e7e', fontSize: '11px' }}>${Number(p.price).toFixed(2)}</del>
                              <span style={{ display: 'inline-block', marginLeft: '6px', background: '#dcf1b5', color: '#2b5c0f', padding: '1px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>
                                {Math.round((1 - Number(p.discountPrice) / Number(p.price)) * 100)}% OFF
                              </span>
                            </div>
                          ) : (
                            <b style={{ fontSize: '13px', color: '#1b3310' }}>${Number(p.price).toFixed(2)}</b>
                          )}
                        </td>

                        <td style={{ padding: '8px 10px', color: '#45593c' }}>{p.stock || 25} in stock</td>

                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button 
                              onClick={() => setEditingProduct({ ...p })}
                              style={{ background: '#eaf4db', color: '#2f6110', border: '1px solid #b2d67a', borderRadius: '6px', padding: '5px 9px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                              title="Edit Live Price & Discount"
                            >
                              <Edit3 size={12}/> Edit Price
                            </button>
                            <button 
                              onClick={() => onDeleteProduct(p.id)}
                              style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer' }}
                              title="Delete Product"
                            >
                              <Trash2 size={13}/>
                            </button>
                          </div>
                        </td>
                      </tr>
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
                    <th style={{ padding: '8px 10px' }}>Order ID</th>
                    <th style={{ padding: '8px 10px' }}>Customer</th>
                    <th style={{ padding: '8px 10px' }}>Address</th>
                    <th style={{ padding: '8px 10px' }}>Method</th>
                    <th style={{ padding: '8px 10px' }}>Total</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #eef2e9' }}>
                      <td style={{ padding: '8px 10px' }}><b>{o.id}</b><small style={{ display: 'block', color: '#74866c', fontSize: '10px' }}>{o.date}</small></td>
                      <td style={{ padding: '8px 10px' }}><b>{o.customerName}</b><small style={{ display: 'block', color: '#74866c', fontSize: '10px' }}>{o.customerPhone}</small></td>
                      <td style={{ padding: '8px 10px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.address}</td>
                      <td style={{ padding: '8px 10px' }}>{o.paymentMethod}</td>
                      <td style={{ padding: '8px 10px' }}><b>${Number(o.total).toFixed(2)}</b></td>
                      <td style={{ padding: '8px 10px' }}>
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
