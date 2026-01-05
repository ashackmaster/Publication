// Environment Configuration
// Create a .env file in the root with these variables:
// VITE_EMAILJS_SERVICE_ID=your_service_id
// VITE_EMAILJS_TEMPLATE_ID=your_template_id
// VITE_EMAILJS_CONTACT_TEMPLATE_ID=your_contact_template_id
// VITE_EMAILJS_PUBLIC_KEY=your_public_key
// VITE_ADMIN_PASSWORD=dreampublication.001
// VITE_ADMIN_URL=/rh_ad_min_001

export const config = {
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_8kno9mk',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_e755u34',
    contactTemplateId: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || 'template_contact',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'WVOO_X_awSGcaSca3',
  },
  admin: {
    password: import.meta.env.VITE_ADMIN_PASSWORD || 'dreampublication.001',
    url: import.meta.env.VITE_ADMIN_URL || '/rh_ad_min_001',
  },
};
