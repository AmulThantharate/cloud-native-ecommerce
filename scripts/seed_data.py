"""
Seed script to populate the database with sample data.
Run after starting services with docker-compose up.
"""

import requests
import json

API_BASE = "http://localhost:8000"

def seed_categories():
    categories = [
        {"name": "Electronics", "slug": "electronics", "description": "Latest gadgets and devices"},
        {"name": "Clothing", "slug": "clothing", "description": "Fashion for everyone"},
        {"name": "Home & Living", "slug": "home-living", "description": "Make your home beautiful"},
        {"name": "Sports", "slug": "sports", "description": "Gear for active lifestyles"},
        {"name": "Books", "slug": "books", "description": "Read and learn"},
    ]
    created = []
    for cat in categories:
        try:
            r = requests.post(f"{API_BASE}/categories", params=cat)
            if r.status_code in [200, 201]:
                created.append(r.json())
                print(f"Created category: {cat['name']}")
        except Exception as e:
            print(f"Error creating category {cat['name']}: {e}")
    return created

def seed_products(categories):
    # Map: 0=Electronics, 1=Clothing, 2=Home, 3=Sports, 4=Books
    products = [
        # ── Electronics ──────────────────────────────────────────
        {
            "name": "Wireless Noise-Cancelling Headphones",
            "description": "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound. Perfect for travel, work, and immersive listening experiences.",
            "price": 249.99, "originalPrice": 299.99, "stock": 150, "sku": "ELEC-001",
            "categoryId": categories[0]["id"],
            "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
            "tags": ["wireless", "headphones", "audio", "premium"],
            "features": ["Active Noise Cancellation", "30h Battery", "Bluetooth 5.3", "Foldable Design"],
            "specifications": {"Driver Size": "40mm", "Frequency": "20Hz-20kHz", "Weight": "250g", "Connectivity": "Bluetooth 5.3"},
            "isNew": True, "isBestseller": True, "isFeatured": True,
        },
        {
            "name": "Smart Watch Pro",
            "description": "Advanced fitness tracking, heart rate monitoring, GPS, and 7-day battery life. Water-resistant up to 50 meters.",
            "price": 399.00, "stock": 200, "sku": "ELEC-002",
            "categoryId": categories[0]["id"],
            "images": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
            "tags": ["smartwatch", "fitness", "wearable"],
            "features": ["Heart Rate Monitor", "GPS Tracking", "7-Day Battery", "Water Resistant"],
            "specifications": {"Display": "1.4 inch AMOLED", "Battery": "7 days", "Water Resistance": "5ATM", "Sensors": "HR, SpO2, GPS"},
            "isNew": True, "isFeatured": True,
        },
        {
            "name": "Portable Bluetooth Speaker",
            "description": "360-degree sound, waterproof design, 12-hour battery. Perfect for outdoor adventures and parties.",
            "price": 79.99, "originalPrice": 99.99, "stock": 180, "sku": "ELEC-003",
            "categoryId": categories[0]["id"],
            "images": ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800"],
            "tags": ["speaker", "bluetooth", "portable", "waterproof"],
            "features": ["360 Sound", "IPX7 Waterproof", "12h Battery", "Stereo Pairing"],
            "specifications": {"Power": "20W", "Battery": "12h", "Waterproof": "IPX7", "Range": "30m"},
            "isFeatured": True,
        },
        {
            "name": "Wireless Earbuds Ultra",
            "description": "True wireless earbuds with spatial audio, adaptive transparency, and MagSafe charging case. 6 hours battery.",
            "price": 179.99, "originalPrice": 199.99, "stock": 300, "sku": "ELEC-004",
            "categoryId": categories[0]["id"],
            "images": ["https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800"],
            "tags": ["earbuds", "wireless", "audio"],
            "features": ["Spatial Audio", "Adaptive Transparency", "MagSafe Charging", "IPX4"],
            "specifications": {"Driver": "11mm", "Battery": "6h + 24h case", "ANC": "Yes", "Weight": "5.4g each"},
            "isNew": True, "isFeatured": True,
        },
        {
            "name": "4K Webcam Pro",
            "description": "Ultra HD 4K webcam with auto-framing, noise-cancelling mic, and HDR. Perfect for streaming and video calls.",
            "price": 129.99, "stock": 90, "sku": "ELEC-005",
            "categoryId": categories[0]["id"],
            "images": ["https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800"],
            "tags": ["webcam", "streaming", "video"],
            "features": ["4K UHD", "Auto-framing", "Noise-cancelling mic", "HDR"],
            "specifications": {"Resolution": "4K 30fps", "FOV": "90 degrees", "Mount": "Universal clip", "Connection": "USB-C"},
        },

        # ── Clothing ─────────────────────────────────────────────
        {
            "name": "Organic Cotton T-Shirt",
            "description": "100% organic cotton t-shirt. Soft, breathable, and sustainably made. Available in multiple colors.",
            "price": 29.99, "originalPrice": 39.99, "stock": 500, "sku": "CLTH-001",
            "categoryId": categories[1]["id"],
            "images": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
            "tags": ["organic", "cotton", "sustainable"],
            "features": ["100% Organic Cotton", "Pre-shrunk", "Eco-friendly dye"],
            "specifications": {"Material": "100% Organic Cotton", "Fit": "Regular", "Care": "Machine wash cold"},
            "isBestseller": True, "isFeatured": True,
        },
        {
            "name": "Slim Fit Denim Jeans",
            "description": "Classic slim-fit denim jeans with stretch comfort. Dark wash finish with subtle fading. Durable yet flexible.",
            "price": 69.99, "originalPrice": 89.99, "stock": 250, "sku": "CLTH-002",
            "categoryId": categories[1]["id"],
            "images": ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"],
            "tags": ["jeans", "denim", "slim-fit"],
            "features": ["Stretch Comfort", "Dark Wash", "5-pocket Design", "Durable"],
            "specifications": {"Material": "98% Cotton, 2% Elastane", "Fit": "Slim", "Rise": "Mid", "Wash": "Dark indigo"},
            "isBestseller": True,
        },
        {
            "name": "Leather Crossbody Bag",
            "description": "Genuine leather crossbody bag with adjustable strap. Multiple compartments for everyday essentials.",
            "price": 89.99, "stock": 120, "sku": "CLTH-003",
            "categoryId": categories[1]["id"],
            "images": ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"],
            "tags": ["bag", "leather", "crossbody", "accessories"],
            "features": ["Genuine Leather", "Adjustable Strap", "Multiple Compartments", "YKK Zippers"],
            "specifications": {"Material": "Full-grain leather", "Size": "25x18x8 cm", "Strap": "Adjustable 60-130cm", "Pockets": "3 internal + 2 external"},
            "isNew": True,
        },
        {
            "name": "Wool Blend Overcoat",
            "description": "Elegant wool blend overcoat for the colder months. Tailored fit with satin lining. A timeless wardrobe essential.",
            "price": 199.99, "originalPrice": 279.99, "stock": 60, "sku": "CLTH-004",
            "categoryId": categories[1]["id"],
            "images": ["https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800"],
            "tags": ["coat", "wool", "winter", "formal"],
            "features": ["Wool Blend", "Satin Lining", "Tailored Fit", "Two Button Closure"],
            "specifications": {"Material": "70% Wool, 30% Polyester", "Lining": "100% Satin", "Fit": "Tailored", "Length": "Mid-thigh"},
            "isFeatured": True,
        },
        {
            "name": "Canvas Sneakers Classic",
            "description": "Timeless canvas sneakers with vulcanized rubber sole. Lightweight and versatile for everyday wear.",
            "price": 49.99, "stock": 400, "sku": "CLTH-005",
            "categoryId": categories[1]["id"],
            "images": ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800"],
            "tags": ["sneakers", "canvas", "casual", "shoes"],
            "features": ["Canvas Upper", "Vulcanized Sole", "Cushioned Insole", "Classic Design"],
            "specifications": {"Upper": "Canvas", "Sole": "Vulcanized rubber", "Closure": "Lace-up", "Weight": "340g"},
            "isBestseller": True,
        },

        # ── Home & Living ────────────────────────────────────────
        {
            "name": "Minimalist Desk Lamp",
            "description": "Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included.",
            "price": 59.99, "stock": 100, "sku": "HOME-001",
            "categoryId": categories[2]["id"],
            "images": ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800"],
            "tags": ["lighting", "desk", "office"],
            "features": ["Adjustable Brightness", "Color Temperature Control", "USB Charging Port", "Touch Control"],
            "specifications": {"Power": "12W LED", "Color Temp": "2700K-6500K", "Height": "45cm", "Base": "15cm"},
            "isFeatured": True,
        },
        {
            "name": "Ceramic Planter Set",
            "description": "Set of 3 minimalist ceramic planters in matte finish. Includes drainage trays. Perfect for succulents and herbs.",
            "price": 34.99, "stock": 200, "sku": "HOME-002",
            "categoryId": categories[2]["id"],
            "images": ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800"],
            "tags": ["planter", "ceramic", "plants", "home decor"],
            "features": ["Set of 3", "Matte Finish", "Drainage Holes", "Bamboo Trays"],
            "specifications": {"Sizes": "S:10cm, M:13cm, L:16cm", "Material": "Ceramic", "Finish": "Matte", "Includes": "Bamboo drain trays"},
            "isNew": True,
        },
        {
            "name": "Scented Candle Collection",
            "description": "Luxury soy wax candle set with wooden wicks. Notes of vanilla, sandalwood, and lavender. 45-hour burn time each.",
            "price": 42.99, "originalPrice": 54.99, "stock": 150, "sku": "HOME-003",
            "categoryId": categories[2]["id"],
            "images": ["https://images.unsplash.com/photo-1602178000587-b6bab6e3fc71?w=800"],
            "tags": ["candle", "scented", "soy", "relaxation"],
            "features": ["Soy Wax", "Wooden Wick", "45h Burn Time", "Set of 3 Scents"],
            "specifications": {"Wax": "100% Soy", "Wick": "Wooden", "Burn Time": "45h each", "Weight": "200g each"},
            "isBestseller": True,
        },
        {
            "name": "Throw Blanket Premium",
            "description": "Ultra-soft microfiber throw blanket. Perfect for cozy nights on the couch. Machine washable.",
            "price": 39.99, "stock": 180, "sku": "HOME-004",
            "categoryId": categories[2]["id"],
            "images": ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
            "tags": ["blanket", "throw", "cozy", "soft"],
            "features": ["Ultra-soft Microfiber", "Machine Washable", "Lightweight", "Fade Resistant"],
            "specifications": {"Size": "150x200cm", "Material": "Microfiber", "Weight": "600g", "Care": "Machine wash"},
        },

        # ── Sports ───────────────────────────────────────────────
        {
            "name": "Yoga Mat Premium",
            "description": "Extra thick, non-slip yoga mat with alignment lines. Eco-friendly TPE material. Includes carrying strap.",
            "price": 45.00, "stock": 300, "sku": "SPORT-001",
            "categoryId": categories[3]["id"],
            "images": ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800"],
            "tags": ["yoga", "fitness", "eco-friendly"],
            "features": ["6mm Thick", "Non-slip Surface", "Alignment Lines", "Eco-friendly TPE"],
            "specifications": {"Thickness": "6mm", "Size": "183cm x 61cm", "Material": "TPE", "Weight": "1.2kg"},
            "isBestseller": True, "isFeatured": True,
        },
        {
            "name": "Running Shoes Elite",
            "description": "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for marathon runners.",
            "price": 129.99, "stock": 120, "sku": "SPORT-002",
            "categoryId": categories[3]["id"],
            "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
            "tags": ["running", "shoes", "athletic"],
            "features": ["Responsive Cushioning", "Breathable Mesh", "Carbon Fiber Plate", "Lightweight"],
            "specifications": {"Weight": "210g", "Drop": "8mm", "Upper": "Engineered Mesh", "Midsole": "ZoomX Foam"},
            "isBestseller": True, "isFeatured": True,
        },
        {
            "name": "Trail Running Shoes",
            "description": "Rugged trail running shoes with aggressive tread and rock guard. Waterproof membrane keeps feet dry on any terrain.",
            "price": 149.99, "originalPrice": 179.99, "stock": 85, "sku": "SPORT-003",
            "categoryId": categories[3]["id"],
            "images": ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800"],
            "tags": ["trail", "running", "waterproof", "shoes"],
            "features": ["Waterproof Membrane", "Rock Guard", "Aggressive Tread", "Gusseted Tongue"],
            "specifications": {"Upper": "Ripstop + Waterproof", "Outsole": "Vibram Megagrip", "Drop": "6mm", "Weight": "310g"},
            "isNew": True,
        },
        {
            "name": "Resistance Bands Set",
            "description": "Set of 5 resistance bands with different tension levels. Includes door anchor, handles, and carry bag.",
            "price": 24.99, "stock": 500, "sku": "SPORT-004",
            "categoryId": categories[3]["id"],
            "images": ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800"],
            "tags": ["resistance", "bands", "workout", "home gym"],
            "features": ["5 Resistance Levels", "Door Anchor", "Padded Handles", "Carry Bag"],
            "specifications": {"Levels": "10-50 lbs", "Material": "Latex", "Set Includes": "5 bands + accessories", "Warranty": "1 year"},
        },
        {
            "name": "Insulated Water Bottle",
            "description": "Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold 24h or hot 12h. BPA-free.",
            "price": 29.99, "stock": 400, "sku": "SPORT-005",
            "categoryId": categories[3]["id"],
            "images": ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800"],
            "tags": ["water bottle", "insulated", "stainless steel"],
            "features": ["24h Cold / 12h Hot", "BPA-free", "Leak-proof Lid", "750ml Capacity"],
            "specifications": {"Capacity": "750ml", "Material": "18/8 Stainless Steel", "Insulation": "Double-wall vacuum", "Weight": "350g"},
            "isBestseller": True,
        },

        # ── Books ────────────────────────────────────────────────
        {
            "name": "The Art of Clean Code",
            "description": "A comprehensive guide to writing maintainable, scalable, and beautiful code. Covers design patterns, testing, and best practices.",
            "price": 34.99, "stock": 250, "sku": "BOOK-001",
            "categoryId": categories[4]["id"],
            "images": ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800"],
            "tags": ["programming", "software", "education"],
            "features": ["400+ Pages", "Code Examples", "Best Practices", "Design Patterns"],
            "specifications": {"Pages": "420", "Format": "Hardcover", "Language": "English", "Publisher": "TechPress"},
            "isNew": True, "isFeatured": True,
        },
        {
            "name": "Microservices Architecture",
            "description": "Deep dive into designing, building, and deploying microservices at scale. Real-world case studies from industry leaders.",
            "price": 44.99, "stock": 180, "sku": "BOOK-002",
            "categoryId": categories[4]["id"],
            "images": ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800"],
            "tags": ["microservices", "architecture", "cloud"],
            "features": ["500+ Pages", "Case Studies", "Docker & K8s Examples", "API Design"],
            "specifications": {"Pages": "520", "Format": "Paperback", "Language": "English", "Publisher": "CloudBooks"},
            "isNew": True,
        },
        {
            "name": "Design Thinking Handbook",
            "description": "Master human-centered design with practical frameworks. From empathy mapping to prototyping and testing.",
            "price": 27.99, "originalPrice": 35.99, "stock": 220, "sku": "BOOK-003",
            "categoryId": categories[4]["id"],
            "images": ["https://images.unsplash.com/photo-1589998059171-988d887df646?w=800"],
            "tags": ["design", "UX", "creativity"],
            "features": ["Practical Frameworks", "Workshop Templates", "Case Studies", "Visual Examples"],
            "specifications": {"Pages": "280", "Format": "Paperback", "Language": "English", "Publisher": "DesignPress"},
            "isBestseller": True,
        },
    ]

    created = []
    for product in products:
        if not product.get("categoryId"):
            continue
        try:
            r = requests.post(f"{API_BASE}/products", json=product)
            if r.status_code in [200, 201]:
                created.append(r.json())
                print(f"Created product: {product['name']}")
            else:
                print(f"Error {r.status_code} creating {product['name']}: {r.text[:100]}")
        except Exception as e:
            print(f"Error creating product {product['name']}: {e}")
    return created

def seed_users():
    users = [
        {"email": "admin@nexstore.com", "password": "admin123", "firstName": "Admin", "lastName": "User"},
        {"email": "user@nexstore.com", "password": "user123", "firstName": "John", "lastName": "Doe"},
    ]
    created = []
    for user in users:
        try:
            r = requests.post(f"{API_BASE}/users/signup", json=user)
            if r.status_code in [200, 201]:
                created.append(r.json())
                print(f"Created user: {user['email']}")
            elif r.status_code == 400:
                print(f"User already exists: {user['email']}")
        except Exception as e:
            print(f"Error creating user {user['email']}: {e}")
    return created

if __name__ == "__main__":
    print("Seeding database...")
    print("=" * 50)

    print("\n--- Seeding Users ---")
    seed_users()

    print("\n--- Seeding Categories ---")
    categories = seed_categories()

    print("\n--- Seeding Products ---")
    products = seed_products(categories)

    print("\n" + "=" * 50)
    print(f"Seeded {len(categories)} categories and {len(products)} products")
    print("Done!")
