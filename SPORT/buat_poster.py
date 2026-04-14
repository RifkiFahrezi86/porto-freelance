import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

output_path = r"d:\SUPERVISOR\SPORT\TUGAS 1\Poster_Perkembangan_Manusia_Nur_Arslan.jpg"

# --- Data ---
stages = ['Bayi', 'Balita', 'Kanak-\nkanak', 'Remaja', 'Dewasa\nAwal', 'Dewasa\nMadya', 'Lansia']
stages_flat = ['Bayi', 'Balita', 'Kanak-kanak', 'Remaja', 'Dewasa Awal', 'Dewasa Madya', 'Lansia']
values = [25, 45, 65, 85, 100, 80, 55]

explanations = {
    'Bayi (±25)': 'Perkembangan masih sangat awal,\npertumbuhan fisik dan fungsi dasar\nberlangsung cepat namun kemampuan\nmotorik belum berkembang maksimal.',
    'Balita (±45)': 'Mulai mengalami peningkatan pesat\npada kemampuan motorik, bahasa,\ndan kemandirian dasar.',
    'Kanak-kanak (±65)': 'Perkembangan fisik, kognitif, dan\nsosial semakin stabil. Kemampuan\nbelajar dan bersosialisasi mulai\nterbentuk dengan baik.',
    'Remaja (±85)': 'Terjadi lonjakan perkembangan\nakibat masa pubertas, baik secara\nfisik, emosional, maupun intelektual.',
    'Dewasa Awal (±100)': 'Merupakan puncak perkembangan.\nKondisi fisik, mental, dan\nproduktivitas berada pada\ntingkat optimal.',
    'Dewasa Madya (±80)': 'Mulai terjadi penurunan bertahap\npada kemampuan fisik, namun\npengalaman dan kematangan\nberpikir terus meningkat.',
    'Lansia (±55)': 'Penurunan lebih lanjut pada kekuatan\nfisik dan fungsi tubuh, sehingga\nmemerlukan penyesuaian dalam\naktivitas sehari-hari.',
}

# --- Colors ---
bg_color = '#FFF8F0'  # warm cream
title_color = '#2C3E50'
bar_colors = ['#E74C3C', '#E67E22', '#F1C40F', '#2ECC71', '#3498DB', '#9B59B6', '#1ABC9C']
accent_color = '#C0392B'
text_dark = '#2C3E50'
text_medium = '#555555'
subtitle_color = '#7F8C8D'

# --- Create figure ---
fig = plt.figure(figsize=(20, 11.25), dpi=150)
fig.patch.set_facecolor(bg_color)

# --- Layout using gridspec ---
# Left side: title + chart (60%), Right side: explanations (40%)
gs = fig.add_gridspec(nrows=20, ncols=20, left=0.02, right=0.98, top=0.98, bottom=0.02,
                      hspace=0.3, wspace=0.5)

# === TOP BANNER ===
ax_banner = fig.add_subplot(gs[0:4, :])
ax_banner.set_xlim(0, 1)
ax_banner.set_ylim(0, 1)
ax_banner.axis('off')

# Draw a colored banner rectangle
banner = FancyBboxPatch((0.01, 0.05), 0.98, 0.9, 
                         boxstyle="round,pad=0.02", 
                         facecolor='#2C3E50', edgecolor='none',
                         transform=ax_banner.transAxes)
ax_banner.add_patch(banner)

# Title text
ax_banner.text(0.5, 0.65, 'GRAFIK PERKEMBANGAN MANUSIA', 
               transform=ax_banner.transAxes,
               fontsize=28, fontweight='bold', color='white',
               ha='center', va='center', 
               fontfamily='sans-serif')
ax_banner.text(0.5, 0.30, 'Dari Lahir hingga Lansia — Pertumbuhan & Perkembangan Fisik',
               transform=ax_banner.transAxes,
               fontsize=14, color='#ECF0F1',
               ha='center', va='center',
               fontfamily='sans-serif', style='italic')

# === LEFT SIDE: CHART ===
ax_chart = fig.add_subplot(gs[5:16, 0:11])
ax_chart.set_facecolor('#FAFAFA')

# Bar chart with gradient-like colored bars
bars = ax_chart.bar(range(len(stages)), values, color=bar_colors, 
                     width=0.7, edgecolor='white', linewidth=1.5,
                     zorder=3)

# Add value labels on top of bars
for i, (bar, val) in enumerate(zip(bars, values)):
    ax_chart.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
                  str(val), ha='center', va='bottom', fontsize=13,
                  fontweight='bold', color=bar_colors[i],
                  fontfamily='sans-serif')

# Add a smooth line connecting the tops
x_smooth = np.linspace(0, len(stages)-1, 100)
from scipy.interpolate import make_interp_spline
try:
    spl = make_interp_spline(range(len(stages)), values, k=3)
    y_smooth = spl(x_smooth)
    ax_chart.plot(x_smooth, y_smooth, color='#E74C3C', linewidth=2.5, 
                  linestyle='--', alpha=0.6, zorder=4)
except:
    ax_chart.plot(range(len(stages)), values, color='#E74C3C', linewidth=2.5,
                  linestyle='--', alpha=0.6, zorder=4, marker='o')

# Styling
ax_chart.set_xticks(range(len(stages)))
ax_chart.set_xticklabels(stages, fontsize=10, fontweight='bold', color=text_dark, fontfamily='sans-serif')
ax_chart.set_ylabel('Tingkat Perkembangan', fontsize=12, fontweight='bold', 
                     color=text_dark, fontfamily='sans-serif', labelpad=10)
ax_chart.set_xlabel('Tahap Usia', fontsize=12, fontweight='bold',
                     color=text_dark, fontfamily='sans-serif', labelpad=10)
ax_chart.set_ylim(0, 115)
ax_chart.set_title('Grafik Batang Tahap Perkembangan Manusia', 
                    fontsize=14, fontweight='bold', color=text_dark,
                    fontfamily='sans-serif', pad=15)

# Grid
ax_chart.yaxis.grid(True, linestyle='--', alpha=0.3, color='gray')
ax_chart.set_axisbelow(True)

# Spine styling
for spine in ['top', 'right']:
    ax_chart.spines[spine].set_visible(False)
for spine in ['bottom', 'left']:
    ax_chart.spines[spine].set_color('#BDC3C7')
    ax_chart.spines[spine].set_linewidth(1.5)

ax_chart.tick_params(colors=text_medium, labelsize=10)

# === RIGHT SIDE: EXPLANATIONS ===
ax_explain = fig.add_subplot(gs[4:17, 11:20])
ax_explain.set_xlim(0, 1)
ax_explain.set_ylim(0, 1)
ax_explain.axis('off')

# Draw explanation box background
explain_bg = FancyBboxPatch((0.02, 0.0), 0.96, 1.0,
                             boxstyle="round,pad=0.02",
                             facecolor='#F8F9FA', edgecolor='#DEE2E6',
                             linewidth=1.5,
                             transform=ax_explain.transAxes)
ax_explain.add_patch(explain_bg)

# Title for explanations
ax_explain.text(0.5, 0.97, 'Penjelasan Tiap Tahap', 
                transform=ax_explain.transAxes,
                fontsize=16, fontweight='bold', color=accent_color,
                ha='center', va='top', fontfamily='sans-serif')

# Underline
ax_explain.plot([0.1, 0.9], [0.945, 0.945], transform=ax_explain.transAxes,
                color=accent_color, linewidth=2)

# Explanations text
y_pos = 0.92
stage_keys = list(explanations.keys())
for i, (stage, desc) in enumerate(explanations.items()):
    # Stage name with bullet color
    color = bar_colors[i]
    
    # Colored bullet/dot
    ax_explain.plot(0.06, y_pos - 0.005, 'o', color=color, markersize=8,
                    transform=ax_explain.transAxes)
    
    # Stage name
    ax_explain.text(0.10, y_pos, stage + ':', 
                    transform=ax_explain.transAxes,
                    fontsize=10.5, fontweight='bold', color=color,
                    va='top', fontfamily='sans-serif')
    
    # Description (single line format)
    desc_oneline = desc.replace('\n', ' ')
    ax_explain.text(0.10, y_pos - 0.035, desc_oneline,
                    transform=ax_explain.transAxes,
                    fontsize=8.5, color=text_medium,
                    va='top', fontfamily='sans-serif',
                    wrap=True,
                    linespacing=1.3)
    
    y_pos -= 0.13

# === BOTTOM SECTION: Conclusion + Name ===
ax_bottom = fig.add_subplot(gs[17:20, :])
ax_bottom.set_xlim(0, 1)
ax_bottom.set_ylim(0, 1)
ax_bottom.axis('off')

# Conclusion box on the left
conclusion_bg = FancyBboxPatch((0.02, 0.1), 0.55, 0.85,
                                boxstyle="round,pad=0.02",
                                facecolor='#EBF5FB', edgecolor='#3498DB',
                                linewidth=1.5,
                                transform=ax_bottom.transAxes)
ax_bottom.add_patch(conclusion_bg)

ax_bottom.text(0.04, 0.85, 'Kesimpulan:', 
               transform=ax_bottom.transAxes,
               fontsize=13, fontweight='bold', color='#2980B9',
               va='top', fontfamily='sans-serif')

conclusion_text = ('Perkembangan manusia meningkat dari masa bayi hingga mencapai puncaknya '
                   'di dewasa awal, kemudian\nperlahan menurun seiring bertambahnya usia. '
                   'Setiap tahap memiliki karakteristik dan tantangan tersendiri.')
ax_bottom.text(0.04, 0.55, conclusion_text,
               transform=ax_bottom.transAxes,
               fontsize=10, color=text_dark,
               va='top', fontfamily='sans-serif',
               linespacing=1.4)

# Name box on the right
name_bg = FancyBboxPatch((0.62, 0.1), 0.36, 0.85,
                          boxstyle="round,pad=0.02",
                          facecolor='#2C3E50', edgecolor='none',
                          transform=ax_bottom.transAxes)
ax_bottom.add_patch(name_bg)

ax_bottom.text(0.80, 0.70, 'NAMA : NUR ARSLAN',
               transform=ax_bottom.transAxes,
               fontsize=14, fontweight='bold', color='#F39C12',
               ha='center', va='center', fontfamily='sans-serif')

ax_bottom.text(0.80, 0.35, 'NIM : 250301502050',
               transform=ax_bottom.transAxes,
               fontsize=12, fontweight='bold', color='#E74C3C',
               ha='center', va='center', fontfamily='sans-serif')

# === Save ===
plt.savefig(output_path, dpi=150, bbox_inches='tight', 
            facecolor=fig.get_facecolor(), edgecolor='none',
            pad_inches=0.3)
plt.close()

print(f"Poster saved to: {output_path}")
print(f"File size: {os.path.getsize(output_path) / 1024:.0f} KB")
