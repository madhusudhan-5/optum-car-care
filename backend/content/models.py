from django.db import models

class HomePageConfig(models.Model):
    # Hero Section
    hero_title = models.CharField(max_length=200, default="Protect what you love.")
    hero_subtitle = models.TextField(default="Houston's trusted choice for premium auto care.")
    vehicles_protected = models.CharField(max_length=50, default="55,078")
    hero_image = models.ImageField(upload_to='content/hero/', blank=True, null=True)
    
    # Pain Points Section
    pain_points_title = models.CharField(max_length=200, default="Without the right team, the right products, and the right process, you're left dealing with:")
    
    # The Standard Section
    standard_title = models.CharField(max_length=200, default="You Want the Best for What Matters")
    standard_description = models.TextField()
    standard_image = models.ImageField(upload_to='content/standard/', blank=True, null=True)

    # About Us Section
    about_title = models.CharField(max_length=200, default="PREMIERE AUTOMOTIVE DETAILING")
    about_description = models.TextField()
    about_image_1 = models.ImageField(upload_to='content/about/', blank=True, null=True)
    about_image_2 = models.ImageField(upload_to='content/about/', blank=True, null=True)

    # Introduction / Pain Points Intro Section
    intro_title = models.CharField(max_length=200, default="You Want the Best for What Matters")
    intro_description = models.TextField(default="With Houston's unpredictable roads and intense heat, protection isn't optional—it's essential. That's why many vehicle owners want top-quality care for their cars and trucks. But finding a trusted expert to protect and maintain them can be challenging.")
    intro_image = models.ImageField(upload_to='content/intro/', blank=True, null=True)

    # Middle CTA Banner
    banner_cta_title = models.CharField(max_length=255, default="WHATEVER PROTECTION OR ENHANCEMENT YOUR VEHICLE NEEDS...")
    banner_cta_subtitle = models.CharField(max_length=255, default="We do it right the first time.")
    banner_image = models.ImageField(upload_to='content/banners/', blank=True, null=True)

    # Contact / Appointment Section
    contact_image = models.ImageField(upload_to='content/contact/', blank=True, null=True)

    # Partners Description
    partners_description = models.TextField(default="Pristine Detail is proud to be a certified installer in automotive paint protection film and window tinting along with vinyl wrapping and other services! By using some of the best products in the industry, we guarantee and standby our products and craftsmanship.")

    # SEO & Digital Marketing
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    meta_keywords = models.CharField(max_length=255, blank=True, null=True)
    
    # Stats
    stat_1_number = models.CharField(max_length=50, default="2,500+")
    stat_1_text = models.CharField(max_length=100, default="Cars Detailed")
    stat_2_number = models.CharField(max_length=50, default="8+")
    stat_2_text = models.CharField(max_length=100, default="Years of Experience")
    stat_3_number = models.CharField(max_length=50, default="30+")
    stat_3_text = models.CharField(max_length=100, default="Certified & Trusted Experts")

    address = models.CharField(max_length=255, default="4444 W 70th St, Edina, MN 55435")
    phone = models.CharField(max_length=50, default="651-706-9995")
    email = models.EmailField(default="info@optumcarcare.com")
    working_hours_mon_fri = models.CharField(max_length=150, default="10:00 AM to 6:00 PM (Appointment Only)")
    working_hours_sat = models.CharField(max_length=150, default="11:00 AM to 2:00 PM (Appointment Only)")
    working_hours_sun = models.CharField(max_length=150, default="Closed")

    # Dynamic Section Headers (Eyebrows and Titles)
    intro_eyebrow = models.CharField(max_length=200, default="You Want the Best for What Matters")
    services_eyebrow = models.CharField(max_length=200, default="Our Expertise")
    services_title = models.CharField(max_length=200, default="Mastery in Every Detail")
    services_description = models.TextField(default="From meticulous paint correction to cutting-edge ceramic protection, our comprehensive suite of services ensures your vehicle remains in concourse condition.")
    standard_eyebrow = models.CharField(max_length=200, default="The Standard")
    makes_eyebrow = models.CharField(max_length=200, default="Trusted By Owners Of")
    makes_title = models.CharField(max_length=200, default="World-Class Engineering")
    partners_eyebrow = models.CharField(max_length=200, default="Our Partners & Certified Installers")
    partners_title = models.CharField(max_length=200, default="Industry Standard Products")
    testimonials_eyebrow = models.CharField(max_length=200, default="Client Experiences")
    testimonials_title = models.CharField(max_length=200, default="Words From Our Patrons")
    faqs_eyebrow = models.CharField(max_length=200, default="Knowledge Base")
    faqs_title = models.CharField(max_length=200, default="Frequently Asked Questions")

    # Google Reviews
    review_count = models.CharField(max_length=20, default="205")
    review_rating = models.CharField(max_length=10, default="5.0")
    google_review_link = models.URLField(max_length=500, blank=True, null=True, help_text="Link to your Google Reviews page")

    # WhatsApp Specific
    whatsapp_number = models.CharField(max_length=50, blank=True, null=True, help_text="Override the default phone number for WhatsApp. Keep empty to use the main phone number.")

    def __str__(self):
        return "Home Page Configuration"

class PainPoint(models.Model):
    config = models.ForeignKey(HomePageConfig, related_name='pain_points', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text

class StandardItem(models.Model):
    config = models.ForeignKey(HomePageConfig, related_name='standard_items', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text

class AboutFeature(models.Model):
    config = models.ForeignKey(HomePageConfig, related_name='about_features', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text

class CuratedMake(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='content/makes/', blank=True, null=True)

    def __str__(self):
        return self.name

class BrandPartner(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='content/partners/', blank=True, null=True)

    def __str__(self):
        return self.name

class Testimonial(models.Model):
    author_name = models.CharField(max_length=100)
    author_avatar = models.ImageField(upload_to='content/avatars/', blank=True, null=True)
    date_posted = models.CharField(max_length=100)
    text = models.TextField()
    rating = models.IntegerField(default=5)

    def __str__(self):
        return self.author_name

class GeneralFAQ(models.Model):
    question = models.CharField(max_length=300)
    answer = models.TextField()

    def __str__(self):
        return self.question

class Promotion(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.ImageField(upload_to='content/promotions/', blank=True, null=True)

    def __str__(self):
        return self.title

class ProcessStep(models.Model):
    order = models.IntegerField(default=0)
    title = models.CharField(max_length=200)
    description = models.TextField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.order}: {self.title}"

class ProcessPageConfig(models.Model):
    hero_title = models.CharField(max_length=255, default="The best automotive spa experience at Optum Studio")
    hero_description = models.TextField(default="Optum Studio offers the highest level of detail and protection in Bengaluru. Our meticulous process ensures your vehicle receives the ultimate care, leaving it looking better than the day it left the showroom floor.")
    hero_video_url = models.URLField(default="https://cdn.pixabay.com/video/2021/08/04/83866-584733364_large.mp4")
    hero_image = models.ImageField(upload_to='content/process/', blank=True, null=True)

    def __str__(self):
        return "Process Page Configuration"

class StudioGalleryItem(models.Model):
    image = models.ImageField(upload_to='content/studio/', blank=True, null=True)
    alt_text = models.CharField(max_length=200)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.alt_text

class StudioExperienceConfig(models.Model):
    hero_title = models.CharField(max_length=200, default="Studio Experience")
    hero_subtitle = models.TextField(default="Where Automotive Perfection is Born")
    # Using a URL field to allow linking a YouTube/Vimeo/Cloud MP4 video instead of direct file uploads to save server space
    hero_video_url = models.URLField(default="https://cdn.pixabay.com/video/2021/08/04/83866-584733364_large.mp4")

    def __str__(self):
        return "Studio Experience Configuration"
