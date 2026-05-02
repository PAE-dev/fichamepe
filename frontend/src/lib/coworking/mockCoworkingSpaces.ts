/** Fotos Unsplash (licencia Unsplash): enlaces originales en la UI de cada card. */
export type CoworkingSpace = {
  id: string;
  name: string;
  district: string;
  address: string;
  areaLabel: string;
  capacity: string;
  priceHint: string;
  availability: string;
  /** URL de imagen para portada; se muestra con object-cover en altura fija. */
  coverImageUrl: string;
  /** Enlace a la ficha en Unsplash (atribución / ver original). */
  unsplashPhotoUrl: string;
  highlights: string[];
};

const unsplashImg = (path: string, w: number) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=${w}&q=80`;

const unsplashPlusImg = (path: string, w: number) =>
  `https://plus.unsplash.com/${path}?auto=format&fit=crop&w=${w}&q=80`;

export const mockCoworkingSpaces: CoworkingSpace[] = [
  {
    id: "miraflores-meeting-studio",
    name: "Meeting Studio Miraflores",
    district: "Miraflores",
    address: "Av. Jose Pardo 601, cerca al Parque Kennedy",
    areaLabel: "Zona centrica",
    capacity: "2 a 6 personas",
    priceHint: "Desde S/ 35 por hora",
    availability: "Salas disponibles hoy",
    coverImageUrl: unsplashImg("photo-1527192491265-7e15c55b1ed2", 960),
    unsplashPhotoUrl: "https://unsplash.com/es/fotos/personas-sentadas-frente-a-monitores-de-computadora-dZxQn4VEv2M",
    highlights: ["Sala privada", "Wi-Fi premium", "Cafe incluido"],
  },
  {
    id: "san-isidro-business-lounge",
    name: "Business Lounge San Isidro",
    district: "San Isidro",
    address: "Calle Las Begonias 415, zona financiera",
    areaLabel: "Ejecutivo",
    capacity: "2 a 8 personas",
    priceHint: "Desde S/ 45 por hora",
    availability: "Ideal para reuniones formales",
    coverImageUrl: unsplashPlusImg("premium_photo-1684769161054-2fa9a998dcb6", 960),
    unsplashPhotoUrl: "https://unsplash.com/es/fotos/un-grupo-de-personas-sentadas-alrededor-de-una-mesa-en-una-habitacion-3y_dY4vSXII",
    highlights: ["Recepcion", "Pizarra", "Privacidad"],
  },
  {
    id: "barranco-creative-hub",
    name: "Creative Hub Barranco",
    district: "Barranco",
    address: "Av. Grau 320, a pasos del Malecon",
    areaLabel: "Creativo",
    capacity: "2 a 5 personas",
    priceHint: "Desde S/ 30 por hora",
    availability: "Ambiente relajado para idear",
    coverImageUrl: unsplashImg("photo-1600508774634-4e11d34730e2", 960),
    unsplashPhotoUrl: "https://unsplash.com/es/fotos/mesa-de-madera-marron-con-sillas-VCoh27vHEh0",
    highlights: ["Espacio inspirador", "Zona cafe", "Pet friendly"],
  },
];
