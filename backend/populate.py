import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from content.models import (
    HomePageConfig, PainPoint, StandardItem, AboutFeature,
    CuratedMake, BrandPartner, Testimonial, GeneralFAQ
)
from services.models import (
    Service, ServiceFeature, ServiceFAQ, ServiceStandardItem, ServiceBeforeAfter
)

def populate_db():
    print("Clearing old data from all models...")
    HomePageConfig.objects.all().delete()
    PainPoint.objects.all().delete()
    StandardItem.objects.all().delete()
    AboutFeature.objects.all().delete()
    CuratedMake.objects.all().delete()
    BrandPartner.objects.all().delete()
    Testimonial.objects.all().delete()
    GeneralFAQ.objects.all().delete()
    Service.objects.all().delete()
    ServiceFeature.objects.all().delete()
    ServiceFAQ.objects.all().delete()
    ServiceStandardItem.objects.all().delete()
    ServiceBeforeAfter.objects.all().delete()

    print("Creating HomePageConfig...")
    config = HomePageConfig.objects.create(
        # Hero Section
        hero_title="Protect what you love.",
        hero_subtitle="Bengaluru's trusted choice for premium auto care.",
        vehicles_protected="55,078",
        
        # Pain Points Section
        pain_points_title="Without the right team, the right products, and the right process, you're left dealing with:",
        
        # Pain Points Intro Section
        intro_title="You Want the Best for What Matters",
        intro_description="With Bengaluru's traffic, road dust, and unpredictable monsoon weather, protection isn't optional—it's essential. That's why many vehicle owners want top-quality care for their premium cars and bikes. But finding a trusted expert to protect and maintain them can be challenging.",

        # Middle CTA Banner
        banner_cta_title="WHATEVER PROTECTION OR ENHANCEMENT YOUR VEHICLE NEEDS...",
        banner_cta_subtitle="We do it right the first time.",

        # The Standard Section
        standard_title="You Want the Best for What Matters",
        standard_description="We don't just detail; we preserve history. Every vehicle that enters our studio undergoes a rigorous diagnostic and technical preparation phase before we apply the first layer of protection.",
        standard_image="content/standard/standard_car.png",
        
        # About Us Section
        about_title="PREMIERE AUTOMOTIVE DETAILING",
        about_description="At Optum Car Care, we understand that every vehicle has different needs. We love to educate and deliver solutions to keep your vehicle looking its best for years to come. Little details matter, and that's what sets us apart from others. Our passionate and certified team goes above and beyond to make your vehicle look and feel new again. Car Detailing Bengaluru is our specialty, and Optum Car Care strives to deliver the best results by only using quality products and tools in the premium automotive industry.",
        
        # Partners Description
        partners_description="Optum Car Care is proud to be a certified installer in automotive paint protection film and window tinting along with vinyl wrapping and other services! By using some of the best products in the industry, we guarantee and stand by our products and craftsmanship.",

        # Stats
        stat_1_number="2,500+",
        stat_1_text="Cars Detailed",
        stat_2_number="8+",
        stat_2_text="Years of Experience",
        stat_3_number="30+",
        stat_3_text="Certified & Trusted Experts",
        
        # Dynamic Contact Details & Working Hours
        address="726, 9th Main Hongasandra GB Palya Rd, B Block, AECS Layout, Singasandra, Bengaluru, Karnataka 560068",
        phone="096328 04024",
        email="info@optumcarcare.com",
        working_hours_mon_fri="10:00 AM to 6:00 PM (Appointment Only)",
        working_hours_sat="11:00 AM to 2:00 PM (Appointment Only)",
        working_hours_sun="Closed",
        
        # SEO
        meta_title="Optum Car Care | Premium Automotive Detailing Bengaluru",
        meta_description="Bengaluru's trusted choice for premium auto care.",
        meta_keywords="car detailing, paint protection film, ceramic coating Bengaluru"
    )

    print("Adding Pain Points...")
    pain_points = [
        "Inexperienced techs who wing it instead of doing it right",
        "Shoddy work that ends up costing you more",
        "Low-quality materials that fail within weeks",
        "Pushy sales tactics that make you feel pressured"
    ]
    for pp in pain_points:
        PainPoint.objects.create(config=config, text=pp)

    print("Adding Standard Items...")
    standards = [
        "Environmentally Controlled Clean Room",
        "Master-Certified Technicians",
        "Lifetime Workmanship Warranty"
    ]
    for s in standards:
        StandardItem.objects.create(config=config, text=s)

    print("Adding About Features...")
    about_features = [
        "HIGH QUALITY",
        "ULTIMATE CONVENIENCE",
        "ABSOLUTE PROFESSIONALISM"
    ]
    for a in about_features:
        AboutFeature.objects.create(config=config, text=a)

    print("Adding Curated Makes (EV's & Exotics) with real PDF images...")
    makes_data = [
        {"name": "RIVIAN", "image": "content/makes/rivian.png"},
        {"name": "TESLA", "image": "content/makes/tesla.png"},
        {"name": "PORSCHE", "image": "content/makes/porsche.png"},
        {"name": "MERCEDES", "image": "content/makes/mercedes.png"}
    ]
    for m in makes_data:
        CuratedMake.objects.create(name=m['name'], image=m['image'])

    print("Adding Brand Partners with real PDF images...")
    partners_data = [
        {"name": "XPEL", "logo": "content/partners/xpel.png"},
        {"name": "ADDICTIVE", "logo": "content/partners/addictive.png"},
        {"name": "GMF", "logo": "content/partners/gmf.png"},
        {"name": "AVERY", "logo": "content/partners/avery.png"},
        {"name": "INOZETEK", "logo": "content/partners/inozetek.png"},
        {"name": "FEYNLAB", "logo": "content/partners/feynlab.png"},
        {"name": "SUNTEK", "logo": "content/partners/suntek.png"},
        {"name": "3M", "logo": "content/partners/3m.png"},
        {"name": "RUPES", "logo": "content/partners/rupes.png"},
        {"name": "STEK", "logo": "content/partners/stek.png"}
    ]
    for p in partners_data:
        BrandPartner.objects.create(name=p['name'], logo=p['logo'])

    print("Adding Testimonials...")
    Testimonial.objects.create(
        author_name="Jerry Xu",
        date_posted="11 days ago",
        text="Thomas and Mylan took great care of my car when I went in and got a full front PPF. Meticulous, clean clean work, and overall incredibly friendly and professional! Highly recommend Pristine Detail.",
        rating=5
    )
    Testimonial.objects.create(
        author_name="Coolguak S",
        date_posted="14 days ago",
        text="Had a GREAT experience getting my Aston Martin DBX tinted, really professional team, prompt service, and flawless edges. Best detail shop in the area!",
        rating=5
    )

    print("Adding General FAQs...")
    faqs_data = [
        {
            "question": "Do you require a deposit?",
            "answer": "Yes, we require a deposit to secure your booking slot as we schedule our master technicians to focus solely on your vehicle during its stay."
        },
        {
            "question": "Do you store vehicles indoors? Can you fit larger vehicles?",
            "answer": "Yes, all vehicles are kept securely indoors in our climate-controlled clean room. Our facility can accommodate vehicles of all sizes including large trucks and SUVs."
        },
        {
            "question": "Do you require a deposit to book?",
            "answer": "Yes, we require a deposit to secure your booking slot as we schedule our master technicians to focus solely on your vehicle during its stay."
        },
        {
            "question": "What forms of payment do you accept?",
            "answer": "We accept all major credit cards, debit cards, bank transfers, and cash."
        },
        {
            "question": "What makes Vinyl different from the dealership?",
            "answer": "Premium vinyl wraps offer a wider variety of colors, textures, and finishes (like matte or satin) compared to factory dealership paint options, while also protecting the original clear coat underneath."
        },
        {
            "question": "Do you have insurance?",
            "answer": "Yes, we are fully insured, including comprehensive garagekeepers insurance to protect your vehicle while it is in our custody."
        }
    ]
    for faq in faqs_data:
        GeneralFAQ.objects.create(question=faq['question'], answer=faq['answer'])

    print("Creating Services...")
    services_data = [
        {
            "title": "Paint Protection Film",
            "slug": "paint-protection-film",
            "tag_line": "ULTIMATE SHIELD",
            "hero_description": "Engineered for the elite. Our self-healing PPF provides an invisible armor, preserving your vehicle's factory finish against the elements with unrivaled clarity and durability.",
            "manifesto_title": "THE ART OF THE INSTALL",
            "manifesto_description": "Experience the precision and care that goes into every micron of protection.",
            "standards_title": "UNCOMPROMISED STANDARDS IN EVERY MICRON",
            "standards_description": "Our technicians are master-certified installers, utilizing precision-cut templates tailored to your vehicle's specific make and model. We go beyond the surface, wrapping edges for a seamless, factory-fresh appearance that lasts for a decade.",
            "cta_text": "GET A BESPOKE QUOTE",
            "cta_link": "/contact",
            "features": [
                {"title": "Self-Healing Tech", "description": "Heat-activated polymers allow swirls and fine scratches to vanish before they ever touch your paint."},
                {"title": "Optical Clarity", "description": "Virtually invisible finish that enhances your paint's depth while protecting against UV oxidation and fading."},
                {"title": "Strain Resistance", "description": "Hydrophobic surface repels road tar, bird droppings, and industrial fallout for effortless maintenance."}
            ],
            "faqs": [
                {"question": "HOW LONG DOES THE INSTALLATION TAKE?", "answer": "Typical full-front protection requires 2-3 business days. A full vehicle wrap can take 5-7 days depending on the complexity and disassembly required for edge-wrapping."},
                {"question": "CAN IT BE APPLIED OVER CERAMIC COATINGS?", "answer": "PPF must be applied to the factory clear coat for proper adhesion. We recommend applying a ceramic coating *over* the film to maximize hydrophobic properties."},
                {"question": "WILL IT DAMAGE MY PAINT WHEN REMOVED?", "answer": "No. When removed by a professional using controlled heat, our high-grade films leave no residue and protect the original paint underneath perfectly."}
            ],
            "standard_items": [
                "Edge-wrapping for 99% invisible coverage",
                "Computer-aided precision cutting",
                "10-year manufacturer backed warranty"
            ],
            "before_afters": [
                {"title": "Paint Correction & Ceramic Coating"},
                {"title": "Full Body PPF Installation"}
            ]
        },
        {
            "title": "Ceramic Coating",
            "slug": "ceramic-coating",
            "tag_line": "NANO-CERAMIC PROTECTION",
            "hero_description": "Advanced nano-ceramic technology that bonds with your paint to create a durable, high-gloss layer of protection against the elements.",
            "manifesto_title": "THE ART OF THE INSTALL",
            "manifesto_description": "Experience the precision and care that goes into every micron of protection.",
            "standards_title": "UNCOMPROMISED STANDARDS IN EVERY MICRON",
            "standards_description": "Our technicians are master-certified installers, utilizing precision-cut templates tailored to your vehicle's specific make and model.",
            "cta_text": "GET A BESPOKE QUOTE",
            "cta_link": "/contact",
            "features": [
                {"title": "HYDROPHOBIC PROTECTION", "description": "Water and dirt repel instantly off your vehicle's surface."},
                {"title": "GLOSS ENHANCEMENT", "description": "Unmatched depth and clarity that keeps your car looking freshly detailed."},
                {"title": "DIRT RESISTANCE", "description": "Industrial fallout and contaminants wipe away easily."}
            ],
            "faqs": [
                {"question": "HOW LONG DOES CERAMIC COATING LAST?", "answer": "Our professional-grade coatings last from 3 to 9+ years depending on the level of package chosen and regular maintenance."}
            ],
            "standard_items": [
                "Multi-stage paint decontamination",
                "Paint correction prep work",
                "Infrared baking for maximum hardness"
            ],
            "before_afters": [
                {"title": "Single-stage paint correction"},
                {"title": "Gloss enhancement finish"}
            ]
        },
        {
            "title": "Window Tinting",
            "slug": "window-tint",
            "tag_line": "HEAT REJECTION",
            "hero_description": "Premium ceramic window tinting that filters out harmful UV rays and rejects intense heat, keeping your cabin cool and protecting your interior from fading.",
            "manifesto_title": "THE ART OF THE INSTALL",
            "manifesto_description": "Experience the precision and care that goes into every micron of protection.",
            "standards_title": "UNCOMPROMISED STANDARDS",
            "standards_description": "We use computer-cut templates to ensure a perfect fit for all windows, without any gaps or visible edges.",
            "cta_text": "GET A BESPOKE QUOTE",
            "cta_link": "/contact",
            "features": [
                {"title": "UV RAY PROTECTION", "description": "Blocks up to 99% of harmful ultraviolet rays, protecting your skin and interior."},
                {"title": "HEAT REJECTION", "description": "Ceramic technology provides maximum infrared heat rejection to keep your cabin cool."},
                {"title": "GLARE REDUCTION", "description": "Reduces sun glare and headlight glare at night for safer driving."}
            ],
            "faqs": [
                {"question": "HOW LONG AFTER TINTING CAN I ROLL DOWN MY WINDOWS?", "answer": "We recommend keeping your windows rolled up for 3-5 days to allow the adhesive to fully cure."}
            ],
            "standard_items": [
                "Micro-edge shaving for a factory finish",
                "One-piece rear window installation",
                "Lifetime warranty against bubbling or color change"
            ],
            "before_afters": [
                {"title": "Side Window Ceramic Tinting"},
                {"title": "Windshield Heat Rejection Glaze"}
            ]
        },
        {
            "title": "Vinyl Wrap",
            "slug": "vinyl-wrap",
            "tag_line": "COLOR CHANGE",
            "hero_description": "Transform the look of your vehicle completely with premium vinyl wraps, offering endless color choices and finishes while protecting your factory paint.",
            "manifesto_title": "THE ART OF THE INSTALL",
            "manifesto_description": "Experience the precision and care that goes into every micron of protection.",
            "standards_title": "UNCOMPROMISED STANDARDS",
            "standards_description": "Our wrap specialists disassemble trim, door handles, and headlights to ensure all edges are wrapped deep and seamlessly, showing absolutely no original paint.",
            "cta_text": "GET A BESPOKE QUOTE",
            "cta_link": "/contact",
            "features": [
                {"title": "COLOR CHANGE WRAPS", "description": "Choose from hundreds of premium colors, gloss, matte, satin, or metallic finishes."},
                {"title": "PAINT PROTECTION", "description": "Vinyl wraps offer a layer of physical protection against minor scratches and UV fading."},
                {"title": "REVERSIBLE TRANSFORMATION", "description": "Can be safely removed at any time to reveal the original, perfectly preserved factory paint."}
            ],
            "faqs": [
                {"question": "HOW DO I CARE FOR A WRAPPED VEHICLE?", "answer": "We recommend hand-washing only, using wrap-safe shampoos, and avoiding high-pressure washers close to wrapped edges."}
            ],
            "standard_items": [
                "Full exterior disassembly for seamless wrapping",
                "Premium vinyl brands (Avery, 3M, Inozetek)",
                "3-year workmanship warranty"
            ],
            "before_afters": [
                {"title": "Gloss to Matte Satin Wrap Transition"},
                {"title": "Full Vehicle Color Change"}
            ]
        }
    ]

    for data in services_data:
        s = Service.objects.create(
            title=data['title'],
            slug=data['slug'],
            tag_line=data['tag_line'],
            hero_description=data['hero_description'],
            manifesto_title=data['manifesto_title'],
            manifesto_description=data['manifesto_description'],
            standards_title=data['standards_title'],
            standards_description=data['standards_description'],
            cta_text=data['cta_text'],
            cta_link=data['cta_link']
        )
        for f in data['features']:
            ServiceFeature.objects.create(service=s, title=f['title'], description=f['description'])
        for faq in data['faqs']:
            ServiceFAQ.objects.create(service=s, question=faq['question'], answer=faq['answer'])
        for item in data['standard_items']:
            ServiceStandardItem.objects.create(service=s, text=item)
        for ba in data['before_afters']:
            ServiceBeforeAfter.objects.create(service=s, title=ba['title'])

    print("Database populated successfully with exact PDF-matching content!")

if __name__ == '__main__':
    populate_db()
