export const CONTACT = {
  phone1: "+91 94812 16648",
  phone2: "+91 89512 71759",
  email: "urbanfits.store4@gmail.com",
  // WhatsApp deep link uses the number with country code, no spaces/+.
  whatsappNumber: "919481216648",
};

export const whatsappLink = (message = "Hi! I'd like to know more about UrbanFits.") =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
