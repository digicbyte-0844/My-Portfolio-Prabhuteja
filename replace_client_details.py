import os

filepath = 'index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "Sri Lakshmi Milk Supplies (SLMS) — Dairy ERP": "Enterprise Dairy ERP & Logistics Platform",
    "Sri Lakshmi Milk Supplies (SLMS)": "Enterprise Dairy Logistics",
    "Vidhata Polymed (Enterprise B2B Manufacturing Portal)": "Global B2B Manufacturing Portal",
    "Vidhata Polymed": "Enterprise Manufacturer",
    "Enterprise Service & Booking Platform (PS Safety Nets)": "Commercial Service & Booking Platform",
    "PS Safety Nets": "Commercial Service Solutions",
    "Cousins Life Style (Affiliate E-Commerce Engine)": "Premium Affiliate E-Commerce Engine",
    "Cousins Life Style": "Lifestyle Affiliate Platform"
}

for old_text, new_text in replacements.items():
    content = content.replace(old_text, new_text)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Client details sanitized.")
