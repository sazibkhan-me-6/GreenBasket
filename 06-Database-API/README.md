# 06-Database-API

Contains the client-side API service and reactive database layer.

## Files
- `api.js`: Handles persistent state across browser reloads using `localStorage`:
  - `api.getProducts()`, `api.addProduct()`, `api.deleteProduct()`, `api.resetProducts()`
  - `api.getOrders()`, `api.createOrder()`
  - `api.getCurrentUser()`, `api.login()`, `api.logout()`
  - `api.getCart()`, `api.saveCart()`
  - `api.getFavorites()`, `api.saveFavorites()`