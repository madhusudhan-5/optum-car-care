from django.db import models

class Service(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    tag_line = models.CharField(max_length=200, blank=True)
    hero_description = models.TextField()
    hero_image = models.ImageField(upload_to='services/hero/', blank=True, null=True)
    youtube_video_url = models.URLField(blank=True, null=True, help_text="YouTube URL to autoplay in the home page service card (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)")
    
    # Craft Manifesto
    manifesto_title = models.CharField(max_length=200, default="THE ART OF THE INSTALL")
    manifesto_description = models.TextField(blank=True)
    manifesto_media = models.ImageField(upload_to='services/manifesto/', blank=True, null=True)
    
    # Standards
    standards_title = models.CharField(max_length=200, default="UNCOMPROMISED STANDARDS IN EVERY MICRON")
    standards_description = models.TextField(blank=True)
    standards_image = models.ImageField(upload_to='services/standards/', blank=True, null=True)
    
    # CTA
    cta_text = models.CharField(max_length=100, default="GET A BESPOKE QUOTE")
    cta_link = models.CharField(max_length=200, default="/contact")

    # SEO & Digital Marketing
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    meta_keywords = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title

class ServiceFeature(models.Model):
    service = models.ForeignKey(Service, related_name='features', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='services/icons/', blank=True, null=True)

    def __str__(self):
        return f"{self.service.title} - {self.title}"

class ServiceBeforeAfter(models.Model):
    service = models.ForeignKey(Service, related_name='before_afters', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    before_image = models.ImageField(upload_to='services/before_after/', blank=True, null=True)
    after_image = models.ImageField(upload_to='services/before_after/', blank=True, null=True)

    def __str__(self):
        return f"{self.service.title} - {self.title}"

class ServiceFAQ(models.Model):
    service = models.ForeignKey(Service, related_name='faqs', on_delete=models.CASCADE)
    question = models.CharField(max_length=300)
    answer = models.TextField()

    def __str__(self):
        return f"{self.service.title} - {self.question}"

class ServiceStandardItem(models.Model):
    service = models.ForeignKey(Service, related_name='standard_items', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text

class ServicesPageConfig(models.Model):
    hero_title = models.CharField(max_length=255, default="Premium Car Protection Services.")
    hero_description = models.TextField(default="Discover our comprehensive range of high-end vehicle protection and detailing services designed to preserve your investment and elevate your driving experience.")
    
    def __str__(self):
        return "Services Page Configuration"
