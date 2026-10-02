import subprocess
import os
import time

msedge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
html_path = os.path.abspath("pitch_deck_print.html")
pdf_path = os.path.abspath("InsightO_Pitch_Deck.pdf")

# Ensure old one is gone
if os.path.exists(pdf_path):
    os.remove(pdf_path)

cmd = [
    msedge_path,
    "--headless",
    "--disable-gpu",
    "--print-to-pdf=" + pdf_path,
    "--no-pdf-header-footer",
    "file:///" + html_path
]

print("Running Edge:", cmd)
res = subprocess.run(cmd, capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
print("Code:", res.returncode)

time.sleep(2)
if os.path.exists(pdf_path):
    print(f"PDF generated! Size: {os.path.getsize(pdf_path)} bytes")
else:
    print("PDF generation failed.")
