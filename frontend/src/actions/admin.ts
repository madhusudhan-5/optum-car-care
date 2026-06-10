'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = 'http://127.0.0.1:8000/api';

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  return token?.value || null;
}

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  if (!token) return {};
  return {
    'Authorization': `Bearer ${token.value}`,
    'Content-Type': 'application/json',
  };
}

export async function updateHomeConfig(id: number, data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return { error: 'Unauthorized' };
    }

    const res = await fetch(`${API_URL}/content/home-config/${id}/`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    if (res.ok) {
      revalidatePath('/', 'layout');
      return { success: true };
    }

    const errData = await res.json();
    return { error: errData.detail || 'Failed to update home page configuration' };
  } catch (error) {
    return { error: 'Failed to connect to the server' };
  }
}

export async function updateProcessPageConfig(id: number, data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return { error: 'Unauthorized' };
    }

    const res = await fetch(`${API_URL}/content/process-config/${id}/`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    if (res.ok) {
      revalidatePath('/process');
      revalidatePath('/');
      return { success: true };
    }

    const errData = await res.json();
    return { error: errData.detail || 'Failed to update process page configuration' };
  } catch (error) {
    return { error: 'Failed to connect to the server' };
  }
}

// Upload image files for home config (uses multipart/form-data, not JSON)
export async function uploadHomeConfigImage(id: number, formData: FormData) {
  try {
    const token = await getAuthToken();
    if (!token) return { error: 'Unauthorized' };

    const res = await fetch(`${API_URL}/content/home-config/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Do NOT set Content-Type here — browser/Node will set it with multipart boundary automatically
      },
      body: formData,
    });

    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }

    const errText = await res.text();
    return { error: `Upload failed: ${errText}` };
  } catch (error) {
    return { error: 'Failed to connect to server for image upload' };
  }
}

// Upload image files for a specific service (multipart/form-data PATCH)
export async function uploadServiceImage(slug: string, formData: FormData) {
  try {
    const token = await getAuthToken();
    if (!token) return { error: 'Unauthorized' };

    const res = await fetch(`${API_URL}/services/${slug}/`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      revalidatePath('/services');
      revalidatePath(`/services/${slug}`);
      revalidatePath('/');
      return { success: true };
    }

    const errText = await res.text();
    return { error: `Upload failed: ${errText}` };
  } catch (error) {
    return { error: 'Failed to connect to server for image upload' };
  }
}

export async function createService(data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return { error: 'Unauthorized' };
    }

    // slug must be populated. If empty, generate from title
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const res = await fetch(`${API_URL}/services/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (res.ok) {
      revalidatePath('/');
      revalidatePath('/services');
      return { success: true };
    }

    const errData = await res.json();
    return { error: JSON.stringify(errData) || 'Failed to create service' };
  } catch (error) {
    return { error: 'Failed to connect to the server' };
  }
}

export async function updateService(slug: string, data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return { error: 'Unauthorized' };
    }

    const res = await fetch(`${API_URL}/services/${slug}/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (res.ok) {
      revalidatePath('/');
      revalidatePath('/services');
      revalidatePath(`/services/${slug}`);
      return { success: true, service: await res.json() };
    }

    const errData = await res.json();
    return { error: JSON.stringify(errData) || 'Failed to update service' };
  } catch (error) {
    return { error: 'Failed to connect to the server' };
  }
}

export async function deleteService(slug: string) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return { error: 'Unauthorized' };
    }

    const res = await fetch(`${API_URL}/services/${slug}/`, {
      method: 'DELETE',
      headers,
    });

    if (res.ok) {
      revalidatePath('/');
      revalidatePath('/services');
      revalidatePath(`/services/${slug}`);
      return { success: true };
    }

    return { error: 'Failed to delete service' };
  } catch (error) {
    return { error: 'Failed to connect to the server' };
  }
}

export async function createMake(formData: FormData) {
  try {
    const token = await getAuthToken();
    if (!token) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/makes/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }
    const errText = await res.text();
    return { error: `Failed to create make: ${errText}` };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function deleteMake(id: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/makes/${id}/`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }
    return { error: 'Failed to delete make' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function createPartner(formData: FormData) {
  try {
    const token = await getAuthToken();
    if (!token) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/partners/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }
    const errText = await res.text();
    return { error: `Failed to create partner: ${errText}` };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function deletePartner(id: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/partners/${id}/`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }
    return { error: 'Failed to delete partner' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function createTestimonial(data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/testimonials/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }
    return { error: 'Failed to create testimonial' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function updateTestimonial(id: number, data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/testimonials/${id}/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }
    return { error: 'Failed to update testimonial' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function deleteTestimonial(id: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/testimonials/${id}/`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }
    return { error: 'Failed to delete testimonial' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function createGeneralFAQ(data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/faqs/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }
    return { error: 'Failed to create FAQ' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function updateGeneralFAQ(id: number, data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/faqs/${id}/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }
    return { error: 'Failed to update FAQ' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function deleteGeneralFAQ(id: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/faqs/${id}/`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      revalidatePath('/');
      return { success: true };
    }
    return { error: 'Failed to delete FAQ' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function createProcessStep(data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/process/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      revalidatePath('/process');
      revalidatePath('/');
      return { success: true, data: await res.json() };
    }
    const errData = await res.json().catch(() => ({}));
    return { error: errData.detail || 'Failed to create process step' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function updateProcessStep(id: number, data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/process/${id}/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      revalidatePath('/process');
      revalidatePath('/');
      return { success: true, data: await res.json() };
    }
    const errData = await res.json().catch(() => ({}));
    return { error: errData.detail || 'Failed to update process step' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function deleteProcessStep(id: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/process/${id}/`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      revalidatePath('/process');
      revalidatePath('/');
      return { success: true };
    }
    return { error: 'Failed to delete process step' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function updateStudioConfig(data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `${API_URL}/content/studio-config/${data.id}/` : `${API_URL}/content/studio-config/`;
    
    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      revalidatePath('/studio-experience');
      return { success: true, data: await res.json() };
    }
    const errData = await res.json().catch(() => ({}));
    return { error: errData.detail || 'Failed to update studio config' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function uploadStudioGalleryImage(formData: FormData, id: number | null) {
  try {
    const token = await getAuthToken();
    if (!token) return { error: 'Unauthorized' };
    
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/content/studio-gallery/${id}/` : `${API_URL}/content/studio-gallery/`;

    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    if (res.ok) {
      revalidatePath('/studio-experience');
      return { success: true, data: await res.json() };
    }
    const errText = await res.text();
    return { error: `Upload failed: ${errText}` };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function deleteStudioGalleryImage(id: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/content/studio-gallery/${id}/`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      revalidatePath('/studio-experience');
      return { success: true };
    }
    return { error: 'Failed to delete image' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}

export async function uploadProcessConfigImage(id: number, formData: FormData) {
  try {
    const token = await getAuthToken();
    if (!token) return { error: 'Unauthorized' };
    
    const res = await fetch(`${API_URL}/content/process-config/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    
    if (res.ok) {
      revalidatePath('/process');
      revalidatePath('/admin-dashboard/process');
      return { success: true };
    }
    
    const errText = await res.text();
    return { error: `Upload failed: ${errText}` };
  } catch (error) {
    return { error: 'Connection failed' };
  }
}

export async function updateServicesPageConfig(id: number, data: any) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return { error: 'Unauthorized' };
    }

    const res = await fetch(`${API_URL}/services/config/${id}/`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    if (res.ok) {
      revalidatePath('/services');
      revalidatePath('/admin-dashboard/services');
      return { success: true };
    }

    const errData = await res.json();
    return { error: errData.detail || 'Failed to update services page configuration' };
  } catch (error) {
    return { error: 'Failed to connect to the server' };
  }
}

export async function createServiceBeforeAfter(formData: FormData) {
  try {
    const token = await getAuthToken();
    if (!token) return { error: 'Unauthorized' };
    
    const res = await fetch(`${API_URL}/services/before-afters/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    
    if (res.ok) {
      revalidatePath('/services');
      revalidatePath('/admin-dashboard/services');
      return { success: true };
    }
    
    const errText = await res.text();
    return { error: `Upload failed: ${errText}` };
  } catch (error) {
    return { error: 'Connection failed' };
  }
}

export async function deleteServiceBeforeAfter(id: number) {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) return { error: 'Unauthorized' };
    const res = await fetch(`${API_URL}/services/before-afters/${id}/`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      revalidatePath('/services');
      revalidatePath('/admin-dashboard/services');
      return { success: true };
    }
    return { error: 'Failed to delete slider' };
  } catch (e) {
    return { error: 'Connection failed' };
  }
}
