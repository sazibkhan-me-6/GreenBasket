# GreenBasket features

## Implemented in frontend demo
- Responsive navigation
- Product search
- Category filters
- Favorites toggle
- Add to cart and quantity controls
- Subtotal, delivery fee and total
- Newsletter email validation and success state
- Responsive hero, farm story, deals, benefits and footer sections

## Not production-connected yet
- Real customer accounts
- Persistent database and inventory
- Admin permissions and order management
- Real order submission and delivery tracking
- Newsletter persistence
- Payment processing

## Recommended production architecture
React/Vite frontend → backend API → database.
Payment provider webhooks should be verified by the backend.
