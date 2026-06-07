import fitz  # PyMuPDF
from PIL import Image
import io
import os

def extract_images_from_pdf(pdf_path, output_dir, prefix):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    doc = fitz.open(pdf_path)
    image_count = 0
    extracted_paths = []
    
    for page_index in range(len(doc)):
        page = doc[page_index]
        image_list = page.get_images()
        
        for image_index, img in enumerate(image_list, start=1):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Save the image
            image_filename = f"{prefix}_page{page_index+1}_img{image_index}.{image_ext}"
            image_filepath = os.path.join(output_dir, image_filename)
            
            with open(image_filepath, "wb") as f:
                f.write(image_bytes)
                
            # Convert to webp if it's png or jpeg for optimization (optional, but good practice)
            try:
                img_pil = Image.open(image_filepath)
                # Only keep reasonably sized images to filter out small icons/logos if needed
                if img_pil.width >= 100 and img_pil.height >= 100:
                    webp_path = os.path.splitext(image_filepath)[0] + ".webp"
                    img_pil.save(webp_path, "WEBP", quality=85)
                    os.remove(image_filepath)
                    extracted_paths.append(webp_path)
                    image_count += 1
                else:
                    # Remove small images
                    os.remove(image_filepath)
            except Exception as e:
                print(f"Error processing {image_filepath}: {e}")
                
    print(f"Extracted {image_count} images from {pdf_path}")
    return extracted_paths

pdfs = [
    ("/Users/madhusudhanm/Documents/GIT/OPTUM_CAR_CARE/HOME_PAGE.pdf", "home"),
    ("/Users/madhusudhanm/Documents/GIT/OPTUM_CAR_CARE/SERVICE_MAIN_PAGE.pdf", "service_main"),
    ("/Users/madhusudhanm/Documents/GIT/OPTUM_CAR_CARE/DETAILED_SERVICE_PAGE_SINGLE.pdf", "service_detail"),
]

output_dir = "/Users/madhusudhanm/Documents/GIT/OPTUM_CAR_CARE/extracted_images"
for pdf_path, prefix in pdfs:
    if os.path.exists(pdf_path):
        extract_images_from_pdf(pdf_path, output_dir, prefix)
    else:
        print(f"File not found: {pdf_path}")
