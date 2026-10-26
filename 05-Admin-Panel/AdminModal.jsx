import React, { useState } from 'react';
import { X, Package, ShoppingBag, Plus, Trash2, TrendingUp, Users, DollarSign, CheckCircle2 } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, products, orders, onAddProduct, onDeleteProduct }) {
  const [activeTab, setActiveTab] = useState('products');
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: '500g / pack',
    stock: '30',
    tag: 'Fresh Harvest',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=85'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, ord) => sum + (parseFloat(ord.total) || 0), 0);

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    onAddProduct(newProd);
    setNewProd({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: '500g / pack',
      stock: '30',
      tag: 'Fresh Harvest',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=85'
    });
    setShowAddForm(false);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 65, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        onClick={e => e.stopPropagation()} 
        style={{
          background: '#fcfdfa',
          color: '#1a3211',
          width: 'min(900px, calc(100% - 28px))',
          maxHeight: '90vh',
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
            <h2 style={{ margin: '2px 0 0', fontFamily: 'Manrope, sans-serif', fontSize: '22px' }}>GreenBasket Admin Control Panel</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#687761' }} aria-label="Close">
            <X size={22}/>
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '16px 0' }}>
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

        {/* Tab Content */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {activeTab === 'products' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#5e7155' }}>Manage store items and live pricing</span>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#75a828', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                >
                  <Plus size={14}/> {showAddForm ? 'Close Form' : 'Add New Product'}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleCreateProduct} style={{ background: '#f2f6ec', border: '1px solid #d3e0c7', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px' }}>Item Name</label>
                    <input required placeholder="e.g. Organic Avocados" value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #c9d6be', fontSize: '11px' }}/>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px' }}>Category</label>
                    <select value={newProd.category} onChange={e => setNewProd({ ...newProd, category: e.target.value })} style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #c9d6be', fontSize: '11px' }}>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Herbs & Greens">Herbs & Greens</option>
                      <option value="Dairy & Eggs">Dairy & Eggs</option>
                      <option value="Nuts & Seeds">Nuts & Seeds</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px' }}>Price ($)</label>
                    <input required type="number" step="0.01" placeholder="2.99" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #c9d6be', fontSize: '11px' }}/>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px' }}>Unit / Packing</label>
                    <input placeholder="500g / pack" value={newProd.unit} onChange={e => setNewProd({ ...newProd, unit: e.target.value })} style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #c9d6be', fontSize: '11px' }}/>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px' }}>Stock Quantity</label>
                    <input type="number" placeholder="30" value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: e.target.value })} style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #c9d6be', fontSize: '11px' }}/>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, marginBottom: '3px' }}>Tag / Badge</label>
                    <input placeholder="Fresh Harvest" value={newProd.tag} onChange={e => setNewProd({ ...newProd, tag: e.target.value })} style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #c9d6be', fontSize: '11px' }}/>
                  </div>
                  <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button type="submit" style={{ background: '#2c5211', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Save Product</button>
                  </div>
                </form>
              )}

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f1f5ec', textAlign: 'left', borderBottom: '1px solid #dbe5d4' }}>
                    <th style={{ padding: '8px 10px' }}>Product</th>
                    <th style={{ padding: '8px 10px' }}>Category</th>
                    <th style={{ padding: '8px 10px' }}>Price</th>
                    <th style={{ padding: '8px 10px' }}>Stock</th>
                    <th style={{ padding: '8px 10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #eef2e9' }}>
                      <td style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={p.image} alt={p.name} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }}/>
                        <div>
                          <b>{p.name}</b>
                          <small style={{ display: 'block', color: '#74866c', fontSize: '10px' }}>{p.unit}</small>
                        </div>
                      </td>
                      <td style={{ padding: '8px 10px' }}>{p.category}</td>
                      <td style={{ padding: '8px 10px' }}><b>${Number(p.price).toFixed(2)}</b></td>
                      <td style={{ padding: '8px 10px' }}>{p.stock || 25} in stock</td>
                      <td style={{ padding: '8px 10px' }}>
                        <button 
                          onClick={() => onDeleteProduct(p.id)}
                          style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer' }}
                          title="Delete Product"
                        >
                          <Trash2 size={13}/>
                        </button>
                      </td>
                    </tr>
                  ))}
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
