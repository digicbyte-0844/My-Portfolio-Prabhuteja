import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Mobile Menu
html = re.sub(r'(<span class="hover-media"><i class="ph ph-github-logo"></i></span>\s*</a>\s*</li>)', r'\1\n                <li>\n                  <a href="https://www.instagram.com/always_prabhuteja?stkn=emRicDBvaXp0eTBn&utm_source=qr" target="_blank" rel="noopener noreferrer">\n                    <span class="active-media d-flex align-items-center tw-gap-1">INSTAGRAM <i class="ph ph-arrow-bend-up-right"></i></span>\n                    <span class="hover-media"><i class="ph ph-instagram-logo"></i></span>\n                  </a>\n                </li>', html)

# 2. Navbar
html = re.sub(r'(<i class="ph-bold ph-github-logo icon-symbol tw-text-xl position-relative z-1"></i>\s*<span class="tw-hover-btn-circle-dot dot-linkedin"></span>\s*</a>\s*</li>)', r'\1\n              <li class="nav-social-item position-relative" data-tooltip="Instagram">\n                <a class="nav-social-btn tw-hover-btn tw-w-13 tw-h-13 lh-1 d-inline-flex justify-content-center align-items-center text-heading position-relative overflow-hidden" href="https://www.instagram.com/always_prabhuteja?stkn=emRicDBvaXp0eTBn&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">\n                  <i class="ph-bold ph-instagram-logo icon-symbol tw-text-xl position-relative z-1"></i>\n                  <span class="tw-hover-btn-circle-dot dot-linkedin"></span>\n                </a>\n              </li>', html)

# 3. Footer
html = re.sub(r'(aria-label="GitHub"><i class="ph-bold ph-github-logo"></i></a>\s*</li>)', r'\1\n                          <li>\n                            <a class="tw-w-9 tw-h-9 lh-1 d-inline-flex align-items-center justify-content-center tw-rounded-md tw-text-lg text-heading hover-bg-main-600 hover-text-white" href="https://www.instagram.com/always_prabhuteja?stkn=emRicDBvaXp0eTBn&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="ph-bold ph-instagram-logo"></i></a>\n                          </li>', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

